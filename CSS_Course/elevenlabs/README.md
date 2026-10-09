# ElevenLabs-ready narration (Arabic)

98 text files: 7 lessons x 14 slides. One file = one slide = one audio file, so the audio drops straight onto the matching PowerPoint slide.

## Folders
- `with_breaks/LessonN/slideNN.txt`: **recommended**. Pauses are `<break time="0.9s" />` tags, which Eleven Multilingual v2 (and Flash/Turbo v2.5) understand. The quiz slides contain a 5-second silence (two 2.5 s breaks) after each question, so the answer can be revealed after it.
- `plain/LessonN/slideNN.txt`: no tags (for Eleven v3 or any model that reads tags aloud). Pauses come only from punctuation and "…". Add think-time on the quiz slide in your editor.
- `manifest.csv` / `manifest.json`: lesson, slide, title, character count (about 39,500 characters in total; the longest slide is about 660).
- `generate_audio.py`: optional script that sends all slides to the ElevenLabs API (untested here: set `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID`, try `--lesson 1 --slide 1` first).
- `make_elevenlabs.py`: regenerates everything from `../script/*.md` if you edit the scripts.

## In the ElevenLabs web app
1. Text to Speech, model **Eleven Multilingual v2**, pick an Egyptian male voice from the Voice Library (search "Egyptian").
2. Suggested settings: Stability about 55%, Similarity 80%, Style 10-20%, Speed 0.95.
3. Paste one `with_breaks` file, generate, download, name it `slideNN.mp3`. Keep the same settings for every slide so the voice stays consistent.

## What was changed from the recording scripts
- Removed stage directions (`[رقم 1]`, `[اضغط]`, activity timings). `[اسكت]` became real silence.
- Pause marks `‖‖` became 0.9 s breaks; `‖` became a comma only where the text had no punctuation.
- Code and acronyms that a voice would misread were written as they are spoken: CSS = سي إس إس, HTML = إتش تي إم إل, ID = آي دي, rgb/hsl, fr, vh, F12, `@media`, `@keyframes`, `h1`, `style.css`, "grid" = جريد. Other English property names (flex, margin, padding...) stay in Latin letters; the multilingual model reads them in English.
- Tip: listen to slide 1 of each lesson first. If a term sounds wrong, edit that word in the .txt (write it in Arabic letters the way it should sound) and regenerate.
