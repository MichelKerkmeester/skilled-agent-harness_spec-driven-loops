---
title: "Tasks: Consolidation Cycle Hardening"
description: "Two consolidation.ts fixes (lock-ordering, handle-consistency), each test-gated, on the default-ON consolidation cycle."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/007-consolidation-hardening"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded consolidation-hardening task list"
    next_safe_action: "Run C7-S1 baseline, then C7-T001 lock-ordering"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-consolidation-hardening-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Consolidation Cycle Hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] C7-S1 Capture the consolidation vitest baseline (pass/fail counts). Evidence: baseline 245/246 across n3lite-consolidation + 4 causal-edges suites; 1 pre-existing failure (`causal-edges.vitest.ts:633` T045 — `insertEdgesBatch` now returns `skippedManual`, out of scope, untouched).
- [x] C7-S2 Locate the current `BEGIN IMMEDIATE` + read-only scan and the threaded-vs-global handle sites. Evidence: R1 = `runConsolidationCycleIfEnabled` `BEGIN IMMEDIATE` then `runConsolidationCycle`→`scanContradictions` (consolidation.ts); R2 = `detectStaleEdges(_database)` ignored its param while `getStaleEdges` uses the module-global. Registry IDs `opus-memory-daemon-i2-f3` (R1) and `-f4` (R2). Single-connection invariant confirmed: runtime caller `handlers/save/response-builder.ts:852` passes `requireDb()` (= `vectorIndex.getDb()`), the same handle `causalEdges.init()` binds.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] C7-T001 R1 lock-ordering: hoisted the read-only scan/cluster/bounds before `BEGIN IMMEDIATE`; re-check the cadence guard after acquiring the lock; writes (Hebbian + `last_run_at`) stay inside the immediate-lock transaction. Evidence: extracted `scanReadOnly()` helper; `runConsolidationCycleIfEnabled` now pre-checks cadence + runs `scanReadOnly` lock-free, then `BEGIN IMMEDIATE` → re-check cadence → `runHebbianCycle` → `last_run_at` → COMMIT (consolidation.ts). Return shape `{contradictions, hebbian, stale, edgeBounds}` and decision semantics preserved.
- [x] C7-T002 R2 handle-consistency: dropped the unused `database` param from `detectStaleEdges()` (smallest safe diff). Evidence: it already delegated to `getStaleEdges()` on the module-global; `checkEdgeBounds`/`scanContradictions`/`runHebbianCycle` retain their threaded `database`, which IS the single shared connection (invariant from C7-S2). No `causal-edges.ts` change needed — its module-global-only design already guarantees one connection; threading handles into the whole edge API was the larger alternative R2 explicitly lists.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] C7-V1 Concurrency test: a concurrent write is not blocked during the scan (fails on old code, passes on fix). Evidence: `T-LOCK-01` (n3lite-consolidation.vitest.ts) — two connections on a file DB; a probe write on conn B fires when the scan touches `memory_index`. RED proven by temporarily reverting R1 (scan inside `BEGIN IMMEDIATE`): `inTransactionDuringScan` was `true` + conn B got SQLITE_BUSY → assertion failed; GREEN on the fix. Plus `T-LOCK-02` proves the under-lock cadence re-check blocks double-apply.
- [x] C7-V2 Handle/atomicity test: reads + writes share one connection within the cycle transaction. Evidence: `T-HANDLE-01` — Hebbian write (via module-global) is visible on the same connection passed to the cycle (strength 0.5→0.55) + weight_history row lands on it; `T-HANDLE-02` — `detectStaleEdges()` reads via the module-global with no threaded handle.
- [x] C7-V3 Existing consolidation suite green; baseline→after delta reported. Evidence: 245/246 → 249/250 (+4 new tests; same 1 pre-existing out-of-scope failure; no regressions). tsc `--noEmit` exit 0; comment-hygiene clean; `verify_alignment_drift.py` PASS (0 findings).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Both fixes landed + test-gated; concurrency + handle tests pass; no regression in the consolidation suite. Default-ON cadence/atomicity semantics preserved.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source findings: `../../review/fresh-regression-75/deep-review-findings-registry.json` (consolidation.ts read-only-scan-under-lock; inconsistent DB handle)
- Deferred from: sub-phase `../001-memory-storage-and-search`
<!-- /ANCHOR:cross-refs -->
