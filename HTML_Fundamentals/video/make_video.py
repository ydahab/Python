#!/usr/bin/env python3
"""Build a narrated lesson video from a lesson deck.

  python3 video/make_video.py            # real Egyptian-Arabic voice (needs speech.platform.bing.com)
  python3 video/make_video.py --estimate # music + visuals only, timing estimated from word count

Steps: render slide frames (LibreOffice) -> synthesize narration per segment (edge-tts, ar-EG neural voice)
-> measure durations -> cross-fade slides with ffmpeg xfade -> mix narration over soft generated music
(music ducks under the voice).
"""
import argparse, asyncio, glob, json, os, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "video" / "build"
SKILL = glob.glob("/root/.claude/skills/synced/*/pptx")[0]
XF = ["fade", "smoothleft", "dissolve", "smoothup", "fade", "smoothright"]  # elegant, varied
T = 0.9  # transition seconds


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode:
        sys.exit(f"FAILED: {' '.join(map(str, cmd))[:200]}\n{r.stderr[-1500:]}")
    return r.stdout


def render_frames(deck_name, noanswer, folder):
    folder.mkdir(parents=True, exist_ok=True)
    if glob.glob(str(folder / "s-*.png")):
        return
    env = dict(os.environ, NODE_PATH=str(ROOT / "node_modules"), OUT_DIR=str(folder), ONLY=deck_name)
    if noanswer:
        env["NOANSWER"] = "1"
    run(["node", str(ROOT / "build.js")], env=env, cwd=ROOT)
    pptx = next(folder.glob(f"{deck_name}*.pptx"))
    run(["python3", f"{SKILL}/scripts/office/soffice.py", "--headless", "--convert-to", "pdf", "--outdir", str(folder), str(pptx)])
    run(["pdftoppm", "-png", "-scale-to-x", "1920", "-scale-to-y", "1080", str(pptx.with_suffix(".pdf")), str(folder / "s")])


async def synth(segments, voice, rate, folder):
    import edge_tts
    proxy = os.environ.get("HTTPS_PROXY")
    os.environ.setdefault("SSL_CERT_FILE", "/root/.ccr/ca-bundle.crt")
    for i, seg in enumerate(segments):
        import hashlib
        key = hashlib.md5(f"{voice}|{rate}|{seg['text']}".encode()).hexdigest()[:8]
        f = folder / f"v{i:02d}_{key}.mp3"  # cache key includes voice + text
        if not f.exists():
            await edge_tts.Communicate(seg["text"], voice, rate=rate, proxy=proxy).save(str(f))
        seg["audio"] = f


def dur(path):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]).strip())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lesson", default="Lesson1_Meet_HTML")
    ap.add_argument("--script", default=str(ROOT / "video" / "narration_lesson1.json"))
    ap.add_argument("--estimate", action="store_true", help="no voice: estimate timing, music only")
    ap.add_argument("--silent", action="store_true", help="no audio track at all; fixed reading time per slide")
    ap.add_argument("--out", default=None)
    a = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    script = json.load(open(a.script))
    segs = script["segments"]

    render_frames(a.lesson, False, OUT / "frames_full")
    render_frames(a.lesson, True, OUT / "frames_noans")

    if a.silent:
        a.estimate = True
        hold = {1: 5, 7: 4, 13: 9, 14: 13, 15: 13}  # seconds on screen; default 10 (title, section, quiz, activity, recap differ)
        for s in segs:
            s["dur"] = hold.get(s["slide"], 10)
            if s["slide"] == 13 and s["frame"] == "full":
                s["dur"] = 6
    elif a.estimate:
        for s in segs:
            s["dur"] = max(4.0, len(s["text"].split()) * 0.40)
    else:
        try:
            asyncio.run(synth(segs, script["voice"], script.get("rate", "+0%"), OUT))
        except Exception as e:
            sys.exit(f"Voice synthesis failed: {e!r}\nThe Egyptian neural voices need access to speech.platform.bing.com.")
        for s in segs:
            s["dur"] = dur(s["audio"])

    # timeline
    t = 0.0
    for i, s in enumerate(segs):
        s["off"] = t
        s["vstart"] = t + (0.9 if i == 0 else T) + 0.15
        s["vend"] = s["vstart"] + s["dur"]
        s["img"] = OUT / ("frames_noans" if s["frame"] == "noans" else "frames_full") / f"s-{s['slide']:02d}.png"
        t = s["vend"] + 0.6
    total = segs[-1]["vend"] + 2.0
    for i, s in enumerate(segs):
        end = segs[i + 1]["off"] + T if i + 1 < len(segs) else total
        s["len"] = end - s["off"]

    music = OUT / "music.wav"
    if not a.silent:
        run(["python3", str(ROOT / "video" / "make_music.py"), f"{total + 2:.1f}", str(music)])

    # ffmpeg graph
    cmd = ["ffmpeg", "-y", "-v", "error"]
    for s in segs:
        cmd += ["-loop", "1", "-framerate", "30", "-t", f"{s['len'] + 0.05:.3f}", "-i", str(s["img"])]
    n = len(segs)
    voice_inputs = []
    if not a.estimate:
        for s in segs:
            cmd += ["-i", str(s["audio"])]
    if not a.silent:
        cmd += ["-i", str(music)]
    mi = n + (0 if a.estimate else n)
    f = []
    for i in range(n):
        f.append(f"[{i}:v]format=yuv420p,setsar=1[v{i}]")
    prev = "v0"
    for i in range(1, n):
        kind = "fade" if segs[i]["slide"] == segs[i - 1]["slide"] else XF[(i - 1) % len(XF)]
        f.append(f"[{prev}][v{i}]xfade=transition={kind}:duration={T}:offset={segs[i]['off']:.3f}[x{i}]")
        prev = f"x{i}"
    f.append(f"[{prev}]fade=t=out:st={total - 1.2:.2f}:d=1.2[vout]")
    if a.silent:
        pass
    elif a.estimate:
        f.append(f"[{mi}:a]volume=0.55,afade=t=out:st={total - 2:.2f}:d=2,atrim=0:{total:.2f}[aout]")
    else:
        for i, s in enumerate(segs):
            ms = int(s["vstart"] * 1000)
            f.append(f"[{n + i}:a]aresample=44100,aformat=channel_layouts=stereo,adelay={ms}|{ms}[d{i}]")
        f.append("".join(f"[d{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0[voice]")
        f.append("[voice]asplit=2[vo1][vo2]")
        f.append(f"[{mi}:a]volume=0.30[mus]")
        f.append("[mus][vo2]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=700[duck]")
        f.append(f"[vo1][duck]amix=inputs=2:normalize=0,afade=t=out:st={total - 2:.2f}:d=2,atrim=0:{total:.2f},loudnorm=I=-16:TP=-1.5[aout]")
    out = a.out or str(ROOT / "video" / ("Lesson1_Meet_HTML_silent.mp4" if a.silent else "Lesson1_preview_music_only.mp4" if a.estimate else "Lesson1_Meet_HTML_Egyptian_voiceover.mp4"))
    maps = ["-map", "[vout]"] + ([] if a.silent else ["-map", "[aout]", "-c:a", "aac", "-b:a", "192k"])
    cmd += ["-filter_complex", ";".join(f), *maps, "-t", f"{total:.2f}",
            "-c:v", "libx264", "-preset", "medium", "-crf", "22", "-r", "30", "-movflags", "+faststart", out]
    run(cmd)
    print(f"wrote {out}  ({total:.0f}s)")


if __name__ == "__main__":
    main()
