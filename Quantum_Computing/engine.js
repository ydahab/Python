// Slide engine for the Quantum Computing decks. One engine, two directions:
// layouts are written once in left-to-right coordinates and mirrored for Arabic (RTL).
const HF = "/home/user/Python/HTML_Fundamentals";
const pptxgen = require(HF + "/node_modules/pptxgenjs");
const React = require(HF + "/node_modules/react");
const ReactDOMServer = require(HF + "/node_modules/react-dom/server");
const sharp = require(HF + "/node_modules/sharp");
const fa = require(HF + "/node_modules/react-icons/fa");
const { addMotion } = require(HF + "/motion.js");
const SKILL = require("fs").readdirSync("/root/.claude/skills/synced").map((d) => `/root/.claude/skills/synced/${d}/pptx`).find((p) => require("fs").existsSync(p + "/scripts/apply_theme.js"));
const { applyTheme } = require(SKILL + "/scripts/apply_theme.js");

const THEME = {
  name: "Quantum",
  headFontFace: "Arial",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "0B1030", lt1: "FFFFFF", dk2: "2A1B6E", lt2: "ECEFFE",
    accent1: "22D3EE", accent2: "A78BFA", accent3: "F472B6", accent4: "FBBF24",
    accent5: "34D399", accent6: "60A5FA", hlink: "6D28D9", folHlink: "A78BFA",
  },
};
const HEX = THEME.colors;
const W = 13.333, MX = 0.6, CW = W - 2 * MX;
const CODE_FONT = "Courier New";

const ICONS = ["FaAtom", "FaMicrochip", "FaFire", "FaTemperatureLow", "FaBolt", "FaLink", "FaWaveSquare", "FaCubes", "FaFlask", "FaPills", "FaLeaf", "FaLock",
  "FaRoute", "FaRobot", "FaGlobe", "FaServer", "FaIndustry", "FaTools", "FaShieldAlt", "FaLightbulb", "FaQuestionCircle", "FaCheckCircle", "FaTimesCircle",
  "FaRocket", "FaUsers", "FaBook", "FaSnowflake", "FaBalanceScale", "FaSearch", "FaCode", "FaHandshake", "FaMemory", "FaCog", "FaBatteryFull", "FaDna",
  "FaMicroscope", "FaChartLine", "FaArrowRight", "FaArrowLeft", "FaDice", "FaLayerGroup", "FaBullseye", "FaComments", "FaSun"];
const cache = {};
async function prerender() {
  for (const n of ICONS) for (const c of [HEX.dk1, HEX.lt1, HEX.accent1, HEX.accent4, HEX.accent5, HEX.accent3, HEX.dk2]) {
    const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(fa[n], { color: "#" + c, size: "256" }));
    cache[n + c] = "image/png;base64," + (await sharp(Buffer.from(svg)).png().toBuffer()).toString("base64");
  }
}
const icon = (n, c = HEX.dk1) => { const d = cache[n + c]; if (!d) throw new Error("icon " + n + c); return d; };

function highlight(line, C, fs) {
  const kw = /^(from|import|qc|print)\b/;
  const re = /(#.*$)|("[^"]*")|(\b\d+\b)|(\b(?:from|import)\b)|(\b(?:QuantumCircuit|h|cx|measure_all)\b)/g;
  const o = (color) => ({ fontFace: CODE_FONT, fontSize: fs, color });
  const out = []; let last = 0, m;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push({ text: line.slice(last, m.index), options: o(C.background1) });
    const col = m[1] ? C.accent6 : m[2] ? C.accent5 : m[3] ? C.accent4 : m[4] ? C.accent3 : C.accent1;
    out.push({ text: m[0], options: o(col) }); last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ text: line.slice(last), options: o(C.background1) });
  if (!out.length) out.push({ text: " ", options: o(C.background1) });
  out[out.length - 1].options.breakLine = true;
  return out;
}

