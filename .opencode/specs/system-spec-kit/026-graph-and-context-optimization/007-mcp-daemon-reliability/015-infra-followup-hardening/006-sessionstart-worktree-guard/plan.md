---
title: "Implementation Plan: Wire worktree-guard into the Claude SessionStart hook chain"
description: "Append worktree-guard.sh as a second non-fatal SessionStart hook step in .claude/settings.local.json after session-prime; verify JSON validity and 2-entry structure."
trigger_phrases:
  - "sessionstart worktree guard plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/006-sessionstart-worktree-guard"
    last_updated_at: "2026-05-31T00:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored plan to manifest scaffold"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".claude/settings.local.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003661"
      session_id: "036-006-plan"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Wire worktree-guard into the Claude SessionStart hook chain

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Claude hooks config (JSON) |
| **Framework** | Claude Code `.claude/settings.local.json` nested hook schema |
| **Storage** | n/a |
| **Testing** | JSON parse check + structural assertion (2 SessionStart hooks, guard second) |

### Overview
Append one additive command object to the `SessionStart[0].hooks` array so the chain runs `session-prime.js` then `worktree-guard.sh`. The guard is non-fatal by design. Mechanical edit delegated to a cli-opencode worker (edits-only); the Opus main loop verifies and owns the scope-guarded commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing SessionStart structure mapped (one session-prime hook)
- [x] worktree-guard.sh confirmed present + non-fatal (exits 0)
- [x] settings.local.json confirmed clean/valid before editing

### Definition of Done
- [x] SessionStart has 2 hooks (prime, then guard)
- [x] JSON parses; only SessionStart inner array changed
- [x] Packet validates strict
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Hook-chain composition: keep priming first (in-turn context), append the detect-and-warn guard as a later, non-blocking step.

### Key Components
- **session-prime.js**: existing first hook (unchanged).
- **worktree-guard.sh**: new second hook — warns on top-level main sessions, silent otherwise.

### Data Flow
SessionStart fires → session-prime primes memory context → worktree-guard checks git-dir vs git-common-dir + branch → warns to stderr if on shared main, else exits 0.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| .claude/settings.local.json SessionStart | hook chain | append guard step | node require() parses; inner hooks length == 2 |
| .opencode/bin/worktree-guard.sh | the guard script | unchanged (invoked) | exists; exits 0 |
| bin/README worktree section | documents the wiring | unchanged (cross-ref) | already present |

Required inventories:
- Claude is the active runtime; other runtimes' SessionStart equivalents deferred + noted.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm guard script + existing SessionStart structure + valid baseline

### Phase 2: Core Implementation
- [x] cli-opencode worker appends the guard hook object (edits-only)

### Phase 3: Verification
- [x] JSON parses; 2 hooks, guard second; only SessionStart changed; strict-validate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | JSON validity | node -e require() |
| Structural | 2 SessionStart hooks, guard second | node assertion |
| Structure | packet docs valid | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| worktree-guard.sh | Internal | Green (035, c657219dd9) | The script being wired |
| Claude hook schema | Runtime | Stable | Wiring target |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: guard noise unwanted, or JSON issue.
- **Procedure**: remove the appended hook object (or `git revert`); or set `SPECKIT_WORKTREE_GUARD=off` to silence without reverting.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm guard + structure) ──► Phase 2 (Append hook) ──► Phase 3 (Verify + commit)
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
| Setup | Low | confirm structure |
| Core Implementation | Low | 1 JSON object (delegated) |
| Verification | Low | parse + structural assert |
| **Total** | | **minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] JSON validity confirmed post-edit
- [x] Only SessionStart inner array changed (additive)

### Rollback Procedure
1. Remove the appended guard hook object (or `git revert` the commit).
2. No rebuild/test needed; or silence via `SPECKIT_WORKTREE_GUARD=off`.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
