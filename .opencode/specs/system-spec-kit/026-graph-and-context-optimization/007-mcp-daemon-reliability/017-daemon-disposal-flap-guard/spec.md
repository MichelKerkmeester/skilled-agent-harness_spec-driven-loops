---
title: "Feature Specification: Daemon disposal relaunch-flap guard"
description: "The mk-spec-memory launcher respawns its daemon child during owner-session disposal, producing a SIGTERM<->relaunch flap that drops every bridged session's MCP transport. This packet gates the relaunch at fire-time on orphan/shutdown."
trigger_phrases:
  - "mcp daemon disposal flap"
  - "mk-spec-memory relaunch loop"
  - "owner session disposal sigterm relaunch"
  - "mcp transport flap fix"
  - "launcher orphan relaunch guard"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/017-daemon-disposal-flap-guard"
    last_updated_at: "2026-06-07T13:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added fire-time orphan/shutdown gate to the launcher relaunch path"
    next_safe_action: "Runtime-verify on a fresh session; then resume deferred RC-2/3"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-017-daemon-disposal-flap-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Was the report's 'launcher doesn't set its shutdown flag' accurate? -> No; the launcher already guards its own shutdown. The real gap is the disposal race."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Daemon disposal relaunch-flap guard

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
v3.5.0.2 fixed the Stop-hook cross-session kill but explicitly deferred the owner-shutdown/watchdog root causes. A converged two-model investigation (Opus 4.8 + gpt-5.5 xhigh) found the still-active flap: when the owning MCP host disposes its session, the `mk-spec-memory` daemon child receives `SIGTERM`, and the launcher's child-exit supervisor schedules a relaunch (250 ms backoff). The relaunch fires before the launcher's own shutdown signal lands, so a fresh daemon is spawned under a dying session and immediately killed again — a `SIGTERM`/relaunch flap that drops the transport for every session bridged to that shared daemon. (`mk-code-index` is worse — raw bridge, no reconnecting proxy — but that is a separate deferred item.)

### Purpose
The launcher no longer respawns the daemon under a disposing session: the relaunch is gated at fire-time on whether the launcher is shutting down or its owning runtime has gone away.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a fire-time guard to the `scheduleRelaunch` callback in `mk-spec-memory-launcher.cjs`: capture the launcher's initial parent pid at startup; when the relaunch backoff fires, abort + release lease + exit if `launcherShutdownInProgress` OR the launcher has been orphaned (ppid changed / reparented to 1).

### Out of Scope (deferred — documented for the next phases)
- **RC-2 proper fix — daemon outlives the owner**: re-elect ownership to a live secondary instead of letting the owner's exit end the shared daemon (the complete fix; larger, needs runtime validation).
- **mk-code-index reconnecting proxy**: port the `mk-spec-memory` session-proxy so code-index owner death does not surface as a hard `Connection closed`.
- **Dead-socket cross-session reap hardening**: require N consecutive liveness-probe failures before `reapOwnerBeforeRespawn` reaps a sibling's owner (avoid false-dead on a busy daemon).
- **CLAUDE_SESSION_PID flow / orphan-sweeper schedule**: the Stop-hook is a permanent no-op without the pid (orphans accumulate); make it flow or schedule `orphan-mcp-sweeper.sh`.
- **Persistent launcher log**: no first-party launcher/daemon stderr log exists; add one so future flaps are attributable.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | `LAUNCHER_INITIAL_PPID` const + fire-time orphan/shutdown gate in the relaunch callback |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Relaunch is suppressed during owner disposal | When the relaunch backoff fires and the launcher is orphaned or shutting down, no new daemon is spawned; lease is released; launcher exits cleanly |
| REQ-002 | Crash-recovery is preserved | A genuine daemon crash (owner alive, no shutdown) still relaunches |
| REQ-003 | RSS-recycle is preserved | An in-place RSS recycle (owner alive, no shutdown) still respawns via the same path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Change is additive / no logic regression | `node --check` clean; existing launcher unit tests pass |
| REQ-005 | Deferred root causes are documented | RC-2 (ownership re-election), mk-code-index proxy, reap hardening, CLAUDE_SESSION_PID, persistent log recorded as follow-up |
| REQ-006 | No comment-hygiene violations | Code comment states the durable WHY, no ADR/REQ/CHK/spec-path ids |

### Acceptance Criteria (Given/When/Then)

- **Given** an owner-session disposal, **When** the daemon child's relaunch backoff fires, **Then** the launcher detects orphan/shutdown and exits instead of respawning.
- **Given** a genuine daemon crash with the owner alive, **When** the relaunch fires, **Then** the daemon is respawned (recovery preserved).
- **Given** an RSS recycle, **When** the child is SIGTERMed and the relaunch fires, **Then** the daemon is respawned (recycle preserved).
- **Given** the changed launcher, **When** `node --check` runs, **Then** it passes.
- **Given** the launcher unit tests, **When** run, **Then** they all pass.
- **Given** the orphan check, **When** the launcher's parent is still alive at fire-time, **Then** the guard is a no-op (no regression).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The relaunch callback aborts (release lease + exit) when orphaned/shutting down; respawns otherwise.
- **SC-002**: `node --check` clean; launcher unit tests pass (no regression to recycle/crash-recovery).
- **SC-003**: Deferred RC-2/3/4 + mk-code-index proxy documented; `validate.sh --strict` passes for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Orphan detection depends on the launcher's parent dying | Med - may miss a disposal where a wrapper persists | Strictly additive: never blocks a legitimate relaunch (parent alive => no-op); pairs with the existing shutdown-flag guard |
| Risk | `.cjs` launcher change only activates on a fresh session | Low | Documented; runtime verification owed to next fresh session |
| Risk | Incomplete vs the full RC-2 fix | Med | This stops the dominant flap; the complete daemon-outlives-owner fix is the documented next phase |
| Dependency | Investigation report (Opus + gpt-5.5) | Low | Findings verified against the real code before implementing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No steady-state cost — the guard runs only on the relaunch backoff path.
- **NFR-P02**: Stops the flap loop, which was adding repeated ~2 s `quick_check` restart latency per cycle.

### Security
- **NFR-S01**: No new external surface; same single-writer owner-lease model.
- **NFR-S02**: Clean lease release on orphan-exit avoids a stale lease blocking the next owner.

### Reliability
- **NFR-R01**: Bridged sessions stop seeing the disposal-driven transport drop.
- **NFR-R02**: Crash-recovery and RSS-recycle paths unchanged.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Parent alive at fire-time: guard is a no-op → normal relaunch.
- Parent gone (ppid changed / 1): abort + release lease + exit.
- Launcher already shutting down: abort (the shutdown path also clears the timer).

### Error Scenarios
- Wrapper-persisted parent that doesn't die on disposal: orphan check misses → falls back to today's behavior (no regression); the deferred RC-2 fix covers it fully.
- Daemon crash mid-disposal: treated as orphan → no respawn under a dying session (acceptable; next session respawns).

### State Transitions
- RSS recycle in progress: owner alive, not shutting down → respawn proceeds.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | ~15 LOC in one launcher file |
| Risk | 14/25 | Critical shared infra; mitigated by additive design + tests; runtime verification deferred |
| Research | 10/20 | Two-model investigation + first-party code verification |
| **Total** | **32/70** | **Level 2 (risk-weighted)** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None blocking. The complete daemon-outlives-owner fix (RC-2) is a deliberate follow-up phase, not an open question.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
