---
title: "Feature Specification: Phase 3: execution-mode-and-autopilot-contract"
description: "Plan and implement accept autopilot but define nothing for it. Complete's autopilot creates a branch and merges on its own. Many stop-and-ask branches carry no mode tag. This phase gives auto, confirm and autopilot one contract in all three lifecycle workflows, their routers and their presentation files."
trigger_phrases:
  - "execution mode and autopilot contract"
  - "phase 3 execution mode and autopilot contract"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: execution-mode-and-autopilot-contract

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
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 8 |
| **Predecessor** | 002-required-artifact-gates |
| **Successor** | 004-code-review-and-dispatch-policy |
| **Handoff Criteria** | All three lifecycle workflows define auto, confirm and autopilot the same way, findings M1 to M7 are closed and this phase's `acceptance-criteria.md` has no `Unmet` row |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Fix the speckit command workflows: step order, quality gates, execution modes, review dispatch, resume detection, save and search contracts, shared blocks and documentation drift specification.

**Scope Boundary**: The execution-mode text of `/speckit:plan`, `/speckit:implement` and `/speckit:complete`. That is the mode blocks, rule lists and stop-and-ask branches in the three workflow YAML files, the mode sections of the three routers and the startup, dashboard and result blocks of the three lifecycle presentation files. Resume, save, search and handoff are not touched.

**Dependencies**:
- Phase 1 reorders steps and may rename step keys. This phase re-reads the key list before it edits any step.
- Phase 1 inserts plan's `step_5_5_task_breakdown` after its planning step and before its save step, because plan now writes `tasks.md` (finding G3). Phase 2 makes plan's exit gate require that file filled. The task metadata rule in this phase goes on that step and on the task breakdown steps of implement and complete.
- Phase 4 owns the dispatch policy (D1), phase 6 may remove the closing save steps (S14) and phase 7 owns the timers (B9) and the shared include. This phase only makes sure no stop-and-ask branch is left without a mode statement.

**Deliverables**:
- One `unattended_autopilot` block, byte-identical in the three lifecycle workflows.
- A `modes` statement on every stop-and-ask branch listed in section 3.
- A `modes` statement on every ask-first `pre_phase_parallel_check` in implement and complete.
- An autopilot that stops at a verified branch, takes its workspace from the operator and never merges.
- Rule lists that split approval rules by mode.
- Presentation blocks for autopilot and for `--intake-only`.
- One stated loop for the Review and Modify checkpoint options.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
An agent that runs `/speckit:plan:autopilot` or `/speckit:implement:autopilot` finds no autopilot block in the workflow, so it has no result line, no reason codes and no rule for what to do when it would ask. An agent in `:auto` meets stop-and-ask branches that only a dispatched child is exempt from, and the rule list tells it both never to prompt and to get approval for a P1 deferral. Complete's autopilot creates a branch and merges it with no operator choice, which `AGENTS.md` and sk-git forbid, and no presentation file shows autopilot at all.

