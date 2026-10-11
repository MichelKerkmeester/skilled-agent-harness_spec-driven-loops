---
title: "Implementation Plan: Phase 10: verification-and-closeout"
description: "Regenerate every derived surface, run every gate from phases 003 to 009 against the baseline, prove zero live references and validate the whole packet."
trigger_phrases:
  - "verification and closeout plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: verification-and-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Generators and test runners |
| **Framework** | Hermes mirrors, advisor bridges and graph, trigger index, retrieval fixtures, advisor dist |
| **Storage** | None |
| **Testing** | Every gate in `scratchpad/gates.sh` plus the supplementary checks |

### Overview
The orchestrator runs this phase. Generators rebuild the derived files from the edited sources; then the full gate list runs and is compared with the baseline captured before phase 003; then the zero-reference search runs with the history exclusions; then the packet validates recursively. Merging the worktree branch is the operator's call.
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
- **R1**: Run the generators for the 17 derived files
- **R2**: Run every gate and compare with the baseline
- **R3**: Zero-reference search
- **R4**: `validate.sh --strict --recursive` on the packet

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
| Check | Every gate matches or beats baseline | Brief VERIFY block |
| Check | Zero-reference search is empty | Brief VERIFY block |
| Check | Recursive strict validation passes | Brief VERIFY block |
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
R1 ──► R2 ──► R3 ──► R4 ──► verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| R1 | previous phase | R2 |
| R2 | R1 | R3 |
| R3 | R2 | R4 |
| R4 | R3 | verify |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| R1 | Medium | One DeepSeek turn plus checks |
| R2 | Medium | One DeepSeek turn plus checks |
| R3 | Medium | One DeepSeek turn plus checks |
| R4 | Medium | One DeepSeek turn plus checks |
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

