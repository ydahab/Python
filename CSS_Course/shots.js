// Writes every lesson's code files and renders real screenshots of them with headless Chromium.
const fs = require("fs");
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const page = (title, css, body, cls) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="${css}">
</head>
<body${cls ? ` class="${cls}"` : ""}>
${body.split("\n").map((l) => (l ? "  " + l : l)).join("\n")}
</body>
</html>
`;

// every runnable item of a lesson: {id, dir, title, html, css, vp, extra, out}
function items(L) {
  const out = [];
  L.examples.forEach((e, i) => out.push({ id: `l${L.n}_ex${i + 1}`, dir: `example${i + 1}`, title: `Lesson ${L.n} - Example ${i + 1}: ${e.title}`, html: e.html, css: e.css, shots: e.shots || [{ vp: e.vp }], extra: e.extra || {} }));
  const a = L.activity, c = L.challenge;
  out.push({ id: `l${L.n}_act`, dir: "activity", title: `Lesson ${L.n} - Activity: ${a.title}`, html: a.html, css: a.starter, shots: [], extra: {} });
  out.push({ id: `l${L.n}_act_sol`, dir: "activity/solution", title: `Lesson ${L.n} - Activity solution`, html: a.html, css: a.solution, shots: [{ vp: a.vp }], extra: a.extra || {} });
  out.push({ id: `l${L.n}_chal`, dir: "challenge", title: `Lesson ${L.n} - Challenge: ${c.title}`, html: c.html, css: c.starter, shots: [], extra: {} });
  out.push({ id: `l${L.n}_chal_sol`, dir: "challenge/solution", title: `Lesson ${L.n} - Challenge solution`, html: c.html, css: c.solution, shots: [{ vp: c.vp }], extra: c.extra || {}, cls: c.bodyClass });
  return out;
}

async function renderLessons(lessons, codeDir, assetsDir) {
  fs.mkdirSync(assetsDir, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  for (const L of lessons) {
    const list = items(L);
    for (const it of list) {
      const dir = path.join(codeDir, `lesson${L.n}`, it.dir);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), page(it.title, "style.css", it.html, it.cls));
      fs.writeFileSync(path.join(dir, "style.css"), it.css.trim() + "\n");
      it.paths = [];
      for (let k = 0; k < it.shots.length; k++) {
        const [w, h] = it.shots[k].vp;
        const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
        const pg = await ctx.newPage();
        await pg.goto("file://" + path.join(dir, "index.html"));
        await pg.waitForTimeout(150);
        if (it.extra.freeze != null) await pg.addStyleTag({ content: `*{animation-play-state:paused !important;animation-delay:${it.extra.freeze}s !important}` });
        if (it.extra.hover) { await pg.hover(it.extra.hover); }
        await pg.waitForTimeout(it.extra.wait || 120);
        const file = path.join(assetsDir, `${it.id}_${k}.png`);
        await pg.screenshot({ path: file });
        it.paths.push({ path: file, w, h, label: it.shots[k].label });
        await ctx.close();
      }
    }
    // diagram
    const dg = L.diagram;
    const [w, h] = dg.vp;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    const pg = await ctx.newPage();
    await pg.setContent(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box;margin:0}body{font-family:Arial,Helvetica,sans-serif;background:#fff;width:${w}px;height:${h}px;overflow:hidden}</style></head><body>${dg.html}</body></html>`);
    await pg.waitForTimeout(150);
    const file = path.join(assetsDir, `l${L.n}_diagram.png`);
    await pg.screenshot({ path: file });
    L._diagramImg = { path: file, w, h };
    await ctx.close();
    L._items = list;
  }
  await browser.close();
}
module.exports = { renderLessons, items };
