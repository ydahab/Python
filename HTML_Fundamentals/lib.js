// Shared design system + slide builders for the HTML Fundamentals decks.
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");

const SKILL = "/root/.claude/skills/synced/8b72e933-ae1d-4574-8bbf-f199ff5f79b6_a5dbdf70-c986-449a-819e-83c2485e3871/pptx";
const { applyTheme } = require(SKILL + "/scripts/apply_theme.js");
const { addMotion } = require("./motion");

// ---------- Theme: "Nile Code" - deep navy ink, Nile teal, sun gold ----------
const THEME = {
  name: "Nile Code",
  headFontFace: "Arial",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "0B1B2E", lt1: "FFFFFF", dk2: "0F5F5A", lt2: "E8F0EF",
    accent1: "14B8A6", accent2: "F5B301", accent3: "FF6B4A",
    accent4: "8C92FF", accent5: "4ADE80", accent6: "38BDF8",
    hlink: "0F5F5A", folHlink: "8C92FF",
  },
};
const HEX = THEME.colors;
const CODE_FONT = "Courier New";
const W = 13.333;
const MX = 0.6;
const CW = W - 2 * MX; // content width 12.13

// ---------- Icons ----------
const ICON_NAMES = [
  "FaCode", "FaGlobe", "FaPaintBrush", "FaBolt", "FaServer", "FaDesktop", "FaFileCode", "FaPen",
  "FaSave", "FaLink", "FaImage", "FaListUl", "FaListOl", "FaTable", "FaKeyboard", "FaCheckCircle",
  "FaQuestionCircle", "FaLightbulb", "FaRocket", "FaStar", "FaBook", "FaHeading", "FaParagraph",
  "FaBold", "FaFolderOpen", "FaMousePointer", "FaMapMarkerAlt", "FaBullseye", "FaTrophy", "FaClock",
  "FaSitemap", "FaCommentDots", "FaEdit", "FaCompass", "FaTools", "FaGraduationCap", "FaPuzzlePiece",
  "FaPaperPlane", "FaSearch", "FaLayerGroup", "FaHome", "FaBroom", "FaEye", "FaUniversalAccess",
  "FaIndent", "FaTags", "FaArrowRight", "FaHandPointRight", "FaUsers", "FaFlagCheckered", "FaWpforms",
];
const ICON_COLORS = [HEX.dk1, HEX.lt1, HEX.accent5, HEX.accent2];
const iconCache = {};
async function prerenderIcons() {
  const missing = ICON_NAMES.filter((n) => !fa[n]);
  if (missing.length) throw new Error("Missing icons: " + missing.join(", "));
  for (const n of ICON_NAMES) {
    for (const c of ICON_COLORS) {
      const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(fa[n], { color: "#" + c, size: "256" }));
      const buf = await sharp(Buffer.from(svg)).png().toBuffer();
      iconCache[n + c] = "image/png;base64," + buf.toString("base64");
    }
  }
}
const icon = (name, color = HEX.dk1) => {
  const d = iconCache[name + color];
  if (!d) throw new Error("icon not cached " + name + color);
  return d;
};

