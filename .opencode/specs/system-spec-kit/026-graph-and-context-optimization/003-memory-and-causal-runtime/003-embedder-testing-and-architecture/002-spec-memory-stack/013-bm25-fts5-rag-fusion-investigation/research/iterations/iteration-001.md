# Iteration 001 - JS BM25 feature inventory

## Summary

FACT: The JS in-memory BM25 implementation does more than compute BM25 scores. It owns tokenization, stop-word filtering, lightweight stemming, query synonym expansion, markdown/content normalization for indexed body text, JSON trigger phrase flattening, file-path inclusion, and a warm in-memory document-frequency store.

FACT: SQLite FTS5 already exists as a separate weighted lexical lane, but the production table is created without an explicit tokenizer option, so it uses FTS5 defaults rather than the JS tokenizer/stemmer/synonym behavior.

## Numbered findings

1. **Finding 1: ASCII-biased lexical fragment tokenizer**
   - Evidence: `bm25-index.ts:155-164` lowercases, replaces characters outside `[a-z0-9\s-_]`, splits on whitespace, and preserves hyphen/underscore inside tokens.
   - Evidence: `bm25-index.ts:177-180` filters and stems the fragments.
   - FTS5-parity assessment: **PARTIAL**.
   - Rationale: default FTS5 `unicode61` supports Unicode word tokenization, but the production schema does not configure `tokenchars '-_'`; hyphen and underscore behavior can diverge.

2. **Finding 2: Stop-word filtering**
   - Evidence: `bm25-index.ts:111-117` defines a local stop-word set.
   - Evidence: `bm25-index.ts:177-180` removes those words during indexing, and `bm25-index.ts:595-600` removes them for JS BM25 query tokens.
   - FTS5-parity assessment: **NOT_AVAILABLE** in the current production FTS table.
   - Rationale: SQLite FTS5 built-ins do not expose a simple stop-word list option in the current schema. A custom tokenizer or query pre-filter can approximate it.

3. **Finding 3: Lightweight custom stemming**
   - Evidence: `bm25-index.ts:130-153` lowercases and strips suffixes `ing`, `tion`, `ed`, `ly`, `es`, and `s`, plus doubled-consonant cleanup after suffix removal.
   - Evidence: `tests/bm25-index.vitest.ts:150-202` asserts this behavior, including `running -> run`, `tested -> test`, `boxes -> box`, and no `-ment` or `-able` stemming.
   - FTS5-parity assessment: **PARTIAL**.
   - Rationale: FTS5 has a Porter tokenizer, but Porter will not exactly match this deliberately small custom stemmer.

4. **Finding 4: Query-time synonym expansion**
   - Evidence: `bm25-index.ts:68-87` defines synonyms for ephemeral/temporary/transient, constitutional/pinned/critical, tier/importance/priority, memory/context/knowledge, and retrieval/search/query.
   - Evidence: `bm25-index.ts:584-600` adds synonym tokens to both FTS and BM25 normalized lexical query tokens.
   - Evidence: `tests/bm25-index.vitest.ts:221-228` asserts that "short-term temporary memories" bridges local-memory vocabulary synonyms.
   - FTS5-parity assessment: **PARTIAL**.
   - Rationale: Current FTS5 query construction consumes the same expanded token list, but FTS5 itself does not own the synonym model. Removing JS BM25 is safe only if `normalizeLexicalQueryTokens()` remains available to FTS5.

5. **Finding 5: Phrase-token injection for multi-token queries**
   - Evidence: `bm25-index.ts:591-597` adds a quoted phrase token when the sanitized query has two or more shared tokens.
   - Evidence: `sqlite-fts.ts:170-174` wraps tokens and joins them with `OR`, so the phrase token becomes part of the FTS MATCH expression.
   - FTS5-parity assessment: **NATIVE_PARITY** for phrase matching, **PARTIAL** in current query construction.
   - Rationale: FTS5 supports phrase queries, but production sanitization strips user quotes and rebuilds one phrase from all shared tokens, not arbitrary user phrase structure.

