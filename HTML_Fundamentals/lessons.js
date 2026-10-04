// Lesson content. Each lesson is a function that fills a deck.
const { HEX } = require("./lib");

const lesson1 = {
  file: "Lesson1_Meet_HTML.pptx",
  short: "Lesson 1: Meet HTML",
  build(D) {
    const { T, C, S, tx, pr } = D;
    T.title({
      lesson: "Lesson 1", title: "Meet HTML", subtitle: "Build your very first web page, step by step",
      ar: "الدرس الأول: صفحتك الأولى على الويب",
      notes: "Welcome the class. Ask: who has visited a website today? Every one of those pages is written with HTML. Today everyone will build a real page.",
    });
    T.objectives({
      title: "By the end of this lesson you will…",
      items: [
        { icon: "FaGlobe", text: "Explain what HTML is and why websites need it" },
        { icon: "FaCode", text: "Read and write tags and elements" },
        { icon: "FaFileCode", text: "Build the skeleton every web page has" },
        { icon: "FaHeading", text: "Use headings and paragraphs to organise text" },
      ],
      panel: { icon: "FaRocket", label: "TODAY'S GOAL", text: "Publish your own About Me page" },
      notes: "Read the four goals aloud. Tell students the last 15 minutes are hands-on.",
    });
    T.cards({
      title: "Every website is built from 3 layers",
      cards: [
        { icon: "FaSitemap", head: "HTML", chip: "<html>", body: "The structure. Like the walls and rooms of a house: it decides what is on the page.", ar: "الهيكل", dark: true, color: HEX.accent2 },
        { icon: "FaPaintBrush", head: "CSS", chip: "style", body: "The style. Like the paint, furniture and decoration: colours, fonts and layout.", ar: "التصميم", color: HEX.accent6 },
        { icon: "FaBolt", head: "JavaScript", chip: "action", body: "The behaviour. Like the electricity: menus, games and buttons that react to you.", ar: "التفاعل", color: HEX.accent3 },
      ],
      notes: "Use the house analogy. We start with HTML because you cannot paint a house that has no walls. CSS and JavaScript come in later courses.",
    });
    T.cards({
      title: "What does HTML stand for?",
      transition: "fade",
      cards: [
        { big: "HyperText", head: "Linked text", body: "Text that contains links. Click a link and jump to another page, anywhere in the world.", ar: "نص تشعبي", color: HEX.accent1 },
        { big: "Markup", head: "Labels on content", body: "We wrap content in tags that tell the browser what it is: a heading, a paragraph, an image…", ar: "ترميز", color: HEX.accent2 },
        { big: "Language", head: "Rules to follow", body: "Like Arabic or English, HTML has rules. The browser reads them and draws the page.", ar: "لغة", color: HEX.accent6 },
      ],
      notes: "Ask students for another 'markup' they know: a teacher marking an exam paper with a red pen is adding markup.",
    });
    T.flow({
      title: "How a web page reaches your screen",
      steps: [
        { icon: "FaKeyboard", label: "1. You type", sub: "An address such as www.egypt.gov.eg" },
        { icon: "FaServer", label: "2. Browser asks", sub: "It sends a request to the web server" },
        { icon: "FaFileCode", label: "3. Server replies", sub: "It sends back an HTML file" },
        { icon: "FaDesktop", label: "4. Browser draws", sub: "It reads the tags and shows the page" },
      ],
      note: "A browser (Chrome, Edge, Firefox) is a program that reads HTML and turns it into the page you see.",
      notes: "Walk left to right. Stress that the browser, not the student, turns the tags into a visual page.",
    });
    T.steps({
      title: "Your toolbox: two programs and one file",
      steps: [
        { h: "A web browser", b: "Chrome, Edge or Firefox. You already have one." },
        { h: "A text editor", b: "VS Code is best. Notepad works too." },
        { h: "Create a folder called my-site", b: "Keep all your files for the website inside it." },
        { h: "Save a file as index.html", b: "The .html ending tells the computer it is a web page." },
      ],
      side: { icon: "FaLightbulb", head: "Pro tip", body: "Do not use Word! It adds hidden formatting. Web pages must be plain text files." },
      notes: "If the lab has no VS Code, Notepad is fine. Make sure 'Save as type' is All Files so Windows does not add .txt.",
    });
    T.section({ num: 1, title: "Tags & elements", sub: "The building blocks of every page", ar: "الوسوم والعناصر", notes: "Section break. Take a breath and ask if anything is unclear so far." });
    T.anatomy({
      title: "Anatomy of an HTML element",
      parts: [
        { code: "<p>", label: "Opening tag", body: "Starts the element. Written inside angle brackets." },
        { code: "Hello Egypt", codeColor: "text", label: "Content", body: "What people see on the page." },
        { code: "</p>", label: "Closing tag", body: "Same name, with a slash / in front." },
      ],
      formula: "Element  =  opening tag  +  content  +  closing tag",
      notes: "Write <p>Hello Egypt</p> on the board and have students point at each of the three parts.",
    });
    T.code({
      title: "The skeleton of every web page",
      file: "index.html",
      code: [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "  <head>",
        '    <meta charset="UTF-8">',
        "    <title>My First Page</title>",
        "  </head>",
        "  <body>",
        "    <h1>Hello, Egypt!</h1>",
        "  </body>",
        "</html>",
      ].join("\n"),
      codeW: 6.9, codeH: 4.5, fs: 18,
      notes_: [
        { tag: "<html>", text: "Wraps the whole page" },
        { tag: "<head>", text: "Information for the browser. Not shown on the page" },
        { tag: "<title>", text: "The text on the browser tab" },
        { tag: "<body>", text: "Everything you can see on the page" },
      ],
      chipW: 1.55,
      notes: "Type this in front of the class. Point out: the title lives in head, the visible heading lives in body. Students often mix them up.",
    });
    T.code({
      title: "Hello, Egypt: headings and paragraphs",
      file: "index.html",
      code: ["<h1>Welcome to Egypt</h1>", "<p>The Nile flows through Cairo.</p>", "<p>The Pyramids are in Giza.</p>"].join("\n"),
      codeW: 6.9, fs: 18,
      preview: {
        url: "index.html", h: 2.7,
        runs: [pr("Welcome to Egypt", { fontSize: 30, bold: true }), pr("The Nile flows through Cairo.", { fontSize: 17 }), pr("The Pyramids are in Giza.", { fontSize: 17 })],
      },
      notes_: [
        { tag: "<h1>", text: "Main heading. Use it once per page" },
        { tag: "<p>", text: "A paragraph of text" },
        { tag: "Tip", text: "The browser ignores extra spaces and blank lines", color: HEX.accent2 },
      ],
      chipW: 1.2,
      notes: "Run the code live in a browser. Then add a blank line in the editor and refresh: nothing changes. That is the 'ignored spaces' tip.",
    });
    T.code({
      title: "Six levels of headings",
      file: "headings.html",
      code: ["<h1>Heading 1</h1>", "<h2>Heading 2</h2>", "<h3>Heading 3</h3>", "<h4>Heading 4</h4>", "<h5>Heading 5</h5>", "<h6>Heading 6</h6>"].join("\n"),
      codeW: 6.4, fs: 18,
      preview: {
        url: "headings.html", h: 3.15,
        runs: [30, 26, 22, 18, 15, 13].map((f, i) => pr(`Heading ${i + 1}`, { fontSize: f, bold: true })),
      },
      notes_: [
        { tag: "h1 to h6", text: "h1 is the most important, h6 the least" },
        { tag: "Rule", text: "Choose by meaning, not by size", color: HEX.accent2 },
      ],
      chipW: 1.6,
      notes: "Compare with a newspaper: big headline, then section titles, then small sub-titles.",
    });
    T.glossary({
      title: "Tags you know now",
      items: [
        { tag: "<html>", text: "The root: wraps the whole page" },
        { tag: "<head>", text: "Information about the page" },
        { tag: "<title>", text: "Name shown on the browser tab" },
        { tag: "<body>", text: "Everything visible on the page" },
        { tag: "<h1>-<h6>", text: "Headings, big to small" },
        { tag: "<p>", text: "A paragraph of text" },
      ],
      pillW: 2.4,
      notes: "Quick-fire: say a description, students shout the tag.",
    });
    T.quiz({
      q: "Which tag creates the biggest heading on a page?",
      options: ["<p>", "<h1>", "<h6>", "<head>"],
      codeOptions: true, answer: 1,
      why: "<h1> is the main heading. <head> is not shown on the page at all!",
      notes: "Give students 20 seconds. Click once to reveal the answer.",
    });
    T.steps({
      title: "Your turn: build an About Me page",
      steps: [
        { h: "Create the file", b: "Make my-site/index.html in your editor." },
        { h: "Type the skeleton", b: "html, head, title and body, as on the earlier slide." },
        { h: "Add your content", b: "An h1 with your name and a p about your city or hobby." },
        { h: "Save and open", b: "Double-click the file to see it in your browser." },
      ],
      browser: {
        url: "index.html",
        runs: [pr("Mariam Hassan", { fontSize: 28, bold: true }), pr("I live in Alexandria.", { fontSize: 17 }), pr("I love football and drawing.", { fontSize: 17 })],
      },
      timer: "15 minutes",
      notes: "Circulate. The most common bug is a missing slash in a closing tag. Remind students to save (Ctrl+S) and refresh (F5).",
    });
    T.recap({
      title: "What we learned today",
      items: [
        "HTML = HyperText Markup Language. It gives a page its structure.",
        "An element is an opening tag, content and a closing tag.",
        "Every page has html, head and body.",
        "Headings are h1 to h6. Paragraphs use p.",
        "Save files as .html and open them in a browser.",
      ],
      homework: "Make a page about your favourite Egyptian city or player. Use 1 h1, 2 h2 and 3 paragraphs.",
      notes: "Ask each row of students to tell you one thing they learned. Hand out the homework.",
    });
  },
};

