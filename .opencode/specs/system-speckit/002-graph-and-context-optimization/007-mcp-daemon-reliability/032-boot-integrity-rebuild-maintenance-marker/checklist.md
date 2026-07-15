---
title: "Verification Checklist: Boot Integrity Rebuild Maintenance-Marker Gap"
description: "Level 2 verification checklist. All P0/P1 items complete with cited evidence; the boot-rebuild maintenance-marker wrap is implemented, tested, and live-reproduction-proven."
trigger_phrases:
  - "boot fts integrity rebuild maintenance marker checklist"
  - "beginMaintenance boot rebuild verification"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/032-boot-integrity-rebuild-maintenance-marker"
    last_updated_at: "2026-07-08T10:55:04Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented the beginMaintenance wrap and validated with a live-reproduction harness"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-maintenance-guard.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-032-boot-integrity-rebuild-maintenance-marker"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does a single beginMaintenance()/.end() wrap suffice, or is a mid-routine .refresh() also needed? -> Measured: worst-case rebuild ~4.1s against a real 607MB/17,865-row DB copy, ~44x below the 180s marker TTL. A single wrap suffices; no .refresh() added."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Boot Integrity Rebuild Maintenance-Marker Gap

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

> This is a pre-implementation checklist. Every item is intentionally unchecked; evidence is
> recorded as the fix and its live-reproduction proof land.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..006 + Given/When/Then, with the 031-research and 019-hardening prior art distinguished, not duplicated. Confirmed present at implementation time (spec.md §4, unchanged).
- [x] CHK-002 [P0] Technical approach defined in plan.md — `beginMaintenance`/`.end()` wrap around `runBootFtsIntegrityCheck()`, defense-in-depth alternatives explicitly deferred. Implemented exactly as planned; no defense-in-depth items (probe-timeout/reap-grace widening, async/chunked rebuild) were built, per plan.md's explicit deferral.
- [x] CHK-003 [P1] Dependencies identified — `maintenance-marker.ts` + `shouldAdoptDespiteProbe` both reused unchanged; confirmed via direct code reading, not assumed. Re-confirmed at implementation time (T001-T002): zero diff on `maintenance-marker.ts` and `model-server-supervision.cjs`/`launcher-ipc-bridge.cjs` (`git diff --stat` empty for all three).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — TypeScript, not plain JS, so `node --check` was run against the compiled dist output instead: `npm run typecheck` (tsc --noEmit) clean, `npm run build` clean, `node --check dist/context-server.js` -> `dist syntax OK`.
- [x] CHK-011 [P0] No console errors or warnings — `npx vitest run tests/maintenance-marker.vitest.ts tests/launcher-maintenance-guard.vitest.ts` -> `Test Files 2 passed (2)`, `Tests 25 passed (25)`, no errors/warnings in output.
- [x] CHK-012 [P1] Error handling implemented — marker released via `finally` on every exit path including a thrown error (T009). Proven by a new, real-executing vitest case (`releases the marker via finally even when the wrapped routine throws`) that replicates context-server.ts's exact try/finally shape, forces a throw, and asserts the on-disk marker is gone afterward. PASS.
- [x] CHK-013 [P1] Code follows project patterns — reuses `beginMaintenance`/`.end()` exactly as `handlers/memory-index.ts` does (same import, same `try { … } finally { handle.end() }` shape); no new primitive introduced. Confirmed by diff review.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — REQ-001..006's Given/When/Then all pass. REQ-001/002 proven live (see CHK-021); REQ-003 proven by the forced-throw vitest case (CHK-012); REQ-004 proven by the memory-index/retry-manager regression run (CHK-023); REQ-005 proven by the fixed-vs-reverted harness (CHK-021), with an honestly-scoped boundary documented there and in implementation-summary.md; REQ-006 confirmed by comment-hygiene review of the diff (no spec/packet/REQ/CHK ids in code comments).
- [x] CHK-021 [P0] Live-reproduction harness built and both directions run (T011-T013): fixed behavior adopts, reverted behavior reaps/SIGKILLs — proves the test discriminates, not just asserts. Built a manual harness (session scratchpad, not committed) spawning a REAL child process that calls the REAL `beginMaintenance()` on itself, read back through the REAL `readMaintenanceMarker`/`shouldAdoptDespiteProbe`/`reapLeaseChildBeforeRespawn` exports of `mk-spec-memory-launcher.cjs`. Output: **Scenario A (marker present)** — `shouldAdoptDespiteProbe=true`; child never signaled; `processLiveness` stayed `alive`. **Scenario B (marker absent, today's shipped behavior)** — `shouldAdoptDespiteProbe=false`; the REAL `reapLeaseChildBeforeRespawn()` was invoked, sent SIGTERM, and the real launcher log line `reaping recorded context-server child pid ... before respawn` printed; `processLiveness` -> `dead`, `reaped: true`. Exit code 0 (discriminates correctly). **Honest scope note**: this composes the exact exported decision-gate + reap functions both consumer call sites (`:819-820`, `:1687-1693`) use, against a real marker file and a real process, rather than spawning two full `mk-spec-memory-launcher.cjs` processes against a disposable multi-hundred-MB database and waiting out the real ~6.75s probe timeout + 7000ms reap grace end-to-end. See implementation-summary.md "Known Limitations" for the full rationale (mirrors the same environment-fragility boundary the existing `launcher-clean-close-reap.vitest.ts` suite already documents for the SIGKILL-escalation branch).
- [x] CHK-022 [P1] Edge cases tested — no-marker clean boot: `scheduleBootFtsIntegrityCheck()`'s early-return gate is untouched by this change (diff only touches `runBootFtsIntegrityCheck`/adds `runBootFtsIntegrityCheckAttempt`), and all 397 `context-server.vitest.ts` source-regex assertions (including the existing T56b/T56c boot-FTS coverage) still pass unmodified. rebuild-fails-then-fallback: the outer wrap's `finally` releases the marker regardless of which internal branch (ok/repaired/corrupt) the untouched inner logic takes — proven generically by the new marker tests, which don't depend on the routine's return value. marker-expired-past-TTL: new `launcher-maintenance-guard.vitest.ts` case `reaps once a boot-rebuild marker has lapsed past its activeUntilMs` confirms the fail-safe is preserved.
- [x] CHK-023 [P1] Reference-counted overlap tested — a concurrent memory-index maintenance burst + boot-rebuild marker window, marker persists until the last source ends, no regression to existing memory-index-only coverage (T014). New test `overlaps correctly with a concurrent memory-index background-scan marker` in `maintenance-marker.vitest.ts` passes. Regression check: `npx vitest run tests/handler-memory-index.vitest.ts tests/handler-memory-index-scan-jobs.vitest.ts tests/handler-memory-index-async-scan.vitest.ts tests/retry-manager-health.vitest.ts tests/retry-manager.vitest.ts` -> `Test Files 5 passed (5)`, `Tests 72 passed | 28 skipped (100)`, 0 failed (the 28 skips are a pre-existing, unrelated DB-fixture gate).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class — `algorithmic` (a missing busy-signal on one of two code paths that share a single fail-safe-to-reap decision gate)
- [x] CHK-FIX-002 [P0] Same-class producer inventory — `rg -n "beginMaintenance" .opencode/skills/system-spec-kit/mcp_server` **found TWO existing producers before this change** (`handlers/memory-index.ts:1603` `'index_scan'` AND `lib/providers/retry-manager.ts:1159` `'embedding-queue'`, the latter landed by an unrelated concurrent-session commit `289f5d57b5` after spec.md was authored — spec.md's "today the only call site is memory-index.ts" is now stale prose, corrected here rather than in the frozen spec), **three after** this packet's new `boot-fts-integrity-rebuild` call site. No other code path independently blocks the event loop long enough to need the same treatment (both pre-existing producers already guard genuinely long-running work; this packet's audit found no additional gap).
- [x] CHK-FIX-003 [P0] Consumer inventory — `rg -n "shouldAdoptDespiteProbe|readMaintenanceMarker" .opencode/bin` confirms both call sites (`mk-spec-memory-launcher.cjs:819-820` dead-socket, `:1687-1693` stale-reclaim) automatically pick up the new producer with zero consumer-side changes — confirmed both by static citation and by the live-reproduction harness (CHK-021), which exercises the exact same exported `shouldAdoptDespiteProbe`/`readMaintenanceMarker` functions both call sites use.
- [x] CHK-FIX-004 [P0] Adversarial cases — marker-absent (common path, unaffected: proven live in harness Scenario B + the existing `context-server.vitest.ts` T56b coverage of the unchanged early-return gate), marker-present-fresh (adopt: proven live in harness Scenario A), marker-present-expired (still reaps, fail-safe intact: new `launcher-maintenance-guard.vitest.ts` case), thrown-error-mid-rebuild (marker still released: new `maintenance-marker.vitest.ts` forced-throw case).
- [x] CHK-FIX-005 [P1] Matrix axes — {marker-absent, marker-fresh, marker-expired, marker-overlap-with-memory-index} — all four rows covered by T009/T010/T014, all passing.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant — a concurrent second session's launcher racing the respawn lock during the marker window, confirming no second-writer risk is introduced (unchanged locking, verified by inspection). Confirmed: this packet adds a new WRITER of the already-reference-counted marker mechanism only; it does not touch `acquireRespawnLockFile`, `acquireBootstrapLock`, `writeOwnerLeaseFileExclusive`, or any other lock/lease primitive (zero diff, confirmed via `git diff --stat`). Two concurrent `beginMaintenance()` producers were already a designed-for case (reference-counted `activeCount`) before this packet; this packet is a third instance of an already-hostile-tested pattern, not a new one.
- [x] CHK-FIX-007 [P1] Evidence pinned — against the working-tree code read for this spec (cited file:line throughout spec.md/plan.md/tasks.md) plus real vitest run output (25/25 in the two directly-modified suites, 147/147 across the full launcher+maintenance-marker set, 397/397 in `context-server.vitest.ts`, 72/72 in the memory-index/retry-manager regression set) and the live-reproduction harness's real stdout (quoted in CHK-021 and implementation-summary.md).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — none; confirmed by diff review.
- [x] CHK-031 [P0] Input validation implemented — unchanged; marker parsing already validates `childPid`/`activeUntilMs` shape in `readMaintenanceMarker` (zero diff on `model-server-supervision.cjs`).
- [x] CHK-032 [P1] Auth/authz working correctly — single-writer owner-lease model unchanged; no new trust boundary (zero diff on all lock/lease primitives, confirmed via `git diff --stat`).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — tasks.md and this checklist reflect the actual implementation with real evidence; spec.md/plan.md are left as-authored (frozen scope per the Four Laws) with the one stale factual claim (producer count) corrected in tasks.md/checklist.md/implementation-summary.md instead of edited in place. All deferred defense-in-depth alternatives remain deferred, as planned — none were built.
- [x] CHK-041 [P1] Code comments adequate — durable WHY on the marker-wrap rationale (`context-server.ts`'s new comment explains the synchronous-blocking risk and the adopt-vs-reap mechanism, no ids); reviewed the full diff (`git diff`) for spec/packet/ADR/REQ/CHK/T-numbers — none found in any touched file.
- [x] CHK-042 [P2] README / ENV_REFERENCE.md updated — N/A confirmed: no new operator-facing flag, env var, or config surface was added; `beginMaintenance('boot-fts-integrity-rebuild')` reuses the existing marker primitive with no new parameters.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — the T004 disposable DB copy (a copy of a static, non-live backup snapshot, never the live production database) was written to this packet's `scratch/`, never committed.
- [x] CHK-051 [P1] scratch/ cleaned before completion — the DB copy was deleted after the T004 measurement; `scratch/` now contains only `.gitkeep`. The live-reproduction harness script itself lived in the session's own scratchpad (outside the repo), not in this packet's `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Status**: Complete — the `beginMaintenance`/`.end()` wrap is implemented, both test suites are extended and green, a real fixed-vs-reverted live-reproduction harness was built and run against production code, and the full relevant test surface (launcher + maintenance-marker + context-server + memory-index/retry-manager regression) was re-run with 0 regressions.
**Verification Date**: 2026-07-08
**Verified By**: claude-sonnet-5
<!-- /ANCHOR:summary -->
