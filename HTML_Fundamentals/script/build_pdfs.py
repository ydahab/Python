#!/usr/bin/env python3
"""Convert the Arabic recording scripts (*.md) in this folder to RTL HTML and PDF (needs Playwright + Chromium)."""
import html, re, subprocess, sys, glob, os
HERE = os.path.dirname(os.path.abspath(__file__))
CSS = """@page{size:A4;margin:18mm}
body{font-family:'Noto Naskh Arabic','Noto Sans Arabic','DejaVu Sans',Arial,sans-serif;font-size:17pt;line-height:2;color:#0B1B2E}
h1{font-size:26pt;color:#0F5F5A;margin:0 0 6pt} h2{font-size:18pt;color:#0F5F5A;margin:22pt 0 2pt;break-after:avoid;border-bottom:1px solid #cfe0de;padding-bottom:2pt}
h3{font-size:16pt;margin-top:18pt} p{margin:2pt 0} .cue{color:#8a5a00;font-size:13pt;background:#fff3cf;padding:0 5pt;border-radius:4pt}
.p1{color:#14B8A6;font-weight:700;margin:0 3pt} .p2{color:#FF6B4A;font-weight:700;margin:0 3pt} code{font-family:Arial;direction:ltr;font-size:14pt;background:#e8f0ef;padding:0 3pt}
li{margin:3pt 0} hr{border:0;border-top:1px solid #cfe0de;margin:14pt 0}"""

def inline(t):
    t = html.escape(t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"\*(.+?)\*", r'<span class="cue">\1</span>', t)
    t = re.sub(r"`(.+?)`", r"<code>\1</code>", t)
    return t.replace("‖‖", '<span class="p2">‖‖</span>').replace("‖", '<span class="p1">‖</span>')

def to_html(md):
    out = []
    for line in md.split("\n"):
        if line.startswith("# "): out.append(f"<h1>{inline(line[2:])}</h1>")
        elif line.startswith("## "): out.append(f"<h2>{inline(line[3:])}</h2>")
        elif line.startswith("### "): out.append(f"<h3>{inline(line[4:])}</h3>")
        elif line.startswith("- "): out.append(f"<li>{inline(line[2:])}</li>")
        elif line.strip() == "---": out.append("<hr>")
        elif line.strip(): out.append(f"<p>{inline(line)}</p>")
    return f'<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><style>{CSS}</style><body>{chr(10).join(out)}</body></html>'

files = sorted(glob.glob(os.path.join(HERE, "Lesson*_script_ar.md")))
for f in files:
    open(f[:-3] + ".html", "w", encoding="utf-8").write(to_html(open(f, encoding="utf-8").read()))
js = """const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
(async()=>{const b=await chromium.launch();const p=await b.newPage();
for (const f of process.argv.slice(2)) { await p.goto("file://"+f+".html");
 await p.pdf({path:f+".pdf",format:"A4",printBackground:true,margin:{top:"16mm",bottom:"16mm",left:"16mm",right:"16mm"}}); console.log("pdf",f); }
await b.close()})()"""
tmp = os.path.join(HERE, ".pdf.js"); open(tmp, "w").write(js)
env = dict(os.environ, PLAYWRIGHT_PATH=os.environ.get("PLAYWRIGHT_PATH", "/opt/node22/lib/node_modules/playwright"))
r = subprocess.run(["node", tmp] + [f[:-3] for f in files], env=env, capture_output=True, text=True)
os.remove(tmp); print(r.stdout + r.stderr)
sys.exit(r.returncode)
