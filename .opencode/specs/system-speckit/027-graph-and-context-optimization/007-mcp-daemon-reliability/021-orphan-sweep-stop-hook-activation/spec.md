---
title: "Feature Specification: Orphan-sweep Stop-hook activation"
description: "The Stop hook's session-cleanup no-ops when CLAUDE_SESSION_PID is absent (the harness never sets it), so orphaned MCP daemons accumulate. This packet adds a flag-gated, default-off fallback to the orphan-only sweeper."
trigger_phrases:
  - "orphan sweep stop hook"
  - "CLAUDE_SESSION_PID not set"
  - "orphaned mcp accumulation"
  - "session-cleanup no-session-pid"
  - "SPECKIT_STOP_HOOK_ORPHAN_SWEEP"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/021-orphan-sweep-stop-hook-activation"
    last_updated_at: "2026-06-07T17:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added flag-gated orphan-sweep fallback to session-cleanup.sh (default off)"
    next_safe_action: "Phase 022 RC-2 ownership re-election (flag-gated)"
    blockers: []
    key_files:
      - ".opencode/scripts/session-cleanup.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-021-orphan-sweep-stop-hook-activation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Can we derive the session pid instead? -> No; session-cleanup.sh deliberately refuses a PPID guess (cross-session-kill risk). The orphan-only sweeper is pid-independent and safe."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Orphan-sweep Stop-hook activation

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
The Stop hook runs `session-cleanup.sh`, which only reaps a session's MCP descendants when `CLAUDE_SESSION_PID` is set. The harness never sets it, so the script logs `skip reason=no-session-pid` and does nothing; orphaned MCP daemons (reparented to pid 1) accumulate over days, holding RAM and stale sockets/leases. The script deliberately refuses to guess the pid from its PPID, because on a shared terminal that would mis-target and kill live sibling sessions (the v3.5.0.2 incident).

### Purpose
When no session pid is available, the Stop hook can fall back to the existing orphan-only sweeper, which reaps only ownerless processes and so can never touch a live session. It ships flag-gated and default-off so process-killing stays opt-in until an operator validates it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A flag-gated fallback in `session-cleanup.sh`'s no-session-pid branch invoking `orphan-mcp-sweeper.sh`.
- Modes: off (default, historical no-op), `dry-run` (log only), `1`/`on`/`live` (reap).
- A test-only sweeper-path override; shell + vitest coverage of the gating.

### Out of Scope
- Making `CLAUDE_SESSION_PID` flow (not in the harness's control) - explicitly rejected as a pid guess.
- Changing the orphan-sweeper's reap criteria - reused as-is (already dry-run validated).
- Installing the LaunchAgent / editing operator settings - the existing Stop-hook wiring is reused.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/scripts/session-cleanup.sh` | Modify | Flag-gated orphan-sweep fallback (default off) + sweeper-path override |
| `mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts` | Create | Gating tests (off / dry-run / live / unknown) via a stub sweeper |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Default unchanged | With the flag unset, the no-session-pid path stays a pure no-op (no sweep) |
| REQ-002 | Orphan-only delegation | The fallback only ever invokes the orphan-only sweeper, never a pid guess |
| REQ-003 | Dry-run ramp | `dry-run` mode invokes the sweeper with `--dry-run` (non-mutating) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Live reap on opt-in | `1`/`on`/`live` invokes the sweeper without `--dry-run` |
| REQ-005 | Failure isolated | A sweeper failure never fails the Stop hook (`|| true`) |
| REQ-006 | Comment hygiene | Durable WHY only; no ADR/REQ/CHK/spec-path ids in code |

### Acceptance Criteria (Given/When/Then)

- **Given** no session pid and no flag, **When** the hook runs, **Then** it logs `action=skip` and does not sweep.
- **Given** no session pid and `dry-run`, **When** the hook runs, **Then** the sweeper is invoked with `--dry-run`.
- **Given** no session pid and `1`, **When** the hook runs, **Then** the sweeper is invoked live.
- **Given** an unknown flag value, **When** the hook runs, **Then** it is treated as off.
- **Given** a session pid IS set, **When** the hook runs, **Then** the existing session-scoped path runs unchanged.
- **Given** a sweeper that errors, **When** invoked, **Then** the hook still exits cleanly.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Orphans can be reaped on session end without any pid guess, when enabled.
- **SC-002**: Default behavior is byte-identical to before (no-op without the flag).
- **SC-003**: `bash -n` clean; gating tests pass; `validate.sh --strict` passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Process-killing on session end | Med | Orphan-only (ownerless) reaping; default off; dry-run ramp; can't kill a live session |
| Risk | Can't runtime-validate the reap this session | Med | Default off; operator enables after a dry-run review (playbook 419) |
| Dependency | `orphan-mcp-sweeper.sh` | Low | Reused unchanged; already dry-run validated |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Zero cost when the flag is off (historical path).
- **NFR-P02**: When on, one sweeper invocation per session stop.

### Security
- **NFR-S01**: Never targets a live session's processes (orphan-only).
- **NFR-S02**: No new external surface; operator-only env controls.

### Reliability
- **NFR-R01**: Stops orphaned-daemon accumulation when enabled.
- **NFR-R02**: A sweeper failure cannot break the Stop hook.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Flag unset / unknown value: no-op (off).
- `dry-run`: non-mutating log.
- `1`/`on`/`live`: real reap.

### Error Scenarios
- Sweeper missing/errors: `|| true` keeps the hook green.
- Session pid present: orphan fallback not taken; session-scoped path runs.

### State Transitions
- Operator ramp: off -> dry-run (review) -> live.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | ~25 lines of shell + one test file |
| Risk | 14/25 | Process-killing path; mitigated by orphan-only + default-off + dry-run ramp |
| Research | 6/20 | session-cleanup safety contract + sweeper reuse traced |
| **Total** | **26/70** | **Level 2 (risk-weighted)** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Enabling live reaping is an operator decision after a dry-run review; the default is off.
<!-- /ANCHOR:questions -->
