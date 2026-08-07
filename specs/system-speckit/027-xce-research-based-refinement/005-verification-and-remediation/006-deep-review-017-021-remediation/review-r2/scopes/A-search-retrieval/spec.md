# Audit Scope — Search & Retrieval Subsystem

## Purpose
Independent gpt-5.5 deep-review **audit** of the search/retrieval code of the system-spec-kit MCP server. This is a REVIEW-SCOPE target — there is NO new implementation to verify. Audit the shipped code below for real defects and report P0/P1/P2 findings with `file:line` evidence. Do not invent findings; a clean PASS is a valid outcome.

## Code under review
All paths under `.opencode/skills/system-spec-kit/mcp_server/`:
- `lib/search/pipeline/stage1-*.ts`, `lib/search/pipeline/stage2-fusion.ts` — candidate generation + post-fusion scoring signals
- `lib/search/confidence-scoring.ts`, `lib/search/confidence-calibration.ts`, `lib/search/recovery-payload.ts` — result confidence, isotonic/PAV calibration, recovery payloads
- `lib/search/trigger-embedding-backfill.ts` — trigger-phrase embedding backfill
- BM25 field weights, hybrid search scope-then-limit, vector read-path resilience, retrieval gating & recall recovery (search/retrieval modules under `lib/search/` and `lib/`)
- the search/query handlers under `handlers/` that call into `lib/search`

## Review dimensions
correctness, security, performance, concurrency/cancellation, maintainability, and spec-vs-code drift. Emphasize numeric correctness (weight sums, calibration monotonicity, score normalization on the real 0..1 signal), cross-module seams, and any unbounded/synchronous work on the read path.

## Notes
Round-1 already audited the 017-021 fixes (cancel-delay, calibration PAV pooling, cache mtime invalidation, confidence 3-factor weights). This round BROADENS to the whole search/retrieval surface — focus on code those fixes did not directly touch.

## If MCP tools hang or error
The `mk-spec-memory` / `mk-code-index` daemons can flap. NEVER block this review on a wedged MCP call. If an `mcp__mk_spec_memory__*` or `mcp__mk_code_index__*` call hangs or errors, immediately fall back — use plain Grep/Read for the code, or the warm-daemon CLI front doors: `node .opencode/bin/spec-memory.cjs <tool> --json '<args>' --format json --timeout-ms 5000` and `node .opencode/bin/code-index.cjs <tool> --format json --timeout-ms 5000 --warm-only`. This is a code audit — direct Grep/Read of the cited files is sufficient on its own.
