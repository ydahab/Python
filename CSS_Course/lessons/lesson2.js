const sw = (c, label, hex) => `<div style="width:150px;margin:0 14px;text-align:center"><div style="height:120px;border-radius:14px;background:${c};box-shadow:0 4px 10px rgba(0,0,0,.18)"></div><div style="margin-top:10px;font:bold 17px 'Courier New',monospace;color:#10132B">${label}</div></div>`;
const shade = (l) => `<div style="flex:1;height:70px;background:hsl(222,88%,${l}%);display:flex;align-items:flex-end;justify-content:center;color:${l > 60 ? "#10132B" : "#fff"};font:bold 15px Arial;padding-bottom:6px">${l}%</div>`;

module.exports = {
  n: 2, file: "CSS_Lesson2_Colors_Fonts_Text.pptx", short: "Colors, Fonts & Text",
  title: "Colors, Fonts & Text", subtitle: "Make your pages readable, on-brand and easy to maintain",
  meta: "High school  |  Prior knowledge: Lesson 1  |  ~45 min",
  objectives: [
    "Choose colours with names, hex codes, rgb() and hsl()",
    "Style text with font-family, font-size, line-height and text-align",
    "Store reusable values in CSS variables",
  ],
  terms: [
    { t: "Hex code", d: "A colour written as #RRGGBB: red, green and blue amounts in base 16, like #2965f1." },
    { t: "Unit", d: "What a number measures: px (pixels), rem (a multiple of the root font size), % and more." },
    { t: "Typeface", d: "A family of letter designs, such as Arial or Georgia. In CSS: font-family." },
    { t: "CSS variable", d: "A named value, written --name, that you reuse with var(--name). Also called a custom property." },
  ],
  concept: {
    title: "The big ideas",
    cards: [
      { h: "One colour, many notations", b: "Colours can be a name, a hex code, rgb() with three 0-255 numbers, or hsl() with hue (0-360 degrees), saturation and lightness. hsl is the easiest to tweak by hand.", code: "hsl(222, 88%, 55%)" },
      { h: "Text is about readability", b: "Choose a font-family with a fallback, a comfortable font-size, a line-height around 1.5 to 1.7, and enough contrast between text and background.", code: "line-height: 1.6;" },
      { h: "Units: px vs rem", b: "px is a fixed size. rem is relative to the page's root font size (16px by default), so text scales when a user changes their browser settings. Prefer rem for font sizes.", code: "font-size: 1.25rem;" },
    ],
  },
  diagram: {
    title: "One blue, four ways to write it", vp: [760, 500],
    captions: ["The same colour can be written as a name, hex, rgb() or hsl().", "In hsl(), hue is the colour on a 0-360 degree wheel; saturation is how vivid; lightness is how bright.", "Keep hue and saturation, change only lightness: instant shades for hover and borders."],
    html: `<div style="padding:30px 20px"><div style="display:flex;justify-content:center">${sw("royalblue", "royalblue")}${sw("#2965f1", "#2965f1")}${sw("rgb(41,101,241)", "rgb(41,101,241)")}${sw("hsl(222,88%,55%)", "hsl(222,88%,55%)")}</div>
    <div style="margin:44px 30px 8px;font:bold 20px Arial;color:#2B3A8F">hsl(222, 88%, <span style="color:#FF4F8B">lightness</span>)</div>
    <div style="display:flex;margin:0 30px;border-radius:12px;overflow:hidden">${[15, 30, 45, 55, 70, 85, 95].map(shade).join("")}</div></div>`,
  },
  examples: [
    {
      title: "Four ways to write a colour", intro: "These four boxes use the same blue written in different notations.",
      html: `<div class="box a">royalblue</div>\n<div class="box b">#2965f1</div>\n<div class="box c">rgb(41, 101, 241)</div>\n<div class="box d">hsl(222, 88%, 55%)</div>`,
      css: `.box {\n  color: white;\n  padding: 14px;\n  font-family: Arial, sans-serif;\n  margin-bottom: 8px;\n}\n.a { background: royalblue; }\n.b { background: #2965f1; }\n.c { background: rgb(41, 101, 241); }\n.d { background: hsl(222, 88%, 55%); }`,
      ann: [
        { line: 4, text: "margin-bottom adds space below each box (see Lesson 3)." },
        { line: 6, text: "A colour name: easy to read, but only about 140 exist." },
        { line: 7, text: "Hex #RRGGBB: red, green and blue amounts from 00 to ff." },
        { line: 8, text: "rgb(): each channel is a number from 0 to 255." },
        { line: 9, text: "hsl(): hue 0-360 degrees, then saturation and lightness in %." },
      ],
      vp: [560, 300],
    },
    {
      title: "Readable typography", intro: "Good text styling is mostly about size, spacing and alignment.",
      html: `<h1>Why we read on screens</h1>\n<p>Good typography makes long text easy on the eyes. Space between lines helps your eyes find the next line without effort.</p>\n<p>Short lines and clear contrast help even more.</p>`,
      css: `body {\n  font-family: Georgia, serif;\n  font-size: 18px;\n  line-height: 1.6;\n  color: #1f2937;\n}\nh1 {\n  font-size: 2rem;\n  text-align: center;\n  letter-spacing: 1px;\n}`,
      ann: [
        { line: 1, text: "Georgia is a serif font; serif is the generic fallback if it is missing." },
        { line: 3, text: "line-height: 1.6 (no unit) means 1.6 times the font size." },
        { line: 7, text: "2rem = twice the root font size (32px by default)." },
        { line: 8, text: "text-align centres the heading; letter-spacing adds space between letters." },
      ],
      vp: [560, 330],
    },
    {
      title: "CSS variables (custom properties)", intro: "Store a value once, reuse it everywhere, and change it in one place.",
      html: `<button class="btn">Join</button>\n<button class="btn alt">Donate</button>`,
      css: `:root {\n  --brand: #2965f1;\n  --accent: #ff4f8b;\n}\n.btn {\n  background: var(--brand);\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 8px;\n}\n.btn.alt { background: var(--accent); }`,
      ann: [
        { line: 0, text: ":root is the top of the page, so variables defined here work everywhere." },
        { line: 1, text: "A custom property name always starts with two dashes." },
        { line: 5, text: "var(--brand) reads the value. Change --brand once and every button follows." },
        { line: 11, text: ".btn.alt (no space) targets elements with BOTH classes." },
      ],
      vp: [560, 110],
    },
  ],
  realworld: {
    title: "Real-world: brand colours and readable text",
    items: [
      { icon: "FaPaintBrush", h: "Brand identity", b: "Companies keep brand colours in variables, so a redesign means changing a few lines instead of hundreds." },
      { icon: "FaUniversalAccess", h: "Accessibility", b: "Enough contrast and a sensible line-height help people with low vision or dyslexia. Teachers and exam boards care about this too." },
      { icon: "FaMobileAlt", h: "Respecting user settings", b: "Using rem lets text grow when users raise their browser font size, instead of ignoring their needs." },
    ],
    tryIt: "open DevTools (F12), select the body, and look at Computed. Find the font-family the browser really used and the font-size in px.",
  },
  mistakes: [
    { bad: "font-family: Times New Roman;", good: 'font-family: "Times New Roman", serif;', why: "Font names with spaces need quotes, and you should always add a generic fallback such as serif." },
    { bad: "line-height: 1.6px;", good: "line-height: 1.6;", why: "With px you set a tiny fixed height. A unitless number scales with the font size." },
    { bad: "color: #333;\nbackground: #444;", good: "color: #ffffff;\nbackground: #1f2937;", why: "Low contrast is hard to read. Aim for strong contrast between text and background." },
  ],
  tips: [
    { icon: "FaPaintBrush", h: "Pick a small palette", b: "Choose 1 main colour, 1 accent and a few neutrals. Store them as variables on :root." },
    { icon: "FaEye", h: "Check contrast", b: "DevTools shows a contrast ratio in the colour picker. Aim for 4.5:1 or better for body text." },
    { icon: "FaBook", h: "Limit your fonts", b: "Two typefaces are plenty: one for headings, one for body text. More looks messy and loads slower." },
    { icon: "FaSearch", h: "Use hsl for shades", b: "Need a darker hover colour? Keep the hue and lower the lightness by 8 to 10 percent." },
  ],
  activity: {
    title: "Activity: design a quote card", time: "20 min",
    brief: "Edit style.css in the starter folder. Use variables for your colours.",
    steps: [
      "Declare --ink, --paper and --accent on :root (any colours you like).",
      "Style body with the paper background, the ink text colour, font-family Georgia, serif.",
      "Give blockquote a large font-size (1.5rem), line-height 1.5 and a thick left border in the accent colour.",
      "Make cite small (0.9rem), not italic, in the accent colour.",
      "Centre the h1 and add letter-spacing.",
    ],
    bonus: "Change only the three variables to create a dark version.",
    html: `<h1>Quote of the Day</h1>\n<blockquote>\n  Good design is as little design as possible.\n  <cite>Dieter Rams</cite>\n</blockquote>`,
    starter: `/* Lesson 2 activity: quote card */\n\n:root {\n  /* --ink, --paper, --accent */\n}\n\nbody {\n  /* background, colour, font-family, padding */\n}\n\nh1 {\n  /* centre and letter-spacing */\n}\n\nblockquote {\n  /* font-size, line-height, border-left */\n}\n\ncite {\n  /* display, font-size, font-style, colour */\n}\n`,
    solution: `:root {\n  --ink: #1f2937;\n  --paper: #fff8e7;\n  --accent: #ff4f8b;\n}\nbody {\n  background: var(--paper);\n  color: var(--ink);\n  font-family: Georgia, serif;\n  padding: 24px;\n}\nh1 {\n  text-align: center;\n  letter-spacing: 2px;\n  font-size: 1.6rem;\n}\nblockquote {\n  font-size: 1.5rem;\n  line-height: 1.5;\n  border-left: 6px solid var(--accent);\n  padding-left: 16px;\n  margin-left: 0;\n}\ncite {\n  display: block;\n  margin-top: 8px;\n  font-size: 0.9rem;\n  font-style: normal;\n  color: var(--accent);\n}`,
    vp: [560, 300],
  },
  challenge: {
    title: "Challenge: a light and dark theme", time: "25 min",
    brief: "Make the card's colours come only from variables, then re-theme it by overriding them.",
    steps: [
      "On :root define --bg, --text and --accent for a light theme.",
      "Use var() for the background, text and heading colours.",
      "Write body.dark with new values for the same three variables.",
      "Add class=\"dark\" to the body in index.html and watch everything change.",
    ],
    bonus: "Give .tag a hsl() background and a hover colour that is 10% darker.",
    html: `<h1>Study Planner</h1>\n<p>Revision starts at <span class="tag">6 pm</span> tonight.</p>\n<p>Remember: short breaks beat long marathons.</p>`,
    starter: `/* Lesson 2 challenge: light and dark theme */\n\n:root {\n  /* light theme variables */\n}\n\nbody.dark {\n  /* override the same variables here */\n}\n\nbody {\n  /* use var() */\n  font-family: Arial, sans-serif;\n  padding: 24px;\n}\n\n.tag {\n  padding: 2px 10px;\n  border-radius: 20px;\n}\n`,
    solution: `:root {\n  --bg: #ffffff;\n  --text: #1f2937;\n  --accent: #2965f1;\n}\nbody.dark {\n  --bg: #10132b;\n  --text: #e5e7eb;\n  --accent: #ffc83d;\n}\nbody {\n  background: var(--bg);\n  color: var(--text);\n  font-family: Arial, sans-serif;\n  padding: 24px;\n}\nh1 {\n  color: var(--accent);\n}\n.tag {\n  background: var(--accent);\n  color: var(--bg);\n  padding: 2px 10px;\n  border-radius: 20px;\n}`,
    vp: [560, 280], bodyClass: "dark",
  },
  quiz: [
    { q: "Which is the same colour as rgb(255, 0, 0)?", a: "Red: #ff0000, or the name red. Red is at maximum (ff = 255), green and blue are 0." },
    { q: "Why is line-height: 1.6 better than 1.6px?", a: "No unit means 1.6 times the font size, so spacing scales with any text size. 1.6px is almost no height." },
    { q: "How do you read a variable named --brand?", mono: true, a: "var(--brand). Define it first, for example on :root." },
  ],
  summary: [
    "Colours: names, #hex, rgb() and hsl(). Use hsl() to make shades.",
    "font-family needs fallbacks; line-height 1.5 to 1.7 reads well.",
    "Prefer rem for font sizes so text respects user settings.",
    "Variables: define --name on :root, use var(--name).",
    "Contrast matters: readable text is part of good design.",
  ],
  next: "Lesson 3: The Box Model (padding, border, margin)",
};
