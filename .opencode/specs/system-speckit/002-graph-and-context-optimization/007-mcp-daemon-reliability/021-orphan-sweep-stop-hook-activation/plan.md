---
title: "Implementation Plan: Orphan-sweep Stop-hook activation"
description: "Add a flag-gated, default-off fallback in session-cleanup.sh that delegates the no-session-pid case to the orphan-only sweeper, with a dry-run ramp."
trigger_phrases:
  - "orphan sweep stop hook plan"
  - "session-cleanup fallback plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/021-orphan-sweep-stop-hook-activation"
    last_updated_at: "2026-06-07T17:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented + tested the flag-gated orphan-sweep fallback"
    next_safe_action: "Phase 022 RC-2 ownership re-election"
    blockers: []
    key_files:
      - ".opencode/scripts/session-cleanup.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-021-orphan-sweep-stop-hook-activation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Orphan-sweep Stop-hook activation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (Stop-hook scripts) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest shelling out + bash -n |

### Overview
`session-cleanup.sh` gains a `run_orphan_sweep_fallback` invoked only in the no-session-pid branch. It reads `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` (off/dry-run/live) and delegates to the orphan-only `orphan-mcp-sweeper.sh` (path overridable for tests). The session-scoped kill path is untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Flag-gated fallback delegating to an existing safe reaper.

### Key Components
- **`run_orphan_sweep_fallback`**: maps the flag to off / dry-run / live.
- **`orphan-mcp-sweeper.sh`**: the orphan-only reaper (reused).

### Data Flow
Stop hook -> session-cleanup.sh -> no session pid -> [flag] -> orphan-mcp-sweeper.sh (--dry-run | live) | no-op.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `session-cleanup.sh` no-pid branch | pure no-op | add flag-gated fallback | gating tests |
| `orphan-mcp-sweeper.sh` | orphan-only reaper | reused unchanged | invoked via override stub |
| Stop-hook wiring (settings) | already calls session-cleanup.sh | unchanged | no settings edit |

Required inventories:
- Consumers: the Stop hook only; session-scoped path unchanged.
- Matrix axes: {flag: off/dry-run/live/unknown} x {session pid present?} covered by tests.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm session-cleanup.sh refuses pid-guessing + the orphan-sweeper is pid-independent + dry-run capable
- [x] Confirm the Stop hook already invokes session-cleanup.sh

### Phase 2: Core Implementation
- [x] Add SCRIPT_DIR + flag + sweeper-path override vars
- [x] Add `run_orphan_sweep_fallback` + wire it into the no-session-pid branch

### Phase 3: Verification
- [x] `bash -n` + functional smoke (off/dry-run/live)
- [x] vitest gating tests via a stub sweeper
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | flag -> mode gating | vitest (execFileSync) + stub |
| Syntax | shell validity | bash -n |
| Manual | off/dry-run/live smoke | bash |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `orphan-mcp-sweeper.sh` | Internal | Green | reused unchanged |
| Stop-hook wiring | Internal | Green | already present |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any unexpected reap behavior.
- **Procedure**: unset `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` (instant; back to no-op) or `git revert`.
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
| Core Implementation | Low | <1 hour |
| Verification | Low | 1 hour |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Default-off (no behavior change without opt-in)
- [x] Orphan-only delegation (no cross-session kill)
- [x] Dry-run ramp available

### Rollback Procedure
1. Unset `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` to disable instantly.
2. `git revert` the script change if needed.
3. Re-run the gating tests.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
