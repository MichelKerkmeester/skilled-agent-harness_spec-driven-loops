---
title: "Feature Specification: Build: improve the Jev spec-track narrowing (017)"
description: "The narrowing scorer pins what it measured, keeps every run, reports by track with its margin slack, and shows what one call or a shortlist would cost in accuracy."
trigger_phrases:
  - "track narrowing improvements"
  - "the narrowing scorer pins what it measured keeps"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Build: improve the Jev spec-track narrowing (017)

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/002-track-narrowing-improvements` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 12 |
| **Predecessor** | 001-fanout-merge-improvements |
| **Successor** | 003-citation-drift-improvements |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Build the recommendations from 048's research for each kept Jev feature, and fix the deep-research workflow faults found while running it specification.

**Scope Boundary**: The recommendations listed in scope below, from `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/research/research.md`. Corpus, label and default-on work stays out.

**Dependencies**:
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/research/research.md` ranks the recommendations

**Deliverables**:
- Pin the row set and the model tuple in the report, and refuse to reuse an `--out` directory that holds a run
- Add probability-aware aggregation as a reported arm, with decided-subset accuracy and margin slack
- Print a per-track confusion and abstention table
- One re-measure recorded in `goal.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature 017 kept at 97 against 68 of 256 with only 3.4 rows of margin slack. The report stores counts only, reusing `--out` truncates `calls.jsonl` and overwrites `report.json`, and 57 abstentions are invisible in the output.

### Purpose
The narrowing scorer pins what it measured, keeps every run, reports by track with its margin slack, and shows what one call or a shortlist would cost in accuracy.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R2: Pin the row set and the model tuple in the report, and refuse to reuse an `--out` directory that holds a run
- R3: Add probability-aware aggregation as a reported arm, with decided-subset accuracy and margin slack
- R5: Print a per-track confusion and abstention table
- R6: Repeat the run and add a cluster-aware bootstrap interval
- R7: Replay the recorded calls to report one-call and shortlist arms beside the three-order protocol

### Out of Scope
- R1 keeping hard narrowing offline - a standing policy with nothing to build
- R4 Gate 1 request holdout - new labels, per 003 D4
- R8 port to the shared scorer pattern - touches five sibling scorers, a later phase
- R9 advisory serving - default-on, per 047 D6

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | Modify | Row-set and model pin, `--out` guard, aggregation arm, per-track table, bootstrap, replay arms |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts` | Modify | Cases for each new behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | A second run into an `--out` directory that holds a run is refused with exit 2. | A test runs twice into one directory and reads the exit code and the untouched first record. |
| REQ-002 | The report pins the row-set digest and the model tuple. | A test asserts both fields. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-003 | The report prints decided-subset accuracy, margin slack and a per-track confusion and abstention table. | A test reads each from a fixture run. |
| REQ-004 | The probability-aware, one-call and shortlist arms are reported beside the verdict, and the verdict is unchanged. | A replay of the recorded 047 run prints all three arms and the same verdict line. |
| REQ-005 | A repeat run with a bootstrap interval is recorded. | The second verdict line and the interval sit in the goal log. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The scorer's suite passes with the new cases
- **SC-002**: A rerun into a used `--out` directory can no longer lose the first record
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Risk | A reported aggregation arm is mistaken for a changed verdict | Low | Print the arms under their own heading and keep the verdict rule unchanged |
| Dependency | `jev auth status` for the re-measure | Re-measure cannot run | Record the skip in the log; the code changes still close |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The scope follows 048's ranked table.
<!-- /ANCHOR:questions -->

---


