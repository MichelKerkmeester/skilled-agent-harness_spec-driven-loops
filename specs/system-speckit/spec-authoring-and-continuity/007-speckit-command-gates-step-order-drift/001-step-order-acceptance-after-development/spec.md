---
title: "Feature Specification: Phase 1: step-order-acceptance-after-development"
description: "The implement and complete workflows mark acceptance criteria Met before any code exists, and implement never checks them again after development. Gates and checks sit at steps where they cannot yet be true. This phase moves each verification step and gate to the point where its check can pass."
trigger_phrases:
  - "step order acceptance after development"
  - "phase 1 step order acceptance after development"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: step-order-acceptance-after-development

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 8 |
| **Predecessor** | None |
| **Successor** | 002-required-artifact-gates |
| **Handoff Criteria** | Implement and complete run acceptance verification after development, findings L1 to L7 are closed and this phase's `acceptance-criteria.md` has no `Unmet` row |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Fix the speckit command workflows: step order, quality gates, execution modes, review dispatch, resume detection, save and search contracts, shared blocks and documentation drift specification.

**Scope Boundary**: This phase decides where steps and gates sit in `speckit-implement.yaml`, `speckit-complete.yaml` and `speckit-plan.yaml`. It moves steps, gate locations and the activities that belong to another step. It does not decide what a gate checks or how checks are scored. That is phase 2. It does not change mode wording, router text or presentation files.

**Dependencies**:
- None upstream. This is the first phase.
- Phase 2 starts from the step order this phase leaves. It removes or rewrites gate checks at the locations set here. It makes plan's exit gate require the `tasks.md` that `step_5_5_task_breakdown` writes.
- Phase 3 removes the autopilot merge (finding M3). This phase only moves that step after the exit gate.
- Phase 8 aligns routers, presentation files and the README with the step list this phase leaves.

**Deliverables**:
- `speckit-implement.yaml` with acceptance verification after development and the design-choice check before task breakdown.
- `speckit-complete.yaml` with an author-only acceptance step and an exit gate after the save.
- `speckit-plan.yaml` and `speckit-complete.yaml` with one folder creator per path and a phase decomposition that runs after analysis.
- `speckit-plan.yaml` with a task breakdown step after planning and before the save.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An agent that runs `/speckit:implement` marks every acceptance-criteria row Met in `step_4_acceptance_criteria`, two steps before `step_6_development` writes any code, and no later step sets a row again. `/speckit:complete` does the same in `step_5_acceptance_criteria`, before planning. No plan or implement step writes the rows, so on the plan-to-implement path step 4 checks a scaffold that holds one token row. A dispatched child that follows the step 4 or step 5 `child_dispatch` default takes Address Blockers whenever a P0 outcome depends on code not yet written (inferred from the default text, not observed in a run). Implement checks for open design choices in step 5, after tasks were broken down and analyzed from the undecided plan, and its rerun rule repeats only step 5. Complete's exit gate runs after step 12 and scores the save that step 13 performs, while autopilot merges in step 12.5 before either. Plan and complete create or verify the spec folder in four places, and phase decomposition estimates size before step 1 has analyzed anything. It then overrides the helper with three phases at level 3+, even when `recommend-level.sh --json --recommend-phases --loc 800 --files 20` prints `"recommended_phases": false` and `"suggested_phase_count": 0`. It plans the first child only and says nothing about the rest.

