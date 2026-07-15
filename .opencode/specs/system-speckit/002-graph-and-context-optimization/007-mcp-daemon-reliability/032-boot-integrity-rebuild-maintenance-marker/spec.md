---
title: "Feature Specification: Boot Integrity Rebuild Maintenance-Marker Gap"
description: "The boot-time FTS5 integrity-check/rebuild in context-server.ts never holds the existing maintenance marker, so a daemon that is legitimately busy rebuilding its shadow index after an unclean shutdown looks dead to a concurrent stale-reclaim probe and gets SIGKILLed, which re-arms the same unclean-shutdown marker and can repeat the loop."
trigger_phrases:
  - "boot fts integrity rebuild maintenance marker"
  - "shouldAdoptDespiteProbe boot rebuild"
  - "unclean shutdown marker sigkill loop"
  - "runBootFtsIntegrityCheck reap"
  - "maintenance marker boot integrity gap"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/032-boot-integrity-rebuild-maintenance-marker"
    last_updated_at: "2026-07-08T10:55:04Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored planning-only spec from live log evidence + direct code reading"
    next_safe_action: "Plan approval, then wrap the boot FTS rebuild in beginMaintenance/end()"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-032-boot-integrity-rebuild-maintenance-marker"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a single beginMaintenance()/end() wrap around runBootFtsIntegrityCheck() suffice, or does the rebuild have internal phase boundaries long enough to need an explicit mid-routine refresh() call too?"
      - "Is any probe-timeout / reap-grace widening worth doing as defense-in-depth once the marker fix ships, or does the marker alone fully close the gap?"
    answered_questions:
      - "Is the 031 research's adopt-on-fs.existsSync self-heal defect still present? -> No, confirmed fixed: stale-reclaim now gates adoption on probeLeaseHolderWithRetries (a real JSON-RPC deep probe), with fs.existsSync only used as a pre-check (mk-spec-memory-launcher.cjs:1656-1677)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Boot Integrity Rebuild Maintenance-Marker Gap

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-08 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Background: related prior art (do not duplicate)
This packet's parent (`007-mcp-daemon-reliability`) has 31 prior children covering exactly
this class of daemon-lifecycle/lease/reap bug. Two are directly relevant and this packet is
deliberately scoped to NOT overlap them:

- **`031-daemon-flap-root-cause-research`** (research-only, no `spec.md`) ran a 10-iteration
  deep-research effort on a *different, broader* question: why the shared MCP daemons keep
  dying with stale sockets session-to-session (session-coupled liveness, warm-probe trap, no
  autonomous resurrect, a stale-HF-sidecar compound failure). Its `research.md` §8 addendum
  additionally flagged a *concurrent-session* finding: `mk-spec-memory-launcher.cjs`'s
  stale-reclaim adoption used to gate on `fs.existsSync(socket)` alone (a wedged-but-socket-present
  daemon would be wrongly adopted) and recommended gating on the existing deep `probeDaemon`
  JSON-RPC probe instead. **That fix is confirmed already shipped in the current tree**:
  stale-reclaim adoption now calls `probeLeaseHolderWithRetries` (a real JSON-RPC round trip
  with retries) and only uses `fs.existsSync` (via `bridgeReadiness`) as a cheap pre-check
  before the deep probe (`mk-spec-memory-launcher.cjs:1656-1677`). This packet's bug sits
  *downstream* of that already-fixed gate: the deep probe itself now runs and correctly times
  out against a busy-but-legitimate daemon, and the only thing missing is a way for that
  daemon to say "I'm busy by design, don't reap me."
- **`019-dead-socket-reap-hardening`** (Complete) hardened the *probe-flakiness* case: a single
  transient deep-probe miss no longer reaps a live owner (`SPECKIT_LEASE_PROBE_RETRIES`, default
  1 retry, ≤1500ms + 250ms backoff, ≤6999ms total budget). That hardening is orthogonal to this
  bug — the probe here does not fail because of flakiness, it fails because the daemon is
  genuinely unresponsive for the *entire* retry budget while it runs a long synchronous
  operation with no way to signal legitimate busy-ness.

