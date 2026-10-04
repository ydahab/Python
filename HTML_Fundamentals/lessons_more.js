// Lessons 4-6: attributes & containers, media & smarter links, capstone project.
const { HEX } = require("./lib");

const lesson4 = {
  file: "Lesson4_Attributes_Containers.pptx",
  short: "Lesson 4: Attributes & Containers",
  build(D) {
    const { T, C, S, tx, pr } = D;
    T.title({
      lesson: "Lesson 4", title: "Attributes & Containers", subtitle: "Add details to tags and group your content",
      ar: "الدرس الرابع: السمات والحاويات",
      notes: "Review: ask students to name five tags from the first three lessons.",
    });
    T.objectives({
      title: "By the end of this lesson you will…",
      items: [
        { icon: "FaTags", text: "Add attributes to give tags extra information" },
        { icon: "FaCubes", text: "Group content with div and span" },
        { icon: "FaFingerprint", text: "Tell the difference between id and class" },
        { icon: "FaGlobe", text: "Write a page in Arabic, right to left" },
      ],
      panel: { icon: "FaCubes", label: "TODAY'S GOAL", text: "Build a student ID card page" },
      notes: "The last goal is special: our own language on the web.",
    });
    T.anatomy({
      title: "Attributes: extra details inside a tag",
      parts: [
        { code: "class", codeColor: "text", label: "Name", body: "Says what kind of detail this is." },
        { code: "=", codeColor: "text", label: "Equals sign", body: "Connects the name to the value." },
        { code: '"intro"', label: "Value", body: "Always inside quotation marks." },
      ],
      formula: 'Attribute  =  name  +  =  +  "value"      e.g.  <p class="intro">',
      notes: "Attributes always live in the opening tag, never in the closing tag. We already used href, src and alt.",
    });
    T.glossary({
      title: "Attributes you will use all the time",
      items: [
        { tag: "id", text: "A unique name for ONE element" },
        { tag: "class", text: "A shared name for a group" },
        { tag: "href", text: "Where a link goes" },
        { tag: "src", text: "Which file to load" },
        { tag: "alt", text: "Describes an image" },
        { tag: "lang", text: "Language of the page" },
        { tag: "title", text: "Tooltip when you hover" },
        { tag: "width", text: "Size of an image or video" },
      ],
      pillW: 2.0,
      notes: "Revision of attributes from earlier lessons plus the new ones: id, class, lang, title.",
    });
    T.section({ num: 1, title: "Containers", sub: "Group content so it is easy to manage", ar: "الحاويات", notes: "" });
    T.code({
      title: "div and span",
      file: "card.html",
      code: ['<div class="card">', "  <h2>Cairo</h2>", "  <p>Capital of <span>Egypt</span>.</p>", "</div>"].join("\n"),
      codeW: 6.4, fs: 17,
      preview: {
        url: "card.html", h: 2.6,
        runs: [pr("Cairo", { fontSize: 24, bold: true }), { text: "Capital of ", options: { fontSize: 17, color: C.text1 } }, { text: "Egypt", options: { fontSize: 17, color: C.text2, bold: true } }, { text: ".", options: { fontSize: 17, color: C.text1, breakLine: true } }],
      },
      notes_: [
        { tag: "<div>", text: "A box that groups blocks of content" },
        { tag: "<span>", text: "Marks a few words inside a line" },
        { tag: "class", text: "A name so CSS can style the group later", color: HEX.accent2 },
      ],
      chipW: 1.5,
      notes: "div and span do not change how the page looks by themselves. They are labelled boxes waiting for CSS.",
    });
    T.cards({
      title: "Block or inline?",
      cards: [
        { icon: "FaLayerGroup", head: "Block elements", body: "Start on a new line and take the full width.\n\ndiv, p, h1 to h6, ul, ol, table", color: HEX.accent1, chip: "stacked" },
        { icon: "FaIndent", head: "Inline elements", body: "Stay inside a line and take only the space they need.\n\nspan, a, strong, em, img", color: HEX.accent2, chip: "side by side" },
      ],
      notes: "Analogy: block elements are like rows of benches in a class; inline elements are students sitting side by side on one bench.",
    });
    T.code({
      title: "id is unique, class is shared",
      file: "ids.html",
      code: ['<h1 id="top">My Site</h1>', '<p class="note">Hello</p>', '<p class="note">Salam</p>', '<a href="#top">Back to top</a>'].join("\n"),
      codeW: 6.4, fs: 17,
      notes_: [
        { tag: "id", text: "Like your national ID number: no two people share it" },
        { tag: "class", text: "Like a school uniform: many students wear the same one" },
        { tag: "#top", text: "A link that jumps to the element with that id" },
      ],
      chipW: 1.3,
      notes: "The national-ID analogy works well here. Show that the link #top scrolls up the page.",
    });
    T.section({ num: 2, title: "Special characters & Arabic", sub: "Show symbols and write in our own language", ar: "الرموز الخاصة والعربية", notes: "" });
    T.glossary({
      title: "Special characters (entities)",
      items: [
        { tag: "&lt;", text: "Shows the symbol <" },
        { tag: "&gt;", text: "Shows the symbol >" },
        { tag: "&amp;", text: "Shows the symbol &" },
        { tag: "&quot;", text: 'Shows a quotation mark "' },
        { tag: "&nbsp;", text: "A space that never breaks" },
        { tag: "&copy;", text: "Shows the copyright sign" },
      ],
      pillW: 2.2,
      notes: "Why do we need these? If you type < the browser thinks a tag is starting.",
    });
    T.code({
      title: "Writing an Arabic page",
      file: "masr.html",
      code: [
        "<!DOCTYPE html>", '<html lang="ar" dir="rtl">', "  <head>", '    <meta charset="UTF-8">', "    <title>مصر</title>", "  </head>", "  <body>", "    <h1>أهلاً بكم في مصر</h1>", "  </body>", "</html>",
      ].join("\n"),
      codeW: 6.7, codeH: 4.4, fs: 16,
      preview: {
        url: "masr.html", h: 1.9, rtl: true,
        runs: [pr("أهلاً بكم في مصر", { fontSize: 30, bold: true })],
      },
      notes_: [
        { tag: 'lang="ar"', text: "The page language is Arabic" },
        { tag: 'dir="rtl"', text: "Text flows right to left" },
        { tag: "UTF-8", text: "Arabic letters display correctly" },
      ],
      chipW: 1.6,
      notes: "Let Arabic-speaking students read the heading aloud. Remove dir=rtl live to show punctuation jumping to the wrong side.",
    });
    T.quiz({
      q: "Which attribute must be UNIQUE on a page?",
      options: ["class", "id", "href", "alt"],
      codeOptions: true, answer: 1,
      why: "An id names exactly one element, like a national ID number.",
      notes: "",
    });
    T.steps({
      title: "Your turn: a student ID card page",
      steps: [
        { h: "Make a div", b: 'Give it class="card" and put everything inside.' },
        { h: "Add the name", b: "An h2 for the student name." },
        { h: "Add details", b: "Class, school and city, with span around the labels." },
        { h: "Add a photo", b: "An img with src and alt inside the card." },
      ],
      browser: {
        url: "card.html",
        runs: [pr("Omar Said", { fontSize: 26, bold: true }), { text: "Class: ", options: { fontSize: 16, bold: true, color: C.text2 } }, { text: "Second year", options: { fontSize: 16, color: C.text1, breakLine: true } }, { text: "School: ", options: { fontSize: 16, bold: true, color: C.text2 } }, { text: "Aswan Secondary", options: { fontSize: 16, color: C.text1, breakLine: true } }, { text: "City: ", options: { fontSize: 16, bold: true, color: C.text2 } }, { text: "Aswan", options: { fontSize: 16, color: C.text1, breakLine: true } }],
      },
      timer: "20 minutes",
      notes: "Do not use real photos or personal data of students. Use a placeholder image.",
    });
    T.recap({
      title: "What we learned today",
      items: [
        'Attributes are name="value" pairs in the opening tag.',
        "div groups blocks, span marks words inside a line.",
        "id is unique, class is shared.",
        "Entities such as &lt; and &amp; show special characters.",
        'lang="ar" dir="rtl" makes a page in Arabic.',
      ],
      homework: "Make an Arabic page about your family with a heading, two paragraphs and a list.",
      notes: "Next lesson: audio, video and smarter links.",
    });
  },
};

