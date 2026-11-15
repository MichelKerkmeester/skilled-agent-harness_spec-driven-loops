---
title: "Acceptance Criteria: Phase 1: step-order-acceptance-after-development"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "step order acceptance after development acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/001-step-order-acceptance-after-development"
    last_updated_at: "2026-11-14T11:33:18Z"
    last_updated_by: "scaffold"
    recent_action: "Every criterion verified at f125d45652"
    next_safe_action: "None. The packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-step-order-acceptance-after-development"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: step-order-acceptance-after-development

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `001-step-order-acceptance-after-development`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Run every Verification command from the repository root with `I`, `C`, `P` and `F` set as in the Task Notation section of `tasks.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an implement run at Level 2, When the agent reaches the steps after `step_6_development`, Then `step_6_7_acceptance_verify` sets the rows and no earlier step does. The code review option names Step 6.7 as the next step | The T006, T007 and T008 Verify commands in `tasks.md` print what those tasks name. The T001 `awk` prints at least one `after` line and no `before` line. Observed at `f125d45652`: `step_6_5_checkpoint_development` at 660 then `step_6_7_acceptance_verify` at 672. `checkpoints:` lists the step. `Step 6.7` on lines 39 and 657 only. The T001 `awk` prints `after 680` and no `before` line. Evidence: .skilled/commands/speckit/assets/speckit-implement.yaml:673 | Met | - |
| AC-002 | REQ-002 | Given implement step 4 before development, When `acceptance-criteria.md` holds only the scaffold row, Then the step writes one Unmet row per requirement and sets no row Met | The T005 Verify command prints nothing and exits 1 for the forbidden terms, and prints at least 1 for `scaffold row`. Observed at `f125d45652`: the forbidden-terms `rg` prints nothing and exits 1. `rg -c 'scaffold row'` prints 1. Evidence: .skilled/commands/speckit/assets/speckit-implement.yaml:537 | Met | - |
| AC-003 | REQ-003 | Given the implement pre-implementation gate, When it is evaluated before Step 6, Then it holds no check that only development can make true | The T009 Verify command prints nothing for the `pre_implementation` range and prints 1 for the `post_implementation` range. Observed at `f125d45652`: the `pre_implementation` range prints nothing and exits 1. The `post_implementation` range prints 1. Evidence: .skilled/commands/speckit/assets/speckit-implement.yaml:384 | Met | - |
| AC-004 | REQ-004 | Given complete step 5 before planning, When the agent runs it, Then it writes rows with status Unmet and verifies none | The T012 Verify command prints nothing and exits 1. Observed at `f125d45652`: the T012 `rg` prints nothing and exits 1. Evidence: .skilled/commands/speckit/assets/speckit-complete.yaml:849 | Met | - |
| AC-005 | REQ-005 | Given a `plan.md` with an open design choice, When implement runs, Then it stops in step 1 and names `/speckit:plan` before `step_2_task_breakdown` validates or rewrites `tasks.md` | The T010 `awk` prints no `after` line. The step 1 range in T010 prints at least 1. Observed at `f125d45652`: the T010 `awk` prints `before 390`, `before 480`, `before 481` and no `after` line. The step 1 range prints 2. Evidence: .skilled/commands/speckit/assets/speckit-implement.yaml:480 | Met | - |
| AC-006 | REQ-006 | Given a complete run, When the exit gate is evaluated, Then the save it scores has already run and no merge has run yet | The T015 Verify command prints `location: "Between Step 13 and Step 13.5"`. The T016 Verify command prints the four step keys in the order it names and no `step_12_5` line. Observed at `f125d45652`: `location: "Between Step 13 and Step 13.5"`. Keys print in the order `step_12_completion`, `step_13_save_context`, `step_13_5_autopilot_archive_verify_merge`, `step_14_handover_check`. `rg -n step_12_5` prints nothing. Evidence: .skilled/commands/speckit/assets/speckit-complete.yaml:524 | Met | - |
| AC-007 | REQ-007 | Given complete before `step_10_development`, When any step or list is read, Then none requires a row to be Met or the checklist to be verified | The T013 Verify commands print what that task names. The T014 Verify command prints nothing. Observed at `f125d45652`: the step 9 range prints 1 for the new activity and nothing for the old one. `rg -n checklist_verified_L2_plus` prints nothing. The T002 `awk` prints `after 1206` only. Evidence: .skilled/commands/speckit/assets/speckit-complete.yaml:1086 | Met | - |
| AC-008 | REQ-008 | Given the plan workflow, When its gates are read, Then the spec-and-plan check has one location and the exit gate runs before termination | The T018 Verify command prints `After Step 5` for `planning_gate` and `After Step 6` for `post_execution` and no `After Step 7`. Observed at `f125d45652`: `rg -n 'location:'` prints `spec-folder root`, `Before Step 1`, `After Step 6` and `After Step 5`. Evidence: .skilled/commands/speckit/assets/speckit-plan.yaml:427 | Met | - |
| AC-009 | REQ-009 | Given a plan or complete run with or without `:with-phases`, When the spec folder does not exist, Then exactly one step creates it | The T019 and T020 Verify commands print nothing for the step 1 to step 4 range and at least 1 for `with-phases` in the `step_0.5_intake_branch` range. Observed at `f125d45652`: in plan and complete the step 1 to step 4 range prints nothing and the `step_0.5_intake_branch` range prints 1 for `with-phases`. Evidence: .skilled/commands/speckit/assets/speckit-plan.yaml:488 | Met | - |
| AC-010 | REQ-010 | Given a `:with-phases` run, When P1 estimates size, Then step 1 has already produced the estimate it reads | The T021 and T022 Verify commands print `after_step_1` for `phase_decomposition` in both files. Each step 1 block names `estimated_loc` and `estimated_files`. Observed at `f125d45652`: `insert_point: "after_step_1"` for `phase_decomposition` in both files. Each step 1 block names `estimated_loc` and `estimated_files`. Evidence: .skilled/commands/speckit/assets/speckit-plan.yaml:82 | Met | - |
| AC-011 | REQ-011 | Given P1 prints `recommended_level` and P2 defines the phases, When P3 runs `create.sh`, Then it passes those values and no fixed default | The T023 and T024 Verify commands print nothing for the fixed defaults and print the P3 command line for `recommended_level`. Observed at `f125d45652`: the fixed-defaults `rg` prints nothing and exits 1 in both files. `recommended_level` appears on the P3 command line only, plan line 95 and complete line 156. Evidence: .skilled/commands/speckit/assets/speckit-plan.yaml:95 | Met | - |
| AC-012 | REQ-012 | Given a decomposition with more than one child, When the run terminates, Then the operator reads each unplanned child folder and its command | The T025 and T026 Verify commands each print a `post_decomposition` line and a `termination` line. Observed at `f125d45652`: `remaining_children` on plan lines 107 and 881 and complete lines 168 and 1367, one in `post_decomposition` and one in `termination` each. Evidence: .skilled/commands/speckit/assets/speckit-plan.yaml:881 | Met | - |
| AC-013 | REQ-013 | Given the three workflows after this phase, When their step references are read, Then each names a step that exists and does what the text says, and no test outside the speckit commands folder fails on the changed text | The T029 checkpoints check prints nothing for each file. The T030 `diff` shows only the one removed key and the three added keys. The T011 and T017 Verify commands print `before Step 6."` twice and `before Step 10.` once. The T039 Verify command prints `failed=0`. Observed at `f125d45652`: the checkpoints check prints nothing for each file. The T030 `diff` shows one key removed and three added. `before Step 6."` twice in implement, `before Step 10.` once in complete. T039 prints `Result: passed=154 failed=0`. Evidence: .skilled/commands/speckit/assets/speckit-implement.yaml:9 | Met | - |
| AC-014 | REQ-014 | Given a plan run, When the agent reaches the steps after `step_5_planning`, Then `step_5_5_task_breakdown` writes `tasks.md` before `step_6_save_context` saves and before the exit gate at `After Step 6` runs | The T035 `awk` prints `ordered` and its `sed` range prints at least 1. The T036, T037 and T038 Verify commands print what those tasks name. The T018 Verify command prints `After Step 6` for `post_execution`. Observed at `f125d45652`: the T035 `awk` prints `ordered` and its range names `tasks.md`. `tasks_md:` count is 1, the `checkpoints:` line lists the step, `proceed to task breakdown` count is 1. `post_execution` reads `After Step 6`. Evidence: .skilled/commands/speckit/assets/speckit-plan.yaml:809 | Met | - |

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

Yes. Every criterion is Met with output observed at commit `f125d45652`.
<!-- /ANCHOR:closure -->
