---
title: "Implementation Plan: Phase 4: commands-and-runtime-mirrors"
description: "Delete the two retired /deep commands, their six assets, the deep-improvement agent and every runtime copy and symlink, and remove their index entries, the task-dispatch guard entry and the codex agent setting."
trigger_phrases:
  - "commands and runtime mirrors plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: commands-and-runtime-mirrors

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, TOML, CommonJS |
| **Framework** | `.skilled/commands`, `.skilled/agents`, runtime mirrors in six CLI directories |
| **Storage** | None |
| **Testing** | Mirror generators in `--check` mode, broken-symlink scan |

### Overview
Commands and the agent are sources; every runtime copy is either a tracked symlink or a generated file. One work unit deletes sources, copies and symlinks together so nothing dangles, then edits the indexes. The generators run in `--check` mode afterwards to prove the copies match their deleted sources.
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
- **WU1**: Delete commands, assets, agent, copies and six symlinks; edit nine index and guard files

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
| Check | Each generator `--check` exits 0 | Brief VERIFY block |
| Check | No broken tracked symlink | Brief VERIFY block |
| Check | Dispatch-guard set holds two agents | Brief VERIFY block |
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
WU1 ──► verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| WU1 | previous phase | verify |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| WU1 | Medium | One DeepSeek turn plus checks |
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

