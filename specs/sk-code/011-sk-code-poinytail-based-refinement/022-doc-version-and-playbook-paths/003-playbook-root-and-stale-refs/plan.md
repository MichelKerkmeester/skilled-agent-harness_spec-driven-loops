---
title: "Implementation Plan: Playbook root and stale refs"
description: "Add the root file to the validator's backticked path check, work the 70 root warnings package by package, and fix the six stale references phase 002 listed."
trigger_phrases:
  - "playbook root and stale refs plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Playbook root and stale refs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS for the validator; Markdown for the rest |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The validator's own test file; the validator itself |

### Overview
One line in `validatePackage` runs `backtickPathChecks` on the root file next to the scenario loop, and a test case appends a missing path to a fixture root. The builder then reads each root warning's target, decides the correction and dispatches it as a literal replacement. The six stale references follow the same path. Whatever is left goes in a Remaining table with its reason.
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
- [ ] Tests passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: one validator call plus doc edits driven by its report

### Key Components
- **`validatePackage()`**: already reads the root file for its execution contract and census checks; it gains the backticked path check
- **`backtickPathChecks()`**: unchanged; resolves each path from the file, playbook, skill, hub and repository bases

### Data Flow
The validator reads each root file once, extracts backticked paths and prints a warning per unresolved one under the file name `manual-testing-playbook.md`. The builder edits the root file and reruns the validator until the root count equals the Remaining rows.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `validatePackage()` | Runs the backtick check on scenarios only | Update: also on the root file | Its test, before and after |
| 13 root playbook files | Cite repo paths in backticks | Update | Validator root count |
| Six stale references | Name moved or missing targets | Update | A grep per row |
| `path:line` citations into edited docs | Line anchors | Re-anchor if an edit shifts a cited line | `cite-drift-gate.mjs` |

Required inventories:
- Same-class producers: the validator's root warnings, and a repo-wide grep for each stale token before it is fixed.
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
| Unit | Root-file backtick case | `validate-playbook-package.test.cjs` |
| Integration | Root and scenario counts, before and after | The playbook validator |
| Manual | Each correction names the file the text means | Read the target file |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 on main | Internal | Done | None |
| cli-pi with DeepSeek V4.1 Flash on DevPass | External | Available | Fall back to the Cline route on a usage limit |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A correction points at the wrong file, or the root check misreports.
- **Procedure**: Revert the commit that carries it; the validator change and the doc fixes are separate commits.
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
| Setup | Low | Measure the root warnings |
| Core Implementation | Low | One validator line, 70 root warnings, six references |
| Verification | Low | Validator, tests, gates |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The validator report before and after is saved in scratch

### Rollback Procedure
1. Revert the commit that introduced the wrong change.
2. Rerun the validator and its tests.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; every change is a tracked file
<!-- /ANCHOR:enhanced-rollback -->
