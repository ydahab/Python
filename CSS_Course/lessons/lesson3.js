const layer = (name, color, pad, inner, extra = "") => `<div style="background:${color};padding:${pad}px;border-radius:6px;position:relative;${extra}"><div style="position:absolute;top:6px;left:12px;font:bold 17px Arial;color:#10132B">${name}</div>${inner}</div>`;

module.exports = {
  n: 3, file: "CSS_Lesson3_The_Box_Model.pptx", short: "The Box Model",
  title: "The Box Model", subtitle: "Every element is a box: learn to size and space it",
  meta: "High school  |  Prior knowledge: Lessons 1-2  |  ~45 min",
  objectives: [
    "Describe the four layers of the box model",
    "Control space with padding, border and margin",
    "Use box-sizing: border-box and display: inline-block to size elements predictably",
  ],
  terms: [
    { t: "Padding", d: "Space INSIDE an element, between its content and its border." },
    { t: "Border", d: "A line drawn around the padding. It has a width, a style and a colour." },
    { t: "Margin", d: "Space OUTSIDE an element, pushing other elements away. It is always transparent." },
    { t: "Block / inline", d: "Block elements start on a new line and fill the width. Inline elements flow inside a line of text." },
  ],
  concept: {
    title: "The big ideas",
    cards: [
      { h: "Every element is a box", b: "The browser wraps each element in a rectangular box with four layers, from the inside out: content, padding, border and margin. Learn the layers and layout starts to make sense.", code: "content > padding > border > margin" },
      { h: "Padding is inside, margin is outside", b: "Padding makes the element itself roomier, and the background colour fills it. Margin keeps neighbours apart and never shows a background colour.", code: "padding: 16px;  margin: 24px;" },
      { h: "border-box makes sizing sane", b: "By default width only measures the content, so padding and border make the box bigger. With box-sizing: border-box the width includes padding and border.", code: "* { box-sizing: border-box; }" },
    ],
  },
  diagram: {
    title: "The box model, layer by layer", vp: [760, 500],
    captions: ["From the inside out: content, then padding, then border, then margin.", "Padding and border are part of the element's visible box. Margin is the space around it.", "Total width = content + padding + border (left and right), unless you use border-box."],
    html: `<div style="padding:24px 40px">${layer("margin", "#FFE6A3", 38, layer("border", "#FF8FB3", 30, layer("padding", "#C9B8FF", 38, `<div style="background:#2965F1;color:#fff;height:120px;border-radius:4px;display:flex;align-items:center;justify-content:center;font:bold 24px Arial;margin-top:18px">content</div>`)))}</div>`,
  },
  examples: [
    {
      title: "Padding, border and margin", intro: "Two cards: watch how the margin separates them while padding fills each one.",
      html: `<div class="card">First card</div>\n<div class="card">Second card</div>`,
      css: `.card {\n  width: 240px;\n  padding: 20px;\n  border: 4px solid #2965f1;\n  margin: 24px;\n  background: #eef2ff;\n  font-family: Arial, sans-serif;\n}`,
      ann: [
        { line: 1, text: "width sets the CONTENT width (by default)." },
        { line: 2, text: "padding: 20px adds space on all four sides inside the border." },
        { line: 3, text: "border: width, style, colour." },
        { line: 4, text: "margin: 24px keeps cards away from each other and from the edges." },
      ],
      vp: [560, 330],
    },
    {
      title: "box-sizing: content-box vs border-box", intro: "Both boxes say width: 200px, but they do not end up the same size.",
      html: `<div class="box content-box">content-box: 250px wide</div>\n<div class="box border-box">border-box: 200px wide</div>`,
      css: `.box {\n  width: 200px;\n  padding: 20px;\n  border: 5px solid #ff4f8b;\n  background: #fff1f6;\n  margin-bottom: 12px;\n  font-family: Arial, sans-serif;\n}\n.content-box { box-sizing: content-box; }\n.border-box { box-sizing: border-box; }`,
      ann: [
        { line: 1, text: "We ask for a 200px wide box in both cases." },
        { line: 8, text: "content-box (default): 200 + 2x20 padding + 2x5 border = 250px." },
        { line: 9, text: "border-box: padding and border are inside the 200px, so it stays 200px." },
      ],
      vp: [560, 330],
    },
    {
      title: "Centring and inline-block", intro: "margin: 0 auto centres a block with a set width. inline-block lets inline items have a box.",
      html: `<div class="page">\n  <h2>Match day</h2>\n  <p>Tickets: <span class="tag">Sold out</span></p>\n</div>`,
      css: `.page {\n  max-width: 420px;\n  margin: 0 auto;\n  padding: 16px;\n  border: 2px solid #2965f1;\n  font-family: Arial;\n}\n.tag {\n  display: inline-block;\n  padding: 4px 12px;\n  background: gold;\n}`,
      ann: [
        { line: 1, text: "max-width: the box can shrink but never grows past 420px." },
        { line: 2, text: "margin: 0 auto means 0 top and bottom, auto left and right = centred." },
        { line: 8, text: "inline-block keeps the item in the line but lets it use width, height and padding." },
      ],
      vp: [560, 300],
    },
  ],
  realworld: {
    title: "Real-world: cards, buttons and comfortable pages",
    items: [
      { icon: "FaCubes", h: "Cards and buttons", b: "Every card, button and menu item on a website is a box with padding for breathing room and a border or shadow." },
      { icon: "FaNewspaper", h: "Readable articles", b: "News sites limit article width with max-width and centre it with margin: 0 auto, so lines are not too long to read." },
      { icon: "FaShoppingCart", h: "Product grids", b: "Online shops use margin and gap to keep products apart, and border-box so cards line up exactly." },
    ],
    tryIt: "open DevTools (F12), select any element and hover the box-model diagram in the Computed tab. The browser highlights margin, border, padding and content in different colours.",
  },
  mistakes: [
    { bad: "padding: 20;", good: "padding: 20px;", why: "A number needs a unit. Only 0 can be written without one." },
    { bad: "span { margin: 0 auto; }", good: "span {\n  display: block;\n  width: 200px;\n  margin: 0 auto;\n}", why: "Auto margins centre only blocks with a width. Inline elements ignore them." },
    { bad: ".box {\n  width: 100%;\n  padding: 20px;\n}", good: "* { box-sizing: border-box; }\n.box {\n  width: 100%;\n  padding: 20px;\n}", why: "With the default content-box, 100% plus padding is wider than the screen and causes a horizontal scrollbar." },
  ],
  tips: [
    { icon: "FaCubes", h: "Start every stylesheet with border-box", b: "Add *, *::before, *::after { box-sizing: border-box; } and sizes behave the way you expect." },
    { icon: "FaSearch", h: "Let DevTools show you", b: "Hover an element in the Elements panel to see its margin (orange), padding (green) and content (blue)." },
    { icon: "FaPuzzlePiece", h: "Padding inside, margin between", b: "Use padding to give an element room. Use margin to separate it from its neighbours." },
    { icon: "FaBook", h: "Remember the order", b: "padding: 10px 20px 30px 40px goes top, right, bottom, left (clockwise). Two values mean vertical, horizontal." },
  ],
  activity: {
    title: "Activity: build a product card", time: "20 min",
    brief: "Turn the plain content into a neat card using only box-model properties.",
    steps: [
      "Add * { box-sizing: border-box; } at the top.",
      "Give .product width 260px, padding 20px, a 1px solid grey border and border-radius 12px.",
      "Add margin: 24px auto so the card is centred.",
      "Style .price as a gold pill: display inline-block, padding 4px 12px, border-radius 20px.",
      "Make the button fill the card width (display: block; width: 100%) with padding 10px.",
    ],
    bonus: "Add a box-shadow: 0 6px 16px rgba(0,0,0,0.12) to lift the card.",
    html: `<div class="product">\n  <h2>Study Notebook</h2>\n  <p>A5 size, 120 pages.</p>\n  <p><span class="price">25 EGP</span></p>\n  <button>Add to cart</button>\n</div>`,
    starter: `/* Lesson 3 activity: product card */\n\nbody {\n  font-family: Arial, sans-serif;\n  background: #f3f4f6;\n}\n\n/* 1. box-sizing for everything */\n\n.product {\n  /* 2 and 3: width, padding, border, radius, margin */\n}\n\n.price {\n  /* 4: gold pill */\n}\n\nbutton {\n  /* 5: full width button */\n}\n`,
    solution: `* {\n  box-sizing: border-box;\n}\nbody {\n  font-family: Arial, sans-serif;\n  background: #f3f4f6;\n}\n.product {\n  width: 260px;\n  padding: 20px;\n  border: 1px solid #cbd5e1;\n  border-radius: 12px;\n  margin: 24px auto;\n  background: white;\n  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);\n}\n.price {\n  display: inline-block;\n  padding: 4px 12px;\n  border-radius: 20px;\n  background: gold;\n  font-weight: bold;\n}\nbutton {\n  display: block;\n  width: 100%;\n  padding: 10px;\n  border: none;\n  border-radius: 8px;\n  background: #2965f1;\n  color: white;\n  font-size: 1rem;\n}`,
    vp: [560, 330],
  },
  challenge: {
    title: "Challenge: the exact business card", time: "25 min",
    brief: "Create a business card that is EXACTLY 350px wide and 200px tall in total, border included.",
    steps: [
      "Use box-sizing so that width: 350px and height: 200px are the final outer size.",
      "Give it a 6px solid border, 24px padding and a centred position on the page.",
      "Add 12px of space between the three text lines using margin.",
      "Check the size in DevTools: the box must measure 350 x 200.",
    ],
    bonus: "Make the name line larger and give the job title a coloured left border.",
    html: `<div class="biz">\n  <h2 class="name">Sara Ahmed</h2>\n  <p class="job">Junior Web Designer</p>\n  <p class="mail">sara@example.com</p>\n</div>`,
    starter: `/* Lesson 3 challenge: a 350 x 200 business card */\n\nbody {\n  font-family: Arial, sans-serif;\n  background: #e0e7ff;\n}\n\n.biz {\n  /* your rules here */\n}\n`,
    solution: `body {\n  font-family: Arial, sans-serif;\n  background: #e0e7ff;\n}\n.biz {\n  box-sizing: border-box;\n  width: 350px;\n  height: 200px;\n  padding: 24px;\n  border: 6px solid #2b3a8f;\n  margin: 30px auto;\n  background: white;\n}\n.name {\n  margin: 0 0 12px;\n  font-size: 1.6rem;\n  color: #2b3a8f;\n}\n.job {\n  margin: 0 0 12px;\n  padding-left: 10px;\n  border-left: 4px solid #ff4f8b;\n}\n.mail {\n  margin: 0;\n  color: #475569;\n}`,
    vp: [560, 300],
  },
  quiz: [
    { q: "Name the four layers of the box model from the inside out.", a: "Content, padding, border, margin." },
    { q: "A box has width: 200px; padding: 10px; border: 5px solid. What is its total width with the default box-sizing?", a: "230px: 200 + 2x10 + 2x5. With border-box it would stay 200px." },
    { q: "Why does span { margin: 0 auto; } not centre the text?", a: "A span is inline, so auto margins are ignored. Make it display: block with a width." },
  ],
  summary: [
    "Every element is a box: content, padding, border, margin.",
    "Padding is inside the border; margin is outside and transparent.",
    "box-sizing: border-box makes width include padding and border.",
    "margin: 0 auto centres a block that has a width.",
    "inline-block lets inline items take width, height and padding.",
  ],
  next: "Lesson 4: Layout with Flexbox",
};
