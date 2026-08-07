# Iteration 1: Correctness + Traceability (with Security and Maintainability sweeps)

## Focus
Single-iteration release-readiness audit of spec 027/002/018
(reindex-scan responsiveness and cancellation). Reviewed the three shipped
source changes and their test parity against `spec.md` REQ-001..REQ-004 and
`implementation-summary.md` claims.

Files under review (from `spec.md` §3 "Files to Change"):
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-scan-jobs.vitest.ts`

Also cross-checked: `tests/batch-processor.vitest.ts`, `tests/job-store.vitest.ts`
(test-coverage traceability for the new code paths).

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 6 (4 in-scope + 2 test cross-refs)
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.20

## Findings

### P0, Blocker
- _None._

### P1, Required
- _None._

### P2, Suggestion

- **F001**: New cancellation/early-abort code paths ship without direct unit coverage,
  `.opencode/skills/system-spec-kit/mcp_server/tests/batch-processor.vitest.ts:1` and
  `.opencode/skills/system-spec-kit/mcp_server/tests/job-store.vitest.ts:127`.
  The three core deliverables are exercised only indirectly:
  - `processBatches` `shouldAbort` early-abort (`batch-processor.ts:150`) has **no**
    test in `batch-processor.vitest.ts` (no `shouldAbort` reference anywhere in that
    suite). Existing tests cover batch sizing and normal flow only.
  - `isCancelRequestedFast` / the in-process `cancelledJobIds` Set lifecycle
    (`job-store.ts:75,316-341,369,397-399`) is not tested in `job-store.vitest.ts`;
    that suite tests only the DB-backed `isCancelRequested` (`job-store.vitest.ts:127`).
  - In `handler-memory-index-scan-jobs.vitest.ts:107` the mock maps
    `isCancelRequestedFast` to `cancelRequested`, so even the handler test never
    exercises the real Set semantics (add-on-request, clear-on-terminal).
  Dimension: maintainability. The spec's testing strategy (`plan.md` §5, REQ-004)
  explicitly scoped tests to *no regression of existing suites*, so this is
  consistent with the approved scope and is **advisory, not a scope violation**.
  It is recorded because cancellation correctness is the entire point of the change
  yet the new logic is the one part with zero direct assertions.

- **F002**: `requestCancel` adds to the in-process Set unconditionally, with no
  clear path for cancel-on-terminal/unknown jobs,
  `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:316-325`.
  `requestCancel(jobId)` calls `cancelledJobIds.add(jobId)` before (and regardless of)
  the DB write. The Set is cleared only by `completeJob` (`job-store.ts:369`) and
  `resetRunningJobsForKind` (`job-store.ts:397-399`). If `requestCancel` is invoked
  on a job that has already reached a terminal state (its `completeJob` already ran
  and cleared/never-added the id) or on a non-existent id, the entry is added and
  never removed, so the Set grows by one per such call for the daemon's lifetime.
  In practice cancel is only issued against running jobs, and a daemon restart clears
  all module state, so the leak is bounded and low-impact. Dimension: correctness
  (robustness). Suggested guard: only add to the Set when the durable update reports
  `changes > 0`, or skip the add when `isTerminalJobState(getMaintenanceJob(jobId)?.state)`.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `spec.md:127-138` vs `batch-processor.ts:150`, `job-store.ts:316-341`, `memory-index.ts:1034,1176,1311` | All four REQs resolve to shipped behavior (detail below) |
| checklist_evidence | n/a | hard | Level 1 folder, no `checklist.md` present | Exempt per Level 1; not a gap |
| feature_catalog_code | n/a | advisory | No feature-catalog claim targets this fix | Overlay does not apply |

### spec_code per-REQ trace
- **REQ-001** (yield in all-rows tail loops): PASS. Metadata-edge sweep yields a
  macrotask every 200 rows (`memory-index.ts:1176-1181`); causal-chain loop yields
  every 50 folders (`memory-index.ts:1311-1316`). Both use `setImmediate` (macrotask),
  matching the acceptance criterion.
- **REQ-002** (cancelled run stops promptly): PASS. `processBatches` breaks on
  `shouldAbort` (`batch-processor.ts:150`); both tail loops return
  `cancelledScanEnvelope(scanKey)` on `isCancelled` (`memory-index.ts:1177-1178,
  1312-1313`); post-batch and post-promotion cancel checks at `:1206-1207`.
- **REQ-003** (cancel deliverable without DB contention): PASS. `requestCancel` sets
  the in-process flag first (`job-store.ts:317-319`); `isCancelRequestedFast` reads the
  Set with no SQLite query (`job-store.ts:339-341`); background dispatch routes
  `isCancelled` through the fast checker (`memory-index.ts:1506`).
- **REQ-004** (no regression in job/scan test surface): UNVERIFIED in this lineage —
  suite execution requires interactive approval not available to this autonomous
  fan-out agent. The implementation-summary records "68 tests pass" and the commit
  message repeats it (`f1dbb676f2`); the test mock parity required by the change is
  present (`handler-memory-index-scan-jobs.vitest.ts:107`). Operator-verifiable.

## Assessment
- New findings ratio: 0.20 (2 P2 advisories; both below the P1 bar).
- Dimensions addressed: correctness (yield placement, transaction safety, Set
  lifecycle), security (no new input/trust surface introduced), traceability
  (REQ→code), maintainability (test coverage of new paths).
- Novelty justification: single-iteration audit; the spec is small (Level 1, 3 source
  files). Correctness of the concurrency change is the dominant risk and was confirmed:
  every yield lands at a loop-iteration boundary after the per-row transaction commits
  (`memory-index.ts:1175` comment matches the code), so no yield occurs inside an open
  better-sqlite3 transaction — the one stated correctness risk (`spec.md:157`) is
  correctly mitigated.

## Ruled Out
- "Yield inside an open transaction corrupts the shared connection": ruled out. The
  metadata-edge yield (`memory-index.ts:1176-1181`) precedes the per-row
  `promoteMetadataEdges` call and is not wrapped in any caller-side transaction; the
  causal-chain yield (`:1311-1316`) precedes `selectDocIds.all(folder)` and
  `createSpecDocumentChain`. Both sit between self-contained units.
- "Early-abort drops successfully-indexed work / loses mtime safety": ruled out.
  After `shouldAbort` breaks, partial `batchResults` are still folded into `results`
  and `batchUpdateMtimes` runs only over `successfullyIndexedFiles`
  (`memory-index.ts:1161-1164`), preserving the documented mtime-only-after-success
  invariant; the post-loop cancel check at `:1206-1207` returns the cancelled envelope.
- "Security regression": ruled out. The change adds no external input, no path or
  credential handling, and no new IPC surface; `isCancelRequestedFast` reads an
  in-process Set keyed by internally-generated job ids.

## Dead Ends
- Attempted live suite execution (`vitest run` on the five touched suites) to confirm
  the 68-test claim; the sandbox requires interactive approval for `npx vitest`, which
  is unavailable to this autonomous lineage. Deferred to operator (REQ-004 above).

## Recommended Next Focus
None required for this fix at the current scope — the in-scope event-loop defect is
correctly resolved. Two follow-ups for the packet owner: (1) add direct tests for
`shouldAbort` and the `isCancelRequestedFast` Set lifecycle (F001); (2) optionally
guard `requestCancel` against terminal/unknown-job Set growth (F002). The documented
launcher lease-heartbeat re-election remains the real blocker to a completed full
scan and is correctly out of scope here.

Review verdict: PASS
