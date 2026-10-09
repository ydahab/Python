module.exports = {
  n: 4, file: "IR_Module4_Probabilistic.pptx", short: "Probabilistic Models",
  slides: [
    ["title", { title: "Probabilistic Retrieval Models", subtitle: "Ranking principle, BM25 and language models", meta: "Intermediate  |  Prior knowledge: databases, basic ML  |  ~45 min" }],
    ["objectives", { items: [
      "State the probability ranking principle and the assumptions behind it",
      "Explain why BM25 saturates term frequency and normalizes document length",
      "Interpret the BM25 formula and the roles of k1 and b",
      "Describe query likelihood language models and why smoothing is required" ] }],
    ["bullets", { title: "The probability ranking principle", items: [
      ["Statement.", "Rank documents in decreasing order of their estimated probability of being relevant to the query."],
      ["Optimality.", "Under its assumptions, this ordering gives the best expected effectiveness for the user."],
      ["Assumptions.", "Relevance of each document is independent, and the probabilities are estimated accurately."],
      ["Consequence.", "Retrieval becomes an estimation problem: find a good score that tracks probability of relevance."] ],
      why: "It tells us what to aim for. TF-IDF was a heuristic; probabilistic models try to derive weights from this goal.", whyHead: "Why it matters" }],
    ["bullets", { title: "From probabilities to term weights", items: [
      ["Evidence from terms.", "Each query term present in a document is evidence that raises or lowers the odds of relevance."],
      ["Rare terms carry more.", "A term found in few documents is stronger evidence, which reproduces the idf idea from a principled starting point."],
      ["Independence assumption.", "Combining evidence term by term is tractable but simplistic."],
      ["Result.", "A family of scoring functions whose best-known practical member is BM25."] ] }],
    ["compare", { title: "Two flaws in raw TF-IDF that BM25 repairs", h: 3.3, cols: [
      { head: "Linear term frequency", items: ["Twenty occurrences score nearly twice ten", "But the tenth mention adds little new evidence", "Fix: saturation"] },
      { head: "Weak length handling", items: ["Long documents contain more words by chance", "They may not be more relevant", "Fix: length normalization"] } ],
      note: "BM25 adds two tunable parameters, one for each fix, and keeps an idf factor for rare terms.", noteHead: "The idea in one line" }],
    ["equation", { title: "The BM25 score", eq: "score(q,d) = Σ idf(t) × f(t,d)(k1+1) / ( f(t,d) + k1(1 − b + b|d|/avgdl) )", eqSize: 21, eqH: 1.2, terms: [
      ["f(t,d)", "Count of term t in document d."],
      ["|d|, avgdl", "Document length and average length of the collection."],
      ["k1", "Saturation: higher values let repeats count for longer. Typical range 1.2 to 2."],
      ["b", "Length normalization strength from 0 (none) to 1 (full). Often 0.75."] ],
      whyHead: "Reading it", why: "The sum runs over query terms. Each contributes a rarity factor idf times a bounded frequency factor that rises quickly, then flattens." }],
    ["table", { title: "Saturation in numbers (k1 = 1.2, no length effect)", cols: ["Occurrences f", "1", "2", "5", "10", "Limit"], colW: [4.1, 1.5, 1.5, 1.5, 1.5, 2.03], mono: true, rows: [
      ["Frequency factor f × 2.2 / (f + 1.2)", "1.00", "1.38", "1.77", "1.96", "2.20"],
      ["Linear count for comparison", "1", "2", "5", "10", "unbounded"] ],
      noteHead: "Reading the table", note: "Going from 5 to 10 occurrences adds only 0.19, while 1 to 2 adds 0.38. A single term cannot dominate the score, so queries with several terms need several matches.", noteY: 3.8, noteH: 1.4 }],
    ["steps", { title: "Length normalization at work", items: [
      ["Setting", "k1 = 1.2, b = 0.75, a term occurs f = 3 times. Compare two documents."],
      ["Average length", "Denominator is 3 + 1.2 = 4.2, so the factor is 6.6 / 4.2 = 1.57."],
      ["Twice average length", "Denominator is 3 + 1.2 × 1.75 = 5.1, so the factor is 6.6 / 5.1 = 1.29."],
      ["Meaning", "Same count in a longer document is weaker evidence, so its score is lower."] ],
      footHead: "Why this is sensible", foot: "A word repeated three times in a short note is a stronger signal of topic than three times in a very long report." }],
    ["bullets", { title: "Language models for retrieval", items: [
      ["Generative view.", "Each document defines a word distribution. Ask how likely that model is to produce the query."],
      ["Query likelihood.", "Rank documents by P(q | d), the product of the probabilities of the query terms under the document model."],
      ["Zero problem.", "If a query term never occurs in a document, the whole product collapses to zero."],
      ["Smoothing.", "Blend the document estimate with the collection distribution so unseen words keep a small probability."] ],
      why: "Smoothing also plays the role of idf: a rare word in the collection earns a big boost when a document does contain it.", whyHead: "Hidden benefit" }],
    ["equation", { title: "Dirichlet smoothing", eq: "P(t | d) = ( f(t,d) + μ × P(t | C) ) / ( |d| + μ )", eqSize: 28, terms: [
      ["P(t | C)", "Probability of t in the whole collection, the background model."],
      ["μ", "Smoothing strength: how many pseudo-counts come from the background."],
      ["|d|", "Document length, so long documents trust their own counts more."] ],
      whyHead: "Intuition", why: "A short document has little evidence, so it leans on the collection. A long document has more evidence and is smoothed less. Length handling emerges without a separate rule." }],
    ["compare", { title: "Choosing between the three scorers", h: 3.6, cols: [
      { head: "TF-IDF", items: ["Simple and transparent", "Heuristic, weak on length", "Useful baseline"] },
      { head: "BM25", items: ["Strong default for text", "Two tunable parameters", "Cheap on an inverted index"] },
      { head: "Language model", items: ["Clear probabilistic story", "Smoothing choice matters", "Natural fit for extensions"] } ],
      note: "In practice BM25 and well-smoothed language models perform similarly. Tune parameters on judged queries rather than trusting defaults.", noteHead: "Rule of thumb" }],
    ["bullets", { title: "Tuning BM25 in practice", items: [
      ["Start with defaults.", "k1 near 1.2 and b near 0.75 are reasonable on many text collections."],
      ["Short, uniform texts.", "Titles or product names have little length variation, so a lower b often helps."],
      ["Long, mixed documents.", "A higher b guards against long pages that mention everything."],
      ["Validate.", "Choose values by grid search on judged queries and keep a separate test set."] ],
      why: "Parameters turn assumptions about your data into numbers. They should be measured, not borrowed.", whyHead: "Principle" }],
    ["takeaways", { items: [
      "The probability ranking principle says to order documents by their chance of relevance.",
      "BM25 caps the effect of repeated terms and discounts long documents, controlled by k1 and b.",
      "Language models rank by how likely a document is to generate the query.",
      "Smoothing prevents zero probabilities and behaves like idf plus length control." ],
      next: "Module 5 moves from exact words to learned meaning: neural retrieval.", check: "What happens to BM25 scores if b is set to 0?" }],
  ],
};
