---
title: "Feature Specification: Phase 8: docs-and-readmes"
description: "The root README, env examples, benchmark READMEs and the gitignored BARTER.md still describe the removed modes as live. This phase removes or rewrites those mentions and adds the retirement note to the hub changelog."
trigger_phrases:
  - "docs and readmes"
  - "phase 8 docs and readmes"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: docs-and-readmes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | worktree branch from sk-git's allocator |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 10 |
| **Predecessor** | 007-advisor-and-cross-skill-wiring |
| **Successor** | 009-existing-issue-fixes |
| **Handoff Criteria** | The repo-wide search finds the modes only in history files and `specs/`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the agent-improvement and model-benchmark removal packet. The program and its decisions are in `../002-removal-plan/plan.md` and `../002-removal-plan/decision-record.md`.

**Scope Boundary**: only the files in this folder's `scratch/` lists, plus `BARTER.md` on main. Implementation runs in the git worktree.

**Dependencies**:
- Phases: 007

**Deliverables**:
- Root `README.md`, `.env.example`, `hook-flags.env.example`
- Benchmark READMEs: keep archive-status lines, drop any claim that the modes run today
- `BARTER.md` on main, after a backup, removing the whole improvement and benchmark command row
- A system-deep-loop changelog entry recording the retirement

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Readers and models follow the root README and BARTER.md to commands that will no longer exist. `BARTER.md` also lists `/deep:skill-benchmark` and `/deep:ai-system-improvement`, which do not exist today.

### Purpose
Every live document describes the three remaining modes only, and history files stay as they are.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root `README.md`, `.env.example`, `hook-flags.env.example`
- Benchmark READMEs: keep archive-status lines, drop any claim that the modes run today
- `BARTER.md` on main, after a backup, removing the whole improvement and benchmark command row
- A system-deep-loop changelog entry recording the retirement

### Out of Scope
- Changelogs and benchmark reports - history (ADR-005)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/files.txt` (18 files) | Delete/Modify | The exact file list this phase owns |
| `BARTER.md` (gitignored, main checkout) | Modify | Remove the improvement and benchmark command row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No live doc presents a removed mode as available. Verified by: `rg` over the listed files and `BARTER.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | `BARTER.md` keeps a backup. Verified by: backup file exists before the edit |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The repo-wide search finds the modes only in history files and `specs/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 007 | Starting early breaks a gate | Follow the order in `../002-removal-plan/plan.md` |
| Risk | `BARTER.md` is gitignored and not in the worktree | M | Edited on main after a backup copy |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each DeepSeek work unit carries one change set, short enough to finish in one dispatch.

### Security
- **NFR-S01**: Every dispatch names banned operations and allowed write paths and runs in the worktree.

### Reliability
- **NFR-R01**: Each work unit has a tree snapshot to roll back to.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Generated files are never hand-edited; phase 010 regenerates them.

### Error Scenarios
- A work unit writes outside its list: restore the snapshot and re-dispatch with the brief corrected.
- DevPass hits its limit: fall back to Cline at `xhigh`, then wait for the reset.

### State Transitions
- Partial phase: `tasks.md` marks each finished work unit with its snapshot hash.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Files in `scratch/files.txt` |
| Risk | 12/25 | Shared contracts; reversible by snapshot |
| Research | 3/20 | Done in phase 001 |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. Decisions are in `../002-removal-plan/decision-record.md`.
<!-- /ANCHOR:questions -->

---
