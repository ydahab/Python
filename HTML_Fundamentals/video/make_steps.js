// Writes one .pptx per "build step": step_k keeps shapes of auto-groups a1..ak (shapes named a<N>_*),
// hides click groups (k<N>_*); final_full keeps everything. Used to render the entrance animations as frames.
const JSZip = require("jszip"); const fs = require("fs"); const path = require("path");
const [src, outDir] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const buf = fs.readFileSync(src);
  const zip0 = await JSZip.loadAsync(buf);
  const slides = Object.keys(zip0.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n));
  let K = 0;
  for (const n of slides) {
    const x = await zip0.file(n).async("string");
    for (const m of x.matchAll(/<p:cNvPr id="\d+" name="a(\d+)_/g)) K = Math.max(K, +m[1]);
  }
  const variants = [...Array(K + 1).keys()].map((k) => ({ name: `step_${String(k).padStart(2, "0")}`, keepA: k, keepK: false }));
  variants.push({ name: "final_noans", keepA: 999, keepK: false }, { name: "final_full", keepA: 999, keepK: true });
  for (const v of variants) {
    const zip = await JSZip.loadAsync(buf);
    for (const n of slides) {
      let x = await zip.file(n).async("string");
      const drop = (tag) => {
        x = x.replace(new RegExp(`<p:${tag}>[\\s\\S]*?</p:${tag}>`, "g"), (blk) => {
          const m = blk.match(/<p:cNvPr id="\d+" name="([ak])(\d+)_/);
          if (!m) return blk;
          const keep = m[1] === "a" ? +m[2] <= v.keepA : v.keepK;
          return keep ? blk : "";
        });
      };
      ["sp", "pic", "graphicFrame", "cxnSp"].forEach(drop);
      x = x.replace(/<mc:AlternateContent[\s\S]*?<\/mc:AlternateContent>/g, "").replace(/<p:transition[\s\S]*?<\/p:transition>/g, "").replace(/<p:timing>[\s\S]*?<\/p:timing>/g, "");
      zip.file(n, x);
    }
    fs.writeFileSync(path.join(outDir, v.name + ".pptx"), await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  }
  console.log("variants", variants.length, "maxGroup", K);
})();