### Purpose
Every step that verifies, checks or gates something runs after the step that produces what it checks, and every gate location names a real step boundary before termination.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n '^  step_[0-9.]+_[a-z_]+:|set Met|Set each row to Met|row to Met' .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml
.skilled/commands/speckit/assets/speckit-implement.yaml:472:  step_1_review_plan_and_spec:
.skilled/commands/speckit/assets/speckit-implement.yaml:496:  step_2_task_breakdown:
.skilled/commands/speckit/assets/speckit-implement.yaml:525:  step_3_analysis:
.skilled/commands/speckit/assets/speckit-implement.yaml:536:  step_4_acceptance_criteria:
.skilled/commands/speckit/assets/speckit-implement.yaml:543:    - Set each row to Met, Waived or Superseded with observed evidence and mark the checklist items [x]
.skilled/commands/speckit/assets/speckit-implement.yaml:556:  step_5_implementation_check:
.skilled/commands/speckit/assets/speckit-implement.yaml:597:  step_6_development:
.skilled/commands/speckit/assets/speckit-implement.yaml:673:  step_7_completion:
.skilled/commands/speckit/assets/speckit-implement.yaml:739:  step_8_save_context:
.skilled/commands/speckit/assets/speckit-implement.yaml:762:  step_9_session_handover_check:
.skilled/commands/speckit/assets/speckit-complete.yaml:613:  step_0_autopilot_envelope:
.skilled/commands/speckit/assets/speckit-complete.yaml:643:  step_0.5_intake_branch:
.skilled/commands/speckit/assets/speckit-complete.yaml:701:  step_1_request_analysis:
.skilled/commands/speckit/assets/speckit-complete.yaml:735:  step_2_pre_work_review:
.skilled/commands/speckit/assets/speckit-complete.yaml:770:  step_3_specification:
.skilled/commands/speckit/assets/speckit-complete.yaml:826:  step_4_clarification:
.skilled/commands/speckit/assets/speckit-complete.yaml:845:  step_5_acceptance_criteria:
.skilled/commands/speckit/assets/speckit-complete.yaml:853:    - "FOR EACH ROW: verify the outcome → set Met with observed evidence → otherwise leave Unmet, or Waived/Superseded with an ADR that exists in decision-record.md"
.skilled/commands/speckit/assets/speckit-complete.yaml:888:  step_6_planning:
.skilled/commands/speckit/assets/speckit-complete.yaml:1011:  step_7_task_breakdown:
.skilled/commands/speckit/assets/speckit-complete.yaml:1059:  step_8_analysis:
.skilled/commands/speckit/assets/speckit-complete.yaml:1086:  step_9_implementation_check:
.skilled/commands/speckit/assets/speckit-complete.yaml:1117:  step_10_development:
.skilled/commands/speckit/assets/speckit-complete.yaml:1205:  step_11_acceptance_verify:
.skilled/commands/speckit/assets/speckit-complete.yaml:1211:    - Set every row to Met with observed evidence, or to Waived/Superseded naming an ADR that exists in decision-record.md
.skilled/commands/speckit/assets/speckit-complete.yaml:1244:  step_12_completion:
.skilled/commands/speckit/assets/speckit-complete.yaml:1313:  step_13_save_context:
.skilled/commands/speckit/assets/speckit-complete.yaml:1347:  step_14_handover_check:
```

Implement sets rows Met at line 543, before development at line 597, and has no set-Met line after it. Complete sets rows Met at line 853, before planning at line 888. It sets them again at line 1211, after development at line 1117. The pattern skips half-step keys such as `step_6_5_checkpoint_development` and `step_12_5_autopilot_archive_verify_merge`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move implement's row verification out of `step_4_acceptance_criteria` into a new `step_6_7_acceptance_verify` that runs after development. A new step is needed because no step after development sets a row today.
- Make implement's step 4 author the rows when only the scaffold row exists, as complete's step 5 does, and set none of them Met.
- Make complete's `step_5_acceptance_criteria` author-only, since `step_11_acceptance_verify` already verifies after development.
- Move implement's design-choice check from step 5 into step 1, before task breakdown.
- Move complete's exit gate after the save, move the autopilot merge step after the exit gate and give plan's two gates locations before termination.
- Give the spec folder one creator per path in plan and complete, run phase decomposition after step 1 and replace its fixed defaults with the helper's output.
- Insert plan's new `step_5_5_task_breakdown` after `step_5_planning` and before `step_6_save_context`, so plan writes `tasks.md` before the save and the exit gate.

### Out of Scope
- What each gate checks, its points and its threshold - phase 2 owns them (G1 to G7). This includes `checklist_verified` in complete's `planning_gate`, which G2 names.
- Removing the autopilot merge - phase 3 owns it (M3).
- The review agent dispatch condition that names Step 7 in implement - phase 4 owns it (D2).
- The save step text and the closing steps that offer a second save - phase 6 owns them (S13, S14).
- Renaming `memory_saved` and removing preflight and postflight - phase 7 owns them (B7, B8).
- Step numbers in routers, presentation files and the README - phase 8 owns them (A1).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modify | Step 4 authors rows and sets none Met, new `step_6_7_acceptance_verify`, design-choice check in step 1, `checklist_verified` out of the pre-implementation gate, coding-start rule names Step 6 |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modify | Author-only step 5, step 9 reads rows as authored, exit gate after step 13, merge step renamed `step_13_5_autopilot_archive_verify_merge`, one folder creator, phase decomposition after step 1, coding-start rule names Step 10 |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Modify | Exit gate after step 6, one folder creator, phase decomposition after step 1 with no fixed defaults, remaining children named at termination, new `step_5_5_task_breakdown` with a `tasks_md` inline scaffold |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `speckit-implement.yaml` has a `step_6_7_acceptance_verify` between `step_6_5_checkpoint_development` and `step_7_completion`. It sets every acceptance-criteria row to Met with observed evidence, or to Waived or Superseded with an ADR, and marks the checklist items. It is listed in `checkpoints:`. The `code_review` option and the step 6 `child_dispatch` name it as the next step. `awk '/^  step_6_development:/{d=NR} /to Met/{print (d?"after":"before"), NR}'` on the file prints at least one `after` line and no `before` line. (closes L1) |
| REQ-002 | Implement `step_4_acceptance_criteria` sets no row Met and marks no checklist item. When `acceptance-criteria.md` holds only the scaffold row, it writes one Unmet row per spec requirement, each naming its verification, as complete's step 5 does. Otherwise it confirms that every requirement has a row. Its `child_dispatch` defaults to Start Implementation when every requirement has a row. The T005 Verify command in `tasks.md` prints what it names. (closes L1) |
| REQ-003 | Implement `quality_gates.pre_implementation` no longer lists `checklist_verified`, because no row can be verified before development. `post_implementation` keeps its `checklist_verified` check. Points and threshold stay as they are for phase 2. (closes L1) |
| REQ-004 | Complete `step_5_acceptance_criteria` only authors rows. Its block holds no set-Met activity, no checklist `[x]` activity, no `closure_status` or `p0_status` output, no `acceptance_verified_and_marked` validation and no "Checklist verified" question. Its `child_dispatch` defaults to Proceed when every requirement has a row. (closes L2) |
| REQ-005 | Implement checks that `plan.md` leaves no design choice open in `step_1_review_plan_and_spec`, before `step_2_task_breakdown`. Its stop message sends the operator to `/speckit:plan` before implement validates or rewrites `tasks.md`, because plan reruns its task breakdown once the choice is decided (D-05). `step_5_implementation_check` keeps the environment, dependency and blocker checks only. `awk '/^  step_2_task_breakdown:/{t=NR} /design choice/{print (t?"after":"before"), NR}'` on the file prints no `after` line. (closes L3) |
| REQ-006 | Complete `quality_gates.post_execution` has location `Between Step 13 and Step 13.5`, so it runs after the save it scores and before the merge. The step that merges an autopilot branch is renamed `step_13_5_autopilot_archive_verify_merge` and sits after `step_13_save_context`, so no merge runs before the exit gate. (closes L4) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | Complete `step_9_implementation_check` confirms that each requirement has an acceptance-criteria row and does not require a row to be Met. `request_analysis_framework.pre_change_validation` drops `checklist_verified_L2_plus`, which `step_11_acceptance_verify` performs. The step 9 activity reads "Confirm each requirement has an acceptance-criteria row". The T002 `awk` in `tasks.md` prints no `before` line. (closes L2, same-class lines) |
| REQ-008 | Plan states the spec-and-plan check at one location, `workflow_enforcement.planning_gate` at `After Step 5`. `quality_gates.post_execution` moves from `After Step 7` to `After Step 6`, after the save it scores and before the closing step. `rg -n 'location:'` on the file prints no `After Step 7` line. (closes L5) |
| REQ-009 | Plan and complete create the spec folder in one place per path. Under `:with-phases`, P3 creates it and `step_0.5_intake_branch` skips its Emit phase. On every other path, the intake Emit phase creates it. `step_1_request_analysis` and `step_3_specification` verify the folder and never run `create.sh`. (closes L6) |
| REQ-010 | `optional_workflows.phase_decomposition` in plan and complete has `insert_point: "after_step_1"`. P1 reads `estimated_loc` and `estimated_files` from the step 1 output, and step 1 names both in its outputs. (closes L7) |
| REQ-011 | The phase decomposition `defaults` in plan and complete hold no `phase_count: 3` and no `parent_level: "3+"`. P3 passes the number of phases P2 defined to `--phases` and the `recommended_level` P1 printed to `--level`. (closes L7) |
| REQ-012 | After decomposition, plan and complete record a `remaining_children` list. Their termination names each remaining child folder with the command that plans or completes it. (closes L7) |
| REQ-013 | No existing step key is renumbered except the merge step REQ-006 moves. A sorted step-key list taken before and after the change differs by `step_6_7_acceptance_verify`, `step_5_5_task_breakdown` and `step_13_5_autopilot_archive_verify_merge` added and `step_12_5_autopilot_archive_verify_merge` removed. Every `checkpoints:` entry names a step key that exists. The coding-start rule names the development step: `before Step 6` in implement, at both lines, and `before Step 10` in complete. After the change `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0`. A test or doc outside `.skilled/commands/speckit/` that asserts text this phase changes is updated in this phase (D-01). (supports L1 and L2. No ledger row names the stale `before Step 5` and `before Step 8` text) |
| REQ-014 | `speckit-plan.yaml` gains `step_5_5_task_breakdown` after `step_5_planning` and before `step_6_save_context`. It is modelled on implement `step_2_task_breakdown` and complete `step_7_task_breakdown`. It loads `plan.md` and `spec.md`, writes `tasks.md` from the tasks template and names `tasks.md` in its outputs. Its `template_prompt_contract` names `inline_scaffolds.tasks_md`, which plan's `template_compliance.inline_scaffolds` gains. It is listed in `checkpoints:`. The step 5 Approve Plan option names task breakdown as the next step. `quality_gates.post_execution` stays at `After Step 6`, because the save is still the last step that produces a checked artifact. The T035 `awk` prints `ordered` (D-05) |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: In implement and complete, the ordering `awk` checks in REQ-001 and REQ-007 print only `after` lines for every line that sets a row Met.
- **SC-002**: `rg -n 'location:'` on plan and complete prints a location for every gate that is a step boundary before `termination.after_step`, and complete's exit gate reads `Between Step 13 and Step 13.5`.
- **SC-003**: `rg -n 'phase_count: 3|parent_level: "3\+"'` on plan and complete prints nothing and exits 1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 3 removes the autopilot merge (M3) and keeps archive and verify | `step_13_5` keeps its place after the exit gate | REQ-006 places it after the gate now. Phase 3 changes what the step does, not where it sits |
| Risk | Phases 2 to 8 cite review-time keys such as `step_12_5_autopilot_archive_verify_merge` | Med | Rename one key only and add one new key. Record the old and new keys in `implementation-summary.md`. A repository search found no consumer of these keys outside the two workflow files |
| Risk | REQ-010 moves phase decomposition after step 1, so under `:with-phases` the folder does not exist yet when `pre_execution` checks `spec_path_valid` before Step 1 in plan and complete | Med | Phase 2 owns that check. Its `spec_path_valid` rule exempts `:with-phases` runs, where P3 creates the folder after step 1 |
| Risk | Routers and presentation files list the old step order until phase 8 runs | Low | Out of Scope names phase 8 as the owner. The workflow file is what the agent executes |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A. The change edits workflow text that an agent reads. It runs no service, so it has no latency, security or uptime target.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a Level 1 packet has no `acceptance-criteria.md`, so step 4 and `step_6_7_acceptance_verify` skip, as step 4 does today.
- Maximum input: a `:with-phases` run with many children plans the first child and names every other child in `remaining_children` at termination.
- Failure path: a P0 row still Unmet at `step_6_7_acceptance_verify` halts the run before `step_7_completion`, as complete's `step_11_acceptance_verify` does.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three workflow YAML files, about 120 changed lines, no script |
| Risk | 12/25 | Changes what an agent does in every implement and complete run. One step key is renamed |
| Research | 6/20 | The defects are located. Only the creator and decomposition order needed reading of the intake contract |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Decided 2026-11-14: plan and complete do not loop over every phase child. They name the remaining children at termination (REQ-012), because a loop is a new capability (D-11).
- Decided 2026-11-14: implement step 4 authors the acceptance-criteria rows when only the scaffold row exists (REQ-002), because no plan step writes them (D-12).
- Decided 2026-11-14: the intake Emit phase owns folder creation on the single-packet path (REQ-009), because it runs before step 1 and already publishes the canonical trio (D-13).
- Decided 2026-11-14: `/speckit:plan` writes `tasks.md` in a new task breakdown step between planning and the save (REQ-014). Phase 2 makes the exit gate require it filled (D-05).
- Decided 2026-11-14: autopilot never merges. Phase 3 removes the merge, and `step_13_5` keeps archive and verify and reports the branch (D-02, D-14). This phase only fixes its position.
- Decided 2026-11-14: this phase updates any test or doc outside `.skilled/commands/speckit/` that asserts text it changes (REQ-013, D-01).
- Ledger row L5 cites `speckit-plan.yaml:416` as a planning gate. Line 416 is `quality_gates.post_execution`, the exit gate, and line 462 is `workflow_enforcement.planning_gate`. REQ-008 fixes the exit gate location and keeps the planning check at one location.
- Ledger rows L6 and L7 cite plan only. `speckit-complete.yaml` carries the same `phase_decomposition` block at lines 138 to 177 and the same step 1 and step 3 creation text, so REQ-009 to REQ-012 cover both files.
- None
<!-- /ANCHOR:questions -->

---