const lesson5 = {
  file: "Lesson5_Media_Links_Head.pptx",
  short: "Lesson 5: Media & Smarter Links",
  build(D) {
    const { T, C, S, tx, pr } = D;
    T.title({
      lesson: "Lesson 5", title: "Media & Smarter Links", subtitle: "Videos, sound, email links and a page ready for phones",
      ar: "الدرس الخامس: الوسائط والروابط الذكية",
      notes: "Start with a show of hands: who watches videos on a phone? Today we learn how pages show them.",
    });
    T.objectives({
      title: "By the end of this lesson you will…",
      items: [
        { icon: "FaVideo", text: "Add video and audio to a page" },
        { icon: "FaEnvelope", text: "Create email links and links that open in a new tab" },
        { icon: "FaMapMarkedAlt", text: "Embed another page, such as a map" },
        { icon: "FaMobileAlt", text: "Prepare the head for phones and search" },
      ],
      panel: { icon: "FaVideo", label: "TODAY'S GOAL", text: "Create a media gallery page" },
      notes: "",
    });
    T.section({ num: 1, title: "Audio & video", sub: "Play media without extra software", ar: "الصوت والفيديو", notes: "" });
    T.code({
      title: "Adding a video",
      file: "video.html",
      code: ['<video src="nile.mp4"', '       controls width="480">', "  Your browser cannot play video.", "</video>"].join("\n"),
      codeW: 6.4, fs: 16,
      preview: {
        url: "video.html", h: 2.9,
        draw: (s, r, g) => {
          s.addShape(S.rect, { x: r.cx, y: r.cy, w: r.cw, h: r.ch - 0.35, fill: { color: C.text1 }, objectName: `a${g}_vid` });
          s.addShape(S.ellipse, { x: r.cx + r.cw / 2 - 0.45, y: r.cy + (r.ch - 0.35) / 2 - 0.45, w: 0.9, h: 0.9, fill: { color: C.accent2 }, objectName: `a${g}_ico_play` });
          s.addShape(S.triangle, { x: r.cx + r.cw / 2 - 0.15, y: r.cy + (r.ch - 0.35) / 2 - 0.17, w: 0.34, h: 0.34, rotate: 90, fill: { color: C.text1 }, objectName: `a${g}_ico_tri` });
          s.addShape(S.rect, { x: r.cx, y: r.cy + r.ch - 0.35, w: r.cw, h: 0.35, fill: { color: C.text2 }, objectName: `a${g}_bar` });
          s.addShape(S.rect, { x: r.cx + 0.15, y: r.cy + r.ch - 0.2, w: r.cw * 0.6, h: 0.06, fill: { color: C.accent1 }, objectName: `a${g}_prog` });
        },
      },
      notes_: [
        { tag: "<video>", text: "Shows a video file" },
        { tag: "controls", text: "Adds play, pause and volume buttons" },
        { tag: "<audio>", text: "Works the same way for sound files", color: HEX.accent6 },
      ],
      chipW: 1.5,
      notes: "The text inside the video tag is a fallback for very old browsers. Keep videos short and small for the school network.",
    });
    T.glossary({
      title: "Media attributes",
      items: [
        { tag: "controls", text: "Show play and volume buttons" },
        { tag: "autoplay", text: "Start by itself (use rarely!)" },
        { tag: "loop", text: "Play again and again" },
        { tag: "muted", text: "Start without sound" },
        { tag: "poster", text: "Picture shown before play" },
        { tag: "width", text: "Size of the player" },
      ],
      pillW: 2.3,
      notes: "These are boolean attributes: just writing the word is enough.",
    });
    T.section({ num: 2, title: "Smarter links", sub: "Email, new tabs and embedded pages", ar: "روابط أذكى", notes: "" });
    T.parts({
      title: "More things a link can do",
      parts: [
        { code: "mailto:", head: "Email link", body: "Opens the email program with the address filled in." },
        { code: "tel:", head: "Phone link", body: "On a phone, tapping it starts a call." },
        { code: "_blank", head: "New tab", body: 'Use target="_blank" to open the link in a new tab.' },
        { code: "#id", head: "Jump link", body: "Scrolls to the element with that id on the same page." },
      ],
      example: {
        lines: ['<a href="mailto:hello@school.eg">', "  Email us", "</a>"],
        result: [{ text: "Email us", options: { fontSize: 20, color: HEX.hlink, underline: { style: "sng" }, bold: true } }],
      },
      notes: "Use only school or demo email addresses in class.",
    });
    T.code({
      title: "Embedding another page",
      file: "map.html",
      code: ["<iframe", '  src="https://example.com/map"', '  width="400" height="300"', '  title="Map of Cairo">', "</iframe>"].join("\n"),
      codeW: 6.4, fs: 17,
      notes_: [
        { tag: "<iframe>", text: "A window that shows another web page inside yours" },
        { tag: "title", text: "Describes the window for screen readers" },
        { tag: "Care", text: "Only embed websites you trust", color: HEX.accent3 },
      ],
      chipW: 1.5,
      notes: "Examples: maps, YouTube videos. Remind students never to embed random sites.",
    });
    T.cards({
      title: "Staying safe and fair online",
      cards: [
        { icon: "FaSearch", head: "Check links", body: "Is the address what you expect? Do not click strange links." },
        { icon: "FaShieldAlt", head: "Protect privacy", body: "Never publish phone numbers, addresses or photos of others." },
        { icon: "FaCopyright", head: "Respect copyright", body: "Use your own pictures or free ones, and say where they came from." },
        { icon: "FaUsers", head: "Be kind", body: "Write things you would be happy to say to a classmate's face." },
      ],
      notes: "Hold a short discussion. Ask for an example of a safe and unsafe web page.",
    });
    T.code({
      title: "Get the head ready",
      file: "index.html",
      code: [
        "<head>", '  <meta charset="UTF-8">', '  <meta name="viewport"', '    content="width=device-width, initial-scale=1">', '  <meta name="description"', '    content="Visit Luxor">', "  <title>Visit Luxor</title>", '  <link rel="icon" href="logo.png">', "</head>",
      ].join("\n"),
      codeW: 7.2, codeH: 4.4, fs: 16,
      notes_: [
        { tag: "charset", text: "Show all letters correctly" },
        { tag: "viewport", text: "Fit the page to phone screens" },
        { tag: "description", text: "Summary shown in search results" },
        { tag: "icon", text: "Small logo on the browser tab" },
      ],
      chipW: 1.6,
      notes: "Most Egyptian students view the web on phones, so viewport matters.",
    });
    T.quiz({
      q: "Which attribute opens a link in a NEW tab?",
      options: ['href="new"', 'target="_blank"', 'rel="tab"', 'open="true"'],
      codeOptions: true, answer: 1,
      why: 'target="_blank" tells the browser to use a new tab.',
      notes: "",
    });
    T.steps({
      title: "Your turn: a media gallery page",
      steps: [
        { h: "Add a title", b: "An h1 and a short paragraph about your topic." },
        { h: "Add a video", b: "A video with controls and a sensible width." },
        { h: "Add links", b: "An email link and one that opens in a new tab." },
        { h: "Finish the head", b: "viewport, description and title." },
      ],
      browser: {
        url: "gallery.html",
        runs: [pr("Nile Gallery", { fontSize: 26, bold: true }), pr("Videos from our school trip.", { fontSize: 16 }), { text: "Email the teacher", options: { fontSize: 16, color: HEX.hlink, underline: { style: "sng" }, breakLine: true } }, { text: "Visit Egypt (new tab)", options: { fontSize: 16, color: HEX.hlink, underline: { style: "sng" }, breakLine: true } }],
      },
      timer: "25 minutes",
      notes: "Provide a sample .mp4 in the shared folder so every student has a file to use.",
    });
    T.recap({
      title: "What we learned today",
      items: [
        "video and audio with controls play media.",
        "mailto:, tel: and target=\"_blank\" make smarter links.",
        "iframe embeds a trusted page such as a map.",
        "The head: charset, viewport, description, title, icon.",
        "Stay safe and respect copyright.",
      ],
      homework: "Add a tel: link and a map iframe to your site, then test it on a phone.",
      notes: "Next: the capstone project.",
    });
  },
};

