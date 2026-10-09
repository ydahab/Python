# Information Retrieval Modeling: 7 standalone modules

Audience: intermediate (databases, basic ML). Each module is a PowerPoint deck of 11 to 14 slides with 880 to 1,000 words of slide text: learning objectives first, worked examples, key equations with terms defined, "why" call-outs, and a takeaways slide. No vendor tools, no code, no proofs.

| # | Deck | Topic |
|---|---|---|
| 1 | IR_Module1_Foundations | Tasks, pipeline, relevance, precision and recall |
| 2 | IR_Module2_Indexing | Analysis chain, inverted index, positions, compression |
| 3 | IR_Module3_Vector_Space | Boolean model, TF-IDF, cosine similarity, relevance feedback |
| 4 | IR_Module4_Probabilistic | Ranking principle, BM25, language models, smoothing |
| 5 | IR_Module5_Neural | Embeddings, bi- and cross-encoders, learned sparse, rank fusion |
| 6 | IR_Module6_Evaluation | Test collections, MRR, MAP, nDCG, online evaluation |
| 7 | IR_Module7_Implementation | Multi-stage ranking, scaling, ANN, freshness, learning to rank |

Build: `NODE_PATH=<pptxgenjs, jszip> node build.js` (content in `modules/`, engine in `engine.js`); `python3 wordcount.py` prints slide-text word counts.
