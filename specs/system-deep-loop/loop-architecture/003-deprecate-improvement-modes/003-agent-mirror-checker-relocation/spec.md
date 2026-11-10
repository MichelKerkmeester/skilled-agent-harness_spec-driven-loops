---
title: "Feature Specification: Phase 3: agent-mirror-checker-relocation"
description: "The agent mirror checker that guards every agent edit lives inside the deep-improvement packet, which this program deletes. This phase moves it and its tests to .skilled/bin/ and repoints every caller."
trigger_phrases:
  - "agent mirror checker relocation"
  - "phase 3 agent mirror checker relocation"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: agent-mirror-checker-relocation

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
| **Phase** | 3 of 10 |
| **Predecessor** | 002-removal-plan |
| **Successor** | 004-commands-and-runtime-mirrors |
| **Handoff Criteria** | `node .skilled/bin/check-agent-mirror-sync.cjs --all` exits 0 in the worktree. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the agent-improvement and model-benchmark removal packet. The program and its decisions are in `../002-removal-plan/plan.md` and `../002-removal-plan/decision-record.md`.

**Scope Boundary**: only the files in this folder's `scratch/` lists. Implementation runs in the git worktree.

**Dependencies**:
- Phases: None

**Deliverables**:
- Move the five files listed in `scratch/moves.txt` to `.skilled/bin/`
- Repoint the nine callers in `scratch/files.txt`
- Make the moved tests run under `.skilled/bin/vitest.config.bin.ts`
- Add the checker to `.skilled/bin/README.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`check-agent-mirror-sync.cjs` sits in `deep-improvement/scripts/`, yet both pre-commit hooks, the `agent-mirror-sync.yml` workflow, the broken-move CI drill and three docs call it by that path. Deleting the packet without moving it first would break commits that touch agents and fail CI.

### Purpose
The checker runs from `.skilled/bin/` and every caller points there, before the packet is deleted.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the five files listed in `scratch/moves.txt` to `.skilled/bin/`
- Repoint the nine callers in `scratch/files.txt`
- Make the moved tests run under `.skilled/bin/vitest.config.bin.ts`
- Add the checker to `.skilled/bin/README.md`

### Out of Scope
- Deleting the rest of the packet - phase 005
- Changing the checker's behaviour - a move only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/files.txt` (9 files) | Delete/Modify | The exact file list this phase owns |
| `scratch/moves.txt` (5 moves) | Move | Checker, lib, two tests and the crosswalk doc to `.skilled/bin/` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every caller resolves the checker at its new path. Verified by: `rg check-agent-mirror-sync` outside history and `specs/` shows only `.skilled/bin/` paths |
| REQ-002 | The moved tests pass. Verified by: bin vitest run passes both moved suites |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The hook suite and the drill pass. Verified by: `pre-commit.test.sh` and `broken-move-drill.sh` exit 0 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/bin/check-agent-mirror-sync.cjs --all` exits 0 in the worktree.
- **SC-002**: The git-hook test suite passes against the new path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases None | Starting early breaks a gate | Follow the order in `../002-removal-plan/plan.md` |
| Risk | CI still names the old `.opencode/skills/...` path | H | The broken-move drill checks the workflow's checker path |
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
| Scope | 6/25 | Files in `scratch/files.txt` |
| Risk | 12/25 | Shared contracts; reversible by snapshot |
| Research | 3/20 | Done in phase 001 |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. Decisions are in `../002-removal-plan/decision-record.md`.
<!-- /ANCHOR:questions -->

---