const lesson6 = {
  file: "Lesson6_Capstone_Build_and_Publish.pptx",
  short: "Lesson 6: Capstone Project",
  build(D) {
    const { T, C, S, tx, pr } = D;
    T.title({
      lesson: "Lesson 6", title: "Capstone: Build & Publish", subtitle: "Plan, build, check and share your own website",
      ar: "الدرس السادس: ابنِ موقعك وانشره",
      notes: "Celebrate how far the class has come. Today everything comes together.",
    });
    T.objectives({
      title: "By the end of this lesson you will…",
      items: [
        { icon: "FaCompass", text: "Plan a multi-page website" },
        { icon: "FaCode", text: "Build pages that share one menu" },
        { icon: "FaClipboardCheck", text: "Check your code for quality and accessibility" },
        { icon: "FaCloudUploadAlt", text: "Publish your site for others to see" },
      ],
      panel: { icon: "FaFlagCheckered", label: "TODAY'S GOAL", text: "Finish and present your website" },
      notes: "",
    });
    T.section({ num: 1, title: "Plan", sub: "Good websites start on paper", ar: "التخطيط", notes: "" });
    T.flow({
      title: "From idea to website",
      steps: [
        { icon: "FaLightbulb", label: "1. Plan", sub: "Choose a topic and sketch the pages" },
        { icon: "FaCode", label: "2. Build", sub: "Write the HTML for every page" },
        { icon: "FaSearch", label: "3. Check", sub: "Test links, images and code" },
        { icon: "FaCloudUploadAlt", label: "4. Publish", sub: "Upload so others can visit" },
      ],
      note: "Professionals repeat this cycle again and again. Check often, not only at the end!",
      notes: "Keep this slide up while students choose a topic.",
    });
    T.cards({
      title: "Choose your topic",
      cards: [
        { icon: "FaGraduationCap", head: "My School", body: "Classes, teachers (with permission), activities, a photo gallery and a contact form." },
        { icon: "FaMapMarkerAlt", head: "Discover Egypt", body: "Landmarks, a table of cities, a travel list and a map for each place." },
        { icon: "FaStar", head: "My Passion", body: "Football, drawing, coding or cooking: share what you love with the world." },
      ],
      notes: "Students may choose their own topic with teacher approval.",
    });
    T.code({
      title: "Plan your pages and files",
      file: "folder structure",
      code: ["my-website/", "  index.html", "  about.html", "  gallery.html", "  contact.html", "  images/"].join("\n"),
      codeW: 5.4, fs: 18,
      notes_: [
        { tag: "index", text: "Home page: welcome and menu" },
        { tag: "about", text: "Who you are or what the site is about" },
        { tag: "gallery", text: "Pictures and video" },
        { tag: "contact", text: "A form and contact details" },
      ],
      chipW: 1.5,
      notes: "Use lowercase names without spaces. Servers are case-sensitive.",
    });
    T.section({ num: 2, title: "Build", sub: "One menu, many pages", ar: "البناء", notes: "" });
    T.code({
      title: "The same menu on every page",
      file: "index.html",
      code: ["<nav>", '  <a href="index.html">Home</a>', '  <a href="about.html">About</a>', '  <a href="gallery.html">Gallery</a>', '  <a href="contact.html">Contact</a>', "</nav>"].join("\n"),
      codeW: 6.4, fs: 17,
      preview: {
        url: "index.html", h: 1.8,
        runs: ["Home", "About", "Gallery", "Contact"].map((t, i, a) => ({ text: t + (i < a.length - 1 ? "    " : ""), options: { fontSize: 18, bold: true, color: HEX.hlink, underline: { style: "sng" }, breakLine: i === a.length - 1 } })),
      },
      notes_: [
        { tag: "<nav>", text: "Wraps the menu links" },
        { tag: "Copy", text: "Paste the same nav into every page", color: HEX.accent2 },
        { tag: "Test", text: "Click every link from every page", color: HEX.accent6 },
      ],
      chipW: 1.3,
      notes: "Copy-paste is fine at this stage. Professionals later learn to avoid repetition.",
    });
    T.cards({
      title: "Make it accessible to everyone",
      cards: [
        { icon: "FaUniversalAccess", head: "Alt text", body: "Describe every meaningful image." },
        { icon: "FaHeading", head: "Heading order", body: "One h1, then h2, then h3. Do not skip levels." },
        { icon: "FaLink", head: "Clear links", body: "Write Read about Luxor, not Click here." },
        { icon: "FaEye", head: "Readable", body: "Short paragraphs and clear words." },
      ],
      notes: "Explain that accessibility helps students with visual impairment and everyone using a slow phone.",
    });
    T.steps({
      title: "Quality checklist",
      steps: [
        { h: "Every page has a title", b: "And exactly one h1." },
        { h: "Every image has alt", b: "Plus a sensible width." },
        { h: "All tags are closed", b: "And the code is indented." },
        { h: "All links work", b: "Click each one to test." },
        { h: "Run the validator", b: "Paste your code into validator.w3.org." },
      ],
      side: { icon: "FaClipboardCheck", head: "Use a validator", body: "A free tool reads your HTML and lists mistakes, like a spell-checker for code." },
      notes: "Students swap laptops for a peer review using this checklist.",
    });
    T.section({ num: 3, title: "Publish", sub: "Let the world see your work", ar: "النشر", notes: "" });
    T.flow({
      title: "Publishing, step by step",
      steps: [
        { icon: "FaUsers", label: "Ask first", sub: "Get permission from your teacher and parents" },
        { icon: "FaFolderOpen", label: "Prepare", sub: "Check that no private data is in your files" },
        { icon: "FaCloudUploadAlt", label: "Upload", sub: "Use a free host such as GitHub Pages" },
        { icon: "FaGlobe", label: "Share", sub: "Send the link to family and friends" },
      ],
      note: "Never publish phone numbers, home addresses or photos of other people.",
      notes: "If publishing is not allowed at school, keep the site on the lab server and present it from there.",
    });
    T.quiz({
      q: "What should the home page file be called?",
      options: ["home.html", "index.html", "main.html", "start.html"],
      codeOptions: true, answer: 1,
      why: "Web servers look for index.html first when someone visits your site.",
      notes: "",
    });
    T.steps({
      title: "Capstone rubric and presentation",
      steps: [
        { h: "Structure", b: "header, nav, main and footer on every page." },
        { h: "Content", b: "Headings, paragraphs and at least one list or table." },
        { h: "Media and links", b: "Two images with alt and working links." },
        { h: "Quality", b: "Valid, indented, no broken links." },
      ],
      side: { icon: "FaTrophy", head: "Presentation day", body: "3 minutes: show your site, explain one tag you love, and ask the class for one tip." },
      notes: "Share the rubric at the start of the lesson so students can aim for it.",
    });
    T.recap({
      title: "Congratulations, web developers!",
      items: [
        "You can structure pages with HTML tags.",
        "You can add text, lists, links, images, tables and forms.",
        "You can embed media and write in Arabic.",
        "You can check your work for quality and accessibility.",
        "Next adventure: style your site with CSS!",
      ],
      homework: "Show your website to your family and ask for their feedback.",
      notes: "Hand out certificates. Next course: CSS.",
    });
  },
};

module.exports = [lesson4, lesson5, lesson6];
