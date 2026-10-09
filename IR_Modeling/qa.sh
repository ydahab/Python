#!/bin/bash
N=$1; F=$(ls decks/IR_Module${N}_*.pptx); mkdir -p qa/$N; rm -f qa/$N/*
SK=$(ls -d /root/.claude/skills/synced/*/pptx)
python3 $SK/scripts/office/soffice.py --headless --convert-to pdf --outdir qa/$N "$F" >/dev/null 2>&1
pdftoppm -r 55 -png qa/$N/*.pdf qa/$N/s
python3 -I - <<PY
from PIL import Image
import glob
fs=sorted(glob.glob("qa/$N/s-*.png")); ims=[Image.open(f) for f in fs]; w,h=ims[0].size
for part in range(0,len(ims),6):
    sub=ims[part:part+6]; rows=(len(sub)+1)//2
    sheet=Image.new("RGB",(2*w,rows*h),"white")
    for i,im in enumerate(sub): sheet.paste(im,((i%2)*w,(i//2)*h))
    sheet.save(f"qa/$N/sheet{part//6+1}.png")
print(len(ims))
PY
