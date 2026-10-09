module.exports = {
  n: 7, file: "IR_Module7_Implementation.pptx", short: "Practical Implementation",
  slides: [
    ["title", { title: "Practical Implementation Considerations", subtitle: "Architecture, scale, freshness and operations", meta: "Intermediate  |  Prior knowledge: databases, basic ML  |  ~45 min" }],
    ["objectives", { items: [
      "Design a multi-stage ranking architecture and justify each stage",
      "Explain sharding, replication, caching and tail latency",
      "Describe approximate nearest neighbor search and the recall-speed trade-off",
      "Plan for freshness, learning to rank, monitoring and responsible use" ] }],
    ["funnel", { title: "Multi-stage ranking", stages: [
      ["Candidate generation", "billions to thousands", "Cheap, high-recall retrieval: inverted index and dense search."],
      ["Lightweight ranker", "thousands to hundreds", "Fast learned model over simple features."],
      ["Heavy reranker", "hundreds to tens", "Expensive neural model on a short list."],
      ["Final assembly", "tens of results", "Diversity, business rules, snippets."] ],
      noteHead: "Why stages?", note: "Cost per document rises with model power, so apply expensive models only to the few candidates that survive cheaper stages." }],
    ["table", { title: "A latency budget (illustrative)", cols: ["Stage", "Budget", "What it buys"], colW: [4.0, 2.2, 5.93], rows: [
      ["Query understanding", "10 ms", "Spelling, intent, filters"],
      ["Candidate generation", "30 ms", "Lexical and dense retrieval across shards"],
      ["Reranking", "50 ms", "Neural scoring of a short list"],
      ["Assembly", "10 ms", "Snippets and result formatting"],
      ["Total", "100 ms", "Target for most of the traffic"] ],
      noteHead: "Reading it", note: "Quality gains are bought with latency. A larger reranker is only affordable if earlier stages shrink the candidate list.", noteY: 5.1, noteH: 1.2 }],
    ["bullets", { title: "Scaling out: sharding and replication", items: [
      ["Sharding.", "Split the collection into partitions held on different machines. Each query fans out to every shard."],
      ["Merge.", "Every shard returns its local top k, and a broker merges them into the global top k."],
      ["Replication.", "Keep several copies of each shard to raise throughput and survive failures."],
      ["Tail latency.", "The slowest shard sets the response time, so rare slowness is multiplied across many shards."] ],
      why: "Sharding scales data size, replication scales query volume and availability. They solve different problems.", whyHead: "Two axes" }],
    ["bullets", { title: "Caching", items: [
      ["Skewed demand.", "A small share of queries accounts for a large share of traffic, so repeated work is common."],
      ["Result cache.", "Store final results for popular queries and skip the pipeline."],
      ["List cache.", "Keep hot postings or vectors in memory so disk reads are avoided."],
      ["Staleness.", "Cached answers can be out of date, so set expiry according to how fast content changes."] ],
      why: "Caching is the cheapest way to cut cost and latency, but it complicates evaluation, since logged results may come from the cache.", whyHead: "Trade-off" }],
    ["compare", { title: "Approximate nearest neighbor search", h: 3.4, cols: [
      { head: "Exact search", items: ["Compare the query with every vector", "Cost grows with collection size and dimension", "Perfect recall"] },
      { head: "Approximate search", items: ["Use graphs, clusters or compressed vectors", "Examine a small fraction of candidates", "Slightly lower recall, far faster"] } ],
      note: "Tune the search depth until recall of the true neighbors is acceptable at the latency and memory budget. Measure end-to-end relevance, since small recall losses often barely move final quality.", noteHead: "Three-way budget: recall, latency, memory" }],
    ["bullets", { title: "Query processing shortcuts", items: [
      ["Early termination.", "Stop reading a postings list once remaining documents cannot reach the current top k."],
      ["Tiered indexes.", "Search a small, high-quality tier first and consult larger tiers only if needed."],
      ["Static quality scores.", "Order postings by a precomputed quality value so the best candidates come first."],
      ["Risk.", "Shortcuts can miss results, so measure the effect on relevance, not only on speed."] ] }],
    ["steps", { title: "Keeping the index fresh", items: [
      ["Buffer", "New documents go into a small in-memory structure and become searchable quickly."],
      ["Flush", "Periodically write the buffer as an immutable segment."],
      ["Merge", "Combine small segments into larger ones in the background."],
      ["Delete", "Mark removed documents with tombstones and drop them when segments merge."] ],
      footHead: "Why immutable segments?", foot: "Never editing a written segment avoids locks and makes readers simple and fast. Cost is background merge work." }],
    ["bullets", { title: "Understanding the query", items: [
      ["Cleanup.", "Spelling correction, normalization and handling of abbreviations."],
      ["Expansion.", "Add synonyms or related terms to reduce vocabulary mismatch, at the risk of drift."],
      ["Intent.", "Classify the need (navigate, find facts, shop) and choose filters or result types."],
      ["Context.", "Language, location and session history can disambiguate queries like jaguar speed."] ] }],
    ["bullets", { title: "Learning to rank", items: [
      ["Features.", "Combine signals such as BM25, dense similarity, freshness, popularity and quality into a feature vector."],
      ["Training.", "Fit a model on judged or click-derived data. Pointwise models score items, pairwise models order pairs, listwise models optimize the list."],
      ["Benefit.", "Weights are learned rather than hand-set, and new signals are easy to add."],
      ["Risk.", "The model inherits bias and noise from its labels, and needs retraining as content drifts."] ],
      why: "Learned rankers usually sit in the second stage, where features are cheap to compute for a few thousand candidates.", whyHead: "Where it fits" }],
    ["compare", { title: "Operating the system", h: 3.5, cols: [
      { head: "Measure", items: ["Offline metrics on fixed judgments", "A/B tests for launches", "Latency and error budgets"] },
      { head: "Monitor", items: ["Zero-result queries", "Click patterns and quality drift", "Index freshness"] },
      { head: "Act responsibly", items: ["Audit bias and fairness", "Protect user privacy in logs", "Provide ways to report problems"] } ],
      note: "Retrieval quality decays as content and language change. Treat evaluation and monitoring as permanent parts of the system.", noteHead: "Lifecycle thinking" }],
    ["takeaways", { items: [
      "Use cheap, high-recall candidate generation, then progressively stronger rankers on smaller sets.",
      "Shard for data size, replicate for load, cache for skewed demand, and watch tail latency.",
      "Approximate vector search trades a little recall for large speed and memory gains.",
      "Immutable segments, learned ranking and continuous monitoring keep quality high over time." ],
      next: "Revisit Module 1 and map each stage of your own system to the three design questions.", check: "Which problem does replication solve that sharding does not?" }],
  ],
};