The existing escape hatch for "busy, not dead" is `shouldAdoptDespiteProbe()`
(`mk-spec-memory-launcher.cjs:632-640`, called from the stale-reclaim path at
`mk-spec-memory-launcher.cjs:1687-1693` and the dead-socket respawn path at `:819-820`). It
spares a live daemon from reap only when a fresh maintenance marker
(`.maintenance-active.json`, written by `beginMaintenance()` /
`lib/storage/maintenance-marker.ts`) names that daemon's `childPid`. Today the **only** call
site for `beginMaintenance()` is `handlers/memory-index.ts:14` (the background index-scan /
embedding-burst path). The daemon's own **boot-time FTS5 integrity-check/rebuild** path
(`context-server.ts` `runBootFtsIntegrityCheck()` / `scheduleBootFtsIntegrityCheck()`,
`context-server.ts:382-436`) never calls it — this packet closes that gap.

### Problem Statement
`scheduleBootFtsIntegrityCheck()` fires (`context-server.ts:2467`, right before the daemon
starts its IPC socket server) only when an `.unclean-shutdown` marker is present from a prior
ungraceful termination. When it fires, `runBootFtsIntegrityCheck()` runs a fully synchronous
`better-sqlite3` integrity-check, and on failure a rebuild + re-verify
(`context-server.ts:385-401`), against the live database — non-destructive by design (the FTS5
shadow is fully re-derivable from `memory_index`, `context-server.ts:390-392`) but potentially
slow against an 800MB+ database, and it blocks the Node event loop for its whole duration
because it never yields. Because this path holds no maintenance marker, a daemon in the middle
of this rebuild is **indistinguishable from a dead daemon** to a concurrent session's
stale-reclaim probe: `shouldAdoptDespiteProbe()` finds no marker naming the busy child, falls
through, and the launcher reaps it — SIGTERM
(`mk-spec-memory-launcher.cjs:731`/`:782`), a `RESPAWN_REAP_GRACE_MS=7000` ms grace
(`model-server-supervision.cjs:19`), then SIGKILL if still alive
(`mk-spec-memory-launcher.cjs:737`/`:786`) — even though the daemon was alive, busy-by-design,
and would have finished on its own.

**Self-perpetuating loop (confirmed live, twice in 6 minutes, 2026-07-08 07:11–07:16 UTC, in
`.mk-spec-memory-launcher.log`):** the forced SIGKILL leaves the daemon's own
`.unclean-shutdown` marker in place (a clean close's `wal_checkpoint(TRUNCATE)` + marker removal
never ran) → the *next* boot (by the replacement daemon a fresh launcher spawns) sees that
marker and runs the same long rebuild again → if a *concurrent* session's stale-reclaim probe
lands during that new rebuild window, it also times out and SIGKILLs again → the marker
persists → repeat. This reproduced identically at `07:11:39–07:12:09` and again at
`07:14:39–07:15:09` against two successive replacement daemons. A third heartbeat-failure event
at `07:16:09` self-healed only because the concurrent probe happened to land after that
rebuild had already finished — timing luck, not a fix.

**Separate, unrelated observation from the same log window (not this packet's bug, noted only
so it is not conflated):** an earlier `05:38:59` `liveness probe failed (connect ECONNREFUSED
...)` event was a genuinely dead daemon, killed by an earlier unrelated SIGABRT/SIGBUS
native-ABI crash wave that morning. Reaping it there was correct behavior.

### Purpose
The daemon's own boot-time FTS integrity-check/rebuild holds the existing maintenance marker
for its duration, so `shouldAdoptDespiteProbe()` correctly spares it — using machinery that
already exists and is already trusted for the same purpose on the background-scan path — with
no other timing changes required to close the SIGKILL loop.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hold `beginMaintenance('boot-fts-integrity-rebuild')` for the duration of
  `runBootFtsIntegrityCheck()` (covering the integrity-check, the conditional rebuild, and the
  re-verify), releasing it via `.end()` in a `finally` so a thrown error still clears the
  marker.
- Confirm the marker's TTL/refresh cadence (`MAINTENANCE_MARKER_TTL_MS` = 180s,
  refreshed every 20s while active) comfortably covers a realistic worst-case rebuild duration
  against the current database size, and add an explicit mid-routine `.refresh()` call only if
  the rebuild has an internal phase boundary long enough to risk starving the interval timer.
