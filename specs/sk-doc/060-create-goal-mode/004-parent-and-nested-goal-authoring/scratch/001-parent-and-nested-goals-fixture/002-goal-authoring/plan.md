---
title: "Implementation Plan: Phase 2: goal-authoring"
description: "This phase derives three child goals from their own phase sources and checks their local criteria and boundaries."
trigger_phrases:
  - "child goal plan"
  - "goal authoring checks"
  - "phase-local goal criteria"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: goal-authoring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | system-spec-kit goal template and sk-create-goal standards |
| **Storage** | Three child packet folders |
| **Testing** | Source review, goal structure checks and strict validation |

### Overview
Read each child's own specification and acceptance criteria. Write one objective sentence, decisions and three to five phase-local criteria in each child goal, with no binding section.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1 confirms all child source pairs are present.
- [x] The system-spec-kit goal template and authoring standards are available.

### Definition of Done
- [x] Three child goals have one objective sentence and decisions.
- [x] Each child goal has three to five phase-local criteria.
- [x] No child goal contains a binding section.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three independent child goals share one template and derive content from separate phase-local sources.

### Key Components
- **Source pair**: Each child's `spec.md` and `acceptance-criteria.md`.
- **Goal document**: One objective, decisions and checkable criteria for that child.

### Data Flow
Read one child's source pair, derive its goal, then repeat for the other two children. Keep the parent binding out of all three child goals.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a documentation-authoring phase. No code producer, helper, policy or consumer changes.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Child source documents | Define each phase's purpose and criteria | Read only | Compare each goal with its own source pair. |
| Child goal documents | Record phase-local directives | Modify | Check objective, decisions, criterion count and binding absence. |

Required inventories:
- Same-class producers: Not applicable. No code producer changes.
- Consumers of changed symbols: Not applicable. No symbols change.
- Matrix axes: Three source pairs and three corresponding child goals.
- Algorithm invariant: A child goal uses only its own phase sources and has no binding block.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Author one goal per child, compare each with that child's sources, then verify that all three have the required local structure. The task checklist records the result.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source trace | Each child goal against its own specification and criteria | Read the six source and goal documents. |
| Structure check | Objective, decisions, three to five criteria and no binding section | Read the three `goal.md` files. |
| Packet gate | Final fixture and child documents | Recursive strict `validate.sh`. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 source audit | Internal | Complete | The folder set and sources would need rechecking. |
| Goal template and standards | Internal | Available | Goal structure and criteria would lack their owner contract. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A child goal conflicts with its source or contains parent-level binding content.
- **Procedure**: Restore the original whole-file text from the pre-write read, correct the phase-local goal and recheck it against that child's sources.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| source-audit | Parent map and child source pairs | goal-authoring |
| goal-authoring | Completed source audit | binding-check |
| binding-check | Three source-derived child goals | Recursive validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Source review | Low | 15 minutes |
| Goal authoring | Low | 30 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **60 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes or deployment are in scope.
- [x] Original child goal files were read before rewriting.
- [x] The write set remains inside this fixture.

### Rollback Procedure
1. Restore the original whole-file text for any goal that needs reversal.
2. Reopen that child's specification and acceptance criteria.
3. Rerun recursive strict validation after the goal is corrected.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable. This phase changes documentation only.
<!-- /ANCHOR:enhanced-rollback -->

---
