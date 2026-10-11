---
title: "Feature Specification: Phase 2: fresh-clone-onboarding"
description: "Deep research that walks a fresh clone from install to the first routed request and the first spec packet, and ranks every stumble an external repo user hits by impact."
trigger_phrases:
  - "fresh clone onboarding"
  - "external user first run"
  - "fresh clone stumbles"
  - "phase 2 fresh clone onboarding"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: fresh-clone-onboarding

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/104-open-ends-scaffold` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-doc-version-contract |
| **Successor** | 003-playbook-catalog-truth |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the open ends research.

**Scope Boundary**: Read-only research. The run writes only under this folder, plus throwaway clones in a temporary directory it removes. No product file changes.

**Dependencies**:
- The `/deep:research` workflow, run for 10 iterations by an executor its orchestrator chooses.
- A throwaway clone in a temporary directory, removed when the run ends, and the Node versions needed to reproduce the floor mismatch.

**Deliverables**:
- `research/research.md`, the checked synthesis.
- The loop's state and iterations under `research/`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An external user who clones this framework meets several stumbles before the first routed request and the first spec packet. Known ones: the advisor runtime needs Node 20.19 while the spec-kit CLI needs 22.12; sk-vision tests fail until `vision-runtime/dist` is built; the compiled-routing rebuild depends on an authored source under `specs/sk-doc/z_archive/...`, which an adopter reads as history (`.skilled/bin/lib/compiled-route-layout.cjs` references it); worktree provisioning; and hook trust (`skilled.trustRepoHooks`). Nobody has walked the whole path as a newcomer and ranked what it costs them.

### Purpose
Rank every stumble on the fresh-clone path by user impact and recommend the smallest set of fixes, in that order.

### Research Questions

1. Walking a fresh clone from install to the first routed request and the first spec packet, what are all the stumbles, ranked?
2. For each known stumble (Node 20.19 against 22.12, the unbuilt `vision-runtime/dist`, the `z_archive` routing source, worktree provisioning, `skilled.trustRepoHooks`), is it real today, and what does it cost the user?
3. What is the smallest set of fixes, ranked by user impact?
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The documented install path and every step to the first routed request and the first spec packet.
- The five known stumbles listed above, confirmed or refuted on the current tree.
- Any further stumble found on the walk, such as an unclear error or a missing prerequisite.

### Out of Scope
- Changing install docs, scripts or runtime code. Fixes are a later phase.
- Experience past the first spec packet, such as deep loops or skill authoring.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Loop config, state, iterations and the synthesis |
| `implementation-summary.md`, `goal.md` | Modify | Outcome and log once the run ends |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run all 10 iterations of `/deep:research`; a convergence stop before 10 does not count | Each `deep-research-state.jsonl` under `research/` holds 10 iteration records |
| REQ-002 | Write `research/research.md` with a Recommendations table whose rows read `\| R<n> \| <recommendation> \| <path:line evidence> \| <move> \| <why the cheaper move fails> \|`, ranked so R1 matters most | At least one R row exists |
| REQ-003 | Cite a path:line for every recommendation | Every R row carries a `path:line` reference |
| REQ-004 | Pass every recommendation through `.skilled/repo-rules/prevent-overengineering.md` | Each row names its move from that file's reversal-cost order (Build nothing, Change a value, Extend in place, Add a function, Add a file, Add an abstraction, Add a dependency) and, above Build nothing, says what fails at the cheaper move |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Spot-check every cited path:line before it reaches the synthesis | The goal log records the spot-check |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

Done means:

- **SC-001**: Each research question above has an answer backed by path:line evidence, or is marked UNKNOWN with what would settle it.
- **SC-002**: Every criterion in `goal.md` passes, strict validation included.
- **SC-003**: No file outside this folder differs from the base commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The executor the run's orchestrator picks | The loop cannot start | Switch executor; the goal does not fix one |
| Risk | The model cites a line or a count it did not check | A wrong recommendation reaches a later fix phase | The orchestrator spot-checks every cited path:line before synthesis |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the run. The research questions are in section 2.
- Research topic under active deep research: the ranked fresh-clone stumbles from install to the first routed request and the first spec packet.

**Research Context**: deep research is active for this topic, and `research/research.md` is the canonical synthesis.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- Findings: 10 iterations ran, all 5 research questions are answered, and `research/research.md` ranks 14 recommendations. The two top items are documentation faults that stop a newcomer before the first routed request: the false advisor auto-build claim (README.md:162) and the missing Node 24.x requirement for Code Mode (README.md:160).
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
