# ElevenLabs-ready narration: the detailed Arabic scripts

98 text files (7 lessons x 14 slides) made from `../script_ar_detailed/*.md`, which accompany the Arabic decks in `../decks_ar/`. One file = one slide = one audio file.

## Folders
- `with_breaks/LessonN/slideNN.txt` (recommended): `<break time="0.9s" />` tags for the long pauses, understood by Eleven Multilingual v2 and Flash/Turbo v2.5. On the quiz slides each question is followed by 5 seconds of silence (two 2.5 s breaks), so you can reveal the answer after it. About 7 tags per slide.
- `plain/LessonN/slideNN.txt`: no tags (Eleven v3 or any model that would read tags aloud). Pauses come only from punctuation and "...".
- `manifest.csv` / `manifest.json`: lesson, slide, title, characters (about 110,000 characters in all; the longest slide is 2,269).
- `generate_audio.py`: optional API script (untested here, no access to api.elevenlabs.io). Set `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID`, try `--lesson 1 --slide 1` first.
- `../elevenlabs/make_elevenlabs.py`: regenerates everything. For these files: `python3 make_elevenlabs.py --src ../script_ar_detailed --pattern "Lesson*_detailed_ar.md" --out ../elevenlabs_detailed` (add `--keep-teacher` to keep the paragraphs described below).

## What was removed or changed
- Performance cues (`[أشّر على...]`, `[اضغط]`, `[وقفة طويلة]`...) are not spoken. `[اسكت 5 ثواني]` became real silence.
- Teacher-only paragraphs are left out because they would sound odd in a video: follow-up tips for students during activities, graded hints for challenges, "expected question" notes, post-quiz discussion prompts and closing remarks. They stay in the Word/markdown scripts.
- Code and acronyms are written as they are spoken (CSS = سي إس إس, HTML = إتش تي إم إل, ID = آي دي, rgb, hsl, fr, vh, vw, F12, `@media`, `@keyframes`, "grid" = جريد, single letters a/b/p/X/Y/R/G/B). Other property names (flex, margin, padding...) stay in Latin letters and are read in English by the multilingual model.

## Suggested settings (ElevenLabs Text to Speech)
Model Eleven Multilingual v2; an Egyptian male voice from the Voice Library; Stability about 55%, Similarity 80%, Style 10-20%, Speed 0.95. Use the same settings for all slides. Listen to slide 1 of each lesson first and fix any word that is mispronounced by writing it in Arabic letters the way it should sound.
