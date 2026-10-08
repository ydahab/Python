#!/usr/bin/env python3
"""Turn the recording scripts (script/LessonN_script_ar.md) into text that can be pasted or sent
straight to ElevenLabs: one clean .txt per slide, in two flavours.
  with_breaks/  Eleven Multilingual v2 (and Flash/Turbo): <break time="x.xs" /> tags for the pauses
  plain/        no tags (for v3 or any other model); pauses come from punctuation only
"""
import csv, json, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE.parent / "script"

# spoken forms for things a text-to-speech voice would read badly
SAY = [
    (r"@keyframes", "كي فريمز"), (r"@media", "ميديا"), (r"preserve-3d", "بريزيرف ثري دي"),
    (r"style\.css", "ستايل دوت سي إس إس"), (r"\blesson1\b", "درس واحد"), (r"\bff0000\b", "إف إف، صفر صفر صفر صفر"),
    (r"\bF12\b", "إف اتناشر"), (r"\bCtrl\b", "كنترول"), (r"\bShift\b", "شيفت"), (r"\bh1\b", "إتش وان"),
    (r"\bCSS\b", "سي إس إس"), (r"\bHTML\b", "إتش تي إم إل"), (r"\bID\b", "آي دي"), (r"\brgb\b", "آر جي بي"),
    (r"\bhsl\b", "إتش إس إل"), (r"\bfr\b", "إف آر"), (r"\bvh\b", "في إتش"), (r"\bef\b", "إي إف"),
    (r"\bGrid\b", "جريد"), (r"\bgrid\b", "جريد"),
]
SINGLE = {"a": "إيه", "A": "إيه", "b": "بي", "p": "بي", "M": "إم"}
PUNCT = "،.؟!:؛,…"

def speak(text, breaks):
    # drop stage directions; turn "stay silent" cues into real silence
    def cue(m):
        c = m.group(1)
        if "اسكت" in c:
            return " @@SILENCE@@ "
        return " "
    text = re.sub(r"\*\[([^\]]*)\]\*", cue, text)
    text = text.replace("**", "").replace("`", "")
    for pat, rep in SAY:
        text = re.sub(pat, rep, text)
    text = re.sub(r"(?<![A-Za-z0-9-])([aAbpM])(?![A-Za-z0-9-])", lambda m: SINGLE[m.group(1)], text)
    text = re.sub(r"[“”\"]", "", text)

    def pause(m):
        return " @@LONG@@ " if m.group(0) == "‖‖" else " @@SHORT@@ "
    text = re.sub(r"‖‖|‖", pause, text)
    # resolve markers
    out = []
    for tok in re.split(r"(@@\w+@@)", text):
        if tok == "@@SILENCE@@":
            out.append('<break time="2.5s" /> <break time="2.5s" /> ' if breaks else "… … … ")
        elif tok == "@@LONG@@":
            if breaks:
                out.append(' <break time="0.9s" /> ')
            else:
                prev = "".join(out).rstrip()
                out.append(" " if (not prev or prev[-1] in PUNCT + "…") else "… ")
        elif tok == "@@SHORT@@":
            # a short pause only needs a comma when the text has no punctuation there
            prev = "".join(out).rstrip()
            out.append(" " if (not prev or prev[-1] in PUNCT or prev.endswith("/>")) else "، ")
        else:
            out.append(tok)
    t = "".join(out)
    t = re.sub(r"\s+", " ", t)
    t = re.sub(r"\s+([،.؟!:؛])", r"\1", t)
    t = re.sub(r"(،\s*){2,}", "، ", t)
    t = t.replace("‏", "").strip()
    return t

def slides(md):
    parts = re.split(r"^## ", md, flags=re.M)[1:]
    for p in parts:
        head, _, body = p.partition("\n")
        m = re.match(r"الشريحة (\d+): (.*)", head.strip())
        yield int(m.group(1)), m.group(2), "\n".join(l for l in body.split("\n") if l.strip() and l.strip() != "---")

rows = []
for md_file in sorted(SRC.glob("Lesson*_script_ar.md")):
    n = int(re.search(r"Lesson(\d+)", md_file.name).group(1))
    for k, title, body in slides(md_file.read_text(encoding="utf-8")):
        for flavour, br in (("with_breaks", True), ("plain", False)):
            d = HERE / flavour / f"Lesson{n}"
            d.mkdir(parents=True, exist_ok=True)
            txt = speak(body.replace("\n", " "), br)
            (d / f"slide{k:02d}.txt").write_text(txt + "\n", encoding="utf-8")
            if br:
                rows.append({"lesson": n, "slide": k, "title": title, "characters": len(txt), "file": f"with_breaks/Lesson{n}/slide{k:02d}.txt", "text": txt})
(HERE / "manifest.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")
with open(HERE / "manifest.csv", "w", newline="", encoding="utf-8-sig") as f:
    w = csv.writer(f); w.writerow(["lesson", "slide", "title", "characters", "file"])
    for r in rows: w.writerow([r["lesson"], r["slide"], r["title"], r["characters"], r["file"]])
tot = {}
for r in rows: tot[r["lesson"]] = tot.get(r["lesson"], 0) + r["characters"]
print("slides:", len(rows), "characters per lesson:", tot, "total:", sum(tot.values()), "max slide:", max(r["characters"] for r in rows))
