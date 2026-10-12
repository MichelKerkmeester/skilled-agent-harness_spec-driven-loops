---
title: "Implementation Plan: Playbook path repair"
description: "Work the playbook validator's backticked path report package by package: correct moved paths, replace or drop removed targets, rewrite non-paths, and list what is left with a reason."
trigger_phrases:
  - "playbook path repair plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Playbook path repair

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown; Node.js CommonJS only if the validator changes |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The playbook validator itself; `node --test` for a validator rule |

### Overview
The builder captures the validator report, groups the warnings by package and by cause, and fixes each with the narrowest change: a corrected path, a successor, a removed reference, or text that no longer reads as a path. A validator rule is added only for one clearly marked class where rewriting every occurrence costs more. Whatever is left goes in a Remaining table with its reason.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: doc edits driven by a validator report

### Key Components
- **validate-playbook-package.cjs**: resolves each backticked path from the scenario, playbook, skill, hub and repository bases, and warns when none resolves
- **Playbook scenario files**: the edit targets

### Data Flow
The validator reads each scenario, extracts backticked paths and prints a warning per unresolved one. The builder edits the scenario and reruns the validator until the count equals the Remaining rows.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Playbook scenario and root files | Cite repo paths in backticks | Update | Validator count per package |
| `backtickPathChecks()` in the validator | Reports unresolved paths | Unchanged unless one narrow rule is the smallest fix | Its test, before and after |
| `path:line` citations into edited scenarios | Line anchors | Re-anchor if an edit shifts a cited line | `cite-drift-scan.mjs` |

Required inventories:
- Same-class producers: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict 2>&1 | grep BACKTICK_PATH_UNRESOLVED`.
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
| Integration | Warning count per package, before and after | The playbook validator |
| Unit | A narrow validator rule, only if one is added | `node --test` |
| Manual | Spot-check that each successor covers the same subject | Read the target file |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 bump | Internal | Parallel | The integrator raises the versions of this phase's docs after merging |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A correction points at the wrong file.
- **Procedure**: Revert that package's commit; each package is its own commit or a small group of them.
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
| Setup | Low | Capture and group the report |
| Core Implementation | Med | 258 warnings across 28 packages |
| Verification | Low | Rerun the validator and the citation scan |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The report before and after is saved in scratch

### Rollback Procedure
1. Revert the package commit that introduced the wrong path.
2. Rerun the validator and confirm the count.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; every change is a tracked file
<!-- /ANCHOR:enhanced-rollback -->
