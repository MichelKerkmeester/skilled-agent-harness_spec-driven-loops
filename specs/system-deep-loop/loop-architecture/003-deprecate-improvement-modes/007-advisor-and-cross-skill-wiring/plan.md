---
title: "Implementation Plan: Phase 7: advisor-and-cross-skill-wiring"
description: "Remove both modes from the skill advisor's aliases, anchors, projections and Python router, trim sk-create-benchmark to its two remaining families, and clear the remaining sk-doc, CLI-skill, sk-code and system-spec-kit mentions."
trigger_phrases:
  - "advisor and cross skill wiring plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: advisor-and-cross-skill-wiring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Python, CommonJS, JSON, Markdown |
| **Framework** | `system-skill-advisor`, `sk-doc`, CLI skills, `sk-code`, `system-spec-kit` |
| **Storage** | None |
| **Testing** | Advisor typecheck, vitest, Python tests and regression set; sk-doc node and Python tests; leaf-manifest `--check` |

### Overview
Five work units split by owner. The advisor unit edits sources only; generated bridges and the skill graph are regenerated in phase 010. The sk-create-benchmark unit deletes the model_benchmark and agent_improvement families (ADR-003) and adds a changelog entry.
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
- **WU1**: Advisor aliases, anchors, projections, Python router, fixtures and tests
- **WU2**: sk-create-benchmark families, docs, playbook, test and changelog
- **WU3**: sk-doc hub, shared tooling and code-folder fixtures; regenerate its leaf manifest
- **WU4**: CLI skills, cli-classifier and sk-code docs and drift-guard script
- **WU5**: system-spec-kit references, ENV reference and two tests

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
| Check | Advisor suites match or beat baseline | Brief VERIFY block |
| Check | sk-doc tests match or beat baseline | Brief VERIFY block |
| Check | rg over each unit's files finds no live mention | Brief VERIFY block |
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
WU1 ──► WU2 ──► WU3 ──► WU4 ──► WU5 ──► verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| WU1 | previous phase | WU2 |
| WU2 | WU1 | WU3 |
| WU3 | WU2 | WU4 |
| WU4 | WU3 | WU5 |
| WU5 | WU4 | verify |
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
| WU5 | Medium | One DeepSeek turn plus checks |
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

