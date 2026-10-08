import sys
from PIL import Image
n=sys.argv[1]; idx=[int(x) for x in sys.argv[2].split(",")]
ims=[Image.open(f'qa/{n}/s-{i:02d}.png') for i in idx]
w,h=ims[0].size
s=Image.new('RGB',(2*w,((len(ims)+1)//2)*h),'white')
for i,im in enumerate(ims): s.paste(im,((i%2)*w,(i//2)*h))
s.save(f'qa/{n}/chk.png')
