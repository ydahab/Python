// Builds playground.html, codepen.html, code/index.html, README for the downloadable pack.
const fs = require("fs");
const path = require("path");
const { items } = require("./shots");
const lessons = fs.readdirSync(path.join(__dirname, "lessons")).filter((f) => /^lesson\d+\.js$/.test(f)).sort().map((f) => require("./lessons/" + f));

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const all = [];
for (const L of lessons) for (const it of items(L)) {
  const kind = it.dir.startsWith("example") ? "Example" : it.dir.startsWith("activity") ? "Activity" : "Challenge";
  all.push({ lesson: L.n, lessonTitle: L.title, id: it.id, dir: `code/lesson${L.n}/${it.dir}`, title: it.title, html: it.html, css: it.css.trim() + "\n", cls: it.cls || "", kind });
}

// ---------- offline playground ----------
const data = JSON.stringify(all.map(({ id, title, html, css, cls, lesson }) => ({ id, title, html, css, cls, lesson }))).replace(/</g, "\\u003c");
fs.writeFileSync(path.join(__dirname, "playground.html"), `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CSS Playground (works offline)</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, sans-serif; background: #10132b; color: #fff; display: flex; flex-direction: column; height: 100vh; }
  header { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; padding: 10px 14px; background: #1d2250; }
  header h1 { font-size: 1.1rem; margin: 0 10px 0 0; color: #ffc83d; }
  select, button { font: inherit; padding: 6px 10px; border-radius: 8px; border: 0; }
  button { background: #2965f1; color: #fff; cursor: pointer; }
  button.alt { background: #ff4f8b; }
  main { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 10px; min-height: 0; }
  .col { display: flex; flex-direction: column; gap: 8px; min-height: 0; }
  label { font-size: 0.8rem; color: #ffc83d; font-weight: bold; }
  textarea { flex: 1; width: 100%; background: #0a0c1f; color: #e5e7eb; border: 1px solid #3b4290; border-radius: 8px; padding: 10px; font: 13px/1.5 "Courier New", monospace; resize: none; tab-size: 2; }
  iframe { flex: 1; width: 100%; border: 0; border-radius: 8px; background: #fff; min-height: 0; }
  @media (max-width: 800px) { main { grid-template-columns: 1fr; overflow: auto; } textarea, iframe { min-height: 220px; } }
</style>
</head>
<body>
<header>
  <h1>CSS Playground</h1>
  <select id="pick" aria-label="Choose an example"></select>
  <button id="reset" class="alt">Reset to original</button>
  <button id="copy">Copy CSS</button>
  <span style="font-size:.8rem;color:#c7d2fe">Edits are not saved. Copy your CSS into style.css to keep it.</span>
</header>
<main>
  <div class="col"><label for="html">HTML (body content)</label><textarea id="html" spellcheck="false"></textarea><label for="css">CSS</label><textarea id="css" spellcheck="false"></textarea></div>
  <div class="col"><label>Result</label><iframe id="out" title="Result"></iframe></div>
</main>
<script>
const ITEMS = ${data};
const pick = document.getElementById("pick"), html = document.getElementById("html"), css = document.getElementById("css"), out = document.getElementById("out");
let current = null;
ITEMS.forEach((it, i) => { const o = document.createElement("option"); o.value = i; o.textContent = it.title; pick.appendChild(o); });
function run() {
  const cls = current && current.cls ? ' class="' + current.cls + '"' : "";
  out.srcdoc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>' + css.value.replace(/<\\/style/gi, "") + '</style></head><body' + cls + '>' + html.value + '</body></html>';
}
function load(i) { current = ITEMS[i]; html.value = current.html; css.value = current.css; run(); }
let t; [html, css].forEach((el) => el.addEventListener("input", () => { clearTimeout(t); t = setTimeout(run, 250); }));
pick.addEventListener("change", () => load(+pick.value));
document.getElementById("reset").addEventListener("click", () => load(+pick.value));
document.getElementById("copy").addEventListener("click", () => { css.select(); try { document.execCommand("copy"); } catch (e) {} });
[html, css].forEach((el) => el.addEventListener("keydown", (e) => { if (e.key === "Tab") { e.preventDefault(); const s = el.selectionStart; el.setRangeText("  ", s, el.selectionEnd, "end"); el.dispatchEvent(new Event("input")); } }));
load(0);
</script>
</body>
</html>
`);

// ---------- CodePen prefill page (needs internet; opens each example in a new CodePen) ----------
const rows = all.filter((x) => !x.cls).map((x) => {
  const payload = JSON.stringify({ title: x.title, description: "CSS for High School", html: x.html, css: x.css, editors: "110", layout: "left" });
  return `<tr><td>${esc(x.title)}</td><td><form action="https://codepen.io/pen/define" method="POST" target="_blank"><input type="hidden" name="data" value="${esc(payload)}"><button type="submit">Open in CodePen</button></form></td></tr>`;
}).join("\n");
fs.writeFileSync(path.join(__dirname, "codepen.html"), `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Open the lessons in CodePen</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 860px; margin: 24px auto; padding: 0 16px; color: #10132b; }
  h1 { color: #2b3a8f; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 8px 10px; border-bottom: 1px solid #e0e7ff; }
  button { background: #2965f1; color: #fff; border: 0; border-radius: 8px; padding: 6px 12px; cursor: pointer; }
  .note { background: #fff4d1; padding: 10px 14px; border-radius: 8px; }
</style>
</head>
<body>
<h1>Open each example in CodePen</h1>
<p class="note">These buttons send the example's HTML and CSS to CodePen, which opens it as a new unsaved pen in a new tab. You need an internet connection; no account is needed to experiment. No internet? Use <a href="playground.html">playground.html</a>, which works offline.</p>
<table>
${rows}
</table>
</body>
</html>
`);

// ---------- code/index.html ----------
const byL = lessons.map((L) => `<h2>Lesson ${L.n}: ${esc(L.title)}</h2><ul>` + all.filter((x) => x.lesson === L.n).map((x) => `<li><a href="${x.dir.replace(/^code\//, "")}/index.html">${esc(x.title.replace(/^Lesson \d+ - /, ""))}</a></li>`).join("") + "</ul>").join("\n");
fs.writeFileSync(path.join(__dirname, "code", "index.html"), `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>CSS for High School: code</title>
<style>body{font-family:Arial,sans-serif;max-width:760px;margin:24px auto;padding:0 16px;color:#10132b}h1{color:#2b3a8f}h2{color:#2965f1;margin-top:1.4em}a{color:#c0245a}</style></head>
<body><h1>CSS for High School: code files</h1>
<p>Open any page in your browser. To edit, open the folder's <code>style.css</code> in a text editor (for example VS Code) and refresh the browser. Activity and challenge folders hold the starter files; their <code>solution</code> folders hold one possible answer. Try first, then compare.</p>
${byL}
</body></html>
`);
console.log("extras written:", all.length, "runnable items");
