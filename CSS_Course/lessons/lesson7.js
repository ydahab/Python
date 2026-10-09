const curve = (name, color, d, x) => `<g transform="translate(${x},0)"><rect x="0" y="0" width="200" height="200" fill="#fff" stroke="#C7D2FE" stroke-width="2" rx="8"/><path d="${d}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/><text x="100" y="236" text-anchor="middle" font-family="Courier New" font-weight="bold" font-size="17" fill="#10132B">${name}</text></g>`;

module.exports = {
  n: 7, file: "CSS_Lesson7_Transitions_and_Animations.pptx", short: "Transitions & Animations",
  title: "Transitions, Transforms & Animations", subtitle: "Bring your pages to life, and keep the motion accessible",
  meta: "High school  |  Prior knowledge: Lessons 1-6  |  ~50 min",
  objectives: [
    "Animate changes between two states with transition",
    "Move, scale and rotate elements with transform",
    "Create multi-step animations with @keyframes, and respect reduced-motion settings",
  ],
  terms: [
    { t: "Transition", d: "A smooth change from one set of styles to another, for example on hover." },
    { t: "Transform", d: "A visual change to an element: translate (move), scale, rotate or skew." },
    { t: "Keyframes", d: "The named steps of an animation, written with @keyframes (from/to or percentages)." },
    { t: "Easing", d: "The speed curve of motion: ease, linear, ease-in-out and others." },
  ],
  concept: {
    title: "The big ideas",
    cards: [
      { h: "Transitions: two states, smooth change", b: "Put transition on the NORMAL state: which property, how long, which easing. When the style changes (for example on :hover) the browser animates the difference.", code: "transition: background 0.3s ease;" },
      { h: "Transforms move things visually", b: "translate, scale and rotate change how an element is drawn without moving its neighbours. They are smooth and fast, so they are the best choice for animation.", code: "transform: scale(1.1);" },
      { h: "Animations run on their own", b: "Define steps with @keyframes, then attach them with animation: name, duration, easing, repeat. Always respect users who ask for less motion.", code: "animation: spin 1s infinite;" },
    ],
  },
  diagram: {
    title: "Easing: the speed curve", vp: [760, 500],
    captions: ["linear: constant speed. Good for spinners.", "ease (default) and ease-in-out: start and end gently, which feels natural.", "Time goes left to right, progress bottom to top. A steeper line means faster movement."],
    html: `<svg width="760" height="500" viewBox="0 0 760 500"><text x="380" y="52" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="26" fill="#2B3A8F">progress over time</text>
      <g transform="translate(0,100)">${curve("linear", "#2965F1", "M10 190 L190 10", 40)}${curve("ease", "#FF4F8B", "M10 190 C 60 190, 60 10, 190 10", 280)}${curve("ease-in-out", "#22A55E", "M10 190 C 110 190, 90 10, 190 10", 520)}</g>
      <text x="380" y="420" text-anchor="middle" font-family="Courier New" font-size="19" fill="#10132B">transition: transform 0.4s ease-in-out;</text></svg>`,
  },
  examples: [
    {
      title: "A hover transition", intro: "The transition lives on the normal state, the change lives on :hover.",
      html: `<button class="btn">Hover me</button>`,
      css: `.btn {\n  background: #2965f1;\n  color: white;\n  border: none;\n  padding: 12px 24px;\n  border-radius: 10px;\n  transition: background 0.3s, transform 0.3s;\n}\n.btn:hover {\n  background: #ff4f8b;\n  transform: translateY(-4px) scale(1.05);\n}`,
      ann: [
        { line: 6, text: "Two transitions, 0.3 seconds each (default easing is ease)." },
        { line: 9, text: "Hover colour. Because of the transition it fades instead of snapping." },
        { line: 10, text: "translateY(-4px) lifts the button 4px; scale(1.05) makes it 5% bigger." },
      ],
      vp: [560, 130], extra: { hover: ".btn", wait: 700 },
    },
    {
      title: "Keyframe animation: a bouncing ball", intro: "@keyframes defines the steps; animation attaches them to an element.",
      html: `<div class="ball"></div>`,
      css: `.ball {\n  width: 60px;\n  height: 60px;\n  border-radius: 50%;\n  background: #ff4f8b;\n  animation: bounce 1s infinite alternate;\n}\n@keyframes bounce {\n  from { transform: translateY(0); }\n  to { transform: translateY(120px); }\n}`,
      ann: [
        { line: 5, text: "animation shorthand: name, duration, repeat, direction." },
        { line: 5, text: "infinite = forever; alternate = forwards, then back." },
        { line: 7, text: "The @keyframes name must match the animation name." },
        { line: 9, text: "Start at 0, end 120px lower; the browser fills in between." },
      ],
      vp: [560, 260], extra: { freeze: -0.5 },
    },
    {
      title: "A loading spinner (and reduced motion)", intro: "A linear, endless rotation. Slow it down for people who prefer less motion.",
      html: `<div class="spinner"></div>`,
      css: `.spinner {\n  width: 48px;\n  height: 48px;\n  border: 6px solid #e0e7ff;\n  border-top-color: #2965f1;\n  border-radius: 50%;\n  animation: spin 0.9s linear infinite;\n}\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n@media (prefers-reduced-motion: reduce) {\n  .spinner { animation-duration: 3s; }\n}`,
      ann: [
        { line: 3, text: "A circle with a light border, and only the top border coloured." },
        { line: 6, text: "linear keeps the speed constant, which suits a spinner." },
        { line: 8, text: "With only a 'to' step, the animation starts from the element's normal state." },
        { line: 11, text: "prefers-reduced-motion: users can ask their system for less motion. Respect it." },
      ],
      vp: [560, 130], extra: { freeze: -0.225 },
    },
  ],
  realworld: {
    title: "Real-world: feedback, focus and flow",
    items: [
      { icon: "FaHandPointer", h: "Interface feedback", b: "Buttons that lift or change colour, menus that slide in: small transitions tell users the page noticed their action." },
      { icon: "FaSyncAlt", h: "Loading states", b: "Spinners and progress bars show that something is happening, which keeps people from clicking again and again." },
      { icon: "FaFilm", h: "Storytelling", b: "Landing pages fade and slide content into view as you scroll, guiding attention. Used well, motion explains; used badly, it distracts." },
    ],
    tryIt: "open DevTools, choose the Animations panel (in the More tools menu), then hover or reload. You can slow animations down to 10% to see exactly what happens.",
  },
  mistakes: [
    { bad: ".btn:hover {\n  transition: 0.3s;\n  background: pink;\n}", good: ".btn {\n  transition: 0.3s;\n}\n.btn:hover {\n  background: pink;\n}", why: "A transition only on :hover animates in but snaps back. Put it on the normal state to animate both ways." },
    { bad: "transition: all 1s;\n/* animates width, top... */", good: "transition: transform 0.3s,\n  opacity 0.3s;", why: "Animate transform and opacity: they are smooth. Animating width, height or top forces slow re-layout." },
    { bad: "animation: spinn 1s infinite;\n@keyframes spin { ... }", good: "animation: spin 1s infinite;\n@keyframes spin { ... }", why: "The names must match exactly, otherwise nothing animates and there is no error message." },
  ],
  tips: [
    { icon: "FaBolt", h: "Keep it quick", b: "UI transitions feel best between 150ms and 400ms. Long animations make an interface feel slow." },
    { icon: "FaUniversalAccess", h: "Respect reduced motion", b: "Wrap strong movement in @media (prefers-reduced-motion: no-preference) or tone it down for users who ask." },
    { icon: "FaRocket", h: "Animate transform and opacity", b: "These two properties are handled by the graphics hardware and stay smooth even on a phone." },
    { icon: "FaEye", h: "Animate with purpose", b: "Ask: does this motion help the user understand something? If not, leave it out." },
  ],
  activity: {
    title: "Activity: animated landing hero", time: "25 min",
    brief: "Make the hero text slide up and fade in one after another, and add a hover effect to the button.",
    steps: [
      "Write @keyframes rise: from opacity 0 and translateY(20px) to opacity 1 and translateY(0).",
      "Give h1, p and the button animation: rise 0.8s ease both. (both keeps the final state.)",
      "Stagger them with animation-delay: 0s, 0.2s and 0.4s.",
      "Add a transition and a :hover transform: scale(1.06) on the button.",
      "Wrap the animation in prefers-reduced-motion: no-preference.",
    ],
    bonus: "Add a pulsing glow with a second @keyframes using box-shadow.",
    html: `<section class="hero">\n  <h1>Learn CSS</h1>\n  <p>Make the web look amazing.</p>\n  <a class="cta" href="#">Start now</a>\n</section>`,
    starter: `/* Lesson 7 activity: animated hero */\n\nbody {\n  margin: 0;\n  font-family: Arial, sans-serif;\n}\n\n.hero {\n  text-align: center;\n  padding: 50px 20px;\n  background: linear-gradient(135deg, #2965f1, #8b5cf6);\n  color: white;\n}\n\n.cta {\n  display: inline-block;\n  background: #ffc83d;\n  color: #10132b;\n  padding: 12px 26px;\n  border-radius: 30px;\n  text-decoration: none;\n  font-weight: bold;\n}\n\n/* 1. @keyframes rise */\n\n/* 2-3. animation and delays */\n\n/* 4. hover transition */\n\n/* 5. prefers-reduced-motion */\n`,
    solution: `body {\n  margin: 0;\n  font-family: Arial, sans-serif;\n}\n.hero {\n  text-align: center;\n  padding: 50px 20px;\n  background: linear-gradient(135deg, #2965f1, #8b5cf6);\n  color: white;\n}\n.cta {\n  display: inline-block;\n  background: #ffc83d;\n  color: #10132b;\n  padding: 12px 26px;\n  border-radius: 30px;\n  text-decoration: none;\n  font-weight: bold;\n  transition: transform 0.3s ease;\n}\n.cta:hover {\n  transform: scale(1.06);\n}\n@keyframes rise {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (prefers-reduced-motion: no-preference) {\n  .hero h1, .hero p, .cta {\n    animation: rise 0.8s ease both;\n  }\n  .hero p { animation-delay: 0.2s; }\n  .cta { animation-delay: 0.4s; }\n}`,
    vp: [560, 270], extra: { wait: 1800 },
  },
  challenge: {
    title: "Challenge: the flip card", time: "35 min",
    brief: "Build a card that flips to show its back when you hover. You will use 3D transforms.",
    steps: [
      "Set perspective: 800px on .scene (it gives the 3D depth). Size it 220 x 280px.",
      "Make .card fill the scene, set transform-style: preserve-3d and a 0.8s transition on transform.",
      "On .scene:hover .card use transform: rotateY(180deg).",
      "Stack the faces with position: absolute; inset: 0 and hide their backs with backface-visibility: hidden.",
      "Rotate .back by 180deg so its text reads correctly after the flip.",
    ],
    bonus: "Add a second card, or flip on keyboard focus with :focus-within for accessibility.",
    html: `<div class="scene">\n  <div class="card">\n    <div class="face front">Front<br>Hover me</div>\n    <div class="face back">Back<br>CSS is fun!</div>\n  </div>\n</div>`,
    starter: `/* Lesson 7 challenge: 3D flip card */\n\nbody {\n  margin: 0;\n  padding: 24px;\n  font-family: Arial, sans-serif;\n}\n\n.face {\n  display: grid;\n  place-items: center;\n  border-radius: 16px;\n  font-size: 1.4rem;\n  font-weight: bold;\n  text-align: center;\n  color: white;\n}\n\n.front {\n  background: #2965f1;\n}\n\n.back {\n  background: #ff4f8b;\n}\n\n/* .scene, .card and the 3D rules go here */\n`,
    solution: `body {\n  margin: 0;\n  padding: 24px;\n  font-family: Arial, sans-serif;\n}\n.scene {\n  width: 220px;\n  height: 280px;\n  perspective: 800px;\n}\n.card {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  transform-style: preserve-3d;\n  transition: transform 0.8s;\n}\n.scene:hover .card {\n  transform: rotateY(180deg);\n}\n.face {\n  position: absolute;\n  inset: 0;\n  backface-visibility: hidden;\n  display: grid;\n  place-items: center;\n  border-radius: 16px;\n  font-size: 1.4rem;\n  font-weight: bold;\n  text-align: center;\n  color: white;\n}\n.front {\n  background: #2965f1;\n}\n.back {\n  background: #ff4f8b;\n  transform: rotateY(180deg);\n}`,
    vp: [560, 330], extra: { hover: ".scene", wait: 1200 },
  },
  quiz: [
    { q: "Where should the transition property go: the normal state or :hover?", a: "On the normal state, so the change animates both when entering and leaving the hover." },
    { q: "Which two properties are best to animate for smooth motion?", a: "transform and opacity." },
    { q: "How can CSS respect users who get dizzy from motion?", mono: true, a: "Use @media (prefers-reduced-motion: reduce) to remove or slow animations." },
  ],
  summary: [
    "transition animates between two states; put it on the normal state.",
    "transform: translate, scale and rotate change how an element is drawn.",
    "@keyframes + animation create multi-step motion.",
    "Easing sets the feel: linear for spinners, ease for most UI.",
    "Animate transform and opacity, keep it short, and honour reduced motion.",
  ],
  next: "Course complete! Build a mini-site that uses all 7 lessons.",
};
