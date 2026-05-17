# Iteration 011 — TRACEABILITY (dist-freshness + cross-cutting deep pass)

## P0 Findings

### P0-1: Missing rescue hit-rate observability in stage2-fusion.ts
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- **Lines**: 1376 (retrieval rescue call site)
- **Issue**: The retrieval rescue layer is a default-on critical signal for paraphrase queries, but there is no observability on rescue hit-rate. The function call at line 1376 only logs failure via `console.warn`, with no metrics on how many results were rescued, what signals triggered rescues, or rescue success rate. This makes it impossible to detect if rescue is underperforming or triggering too aggressively.
- **Repro**: 
  1. Search for trigger-rich paraphrase queries (e.g., "checklist verification")
  2. Observe that retrieval rescue layer runs (line 1376)
  3. Check logs - only failure is logged, no success metrics
  4. No structured telemetry on rescue hit-rate, signal distribution, or boost magnitude
- **Recommendation**: Add structured logging via `logger.info` with rescue metrics: count of rescued results, signal type distribution (trigger/sibling/backfill), average boost magnitude, and query fingerprint. Export as telemetry event for monitoring dashboard.

### P0-2: No audit log on reindex completion in reindex.ts
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
- **Lines**: 297-301 (completion transaction)
- **Issue**: Reindex is a destructive operation that swaps embedders for the entire memory_index. The completion path at lines 297-301 only updates database status, with no audit log entry. This makes it impossible to trace when embedder swaps occurred, who initiated them, or recover from accidental swaps. No structured logging records the before/after embedder states, total records processed, or duration.
- **Repro**:
  1. Call `startReindex({ toName: 'jina-code' })` 
  2. Wait for completion (status becomes 'completed')
  3. Check logs - no audit entry for the swap event
  4. Database status is the only record, no external audit trail
- **Recommendation**: Add `logger.info` audit log on completion with: job ID, fromEmbedder, toEmbedder, totalProcessed, durationMs, initiator (if available), and timestamp. Write to both structured logs and a dedicated audit_events table for forensic recovery.

## P1 Findings

### P1-1: Silent catch blocks in reindex.ts hide critical errors
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
- **Lines**: 282-285 (embedding cardinality check), 302-305 (top-level catch)
- **Issue**: The catch block at line 302-305 logs error to database but does not emit to structured logs. The embedding cardinality check at line 282-285 throws but the error message may not reach operators. Silent catches in critical paths (embedder failures) make debugging production issues difficult.
- **Repro**:
  1. Configure an embedder that returns wrong cardinality (malformed adapter)
  2. Run reindex - it fails at line 284
  3. Error is stored in DB but not emitted via logger
  4. Operators must check DB to discover failure
- **Recommendation**: Add `logger.error` in catch block at line 302-305 with job context. Add `logger.warn` for cardinality mismatch at line 284. Ensure all critical path errors emit to both DB status and structured logs.

### P1-2: No structured logging in stage2-fusion.ts - all console.warn
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- **Lines**: 178, 223, 237, 497, 526, 615, 770, 782, 868, 913, 949, 1026, 1069, 1091, 1135, 1155, 1181, 1211, 1222, 1233, 1247, 1266, 1279, 1295, 1336, 1353, 1376, 1399, 1421
- **Issue**: All error paths in stage2-fusion use `console.warn` instead of the structured `logger` from `../utils/logger.js`. This prevents log aggregation, severity filtering, and structured query. The file imports structured logging utilities (via other modules) but does not use them, creating inconsistency with the rest of the codebase (e.g., vector-index-queries.ts uses logger).
- **Repro**:
  1. Grep for `console.warn` in stage2-fusion.ts - 29 matches
  2. Grep for `logger.` in stage2-fusion.ts - 0 matches
  3. Compare to vector-index-queries.ts which uses logger.info/warn
  4. No way to aggregate stage2-fusion errors in centralized logging
- **Recommendation**: Replace all `console.warn` calls with `logger.warn` (or `logger.error` for critical failures). Add structured context (query fingerprint, result count, signal type) to enable log aggregation and alerting.

## P2 Findings

### P2-1: Test failure diagnostics in dist-freshness.vitest.ts are good but no test-time logging
- **File**: `.opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts`
- **Lines**: 53-71 (canonical export tests), 84-104 (global walk tests)
- **Issue**: Test failure messages are comprehensive with actionable instructions (e.g., "run 'npm run build'"), but there is no test-time logging for observability. Tests do not emit structured logs about what they checked, making it hard to debug test infrastructure issues. No logging of which files were scanned, timing data, or cache state.
- **Repro**:
  1. Run dist-freshness tests
  2. Tests pass/fail with clear messages
  3. No test-time logs emitted for debugging
  4. Cannot see scan timing or file counts without adding debug breakpoints
- **Recommendation**: Add optional test-time logging via `console.log` or a test logger to emit: files scanned, timing data, cache hits, and validation summary. Gate behind a debug flag to avoid noise in CI.

### P2-2: Debug-gated logs may hide P0 issues in production
- **File**: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- **Lines**: 176-181 (learned blend weight clamp warning)
- **Issue**: The learned blend weight clamp warning at lines 176-181 is gated behind a `warnedLearnedBlendClamp` flag to prevent duplicate warnings. This means if the clamp condition persists, operators only see the warning once. If the warning is missed (log rotation, monitoring gap), the P0 issue (misconfigured blend weight) becomes invisible.
- **Repro**:
  1. Set `SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT=0.5` (exceeds 0.05 guard)
  2. Run multiple searches - warning appears once at line 178
  3. Subsequent searches emit no warning
  4. If logs rotate, the clamp condition is invisible
- **Recommendation**: Replace one-time flag with rate-limited logging (e.g., once per hour) or emit to a counter metric. Ensure critical configuration issues are continuously visible, not one-time warnings.
