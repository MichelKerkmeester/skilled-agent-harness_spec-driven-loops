# Review Report — 027/002/018 reindex-scan responsiveness and cancellation

Fan-out lineage: **p018-opus-2** · Executor: cli-claude-code / claude-opus-4-8 · Iterations: 1 (maxIterations) · Mode: review

---

## 1. Executive Summary

**Verdict: PASS** (`hasAdvisories: true`)

The event-loop responsiveness + cancellability fix for the background
`memory_index_scan` is correct and release-ready at its declared scope. All three
shipped changes do what the spec claims and the single stated correctness risk
(yielding inside an open better-sqlite3 transaction) is correctly avoided.

- Active findings: **P0 = 0, P1 = 0, P2 = 2** (both advisory).
- Scope reviewed: `handlers/memory-index.ts`, `utils/batch-processor.ts`,
  `lib/ops/job-store.ts`, and the touched test mock — the exact "Files to Change"
  set in `spec.md` §3 — plus two unit suites cross-referenced for test traceability.
- Dimension coverage: 4/4 (correctness, security, traceability, maintainability).
- Convergence: STOP at maxIterations (1) with evidence/scope/coverage gates green and
  no P0/P1 outstanding.

One claim could not be executed in this autonomous lineage: REQ-004 ("68 touched-surface
tests pass"). `npx vitest` requires interactive approval unavailable here, so the
suite-green claim from `implementation-summary.md` / commit `f1dbb676f2` is recorded as
**operator-verifiable**, not independently confirmed. It does not gate the verdict
because no P0/P1 correctness defect was found by static review.

---

## 2. Planning Trigger

PASS routes to **`/create:changelog`**, not remediation planning. The in-scope defect
is resolved; the two P2 advisories are quality follow-ups, not blockers. The documented
out-of-scope follow-on (launcher lease-heartbeat re-election) is the correct subject of
a *separate* spec packet and is not triggered by this review.

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | First/Last | Status |
|----|-----|-----|-------|----------|-----------|--------|
| F001 | P2 | maintainability | New cancellation/early-abort code paths ship without direct unit coverage | `tests/batch-processor.vitest.ts` (no `shouldAbort` test); `tests/job-store.vitest.ts:127` (only DB-path cancel tested); `tests/handler-memory-index-scan-jobs.vitest.ts:107` (mock maps fast→DB flag) | 1/1 | active |
| F002 | P2 | correctness | `requestCancel` adds to in-process Set unconditionally; terminal/unknown-job entries never cleared | `lib/ops/job-store.ts:316-325` (add before/regardless of DB write), cleared only at `:369` / `:397-399` | 1/1 | active |

Both findings are P2 advisories; neither is a confirmed active P0/P1.

---

## 4. Remediation Workstreams

**Lane A — Test the new cancellation paths (F001)** _(optional, owner-scheduled)_
1. Add a `batch-processor.vitest.ts` case asserting `processBatches` stops early when
   `shouldAbort` returns true (fewer batches processed, no inter-batch delay after abort).
2. Add a `job-store.vitest.ts` case for the real `isCancelRequestedFast` Set:
   true after `requestCancel`, false after `completeJob`/`resetRunningJobsForKind`.

**Lane B — Harden `requestCancel` Set growth (F002)** _(optional, low priority)_
3. Gate `cancelledJobIds.add(jobId)` on a non-terminal/extant job, or only add when the
   durable `UPDATE ... cancel_requested` reports `changes > 0`.

Lanes A and B are independent and can ship in either order; both are non-blocking.

---

## 5. Spec Seed

No spec amendment required for this packet — the shipped code matches `spec.md`. If the
owner adopts Lane A, append to `spec.md` §4 a P2/REQ-005 "New cancellation paths
(`shouldAbort`, `isCancelRequestedFast`) carry direct unit coverage" with acceptance
"a test exercises early-abort and the in-process Set lifecycle." This is additive and
does not alter the existing REQ set.

---

## 6. Plan Seed

- T-A1: `tests/batch-processor.vitest.ts` — early-abort test for `processBatches` `shouldAbort` (F001).
- T-A2: `tests/job-store.vitest.ts` — `isCancelRequestedFast` Set add/clear lifecycle test (F001).
- T-B1: `lib/ops/job-store.ts` `requestCancel` — guard the Set add against terminal/unknown jobs (F002).
- T-V1: re-run the 5 touched suites; confirm count and green (also discharges the
  REQ-004 verification this lineage could not execute).

---

## 7. Traceability Status

| Protocol | Level | Status | Gate | Notes |
|----------|-------|--------|------|-------|
| spec_code | core | **pass** | hard | REQ-001 (`memory-index.ts:1176-1181, 1311-1316`), REQ-002 (`batch-processor.ts:150`; `memory-index.ts:1177-1178,1206-1207,1312-1313`), REQ-003 (`job-store.ts:317-319,339-341`; `memory-index.ts:1506`) all resolve to shipped behavior. REQ-004 operator-verifiable. |
| checklist_evidence | core | **n/a** | hard | Level 1 folder, no `checklist.md`. Exempt, not a gap. |
| feature_catalog_code | overlay | **n/a** | advisory | No feature-catalog claim targets this fix. |

Unresolved gaps: none at the hard-gate level. REQ-004 suite execution is the only
open verification item, and it is environmental (autonomous-lineage approval), not a
code defect.

---

## 8. Deferred Items

- **F001** (P2): direct unit coverage for the new cancellation/early-abort paths —
  deferred to owner; consistent with the spec's no-regression-only test strategy.
- **F002** (P2): `requestCancel` Set-growth guard — deferred; bounded and low-impact
  (cleared on terminal; full reset on daemon restart).
- **REQ-004 verification**: re-run the 5 touched suites in an environment that permits
  test execution to independently confirm the "68 tests pass" claim.
- **Out-of-scope follow-on (not a finding)**: launcher lease-heartbeat re-election
  recycles the daemon mid-scan and is the real blocker to a *completed* full force scan.
  Correctly excluded from this packet; belongs in a separate supervision-subsystem spec.

---

## 9. Audit Appendix

**Iteration table**
| Iter | Focus | Dims | Files | newFindingsRatio | P0/P1/P2 | Status |
|------|-------|------|-------|------------------|----------|--------|
| 1 | correctness + traceability (+ security, maintainability) | 4/4 | 6 | 0.20 | 0/0/2 | complete |

**Convergence replay**: Recomputed from JSONL — single iteration, newFindingsRatio 0.20,
dimension coverage 4/4, no P0 override active, no required protocol failing. Recorded
synthesis stop reason ("maxIterations reached; no P0/P1; all dimensions covered") agrees
with the replay. Replay: PASS.

**Quality gates**: Evidence gate — every active finding carries `file:line` evidence
(PASS). Scope gate — conclusions stay within the four in-scope files plus declared test
cross-refs (PASS). Coverage gate — 4/4 dimensions + required core protocols covered or
exempt (PASS). All gates green; verdict not forced to FAIL.

**Verification note (legibility)**: REQ-001/002/003 are *confirmed* against cited code.
REQ-004 (suite green) is *inferred* from the implementation-summary/commit and was not
executed in this lineage — the single claim most likely to need independent confirmation.
No P0 finding exists, so no adversarial-replay downgrades were required.

**Dimension breakdown**: correctness — transaction-boundary yield placement and Set
lifecycle confirmed correct; security — no new surface; traceability — REQ→code mapped;
maintainability — new logic lacks direct tests (F001).

Review verdict: PASS
