---
title: "Feature Specification: Phase 7: advisor-and-cross-skill-wiring"
description: "The skill advisor and several skills still route to or describe the removed modes. This phase removes the advisor's aliases, fold, boosts and fixtures, edits its drift guard, deletes the two sk-create-benchmark families and cleans the CLI, sk-code and spec-kit references."
trigger_phrases:
  - "advisor and cross skill wiring"
  - "phase 7 advisor and cross skill wiring"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: advisor-and-cross-skill-wiring

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
| **Phase** | 7 of 10 |
| **Predecessor** | 006-runtime-libraries-and-tests |
| **Successor** | 008-docs-and-readmes |
| **Handoff Criteria** | The routing-registry drift guard passes against the three-mode registry. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the agent-improvement and model-benchmark removal packet. The program and its decisions are in `../002-removal-plan/plan.md` and `../002-removal-plan/decision-record.md`.

**Scope Boundary**: only the files in this folder's `scratch/` lists. Implementation runs in the git worktree.

**Dependencies**:
- Phases: 005, 006

**Deliverables**:
- Advisor: alias groups, the `deep-improvement` fold, explicit boosts, projection entries, Python catalog, fixtures, holdout prompts, drift guard and scorer tests
- sk-doc: hub rows, the model and agent families of `sk-create-benchmark`, family-registry test, durable-directory manifest, validators and allowlists
- CLI skills, cli-classifier, sk-code and system-spec-kit docs and tests in `scratch/files.txt`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor keeps hardcoded projection maps that its drift guard compares with the hub registry, and asserts that `agent-improvement` is the only default-fold mode. `sk-doc` routes two benchmark families into the deleted packet, and CLI and spec-kit docs describe the agent and commands as live.

### Purpose
No prompt routes to a removed mode, and no other skill depends on one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Advisor: alias groups, the `deep-improvement` fold, explicit boosts, projection entries, Python catalog, fixtures, holdout prompts, drift guard and scorer tests
- sk-doc: hub rows, the model and agent families of `sk-create-benchmark`, family-registry test, durable-directory manifest, validators and allowlists
- CLI skills, cli-classifier, sk-code and system-spec-kit docs and tests in `scratch/files.txt`

### Out of Scope
- Generated bridges, skill graph and retrieval fixtures - regenerated in phase 010
- Benchmark READMEs - phase 008

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/files.txt` (69 files) | Delete/Modify | The exact file list this phase owns |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The advisor routes nothing to the removed modes. Verified by: advisor vitest and Python suites pass; no alias or bridge names them |
| REQ-002 | sk-create-benchmark offers two families. Verified by: `FAMILIES` lists behavior and MCP promotion only; sk-doc tests pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Docs describe three deep-loop modes. Verified by: `rg` over the listed files finds no live mention |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The routing-registry drift guard passes against the three-mode registry.
- **SC-002**: sk-doc's family-registry and folder tests pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 005, 006 | Starting early breaks a gate | Follow the order in `../002-removal-plan/plan.md` |
| Risk | The drift guard needs a new default-mode rule once no mode carries one | M | The guard asserts that no mode carries the flag |
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
| Scope | 18/25 | Files in `scratch/files.txt` |
| Risk | 12/25 | Shared contracts; reversible by snapshot |
| Research | 3/20 | Done in phase 001 |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. Decisions are in `../002-removal-plan/decision-record.md`.
<!-- /ANCHOR:questions -->

---
