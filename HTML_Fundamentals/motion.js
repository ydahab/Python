// Post-processes a pptxgenjs file: adds slide transitions and entrance animations.
// Shapes named a<N>_label play automatically in group order after the slide appears;
// shapes named k<N>_label play on click. Names starting with "ico" zoom in, the rest fade + rise.
const JSZip = require("jszip");
const fs = require("fs");

const NS_MC = "http://schemas.openxmlformats.org/markup-compatibility/2006";
const NS_P14 = "http://schemas.microsoft.com/office/powerpoint/2010/main";

const p14 = (inner, dur = 1100) =>
  `<mc:AlternateContent xmlns:mc="${NS_MC}"><mc:Choice xmlns:p14="${NS_P14}" Requires="p14">` +
  `<p:transition spd="slow" p14:dur="${dur}">${inner}</p:transition></mc:Choice>` +
  `<mc:Fallback><p:transition spd="med"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>`;

const TRANSITIONS = {
  fade: () => `<p:transition spd="med"><p:fade/></p:transition>`,
  push: () => `<p:transition spd="med"><p:push dir="l"/></p:transition>`,
  ripple: () => p14(`<p14:ripple/>`, 1600),
  prism: () => p14(`<p14:prism/>`, 1300),
  vortex: () => p14(`<p14:vortex dir="r"/>`, 1300),
  doors: () => p14(`<p14:doors dir="vert"/>`, 1100),
  window: () => p14(`<p14:window dir="vert"/>`, 1100),
  conveyor: () => p14(`<p14:conveyor dir="l"/>`, 1100),
};

function buildTiming(xml) {
  const picIds = new Set();
  for (const m of xml.matchAll(/<p:pic>[\s\S]*?<\/p:pic>/g)) {
    const id = m[0].match(/<p:cNvPr id="(\d+)"/);
    if (id) picIds.add(id[1]);
  }
  const items = [];
  for (const m of xml.matchAll(/<p:cNvPr id="(\d+)" name="([ak])(\d+)_([^"]*)"/g)) {
    items.push({ id: m[1], click: m[2] === "k", group: +m[3], label: m[4], pic: picIds.has(m[1]) });
  }
  if (!items.length) return "";

  let nid = 2;
  const next = () => ++nid;

  const effect = (it, nodeType, delay) => {
    const grp = it.pic ? "" : ` grpId="0"`;
    const zoom = it.label.startsWith("ico");
    const tgt = `<p:tgtEl><p:spTgt spid="${it.id}"/></p:tgtEl>`;
    const dur = zoom ? 500 : 650;
    let body =
      `<p:set><p:cBhvr><p:cTn id="${next()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>${tgt}` +
      `<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>` +
      `<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${next()}" dur="${dur}"/>${tgt}</p:cBhvr></p:animEffect>`;
    const tav = (attr, from, to) =>
      `<p:anim calcmode="lin" valueType="num"><p:cBhvr additive="base"><p:cTn id="${next()}" dur="${dur}" fill="hold"/>${tgt}` +
      `<p:attrNameLst><p:attrName>${attr}</p:attrName></p:attrNameLst></p:cBhvr><p:tavLst>` +
      `<p:tav tm="0"><p:val><p:strVal val="${from}"/></p:val></p:tav><p:tav tm="100000"><p:val><p:strVal val="${to}"/></p:val></p:tav></p:tavLst></p:anim>`;
    if (zoom) body += tav("ppt_w", "0", "#ppt_w") + tav("ppt_h", "0", "#ppt_h");
    else body += tav("ppt_y", "#ppt_y+.05", "#ppt_y");
    return (
      `<p:par><p:cTn id="${next()}" presetID="${zoom ? 53 : 42}" presetClass="entr" presetSubtype="0" fill="hold"${grp} nodeType="${nodeType}">` +
      `<p:stCondLst><p:cond delay="${delay}"/></p:stCondLst><p:childTnLst>${body}</p:childTnLst></p:cTn></p:par>`
    );
  };

  const pars = [];
  // automatic groups: one outer par, staggered delays
  const auto = items.filter((i) => !i.click).sort((a, b) => a.group - b.group);
  if (auto.length) {
    const groups = [...new Set(auto.map((i) => i.group))];
    const outer = next(), inner = next();
    let first = true;
    const effs = auto
      .map((it) => {
        const delay = groups.indexOf(it.group) * 280;
        const nt = first ? "afterEffect" : "withEffect";
        first = false;
        return effect(it, nt, delay);
      })
      .join("");
    pars.push(
      `<p:par><p:cTn id="${outer}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst>` +
        `<p:par><p:cTn id="${inner}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${effs}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`
    );
  }
  // click groups: one outer par per group
  const clicks = items.filter((i) => i.click);
  for (const g of [...new Set(clicks.map((i) => i.group))].sort((a, b) => a - b)) {
    const outer = next(), inner = next();
    let first = true;
    const effs = clicks
      .filter((i) => i.group === g)
      .map((it) => {
        const nt = first ? "clickEffect" : "withEffect";
        first = false;
        return effect(it, nt, 0);
      })
      .join("");
    pars.push(
      `<p:par><p:cTn id="${outer}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst>` +
        `<p:par><p:cTn id="${inner}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${effs}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`
    );
  }

  const bld = items
    .filter((i) => !i.pic)
    .map((i) => `<p:bldP spid="${i.id}" grpId="0" animBg="1"/>`)
    .join("");
  return (
    `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>` +
    `<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${pars.join("")}</p:childTnLst></p:cTn>` +
    `<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>` +
    `<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>` +
    `</p:childTnLst></p:cTn></p:par></p:tnLst>${bld ? `<p:bldLst>${bld}</p:bldLst>` : ""}</p:timing>`
  );
}

async function addMotion(file, metas) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  for (let i = 0; i < metas.length; i++) {
    const name = `ppt/slides/slide${i + 1}.xml`;
    let xml = await zip.file(name).async("string");
    const trans = (TRANSITIONS[metas[i].transition] || TRANSITIONS.fade)();
    const timing = buildTiming(xml);
    const inject = trans + timing;
    if (xml.includes("</p:clrMapOvr>")) xml = xml.replace("</p:clrMapOvr>", "</p:clrMapOvr>" + inject);
    else xml = xml.replace("</p:sld>", inject + "</p:sld>");
    zip.file(name, xml);
  }
  const out = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  fs.writeFileSync(file, out);
}

module.exports = { addMotion };
