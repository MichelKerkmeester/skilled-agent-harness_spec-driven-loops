---
title: "Implementation Plan: Boot Integrity Rebuild Maintenance-Marker Gap"
description: "Wrap the boot-time FTS integrity-check/rebuild in the existing maintenance-marker primitive so the stale-reclaim adopt-vs-reap escape hatch correctly spares a legitimately busy daemon, closing the unclean-shutdown SIGKILL loop with no other timing changes required."
trigger_phrases:
  - "boot fts integrity rebuild maintenance marker plan"
  - "beginMaintenance boot rebuild plan"
  - "unclean shutdown sigkill loop fix plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/032-boot-integrity-rebuild-maintenance-marker"
    last_updated_at: "2026-07-08T10:55:04Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored planning-only technical approach"
    next_safe_action: "Plan approval, then implement per Phase 2"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-032-boot-integrity-rebuild-maintenance-marker"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Boot Integrity Rebuild Maintenance-Marker Gap

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`mcp_server/context-server.ts`), reused CommonJS launcher lib |
| **Framework** | None (MCP stdio server + better-sqlite3) |
| **Storage** | SQLite (`better-sqlite3`), FTS5 shadow index |
| **Testing** | vitest |

### Overview
The boot-time FTS5 integrity-check/rebuild (`runBootFtsIntegrityCheck()`) becomes
maintenance-marker-aware: it opens a `beginMaintenance('boot-fts-integrity-rebuild')` handle
before the integrity-check statement and releases it in a `finally` after the check, the
conditional rebuild, and the re-verify all complete (success, `corrupt` fallback, or a thrown
error). No other component changes — `shouldAdoptDespiteProbe()`, the probe timeout, and the
reap grace all stay exactly as they are; the fix works entirely through the escape hatch that
already exists for this purpose.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (live log evidence + direct code reading,
  cross-checked against `031-daemon-flap-root-cause-research`)
- [x] Success criteria measurable
- [x] Dependencies identified (`maintenance-marker.ts`, `shouldAdoptDespiteProbe`, both reused
  unchanged)

### Definition of Done
- [x] All acceptance criteria met
- [x] Live-reproduction test proves the fix breaks the observed SIGKILL loop (fixed vs. reverted
  comparison, not a unit assertion alone) — see checklist.md CHK-021 and implementation-summary.md
  for the harness and its honestly-scoped boundary
- [x] Docs updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reuse an existing busy-signal primitive at a new call site; no new abstraction.

### Key Components
- **`beginMaintenance(label)` / `MaintenanceMarkerHandle.end()`** (`lib/storage/maintenance-marker.ts`,
  unchanged): reference-counted on-disk marker (`.maintenance-active.json`) naming
  `process.pid` + an `activeUntilMs` TTL, refreshed on an internal interval while active.
  Currently the sole producer is `handlers/memory-index.ts`'s background-scan/embedding path.
  This plan adds a second producer at the boot-rebuild call site; the reference count already
  handles two overlapping sources correctly (marker persists until the last one ends).
- **`readMaintenanceMarker` / `shouldAdoptDespiteProbe`** (`lib/model-server-supervision.cjs:615-640`,
  unchanged): the consumer side. `shouldAdoptDespiteProbe` is fail-safe toward reaping — a
  missing/expired marker, a `childPid` mismatch, or a non-`alive` child all fall through to the
  normal reap path, so a stale marker can never pin a genuinely dead or wedged daemon.
- **`runBootFtsIntegrityCheck()` / `scheduleBootFtsIntegrityCheck()`** (`context-server.ts:382-436`):
  the new producer call site. `scheduleBootFtsIntegrityCheck()` already gates the whole path on
  `.unclean-shutdown` marker presence (`context-server.ts:430-433`), so the new maintenance
  marker is written only in the exact window this bug needs it — no cost on the common (clean
  prior shutdown) boot path.