- A live-reproduction test plan proving the fix actually breaks the observed SIGKILL loop (see
  `tasks.md`), not just a unit test of `shouldAdoptDespiteProbe()` in isolation (already covered
  by phase 019's tests).
- Documenting, as a considered-but-deferred defense-in-depth option, whether the probe timeout
  (`MAX_PROBE_TIMEOUT_MS` ≈ 6.75s effective budget) or the reap grace
  (`RESPAWN_REAP_GRACE_MS` = 7000ms) also deserve widening, and whether the boot rebuild itself
  could be made async/chunked so it stops blocking the event loop against probes entirely.

### Out of Scope
- Implementing the probe-timeout/reap-grace widening or an async/chunked rebuild — noted as
  considered alternatives in `plan.md`, not built in this pass (see Open Questions).
- Anything covered by `031-daemon-flap-root-cause-research`'s broader session-coupled-liveness
  findings (HF sidecar refcounting, warm-probe trap, autonomous resurrect, launchd/systemd
  supervision) — separate, already-scoped follow-on phases per that research's §4.
- Anything covered by `019-dead-socket-reap-hardening` (probe-flakiness retries) — already
  shipped and orthogonal to this bug.
- The `05:38:59` genuinely-dead-daemon reap in the same log window — correct behavior, not a
  defect.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Wrap `runBootFtsIntegrityCheck()` with `beginMaintenance()` / `.end()` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | Reuse (no change expected) | Existing marker primitive; confirm TTL/refresh headroom only |
| `mcp_server/tests/maintenance-marker.vitest.ts` | Modify | Cover the new boot-rebuild call site alongside the existing memory-index coverage |
| `mcp_server/tests/launcher-maintenance-guard.vitest.ts` | Modify | Add a boot-rebuild-busy scenario to the existing `shouldAdoptDespiteProbe` guard coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The boot-time FTS integrity-check/rebuild holds a fresh maintenance marker for its full duration. | A live probe/inspection during a slow (artificially delayed) boot rebuild shows `.maintenance-active.json` present and naming the daemon's own `childPid`, with `activeUntilMs` in the future. |
| REQ-002 | `shouldAdoptDespiteProbe()` spares a daemon mid-boot-rebuild instead of falling through to reap. | With the fix applied, a stale-reclaim probe that lands during an injected slow rebuild logs "adopting busy daemon" (per `mk-spec-memory-launcher.cjs:1689`), not "reaping and respawning" (per `:1694`). |
| REQ-003 | The marker is always released, even on a thrown error inside the integrity-check/rebuild path. | A forced-throw test in `runBootFtsIntegrityCheck()` shows `.maintenance-active.json` removed afterward (via `.end()` in `finally`). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No regression to the existing memory-index maintenance-marker path. | `handlers/memory-index.ts`'s `beginMaintenance`/`end()` usage and its existing tests are unaffected; the reference-counted `activeCount` model (§ `maintenance-marker.ts:44-95`) correctly overlaps a concurrent boot-rebuild marker window with a background-scan marker window without either releasing the marker early. |
| REQ-005 | The live-reproduction test plan demonstrates the fix breaks the actual observed SIGKILL loop, not just the unit-level guard. | An end-to-end harness (disposable DB copy, injected `.unclean-shutdown` marker, artificially slowed rebuild, a concurrent stale-reclaim probe) shows the launcher log adopting instead of reaping/SIGKILLing, matching REQ-002's log-line evidence. |
| REQ-006 | Comment hygiene. | Durable WHY only in any code comments touched; no ADR/REQ/CHK/spec-path ids embedded in code. |

### Acceptance Criteria (Given/When/Then)

- **Given** an `.unclean-shutdown` marker is present at boot and the FTS integrity-check/rebuild
  is running, **When** a concurrent session's stale-reclaim probe times out against that daemon,
  **Then** `shouldAdoptDespiteProbe()` returns true and the daemon is adopted, not reaped.
- **Given** the boot rebuild throws partway through, **When** the routine exits (success,
  `corrupt`/detect-only fallback, or thrown error), **Then** the maintenance marker is removed
  in every case.
- **Given** a background memory-index maintenance burst is active at the same time as a boot
  rebuild (e.g., an adoption race during startup), **When** either one ends independently,
  **Then** the marker persists until the last active source ends (reference-counted; unaffected
  by this change).
- **Given** the fix is reverted (or the marker call is temporarily disabled) against the same
  slow-boot harness, **When** the same concurrent-probe scenario runs, **Then** it reproduces
  the original reap/SIGKILL outcome — proving the live-reproduction test actually discriminates
  fixed vs. unfixed behavior.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A daemon mid-boot-rebuild is never reaped by a concurrent stale-reclaim probe;
  the "reaped ... WITHOUT a verified clean DB close" log line no longer occurs for this cause.
- **SC-002**: The live-reproduction harness proves the fix on a real (fixed-vs-reverted)
  comparison, not just a unit assertion on `shouldAdoptDespiteProbe()` in isolation.
- **SC-003**: `node --check` clean; the maintenance-marker + launcher-maintenance-guard suites
  pass; `validate.sh --strict` passes for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A held marker masks a genuinely wedged (not just slow) boot rebuild, delaying a legitimate reap. | Low | The marker still lapses (TTL 180s, no further refresh) if the routine truly hangs past its refresh window; `shouldAdoptDespiteProbe()` also requires the child to still be `alive`, so a crashed process is reaped normally regardless of a stale marker. |
| Risk | The rebuild genuinely exceeds realistic bounds against a much larger future database, outrunning even a refreshed marker. | Low | TTL is refreshed every 20s while `beginMaintenance()` is active; add an explicit mid-routine `.refresh()` if a future phase boundary is identified as a starvation risk (documented open question, not blocking this pass). |
| Dependency | Existing `beginMaintenance()`/`shouldAdoptDespiteProbe()` primitives | Low | Reused unchanged; only a new call site is added. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No steady-state cost — the marker is written only while `.unclean-shutdown` is
  present and the rebuild is actually running (the common case, a clean prior shutdown, never
  triggers this path at all: `scheduleBootFtsIntegrityCheck()` short-circuits at
  `context-server.ts:430-433`).
- **NFR-P02**: No change to probe timing, reap grace, or retry counts in this pass.

### Security
- **NFR-S01**: No new external surface; the marker file already lives under `DATABASE_DIR` with
  the same trust boundary as the rest of the daemon's on-disk state.
- **NFR-S02**: No operator-facing config surface added.

### Reliability
- **NFR-R01**: Removes a self-perpetuating unavailability loop (unclean SIGKILL → marker
  persists → next boot reruns the same rebuild → gets SIGKILLed again).
- **NFR-R02**: Preserves genuine-dead detection: a marker only spares an `alive` child with an
  unexpired, `childPid`-matching marker; anything else still falls through to reap.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No `.unclean-shutdown` marker at boot: `scheduleBootFtsIntegrityCheck()` never fires; no
  maintenance marker is written; behavior unchanged.
- Integrity-check passes on the first attempt (no rebuild needed): the marker window is very
  short (a single synchronous statement); still correct to hold it for consistency and to
  cover slow first-pass checks against a very large database.
- Rebuild succeeds: marker held through both the rebuild and the re-verify, then released.
- Rebuild fails (`SPECKIT_BOOT_FTS_AUTOHEAL=0` or the rebuild itself throws): the `corrupt` /
  detect-only fallback still needs the marker released on the way out.

### Error Scenarios
- The routine throws an unexpected exception mid-rebuild: marker released via `finally`, not
  left dangling until its 180s TTL lapses.
- A boot rebuild that is genuinely wedged (not merely slow) past the marker's TTL and refresh
  window: falls back to normal reap behavior once the marker expires — the intended fail-safe.

### State Transitions
- A background memory-index maintenance burst starts while a boot rebuild's marker is already
  active: reference-counted (`activeCount`), the marker stays present until both end
  (`maintenance-marker.ts:44-95`), unaffected by this change.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | ~15-25 LOC in one server file, reusing an existing primitive; two test files touched |
| Risk | 10/25 | Shared daemon-boot path; mitigated by the marker's own TTL fail-safe and unchanged reap fallback |
| Research | 8/20 | Root cause already confirmed via live log evidence + direct code reading; live-reproduction harness still needs building |
| **Total** | **26/70** | **Level 2 (risk-weighted)** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does a single `beginMaintenance()`/`.end()` wrap around `runBootFtsIntegrityCheck()` suffice,
  or does the rebuild have an internal phase boundary long enough (against realistic database
  sizes) to need an explicit mid-routine `.refresh()` call too? Plan to measure against a
  representative large database before deciding.
- Is any probe-timeout (`MAX_PROBE_TIMEOUT_MS`) or reap-grace (`RESPAWN_REAP_GRACE_MS`) widening
  worth doing as defense-in-depth once the marker fix ships, or does the marker alone fully
  close the gap? Deferred to `plan.md`'s defense-in-depth discussion; not blocking this packet.
- Is making the boot rebuild itself async/chunked (so it stops blocking the event loop against
  probes/heartbeats entirely) worth a follow-on phase? Noted as a deeper, likely out-of-scope
  alternative in `plan.md`.
<!-- /ANCHOR:questions -->
