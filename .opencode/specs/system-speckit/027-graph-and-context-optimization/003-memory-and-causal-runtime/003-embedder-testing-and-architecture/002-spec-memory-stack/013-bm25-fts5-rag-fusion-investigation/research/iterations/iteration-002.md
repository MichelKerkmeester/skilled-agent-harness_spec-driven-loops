# Iteration 002 - SQLite FTS5 capability map

## Summary

FACT: SQLite FTS5 can cover much of the lexical lane with built-in features: BM25 ranking, column weights, phrase queries, NEAR, boolean syntax, external-content tables, prefix indexes, and built-in tokenizers including `unicode61` and `porter`.

FACT: The production schema currently creates `memory_fts` without explicit tokenizer or prefix options. The current implementation also sanitizes away boolean/proximity operators before querying FTS5, so "FTS5 can" is not the same as "this code currently does."

Primary docs consulted:
- SQLite FTS5 docs: `https://www.sqlite.org/fts5.html`
- SQLite FTS5 extension API docs: `https://www.sqlite.org/src/doc/trunk/ext/fts5/fts5.h`

## Capability map for non-native JS features

1. **ASCII-biased tokenizer with hyphen/underscore preservation**
   - JS evidence: `bm25-index.ts:155-164`.
   - Production FTS evidence: `vector-index-schema.ts:2444-2450` creates `memory_fts` with no `tokenize=` option.
   - FTS5 capability: SQLite documents `tokenize` as a table creation option and lists `unicode61`, `ascii`, `porter`, and `trigram` built-ins (`sqlite.org/fts5.html`, table creation and tokenizer sections).
   - Implementation option: recreate `memory_fts` with `tokenize='unicode61 tokenchars ''-_'''`.
   - Cost: **Medium** because it requires migration/rebuild and tests.
   - Semantics preserved: **Partial**. FTS5 tokenchars can preserve characters, but JS also strips non-ASCII punctuation and lowercases via a custom regex.

2. **Stop-word filtering**
   - JS evidence: `bm25-index.ts:111-117` and `bm25-index.ts:177-180`.
   - FTS5 capability: no simple built-in stop-word option in the documented FTS5 creation options; custom tokenizers are supported through the extension API (`fts5.h:20-24`, `fts5.h:707-741`).
   - Implementation option A: keep TypeScript query pre-filtering for FTS, low effort.
   - Implementation option B: implement/register a custom tokenizer, high effort.
   - Cost: **Low** for query-only filtering, **High** for tokenizer parity.
   - Semantics preserved: **Partial**. Query-side filtering prevents stop-word-only query noise but does not remove stop words from indexed document length/statistics.

3. **Lightweight custom stemmer**
   - JS evidence: `bm25-index.ts:130-153`; tests at `tests/bm25-index.vitest.ts:150-202`.
   - FTS5 capability: built-in `porter` tokenizer can stem `unicode61` output (`sqlite.org/fts5.html`, porter examples).
   - Implementation option: `tokenize='porter unicode61'`.
   - Cost: **Medium** because it changes the on-disk FTS index and needs rebuild.
   - Semantics preserved: **Partial**. Porter is broader and different from the custom suffix remover.

4. **Query-time synonyms**
   - JS evidence: `bm25-index.ts:68-87` and `bm25-index.ts:584-600`.
   - Current FTS evidence: `sqlite-fts.ts:170-174` uses `normalizeLexicalQueryTokens(query).fts`, so FTS currently benefits from this TypeScript expansion.
   - FTS5 capability: custom tokenizers may support synonyms; the FTS5 API describes query-time and index-time synonym approaches using colocated tokens (`fts5.h:531-637`).
   - Implementation option A: keep TypeScript synonym expansion, low effort.
   - Implementation option B: custom tokenizer with synonym support, high effort.
   - Cost: **Low** if preserving TS expansion, **High** for FTS-native synonyms.
   - Semantics preserved: **High** with TS expansion, **Partial** with custom tokenizer unless carefully matched.

5. **Phrase-token injection**
   - JS evidence: `bm25-index.ts:591-597`.
   - Current FTS evidence: `sqlite-fts.ts:170-174` quotes each token and joins with `OR`.
   - FTS5 capability: FTS5 supports phrase queries and NEAR queries (`sqlite.org/fts5.html`, query syntax and detail-mode sections).
   - Implementation option: keep current phrase token, or allow explicit user phrase parsing with safe syntax.
   - Cost: **Low** for current behavior, **Medium** for richer phrase parsing.
   - Semantics preserved: **Partial**. Current production only injects one phrase containing all shared tokens.

6. **Boolean/proximity query rewriting**
   - JS evidence: `bm25-index.ts:556-577` strips `NEAR`, `NOT`, `AND`, and `OR`.
   - FTS5 capability: advanced MATCH syntax supports boolean and NEAR style expressions, but current code removes them.
   - Implementation option: keep current sanitization for safety; optionally add an advanced-search mode later.
   - Cost: **Low** to preserve current behavior.
   - Semantics preserved: **Native FTS5 available, intentionally not used**.

7. **Markdown/content normalization**
   - JS evidence: `content-normalizer.ts:221-229` and `content-normalizer.ts:255-262`.
   - FTS5 capability: FTS5 does not normalize markdown structure by itself.
   - Production schema evidence: triggers copy `new.content_text` into `memory_fts` at `vector-index-schema.ts:2452-2474`.
   - Implementation option: ensure all writers store normalized `content_text`; do not rely on FTS5 for markdown cleanup.
   - Cost: **Low-Medium** depending on writer coverage.
   - Semantics preserved: **Partial** until writer coverage is verified.

8. **Trigger phrase JSON flattening**
   - JS evidence: `bm25-index.ts:202-230`.
   - FTS5 capability: external-content triggers index the raw `trigger_phrases` field; FTS5 does not parse JSON arrays.
   - Implementation option: add a generated/normalized trigger text column for FTS or normalize before writing `trigger_phrases`.
   - Cost: **Medium** because it affects schema or save pipeline.
   - Semantics preserved: **Partial**.

9. **Multi-field weighting**
   - JS evidence: `BM25_FTS5_WEIGHTS` at `bm25-index.ts:46-59`, with comment that weights are consumed by FTS5.
   - FTS5 evidence: `sqlite-fts.ts:191-203` calls `-bm25(memory_fts, 10.0, 5.0, 2.0, 1.0)`.
   - FTS5 capability: SQLite documents trailing bm25 arguments and rank mapping for weighted ranking (`sqlite.org/fts5.html`, BM25/rank section).
   - Implementation option: keep current FTS5 weighting and verify column order.
   - Cost: **Low**.
   - Semantics preserved: **Native and better than JS BM25**.

10. **External-content consistency**
    - Production evidence: `vector-index-schema.ts:2444-2474` uses `content='memory_index'`, `content_rowid='id'`, and insert/update/delete triggers.
    - FTS5 capability: SQLite supports external-content tables and recommends triggers plus rebuild for consistency (`sqlite.org/fts5.html`, external content sections).
    - Implementation option: keep current triggers and repair/rebuild path.
    - Cost: **Low**.
    - Semantics preserved: **Native parity** for persistence and sync.

## Bottom line

FACT: FTS5 can replace the resident BM25 rank engine. It cannot, by itself, replace all JS preprocessing unless production keeps TypeScript query expansion and writer-side normalization.

INFERENCE: The lowest-risk implementation is not a custom tokenizer first. It is FTS5 as the rank engine, plus preserved TypeScript query normalization, plus golden-query tests for the three likely gaps: synonyms, stemming, and identifiers.

