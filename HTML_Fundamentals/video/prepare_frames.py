#!/usr/bin/env python3
"""Render the build-step frames (elements appearing one after another) for a lesson deck.

  python3 video/prepare_frames.py --lesson Lesson2 --build-dir video/build/lesson2
Output: <build-dir>/steps/step_XX/s-NN.png, final_noans/, final_full/ (1920x1080).
"""
import argparse, glob, os, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = glob.glob("/root/.claude/skills/synced/*/pptx")[0]


def run(cmd, **kw):
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True, **kw)
    if r.returncode:
        sys.exit(f"FAILED: {' '.join(map(str, cmd))[:200]}\n{r.stderr[-1500:]}")
    return r.stdout


ap = argparse.ArgumentParser()
ap.add_argument("--lesson", required=True, help="deck file prefix, e.g. Lesson2")
ap.add_argument("--build-dir", required=True)
a = ap.parse_args()
B = Path(a.build_dir).resolve(); (B / "src").mkdir(parents=True, exist_ok=True)
env = dict(os.environ, NODE_PATH=str(ROOT / "node_modules"), ONLY=a.lesson, OUT_DIR=str(B / "src"))
run(["node", ROOT / "build.js"], env=env, cwd=ROOT)
deck = next((B / "src").glob(f"{a.lesson}*.pptx"))
steps = B / "steps"
run(["node", ROOT / "video" / "make_steps.js", deck, steps], env=env)
pptx = sorted(steps.glob("*.pptx"))
run(["python3", f"{SKILL}/scripts/office/soffice.py", "--headless", "--convert-to", "pdf", "--outdir", steps, *pptx])
for f in sorted(steps.glob("*.pdf")):
    d = steps / f.stem; d.mkdir(exist_ok=True)
    run(["pdftoppm", "-png", "-scale-to-x", "1920", "-scale-to-y", "1080", f, d / "s"])
print("frames ready in", steps)
