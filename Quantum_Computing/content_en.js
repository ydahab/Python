// English deck content. Facts reflect public information up to 2025 (see the speaker notes on fast-moving items).
const sup = (t) => ({ text: t, options: { superscript: true } });
module.exports = {
  dir: "ltr",
  file: "Quantum_Computing_EN.pptx",
  docTitle: "Quantum Computing: A New Way to Compute",
  footer: "Quantum Computing  |  Secondary School Technology",
  slides: [
    { type: "title", tag: "TECHNOLOGY  ·  SECONDARY SCHOOL", title: "Quantum Computing", sub: "A new way to compute, and what it means for the chips of tomorrow",
      notes: "Open with a question: your phone has about 15-20 billion transistors. Can chips keep shrinking forever? Today we meet the idea that may complement them." },
    { type: "agenda", title: "Today's journey", items: [
      { icon: "FaMicrochip", head: "Why do we need it?", body: "The limits of shrinking transistors (Moore's law)." },
      { icon: "FaAtom", head: "What is it?", body: "Qubits, superposition, entanglement and interference." },
      { icon: "FaLightbulb", head: "Uses and benefits", body: "Medicine, materials, security, optimisation." },
      { icon: "FaIndustry", head: "Hardware industry", body: "How quantum fits with the chips we build today." }],
      notes: "Four parts, about 40-45 minutes with the activities." },

    { type: "divider", num: 1, title: "Why do we need it?", sub: "The end of easy chip shrinking", notes: "Part 1 sets the problem before we meet the solution idea." },
    { type: "chart", title: "More transistors, every two years… until now", series: "Transistors per chip",
      labels: ["1971", "1982", "1993", "2000", "2006", "2012", "2017", "2022"],
      values: [2300, 134000, 3100000, 42000000, 291000000, 1400000000, 19200000000, 114000000000],
      callouts: [
        { big: "Moore's law", text: "1965: the number of transistors on a chip doubles about every two years." },
        { big: "2,300 → 114 billion", text: "From the first microprocessor (Intel 4004, 1971) to Apple's M1 Ultra (2022)." },
        { big: "But it is slowing", text: "Clock speeds have been stuck near 3-5 GHz since the mid-2000s." }],
      source: "Approximate public figures for well-known processors. The vertical scale is logarithmic: each gridline is ×1,000.",
      notes: "Point out the log axis: a straight line means constant doubling. Intel 4004 = 2,300; 286 = 134 thousand; Pentium = 3.1 million; Pentium 4 = 42 million; Core 2 Duo = 291 million; Ivy Bridge quad-core = 1.4 billion; AMD EPYC (2017) = 19.2 billion; Apple M1 Ultra (2022) = 114 billion." },
    { type: "cards", title: "Why shrinking is getting harder", cards: [
      { icon: "FaAtom", head: "Atoms are the limit", body: "A silicon atom is about 0.2 nm wide. The tiniest parts of a modern transistor are only tens of atoms across." },
      { icon: "FaFire", head: "Heat", body: "Billions of switches packed into a thumbnail-sized chip create intense heat that is hard to remove." },
      { icon: "FaBolt", head: "Quantum leaks", body: "At this scale electrons can 'tunnel' through thin barriers (see next slide), so switches leak current." }],
      note: "Engineers still find tricks (3D stacking, chiplets, new materials). Quantum computing is a different path: not a faster chip, but a different kind of computer.",
      notes: "Be clear that classical chips are not dead. The idea of quantum computing is to solve some problems differently, not to speed up everything." },

    { type: "tunnel", title: "Quantum tunnelling: electrons slipping through", panels: [
      { head: "A thick barrier", caption: "The electron wave fades away. It almost never crosses." },
      { head: "A barrier a few atoms thick", caption: "Some of the wave leaks through. The electron can appear on the other side." }],
      cards: [
        { icon: "FaMicrochip", head: "What it means inside a transistor", body: "The 'barrier' is a thin insulating layer. When it is only a few atoms thick, some electrons leak through even when the switch is OFF. That wastes power and makes heat." },
        { icon: "FaTools", head: "What engineers did", body: "New insulating materials (high-k) and 3D transistor shapes (FinFET, gate-all-around) reduced the leaks. But every new shrink makes the problem harder again." }],
      notes: "Electrons behave like waves of probability. A wave does not stop abruptly at a wall: a small part continues inside, and if the wall is thin enough it comes out the other side. The same quantum rules that cause these leaks also make quantum computers possible." },

    { type: "divider", num: 2, title: "What is quantum computing?", sub: "Computing with the rules of the very small", notes: "Part 2: the core ideas. Keep analogies simple and be honest about their limits." },
    { type: "bitqubit", title: "Bit vs. qubit", panels: [
      { head: "Classical bit", body: "Always exactly 0 or 1, like a light switch: off or on. Every file on your phone is billions of bits." },
      { head: "Quantum bit (qubit)", body: "Can be 0, 1, or a blend of both (superposition). When measured it gives 0 or 1, with probabilities set by the blend." }],
      note: "Think of a spinning coin: while it spins it is not simply heads or tails. When it lands, you see one.",
      notes: "The sphere is the Bloch sphere: north pole = 0, south pole = 1, any other point = a superposition." },
    { type: "cards", title: "Three quantum ideas that power it", cards: [
      { icon: "FaLayerGroup", head: "Superposition", body: "A qubit holds a blend of 0 and 1 until we measure it." },
      { icon: "FaLink", head: "Entanglement", body: "Two qubits can be linked so their results are connected, however far apart. No message travels faster than light." },
      { icon: "FaWaveSquare", head: "Interference", body: "Algorithms arrange the 'waves' so wrong answers cancel out and right answers get stronger." }],
      note: "Important: a quantum computer does NOT simply try every answer at once. The skill is in using interference to make the right answer likely.",
      notes: "This is the most common misconception, so say it out loud. Entanglement analogy: two magic coins that always land the same way, though each alone is random." },
    { type: "stats", title: "Why many qubits are so powerful", stats: [
      { q: "10 qubits", runs: [{ text: "1,024" }], text: "different states described at the same time (2¹⁰)." },
      { q: "50 qubits", runs: [{ text: "≈ 10" }, sup("15") ], text: "states. Simulating this on a normal computer needs about 18 petabytes of memory." },
      { q: "300 qubits", runs: [{ text: "> 10" }, sup("90")], text: "states: more than the number of atoms in the observable universe (about 10⁸⁰)." }],
      note: "N qubits describe 2ᴺ states. But more states does not mean every problem gets faster: only problems with the right structure.",
      notes: "2^50 = 1.13 x 10^15; at 16 bytes per complex number that is about 18 PB. 2^300 is about 2 x 10^90." },
    { type: "grid6", title: "How do we build a qubit?", tiles: [
      { icon: "FaSnowflake", head: "Superconducting circuits", body: "Tiny circuits cooled near absolute zero. Used by IBM and Google.", tag: "Most common today" },
      { icon: "FaBullseye", head: "Trapped ions", body: "Charged atoms held by electric fields and controlled by lasers. IonQ, Quantinuum.", tag: "Very accurate" },
      { icon: "FaSun", head: "Photons", body: "Particles of light guided through chips. PsiQuantum, Xanadu.", tag: "Works at room temp" },
      { icon: "FaDice", head: "Neutral atoms", body: "Atoms held in arrays by laser 'tweezers'. QuEra, Pasqal.", tag: "Scales well" },
      { icon: "FaMicrochip", head: "Silicon spins", body: "Spin of single electrons in transistor-like devices. Intel and others.", tag: "Uses chip factories" },
      { icon: "FaMicroscope", head: "Topological", body: "A proposed, more stable qubit. Still being demonstrated and debated.", tag: "Research" }],
      notes: "No technology has won yet. Each has trade-offs in speed, accuracy, and how easy it is to scale." },
    { type: "stack", title: "Inside a superconducting quantum computer", layers: [
      { temp: "~ 20 °C", name: "Room temperature: control computers and electronics" },
      { temp: "~ −223 °C (50 K)", name: "First cooling stage" },
      { temp: "~ −269 °C (4 K)", name: "Amplifiers and wiring" },
      { temp: "~ −273.05 °C (0.1 K)", name: "Cold plate" },
      { temp: "~ −273.14 °C (15 mK)", name: "The quantum chip (qubits)" }],
      points: [
        { icon: "FaSnowflake", head: "Colder than outer space", body: "Deep space is about 2.7 K. The chip sits near 0.015 K." },
        { icon: "FaFire", head: "Why so cold?", body: "Heat makes atoms jiggle and destroys fragile quantum states." },
        { icon: "FaCog", head: "A fridge, not a PC", body: "Most of the machine is a dilution refrigerator, cables and control electronics." }],
      notes: "Real systems use a dilution refrigerator. Temperatures are approximate; they differ between machines." },
    { type: "cards", title: "Challenges today", cards: [
      { icon: "FaWaveSquare", head: "Noise", body: "Qubits lose their quantum state in tiny fractions of a second (decoherence)." },
      { icon: "FaBalanceScale", head: "Errors", body: "Quantum error correction needs many physical qubits to make one reliable 'logical' qubit." },
      { icon: "FaChartLine", head: "Scale", body: "Today's machines have about 100 to 1,000+ physical qubits. Many useful tasks may need millions." }],
      note: "We are in the 'NISQ' era: Noisy, Intermediate-Scale Quantum. Progress is real and fast, but large fault-tolerant machines are still being built.",
      notes: "Qubit counts and error-correction milestones change quickly. Check recent news from IBM, Google, Quantinuum and others before class." },

    { type: "divider", num: 3, title: "Applications & benefits", sub: "What could we do with it?", notes: "Part 3: where quantum may help, and where it may not." },
    { type: "grid6", title: "Where could it help?", tiles: [
      { icon: "FaPills", head: "Medicine", body: "Simulate molecules exactly to design new drugs and understand disease.", tag: "Promising" },
      { icon: "FaBatteryFull", head: "Materials & energy", body: "Better batteries, solar materials and catalysts, e.g. fertiliser with less energy.", tag: "Promising" },
      { icon: "FaLock", head: "Security", body: "Could break today's encryption, and enables new, safer methods.", tag: "Long-term risk" },
      { icon: "FaRoute", head: "Optimisation", body: "Routes, timetables, supply chains and finance: the best option among huge numbers.", tag: "Being tested" },
      { icon: "FaRobot", head: "Artificial intelligence", body: "Possible help with some learning tasks. Benefits are not yet proven.", tag: "Early research" },
      { icon: "FaDna", head: "Science", body: "Simulate particles and quantum systems that normal computers cannot.", tag: "Active" }],
      notes: "Ask: which of these matters most for Egypt? Fertiliser, water, medicine and logistics make good local examples." },
    { type: "cards", title: "Benefits of quantum computing", cards: [
      { icon: "FaRocket", head: "Big speed-ups", body: "For some problems, far fewer steps: factoring (exponential gain) or search (square-root gain)." },
      { icon: "FaFlask", head: "Simulating nature", body: "Quantum systems are simulated by quantum systems: molecules and materials as they really behave." },
      { icon: "FaBullseye", head: "Better optimisation", body: "Good solutions in giant search spaces, such as logistics and scheduling." },
      { icon: "FaBolt", head: "Possible energy savings", body: "For some tasks, less energy than huge supercomputers. Still under research." }],
      notes: "Be balanced: the benefits are real but problem-specific. Grover's search gives a square-root speed-up; Shor's factoring gives an exponential one." },
    { type: "flow3", title: "Quantum and security", steps: [
      { icon: "FaLock", label: "Today", text: "RSA and elliptic-curve encryption protect banking, messages and websites." },
      { icon: "FaAtom", label: "Future threat", text: "Shor's algorithm on a large, error-corrected quantum computer could break them. Today's machines are far too small." },
      { icon: "FaShieldAlt", label: "Solution, now", text: "New 'post-quantum' encryption standards (NIST, 2024) are already being rolled out." }],
      note: "Attackers can 'harvest now, decrypt later': they store encrypted data today to open it in the future. That is why switching early matters.",
      notes: "NIST published FIPS 203 (ML-KEM), 204 (ML-DSA) and 205 (SLH-DSA) in August 2024. Recent research estimates RSA-2048 might fall to under a million noisy qubits; today's machines are far smaller." },
    { type: "myths", title: "Myths and facts", mythLabel: "MYTH", factLabel: "FACT", rows: [
      { myth: "Quantum computers will replace our laptops and phones.", fact: "They will be specialised helpers for certain problems, working alongside classical computers." },
      { myth: "They try every possible answer at once.", fact: "They use interference to make correct answers more likely. Big speed-ups exist only for some problems." },
      { myth: "They already beat normal computers at useful jobs.", fact: "Experiments show 'quantum advantage' on special tests. Practical advantage is still being pursued." }],
      notes: "Great discussion slide: ask students which myth they believed before today." },

    { type: "divider", num: 4, title: "Quantum and the hardware industry", sub: "A partner for the chips we build today", transition: "prism", notes: "Part 4 answers the question: is quantum the solution to the end of shrinking?" },
    { type: "hybrid", title: "A partner, not a replacement", dc: "DATA CENTRE / SUPERCOMPUTER", chips: [
      { icon: "FaMicrochip", name: "CPU", text: "General tasks and control" },
      { icon: "FaMemory", name: "GPU", text: "Massively parallel maths and AI" },
      { icon: "FaAtom", name: "QPU", text: "Special quantum problems" }],
      points: [
        { head: "Classical keeps improving", body: "3D stacking, chiplets and new materials continue to push chips forward." },
        { head: "QPUs join as accelerators", body: "Just as GPUs were added for graphics and AI, quantum processors will be added for specific jobs." },
        { head: "Hybrid is the future", body: "Classical chips prepare data and check results; the QPU handles the quantum part." }],
      notes: "Correct the premise gently: quantum computing does not rescue Moore's law for everyday chips. It adds a new kind of processor." },
    { type: "cards", title: "Quantum in the hardware industry", cards: [
      { icon: "FaTools", head: "Building quantum machines", body: "A new supply chain: cryogenics, microwave electronics, lasers, vacuum systems and special chips." },
      { icon: "FaIndustry", head: "Using today's fabs", body: "Silicon-spin and superconducting qubits can be made with chip-factory techniques." },
      { icon: "FaMicrochip", head: "Designing better chips", body: "Simulating new materials and optimising layouts for classical chips. Early research." },
      { icon: "FaShieldAlt", head: "Securing hardware", body: "Post-quantum cryptography in chips, quantum random-number generators and quantum sensors." }],
      notes: "Intel has demonstrated silicon spin-qubit chips made in its own factories. Superconducting qubit chips use fabrication steps similar to semiconductor manufacturing." },
    { type: "code", title: "Try it yourself: free, in Python", code: "from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2)\nqc.h(0)        # superposition\nqc.cx(0, 1)    # entangle\nqc.measure_all()\nprint(qc)", points: [
      { icon: "FaCode", head: "Qiskit (IBM), free", body: "Design circuits in Python and run them on simulators or real quantum computers over the cloud." },
      { icon: "FaLayerGroup", head: "h(0)", body: "Puts qubit 0 in superposition: 0 and 1 with equal chance." },
      { icon: "FaLink", head: "cx(0, 1)", body: "Entangles qubit 1 with qubit 0. Results: 00 or 11, about half each, never 01 or 10." }],
      notes: "This is the Bell-state circuit. Run it on a simulator in class (pip install qiskit qiskit-aer). Students can see the entanglement in the results." },
    { type: "qa", title: "Check your understanding", items: [
      { q: "What can a qubit be that a classical bit cannot?", a: "A blend of 0 and 1 (superposition) until it is measured." },
      { q: "Why are superconducting quantum computers cooled to about −273 °C?", a: "Heat destroys the fragile quantum states (decoherence)." },
      { q: "Will quantum computers replace the CPU in your phone?", a: "No. They will work alongside classical chips on specific problems." }],
      notes: "Click to reveal each answer. Give students 20 seconds per question first." },
    { type: "summary", title: "Key takeaways", items: [
      "Shrinking transistors is hitting physical limits: atoms, heat and quantum leaks.",
      "Qubits use superposition, entanglement and interference.",
      "Big promise in chemistry, materials, security and optimisation.",
      "Today's machines are noisy and small, but progress is fast.",
      "Quantum computers will be partners to CPUs and GPUs, not replacements."],
      discussLabel: "DISCUSS", discuss: "Which problem in Egypt (fertiliser, water, traffic, medicine…) could benefit most from quantum computing? Why?",
      notes: "Give groups five minutes, then share." },
    { type: "sources", title: "Learn more", items: [
      { icon: "FaBook", head: "IBM Quantum Learning", body: "free courses and Qiskit tutorials." },
      { icon: "FaGlobe", head: "Google Quantum AI", body: "research news and explainers." },
      { icon: "FaShieldAlt", head: "NIST Post-Quantum Cryptography", body: "standards for quantum-safe encryption." },
      { icon: "FaMicroscope", head: "Nature, Quanta Magazine", body: "accessible articles on quantum computing." },
      { icon: "FaChartLine", head: "G. Moore (1965)", body: "“Cramming more components onto integrated circuits”, Electronics." }],
      note: "Facts reflect public information up to 2025. This field changes quickly, so check recent news before teaching.",
      notes: "Suggested follow-up: a lab where students run the Bell-state circuit and plot the results." },
  ],
};
