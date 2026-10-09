const path = require("path"), fs = require("fs");
const { createDeck } = require("./engine");
const mods = fs.readdirSync(path.join(__dirname, "modules")).filter((f) => /^module\d\.js$/.test(f)).sort().map((f) => require("./modules/" + f));
(async () => {
  const only = process.env.ONLY ? process.env.ONLY.split(",").map(Number) : null;
  fs.mkdirSync(path.join(__dirname, "decks"), { recursive: true });
  for (const M of mods) {
    if (only && !only.includes(M.n)) continue;
    const D = createDeck(M);
    for (const [type, data] of M.slides) D.T[type](data);
    await D.save(path.join(__dirname, "decks", M.file));
    console.log("built", M.file, D.metas.length, "slides");
  }
})().catch((e) => { console.error(e); process.exit(1); });
