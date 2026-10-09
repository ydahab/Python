const dev = (w, h, label, inner, st = "") => `<div style="display:flex;flex-direction:column;align-items:center"><div style="width:${w}px;height:${h}px;border:5px solid #10132B;border-radius:16px;background:#fff;padding:8px;display:flex;flex-direction:column;gap:6px;overflow:hidden;${st}">${inner}</div><div style="margin-top:8px;font:bold 17px Arial;color:#2B3A8F">${label}</div></div>`;
const b = (c, st = "") => `<div style="background:${c};border-radius:5px;${st}"></div>`;

module.exports = {
  n: 6, file: "CSS_Lesson6_Responsive_Design.pptx", short: "Responsive Design",
  title: "Responsive Design", subtitle: "One website that looks right on phones, tablets and computers",
  meta: "High school  |  Prior knowledge: Lessons 1-5  |  ~50 min",
  objectives: [
    "Explain why pages need the viewport meta tag and flexible units",
    "Write media queries with a mobile-first approach",
    "Build fluid layouts with max-width, grid, clamp() and relative units",
  ],
  terms: [
    { t: "Viewport", d: "The visible area of the page in the browser window or on the phone screen." },
    { t: "Media query", d: "An @media rule that applies CSS only when a condition, such as screen width, is true." },
    { t: "Breakpoint", d: "The screen width where the layout changes, for example 600px." },
    { t: "Mobile-first", d: "Write the phone layout first, then add min-width media queries for larger screens." },
  ],
  concept: {
    title: "The big ideas",
    cards: [
      { h: "Tell phones the truth", b: "Without the viewport meta tag, phones pretend to be about 980px wide and shrink your page. This one line in <head> turns on real, responsive behaviour.", code: '<meta name="viewport" content="width=device-width, initial-scale=1">' },
      { h: "Be fluid by default", b: "Use percentages, fr units, max-width and rem instead of fixed pixel widths. Let images shrink with max-width: 100%. The layout then bends instead of breaking.", code: "img { max-width: 100%; }" },
      { h: "Add rules at breakpoints", b: "Start with the single-column phone layout. Then use @media (min-width: ...) to add columns when there is room. Choose breakpoints where YOUR design starts to look bad.", code: "@media (min-width: 600px)" },
    ],
  },
  diagram: {
    title: "One page, three screens", vp: [760, 500],
    captions: ["Phone (under 600px): one column. Everything is stacked.", "Tablet (600px and up): two columns for the cards.", "Desktop (900px and up): three columns and more space."],
    html: `<div style="display:flex;justify-content:center;align-items:flex-end;gap:34px;padding:50px 20px 0">
      ${dev(130, 300, "Phone", b("#2965F1", "height:30px") + b("#FFC83D", "height:55px") + b("#FF4F8B", "height:55px") + b("#22D3EE", "height:55px") + b("#C9B8FF", "height:55px"))}
      ${dev(200, 250, "Tablet", b("#2965F1", "height:30px") + `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;flex:1">${b("#FFC83D")}${b("#FF4F8B")}${b("#22D3EE")}${b("#C9B8FF")}</div>`)}
      ${dev(300, 210, "Desktop", b("#2965F1", "height:30px") + `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;flex:1">${b("#FFC83D")}${b("#FF4F8B")}${b("#22D3EE")}${b("#C9B8FF")}${b("#4ADE80")}${b("#FFC83D")}</div>`)}</div>
      <div style="text-align:center;margin-top:34px;font:16px 'Courier New',monospace;color:#10132B">&lt; 600px &#8594; 1 column &nbsp; | &nbsp; 600px+ &#8594; 2 &nbsp; | &nbsp; 900px+ &#8594; 3</div>`,
  },
  examples: [
    {
      title: "Fluid containers and images", intro: "Use percentages and max-width so content adapts instead of overflowing.",
      html: `<div class="container">\n  <div class="photo"></div>\n  <p>This photo area is always 16:9 and never wider than 700px.</p>\n</div>`,
      css: `.container {\n  width: 90%;\n  max-width: 700px;\n  margin: 0 auto;\n  font-family: Arial;\n}\n.photo {\n  aspect-ratio: 16 / 9;\n  background: linear-gradient(cyan, blue);\n  border-radius: 12px;\n}\nimg { max-width: 100%; height: auto; }`,
      ann: [
        { line: 1, text: "90% of the screen width: it shrinks with the screen." },
        { line: 2, text: "max-width stops it growing too wide on large screens." },
        { line: 6, text: "aspect-ratio keeps the 16:9 shape at any width." },
        { line: 10, text: "Rule for real images: never wider than their container, keep proportions." },
      ],
      shots: [{ vp: [560, 250], label: "Desktop (560px)" }, { vp: [260, 250], label: "Phone (260px)" }],
    },
    {
      title: "Mobile-first media queries", intro: "One column by default, two columns once the screen is at least 600px wide.",
      html: `<div class="cards">\n  <div class="card">Maths</div>\n  <div class="card">Science</div>\n  <div class="card">English</div>\n  <div class="card">Computing</div>\n</div>`,
      css: `.cards {\n  display: grid;\n  gap: 12px;\n  font-family: Arial;\n}\n.card {\n  background: #eef2ff;\n  padding: 18px;\n  border-radius: 10px;\n}\n@media (min-width: 600px) {\n  .cards {\n    grid-template-columns: 1fr 1fr;\n  }\n}`,
      ann: [
        { line: 1, text: "No columns defined: a single column (the phone layout)." },
        { line: 9, text: "@media (min-width: 600px): rules inside apply only on screens 600px or wider." },
        { line: 11, text: "Two equal columns appear when there is room." },
      ],
      shots: [{ vp: [640, 300], label: "Wide (640px)" }, { vp: [260, 300], label: "Narrow (260px)" }],
    },
    {
      title: "Fluid type and a responsive menu", intro: "clamp() sets a flexible font size; a media query switches the menu to a row.",
      html: `<h1>Class 3B</h1>\n<nav class="nav">\n  <a href="#">Home</a>\n  <a href="#">News</a>\n  <a href="#">Contact</a>\n</nav>`,
      css: `body { font-family: Arial; }\nh1 {\n  font-size: clamp(1.4rem, 5vw, 3rem);\n}\n.nav {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n@media (min-width: 600px) {\n  .nav { flex-direction: row; gap: 20px; }\n}`,
      ann: [
        { line: 2, text: "clamp(min, preferred, max): grows with the screen but stays between 1.4rem and 3rem." },
        { line: 5, text: "On phones the links are stacked in a column." },
        { line: 9, text: "From 600px the menu becomes a row." },
      ],
      shots: [{ vp: [640, 190], label: "Wide (640px)" }, { vp: [260, 190], label: "Narrow (260px)" }],
    },
  ],
  realworld: {
    title: "Real-world: one site, every device",
    items: [
      { icon: "FaMobileAlt", h: "Most visitors are on phones", b: "Many people browse mainly on a phone. A page that needs zooming and sideways scrolling loses visitors fast." },
      { icon: "FaShoppingCart", h: "Shops and services", b: "Online shops show one product per row on phones and a full grid on desktops, using exactly these techniques." },
      { icon: "FaSchool", h: "School and exam portals", b: "Students open the same portal on a computer in class and on a phone at home. Responsive CSS serves both." },
    ],
    tryIt: "open DevTools (F12) and press Ctrl+Shift+M (Cmd+Shift+M on Mac) for the device toolbar. Pick a phone, then drag the width to see your breakpoints trigger.",
  },
  mistakes: [
    { bad: "<head>\n  <title>My page</title>\n</head>", good: '<head>\n  <meta name="viewport"\n   content="width=device-width,\n   initial-scale=1">', why: "Without the viewport meta tag phones show a zoomed-out desktop page and media queries behave oddly." },
    { bad: ".page { width: 960px; }", good: ".page {\n  width: 100%;\n  max-width: 960px;\n}", why: "A fixed width forces sideways scrolling on small screens. max-width lets it shrink." },
    { bad: "@media min-width: 600px {\n  ...\n}", good: "@media (min-width: 600px) {\n  ...\n}", why: "The condition must be in parentheses. Without them the query is invalid and ignored." },
  ],
  tips: [
    { icon: "FaMobileAlt", h: "Design for the phone first", b: "Write the small-screen layout as your base, then add min-width queries. The CSS stays shorter and faster." },
    { icon: "FaSearch", h: "Test with the device toolbar", b: "Drag the viewport width slowly and add a breakpoint wherever the layout starts to look cramped." },
    { icon: "FaUniversalAccess", h: "Keep text readable", b: "Never disable zoom. Use rem for text, keep lines under about 75 characters, and make tap targets at least 44px." },
    { icon: "FaBolt", h: "Let layout tools do the work", b: "flex-wrap and grid with auto-fit and minmax() often need no media queries at all." },
  ],
  activity: {
    title: "Activity: a responsive profile page", time: "25 min",
    brief: "The HTML includes the viewport tag. Write the CSS phone-first, then add the wider layouts.",
    steps: [
      "Base styles: centre .wrap with max-width 900px and padding 16px, and make images and the avatar fluid.",
      "Make .skills a grid with gap 12px; on phones it is one column.",
      "At min-width 600px set .skills to two columns.",
      "At min-width 900px set .skills to three columns.",
      "Use clamp() for the h1 size.",
    ],
    bonus: "At 900px+ also put the intro text and avatar side by side with flexbox.",
    html: `<div class="wrap">\n  <h1>Hi, I am Nour</h1>\n  <p>I am learning web design.</p>\n  <div class="skills">\n    <div>HTML</div><div>CSS</div><div>Design</div>\n    <div>Teamwork</div><div>Maths</div><div>Chess</div>\n  </div>\n</div>`,
    starter: `/* Lesson 6 activity: responsive profile (mobile-first) */\n\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n}\n\n.wrap {\n  /* max-width, margin auto, padding */\n}\n\nh1 {\n  /* clamp() */\n}\n\n.skills {\n  /* grid + gap (one column) */\n}\n\n.skills div {\n  background: #dbe4ff;\n  padding: 16px;\n  border-radius: 10px;\n}\n\n/* @media (min-width: 600px) { ... } */\n\n/* @media (min-width: 900px) { ... } */\n`,
    solution: `* {\n  box-sizing: border-box;\n}\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n}\n.wrap {\n  max-width: 900px;\n  margin: 0 auto;\n  padding: 16px;\n}\nh1 {\n  font-size: clamp(1.5rem, 5vw, 2.6rem);\n  color: #2b3a8f;\n}\n.skills {\n  display: grid;\n  gap: 12px;\n}\n.skills div {\n  background: #dbe4ff;\n  padding: 16px;\n  border-radius: 10px;\n}\n@media (min-width: 600px) {\n  .skills {\n    grid-template-columns: 1fr 1fr;\n  }\n}\n@media (min-width: 900px) {\n  .skills {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}`,
    vp: [800, 350],
  },
  challenge: {
    title: "Challenge: a layout that rearranges", time: "30 min",
    brief: "Build a page whose sidebar sits BELOW the article on phones and BESIDE it on larger screens.",
    steps: [
      "Phone layout: .layout is a flex column with gap 16px, article first, sidebar second.",
      "At min-width 700px switch .layout to a row.",
      "Give the article flex: 1 and the sidebar a fixed 220px width at that size.",
      "Add the viewport meta tag to the HTML head (already provided) and test in DevTools.",
    ],
    bonus: "Use the order property so the sidebar appears FIRST on wide screens.",
    html: `<div class="layout">\n  <article>Article text goes here. It is the main content of the page.</article>\n  <aside>Related links</aside>\n</div>`,
    starter: `/* Lesson 6 challenge: sidebar moves below or beside */\n\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 16px;\n}\n\narticle {\n  background: #dbe4ff;\n  padding: 20px;\n  border-radius: 10px;\n}\n\naside {\n  background: #ffe4ec;\n  padding: 20px;\n  border-radius: 10px;\n}\n\n/* your layout rules here */\n`,
    solution: `body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 16px;\n}\narticle {\n  background: #dbe4ff;\n  padding: 20px;\n  border-radius: 10px;\n}\naside {\n  background: #ffe4ec;\n  padding: 20px;\n  border-radius: 10px;\n}\n.layout {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n@media (min-width: 700px) {\n  .layout {\n    flex-direction: row;\n  }\n  article {\n    flex: 1;\n  }\n  aside {\n    width: 220px;\n    order: -1;\n  }\n}`,
    vp: [760, 140],
  },
  quiz: [
    { q: "Which line makes media queries work properly on phones?", a: "The viewport meta tag: <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">." },
    { q: "What does mobile-first mean in CSS?", a: "Write the phone layout as the base styles and add min-width media queries for bigger screens." },
    { q: "Why use max-width: 960px instead of width: 960px?", mono: true, a: "max-width lets the element shrink on small screens; a fixed width causes sideways scrolling." },
  ],
  summary: [
    "Add the viewport meta tag to every page.",
    "Prefer %, fr, rem and max-width over fixed pixel sizes.",
    "Mobile-first: base styles for phones, @media (min-width: ...) for more room.",
    "clamp(), auto-fit and flex-wrap reduce the need for breakpoints.",
    "Test with the DevTools device toolbar at many widths.",
  ],
  next: "Lesson 7: Transitions, Transforms & Animations",
};