function createDeck(L) {
  const rtl = L.dir === "rtl";
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = L.docTitle; pres.subject = L.docTitle; pres.author = "Technology Dept.";
  if (rtl) pres.rtlMode = true;
  const C = pres.SchemeColor, S = pres.ShapeType;
  const metas = []; let section = "Opening";
  pres.addSection({ title: section });

  // --- direction helpers (all layout math is written LTR and mirrored here)
  const X = (x, w = 0) => (rtl ? W - x - w : x);
  const start = rtl ? "right" : "left", end = rtl ? "left" : "right";
  const rt = rtl ? { rtlMode: true, lang: "ar-EG" } : { lang: "en-US" };
  const an = (g, l) => `a${g}_${l}`, ak = (g, l) => `k${g}_${l}`;
  const sh = () => ({ type: "outer", color: "000000", blur: 12, offset: 3, angle: 90, opacity: 0.16 });
  const fix = (o) => { const r = { ...o }; if (r.x !== undefined) r.x = X(r.x, r.w || 0); if (r.align === "start") r.align = start; else if (r.align === "end") r.align = end; else if (r.align === undefined) r.align = start; return r; };
  const tx = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, fontFace: THEME.bodyFontFace, ...rt, ...fix(o) });
  const shape = (s, type, o) => s.addShape(type, { ...o, x: X(o.x, o.w) });
  const img = (s, data, o) => s.addImage({ data, ...o, x: X(o.x, o.w) });
  const palette = [C.accent1, C.accent2, C.accent3, C.accent4, C.accent6, C.accent5];
  const pal = (i) => palette[i % palette.length];

  const foot = (color) => ({ text: { text: L.footer, options: { x: X(MX, 6), y: 6.98, w: 6, h: 0.3, fontSize: 11, color, margin: 0, align: start, ...rt } } });
  const ph = (name, type, o) => ({ placeholder: { options: { name, type, margin: 0, ...rt, ...o }, text: "" } });
  const snum = (color) => ({ x: X(12.1, 0.63), y: 6.98, w: 0.63, h: 0.3, fontSize: 11, color, align: end });
  pres.defineSlideMaster({ title: "TITLE", background: { color: C.text1 }, objects: [
    ph("title", "title", { x: X(0.8, 7.4), y: 2.0, w: 7.4, h: 2.2, fontSize: 46, bold: true, color: C.background1, align: start, valign: "bottom" }),
    ph("sub", "body", { x: X(0.8, 7.0), y: 4.4, w: 7.0, h: 1.0, fontSize: 22, color: C.background2, align: start, valign: "top" })] });
  pres.defineSlideMaster({ title: "DIVIDER", background: { color: C.text2 }, objects: [
    ph("title", "title", { x: X(4.3, 8.4), y: 2.3, w: 8.4, h: 1.5, fontSize: 44, bold: true, color: C.background1, align: start, valign: "bottom" }),
    ph("sub", "body", { x: X(4.3, 8.4), y: 3.95, w: 8.4, h: 0.9, fontSize: 22, color: C.background2, align: start, valign: "top" })] });
  pres.defineSlideMaster({ title: "CONTENT", background: { color: C.background1 }, objects: [
    ph("title", "title", { x: X(MX, CW), y: 0.4, w: CW, h: 1.0, fontSize: 34, bold: true, color: C.text1, align: start, valign: "middle" }), foot(C.text2)],
    slideNumber: snum(C.text2) });
  pres.defineSlideMaster({ title: "DARK", background: { color: C.text1 }, objects: [
    ph("title", "title", { x: X(MX, CW), y: 0.4, w: CW, h: 1.0, fontSize: 34, bold: true, color: C.background1, align: start, valign: "middle" }), foot(C.background2)],
    slideNumber: snum(C.background2) });

  const newSlide = (layout, transition, notes) => {
    const s = pres.addSlide({ masterName: layout, sectionTitle: section });
    metas.push({ transition: rtl && transition === "push" ? "pushr" : transition });
    if (notes) s.addNotes(notes);
    return s;
  };
  const title = (s, t) => s.addText(t, { placeholder: "title" });
  const iconCircle = (s, name, x, y, d, fill, g, fg = HEX.dk1) => {
    shape(s, S.ellipse, { x, y, w: d, h: d, fill: { color: fill }, objectName: an(g, "ico_bg") });
    img(s, icon(name, fg), { x: x + d * 0.27, y: y + d * 0.27, w: d * 0.46, h: d * 0.46, objectName: an(g, "ico_img") });
  };
  // atom/orbit artwork used on title and dividers
  const orbits = (s, cx, cy, big, g) => {
    [1.0, 0.68, 0.38].forEach((k, i) => {
      const r = big * k;
      shape(s, S.ellipse, { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fill: { color: C.accent1, transparency: 100 }, line: { color: i === 1 ? C.accent2 : C.accent1, width: 1.5, transparency: 45 }, objectName: an(g, `halo${i}`) });
    });
    shape(s, S.ellipse, { x: cx - 0.35, y: cy - 0.35, w: 0.7, h: 0.7, fill: { color: C.accent1 }, objectName: an(g, "ico_core") });
    [[big, -0.5, C.accent4, 0.2], [big * 0.68, 2.3, C.accent3, 0.17], [big * 0.38, 0.7, C.accent2, 0.14]].forEach(([r, a, col, d], i) =>
      shape(s, S.ellipse, { x: cx + r * Math.cos(a) - d, y: cy + r * Math.sin(a) - d, w: 2 * d, h: 2 * d, fill: { color: col }, objectName: an(g, `ico_e${i}`) }));
  };

  const T = {};

  T.title = (d) => {
    const s = newSlide("TITLE", "ripple", d.notes);
    orbits(s, 10.65, 3.75, 2.75, 4);
    shape(s, S.roundRect, { x: 0.8, y: 1.0, w: 5.6, h: 0.5, fill: { color: C.accent4 }, rectRadius: 0.25, objectName: an(1, "pill") });
    tx(s, d.tag, { x: 0.8, y: 1.0, w: 5.6, h: 0.5, fontSize: 13, bold: true, color: C.text1, align: "center", valign: "middle", charSpacing: rtl ? 0 : 1, objectName: an(1, "pill_t") });
    s.addText(d.title, { placeholder: "title", objectName: an(2, "title") });
    s.addText(d.sub, { placeholder: "sub", objectName: an(3, "sub") });
    return s;
  };

  T.divider = (d) => {
    section = d.title; pres.addSection({ title: section });
    const s = newSlide("DIVIDER", d.transition || "prism", d.notes);
    shape(s, S.ellipse, { x: -1.5, y: 4.3, w: 5.2, h: 5.2, fill: { color: C.accent1, transparency: 82 }, objectName: an(5, "halo") });
    shape(s, S.ellipse, { x: 10.6, y: -1.5, w: 4.0, h: 4.0, fill: { color: C.accent2, transparency: 80 }, objectName: an(5, "halo2") });
    tx(s, String(d.num), { x: 0.7, y: 1.6, w: 3.4, h: 4.0, fontSize: 190, bold: true, color: C.accent4, align: "start", valign: "middle", fontFace: THEME.headFontFace, lang: "en-US", rtlMode: false, objectName: an(1, "num") });
    s.addText(d.title, { placeholder: "title", objectName: an(2, "title") });
    s.addText(d.sub, { placeholder: "sub", objectName: an(3, "sub") });
    return s;
  };

  T.agenda = (d) => {
    const s = newSlide("CONTENT", "fade", d.notes);
    title(s, d.title);
    const n = d.items.length, gap = 0.3, w = (CW - gap * (n - 1)) / n;
    d.items.forEach((it, i) => {
      const x = MX + i * (w + gap), g = i + 1;
      shape(s, S.roundRect, { x, y: 1.8, w, h: 4.4, fill: { color: i % 2 ? C.background2 : C.text2 }, rectRadius: 0.18, shadow: sh(), objectName: an(g, "card") });
      const dark = i % 2 === 0, ink = dark ? C.background1 : C.text1;
      iconCircle(s, it.icon, x + 0.35, 2.15, 0.95, pal(i), g);
      tx(s, String(i + 1), { x: x + w - 1.05, y: 2.1, w: 0.7, h: 0.9, fontSize: 44, bold: true, color: dark ? C.accent4 : C.text2, align: "end", rtlMode: false, lang: "en-US", objectName: an(g, "no") });
      tx(s, it.head, { x: x + 0.35, y: 3.55, w: w - 0.7, h: 0.9, fontSize: 23, bold: true, color: ink, valign: "top", objectName: an(g, "head") });
      tx(s, it.body, { x: x + 0.35, y: 4.55, w: w - 0.7, h: 1.4, fontSize: 16, color: ink, valign: "top", objectName: an(g, "body") });
    });
    return s;
  };

  T.cards = (d) => {
    const s = newSlide("CONTENT", d.transition || "push", d.notes);
    title(s, d.title);
    const n = d.cards.length, gap = n === 4 ? 0.25 : 0.3, w = (CW - gap * (n - 1)) / n;
    const h = d.note ? 3.85 : 4.7;
    d.cards.forEach((c, i) => {
      const x = MX + i * (w + gap), g = i + 1;
      shape(s, S.roundRect, { x, y: 1.75, w, h, fill: { color: C.background2 }, rectRadius: 0.18, objectName: an(g, "card") });
      iconCircle(s, c.icon, x + 0.35, 2.05, 0.9, pal(i), g);
      tx(s, c.head, { x: x + 0.35, y: 3.05, w: w - 0.7, h: 0.85, fontSize: n === 4 ? 19 : 22, bold: true, color: C.text1, valign: "middle", objectName: an(g, "head") });
      tx(s, c.body, { x: x + 0.35, y: 4.0, w: w - 0.7, h: h - 2.4, fontSize: 16, color: C.text1, valign: "top", objectName: an(g, "body") });
    });
    if (d.note) {
      const g = n + 1;
      shape(s, S.roundRect, { x: MX, y: 5.8, w: CW, h: 0.95, fill: { color: C.text2 }, rectRadius: 0.16, objectName: an(g, "note") });
      img(s, icon("FaLightbulb", HEX.accent4), { x: MX + 0.35, y: 6.07, w: 0.4, h: 0.4, objectName: an(g, "note_ico") });
      tx(s, d.note, { x: MX + 1.0, y: 5.8, w: CW - 1.4, h: 0.95, fontSize: 17, color: C.background1, valign: "middle", objectName: an(g, "note_t") });
    }
    return s;
  };

  T.grid6 = (d) => {
    const s = newSlide("CONTENT", d.transition || "push", d.notes);
    title(s, d.title);
    const gap = 0.28, rg = 0.2, w = (CW - 2 * gap) / 3, h = 2.4;
    d.tiles.forEach((t, i) => {
      const col = i % 3, row = Math.floor(i / 3), g = i + 1;
      const x = MX + col * (w + gap), y = 1.65 + row * (h + rg);
      shape(s, S.roundRect, { x, y, w, h, fill: { color: C.background2 }, rectRadius: 0.16, objectName: an(g, "card") });
      iconCircle(s, t.icon, x + 0.25, y + 0.22, 0.7, pal(i), g);
      tx(s, t.head, { x: x + 1.1, y: y + 0.18, w: w - 1.3, h: 0.78, fontSize: 17, bold: true, color: C.text1, valign: "middle", objectName: an(g, "head") });
      tx(s, t.body, { x: x + 0.25, y: y + 1.05, w: w - 0.5, h: h - 1.65, fontSize: 14, color: C.text1, valign: "top", objectName: an(g, "body") });
      if (t.tag) {
        const tw = Math.min(w - 0.5, 2.7);
        shape(s, S.roundRect, { x: x + 0.25, y: y + h - 0.5, w: tw, h: 0.32, fill: { color: pal(i) }, rectRadius: 0.16, objectName: an(g, "tag") });
        tx(s, t.tag, { x: x + 0.25, y: y + h - 0.5, w: tw, h: 0.32, fontSize: 12, bold: true, color: C.text1, align: "center", valign: "middle", objectName: an(g, "tag_t") });
      }
    });
    return s;
  };

  // line chart (log scale) + callouts
  T.chart = (d, chartHex) => {
    const s = newSlide("CONTENT", "fade", d.notes);
    title(s, d.title);
    const cx = rtl ? W - MX - 7.7 : MX; // chart box x (mirrored)
    s.addChart(pres.charts.LINE, [{ name: d.series, labels: d.labels, values: d.values }], {
      x: cx, y: 1.6, w: 7.7, h: 4.9, chartColors: [HEX.accent2], lineSize: 3, lineDataSymbol: "circle", lineDataSymbolSize: 10,
      valAxisLogScaleBase: 10, valAxisMinVal: 1000, valAxisMaxVal: 1000000000000, valAxisMajorUnit: 1000, valAxisHidden: true,
      valAxisLabelFormatCode: '[>=1000000000]0,,,"B";[>=1000000]0,,"M";0,"K"', valAxisLabelColor: HEX.dk1, catAxisLabelColor: HEX.dk1,
      valAxisLabelFontFace: "Calibri", catAxisLabelFontFace: "Calibri", valAxisLabelFontSize: 13, catAxisLabelFontSize: 13,
      valGridLine: { color: "CBD5F5", size: 0.75 }, catGridLine: { style: "none" }, showLegend: false,
      showValue: true, dataLabelPosition: "t", dataLabelFormatCode: '[>=1000000000]0.0,,,"B";[>=1000000]0.0,,"M";#,##0', dataLabelColor: HEX.dk1, dataLabelFontSize: 12, dataLabelFontBold: true,
      showTitle: false, objectName: an(1, "chart"),
    });
    d.callouts.forEach((c, i) => {
      const y = 1.65 + i * 1.62, g = i + 2;
      shape(s, S.roundRect, { x: 8.7, y, w: 4.03, h: 1.5, fill: { color: i === 2 ? C.text2 : C.background2 }, rectRadius: 0.16, objectName: an(g, "card") });
      tx(s, c.big, { x: 8.95, y: y + 0.08, w: 3.55, h: 0.55, fontSize: 19, bold: true, color: i === 2 ? C.accent4 : C.text2, valign: "middle", objectName: an(g, "big") });
      tx(s, c.text, { x: 8.95, y: y + 0.65, w: 3.55, h: 0.8, fontSize: 14, color: i === 2 ? C.background1 : C.text1, valign: "top", objectName: an(g, "text") });
    });
    tx(s, d.source, { x: cx, y: 6.55, w: 7.7, h: 0.3, fontSize: 11, color: C.text2, objectName: an(6, "source") });
    return s;
  };

  T.bitqubit = (d) => {
    const s = newSlide("CONTENT", "push", d.notes);
    title(s, d.title);
    const pw = 5.95;
    [0, 1].forEach((k) => {
      const x = MX + k * (pw + 0.23), g = k + 1, p = d.panels[k];
      shape(s, S.roundRect, { x, y: 1.65, w: pw, h: 4.25, fill: { color: k ? C.text2 : C.background2 }, rectRadius: 0.2, objectName: an(g, "card") });
      const ink = k ? C.background1 : C.text1;
      tx(s, p.head, { x: x + 0.4, y: 1.8, w: pw - 0.8, h: 0.55, fontSize: 23, bold: true, color: k ? C.accent4 : C.text2, valign: "middle", objectName: an(g, "head") });
      if (k === 0) {
        [0, 1].forEach((j) => {
          shape(s, S.roundRect, { x: x + 0.9 + j * 2.2, y: 2.75, w: 1.8, h: 1.1, fill: { color: j === 0 ? C.accent1 : C.background1 }, line: { color: C.text2, width: 1.5 }, rectRadius: 0.14, objectName: an(g, `sw${j}`) });
          tx(s, String(j), { x: x + 0.9 + j * 2.2, y: 2.75, w: 1.8, h: 1.1, fontSize: 44, bold: true, color: C.text1, align: "center", valign: "middle", rtlMode: false, lang: "en-US", objectName: an(g, `swt${j}`) });
        });
      } else {
        const cxp = x + pw / 2, cy = 3.5, r = 0.72;
        shape(s, S.ellipse, { x: cxp - r, y: cy - r, w: 2 * r, h: 2 * r, fill: { color: C.accent2, transparency: 75 }, line: { color: C.accent1, width: 2 }, objectName: an(g, "ico_sph") });
        shape(s, S.ellipse, { x: cxp - r, y: cy - 0.22, w: 2 * r, h: 0.44, fill: { color: C.accent2, transparency: 100 }, line: { color: C.accent1, width: 1, transparency: 40 }, objectName: an(g, "eq") });
        shape(s, S.line, { x: cxp, y: cy - r - 0.12, w: 0, h: 2 * r + 0.24, line: { color: C.accent1, width: 1.25, transparency: 30 }, objectName: an(g, "axis") });
        shape(s, S.line, { x: cxp, y: cy - 0.55, w: 0.5, h: 0.55, flipV: true, line: { color: C.accent4, width: 3, endArrowType: "triangle" }, objectName: an(g, "vec") });
        tx(s, "|0⟩", { x: cxp + 0.12, y: cy - r - 0.42, w: 0.7, h: 0.28, fontSize: 15, bold: true, color: C.background1, rtlMode: false, lang: "en-US", align: "left", objectName: an(g, "l0") });
        tx(s, "|1⟩", { x: cxp + 0.12, y: cy + r + 0.12, w: 0.7, h: 0.28, fontSize: 15, bold: true, color: C.background1, rtlMode: false, lang: "en-US", align: "left", objectName: an(g, "l1") });
      }
      tx(s, p.body, { x: x + 0.4, y: 4.6, w: pw - 0.8, h: 1.25, fontSize: 16, color: ink, valign: "top", objectName: an(g, "body") });
    });
    shape(s, S.roundRect, { x: MX, y: 6.05, w: CW, h: 0.75, fill: { color: C.accent4 }, rectRadius: 0.16, objectName: an(3, "note") });
    tx(s, d.note, { x: MX + 0.4, y: 6.05, w: CW - 0.8, h: 0.75, fontSize: 17, bold: true, color: C.text1, valign: "middle", objectName: an(3, "note_t") });
    return s;
  };

  T.stats = (d) => {
    const s = newSlide("DARK", "vortex", d.notes);
    title(s, d.title);
    const gap = 0.3, w = (CW - 2 * gap) / 3;
    d.stats.forEach((st, i) => {
      const x = MX + i * (w + gap), g = i + 1;
      shape(s, S.roundRect, { x, y: 1.75, w, h: 3.6, fill: { color: C.text2 }, rectRadius: 0.2, shadow: sh(), objectName: an(g, "card") });
      tx(s, st.q, { x: x + 0.3, y: 1.95, w: w - 0.6, h: 0.5, fontSize: 20, bold: true, color: C.accent1, valign: "middle", objectName: an(g, "q") });
      tx(s, st.runs, { x: x + 0.3, y: 2.6, w: w - 0.6, h: 1.4, fontSize: 40, bold: true, color: C.accent4, valign: "middle", objectName: an(g, "big") });
      tx(s, st.text, { x: x + 0.3, y: 4.05, w: w - 0.6, h: 1.2, fontSize: 16, color: C.background1, valign: "top", objectName: an(g, "text") });
    });
    shape(s, S.roundRect, { x: MX, y: 5.65, w: CW, h: 1.05, fill: { color: C.accent4 }, rectRadius: 0.16, objectName: an(4, "note") });
    tx(s, d.note, { x: MX + 0.4, y: 5.65, w: CW - 0.8, h: 1.05, fontSize: 18, bold: true, color: C.text1, valign: "middle", objectName: an(4, "note_t") });
    return s;
  };

  T.stack = (d) => {
    const s = newSlide("CONTENT", "push", d.notes);
    title(s, d.title);
    const layers = d.layers, n = layers.length, top = 1.7, h = 4.9 / n;
    layers.forEach((l, i) => {
      const inset = i * 0.3, y = top + i * h, g = i + 1;
      const frac = i / (n - 1);
      shape(s, S.roundRect, { x: MX + inset, y, w: 6.6 - 2 * inset, h: h - 0.1, fill: { color: i === n - 1 ? C.accent1 : i === 0 ? C.background2 : C.text2, transparency: i === 0 || i === n - 1 ? 0 : Math.round(60 - frac * 50) }, rectRadius: 0.1, objectName: an(g, "layer") });
      const ink = i === 0 ? C.text1 : i === n - 1 ? C.text1 : C.background1;
      tx(s, l.temp, { x: MX + inset + 0.25, y: y + 0.08, w: 6.6 - 2 * inset - 0.5, h: 0.38, fontSize: 16, bold: true, color: ink, valign: "middle", rtlMode: false, lang: "en-US", align: "start", objectName: an(g, "temp") });
      tx(s, l.name, { x: MX + inset + 0.25, y: y + 0.46, w: 6.6 - 2 * inset - 0.5, h: h - 0.62, fontSize: 14, color: ink, valign: "top", objectName: an(g, "name") });
    });
    d.points.forEach((p, i) => {
      const y = 1.75 + i * 1.65, g = n + 1 + i;
      shape(s, S.roundRect, { x: 7.5, y, w: 5.23, h: 1.5, fill: { color: C.background2 }, rectRadius: 0.16, objectName: an(g, "pc") });
      iconCircle(s, p.icon, 7.75, y + 0.35, 0.8, pal(i), g);
      tx(s, [{ text: p.head, options: { bold: true, fontSize: 18, breakLine: true } }, { text: p.body, options: { fontSize: 15 } }], { x: 8.8, y: y + 0.08, w: 3.8, h: 1.35, color: C.text1, valign: "middle", objectName: an(g, "pt") });
    });
    return s;
  };

  T.flow3 = (d) => {
    const s = newSlide("CONTENT", "conveyor", d.notes);
    title(s, d.title);
    const n = d.steps.length, gapW = 0.8, w = (CW - gapW * (n - 1)) / n;
    d.steps.forEach((st, i) => {
      const x = MX + i * (w + gapW), g = i + 1;
      shape(s, S.roundRect, { x, y: 1.75, w, h: 3.6, fill: { color: i === 1 ? C.text2 : C.background2 }, rectRadius: 0.18, objectName: an(g, "card") });
      const ink = i === 1 ? C.background1 : C.text1;
      iconCircle(s, st.icon, x + w / 2 - 0.5, 2.0, 1.0, pal(i), g);
      tx(s, st.label, { x: x + 0.25, y: 3.2, w: w - 0.5, h: 0.5, fontSize: 21, bold: true, color: i === 1 ? C.accent4 : C.text2, align: "center", valign: "middle", objectName: an(g, "label") });
      tx(s, st.text, { x: x + 0.25, y: 3.8, w: w - 0.5, h: 1.5, fontSize: 15, color: ink, align: "center", valign: "top", objectName: an(g, "text") });
      if (i < n - 1) img(s, icon(rtl ? "FaArrowLeft" : "FaArrowRight", HEX.dk1), { x: x + w + 0.2, y: 3.35, w: 0.4, h: 0.4, objectName: an(g, "arrow") });
    });
    const g = n + 1;
    shape(s, S.roundRect, { x: MX, y: 5.65, w: CW, h: 1.05, fill: { color: C.accent4 }, rectRadius: 0.16, objectName: an(g, "note") });
    tx(s, d.note, { x: MX + 0.4, y: 5.65, w: CW - 0.8, h: 1.05, fontSize: 18, bold: true, color: C.text1, valign: "middle", objectName: an(g, "note_t") });
    return s;
  };

  T.myths = (d) => {
    const s = newSlide("CONTENT", "doors", d.notes);
    title(s, d.title);
    const rh = 1.5, colW = (CW - 0.5) / 2;
    tx(s, d.mythLabel, { x: MX, y: 1.55, w: colW, h: 0.4, fontSize: 16, bold: true, color: HEX.accent3 === "x" ? C.text2 : C.text2, charSpacing: rtl ? 0 : 3, objectName: an(1, "ml") });
    tx(s, d.factLabel, { x: MX + colW + 0.5, y: 1.55, w: colW, h: 0.4, fontSize: 16, bold: true, color: C.text2, charSpacing: rtl ? 0 : 3, objectName: an(1, "fl") });
    d.rows.forEach((r, i) => {
      const y = 2.0 + i * (rh + 0.2), g = i + 1;
      shape(s, S.roundRect, { x: MX, y, w: colW, h: rh, fill: { color: C.background2 }, rectRadius: 0.14, objectName: an(g, "m") });
      img(s, icon("FaTimesCircle", HEX.accent3), { x: MX + 0.3, y: y + rh / 2 - 0.25, w: 0.5, h: 0.5, objectName: an(g, "ico_x") });
      tx(s, r.myth, { x: MX + 1.0, y, w: colW - 1.3, h: rh, fontSize: 18, bold: true, color: C.text1, valign: "middle", objectName: an(g, "mt") });
      shape(s, S.roundRect, { x: MX + colW + 0.5, y, w: colW, h: rh, fill: { color: C.text2 }, rectRadius: 0.14, objectName: an(g, "f") });
      img(s, icon("FaCheckCircle", HEX.accent5), { x: MX + colW + 0.8, y: y + rh / 2 - 0.25, w: 0.5, h: 0.5, objectName: an(g, "ico_v") });
      tx(s, r.fact, { x: MX + colW + 1.5, y, w: colW - 1.3, h: rh, fontSize: 17, color: C.background1, valign: "middle", objectName: an(g, "ft") });
    });
    return s;
  };

  T.hybrid = (d) => {
    const s = newSlide("CONTENT", "push", d.notes);
    title(s, d.title);
    shape(s, S.roundRect, { x: MX, y: 1.7, w: 7.4, h: 4.9, fill: { color: C.background2 }, line: { color: C.text2, width: 1.5, dashType: "dash" }, rectRadius: 0.2, objectName: an(1, "dc") });
    tx(s, d.dc, { x: MX + 0.3, y: 1.8, w: 6.8, h: 0.45, fontSize: 16, bold: true, color: C.text2, objectName: an(1, "dct") });
    d.chips.forEach((c, i) => {
      const x = MX + 0.3 + i * 2.3, g = i + 2;
      const dark = i === 2;
      shape(s, S.roundRect, { x, y: 2.5, w: 2.1, h: 3.7, fill: { color: dark ? C.text2 : C.background1 }, line: { color: dark ? C.accent1 : C.text2, width: dark ? 3 : 1.25 }, rectRadius: 0.14, shadow: sh(), objectName: an(g, "chip") });
      iconCircle(s, c.icon, x + 0.55, 2.7, 1.0, dark ? C.accent1 : pal(i + 1), g);
      tx(s, c.name, { x: x + 0.1, y: 3.85, w: 1.9, h: 0.6, fontSize: 24, bold: true, color: dark ? C.accent4 : C.text2, align: "center", valign: "middle", rtlMode: false, lang: "en-US", objectName: an(g, "nm") });
      tx(s, c.text, { x: x + 0.15, y: 4.5, w: 1.8, h: 1.6, fontSize: 14, color: dark ? C.background1 : C.text1, align: "center", valign: "top", objectName: an(g, "tt") });
    });
    d.points.forEach((p, i) => {
      const y = 1.7 + i * 1.7, g = 6 + i;
      shape(s, S.roundRect, { x: 8.3, y, w: 4.43, h: 1.55, fill: { color: i === 2 ? C.accent4 : C.text2 }, rectRadius: 0.16, objectName: an(g, "pc") });
      tx(s, [{ text: p.head, options: { bold: true, fontSize: 18, breakLine: true, color: i === 2 ? C.text1 : C.accent4 } }, { text: p.body, options: { fontSize: 15, color: i === 2 ? C.text1 : C.background1 } }], { x: 8.55, y: y + 0.05, w: 3.95, h: 1.45, valign: "middle", objectName: an(g, "pt") });
    });
    return s;
  };

  T.code = (d) => {
    const s = newSlide("CONTENT", "push", d.notes);
    title(s, d.title);
    const lines = d.code.split("\n"), fs = 17, h = 0.9 + lines.length * 0.31;
    shape(s, S.roundRect, { x: MX, y: 1.75, w: 6.6, h, fill: { color: C.text1 }, rectRadius: 0.14, shadow: sh(), objectName: an(1, "code") });
    [C.accent3, C.accent4, C.accent5].forEach((c, i) => shape(s, S.ellipse, { x: MX + 0.28 + i * 0.26, y: 1.99, w: 0.15, h: 0.15, fill: { color: c }, objectName: an(1, "dot") }));
    s.addText(lines.flatMap((l) => highlight(l, C, fs)), { x: X(MX + 0.35, 5.9), y: 2.45, w: 5.9, h: h - 0.9, isTextBox: true, margin: 0, valign: "top", align: "left", rtlMode: false, lang: "en-US", objectName: an(1, "code_t") });
    d.points.forEach((p, i) => {
      const y = 1.75 + i * 1.62, g = i + 2;
      shape(s, S.roundRect, { x: 7.5, y, w: 5.23, h: 1.5, fill: { color: C.background2 }, rectRadius: 0.16, objectName: an(g, "pc") });
      iconCircle(s, p.icon, 7.75, y + 0.35, 0.8, pal(i), g);
      tx(s, [{ text: p.head, options: { bold: true, fontSize: 18, breakLine: true } }, { text: p.body, options: { fontSize: 15 } }], { x: 8.8, y: y + 0.08, w: 3.8, h: 1.35, color: C.text1, valign: "middle", objectName: an(g, "pt") });
    });
    return s;
  };

  T.qa = (d) => {
    const s = newSlide("CONTENT", "doors", d.notes);
    title(s, d.title);
    d.items.forEach((it, i) => {
      const y = 1.65 + i * 1.7, g = i + 1;
      shape(s, S.roundRect, { x: MX, y, w: CW, h: 1.55, fill: { color: C.background2 }, rectRadius: 0.16, objectName: an(g, "q") });
      shape(s, S.ellipse, { x: MX + 0.3, y: y + 0.4, w: 0.75, h: 0.75, fill: { color: pal(i) }, objectName: an(g, "ico_n") });
      tx(s, String(i + 1), { x: MX + 0.3, y: y + 0.4, w: 0.75, h: 0.75, fontSize: 26, bold: true, color: C.text1, align: "center", valign: "middle", rtlMode: false, lang: "en-US", objectName: an(g, "ico_nt") });
      tx(s, it.q, { x: MX + 1.3, y: y + 0.05, w: CW - 1.6, h: 0.75, fontSize: 21, bold: true, color: C.text1, valign: "middle", objectName: an(g, "qt") });
      shape(s, S.roundRect, { x: MX + 1.3, y: y + 0.82, w: CW - 1.6, h: 0.62, fill: { color: C.text2 }, rectRadius: 0.12, objectName: ak(g, "ans") });
      tx(s, [{ text: it.a, options: { color: C.background1 } }], { x: MX + 1.55, y: y + 0.82, w: CW - 2.1, h: 0.62, fontSize: 17, valign: "middle", objectName: ak(g, "ans_t") });
    });
    return s;
  };

  T.summary = (d) => {
    const s = newSlide("DARK", "vortex", d.notes);
    title(s, d.title);
    const pitch = 0.98;
    d.items.forEach((t, i) => {
      const y = 1.7 + i * pitch, g = i + 1;
      img(s, icon("FaCheckCircle", HEX.accent5), { x: MX, y: y + 0.05, w: 0.5, h: 0.5, objectName: an(g, "ico_ck") });
      tx(s, t, { x: MX + 0.8, y, w: 7.2, h: pitch - 0.1, fontSize: 19, color: C.background1, valign: "top", objectName: an(g, "tt") });
    });
    const g = d.items.length + 1;
    shape(s, S.roundRect, { x: 9.0, y: 1.7, w: 3.73, h: 4.95, fill: { color: C.accent4 }, rectRadius: 0.2, shadow: sh(), objectName: an(g, "dc") });
    img(s, icon("FaComments", HEX.dk1), { x: 9.4, y: 2.05, w: 0.7, h: 0.7, objectName: an(g, "ico_dc") });
    tx(s, d.discussLabel, { x: 9.4, y: 2.95, w: 3.0, h: 0.4, fontSize: 15, bold: true, color: C.text1, charSpacing: rtl ? 0 : 3, objectName: an(g, "dl") });
    tx(s, d.discuss, { x: 9.4, y: 3.45, w: 3.0, h: 3.0, fontSize: 18, color: C.text1, valign: "top", objectName: an(g, "dt") });
    return s;
  };

  T.sources = (d) => {
    const s = newSlide("CONTENT", "fade", d.notes);
    title(s, d.title);
    d.items.forEach((it, i) => {
      const y = 1.7 + i * 0.98, g = i + 1;
      shape(s, S.roundRect, { x: MX, y, w: CW, h: 0.85, fill: { color: C.background2 }, rectRadius: 0.12, objectName: an(g, "r") });
      iconCircle(s, it.icon, MX + 0.2, y + 0.13, 0.6, pal(i), g);
      tx(s, [{ text: it.head + "  ", options: { bold: true, fontSize: 18 } }, { text: it.body, options: { fontSize: 15 } }], { x: MX + 1.1, y, w: CW - 1.4, h: 0.85, color: C.text1, valign: "middle", objectName: an(g, "rt") });
    });
    tx(s, d.note, { x: MX, y: 6.55, w: CW, h: 0.35, fontSize: 13, color: C.text2, objectName: an(8, "n") });
    return s;
  };

  return { pres, T, metas, async save(file) {
    await pres.writeFile({ fileName: file });
    await addMotion(file, metas);
    await applyTheme(file, THEME);
  } };
}

module.exports = { createDeck, prerender, THEME, HEX };
