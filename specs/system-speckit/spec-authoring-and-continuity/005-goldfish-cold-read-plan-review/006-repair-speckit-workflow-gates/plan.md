---
title: "Implementation Plan: Phase 6: repair-speckit-workflow-gates"
description: "Update three SpecKit workflow YAML assets with explicit plan checks, failure stops, and repeated clarification passes."
trigger_phrases:
  - "repair speckit workflow gates plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: repair-speckit-workflow-gates

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow assets containing command instructions |
| **Framework** | SpecKit plan, implement, and complete command workflows |
| **Storage** | None |
| **Testing** | YAML parsing and focused workflow-contract checks |

### Overview
The three command routers load their workflow YAML assets directly. Update the implement asset to define the existing plan_clarity check, block coding when plan decisions remain, and stop completion on test failure; update the complete asset to check that plan.md states a technical approach; and update the plan asset to repeat clarification passes of up to three markers. The ordered edits and their proof commands are in tasks.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All five requirements meet their acceptance criteria
- [x] The three workflow YAML files parse, and focused checks show each required criterion and stop instruction
- [x] The strict packet validator prints RESULT: PASSED
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Prompt-driven workflow configuration.

### Key Components
- **speckit-implement.yaml**: Defines implementation quality criteria and the stops for unresolved decisions and failing tests.
- **speckit-complete.yaml**: Checks that the plan contains a concrete technical approach before the phase gate passes.
- **speckit-plan.yaml**: Defines the clarification marker loop as repeated passes of up to three.

### Data Flow
Each thin command router loads its owned YAML asset; the workflow instructions then guide the model through the relevant check, stop, or clarification step.

### Decisions made in the review pass

These close choices the first draft left to the implementer. Each is written into the task that carries it.

- **Exact wording.** T004 to T008 each point at an edit file under `scratch/` that holds the old text and the new text. Each old text was matched exactly once against its source on 2026-11-11.
- **`plan_clarity`.** The row at `speckit-implement.yaml:390` gains a `criteria` field and keeps its 25 points. The definition does not change the arithmetic: the other three checks still sum to 75 against a threshold of 70, so a plan that fails `plan_clarity` can still pass the scored gate. The hard stop for an unclear plan is the step 5 check in T005. Changing the points or the threshold belongs with the `quality_gates` question the operator has open.
- **Step 5.** One edit to two adjacent lines at `speckit-implement.yaml:558-559`: a fifth activity, a `plan_design_choices: none` check, and a step-level `on_fail` that stops before coding and sends the work back to planning. The step's existing `child_dispatch` note already tells a dispatched child to record a failed check and continue.
- **Step 7.** The outcomes map at `speckit-implement.yaml:679` gains `test_failure`, placed before `system_error`.
- **Phase gate.** Line 1047 of `speckit-complete.yaml` keeps its number and its return to Step 6 and adds what a technical approach means: the approach and the files it changes.
- **Proof reads the parsed YAML.** T004 to T006 load the file with the installed `js-yaml` and print the new values, so a syntax slip or a field under the wrong key fails the task. The first draft checked with `rg -A`, which prints lines and cannot fail on a misplaced field.
- **Same defect, second place, left alone.** `speckit-complete.yaml:1096` carries the same three-item prerequisite check as step 5, and `speckit-complete.yaml:1249` lists `Validate tests pass` with no stop. The evidence for this phase names only the implement workflow for those two findings, so this phase does not edit them. spec.md lists them as an open question.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the current gate blocks in .skilled/commands/speckit/assets/speckit-implement.yaml, speckit-complete.yaml, and speckit-plan.yaml; tasks.md records the baseline checks.
Implementation edits only those three files: define plan_clarity and add the two implementation stops, require an approach in the complete phase gate, and clarify repeating marker passes in the plan workflow.
Verification parses the same three YAML files and checks each required criterion and failure instruction with the commands in tasks.md.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Parse the three workflow assets with the repository's installed js-yaml dependency, then run the focused text checks listed in tasks.md. The repository search found no dedicated tests for these three YAML assets; this plan adds no test files and does not rely on a Vitest suite.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new dependency is needed. The existing command routers and their owned YAML paths remain the integration boundary.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If a new gate blocks a valid workflow, revert only the affected hunk in the three scoped YAML assets. These prompt-only changes introduce no data migration or persistent runtime state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->

## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Owns plan_clarity, implementation prerequisites, and completion validation | Update the clarity criterion and the two stop conditions | T004–T006 focused checks; T009 YAML parse |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Owns the complete workflow phase gate | Require a technical approach in plan.md | T007 focused check; T009 YAML parse |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Owns clarification marker processing | Describe batches of up to three and repeat until none remain | T008 focused check; T009 YAML parse |
| `.skilled/commands/speckit/{plan,implement,complete}.md` | Command routers that load the three assets | Leave unchanged | `rg -n -F 'Workflow (all execution modes)' .skilled/commands/speckit/{plan,implement,complete}.md` prints the three asset mappings |
<!-- /ANCHOR:affected-surfaces -->


<!-- ANCHOR:phase-deps -->

## L2: PHASE DEPENDENCIES

```text
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The three existing workflow assets and baseline checks T001–T003 | Implementation |
| Implementation | Setup baselines and the frozen five requirements | Verification |
| Verification | All five planned workflow edits | Packet closure and any completion claim |
<!-- /ANCHOR:phase-deps -->

---
