---
title: "Implementation Plan: Vendored copy review fixes for mcp-click-up and mcp-figma"
description: "Apply each fix at its site, rerun the owning gates, then record the evidence."
trigger_phrases:
  - "vendored copy review fixes plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/023-vendored-copy-review-fixes"
    last_updated_at: "2026-10-21T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Opened the fix phase"
    next_safe_action: "Apply the fixes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "1004bf13-7863-4447-a63e-6ad2f5fcfd86"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Vendored copy review fixes for mcp-click-up and mcp-figma

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python, shell |
| **Framework** | None |
| **Storage** | The working tree |
| **Testing** | The gates that own each changed file |

### Overview
Each finding is fixed at the site the review names, after the line is reopened. The gates that own the changed files run after each batch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Gates passing
- [ ] Docs updated (spec, plan, tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the source, then rerun the owning gate

### Key Components
- **The findings**: the checked review findings named in spec.md
- **The gates**: the checks that own each changed file

### Data Flow
A finding names a site, the fix changes it, and the gate confirms the tree still passes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Changed scripts | Their self-tests and a direct run |
| Integration | Packet gates | The packet's validators |
| Manual | Changed prose | A reread of each changed line against its finding |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | Internal | Open | Order of work |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix that breaks a gate and cannot be repaired
- **Procedure**: `git checkout -- <path>` on that file only
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

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
| Setup | Low | 10 minutes |
| Core Implementation | Med | 60 minutes |
| Verification | Med | 30 minutes |
| **Total** | | **100 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created: git holds every tracked file
- [x] Feature flag: not applicable
- [x] Monitoring: the owning gates

### Rollback Procedure
1. Name the file that broke
2. `git checkout -- <path>`
3. Rerun its gate
4. Tell the operator

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
