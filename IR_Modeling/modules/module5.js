module.exports = {
  n: 5, file: "IR_Module5_Neural.pptx", short: "Neural Approaches",
  slides: [
    ["title", { title: "Neural Approaches to Retrieval", subtitle: "Dense embeddings, rerankers and hybrid search", meta: "Intermediate  |  Prior knowledge: databases, basic ML  |  ~45 min" }],
    ["objectives", { items: [
      "Explain the vocabulary mismatch problem and why neural models address it",
      "Describe bi-encoder (dense) retrieval and how it is trained",
      "Contrast bi-encoders with cross-encoder rerankers and learned sparse models",
      "Combine lexical and neural rankings with rank fusion" ] }],
    ["table", { title: "Vocabulary mismatch", cols: ["Query", "Relevant document says", "Lexical overlap"], colW: [3.6, 5.5, 3.03], rows: [
      ["cheap flights to Cairo", "budget airfare to Egypt", "none"],
      ["fix a flat tire", "repairing a puncture", "none"],
      ["heart attack symptoms", "signs of myocardial infarction", "none"] ],
      noteHead: "The problem", note: "Models from Modules 3 and 4 match strings. People use different words for the same idea, so relevant documents can score zero. Neural models aim to match meaning.", noteY: 3.9, noteH: 1.4 }],
    ["bullets", { title: "Embeddings: meaning as geometry", items: [
      ["Dense vectors.", "A text encoder maps a sentence to a vector of a few hundred numbers, where every dimension is used."],
      ["Learned geometry.", "Texts with similar meaning land close together, even with no shared words."],
      ["Same math as before.", "Relevance is scored by cosine similarity or a dot product, now in a learned space instead of a term space."],
      ["Transformer encoders.", "Context-aware neural networks produce the vectors, so a word is read in relation to its neighbors."] ],
      why: "The vector space idea from Module 3 survives. What changes is where the coordinates come from: learned rather than counted.", whyHead: "Continuity" }],
    ["table", { title: "Scoring with embeddings (toy 2-D example)", cols: ["Item", "Vector", "Cosine with query"], colW: [4.0, 3.4, 4.73], rows: [
      ["Query", "(0.8, 0.6)", "reference"],
      ["Doc A: budget airfare", "(0.6, 0.8)", "0.8 \u00D7 0.6 + 0.6 \u00D7 0.8 = 0.96"],
      ["Doc B: airline rules", "(1.0, 0.0)", "0.80"],
      ["Doc C: pasta recipe", "(0.0, -1.0)", "-0.60"] ],
      noteHead: "Reading it", note: "Vectors are unit length here, so the dot product equals cosine. Doc A shares no words with the query but sits closest in meaning space. Real embeddings use hundreds of dimensions.", noteY: 4.4, noteH: 1.4 }],
    ["flow", { title: "Bi-encoder architecture", lanes: [
      { label: "OFFLINE: encode every document once", boxes: [["Document", "text"], ["Encoder", "neural network"], ["Vector index", "stored embeddings"]] },
      { label: "ONLINE: encode the query and search", boxes: [["Query", "text"], ["Encoder", "same network"], ["Nearest neighbors", "top k documents"]] } ],
      noteHead: "Why two separate encodings?", note: "Document vectors do not depend on the query, so they can be precomputed. At query time only one encoding and one similarity search are needed." }],
    ["equation", { title: "Training with contrastive learning", eq: "L = − log [ exp(s(q, d⁺)/τ) / Σ exp(s(q, d)/τ) ]", eqSize: 28, terms: [
      ["s(q,d)", "Similarity between query and document vectors."],
      ["d⁺", "A document known to be relevant to the query."],
      ["τ", "Temperature: sharpness of the softmax over candidates."],
      ["Σ", "Sum over the positive and a set of negative documents."] ],
      whyHead: "Intuition", why: "Raise the score of the relevant document relative to the others. Hard negatives, documents that look relevant but are not, teach the model the most." }],
    ["steps", { title: "Where training data comes from", items: [
      ["Human judgments", "Accurate but expensive. Used for fine-tuning and evaluation."],
      ["Click logs", "Plentiful, but clicks reflect position and presentation bias."],
      ["Synthetic pairs", "Generate queries from documents, or mine titles and anchor text."],
      ["Negatives", "Sample from lexical top results to find convincing wrong answers."] ],
      footHead: "Caution", foot: "Whatever the source, the model learns that source's notion of relevance, and may fail on very different domains." }],
    ["compare", { title: "Cross-encoders and rerankers", h: 3.55, cols: [
      { head: "Bi-encoder", items: ["Query and document encoded apart", "Precomputed vectors", "Fast, good recall"] },
      { head: "Cross-encoder", items: ["Query and document read together", "Sees word interactions", "Accurate but one pass per pair"] } ],
      note: "Scoring a billion documents with a cross-encoder is infeasible. So retrieve a few hundred candidates cheaply, then rerank them with the expensive model.", noteHead: "Resulting architecture" }],
    ["bullets", { title: "Learned sparse retrieval", items: [
      ["Idea.", "A neural model predicts which terms describe a document, including words it never contains, and assigns weights."],
      ["Result.", "A sparse vector over the vocabulary that works with the inverted index from Module 2."],
      ["Benefits.", "Fast lookups, term-level explanations and handling of synonyms."],
      ["Costs.", "Larger postings lists and a model pass over every document at index time."] ],
      why: "It is a bridge: neural understanding delivered through the same index structures and query processing as Modules 2 to 4.", whyHead: "Best of both" }],
    ["equation", { title: "Hybrid search with rank fusion", eq: "RRF(d) = Σ 1 / ( k + rankᵢ(d) )", eqSize: 30, terms: [
      ["rankᵢ(d)", "Position of document d in ranker i."],
      ["k", "Constant, often around 60, damping the advantage of the very top ranks."],
      ["Σ", "Sum over rankers, such as lexical and dense."] ],
      whyHead: "Example", why: "A document ranked 1st by BM25 and 3rd by a dense model scores 1/61 + 1/63 = 0.0323. Documents liked by both lists rise. Using ranks avoids comparing incompatible score scales." }],
    ["compare", { title: "Choosing an approach", h: 3.75, cols: [
      { head: "Lexical", items: ["Exact names, codes, rare terms", "No training needed", "Misses paraphrases"] },
      { head: "Dense", items: ["Paraphrase and concept matching", "Needs training and vector search", "Weak on exact identifiers"] },
      { head: "Hybrid + rerank", items: ["Covers both strengths", "More components to run", "Common production design"] } ],
      note: "Neural models are not strictly better. Evaluate on your own queries and keep a strong lexical baseline.", noteHead: "Advice" }],
    ["bullets", { title: "Limits and risks", items: [
      ["Domain shift.", "A model trained on one domain can fail on another, such as legal or medical text."],
      ["Opaque scores.", "It is hard to explain why a vector is close, unlike a matched term."],
      ["Cost.", "Encoding documents, storing vectors and serving models add compute and memory."],
      ["Exactness.", "Identifiers, rare names and numbers are often matched better by lexical methods."] ],
      why: "Always compare against a tuned BM25 baseline on your own judged queries before adopting a neural component.", whyHead: "Safeguard" }],
    ["takeaways", { items: [
      "Vocabulary mismatch limits any model that matches strings.",
      "Bi-encoders embed texts independently, allowing precomputed vectors and fast search.",
      "Contrastive training pulls relevant pairs together and pushes hard negatives away.",
      "Cross-encoders rerank a short list; hybrid fusion combines lexical and dense strengths." ],
      next: "Module 6 shows how to measure whether any of these models is actually better.", check: "Why is a cross-encoder used only after a first-stage retriever?" }],
  ],
};
