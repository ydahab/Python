"""Generate soft, original ambient background music (no samples, no copyright).
Warm sine/triangle pads on a slow Am9 - Fmaj7 - Cmaj7 - G6 loop with sparse pentatonic bells."""
import sys, wave
import numpy as np

secs = float(sys.argv[1]); out = sys.argv[2]
sr = 44100
n = int(secs * sr)
t = np.arange(n) / sr
rng = np.random.default_rng(7)
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)

chords = [  # midi notes, 8 s per chord
    [45, 57, 60, 64, 71],   # Am9
    [41, 53, 57, 60, 64],   # Fmaj7
    [48, 55, 60, 64, 71],   # Cmaj7
    [43, 55, 59, 62, 64],   # G6
]
seg = 8.0
L = np.zeros(n); R = np.zeros(n)
for i in range(int(np.ceil(secs / seg))):
    s0, s1 = int(i * seg * sr), min(n, int((i + 1) * seg * sr + 2 * sr))  # overlap tails
    tt = (np.arange(s0, s1) - s0) / sr
    # slow swell envelope: attack 2.5s, release over the overlap
    env = np.minimum(1, tt / 2.5) * np.clip((seg + 2 - tt) / 2.0, 0, 1)
    for k, m in enumerate(chords[i % 4]):
        f = hz(m)
        for det, pan in ((-0.0022, 0.35), (0.0022, 0.65)):
            w = np.sin(2 * np.pi * f * (1 + det) * tt) + 0.25 * np.sin(2 * np.pi * 2 * f * (1 + det) * tt)
            w *= env * (0.05 if m < 50 else 0.032) * (1 + 0.15 * np.sin(2 * np.pi * (0.1 + 0.03 * k) * tt))
            L[s0:s1] += w * (1 - pan); R[s0:s1] += w * pan
# sparse bell notes (A minor pentatonic), soft and slow
penta = [69, 72, 74, 76, 79, 81]
pos = 3.0
while pos < secs - 3:
    f = hz(int(rng.choice(penta)))
    s0 = int(pos * sr); dur = 3.5
    tt = np.arange(0, int(dur * sr)) / sr
    b = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2.76 * f * tt)) * np.exp(-tt * 1.6) * 0.035
    b *= np.minimum(1, tt / 0.01)
    e = min(n, s0 + len(b)); pan = rng.uniform(0.3, 0.7)
    L[s0:e] += b[:e - s0] * (1 - pan); R[s0:e] += b[:e - s0] * pan
    pos += rng.choice([4.0, 6.0, 8.0])
st = np.stack([L, R], 1)
fade = np.minimum(1, np.minimum(t, secs - t) / 3.0)[:, None]
st = st * fade
st /= max(1e-6, np.abs(st).max()) / 0.8
pcm = (st * 32767).astype("<i2")
with wave.open(out, "wb") as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(sr); wf.writeframes(pcm.tobytes())
print("music", out, secs, "s")
