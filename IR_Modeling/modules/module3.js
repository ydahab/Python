module.exports = {
  n: 3, file: "IR_Module3_Vector_Space.pptx", short: "Boolean and Vector Space Models",
  slides: [
    ["title", { title: "Boolean and Vector Space Models", subtitle: "Term weighting, similarity and ranked retrieval", meta: "Intermediate  |  Prior knowledge: databases, basic ML  |  ~45 min" }],
    ["objectives", { items: [
      "State the strengths and limits of Boolean retrieval",
      "Compute term frequency, inverse document frequency and TF-IDF weights",
      "Represent documents and queries as vectors and rank them by cosine similarity",
      "Explain the assumptions and weaknesses that motivate later models" ] }],
    ["bullets", { title: "The Boolean model", items: [
      ["Exact matching.", "Queries combine terms with AND, OR and NOT. A document either satisfies the expression or does not."],
      ["Strengths.", "Predictable, transparent and easy to implement on an inverted index. Experts value precise control."],
      ["No ranking.", "All matches are equal, so the user receives an unordered set."],
      ["Feast or famine.", "Strict queries return nothing, loose ones return thousands, and tuning the expression is hard for non-experts."] ],
      why: "Users need a gradual notion of matching: documents that match more of the query, or match it more strongly, should come first.", whyHead: "Motivation" }],
    ["bullets", { title: "Two signals for weighting terms", items: [
      ["Term frequency (tf).", "A term that occurs often in a document suggests the document is about it."],
      ["Document frequency (df).", "A term that occurs in nearly every document, such as the, says little about any one of them."],
      ["Combine them.", "Weight a term highly when it is frequent in this document but rare across the collection."],
      ["Sublinear growth.", "Ten occurrences are not ten times as informative as one, so dampen tf with a logarithm."] ],
      why: "Weights are a model of informativeness. They encode the belief that rare, repeated terms discriminate between documents.", whyHead: "Why weight at all?" }],
    ["equation", { title: "TF-IDF weighting", eq: "w(t,d) = (1 + log tf(t,d)) × log( N / df(t) )", eqSize: 30, terms: [
      ["tf(t,d)", "Occurrences of term t in document d."],
      ["df(t)", "Number of documents containing t."],
      ["N", "Total number of documents in the collection."],
      ["log", "Compresses large counts. Base 10 is used in the example."] ],
      whyHead: "Example", why: "With N = 1,000,000, the word the (df = 900,000) has idf about 0.05, while retrieval (df = 1,000) has idf = 3. If retrieval appears 10 times, tf weight is 1 + 1 = 2, so w = 2 × 3 = 6." }],
    ["bullets", { title: "Documents as vectors", items: [
      ["One axis per term.", "A document becomes a point in a space whose dimensions are vocabulary terms."],
      ["Coordinates are weights.", "Most coordinates are zero, since a document uses few of all possible terms."],
      ["Queries are vectors too.", "Treat the query as a very short document and place it in the same space."],
      ["Closeness means relevance.", "Documents near the query vector are ranked higher."] ],
      why: "This reduces retrieval to geometry: ranking becomes a nearest-neighbor problem, which also underlies the neural methods in Module 5.", whyHead: "Big idea" }],
    ["equation", { title: "Cosine similarity", eq: "cos(q, d) = ( q · d ) / ( ‖q‖ × ‖d‖ )", eqSize: 30, terms: [
      ["q · d", "Dot product: sum over terms of query weight times document weight."],
      ["‖q‖, ‖d‖", "Vector lengths, which normalize for document size."],
      ["cos", "Between 0 and 1 for non-negative weights; 1 means identical direction."] ],
      whyHead: "Why angle, not distance?", why: "A long document repeats words, so its vector is long. Comparing direction rather than length stops long documents from winning just by being long." }],
    ["table", { title: "Worked example", cols: ["Item", "cats", "mice", "Cosine with query"], colW: [3.6, 1.8, 1.8, 4.93], rows: [
      ["Query q", "1", "1", "length = √2 = 1.414"],
      ["Document D1", "2", "1", "(2+1) / (1.414 × 2.236) = 0.949"],
      ["Document D2", "1", "0", "1 / (1.414 × 1) = 0.707"] ],
      noteHead: "Reading the result", note: "D1 contains both query terms and ranks first. D2 matches only one term and ranks lower. The ordering, not the absolute number, is what matters.", noteY: 4.1, noteH: 1.3 }],
    ["steps", { title: "Scoring efficiently", items: [
      ["Fetch postings", "Only for terms in the query, never the whole collection."],
      ["Accumulate", "For each posting, add weight products to a per-document score."],
      ["Normalize", "Divide by stored document lengths."],
      ["Select top k", "Keep a small heap of best results instead of sorting everything."] ],
      footHead: "Link to Module 2", foot: "Vector scoring reuses the inverted index. Only documents sharing a term with the query are ever touched." }],
    ["compare", { title: "Assumptions and limits", h: 3.7, cols: [
      { head: "Term independence", items: ["Each term is a separate axis", "Word order and phrases are lost", "Synonyms look unrelated"] },
      { head: "Heuristic weights", items: ["TF-IDF works well but has no probabilistic derivation", "Length handling is crude", "Many variants exist"] },
      { head: "Vocabulary mismatch", items: ["Car and automobile never match", "Needs expansion or learned representations"] } ],
      note: "These gaps motivate probabilistic models (Module 4), which justify weights, and neural models (Module 5), which capture meaning.", noteHead: "What comes next" }],
    ["equation", { title: "Relevance feedback (Rocchio)", eq: "q' = \u03B1 q + \u03B2 \u00B7 mean(relevant) \u2212 \u03B3 \u00B7 mean(non-relevant)", eqSize: 22, eqH: 1.1, terms: [
      ["q'", "The improved query vector used for a second search."],
      ["\u03B1, \u03B2, \u03B3", "Weights on the original query, relevant examples and non-relevant examples."],
      ["mean(\u2026)", "Average vector of the judged documents."] ],
      whyHead: "Why it helps", why: "The user rarely states the need completely. Marking a few results lets the system move the query toward documents like them, adding words the user never typed. Pseudo-feedback assumes the top results are relevant." }],
    ["takeaways", { items: [
      "Boolean retrieval is exact and unranked, so it is rarely enough for ordinary users.",
      "TF-IDF rewards terms that are frequent in a document and rare in the collection.",
      "Cosine similarity ranks by direction in term space, removing length bias.",
      "The model assumes independent terms and cannot bridge vocabulary mismatch." ],
      next: "Module 4 grounds ranking in probability: BM25 and language models.", check: "Why does the idf of a word that appears in every document equal zero?" }],
  ],
};
