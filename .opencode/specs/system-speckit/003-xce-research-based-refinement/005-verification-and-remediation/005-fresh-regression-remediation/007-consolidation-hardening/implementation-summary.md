---
title: "Implementation Summary: Consolidation Cycle Hardening"
description: "The weekly consolidation cycle no longer holds the write lock during its read-only scan, and its DB handle is used consistently. Both fixes ship behind regression tests on the default-ON path."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/007-consolidation-hardening"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "fresh-implementation-agent"
    recent_action: "Implemented R1 lock-ordering + R2 handle-consistency, regression-tested"
    next_safe_action: "Orchestrator commits scoped; dist rebuild + recycle deferred"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "lib/storage/consolidation.ts"
      - "tests/n3lite-consolidation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-consolidation-hardening-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "R2: drop unused database params vs thread the handle — dropped the one dead param (smallest safe diff); causal-edges.ts unchanged since its module-global design already guarantees one connection."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Consolidation Cycle Hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented and test-gated (live activation deferred) |
| **Date** | 2026-06-16 |
| **Source** | 027 fresh-regression deep-review, deferred from sub-phase 001 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The default-ON weekly consolidation cycle used to take the exclusive `BEGIN IMMEDIATE` write lock and then, still holding it, run an O(n^2) read-only contradiction scan over up to 500 memories plus a per-node bounds count before writing anything. Every other writer (including this epic's multi-process CLI front-doors sharing the DB) was blocked for that whole window, risking `SQLITE_BUSY`. The cycle now does all that read-only work before it takes the lock, and the lock covers only the writes. A second, latent issue is also closed: a consolidation function carried a database parameter it ignored while reading through the module-global connection, implying a second handle that never existed.

### R1: read-only scan runs before the write lock

`runConsolidationCycleIfEnabled` now runs in two phases. Phase 1 checks the weekly cadence and runs the contradiction scan, cluster surfacing, staleness detection, and edge-bounds count with no write lock held, so concurrent memory writes proceed. Phase 2 takes `BEGIN IMMEDIATE`, re-checks the cadence (a concurrent cycle may have advanced `last_run_at` in the gap), then runs the Hebbian strengthening and decay writes and advances `last_run_at` inside the lock. The read-only work is extracted into a `scanReadOnly()` helper that `runConsolidationCycle` reuses, so the existing direct-call behavior and the `ConsolidationResult` return shape are unchanged. The under-lock cadence re-check is the double-apply guard the default-ON path needs.

### R2: one connection, no ignored handle

`detectStaleEdges` dropped its unused `database` parameter. It already delegated to `getStaleEdges()`, which reads through the causal-edges module-global connection, so the parameter was dead and misleading. The remaining cycle reads keep their threaded `database`, and that handle is provably the single shared connection the writes use: the runtime caller passes `requireDb()` (which returns `vectorIndex.getDb()`), the exact handle `causalEdges.init()` binds as the module-global. No `causal-edges.ts` change was needed; threading a handle through its entire edge API was the larger alternative the source finding explicitly lists, not the smallest safe diff.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts` | Modified | Hoist read-only scan before `BEGIN IMMEDIATE`; re-check cadence under the lock; drop the dead `database` param from `detectStaleEdges`. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts` | Modified | Add concurrency (`T-LOCK-01`, `T-LOCK-02`) and handle-consistency (`T-HANDLE-01`, `T-HANDLE-02`) regression tests; update `detectStaleEdges()` call sites. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both fixes are test-gated on the default-ON path and validated entirely in vitest with no live-daemon recycle. The concurrency test was proven RED by temporarily reverting the lock ordering (scan back inside `BEGIN IMMEDIATE`): the probe observed the cycle in a transaction during the scan and a second connection hit `SQLITE_BUSY`, failing the test; restoring the fix turns it GREEN. The whole consolidation plus causal-edges suite was captured before and after for the delta.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Run staleness and bounds in the lock-free phase alongside the contradiction scan, because they are read-only and independent of the Hebbian writes (Hebbian changes strength only, never `last_accessed` or row counts), so moving them out of the lock changes no result while shrinking the lock window.
- Re-check the cadence after acquiring the lock, because a concurrent cycle can advance `last_run_at` between the lock-free pre-check and the lock; the re-check prevents a double-applied Hebbian pass on the default-ON path.
- For R2, drop the one dead param instead of threading handles everywhere, because the causal-edges module is module-global-by-design and the runtime invariant proves it is the single shared connection, so dropping the ignored param is the smallest change that removes the real divergence.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Concurrency RED proof (`T-LOCK-01` on reverted ordering) | FAIL as intended: `inTransactionDuringScan` was true and the concurrent write hit `SQLITE_BUSY`. |
| Concurrency GREEN (`T-LOCK-01`, `T-LOCK-02` on fix) | PASS: scan runs lock-free, concurrent write succeeds, cadence re-check blocks double-apply. |
| Handle consistency (`T-HANDLE-01`, `T-HANDLE-02`) | PASS: Hebbian write and weight_history land on the connection passed to the cycle; `detectStaleEdges()` reads via the module-global. |
| Consolidation and causal-edges vitest suites | 245/246 to 249/250 (+4 new tests; 1 pre-existing out-of-scope failure unchanged: `causal-edges.vitest.ts:633` T045 `skippedManual` return-shape drift). No regressions. |
| `tsc --noEmit` (mcp_server) | PASS (exit 0). |
| Comment hygiene (both files) | PASS (exit 0). |
| `verify_alignment_drift.py --root lib/storage` | PASS, 0 findings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live activation deferred.** These changes are validated in tests only. The live consolidation daemon path is untouched until a separate dist rebuild and daemon recycle, kept out of scope here per the packet plan.
2. **Pre-existing unrelated test failure left as-is.** `causal-edges.vitest.ts:633` (T045) asserts the old `insertEdgesBatch` return shape and fails because the function now also returns `skippedManual`. It is outside this packet's scope (consolidation lock and handle work) and was not touched.
<!-- /ANCHOR:limitations -->
