# Iteration 003 - 30 golden queries comparative behavior

## Summary

No live production daemon queries were run. The predictions below are based on code reading: JS BM25 tokenizes and stems through `bm25-index.ts:155-180` and `bm25-index.ts:130-153`; FTS5 query construction uses `normalizeLexicalQueryTokens(query).fts` through `sqlite-fts.ts:170-174`; RRF later groups lexical results in `hybrid-search.ts:1390-1419`.

Rank correlation values are qualitative. `High` means expected top-5 overlap and order should be similar. `Medium` means top-5 overlap likely but order shifts. `Low` means query behavior likely changes. `REQUIRES_LIVE_TEST` means the expected result depends on the actual memory corpus.

## Query predictions

| # | Query | Class | JS BM25 expected top-5 | SQLite FTS5 expected top-5 | Divergence | Notes |
|---|-------|-------|------------------------|-----------------------------|------------|-------|
| 1 | `memory` | single-token | Memories containing `memory` plus stemmed `memorie` matches | Rows matching `memory` and synonym-expanded `context`, `knowledge` | Medium | Synonym expansion is shared if TS normalizer remains. |
| 2 | `search` | single-token | Search/retrieval/query documents | FTS rows for search/retrieval/query | High | Query synonyms are shared today. |
| 3 | `tier` | single-token | Tier/importance/priority rows | FTS rows for tier/importance/priority | High | Shared expansion. |
| 4 | `constitutional` | single-token | Constitutional/pinned/critical rows | FTS rows with weighted title/trigger hits | Medium | FTS field weights may improve precision. |
| 5 | `cache` | single-token | Cache rows by term frequency | FTS rows by weighted column BM25 | Medium | Field weights change order. |
| 6 | `memory search` | multi-token AND-like | Documents with either stemmed term; scores accumulate for both | Current FTS query is `"memory" OR "search" OR synonyms OR "memory search"` | Medium | FTS OR improves recall, may lower precision. |
| 7 | `sqlite schema` | multi-token | Rows with both terms score higher if both present | FTS OR over terms, phrase token may boost exact phrase | Medium | Requires live corpus for order. |
| 8 | `trigger phrase` | multi-token | Trigger/content/file text all concatenated, no field weight | Trigger column weighted 5x | Medium | FTS likely ranks trigger-column hits higher. |
| 9 | `active projection` | multi-token | Stemmed exact token accumulation | FTS OR plus phrase | Medium | Phrase exactness helps FTS. |
| 10 | `lazy startup gating` | multi-token | Rows containing any terms, stemmed `gating` to `gat` | FTS default tokenizer likely no stem unless query expansion keeps raw | Medium-Low | Stemming divergence. |
| 11 | `"memory search"` | phrase | Quotes stripped; shared tokens plus injected phrase | Quotes stripped; injected phrase token present | High | Current sanitizer erases explicit quote structure. |
| 12 | `"canonical vector shard"` | phrase | Tokens and injected full phrase | FTS tokens plus phrase | Medium | FTS phrase can help if indexed tokenization matches. |
| 13 | `"short-term memory"` | phrase | Hyphen preserved as one fragment, synonym expansion may help | FTS tokenization may split hyphen unless tokenchars configured | Low | Identifier/hyphen risk. |
| 14 | `"always-surface context"` | phrase | Hyphen preserved; synonyms include constitutional/pinned/critical | FTS default may split `always-surface` | Low | High-risk query. |
| 15 | `"context server"` | phrase | Tokens and phrase | FTS phrase over column text | High | Common prose phrase. |
| 16 | `running` | stemming-sensitive | Stemmed to `run`; matches `run` and `running` indexed as `run` | Default FTS likely matches `running`, not `run`, unless Porter enabled | Low | REQUIRES_LIVE_TEST. |
| 17 | `runs` | stemming-sensitive | Stemmed to `run` | Default FTS likely token `runs` | Low | JS advantage unless FTS Porter. |
| 18 | `tested` | stemming-sensitive | Stemmed to `test` | Default FTS token `tested` | Low | Existing tests assert JS stem. |
| 19 | `reaction` | stemming-sensitive | Custom stem `reac` | Porter/default differ | Low | JS custom stem may be odd but tested. |
| 20 | `agreement` | stemming-sensitive | No `-ment` stripping | Porter may stem differently if enabled | Medium | Default FTS may actually match JS raw better here. |
| 21 | `hybrid-search` | tokenization edge | Hyphen preserved in JS fragment | FTS default likely splits around hyphen | Low | Configure tokenchars or query alternatives. |
| 22 | `memory_index` | tokenization edge | Underscore preserved | FTS default behavior may split or preserve depending tokenizer class; verify | REQUIRES_LIVE_TEST | Code identifiers need fixture. |
| 23 | `buildBm25DocumentText` | tokenization edge | Lowercase whole camelCase token, no camel split | FTS default token likely whole term case-folded | Medium | Neither path splits camelCase. |
| 24 | `cafe` | Unicode edge | JS strips non-ASCII accents from input only by replacing non `[a-z0-9]`; indexed `café` may lose `é` boundary | FTS `unicode61` can remove diacritics depending default options | REQUIRES_LIVE_TEST | FTS may outperform JS. |
| 25 | `SPECKIT_BM25_ENGINE` | tokenization edge | Underscore preserved and lowercased | FTS tokenization uncertain without `tokenchars '_'` | REQUIRES_LIVE_TEST | Important future flag query. |
| 26 | `ephemeral context retrieval` | RRF-stressing | JS BM25 expands ephemeral/temporary/transient and context/memory/knowledge | FTS shares expansion if normalizer kept; vector also relevant | Medium | RRF likely robust if FTS returns enough lexical rows. |
| 27 | `why did lazy startup reduce memory` | RRF-stressing | Stop words removed; memory/stemmed terms dominate | FTS OR query includes more raw terms unless pre-filtered | Medium | Vector lane likely carries intent. |
| 28 | `constitutional pinned memory` | RRF-stressing | Synonym-expanded lexical hits align with trigger lane | FTS weighted title/trigger improves exact rows | Medium-High | FTS may improve top rank. |
| 29 | `fix bm25 warmup rss` | RRF-stressing | Stemmed `fix`, `bm25`, `warmup`, `rss`; file paths included | FTS field weights and file path column help | Medium | Live corpus needed. |
| 30 | `where is reciprocal rank fusion implemented` | RRF-stressing | Keyword hits on RRF/fusion plus vector intent | FTS keyword hits plus vector/graph | High | Semantic lane dominates exact phrasing. |

## Expected top-5 behavior by system option

FACT: Exact top-5 document IDs cannot be predicted without the actual memory DB and daemon query path. The falsifiable expectation is this:

- Option A should win stemmer-heavy and hyphen/underscore-heavy queries when those exact variants exist only after JS normalization.
- Option B should match or beat Option A on title, trigger phrase, and file-path exact matches because FTS5 uses column weights in `sqlite-fts.ts:191-203`.
- Option B should preserve synonym recall only if `normalizeLexicalQueryTokens()` remains in the FTS query builder.
- Option C should only be justified if the live 30-query suite shows repeated top-5 misses clustered in synonyms, stemming, or identifier tokenization.

## Suggested live test assertions

1. For synonym queries, assert overlap@5 between current hybrid and FTS5-only is at least 0.8.
2. For stemming queries, assert known `run/test/box` fixture rows stay in top 5.
3. For identifier queries, assert `memory_index`, `hybrid-search`, and `SPECKIT_BM25_ENGINE` fixture rows stay retrievable.
4. For RRF-stressing queries, assert at least one lexical-backed and one vector-backed result appears in top 10.

