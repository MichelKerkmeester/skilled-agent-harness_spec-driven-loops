---
title: "Feature Specification: Phase 2: required-artifact-gates"
description: "The quality gates in the plan, implement and complete workflows add up points against a threshold of 70, so a run passes a gate with a required file, test or description missing. This phase turns every gate into a list of required checks, removes checks no step produces and gives the consistency analysis a failure branch."
trigger_phrases:
  - "required artifact gates"
  - "phase 2 required artifact gates"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: required-artifact-gates

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `scaffold/002-required-artifact-gates` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 8 |
| **Predecessor** | 001-step-order-acceptance-after-development |
| **Successor** | 003-execution-mode-and-autopilot-contract |
| **Handoff Criteria** | Every gate under `quality_gates` in the three lifecycle workflows is a list of required checks with no points. Findings G1 to G7 are closed. This phase's `acceptance-criteria.md` has no `Unmet` row |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Fix the speckit command workflows: step order, quality gates, execution modes, review dispatch, resume detection, save and search contracts, shared blocks and documentation drift specification.

**Scope Boundary**: This phase owns what each gate checks and how it decides. It changes the `quality_gates` blocks, the prerequisite check in implement step 1 and the two consistency analysis steps in `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml`. Where a gate sits in the step order belongs to phase 1. How a failure branch behaves in auto and autopilot belongs to phase 3.

**Dependencies**:
- Phase 1 is Complete. Its step order and gate locations are the ones this phase writes checks against, and its step keys are the ones each `from:` field names.
- Phase 1 inserts plan's `step_5_5_task_breakdown`, which writes `tasks.md`. This phase makes plan's exit gate require that file filled.

**Deliverables**:
- The `quality_gates` blocks of the three lifecycle workflows as lists of required checks, each check with a producer and a decision rule.
- A failure branch in implement `step_3_analysis` and complete `step_8_analysis`.
- Implement step 1 that no longer requires `tasks.md` before step 2 writes it.
- A plan exit gate that requires a filled `tasks.md`, and an implement step 2 that writes `tasks.md` only when it is missing or unfilled.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Every gate in the three lifecycle workflows sums points against a threshold of 70, so an agent that follows it literally passes a gate with a required artifact missing. Complete's planning gate passes at 80 with no `tasks.md`, implement's post-implementation gate passes at 75 with no passing test and plan's entry gate passes at 70 with no feature description. Complete's planning gate also scores two checks that no step produces. Plan's exit gate scores `tasks.md`, which plan never fills and which the scaffold already writes. Implement step 1 halts on a missing `tasks.md` before step 2 can write it, and neither consistency analysis step says what happens when it finds a gap. The operator gets a run that reports a gate as passed while the thing the gate names is absent.

