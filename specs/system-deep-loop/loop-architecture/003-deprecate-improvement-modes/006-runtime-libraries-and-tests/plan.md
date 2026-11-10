---
title: "Implementation Plan: Phase 6: runtime-libraries-and-tests"
description: "Delete the nine improvement-family runtime libraries and their tests, remove the family from the gateway, authority order, adjudication, projections, conflict graph and validators, and update the remaining tests and plugin guard tests."
trigger_phrases:
  - "runtime libraries and tests plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: runtime-libraries-and-tests

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS, Markdown |
| **Framework** | `system-deep-loop/runtime`, OpenCode plugin guards |
| **Storage** | None |
| **Testing** | Runtime typecheck and vitest suite, runtime validators, plugin guard `node --test` |

### Overview
The improvement family is agent-improvement, model-benchmark, the retired skill-benchmark lane and their deep-improvement-common base. Deleting the libraries first makes the typecheck name every importer; the second unit fixes library code and scripts until the typecheck is clean outside tests; the third fixes tests and the plugin guards; the fourth fixes four docs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] File list fixed (`scratch/files.txt`)
- [x] Work-unit briefs written (`scratch/brief-*.md`)
- [x] Gate baselines captured in the worktree

### Definition of Done
- [ ] Every row of `acceptance-criteria.md` is Met
- [ ] Each work unit's diff stays inside its brief's allowed paths
- [ ] `validate.sh --strict` passes on this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-first removal: edit or delete the source, then regenerate what derives from it. Never hand-edit a generated file.

### Key Components
- **WU1**: Delete nine library folders, one contract and twelve test files
- **WU2**: Fix fifteen library and script files until the typecheck is clean
- **WU3**: Fix the remaining tests and both plugin guard tests
- **WU4**: Fix four runtime docs

### Data Flow
Each work unit runs as one DeepSeek dispatch in the worktree after a tree snapshot; the orchestrator checks the diff against the brief and runs the phase checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scratch/files.txt` | Every file this phase owns | Delete or edit per the briefs | Each brief's VERIFY block |
| Derived files | Built from these sources | Regenerated in phase 010 unless a brief names its generator | Phase 010 gates |

Same-class producers and consumers were inventoried by the two research runs in `../001-removal-research/`.
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
| Check | Runtime typecheck exits 0 | Brief VERIFY block |
| Check | Runtime suite matches or beats baseline | Brief VERIFY block |
| Check | Runtime validators match baseline | Brief VERIFY block |
| Check | Plugin guard tests pass | Brief VERIFY block |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Earlier phases in `../002-removal-plan/plan.md` | Internal | Ordered | Work units assume their edits exist |
| DevPass DeepSeek V4.1 Flash | External | Green | Fall back to Cline at `xhigh`, then wait for the DevPass reset |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a diff leaves its allowed paths or a check falls below its baseline.
- **Procedure**: `git read-tree -u --reset <snapshot>` with the tree `dispatch.sh` recorded before that work unit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
WU1 ──► WU2 ──► WU3 ──► WU4 ──► verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| WU1 | previous phase | WU2 |
| WU2 | WU1 | WU3 |
| WU3 | WU2 | WU4 |
| WU4 | WU3 | verify |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| WU1 | Medium | One DeepSeek turn plus checks |
| WU2 | Medium | One DeepSeek turn plus checks |
| WU3 | Medium | One DeepSeek turn plus checks |
| WU4 | Medium | One DeepSeek turn plus checks |
| **Total** | | **Assumed from the research runs' turn times, not measured** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Worktree isolates main
- [ ] Tree snapshot recorded before each work unit

### Rollback Procedure
1. Restore the snapshot tree of the failing work unit.
2. Rerun that unit's VERIFY block.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

