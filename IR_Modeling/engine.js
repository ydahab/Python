// Slide engine for the "Information Retrieval Modeling" series (7 standalone modules).
const pptxgen = require("pptxgenjs");
const SKILL = "/root/.claude/skills/synced/8b72e933-ae1d-4574-8bbf-f199ff5f79b6_a5dbdf70-c986-449a-819e-83c2485e3871/pptx";
const { applyTheme } = require(SKILL + "/scripts/apply_theme.js");
const { addMotion } = require("./motion");

const THEME = {
  name: "Index Blue", headFontFace: "Arial", bodyFontFace: "Calibri",
  colors: { dk1: "0B1F3A", lt1: "FFFFFF", dk2: "1B4B8A", lt2: "EAF1FB", accent1: "1F7AE0", accent2: "F5A623", accent3: "12B5A6", accent4: "7B5CE0", accent5: "E5484D", accent6: "2FB170", hlink: "1F7AE0", folHlink: "7B5CE0" },
};
const W = 13.333, MX = 0.6, CW = W - 2 * MX;
const MATH = "Cambria Math";

function createDeck(M) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = `IR Modeling - Module ${M.n}: ${M.short}`;
  pres.author = "Information Retrieval Modeling series";
  const C = pres.SchemeColor, S = pres.ShapeType;
  const metas = [];
  const footerText = `Information Retrieval Modeling  |  Module ${M.n}: ${M.short}`;
  const ph = (name, type, o) => ({ placeholder: { options: { name, type, margin: 0, ...o }, text: "" } });
  pres.defineSlideMaster({ title: "TITLE", background: { color: C.text1 }, objects: [
    ph("title", "title", { x: 0.8, y: 2.0, w: 7.4, h: 2.2, fontSize: 44, bold: true, color: C.background1, align: "left", valign: "bottom" }),
    ph("sub", "body", { x: 0.8, y: 4.4, w: 7.0, h: 1.0, fontSize: 21, color: C.background2, align: "left", valign: "top" })] });
  const content = (title, bg, fg, sub) => ({ title, background: { color: bg }, objects: [
    ph("title", "title", { x: MX, y: 0.38, w: CW, h: 0.85, fontSize: 32, bold: true, color: fg, align: "left", valign: "middle" }),
    { rect: { x: MX, y: 1.25, w: 0.9, h: 0.07, fill: { color: C.accent2 } } },
    { text: { text: footerText, options: { x: MX, y: 6.98, w: 8, h: 0.3, fontSize: 11, color: sub, margin: 0, fontFace: "Calibri" } } }],
    slideNumber: { x: 12.1, y: 6.98, w: 0.63, h: 0.3, fontSize: 11, color: sub, align: "right" } });
  pres.defineSlideMaster(content("CONTENT", C.background1, C.text1, C.text2));
  pres.defineSlideMaster(content("DARK", C.text1, C.background1, C.background2));

  const an = (g, l) => `a${g}_${l}`;
  const shadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 2, angle: 90, opacity: 0.13 });
  const tx = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, fontFace: "Calibri", ...o });
  const newSlide = (layout, tr) => { const s = pres.addSlide({ masterName: layout }); metas.push({ transition: tr }); return s; };
  const title = (s, t) => s.addText(t, { placeholder: "title", objectName: an(1, "title") });
  const pal = [C.accent1, C.accent3, C.accent4, C.accent2, C.accent6, C.accent5];
  const darkTxt = (c) => c === C.accent2 || c === C.accent3 || c === C.accent6;
  const badge = (s, n, x, y, d, fill, g, fs = 15) => {
    s.addShape(S.ellipse, { x, y, w: d, h: d, fill: { color: fill }, objectName: an(g, "num") });
    tx(s, String(n), { x, y, w: d, h: d, align: "center", valign: "middle", bold: true, fontSize: fs, color: darkTxt(fill) ? C.text1 : C.background1, fontFace: "Arial", objectName: an(g, "numt") });
  };
  const callout = (s, { x, y, w, h, head, text, g, dark }) => {
    s.addShape(S.roundRect, { x, y, w, h, fill: { color: dark ? "16345C" : "FFF4DC" }, rectRadius: 0.1, objectName: an(g, "co") });
    s.addShape(S.rect, { x, y: y + 0.12, w: 0.07, h: h - 0.24, fill: { color: C.accent2 }, objectName: an(g, "co_bar") });
    tx(s, [{ text: head, options: { bold: true, color: dark ? C.accent2 : "8A5A00", fontSize: 14, breakLine: true } }, { text, options: { color: dark ? C.background1 : C.text1, fontSize: 16 } }],
      { x: x + 0.28, y: y + 0.1, w: w - 0.45, h: h - 0.2, valign: "top", objectName: an(g, "co_t") });
  };
  const T = {};

  T.title = (d) => {
    const s = newSlide("TITLE", "ripple");
    s.addShape(S.roundRect, { x: 0.8, y: 1.45, w: 2.7, h: 0.46, fill: { color: C.accent2 }, rectRadius: 0.23, objectName: an(1, "pill") });
    tx(s, `MODULE ${M.n} OF 7`, { x: 0.8, y: 1.45, w: 2.7, h: 0.46, fontSize: 14, bold: true, color: C.text1, align: "center", valign: "middle", charSpacing: 3, objectName: an(1, "pill_t") });
    s.addText(d.title, { placeholder: "title", objectName: an(2, "title") });
    s.addText(d.subtitle, { placeholder: "sub", objectName: an(3, "sub") });
    tx(s, d.meta, { x: 0.8, y: 5.55, w: 7, h: 0.4, fontSize: 15, color: C.accent3, objectName: an(4, "meta") });
    // postings-list motif
    const rows = [[3.2, C.accent1], [4.4, C.accent3], [2.4, C.accent4], [3.8, C.accent2], [2.9, C.accent6], [4.1, C.accent1]];
    rows.forEach(([w, c], i) => {
      const y = 1.5 + i * 0.78;
      s.addShape(S.roundRect, { x: 8.3, y, w: 1.2, h: 0.52, fill: { color: "16345C" }, line: { color: c, width: 1.5 }, rectRadius: 0.1, objectName: an(5 + i, "term") });
      s.addShape(S.roundRect, { x: 9.65, y, w: w * 0.85, h: 0.52, fill: { color: c, transparency: 15 }, rectRadius: 0.1, objectName: an(5 + i, "post") });
    });
    return s;
  };

  T.objectives = (d) => {
    const s = newSlide("CONTENT", "fade");
    title(s, "Learning objectives");
    tx(s, "After this module you will be able to:", { x: MX, y: 1.5, w: CW, h: 0.45, fontSize: 18, color: C.text2, bold: true, objectName: an(2, "lead") });
    d.items.forEach((t, i) => {
      const y = 2.2 + i * 1.12, g = 3 + i;
      s.addShape(S.roundRect, { x: MX, y, w: CW, h: 0.95, fill: { color: C.background2 }, rectRadius: 0.1, objectName: an(g, "row") });
      badge(s, i + 1, MX + 0.3, y + 0.2, 0.55, pal[i % 6], g, 18);
      tx(s, t, { x: MX + 1.15, y, w: CW - 1.5, h: 0.95, fontSize: 19, color: C.text1, valign: "middle", objectName: an(g, "obj") });
    });
    return s;
  };

  T.bullets = (d) => {
    const s = newSlide(d.dark ? "DARK" : "CONTENT", "push");
    title(s, d.title);
    const fg = d.dark ? C.background1 : C.text1;
    const w = d.why ? 7.6 : CW;
    const runs = [];
    d.items.forEach(([lead, body], i) => {
      runs.push({ text: lead ? lead + " " : "", options: { bold: true, color: d.dark ? C.accent2 : C.accent1, fontSize: 18, bullet: { code: "25A0" }, paraSpaceAfter: 0 } });
      runs.push({ text: body, options: { color: fg, fontSize: 18, breakLine: true, paraSpaceAfter: 11 } });
    });
    // bullets are drawn manually: one paragraph per item (lead + body in the same paragraph)
    const paras = d.items.map(([lead, body], i) => [
      { text: lead ? lead + " " : "", options: { bold: true, color: d.dark ? C.accent2 : C.accent1, fontSize: 21 } },
      { text: body, options: { color: fg, fontSize: 21, breakLine: i < d.items.length - 1 } }]).flat();
    tx(s, paras, { x: MX, y: 1.6, w, h: 5.1, valign: "top", paraSpaceAfter: 20, lineSpacingMultiple: 1.05, objectName: an(2, "body") });
    if (d.why) callout(s, { x: 8.55, y: 1.65, w: 4.18, h: d.whyH || 2.7, head: d.whyHead || "Why it matters", text: d.why, g: 3, dark: d.dark });
    return s;
  };

  T.equation = (d) => {
    const s = newSlide("CONTENT", "window");
    title(s, d.title);
    const eqH = d.eqH || 1.25;
    s.addShape(S.roundRect, { x: MX, y: 1.6, w: CW, h: eqH, fill: { color: C.text1 }, rectRadius: 0.12, shadow: shadow(), objectName: an(2, "eq") });
    tx(s, d.eq, { x: MX + 0.3, y: 1.6, w: CW - 0.6, h: eqH, fontSize: d.eqSize || 28, color: C.background1, fontFace: MATH, align: "center", valign: "middle", objectName: an(2, "eq_t") });
    const y0 = 1.6 + eqH + 0.3;
    tx(s, "Where", { x: MX, y: y0, w: 3, h: 0.35, fontSize: 15, bold: true, color: C.text2, objectName: an(3, "where") });
    const pitch = Math.min(0.62, (6.85 - y0 - 0.45) / d.terms.length);
    d.terms.forEach(([sym, mean], i) => {
      const y = y0 + 0.42 + i * pitch;
      s.addShape(S.roundRect, { x: MX, y, w: 1.35, h: pitch - 0.1, fill: { color: pal[i % 6] }, rectRadius: 0.08, objectName: an(3, "chip") });
      tx(s, sym, { x: MX, y, w: 1.35, h: pitch - 0.1, fontSize: 15, bold: true, fontFace: sym.length <= 3 ? MATH : "Calibri", color: darkTxt(pal[i % 6]) ? C.text1 : C.background1, align: "center", valign: "middle", objectName: an(3, "chip_t") });
      tx(s, mean, { x: MX + 1.5, y, w: 6.2, h: pitch - 0.1, fontSize: 14.5, color: C.text1, valign: "middle", objectName: an(3, "mean") });
    });
    if (d.why) callout(s, { x: 8.55, y: y0, w: 4.18, h: Math.min(6.85 - y0, 3.3), head: d.whyHead || "Intuition", text: d.why, g: 4 });
    return s;
  };

  T.steps = (d) => {
    const s = newSlide("CONTENT", "conveyor");
    title(s, d.title);
    const n = d.items.length, gap = 0.25, w = (CW - gap * (n - 1)) / n;
    const h = d.foot ? 3.7 : 4.9;
    d.items.forEach(([head, body], i) => {
      const x = MX + i * (w + gap), g = 2 + i;
      s.addShape(S.roundRect, { x, y: 1.65, w, h, fill: { color: C.background2 }, rectRadius: 0.1, shadow: shadow(), objectName: an(g, "card") });
      s.addShape(S.rect, { x: x + 0.25, y: 1.65, w: 0.8, h: 0.08, fill: { color: pal[i % 6] }, objectName: an(g, "bar") });
      badge(s, i + 1, x + 0.25, 1.95, 0.55, pal[i % 6], g, 18);
      tx(s, head, { x: x + 0.25, y: 2.7, w: w - 0.5, h: 0.75, fontSize: 18, bold: true, color: C.text1, valign: "top", objectName: an(g, "head") });
      tx(s, body, { x: x + 0.25, y: 3.5, w: w - 0.5, h: h - 2.0, fontSize: 16, color: C.text1, valign: "top", objectName: an(g, "body") });
    });
    if (d.foot) callout(s, { x: MX, y: 5.6, w: CW, h: 1.15, head: d.footHead || "Example", text: d.foot, g: 8 });
    return s;
  };

  T.table = (d) => {
    const s = newSlide(d.dark ? "DARK" : "CONTENT", "doors");
    title(s, d.title);
    const hdr = d.cols.map((c) => ({ text: c, options: { bold: true, color: C.background1, fill: { color: C.text2 }, fontSize: 16, fontFace: "Calibri" } }));
    const rows = d.rows.map((r, ri) => r.map((c, ci) => ({ text: String(c), options: { color: C.text1, fill: { color: ri % 2 ? C.background1 : C.background2 }, fontSize: d.fs || 17, bold: ci === 0, fontFace: d.mono && ci > 0 ? MATH : "Calibri" } })));
    const colW = d.colW || d.cols.map(() => CW / d.cols.length);
    const rowH = d.rowH || 0.56;
    s.addTable([hdr, ...rows], { x: MX, y: 1.6, w: CW, colW, rowH, border: { type: "solid", color: "C9D8EE", pt: 0.75 }, margin: [0.07, 0.12, 0.07, 0.12], valign: "middle", autoPage: false, objectName: an(2, "table") });
    if (d.note) callout(s, { x: MX, y: 1.6 + (d.rows.length + 1) * rowH + 0.4, w: CW, h: d.noteH || 1.15, head: d.noteHead || "Note", text: d.note, g: 3 });
    return s;
  };

  T.flow = (d) => {
    const s = newSlide("CONTENT", "prism");
    title(s, d.title);
    const lanes = d.lanes;
    const laneH = d.laneH || 1.55;
    lanes.forEach((ln, li) => {
      const y = 1.65 + li * (laneH + 0.45), g = 2 + li * 2;
      tx(s, ln.label, { x: MX, y, w: CW, h: 0.32, fontSize: 15, bold: true, color: C.text2, objectName: an(g, "lane") });
      const n = ln.boxes.length, gap = 0.45, w = (CW - gap * (n - 1)) / n;
      ln.boxes.forEach(([head, sub], i) => {
        const x = MX + i * (w + gap), yy = y + 0.4;
        s.addShape(S.roundRect, { x, y: yy, w, h: laneH - 0.35, fill: { color: pal[(i + li * 2) % 6] }, rectRadius: 0.1, shadow: shadow(), objectName: an(g + 1, "box") });
        tx(s, [{ text: head, options: { bold: true, fontSize: 16, breakLine: true } }, { text: sub, options: { fontSize: 12.5 } }], { x: x + 0.12, y: yy, w: w - 0.24, h: laneH - 0.35, align: "center", valign: "middle", color: darkTxt(pal[(i + li * 2) % 6]) ? C.text1 : C.background1, objectName: an(g + 1, "box_t") });
        if (i < n - 1) s.addShape(S.rightArrow, { x: x + w + 0.06, y: yy + (laneH - 0.35) / 2 - 0.15, w: 0.33, h: 0.3, fill: { color: C.text2 }, objectName: an(g + 1, "arrow") });
      });
    });
    if (d.note) callout(s, { x: MX, y: 1.65 + lanes.length * (laneH + 0.45) + (d.noteGap || 0), w: CW, h: d.noteH || 1.1, head: d.noteHead || "Why it matters", text: d.note, g: 9 });
    return s;
  };

  T.compare = (d) => {
    const s = newSlide("CONTENT", "vortex");
    title(s, d.title);
    const n = d.cols.length, gap = 0.3, w = (CW - gap * (n - 1)) / n;
    d.cols.forEach((c, i) => {
      const x = MX + i * (w + gap), g = 2 + i;
      s.addShape(S.roundRect, { x, y: 1.65, w, h: d.h || 4.0, fill: { color: C.background2 }, rectRadius: 0.1, shadow: shadow(), objectName: an(g, "card") });
      s.addShape(S.roundRect, { x: x + 0.25, y: 1.9, w: w - 0.5, h: 0.5, fill: { color: pal[i % 6] }, rectRadius: 0.1, objectName: an(g, "chip") });
      tx(s, c.head, { x: x + 0.25, y: 1.9, w: w - 0.5, h: 0.5, fontSize: 16, bold: true, color: darkTxt(pal[i % 6]) ? C.text1 : C.background1, align: "center", valign: "middle", objectName: an(g, "chip_t") });
      tx(s, c.items.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < c.items.length - 1, paraSpaceAfter: 7 } })), { x: x + 0.25, y: 2.6, w: w - 0.5, h: (d.h || 4.0) - 1.1, fontSize: 16.5, color: C.text1, valign: "top", objectName: an(g, "items") });
    });
    if (d.note) callout(s, { x: MX, y: 1.65 + (d.h || 4.0) + 0.25, w: CW, h: 6.85 - (1.65 + (d.h || 4.0) + 0.25), head: d.noteHead || "Why it matters", text: d.note, g: 7 });
    return s;
  };

  T.funnel = (d) => {
    const s = newSlide("CONTENT", "window");
    title(s, d.title);
    const n = d.stages.length, h = 0.88, gap = 0.12;
    d.stages.forEach(([name, count, desc], i) => {
      const w = 7.4 - i * (4.6 / Math.max(1, n - 1)) * 0.9, y = 1.6 + i * (h + gap), g = 2 + i;
      const x = MX + (7.4 - w) / 2;
      s.addShape(S.roundRect, { x, y, w, h, fill: { color: pal[i % 6] }, rectRadius: 0.1, objectName: an(g, "stage") });
      tx(s, [{ text: name, options: { bold: true, fontSize: 16, breakLine: true } }, { text: count, options: { fontSize: 14 } }], { x, y, w, h, align: "center", valign: "middle", color: darkTxt(pal[i % 6]) ? C.text1 : C.background1, objectName: an(g, "stage_t") });
      tx(s, desc, { x: 8.4, y, w: 4.33, h, fontSize: 14, color: C.text1, valign: "middle", objectName: an(g, "desc") });
    });
    if (d.note) callout(s, { x: MX, y: 1.6 + n * (h + gap) + 0.1, w: CW, h: 6.85 - (1.6 + n * (h + gap) + 0.1), head: d.noteHead || "Why it matters", text: d.note, g: 9 });
    return s;
  };

  T.takeaways = (d) => {
    const s = newSlide("DARK", "ripple");
    title(s, "Key takeaways");
    d.items.forEach((t, i) => {
      const y = 1.6 + i * 0.98, g = 2 + i;
      s.addShape(S.ellipse, { x: MX, y: y + 0.12, w: 0.5, h: 0.5, fill: { color: C.accent6 }, objectName: an(g, "dot") });
      tx(s, "✓", { x: MX, y: y + 0.12, w: 0.5, h: 0.5, align: "center", valign: "middle", bold: true, fontSize: 18, color: C.text1, fontFace: "Arial", objectName: an(g, "tick") });
      tx(s, t, { x: MX + 0.75, y, w: 7.0, h: 0.85, fontSize: 16.5, color: C.background1, valign: "middle", objectName: an(g, "pt") });
    });
    s.addShape(S.roundRect, { x: 8.7, y: 1.6, w: 4.03, h: 3.9, fill: { color: "16345C" }, rectRadius: 0.14, objectName: an(8, "next") });
    tx(s, [{ text: "Up next", options: { bold: true, color: C.accent2, fontSize: 20, breakLine: true } }, { text: d.next, options: { color: C.background1, fontSize: 16, breakLine: true } }, { text: " ", options: { fontSize: 8, breakLine: true } },
      { text: "Check yourself", options: { bold: true, color: C.accent3, fontSize: 16, breakLine: true } }, { text: d.check, options: { color: C.background2, fontSize: 14.5 } }],
      { x: 9.0, y: 1.85, w: 3.45, h: 4.4, valign: "top", objectName: an(9, "next_t") });
    return s;
  };

  return { T, metas, async save(file) { await pres.writeFile({ fileName: file }); await addMotion(file, metas); await applyTheme(file, THEME); } };
}
module.exports = { createDeck };
