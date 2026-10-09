#!/usr/bin/env python3
"""Cinematic lesson video from a deck that already has a voice-over recorded on every slide.

  python3 video/make_cinematic.py --pptx my_deck_with_audio.pptx

Needs the build-step frames in video/build/steps (see make_steps.js) and ffmpeg.
Each slide's recording sets the slide's duration. Slide elements build in one after another (like the
PowerPoint animations), the camera drifts slowly, slides are joined with varied cinematic transitions,
and soft generated music ducks under the voice.
"""
import argparse, glob, hashlib, json, os, re, subprocess, sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
B = ROOT / "video" / "build"
T = 1.0      # transition length (s)
FADE = 0.35  # build-step cross-fade (s)
FPS = 30

# transition used when entering each slide number (cinematic variety; dips to black for section/outro)
CYCLE = ["smoothleft", "fade", "circleopen", "dissolve", "smoothup", "smoothleft", "horzopen", "fade"]


def trans_for(slide, dips):
    """Transition used when entering `slide` (1-based): dips to black for dividers and the recap."""
    if slide == 2:
        return "fadewhite"
    if slide in dips:
        return "fadeblack"
    return CYCLE[(slide - 3) % len(CYCLE)]


def run(cmd, **kw):
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True, **kw)
    if r.returncode:
        sys.exit(f"FAILED: {' '.join(map(str, cmd))[:300]}\n{r.stderr[-2000:]}")
    return r.stdout + r.stderr


def dur(p):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).strip())


def md5(p):
    return hashlib.md5(open(p, "rb").read()).hexdigest()


def extract_audio(pptx, out):
    out.mkdir(parents=True, exist_ok=True)
    z = zipfile.ZipFile(pptx)
    pres = z.read("ppt/presentation.xml").decode()
    prels = z.read("ppt/_rels/presentation.xml.rels").decode()
    rid = re.findall(r'<p:sldId [^>]*r:id="(rId\d+)"', pres)
    tgt = dict(re.findall(r'Id="(rId\d+)"[^>]*Target="([^"]+)"', prels))
    tgt.update({a: b for b, a in re.findall(r'Target="([^"]+)"[^>]*Id="(rId\d+)"', prels)})
    files = []
    for i, r in enumerate(rid, 1):
        slide = tgt[r].split("/")[-1]
        rels = z.read(f"ppt/slides/_rels/{slide}.rels").decode()
        m = re.findall(r'Target="\.\./media/(media\d+\.\w+)"', rels)
        if not m:
            sys.exit(f"slide {i} has no audio in {pptx}")
        f = out / f"slide{i:02d}_{m[0]}"
        f.write_bytes(z.read(f"ppt/media/{m[0]}"))
        files.append(f)
    return files


def find_reveal(audio):
    """Quiz slide: the answer starts after the longest silence in the recording."""
    txt = run(["ffmpeg", "-i", audio, "-af", "silencedetect=noise=-42dB:d=1.2", "-f", "null", "-"])
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", txt)]
    durs = [float(x) for x in re.findall(r"silence_duration: ([\d.]+)", txt)]
    if not ends:
        return dur(audio) * 0.55
    k = max(range(len(durs)), key=lambda i: durs[i])
    return ends[k] - 0.15


