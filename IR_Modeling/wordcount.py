import zipfile,re,glob,sys
for f in sorted(glob.glob('decks/*.pptx')):
    z=zipfile.ZipFile(f); tot=0; per=[]
    sl=sorted([n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$',n)],key=lambda n:int(re.findall(r'\d+',n)[0]))
    for n in sl:
        x=z.read(n).decode('utf8')
        paras=re.findall(r'<a:p>.*?</a:p>',x,flags=re.S)
        t=' '.join(''.join(re.findall(r'<a:t>(.*?)</a:t>',p)) for p in paras)
        w=len(t.split()); per.append(w); tot+=w
    print(f.split('/')[-1], tot, per)
