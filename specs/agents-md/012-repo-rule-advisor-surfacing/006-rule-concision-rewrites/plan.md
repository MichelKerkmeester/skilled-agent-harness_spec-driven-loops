---
title: "Implementation Plan: Rule concision rewrites"
description: "Apply the part table from the research to each rule, densest-risk first: the two existing drafts, then the other 11. Each rewrite ships with a ledger and must pass the ten-check gate."
trigger_phrases:
  - "rule concision rewrites plan"
  - "shorter repo rules plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Rule concision rewrites

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | `sk-create-repo-rule` authoring mode |
| **Storage** | None |
| **Testing** | `check-repo-rules.cjs`, phase 004 analyzer |

### Overview
Apply the part table from the research to each rule, densest-risk first: the two existing drafts, then the other 11. Each rewrite ships with a ledger and must pass the ten-check gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement backed by measurement in `002-rule-concision-and-loading`
- [ ] Predecessor handoff met: Phase 004 baseline committed
- [x] Affected files identified by codebase exploration

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests and checks named in the testing strategy pass
- [ ] spec.md, plan.md and tasks.md synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Rule-by-rule rewrite with an audit ledger

### Key Components
- **`sk-create-repo-rule` mode**: the authoring workflow for repo rules, named here so it binds the implementer
- **Ledgers**: the per-rule record that makes each cut reviewable

### Data Flow
Each rule goes from the current file through the part classification to a rewrite and a ledger, then through the checker and a second-reviewer comparison.

### Decision
**ADR-001: Keep failure-naming sentences.** The `swe-2-max` drafts drop every "The failure this prevents" line. Their effect on compliance is UNKNOWN, so cutting them would change two variables at once. They stay until a test shows they carry nothing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| 13 rule files | The text Gate 5 loads | Update | Ledger plus checker |
| `AGENTS.md:28,144,255` and `creation-standards.md:40-44` | Section references into rules | Unchanged | `rg` confirms each target section still exists |
| `check-repo-rules.cjs` check 9 | Index summary equals description | Unchanged unless a description changes | Checker output |
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
| Integration | Ten-check corpus gate | `check-repo-rules.cjs` |
| Manual | Second-reviewer ledger comparison | Diff review |
| Measurement | Post-change window | Phase 004 analyzer |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 baseline | Internal | Yellow | No before and after comparison |
| Phase 005 check 10 | Internal | Yellow | Router drift goes unchecked during rewrites |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A rewrite loses a norm or the post-change window worsens a measured check
- **Procedure**: Revert that rule's commit. Each rule is its own commit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 004 baseline committed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | 007-table-wording-experiment |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | High | 12-16 hours |
| Verification | Med | 3-4 hours |
| **Total** |  | **16-21 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Each change lands as its own revertable commit
- [ ] The checks in the testing strategy pass before the commit

### Rollback Procedure
1. Revert that rule's commit. Each rule is its own commit.
2. Rerun the checks named in the testing strategy on the reverted tree.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
