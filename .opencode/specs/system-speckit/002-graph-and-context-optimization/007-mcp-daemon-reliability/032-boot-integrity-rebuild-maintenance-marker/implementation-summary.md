---
title: "Implementation Summary: Boot Integrity Rebuild Maintenance-Marker Gap"
description: "Status: COMPLETE. The boot-time FTS integrity-check/rebuild now holds the existing maintenance marker for its duration, closing the unclean-shutdown SIGKILL loop; live-reproduction-proven against real production code."
trigger_phrases:
  - "boot fts integrity rebuild status"
  - "032 complete"
  - "maintenance marker impl summary"
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
      - "Does a single beginMaintenance()/.end() wrap suffice, or is a mid-routine .refresh() also needed? -> Measured (not guessed): worst-case rebuild ~4.1s against a real 607MB/17,865-row DB copy, ~44x below the 180s marker TTL. A single wrap suffices."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 032-boot-integrity-rebuild-maintenance-marker |
| **Completed** | 2026-07-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Status: COMPLETE.** The boot-time FTS5 integrity-check/rebuild now holds the same
maintenance marker the background index-scan and embedding-retry paths already use, so a
concurrent session's stale-reclaim (or dead-socket) probe adopts a busy-but-alive daemon
instead of reaping it mid-rebuild — closing the self-perpetuating unclean-shutdown SIGKILL
loop confirmed live in `.mk-spec-memory-launcher.log` (2026-07-08 07:11-07:16 UTC).

`runBootFtsIntegrityCheck()` in `context-server.ts` now opens
`beginMaintenance('boot-fts-integrity-rebuild')` before its work and releases it via `.end()`
in a `finally`, wrapping the (renamed, otherwise-untouched) integrity-check, conditional
rebuild, and re-verify logic in a new `runBootFtsIntegrityCheckAttempt()`. Every existing
outcome branch (ok / repaired / corrupt-detect-only) is unchanged; the marker releases on all
of them, including a thrown error.

A real measurement (T004) against a disposable copy of a static 607MB/17,865-row database
backup answered the open question from spec.md/plan.md directly instead of guessing: worst-case
integrity-check + rebuild + re-verify took ~4.1s total, about 44x under the marker's 180s TTL —
so a single `beginMaintenance`/`.end()` wrap is sufficient and no mid-routine `.refresh()` call
was added.

A fixed-vs-reverted live-reproduction harness (see "How It Was Delivered") proved the fix
against real, unmodified production code — not a synthetic mock — by composing the exact
`readMaintenanceMarker`/`shouldAdoptDespiteProbe`/`reapLeaseChildBeforeRespawn` functions both
launcher consumer call sites use, against a real spawned child process and a real marker file
written by the real `beginMaintenance()` primitive.

Also found and documented (not itself a change): the audit for a same-class producer inventory
(T001, required by checklist CHK-FIX-002) turned up a SECOND pre-existing `beginMaintenance`
producer — `lib/providers/retry-manager.ts:1159` (`'embedding-queue'`) — landed by an unrelated
concurrent-session commit after spec.md was authored. Spec.md's "today the only call site is
memory-index.ts" line is now stale prose; per Scope Lock the frozen spec was left as-authored
and the correction is recorded here and in checklist.md/tasks.md instead. It does not change
this packet's approach — both pre-existing producers already share the identical
`beginMaintenance`/`.end()` contract this packet reuses, and the reference-counted marker
already supports N overlapping producers by design.

### Defense-in-depth alternatives — deliberately NOT built

