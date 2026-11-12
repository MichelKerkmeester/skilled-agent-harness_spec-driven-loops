---
title: "Feature Specification: Phase 6: repair-speckit-workflow-gates"
description: "Specifies five prompt-level corrections to the SpecKit plan, implement, and complete workflow gates."
trigger_phrases:
  - "repair speckit workflow gates"
  - "phase 6 repair speckit workflow gates"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: repair-speckit-workflow-gates

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-11 |
| **Branch** | main |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-point-chat-sessions-at-authoring-card |
| **Successor** | None |
| **Handoff Criteria** | The five scoped workflow changes and their verification commands are explicit; pending removal questions remain out of scope and do not block implementation. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 6 of the parent packet that builds confirmed recommendations from fresh-context planning research.

**Scope Boundary**: Modify only the three SpecKit workflow YAML assets listed in Section 3. Preserve all unrelated workflow blocks and defaults.

**Dependencies**:
- The existing /speckit:plan, /speckit:implement, and /speckit:complete command routers load their corresponding YAML assets.

**Deliverables**:
- A defined plan_clarity criterion, a pre-coding design-choice stop, and an explicit test-failure stop in speckit-implement.yaml.
- A phase-gate check for a substantive technical approach in speckit-complete.yaml.
- Clarification-marker wording that makes three-item passes repeat until none remain in speckit-plan.yaml.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The /speckit:implement workflow scores plan_clarity without defining what passes, and its prerequisite step does not explicitly stop when plan decisions remain for the implementer. The same workflow names test validation without a test-failure stop, /speckit:complete checks that plan.md exists without requiring its technical approach, and /speckit:plan wording makes clarification markers sound capped in total.

### Purpose
Make the three workflow assets state the required plan evidence, the conditions that stop implementation or completion, and the repeated clarification pass so a fresh implementer can follow the workflow without guessing.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

~~~~text
$ rg -n -F -e 'threshold: 70' -e 'plan_clarity' -e 'checks: { prerequisites: verified, blockers: none, environment: ready }' -e 'Validate tests pass' -e 'outcomes: { success: "continue"' -e 'plan.md exists → If not, return to Step 6' -e 'Extract [NEEDS CLARIFICATION] markers (max 3)' .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml .skilled/commands/speckit/assets/speckit-plan.yaml
.skilled/commands/speckit/assets/speckit-plan.yaml:407:    threshold: 70
.skilled/commands/speckit/assets/speckit-plan.yaml:417:    threshold: 70
.skilled/commands/speckit/assets/speckit-plan.yaml:656:    activities: ["Extract [NEEDS CLARIFICATION] markers (max 3)", Research codebase for patterns, Resolve ambiguities, Update spec.md with clarifications, Document assumptions]
.skilled/commands/speckit/assets/speckit-implement.yaml:386:    threshold: 70
.skilled/commands/speckit/assets/speckit-implement.yaml:390:      - { id: plan_clarity, points: 25 }
.skilled/commands/speckit/assets/speckit-implement.yaml:396:    threshold: 70
.skilled/commands/speckit/assets/speckit-implement.yaml:559:    checks: { prerequisites: verified, blockers: none, environment: ready }
.skilled/commands/speckit/assets/speckit-implement.yaml:676:    activities: [Run validation on spec folder, Verify all tasks completed, Validate tests pass, Confirm plan followed, Generate implementation-summary.md, Update all task status, Reread the request and its amendments and map each outcome they ask for to a Met row or name it as not done]
.skilled/commands/speckit/assets/speckit-implement.yaml:679:      outcomes: { success: "continue", user_error: "STOP and fix invocation", validation_error: "STOP and fix", system_error: "STOP and diagnose tooling or file I/O" }
.skilled/commands/speckit/assets/speckit-complete.yaml:496:    threshold: 70
.skilled/commands/speckit/assets/speckit-complete.yaml:506:    threshold: 70
.skilled/commands/speckit/assets/speckit-complete.yaml:522:    threshold: 70
.skilled/commands/speckit/assets/speckit-complete.yaml:1047:        2. plan.md exists → If not, return to Step 6
The only plan_clarity match is its scored id; no criterion accompanies it in the named workflow assets. The pre-implementation gate has a 70-point threshold and assigns 25 points to that id. The implementation prerequisite check lists environment, prerequisites, and blockers only. The completion outcome map has no test-failure branch, the complete phase gate checks plan.md existence, and the plan activity says max 3.
~~~~

The pre-implementation gate has a 70-point threshold and assigns 25 points to plan_clarity, but the asset contains no definition of that check. Its implementation prerequisite check lists environment, prerequisites, and blockers only. The completion outcome map has no test-failure branch, the phase gate checks plan.md existence, and the clarification activity says max 3.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the existing plan_clarity score with a pass condition that requires a concrete approach and affected files.
- Add an explicit check that plan.md leaves no material design choice for the implementer, with an on-fail stop before coding.
- Add a test-failure outcome that stops completion and requires fixing the failing tests.
- Require the complete workflow phase gate to confirm that plan.md states a technical approach before it passes.
- Reword clarification-marker extraction as batches of up to three per pass, repeating until none remain.

