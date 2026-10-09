module.exports = {
  n: 6, file: "IR_Module6_Evaluation.pptx", short: "Evaluation and Relevance Judgments",
  slides: [
    ["title", { title: "Evaluation and Relevance Judgments", subtitle: "How we know one ranking is better than another", meta: "Intermediate  |  Prior knowledge: databases, basic ML  |  ~45 min" }],
    ["objectives", { items: [
      "Describe the test collection approach and how relevance judgments are gathered",
      "Compute precision at k, reciprocal rank, average precision and nDCG",
      "Choose a metric that matches how users consume results",
      "Recognize the limits of offline and online evaluation, including bias and significance" ] }],
    ["bullets", { title: "Why evaluation comes first", items: [
      ["Opinions mislead.", "A ranking that looks good on three favorite queries may be worse overall."],
      ["Many knobs.", "Analysis choices, weights, k1, b and models all change results. Without measurement we tune blindly."],
      ["Need repeatability.", "A fixed benchmark lets us compare changes fairly over time."],
      ["Need user meaning.", "Numbers must connect to what users value, or we optimize the wrong thing."] ],
      why: "Treat metrics as the loss function of the whole project. Everything in Modules 2 to 5 is tuned against them.", whyHead: "Engineering view" }],
    ["steps", { title: "The test collection (Cranfield) approach", items: [
      ["Documents", "A fixed collection that does not change between experiments."],
      ["Topics", "A set of realistic queries, each with a description of the need."],
      ["Judgments", "People label documents as relevant or give grades, for each topic."],
      ["Metrics", "Run systems, compare their ranked lists with the labels, average across topics."] ],
      footHead: "Why it works", foot: "Labels are created once and reused for every future system, so experiments are cheap, controlled and repeatable." }],
    ["bullets", { title: "Getting judgments: pooling", items: [
      ["The scale problem.", "Nobody can judge every document for every query."],
      ["Pooling.", "Take the top results from several different systems, merge them into a pool and judge only that pool."],
      ["Assumption.", "Unjudged documents are treated as not relevant."],
      ["Risk.", "A new system that finds relevant documents no pooled system retrieved is unfairly penalized."] ],
      why: "Diverse systems in the pool reduce the bias, and graded labels capture how useful an answer is rather than only yes or no.", whyHead: "Mitigation" }],
    ["equation", { title: "Rank-based metrics", eq: "P@k = (relevant in top k) / k        RR = 1 / rank of first relevant", eqSize: 21, eqH: 1.1, terms: [
      ["P@k", "Precision at depth k. Simple, but ignores order within the top k."],
      ["RR", "Reciprocal rank: rewards finding one good answer early."],
      ["MRR", "Mean of RR over queries."] ],
      whyHead: "Example", why: "Three queries have the first relevant result at ranks 1, 3 and 2. RR values are 1, 0.33 and 0.5, so MRR = 1.83 / 3 = 0.61. MRR suits lookups with a single right answer." }],
    ["equation", { title: "Graded relevance: nDCG", eq: "DCG = Σ relᵢ / log₂(i + 1)        nDCG = DCG / IDCG", eqSize: 22, eqH: 1.1, terms: [
      ["relᵢ", "Gain (relevance grade) of the result at position i."],
      ["log₂(i+1)", "Discount: lower positions count less, since users read top results most."],
      ["IDCG", "DCG of the ideal ordering, so scores fall between 0 and 1."] ],
      whyHead: "Why normalize?", why: "Different queries have different best possible scores. Dividing by the ideal ordering makes queries comparable and averageable." }],
    ["table", { title: "nDCG worked example", cols: ["Position i", "1", "2", "3", "4", "Total"], colW: [3.4, 1.7, 1.7, 1.7, 1.7, 1.93], mono: true, rows: [
      ["Grade of returned result", "3", "2", "0", "1", ""],
      ["Discounted gain", "3.00", "1.26", "0.00", "0.43", "4.69"],
      ["Ideal order (3, 2, 1, 0)", "3.00", "1.26", "0.50", "0.00", "4.76"] ],
      noteHead: "Result", note: "nDCG = 4.69 / 4.76 = 0.99. The only mistake is that the grade 1 document is below the grade 0 document, a small penalty because it sits low in the list.", noteY: 4.1, noteH: 1.3 }],
    ["equation", { title: "Average precision", eq: "AP = (1 / R) \u03A3 P@k \u00D7 rel(k)", eqSize: 28, terms: [
      ["R", "Number of relevant documents for the query."],
      ["P@k", "Precision at each rank k where a relevant document appears."],
      ["MAP", "Mean of AP across all queries."] ],
      whyHead: "Example", why: "Three relevant documents appear at ranks 1, 3 and 5 out of R = 3. Precisions are 1/1, 2/3 and 3/5. AP = (1 + 0.67 + 0.60) / 3 = 0.76. Missing relevant documents lowers AP, so it rewards both early and complete retrieval." }],
    ["compare", { title: "Choosing a metric", h: 3.55, cols: [
      { head: "Known-item or QA", items: ["One right answer", "Use MRR or success at k"] },
      { head: "Browse and research", items: ["Many partly useful results", "Use nDCG or average precision"] },
      { head: "Recall-critical", items: ["Legal or patent search", "Use recall at depth and cost of review"] } ],
      note: "A metric encodes an assumption about the user. Pick the one whose assumption matches the product.", noteHead: "Principle" }],
    ["bullets", { title: "Online evaluation and its biases", items: [
      ["A/B tests.", "Show two systems to different users and compare behavior such as clicks, reformulations and task completion."],
      ["Position bias.", "Users click top results more regardless of quality, so raw clicks overstate the top."],
      ["Clicks are not relevance.", "Attractive snippets earn clicks, and good answers shown in snippets earn none."],
      ["Interleaving.", "Mix results from two rankers into one list and see which gets credit, which needs fewer users."] ] }],
    ["bullets", { title: "Pitfalls in practice", items: [
      ["Significance.", "Differences between systems are averages over queries. Use paired tests at query level to see whether a gain is more than noise."],
      ["Overfitting.", "Tuning repeatedly on one set of topics fits its quirks. Hold out separate topics."],
      ["Metric mismatch.", "A model that wins on nDCG may still feel worse if it ignores freshness or diversity."],
      ["Segment checks.", "An average can hide failures on rare or sensitive queries."] ],
      why: "Report effect sizes and confidence along with the mean, and review actual failures by hand.", whyHead: "Good habit" }],
    ["takeaways", { items: [
      "Test collections give repeatable comparisons using documents, topics and judgments.",
      "Pooling makes judging affordable but can undercount results from new systems.",
      "MRR suits single-answer tasks. nDCG handles graded relevance and position discount.",
      "Combine offline metrics with online tests, and check significance and bias." ],
      next: "Module 7 assembles retrieval and ranking into a production system.", check: "Why is nDCG divided by the ideal DCG?" }],
  ],
};
