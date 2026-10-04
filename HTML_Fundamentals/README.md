# HTML Fundamentals for Egyptian School Students

Three PowerPoint lessons (English, with Arabic subtitles and Egyptian examples).

| Deck | Topics |
|------|--------|
| `decks/Lesson1_Meet_HTML.pptx` | What HTML is, tags and elements, page skeleton, headings, paragraphs |
| `decks/Lesson2_Text_Lists_Links_Images.pptx` | strong/em, lists, links, images, file paths |
| `decks/Lesson3_Tables_Forms_Layout.pptx` | Tables, forms, semantic layout, clean-code habits, final project |

Every slide has a PowerPoint transition (fade, push, conveyor, doors, window, prism, vortex, ripple)
and entrance animations that play automatically. Quiz answers appear on click. Speaker notes hold teaching tips.
Run in Slide Show mode (F5) to see the motion. Transitions such as prism, vortex and ripple need PowerPoint 2010 or later.

## Rebuild
```
npm install
NODE_PATH=$PWD/node_modules node build.js
```
`lib.js` holds the design system and slide types, `lessons.js` the content, `motion.js` the transitions and animations.
