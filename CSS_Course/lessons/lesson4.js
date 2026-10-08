const item = (n, c, w = 90, h = 70) => `<div style="width:${w}px;height:${h}px;background:${c};border-radius:10px;color:#10132B;font:bold 26px Arial;display:flex;align-items:center;justify-content:center">${n}</div>`;

module.exports = {
  n: 4, file: "CSS_Lesson4_Flexbox.pptx", short: "Flexbox",
  title: "Layout with Flexbox", subtitle: "Arrange items in a row or column, align them and share the space",
  meta: "High school  |  Prior knowledge: Lessons 1-3  |  ~50 min",
  objectives: [
    "Turn a parent into a flex container with display: flex",
    "Align and space items with justify-content, align-items and gap",
    "Wrap and size items with flex-wrap and flex",
  ],
  terms: [
    { t: "Flex container", d: "The parent element that has display: flex. It controls the layout of its children." },
    { t: "Flex item", d: "A direct child of a flex container. Items line up in a row by default." },
    { t: "Main axis", d: "The direction items flow: horizontal for a row, vertical for a column." },
    { t: "Cross axis", d: "The direction at right angles to the main axis." },
  ],
  concept: {
    title: "The big ideas",
    cards: [
      { h: "Flex is set on the PARENT", b: "Write display: flex on the container and its direct children become flex items, lined up in a row. You almost never style the layout on the items themselves.", code: ".nav { display: flex; }" },
      { h: "Two axes, two properties", b: "justify-content places items along the main axis. align-items places them along the cross axis. flex-direction: column swaps the two axes.", code: "justify-content / align-items" },
      { h: "Items can grow, shrink and wrap", b: "flex: 1 1 180px means: may grow, may shrink, ideal width 180px. With flex-wrap: wrap, items that do not fit move to the next line. gap adds space between items.", code: "flex-wrap: wrap; gap: 16px;" },
    ],
  },
  diagram: {
    title: "Main axis and cross axis", vp: [760, 500],
    captions: ["Default: the main axis runs left to right, the cross axis top to bottom.", "justify-content: space-between pushes the first and last items to the edges.", "align-items: center centres the items on the cross axis."],
    html: `<div style="padding:24px 30px 24px 74px;position:relative">
    <div style="font:bold 20px Arial;color:#2965F1;margin:6px 0 4px">main axis  &#8594;</div>
    <div style="height:6px;background:#2965F1;border-radius:3px;margin-bottom:14px;position:relative"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;height:270px;border:3px dashed #8B5CF6;border-radius:12px;padding:16px;background:#F5F3FF;position:relative">
      ${item(1, "#FFC83D")}${item(2, "#FF4F8B", 90, 130)}${item(3, "#22D3EE", 90, 90)}
      <div style="position:absolute;left:-30px;top:20px;bottom:20px;width:6px;background:#FF4F8B;border-radius:3px"></div>
    </div>
    <div style="position:absolute;left:-38px;top:230px;transform:rotate(-90deg);font:bold 20px Arial;color:#FF4F8B;white-space:nowrap">cross axis &#8594;</div>
    <div style="margin-top:14px;font:16px 'Courier New',monospace;color:#10132B">display: flex; justify-content: space-between; align-items: center;</div></div>`,
  },
  examples: [
    {
      title: "A navigation bar", intro: "justify-content: space-between and align-items: center in one flex container.",
      html: `<nav class="nav">\n  <a class="logo" href="#">CodeClub</a>\n  <div class="links">\n    <a href="#">Home</a>\n    <a href="#">Projects</a>\n    <a href="#">Join</a>\n  </div>\n</nav>`,
      css: `body { margin: 0; font-family: Arial; }\n.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background: #1e2a78;\n  padding: 14px 20px;\n}\n.nav a { color: white; text-decoration: none; }\n.links { display: flex; gap: 18px; }`,
      ann: [
        { line: 2, text: "display: flex makes .nav a flex container: logo and links become items." },
        { line: 3, text: "space-between puts the first item at the left, the last at the right." },
        { line: 4, text: "align-items: center centres the items vertically." },
        { line: 9, text: "The links container is also flex; gap adds 18px between links." },
      ],
      vp: [560, 100],
    },
    {
      title: "Cards that wrap and share space", intro: "flex: 1 1 180px lets cards grow, shrink and wrap onto new rows.",
      html: `<div class="cards">\n  <div class="card">Maths</div>\n  <div class="card">Physics</div>\n  <div class="card">Chemistry</div>\n  <div class="card">Biology</div>\n  <div class="card">Computer Science</div>\n</div>`,
      css: `.cards {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 14px;\n  font-family: Arial;\n}\n.card {\n  flex: 1 1 150px;\n  background: #eef2ff;\n  border-radius: 12px;\n  padding: 22px;\n}`,
      ann: [
        { line: 2, text: "flex-wrap: wrap lets items move to a new line instead of squashing." },
        { line: 3, text: "gap sets the space between rows and columns." },
        { line: 7, text: "flex: 1 1 150px = grow 1, shrink 1, ideal width 150px." },
        { line: 7, text: "Result: each row fills the full width, and the last row stretches too." },
      ],
      vp: [560, 260],
    },
    {
      title: "Centre anything", intro: "The classic: centre content horizontally AND vertically with flexbox.",
      html: `<section class="hero">\n  <h1>Welcome</h1>\n  <p>Centred with a few lines of CSS</p>\n</section>`,
      css: `body { margin: 0; }\n.hero {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  min-height: 240px;\n  background: linear-gradient(blue, violet);\n  color: white;\n  font-family: Arial;\n}`,
      ann: [
        { line: 3, text: "flex-direction: column stacks items; now the main axis is vertical." },
        { line: 4, text: "So justify-content centres vertically and align-items centres horizontally." },
        { line: 6, text: "min-height gives the box room so there is something to centre inside." },
        { line: 7, text: "linear-gradient() blends colours; it is used like a background image." },
      ],
      vp: [560, 250],
    },
  ],
  realworld: {
    title: "Real-world: menus, cards and toolbars",
    items: [
      { icon: "FaCompass", h: "Navigation bars", b: "Almost every site menu is a flex container: logo on one side, links on the other, everything centred vertically." },
      { icon: "FaLayerGroup", h: "Card rows", b: "Course lists, photo galleries and team pages use wrapping flex rows that adapt to any screen width." },
      { icon: "FaMobileAlt", h: "App-like screens", b: "Toolbars, chat bubbles and buttons with icons use flex to line up an icon and text perfectly." },
    ],
    tryIt: "open DevTools on a site you use, find an element showing a small 'flex' badge in the Elements panel, and click it to see the flex overlay.",
  },
  mistakes: [
    { bad: ".item { display: flex; }", good: ".container { display: flex; }", why: "display: flex goes on the PARENT. Setting it on the items does not arrange them." },
    { bad: "flex-direction: column;\njustify-content: center;\n/* expects horizontal */", good: "flex-direction: column;\nalign-items: center;\n/* horizontal centring */", why: "With a column, the axes swap: align-items now works horizontally." },
    { bad: "body {\n  display: flex;\n  align-items: center;\n}", good: "body {\n  display: flex;\n  align-items: center;\n  min-height: 100vh;\n}", why: "Vertical centring needs height. 100vh means 100% of the viewport (window) height." },
  ],
  tips: [
    { icon: "FaBolt", h: "Use gap, not margins", b: "gap spaces items evenly without extra space at the ends. It also works with wrapping." },
    { icon: "FaPuzzlePiece", h: "Remember: row is the default", b: "flex-direction defaults to row. Add column when you want a vertical stack." },
    { icon: "FaSearch", h: "Debug with the overlay", b: "DevTools shows the container, items and free space. It makes surprising layouts easy to explain." },
    { icon: "FaBook", h: "Use flex for one dimension", b: "Flexbox lays out a row OR a column. For rows AND columns together, use Grid (next lesson)." },
  ],
  activity: {
    title: "Activity: a team page", time: "25 min",
    brief: "Build a navigation bar and a row of three profile cards with flexbox.",
    steps: [
      "Make .nav a flex container with the logo on the left, links on the right, centred vertically.",
      "Give the links container display: flex and gap: 16px.",
      "Make .team a flex container with gap: 16px and flex-wrap: wrap.",
      "Give each .member flex: 1 1 180px, padding 20px, a light background and rounded corners.",
      "Centre the text inside each member by using flex-direction: column with align-items: center.",
    ],
    bonus: "Add .avatar: a 60px circle (border-radius: 50%) in colour above each name.",
    html: `<nav class="nav">\n  <a class="logo" href="#">Class 3B</a>\n  <div class="links"><a href="#">Team</a><a href="#">News</a></div>\n</nav>\n<div class="team">\n  <div class="member"><div class="avatar"></div><strong>Omar</strong><span>Designer</span></div>\n  <div class="member"><div class="avatar"></div><strong>Salma</strong><span>Developer</span></div>\n  <div class="member"><div class="avatar"></div><strong>Karim</strong><span>Tester</span></div>\n</div>`,
    starter: `/* Lesson 4 activity: team page */\n\nbody {\n  margin: 0;\n  font-family: Arial, sans-serif;\n}\n\n.nav {\n  /* flex, space-between, centred, dark background, padding */\n}\n\n.nav a {\n  color: white;\n  text-decoration: none;\n}\n\n.links {\n  /* flex and gap */\n}\n\n.team {\n  /* flex, gap, wrap, padding */\n}\n\n.member {\n  /* flex: 1 1 180px, column layout, centred items */\n}\n\n.avatar {\n  /* bonus: coloured circle */\n}\n`,
    solution: `body {\n  margin: 0;\n  font-family: Arial, sans-serif;\n}\n.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  background: #1e2a78;\n  padding: 14px 20px;\n}\n.nav a {\n  color: white;\n  text-decoration: none;\n}\n.links {\n  display: flex;\n  gap: 16px;\n}\n.team {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n  padding: 20px;\n}\n.member {\n  flex: 1 1 180px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  padding: 20px;\n  background: #eef2ff;\n  border-radius: 12px;\n}\n.avatar {\n  width: 60px;\n  height: 60px;\n  border-radius: 50%;\n  background: #ff4f8b;\n}`,
    vp: [700, 270],
  },
  challenge: {
    title: "Challenge: header, sidebar, footer", time: "30 min",
    brief: "Build a full-page layout where the footer sticks to the bottom even with little content.",
    steps: [
      "Make body a flex column with min-height: 100vh.",
      "Make .layout a flex row; the sidebar is 160px wide and the main area takes the rest with flex: 1.",
      "Make .layout grow to fill the free space (flex: 1) so the footer is pushed to the bottom.",
      "Give header, aside, main and footer distinct background colours and padding.",
    ],
    bonus: "Make the layout stack in a column on narrow screens by using flex-wrap.",
    html: `<header>School Blog</header>\n<div class="layout">\n  <aside>Menu</aside>\n  <main>Welcome to our blog. Short pages still keep the footer at the bottom.</main>\n</div>\n<footer>© Class 3B</footer>`,
    starter: `/* Lesson 4 challenge: sticky footer layout */\n\nbody {\n  margin: 0;\n  font-family: Arial, sans-serif;\n}\n\n/* your rules here */\n`,
    solution: `body {\n  margin: 0;\n  font-family: Arial, sans-serif;\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n}\nheader {\n  background: #1e2a78;\n  color: white;\n  padding: 16px 20px;\n}\n.layout {\n  display: flex;\n  flex: 1;\n}\naside {\n  width: 160px;\n  background: #dbe4ff;\n  padding: 20px;\n}\nmain {\n  flex: 1;\n  padding: 20px;\n}\nfooter {\n  background: #10132b;\n  color: white;\n  padding: 14px 20px;\n  text-align: center;\n}`,
    vp: [560, 320],
  },
  quiz: [
    { q: "On which element do you write display: flex: the parent or the children?", a: "The parent (container). Its direct children become flex items." },
    { q: "In a row, which property centres items vertically?", a: "align-items: center (it works on the cross axis)." },
    { q: "What does flex: 1 1 200px mean?", mono: true, a: "Grow = 1, shrink = 1, starting width (basis) = 200px." },
  ],
  summary: [
    "display: flex on the parent turns children into flex items.",
    "justify-content uses the main axis; align-items uses the cross axis.",
    "flex-direction: column swaps the axes.",
    "gap, flex-wrap and flex give spacing, wrapping and flexible sizes.",
    "Flexbox is for one dimension; Grid is for rows and columns together.",
  ],
  next: "Lesson 5: CSS Grid",
};