### Purpose
Each gate in plan, implement and complete passes only when every check it lists is true, and each check names the step that makes it true.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ cd .skilled/commands/speckit/assets && awk '/^quality_gates:/{f=1;next} /^[a-z_]+:/{f=0} f && /^  [a-z_]+:$|threshold:|points:/{sub(/^ +/,""); print FILENAME": "$0}' speckit-plan.yaml speckit-implement.yaml speckit-complete.yaml
speckit-plan.yaml: pre_execution:
speckit-plan.yaml: threshold: 70
speckit-plan.yaml: - { id: feature_description, points: 30 }
speckit-plan.yaml: - { id: spec_path_valid, points: 30 }
speckit-plan.yaml: - { id: no_blocking_deps, points: 20 }
speckit-plan.yaml: - { id: execution_mode_set, points: 20 }
speckit-plan.yaml: post_execution:
speckit-plan.yaml: threshold: 70
speckit-plan.yaml: - { id: spec_exists, points: 25 }
speckit-plan.yaml: - { id: plan_exists, points: 25 }
speckit-plan.yaml: - { id: tasks_exists, points: 20 }
speckit-plan.yaml: - { id: context_saved, points: 15 }
speckit-implement.yaml: pre_implementation:
speckit-implement.yaml: threshold: 70
speckit-implement.yaml: - { id: prerequisites_complete, points: 30 }
speckit-implement.yaml: - { id: plan_clarity, points: 25, criteria: "Pass only when plan.md states a concrete technical approach and affected files; fail if a material design choice remains." }
speckit-implement.yaml: - { id: task_breakdown_quality, points: 25 }
speckit-implement.yaml: - { id: checklist_verified, points: 20 }
speckit-implement.yaml: post_implementation:
speckit-implement.yaml: threshold: 70
speckit-implement.yaml: - { id: all_tasks_complete, points: 30 }
speckit-implement.yaml: - { id: tests_pass, points: 25 }
speckit-implement.yaml: - { id: summary_exists, points: 25 }
speckit-implement.yaml: - { id: checklist_verified, points: 20 }
speckit-complete.yaml: pre_execution:
speckit-complete.yaml: threshold: 70
speckit-complete.yaml: - { id: feature_description, points: 30 }
speckit-complete.yaml: - { id: spec_path_valid, points: 30 }
speckit-complete.yaml: - { id: execution_mode_set, points: 20 }
speckit-complete.yaml: - { id: continuity_ladder_walked, points: 20 }
speckit-complete.yaml: planning_gate:
speckit-complete.yaml: threshold: 70
speckit-complete.yaml: - { id: spec_exists, points: 20 }
speckit-complete.yaml: - { id: spec_no_clarification, points: 5 }
speckit-complete.yaml: - { id: plan_exists, points: 20 }
speckit-complete.yaml: - { id: plan_has_approach, points: 5 }
speckit-complete.yaml: - { id: tasks_exists, points: 20 }
speckit-complete.yaml: - { id: tasks_has_format, points: 5 }
speckit-complete.yaml: - { id: checklist_verified, points: 15 }
speckit-complete.yaml: - { id: review_approval, points: 10 }
speckit-complete.yaml: post_execution:
speckit-complete.yaml: threshold: 70
speckit-complete.yaml: - { id: tasks_complete, points: 30 }
speckit-complete.yaml: - { id: summary_exists, points: 25 }
speckit-complete.yaml: - { id: summary_sections, points: 15 }
speckit-complete.yaml: - { id: memory_saved, points: 20 }
speckit-complete.yaml: - { id: validation_passed, points: 10 }
```

Every gate above passes at 70. Complete's planning gate totals 100, so dropping `tasks_exists` (20) leaves 80 and it passes. Implement's `post_implementation` totals 100, so dropping `tests_pass` (25) leaves 75 and it passes. Plan's `pre_execution` totals 100, so dropping `feature_description` (30) leaves 70 and it passes. Plan's `post_execution` totals 85 (25 + 25 + 20 + 15), so dropping `context_saved` (15) leaves 70 and it passes.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Replace `points:` and `threshold:` in every `quality_gates` gate with a rule that passes only when every listed check passes, and make each `on_fail` name the failed checks.
- Add `from:` and `criteria:` to every gate check. Without `from:`, a check with no producing step stays invisible until a run blocks on it, which is how `review_approval` and `checklist_verified` reached complete's planning gate.
- Remove `review_approval` and `checklist_verified` from complete's planning gate, because no step makes them true before that gate runs. Confirm that `checklist_verified` stays out of implement's `pre_implementation` gate, where phase 1 removed it.
- Define once per workflow that an `_exists` check fails on a file that still holds a `YOUR_VALUE_HERE:` token, so a scaffold no longer satisfies it. Plan's exit gate keeps `tasks_exists` under that rule, and implement step 2 uses the rule to decide whether to write `tasks.md`.
- Move the `tasks.md` requirement out of implement step 1 into the `pre_implementation` gate, and add a failure branch to implement `step_3_analysis` and complete `step_8_analysis`.

### Out of Scope
- Where each gate sits in the step order, including plan's two gate locations and complete's exit gate after step 12 - phase 1 owns them (L4 and L5).
- What a failure branch does in auto, autopilot or a dispatched child - phase 3 owns mode behavior (M2).
- A review step that would produce `review_approval` - phase 4 owns review dispatch (D2).
- Renaming the `memory_saved` check - phase 7 owns retired vocabulary (B7).
- The bare `check-prerequisites.sh` name in implement step 1 - phase 7 owns the path (B5).
- Plan's success text and `plan.md:73`, which name `tasks.md` as a plan artifact. Plan now writes `tasks.md`, so that naming is correct. Phases 8 and 3 own any wording change (A10 and M1).
- Where plan's task breakdown step sits and what it writes - phase 1 inserts `step_5_5_task_breakdown`.
- `create.sh` and `check-prerequisites.sh` - the parent keeps scripts out of scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Modify | Entry and exit gates as required checks. `tasks_exists` read from `step_5_5_task_breakdown`. `feature_description` decided by a non-empty value. `spec_path_valid` exempts `:with-phases` |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modify | Both gates as required checks. Step 1 drops `--require-tasks`. Step 2 writes `tasks.md` only when it is missing or unfilled. `pre_implementation` gains `tasks_exists` and keeps `checklist_verified` out. `step_3_analysis` gains severities and `on_fail` |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modify | Three gates as required checks. Planning gate loses `review_approval` and `checklist_verified` and is stated once. `spec_path_valid` exempts `:with-phases`. `step_8_analysis` gains `on_fail` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

Commands below run from `.skilled/commands/speckit/assets/`. `Q` stands for `awk '/^[a-z_]+:/{f=($0 ~ /^quality_gates:/)} f'`, which prints the `quality_gates` block of a file. Step keys are the keys at review time. Where phase 1 renames a key, the requirement follows the step, not the old key.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every gate under `quality_gates` in `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml` passes only when every check it lists passes. Each gate carries `pass_when: every check passes`, and its `on_fail` names each failed check. For each file, `Q <file> \| rg 'points:\|threshold:\|\{score\}' \| wc -l` prints 0, and `Q <file> \| rg -c 'pass_when:'` prints 2 for plan, 2 for implement and 3 for complete (closes G1) |
| REQ-002 | Complete's `planning_gate` lists no `review_approval` and no `checklist_verified` check. Phase 1 removes `checklist_verified` from implement's `pre_implementation` gate, because acceptance verification runs after development. This phase verifies that same final state after it rewrites the gate and adds no second removal. `sed -n '/^  planning_gate:/,/^  [a-z_]*:$/p' speckit-complete.yaml \| rg 'review_approval\|checklist_verified' \| wc -l` prints 0, and `sed -n '/^  pre_implementation:/,/^  [a-z_]*:$/p' speckit-implement.yaml \| rg checklist_verified \| wc -l` prints 0 (closes G2) |
| REQ-003 | Plan writes `tasks.md` and its exit gate requires it filled. Plan's `step_5_5_task_breakdown`, which phase 1 inserts, is modelled on implement `step_2_task_breakdown` and complete `step_7_task_breakdown` and writes `tasks.md` from the tasks template. Plan's exit gate lists `tasks_exists` with `from: step_5_5_task_breakdown`, decided by `exists_rule`. `Q speckit-plan.yaml \| rg tasks_exists \| rg -c 'from: step_5_5_task_breakdown'` prints 1, and `sed -n '/^  step_5_5_task_breakdown:/,/^  step_6_save_context:/p' speckit-plan.yaml \| rg -c 'tasks\.md'` prints at least 1 (closes G3, D-05) |
| REQ-004 | Each workflow's `quality_gates` block carries one `exists_rule`: a check that a packet document exists passes only when the file exists and `rg -c 'YOUR_VALUE_HERE:' <file>` finds no match. Every `_exists` check is decided by it. So plan's `tasks_exists` fails on the scaffold `create.sh` writes until `step_5_5_task_breakdown` fills it. Implement `step_2_task_breakdown` applies the same rule. It validates a `tasks.md` that passes the rule and writes one only when the file is missing or fails the rule. `Q <file> \| rg -c '^  exists_rule:'` prints 1 for each of the three files, and that line contains `YOUR_VALUE_HERE:`. `sed -n '/^  step_2_task_breakdown:/,/^  step_3_analysis:/p' speckit-implement.yaml \| rg -c 'exists_rule'` prints at least 1, and the same range piped to `rg -c 'missing or'` prints at least 1 (closes G3, D-05) |
| REQ-005 | Implement `step_1_review_plan_and_spec` runs `check-prerequisites.sh --json` without `--require-tasks`. The `pre_implementation` gate lists `tasks_exists` with `from: step_2_task_breakdown`. `sed -n '/^  step_1_review_plan_and_spec:/,/^  step_[0-9]/p' speckit-implement.yaml \| rg require-tasks \| wc -l` prints 0, and `sed -n '/^  pre_implementation:/,/^  [a-z_]*:$/p' speckit-implement.yaml \| rg -c 'tasks_exists'` prints 1 (closes G5) |
| REQ-006 | Implement `step_3_analysis` and complete `step_8_analysis` each carry one `on_fail` branch. A CRITICAL or HIGH finding stops the run before development. So does a P0 requirement that no task covers. Complete returns to the step that wrote the named artifact: `step_3_specification`, `step_6_planning` or `step_7_task_breakdown`. Implement returns to `step_2_task_breakdown` for a `tasks.md` finding and stops with `/speckit:plan` named for a `spec.md` or `plan.md` finding. The analysis reruns after each fix, and after the third failed round the run stops and reports the open findings. Implement step 3 assigns the same four severities as complete step 8. `sed -n '/^  step_3_analysis:/,/^  step_[0-9]/p' speckit-implement.yaml \| rg -c 'on_fail:'` prints 1, the same command with `/^  step_8_analysis:/` on `speckit-complete.yaml` prints 1 and both blocks contain `CRITICAL` (closes G6) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | Every check under `quality_gates` carries `from:` and `criteria:`. `from:` names the step key that makes the check true, or `invocation` for a value the command line or intake binds. Every step key a `from:` names exists in the same file, and a check with no producer is removed. For each file, `Q <file> \| rg 'id:' \| rg -v 'from:' \| wc -l` prints 0, the same with `criteria:` prints 0 and each `from:` key other than `invocation` matches one line of `rg -c '^  <key>:' <file>` (closes G2) |
| REQ-008 | Complete states its planning gate checks once. `workflow_enforcement.phase_gate` and `step_7_task_breakdown.phase_gate_checkpoint` point at `quality_gates.planning_gate` instead of restating a different list. `rg -c 'quality_gates.planning_gate' speckit-complete.yaml` prints at least 2, and `sed -n '/^  phase_gate:/,/^  [a-z_]*:$/p' speckit-complete.yaml \| rg 'tasks.md exists' \| wc -l` prints 0 (closes G2) |
| REQ-009 | Plan's exit gate lists `spec_exists`, `plan_exists`, `tasks_exists` and `context_saved` and passes only when all four pass, so no check can be dropped. `sed -n '/^  post_execution:/,/^[a-z]/p' speckit-plan.yaml \| rg -o 'id: [a-z_]+'` prints those four ids and no other, and the same range piped to `rg -c 'pass_when:'` prints 1 (closes G4, D-05) |
| REQ-010 | Plan's entry gate fails when no feature description is bound. Its `feature_description` check carries `from: invocation` and a `criteria:` that requires a non-empty value from the command arguments or the `step_0.5_intake_branch` bind. Complete's `pre_execution` gate states the same check, since it has the same shape. `sed -n '/^  pre_execution:/,/^  [a-z_]*:$/p' <file> \| rg 'feature_description' \| rg -c 'non-empty'` prints 1 for plan and for complete (closes G7) |
| REQ-011 | The `spec_path_valid` check in the plan and complete `pre_execution` gates carries `from: step_0.5_intake_branch`, because the intake Emit phase creates the folder on the single-packet path. Its `criteria:` requires the folder to exist on that path. Under `:with-phases` it requires only a well-formed path, because P3 creates the folder after step 1. `sed -n '/^  pre_execution:/,/^  [a-z_]*:$/p' <file> \| rg 'spec_path_valid' \| rg -c 'with-phases'` prints 1 for plan and for complete (closes G7, D-13) |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The Measured Behavior command prints the gate names and no `threshold:` or `points:` line for any of the three workflows.
- **SC-002**: A fresh Level 2 scaffold fails `tasks_exists` under the new rule: `rg -c 'YOUR_VALUE_HERE:' tasks.md` on an unfilled scaffold prints a count above 0.
- **SC-003**: Every `from:` value in the three `quality_gates` blocks names a step key that exists in its own file, or `invocation`.
- **SC-004**: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `Result: passed=150 failed=0` or a higher pass count with `failed=0`, the same as its baseline before this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 step order and step keys | `from:` fields and the `sed` ranges name keys that phase 1 may rename or reorder | Start after phase 1 is Complete. Re-read each step key before writing a `from:` value |
| Risk | A required check with no producer blocks every run once points are gone | High | REQ-007 names a producer for every check before REQ-001 removes the slack. A check with no producer is removed, not kept |
| Risk | The `exists_rule` fails a packet whose docs carry a legitimate `YOUR_VALUE_HERE:` string | Low | The token only appears in unfilled template text. A gate that fails on it names the file, so the agent fills the token |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->

N/A. The change edits workflow text an agent reads. It runs no service and has no latency, security or uptime surface.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: `/speckit:plan` with no feature description and no intake bind fails `pre_execution` and its `on_fail` names `feature_description`.
- Maximum input: a gate whose every check fails reports every failed check id in one `on_fail` message, not only the first.
- Failure path: a consistency analysis that still has a CRITICAL finding after the third round stops the run and lists the open findings instead of starting development.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three YAML workflow files. Seven gate blocks, one prerequisite line and two analysis steps |
| Risk | 10/25 | Gates decide whether a run stops. A wrong check blocks every run or lets a bad one through |
| Research | 4/20 | The gate blocks, the prerequisite script and the scaffold manifest are already read |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Decided 2026-11-14: `/speckit:plan` writes `tasks.md` in `step_5_5_task_breakdown`, and its exit gate requires that file with no unfilled value token (REQ-003, REQ-004, REQ-009). This reverses the earlier default, which removed `tasks.md` from the gate (D-05).
- Decided 2026-11-14: implement `step_2_task_breakdown` validates an existing `tasks.md` and writes one only when it is missing or unfilled (REQ-004, D-05).
- Decided 2026-11-14: analysis severities CRITICAL and HIGH block a run. MEDIUM and LOW are recorded in the report (REQ-006, D-09).
- Decided 2026-11-14: the intake Emit phase creates the folder on the single-packet path, so `spec_path_valid` exempts `:with-phases` runs (REQ-011, D-13).
- Phase 1 owns the removal of `checklist_verified` from implement's `pre_implementation` gate. REQ-002 verifies the same final state.
- Decided 2026-11-14: this phase updates any test or doc outside `.skilled/commands/speckit/` that asserts text it changes (D-01).
- The scaffold manifest `templates/spec-kit-docs.json` lists `tasks.md` in `requiredCoreDocs` for levels 1, 2, 3 and 3+. Plan `step_3_specification` runs `create.sh`, so `tasks_exists` passes on an unfilled file today. REQ-004 closes that half of G3.
- None
<!-- /ANCHOR:questions -->

---

