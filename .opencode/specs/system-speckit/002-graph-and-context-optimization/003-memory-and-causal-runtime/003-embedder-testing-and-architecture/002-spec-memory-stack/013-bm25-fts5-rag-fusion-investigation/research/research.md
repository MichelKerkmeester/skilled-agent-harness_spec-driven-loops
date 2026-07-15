# BM25 FTS5 RAG Fusion Investigation

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

<!-- ANCHOR:investigation-report -->

## 1. Summary

This research investigated whether removing the JS in-memory BM25 index degrades the current hybrid-search intelligence. The concern is legitimate: the system is RAG fusion, not vector-only search, and the JS BM25 path contains more than a BM25 formula. It has custom tokenization, stop-word filtering, lightweight stemming, synonym expansion, query rewriting, content normalization, trigger flattening, and resident document-frequency state.

The answer is: **switching the rank engine to SQLite FTS5 does not inherently break RAG fusion**, because the enhanced hybrid path already groups FTS and BM25 candidates into one `keyword` list before final fusion. The dangerous version of the change would be deleting the shared TypeScript lexical normalization along with the resident JS index. The safe version is to stop warming/retaining the JS BM25 index by default, keep FTS5 as the lexical BM25 rank provider, preserve TypeScript query expansion in front of FTS5, and add golden-query parity gates before shipping.

Recommended path: **Option B, SQLite FTS5-only default, with guardrails**. Do not keep a permanent dual lexical engine unless the proposed 30-query golden suite shows repeated top-5 losses in synonyms, stemming, or identifier tokenization.

## 2. Findings

1. **JS BM25 has real lexical intelligence beyond scoring**
   - Evidence: `bm25-index.ts:155-180` defines tokenizer/filter/stem flow; `bm25-index.ts:68-87` defines synonyms; `bm25-index.ts:584-600` expands FTS and BM25 query tokens; `content-normalizer.ts:221-229` and `content-normalizer.ts:255-262` normalize markdown content before BM25 indexing.
   - Memory impact: keeping this path warm retains the in-memory maps from `bm25-index.ts:259-264`.
   - Quality impact: positive for synonyms, custom stems, and identifier-like tokens.
   - Effort: low to preserve query expansion, medium to preserve all indexing behavior.
   - Risk: medium if removed wholesale.

2. **FTS5 is already the stronger weighted lexical scorer**
   - Evidence: `sqlite-fts.ts:191-203` ranks with `-bm25(memory_fts, 10.0, 5.0, 2.0, 1.0)`; `bm25-index.ts:46-59` says those weights are consumed by FTS5, not by the JS in-memory BM25 engine.
   - Memory impact: FTS5 uses the existing SQLite index, avoiding JS resident document/token maps.
   - Quality impact: likely better for title, trigger phrase, file path, and content weighting.
   - Effort: low for current wrapper, medium if schema/tokenizer changes are added.
   - Risk: low for normal exact lexical searches.

3. **The production FTS5 schema does not currently reproduce JS tokenization**
   - Evidence: `vector-index-schema.ts:2444-2450` creates `memory_fts` without `tokenize=` options; JS tokenization preserves `_` and `-` at `bm25-index.ts:155-164`.
   - Memory impact: no direct memory impact.
   - Quality impact: possible regressions for `hybrid-search`, `memory_index`, env vars, and hyphenated phrases.
   - Effort: medium to migrate FTS5 with `tokenchars`, or low to add query alternatives.
   - Risk: medium until golden queries cover identifiers.

4. **Synonyms are safe only if shared TypeScript query expansion remains**
   - Evidence: current FTS5 search calls `normalizeLexicalQueryTokens(query).fts` at `sqlite-fts.ts:170-174`; synonyms live in `bm25-index.ts:68-87`.
   - Memory impact: keeping query expansion does not require warming the JS BM25 index.
   - Quality impact: high for ephemeral/temporary, constitutional/pinned, memory/context, and retrieval/search queries.
   - Effort: low to keep a shared lexical-normalizer module.
   - Risk: medium if `bm25-index.ts` is removed without relocating the normalizer.

5. **RRF preservation depends on the keyword list, not the JS engine**
   - Evidence: FTS and BM25 are collected separately at `hybrid-search.ts:1241-1258`, combined as `keywordResults` at `hybrid-search.ts:1333-1337`, and inserted into final fusion as one `keyword` list at `hybrid-search.ts:1390-1419`.
   - Memory impact: Option B saves resident JS state while retaining the FTS lexical list.
   - Quality impact: RAG fusion remains intact if FTS continues to feed `keyword`.
   - Effort: low-medium, mostly channel-label and test updates.
   - Risk: low for fusion architecture, medium for source-label compatibility.

6. **Existing tests protect implementation details more than retrieval quality**
   - Evidence: `tests/bm25-index.vitest.ts:87-202` asserts tokenizer and stemmer behavior; `tests/bm25-index.vitest.ts:221-228` asserts synonym bridge; `tests/hybrid-search.vitest.ts:297-405` asserts in-memory BM25 availability and scoped lookup; no `tests/golden-queries/` path was found.
   - Memory impact: none.
   - Quality impact: missing golden queries make rank regressions hard to detect.
   - Effort: medium to add a 30-query fixture suite.
   - Risk: high if default switch lands without behavioral tests.

