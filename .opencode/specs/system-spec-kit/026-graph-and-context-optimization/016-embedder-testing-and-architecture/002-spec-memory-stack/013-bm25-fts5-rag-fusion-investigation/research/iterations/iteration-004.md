# Iteration 004 - Fixture and test coverage

## Summary

FACT: This checkout contains BM25, FTS5, hybrid-search, and broad `tests/search/` coverage under `.opencode/skills/system-spec-kit/mcp_server/tests`, but no `tests/cat-24/` or `tests/golden-queries/` directory was found.

FACT: Existing tests would catch an unplanned removal of the JS BM25 exports, tokenizer, simple stemmer, singleton, warmup, and `useBm25=false` channel behavior. They would not measure production retrieval quality across a golden-query set.

## Fixture inventory

1. **`tests/cat-24/`**
   - Evidence: `find . -path '*/tests/cat-24*'` returned no paths.
   - Coverage status: **Absent**.
   - Break risk: none directly, but no closure tests protect the swap.

2. **`tests/golden-queries/`**
   - Evidence: `find . -path '*/tests/golden-queries*'` returned no paths.
   - Coverage status: **Absent**.
   - Break risk: none directly, but this is the main missing quality gate.

3. **BM25 implementation tests**
   - Evidence: `tests/bm25-index.vitest.ts:87-144` tests tokenizer behavior.
   - Evidence: `tests/bm25-index.vitest.ts:150-202` tests custom stemming.
   - Evidence: `tests/bm25-index.vitest.ts:221-228` tests synonym expansion.
   - Evidence: `tests/bm25-index.vitest.ts:340-397` tests BM25 scoring and ranking shape.
   - Evidence: `tests/bm25-index.vitest.ts:636-680` tests deferred warmup hydration.
   - Likely effect under FTS5-only default: **20-30 tests remain valid if `bm25-index.ts` stays as a library; many fail only if the file/export is deleted.**

4. **BM25 baseline/evaluation tests**
   - Evidence: `tests/bm25-baseline.vitest.ts` contains contingency decision, bootstrap CI, metric write, and runner integration tests per its `describe()` inventory.
   - Coverage status: evaluation infrastructure, not retrieval corpus quality.
   - Likely effect under FTS5-only default: **Mostly still pass** if the baseline runner can accept injected search functions.

5. **SQLite FTS5 tests**
   - Evidence: `tests/sqlite-fts.vitest.ts:35-45` creates an in-memory `memory_fts` table.
   - Evidence: `tests/sqlite-fts.vitest.ts:80-85` asserts FTS5 weights.
   - Evidence: `tests/sqlite-fts.vitest.ts:88-104` asserts matching rows and title-weight ranking.
   - Evidence: `tests/sqlite-fts.vitest.ts:154-242` asserts lexical capability/degradation states.
   - Caveat: test table order at `tests/sqlite-fts.vitest.ts:37-44` is `title, trigger_phrases, content_text, file_path`, while production schema at `vector-index-schema.ts:2446-2449` is `title, trigger_phrases, file_path, content_text`.
   - Likely effect under FTS5-only default: **Still pass**, but should be strengthened for production column order.

6. **Hybrid search BM25 and lexical tests**
   - Evidence: `tests/hybrid-search.vitest.ts:297-405` tests BM25 availability, results, scores, limits, scope filter, and fail-closed scoped lookup.
   - Evidence: `tests/hybrid-search.vitest.ts:409-470` tests `combinedLexicalSearch()` behavior and deduplication.
   - Evidence: `tests/hybrid-search.vitest.ts:474-588` tests `hybridSearchEnhanced()` smoke behavior with `useBm25`.
   - Likely effect under FTS5-only default: **6-10 tests need updating** if `bm25Search()` no longer queries an in-memory index.

7. **Hybrid RRF and channel disable tests**
   - Evidence: `tests/hybrid-search.vitest.ts:592-620` verifies RRF integration smoke behavior.
   - Evidence: `tests/hybrid-search.vitest.ts:1240-1267` asserts graph-present fusion keeps lexical evidence grouped under `keyword`.
   - Evidence: `tests/hybrid-search.vitest.ts:1623-1670` asserts `useVector`, `useFts`, and `useBm25` disable channels.
   - Likely effect under FTS5-only default: **Mostly pass** if channel labels remain compatible; fail if `bm25` label disappears without updating expectations.

8. **FTS search smoke tests**
   - Evidence: `tests/hybrid-search.vitest.ts:727-761` tests `isFtsAvailable()`, `ftsSearch()` array shape, `fts_score`, and special/boolean character escaping.
   - Likely effect under FTS5-only default: **Pass**.

9. **Broad search tests**
   - Evidence: `tests/search/deep-review-remediation.vitest.ts:9-38` covers decision-record rescue/remediation logic, not BM25/FTS parity.
   - Likely effect under FTS5-only default: **Pass** unless search ranking inputs change through broader pipeline tests.

## Quantified break/update estimate

INFERENCE: If implementation means "do not warm the JS index by default, route `bm25Search()` to FTS5 when in-memory BM25 is cold", expected test impact:

- **Would fail**: about 2-5 tests that explicitly expect `isBm25Available()` to reflect JS in-memory population or `bm25Search()` to read the singleton.
- **Need updating**: about 8-12 tests around BM25 channel semantics, combined lexical source labels, and FTS schema column order.
- **Would still pass**: most FTS tests, RRF smoke tests, channel-disable tests, baseline metric utility tests, and tokenizer unit tests if `bm25-index.ts` remains exported.

GUESS: If implementation means "delete `bm25-index.ts` and JS normalizer exports", more than 50 tests would fail because BM25 unit tests import those symbols directly and FTS still imports `normalizeLexicalQueryTokens()` from `bm25-index.ts`.

## Regression classification

1. **Behavioral-regression tests**
   - Synonym bridge test at `tests/bm25-index.vitest.ts:221-228`.
   - Stemmer tests at `tests/bm25-index.vitest.ts:150-202`.
   - Scope fail-closed behavior at `tests/hybrid-search.vitest.ts:360-404`.

2. **Implementation-detail tests**
   - Singleton behavior at `tests/bm25-index.vitest.ts:439-457`.
   - Warmup scheduling at `tests/bm25-index.vitest.ts:636-680`.
   - `isBm25Available()` as in-memory document count at `tests/hybrid-search.vitest.ts:303-315`.

3. **Missing tests**
   - No 30-query golden corpus.
   - No measured nDCG@5, recall@10, or overlap@5 for JS BM25 versus FTS5.
   - No identifier-tokenization fixture for hyphen, underscore, camelCase, and env-var names.
   - No FTS schema test matching production column order and weights.