6. **Finding 6: FTS operator stripping and safe query rewriting**
   - Evidence: `bm25-index.ts:556-577` truncates long queries, strips `NEAR`, `NOT`, `AND`, `OR`, removes `/N`, removes FTS special characters, and splits whitespace.
   - Evidence: `tests/hybrid-search.vitest.ts:753-760` verifies FTS search handles special characters and boolean operators as safe arrays.
   - FTS5-parity assessment: **NATIVE_PARITY** for FTS syntax, **PARTIAL** for production behavior.
   - Rationale: FTS5 can run boolean/proximity syntax, but production intentionally removes those operators for safety and recall.

7. **Finding 7: Markdown/content normalization before indexing**
   - Evidence: `content-normalizer.ts:255-262` routes BM25 normalization through embedding-style markdown cleanup.
   - Evidence: `content-normalizer.ts:221-229` strips frontmatter, anchors, comments, code-fence markers, tables, list notation, headings, and collapses whitespace.
   - Evidence: `bm25-index.ts:232-252` uses normalized `content_text` when building JS BM25 document text.
   - FTS5-parity assessment: **DOC_GAP**.
   - Rationale: FTS5 indexes whatever `memory_index.content_text` contains via triggers. If `content_text` is already normalized at save time, parity is high; this iteration did not verify every writer.

8. **Finding 8: Multi-field input shape without JS field weights**
   - Evidence: `buildBm25DocumentText()` concatenates title, normalized content, trigger phrases, and file path at `bm25-index.ts:232-252`.
   - Evidence: `bm25-index.ts:46-59` says exported field weights are consumed by FTS5, not the in-memory BM25 engine.
   - FTS5-parity assessment: **NATIVE_PARITY** for current desired weighting.
   - Rationale: FTS5 is stronger here: `sqlite-fts.ts:191-203` calls `bm25(memory_fts, 10.0, 5.0, 2.0, 1.0)` for column weighting.

9. **Finding 9: Trigger phrase JSON flattening**
   - Evidence: `bm25-index.ts:202-230` parses JSON arrays of trigger phrases or falls back to raw strings.
   - Evidence: `buildBm25DocumentText()` includes normalized trigger phrases at `bm25-index.ts:243-246`.
   - FTS5-parity assessment: **PARTIAL**.
   - Rationale: FTS5 indexes the `trigger_phrases` column directly. If it contains JSON syntax, default tokenization may index punctuation-adjacent fragments differently than the JS flattening path.

10. **Finding 10: Resident document-frequency and term-frequency maps**
    - Evidence: `bm25-index.ts:259-264` stores per-document token arrays, term-frequency maps, document-frequency maps, and total document length.
    - Evidence: `bm25-index.ts:315-340` computes the standard BM25 score from those maps.
    - FTS5-parity assessment: **NATIVE_PARITY** for BM25 ranking concept, **PARTIAL** for exact scoring.
    - Rationale: SQLite FTS5 has its own BM25 auxiliary function, but tokenization, document length, column boundaries, and weights differ.

11. **Finding 11: Batched in-memory warmup and incremental sync**
    - Evidence: `bm25-index.ts:444-481` schedules batched `memory_index` row warmup with `setTimeout`.
    - Evidence: `bm25-index.ts:385-437` incrementally syncs changed rows by ID.
    - Evidence: predecessor synthesis cites startup warmup at `context-server.ts:1706-1711`; current checkout has startup health shifted, but the BM25 class still retains the warmup mechanism.
    - FTS5-parity assessment: **NATIVE_PARITY** for persistence, **NOT_AVAILABLE** for JS memory semantics.
    - Rationale: FTS5 avoids this resident JS state by persisting the index in SQLite and syncing through triggers.

## Initial answer

FACT: Removing the resident JS BM25 index does remove some lexical behaviors if the replacement is interpreted as "delete `bm25-index.ts` normalization entirely." It does not remove them if the replacement is "stop warming the in-memory index, but keep shared query normalization and FTS5 weighted ranking."

INFERENCE: The highest-risk features are query synonyms, identifier tokenization, and trigger phrase flattening. Pure field weighting is actually better served by the FTS5 lane.

