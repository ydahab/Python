const path = require("path");
const { createDeck, prerender } = require("./engine");
(async () => {
  await prerender();
  const outDir = process.env.OUT_DIR || path.join(__dirname, "decks");
  require("fs").mkdirSync(outDir, { recursive: true });
  for (const lang of (process.env.ONLY || "en,ar").split(",")) {
    const L = require(`./content_${lang}.js`);
    const D = createDeck({ ...L, footer: L.footer });
    for (const sl of L.slides) {
      if (!D.T[sl.type]) throw new Error("unknown slide type " + sl.type);
      D.T[sl.type](sl);
    }
    await D.save(path.join(outDir, L.file));
    console.log("built", L.file, D.metas.length, "slides");
  }
})().catch((e) => { console.error(e); process.exit(1); });
