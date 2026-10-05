// Convert the Arabic recording scripts (Lesson*_script_ar.md) to RTL Word documents.
const fs = require("fs"), path = require("path");
const D = require("docx");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Footer, PageNumber, BorderStyle, LevelFormat } = D;

const FONT = "Arial", INK = "0B1B2E", TEAL = "0F5F5A", MARK1 = "14B8A6", MARK2 = "E4572E";

// Split a line into styled runs: *cue*, **bold**, `code`, ‖‖ (long pause), ‖ (short pause)
function runs(text, base = {}) {
  const out = [];
  const re = /(\*\*.+?\*\*)|(\*.+?\*)|(`.+?`)|(‖‖)|(‖)/g;
  let last = 0, m;
  const add = (t, o = {}) => t && out.push(new TextRun({ text: t, font: FONT, rightToLeft: true, color: INK, size: 30, ...base, ...o }));
  while ((m = re.exec(text))) {
    add(text.slice(last, m.index));
    if (m[1]) add(m[0].slice(2, -2), { bold: true });
    else if (m[2]) add(" " + m[0].slice(1, -1) + " ", { size: 24, color: "8A5A00", shading: { type: D.ShadingType.CLEAR, fill: "FFF3CF", color: "auto" } });
    else if (m[3]) out.push(new TextRun({ text: m[0].slice(1, -1), font: "Courier New", size: 26, color: INK, shading: { type: D.ShadingType.CLEAR, fill: "E8F0EF", color: "auto" } }));
    else if (m[4]) add(" // ", { bold: true, color: MARK2 });
    else add(" / ", { bold: true, color: MARK1 });
    last = m.index + m[0].length;
  }
  add(text.slice(last));
  return out;
}

function convert(file) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const kids = [];
  const rtl = { bidirectional: true, alignment: AlignmentType.START };
  for (const line of lines) {
    if (line.startsWith("# ")) {
      kids.push(new Paragraph({ ...rtl, heading: HeadingLevel.HEADING_1, spacing: { after: 160 }, children: runs(line.slice(2), { size: 48, bold: true, color: TEAL }) }));
    } else if (line.startsWith("## ")) {
      kids.push(new Paragraph({ ...rtl, heading: HeadingLevel.HEADING_2, keepNext: true, spacing: { before: 360, after: 80 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "CFE0DE", space: 2 } }, children: runs(line.slice(3), { size: 34, bold: true, color: TEAL }) }));
    } else if (line.startsWith("### ")) {
      kids.push(new Paragraph({ ...rtl, heading: HeadingLevel.HEADING_3, spacing: { before: 320, after: 80 }, children: runs(line.slice(4), { size: 32, bold: true }) }));
    } else if (line.startsWith("- ")) {
      kids.push(new Paragraph({ ...rtl, numbering: { reference: "bul", level: 0 }, spacing: { after: 80, line: 360 }, children: runs(line.slice(2)) }));
    } else if (line.trim() === "---") {
      kids.push(new Paragraph({ spacing: { before: 80, after: 80 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "CFE0DE", space: 1 } }, children: [] }));
    } else if (line.trim()) {
      if (line.startsWith("**علامات القراءة:**")) {
        const r = (t, o = {}) => new TextRun({ text: t, font: FONT, rightToLeft: true, color: INK, size: 28, ...o });
        kids.push(new Paragraph({ ...rtl, spacing: { after: 120, line: 400 }, children: [
          r("علامات القراءة: ", { bold: true }), r(" / ", { bold: true, color: MARK1 }), r(" وقفة قصيرة  ·  "),
          r(" // ", { bold: true, color: MARK2 }), r(" وقفة أطول (استنى الشريحة تتحرك)  ·  "),
          r(" [بين قوسين] ", { size: 24, color: "8A5A00", shading: { type: D.ShadingType.CLEAR, fill: "FFF3CF", color: "auto" } }), r(" تعليمات أداء، مش بتتقال") ] }));
      } else {
        kids.push(new Paragraph({ ...rtl, spacing: { after: 60, line: 400 }, children: runs(line) }));
      }
    }
  }
  const doc = new Document({
    creator: "HTML Fundamentals Course",
    title: path.basename(file, ".md"),
    styles: { default: { document: { run: { font: FONT, size: 30 } } } },
    numbering: { config: [{ reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.START, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] }] },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "HTML Fundamentals  ·  ", font: FONT, size: 18, color: TEAL }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: TEAL })] })] }) },
      children: kids,
    }],
  });
  const out = file.replace(/\.md$/, ".docx");
  return Packer.toBuffer(doc).then((b) => { fs.writeFileSync(out, b); console.log("wrote", path.basename(out)); });
}

(async () => {
  const dir = __dirname;
  for (const f of fs.readdirSync(dir).filter((f) => /^Lesson\d_script_ar\.md$/.test(f)).sort()) await convert(path.join(dir, f));
})();
