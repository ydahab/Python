#!/usr/bin/env python3
"""Wrap the finished lesson video with an intro and a closing clip.

  python3 video/add_intro_outro.py --intro intro.mp4 --closing closing.mp4

Video: intro -> lesson -> closing, joined through short dips to black (the lesson already fades in/out).
Audio: rebuilt for the whole timeline - the lesson's voice recordings are shifted by the intro length,
and one continuous soft music bed runs under everything and ducks under the voice.
Needs build/cine/timeline.json and build/cine/audio from make_cinematic.py.
"""
import argparse, json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def run(cmd):
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"FAILED: {' '.join(map(str, cmd))[:300]}\n{r.stderr[-2000:]}")
    return r.stdout


def dur(p):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).strip())


ap = argparse.ArgumentParser()
ap.add_argument("--build-dir", default=str(ROOT / "video" / "build"))
ap.add_argument("--intro", required=True)
ap.add_argument("--closing", required=True)
ap.add_argument("--main", default=str(ROOT / "video" / "Lesson1_Meet_HTML_cinematic.mp4"))
ap.add_argument("--out", default=str(ROOT / "video" / "Lesson1_Meet_HTML_final.mp4"))
ap.add_argument("--music-volume", type=float, default=0.30)
ap.add_argument("--crf", default="19")
ap.add_argument("--no-music", action="store_true", help="voice only; with --video-from the picture is reused without re-encoding")
ap.add_argument("--video-from", default=None, help="existing finished video whose picture is reused (with --no-music)")
a = ap.parse_args()

CINE = Path(a.build_dir) / "cine"
tl = json.load(open(CINE / "timeline.json"))
voices = sorted((CINE / "audio").glob("slide*_media*.mp3"))
n = len(voices)
d_in, d_main, d_out = dur(a.intro), dur(a.main), dur(a.closing)
total = d_in + d_main + d_out
print(f"intro {d_in:.2f}s + lesson {d_main:.2f}s + closing {d_out:.2f}s = {total:.1f}s")

if a.no_music:
    # voice-only audio, then mux with the picture of an already finished video
    cmd = ["ffmpeg", "-y", "-v", "error"]
    for v in voices:
        cmd += ["-i", v]
    f = []
    for i in range(n):
        ms = int((tl["voice_start"][i] + d_in) * 1000)
        f.append(f"[{i}:a]highpass=f=70,acompressor=threshold=0.06:ratio=2.5:attack=15:release=250:makeup=2,"
                 f"aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms}[d{i}]")
    f.append("".join(f"[d{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0:duration=longest,apad=whole_dur={total:.2f},"
             f"atrim=0:{total:.2f},afade=t=out:st={total - 1.5:.2f}:d=1.5,loudnorm=I=-16:TP=-1.5:LRA=9,aresample=48000[aout]")
    wav = CINE / "voice_only.wav"
    run(cmd + ["-filter_complex", ";".join(f), "-map", "[aout]", "-t", f"{total:.2f}", wav])
    if a.video_from:
        run(["ffmpeg", "-y", "-v", "error", "-i", a.video_from, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
             "-c:a", "aac", "-ar", "48000", "-b:a", "192k", "-t", f"{total:.2f}", "-tag:v", "avc1", "-movflags", "+faststart", a.out])
    else:
        fmt = "scale=1920:1080:flags=lanczos,setsar=1,fps=30,format=yuv420p"
        g = [f"[0:v]{fmt},fade=t=out:st={d_in - 0.7:.2f}:d=0.7[v0]", f"[1:v]{fmt}[v1]",
             f"[2:v]{fmt},fade=t=in:st=0:d=0.8,fade=t=out:st={d_out - 1.0:.2f}:d=1.0[v2]", "[v0][v1][v2]concat=n=3:v=1:a=0[vout]"]
        run(["ffmpeg", "-y", "-v", "error", "-i", a.intro, "-i", a.main, "-i", a.closing, "-i", wav, "-filter_complex", ";".join(g),
             "-map", "[vout]", "-map", "3:a", "-t", f"{total:.2f}", "-c:v", "libx264", "-preset", "fast", "-crf", a.crf, "-r", "30",
             "-c:a", "aac", "-ar", "48000", "-b:a", "192k", "-tag:v", "avc1", "-movflags", "+faststart", a.out])
    print("wrote", a.out)
    sys.exit(0)

music = CINE / "music_full.wav"
run(["python3", ROOT / "video" / "make_music.py", f"{total + 3:.1f}", music])

cmd = ["ffmpeg", "-y", "-v", "error", "-i", a.intro, "-i", a.main, "-i", a.closing]
for v in voices:
    cmd += ["-i", v]
cmd += ["-i", music]
mi = 3 + n
f = []
fmt = "scale=1920:1080:flags=lanczos,setsar=1,fps=30,format=yuv420p"
f.append(f"[0:v]{fmt},fade=t=out:st={d_in - 0.7:.2f}:d=0.7[v0]")
f.append(f"[1:v]{fmt}[v1]")
f.append(f"[2:v]{fmt},fade=t=in:st=0:d=0.8,fade=t=out:st={d_out - 1.0:.2f}:d=1.0[v2]")
f.append("[v0][v1][v2]concat=n=3:v=1:a=0[vout]")
for i in range(n):
    ms = int((tl["voice_start"][i] + d_in) * 1000)
    f.append(f"[{3 + i}:a]highpass=f=70,acompressor=threshold=0.06:ratio=2.5:attack=15:release=250:makeup=2,"
             f"aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms}[d{i}]")
f.append("".join(f"[d{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0:duration=longest[voice]")
f.append("[voice]asplit=2[vo1][vo2]")
f.append(f"[{mi}:a]aformat=channel_layouts=stereo,volume={a.music_volume},afade=t=in:st=0:d=2.5[mus]")
f.append("[mus][vo2]sidechaincompress=threshold=0.012:ratio=8:attack=30:release=900[duck]")
f.append(f"[vo1][duck]amix=inputs=2:normalize=0:duration=longest,atrim=0:{total:.2f},afade=t=out:st={total - 2.5:.2f}:d=2.5,"
         f"loudnorm=I=-16:TP=-1.5:LRA=9,aresample=48000[aout]")
cmd += ["-filter_complex", ";".join(f), "-map", "[vout]", "-map", "[aout]", "-t", f"{total:.2f}",
        "-c:v", "libx264", "-preset", "fast", "-crf", a.crf, "-r", "30", "-c:a", "aac", "-ar", "48000", "-b:a", "192k",
        "-tag:v", "avc1", "-movflags", "+faststart", a.out]
run(cmd)
print("wrote", a.out)
