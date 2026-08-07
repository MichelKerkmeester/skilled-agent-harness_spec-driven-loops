---
title: "Consolidation Cycle Hardening"
description: "The two consolidation.ts findings deferred from sub-phase 001, implemented as a dedicated concurrency-gated packet: the read-only contradiction scan now runs before the BEGIN IMMEDIATE write lock, and the cycle uses one DB connection consistently. Both behind regression tests on the default-ON path."
trigger_phrases:
  - "005/005/007 consolidation hardening changelog"
  - "consolidation read-only scan lock-free"
  - "consolidation single connection handle"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-16

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/007-consolidation-hardening` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation`

### Summary

This packet implemented the two consolidation.ts findings deferred from sub-phase 001, which were held back because they touch a default-ON path and warranted their own concurrency gate. The weekly consolidation cycle used to take the exclusive BEGIN IMMEDIATE write lock and then run an O(n^2) read-only contradiction scan while still holding it, blocking every other writer for the whole window. The cycle now does all read-only work before it takes the lock, and the lock covers only the writes. A latent second issue is also closed: a function carried a database parameter it ignored while reading through the module-global connection.

### Added

- Concurrency regression tests `T-LOCK-01` and `T-LOCK-02` and handle-consistency tests `T-HANDLE-01` and `T-HANDLE-02` in `n3lite-consolidation.vitest.ts`.

### Changed

- `runConsolidationCycleIfEnabled` now runs in two phases. Phase 1 checks the cadence and runs the contradiction scan, cluster surfacing, staleness detection and edge-bounds count with no lock held. Phase 2 takes BEGIN IMMEDIATE, re-checks the cadence (a concurrent cycle may have advanced last_run_at in the gap), then runs the Hebbian and decay writes and advances last_run_at inside the lock. The read-only work is extracted into a `scanReadOnly()` helper that the direct-call path reuses, so the return shape and decision semantics are unchanged.
- `detectStaleEdges` dropped its unused database parameter; it already read through the causal-edges module-global connection, which the runtime invariant proves is the single shared connection the writes use.

### Fixed

- Read-only scan no longer holds the write lock, removing the SQLITE_BUSY risk for concurrent writers including the epic's multi-process CLI front-doors.
- The ignored DB handle that implied a second connection that never existed.

### Verification

| Check | Result |
|-------|--------|
| Concurrency RED proof (reverted ordering) | FAIL as intended (in-transaction during scan, concurrent write hit SQLITE_BUSY) |
| Concurrency GREEN (T-LOCK-01, T-LOCK-02) | PASS (scan lock-free, concurrent write succeeds, cadence re-check blocks double-apply) |
| Handle consistency (T-HANDLE-01, T-HANDLE-02) | PASS (writes land on the connection passed to the cycle; detectStaleEdges reads via the module-global) |
| Consolidation and causal-edges suites | 245/246 to 249/250 (+4 tests; one pre-existing out-of-scope failure unchanged) |
| Typecheck / comment hygiene / alignment drift | PASS (tsc exit 0; both files clean; 0 drift findings) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/storage/consolidation.ts` | Modified | Hoist read-only scan before BEGIN IMMEDIATE, re-check cadence under the lock, drop the dead database param |
| `mcp_server/tests/n3lite-consolidation.vitest.ts` | Modified | Concurrency and handle-consistency regression tests; updated call sites |

### Follow-Ups

- Live activation is deferred. These changes are validated in tests only; the live consolidation daemon path is untouched until a separate dist rebuild and daemon recycle.
- The pre-existing causal-edges T045 failure (old insertEdgesBatch return shape) is outside this packet scope and was not touched.
