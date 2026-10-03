---
title: "Feature Specification: Build: improve the Jev fan-out merge (030)"
description: "The fan-out merge scorer reports Jev against honest baselines, describes its own inputs, and spends about a third fewer calls for the same picks."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Build: improve the Jev fan-out merge (030)

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/001-fanout-merge-improvements` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 12 |
| **Predecessor** | None |
| **Successor** | 002-track-narrowing-improvements |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Build the recommendations from 048's research for each kept Jev feature, and fix the deep-research workflow faults found while running it specification.

**Scope Boundary**: The recommendations listed in scope below, from `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/001-fanout-merge-research/research/research.md`. Corpus, label and default-on work stays out.

**Dependencies**:
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/001-fanout-merge-research/research/research.md` ranks the recommendations

**Deliverables**:
- Print constant-same and lexical-rule baselines beside the merge oracle in the report
- Stop after two agreeing orders, call a third only on disagreement, and break a three-way split with a symmetric tiebreak
- Make `report.json` self-describing: label digest, rubric hash, scorer hash, per-pair oracle decision and disclosed dropouts
- One re-measure recorded in `goal.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature 030 measured keep at A=53 of 60, but only against a baseline that answers "different" on every cross-body pair, and a lexical rule ties Jev at 53. The report does not say which labels, rubric or scorer produced it, and three calls run where the first two already agree on 58 of 60 pairs.

### Purpose
The fan-out merge scorer reports Jev against honest baselines, describes its own inputs, and spends about a third fewer calls for the same picks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1: Print constant-same and lexical-rule baselines beside the merge oracle in the report
- R2: Stop after two agreeing orders, call a third only on disagreement, and break a three-way split with a symmetric tiebreak
- R3: Make `report.json` self-describing: label digest, rubric hash, scorer hash, per-pair oracle decision and disclosed dropouts
- R5: Print the verdict at cuts 0.4, 0.45 and 0.5 so a later held-out batch can calibrate the cut

### Out of Scope
- R4 second rater and holdout - new labels, per 003 D4
- R5 calibration itself - needs a held-out batch of runs that does not exist yet
- R6 serving tiers and R7 wider use - default-on, per 047 D6
- R8 near-line fixtures - fixture authoring, a later phase

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` | Modify | Baselines, early stop, tiebreak, self-describing report, cut sweep |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/score-fanout-pairs.vitest.ts` | Modify | Cases for each new behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | The report prints constant-same and lexical-rule rows beside the oracle row. | A test reads both rows from a fixture run's report. |
| REQ-002 | The early stop gives the same picks as three calls on the recorded 047 run. | A replay test over the recorded `calls.jsonl` matches every modal pick and makes fewer calls. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-003 | `report.json` carries the label digest, rubric hash, scorer hash, per-pair oracle decision and dropouts. | A test asserts each field. |
| REQ-004 | A re-measure under the amended protocol is recorded. | The verdict line, its call count and the amendment sit in the goal log. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The scorer's suite passes with the new cases
- **SC-002**: The recorded 047 run replays to the same picks in fewer calls
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Risk | The early stop changes the keep rule's call protocol | Med | Record it as an amendment and keep the 047 verdict on record |
| Dependency | `jev auth status` for the re-measure | Re-measure cannot run | Record the skip in the log; the code changes still close |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The scope follows 048's ranked table.
<!-- /ANCHOR:questions -->

---


