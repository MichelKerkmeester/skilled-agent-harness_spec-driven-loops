---
title: "Feature Specification: Phase 12: residual-reference-sweep"
description: "Phase 010 searched for the retired modes by name and missed live leftovers described in other words. This phase removes them from the advisor scorers, the runtime, the behavior benchmark and the docs."
trigger_phrases:
  - "residual reference sweep"
  - "phase 12 residual reference sweep"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: residual-reference-sweep

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | worktree branch from sk-git's allocator |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-pre-existing-gate-failures |
| **Successor** | None |
| **Handoff Criteria** | A vocabulary search finds no live statement of the retired modes as current. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the agent-improvement and model-benchmark removal packet. It was added while merging `origin/main`, when a wider search found leftovers phase 010 had missed.

**Scope Boundary**: only the files in this folder's `scratch/files.txt`. Implementation runs in the git worktree.

**Dependencies**:
- Phases: 011-pre-existing-gate-failures, and the merge of `origin/main`

**Deliverables**:
- Remove agent-improvement phrase boosters from the Python and native advisor scorers
- Remove the improvement and benchmark families from runtime coverage, stopping-clock and continuity types, and the candidate-evidence kind from the behavior benchmark
- Remove stale statements from live docs and the sibling edge between system-deep-loop and sk-prompt

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 010 searched for the retired mode and command names. Text that describes the modes in other words was never matched: about 25 advisor phrase boosters still send agent-improvement prompts to `system-deep-loop`, the runtime still types `improvement` and `benchmark` families, the behavior benchmark still scores an improvement evidence kind, and hub docs still list improvement lanes and guard rules for them.

### Purpose
Nothing live presents the retired modes as current or routes work to them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Advisor scorer vocabulary for agent improvement
- Runtime family types and profiles, and the behavior benchmark's candidate-evidence kind
- Live doc lines, graph metadata edges and the README fixes found during the merge

### Out of Scope
- History: changelogs of surviving packets, benchmark reports and READMEs that call the harness retired, test fixtures copied from specs
- Deep-review's own `CANDIDATE_EVIDENCE` artifact kind, which is a review concept

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/files.txt` | Modify | The exact file list this phase owns |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No advisor phrase routes agent-improvement intent. Verified by: advisor vitest, pytests and regression pass; scorer metrics unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | No runtime type or benchmark kind models a retired family. Verified by: typecheck, vitest with 0 failed, behavior-benchmark tests |
| REQ-003 | No live doc presents the retired modes as current. Verified by: the vocabulary search in `scratch/brief-wu3.md` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The vocabulary search finds only history and kept hits.
- **SC-002**: Every program gate matches or beats the phase 011 result.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing boosters moves other routing cases | M | WU1 compares scorer metrics and stops on any change |
| Risk | Removing a type member breaks an importer | M | Typecheck names every importer before the suite runs |
<!-- /ANCHOR:risks -->

---


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
- Generated files are never hand-edited; a brief that changes a source names its generator.

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
| Risk | 12/25 | Advisor scoring is shared; reversible by snapshot |
| Research | 6/20 | Root causes traced in this phase |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