def step_frames(slide):
    """Distinct build-step images for a slide, in order."""
    imgs = [B / "steps" / f"step_{k:02d}" / f"s-{slide:02d}.png" for k in range(0, 20) if (B / "steps" / f"step_{k:02d}").exists()]
    out, last = [], None
    for p in imgs:
        h = md5(p)
        if h != last:
            out.append(p)
            last = h
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pptx", required=True, help="deck with a recording on every slide")
    ap.add_argument("--out", default=str(ROOT / "video" / "Lesson1_Meet_HTML_cinematic.mp4"))
    ap.add_argument("--build-dir", default=str(ROOT / "video" / "build"), help="folder holding steps/ (frames) and cine/ (work files)")
    ap.add_argument("--quiz-slides", default="13", help="comma list of quiz slide numbers (answer revealed mid-slide); '' for none")
    ap.add_argument("--dips", default="7,15", help="comma list of slides entered through a dip to black (dividers, recap)")
    ap.add_argument("--no-music", action="store_true", help="write a picture-only main video (audio is mixed later)")
    ap.add_argument("--rtl", action="store_true", help="right-to-left deck (Arabic): mirror transition and camera-drift directions")
    ap.add_argument("--reveal", default=None, help="reveal seconds: one number, or slide:seconds pairs like 3:12.5,12:20; several answers on one slide: 23:11.5/27.6/38.7")
    ap.add_argument("--music", default=None, help="optional music file to use instead of the generated pad")
    ap.add_argument("--reuse-clips", action="store_true", help="skip re-encoding per-slide clips that already exist")
    ap.add_argument("--music-volume", type=float, default=0.30)
    a = ap.parse_args()
    global B
    B = Path(a.build_dir)
    quiz = [int(x) for x in a.quiz_slides.split(",") if x.strip()]
    dips = {int(x) for x in a.dips.split(",") if x.strip()}
    manual = {}
    if a.reveal:
        if ":" in a.reveal:
            manual = {int(k): [float(t) for t in v.split("/")] for k, v in (x.split(":") for x in a.reveal.split(","))}
        elif len(quiz) == 1:
            manual = {quiz[0]: [float(a.reveal)]}

    work = B / "cine"; work.mkdir(parents=True, exist_ok=True)
    audio = extract_audio(a.pptx, work / "audio")
    n = len(audio)
    adur = [dur(f) for f in audio]

    # ---- timeline
    off, vs = [], []
    t = 0.0
    for i in range(n):
        off.append(t)
        vs.append(t + (1.6 if i == 0 else T + 0.25))
        t = vs[-1] + adur[i] + 0.9
    total = vs[-1] + adur[-1] + 2.8
    length = [(off[i + 1] + T if i + 1 < n else total) - off[i] for i in range(n)]

    reveals = {}
    for q in quiz:
        reveals[q] = manual.get(q, [find_reveal(audio[q - 1])])
        print(f"quiz slide {q}: answers revealed at {', '.join(f'{t:.1f}' for t in reveals[q])}s of the recording (override with --reveal {q}:seconds)")

    # ---- per-slide clips: build-up + camera drift
    clips = []
    for i in range(n):
        s = i + 1
        frames = step_frames(s)
        base = 1.7 if i == 0 else T + 0.2
        events = [(0.0, frames[0])] + [(base + 0.5 * j, p) for j, p in enumerate(frames[1:])]
        final = B / "steps" / "final_noans" / f"s-{s:02d}.png"
        if s in reveals:
            events.append((events[-1][0] + 0.5, final))
            for j, tj in enumerate(reveals[s]):
                last = j == len(reveals[s]) - 1
                events.append((vs[i] - off[i] + tj, B / "steps" / ("final_full" if last else f"final_k{j + 1}") / f"s-{s:02d}.png"))
        else:
            events.append((events[-1][0] + 0.5, B / "steps" / "final_full" / f"s-{s:02d}.png"))
        # drop duplicate consecutive frames
        ev, last = [], None
        for tt, p in events:
            h = md5(p)
            if h != last:
                ev.append((tt, p)); last = h
        L = length[i]
        cmd = ["ffmpeg", "-y", "-v", "error"]
        for j, (tt, p) in enumerate(ev):
            d = (ev[j + 1][0] - tt + FADE) if j + 1 < len(ev) else (L - tt)
            cmd += ["-loop", "1", "-framerate", str(FPS), "-t", f"{d:.3f}", "-i", p]
        f = [f"[{j}:v]scale=2016:1134:flags=lanczos,setsar=1,format=yuv420p,fps={FPS}[f{j}]" for j in range(len(ev))]
        prev = "f0"
        for j in range(1, len(ev)):
            f.append(f"[{prev}][f{j}]xfade=transition=fade:duration={FADE}:offset={ev[j][0]:.3f}[g{j}]")
            prev = f"g{j}"
        # slow camera drift (direction alternates per slide)
        x0, x1 = (0.15, 0.85) if i % 2 == 0 else (0.85, 0.15)
        if a.rtl:
            x0, x1 = x1, x0
        y0, y1 = (0.2, 0.8) if i % 3 == 0 else (0.8, 0.2) if i % 3 == 1 else (0.5, 0.5)
        f.append(f"[{prev}]crop=1920:1080:x='(iw-ow)*({x0}+({x1}-{x0})*t/{L:.3f})':y='(ih-oh)*({y0}+({y1}-{y0})*t/{L:.3f})'[c]")
        out = work / f"clip{s:02d}.mp4"
        if a.reuse_clips and out.exists():
            clips.append(out); continue
        cmd += ["-filter_complex", ";".join(f), "-map", "[c]", "-t", f"{L:.3f}", "-c:v", "libx264", "-preset", "veryfast", "-crf", "14", "-pix_fmt", "yuv420p", out]
        run(cmd)
        clips.append(out)
        print("clip", s, f"{L:.1f}s", f"{len(ev)} frames")

    # ---- music
    if a.no_music:
        music = None
    elif a.music:
        music = Path(a.music)
    else:
        music = work / "music.wav"
        run(["python3", ROOT / "video" / "make_music.py", f"{total + 3:.1f}", music])

    # ---- final assembly
    cmd = ["ffmpeg", "-y", "-v", "error"]
    for c in clips:
        cmd += ["-i", c]
    if not a.no_music:
        for f_ in audio:
            cmd += ["-i", f_]
        cmd += ["-stream_loop", "-1", "-i", music]
    mi = 2 * n
    f = []
    prev = "0:v"
    for i in range(1, n):
        kind = trans_for(i + 1, dips)
        if a.rtl:
            kind = kind.replace("left", "\0").replace("right", "left").replace("\0", "right")
        f.append(f"[{prev}][{i}:v]xfade=transition={kind}:duration={T}:offset={off[i]:.3f}[x{i}]")
        prev = f"x{i}"
    f.append(f"[{prev}]vignette=PI/18,drawbox=x=0:y=ih-5:w='iw*t/{total:.2f}':h=5:color=0x14B8A6@0.85:t=fill,"
             f"fade=t=in:st=0:d=1.2,fade=t=out:st={total - 2.0:.2f}:d=2.0,format=yuv420p[vout]")
    for i in range(0 if a.no_music else n):
        ms = int(vs[i] * 1000)
        f.append(f"[{n + i}:a]highpass=f=70,acompressor=threshold=0.06:ratio=2.5:attack=15:release=250:makeup=2,"
                 f"aresample=44100,aformat=channel_layouts=stereo,adelay={ms}|{ms}[d{i}]")
    if a.no_music:
        cmd += ["-filter_complex", ";".join(f), "-map", "[vout]", "-t", f"{total:.2f}", "-an",
                "-c:v", "libx264", "-preset", "veryfast", "-crf", "15", "-r", str(FPS), "-movflags", "+faststart", a.out]
    else:
        f.append("".join(f"[d{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0:duration=longest[voice]")
        f.append("[voice]asplit=2[vo1][vo2]")
        f.append(f"[{mi}:a]aformat=channel_layouts=stereo,volume={a.music_volume},afade=t=in:st=0:d=3[mus]")
        f.append("[mus][vo2]sidechaincompress=threshold=0.012:ratio=8:attack=30:release=900[duck]")
        f.append(f"[vo1][duck]amix=inputs=2:normalize=0:duration=first,atrim=0:{total:.2f},afade=t=out:st={total - 2.5:.2f}:d=2.5,"
                 f"loudnorm=I=-16:TP=-1.5:LRA=9,aresample=48000[aout]")
        cmd += ["-filter_complex", ";".join(f), "-map", "[vout]", "-map", "[aout]", "-t", f"{total:.2f}",
                "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-r", str(FPS), "-c:a", "aac", "-ar", "48000", "-b:a", "192k", "-movflags", "+faststart", a.out]
    run(cmd)
    print(f"wrote {a.out}  ({total:.0f}s = {total / 60:.1f} min)")
    json.dump({"offsets": off, "voice_start": vs, "durations": adur, "reveal": reveals}, open(work / "timeline.json", "w"), indent=1)


if __name__ == "__main__":
    main()
