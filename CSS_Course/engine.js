// Design system + slide builders for the "CSS for High School" series.
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");

const SKILL = "/root/.claude/skills/synced/8b72e933-ae1d-4574-8bbf-f199ff5f79b6_a5dbdf70-c986-449a-819e-83c2485e3871/pptx";
const { applyTheme } = require(SKILL + "/scripts/apply_theme.js");
const { addMotion } = require("./motion");

// ---------- Theme "Stylesheet": ink indigo, CSS blue, pink, sun yellow ----------
const THEME = {
  name: "Stylesheet",
  headFontFace: "Arial",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "10132B", lt1: "FFFFFF", dk2: "2B3A8F", lt2: "EEF2FF",
    accent1: "2965F1", accent2: "FFC83D", accent3: "FF4F8B",
    accent4: "8B5CF6", accent5: "22C55E", accent6: "22D3EE",
    hlink: "2965F1", folHlink: "8B5CF6",
  },
};
const HEX = THEME.colors;
const CODE_FONT = "Courier New";
const W = 13.333, MX = 0.6, CW = W - 2 * MX;

// ---------- Icons ----------
const ICON_NAMES = ["FaCheckCircle", "FaTimesCircle", "FaLightbulb", "FaExclamationTriangle", "FaRocket", "FaGlobe", "FaBullseye",
  "FaStar", "FaClock", "FaFolderOpen", "FaCode", "FaQuestionCircle", "FaTrophy", "FaPaintBrush", "FaMobileAlt", "FaLayerGroup",
  "FaBook", "FaTools", "FaSearch", "FaMagic", "FaPuzzlePiece", "FaArrowRight", "FaDownload", "FaFlask", "FaShieldAlt",
  "FaUniversalAccess", "FaBolt", "FaCubes", "FaSitemap", "FaBroom", "FaEye", "FaKeyboard", "FaShoppingCart", "FaNewspaper", "FaSchool", "FaGraduationCap", "FaCompass", "FaImages", "FaThLarge", "FaTachometerAlt", "FaFilm", "FaHandPointer", "FaSyncAlt"];
const ICON_COLORS = [HEX.dk1, HEX.lt1, HEX.accent2];
const iconCache = {};
async function prerenderIcons() {
  const missing = ICON_NAMES.filter((n) => !fa[n]);
  if (missing.length) throw new Error("Missing icons: " + missing.join(", "));
  for (const n of ICON_NAMES)
    for (const c of ICON_COLORS) {
      const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(fa[n], { color: "#" + c, size: "256" }));
      iconCache[n + c] = "image/png;base64," + (await sharp(Buffer.from(svg)).png().toBuffer()).toString("base64");
    }
}
const icon = (name, color = HEX.dk1) => {
  const d = iconCache[name + color];
  if (!d) throw new Error("icon not cached " + name + color);
  return d;
};

