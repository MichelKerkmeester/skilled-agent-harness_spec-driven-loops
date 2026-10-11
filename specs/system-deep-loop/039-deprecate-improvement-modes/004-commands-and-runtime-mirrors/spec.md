---
title: "Feature Specification: Phase 4: commands-and-runtime-mirrors"
description: "Both /deep commands and the deep-improvement agent are reachable from every CLI runtime. This phase deletes the commands, their assets, the agent and every runtime copy, and edits the indexes and guards that list them."
trigger_phrases:
  - "commands and runtime mirrors"
  - "phase 4 commands and runtime mirrors"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: commands-and-runtime-mirrors

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
| **Phase** | 4 of 10 |
| **Predecessor** | 003-agent-mirror-checker-relocation |
| **Successor** | 005-skill-packet-and-registry |
| **Handoff Criteria** | The runtime-mirror doctor reports no orphaned agent or prompt. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the agent-improvement and model-benchmark removal packet. The program and its decisions are in `../002-removal-plan/plan.md` and `../002-removal-plan/decision-record.md`.

**Scope Boundary**: only the files in this folder's `scratch/` lists. Implementation runs in the git worktree.

**Dependencies**:
- Phases: 003

**Deliverables**:
- Delete `/deep:agent-improvement`, `/deep:model-benchmark` and their six assets
- Delete `.skilled/agents/deep-improvement.md` and its `.claude`, `.codex`, `.pi` and Hermes copies; regenerate prompt copies with their generators
- Edit command and agent indexes, `create-*` command assets, the task-dispatch guard's `LOOP_EXECUTOR_AGENTS` and the codex agent generator

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each runtime reaches the two commands and the agent through its own copy: generated prompts in `.codex`, `.pi` and `.hermes`, a translated agent in `.claude`, a TOML agent in `.codex`, a hand copy in `.pi`. Deleting only the `.skilled` sources would leave live copies behind.

### Purpose
No runtime can invoke either removed mode through a command, prompt or agent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `/deep:agent-improvement`, `/deep:model-benchmark` and their six assets
- Delete `.skilled/agents/deep-improvement.md` and its `.claude`, `.codex`, `.pi` and Hermes copies; regenerate prompt copies with their generators
- Edit command and agent indexes, `create-*` command assets, the task-dispatch guard's `LOOP_EXECUTOR_AGENTS` and the codex agent generator

### Out of Scope
- Hub registry and packet - phase 005
- Hermes skill mirrors of other skills - regenerated in phase 010

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/files.txt` (37 files, six of them tracked runtime symlinks to the deleted command and agent files) | Delete/Modify | The exact file list this phase owns |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The commands, assets and agent are gone from `.skilled`. Verified by: `ls` shows none of them |
| REQ-002 | No runtime keeps a copy. Verified by: Runtime-mirror doctor reports no orphan; `ls` of each runtime agent and prompt dir |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The task-dispatch guard no longer counts `deep-improvement`. Verified by: `dispatch-guard.cjs` set holds `deep-research` and `deep-review` only, and its tests pass |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime-mirror doctor reports no orphaned agent or prompt.
- **SC-002**: `rg` for the two commands in `.skilled/commands` returns nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 003 | Starting early breaks a gate | Follow the order in `../002-removal-plan/plan.md` |
| Risk | A generator re-creates a deleted copy from a stale source | M | Generators run after the sources are deleted |
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
| Scope | 11/25 | Files in `scratch/files.txt` |
| Risk | 12/25 | Shared contracts; reversible by snapshot |
| Research | 3/20 | Done in phase 001 |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. Decisions are in `../002-removal-plan/decision-record.md`.
<!-- /ANCHOR:questions -->

---
