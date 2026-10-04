# HTML Fundamentals for Egyptian School Students

Six PowerPoint lessons (English, with Arabic subtitles and Egyptian examples).

| Deck | Topics |
|------|--------|
| `decks/Lesson1_Meet_HTML.pptx` | What HTML is, tags and elements, page skeleton, headings, paragraphs |
| `decks/Lesson2_Text_Lists_Links_Images.pptx` | strong/em, lists, links, images, file paths |
| `decks/Lesson3_Tables_Forms_Layout.pptx` | Tables, forms, semantic layout, clean-code habits, mini-project |
| `decks/Lesson4_Attributes_Containers.pptx` | Attributes, div and span, id vs class, special characters, Arabic (RTL) pages |
| `decks/Lesson5_Media_Links_Head.pptx` | Video and audio, mailto/tel/new-tab links, iframe, online safety, head and meta tags |
| `decks/Lesson6_Capstone_Build_and_Publish.pptx` | Plan, build, check, accessibility and publish a multi-page website; rubric |

Every slide has a PowerPoint transition (fade, push, conveyor, doors, window, prism, vortex, ripple)
and entrance animations that play automatically. Quiz answers appear on click. Speaker notes hold teaching tips.
Run in Slide Show mode (F5) to see the motion. Transitions such as prism, vortex and ripple need PowerPoint 2010 or later.

## Rebuild
```
npm install
NODE_PATH=$PWD/node_modules node build.js
```
`lib.js` holds the design system and slide types, `lessons.js` and `lessons_more.js` the content, `motion.js` the transitions and animations.

## Narrated video (Lesson 1)
`video/narration_lesson1.json` is the Egyptian-dialect narration script. `video/make_video.py` renders the slides, synthesizes the
voice (Microsoft `ar-EG-SalmaNeural` through `edge-tts`), adds soft generated ambient music that ducks under the voice, and
cross-fades the slides into an MP4. Run `python3 video/make_video.py` (or `--estimate` for a music-only preview).
Needs `pip install edge-tts numpy`, ffmpeg and network access to `speech.platform.bing.com`.
