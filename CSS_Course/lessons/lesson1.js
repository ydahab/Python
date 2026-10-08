const U = 26.4; // width of one monospace character at 44px
const mark = (x, color, h, label, w = 200) =>
  `<div style="position:absolute;left:${x}px;top:58px;width:4px;height:${h}px;background:${color};border-radius:2px"></div>` +
  `<div style="position:absolute;left:${x - w / 2 + 2}px;top:${58 + h + 6}px;width:${w}px;text-align:center;font:bold 22px Arial;color:${color}">${label}</div>`;
const bar = (x0, x1, color, y, label) =>
  `<div style="position:absolute;left:${x0 * U}px;top:${y}px;width:${(x1 - x0) * U}px;height:14px;border:4px solid ${color};border-top:none;border-radius:0 0 10px 10px"></div>` +
  `<div style="position:absolute;left:${x0 * U}px;top:${y + 22}px;width:${(x1 - x0) * U}px;text-align:center;font:bold 22px Arial;color:${color}">${label}</div>`;

module.exports = {
  n: 1, file: "CSS_Lesson1_Basics_and_Selectors.pptx", short: "Basics & Selectors",
  title: "CSS Basics & Selectors", subtitle: "Teach the browser how your HTML should look",
  meta: "High school  |  Prior knowledge: basic HTML  |  ~45 min",
  notes: "Welcome the class. Ask: what is the difference between what a page SAYS (HTML) and how it LOOKS (CSS)?",
  objectives: [
    "Explain what CSS is and how it differs from HTML",
    "Write a CSS rule made of a selector, a property and a value",
    "Target elements with element, class and ID selectors",
  ],
  terms: [
    { t: "CSS", d: "Cascading Style Sheets: the language that describes how HTML elements look." },
    { t: "Selector", d: "The part of a rule that picks which elements to style, such as h1 or .card." },
    { t: "Property", d: "The thing you want to change, such as color or font-size." },
    { t: "Declaration", d: "One property and its value, written as property: value; (it ends with a semicolon)." },
  ],
  concept: {
    title: "The big ideas",
    cards: [
      { h: "HTML builds, CSS decorates", b: "HTML says what something IS: a heading, a paragraph, a link. CSS says how it LOOKS: its colour, size, spacing and position. Keeping them apart makes pages easier to change.", code: "h1 { color: blue; }" },
      { h: "Three ways to add CSS", b: "Inline: a style attribute on one tag. Internal: a <style> block in the page. External: a separate .css file linked with <link>. External is best because one file can style every page.", code: '<link rel="stylesheet" href="style.css">' },
      { h: "The cascade decides the winner", b: "When two rules disagree, the browser picks one. A more specific selector wins (ID beats class beats element). If they are equally specific, the rule written later wins.", code: "#id  >  .class  >  element" },
    ],
  },
  diagram: {
    title: "Anatomy of a CSS rule", vp: [760, 500],
    captions: ["Selector: tells the browser WHICH elements to style.", "Property: WHAT you want to change. Value: HOW you want to change it.", "Curly braces { } hold the declarations. Each declaration ends with a semicolon."],
    html: `<div style="padding:26px 0 0 40px"><div style="font:bold 30px Arial;color:#2B3A8F;margin-bottom:40px">h1 { color: royalblue; }</div>
      <div style="position:relative;margin-left:20px;font:bold 44px/1 'Courier New',monospace;color:#10132B;white-space:pre"><span style="color:#E11D6A">h1</span> <span>{</span> <span style="color:#0E8FA5">color</span><span>:</span> <span style="color:#15803D">royalblue</span><span>;</span> <span>}</span>
      ${mark(1 * U, "#E11D6A", 34, "Selector", 160)}${mark(7.5 * U, "#0E8FA5", 34, "Property", 160)}${mark(16.5 * U, "#15803D", 34, "Value", 160)}
      ${bar(5, 22, "#8B5CF6", 160, "Declaration")}
      ${bar(3, 24, "#2965F1", 250, "Declaration block")}</div></div>`,
  },
  examples: [
    {
      title: "Element selectors", intro: "An element selector is just the tag name. It styles every element of that type.",
      html: `<h1>My Favourite Sport</h1>\n<p>Football is played by two teams of eleven players.</p>\n<p>Training starts at 4 pm.</p>`,
      css: `body {\n  font-family: Arial, sans-serif;\n  background-color: #f4f6ff;\n  padding: 24px;\n}\nh1 {\n  color: royalblue;\n}\np {\n  color: #333333;\n}`,
      ann: [
        { line: 0, text: "Element selector: styles the whole <body>, so every child inherits the font." },
        { line: 1, text: "font-family is a list: the browser uses the first font it has; sans-serif is the safe fallback." },
        { line: 6, text: "color: royalblue uses a named colour (about 140 names exist)." },
        { line: 9, text: "#333333 is a hex colour (red, green, blue in base 16): a dark grey." },
      ],
      vp: [560, 300],
    },
    {
      title: "Class and ID selectors", intro: "Use a class (.name) for groups of elements and an ID (#name) for one unique element.",
      html: `<div class="card">\n  <h2 id="title">Coding Club</h2>\n  <p>Meets on Tuesday. <span class="badge">New</span></p>\n</div>`,
      css: `body { background: #eef2ff; }\n.card {\n  font-family: Arial;\n  background: white;\n  border: 2px solid #2965f1;\n  border-radius: 12px;\n  padding: 16px;\n  width: 260px;\n}\n.badge { background: gold; padding: 2px 8px; }\n#title { color: #2965f1; }`,
      ann: [
        { line: 1, text: ".card is a class selector (starts with a dot). Reuse it on as many elements as you like." },
        { line: 4, text: "border is a shorthand: width, style and colour in one line." },
        { line: 9, text: ".badge shows a second class; it only styles the element that has class=\"badge\"." },
        { line: 10, text: "#title is an ID selector (starts with #). Use an ID only once per page." },
      ],
      vp: [560, 290],
    },
    {
      title: "Pseudo-classes & specificity", intro: "A pseudo-class (such as :hover) styles an element while it is in a certain state.",
      html: `<nav class="nav">\n  <a href="#">Home</a>\n  <a href="#">Games</a>\n  <a href="#">Contact</a>\n</nav>`,
      css: `.nav { font-family: Arial; font-size: 20px; }\n.nav a {\n  color: #2965f1;\n  text-decoration: none;\n  padding: 8px 14px;\n  border-radius: 8px;\n}\n.nav a:hover {\n  color: white;\n  background: #ff4f8b;\n}`,
      ann: [
        { line: 1, text: "Descendant selector: every <a> link that sits inside an element with class nav." },
        { line: 3, text: "text-decoration: none removes the default underline from links." },
        { line: 7, text: ":hover applies only while the mouse pointer is over the link." },
        { line: 8, text: "It is more specific than .nav a, so its colours win when you hover." },
      ],
      vp: [560, 190], extra: { hover: ".nav a:nth-child(2)", wait: 200 },
    },
  ],
  realworld: {
    title: "Real-world: one stylesheet, a whole website",
    items: [
      { icon: "FaSchool", h: "School portal", b: "One external stylesheet gives every page the same colours and fonts, so the site feels like one place." },
      { icon: "FaNewspaper", h: "News website", b: "A class such as .headline is written once and reused on hundreds of articles. Change it once and all update." },
      { icon: "FaPaintBrush", h: "Themes & dark mode", b: "Changing a few rules re-skins the whole site. Selectors are how designers target exactly what to change." },
    ],
    tryIt: "open any website, press F12 (or right-click > Inspect), click an element and read the rules in the Styles panel. Try editing a colour live.",
  },
  mistakes: [
    { bad: "h1 {\n  color blue\n}", good: "h1 {\n  color: blue;\n}", why: "A declaration needs a colon between property and value, and a semicolon at the end." },
    { bad: '<h1 id="title">\n.title { color: red; }', good: '<h1 id="title">\n#title { color: red; }', why: "The symbol must match the HTML: # for an ID, . for a class. Otherwise nothing matches." },
    { bad: "h1 {\n  colour: red;\n}", good: "h1 {\n  color: red;\n}", why: "CSS uses American spelling. Unknown properties are silently ignored, so check spelling first." },
  ],
  tips: [
    { icon: "FaFolderOpen", h: "Use an external stylesheet", b: "Put CSS in style.css and link it from every page. One change updates the whole site." },
    { icon: "FaPuzzlePiece", h: "Prefer classes to IDs", b: "Classes are reusable and easier to override. Save IDs for page anchors and unique hooks." },
    { icon: "FaSearch", h: "Inspect, then experiment", b: "Press F12 to see which rules apply to an element and test changes live before editing your file." },
    { icon: "FaBook", h: "Comment and format neatly", b: "Write /* notes */ for yourself. One declaration per line, two-space indent, always end with a semicolon." },
  ],
  activity: {
    title: "Activity: style a profile card", time: "20 min",
    brief: "Open the starter folder and edit style.css. The HTML is done; you write the CSS.",
    steps: [
      "Style body: font-family Arial, sans-serif; a pale background-color; padding 24px.",
      "Make .profile a white card with a 2px solid blue border, border-radius 12px, padding 20px and width 300px.",
      "Use the ID selector #name to colour the heading blue.",
      "Make .role pink and bold (font-weight: bold).",
      "Turn .btn into a blue button with white text, then change its background on :hover.",
    ],
    bonus: "Add a second class to one element and give it its own rule.",
    html: `<div class="profile">\n  <h1 id="name">Your Name</h1>\n  <p class="role">Student and future developer</p>\n  <p class="bio">I love building websites.</p>\n  <a class="btn" href="#">Contact me</a>\n</div>`,
    starter: `/* Lesson 1 activity: style the profile card */\n\nbody {\n  /* font-family, background-color, padding */\n}\n\n.profile {\n  /* background, border, border-radius, padding, width */\n}\n\n#name {\n  /* colour the heading */\n}\n\n.role {\n  /* colour and font-weight */\n}\n\n.btn {\n  /* colours, padding, border-radius, text-decoration */\n}\n\n.btn:hover {\n  /* a different background-color */\n}\n`,
    solution: `body {\n  font-family: Arial, sans-serif;\n  background-color: #eef2ff;\n  padding: 24px;\n}\n.profile {\n  background-color: white;\n  border: 2px solid #2965f1;\n  border-radius: 12px;\n  padding: 20px;\n  width: 300px;\n}\n#name {\n  color: #2965f1;\n}\n.role {\n  color: #ff4f8b;\n  font-weight: bold;\n}\n.btn {\n  color: white;\n  background-color: #2965f1;\n  padding: 8px 16px;\n  border-radius: 8px;\n  text-decoration: none;\n}\n.btn:hover {\n  background-color: #ff4f8b;\n}`,
    vp: [560, 290],
  },
  challenge: {
    title: "Challenge: the school clubs list", time: "25 min",
    brief: "Style the list using only selectors you know. No changes to the HTML are allowed.",
    steps: [
      "Every li gets padding, rounded corners and no bullet (list-style: none).",
      "Clubs with class open get a light green background and dark green text.",
      "Clubs with class full are grey with text-decoration: line-through.",
      "The element with id featured gets a gold background. Does it beat .open? Why?",
    ],
    bonus: "Add li:hover so the hovered club gets a blue outline.",
    html: `<h1>School Clubs</h1>\n<ul>\n  <li class="open">Robotics</li>\n  <li class="open" id="featured">Coding</li>\n  <li class="full">Chess</li>\n  <li class="open">Photography</li>\n</ul>`,
    starter: `/* Lesson 1 challenge: style the clubs list (do not edit the HTML) */\n\nbody {\n  font-family: Arial, sans-serif;\n  padding: 24px;\n}\n\n/* your rules here */\n`,
    solution: `body {\n  font-family: Arial, sans-serif;\n  padding: 24px;\n}\nh1 {\n  color: #2b3a8f;\n}\nli {\n  list-style: none;\n  padding: 8px 12px;\n  margin-bottom: 6px;\n  border-radius: 6px;\n  width: 260px;\n}\n.open {\n  background-color: #dcfce7;\n  color: #166534;\n}\n.full {\n  background-color: #e5e7eb;\n  color: #6b7280;\n  text-decoration: line-through;\n}\n#featured {\n  background-color: gold;\n  color: #10132b;\n  font-weight: bold;\n}\nli:hover {\n  outline: 2px solid #2965f1;\n}`,
    vp: [560, 290],
  },
  quiz: [
    { q: "Which symbol starts a class selector, and which starts an ID selector?", a: "A dot (.) for a class and a hash (#) for an ID." },
    { q: "What is wrong with this rule?\nh1 { color blue }", mono: true, a: "It is missing the colon and the semicolon. Correct: h1 { color: blue; }" },
    { q: "A paragraph has class=\"note\" and the rules p { color: red; } and .note { color: green; } both exist. Which colour wins?", a: "Green. A class selector is more specific than an element selector." },
  ],
  summary: [
    "CSS controls how HTML looks; HTML controls what it means.",
    "A rule = selector + { property: value; } declarations.",
    "Element selectors target tags, .class targets groups, #id targets one element.",
    "Pseudo-classes such as :hover style an element's state.",
    "When rules clash, the most specific selector wins; ties go to the later rule.",
  ],
  next: "Lesson 2: Colors, Fonts & Text (and CSS variables)",
};
