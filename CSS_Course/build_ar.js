// Arabic (RTL) version of the CSS decks. Same code and screenshots; all slide text is translated.
const path = require("path");
const fs = require("fs");
const { createDeck, prerenderIcons } = require("./engine");
const { items } = require("./shots");
const { UI_AR } = require("./lessons_ar/common");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

function merge(en, ar) {
  if (ar === undefined) return en;
  if (Array.isArray(en)) {
    if (!Array.isArray(ar)) throw new Error("array expected");
    if (typeof en[0] === "string" || en.length === 0) return ar;
    if (ar.length !== en.length) throw new Error(`length mismatch ${ar.length} vs ${en.length}`);
    return en.map((e, i) => merge(e, ar[i]));
  }
  if (en && typeof en === "object") {
    const out = { ...en };
    for (const k of Object.keys(ar)) out[k] = merge(en[k], ar[k]);
    return out;
  }
  return ar;
}

(async () => {
  const only = process.env.ONLY ? process.env.ONLY.split(",").map(Number) : null;
  const browser = await chromium.launch();
  await prerenderIcons();
  const out = process.env.OUT_DIR || path.join(__dirname, "decks_ar");
  fs.mkdirSync(out, { recursive: true });
  for (let n = 1; n <= 7; n++) {
    if (only && !only.includes(n)) continue;
    const EN = JSON.parse(JSON.stringify(require(`./lessons/lesson${n}.js`)));
    const AR = require(`./lessons_ar/lesson${n}.js`);
    const rep = AR.diagram.replace || [];
    const L = merge(EN, { ...AR, diagram: (({ replace, ...d }) => d)(AR.diagram) });
    L.dir = "rtl"; L.ui = UI_AR;
    // Arabic diagram image
    let html = EN.diagram.html;
    for (const [a, b] of rep) { if (!html.includes(a)) throw new Error(`diagram L${n}: "${a}" not found`); html = html.split(a).join(b); }
    const [w, h] = EN.diagram.vp;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    const pg = await ctx.newPage();
    await pg.setContent(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box;margin:0}body{font-family:Arial,Helvetica,sans-serif;background:#fff;width:${w}px;height:${h}px;overflow:hidden}</style></head><body>${html}</body></html>`);
    await pg.waitForTimeout(150);
    const dfile = path.join(__dirname, "assets", `ar_l${n}_diagram.png`);
    await pg.screenshot({ path: dfile });
    await ctx.close();
    // screenshots already rendered by build.js
    const byId = {};
    for (const it of items(EN)) byId[it.id] = it.shots.map((s, k) => ({ path: path.join(__dirname, "assets", `${it.id}_${k}.png`), w: s.vp[0], h: s.vp[1], label: s.label }));
    const tr = { "Wide": "عريضة", "Narrow": "ضيقة", "Desktop": "حاسوب", "Phone": "هاتف" };
    for (const k of Object.keys(byId)) byId[k].forEach((im) => { if (im.label) im.label = im.label.replace(/^(\w+) \((\d+px)\)$/, (_, a, b) => `${tr[a] || a} (${b})`); });
    const D = createDeck(L);
    const T = D.T;
    T.title({ title: L.title, subtitle: L.subtitle, meta: L.meta });
    T.objectives({ objectives: L.objectives, terms: L.terms });
    T.concept({ title: L.concept.title, cards: L.concept.cards });
    T.diagram({ title: L.diagram.title, img: { path: dfile, w, h }, captions: L.diagram.captions });
    L.examples.forEach((e, i) => T.example({ k: i + 1, title: e.title, intro: e.intro, css: e.css.trim(), ann: e.ann, imgs: byId[`l${n}_ex${i + 1}`], htmlNote: e.html, file: "style.css", url: `lesson${n}/example${i + 1}/index.html` }));
    T.realworld(L.realworld);
    T.mistakes({ items: L.mistakes });
    T.tips({ items: L.tips });
    T.task({ kind: "activity", ...L.activity, imgs: byId[`l${n}_act_sol`], url: `lesson${n}/activity/solution/index.html`, start: `code/lesson${n}/activity/`, solution: `code/lesson${n}/activity/solution/` });
    T.task({ kind: "challenge", ...L.challenge, imgs: byId[`l${n}_chal_sol`], url: `lesson${n}/challenge/solution/index.html`, start: `code/lesson${n}/challenge/`, solution: `code/lesson${n}/challenge/solution/`, goalLabel: L.ui.target });
    T.quiz({ items: L.quiz });
    T.summary({ points: L.summary, next: L.next });
    await D.save(path.join(out, L.file));
    console.log("built", L.file, D.metas.length);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
