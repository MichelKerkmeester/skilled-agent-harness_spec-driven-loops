---
title: "Implementation Plan: Gate 5 card pilot"
description: "Generate cards from the rules so they cannot drift, then rotate three loading arms through pre-registered blocks and decide from the measured checks and fallbacks."
trigger_phrases:
  - "gate 5 card pilot plan"
  - "card plus self-check plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Gate 5 card pilot

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS), Markdown, Python analyzer |
| **Framework** | None |
| **Storage** | Generated card files |
| **Testing** | pytest for the generator and check 11, phase 004 analyzer |

### Overview
Generate cards from the rules so they cannot drift, then rotate three loading arms through pre-registered blocks and decide from the measured checks and fallbacks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement backed by measurement in `002-rule-concision-and-loading`
- [ ] Predecessor handoff met: Phase 003 shipped (AGENTS.md budget)
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
Generated derivative plus rotating-arm pilot

### Key Components
- **Generator**: cuts each rule's Fires when, The rule and SELF-CHECK sections into a card with a link to the full file
- **Check 11**: regenerates and compares, so a stale card fails CI
- **Arms**: router and `AGENTS.md` variants swapped by commit at block boundaries

### Data Flow
Rules feed the generator, cards land under `cards/`, the router or `AGENTS.md` points at them per arm, and the analyzer attributes each reply to the arm live at its timestamp.

### Decision
**ADR-001: Generated card files instead of line-range reads.** A router line telling the model to read a line range of each rule would avoid new files, but the range moves with every edit and the SELF-CHECK is not adjacent to The rule. Generated cards with a sync check cost 13 derived files and one check, and they cannot drift silently.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-repo-rules.cjs` file discovery | Reads every `*.md` in the rules directory | Unchanged if `cards/` is a subdirectory | T001 confirms the readdir filter ignores directories |
| `REPO RULES.md` Load column | What Gate 5 loads | Variant per arm | Block commits |
| `AGENTS.md` §8 | Reply-rule load line | Variant in arm C | Phase 003 guard still passes |
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
| Unit | Generator determinism and check 11 drift detection | pytest |
| Integration | Corpus gate with cards present | `check-repo-rules.cjs` |
| Measurement | Rotating blocks | Phase 004 analyzer |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 guard | Internal | Yellow | Arm C could break the delivery prefix |
| Phase 004 analyzer | Internal | Yellow | No attribution by arm |
| Phase 007 closed | Internal | Yellow | Windows overlap |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A card arm worsens a measured check, or the pilot is abandoned
- **Procedure**: Revert the arm commit. If both card arms are rejected, delete the generator, `cards/` and check 11.
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
| Setup | Phase 003 shipped (AGENTS.md budget) | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 3-4 hours |
| Core Implementation | Med | 4-6 hours plus the measurement blocks |
| Verification | Med | 3-4 hours |
| **Total** |  | **10-14 hours of work across several weeks of blocks** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Each change lands as its own revertable commit
- [ ] The checks in the testing strategy pass before the commit

### Rollback Procedure
1. Revert the arm commit. If both card arms are rejected, delete the generator, `cards/` and check 11.
2. Rerun the checks named in the testing strategy on the reverted tree.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
