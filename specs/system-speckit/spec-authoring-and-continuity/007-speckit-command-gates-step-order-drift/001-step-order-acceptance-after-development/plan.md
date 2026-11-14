---
title: "Implementation Plan: Phase 1: step-order-acceptance-after-development"
description: "Move each verification step, check and gate in the implement, complete and plan workflows to the step boundary where what it checks exists. The change edits three workflow YAML files and is proved with ordering checks written in awk and rg."
trigger_phrases:
  - "step order acceptance after development plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: step-order-acceptance-after-development

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow files read by an AI agent |
| **Framework** | The speckit command router pattern: a router loads a workflow YAML and a presentation file |
| **Storage** | None |
| **Testing** | `rg`, `awk`, `sed` and `comm` over the three YAML files, the `yaml` package under `.skilled/node_modules` as the parser and `validate.sh --strict` on this folder |

### Overview
The change moves steps and gate locations in `speckit-implement.yaml`, `speckit-complete.yaml` and `speckit-plan.yaml`. It adds two step keys, renames one and keeps every other key. Each move is proved by an ordering check that prints `before` or `after` for the line that matters.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The baseline ordering check `awk '/^  step_6_development:/{d=NR} /to Met/{print (d?"after":"before"), NR}' .skilled/commands/speckit/assets/speckit-implement.yaml` prints `before 543` before work starts

### Definition of Done
- [x] All acceptance criteria met
- [x] Every Verify command in `tasks.md` prints its expected output, and the YAML parse command in `tasks.md` prints `0` errors for each of the three files
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ordered step list.

### Key Components
- **`speckit-implement.yaml`**: the implement workflow. It gains `step_6_7_acceptance_verify` because no step after development sets a row today.
- **`speckit-complete.yaml`**: the complete workflow. It keeps its step keys except the merge step, which becomes `step_13_5_autopilot_archive_verify_merge`.
- **`speckit-plan.yaml`**: the plan workflow. It gains `step_5_5_task_breakdown` after planning and before the save, so plan writes `tasks.md`. It keeps every other step key.

### Data Flow
The router loads one workflow file. The agent runs its `workflow` steps in key order and evaluates each `quality_gates` block at its `location`. A check is true only when an earlier step produced its artifact, so each location must follow its producer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `speckit-implement.yaml` steps 1, 4, 5 and 6 | Producer of the step order for `/speckit:implement` | update | Ordering `awk` checks in `tasks.md` |
| `speckit-complete.yaml` steps 1, 3, 5, 9 and 12.5 and `quality_gates.post_execution` | Producer of the step order for `/speckit:complete` | update | Ordering `awk` checks and `rg -n 'location:'` |
| `speckit-plan.yaml` steps 1, 3 and 5, new `step_5_5_task_breakdown`, `inline_scaffolds`, `phase_decomposition` and `quality_gates.post_execution` | Producer of the step order for `/speckit:plan` | update | `rg -n 'location:'`, `rg -n 'insert_point'` and the T035 ordering `awk` |
| Routers, presentation files and `README.txt` | Show step numbers to the operator | unchanged here, phase 8 aligns them | `rg -l 'step_12_5' --glob '!specs/**' .` lists only `speckit-complete.yaml` |
| `test-phase-command-workflows.js` and other tests or docs outside `.skilled/commands/speckit/` | Assert workflow text such as `create.sh "{feature_description}" --phase` and the `checkpoints:` list | update only where an assertion breaks | T039 prints `failed=0` |
| Scripts such as `create.sh` and `recommend-level.sh` | Called by the workflows | not a consumer | The parent spec puts scripts out of scope |

Required inventories:
- Same-class producers: `rg -n 'to Met|set Met|Met or Waived|design choice|create\.sh|Verify/create|Verify or create|auto-create|insert_point|phase_count: 3' .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml .skilled/commands/speckit/assets/speckit-plan.yaml`. This found the complete copies of the plan defects in L6 and L7.
- Consumers of changed symbols: `rg -l 'step_12_5|step_4_acceptance_criteria|step_5_implementation_check|Step 12\.5' --glob '!specs/**' .` lists only `speckit-implement.yaml` and `speckit-complete.yaml`.
- Matrix axes: workflow (implement, complete, plan) by step-order fix. The rows are the requirement rows in `spec.md`.
- Algorithm invariant: a line that sets a row Met, a design-choice check and a gate location each sit after the step that produces what they check.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

- **Setup** records the baseline ordering checks and the YAML parse result for the three workflow files.
- **Implementation** moves steps, activities and gate locations in `speckit-implement.yaml`, `speckit-complete.yaml` and `speckit-plan.yaml`.
- **Verification** reruns every ordering check, parses the three files and runs `validate.sh --strict` on this folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each moved step, activity and gate location | `awk` ordering checks and `rg -n` line checks in `tasks.md` |
| Integration | All three files still parse, every `checkpoints:` entry names an existing key and the workflow contract test still passes | `node` with the `yaml` package, `comm -23`, `test-phase-command-workflows.js` |
| Manual | Read the implement and complete step lists top to bottom as the agent would | `rg -n '^  step_'` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `rg`, `awk`, `sed`, `comm` and `node` | External | Green | The verify commands cannot run |
| `yaml` package in `.skilled/node_modules` | Internal | Green | The parse check cannot run. Ruby's parser is not a substitute: it already rejects `speckit-plan.yaml` line 818 before any change |
| Phase 3 removal of the autopilot merge (M3) | Internal | Green | None for this phase. It only sets the position of the merge step |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an implement or complete run stalls at a moved step, or a YAML file fails to parse.
- **Procedure**: revert the commit that changed the three workflow files with `git revert <sha>`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup baselines | Verification |
| Verification | Implementation | Phase close and the start of phase 2 |
<!-- /ANCHOR:phase-deps -->

---

