---
title: "Feature Specification: Build: improve the Jev fetched-text injection screen (035)"
description: "The injection screen scores only a corpus it can identify, reports what it scored, flags at the better line and spends a third fewer calls."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Build: improve the Jev fetched-text injection screen (035)

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
| **Branch** | `scaffold/004-injection-screen-improvements` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 12 |
| **Predecessor** | 003-citation-drift-improvements |
| **Successor** | 005-hallucination-grader-improvements |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Build the recommendations from 048's research for each kept Jev feature, and fix the deep-research workflow faults found while running it specification.

**Scope Boundary**: The recommendations listed in scope below, from `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/004-injection-screen-research/research/research.md`. Corpus, label and default-on work stays out.

**Dependencies**:
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/004-injection-screen-research/research/research.md` ranks the recommendations

**Deliverables**:
- Restore corpus provenance: snapshot the rows or refuse to score without the rows' commit
- Ship the trust package: label and planted hashes, comparator Brier score, natural and planted recall apart, close calls flagged
- Re-measure with the flag line at 0.6 under the unchanged keep rule
- One re-measure recorded in `goal.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature 035 kept strongly, but commit `b0f89ee5f07` untracked its corpus, so the run cannot be reproduced. The report hashes neither label file, the flag line sits at 0.5 where 0.6 gives A=84 at precision 0.968, and three calls run where the first two agree on 90 of 90 rows.

### Purpose
The injection screen scores only a corpus it can identify, reports what it scored, flags at the better line and spends a third fewer calls.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1: Restore corpus provenance: snapshot the rows or refuse to score without the rows' commit
- R2: Ship the trust package: label and planted hashes, comparator Brier score, natural and planted recall apart, close calls flagged
- R3: Re-measure with the flag line at 0.6 under the unchanged keep rule
- R4: Confirm-then-verify reruns: two calls, a third only on disagreement
- R5: Harden the lexical comparator and report it as a hybrid floor
- R6: Test a reworded question and a review-band second question in the same run

### Out of Scope
- R7 real-fetch, hard-benign, obfuscated and multilingual slices - new corpus and labels
- R8 host fetch-boundary probe and advisory default-on - default-on, per 047 D6
- R9 wider census of agent grants - a later phase

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` | Modify | Corpus check, trust package, flag line, call protocol, comparator, question arms |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs` | Modify | Cases for each new behavior |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/README.md` | Modify | Corpus provenance and the new report fields |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | The scorer refuses a corpus whose rows do not match a recorded commit or snapshot digest. | A test with a changed row asserts the refusal. |
| REQ-002 | The report carries label and planted file hashes. | A test asserts both. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-003 | The report prints comparator Brier, natural and planted recall apart and close calls. | A test reads each. |
| REQ-004 | A re-measure at flag line 0.6 with confirm-then-verify reruns is recorded. | The verdict line, call count and amendment sit in the goal log. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The scorer cannot score an unidentified corpus
- **SC-002**: The re-measure runs with fewer calls than 270
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Dependency | The corpus rows untracked by `b0f89ee5f07` | Re-measure cannot run | Restore them from that commit's parent, then snapshot their digest |
| Dependency | `jev auth status` for the re-measure | Re-measure cannot run | Record the skip in the log; the code changes still close |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The scope follows 048's ranked table.
<!-- /ANCHOR:questions -->

---


