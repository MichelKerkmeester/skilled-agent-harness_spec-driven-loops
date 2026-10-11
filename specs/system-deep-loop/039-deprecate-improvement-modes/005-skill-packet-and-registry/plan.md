---
title: "Implementation Plan: Phase 5: skill-packet-and-registry"
description: "Delete the deep-improvement packet with its changelog kept, remove both modes from the hub registry, router, metadata and compiled-routing stage, and update the hub docs, catalog and playbook."
trigger_phrases:
  - "skill packet and registry plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: skill-packet-and-registry

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON, CommonJS, Markdown |
| **Framework** | `system-deep-loop` hub, compiled-routing stage for the hub, leaf-manifest generator |
| **Storage** | None |
| **Testing** | Leaf-manifest `--check`, compiled-route guard, router-sync guard, compiler build |

### Overview
The packet goes whole, but its changelog moves to `.skilled/changelog/system-deep-loop/deep-improvement/` so history survives (ADR-005). Registry JSON changes first, then the leaf manifest is regenerated, then the compiled-routing compiler drops its shared-packet invariant, then docs follow. Five work units, run in order.
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
- **WU1**: Move the changelog out, delete the packet and `leaf-scopes.json`
- **WU2**: Registry, router, metadata and rollout JSON; regenerate the leaf manifest
- **WU3**: Compiled-routing compiler, canary router comment and canary cases
- **WU4**: Hub SKILL, README, ARCHITECTURE, ROUTER, sibling and shared READMEs
- **WU5**: Feature catalog and manual-testing playbook

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
| Check | Leaf-manifest `--check` exits 0 | Brief VERIFY block |
| Check | Compiled-route guard matches baseline | Brief VERIFY block |
| Check | Router-sync guard matches baseline | Brief VERIFY block |
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