### Data Flow
`scheduleBootFtsIntegrityCheck()` (fires once at boot if `.unclean-shutdown` is present) →
`runBootFtsIntegrityCheck()` opens `beginMaintenance('boot-fts-integrity-rebuild')` → runs the
synchronous integrity-check → on failure, conditional rebuild + re-verify
(`SPECKIT_BOOT_FTS_AUTOHEAL` gate unchanged) → `finally` calls `.end()` regardless of outcome.
Concurrently, a sibling session's launcher may run its stale-reclaim path
(`mk-spec-memory-launcher.cjs:1644-1719`): probe fails (daemon busy) → `readMaintenanceMarker` +
`shouldAdoptDespiteProbe` now find the fresh marker naming the live child → adopt instead of
reap.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runBootFtsIntegrityCheck()` (`context-server.ts:382-427`) | Runs the synchronous integrity-check/rebuild/re-verify, holds no marker | Update: wrap in `beginMaintenance`/`.end()` | Live-reproduction harness + new vitest coverage |
| `handlers/memory-index.ts` `beginMaintenance` usage | Existing sole producer | Unchanged — reference-counted overlap already correct | Existing tests must still pass unmodified |
| `shouldAdoptDespiteProbe()` / `readMaintenanceMarker` (`model-server-supervision.cjs:615-640`) | Consumer of the marker | Unchanged | Existing `launcher-maintenance-guard.vitest.ts` + a new boot-rebuild scenario |
| `mk-spec-memory-launcher.cjs` stale-reclaim path (`:1644-1719`) and dead-socket respawn path (`:792-830`) | Both call sites that consult the marker | Unchanged | Log-line assertion: "adopting busy daemon" appears instead of "reaping and respawning" |

Required inventories:
- Same-class producers of `beginMaintenance`: `rg -n "beginMaintenance" .opencode/skills/system-spec-kit/mcp_server` — confirms `memory-index.ts` is the only existing producer before this change, and both producers after.
- Consumers of the marker/escape hatch: `rg -n "shouldAdoptDespiteProbe|readMaintenanceMarker" .opencode/bin` — confirms both call sites (`:819-820` dead-socket, `:1687-1693` stale-reclaim) pick up the new producer automatically with no changes on the consumer side.
- Matrix axes: {marker-absent (clean boot, common case), marker-present-fresh (boot rebuild running), marker-present-expired (rebuild wedged past TTL), marker-overlap (boot rebuild + memory-index scan concurrent)} — covered by the new test additions in `tasks.md`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-confirm the current call graph (`beginMaintenance` producers, `shouldAdoptDespiteProbe`
  consumers) against the working tree immediately before implementation, in case a concurrent
  session has touched either file since this plan was written — found a second existing producer
  (`retry-manager.ts`); see checklist.md CHK-FIX-002
- [x] Measure a representative FTS5 rebuild duration against a realistically sized database copy
  to decide whether a single `beginMaintenance`/`.end()` wrap needs an added mid-routine
  `.refresh()` call (informs the first open question in `spec.md`) — ~4.1s worst case against a
  607MB copy; no `.refresh()` needed

### Phase 2: Core Implementation
- [x] Wrap `runBootFtsIntegrityCheck()`'s body in `beginMaintenance('boot-fts-integrity-rebuild')`
  / `.end()` via `try`/`finally`, covering the integrity-check, the conditional rebuild, and the
  re-verify
- [x] Add the measured `.refresh()` call at the rebuild/re-verify boundary only if Phase 1's
  measurement shows it is needed — not needed (see Phase 1)
- [x] Confirm no change is needed to `shouldAdoptDespiteProbe`, probe timeout constants, or reap
  grace constants (this phase does not touch them) — confirmed via zero-diff

### Phase 3: Verification
- [x] `node --check` on `context-server.ts` (or the project's TS build) + a targeted smoke test —
  typecheck + build clean, `node --check dist/context-server.js` OK
- [x] Extend `maintenance-marker.vitest.ts` to cover the boot-rebuild call site (marker present
  during the routine, absent after, absent-on-thrown-error) — 3 new tests, 11/11 passing
- [x] Extend `launcher-maintenance-guard.vitest.ts` with a boot-rebuild-busy scenario for
  `shouldAdoptDespiteProbe` — 2 new tests, 14/14 passing
- [x] Live-reproduction harness (see `tasks.md` Phase 3) proving the fixed-vs-reverted behavior
  difference against the actual observed SIGKILL loop, not just the unit-level guard — built and
  run against real production code; see checklist.md CHK-021 for the honestly-scoped boundary
- [x] Full maintenance-marker + launcher-maintenance-guard + existing launcher suites green —
  147/147 executed tests passed
- [x] `validate.sh --strict` for this packet — see checklist.md / implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `beginMaintenance`/`.end()` lifecycle around the boot-rebuild call site, including the thrown-error path | vitest |
| Integration | `shouldAdoptDespiteProbe` against a boot-rebuild-held marker (adopt) vs. no marker (reap, current buggy behavior) | vitest, injectable clock/probe |
| Live reproduction | Disposable DB copy + injected `.unclean-shutdown` marker + artificially slowed rebuild + a real concurrent stale-reclaim probe from a second launcher process | Manual harness script, launcher log inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `beginMaintenance` / `maintenance-marker.ts` | Internal | Green | reused unchanged |
| `shouldAdoptDespiteProbe` / `readMaintenanceMarker` | Internal | Green | reused unchanged |
| A representative large-database copy for rebuild-duration measurement (Phase 1) | Internal (test fixture) | Needs sourcing | Falls back to a synthetic slow-rebuild injection (env-gated test hook) if a real large copy is impractical to obtain safely |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the marker wrap causes an unexpected regression in the memory-index maintenance
  path, or the boot rebuild path itself misbehaves under the new wrap (e.g., the marker file
  write adds measurable latency to an already-slow boot).
- **Procedure**: `git revert` the `context-server.ts` change; the escape hatch simply returns to
  its current fail-open-to-reap behavior for the boot-rebuild case, with zero blast radius on
  the memory-index path (a separate, untouched call site).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | <1 hour |
| Core Implementation | Low | 1-2 hours |
| Verification (incl. live-reproduction harness) | Med | 2-4 hours |
| **Total** | | **~4-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Marker lifecycle verified to release on every exit path (success, `corrupt` fallback,
  thrown error) — forced-throw vitest case passes
- [x] No change to probe timeout / reap grace constants confirmed — zero diff on
  `model-server-supervision.cjs` / `launcher-ipc-bridge.cjs`
- [x] Memory-index maintenance-marker path unaffected (existing tests still pass unmodified) —
  72/72 executed tests passed across `handler-memory-index*` + `retry-manager*` suites

### Rollback Procedure
1. `git revert` the `context-server.ts` change.
2. Re-run the maintenance-marker + launcher-maintenance-guard suites.
3. Confirm the boot-rebuild path still functions (integrity-check/rebuild/re-verify), just
   without marker protection (reverting to the current, buggy-but-known state).

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:defense-in-depth -->
## L2: CONSIDERED, DEFERRED ALTERNATIVES (defense-in-depth)

Per the task brief, these are described at planning-intent level only — not implemented in this
pass, and only worth revisiting if the marker fix alone proves insufficient in practice:

1. **Widen the probe timeout (`MAX_PROBE_TIMEOUT_MS`, currently 6999ms effective ceiling) or the
   reap grace (`RESPAWN_REAP_GRACE_MS`, currently 7000ms).** This would give any busy daemon —
   marker-protected or not — more runway before a probe times out at all. Deferred because it
   is a blunt, session-wide timing change that slows down genuine-dead detection for every
   caller, whereas the marker fix is a precise, zero-cost (on the common path) signal targeted
   exactly at this daemon's own legitimate busy window. Worth reconsidering only as a secondary
   safety net if a future rebuild duration is found to routinely approach the marker's own TTL.
2. **Make the boot-time rebuild itself async/chunked** (e.g., yield to the event loop between
   FTS5 statements, or run the rebuild in a worker thread) so it stops blocking probes and
   heartbeats entirely, independent of any marker. This is the architecturally deeper fix — it
   would also improve responsiveness for any other in-process client during a boot rebuild, not
   just spare it from an external reap decision. Deferred as likely out of scope for a first
   pass: `better-sqlite3`'s FTS5 `rebuild`/`integrity-check` pragmas are synchronous C-level
   calls with no natural yield points, so chunking would require either driving the rebuild
   through a different (async-capable) code path or moving it off the main thread — a
   meaningfully larger change than this packet's scope. Noted here as a candidate follow-on
   phase if the marker fix and/or defense-in-depth widening are later found insufficient.
<!-- /ANCHOR:defense-in-depth -->
