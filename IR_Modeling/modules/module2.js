module.exports = {
  n: 2, file: "IR_Module2_Indexing.pptx", short: "Text Processing and Indexing",
  slides: [
    ["title", { title: "Text Processing and Indexing", subtitle: "From raw text to the inverted index", meta: "Intermediate  |  Prior knowledge: databases, basic ML  |  ~45 min" }],
    ["objectives", { items: [
      "Explain why scanning documents at query time does not scale, and how an index solves it",
      "Apply an analysis chain: tokenization, normalization, stop-word handling and stemming",
      "Build and read an inverted index, including document frequency and postings",
      "Describe how positional data, gap encoding and skip pointers change index size and speed" ] }],
    ["bullets", { title: "Why do we need an index?", items: [
      ["Scanning is linear.", "Checking every document for every query costs time proportional to the collection size. At web scale that is impossible within milliseconds."],
      ["Precompute the answer's shape.", "Instead of asking which words each document contains, store for each word which documents contain it."],
      ["Database analogy.", "A secondary index on a column turns a table scan into a lookup. An inverted index is the same idea applied to every word."],
      ["The trade.", "We spend storage and build time once to make every future query cheap."] ],
      why: "The book index at the back of a textbook works this way: look up a term, get page numbers, never reread the book.", whyHead: "Familiar picture" }],
    ["flow", { title: "The analysis chain", lanes: [
      { label: "Applied identically to documents at index time and to queries at search time", boxes: [["Tokenize", "split into words"], ["Normalize", "case, accents, punctuation"], ["Filter", "optional stop words"], ["Stem or lemmatize", "reduce word forms"]] } ],
      laneH: 1.7, noteGap: 0.1, noteHead: "Why the same chain twice?", note: "A query term can only match an index term if both were produced by the same rules. A mismatch silently loses results.", noteH: 1.2 }],
    ["table", { title: "Analysis example", cols: ["Stage", "Result for: Connected computers share Data"], colW: [3.2, 8.93], rows: [
      ["Raw text", "Connected computers share Data"],
      ["Tokenize", "Connected | computers | share | Data"],
      ["Normalize (lowercase)", "connected | computers | share | data"],
      ["Stem (suffix stripping)", "connect | comput | share | data"] ],
      noteHead: "Observation", note: "A stem need not be a real word. It only has to map related forms (connect, connected, connecting) to one index term.", noteY: 4.7, noteH: 1.2 }],
    ["compare", { title: "Normalization trade-offs", h: 3.55, cols: [
      { head: "Gains", items: ["Higher recall: running matches run", "Smaller dictionary", "Queries tolerate case and plural changes"] },
      { head: "Costs", items: ["Lower precision: stemming can merge unrelated words", "Language-specific rules are needed", "Stop-word removal breaks phrases such as to be or not to be"] },
      { head: "Practice", items: ["Test choices against judged queries", "Keep the original text for display", "Treat the chain as a tunable model component"] } ],
      note: "Every normalization step trades precision for recall. There is no universally correct setting.", noteHead: "Design principle" }],
    ["table", { title: "The inverted index", cols: ["Term", "df", "Postings (document : term frequency)"], colW: [2.6, 1.4, 8.13], rows: [
      ["cats", "2", "D1:1 , D2:1"], ["chase", "2", "D1:1 , D2:1"], ["mice", "2", "D1:1 , D3:1"],
      ["dogs", "1", "D2:1"], ["eat", "1", "D3:1"], ["cheese", "1", "D3:1"] ], fs: 14.5,
      noteHead: "Collection: D1 = cats chase mice, D2 = dogs chase cats, D3 = mice eat cheese", note: "The dictionary holds terms and document frequency (df). Each term points to a postings list, sorted by document identifier.", noteY: 5.35, noteH: 1.35 }],
    ["steps", { title: "Building an index", items: [
      ["Emit pairs", "Analyze each document and output (term, document) pairs as they appear."],
      ["Sort", "Order pairs by term, then by document identifier."],
      ["Merge duplicates", "Collapse repeated pairs into one posting with a term frequency."],
      ["Write structures", "Store the dictionary, postings and per-document statistics such as length."] ],
      footHead: "Why sort?", foot: "Sorted postings let us combine lists by a single pass, and make later compression effective." }],
    ["bullets", { title: "Answering a query with postings", items: [
      ["Look up each term.", "The dictionary returns each postings list directly, with no scan of documents."],
      ["Combine the lists.", "For cats AND mice, intersect {D1, D2} with {D1, D3} to get {D1}."],
      ["Linear merge.", "Two sorted lists are walked together, advancing the smaller pointer. Cost is proportional to the list lengths."],
      ["Start small.", "Process the rarest term first. The result can never be larger than the shortest list."] ],
      why: "Sorting is a design decision made at build time that pays off at every query.", whyHead: "Design link" }],
    ["compare", { title: "Positions, gaps and skips", h: 3.65, cols: [
      { head: "Positional index", items: ["Store word offsets inside each document", "Enables phrase and proximity queries", "Index grows noticeably larger"] },
      { head: "Gap encoding", items: ["Store differences between sorted ids", "100, 105, 112 becomes 100, 5, 7", "Small numbers compress well"] },
      { head: "Skip pointers", items: ["Shortcuts inside long lists", "Jump past ids that cannot match", "Speeds up intersections"] } ],
      note: "Compression also helps speed, since less data moves from disk or memory for each query. Space and time are not always opposed.", noteHead: "Surprising point" }],
    ["table", { title: "Phrase queries with positions", cols: ["Term", "Positions per document"], colW: [3.0, 9.13], rows: [
      ["chase", "D1: [2]    D2: [2]"], ["cats", "D1: [1]    D2: [3]"] ],
      noteHead: "Query: \"chase cats\"", note: "A phrase matches when the second term appears exactly one position after the first. In D1, cats is at 1 and chase at 2, so there is no match. In D2, chase is at 2 and cats at 3, so D2 matches. Without positions, both documents would match the AND query.", noteY: 3.5, noteH: 1.9 }],
    ["takeaways", { items: [
      "An inverted index maps each term to the documents containing it, replacing a scan with lookups.",
      "Documents and queries must pass through the same analysis chain.",
      "Normalization raises recall but can reduce precision, so tune it with judged queries.",
      "Sorted postings enable fast merges, gap compression and skip pointers." ],
      next: "Module 3 scores documents with term weights and the vector space model.", check: "Why is the rarest term the best one to process first in an AND query?" }],
  ],
};