### Out of Scope
- Delete the quality_gates or circuit_breaker blocks in any of the three assets. Their removal is pending an operator decision, so preserve them unchanged.
- Delete default_level: level_2 from any of the three assets. Its removal is also pending an operator decision, so preserve it unchanged.
- Change command routers, presentation assets, tests, hooks, scripts, templates, runtime code, or any other file. The five reported defects are addressed by the three named workflow assets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/commands/speckit/assets/speckit-implement.yaml | Modify | Define plan_clarity and add explicit stops for unresolved plan decisions and failed tests. |
| .skilled/commands/speckit/assets/speckit-complete.yaml | Modify | Require a substantive technical approach in the phase gate before it passes. |
| .skilled/commands/speckit/assets/speckit-plan.yaml | Modify | Clarify that up to three clarification markers are resolved per pass and passes repeat until none remain. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

P0 rows are blocking. P1 rows are required unless the operator approves a deferral. Requirement IDs are unique within this phase.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define the existing plan_clarity check in the pre-implementation score while preserving its current point value and gate threshold. | T004's command loads the parsed YAML and prints `25 70` followed by the criteria text. |
| REQ-002 | Make the implementation prerequisite check fail when plan.md leaves a material design choice to the implementer. | T005's command loads the parsed YAML and prints `none true`: the step has `plan_design_choices: none` and an on_fail that starts with `STOP before coding`. |
| REQ-003 | Stop the completion workflow when test validation fails and require repair before completion continues. | T006's command loads the parsed YAML and prints the test_failure outcome: `STOP and fix the failing tests, then rerun them before completion continues`. |
| REQ-004 | Require a substantive technical approach in plan.md at the complete workflow phase gate, in addition to file existence. | T007's count prints 1 for the gate line that requires the approach and the files it changes and returns to Step 6 when they are missing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Describe clarification markers as batches of up to three per pass, repeating the clarification sequence until no markers remain. | rg -n -F 'Extract up to 3 [NEEDS CLARIFICATION] markers per pass; complete the clarification activities and repeat until none remain' .skilled/commands/speckit/assets/speckit-plan.yaml prints the revised activity. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three named workflow YAML assets parse successfully and contain the four required hard-stop or gate criteria.
- **SC-002**: The clarification activity explicitly repeats passes of up to three markers until none remain.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing /speckit command routers load their workflow YAML assets. | If a router stops loading its asset, the corresponding change has no effect. | Preserve the current asset paths and verify each router's owned-asset mapping. |
| Risk | Workflow instructions are interpreted from YAML prompt content, so vague criteria could still be applied inconsistently. | Medium | Put pass conditions beside the existing check and state STOP, the failure condition, and the required recovery action explicitly. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A — these prompt-driven YAML changes add no service or runtime operation with a response-time target.
- **NFR-P02**: N/A — no request throughput or concurrent load is introduced.

### Security
- **NFR-S01**: N/A — the changes add no authentication or credential handling.
- **NFR-S02**: N/A — the changes store no user data or persistent state.

### Reliability
- **NFR-R01**: N/A — no service availability target applies to workflow prompt text.
- **NFR-R02**: N/A — no service error-rate target applies; the workflow stop and recovery behavior is specified in REQ-002 and REQ-003.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->

## L2: EDGE CASES

- Empty input: when no clarification markers remain, resolve zero markers and continue without another pass.
- Maximum input: process up to three clarification markers per pass; no aggregate cap is specified, so later passes handle remaining markers until none remain.
- Failure path: stop before coding when a material design choice remains; return to planning when plan.md lacks a technical approach; stop completion when test validation fails.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three YAML workflow assets are in scope; the matrix assigns 10 points to 3–5 files. |
| Risk | 10/25 | The change modifies workflow configuration; the matrix assigns 10 points to configuration work. |
| Research | 15/20 | The phase uses research-backed findings and rechecked source lines; the matrix assigns 15 points to research. |
| **Total** | **35/70** | Level 2 range: 26–55. |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Open question: Should the quality_gates and circuit_breaker blocks be deleted from these workflows? The operator decision is pending; this phase leaves them unchanged, and the five scoped corrections do not depend on that decision.
- Open question: Should the complete workflow get the same two repairs as the implement workflow? `speckit-complete.yaml:1096` carries the same three-item prerequisite check and `speckit-complete.yaml:1249` lists `Validate tests pass` with no stop. The evidence for this phase names only `speckit-implement.yaml` for those findings, so they stay unchanged here.
- Open question: Should default_level: level_2 be deleted from these workflows? The operator decision is pending; this phase leaves the current defaults unchanged, and the five scoped corrections do not depend on that decision.
<!-- /ANCHOR:questions -->

---