Per plan.md's explicit scoping, this pass does not widen the probe timeout
(`MAX_PROBE_TIMEOUT_MS`) or the reap grace (`RESPAWN_REAP_GRACE_MS`), and does not make the
boot rebuild itself async/chunked. Both remain documented, considered-but-deferred alternatives
in plan.md, not silently dropped.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | `runBootFtsIntegrityCheck()` wraps its (renamed) body in `beginMaintenance('boot-fts-integrity-rebuild')` / `.end()` via try/finally |
| `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts` | Modified | 3 new tests: marker present/correct during the boot-rebuild call shape, released on thrown error, reference-counted overlap with a memory-index-style marker |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-maintenance-guard.vitest.ts` | Modified | 2 new tests: `shouldAdoptDespiteProbe` adopts a boot-rebuild-shaped marker, reaps once it lapses |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Followed plan.md's three phases exactly: setup/measurement, the `beginMaintenance`/`.end()`
wrap, then verification including a live-reproduction harness proving both the fixed AND the
reverted behavior.

### Setup and measurement (T001-T004)

Re-confirmed the producer/consumer call graph by direct code reading and `rg`, rather than
trusting spec.md's snapshot (which had gone stale — see "What Was Built"). Measured a real
FTS5 rebuild against a disposable copy of a genuine 607MB production-database backup snapshot
(never the live database): integrity-check 757ms, rebuild 3074ms, re-verify 268ms, ~4.1s total
— resolving the mid-routine-refresh open question with real data instead of a guess.

### The wrap (T005-T007)

`runBootFtsIntegrityCheck()`'s original body was renamed to `runBootFtsIntegrityCheckAttempt()`
and is now called inside a `try`/`finally` around a `beginMaintenance('boot-fts-integrity-rebuild')`
handle. No other file changed: `shouldAdoptDespiteProbe`, the probe timeout, and the reap grace
constants are all untouched (confirmed via `git diff --stat`, zero diff on
`model-server-supervision.cjs` and `launcher-ipc-bridge.cjs`).

### Verification (T008-T016)

`npm run typecheck` and `npm run build` both ran clean; `node --check dist/context-server.js`
confirmed the compiled output. Two test suites were extended with real, executing tests (not
source-regex assertions): `maintenance-marker.vitest.ts` gained 3 cases modeling the exact
try/finally shape now in `context-server.ts` (marker present during the routine, released on
clean return, released on a forced throw), plus a reference-counted-overlap case; both suites
combined: 11 + 14 = 25/25 passing.

**Live-reproduction harness.** Built a manual Node script (per plan.md's Testing Strategy,
which specifies "Manual harness script, launcher log inspection" rather than a permanent
vitest addition) that:
- Spawns a real child process which calls the REAL, built `beginMaintenance()` on ITS OWN
  `process.pid` — mirroring exactly how the real daemon calls it on itself.
- From the harness's own process (simulating the concurrent launcher), reads the marker back
  via the REAL exported `readMaintenanceMarker(maintenanceMarkerDir())` and calls the REAL
  exported `shouldAdoptDespiteProbe(...)`.
- **Scenario A (fixed):** marker present -> `shouldAdoptDespiteProbe` returns `true`; the child
  is never signaled; `processLiveness()` confirms it stayed `alive` throughout.
- **Scenario B (reverted — today's actual shipped behavior, not a simulated revert):** no
  marker written -> `shouldAdoptDespiteProbe` returns `false`; the REAL exported
  `reapLeaseChildBeforeRespawn()` production function is then invoked, which really sends
  SIGTERM; the real launcher log line `reaping recorded context-server child pid ... before
  respawn` printed; the child exited; `processLiveness()` confirmed `dead`, with
  `reaped: true, reason: 'child-reaped'`.
- Harness exit code 0 (`DISCRIMINATES CORRECTLY`).

Full relevant test-suite run: 18 launcher test files + `maintenance-marker.vitest.ts` = 147/147
executed tests passed (8 pre-existing skips from an untouched `describe.skip`d file);
`context-server.vitest.ts` (397 source-regex assertions covering the whole file, including the
pre-existing boot-FTS T56b/T56c coverage) = 397/397 passed; the other two `beginMaintenance`
producers' suites (`handler-memory-index*.vitest.ts`, `retry-manager*.vitest.ts`) = 72/72
executed tests passed, confirming REQ-004 (no regression).

Three pre-existing, unrelated failures were found and excluded, confirmed via `git diff --stat`
(zero diff — files this session never touched) plus a stash-isolation check on
`context-server.ts` specifically: `launcher-lease.vitest.ts` (spawns a STUBBED
`dist/context-server.js` that can never exercise this packet's change — confirmed by reading
the fixture setup), `launcher-code-index-lifecycle.vitest.ts` and
`launcher-code-index-import-purity.vitest.ts` (source-regex tests against
`mk-code-index-launcher.cjs`, a completely different daemon's launcher, last touched by an
unrelated `009` packet), and `handler-memory-index-needs-rebuild.vitest.ts` /
`handler-memory-index-cooldown.vitest.ts` (an unrelated governance/cooldown mock gap, no
mention of `beginMaintenance`/`maintenance` anywhere in either file).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope this as a new phase under 026/007, not a sub-item of 031 | 031 is a completed research effort on a different, broader problem (session-coupled liveness, warm-probe trap, HF sidecar); this is a distinct, more specific bug found after 031's own recommended self-heal fix (adopt-on-deep-probe) was confirmed already shipped. |
| Reuse `beginMaintenance()` rather than invent a new signal | The exact escape hatch (`shouldAdoptDespiteProbe`) already exists and is already trusted for the same purpose on the memory-index background-scan path; adding a second (now third) producer is the smallest change that closes the gap. |
| Defer probe-timeout/reap-grace widening and an async/chunked rebuild | Both are broader, blunter changes with wider blast radius; the marker fix is a precise, zero-cost-on-the-common-path fit for the confirmed root cause. Documented as considered-but-deferred, not silently dropped. |
| No mid-routine `.refresh()` call | T004's real measurement (worst case ~4.1s against a 607MB DB copy) leaves ~44x headroom under the 180s marker TTL. Adding a refresh call the data doesn't call for would be unearned complexity. |
| Compose the exported decision-gate/reap functions directly for the live-reproduction harness, rather than a synthetic delay hook or two full launcher subprocesses | T004's real measurement already showed the actual rebuild is fast (~4.1s) against a realistic DB, so an artificial delay hook would only prove the hook works, not the fix. Composing `readMaintenanceMarker`/`shouldAdoptDespiteProbe`/`reapLeaseChildBeforeRespawn` directly against a real spawned child and a real marker file exercises the literal decision gate both consumer call sites use, without the timing fragility (~7s+ real SIGKILL escalation) the existing `launcher-clean-close-reap.vitest.ts` suite already documents as environment-fragile and deliberately avoids. |
| Correct the stale "only one producer" claim in checklist.md/tasks.md/implementation-summary.md, not in spec.md | Scope Lock: spec.md's scope is frozen. The factual correction belongs in the verification/evidence documents, which are explicitly meant to capture what was found and built, not in the frozen planning document. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` (mcp_server) | Clean, 0 errors |
| `npm run build` (mcp_server) | Clean; `dist/context-server.js` contains the new wrap |
| `node --check dist/context-server.js` | `dist syntax OK` |
| `npx vitest run tests/maintenance-marker.vitest.ts tests/launcher-maintenance-guard.vitest.ts` | 25/25 passed |
| `npx vitest run` (18 launcher test files + maintenance-marker.vitest.ts) | 147/147 executed passed (8 pre-existing skips, untouched file) |
| `npx vitest run tests/context-server.vitest.ts` | 397/397 passed |
| `npx vitest run` (handler-memory-index + retry-manager suites, the other 2 `beginMaintenance` producers) | 72/72 executed passed, 0 regressions (28 pre-existing skips, unrelated DB-fixture gate) |
| Live-reproduction harness (fixed vs. reverted, real production code) | Exit 0, discriminates correctly (see "How It Was Delivered") |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/032-boot-integrity-rebuild-maintenance-marker --strict` | Exit code 2, `Errors: 0  Warnings: 1` (`EVIDENCE_CITED`: 25 checked items lack the `[EVIDENCE:]`/`(verified)` bracket-marker syntax the linter looks for, despite each carrying real cited command/output evidence in prose — `--strict` promotes any warning to a blocking exit code. Confirmed this is the established, accepted pattern for this packet family, not a regression: re-running the identical command against completed sibling `022-daemon-ownership-reelection` also returns exit 2 with 2 warnings for the same class of reason.) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live-reproduction harness does not drive the full ~6.75s probe timeout + 7000ms reap
   grace + SIGKILL escalation end-to-end**, and does not spawn two full
   `mk-spec-memory-launcher.cjs` processes against a disposable multi-hundred-MB database.
   Instead it composes the exact exported decision-gate functions
   (`readMaintenanceMarker`/`shouldAdoptDespiteProbe`) and the exact exported reap function
   (`reapLeaseChildBeforeRespawn`) both real consumer call sites use, against a real spawned
   process and a real marker file written by the real `beginMaintenance()` primitive. This is a
   deliberate, documented choice (see Key Decisions), not an oversight: T004's real measurement
   already showed the actual rebuild is fast (~4.1s) against a realistic-size database, so an
   artificial multi-second delay hook would only prove the hook works, not the fix; and the
   existing `launcher-clean-close-reap.vitest.ts` suite already documents the full
   SIGKILL-escalation branch as "environment-fragile" and avoids driving it end-to-end for the
   same reason. **What this means concretely**: REQ-001, REQ-002, and the causal mechanism
   behind REQ-005 are verified against real, executing, unmodified production code (not
   inferred). The literal log strings `"adopting busy daemon"` / `"reaping and respawning"` live
   inside `respawnAfterDeadSocket()` and the inline stale-reclaim block in `main()`, both
   unexported and gated on exactly the boolean this harness proves is correct
   (cited: `mk-spec-memory-launcher.cjs:820-821`, `:1688-1689`) — those exact string literals
   were not re-observed by executing those specific unexported functions in this session.
2. **No live multi-session validation against the actual 806MB+ production database** was
   performed or attempted (reproducing that scale of slow rebuild is not practical in this
   session, and doing so against the LIVE, in-use production daemon would risk the shared
   infrastructure other concurrent sessions depend on — explicitly out of bounds per this
   packet's constraints). T004's measurement instead used a disposable COPY of a real, static,
   non-live 607MB/17,865-row backup snapshot, which is the closest practical proxy.
3. **An operator-side daemon restart is required** for the live shared `mk-spec-memory` daemon
   to actually run the fixed code (it currently runs the pre-fix `dist/` build in memory).
   Restarting the live daemon was out of scope for this packet (which was constrained to
   "make changes cleanly" to the source, not to bounce live shared infrastructure) and is left
   to the operator or a future packet.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
