# CSS for High School: a 7-lesson presentation series

Level: **high school** (ages 15-18). Prerequisite: basic HTML (see `../HTML_Fundamentals`).
Each lesson is one 14-slide PowerPoint deck with native transitions and entrance animations.

| # | Deck (in `decks/`) | Topic |
|---|---|---|
| 1 | CSS_Lesson1_Basics_and_Selectors | Rules, selectors, pseudo-classes, specificity |
| 2 | CSS_Lesson2_Colors_Fonts_Text | Colour notations, typography, units, CSS variables |
| 3 | CSS_Lesson3_The_Box_Model | Padding, border, margin, box-sizing, centring |
| 4 | CSS_Lesson4_Flexbox | Containers, axes, wrap, centring |
| 5 | CSS_Lesson5_Grid | Tracks, fr, spans, named areas, auto-fit |
| 6 | CSS_Lesson6_Responsive_Design | Viewport, fluid layouts, media queries, clamp() |
| 7 | CSS_Lesson7_Transitions_and_Animations | Transitions, transforms, keyframes, reduced motion |

## Slide structure (every lesson)
1 Title, 2 Learning objective + key terms, 3 Big ideas, 4 Diagram, 5-7 Three annotated code examples (numbered code, real screenshot, explanations), 8 Real-world application, 9 Common mistakes, 10 Tips & best practices, 11 Hands-on activity, 12 Challenge, 13 Quick check (click to reveal answers), 14 Summary.

## Code files
`code/lessonN/example1..3/`, `activity/` (starter) + `activity/solution/`, `challenge/` (starter) + `challenge/solution/`. Each folder has `index.html` + `style.css`. Open `code/index.html` for links to everything.
The screenshots in the decks are real renders of these exact files (headless Chromium).

## Practise
- `playground.html`: offline editor with live preview, preloaded with all 49 files. No internet needed.
- `codepen.html`: buttons that open each example as a new pen on CodePen (needs internet; they post the code to CodePen's documented prefill endpoint; not verified from the build environment, which had no CodePen access).

## Rebuild
```
export NODE_PATH=<folder with pptxgenjs, react, react-dom, react-icons, sharp, jszip>
node build.js     # writes code/, assets/, decks/  (ONLY=3 builds one lesson)
node extras.js    # writes playground.html, codepen.html, code/index.html
```

## Arabic version
`decks_ar/` holds the same seven decks in Arabic (right-to-left layout, mirrored slide design, Arabic UI labels and explanations). Build with `node build_ar.js` (translations live in `lessons_ar/`; it reuses the screenshots rendered by `build.js`). Code samples, the screenshots of the example pages and the downloadable code stay in English, as CSS itself is written in English; the diagrams are re-rendered with Arabic labels.
