---
title: "Feature Specification: Re-election default-on rollout"
description: "Promote daemon re-election from a machine-local opt-in to on-by-default across all three runtime configs, aligned, with the residual secondary-adoption validation risk recorded and bounded by the idle timeout."
trigger_phrases:
  - "re-election default-on rollout"
  - "daemon reelection enabled for all users"
  - "mcp config alignment reelection"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/027-reelection-default-on-rollout"
    last_updated_at: "2026-06-07T22:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Enabled re-election in all 3 configs; ENV/README/changelog updated"
    next_safe_action: "Validate, commit, push, write release notes"
    blockers: []
    key_files:
      - ".claude/mcp.json"
      - "opencode.json"
      - ".codex/config.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-027-reelection-default-on-rollout"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Re-election default-on rollout

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
Daemon re-election is the only thing that keeps the shared mk-spec-memory daemon alive when its owning session disposes, but it shipped default-off and was enabled only in a gitignored machine-local `.env.local`. Every other user, and every other machine, still had the daemon die on owner disposal. The runtime configs were aligned on socket dirs but none set the flag.

### Purpose
Enable re-election by default for all users by setting it in all three committed runtime configs, aligned, and reconcile the docs to the new posture while recording the residual secondary-adoption validation risk.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Set `SPECKIT_DAEMON_REELECTION=1` in the mk-spec-memory env of `.claude/mcp.json`, `opencode.json`, and `.codex/config.toml`, aligned, each with a discoverability note.
- Remove the now-redundant machine-local flag from `.env.local`.
- Update ENV_REFERENCE and the root README to the on-by-default posture with the honest bound.
- Add the v3.5.0.4 changelog.

### Out of Scope
- Flipping the launcher code default - the runtime configs stay the single on-switch, so revert is one character.
- Enabling orphan-sweep by default - it is a separate process-killing Stop-hook default; re-election's leak is already bounded by the idle timeout.
- A live multi-session adoption CI test - it cannot be built without touching the shared lease and DB; covered by observation plus the hermetic decision test.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.claude/mcp.json` (via the `.mcp.json` symlink) | Modify | Add the re-election flag + note to mk-spec-memory env |
| `opencode.json` | Modify | Same flag + note |
| `.codex/config.toml` | Modify | Same flag + note (TOML) |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Re-election row to config-default-on |
| `README.md` | Modify | Reliability line to on-by-default |
| `.opencode/skills/system-spec-kit/changelog/v3.5.0.4.md` | Create | Release entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Re-election enabled in all three configs, aligned | Each config's mk-spec-memory env sets `SPECKIT_DAEMON_REELECTION=1`; all three parse |
| REQ-002 | No machine-local divergence | `.env.local` no longer sets the flag |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Docs reconciled | ENV_REFERENCE and the README describe the on-by-default posture and the idle-timeout bound |
| REQ-004 | Residual risk recorded | The changelog and ENV_REFERENCE state that full multi-session adoption is still under live observation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh session on any runtime spawns the daemon with re-election on, so an owner disposal releases rather than kills it.
- **SC-002**: The docs and changelog accurately describe the on-by-default posture, the revert path, and the residual risk.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Secondary adoption not live-validated | A released daemon may not be adopted | Bounded by the idle self-exit (worst case matches prior behavior); decision path covered by the integration test |
| Risk | Default-on pushed to all machines | An unforeseen lease-state bug affects everyone | Code default stays off so the config is a one-character revert; activates only on a fresh session |
| Dependency | Idle-timeout default (30 min) | Bounds an unadopted daemon | Already default-on |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime cost; the flag only changes shutdown behavior.
- **NFR-P02**: Detached spawn adds no measurable startup cost.

### Security
- **NFR-S01**: No new surface; the flag holds no secrets.
- **NFR-S02**: A released daemon keeps the same socket permissions as before.

### Reliability
- **NFR-R01**: An unadopted released daemon is bounded by the idle timeout.
- **NFR-R02**: The release-vs-kill decision is covered by an integration test.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable; this is a config flag.
- Maximum length: not applicable.
- Invalid format: each config was parse-checked after the edit.

### Error Scenarios
- External service failure: not applicable.
- Network timeout: not applicable.
- Concurrent access: a released daemon stays findable by socket for a secondary to adopt.

### State Transitions
- Partial completion: a released-but-unadopted daemon self-exits at the idle timeout.
- Session expiry: a fresh session adopts the released daemon or reaps and respawns it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three config flags plus doc reconciliation |
| Risk | 16/25 | Default-on behavior change for all users, bounded and reversible |
| Research | 6/20 | Alignment + bound analysis done up front |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None outstanding; orphan-sweep staying opt-in and the code default staying off are recorded decisions.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
