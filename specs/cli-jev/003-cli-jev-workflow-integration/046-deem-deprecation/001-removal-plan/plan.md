---
title: "Implementation Plan: Phase 1: removal-plan"
description: "Name every live Deem reference with the phase that removes it, and record the removal decisions, before any file outside this phase changes."
trigger_phrases:
  - "deem removal inventory plan"
  - "deem reference owner plan"
  - "removal decision record plan"
  - "one-mode hub rule plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: removal-plan

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, git grep |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The suites `../001-removal-plan/inventory.md` names |

### Overview
One inventory and four decisions that phases 002 to 004 work from. Workers are Luna 6 max fast on cli-codex and DeepSeek V4.1 Flash max on cli-pi. The session verifies each result, runs the suites and commits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. Evidence: `spec.md` sections 2 and 3.
- [x] Success criteria measurable. Evidence: `goal.md` section 3 names a command or artifact for each.
- [x] Dependencies identified. Evidence: `spec.md` Phase Context.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a removal driven by one inventory.

### Key Components
- **`../001-removal-plan/inventory.md`**: which file each phase owns and what happens to it.
- **The workers**: each takes one brief and edits only the files it names.

### Data Flow
The session writes a brief from the inventory, a worker edits, the session runs the checks and commits.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `inventory.md` | None | Create | Row count equals the command's file count |
| `decision-record.md` | None | Create | `validate.sh --strict` |

Required inventory: `../001-removal-plan/inventory.md`.
<!-- /ANCHOR:affected-surfaces -->

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
| Manual | Each inventory row against its file | Terminal |
| Integration | The hub check on the unchanged hub | `parent-skill-check.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001's inventory | Internal | Green | Owners are unknown |
| Luna and DeepSeek | External | Green | The edits wait |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an edit breaks a suite that passed at its baseline, or changes a default output.
- **Procedure**: `git revert` that commit. Each batch is its own commit.
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
| Setup | Low | Baselines |
| Core Implementation | Med | Worker runs |
| Verification | Med | Suites, review and gates |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes). Evidence: no data changes, and every batch is its own commit.
- [x] Feature flag configured. Evidence: not applicable to a removal.
- [x] Monitoring alerts set. Evidence: not applicable to offline scripts and docs.

### Rollback Procedure
1. `git revert <commit>` for the batch at fault.
2. Rerun that batch's checks from the reverted state.
3. Record the revert in `goal.md`'s log.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