const lesson2 = {
  file: "Lesson2_Text_Lists_Links_Images.pptx",
  short: "Lesson 2: Text, Links & Images",
  build(D) {
    const { T, C, S, tx, pr } = D;
    T.title({
      lesson: "Lesson 2", title: "Text, Lists, Links & Images", subtitle: "Bring your page to life with content",
      ar: "الدرس الثاني: النصوص والقوائم والروابط والصور",
      notes: "Welcome back. Start by asking two students to show their homework pages.",
    });
    T.objectives({
      title: "By the end of this lesson you will…",
      items: [
        { icon: "FaBold", text: "Make text bold or italic to show importance" },
        { icon: "FaListUl", text: "Create bulleted and numbered lists" },
        { icon: "FaLink", text: "Link one page to another" },
        { icon: "FaImage", text: "Add pictures with helpful descriptions" },
      ],
      panel: { icon: "FaMapMarkerAlt", label: "TODAY'S GOAL", text: "A page about your favourite place in Egypt" },
      notes: "Connect to last lesson: we built the skeleton, now we fill it.",
    });
    T.quiz({
      q: "Warm-up: what is wrong with  <p>Hello Egypt<p>  ?",
      options: ["The closing tag is missing its slash", "p is not a real tag", "It needs an h1 first", "Nothing is wrong"],
      answer: 0,
      why: "The closing tag must be </p>, with a slash.",
      notes: "A quick retrieval of last lesson's key idea.",
    });
    T.section({ num: 1, title: "Text & lists", sub: "Show what matters and organise ideas", ar: "تنسيق النصوص والقوائم", notes: "" });
    T.code({
      title: "Make words stand out",
      file: "text.html",
      code: ["<p>Egypt is <strong>very</strong> old.</p>", "<p>It is <em>really</em> beautiful.</p>", "<p>Line one<br>Line two</p>", "<hr>", "<p>Next part</p>"].join("\n"),
      codeW: 6.9,
      preview: {
        url: "text.html", h: 2.6,
        runs: [
          { text: "Egypt is ", options: { fontSize: 16, color: C.text1 } }, { text: "very", options: { fontSize: 16, bold: true, color: C.text1 } }, { text: " old.", options: { fontSize: 16, color: C.text1, breakLine: true } },
          { text: "It is ", options: { fontSize: 16, color: C.text1 } }, { text: "really", options: { fontSize: 16, italic: true, color: C.text1 } }, { text: " beautiful.", options: { fontSize: 16, color: C.text1, breakLine: true } },
          pr("Line one", { fontSize: 16 }), pr("Line two", { fontSize: 16 }), pr("_______________________", { fontSize: 14, color: C.text2 }), pr("Next part", { fontSize: 16 }),
        ],
      },
      notes_: [
        { tag: "<strong>", text: "Bold: this is important" },
        { tag: "<em>", text: "Italic: emphasis" },
        { tag: "<br> <hr>", text: "New line and a line across. No closing tag!", color: HEX.accent2 },
      ],
      chipW: 1.7,
      notes: "Explain that strong and em carry meaning (screen readers change their voice) while b and i are only looks.",
    });
    T.code({
      title: "Lists: bullets and numbers",
      file: "lists.html",
      code: ["<ul>", "  <li>Koshary</li>", "  <li>Ful</li>", "</ul>", "<ol>", "  <li>Boil water</li>", "  <li>Add tea</li>", "</ol>"].join("\n"),
      codeW: 6.4, codeH: 3.6, fs: 18,
      preview: {
        url: "lists.html", h: 2.7,
        runs: [
          pr("Koshary", { bullet: true }), pr("Ful", { bullet: true }),
          pr("Boil water", { bullet: { type: "number" } }), pr("Add tea", { bullet: { type: "number" } }),
        ],
      },
      notes_: [
        { tag: "<ul>", text: "Unordered list (bullets)" },
        { tag: "<ol>", text: "Ordered list (numbers)" },
        { tag: "<li>", text: "One list item" },
      ],
      chipW: 1.2,
      notes: "Ask: which list would you use for a recipe? For a shopping list?",
    });
    T.section({ num: 2, title: "Links & images", sub: "Connect pages and show pictures", ar: "الروابط والصور", notes: "" });
    T.parts({
      title: "Links: the anchor tag",
      parts: [
        { code: "<a", head: "Tag name", body: "a stands for anchor. It makes a clickable link." },
        { code: "href", head: "Attribute name", body: "Short for hypertext reference: where the link goes." },
        { code: '"https://..."', head: "Attribute value", body: "The address, always inside quotation marks." },
        { code: "Visit Egypt", head: "Link text", body: "What the visitor reads and clicks on." },
      ],
      example: {
        lines: ['<a href="https://www.egypt.gov.eg">', "  Visit Egypt", "</a>"],
        result: [{ text: "Visit Egypt", options: { fontSize: 20, color: HEX.hlink, underline: { style: "sng" }, bold: true } }],
      },
      notes: "Introduce the word attribute: extra information inside the opening tag, written name=\"value\".",
    });
    T.parts({
      title: "Images: the img tag",
      parts: [
        { code: "<img>", head: "Image tag", body: "Empty element: no closing tag needed." },
        { code: "src", head: "Source", body: "The file name or path of the picture." },
        { code: "alt", head: "Alternative text", body: "Describes the picture to screen readers and when it fails to load." },
        { code: "width", head: "Size", body: "Width in pixels. The height adjusts by itself." },
      ],
      example: {
        lines: ['<img src="pyramids.jpg"', '     alt="The Pyramids of Giza"', '     width="300">'],
        draw: (s, g) => {
          s.addShape(S.rect, { x: 9.5, y: 5.2, w: 2.4, h: 1.0, fill: { color: C.accent6 }, objectName: `a${g}_img_sky` });
          s.addShape(S.triangle, { x: 10.0, y: 5.45, w: 1.1, h: 0.75, fill: { color: C.accent2 }, objectName: `a${g}_img_p1` });
          s.addShape(S.triangle, { x: 10.7, y: 5.6, w: 0.8, h: 0.6, fill: { color: C.accent2 }, objectName: `a${g}_img_p2` });
          s.addShape(S.ellipse, { x: 11.3, y: 5.28, w: 0.3, h: 0.3, fill: { color: C.background1 }, objectName: `a${g}_img_sun` });
        },
      },
      notes: "Alt text is an accessibility rule: a blind student using a screen reader hears it. Ask what alt text they would write for a photo of the Nile.",
    });
    T.code({
      title: "Where is my file? Paths",
      file: "folder structure",
      code: ["my-site/", "  index.html", "  about.html", "  images/", "    pyramids.jpg"].join("\n"),
      codeW: 5.4, codeH: 3.4, fs: 20,
      notes_: [
        { tag: "about.html", text: "Same folder as this page" },
        { tag: "images/pyramids.jpg", text: "Go into the images folder first" },
        { tag: "../index.html", text: "Go up one folder" },
      ],
      chipW: 2.7,
      notes: "Draw the folders on the board as boxes. A broken image is almost always a wrong path or a spelling mistake.",
    });
    T.glossary({
      title: "New tags in your toolbox",
      items: [
        { tag: "<strong>", text: "Important text (bold)" },
        { tag: "<em>", text: "Emphasised text (italic)" },
        { tag: "<br> <hr>", text: "Line break, horizontal line" },
        { tag: "<ul> <ol>", text: "Bullet list, numbered list" },
        { tag: "<li>", text: "One item inside a list" },
        { tag: "<a href>", text: "A link to another page" },
        { tag: "<img>", text: "A picture (src and alt)" },
      ],
      pillW: 2.3,
      notes: "Revision slide. Cover the right side and ask students to explain each tag.",
    });
    T.quiz({
      q: "Which code correctly shows a picture of a cat?",
      options: ['<a src="cat.jpg">', '<img href="cat.jpg">', '<img src="cat.jpg" alt="Cat">', '<image src="cat.jpg">'],
      codeOptions: true, answer: 2,
      why: "img uses src for the file and alt to describe it.",
      notes: "Common trap: students mix up href (links) and src (files that load into the page).",
    });
    T.steps({
      title: "Your turn: my favourite place in Egypt",
      steps: [
        { h: "Heading", b: "An h1 with the place: Siwa, Luxor, Dahab…" },
        { h: "Two paragraphs", b: "Use strong on the key words." },
        { h: "A list", b: "Three things to do there, with ul and li." },
        { h: "Picture and link", b: "Add an img with alt, and a link to a website." },
      ],
      browser: {
        url: "luxor.html",
        runs: [
          pr("Luxor", { fontSize: 28, bold: true }),
          { text: "Luxor has the ", options: { fontSize: 16, color: C.text1 } }, { text: "Valley of the Kings", options: { fontSize: 16, bold: true, color: C.text1 } }, { text: ".", options: { fontSize: 16, color: C.text1, breakLine: true } },
          pr("Things to do:", { fontSize: 16, bold: true }),
          pr("Visit Karnak Temple", { bullet: true }), pr("Ride a felucca", { bullet: true }), pr("Try local food", { bullet: true }),
        ],
      },
      timer: "20 minutes",
      notes: "Encourage students to pick a place they have really visited. Pair students to review each other's alt text.",
    });
    T.recap({
      title: "What we learned today",
      items: [
        "strong and em show importance and emphasis.",
        "ul, ol and li build lists.",
        "a with href makes a link.",
        "img needs src and alt.",
        "Paths tell the browser where files live.",
      ],
      homework: "Add a second page to your site and link both pages to each other.",
      notes: "Preview next lesson: tables and forms.",
    });
  },
};

