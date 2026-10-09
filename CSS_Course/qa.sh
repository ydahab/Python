#!/bin/bash
# usage: qa.sh N  -> renders deck N to qa/N/s-*.png and a contact sheet
export NODE_PATH=/home/user/Python/HTML_Fundamentals/node_modules
N=$1
F=$(ls ${DECKS:-decks}/CSS_Lesson${N}_*.pptx)
mkdir -p ${QA:-qa}/$N && rm -f ${QA:-qa}/$N/*
SK=$(ls -d /root/.claude/skills/synced/*/pptx)
python3 $SK/scripts/office/soffice.py --headless --convert-to pdf --outdir ${QA:-qa}/$N "$F" >/dev/null 2>&1
pdftoppm -r 55 -png ${QA:-qa}/$N/*.pdf ${QA:-qa}/$N/s
python3 -I - <<PY
from PIL import Image
import glob
fs=sorted(glob.glob("${QA:-qa}/$N/s-*.png"))
ims=[Image.open(f) for f in fs]
w,h=ims[0].size
cols=3
for part in range(0,len(ims),6):
    sub=ims[part:part+6]
    rows=(len(sub)+cols-1)//cols
    sheet=Image.new("RGB",(cols*w,rows*h),"white")
    for i,im in enumerate(sub): sheet.paste(im,((i%cols)*w,(i//cols)*h))
    sheet.save(f"${QA:-qa}/$N/sheet{part//6+1}.png")
print(len(ims),"slides",w,h)
PY
