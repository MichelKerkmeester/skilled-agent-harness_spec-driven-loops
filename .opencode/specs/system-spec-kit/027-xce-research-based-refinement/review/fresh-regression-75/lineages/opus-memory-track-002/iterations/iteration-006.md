# Seat opus-memory-track-002 — iteration 6 (global #35)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-memory-track-002
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

## Review: Search resilience — packed BM25 + hybrid scoped-then-limit

I traced the real behavior of the packed BM25 engine (`bm25-index.ts`, ~1014 new lines this epic), the hybrid BM25 lane and scope-then-limit fix (`hybrid-search.ts`), and the FTS5 lexical path (`sqlite-fts.ts`).

### What I verified as correct (not findings)

- **Scope-then-limit ordering fix is sound** (`hybrid-search.ts:454-524`). The pre-epic code did `index.search(query, limit)` then filtered, under-filling when scope/tier filters removed top-`limit` hits. The fix over-fetches a corpus-bounded candidate set (`candidateLimit = documentCount` whenever `specFolder || db`), filters by deprecated-tier + spec-folder, then `.slice(0, limit)`. Filtering precedes the final limit — correct.
- **Fail-closed scoping** (`:448-451`, `:470-511`): spec-folder requested without a DB returns `[]`; any metadata-resolution error returns `[]`; defense-in-depth null-check on `memoryMetadataMap`. No unscoped leak path found.
- **Param-limit batching** (`:484-497`): metadata resolved in 500-id batches — fixes the prior single `IN (...)` that would throw on corpus-sized candidate sets. 500 < SQLite's variable cap.
- **FTS5 path** (`sqlite-fts.ts:180-202`): filters in WHERE before `ORDER BY ... LIMIT`; weights are numeric constants from `BM25_FTS5_WEIGHTS`; query bound via `MATCH ?`, specFolder via bound params with `ESCAPE '\'`. No injection, correct scoped-then-limit.
- **Warmup finalize** (`bm25-index.ts:776-801`): generation guard invalidates stale batches; the last non-empty batch finalizes via the `else` branch (the explanatory comment matches the drain logic). Lazy `getPackedPosting` promotion + insertion-sorted postings keep `findPackedPostingIndex` binary search valid even when interleaved with live writes. Single-threaded event loop means no mid-loop interleaving. `documentCount` uses live `packedDocuments.size` (not the inflated id array), so the over-fetch cap is correct.
- **Field-weight scoring**: idf ≥ 0 always; denominators > 0; no NaN/negative score path. Weighted-tf-into-saturation vs FTS5 per-column weighting diverge in ranking, but the code only claims "same field-priority intent" — a documented approximation, not a defect.

### Finding

One fresh, in-scope defect the prior passes missed: the packed engine assigns numeric doc IDs by monotonic push (`getPackedNumericId`, `:848-850`) and never recycles freed slots (`removePackedDocument` sets `packedDocIds[numericId] = undefined`, `:959`, with no free-list or compaction — grep confirms no reuse). Every live update flows `syncChangedRows → addDocumentFields → removeDocument + re-add` (`:537-539`, `:743`), which abandons the old slot and pushes a new one. So `packedDocIds` grows monotonically with cumulative write volume between rebuilds — only `clear()`/`rebuildFromDatabase` compacts it. The legacy in-memory engine keyed directly off a string `Map` with no such growth, so this is a regression introduced with the packed engine. It erodes the headline "135 MB bounded" RAM claim under steady-state churn (the bound holds only at fresh warmup). Severity P2: leak is ~one pointer-slot per update, bounded by writes-between-rebuilds, and daemon re-election triggers a rebuild — real but slow and non-blocking.

Core correctness of the packed engine and the scope-then-limit hybrid path holds. Verdict PASS with the P2 noted.

```json
{"seat":"opus-memory-track-002","model":"claude-opus-4-8","angle":"Search resilience — packed BM25 warmup + field weights (claim: 135MB vs 743MB) + hybrid scoped-then-limit ordering.","verdict":"PASS","summary":"Scope-then-limit fix, fail-closed scoping, param-batching, warmup finalize, and FTS5 SQL all correct. One fresh P2: packed numericId slots never recycled — grows under update churn, eroding the bounded-RAM claim.","files_reviewed":[".opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts",".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts",".opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts"],"findings":[{"severity":"P2","dimension":"correctness","title":"Packed BM25 numericId slots never recycled — monotonic packedDocIds growth under update churn erodes the bounded-RAM claim","file":".opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:848","evidence":"getPackedNumericId (848-850) only ever does packedDocIds.push() / length++; removePackedDocument (959) sets packedDocIds[numericId]=undefined but no free-list or compaction exists (grep for reuse/recycle/compact returns nothing). Every live update (syncChangedRows:743 -> addDocumentFields:537-539 -> removeDocument + re-add) abandons the old slot and pushes a new one. Only clear()/rebuildFromDatabase (668) resets the array.","why":"packedDocIds grows monotonically with cumulative write volume between rebuilds rather than tracking live document count. The legacy in-memory engine keyed off a string Map with no such growth, so the packed engine (new this epic) regresses steady-state memory: the '135MB bounded' RAM claim holds only at fresh warmup, not under sustained re-index/update churn.","recommendation":"Recycle freed numericIds via a free-list (push undefined slots onto a stack in removePackedDocument; pop in getPackedNumericId before extending), or document that the RAM bound is warmup-time only and rely on periodic rebuildFromDatabase/daemon re-election to compact. A free-list keeps packedDocIds bounded by live doc count."}]}
```
