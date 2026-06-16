# Iteration 36 (Round N): C5-B channel spot-check → S (content_hash already projected)

## Focus
Resolve the M7 effort residual: is content_hash already on the rows the comparator sees. Read-only.

## Findings (newInfoRatio 0.85)
**RESOLUTION: content_hash-already-projected → C5-B is S** (one-line `compareDeterministicRows` tweak, NOT M).
- The dominant candidate channels project `content_hash` via `SELECT m.*`: vector (`vector-index-queries.ts:445,459-461`), multi-concept (`:555,578-582`), FTS5/lexical (`sqlite-fts.ts:198-201`). `content_hash` is a real memory_index column (`vector-index-schema.ts:160,2478`).
- It flows untyped: `PipelineRow extends Record<string,unknown>` (`pipeline/types.ts:15`); fusion/rerank preserve all fields (stage2 `{...row}` `:300-306`, stage3 "preserving all original fields" `:171-172`). The comparator sorts `PipelineRow` (`ranking-contract.ts:39-54`), not the thin internal `RrfItem`.
- So C5-B = add `content_hash asc` to the comparator tiebreak; no SELECT plumbing, no field add. LEVERAGE M, EFFORT **S**.

## Most-likely-wrong (uniformity caveat)
The standalone BM25 path uses an explicit column list OMITTING content_hash (`bm25-index.ts:721`) — BM25-only candidates would carry `undefined` content_hash → the new tiebreak falls through to `a.id` for them (non-uniform determinism, still S to edit). Also content_hash is nullable for pre-migration rows. Fix should COALESCE to id.

## Next Focus
C5-B downgraded to S in the ledger (with the BM25/nullable uniformity note). Strongest determinism transfer; pairs with Primitive A.