### Purpose
Each of the three modes has one written contract that is the same in all three lifecycle workflows, and an agent in any mode can tell from the branch it is on whether to ask, take a default or stop with a result line.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ rg --sort path --count --include-zero 'SPECKIT_AUTOPILOT_RESULT' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml .skilled/commands/speckit/assets/speckit-plan-presentation.txt .skilled/commands/speckit/assets/speckit-implement-presentation.txt .skilled/commands/speckit/assets/speckit-complete-presentation.txt
.skilled/commands/speckit/assets/speckit-plan.yaml:0
.skilled/commands/speckit/assets/speckit-implement.yaml:0
.skilled/commands/speckit/assets/speckit-complete.yaml:3
.skilled/commands/speckit/assets/speckit-plan-presentation.txt:0
.skilled/commands/speckit/assets/speckit-implement-presentation.txt:0
.skilled/commands/speckit/assets/speckit-complete-presentation.txt:0
```

Only `speckit-complete.yaml` names the autopilot result line, 3 times. The plan and implement workflows and all three presentation files name it 0 times, although all three routers bind `:autopilot`. Each requirement below that closes M1 or M5 is met only when this same command prints a count above 0 for every row.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Copy complete's `unattended_autopilot` block into the plan and implement workflows, rewritten so the three copies are byte-identical, and point each `execution_mode.rule` at it.
- Add a `modes` statement with `confirm`, `auto` and `autopilot` keys to every stop-and-ask branch in the inventory below and to every ask-first `pre_phase_parallel_check`.
- Rewrite autopilot so its workspace comes from the operator's startup choice, it creates a branch only through sk-git and it never merges or pushes.
- Split the `rules` lists so approval rules apply to the mode they belong to.
- Add autopilot startup, dashboard, fail-fast and result text to the three lifecycle presentation files, add an intake-only result block to plan's presentation file and state the Review and Modify loop once in each workflow.

No new file is created. A shared include would remove the three copies, but that is phase 7's deliverable. Until then the copies are byte-identical, so a `diff` proves they agree.

### Out of Scope
- Step order, step renames and gate location - phase 1 owns findings L1 to L7.
- Gate contents and the `tasks.md` exit gate - phase 2 owns findings G1 to G7. Phase 1 inserts plan's `step_5_5_task_breakdown`. This phase only puts the task metadata rule on that step.
- Which dispatch policy plan uses - phase 4 owns finding D1. This phase only tags the ask in it.
- Removing the closing save steps - phase 6 owns finding S14. This phase only tags the ask in them.
- The shared include, the timers and the 10-minute timebox - phase 7 owns findings B1, B2 and B9.
- Step counts in success text, the README and the `tasks.md` wording in plan's success text - phase 8 owns findings A1, A2 and A10.
- Resume, which takes only `:auto` and `:confirm` (`resume.md:3`) - it has no autopilot to define.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modify | Rewrite `unattended_autopilot`, `step_0_autopilot_envelope` and `step_13_5_autopilot_archive_verify_merge` to the no-merge contract. Add `modes` to each ask branch and to each `pre_phase_parallel_check`. Split `rules`. State the loop |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Modify | Add `unattended_autopilot`. Add `modes` to each ask branch. Split `rules`. State the loop. Point the intake-only gate at its result block. Put the task metadata rule on plan's task breakdown step |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modify | Add `unattended_autopilot`. Add `modes` to each ask branch and to the `pre_phase_parallel_check`. Split `rules`. State the loop. Put the task metadata rule on `step_2_task_breakdown` |
| `.skilled/commands/speckit/assets/speckit-plan-presentation.txt` | Modify | Autopilot startup, dashboard, fail-fast and result text. Intake-only result block. `Defaults taken:` line |
| `.skilled/commands/speckit/assets/speckit-implement-presentation.txt` | Modify | Autopilot startup, dashboard, fail-fast and result text. `Defaults taken:` line |
| `.skilled/commands/speckit/assets/speckit-complete-presentation.txt` | Modify | Autopilot startup, dashboard, fail-fast and result text. `Defaults taken:` line |
| `.skilled/commands/speckit/plan.md` | Modify | Execution target matches the workflow. The unattended task metadata section names plan's task breakdown step |
| `.skilled/commands/speckit/implement.md` | Modify | Execution target and unattended termination match the no-merge contract |
| `.skilled/commands/speckit/complete.md` | Modify | Unattended result contract drops the branch-first and merge lines |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/speckit-autopilot-contract.vitest.ts` | Modify | Its `AUTOPILOT_SEQUENCE` pins `merge_on_clean`, so the no-merge contract fails it. Its `touched-files` assertion on `plan.md` stays |
| `.skilled/skills/system-spec-kit/feature-catalog/lifecycle/speckit-autopilot-lifecycle.md`, `.skilled/skills/system-spec-kit/manual-testing-playbook/lifecycle/speckit-autopilot-lifecycle.md`, `.skilled/skills/system-spec-kit/README.md`, `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | Each states that autopilot merges after clean verification or that it branches first. Their plan-side task metadata text stays |

### Stop-and-Ask Branches Without a Mode Tag

Each key below asks the operator or waits for one and carries no `applies_to: confirm`. Class B has only a `child_dispatch` carve-out, which the ledger names. Class C has no carve-out at all, so even a dispatched child would stop. Keys are as read on 2026-11-14.

| File | Key | What it does | Class |
|------|-----|--------------|-------|
| `speckit-plan.yaml` | `optional_workflows.phase_decomposition.checkpoint` | Prompts `[Y/n/review]` after decomposition | C |
| `speckit-plan.yaml` | `confidence_framework.thresholds.low` | `STOP - Ask clarification with A/B/C options` | C |
| `speckit-plan.yaml` | `workflow.step_0.5_intake_branch.on_trigger.inline_start_intake` | Asks the intake questions in one prompt and names no autopilot behavior | C |
| `speckit-plan.yaml` | `workflow.step_1_request_analysis.confidence_checkpoint.thresholds.low_below_40` | `wait_for: "User response"` | C |
| `speckit-plan.yaml` | `workflow.step_3_specification.pre_phase_parallel_check.decision_logic` | `ALWAYS ask user` | C |
| `speckit-plan.yaml` | `workflow.step_3_specification.confidence_checkpoint.thresholds.low_below_40` | `wait_for: "User response before finalizing spec.md"` | C |
| `speckit-plan.yaml` | `workflow.step_5_planning.confidence_checkpoint.thresholds.low_below_40` | `wait_for: "User decision"` | C |
| `speckit-plan.yaml` | `workflow.step_5_planning.confidence_checkpoint.escalation` | `Present options with current findings` | C |
| `speckit-plan.yaml` | `error_recovery.step_validation_fails` | `ask clarifying questions` | C |
| `speckit-implement.yaml` | `gate_3_compliance.first_message_protocol` and `gate_3_compliance.failure_pattern_19.action` | Ask the spec folder question and wait for A/B/C/D | B |
| `speckit-implement.yaml` | `agent_availability.debug.on_threshold` | Prompts `(y / continue manually / skip)` | B |
| `speckit-implement.yaml` | `confidence_framework.thresholds.low` | `STOP - Ask A/B/C clarification` | B |
| `speckit-implement.yaml` | `workflow.step_6_development.pre_phase_parallel_check.decision_logic` | `ask user` | B |
| `speckit-implement.yaml` | `workflow.step_6_development.debug_delegation.action` | `STOP` and prompt for the debug dispatch | B |
| `speckit-implement.yaml` | `workflow.step_6_development.confidence_checkpoint.per_task_assessment.thresholds.low_below_40` | `STOP: A) Research B) Simplify C) Skip` | B |
| `speckit-implement.yaml` | `workflow.step_9_session_handover_check` (`activities`, `handover_prompt`, `behavior`) | `Display closeout prompt, Wait for response` | C |
| `speckit-implement.yaml` | `error_recovery.step_validation_fails` and `error_recovery.prerequisites_insufficient` | `ask clarifying questions` and `ask user` | C |
| `speckit-complete.yaml` | `operating_mode.description` | `Checkpoints still pause for confirmation after optional workflows complete` | C |
| `speckit-complete.yaml` | `optional_workflows.research_integration.checkpoint` | Prompts `[Y/n/review]` after research | C |
| `speckit-complete.yaml` | `optional_workflows.phase_decomposition.checkpoint` | Prompts `[Y/n/review]` after decomposition | C |
| `speckit-complete.yaml` | `workflow.phase_3_research.actions.if_triggered` | `on_complete: "show_checkpoint"` | C |
| `speckit-complete.yaml` | `agent_availability.debug.on_threshold` | Prompts `(y / continue manually / skip)` | C |
| `speckit-complete.yaml` | `confidence_framework.thresholds.low` | `STOP - Ask A/B/C clarification` | C |
| `speckit-complete.yaml` | `request_analysis_framework.pre_change_validation` | Lists `user_approval` as a check | C |
| `speckit-complete.yaml` | `workflow.step_0.5_intake_branch.on_trigger.inline_start_intake` | Asks the intake questions in one prompt and names no autopilot behavior. Found when the inventory was rebuilt at Setup | C |
| `speckit-complete.yaml` | `workflow.step_1_request_analysis.confidence_checkpoint.thresholds.low_below_40` | `wait_for: "User response"` | C |
| `speckit-complete.yaml` | `workflow.step_3_specification.confidence_checkpoint.thresholds.low_below_40` | `wait_for: "User response"` | C |
| `speckit-complete.yaml` | `workflow.step_6_planning.confidence_checkpoint.thresholds.low_below_40` | `wait_for: "User decision"` | C |
| `speckit-complete.yaml` | `workflow.step_6_planning.confidence_checkpoint.escalation` | `Present options to user` | C |
| `speckit-complete.yaml` | `workflow.step_8_analysis.activities` | `Suggest remediations (non-destructive, user must approve)` | C |
| `speckit-complete.yaml` | `workflow.step_10_development.confidence_checkpoint.per_task_assessment.thresholds.low_below_40` | `wait_for: "Resolution"` | C |
| `speckit-complete.yaml` | `workflow.step_10_development.debug_escalation.on_threshold_reached` | `prompt_user_with_y_n_skip` and `The workflow STOPS and waits` | C |
| `speckit-complete.yaml` | `workflow.step_14_handover_check.options` | Refresh or Skip options outside the confirm checkpoint | C |
| `speckit-complete.yaml` | `error_recovery.step_validation_fails` and `error_recovery.prerequisites_insufficient` | `ask clarifying questions` and `ask user` | C |

The P1 deferral approvals (`rules.ALWAYS` in all three files, `verification_protocol.p1` in implement `step_4_acceptance_criteria`, `verification_protocol.p1_handling` in complete `step_5_acceptance_criteria` and the P1 line in complete `step_11_acceptance_verify.activities`) are finding M4 and are handled by REQ-007.

The `pre_phase_parallel_check` blocks in complete `step_3_specification`, `step_8_analysis` and `step_10_development` hold no ask wording. They ask through `parallel_dispatch_config.thresholds.ask_min`, so the inventory search above does not find them. They and implement `step_6_development.pre_phase_parallel_check` are finding X1 and are handled by REQ-012.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

Commands run from the repository root. `A` is `.skilled/commands/speckit/assets` and `C` is this phase folder.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml` each carry an `unattended_autopilot` top-level block, and the three blocks are byte-identical when dumped by PyYAML. Each `execution_mode.rule` names that block and no longer says `as the command router states`. The Measured Behavior command prints a count above 0 for each of the three YAML files (closes M1) |
| REQ-002 | The unattended task metadata rule (`agent`, `deps`, `touched-files`, with `uncertainty_blocked` when a field cannot be set) sits on every workflow step that writes `tasks.md`. Three steps write it: `step_5_5_task_breakdown` in plan, `step_2_task_breakdown` in implement and `step_7_task_breakdown` in complete. Phase 1 inserts plan's step after its planning step and before its save step. Implement's step keeps the rule because it creates `tasks.md` when the file is missing or unfilled. The Unattended Task Metadata section of `plan.md` stays and names plan's task breakdown step. `python3 -c "import yaml,sys; [print(f.split('/')[-1], sorted(k for k,v in yaml.safe_load(open(f))['workflow'].items() if k.endswith('_task_breakdown') and 'touched-files' in yaml.safe_dump(v))) for f in sys.argv[1:]]" $A/speckit-{plan,implement,complete}.yaml` prints one key that ends in `_task_breakdown` for each file (closes M1) |
| REQ-003 | Every key in the section 3 inventory carries a `modes` map with `confirm`, `auto` and `autopilot` keys, or is moved under a block marked `applies_to: confirm`. Under `auto` a key may say `ask` only where the framework requires a stop: confidence below 40 and the Gate 3 spec folder question. Every other key names the default `auto` takes. Under `autopilot` no key says `ask` after startup. Each names a default or a `SPECKIT_AUTOPILOT_RESULT` line with reason `uncertainty_blocked`. `python3 $C/scratch/check-mode-tags.py $A/speckit-plan.yaml $A/speckit-implement.yaml $A/speckit-complete.yaml` prints `untagged: 0` and `autopilot_ask: 0` (closes M2) |
| REQ-004 | Autopilot never merges and never pushes. In all three workflows the success schema reads `"merged":false`, `merge_on_clean` is gone from every sequence and `step_13_5_autopilot_archive_verify_merge` becomes `step_13_5_autopilot_archive_verify` with no merge activity. The renamed step keeps its `archive_in_place` and `verify_clean` activities and reports the branch in the `"branch":"<branch>"` field the success schema already carries. `complete.md` says the merge is left to the operator. `rg -n -e merge_on_clean -e '"merged":true' -e 'Merge only after' .skilled/commands/speckit` prints nothing (closes M3) |
| REQ-005 | Autopilot takes its workspace from the operator. A `workspace_choice` of `worktree` or `current_branch` is bound at startup, by a pre-bound answer or by the one startup question. `worktree` creates the branch only through `git worktree add -b`, as sk-git SKILL.md section 3 states. A run with `AI_SESSION_CHILD=1`, or one already inside a linked worktree, uses the current branch. With no bound choice the run emits a `SPECKIT_AUTOPILOT_RESULT` line with reason `uncertainty_blocked` before any write. `bind_workspace` replaces `branch_first` in `unattended_autopilot.lifecycle_sequence` and in `step_0_autopilot_envelope.sequence`. `rg -n -e branch_first -e 'create or switch to an autopilot branch' $A` prints nothing and `rg -c 'workspace_choice' $A/speckit-plan.yaml $A/speckit-implement.yaml $A/speckit-complete.yaml` prints a count above 0 for each (closes M3) |
| REQ-006 | The autopilot contract test is updated to the no-merge sequence and passes. `npx vitest run tests/unit/speckit-autopilot-contract.vitest.ts`, run from `.skilled/skills/system-deep-loop/runtime/`, exits 0. The feature catalog, the playbook scenario, the system-spec-kit README row and `command-contract.json` no longer say autopilot merges. The operator approved these edits outside the command folder on 2026-11-14 (closes M3) |
| REQ-007 | `rules.ALWAYS` in the three workflows holds neither `do_not_prompt_for_user_approval` nor `get_user_approval_for_p1_deferrals`. `get_user_approval_for_p1_deferrals` moves to `rules.CONFIRM_ONLY` and `do_not_prompt_for_user_approval` moves to `rules.AUTO_AND_AUTOPILOT`. Under auto and autopilot an unfinished P1 item stays `Unmet`, the result names it and the run does not report success. Autopilot reports it with reason `verification_failed`. The P1 texts in implement `step_4_acceptance_criteria` and complete `step_5_acceptance_criteria` and `step_11_acceptance_verify` state the same split (closes M4) |
| REQ-008 | `speckit-plan-presentation.txt` has an Intake-Only Result block. It names the published trio, says planning steps 1 to 7 did not run and ends with `STATUS=OK PATH=[spec-folder-path]`. Its wording matches `step_0.6_intake_only_gate.halt_condition.message`, and that gate names the block. `rg -n 'Planning Steps 1-7 bypassed' $A/speckit-plan-presentation.txt $A/speckit-plan.yaml` prints one line per file (closes M6) |
| REQ-012 | Every `pre_phase_parallel_check` in implement and complete carries a `modes` map with `confirm`, `auto` and `autopilot` keys. That is implement `step_6_development` and complete `step_3_specification`, `step_8_analysis` and `step_10_development`. `confirm` keeps the ask that `parallel_dispatch_config.thresholds.ask_min` triggers. `auto` and `autopilot` take `direct`, the step's own fallback, which implement's `child_dispatch` line already takes. Under `auto` the default is listed on the `Defaults taken:` line. The implement key also sits in the section 3 inventory, so REQ-003 and this requirement name the same default. `python3 -c "import yaml,sys; [print(f.split('/')[-1], sorted(k for k,v in yaml.safe_load(open(f))['workflow'].items() if isinstance(v,dict) and 'pre_phase_parallel_check' in v and not (all(str(v['pre_phase_parallel_check'].get('modes',{}).get(m,'')).startswith('direct') for m in ('auto','autopilot')) and 'confirm' in v['pre_phase_parallel_check'].get('modes',{})))) for f in sys.argv[1:]]" $A/speckit-{implement,complete}.yaml` prints `speckit-implement.yaml []` and `speckit-complete.yaml []` (closes X1) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | Each of the three lifecycle presentation files offers autopilot as a third answer to the execution mode question and shows `AUTOPILOT` in the dashboard `Mode:` field. It states that autopilot resolves setup like `:auto` plus `workspace_choice`. It has an Autopilot Result block that prints one `SPECKIT_AUTOPILOT_RESULT` line with the workflow's schema. Its fail-fast display ends with that line instead of a bare `STATUS=FAIL`. The Measured Behavior command prints a count above 0 for each presentation file (closes M5) |
| REQ-010 | `mode_overrides.confirm.checkpoint_behavior` is byte-identical in the three workflows and states the loop. Approve marks the step complete and continues. An option that shows information (labels that start with Review, View, Show or Check) shows it, then presents the same checkpoint again. An option that asks for a change (labels that start with Modify, plus Address Blockers and Adjust Baseline) applies the change, reruns that step's `post_write_validation` when the step has one, then presents the same checkpoint again. `rg -c 'same checkpoint again' $A/speckit-plan.yaml $A/speckit-implement.yaml $A/speckit-complete.yaml` prints a count above 0 for each (closes M7) |
| REQ-011 | Under `auto`, each default a key takes in place of an ask is listed on a `Defaults taken:` line of the result display in the three lifecycle presentation files. Without it the operator cannot see which questions an `auto` run answered for them, such as the debug offer or the phase decomposition checkpoint. `rg -c 'Defaults taken:' $A/speckit-plan-presentation.txt $A/speckit-implement-presentation.txt $A/speckit-complete-presentation.txt` prints a count above 0 for each (closes M2) |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The Measured Behavior command prints a count above 0 on all six rows.
- **SC-002**: `python3 $C/scratch/check-mode-tags.py` over the three workflows prints `untagged: 0` and `autopilot_ask: 0`.
- **SC-003**: `rg -n -e merge_on_clean -e '"merged":true' -e 'create or switch to an autopilot branch' .skilled/commands/speckit` prints nothing.
- **SC-004**: The three workflow files still load with `yaml.safe_load`, and the autopilot contract test exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 1 and 2 edit the same three workflow files and may rename step keys | An edit lands on a key that no longer exists | Re-read the step key list of each workflow at Setup and rebuild the inventory from the live files |
| Dependency | Phase 1 inserts plan's `step_5_5_task_breakdown` | REQ-002 has no plan step to land on until phase 1 closes | Setup re-reads plan's step keys and puts the rule on the key that ends in `_task_breakdown` |
| Risk | The autopilot contract test pins `merge_on_clean` and the branch-first order | High. The test fails the moment REQ-004 lands | Change the test in the same edit as the workflow, and run it before and after |
| Risk | The three copies of `unattended_autopilot` and `checkpoint_behavior` drift before phase 7 lifts them | Med | The REQ-001 and REQ-010 checks compare the copies byte for byte |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->

