const path = require("path");
const { createDeck, prerenderIcons } = require("./lib");
const lessons = [...require("./lessons"), ...require("./lessons_more")];

(async () => {
  await prerenderIcons();
  const out = process.env.OUT_DIR || path.join(__dirname, "decks");
  require("fs").mkdirSync(out, { recursive: true });
  for (const L of lessons) {
    if (process.env.ONLY && !L.file.startsWith(process.env.ONLY)) continue;
    const D = createDeck(L);
    L.build(D);
    await D.save(path.join(out, L.file));
    console.log("built", L.file, D.metas.length, "slides");
  }
})().catch((e) => { console.error(e); process.exit(1); });
