---
title: "Implementation Plan: Worktree child-marker dispatch documentation"
description: "Add one ALWAYS rule to cli-codex and cli-opencode telling dispatchers to set AI_SESSION_CHILD=1 so orchestrated children share the parent worktree; reference the bin/README contract."
trigger_phrases:
  - "worktree child-marker dispatch plan"
  - "AI_SESSION_CHILD cli rule plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/003-worktree-child-marker-dispatch"
    last_updated_at: "2026-05-30T23:25:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored plan to manifest scaffold"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003621"
      session_id: "036-003-plan"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Worktree child-marker dispatch documentation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs (cli-codex, cli-opencode) |
| **Framework** | sk-* skill ALWAYS/NEVER rule convention |
| **Storage** | n/a |
| **Testing** | grep count + comment-hygiene audit; strict-validate the packet |

### Overview
Two additive ALWAYS rules, one per dispatcher skill, instructing the calling AI to set `AI_SESSION_CHILD=1` in the dispatched child's env, with the runtime-specific invocation pattern and a cross-ref to the bin/README contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] bin/README "Worktree session isolation" contract confirmed present
- [x] ALWAYS-rule structure of both skills mapped (cli-codex rule 12 → add 13; cli-opencode rule 14 → add 15)
- [x] Both skills confirmed clean vs HEAD before editing

### Definition of Done
- [x] Both skills carry the rule; reference bin/README
- [x] Comment-hygiene clean; one hunk per file
- [x] Docs validate strict
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-as-contract: the wrapper enforces; the dispatcher skills tell the caller their half of the contract.

### Key Components
- **cli-codex ALWAYS rule 13**: `AI_SESSION_CHILD=1 codex exec ...`
- **cli-opencode ALWAYS rule 15**: `AI_SESSION_CHILD=1 opencode run ...`
- **bin/README "Worktree session isolation"**: the single source of the why/mechanism.

### Data Flow
Dispatcher reads skill → sets AI_SESSION_CHILD=1 → wrapper detects it → child exec's in parent worktree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| cli-codex/SKILL.md ALWAYS | dispatch rules | add rule 13 | grep AI_SESSION_CHILD=1; one-hunk diff |
| cli-opencode/SKILL.md ALWAYS | dispatch rules | add rule 15 | grep AI_SESSION_CHILD=1; one-hunk diff |
| bin/README worktree section | the contract | unchanged (cross-ref) | grep "Worktree session isolation" present |
| worktree-session.sh | the enforcer | unchanged | already reads AI_SESSION_CHILD |

Required inventories:
- Confirmed the two skills are the primary child-spawning dispatchers for this repo's worktree flow; cli-claude-code/gemini/devin deferred and noted.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm bin/README contract + both skills' ALWAYS structure + clean baseline

### Phase 2: Core Implementation
- [x] Add cli-codex rule 13
- [x] Add cli-opencode rule 15

### Phase 3: Verification
- [x] grep both present + reference bin/README; hygiene 0; strict-validate
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

- **Trigger**: the rule wording is wrong or misleading.
- **Procedure**: revert the two one-hunk additions (doc-only). No code/test to roll back.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm contract + structure) ──► Phase 2 (Add 2 rules) ──► Phase 3 (Verify)
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
| Core Implementation | Low | 2 rule additions |
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
1. Revert the rule in each skill (or `git revert` the commit).
2. No rebuild/test needed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
