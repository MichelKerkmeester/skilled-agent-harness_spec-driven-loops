---
title: "Implementation Plan: Phase 11: pre-existing-gate-failures"
description: "Fix the gate failures that predate the removal: the compiled-routing move simulation, the advisor's two Python-scorer misroutes and the broken-move drill's setup on the moved tree. Reclassify verify-authority's exit 2 as a status report."
trigger_phrases:
  - "pre existing gate failures plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: pre-existing-gate-failures

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS, Python, Bash |
| **Framework** | Compiled-routing authored program, `system-skill-advisor` local scorer, `.github/scripts/tests` |
| **Storage** | None |
| **Testing** | Bin vitest, advisor vitest, pytests and regression set, scorer-eval baseline compare, the broken-move drill on a scratch clone |

### Overview
Five defects, each with its own owner. The compiled-routing fix copies five runtime files back over their stale authored sources, since the sync build reads the authored program. The advisor and drill fixes run as two parallel DeepSeek dispatches with disjoint write paths. WU4 and WU5 were added when the drill and phrase-lint workers surfaced two more defects that also predate the removal. verify-authority is not a defect: exit 2 means no deep-loop mode has moved to the ledger writer yet, which is a rollout state.
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
- **WU1**: Sync five authored compiled-routing sources from the runtime copy
- **WU2**: Fix the Python scorer for P0-CHROME-002 and rr-iter3-156
- **WU3**: Make the broken-move drill run on the already-moved tree
- **WU4**: Make the phrase linter fail open when its YAML dependency is missing
- **WU5**: Drive the hook-installer harness through the source-root sentinel

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
| Check | Bin vitest passes | Brief VERIFY block |
| Check | Advisor vitest, pytests and regression pass | Brief VERIFY block |
| Check | Scorer-eval compare reports no regression | Brief VERIFY block |
| Check | Broken-move drill exits 0 on a scratch clone of the staged tree | Brief VERIFY block |
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
WU1 ‖ WU2 ‖ WU3 ──► WU4 ──► WU5 ──► verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| WU1 | previous phase | verify |
| WU2 | previous phase | verify |
| WU3 | previous phase | WU4 |
| WU4 | WU3, which surfaced it | WU5 |
| WU5 | WU4, which surfaced it | verify |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| WU1 | Medium | One DeepSeek turn plus checks |
| WU2 | Medium | One DeepSeek turn plus checks |
| WU3 | Medium | One DeepSeek turn plus checks |
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

