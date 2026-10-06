---
title: "Feature Specification: Fix: deep-research run open"
description: "A deep-research run, including each fan-out lineage, opens through the append gateway and records iterations with exit 0."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fix: deep-research run open

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/011-research-run-init-via-gateway` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 12 |
| **Predecessor** | 010-completion-claims-improvements |
| **Successor** | 012-fanout-runner-and-prompt-fixes |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Build the recommendations from 048's research for each kept Jev feature, and fix the deep-research workflow faults found while running it specification.

**Scope Boundary**: The faults listed in scope below, as recorded in the deviations table in `048-jev-feature-improvement-research/goal.md`.

**Dependencies**:
- the deviations table in `048-jev-feature-improvement-research/goal.md` records the faults and their evidence

**Deliverables**:
- Both deep-research workflows open a run by recording `deep_research.run_initialized` through the append gateway instead of writing the state log
- The research stem census marks `deep_research.run_initialized` as spoken by both workflows
- A fan-out lineage opened by `fanout-run.cjs` takes the same init path

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Both deep-research workflows open a run by writing a 15-key config row straight into `deep-research-state.jsonl`. Nothing emits `deep_research.run_initialized`, so the projection starts at the first iteration and drops every config key, and `shadow-projection-store.ts` refuses that replace. Every gateway append then commits to the ledger and exits 2. Found on 2026-10-03 in phase 048, where Luna lineages stopped on 005, 007, 008 and 009.

### Purpose
A deep-research run, including each fan-out lineage, opens through the append gateway and records iterations with exit 0.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Both deep-research workflows open a run by recording `deep_research.run_initialized` through the append gateway instead of writing the state log
- The research stem census marks `deep_research.run_initialized` as spoken by both workflows
- A fan-out lineage opened by `fanout-run.cjs` takes the same init path
- An end-to-end test runs the shipped init step, then appends an iteration through the gateway

### Out of Scope
- The deep-review twin - packet `system-deep-loop/038-review-and-cli-lineage/002-review-state-init-and-dispatch` fixed it
- Runs opened before this change - their written config row still blocks projection, and a restart opens them cleanly
- The fan-out runner's retry labels and the merge's field names - child 012 owns them

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modify | Init step records `run_initialized` through the gateway |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml` | Modify | Same change for the confirm variant |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.md` | Modify | Source digests regenerated for the two changed workflows |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Modify | Census row for `run_initialized` becomes spoken |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-run-open.vitest.ts` | Create | Runs the shipped init step end to end |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | A run opened by either deep-research workflow records iterations through the gateway with exit 0. | The test runs each shipped init step, then appends an iteration; both exit 0 and the state log reads config then iteration. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-002 | The stem census matches what the workflows emit. | `check-ledger-stem-producers.cjs` exits 0 with `run_initialized` spoken by both workflows. |
| REQ-003 | A fan-out lineage opens through the same path. | A test opens one lineage through the fan-out init and appends an iteration with exit 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No deep-research run stops at its first gateway append
- **SC-002**: The census and the workflows agree
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Risk | The research gateway's legacy upcaster treats the new event differently from review | Med | Test the upcaster path explicitly, as 039 noted it must |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Packet 039 is the pattern.
<!-- /ANCHOR:questions -->

---


