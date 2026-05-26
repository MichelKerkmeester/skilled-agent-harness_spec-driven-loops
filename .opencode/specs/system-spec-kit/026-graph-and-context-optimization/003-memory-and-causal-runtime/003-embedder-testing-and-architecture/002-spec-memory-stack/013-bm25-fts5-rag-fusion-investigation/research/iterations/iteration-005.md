# Iteration 005 - RRF behavior under each option

## Summary

FACT: The enhanced hybrid path collects separate `fts` and `bm25` channel results, then converts both into one `keyword` list before final fusion. That means the RAG-fusion design does not require two lexical engines; it requires at least one high-quality lexical rank list.

FACT: FTS is already lower channel weight at collection time (`0.3`) than BM25 (`0.6`), but the final RRF path groups both as `keyword` and applies adaptive keyword weighting. The implementation detail matters: removing JS BM25 should not remove the keyword list.

## Current RRF evidence

1. Vector results are collected first when the vector channel is active, and pushed with source `vector` and weight `1.0` at `hybrid-search.ts:1208-1235`.
2. FTS results are collected through `ftsSearch()` and pushed with source `fts` and weight `0.3` at `hybrid-search.ts:1241-1248`.
3. BM25 results are collected through `bm25Search()` and pushed with source `bm25` and weight `0.6` at `hybrid-search.ts:1251-1258`.
4. Exact trigger phrase search is a separate lane with weight `1.4` at `hybrid-search.ts:1261-1264`.
5. Keyword results are built from FTS plus BM25 at `hybrid-search.ts:1333-1337`.
6. FTS and BM25 lists are filtered out of direct final fusion and replaced by one `keyword` list at `hybrid-search.ts:1390-1419`.
7. The final fusion can use adaptive weights from `getAdaptiveWeights()` at `hybrid-search.ts:1382-1389`.

## Option A - keep JS BM25

Memory impact:
- Keeps resident JS document/token/term-frequency structures described in `bm25-index.ts:259-264`.
- Preserves warmup behavior in `bm25-index.ts:444-481`.
- Predecessor research estimated the memory win from removing warm resident BM25 as a leading lever.

Retrieval quality:
- Best for JS stemmer-heavy queries such as `running`, `tested`, and `boxes`.
- Best for identifier-like tokens if JS preservation of `_` and `-` matches the stored corpus better than default FTS.
- Best for synonym recall only if future FTS path loses shared TypeScript expansion.

RRF impact:
- RRF receives vector, FTS, BM25, trigger, graph, and degree lanes when available.
- Keyword grouping gets more lexical candidates because both FTS and BM25 feed it.

Qualitative metrics:
- nDCG@5: current baseline.
- recall@10: current baseline, likely highest for stem/synonym edge cases.
- Risk: memory remains high and two lexical engines stay semantically divergent.

## Option B - switch to SQLite FTS5 only

Memory impact:
- Removes the warm resident JS BM25 index by avoiding default `rebuildFromDatabase()`.
- Keeps SQLite FTS index on disk, already part of the database.

Retrieval quality:
- Preserves lexical BM25 ranks through `sqlite-fts.ts:191-203`.
- Improves or stabilizes title, trigger phrase, file path, and content weighting because FTS5 uses per-column weights.
- Loses exact JS stemmer semantics unless `porter` is enabled or query expansion handles it.
- Keeps synonyms if `normalizeLexicalQueryTokens()` remains in the FTS query path.

RRF impact:
- RRF still works if the FTS results enter `keywordFusionResults`.
- If the `bm25` list is removed but `fts` remains, the final fusion still receives `keyword`.
- The main risk is channel representation or tests expecting a literal `bm25` source label.

Qualitative metrics:
- nDCG@5: likely neutral to slightly positive for field-weighted exact matches; possible drops on stemmer/identifier edge cases.
- recall@10: likely neutral for normal prose; possible drops for `running/run`, hyphen, underscore, and raw JSON trigger phrase cases.
- Risk: medium without golden-query gate, low-medium with query expansion retained.

## Option C - hybrid route

Memory impact:
- Saves less than Option B because some JS BM25 state must remain warm or be rebuilt on demand.
- Savings depend on split criteria; if JS stays warm for all docs, memory savings collapse.

Split criteria:
- Route to JS BM25 only for queries containing hyphen/underscore/camelCase identifiers.
- Route to JS BM25 only for stemming-sensitive suffixes: `ing`, `ed`, `es`, `s`, `tion`, `ly`.
- Route to JS BM25 only for configured synonym groups if FTS query expansion is removed.
- Route all ordinary prose, title, trigger, and file-path searches to FTS5.

Retrieval quality:
- Highest chance of preserving edge-case recall.
- Also highest operational complexity because two engines can disagree and tests must cover routing.

RRF impact:
- RRF can preserve the current `keyword` group, but the source labels and duplicate handling become more complex.
- If JS BM25 is on-demand rather than warm, first-query latency may spike and implementation must handle cold misses.

Qualitative metrics:
- nDCG@5: potentially best on edge cases, not necessarily better on ordinary prose.
- recall@10: potentially best on stems/identifiers.
- Risk: high implementation complexity and lower memory savings.

## Queries that benefit most by option

| Query class | Option A | Option B | Option C |
|-------------|----------|----------|----------|
| Normal prose | Good | Good | Good |
| Title/trigger/file exact matches | Good | Best | Best |
| Synonym-heavy | Best if FTS loses expansion | Good if expansion retained | Best |
| Stemmer-heavy | Best | Weak unless Porter/golden tests | Best |
| Identifier-heavy | Best if default FTS splits chars | Medium without tokenchars | Best |
| RRF semantic-plus-lexical | Good | Good | Good |

## Iteration conclusion

INFERENCE: Option B does not break RAG fusion because RRF needs a lexical rank list, not specifically the JS in-memory BM25 index. The quality risk is not "FTS5 cannot do BM25"; it is "FTS5-only defaults may not preserve JS preprocessing quirks."

Recommendation for synthesis: choose Option B with guardrails. Keep Option C as a targeted fallback only if live golden queries show repeated losses in the known risky classes.
