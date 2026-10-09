# Quantum Computing: two decks for secondary school

| Deck | Language | Slides |
|------|----------|--------|
| `decks/Quantum_Computing_EN.pptx` | English (left-to-right) | 25 |
| `decks/Quantum_Computing_AR.pptx` | Arabic (fully mirrored right-to-left) | 25 |

Parts: why we need it (the limits of Moore's law), what it is (qubits, superposition, entanglement, interference),
applications and benefits, and quantum in the hardware industry. Each deck has transitions, entrance animations,
a chart, a Qiskit example, a click-to-reveal quiz and speaker notes.

## Rebuild
```
NODE_PATH=../HTML_Fundamentals/node_modules node build.js        # both decks
ONLY=ar NODE_PATH=../HTML_Fundamentals/node_modules node build.js
```
`engine.js` holds the layout engine (written left-to-right and mirrored for Arabic), `content_en.js` and
`content_ar.js` hold the text. Facts reflect public information up to 2025; fast-moving numbers are flagged in the notes.