const lesson3 = {
  file: "Lesson3_Tables_Forms_Layout.pptx",
  short: "Lesson 3: Tables, Forms & Layout",
  build(D) {
    const { T, C, S, tx, pr } = D;
    T.title({
      lesson: "Lesson 3", title: "Tables, Forms & Page Layout", subtitle: "Organise data, collect answers and structure your site",
      ar: "الدرس الثالث: الجداول والنماذج وتنظيم الصفحة",
      notes: "Final lesson of the series: students finish with a mini-site.",
    });
    T.objectives({
      title: "By the end of this lesson you will…",
      items: [
        { icon: "FaTable", text: "Build a table with rows and cells" },
        { icon: "FaWpforms", text: "Create a simple form with inputs" },
        { icon: "FaLayerGroup", text: "Structure a page with semantic tags" },
        { icon: "FaBroom", text: "Follow clean-code habits" },
      ],
      panel: { icon: "FaTrophy", label: "TODAY'S GOAL", text: "Finish your Discover Egypt mini-site" },
      notes: "",
    });
    T.section({ num: 1, title: "Tables", sub: "Show data in rows and columns", ar: "الجداول", notes: "" });
    T.code({
      title: "Building a table",
      file: "table.html",
      code: ["<table>", "  <tr>", "    <th>Name</th>", "    <th>City</th>", "  </tr>", "  <tr>", "    <td>Ahmed</td>", "    <td>Cairo</td>", "  </tr>", "</table>"].join("\n"),
      codeW: 5.9, codeH: 4.5,
      preview: {
        url: "table.html", h: 2.2,
        draw: (s, r, g) => {
          const hdr = { bold: true, color: HEX.lt1, fill: { color: HEX.dk2 }, fontSize: 16, fontFace: "Calibri" };
          const cell = { color: HEX.dk1, fill: { color: HEX.lt1 }, fontSize: 16, fontFace: "Calibri" };
          s.addTable([
            [{ text: "Name", options: hdr }, { text: "City", options: hdr }],
            [{ text: "Ahmed", options: cell }, { text: "Cairo", options: cell }],
          ], { x: r.cx, y: r.cy + 0.1, w: r.cw - 0.4, colW: [(r.cw - 0.4) / 2, (r.cw - 0.4) / 2], rowH: 0.5, border: { type: "solid", color: HEX.dk2, pt: 1 } });
        },
      },
      notes_: [
        { tag: "<tr>", text: "A table row" },
        { tag: "<th>", text: "Header cell (bold, centred)" },
        { tag: "<td>", text: "Data cell" },
      ],
      chipW: 1.2,
      notes: "Mnemonic: table row, table header, table data.",
    });
    T.section({ num: 2, title: "Forms", sub: "Let visitors type and send information", ar: "النماذج", notes: "" });
    T.code({
      title: "A simple contact form",
      file: "contact.html",
      code: ["<form>", "  <label>Name:</label>", '  <input type="text">', "  <label>Email:</label>", '  <input type="email">', "  <button>Send</button>", "</form>"].join("\n"),
      codeW: 5.9,
      preview: {
        url: "contact.html", h: 4.1,
        draw: (s, r, g) => {
          const field = (label, y, k) => {
            s.addText(label, { x: r.cx, y, w: 2, h: 0.35, fontSize: 16, bold: true, color: C.text1, margin: 0, isTextBox: true, objectName: `a${g}_f${k}l` });
            s.addShape(S.roundRect, { x: r.cx, y: y + 0.4, w: r.cw, h: 0.5, fill: { color: C.background1 }, line: { color: C.text2, width: 1.5 }, rectRadius: 0.08, objectName: `a${g}_f${k}i` });
          };
          field("Name:", r.cy + 0.05, 1);
          field("Email:", r.cy + 1.1, 2);
          s.addShape(S.roundRect, { x: r.cx, y: r.cy + 2.3, w: 1.6, h: 0.55, fill: { color: C.accent1 }, rectRadius: 0.1, objectName: `a${g}_btn` });
          s.addText("Send", { x: r.cx, y: r.cy + 2.3, w: 1.6, h: 0.55, fontSize: 18, bold: true, color: C.text1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: `a${g}_btn_t` });
        },
      },
      notes: "A form without a server cannot really send data yet. That needs a back-end, which is a later topic. Today we focus on the building blocks.",
    });
    T.glossary({
      title: "Form tags and input types",
      items: [
        { tag: "<form>", text: "Wraps the whole form" },
        { tag: "<label>", text: "Names a field" },
        { tag: "<input>", text: "Where the user types" },
        { tag: "<button>", text: "Sends the form" },
        { tag: 'type="text"', text: "Any short text" },
        { tag: 'type="email"', text: "An email address" },
        { tag: 'type="password"', text: "Hides the characters" },
        { tag: 'type="checkbox"', text: "A tick box" },
      ],
      pillW: 2.7,
      notes: "Change the type live and show how the field behaves differently.",
    });
    T.section({ num: 3, title: "Page layout", sub: "Give every part of the page a meaningful name", ar: "تنظيم الصفحة", notes: "" });
    T.wireframe({
      title: "Semantic tags: name the parts",
      items: [
        { tag: "<header>", text: "Top of the page: logo and title" },
        { tag: "<nav>", text: "Menu of links" },
        { tag: "<main>", text: "The main content" },
        { tag: "<section>", text: "A topic inside the page" },
        { tag: "<aside>", text: "Side notes and extras" },
        { tag: "<footer>", text: "Bottom: contact and copyright" },
      ],
      notes: "Sites like news pages all follow this pattern. 'Semantic' means the tag name describes its meaning.",
    });
    T.cards({
      title: "4 habits of clean code",
      cards: [
        { icon: "FaIndent", head: "Indent", body: "Move inner tags 2 spaces to the right so you can see the structure." },
        { icon: "FaCheckCircle", head: "Close tags", body: "Every opening tag needs its closing tag, in the right order." },
        { icon: "FaUniversalAccess", head: "Write alt", body: "Every image gets alt text so everyone can understand it." },
        { icon: "FaCommentDots", head: "Comment", body: "<!-- Notes to yourself --> are not shown on the page." },
      ],
      notes: "Show a messy page and a clean page side by side. Ask which one they would rather fix.",
    });
    T.quiz({
      q: "Which tag creates ONE ROW of a table?",
      options: ["<td>", "<th>", "<tr>", "<table>"],
      codeOptions: true, answer: 2,
      why: "tr = table row. td and th are the cells inside it.",
      notes: "",
    });
    T.steps({
      title: "Final project: Discover Egypt",
      steps: [
        { h: "Page structure", b: "header, nav, main and footer." },
        { h: "A landmarks table", b: "Name and city for three places." },
        { h: "A contact form", b: "Name, email and a send button." },
        { h: "Pictures and links", b: "Use alt text and link to a second page." },
      ],
      side: { icon: "FaUsers", head: "Show and tell", body: "Swap seats with a classmate. Open their site and give one compliment and one tip." },
      notes: "Allow the full session. Have students bookmark their site in the school lab folder.",
    });
    T.recap({
      title: "You can build web pages!",
      items: [
        "table, tr, th and td make tables.",
        "form, label, input and button make forms.",
        "header, nav, main and footer organise a page.",
        "Clean code: indent, close tags, write alt text, add comments.",
        "Next: make it beautiful with CSS!",
      ],
      homework: "Add a new section to your Discover Egypt site about your own city, with a table and a picture.",
      notes: "Celebrate! Next series: CSS.",
    });
  },
};

module.exports = [lesson1, lesson2, lesson3];
