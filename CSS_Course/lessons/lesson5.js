const cell = (t, c, st = "") => `<div style="background:${c};border-radius:8px;display:flex;align-items:center;justify-content:center;font:bold 24px Arial;color:#10132B;${st}">${t}</div>`;
const num = (t, st) => `<div style="position:absolute;font:bold 18px Arial;color:#2965F1;${st}">${t}</div>`;

module.exports = {
  n: 5, file: "CSS_Lesson5_Grid.pptx", short: "CSS Grid",
  title: "CSS Grid", subtitle: "Design whole page layouts with rows and columns",
  meta: "High school  |  Prior knowledge: Lessons 1-4  |  ~50 min",
  objectives: [
    "Create a grid with display: grid and grid-template-columns",
    "Size tracks with fr units, repeat() and gap",
    "Place and span items, and name areas with grid-template-areas",
  ],
  terms: [
    { t: "Grid container", d: "The parent element with display: grid. Its children are placed on the grid." },
    { t: "Track", d: "A single row or column of the grid." },
    { t: "fr unit", d: "A fraction of the free space: 1fr 2fr gives the second column twice the width of the first." },
    { t: "Grid line", d: "The numbered lines between tracks. A 3-column grid has 4 vertical lines (1 to 4)." },
  ],
  concept: {
    title: "The big ideas",
    cards: [
      { h: "Grid is two-dimensional", b: "Flexbox arranges items in one line at a time. Grid arranges rows AND columns together, so it suits whole page layouts and galleries.", code: "display: grid;" },
      { h: "Define the tracks", b: "grid-template-columns lists the width of each column. repeat(3, 1fr) means three equal columns that share the free space. gap adds space between tracks.", code: "repeat(3, 1fr)" },
      { h: "Place items by line or name", b: "Items fill the grid automatically. To move or stretch one, use grid-column and grid-row with span, or name areas and place items with grid-area.", code: "grid-column: span 2;" },
    ],
  },
  diagram: {
    title: "Tracks and grid lines", vp: [760, 500],
    captions: ["A grid with 3 columns and 2 rows has 4 column lines and 3 row lines.", "grid-column: 1 / 3 starts at line 1 and ends at line 3: it covers TWO columns.", "gap leaves space between tracks without extra margins."],
    html: `<div style="position:relative;padding:60px 50px 30px 60px">
      ${[1, 2, 3, 4].map((n, i) => num(n, `top:22px;left:${60 + i * 218 - 5}px`)).join("")}
      ${[1, 2, 3].map((n, i) => num(n, `left:30px;top:${60 + i * 150 + (i ? 4 : 0) - 14}px`)).join("")}
      <div style="display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);gap:12px;height:290px;border:3px dashed #8B5CF6;border-radius:6px;padding:0;background:#F5F3FF">
        ${cell("A (spans 1 / 3)", "#FFC83D", "grid-column:1/3;font-size:20px")}${cell("B", "#22D3EE")}${cell("C", "#FF4F8B")}${cell("D", "#4ADE80")}${cell("E", "#C9B8FF")}</div>
      <div style="margin-top:16px;font:15px 'Courier New',monospace;color:#10132B">grid-template-columns: repeat(3, 1fr); gap: 12px;</div></div>`,
  },
  examples: [
    {
      title: "A simple grid", intro: "Three equal columns with repeat() and a gap between the tracks.",
      html: `<div class="gallery">\n  <div>1</div><div>2</div><div>3</div>\n  <div>4</div><div>5</div><div>6</div>\n</div>`,
      css: `.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}\n.gallery div {\n  background: #2965f1;\n  color: white;\n  padding: 24px;\n  text-align: center;\n  font-family: Arial;\n}`,
      ann: [
        { line: 1, text: "display: grid makes .gallery a grid container." },
        { line: 2, text: "repeat(3, 1fr) = three equal columns." },
        { line: 3, text: "gap: 12px spaces rows and columns." },
        { line: 5, text: "Items fill the cells left to right, row by row." },
      ],
      vp: [560, 260],
    },
    {
      title: "Spanning rows and columns", intro: "An item can cover more than one cell with span.",
      html: `<div class="grid">\n  <div class="wide">1 wide</div>\n  <div>2</div>\n  <div class="tall">3 tall</div>\n  <div>4</div><div>5</div><div>6</div>\n</div>`,
      css: `.grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 10px;\n  font-family: Arial;\n}\n.grid div {\n  background: #8b5cf6;\n  color: white;\n  padding: 20px;\n  border-radius: 10px;\n}\n.wide { grid-column: span 2; }\n.tall { grid-row: span 2; }`,
      ann: [
        { line: 2, text: "Four equal columns." },
        { line: 11, text: "grid-column: span 2 makes .wide cover two columns." },
        { line: 12, text: "grid-row: span 2 makes .tall cover two rows. The grid packs the rest around it." },
      ],
      vp: [560, 290],
    },
    {
      title: "Page layout with named areas", intro: "Draw the layout in your CSS with grid-template-areas.",
      html: `<div class="page">\n  <header>Header</header>\n  <aside>Menu</aside>\n  <main>Main content</main>\n  <footer>Footer</footer>\n</div>`,
      css: `.page {\n  display: grid;\n  grid-template-columns: 130px 1fr;\n  grid-template-areas:\n    "head head"\n    "side main"\n    "foot foot";\n  gap: 8px;\n  font-family: Arial;\n}\n.page > * { background: #dbe4ff; padding: 16px; }\nheader { grid-area: head; }\naside { grid-area: side; }\nmain { grid-area: main; }\nfooter { grid-area: foot; }`,
      ann: [
        { line: 2, text: "A 130px sidebar column and a flexible main column." },
        { line: 4, text: "Each quoted string is a row; the same name side by side means that area spans." },
        { line: 10, text: ".page > * selects every direct child of .page." },
        { line: 11, text: "grid-area: head puts the header in the area named head." },
      ],
      vp: [560, 300],
    },
  ],
  realworld: {
    title: "Real-world: galleries, dashboards and magazines",
    items: [
      { icon: "FaImages", h: "Photo galleries", b: "Grid keeps images in tidy rows and columns, and span lets one feature photo be bigger than the others." },
      { icon: "FaTachometerAlt", h: "Dashboards", b: "Charts, tables and stat cards sit on a grid so every panel lines up in both directions." },
      { icon: "FaNewspaper", h: "Magazine and news layouts", b: "Large featured stories next to small ones use named areas and spans, like a printed front page." },
    ],
    tryIt: "open DevTools on a gallery or dashboard site and look for a 'grid' badge in Elements. Click it to show numbered grid lines on the page.",
  },
  mistakes: [
    { bad: ".gallery {\n  grid-template-columns: 1fr 1fr;\n}", good: ".gallery {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n}", why: "Without display: grid, the grid properties do nothing." },
    { bad: "grid-column: 1 / 3;\n/* meant columns 1 to 3 */", good: "grid-column: 1 / 4;\n/* or span 3 */", why: "The numbers are LINES, not columns. 1 / 3 covers only two columns." },
    { bad: "grid-template-columns:\n  300px 300px 300px;", good: "grid-template-columns:\n  repeat(3, 1fr);", why: "Fixed pixel tracks overflow small screens. Use fr (or minmax) so tracks adapt." },
  ],
  tips: [
    { icon: "FaThLarge", h: "Pick the right tool", b: "One row or column of items: Flexbox. A full layout with rows and columns: Grid. Use both together." },
    { icon: "FaMagic", h: "auto-fit does the maths", b: "repeat(auto-fit, minmax(160px, 1fr)) makes as many columns as fit, no media queries needed." },
    { icon: "FaSearch", h: "Show the grid lines", b: "Turn on the grid overlay in DevTools to see line numbers and track sizes while you work." },
    { icon: "FaBook", h: "Use names for page layouts", b: "grid-template-areas reads like a drawing of the page, so teammates understand it at a glance." },
  ],
  activity: {
    title: "Activity: a stats dashboard", time: "25 min",
    brief: "Create a responsive grid of stat cards without writing a single media query.",
    steps: [
      "Make .stats a grid with gap: 16px and padding: 20px.",
      "Set grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)).",
      "Style .stat with a white background, rounded corners, padding and a soft border.",
      "Make .big (the first stat) span two columns with grid-column: span 2.",
      "Style the numbers (strong) large and bold, and the labels (span) grey.",
    ],
    bonus: "Resize the browser window and watch the columns appear and disappear.",
    html: `<div class="stats">\n  <div class="stat big"><strong>1,250</strong><span>Students online</span></div>\n  <div class="stat"><strong>48</strong><span>Classes</span></div>\n  <div class="stat"><strong>92%</strong><span>Homework done</span></div>\n  <div class="stat"><strong>12</strong><span>Clubs</span></div>\n  <div class="stat"><strong>7</strong><span>Events</span></div>\n</div>`,
    starter: `/* Lesson 5 activity: dashboard grid */\n\nbody {\n  margin: 0;\n  background: #eef2ff;\n  font-family: Arial, sans-serif;\n}\n\n.stats {\n  /* grid, gap, padding, auto-fit columns */\n}\n\n.stat {\n  /* card styling */\n}\n\n.big {\n  /* span two columns */\n}\n\n.stat strong {\n  /* large number */\n}\n\n.stat span {\n  /* grey label */\n}\n`,
    solution: `body {\n  margin: 0;\n  background: #eef2ff;\n  font-family: Arial, sans-serif;\n}\n.stats {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 16px;\n  padding: 20px;\n}\n.stat {\n  background: white;\n  border: 1px solid #c7d2fe;\n  border-radius: 12px;\n  padding: 18px;\n}\n.big {\n  grid-column: span 2;\n  background: #2965f1;\n  color: white;\n}\n.stat strong {\n  display: block;\n  font-size: 2rem;\n}\n.stat span {\n  color: #64748b;\n}\n.big span {\n  color: #dbe4ff;\n}`,
    vp: [560, 300],
  },
  challenge: {
    title: "Challenge: the news front page", time: "30 min",
    brief: "Lay out a newspaper-style page using grid-template-areas. Do not edit the HTML.",
    steps: [
      "Create a 3-column grid with gap 12px.",
      "Place the headline story across the top two columns and two rows (area: lead).",
      "Put the sidebar in the third column spanning both rows (area: side).",
      "Put two smaller stories under the lead (areas: a and b) and a footer across the page.",
    ],
    bonus: "Give the lead story a larger font and a coloured top border.",
    html: `<div class="paper">\n  <article class="lead">Lead story</article>\n  <aside class="side">Weather and sports</aside>\n  <article class="a">Story A</article>\n  <article class="b">Story B</article>\n  <footer class="foot">Footer</footer>\n</div>`,
    starter: `/* Lesson 5 challenge: newspaper layout */\n\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 16px;\n}\n\n.paper > * {\n  background: #e0e7ff;\n  padding: 16px;\n  border-radius: 8px;\n}\n\n.paper {\n  /* grid, areas, gap */\n}\n`,
    solution: `body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 16px;\n}\n.paper > * {\n  background: #e0e7ff;\n  padding: 16px;\n  border-radius: 8px;\n}\n.paper {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-areas:\n    "lead lead side"\n    "a    b    side"\n    "foot foot foot";\n  gap: 12px;\n  min-height: 260px;\n}\n.lead {\n  grid-area: lead;\n  font-size: 1.4rem;\n  border-top: 6px solid #ff4f8b;\n}\n.side { grid-area: side; }\n.a { grid-area: a; }\n.b { grid-area: b; }\n.foot { grid-area: foot; }`,
    vp: [560, 320],
  },
  quiz: [
    { q: "What does grid-template-columns: 1fr 2fr 1fr create?", mono: true, a: "Three columns; the middle one is twice as wide as each of the others." },
    { q: "grid-column: 2 / 4 covers how many columns?", a: "Two (column 2 and column 3). The numbers are grid lines." },
    { q: "When would you choose Flexbox instead of Grid?", a: "For a single row or column of items, such as a navigation bar or button group." },
  ],
  summary: [
    "display: grid on the parent; children are placed in cells.",
    "grid-template-columns, repeat() and fr define flexible tracks.",
    "gap spaces tracks; span stretches an item across several.",
    "grid-template-areas lets you draw the layout with names.",
    "auto-fit with minmax() gives responsive grids without media queries.",
  ],
  next: "Lesson 6: Responsive Design",
};
