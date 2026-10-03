---
title: "Feature Specification: Build: improve the Jev hallucination grader (024)"
description: "The grader is measured against a fed baseline, a failure is never read as a score, and both scoring paths see the same context."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Build: improve the Jev hallucination grader (024)

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
| **Branch** | `scaffold/005-hallucination-grader-improvements` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 12 |
| **Predecessor** | 004-injection-screen-improvements |
| **Successor** | 006-verdict-fallback-improvements |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Build the recommendations from 048's research for each kept Jev feature, and fix the deep-research workflow faults found while running it specification.

**Scope Boundary**: The recommendations listed in scope below, from `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/005-hallucination-grader-research/research/research.md`. Corpus, label and default-on work stays out.

**Dependencies**:
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/005-hallucination-grader-research/research/research.md` ranks the recommendations

**Deliverables**:
- Populate `allowlist` on the 21 benchmark fixtures
- Give a grader failure an unmeasured state with one retry, instead of 0.0
- Forward task, spec and allowlist into the 5-dimension D4 path
- One re-measure recorded in `goal.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature 024 kept, but against a starved baseline: none of the 21 benchmark fixtures carries an allowlist. A grader failure scores 0.0 instead of counting as unmeasured, the 5-dimension path drops the task, spec and allowlist context, and it bypasses the dispute escalation.

### Purpose
The grader is measured against a fed baseline, a failure is never read as a score, and both scoring paths see the same context.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1: Populate `allowlist` on the 21 benchmark fixtures
- R2: Give a grader failure an unmeasured state with one retry, instead of 0.0
- R3: Forward task, spec and allowlist into the 5-dimension D4 path
- R4: Wire `dispute.cjs` low-confidence escalation into the 5-dimension adapter
- R6: Report per class with intervals, compare the labels SHA on requalify, and repeat the run
- R7: Cascade check-flagged rows to the model once allowlists land, as a reported arm

### Out of Scope
- R5 second rater - new labels, per 003 D4
- R8 broader corpus - new corpus and labels
- R9 backend measurement and R10 reuse - default-on and other owners, later phases

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/` | Modify | `allowlist` on the 21 fixtures |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs` | Modify | Unmeasured state and retry instead of 0.0 |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` | Modify | Context forwarding, per-class report, labels SHA check, cascade arm |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/dispute.cjs` | Modify | Escalation reachable from the 5-dimension adapter |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts` | Modify | Cases for each new behavior |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` | Modify | Forward task, spec and allowlist so the 5-dimension path sees the same context |
| `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/` (census scenario and index) | Modify | Census now prints `allowlist: 21 of 21` |
| `.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/scoring-system/hallucination-grader-agreement.md` | Modify | Document the cascade arm, per-class lines and labels-SHA refusal |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | A grader failure is recorded as unmeasured after one retry, never as 0.0. | A test with a failing grader asserts the state. |
| REQ-002 | All 21 fixtures carry an `allowlist`. | A check counts 21 fixtures with the field. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-003 | The 5-dimension path receives task, spec and allowlist, and escalates low-confidence rows through `dispute.cjs`. | A test asserts the forwarded context and one escalation. |
| REQ-004 | The report prints per-class results with intervals and refuses a changed labels SHA on requalify. | A test reads both. |
| REQ-005 | A repeat run with the fed baseline and the cascade arm is recorded. | The verdict line and amendment sit in the goal log. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No grader failure can lower a score
- **SC-002**: The baseline sees an allowlist on every fixture
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Risk | A fed baseline may close the measured gap | Med | That is the honest result. Record the new verdict beside the 047 one |
| Dependency | `jev auth status` for the re-measure | Re-measure cannot run | Record the skip in the log; the code changes still close |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The scope follows 048's ranked table.
<!-- /ANCHOR:questions -->

---


