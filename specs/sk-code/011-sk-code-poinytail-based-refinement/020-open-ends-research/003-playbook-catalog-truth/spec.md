---
title: "Feature Specification: Phase 3: playbook-catalog-truth"
description: "Deep research into the lightest way to make manual-testing playbook scenarios and feature catalog entries check themselves against the code, through their sk-doc modes and validators."
trigger_phrases:
  - "playbook catalog truth"
  - "playbook drift self check"
  - "feature catalog traceability"
  - "phase 3 playbook catalog truth"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: playbook-catalog-truth

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
| **Phase** | 3 of 5 |
| **Predecessor** | 002-fresh-clone-onboarding |
| **Successor** | 004-routing-evaluation |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the open ends research.

**Scope Boundary**: Read-only research. The run writes only under this folder. No product file changes.

**Dependencies**:
- The `/deep:research` workflow, run for 10 iterations by an executor its orchestrator chooses.
- None beyond the repository.

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
Manual-testing playbooks and feature catalogs drift from reality silently. A playbook scenario passed `--phase-count`, an option that never existed, and passed only because 3 is the default. Deep-loop scenario DOC-331's expected answer disagreed with the router, and only the admission run noticed. Deep reviews left the catalog-to-code traceability check "pending".

### Purpose
Find the lightest way to make playbook scenarios and catalog entries check themselves against the code, through the sk-create-manual-testing-playbook and sk-create-feature-catalog modes and their validators, with no heavy new machinery.

### Research Questions

1. Where do playbook scenarios and catalog entries drift from the code today, and what, if anything, catches it?
2. What is the lightest self-check the two modes and their validators can run, so a scenario's options and expected answers and a catalog entry's code anchors are tested against the code?
3. Which drift classes would that check still miss?
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/` and `.skilled/skills/sk-doc/sk-create-feature-catalog/`, their templates and validators.
- Existing playbooks and catalogs across the skills, sampled for drift.
- The three examples above, as evidence of the drift classes.

### Out of Scope
- Changing any playbook, catalog, mode or validator. Fixes are a later phase.
- Fixing DOC-331 itself. A separate fix is in flight.
- New services, databases or runners. The brief rules out heavy new machinery.

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
- Deep-research topic: find the lightest way to make manual-testing playbook scenarios and feature catalog entries check themselves against the code through their sk-doc modes and validators.

**Research Context**: a `/deep:research` run is active for this topic. `research/research.md` is the canonical synthesis.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Abridged from `research/research.md` (ten iterations, stop reason maxIterationsReached):

- The existing citation scanner already resolves every `path:line` in playbooks and catalogs and finds two past-end anchors today, but no workflow runs it.
- The catalog package validator runs green across 29 packages, but no workflow runs it, and it skips every two-column `File` table.
- The token-at-line check already exists in the scanner as an identifier-overlap function used only for scoring.
- Scenario options, expected answers and router answers need no new checker: the producer, the scenario run and the compiled-route admission step already cover them.
- Ten ranked recommendations, with their moves, are in `research/research.md` section 5.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