### Performance
- **NFR-P01**: N/A. The change edits workflow text and runs no service.

### Security
- **NFR-S01**: No workflow text tells an agent to run `git branch`, `git checkout -b`, `git switch -c`, `git merge` or `git push` under autopilot. `rg -n 'git (branch|checkout -b|switch -c|merge|push)' $A/speckit-complete.yaml $A/speckit-plan.yaml $A/speckit-implement.yaml` prints only lines that forbid them.

### Reliability
- **NFR-R01**: The three workflow files load with `python3 -c "[__import__('yaml').safe_load(open(f)) for f in __import__('sys').argv[1:]]" .skilled/commands/speckit/assets/speckit-{plan,implement,complete}.yaml`, which prints nothing and exits 0.
- **NFR-R02**: No new file is added under `.skilled/commands/speckit/`. `git status --short .skilled/commands/speckit` shows only `M` lines.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: `/speckit:complete:autopilot` with no pre-bound `workspace_choice` and no one to answer emits `SPECKIT_AUTOPILOT_RESULT` with `"ok":false` and reason `uncertainty_blocked` before it writes any file.
- Maximum input: a run in which every branch in the inventory fires takes each named default under `auto` and lists each on the `Defaults taken:` line. It stops only at a confidence below 40.
- Failure path: an autopilot run whose verification fails emits `SPECKIT_AUTOPILOT_RESULT` with `"ok":false`, reason `verification_failed` and `"merged":false`, and leaves the branch in place.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Nine command files plus up to five consumer files, about 250 changed lines of YAML and text |
| Risk | 14/25 | Changes what autopilot does with git, and one contract test pins the old behavior |
| Research | 5/20 | The inventory in section 3 is done. Only the re-read after phases 1 and 2 remains |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Decided 2026-11-14: autopilot stops at a verified branch and never merges or pushes (D-02). REQ-004 holds it, because sk-git and `AGENTS.md` leave the merge to the operator.
- Decided 2026-11-14: autopilot takes its workspace from the operator's startup choice, and only `git worktree add -b` creates a branch (D-02). REQ-005 holds it, because sk-git SKILL.md section 3 forbids the AI to choose the workspace or to create a branch with `git branch`, `git checkout -b` or `git switch -c`.
- Decided 2026-11-14: this phase edits the tests and docs outside `.skilled/commands/speckit/` that assert the old autopilot text (D-01). REQ-006 holds it, because the contract test fails otherwise.
- Decided 2026-11-14: under `auto` and `autopilot` an unfinished P1 item fails the run, and the result names the item and does not report success (D-04). REQ-007 holds it.
- Decided 2026-11-14: `auto` keeps the ask at confidence below 40 and every other ask takes a named default (D-10). REQ-003 holds it, because `AGENTS.md` makes that a hard stop in an interactive session.
- Decided 2026-11-14: `/speckit:plan` writes `tasks.md` in a task breakdown step of its own, `step_5_5_task_breakdown` (D-05). REQ-002 now puts the task metadata rule on that step, and the Unattended Task Metadata section of `plan.md` stays.
- Decided 2026-11-14: with the merge removed, complete's late autopilot step keeps archive and verify and reports the branch (D-14). REQ-004 holds it.
- Finding X1 belongs to this phase. The ask-first `pre_phase_parallel_check` blocks in implement and complete are stop-and-ask branches of the M2 class, and REQ-012 closes them.

None
<!-- /ANCHOR:questions -->

---
