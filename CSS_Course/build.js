const path = require("path");
const fs = require("fs");
const { createDeck, prerenderIcons } = require("./engine");
const { renderLessons, items } = require("./shots");
const lessons = fs.readdirSync(path.join(__dirname, "lessons")).filter((f) => /^lesson\d+\.js$/.test(f)).sort().map((f) => require("./lessons/" + f));

(async () => {
  const only = process.env.ONLY ? process.env.ONLY.split(",").map(Number) : null;
  const sel = lessons.filter((L) => !only || only.includes(L.n));
  await renderLessons(sel, path.join(__dirname, "code"), path.join(__dirname, "assets"));
  await prerenderIcons();
  const out = process.env.OUT_DIR || path.join(__dirname, "decks");
  fs.mkdirSync(out, { recursive: true });
  for (const L of sel) {
    const byId = Object.fromEntries(L._items.map((i) => [i.id, i]));
    const imgs = (id) => byId[id].paths;
    const D = createDeck(L);
    const T = D.T;
    T.title({ title: L.title, subtitle: L.subtitle, meta: L.meta, notes: L.notes });
    T.objectives({ objectives: L.objectives, terms: L.terms, notes: L.objNotes });
    T.concept({ title: L.concept.title, cards: L.concept.cards });
    T.diagram({ title: L.diagram.title, img: L._diagramImg, captions: L.diagram.captions });
    L.examples.forEach((e, i) => {
      T.example({ k: i + 1, title: e.title, intro: e.intro, css: e.css.trim(), ann: e.ann, imgs: imgs(`l${L.n}_ex${i + 1}`), htmlNote: e.html, file: "style.css", url: `lesson${L.n}/example${i + 1}/index.html` });
    });
    T.realworld(L.realworld);
    T.mistakes({ items: L.mistakes });
    T.tips({ items: L.tips });
    T.task({ kind: "activity", ...L.activity, imgs: imgs(`l${L.n}_act_sol`), url: `lesson${L.n}/activity/solution/index.html`, start: `code/lesson${L.n}/activity/`, solution: `code/lesson${L.n}/activity/solution/` });
    T.task({ kind: "challenge", ...L.challenge, imgs: imgs(`l${L.n}_chal_sol`), url: `lesson${L.n}/challenge/solution/index.html`, start: `code/lesson${L.n}/challenge/`, solution: `code/lesson${L.n}/challenge/solution/`, goalLabel: "Target: match this result" });
    T.quiz({ items: L.quiz });
    T.summary({ points: L.summary, next: L.next });
    await D.save(path.join(out, L.file));
    console.log("built", L.file, D.metas.length, "slides");
  }
})().catch((e) => { console.error(e); process.exit(1); });
