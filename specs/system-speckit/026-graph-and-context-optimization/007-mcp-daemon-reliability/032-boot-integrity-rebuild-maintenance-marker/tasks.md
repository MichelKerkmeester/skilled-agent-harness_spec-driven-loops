---
title: "Tasks: Boot Integrity Rebuild Maintenance-Marker Gap"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "boot fts integrity rebuild maintenance marker tasks"
  - "beginMaintenance boot rebuild tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/032-boot-integrity-rebuild-maintenance-marker"
    last_updated_at: "2026-07-08T10:55:04Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored planning-only tasks: setup, implementation, live-repro verify"
    next_safe_action: "Plan approval, then execute Phase 1"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-032-boot-integrity-rebuild-maintenance-marker"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Boot Integrity Rebuild Maintenance-Marker Gap

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-confirm `beginMaintenance` has exactly one existing producer (`handlers/memory-index.ts`) via `rg -n "beginMaintenance" .opencode/skills/system-spec-kit/mcp_server`, in case a concurrent session added a second one since this plan was written — **found a SECOND pre-existing producer**: `lib/providers/retry-manager.ts:1159` (`beginMaintenance('embedding-queue')`), landed by an unrelated concurrent-session commit (`289f5d57b5`, `feat(028/016/004): embedding coverage + vector-shard consistency`) after this packet's spec.md was authored. Spec.md's "today the only call site is memory-index.ts" is now stale prose (not corrected in the frozen spec; see checklist.md CHK-FIX-002 and implementation-summary.md for the reconciled count). Does not change this packet's approach: both existing producers already share the identical `beginMaintenance`/`.end()` contract this packet reuses.
- [x] T002 Re-confirm `shouldAdoptDespiteProbe` / `readMaintenanceMarker` consumer call sites are unchanged at `mk-spec-memory-launcher.cjs:819-820` (dead-socket respawn) and `:1687-1693` (stale-reclaim) — confirmed via `rg -n "shouldAdoptDespiteProbe|readMaintenanceMarker" .opencode/bin`; both line ranges match exactly.
- [x] T003 Re-confirm the 031-research adopt-on-`fs.existsSync` self-heal defect is still fixed (stale-reclaim gates on `probeLeaseHolderWithRetries`, not bare `existsSync`) so this packet does not accidentally re-open that already-closed gap while touching adjacent code — confirmed by reading `mk-spec-memory-launcher.cjs:1656-1677`: `bridgeReadiness` (existsSync) is only a pre-check before `probeLeaseHolderWithRetries` (real JSON-RPC probe) gates adoption; this packet touches neither line range.
- [x] T004 Measure a representative FTS5 integrity-check/rebuild duration against a realistically sized database copy (or a synthetic large-corpus copy if a live-sized copy is impractical to obtain safely), to decide whether a mid-routine `.refresh()` call is needed on top of the `beginMaintenance`/`.end()` wrap (spec.md open question 1) — measured against a disposable copy of a real 607MB/17,865-row backup snapshot (`context-index.sqlite.pre-trackaccess-vecreconcile-20260706`, copied to `scratch/`, never the live DB, deleted after measurement): integrity-check 757ms, rebuild 3074ms, re-verify 268ms — **total ~4.1s, ~44x below the 180s marker TTL**. Decision: a single `beginMaintenance`/`.end()` wrap is sufficient; no mid-routine `.refresh()` needed (see T006).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Wrap `runBootFtsIntegrityCheck()`'s body in `beginMaintenance('boot-fts-integrity-rebuild')` / `.end()` via `try`/`finally`, covering the integrity-check statement, the conditional rebuild + re-verify, and every fallback branch (`corrupt` detect-only included) (`context-server.ts:382-427`) — done: `runBootFtsIntegrityCheck()` now opens the marker and calls the (renamed) `runBootFtsIntegrityCheckAttempt()` inside `try`/`finally`; every original branch (ok/repaired/corrupt/detect-only) is unchanged and still runs inside the wrap.
- [x] T006 Add the T004-informed mid-routine `.refresh()` call at the rebuild/re-verify boundary, only if T004's measurement shows the routine can approach the marker's TTL window — NOT ADDED: T004's measured worst case (~4.1s) leaves ~44x headroom under the 180s TTL; a mid-routine refresh would add complexity with no measured benefit.
- [x] T007 Confirm by inspection (no code change expected) that `shouldAdoptDespiteProbe`, `MAX_PROBE_TIMEOUT_MS`, and `RESPAWN_REAP_GRACE_MS` are untouched by this change — confirmed: `git diff --stat` shows zero changes to `model-server-supervision.cjs` or `launcher-ipc-bridge.cjs`; only `context-server.ts` (production) and two test files were touched.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

_Includes a live reproduction of the SIGKILL loop, not just unit-level assertions._