// ---------- Code highlighter ----------
function highlight(line, C, fs, base = {}) {
  const re = /(<!--.*?-->)|(<\/?[A-Za-z!][A-Za-z0-9]*)|(\/?>)|([A-Za-z-]+)(?==")|("[^"]*")/g;
  const o = (color) => ({ fontFace: CODE_FONT, fontSize: fs, color, ...base });
  const runs = [];
  let last = 0, m;
  while ((m = re.exec(line))) {
    if (m.index > last) runs.push({ text: line.slice(last, m.index), options: o(C.background1) });
    const color = m[1] ? C.accent6 : m[2] || m[3] ? C.accent3 : m[4] ? C.accent2 : C.accent5;
    runs.push({ text: m[0], options: o(color) });
    last = m.index + m[0].length;
  }
  if (last < line.length) runs.push({ text: line.slice(last), options: o(C.background1) });
  if (!runs.length) runs.push({ text: " ", options: o(C.background1) });
  runs[runs.length - 1].options.breakLine = true;
  return runs;
}

// ---------- Deck factory ----------
function createDeck(lesson) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = `HTML Fundamentals - ${lesson.short}`;
  pres.subject = "HTML for school students";
  pres.author = "HTML Fundamentals Course";
  const C = pres.SchemeColor;
  const S = pres.ShapeType;
  const metas = []; // per-slide transition choice
  let section = "Opening";
  pres.addSection({ title: section });
  let animGroup = 0;

  const footer = (color) => ({
    text: { text: `HTML Fundamentals  |  ${lesson.short}`, options: { x: MX, y: 6.98, w: 7, h: 0.3, fontSize: 11, color, margin: 0, fontFace: THEME.bodyFontFace } },
  });
  const ph = (name, type, o, text = "") => ({ placeholder: { options: { name, type, margin: 0, ...o }, text } });

  pres.defineSlideMaster({
    title: "TITLE", background: { color: C.text1 },
    objects: [
      ph("title", "title", { x: 0.8, y: 2.25, w: 8.3, h: 2.0, fontSize: 54, bold: true, color: C.background1, align: "left", valign: "bottom" }),
      ph("sub", "body", { x: 0.8, y: 4.4, w: 7.6, h: 0.9, fontSize: 22, color: C.background2, align: "left", valign: "top" }),
    ],
  });
  pres.defineSlideMaster({
    title: "SECTION", background: { color: C.text2 },
    objects: [
      ph("title", "title", { x: 4.3, y: 2.3, w: 8.4, h: 1.5, fontSize: 46, bold: true, color: C.background1, align: "left", valign: "bottom" }),
      ph("sub", "body", { x: 4.3, y: 3.95, w: 8.4, h: 0.8, fontSize: 22, color: C.background2, align: "left", valign: "top" }),
    ],
  });
  pres.defineSlideMaster({
    title: "CONTENT", background: { color: C.background1 },
    objects: [
      ph("title", "title", { x: MX, y: 0.4, w: CW, h: 1.0, fontSize: 36, bold: true, color: C.text1, align: "left", valign: "middle" }),
      footer(C.text2),
    ],
    slideNumber: { x: 12.1, y: 6.98, w: 0.63, h: 0.3, fontSize: 11, color: C.text2, align: "right" },
  });
  pres.defineSlideMaster({
    title: "DARKCONTENT", background: { color: C.text1 },
    objects: [
      ph("title", "title", { x: MX, y: 0.4, w: CW, h: 1.0, fontSize: 36, bold: true, color: C.background1, align: "left", valign: "middle" }),
      footer(C.background2),
    ],
    slideNumber: { x: 12.1, y: 6.98, w: 0.63, h: 0.3, fontSize: 11, color: C.background2, align: "right" },
  });

  // ----- tiny helpers -----
  const an = (g, label) => `a${g}_${label}`; // auto-play group
  const ak = (g, label) => `k${g}_${label}`; // on-click group
  const shadow = () => ({ type: "outer", color: "000000", blur: 10, offset: 3, angle: 90, opacity: 0.14 });
  const tx = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, fontFace: THEME.bodyFontFace, ...o });
  const newSlide = (layout, transition, notes) => {
    const s = pres.addSlide({ masterName: layout, sectionTitle: section });
    metas.push({ transition });
    if (notes) s.addNotes(notes);
    return s;
  };
  const title = (s, text) => s.addText(text, { placeholder: "title" });
  const palette = [C.accent1, C.accent2, C.accent6, C.accent3, C.accent4, C.accent5];

  function iconCircle(s, name, x, y, d, fill, g, fg = HEX.dk1) {
    s.addShape(S.ellipse, { x, y, w: d, h: d, fill: { color: fill }, objectName: an(g, "ico_bg") });
    s.addImage({ data: icon(name, fg), x: x + d * 0.27, y: y + d * 0.27, w: d * 0.46, h: d * 0.46, objectName: an(g, "ico_img") });
  }

  function codeBox(s, { x, y, w, h, lines, fs = 16, file = "index.html", g }) {
    s.addShape(S.roundRect, { x, y, w, h, fill: { color: C.text1 }, rectRadius: 0.14, shadow: shadow(), objectName: an(g, "code") });
    [C.accent3, C.accent2, C.accent5].forEach((c, i) =>
      s.addShape(S.ellipse, { x: x + 0.28 + i * 0.26, y: y + 0.24, w: 0.15, h: 0.15, fill: { color: c }, objectName: an(g, "code_dot") }));
    tx(s, file, { x: x + 1.2, y: y + 0.16, w: w - 1.5, h: 0.3, fontSize: 13, color: C.background2, fontFace: CODE_FONT, align: "right", objectName: an(g, "code_file") });
    const runs = lines.flatMap((l) => highlight(l, C, fs));
    tx(s, runs, { x: x + 0.32, y: y + 0.65, w: w - 0.5, h: h - 0.8, valign: "top", objectName: an(g, "code_text") });
  }

  function browser(s, { x, y, w, h, url, g }) {
    const top = 0.46;
    s.addShape(S.rect, { x, y, w, h, fill: { color: C.background1 }, shadow: shadow(), objectName: an(g, "browser") });
    s.addShape(S.rect, { x, y, w, h: top, fill: { color: C.background2 }, objectName: an(g, "browser_bar") });
    [C.accent3, C.accent2, C.accent5].forEach((c, i) =>
      s.addShape(S.ellipse, { x: x + 0.22 + i * 0.24, y: y + 0.16, w: 0.14, h: 0.14, fill: { color: c }, objectName: an(g, "browser_dot") }));
    s.addShape(S.roundRect, { x: x + 1.05, y: y + 0.08, w: w - 1.35, h: 0.3, fill: { color: C.background1 }, rectRadius: 0.1, objectName: an(g, "browser_url") });
    tx(s, url, { x: x + 1.2, y: y + 0.08, w: w - 1.6, h: 0.3, fontSize: 12, color: C.text2, valign: "middle", fontFace: CODE_FONT, objectName: an(g, "browser_urltext") });
    return { cx: x + 0.35, cy: y + top + 0.22, cw: w - 0.7, ch: h - top - 0.4 };
  }

  const pr = (text, o = {}) => ({ text, options: { color: C.text1, fontSize: 16, breakLine: true, ...o } });

  function notesList(s, { x, y, w, items, rowH, pitch, chipW, g0, fs = 16 }) {
    items.forEach((it, i) => {
      const g = g0 + i;
      const yy = y + i * pitch;
      s.addShape(S.roundRect, { x, y: yy, w: chipW, h: Math.min(rowH, 0.6), fill: { color: it.color || palette[i % palette.length] }, rectRadius: 0.1, objectName: an(g, "chip") });
      tx(s, it.tag, { x, y: yy, w: chipW, h: Math.min(rowH, 0.6), fontSize: 15, bold: true, color: C.text1, fontFace: CODE_FONT, align: "center", valign: "middle", objectName: an(g, "chip_text") });
      tx(s, it.text, { x: x + chipW + 0.2, y: yy, w: w - chipW - 0.2, h: rowH, fontSize: fs, color: C.text1, valign: "middle", objectName: an(g, "chip_desc") });
    });
  }

  // ================= Slide types =================
  const T = {};

  T.title = (d) => {
    const s = newSlide("TITLE", "ripple", d.notes);
    // decor: sun + pyramids (Egypt motif) + faint brackets
    s.addShape(S.ellipse, { x: 10.9, y: 0.9, w: 1.5, h: 1.5, fill: { color: C.accent2, transparency: 10 }, objectName: an(5, "ico_sun") });
    s.addShape(S.ellipse, { x: 9.4, y: -1.2, w: 4.6, h: 4.6, fill: { color: C.accent1, transparency: 88 }, objectName: an(5, "halo") });
    s.addShape(S.triangle, { x: 8.1, y: 4.55, w: 2.9, h: 2.45, fill: { color: C.accent1, transparency: 25 }, objectName: an(6, "pyr1") });
    s.addShape(S.triangle, { x: 9.7, y: 3.0, w: 3.3, h: 4.0, fill: { color: C.accent2, transparency: 0 }, objectName: an(6, "pyr2") });
    s.addShape(S.triangle, { x: 11.55, y: 5.15, w: 1.5, h: 1.85, fill: { color: C.accent3, transparency: 15 }, objectName: an(6, "pyr3") });
    s.addShape(S.roundRect, { x: 0.8, y: 1.45, w: 2.5, h: 0.5, fill: { color: C.accent2 }, rectRadius: 0.25, objectName: an(1, "pill") });
    tx(s, d.lesson.toUpperCase(), { x: 0.8, y: 1.45, w: 2.5, h: 0.5, fontSize: 14, bold: true, color: C.text1, align: "center", valign: "middle", charSpacing: 3, objectName: an(1, "pill_text") });
    s.addText(d.title, { placeholder: "title", objectName: an(2, "title") });
    s.addText(d.subtitle, { placeholder: "sub", objectName: an(3, "sub") });
    tx(s, d.ar, { x: 0.8, y: 5.45, w: 7.6, h: 0.6, fontSize: 22, color: C.accent2, rtlMode: true, lang: "ar-EG", align: "left", objectName: an(4, "ar") });
    return s;
  };

  T.section = (d) => {
    section = d.sectionName || d.title;
    pres.addSection({ title: section });
    const s = newSlide("SECTION", d.transition || "prism", d.notes);
    s.addShape(S.ellipse, { x: -1.5, y: 4.4, w: 5.0, h: 5.0, fill: { color: C.accent1, transparency: 80 }, objectName: an(5, "halo") });
    s.addShape(S.ellipse, { x: 10.8, y: -1.4, w: 3.8, h: 3.8, fill: { color: C.accent2, transparency: 82 }, objectName: an(5, "halo2") });
    tx(s, String(d.num), { x: 0.7, y: 1.6, w: 3.4, h: 4.0, fontSize: 200, bold: true, color: C.accent2, align: "left", valign: "middle", fontFace: THEME.headFontFace, objectName: an(1, "num") });
    s.addText(d.title, { placeholder: "title", objectName: an(2, "title") });
    s.addText(d.sub, { placeholder: "sub", objectName: an(3, "sub") });
    tx(s, d.ar, { x: 4.3, y: 4.75, w: 8.4, h: 0.6, fontSize: 24, color: C.accent2, rtlMode: true, lang: "ar-EG", align: "left", objectName: an(4, "ar") });
    return s;
  };

  T.objectives = (d) => {
    const s = newSlide("CONTENT", "fade", d.notes);
    title(s, d.title);
    d.items.forEach((it, i) => {
      const y = 1.75 + i * 1.18, g = i + 1;
      iconCircle(s, it.icon, MX, y, 0.85, palette[i % palette.length], g);
      tx(s, it.text, { x: 1.75, y, w: 7.1, h: 0.85, fontSize: 22, color: C.text1, valign: "middle", objectName: an(g, "text") });
    });
    const g = d.items.length + 1;
    s.addShape(S.roundRect, { x: 9.3, y: 1.75, w: 3.43, h: 4.65, fill: { color: C.text2 }, rectRadius: 0.2, shadow: shadow(), objectName: an(g, "panel") });
    s.addImage({ data: icon(d.panel.icon, HEX.accent2), x: 10.51, y: 2.25, w: 1.0, h: 1.0, objectName: an(g, "ico_panel") });
    tx(s, d.panel.label, { x: 9.65, y: 3.55, w: 2.73, h: 0.4, fontSize: 14, bold: true, color: C.accent2, align: "center", charSpacing: 2, objectName: an(g, "panel_label") });
    tx(s, d.panel.text, { x: 9.65, y: 4.0, w: 2.73, h: 2.1, fontSize: 22, bold: true, color: C.background1, align: "center", valign: "top", objectName: an(g, "panel_text") });
    return s;
  };

  // 3-4 cards. card: {icon, head, body, ar?, big?, chip?, color?, dark?}
  T.cards = (d) => {
    const s = newSlide("CONTENT", d.transition || "push", d.notes);
    title(s, d.title);
    const n = d.cards.length, gap = n === 4 ? 0.25 : 0.3;
    const cw = (CW - gap * (n - 1)) / n, y = 1.75, h = 4.7;
    d.cards.forEach((c, i) => {
      const x = MX + i * (cw + gap), g = i + 1;
      const dark = !!c.dark;
      const ink = dark ? C.background1 : C.text1;
      s.addShape(S.roundRect, { x, y, w: cw, h, fill: { color: dark ? C.text2 : C.background2 }, rectRadius: 0.18, shadow: dark ? shadow() : undefined, objectName: an(g, "card") });
      let cy = y + 0.35;
      if (c.icon) {
        iconCircle(s, c.icon, x + 0.35, cy, 0.9, c.color || palette[i % palette.length], g);
        cy += 1.15;
      }
      if (c.chip) {
        tx(s, c.chip, { x: x + 0.35, y: y + 0.45, w: cw - 0.7, h: 0.4, fontSize: 16, bold: true, color: dark ? C.accent2 : C.text2, fontFace: CODE_FONT, align: "right", objectName: an(g, "chip") });
      }
      if (c.big) {
        s.addShape(S.roundRect, { x: x + 0.3, y: y + 0.35, w: cw - 0.6, h: 1.1, fill: { color: c.color || palette[i % palette.length] }, rectRadius: 0.14, objectName: an(g, "big_bg") });
        tx(s, c.big, { x: x + 0.3, y: y + 0.35, w: cw - 0.6, h: 1.1, fontSize: 32, bold: true, color: C.text1, align: "center", valign: "middle", fontFace: THEME.headFontFace, objectName: an(g, "big") });
        cy = y + 1.7;
      }
      tx(s, c.head, { x: x + 0.35, y: cy, w: cw - 0.7, h: 0.6, fontSize: n === 4 ? 22 : 24, bold: true, color: ink, valign: "middle", objectName: an(g, "head") });
      tx(s, c.body, { x: x + 0.35, y: cy + 0.7, w: cw - 0.7, h: y + h - cy - 1.5, fontSize: n === 4 ? 16 : 17, color: ink, valign: "top", objectName: an(g, "body") });
      if (c.ar) tx(s, c.ar, { x: x + 0.35, y: y + h - 0.7, w: cw - 0.7, h: 0.45, fontSize: 18, color: dark ? C.accent2 : C.text2, rtlMode: true, lang: "ar-EG", align: "left", bold: true, objectName: an(g, "ar") });
    });
    return s;
  };

  T.flow = (d) => {
    const s = newSlide("CONTENT", "conveyor", d.notes);
    title(s, d.title);
    const n = d.steps.length, gapW = 0.75;
    const sw = (CW - gapW * (n - 1)) / n;
    d.steps.forEach((st, i) => {
      const x = MX + i * (sw + gapW), g = i + 1, cx = x + sw / 2;
      s.addShape(S.roundRect, { x, y: 1.75, w: sw, h: 3.35, fill: { color: C.background2 }, rectRadius: 0.18, objectName: an(g, "card") });
      iconCircle(s, st.icon, cx - 0.55, 2.0, 1.1, palette[i % palette.length], g);
      tx(s, st.label, { x: x + 0.15, y: 3.25, w: sw - 0.3, h: 0.5, fontSize: 18, bold: true, color: C.text1, align: "center", valign: "middle", objectName: an(g, "label") });
      tx(s, st.sub, { x: x + 0.2, y: 3.95, w: sw - 0.4, h: 1.0, fontSize: 16, color: C.text1, align: "center", valign: "top", objectName: an(g, "sub") });
      if (i < n - 1) s.addImage({ data: icon("FaArrowRight", HEX.dk1), x: x + sw + 0.17, y: 3.1, w: 0.4, h: 0.4, objectName: an(g, "arrow") });
    });
    const g = n + 1;
    s.addShape(S.roundRect, { x: MX, y: 5.45, w: CW, h: 1.0, fill: { color: C.text2 }, rectRadius: 0.16, objectName: an(g, "note") });
    s.addImage({ data: icon("FaLightbulb", HEX.accent2), x: MX + 0.35, y: 5.75, w: 0.4, h: 0.4, objectName: an(g, "note_ico") });
    tx(s, d.note, { x: MX + 1.0, y: 5.45, w: CW - 1.4, h: 1.0, fontSize: 18, color: C.background1, valign: "middle", objectName: an(g, "note_text") });
    return s;
  };

  // numbered steps + side card
  T.steps = (d) => {
    const s = newSlide("CONTENT", d.transition || "fade", d.notes);
    title(s, d.title);
    const n = d.steps.length, pitch = Math.min(1.2, 4.7 / n);
    d.steps.forEach((st, i) => {
      const y = 1.75 + i * pitch, g = i + 1;
      s.addShape(S.ellipse, { x: MX, y, w: 0.72, h: 0.72, fill: { color: palette[i % palette.length] }, objectName: an(g, "ico_num_bg") });
      tx(s, String(i + 1), { x: MX, y, w: 0.72, h: 0.72, fontSize: 24, bold: true, color: C.text1, align: "center", valign: "middle", objectName: an(g, "ico_num") });
      tx(s, [{ text: st.h, options: { bold: true, fontSize: 21, breakLine: true } }, { text: st.b, options: { fontSize: 16 } }],
        { x: 1.55, y: y - 0.06, w: d.browser ? 5.5 : 6.6, h: pitch - 0.1, color: C.text1, valign: "top", objectName: an(g, "text") });
    });
    const g = n + 1;
    if (d.browser) {
      const b = d.browser;
      const r = browser(s, { x: 7.45, y: 1.75, w: 5.28, h: 3.7, url: b.url, g });
      tx(s, b.runs, { x: r.cx, y: r.cy, w: r.cw, h: r.ch, valign: "top", objectName: an(g, "browser_content") });
      s.addShape(S.roundRect, { x: 7.45, y: 5.75, w: 5.28, h: 0.65, fill: { color: C.accent2 }, rectRadius: 0.325, objectName: an(g + 1, "timer") });
      s.addImage({ data: icon("FaClock", HEX.dk1), x: 7.85, y: 5.92, w: 0.3, h: 0.3, objectName: an(g + 1, "timer_ico") });
      tx(s, d.timer, { x: 8.3, y: 5.75, w: 4.2, h: 0.65, fontSize: 18, bold: true, color: C.text1, valign: "middle", objectName: an(g + 1, "timer_text") });
    } else if (d.side) {
      const sd = d.side;
      s.addShape(S.roundRect, { x: 8.55, y: 1.75, w: 4.18, h: 4.7, fill: { color: C.text2 }, rectRadius: 0.2, shadow: shadow(), objectName: an(g, "panel") });
      s.addImage({ data: icon(sd.icon, HEX.accent2), x: 8.95, y: 2.15, w: 0.8, h: 0.8, objectName: an(g, "ico_panel") });
      tx(s, sd.head, { x: 8.95, y: 3.2, w: 3.4, h: 0.6, fontSize: 24, bold: true, color: C.background1, valign: "middle", objectName: an(g, "panel_head") });
      tx(s, sd.body, { x: 8.95, y: 3.9, w: 3.4, h: 2.3, fontSize: 18, color: C.background2, valign: "top", objectName: an(g, "panel_body") });
    }
    return s;
  };

  // code on the left, optional preview + notes on the right
  T.code = (d) => {
    const s = newSlide("CONTENT", d.transition || "push", d.notes);
    title(s, d.title);
    const lines = d.code.split("\n"), fs = d.fs || 16;
    const lh = (fs * 1.2) / 72;
    const codeW = d.codeW || 6.7;
    const codeH = d.codeH || Math.max(d.preview ? d.preview.h || 2.8 : 3.4, 0.85 + lines.length * lh + 0.25);
    codeBox(s, { x: MX, y: 1.7, w: codeW, h: codeH, lines, fs, file: d.file || "index.html", g: 1 });
    const rx = MX + codeW + 0.3, rw = MX + CW - rx;
    let ny = 1.7;
    if (d.preview) {
      const pv = d.preview, ph_ = pv.h || 2.8;
      const r = browser(s, { x: rx, y: 1.7, w: rw, h: ph_, url: pv.url || "my-page.html", g: 2 });
      if (pv.runs) tx(s, pv.runs, { x: r.cx, y: r.cy, w: r.cw, h: r.ch, valign: "top", objectName: an(2, "browser_content") });
      if (pv.draw) pv.draw(s, r, 2);
      ny = 1.7 + ph_ + 0.3;
    }
    if (d.notes_) {
      const rowH = d.preview ? 0.62 : 0.8, pitch = d.preview ? 0.72 : 0.98;
      notesList(s, { x: rx, y: ny, w: rw, items: d.notes_, rowH, pitch, chipW: d.chipW || 1.45, g0: 3, fs: d.preview ? 16 : 18 });
    }
    return s;
  };

  // anatomy of a single element: <p>Hello</p> split in parts
  T.anatomy = (d) => {
    const s = newSlide("CONTENT", "fade", d.notes);
    title(s, d.title);
    const n = d.parts.length, gap = 0.3, pw = 3.6;
    const total = n * pw + (n - 1) * gap, x0 = (W - total) / 2;
    d.parts.forEach((p, i) => {
      const x = x0 + i * (pw + gap), g = i + 1;
      s.addShape(S.roundRect, { x, y: 1.9, w: pw, h: 1.6, fill: { color: C.text1 }, rectRadius: 0.16, shadow: shadow(), objectName: an(g, "code") });
      tx(s, p.code, { x, y: 1.9, w: pw, h: 1.6, fontSize: 36, bold: true, color: p.codeColor === "text" ? C.background1 : C.accent3, fontFace: CODE_FONT, align: "center", valign: "middle", objectName: an(g, "code_text") });
      s.addShape(S.roundRect, { x: x + 0.25, y: 3.85, w: pw - 0.5, h: 0.6, fill: { color: palette[i % palette.length] }, rectRadius: 0.3, objectName: an(g, "pill") });
      tx(s, p.label, { x: x + 0.25, y: 3.85, w: pw - 0.5, h: 0.6, fontSize: 20, bold: true, color: C.text1, align: "center", valign: "middle", objectName: an(g, "pill_text") });
      tx(s, p.body, { x: x + 0.1, y: 4.6, w: pw - 0.2, h: 0.9, fontSize: 16, color: C.text1, align: "center", valign: "top", objectName: an(g, "body") });
    });
    const g = n + 1;
    s.addShape(S.roundRect, { x: MX, y: 5.7, w: CW, h: 0.8, fill: { color: C.text2 }, rectRadius: 0.16, objectName: an(g, "formula") });
    tx(s, d.formula, { x: MX, y: 5.7, w: CW, h: 0.8, fontSize: 22, bold: true, color: C.background1, align: "center", valign: "middle", objectName: an(g, "formula_text") });
    return s;
  };

  // 4 attribute-style tiles + example strip + result card
  T.parts = (d) => {
    const s = newSlide("CONTENT", "push", d.notes);
    title(s, d.title);
    const n = d.parts.length, gap = 0.25, tw = (CW - gap * (n - 1)) / n;
    d.parts.forEach((p, i) => {
      const x = MX + i * (tw + gap), g = i + 1;
      s.addShape(S.roundRect, { x, y: 1.7, w: tw, h: 2.65, fill: { color: palette[i % palette.length] }, rectRadius: 0.16, shadow: shadow(), objectName: an(g, "tile") });
      tx(s, p.code, { x: x + 0.2, y: 1.85, w: tw - 0.4, h: 0.65, fontSize: 20, bold: true, color: C.text1, fontFace: CODE_FONT, valign: "middle", objectName: an(g, "tile_code") });
      tx(s, p.head, { x: x + 0.2, y: 2.55, w: tw - 0.4, h: 0.45, fontSize: 19, bold: true, color: C.text1, valign: "middle", objectName: an(g, "tile_head") });
      tx(s, p.body, { x: x + 0.2, y: 3.05, w: tw - 0.4, h: 1.2, fontSize: 15, color: C.text1, valign: "top", objectName: an(g, "tile_body") });
    });
    const g = n + 1, ex = d.example;
    const eh = 0.8 + ex.lines.length * 0.32;
    codeBox(s, { x: MX, y: 4.7, w: 8.2, h: Math.max(eh, 1.75), lines: ex.lines, fs: 17, file: ex.file || "index.html", g });
    s.addShape(S.roundRect, { x: 9.1, y: 4.7, w: CW - 8.5, h: Math.max(eh, 1.75), fill: { color: C.background2 }, rectRadius: 0.14, objectName: an(g + 1, "result") });
    tx(s, "RESULT", { x: 9.35, y: 4.82, w: 2.0, h: 0.3, fontSize: 13, bold: true, color: C.text2, charSpacing: 3, objectName: an(g + 1, "result_label") });
    if (ex.result) tx(s, ex.result, { x: 9.35, y: 5.2, w: CW - 9.0, h: Math.max(eh, 1.75) - 0.7, valign: "middle", objectName: an(g + 1, "result_text") });
    if (ex.draw) ex.draw(s, g + 1);
    return s;
  };

  T.glossary = (d) => {
    const s = newSlide("CONTENT", "fade", d.notes);
    title(s, d.title);
    const per = Math.ceil(d.items.length / 2);
    const rowH = Math.min(1.0, 4.7 / per), pillW = d.pillW || 2.3, colW = (CW - 0.4) / 2;
    d.items.forEach((it, i) => {
      const col = i < per ? 0 : 1, row = col ? i - per : i;
      const x = MX + col * (colW + 0.4), y = 1.75 + row * rowH, g = i + 1;
      s.addShape(S.roundRect, { x, y, w: pillW, h: Math.min(0.62, rowH - 0.15), fill: { color: palette[i % palette.length] }, rectRadius: 0.12, objectName: an(g, "pill") });
      tx(s, it.tag, { x, y, w: pillW, h: Math.min(0.62, rowH - 0.15), fontSize: 18, bold: true, color: C.text1, fontFace: CODE_FONT, align: "center", valign: "middle", objectName: an(g, "pill_text") });
      tx(s, it.text, { x: x + pillW + 0.25, y: y - 0.04, w: colW - pillW - 0.25, h: Math.min(0.7, rowH - 0.1), fontSize: 18, color: C.text1, valign: "middle", objectName: an(g, "desc") });
    });
    return s;
  };

  T.quiz = (d) => {
    const s = newSlide("CONTENT", "doors", d.notes);
    title(s, "Quick quiz");
    s.addShape(S.ellipse, { x: MX, y: 1.7, w: 0.8, h: 0.8, fill: { color: C.accent2 }, objectName: an(1, "ico_q_bg") });
    s.addImage({ data: icon("FaQuestionCircle", HEX.dk1), x: MX + 0.17, y: 1.87, w: 0.46, h: 0.46, objectName: an(1, "ico_q") });
    tx(s, d.q, { x: 1.7, y: 1.6, w: 11.0, h: 1.0, fontSize: 26, bold: true, color: C.text1, valign: "middle", objectName: an(1, "question") });
    const cw = 5.95, ch = 1.3;
    d.options.forEach((o, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = MX + col * (cw + 0.23), y = 2.95 + row * (ch + 0.25), g = i + 2;
      s.addShape(S.roundRect, { x, y, w: cw, h: ch, fill: { color: C.background2 }, rectRadius: 0.16, objectName: an(g, "opt") });
      s.addShape(S.ellipse, { x: x + 0.28, y: y + 0.3, w: 0.7, h: 0.7, fill: { color: palette[i] }, objectName: an(g, "ico_letter_bg") });
      tx(s, "ABCD"[i], { x: x + 0.28, y: y + 0.3, w: 0.7, h: 0.7, fontSize: 24, bold: true, color: C.text1, align: "center", valign: "middle", objectName: an(g, "ico_letter") });
      tx(s, o, { x: x + 1.2, y, w: cw - 1.4, h: ch, fontSize: d.codeOptions ? 20 : 22, color: C.text1, fontFace: d.codeOptions ? CODE_FONT : THEME.bodyFontFace, valign: "middle", objectName: an(g, "opt_text") });
    });
    // answer reveal on click
    const ci = d.answer, col = ci % 2, row = Math.floor(ci / 2);
    const ax = MX + col * (cw + 0.23), ay = 2.95 + row * (ch + 0.25);
    s.addShape(S.roundRect, { x: ax, y: ay, w: cw, h: ch, fill: { color: C.accent5, transparency: 100 }, line: { color: C.accent5, width: 5 }, rectRadius: 0.16, objectName: ak(1, "answer_ring") });
    s.addShape(S.roundRect, { x: MX, y: 6.0, w: CW, h: 0.8, fill: { color: C.text2 }, rectRadius: 0.16, objectName: ak(1, "answer_bar") });
    s.addImage({ data: icon("FaCheckCircle", HEX.accent5), x: MX + 0.3, y: 6.2, w: 0.4, h: 0.4, objectName: ak(1, "answer_ico") });
    tx(s, [{ text: `Answer ${"ABCD"[ci]}.  `, options: { bold: true, color: C.accent5 } }, { text: d.why, options: { color: C.background1 } }],
      { x: MX + 0.95, y: 6.0, w: CW - 1.2, h: 0.8, fontSize: 18, valign: "middle", objectName: ak(1, "answer_text") });
    return s;
  };

  T.recap = (d) => {
    const s = newSlide("DARKCONTENT", "vortex", d.notes);
    title(s, d.title);
    const pitch = Math.min(0.95, 4.8 / d.items.length);
    d.items.forEach((t, i) => {
      const y = 1.75 + i * pitch, g = i + 1;
      s.addImage({ data: icon("FaCheckCircle", HEX.accent5), x: MX, y: y + 0.07, w: 0.5, h: 0.5, objectName: an(g, "ico_check") });
      tx(s, t, { x: 1.35, y, w: 7.2, h: pitch - 0.1, fontSize: 20, color: C.background1, valign: "top", objectName: an(g, "text") });
    });
    const g = d.items.length + 1;
    s.addShape(S.roundRect, { x: 9.0, y: 1.75, w: 3.73, h: 4.75, fill: { color: C.accent2 }, rectRadius: 0.2, shadow: shadow(), objectName: an(g, "hw") });
    s.addImage({ data: icon("FaRocket", HEX.dk1), x: 9.4, y: 2.1, w: 0.8, h: 0.8, objectName: an(g, "ico_hw") });
    tx(s, "HOMEWORK", { x: 9.4, y: 3.1, w: 3.0, h: 0.4, fontSize: 15, bold: true, color: C.text1, charSpacing: 3, objectName: an(g, "hw_label") });
    tx(s, d.homework, { x: 9.4, y: 3.6, w: 3.0, h: 2.7, fontSize: 20, color: C.text1, valign: "top", objectName: an(g, "hw_text") });
    return s;
  };

  // semantic page wireframe with explanation list
  T.wireframe = (d) => {
    const s = newSlide("CONTENT", "window", d.notes);
    title(s, d.title);
    const x = MX, y = 1.7, w = 6.7;
    s.addShape(S.rect, { x, y, w, h: 4.85, fill: { color: C.background2 }, shadow: shadow(), objectName: an(1, "frame") });
    const box = (bx, by, bw, bh, label, color, g) => {
      s.addShape(S.roundRect, { x: bx, y: by, w: bw, h: bh, fill: { color }, rectRadius: 0.08, objectName: an(g, "box") });
      tx(s, label, { x: bx, y: by, w: bw, h: bh, fontSize: 16, bold: true, color: C.text1, fontFace: CODE_FONT, align: "center", valign: "middle", objectName: an(g, "box_text") });
    };
    box(x + 0.2, y + 0.2, w - 0.4, 0.75, "<header>", C.accent6, 2);
    box(x + 0.2, y + 1.1, w - 0.4, 0.55, "<nav>", C.accent4, 3);
    s.addShape(S.roundRect, { x: x + 0.2, y: y + 1.8, w: w - 0.4, h: 2.2, fill: { color: C.background1 }, rectRadius: 0.08, objectName: an(4, "main_bg") });
    tx(s, "<main>", { x: x + 0.35, y: y + 1.85, w: 1.6, h: 0.35, fontSize: 14, bold: true, color: C.text2, fontFace: CODE_FONT, objectName: an(4, "main_label") });
    box(x + 0.35, y + 2.25, 3.0, 1.6, "<section>", C.accent1, 5);
    box(x + 3.5, y + 2.25, 2.65, 1.6, "<aside>", C.accent2, 6);
    box(x + 0.2, y + 4.15, w - 0.4, 0.5, "<footer>", C.accent3, 7);
    notesList(s, { x: MX + w + 0.3, y: 1.7, w: CW - w - 0.3, items: d.items, rowH: 0.66, pitch: 0.82, chipW: 1.6, g0: 2, fs: 16 });
    return s;
  };

  return {
    pres, C, S, T, metas, tx, pr,
    async save(file) {
      await pres.writeFile({ fileName: file });
      await addMotion(file, metas);
      await applyTheme(file, THEME);
    },
  };
}

module.exports = { createDeck, prerenderIcons, highlight, THEME, HEX, CODE_FONT };
