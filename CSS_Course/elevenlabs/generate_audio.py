#!/usr/bin/env python3
"""Send every slide text to the ElevenLabs text-to-speech API and save slideNN.mp3 files.

  export ELEVENLABS_API_KEY=...        # from elevenlabs.io > Developers > API keys
  export ELEVENLABS_VOICE_ID=...       # the voice you chose in the Voice Library (an Egyptian male voice, for example)
  python3 generate_audio.py --lesson 3            # one lesson
  python3 generate_audio.py                       # all seven lessons

Uses the with_breaks/ texts and model eleven_multilingual_v2. Existing mp3 files are skipped, so you can re-run safely.
Not tested from the build environment (no access to api.elevenlabs.io there): try one slide first.
"""
import argparse, json, os, sys, time, urllib.request, urllib.error
from pathlib import Path

HERE = Path(__file__).resolve().parent
ap = argparse.ArgumentParser()
ap.add_argument("--lesson", type=int)
ap.add_argument("--slide", type=int)
ap.add_argument("--model", default="eleven_multilingual_v2")
ap.add_argument("--out", default=str(HERE / "audio"))
ap.add_argument("--stability", type=float, default=0.55)
ap.add_argument("--similarity", type=float, default=0.8)
ap.add_argument("--style", type=float, default=0.15)
ap.add_argument("--speed", type=float, default=0.95)
a = ap.parse_args()

key, voice = os.environ.get("ELEVENLABS_API_KEY"), os.environ.get("ELEVENLABS_VOICE_ID")
if not key or not voice:
    sys.exit("Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID first.")

for r in json.load(open(HERE / "manifest.json", encoding="utf-8")):
    if a.lesson and r["lesson"] != a.lesson: continue
    if a.slide and r["slide"] != a.slide: continue
    out = Path(a.out) / f"Lesson{r['lesson']}" / f"slide{r['slide']:02d}.mp3"
    if out.exists():
        print("skip", out); continue
    out.parent.mkdir(parents=True, exist_ok=True)
    body = json.dumps({"text": r["text"], "model_id": a.model, "language_code": "ar",
                       "voice_settings": {"stability": a.stability, "similarity_boost": a.similarity, "style": a.style, "use_speaker_boost": True, "speed": a.speed}}).encode()
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128", body,
                                 {"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"})
    for attempt in range(4):
        try:
            out.write_bytes(urllib.request.urlopen(req, timeout=180).read())
            print("wrote", out); break
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:300]
            if e.code in (429, 500, 502, 503) and attempt < 3:
                time.sleep(2 ** (attempt + 1)); continue
            sys.exit(f"HTTP {e.code} for lesson {r['lesson']} slide {r['slide']}: {msg}")
