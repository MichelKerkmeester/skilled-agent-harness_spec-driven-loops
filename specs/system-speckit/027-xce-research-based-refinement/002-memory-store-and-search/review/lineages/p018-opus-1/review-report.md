# Review Report — 018-reindex-scan-responsiveness-and-cancellation (lineage p018-opus-1)

Executor: cli-claude-code / claude-opus-4-8 · Mode: review · Iterations: 1 (maxIterations=1) · Resource map: not present

---

## 1. Executive Summary

**Verdict: PASS** (`hasAdvisories: true`)

- Active findings: **P0 = 0, P1 = 0, P2 = 1**
- Scope: the Level 1 fix making the background `memory_index_scan` cooperative and cancellable — tail-loop event-loop yields, a `processBatches` early-abort, and an in-process cancel flag. 4 files, +35/-3 LOC (commit `f1dbb676f2`).
- Dimension coverage: 4/4 (correctness, security, traceability, maintainability) in a single comprehensive pass.
- Convergence: maxIterations=1 reached; no P0/P1 found; all required gates green. Release readiness state advanced to `converged`.

The change is well-scoped, faithful to the spec, and correct on its central claims: yields are real macrotask yields placed strictly between committed per-row transactions, cancellation is delivered via an in-memory flag that avoids the contended SQLite connection, and the early-abort prevents draining no-op batches. One advisory P2 (a bounded in-process Set-cleanup gap with an over-stated invariant comment) is the only finding.

---

## 2. Planning Trigger

PASS with advisories routes to **`/create:changelog`**, not remediation planning. The single P2 (F001) is advisory and non-blocking; fold it into a follow-on hardening pass or address it alongside the already-documented launcher lease-heartbeat re-election follow-on. No `/speckit:plan` remediation cycle is required to ship this packet.

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | First/Last | Status |
|----|-----|-----|-------|----------|-----------|--------|
| F001 | P2 | maintainability | `cancelledJobIds` Set leaks one entry on the `failed`-via-`setJobState` terminal path; the cleanup-invariant comment is inaccurate | `lib/ops/job-store.ts:69-75`, add at `:319`, deletes at `:369`/`:398`; failed terminal at `handlers/memory-index.ts:1525`,`1532` | 1/1 | active |

**F001 detail.** `requestCancel` adds the job id to the module `cancelledJobIds` Set (`job-store.ts:319`). The Set is cleared only in `completeJob` (`:369`) and `resetRunningJobsForKind` (`:398`). The background scan dispatch finalizes a failed run through `setJobState(jobId, 'failed')` (`memory-index.ts:1525` error-envelope path, `1532` thrown-error catch path), neither of which clears the Set. A cancel-requested scan that then terminates as `failed` (before its cancel short-circuit returns the cancelled envelope) leaves the job-id string in the Set for the rest of the daemon process lifetime. The comment at `job-store.ts:69-75` claims entries "are cleared when a job reaches a terminal state so the Set cannot grow without bound" — `failed` is a terminal state that does not clear it, so the stated invariant does not hold on that path. Impact is low (one short string per rare cancel+in-process-fail interleaving, freed on the documented re-election process restart) and there is no functional cancellation defect.

---

## 4. Remediation Workstreams

**Lane A — job-store cleanup hardening (advisory, low effort).** Make Set cleanup terminal-complete: either clear `cancelledJobIds` inside `setJobState` whenever `nextState` is terminal (`complete`/`failed`/`cancelled`), or add `cancelledJobIds.delete(jobId)` to the two `failed` paths in the dispatch; alternatively soften the `job-store.ts:69-75` comment to match actual behavior. Constituent finding: F001. Order: standalone, no dependencies.

---

## 5. Spec Seed

No spec change required for PASS. Optional addendum for a follow-on hardening packet:

> The in-process cancel mirror MUST be cleared on every terminal job transition (`complete`, `failed`, `cancelled`), not only via `completeJob`/`resetRunningJobsForKind`, so the in-memory Set cannot retain ids for jobs that ended through `setJobState`.

---

## 6. Plan Seed

1. Add a terminal-cleanup guarantee for `cancelledJobIds` (clear on any terminal `setJobState`, or in the two dispatch `failed` paths). Target: `lib/ops/job-store.ts`, `handlers/memory-index.ts`. (F001)
2. Add/extend a job-store unit test asserting the Set is empty after a cancel-then-`failed` transition. Target: `tests/job-store.vitest.ts`.

---

## 7. Traceability Status

| Level | Protocol | Status | Gate | Notes |
|-------|----------|--------|------|-------|
| Core | spec_code | **pass** | hard | REQ-001 → `memory-index.ts:1176` (200-row yield) + `:1311` (50-folder yield); REQ-002 → `batch-processor.ts:150` (`shouldAbort` break) + cancelled-envelope returns at `:1178/1207/1313`; REQ-003 → `job-store.ts:319/340` (Set + `isCancelRequestedFast`), routed at `:1506`. All 4 spec "Files to Change" match the diff. |
| Core | checklist_evidence | **N/A** | hard | Level 1 folder, no `checklist.md` (exempt). |
| Overlay | feature_catalog_code | **N/A** | advisory | Internal daemon fix, no feature-catalog claim. |

**REQ-004 caveat:** the "68 tests pass" claim (SC-001) is recorded in `implementation-summary.md` and commit `f1dbb676f2` but was **not independently re-run in this review session** — `npx vitest run` was blocked by the Bash approval sandbox. Treated as an evidence-backed but unverified claim, not a gate failure.

---

## 8. Deferred Items

- **F001** (P2, advisory) — `cancelledJobIds` terminal-cleanup gap. Non-blocking; defer to a hardening pass.
- **REQ-004 re-verification** — re-run the 5 touched-surface suites in an environment where test execution is permitted, to independently confirm the 68-test pass claim.
- **Out of scope (carried by the spec):** the launcher lease-heartbeat / daemon re-election that recycles the daemon mid-scan and marks the run `failed`. Documented follow-on; not a finding against this packet.

---

## 9. Audit Appendix

### Coverage

| Dimension | Covered | Verdict |
|-----------|---------|---------|
| Correctness | yes | PASS |
| Security | yes | PASS |
| Traceability | yes | PASS |
| Maintainability | yes | PASS (advisory) |

### File coverage matrix

| File | Reviewed | Key lines |
|------|----------|-----------|
| handlers/memory-index.ts | yes | 1034, 1176-1181, 1206-1208, 1307-1316, 1506, 1521-1532 |
| utils/batch-processor.ts | yes | 11-18 (`shouldAbort` on RetryOptions), 150 (loop break) |
| lib/ops/job-store.ts | yes | 69-75, 316-340, 366-369, 394-398 |
| tests/handler-memory-index-scan-jobs.vitest.ts | yes | mock parity for `isCancelRequestedFast` |

### Convergence replay

- Recomputed from JSONL: 1 iteration, newFindingsRatio 0.20, P0=0/P1=0/P2=1, dimensionCoverage=1.0.
- Stop decision: maxIterations=1 reached after a full-dimension pass; legal-stop gates (convergence, dimension coverage, P0 resolution, evidence density, claim adjudication) pass — no new P0/P1 means no adjudication packet was required. Replay agrees with the recorded `synthesis_complete` event (verdict PASS).

### Verdict mapping

PASS = no active P0 and no active P1. P2 advisories present (1) → `hasAdvisories: true`. Verdict lock N/A (no P0).

---

Review verdict: PASS