// ---------- CSS syntax highlighter (stateful across lines) ----------
function makeCssHighlighter(C) {
  const stack = [];
  return function (line, fs) {
    const runs = [];
    const push = (t, color) => t && runs.push({ text: t, options: { fontFace: CODE_FONT, fontSize: fs, color } });
    let i = 0;
    while (i < line.length) {
      const rest = line.slice(i);
      let m;
      if ((m = rest.match(/^\/\*.*?\*\//))) { push(m[0], "8E97C9"); i += m[0].length; continue; }
      if ((m = rest.match(/^\s+/))) { push(m[0], C.background1); i += m[0].length; continue; }
      const top = stack[stack.length - 1];
      if (rest[0] === "}") { stack.pop(); push("}", C.background1); i++; continue; }
      if (top && top.type === "rule") {
        if ((m = rest.match(/^(--[\w-]+|[\w-]+)(\s*:)/))) {
          push(m[1], C.accent6); push(m[2], C.background1); i += m[0].length;
          const v = line.slice(i).match(/^(?:[^;}\/]|\/(?!\*))*/)[0];
          push(v, C.accent5); i += v.length; continue;
        }
        if (rest[0] === ";") { push(";", C.background1); i++; continue; }
        m = rest.match(/^(?:[^;}\/]|\/(?!\*))+/);
        push(m[0], C.accent5); i += m[0].length; continue;
      }
      m = rest.match(/^(?:[^{}\/]|\/(?!\*))+/);
      if (m) {
        const isAt = m[0].trim().startsWith("@");
        push(m[0], isAt ? C.accent4 : C.accent2); i += m[0].length;
        if (line[i] === "{") { push("{", C.background1); stack.push({ type: isAt ? "at" : "rule" }); i++; }
        continue;
      }
      push(rest[0], C.background1); i++;
    }
    if (!runs.length) push(" ", C.background1);
    runs[runs.length - 1].options.breakLine = true;
    return runs;
  };
}

// ---------- Deck factory ----------
const UI_EN = {
  pill: (n) => `LESSON ${n} OF 7`, objTitle: "Learning objective", objHead: "By the end of this lesson you can:", keyTerms: "Key terms",
  example: (k) => `Example ${k}: `, htmlUsed: "HTML used", mistakes: "Common mistakes", avoid: "Avoid", doThis: "Do this instead", why: "Why",
  tips: "Tips & best practices", time: "Time: ", hands: "Hands-on", challenge: "Challenge", goal: "Goal: your page should look like this",
  target: "Target: match this result", bonus: "Bonus: ", startFrom: "Start from:  ", checkWith: "Check with:  ", quiz: "Quick check",
  quizHint: "Think first, then click to reveal each answer.", summary: "Summary", keepGoing: "Keep going", yourCode: "Your code",
  codeDesc: (n) => `code/lesson${n}/  (examples, activity, challenge)`, practise: "Practise online",
  practiseDesc: "playground.html (works offline) or the CodePen links in codepen.html", nextLesson: "Next lesson", tryIt: "Try it yourself: ",
  footer: (n, short) => `CSS for High School  |  Lesson ${n}: ${short}`,
};
function createDeck(L) {
  const rtl = L.dir === "rtl";
  const UI = { ...UI_EN, ...(L.ui || {}) };
  const pres = new pptxgen();
  if (rtl) pres.rtlMode = true;
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = `CSS for High School - Lesson ${L.n}: ${L.short}`;
  pres.subject = "CSS for high-school students";
  pres.author = "CSS for High School";
  const C = pres.SchemeColor, S = pres.ShapeType;
  const metas = [];
  const footerText = UI.footer(L.n, L.short);
  const X = (x, w = 0) => (rtl ? W - x - w : x);
  const st = rtl ? "right" : "left", en = rtl ? "left" : "right";
  const rt = rtl ? { rtlMode: true, lang: "ar-EG" } : {};
  const footer = (color) => ({ text: { text: footerText, options: { x: X(MX, 8), y: 6.98, w: 8, h: 0.3, fontSize: 11, color, margin: 0, fontFace: THEME.bodyFontFace, align: st, ...rt } } });
  const ph = (name, type, o, text = "") => ({ placeholder: { options: { name, type, margin: 0, ...rt, ...o, ...(o.x !== undefined ? { x: X(o.x, o.w), align: o.align === "left" ? st : o.align } : {}) }, text } });
  const sn = (color) => ({ x: X(12.1, 0.63), y: 6.98, w: 0.63, h: 0.3, fontSize: 11, color, align: en });

  pres.defineSlideMaster({ title: "TITLE", background: { color: C.text1 }, objects: [
    ph("title", "title", { x: 0.8, y: 2.2, w: 7.2, h: 2.1, fontSize: 48, bold: true, color: C.background1, align: "left", valign: "bottom" }),
    ph("sub", "body", { x: 0.8, y: 4.45, w: 7.0, h: 0.9, fontSize: 22, color: C.background2, align: "left", valign: "top" })] });
  pres.defineSlideMaster({ title: "CONTENT", background: { color: C.background1 }, objects: [
    ph("title", "title", { x: MX, y: 0.38, w: CW, h: 0.85, fontSize: 34, bold: true, color: C.text1, align: "left", valign: "middle" }),
    { rect: { x: X(MX, 0.9), y: 1.25, w: 0.9, h: 0.07, fill: { color: C.accent3 } } }, footer(C.text2)], slideNumber: sn(C.text2) });
  pres.defineSlideMaster({ title: "DARK", background: { color: C.text1 }, objects: [
    ph("title", "title", { x: MX, y: 0.38, w: CW, h: 0.85, fontSize: 34, bold: true, color: C.background1, align: "left", valign: "middle" }),
    { rect: { x: X(MX, 0.9), y: 1.25, w: 0.9, h: 0.07, fill: { color: C.accent2 } } }, footer(C.background2)], slideNumber: sn(C.background2) });

  const an = (g, l) => `a${g}_${l}`;
  const ak = (g, l) => `k${g}_${l}`;
  const shadow = () => ({ type: "outer", color: "000000", blur: 10, offset: 3, angle: 90, opacity: 0.14 });
  const tx = (s, text, o) => s.addText(text, { isTextBox: true, margin: 0, fontFace: THEME.bodyFontFace, ...o });
  const newSlide = (layout, transition, notes) => {
    const s = pres.addSlide({ masterName: layout });
    metas.push({ transition: rtl && transition === "push" ? "pushr" : transition });
    if (rtl) {
      const a = { sh: s.addShape.bind(s), tx: s.addText.bind(s), im: s.addImage.bind(s) };
      const mir = (o) => (s.__local || o.x === undefined ? o : { ...o, x: W - o.x - (o.w || 0) });
      s.addShape = (t, o) => a.sh(t, mir(o));
      s.addImage = (o) => a.im(mir(o));
      s.addText = (text, o) => {
        if (o.placeholder) return a.tx(text, o);
        const first = Array.isArray(text) ? text[0] && text[0].options && text[0].options.fontFace : null;
        const code = o.fontFace === CODE_FONT || first === CODE_FONT;
        const r = mir(o);
        if (code) return a.tx(text, r);
        const lr = (t) => (typeof t === "string" ? t.replace(/(?<![\w])((?:--|[.#:@])[A-Za-z0-9][\w-]*)/g, "\u200E$1\u200E") : t);
        const txt = Array.isArray(text) ? text.map((run) => ({ ...run, text: lr(run.text) })) : lr(text);
        let al = r.align;
        al = al === undefined || al === "left" ? "right" : al === "right" ? "left" : al;
        return a.tx(txt, { ...r, align: al, rtlMode: true, lang: "ar-EG" });
      };
    }
    if (notes) s.addNotes(notes);
    return s;
  };
  const title = (s, text, g = 1) => s.addText(text, { placeholder: "title", objectName: an(g, "title") });
  const palette = [C.accent1, C.accent3, C.accent4, C.accent5, C.accent6, C.accent2];
  const onDark = (c) => c === C.accent2 || c === C.accent6 || c === C.accent5; // accents that need dark text

  function iconCircle(s, name, x, y, d, fill, g, fg = HEX.dk1) {
    s.addShape(S.ellipse, { x, y, w: d, h: d, fill: { color: fill }, objectName: an(g, "ico_bg") });
    s.addImage({ data: icon(name, fg), x: x + d * 0.27, y: y + d * 0.27, w: d * 0.46, h: d * 0.46, objectName: an(g, "ico_img") });
  }
  const numBadge = (s, n, x, y, d, fill, g, fs = 14, nameFn = an) => {
    s.addShape(S.ellipse, { x, y, w: d, h: d, fill: { color: fill }, objectName: nameFn(g, "num") });
    tx(s, String(n), { x, y, w: d, h: d, align: "center", valign: "middle", bold: true, fontSize: fs, color: onDark(fill) ? C.text1 : C.background1, fontFace: THEME.headFontFace, objectName: nameFn(g, "numt") });
  };

  // fit an image (px size) inside a box, centred
  function fit(img, bx, by, bw, bh) {
    const r = Math.min(bw / img.w, bh / img.h);
    const w = img.w * r, h = img.h * r;
    return { x: bx + (bw - w) / 2, y: by + (bh - h) / 2, w, h };
  }

  function browserFrame(s, { x, y, w, imgs, url, g, maxH }) {
    const top = 0.44;
    const gap = 0.12;
    const x0 = x;
    // all images share one height so they sit side by side
    const sumRatio = imgs.reduce((a, im) => a + im.w / im.h, 0);
    let h = Math.min(maxH, (w - gap * (imgs.length - 1)) / sumRatio);
    const totalW = imgs.reduce((a, im) => a + (im.w / im.h) * h, 0) + gap * (imgs.length - 1);
    const fw = Math.min(w, totalW);
    if (rtl) { x = W - x0 - fw; s.__local = true; }
    s.addShape(S.rect, { x, y, w: fw, h: top + h + (imgs.length > 1 ? 0.3 : 0), fill: { color: C.background1 }, line: { color: "D5DAF0", width: 1 }, shadow: shadow(), objectName: an(g, "browser") });
    s.addShape(S.rect, { x, y, w: fw, h: top, fill: { color: C.background2 }, objectName: an(g, "browser_bar") });
    [C.accent3, C.accent2, C.accent5].forEach((c, i) => s.addShape(S.ellipse, { x: x + 0.2 + i * 0.22, y: y + 0.15, w: 0.13, h: 0.13, fill: { color: c }, objectName: an(g, "browser_dot") }));
    s.addShape(S.roundRect, { x: x + 1.0, y: y + 0.07, w: fw - 1.2, h: 0.3, fill: { color: C.background1 }, rectRadius: 0.1, objectName: an(g, "browser_url") });
    tx(s, url, { x: x + 1.12, y: y + 0.07, w: fw - 1.4, h: 0.3, fontSize: 11, color: C.text2, valign: "middle", fontFace: CODE_FONT, objectName: an(g, "browser_urltext") });
    let xx = x;
    imgs.forEach((im, i) => {
      const iw = (im.w / im.h) * h;
      s.addImage({ path: im.path, x: xx, y: y + top, w: iw, h, objectName: an(g, "shot") });
      if (im.label) tx(s, im.label, { x: xx, y: y + top + h + 0.04, w: iw, h: 0.24, fontSize: 11, color: C.text2, align: "center", valign: "middle", objectName: an(g, "shot_label") });
      xx += iw + gap;
    });
    s.__local = false;
    return { w: fw, h: top + h + (imgs.length > 1 ? 0.3 : 0) };
  }

  function cssCodeBox(s, { x, y, w, lines, ann = [], file, g }) {
    const fs = lines.length > 12 ? 12 : 13;
    const lh = (fs + 4) / 72;
    const h = 0.68 + lines.length * lh + 0.18;
    if (rtl) { x = W - x - w; s.__local = true; }
    s.addShape(S.roundRect, { x, y, w, h, fill: { color: C.text1 }, rectRadius: 0.12, shadow: shadow(), objectName: an(g, "code") });
    [C.accent3, C.accent2, C.accent5].forEach((c, i) => s.addShape(S.ellipse, { x: x + 0.24 + i * 0.24, y: y + 0.2, w: 0.14, h: 0.14, fill: { color: c }, objectName: an(g, "code_dot") }));
    tx(s, file, { x: x + 1.1, y: y + 0.12, w: w - 1.35, h: 0.3, fontSize: 12, color: "8E97C9", fontFace: CODE_FONT, align: "right", objectName: an(g, "code_file") });
    const hl = makeCssHighlighter(C);
    const runs = lines.flatMap((l) => hl(l, fs));
    const ty = y + 0.62;
    tx(s, runs, { x: x + 0.78, y: ty, w: w - 0.95, h: lines.length * lh + 0.05, valign: "top", lineSpacing: fs + 4, objectName: an(g, "code_text") });
    ann.forEach((a, i) => numBadge(s, i + 1, x + 0.3, ty + a.line * lh + (lh - 0.22) / 2, 0.22, palette[i % palette.length], g, 11));
    s.__local = false;
    return { h };
  }

  const T = {};

  T.title = (d) => {
    const s = newSlide("TITLE", "ripple", d.notes);
    tx(s, "{ }", { x: 0.8, y: 0.55, w: 3, h: 1.0, fontSize: 60, bold: true, color: C.accent2, fontFace: CODE_FONT, align: rtl ? "right" : "left", objectName: an(5, "braces") });
    s.addShape(S.roundRect, { x: 0.8, y: 1.6, w: 2.9, h: 0.46, fill: { color: C.accent3 }, rectRadius: 0.23, objectName: an(1, "pill") });
    tx(s, UI.pill(L.n), { x: 0.8, y: 1.6, w: 2.9, h: 0.46, fontSize: 14, bold: true, color: C.background1, align: "center", valign: "middle", charSpacing: rtl ? 0 : 3, objectName: an(1, "pill_text") });
    s.addText(d.title, { placeholder: "title", objectName: an(2, "title") });
    s.addText(d.subtitle, { placeholder: "sub", objectName: an(3, "sub") });
    tx(s, d.meta, { x: 0.8, y: 5.55, w: 7, h: 0.4, fontSize: 16, color: C.accent2, objectName: an(4, "meta") });
    // box-model decor
    const layers = [[8.35, 1.35, 4.5, 4.9, C.accent2, 25], [8.85, 1.85, 3.5, 3.9, C.accent3, 0], [9.3, 2.3, 2.6, 3.0, C.accent4, 0], [9.7, 2.7, 1.8, 2.1, C.accent1, 0]];
    layers.forEach(([x, y, w, h, c, t], i) => s.addShape(S.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: c, transparency: t }, objectName: an(5 + i, "layer") }));
    tx(s, "CSS", { x: 9.7, y: 2.7, w: 1.8, h: 2.1, align: "center", valign: "middle", fontSize: 34, bold: true, color: C.background1, objectName: an(9, "cssword") });
    return s;
  };

  T.objectives = (d) => {
    const s = newSlide("CONTENT", "fade", d.notes);
    title(s, UI.objTitle);
    s.addShape(S.roundRect, { x: MX, y: 1.65, w: 6.0, h: 5.1, fill: { color: C.background2 }, rectRadius: 0.12, objectName: an(2, "panel") });
    tx(s, UI.objHead, { x: MX + 0.35, y: 1.85, w: 5.3, h: 0.5, fontSize: 19, bold: true, color: C.text2, objectName: an(2, "head") });
    d.objectives.forEach((o, i) => {
      const y = 2.55 + i * 1.4;
      iconCircle(s, "FaCheckCircle", MX + 0.35, y + 0.1, 0.6, C.accent5, 3 + i);
      tx(s, o, { x: MX + 1.15, y, w: 4.55, h: 1.2, fontSize: 18, color: C.text1, valign: "middle", objectName: an(3 + i, "obj") });
    });
    tx(s, UI.keyTerms, { x: 6.95, y: 1.65, w: 5.7, h: 0.5, fontSize: 19, bold: true, color: C.text2, objectName: an(6, "terms_head") });
    d.terms.forEach((t, i) => {
      const y = 2.25 + i * 1.17;
      s.addShape(S.roundRect, { x: 6.95, y, w: 1.8, h: 0.5, fill: { color: palette[i % 6] }, rectRadius: 0.1, objectName: an(6 + i, "chip") });
      tx(s, t.t, { x: 6.95, y, w: 1.8, h: 0.5, fontSize: 13, bold: true, color: onDark(palette[i % 6]) ? C.text1 : C.background1, fontFace: CODE_FONT, align: "center", valign: "middle", objectName: an(6 + i, "chip_text") });
      tx(s, t.d, { x: 8.95, y: y - 0.12, w: 3.78, h: 1.05, fontSize: 14, color: C.text1, valign: "top", objectName: an(6 + i, "def") });
    });
    return s;
  };

  T.concept = (d) => {
    const s = newSlide("CONTENT", "push", d.notes);
    title(s, d.title);
    const w = (CW - 0.6) / 3;
    d.cards.forEach((c, i) => {
      const x = MX + i * (w + 0.3), y = 1.65, g = 2 + i;
      s.addShape(S.roundRect, { x, y, w, h: 5.05, fill: { color: C.background2 }, rectRadius: 0.12, shadow: shadow(), objectName: an(g, "card") });
      s.addShape(S.rect, { x: x + 0.3, y: y + 0.0, w: 0.9, h: 0.09, fill: { color: palette[i] }, objectName: an(g, "card_bar") });
      numBadge(s, i + 1, x + 0.3, y + 0.3, 0.55, palette[i], g, 18);
      tx(s, c.h, { x: x + 0.3, y: y + 1.0, w: w - 0.6, h: 0.85, fontSize: 20, bold: true, color: C.text1, valign: "top", objectName: an(g, "card_h") });
      tx(s, c.b, { x: x + 0.3, y: y + 1.9, w: w - 0.6, h: 2.3, fontSize: 15, color: C.text1, valign: "top", objectName: an(g, "card_b") });
      if (c.code) {
        s.addShape(S.roundRect, { x: x + 0.3, y: y + 4.2, w: w - 0.6, h: 0.6, fill: { color: C.text1 }, rectRadius: 0.08, objectName: an(g, "card_codebg") });
        tx(s, c.code, { x: x + 0.3, y: y + 4.2, w: w - 0.6, h: 0.6, fontSize: 13, color: C.accent2, fontFace: CODE_FONT, align: "center", valign: "middle", objectName: an(g, "card_code") });
      }
    });
    return s;
  };

  T.diagram = (d) => {
    const s = newSlide("CONTENT", "window", d.notes);
    title(s, d.title);
    const f = fit(d.img, MX, 1.65, 7.6, 5.0);
    s.addShape(S.roundRect, { x: f.x - 0.08, y: f.y - 0.08, w: f.w + 0.16, h: f.h + 0.16, fill: { color: C.background1 }, line: { color: "D5DAF0", width: 1 }, rectRadius: 0.1, shadow: shadow(), objectName: an(2, "frame") });
    s.addImage({ path: d.img.path, ...f, objectName: an(2, "diagram") });
    d.captions.forEach((c, i) => {
      const y = 1.85 + i * 1.6, g = 3 + i;
      numBadge(s, i + 1, 8.65, y, 0.5, palette[i], g, 16);
      tx(s, c, { x: 9.35, y: y - 0.1, w: 3.4, h: 1.3, fontSize: 16, color: C.text1, valign: "top", objectName: an(g, "cap") });
    });
    return s;
  };

  T.example = (d) => {
    const s = newSlide("CONTENT", ["push", "doors", "conveyor"][(d.k - 1) % 3], d.ann.map((a, i) => `${i + 1}. ${a.text}`).join("\n"));
    title(s, UI.example(d.k) + d.title);
    tx(s, d.intro, { x: MX, y: 1.38, w: CW, h: 0.4, fontSize: 16, color: C.text2, valign: "middle", objectName: an(2, "intro") });
    const lw = 6.15;
    const cb = cssCodeBox(s, { x: MX, y: 1.95, w: lw, lines: d.css.split("\n"), ann: d.ann, file: d.file, g: 3 });
    const hy = 1.95 + cb.h + 0.15;
    const hh = 6.85 - hy;
    if (hh > 0.7) {
      s.addShape(S.roundRect, { x: MX, y: hy, w: lw, h: hh, fill: { color: C.background2 }, rectRadius: 0.1, objectName: an(5, "html") });
      tx(s, UI.htmlUsed, { x: MX + 0.2, y: hy + 0.08, w: 2, h: 0.28, fontSize: 11, bold: true, color: C.text2, objectName: an(5, "html_h") });
      let hl = d.htmlNote.split("\n");
      let cap = Math.max(2, Math.floor((hh - 0.42) / 0.18));
      if (hl.length > cap) hl = [...hl.slice(0, cap - 1), "..."];
      tx(s, hl.map((l, i) => ({ text: l, options: { breakLine: i < hl.length - 1 } })), { x: MX + 0.2, y: hy + 0.38, w: lw - 0.4, h: hh - 0.45, fontSize: 10.5, fontFace: CODE_FONT, color: C.text1, valign: "top", lineSpacing: 13, objectName: an(5, "html_text") });
    }
    const rx = 7.0, rw = W - MX - rx;
    const bf = browserFrame(s, { x: rx, y: 1.95, w: rw, imgs: d.imgs, url: d.url, g: 4, maxH: 2.75 });
    const ay = 1.95 + bf.h + 0.2;
    const pitch = Math.min(0.62, (6.9 - ay) / d.ann.length);
    d.ann.forEach((a, i) => {
      const y = ay + i * pitch, g = 6 + i;
      numBadge(s, i + 1, rx, y + 0.04, 0.25, palette[i % 6], g, 11);
      tx(s, a.text, { x: rx + 0.38, y, w: rw - 0.38, h: pitch - 0.02, fontSize: 12.5, color: C.text1, valign: "top", objectName: an(g, "ann") });
    });
    return s;
  };

  T.realworld = (d) => {
    const s = newSlide("CONTENT", "prism", d.notes);
    title(s, d.title);
    const w = (CW - 0.6) / 3;
    d.items.forEach((it, i) => {
      const x = MX + i * (w + 0.3), y = 1.65, g = 2 + i;
      s.addShape(S.roundRect, { x, y, w, h: 3.45, fill: { color: C.background2 }, rectRadius: 0.12, shadow: shadow(), objectName: an(g, "card") });
      iconCircle(s, it.icon, x + 0.3, y + 0.3, 0.8, palette[i], g);
      tx(s, it.h, { x: x + 0.3, y: y + 1.3, w: w - 0.6, h: 0.5, fontSize: 19, bold: true, color: C.text1, objectName: an(g, "card_h") });
      tx(s, it.b, { x: x + 0.3, y: y + 1.85, w: w - 0.6, h: 1.5, fontSize: 15, color: C.text1, valign: "top", objectName: an(g, "card_b") });
    });
    s.addShape(S.roundRect, { x: MX, y: 5.35, w: CW, h: 1.35, fill: { color: C.text1 }, rectRadius: 0.12, objectName: an(5, "try") });
    iconCircle(s, "FaSearch", MX + 0.35, 5.7, 0.65, C.accent2, 5);
    tx(s, [{ text: UI.tryIt, options: { bold: true, color: C.accent2 } }, { text: d.tryIt, options: { color: C.background1 } }],
      { x: MX + 1.3, y: 5.45, w: CW - 1.7, h: 1.15, fontSize: 16, valign: "middle", objectName: an(5, "try_text") });
    return s;
  };

  T.mistakes = (d) => {
    const s = newSlide("CONTENT", "fade", d.notes);
    title(s, UI.mistakes);
    const hdr = [[UI.avoid, MX], [UI.doThis, 4.85], [UI.why, 9.15]];
    hdr.forEach(([t, x], i) => tx(s, t, { x, y: 1.5, w: 4, h: 0.35, fontSize: 15, bold: true, color: ["C0245A", "15803D", "2B3A8F"][i], objectName: an(1, "hdr") }));
    d.items.forEach((m, i) => {
      const y = 1.95 + i * 1.62, g = 2 + i;
      s.addShape(S.roundRect, { x: MX, y, w: 4.1, h: 1.45, fill: { color: "FDE8EE" }, rectRadius: 0.1, objectName: an(g, "bad") });
      s.addShape(S.rect, { x: MX, y: y + 0.12, w: 0.08, h: 1.21, fill: { color: C.accent3 }, objectName: an(g, "bad_bar") });
      tx(s, m.bad, { x: MX + 0.25, y, w: 3.75, h: 1.45, fontSize: 13, fontFace: CODE_FONT, color: C.text1, valign: "middle", lineSpacing: 17, objectName: an(g, "bad_t") });
      s.addShape(S.roundRect, { x: 4.85, y, w: 4.1, h: 1.45, fill: { color: "E4F8EC" }, rectRadius: 0.1, objectName: an(g, "good") });
      s.addShape(S.rect, { x: 4.85, y: y + 0.12, w: 0.08, h: 1.21, fill: { color: C.accent5 }, objectName: an(g, "good_bar") });
      tx(s, m.good, { x: 5.1, y, w: 3.75, h: 1.45, fontSize: 13, fontFace: CODE_FONT, color: C.text1, valign: "middle", lineSpacing: 17, objectName: an(g, "good_t") });
      tx(s, m.why, { x: 9.15, y, w: 3.58, h: 1.45, fontSize: 14, color: C.text1, valign: "middle", objectName: an(g, "why") });
    });
    return s;
  };

  T.tips = (d) => {
    const s = newSlide("DARK", "vortex", d.notes);
    title(s, UI.tips);
    const w = (CW - 0.4) / 2;
    d.items.forEach((t, i) => {
      const x = MX + (i % 2) * (w + 0.4), y = 1.65 + Math.floor(i / 2) * 2.6, g = 2 + i;
      s.addShape(S.roundRect, { x, y, w, h: 2.4, fill: { color: "1D2250" }, rectRadius: 0.12, objectName: an(g, "card") });
      iconCircle(s, t.icon, x + 0.3, y + 0.3, 0.7, [C.accent2, C.accent6, C.accent5, C.accent3][i], g);
      tx(s, t.h, { x: x + 1.2, y: y + 0.3, w: w - 1.5, h: 0.7, fontSize: 19, bold: true, color: C.background1, valign: "middle", objectName: an(g, "card_h") });
      tx(s, t.b, { x: x + 0.3, y: y + 1.1, w: w - 0.6, h: 1.2, fontSize: 15, color: C.background2, valign: "top", objectName: an(g, "card_b") });
    });
    return s;
  };

  T.task = (d) => {
    const dark = d.kind === "challenge";
    const s = newSlide(dark ? "DARK" : "CONTENT", dark ? "doors" : "push", d.notes);
    title(s, d.title);
    const fg = dark ? C.background1 : C.text1;
    const chip = (x, w, label, fill, tc) => {
      s.addShape(S.roundRect, { x, y: 1.5, w, h: 0.36, fill: { color: fill }, rectRadius: 0.18, objectName: an(2, "chip") });
      tx(s, label, { x, y: 1.5, w, h: 0.36, fontSize: 12, bold: true, color: tc, align: "center", valign: "middle", objectName: an(2, "chip_t") });
    };
    chip(MX, 1.5, UI.time + d.time, C.accent2, C.text1);
    chip(MX + 1.65, 1.9, dark ? UI.challenge : UI.hands, dark ? C.accent3 : C.accent1, C.background1);
    tx(s, d.brief, { x: MX, y: 2.0, w: 6.2, h: 0.75, fontSize: 15, color: fg, valign: "top", objectName: an(3, "brief") });
    const n = d.steps.length;
    const pitch = Math.min(0.82, 3.1 / n);
    d.steps.forEach((st, i) => {
      const y = 2.85 + i * pitch, g = 4 + i;
      numBadge(s, i + 1, MX, y + 0.05, 0.34, palette[i % 6], g, 13);
      tx(s, st, { x: MX + 0.5, y, w: 5.7, h: pitch - 0.03, fontSize: 14, color: fg, valign: "top", objectName: an(g, "step") });
    });
    if (d.bonus) {
      s.addShape(S.roundRect, { x: MX, y: 6.0, w: 6.2, h: 0.8, fill: { color: dark ? "1D2250" : "FFF4D1" }, rectRadius: 0.1, objectName: an(9, "bonus") });
      tx(s, [{ text: UI.bonus, options: { bold: true, color: dark ? C.accent2 : "9A6B00" } }, { text: d.bonus, options: { color: fg } }],
        { x: MX + 0.2, y: 6.0, w: 5.8, h: 0.8, fontSize: 13.5, valign: "middle", objectName: an(9, "bonus_t") });
    }
    const rx = 7.2, rw = W - MX - rx;
    tx(s, d.goalLabel || UI.goal, { x: rx, y: 1.5, w: rw, h: 0.36, fontSize: 14, bold: true, color: dark ? C.accent2 : C.text2, valign: "middle", objectName: an(2, "goal_l") });
    const bf = browserFrame(s, { x: rx, y: 2.0, w: rw, imgs: d.imgs, url: d.url, g: 3, maxH: 3.0 });
    const fy = 2.0 + bf.h + 0.25;
    s.addShape(S.roundRect, { x: rx, y: fy, w: rw, h: 1.0, fill: { color: dark ? "1D2250" : C.background2 }, rectRadius: 0.1, objectName: an(10, "files") });
    tx(s, [{ text: UI.startFrom, options: { bold: true, color: dark ? C.accent2 : C.text2, fontFace: THEME.bodyFontFace } }, { text: d.start, options: { fontFace: CODE_FONT, color: fg, breakLine: true } },
      { text: UI.checkWith, options: { bold: true, color: dark ? C.accent2 : C.text2, fontFace: THEME.bodyFontFace } }, { text: d.solution, options: { fontFace: CODE_FONT, color: fg } }],
      { x: rx + 0.2, y: fy, w: rw - 0.4, h: 1.0, fontSize: 11.5, valign: "middle", objectName: an(10, "files_t") });
    return s;
  };

  T.quiz = (d) => {
    const s = newSlide("CONTENT", "fade", d.notes);
    title(s, UI.quiz);
    tx(s, UI.quizHint, { x: MX, y: 1.38, w: CW, h: 0.35, fontSize: 15, color: C.text2, objectName: an(2, "hint") });
    d.items.forEach((q, i) => {
      const y = 1.9 + i * 1.62, g = 3 + i;
      s.addShape(S.roundRect, { x: MX, y, w: CW, h: 1.45, fill: { color: C.background2 }, rectRadius: 0.12, objectName: an(g, "row") });
      numBadge(s, i + 1, MX + 0.3, y + 0.45, 0.55, palette[i], g, 18);
      tx(s, q.q, { x: MX + 1.15, y, w: 5.9, h: 1.45, fontSize: 16.5, color: C.text1, valign: "middle", fontFace: q.mono ? CODE_FONT : THEME.bodyFontFace, objectName: an(g, "q") });
      s.addShape(S.roundRect, { x: 7.95, y: y + 0.17, w: 4.6, h: 1.11, fill: { color: "DDF7E7" }, line: { color: C.accent5, width: 1.25 }, rectRadius: 0.1, objectName: ak(g, "ans_bg") });
      tx(s, q.a, { x: 8.15, y: y + 0.17, w: 4.2, h: 1.11, fontSize: 14.5, color: C.text1, valign: "middle", objectName: ak(g, "ans") });
    });
    return s;
  };

  T.summary = (d) => {
    const s = newSlide("CONTENT", "ripple", d.notes);
    title(s, UI.summary);
    d.points.forEach((p, i) => {
      const y = 1.65 + i * 1.02, g = 2 + i;
      iconCircle(s, "FaCheckCircle", MX, y + 0.08, 0.55, C.accent5, g);
      tx(s, p, { x: MX + 0.8, y, w: 6.3, h: 0.95, fontSize: 16.5, color: C.text1, valign: "middle", objectName: an(g, "pt") });
    });
    s.addShape(S.roundRect, { x: 8.0, y: 1.65, w: 4.73, h: 5.05, fill: { color: C.text1 }, rectRadius: 0.14, objectName: an(8, "panel") });
    tx(s, UI.keepGoing, { x: 8.35, y: 1.85, w: 4.0, h: 0.5, fontSize: 21, bold: true, color: C.accent2, objectName: an(8, "panel_h") });
    tx(s, [
      { text: UI.yourCode, options: { bold: true, color: C.accent6, breakLine: true } },
      { text: UI.codeDesc(L.n), options: { fontFace: CODE_FONT, fontSize: 12, color: C.background1, breakLine: true } },
      { text: " ", options: { fontSize: 8, breakLine: true } },
      { text: UI.practise, options: { bold: true, color: C.accent6, breakLine: true } },
      { text: UI.practiseDesc, options: { color: C.background1, breakLine: true } },
      { text: " ", options: { fontSize: 8, breakLine: true } },
      { text: UI.nextLesson, options: { bold: true, color: C.accent6, breakLine: true } },
      { text: d.next, options: { color: C.background1 } },
    ], { x: 8.35, y: 2.5, w: 4.05, h: 4.0, fontSize: 14.5, valign: "top", objectName: an(9, "panel_b") });
    return s;
  };

  return {
    T, metas, pres,
    async save(file) {
      await pres.writeFile({ fileName: file });
      await addMotion(file, metas);
      await applyTheme(file, THEME);
    },
  };
}

module.exports = { createDeck, prerenderIcons, THEME };
