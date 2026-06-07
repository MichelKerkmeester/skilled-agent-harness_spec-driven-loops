---
title: "Implementation Plan: Re-election default-on rollout"
description: "Add the re-election flag to all three aligned runtime configs, remove the machine-local opt-in, reconcile ENV_REFERENCE and the README, and ship the v3.5.0.5 changelog."
trigger_phrases:
  - "re-election default-on plan"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Re-election default-on rollout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON and TOML runtime configs, Markdown docs |
| **Framework** | None; config + documentation |
| **Storage** | None |
| **Testing** | Config parse checks, alignment grep, packet validation |

### Overview
Re-election is enabled by adding `SPECKIT_DAEMON_REELECTION=1` to the mk-spec-memory env in all three runtime configs, keeping them aligned. The machine-local opt-in is removed, and ENV_REFERENCE, the README, and a new changelog are reconciled to the on-by-default posture with the honest adoption-validation caveat.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Config alignment surveyed
- [x] Bound analysis confirmed (idle timeout covers the unadopted case)
- [x] Residual risk acknowledged

### Definition of Done
- [ ] All three configs parse and set the flag
- [ ] Docs and changelog reconciled
- [ ] Packet validated, committed, pushed, release notes written
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Aligned per-runtime config flags as the single on-switch, with the code default left off.

### Key Components
- **Runtime configs**: `.claude/mcp.json`, `opencode.json`, `.codex/config.toml`.
- **Docs**: ENV_REFERENCE, root README, v3.5.0.5 changelog.

### Data Flow
A launcher reads its runtime config env at startup; with the flag set, shutdown takes the release path instead of the kill path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Three runtime configs | Aligned on socket dirs, no re-election flag | Add the flag + note | grep shows the flag in all three; all parse |
| ENV_REFERENCE re-election row | Says experimental default-off | Update to config-default-on with the bound | row reflects the new posture |
| Root README reliability line | Says experimental default-off | Update to on-by-default | line reflects the new posture |
| .env.local | Held the machine-local opt-in | Remove the line | flag no longer in .env.local |

Required inventories:
- Configs surveyed: socket dirs aligned, no re-election flag in any of the three before this change.
- Bound: an unadopted released daemon self-exits at `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` (default 30), so worst case matches prior behavior.
- Invariant: each config parses after the edit; the launcher code default stays off.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Survey config alignment and current flag state
- [x] Confirm the idle-timeout bound on an unadopted daemon

### Phase 2: Core Implementation
- [x] Add the flag + note to all three configs
- [x] Remove the machine-local opt-in from .env.local
- [x] Reconcile ENV_REFERENCE, the README, and add the changelog

### Phase 3: Verification
- [x] All three configs parse; alignment confirmed
- [ ] Packet validated
- [ ] Commit, push, release notes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parse | The three configs | node JSON.parse, TOML check |
| Alignment | The flag present in all three | grep |
| Structure | The packet docs | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Idle-timeout default | Internal | Green | Without it an unadopted daemon would not be bounded |
| Re-election integration test (026) | Internal | Green | The decision path would be unverified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A daemon lease-state issue observed under the on-by-default rollout.
- **Procedure**: Set `SPECKIT_DAEMON_REELECTION` to `0` in the configs (one character per file) or revert the packet commit; the code default is already off.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
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
| Setup | Low | Done |
| Core Implementation | Low | Three config flags + docs |
| Verification | Low | Parse, validate, release notes |
| **Total** | | Part of one session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Code default stays off so the configs are the single revert point
- [x] Each config parse-checked
- [ ] Packet validated before commit

### Rollback Procedure
1. Set `SPECKIT_DAEMON_REELECTION` to `0` in the three configs, or `git revert` the packet commit.
2. Start a fresh session so the launcher reads the reverted value.
3. Confirm shutdown takes the kill path again.
4. No data reversal needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
