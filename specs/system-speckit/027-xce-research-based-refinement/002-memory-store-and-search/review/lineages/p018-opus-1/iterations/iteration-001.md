# Iteration 1: Full-dimension review of reindex-scan responsiveness + cancellation

## Focus

All four dimensions (correctness, security, traceability, maintainability) in a single comprehensive pass — the change is small and well-bounded (4 files, +35/-3 LOC; commit `f1dbb676f2`), and the fan-out lineage runs at maxIterations=1.

Files reviewed:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-scan-jobs.vitest.ts`

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.20

## Findings

### P0, Blocker

None.

### P1, Required

None.

### P2, Suggestion

- **F001**: In-process `cancelledJobIds` Set leaks an entry on the `failed`-via-`setJobState` terminal path, and the explanatory comment overstates the cleanup invariant — `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:69-75`.

  The Set is added to in `requestCancel` (`job-store.ts:319`) and deleted only in `completeJob` (`job-store.ts:369`) and `resetRunningJobsForKind` (`job-store.ts:398`). The background scan dispatch terminates a failed run via `setJobState(jobId, 'failed')` at `handlers/memory-index.ts:1525` (error-envelope path) and `1532` (thrown-error catch path); neither clears the Set. So if a scan is cancel-requested and then terminates through the `failed` path before its cancel short-circuit returns the cancelled envelope, the job-id string stays in the Set for the remainder of the daemon process lifetime.

  The comment at `job-store.ts:69-75` asserts entries "are cleared when a job reaches a terminal state so the Set cannot grow without bound across many jobs" — but `failed` is a terminal state that does not clear it, so the stated invariant does not hold on that path.

  Impact is low: each leak is one short job-id string, bounded by the rare (cancel + in-process-fail) interleaving per daemon lifetime, and the Set dies with the process on the documented re-election restart. No crash, no data corruption, no functional cancellation defect (`requestCancel` still adds the entry; only post-fail cleanup is missed). Recommended fix: clear `cancelledJobIds` on every terminal transition (e.g., in `setJobState` when `nextState` is terminal, or add `cancelledJobIds.delete(jobId)` to the two `failed` paths), or soften the comment to match actual behavior.

  - Dimension: maintainability (with a minor correctness edge)
  - Category: maintainability
  - finding_class: bounded-resource-leak / inaccurate-invariant-comment
  - content_hash: f001-canceljobids-failed-terminal-no-clear

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | memory-index.ts:1176, 1311; batch-processor.ts:150; job-store.ts:319,340 | REQ-001 (yield every 200 rows / 50 folders), REQ-002 (shouldAbort break + cancelled envelope), REQ-003 (Set + isCancelRequestedFast) all resolve to shipped code |
| checklist_evidence | N/A | hard | — | Level 1 folder, no checklist.md (exempt) |
| feature_catalog_code | N/A | advisory | — | Internal daemon fix, no catalog claim |

### Requirement → code traceability

- **REQ-001** (event-loop yields in tail loops): `memory-index.ts:1176` (`++promoterYieldCount % 200 === 0` → `setImmediate`), `memory-index.ts:1311` (`++chainYieldCount % 50 === 0` → `setImmediate`). PASS.
- **REQ-002** (cancelled run stops promptly): `batch-processor.ts:150` (`if (retryOptions.shouldAbort?.()) break;`), wired at `memory-index.ts:1034`; tail loops return `cancelledScanEnvelope` on `isCancelled` at `1178`/`1207`/`1313`. PASS.
- **REQ-003** (deliverable without DB contention): `job-store.ts:319` (`cancelledJobIds.add` first in `requestCancel`), `job-store.ts:338-340` (`isCancelRequestedFast` reads only the Set), routed at `memory-index.ts:1506`. PASS.
- **REQ-004** (no test-surface regression): implementation-summary.md and commit `f1dbb676f2` state 68 tests pass across batch-processor, job-store, job-queue, job-queue-state-edge, handler-memory-index-scan-jobs. NOT independently re-run this session — `npx vitest run ...` was blocked by the Bash approval sandbox. Documented claim, evidence-backed but unverified here.
- **Files to Change** (spec §3): all 4 listed files match the commit diff exactly. PASS.

## Assessment

- New findings ratio: 0.20 (one P2 across a small surface)
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: single comprehensive pass; no prior iterations to dedup against.

### Correctness notes (verified, no finding)

- Yields use `await new Promise(resolve => setImmediate(resolve))` — a genuine macrotask yield, not a microtask drain, so IPC callbacks are actually serviced. Matches the in-tree precedent `lib/embedders/reindex.ts`.
- Yields are placed at loop-iteration boundaries, after the per-row `promoteMetadataEdges` / per-folder `createSpecDocumentChain` work commits — never inside an open transaction (spec risk R2 mitigation holds).
- `processBatches` early-abort returns partial `batchResults`; the post-loop processing at `memory-index.ts:1036` indexes by positional `filesToIndex[i]`, so order integrity is preserved, and a guaranteed cancel check at `1206` returns the cancelled envelope before any post-processing. Safe.
- The yield counter increments on `continue`-skipped (failed / id-less) rows too, so the yield cadence is per-iteration not per-promotion — intentional and harmless.

### Security notes (verified, no finding)

- The change adds no input parsing, no new external surface, no credential or path handling. `setImmediate` and an in-memory `Set<string>` of internally-generated job ids carry no injection or exposure risk.

## Ruled Out

- Transaction-corruption from mid-scan yields: ruled out — yields sit only between committed per-row transactions (`memory-index.ts:1176-1203`, `1307-1331`).
- Cancellation not landing: ruled out — `requestCancel` sets the in-memory Set before the contended DB write, and the hot path reads the Set (`job-store.ts:319`, `340`).

## Dead Ends

- None.

## Recommended Next Focus

Loop complete at maxIterations=1. F001 is an advisory P2 — fold into a follow-on hardening pass or address alongside the documented lease-heartbeat re-election follow-on. No blocking work.

Review verdict: PASS
