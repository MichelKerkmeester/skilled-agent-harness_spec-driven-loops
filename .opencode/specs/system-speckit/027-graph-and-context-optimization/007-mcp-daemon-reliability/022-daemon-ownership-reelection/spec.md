---
title: "Feature Specification: RC-2 daemon ownership re-election (foundation)"
description: "The shared mk-spec-memory daemon dies with its owning session because the owner explicitly kills it on shutdown. This packet lands the flag-gated, default-off foundation that lets the daemon outlive its owner: detached spawn + release-on-shutdown."
trigger_phrases:
  - "RC-2 daemon re-election"
  - "daemon outlives owner"
  - "daemon ownership re-election"
  - "SPECKIT_DAEMON_REELECTION"
  - "release daemon on shutdown"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/022-daemon-ownership-reelection"
    last_updated_at: "2026-06-07T17:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Landed the flag-gated default-off RC-2 foundation (detached spawn + release-on-shutdown)"
    next_safe_action: "Runtime-validate secondary adoption + terminal idle-death before enabling the flag"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-022-daemon-ownership-reelection"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Secondary OWNERSHIP adoption (recycle responsibility) + the released daemon's terminal death need runtime validation before the flag is enabled by default."
    answered_questions:
      - "Why does the daemon die with the owner? -> shutdownLauncherForSignal explicitly child.kill(signal)s it; not a process-group effect."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: RC-2 daemon ownership re-election (foundation)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (foundation; flag default-off, runtime-validation pending) |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared mk-spec-memory daemon is owned by one launcher. Phase 017 made that owner exit cleanly on disposal (no flap), but the daemon still dies with its owner: `shutdownLauncherForSignal` explicitly `child.kill(signal)`s the context-server. So every secondary session bridged to that daemon loses the backend for a few seconds plus a cold FTS rebuild until someone respawns it. This is the "complete" RC-2 fix the investigation deferred.

### Purpose
Land the flag-gated, default-off foundation for the daemon to outlive its owner: when enabled, the owner spawns the daemon detached and, on shutdown, releases it (leaves it running for a live secondary to bridge to) instead of killing it. Default off is byte-identical to today; enabling it is gated on runtime validation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Flag `SPECKIT_DAEMON_REELECTION` (default off) + pure, testable decision helpers.
- Detached daemon spawn (own process group, no inherited stdio, unref) when enabled.
- A release branch in `shutdownLauncherForSignal`: reap only the model-server, keep the daemon lease, drop ownership, exit without killing the daemon.

### Out of Scope (runtime-validation-gated follow-up)
- Secondary OWNERSHIP adoption (a secondary taking over recycle responsibility for the released daemon).
- The released daemon's terminal idle-death (bounded today only by the phase-021 orphan sweeper reaping a reparented daemon).
- Enabling the flag by default - requires multi-session runtime validation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Flag + `contextServerSpawnIo` + `shouldReleaseDaemonForReelection`; gate the spawn + add the shutdown release branch |
| `mcp_server/tests/launcher-daemon-reelection.vitest.ts` | Create | Flag + spawn-io (incl. flag-off identity) + release-predicate tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Flag-off byte-identical | With the flag off, the daemon spawns tied to the owner (`stdio inherit`, not detached) and is killed on shutdown exactly as before |
| REQ-002 | Detached when enabled | With the flag on, the daemon is spawned detached + unref so it can outlive the owner |
| REQ-003 | Release not kill when enabled | With the flag on + a live daemon, shutdown releases it (skips the kill), drops only the owner lease, keeps the daemon lease |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Pure testable decisions | flag / spawn-io / release predicates are pure, exported, and unit-tested |
| REQ-005 | No launcher-suite regression | All existing launcher tests pass |
| REQ-006 | Honest deferral documented | Secondary adoption + terminal death recorded as runtime-validation-gated; leak bounded by the 021 sweeper |

### Acceptance Criteria (Given/When/Then)

- **Given** the flag off, **When** the daemon spawns, **Then** options equal `{detached:false, stdio:[ignore,ignore,inherit]}`.
- **Given** the flag off, **When** the launcher shuts down, **Then** the existing kill path runs (daemon killed).
- **Given** the flag on, **When** the daemon spawns, **Then** it is detached + unref'd.
- **Given** the flag on + a live daemon, **When** the launcher shuts down, **Then** it releases (no kill), drops the owner lease, keeps the daemon lease.
- **Given** the flag on + no live daemon, **When** shutting down, **Then** no release (nothing to adopt).
- **Given** the change, **When** the launcher tests run, **Then** all pass.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The structural capability for a daemon to outlive its owner exists, flag-gated, default-off.
- **SC-002**: Flag-off behavior is provably unchanged (regression test on spawn-io identity + suite green).
- **SC-003**: `node --check` clean; re-election tests pass; `validate.sh --strict` passes; deferral documented.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Flag-off regression breaks all sessions | High | Flag-off path is byte-identical (regression test + suite); re-election is a new, separate branch |
| Risk | Released daemon leak (no owner, no idle-death) | Med | Default off; released daemon reparents to pid 1 -> phase-021 orphan sweeper bounds the leak |
| Risk | Split-brain (two daemons) | Med | Release keeps the single daemon + drops ownership; a secondary bridges to the SAME socket, not a new daemon |
| Risk | Adoption ownership gap | Med | Documented as runtime-validation-gated; the flag stays off until validated |
| Dependency | Phase 021 orphan sweeper | Low | Bounds any released-daemon leak when both are enabled |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Zero cost when off (default).
- **NFR-P02**: When on, secondaries avoid the cold-respawn + FTS rebuild on an owner change.

### Security
- **NFR-S01**: Single-writer ownership preserved; release drops ownership cleanly.
- **NFR-S02**: No new external surface; operator-only env flag.

### Reliability
- **NFR-R01**: (When validated + enabled) the shared backend survives an owner's exit.
- **NFR-R02**: Flag-off reliability is unchanged from phase 017.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Flag off / unknown value: today's tied-and-killed behavior.
- Flag on + live daemon: release.
- Flag on + no live daemon: no release (kill path / nothing to release).

### Error Scenarios
- Released daemon never adopted: reparents to pid 1; bounded by the orphan sweeper.
- Owner crash (not graceful shutdown): the supervisor/crash paths are unchanged (release is only on graceful shutdown).

### State Transitions
- Owner shutdown (flag on) -> release daemon -> drop owner lease -> a secondary bridges to the live socket.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Flag + spawn gate + shutdown release branch in one launcher |
| Risk | 20/25 | Touches the daemon spawn + shutdown core; mitigated by flag-off identity + default-off + adversarial review |
| Research | 12/20 | Two-model investigation + gpt-5.5 design + first-party root-cause verification |
| **Total** | **44/70** | **Level 2 (risk-weighted; highest of the 007 hardening set)** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Secondary ownership adoption (recycle responsibility) and the released daemon's terminal death need runtime validation before the flag is enabled by default. The foundation ships dormant.
<!-- /ANCHOR:questions -->
