---
title: "Acceptance Criteria: Phase 2: required-artifact-gates"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "required artifact gates acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/002-required-artifact-gates"
    last_updated_at: "2026-11-14T11:33:19Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-required-artifact-gates"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: required-artifact-gates

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 007-speckit-command-gates-step-order-drift/002-required-artifact-gates
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the three lifecycle workflows after this phase, When an agent reads any gate under `quality_gates`, Then the gate carries `pass_when: every check passes`, holds no `points:` or `threshold:` and its `on_fail` names the failed checks with no `{score}` | From `.skilled/commands/speckit/assets/`, `awk '/^[a-z_]+:/{f=($0 ~ /^quality_gates:/)} f' <file> \| rg 'points:\|threshold:\|\{score\}' \| wc -l` prints 0 for each file, and the same block piped to `rg -c 'pass_when:'` prints 2, 2 and 3 for plan, implement and complete | Unmet | - |
| AC-002 | REQ-002 | Given complete's planning gate after this phase and implement's pre-development gate after phase 1 removed `checklist_verified` from it, When an agent evaluates them before development, Then neither lists a check that only review or post-development verification can make true | `sed -n '/^  planning_gate:/,/^  [a-z_]*:$/p' speckit-complete.yaml \| rg 'review_approval\|checklist_verified' \| wc -l` prints 0, and `sed -n '/^  pre_implementation:/,/^  [a-z_]*:$/p' speckit-implement.yaml \| rg checklist_verified \| wc -l` prints 0 | Unmet | - |
| AC-003 | REQ-003 | Given a `/speckit:plan` run, When its exit gate runs, Then it requires the `tasks.md` that `step_5_5_task_breakdown` wrote | `awk '/^[a-z_]+:/{f=($0 ~ /^quality_gates:/)} f' speckit-plan.yaml \| rg tasks_exists \| rg -c 'from: step_5_5_task_breakdown'` prints 1, and `sed -n '/^  step_5_5_task_breakdown:/,/^  step_6_save_context:/p' speckit-plan.yaml \| rg -c 'tasks\.md'` prints at least 1 | Unmet | - |
| AC-004 | REQ-004 | Given a packet document that still holds a `YOUR_VALUE_HERE:` token, When an `_exists` check reads it, Then the check fails and names the file. Given an implement run whose `tasks.md` passes `exists_rule`, When step 2 runs, Then it validates that file and does not rewrite it | `awk '/^[a-z_]+:/{f=($0 ~ /^quality_gates:/)} f' <file> \| rg '^  exists_rule:'` prints one line containing `YOUR_VALUE_HERE:` for each of the three files, and `sed -n '/^  step_2_task_breakdown:/,/^  step_3_analysis:/p' speckit-implement.yaml \| rg -c 'exists_rule'` prints at least 1, and the same range piped to `rg -c 'missing or'` prints at least 1 | Unmet | - |
| AC-005 | REQ-005 | Given a spec folder with `spec.md` and `plan.md` and no `tasks.md`, When `/speckit:implement` starts, Then step 1 passes its prerequisite check and the `tasks.md` requirement is enforced by the `pre_implementation` gate after step 2 | `sed -n '/^  step_1_review_plan_and_spec:/,/^  step_[0-9]/p' speckit-implement.yaml \| rg require-tasks \| wc -l` prints 0, and `sed -n '/^  pre_implementation:/,/^  [a-z_]*:$/p' speckit-implement.yaml \| rg -c 'tasks_exists'` prints 1 | Unmet | - |
| AC-006 | REQ-006 | Given a consistency analysis that reports a CRITICAL finding or an uncovered P0 requirement, When the analysis step ends, Then the run returns to the step that wrote the named artifact, reruns the analysis and stops with the open findings after the third failed round | `sed -n '/^  step_3_analysis:/,/^  step_[0-9]/p' speckit-implement.yaml \| rg -c 'on_fail:'` prints 1, the same range from `/^  step_8_analysis:/` in `speckit-complete.yaml` prints 1 and both ranges piped to `rg -c CRITICAL` print a count above 0 | Unmet | - |
| AC-007 | REQ-007 | Given any check under `quality_gates`, When an agent reads it, Then it names the step or `invocation` that makes it true and the rule that decides it | For each file, `awk '/^[a-z_]+:/{f=($0 ~ /^quality_gates:/)} f' <file> \| rg 'id:' \| rg -v 'from:' \| wc -l` prints 0, the same with `criteria:` prints 0 and `rg -c '^  <key>:' <file>` prints 1 for each `from:` key other than `invocation` | Unmet | - |
| AC-008 | REQ-008 | Given complete's planning gate, When an agent reads `workflow_enforcement.phase_gate` or the step 7 `phase_gate_checkpoint`, Then both point at `quality_gates.planning_gate` and restate no list of their own | `rg -c 'quality_gates.planning_gate' speckit-complete.yaml` prints at least 2, and `sed -n '/^  phase_gate:/,/^  [a-z_]*:$/p' speckit-complete.yaml \| rg 'tasks.md exists' \| wc -l` prints 0 | Unmet | - |
| AC-009 | REQ-009 | Given a `/speckit:plan` run, When its exit gate runs, Then it requires `spec_exists`, `plan_exists`, `tasks_exists` and `context_saved` and fails when any one fails | `sed -n '/^  post_execution:/,/^[a-z]/p' speckit-plan.yaml \| rg -o 'id: [a-z_]+'` prints exactly `id: spec_exists`, `id: plan_exists`, `id: tasks_exists` and `id: context_saved`, and the same range piped to `rg -c 'pass_when:'` prints 1 | Unmet | - |
| AC-010 | REQ-010 | Given `/speckit:plan` or `/speckit:complete` invoked with no feature description and no intake bind, When the entry gate runs, Then it fails and names `feature_description` | `sed -n '/^  pre_execution:/,/^  [a-z_]*:$/p' <file> \| rg 'feature_description' \| rg -c 'non-empty'` prints 1 for `speckit-plan.yaml` and for `speckit-complete.yaml` | Unmet | - |
| AC-011 | REQ-011 | Given a `/speckit:plan` or `/speckit:complete` run, When the entry gate checks `spec_path_valid`, Then it requires the folder the intake Emit phase created on the single-packet path and only a well-formed path under `:with-phases` | `sed -n '/^  pre_execution:/,/^  [a-z_]*:$/p' <file> \| rg 'spec_path_valid' \| rg -c 'with-phases'` prints 1 for `speckit-plan.yaml` and for `speckit-complete.yaml`, and the same range piped to `rg spec_path_valid \| rg -c 'from: step_0.5_intake_branch'` prints 1 for each | Unmet | - |

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

**Closeable:** No

No criterion is met yet, because the workflow changes this packet specifies have not been made.
<!-- /ANCHOR:closure -->
