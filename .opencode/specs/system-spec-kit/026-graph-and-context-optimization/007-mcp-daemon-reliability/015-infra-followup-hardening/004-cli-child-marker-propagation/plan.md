---
title: "Implementation Plan: Propagate AI_SESSION_CHILD dispatch rule to remaining cli-* skills"
description: "Dispatch three additive ALWAYS-rule edits via cli-opencode (edits-only), then scope-guard-commit from the Opus main loop; reference the bin/README worktree contract."
trigger_phrases:
  - "cli child marker propagation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/004-cli-child-marker-propagation"
    last_updated_at: "2026-05-30T23:55:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored plan to manifest scaffold"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-gemini/SKILL.md"
      - ".opencode/skills/cli-devin/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003641"
      session_id: "036-004-plan"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Propagate AI_SESSION_CHILD dispatch rule to remaining cli-* skills

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs (cli-claude-code, cli-gemini, cli-devin) |
| **Framework** | sk-* skill ALWAYS/NEVER rule convention |
| **Storage** | n/a |
| **Testing** | grep count + comment-hygiene audit; strict-validate the packet |

### Overview
Three additive ALWAYS rules, one per remaining dispatcher skill, instructing the calling AI to set `AI_SESSION_CHILD=1` in the dispatched child's env, with the runtime-specific invocation pattern and a cross-ref to the bin/README contract. Mechanical edits executed by a cli-opencode worker (edits-only, no git); the Opus main loop verifies against ground truth and owns the scope-guarded commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] bin/README "Worktree session isolation" contract confirmed present
- [x] ALWAYS-rule structure mapped (claude-code → add 11; gemini → add 11; devin → add 16)
- [x] All three skills confirmed clean vs HEAD before editing

### Definition of Done
- [x] All three skills carry the rule; reference bin/README
- [x] Comment-hygiene clean; one hunk per file
- [x] Docs validate strict
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-as-contract: the wrapper enforces; the dispatcher skills tell the caller their half of the contract. Dispatcher-of-edits (cli-opencode) is mechanical; governance/commit stays with the conductor (Opus).

### Key Components
- **cli-claude-code ALWAYS rule 11**: `AI_SESSION_CHILD=1 claude -p ...`
- **cli-gemini ALWAYS rule 11**: `AI_SESSION_CHILD=1 gemini ...`
- **cli-devin ALWAYS rule 16**: `AI_SESSION_CHILD=1 devin ...`
- **bin/README "Worktree session isolation"**: the single source of the why/mechanism.

### Data Flow
Dispatcher reads skill → sets AI_SESSION_CHILD=1 → wrapper detects it → child exec's in parent worktree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| cli-claude-code ALWAYS | dispatch rules | add rule 11 | grep AI_SESSION_CHILD=1; +1/-0 |
| cli-gemini ALWAYS | dispatch rules | add rule 11 | grep AI_SESSION_CHILD=1; +1/-0 |
| cli-devin ALWAYS | dispatch rules | add rule 16 | grep AI_SESSION_CHILD=1; +1/-0 |
| bin/README worktree section | the contract | unchanged (cross-ref) | grep present |
| worktree-session.sh | the enforcer | unchanged | already reads AI_SESSION_CHILD |

Required inventories:
- The cli-* family has five dispatchers; 003 covered codex+opencode, 004 covers the remaining three. Family is now complete.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm bin/README contract + each skill's ALWAYS structure + clean baseline

### Phase 2: Core Implementation
- [x] cli-opencode worker adds the three rules (edits-only)

### Phase 3: Verification
- [x] grep each present + reference bin/README; hygiene 0; one-hunk diffs; strict-validate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | rule present + correct pattern per skill | grep |
| Hygiene | no ephemeral-pointer comments | ephemeral-pointer-audit.mjs |
| Structure | packet docs valid | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| bin/README worktree section | Internal | Green (035, c657219dd9) | Cross-ref target |
| worktree-session.sh AI_SESSION_CHILD read | Internal | Green (035) | The enforcement the docs describe |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a rule's wording or pattern is wrong.
- **Procedure**: revert the additive hunk(s) (doc-only). No code/test to roll back.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm) ──► Phase 2 (cli-opencode adds 3 rules) ──► Phase 3 (Verify + commit)
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
| Setup | Low | confirm contract + anchors |
| Core Implementation | Low | 3 rule additions (delegated) |
| Verification | Low | grep + hygiene + validate |
| **Total** | | **minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Doc-only, additive
- [x] One hunk per file (verified via diff numstat)

### Rollback Procedure
1. Revert each rule (or `git revert` the commit).
2. No rebuild/test needed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
