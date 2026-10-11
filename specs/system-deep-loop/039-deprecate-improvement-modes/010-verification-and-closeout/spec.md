---
title: "Feature Specification: Phase 10: verification-and-closeout"
description: "The removal spans hundreds of files and must be proven complete. This phase regenerates every generated surface, runs every affected gate and the zero-reference search, and hands the worktree back for merge."
trigger_phrases:
  - "verification and closeout"
  - "phase 10 verification and closeout"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: verification-and-closeout

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
| **Phase** | 10 of 10 |
| **Predecessor** | 009-existing-issue-fixes |
| **Successor** | None |
| **Handoff Criteria** | All gates pass with no new failure against the baseline captured before phase 003. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the agent-improvement and model-benchmark removal packet. The program and its decisions are in `../002-removal-plan/plan.md` and `../002-removal-plan/decision-record.md`.

**Scope Boundary**: only the files in this folder's `scratch/` lists. Implementation runs in the git worktree.

**Dependencies**:
- Phases: 003 to 009

**Deliverables**:
- Regenerate Hermes skill mirrors, advisor command bridges and scoring compatibility, the skill graph, the trigger index, retrieval fixtures and the advisor compiled build
- Run every gate named by phases 003 to 009 plus the runtime-mirror doctor
- Run the zero-reference search with the fixed history exclusions
- Validate the whole packet

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A removal this wide can pass each phase's gate and still leave a stale generated copy or a broken route that only a whole-repo check sees.

### Purpose
Proof, from commands run on the final state, that both modes are gone and nothing else broke.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Regenerate Hermes skill mirrors, advisor command bridges and scoring compatibility, the skill graph, the trigger index, retrieval fixtures and the advisor compiled build
- Run every gate named by phases 003 to 009 plus the runtime-mirror doctor
- Run the zero-reference search with the fixed history exclusions
- Validate the whole packet

### Out of Scope
- New fixes - a failing gate sends the work back to the owning phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/files.txt` (17 files) | Delete/Modify | The exact file list this phase owns |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every gate passes on the final state. Verified by: each gate's exit status and output recorded |
| REQ-002 | Zero live references. Verified by: the search outside `specs/` and the history classes returns nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The packet validates. Verified by: `validate.sh --strict --recursive` passes |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All gates pass with no new failure against the baseline captured before phase 003.
- **SC-002**: The zero-reference search is empty.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 003 to 009 | Starting early breaks a gate | Follow the order in `../002-removal-plan/plan.md` |
| Risk | A gate was already failing before phase 003 | M | The baseline captured in the worktree separates old failures from new ones |
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