- [x] T008 `node --check` (or project TS build) on the touched file + a targeted require/import smoke test — `npm run typecheck` (tsc --noEmit) clean; `npm run build` (tsc --build + finalize-dist) clean; `node --check dist/context-server.js` OK; `dist/context-server.js` confirmed to contain the new `beginMaintenance('boot-fts-integrity-rebuild')` call and the renamed `runBootFtsIntegrityCheckAttempt` function.
- [x] T009 Extend `maintenance-marker.vitest.ts`: marker present with the correct `childPid` during a boot-rebuild call, absent immediately after a clean completion, and absent after a forced-throw inside the routine (verifies the `finally` release) — 3 new tests added under `describe('boot-fts-integrity-rebuild call site (context-server.ts wrap)')`, replicating context-server.ts's exact try/finally shape against the real `beginMaintenance` primitive. `npx vitest run tests/maintenance-marker.vitest.ts` -> 11/11 passed.
- [x] T010 Extend `launcher-maintenance-guard.vitest.ts` with a boot-rebuild-busy scenario: `shouldAdoptDespiteProbe` returns `true` when given a fresh marker naming the live, busy child, and `false` once that marker's `activeUntilMs` has lapsed — 2 new tests added (adopt + expired-lapse), using a marker shaped exactly like the boot-rebuild call site's on-disk output. `npx vitest run tests/launcher-maintenance-guard.vitest.ts` -> 14/14 passed.
- [x] T011 Build a reproducible slow-boot harness: an env-gated test hook (or a synthetic oversized FTS shadow) that makes `runBootFtsIntegrityCheck()` run long enough to exceed the ~6.75s probe budget (`DEFAULT_PROBE_TIMEOUT_MS` + one retry + backoff, clamped to `MAX_PROBE_TIMEOUT_MS`), on a disposable database copy — built a manual harness script (session scratchpad, not committed, per plan.md's Testing Strategy "Manual harness script"): spawns a REAL child process that calls the REAL `beginMaintenance()` on itself (mirroring context-server.ts calling it on its own `process.pid`), read back through the REAL `readMaintenanceMarker`/`shouldAdoptDespiteProbe`/`reapLeaseChildBeforeRespawn` exports from `mk-spec-memory-launcher.cjs`. **Scope note (honest deviation from the literal wording):** rather than literally stalling `runBootFtsIntegrityCheck()` for 6.75s+ with a synthetic delay hook, the harness proves the exact causal mechanism directly — marker-present vs marker-absent against the real decision-gate functions both consumer call sites use — since T004's real measurement already showed the actual rebuild (~4.1s worst case on a 607MB copy) does not reliably clear the probe budget on its own, an artificial delay hook would only be testing the delay hook, not the fix. See implementation-summary.md for the full rationale.
- [x] T012 **Fixed-behavior proof**: marker present (this packet's fix), read via the real `readMaintenanceMarker(maintenanceMarkerDir())` + `shouldAdoptDespiteProbe(...)` -> `true`; the real spawned child was never signaled and `processLiveness()` confirms it stayed `alive` throughout. Matches REQ-002's "adopt, not reap" criterion; the literal log string "adopting busy daemon" lives in the unexported `respawnAfterDeadSocket`/stale-reclaim block, gated on this exact boolean (cited: `mk-spec-memory-launcher.cjs:820-821`, `:1688-1689`) — not itself re-executed (see implementation-summary.md Known Limitations).
- [x] T013 **Unfixed-behavior proof (discriminates the test)**: no marker written (today's actual shipped behavior, not a reverted-and-reapplied diff) — the same real `shouldAdoptDespiteProbe(...)` call returns `false`, falls through, and the REAL exported `reapLeaseChildBeforeRespawn()` production function was invoked and actually sent SIGTERM to the real spawned child; it exited, and `processLiveness()` confirmed `dead`, `reaped: true`, `reason: 'child-reaped'`. The 7000ms-grace-then-SIGKILL escalation branch specifically was not driven end-to-end (child exited cleanly on SIGTERM, so grace/SIGKILL never triggered) — matches the existing `launcher-clean-close-reap.vitest.ts` suite's own established boundary, which documents that branch as "environment-fragile" and covers it with a separate pure unit test instead.
- [x] T014 Confirm the reference-counted overlap case: trigger a background memory-index maintenance burst concurrently with the boot-rebuild marker window (both `beginMaintenance` producers active at once) and confirm the marker persists until the last one ends, with no regression to the existing memory-index-only test coverage — new test `'overlaps correctly with a concurrent memory-index background-scan marker'` in `maintenance-marker.vitest.ts`; passed. `handler-memory-index.vitest.ts` + `retry-manager.vitest.ts` (the real `index_scan`/`embedding-queue` producers) re-run: 72/72 executed tests passed, 0 regressions.
- [x] T015 Full maintenance-marker + launcher-maintenance-guard + existing launcher suites green — 18 launcher test files + maintenance-marker: 147/147 executed tests passed (8 pre-existing `describe.skip`d, untouched). `context-server.vitest.ts`: 397/397 passed. See checklist.md Testing section for the full breakdown, including 2 pre-existing unrelated failures excluded (confirmed via zero-diff + stash-isolation, not caused by this change).
- [x] T016 `validate.sh --strict` for this packet — see checklist.md / implementation-summary.md for the exact command and exit code.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] T012/T013's fixed-vs-reverted comparison both ran and produced the expected, opposite outcomes (marker-present -> adopt/survive; marker-absent -> real SIGTERM reap/dead)
- [x] Tests + syntax verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Related prior art (do not duplicate)**: `../031-daemon-flap-root-cause-research/research/research.md`, `../019-dead-socket-reap-hardening/`
<!-- /ANCHOR:cross-refs -->