7. **FTS5 can match many features, but custom tokenizer work is not the first move**
   - Evidence: official SQLite FTS5 docs document `tokenize`, prefix indexes, external-content tables, built-in tokenizers, and weighted bm25 ranking (`https://www.sqlite.org/fts5.html`); FTS5 extension docs describe custom tokenizers and synonyms (`https://www.sqlite.org/src/doc/trunk/ext/fts5/fts5.h`).
   - Memory impact: custom tokenizer has no JS index memory cost, but adds native extension complexity.
   - Quality impact: can be high if exact synonym/token behavior is needed.
   - Effort: high for native custom tokenizer, low for TypeScript query expansion.
   - Risk: high if pursued before simpler guardrails.

## 3. Decision matrix

| Dimension | Option A: keep JS BM25 | Option B: SQLite FTS5 only | Option C: hybrid route |
|-----------|------------------------|----------------------------|------------------------|
| Memory savings | None | Highest, removes warm resident JS index | Partial, depends on whether JS stays warm |
| Retrieval quality | Current baseline; best for JS stems and identifiers | Good for weighted exact matches; risky for stems/identifiers without tests | Best edge-case preservation if routed correctly |
| Implementation effort | Low | Medium | High |
| Risk | Memory goal missed | Medium until golden queries pass | High complexity and routing risk |
| RRF preservation | Preserved | Preserved if FTS feeds `keyword` | Preserved but more complex |
| Best query classes | Stemmer, synonyms, identifiers | Title, trigger, file path, normal prose | Stemmer/identifier edge cases |
| Worst query classes | Memory-heavy deployment | Custom tokenization gaps | Operational simplicity |

## 4. Recommendation

Choose **Option B: SQLite FTS5-only default with guardrails**.

Implementation criteria before flipping the default:

1. Keep `normalizeLexicalQueryTokens()` behavior available to FTS5, even if it moves out of `bm25-index.ts`.
2. Add the 30-query golden suite from `iteration-003.md`.
3. Require overlap@5 >= 0.8 for normal prose, synonym, RRF-stressing, and title/trigger/file-path queries.
4. Require explicit fixture rows for `running/runs/tested`, `hybrid-search`, `memory_index`, `SPECKIT_BM25_ENGINE`, and `always-surface`.
5. Update tests that currently equate `bm25Search()` with a warm JS singleton.
6. Do not remove JS BM25 code immediately; first stop default warmup and keep a fallback flag.

Revisit to Option C only if golden-query failures cluster in one of these buckets: custom stemming, hyphen/underscore identifiers, or JSON trigger phrase normalization. Do not keep Option C for ordinary prose or exact field-weighted matches.

## 5. Negative knowledge

- Do not treat FTS5 as "semantic search." It is the lexical lane; vector search remains the semantic lane.
- Do not delete `bm25-index.ts` normalizer exports without moving them, because `sqlite-fts.ts` currently depends on `normalizeLexicalQueryTokens()`.
- Do not port the JS custom stemmer into a native FTS5 tokenizer first. Use golden-query evidence before accepting native tokenizer complexity.
- Do not assume Porter stemming is exact parity. It is broader and different from the current suffix remover.
- Do not trust the current FTS tests as a production column-order proof. The in-memory test table differs from production column order.
- Do not call the swap complete without golden-query metrics. Existing unit tests are not enough.

## 6. Open questions

- What are measured nDCG@5, recall@10, and overlap@5 for the 30 proposed queries?
- Should production FTS5 adopt `tokenize='porter unicode61'`, or should stemming stay query-side?
- Should production FTS5 add `tokenchars '-_'` for code identifiers, or should query construction expand identifier variants?
- Should `bm25Search()` remain as a public label if its default backend becomes FTS5?
- What telemetry should report lexical degradation if FTS5 is unavailable and JS BM25 is cold?

## 7. Cross-references

- Iteration 001: [JS BM25 feature inventory](iterations/iteration-001.md)
- Iteration 002: [SQLite FTS5 capability map](iterations/iteration-002.md)
- Iteration 003: [30 golden queries comparative behavior](iterations/iteration-003.md)
- Iteration 004: [Fixture and test coverage](iterations/iteration-004.md)
- Iteration 005: [RRF behavior under each option](iterations/iteration-005.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- Tests: `.opencode/skills/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts`
- Tests: `.opencode/skills/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts`
- Tests: `.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts`
- Predecessor synthesis: `005-context-server-memory-reduction-research/research/iterations/iteration-010.md`

## Citations

- [Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts`]
- [Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`]
- [Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`]
- [Source: SQLite FTS5 documentation, https://www.sqlite.org/fts5.html]
- [Source: SQLite FTS5 extension API, https://www.sqlite.org/src/doc/trunk/ext/fts5/fts5.h]
<!-- /ANCHOR:investigation-report -->
