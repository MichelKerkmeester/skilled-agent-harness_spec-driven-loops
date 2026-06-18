# Iteration 1: Full-spectrum review (correctness, security, traceability, maintainability)

## Focus
Single-iteration review (maxIterations=1) of the 018 reindex-scan responsiveness + cancellability fix. All four dimensions covered in one pass over the actual diff (`f1dbb676f2`) and current source state. Scope per spec: the event-loop starvation defect inside `runIndexScan`, the `processBatches` early-abort, and the in-process cancel mirror. The launcher lease-heartbeat re-election is explicitly out of scope (separate supervision subsystem, documented follow-on).

Files under review:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` (tail loops, processBatches call site, background dispatch hook)
- `.opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts` (`shouldAbort` on `processBatches`)
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts` (in-process cancel Set, `isCancelRequestedFast`, terminal cleanup)
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-scan-jobs.vitest.ts` (mock parity)

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.18

## Findings

### P0, Blocker
None.

### P1, Required
None.

### P2, Suggestion

- **F001**: New cancellation code paths have no direct test coverage, `.opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts:18` and `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:335-338`. The two behavioral primitives this phase introduces — `processBatches`'s `shouldAbort` early-abort and the real `isCancelRequestedFast` (in-process `Set` read + terminal cleanup) — are exercised by no test. Static evidence: a `grep` for `shouldAbort|abort|cancel` over `tests/batch-processor.vitest.ts` returns zero hits, so the early-abort break at `batch-processor.ts:150` is untested; the only test reference to `isCancelRequestedFast` is a `vi.fn` mock at `tests/handler-memory-index-scan-jobs.vitest.ts:107` that delegates to the same `cancelRequested` flag, so the real Set semantics (add-on-request, delete-on-terminal in `completeJob`/`resetRunningJobsForKind`) are never validated. REQ-004 ("no regression in the job/scan test surface") is satisfied — the 68-test suite still passes per the commit — but it is a no-regression gate, not new-path coverage. A future refactor of either primitive would regress silently. This is an advisory test-debt note, not a spec violation: the spec scoped testing to no-regression (REQ-004) and verified the fix by deployment (SC-002). [dimension: maintainability]

- **F002**: `requestCancel` can leak one `cancelledJobIds` entry on a post-terminal race, contradicting the "cannot grow without bound" comment, `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:317-320` (add) vs `:369` and `:397-399` (delete). The Set is cleared only inside `completeJob` and `resetRunningJobsForKind`. If a scan finishes naturally (`completeJob` runs and finds nothing to delete) and a cancel IPC then arrives late, `requestCancel` unconditionally does `cancelledJobIds.add(jobId)` for an already-terminal job; no later terminal transition runs for that id, so the entry is never cleared. The in-code comment at `job-store.ts:69-73` asserts entries "are cleared when a job reaches a terminal state so the Set cannot grow without bound" — that invariant holds for the normal lifecycle but not for a cancel-after-terminal race. Impact is negligible in practice (one small string per racing misuse, single-daemon process), so P2. A guard (`add` only when the job is non-terminal, or prune in `requestCancel`) would make the comment's claim literally true. [dimension: correctness / maintainability]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | spec.md:127-137 REQ-001..REQ-004 vs memory-index.ts:1176-1181,1311-1316 / batch-processor.ts:150 / job-store.ts:315-338 | Every normative REQ resolves to shipped code. REQ-001 yields confirmed at the two tail loops (every 200 rows / 50 folders); REQ-002 early-abort + cancelled-envelope returns confirmed; REQ-003 in-process flag + DB-free read confirmed. |
| checklist_evidence | n/a | hard | folder has no checklist.md (Level 1) | Level 1 packet, no checklist.md required; tasks.md T001-T008 all map to shipped code/verification. |
| feature_catalog_code | n/a | advisory | no feature-catalog entry for this incident-fix packet | Applies by target type but no catalog claim exists for this packet. |
| playbook_capability | n/a | advisory | no playbook scenario for this packet | Applies by target type but no playbook references this fix. |

## Assessment
- New findings ratio: 0.18 (P2-only; two advisory findings, weight 2.0)
- Dimensions addressed: correctness (no defects in the yield/abort/cancel logic — yields verified between transactions, not inside; envelope returns correct), security (no attack surface: internal daemon job control, no untrusted input, no credentials, no path/schema/env handling introduced), traceability (spec/plan/tasks/impl-summary all align with the actual diff; completion claims are honest and openly scope-bound), maintainability (two P2 advisories above)
- Novelty justification: single-pass full-spectrum review; all novelty is first-iteration discovery.

### Correctness verification detail (confirmed, not inferred)
- `processBatches` signature is `(items, processor, batchSize, delayMs, retryOptions)` (`batch-processor.ts:123-128`); the call site `memory-index.ts:1034` passes `scanBatchSize, undefined, { shouldAbort }`, so `delayMs` correctly falls back to `BATCH_DELAY_MS` via the JS default-param rule and the early-abort skips the inter-batch delay at `batch-processor.ts:172`. Correct.
- `shouldAbort` fires only when `ctx.isCancelled?.()` is true, so early-abort never triggers on a non-cancelled run. The break at `batch-processor.ts:150` returns partial in-order `results`, and the result-tally loop indexes `filesToIndex[i]` by position, so no index drift. On cancel, the partial result is superseded by `cancelledScanEnvelope(scanKey)` returned from the metadata-edge loop (`memory-index.ts:1178`), the post-loop check (`:1206`), or the causal-chain loop (`:1313`).
- Tail-loop yields land at iteration boundaries before the per-row `promoteMetadataEdges` transaction (`memory-index.ts:1176-1186`) and before the per-folder DB work (`:1311-1317`), preserving atomicity on the single shared better-sqlite3 connection — matching the spec's stated safety invariant (spec.md:157).
- `isCancelRequestedFast` is allocation/IO-free (`job-store.ts:335-338`, `Set.has`); the background dispatch routes `isCancelled` through it (`memory-index.ts:1444`); the durable `cancel_requested` column still backs status/recovery via `isCancelRequested` (`job-store.ts:329-333`). The bare `isCancelRequested` import was correctly dropped from the handler (grep for `\bisCancelRequested\b` in handler returns zero).

### Traceability note (could not independently re-run)
SC-001 / REQ-004 assert "68 tests pass across batch-processor, job-store, job-queue, job-queue-state-edge, handler-memory-index-scan-jobs." This review could not re-run the suite (`npx`/`vitest` are blocked in this sandboxed review environment). The claim is asserted by commit `f1dbb676f2` and implementation-summary.md:89, and the mock-parity change required to keep the suite green is present at `tests/handler-memory-index-scan-jobs.vitest.ts:107`. No evidence contradicts the claim; it is recorded as asserted-not-independently-verified rather than as a finding.

## Ruled Out
- "Index drift after early-abort": ruled out — partial `results` are in batch order and tallied via positional `filesToIndex[i]`; cancelled runs return the envelope, discarding the partial tally. Evidence: `memory-index.ts:1036-1038`, `:1178`.
- "Yield inside an open transaction corrupts the shared connection": ruled out — yields are at loop-iteration boundaries before `promoteMetadataEdges` / per-folder work, never inside. Evidence: `memory-index.ts:1176-1186`, `:1311-1317`.
- "Security exposure": ruled out — no untrusted input, credentials, path traversal, env precedence, or schema boundary is touched; the change is internal daemon job-control plumbing.

## Dead Ends
- Attempting to run the touched-surface vitest suites: `npx vitest` is sandbox-blocked; pivoted to static test-coverage analysis, which itself surfaced F001.

## Recommended Next Focus
None within scope — coverage is complete at maxIterations=1. If a follow-on hardening packet is opened: (1) add a `processBatches` test asserting `shouldAbort` breaks the loop and skips remaining batches + delays; (2) add a `job-store` test for the `isCancelRequestedFast` Set lifecycle (add on `requestCancel`, clear on `completeJob`/`resetRunningJobsForKind`); (3) guard `requestCancel` against the post-terminal add to make the no-unbounded-growth comment literally true. All three are P2 advisories, not blockers.

Review verdict: PASS
