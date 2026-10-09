module.exports = {
  n: 1, file: "IR_Module1_Foundations.pptx", short: "Foundations",
  slides: [
    ["title", { title: "Foundations of Information Retrieval", subtitle: "Problems, pipeline and the idea of relevance", meta: "Intermediate  |  Prior knowledge: databases, basic ML  |  ~45 min" }],
    ["objectives", { items: [
      "Explain how information retrieval differs from querying a database, and why ranking is central",
      "Define documents, queries, information needs and relevance precisely",
      "Describe the offline and online stages of a typical retrieval pipeline",
      "Compute precision and recall, and explain the trade-off between them" ] }],
    ["bullets", { title: "What is information retrieval?", items: [
      ["Definition.", "Finding material, usually text documents, that satisfies an information need from within a large collection."],
      ["Unstructured data.", "Documents have no fixed schema. Meaning lives in natural language, which is ambiguous and varied."],
      ["Ranked answers.", "Many documents match somewhat. The system orders them so the most useful appear first."],
      ["Scale.", "Collections reach billions of documents, so every design choice is also a cost decision."],
      ["Feedback.", "Behavior such as clicks and reformulated queries gives hints about what worked."] ],
      why: "A database answers a precise question exactly. A retrieval system answers a vague question approximately, and must decide which approximation is best." }],
    ["table", { title: "Database query versus retrieval query", cols: ["Aspect", "Database", "Information retrieval"], colW: [2.4, 4.8, 4.93], fs: 15, rows: [
      ["Data", "Structured rows with typed columns", "Free text, semi-structured pages, media"],
      ["Query", "Formal predicate (exact language)", "A few keywords or a natural sentence"],
      ["Matching", "Exact: a row qualifies or it does not", "Partial: documents match to a degree"],
      ["Result", "An unordered set, complete and correct", "A ranked list, best candidates first"],
      ["Failure mode", "Wrong or missing rows are bugs", "Poor ordering or missed documents are quality gaps"] ],
      noteHead: "Design consequence", note: "Because matching is partial, the core of an IR system is a scoring function that turns a query and a document into a number.", noteY: 5.6, noteH: 1.1 }],
    ["bullets", { title: "Key terms", items: [
      ["Document.", "The unit that can be returned: a web page, a paragraph, an email, a product listing."],
      ["Collection (corpus).", "The full set of documents the system can search."],
      ["Information need.", "What the user actually wants to know. It is rarely written down in full."],
      ["Query.", "The user's attempt to express that need as text. It is always a lossy summary."],
      ["Relevance.", "How well a document satisfies the information need, judged by a person or inferred from behavior."] ],
      why: "Notice that the query and the need are different objects. Every retrieval model works with the query but is judged against the need.", whyHead: "Keep in mind" }],
    ["flow", { title: "The retrieval pipeline", lanes: [
      { label: "OFFLINE: prepare the collection", boxes: [["Collect", "crawl or ingest"], ["Analyze", "clean and tokenize"], ["Index", "build lookup structures"]] },
      { label: "ONLINE: answer a query within milliseconds", boxes: [["Understand", "analyze the query"], ["Retrieve", "find candidates"], ["Rank", "score and sort"], ["Present", "snippets and feedback"]] } ],
      noteHead: "Why split the work?", note: "Expensive work is done once per document, offline, so that each query can be answered quickly from precomputed structures.", noteH: 1.1 }],
    ["steps", { title: "Worked example: an ambiguous query", items: [
      ["Information need", "A reader wants to know how fast the animal called a jaguar can run."],
      ["Query", "\"jaguar speed\". Two words cannot say whether animal, car or software is meant."],
      ["Candidates", "Pages about the cat, a car brand, a sports team and an operating system all contain both words."],
      ["Ranking decision", "Scores must favor pages whose other words (cat, prey, mph) match the likely need."] ],
      footHead: "Lesson", foot: "Matching words is not matching meaning. Much of IR modeling is about narrowing that gap." }],
    ["bullets", { title: "Relevance is not a single idea", items: [
      ["Topical.", "The document is about the subject of the query."],
      ["User relevance.", "It also suits this person's task, expertise, language and context."],
      ["Binary or graded.", "Judgments can be relevant or not, or use levels such as perfect, good, fair, bad."],
      ["Dynamic.", "The best answer can change with time, location and what the user has already seen."] ],
      why: "A model cannot observe relevance directly. It estimates it from text, links and behavior, and its quality is measured against human judgments.", whyHead: "Modeling view" }],
    ["equation", { title: "Precision and recall", eq: "Precision = |Relevant ∩ Retrieved| / |Retrieved|        Recall = |Relevant ∩ Retrieved| / |Relevant|", eqSize: 22, eqH: 1.1, terms: [
      ["Retrieved", "Documents the system returned for the query."],
      ["Relevant", "All documents in the collection that satisfy the need."],
      ["Precision", "Of what was returned, how much was useful."],
      ["Recall", "Of what was useful, how much was returned."] ],
      whyHead: "Example", why: "Ten results returned, four relevant, twenty relevant in total. Precision is 4/10 = 0.4. Recall is 4/20 = 0.2. Returning more results usually raises recall and lowers precision." }],
    ["compare", { title: "A short map of the field", h: 3.45, cols: [
      { head: "Exact match era", items: ["Boolean queries on controlled vocabularies", "Librarians as search experts", "Result: precise but rigid"] },
      { head: "Statistical era", items: ["Term weighting and ranking", "Vector and probabilistic models", "Result: graded relevance from text statistics"] },
      { head: "Learned era", items: ["Embeddings and neural rankers", "Training on judgments and behavior", "Result: matching by meaning"] } ],
      note: "Newer methods build on older ones. Modern systems typically combine all three, which is why this series covers each.", noteHead: "Not a replacement story" }],
    ["compare", { title: "Three design questions every system answers", h: 3.45, cols: [
      { head: "Representation", items: ["How do we turn text into something comparable?", "Modules 2 and 5"] },
      { head: "Matching and scoring", items: ["How do we score a query against a document?", "Modules 3 and 4"] },
      { head: "Evaluation", items: ["How do we know a change made results better?", "Module 6, then practice in 7"] } ],
      note: "Each later module changes one answer to these questions. Spotting which answer changes is the easiest way to compare models.", noteHead: "Reading guide" }],
    ["takeaways", { items: [
      "Retrieval returns a ranked list for vague, text-based needs, while databases return exact answers to formal queries.",
      "A query is a lossy summary of an information need, so word matching alone is never enough.",
      "Pipelines split expensive offline preparation from fast online scoring.",
      "Precision and recall pull in opposite directions as the result list grows." ],
      next: "Module 2 builds the index: analysis chains, inverted indexes and compression.", check: "Why can a document be topically relevant yet still fail the user?" }],
  ],
};
