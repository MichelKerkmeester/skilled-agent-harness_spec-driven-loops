---
title: "Acceptance Criteria: Phase 3: execution-mode-and-autopilot-contract"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "execution mode and autopilot contract acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/003-execution-mode-and-autopilot-contract"
    last_updated_at: "2026-11-14T11:33:20Z"
    last_updated_by: "scaffold"
    recent_action: "Every criterion verified at 4838fb92b6"
    next_safe_action: "None. The packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-execution-mode-and-autopilot-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: execution-mode-and-autopilot-contract

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 007-speckit-command-gates-step-order-drift/003-execution-mode-and-autopilot-contract
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Commands run from the repository root. `A` is `.skilled/commands/speckit/assets` and `C` is this phase folder. The brace forms below expand to the three lifecycle files in bash and zsh.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the three lifecycle workflows, When an agent runs any of them with `:autopilot`, Then the workflow itself holds the `unattended_autopilot` block, the three blocks are identical and no `execution_mode.rule` defers to the router | `python3 -c "print(len({__import__('yaml').safe_dump(__import__('yaml').safe_load(open(f))['unattended_autopilot']) for f in __import__('sys').argv[1:]}))" $A/speckit-{plan,implement,complete}.yaml` prints `1`, and `rg -c 'as the command router states' $A/speckit-{plan,implement,complete}.yaml` prints nothing. Observed at `4838fb92b6`: the identity one-liner prints `1` and the router-deferral search prints nothing. Evidence: .skilled/commands/speckit/assets/speckit-plan.yaml:73 | Met | - |
| AC-002 | REQ-002 | Given a workflow step that writes `tasks.md` in plan, implement or complete, When it runs under autopilot, Then that step carries the `agent`, `deps` and `touched-files` rule and the plan router names plan's task breakdown step | `python3 -c "import yaml,sys; [print(f.split('/')[-1], sorted(k for k,v in yaml.safe_load(open(f))['workflow'].items() if k.endswith('_task_breakdown') and 'touched-files' in yaml.safe_dump(v))) for f in sys.argv[1:]]" $A/speckit-{plan,implement,complete}.yaml` prints one key that ends in `_task_breakdown` for each file, and `rg -n -i 'task breakdown' .skilled/commands/speckit/plan.md` prints a line. Observed at `4838fb92b6`: `['step_5_5_task_breakdown']`, `['step_2_task_breakdown']` and `['step_7_task_breakdown']`, and `plan.md` line 73 names the task breakdown step. Evidence: .skilled/commands/speckit/assets/speckit-plan.yaml:867 | Met | - |
| AC-003 | REQ-003 | Given any stop-and-ask branch in the three workflows, When an agent reaches it under `auto` or `autopilot`, Then the branch states what that mode does, `auto` asks only at confidence below 40 or Gate 3 and `autopilot` never asks after startup | `python3 $C/scratch/check-mode-tags.py $A/speckit-{plan,implement,complete}.yaml` prints `untagged: 0` and `autopilot_ask: 0`. Observed at `4838fb92b6`: `untagged: 0` and `autopilot_ask: 0`. Evidence: .skilled/commands/speckit/assets/speckit-implement.yaml:118 | Met | - |
| AC-004 | REQ-004 | Given an autopilot run whose verification passed, When it ends, Then it archives, verifies and reports the branch with `"merged":false` and no step merges or pushes | `rg -n -e merge_on_clean -e '"merged":true' -e 'Merge only after' -e step_13_5_autopilot_archive_verify_merge .skilled/commands/speckit` prints nothing, `rg -c '"merged":false' $A/speckit-{plan,implement,complete}.yaml` prints a count above 0 for each file and `rg -c '"branch":"<branch>"' $A/speckit-complete.yaml` prints a count above 0. Observed at `4838fb92b6`: the search prints nothing, `"merged":false` counts 2, 2 and 6, and the branch field counts 6. Evidence: .skilled/commands/speckit/assets/speckit-complete.yaml:114 | Met | - |
| AC-005 | REQ-005 | Given an autopilot run, When it needs a workspace, Then it uses the operator's `workspace_choice`, creates a branch only with `git worktree add -b` and stops with `uncertainty_blocked` before any write when no choice is bound | `rg -n -e branch_first -e 'Branch before any' -e 'create or switch to an autopilot branch' .skilled/commands/speckit` prints nothing, `rg -c 'workspace_choice' $A/speckit-{plan,implement,complete}.yaml` prints a count above 0 for each file and `rg -c 'git worktree add -b' $A/speckit-{plan,implement,complete}.yaml` prints a count above 0 for each file. Observed at `4838fb92b6`: the search prints nothing, `workspace_choice` counts 2, 2 and 4, and `git worktree add -b` counts 1, 1 and 2. Evidence: .skilled/commands/speckit/assets/speckit-complete.yaml:84 | Met | - |
| AC-006 | REQ-006 | Given the no-merge contract, When the autopilot contract test and the four docs that describe autopilot are read, Then the test passes and no doc says autopilot merges | `npx vitest run tests/unit/speckit-autopilot-contract.vitest.ts` from `.skilled/skills/system-deep-loop/runtime/` prints `Tests  4 passed` or more and exits 0, and `rg -n -i -e 'merge only on clean' -e 'merges git branches' -e merge_on_clean .skilled/skills/system-spec-kit/feature-catalog .skilled/skills/system-spec-kit/manual-testing-playbook .skilled/skills/system-spec-kit/README.md .skilled/skills/sk-doc/sk-create-command/assets` prints nothing. Observed at `4838fb92b6`: `Tests  4 passed (4)` with exit 0, and the doc search prints nothing. Evidence: .skilled/skills/system-deep-loop/runtime/tests/unit/speckit-autopilot-contract.vitest.ts:30 | Met | - |
| AC-007 | REQ-007 | Given an unfinished P1 item, When the run is in `auto` or `autopilot`, Then no rule tells the agent to ask for approval, the item stays `Unmet` and the run does not report success | `python3 -c "print(sorted(k for f in __import__('sys').argv[1:] for k,v in __import__('yaml').safe_load(open(f))['rules'].items() if 'get_user_approval_for_p1_deferrals' in v))" $A/speckit-{plan,implement,complete}.yaml` prints `['CONFIRM_ONLY', 'CONFIRM_ONLY', 'CONFIRM_ONLY']`, and the same command for `do_not_prompt_for_user_approval` prints `['AUTO_AND_AUTOPILOT', 'AUTO_AND_AUTOPILOT', 'AUTO_AND_AUTOPILOT']`. Observed at `4838fb92b6`: `['CONFIRM_ONLY', 'CONFIRM_ONLY', 'CONFIRM_ONLY']` and `['AUTO_AND_AUTOPILOT', 'AUTO_AND_AUTOPILOT', 'AUTO_AND_AUTOPILOT']`. Evidence: .skilled/commands/speckit/assets/speckit-complete.yaml:1441 | Met | - |
| AC-008 | REQ-008 | Given `/speckit:plan --intake-only`, When the intake gate stops the run, Then the operator sees the intake-only result block and not the all-steps success text | `rg -n 'Planning Steps 1-7 bypassed' $A/speckit-plan-presentation.txt $A/speckit-plan.yaml` prints one line per file, and `rg -n 'Intake-Only Result' $A/speckit-plan-presentation.txt $A/speckit-plan.yaml` prints a line in each. Observed at `4838fb92b6`: one bypass line per file and one block name line per file. Evidence: .skilled/commands/speckit/assets/speckit-plan-presentation.txt:154 | Met | - |
| AC-009 | REQ-009 | Given an operator who starts plan, implement or complete, When the startup, dashboard or result text is shown, Then autopilot is offered, shown and reported with one `SPECKIT_AUTOPILOT_RESULT` line | `rg --count --include-zero 'SPECKIT_AUTOPILOT_RESULT' $A/speckit-{plan,implement,complete}-presentation.txt` prints a count above 0 for each file, and `rg -c 'AUTOPILOT' $A/speckit-{plan,implement,complete}-presentation.txt` prints a count above 0 for each file. Observed at `4838fb92b6`: 3 result-line counts per presentation file and 4 `AUTOPILOT` counts per file. Evidence: .skilled/commands/speckit/assets/speckit-plan-presentation.txt:11 | Met | - |
| AC-010 | REQ-010 | Given a confirm checkpoint, When the operator picks Review or Modify, Then the agent shows or changes the work and presents the same checkpoint again | `python3 -c "print(len({__import__('yaml').safe_load(open(f))['mode_overrides']['confirm']['checkpoint_behavior'] for f in __import__('sys').argv[1:]}))" $A/speckit-{plan,implement,complete}.yaml` prints `1`, and `rg -c 'same checkpoint again' $A/speckit-{plan,implement,complete}.yaml` prints a count above 0 for each file. Observed at `4838fb92b6`: the identity one-liner prints `1` and each file counts 1. Evidence: .skilled/commands/speckit/assets/speckit-plan.yaml:37 | Met | - |
| AC-011 | REQ-011 | Given an `auto` run that took a default in place of an ask, When the result is shown, Then the result lists that default | `rg -c 'Defaults taken:' $A/speckit-{plan,implement,complete}-presentation.txt` prints a count above 0 for each file. Observed at `4838fb92b6`: 2 in each presentation file. Evidence: .skilled/commands/speckit/assets/speckit-plan-presentation.txt:150 | Met | - |
| AC-012 | REQ-012 | Given an implement or complete step with a `pre_phase_parallel_check`, When its complexity score reaches `ask_min` under `auto` or `autopilot`, Then the step takes `direct` and asks nothing, while `confirm` still asks | `python3 -c "import yaml,sys; [print(f.split('/')[-1], sorted(k for k,v in yaml.safe_load(open(f))['workflow'].items() if isinstance(v,dict) and 'pre_phase_parallel_check' in v and not (all(str(v['pre_phase_parallel_check'].get('modes',{}).get(m,'')).startswith('direct') for m in ('auto','autopilot')) and 'confirm' in v['pre_phase_parallel_check'].get('modes',{})))) for f in sys.argv[1:]]" $A/speckit-{implement,complete}.yaml` prints `speckit-implement.yaml []` and `speckit-complete.yaml []`. On 2026-11-14 it printed `['step_6_development']` and `['step_10_development', 'step_3_specification', 'step_8_analysis']`. Observed at `4838fb92b6`: `speckit-implement.yaml []` and `speckit-complete.yaml []`. Evidence: .skilled/commands/speckit/assets/speckit-implement.yaml:659 | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes. Every criterion is Met with output observed at commit `4838fb92b6`.
<!-- /ANCHOR:closure -->
