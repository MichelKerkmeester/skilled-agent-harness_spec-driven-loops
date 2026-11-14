---
title: "Implementation Summary"
description: "Every quality gate in the three lifecycle workflows is a list of required checks, each naming its producing step and its rule."
trigger_phrases:
  - "required artifact gates implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/002-required-artifact-gates"
    last_updated_at: "2026-11-14T11:33:19Z"
    last_updated_by: "template-author"
    recent_action: "Phase 2 implemented and verified at e188f0ad29"
    next_safe_action: "Implement phase 3, 003-execution-mode-and-autopilot-contract"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-required-artifact-gates"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-required-artifact-gates |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A `/speckit` run can no longer pass a gate with a required file missing. Every gate in `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml` now passes only when every check it lists passes, and its failure message names the checks that failed.

### Phase 2: required-artifact-gates

You read a gate and see, for each check, the step that makes it true and the rule that decides it. A document check fails when the file is missing or still holds a `YOUR_VALUE_HERE:` token, so an unfilled scaffold no longer counts as a plan or a task list. Plan's exit gate requires the `tasks.md` its task breakdown step writes. Implement no longer demands `tasks.md` before the step that can write it, and its step 2 leaves a filled `tasks.md` alone.

Both consistency analysis steps now have a failure branch. A CRITICAL or HIGH finding, or a P0 requirement with no task, stops the run before development and names the step to return to. After the third failed round the run stops and reports what is open.

Checks removed because no step produces them: `no_blocking_deps` in plan, `continuity_ladder_walked` in complete, and `checklist_verified`, `review_approval` and `review_integration` in complete's planning gate.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Modified | Both gates as required checks with `from:` and `criteria:`, one `exists_rule`, a non-empty `feature_description` rule and a `spec_path_valid` rule that exempts `:with-phases` |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modified | Both gates as required checks. `tasks_exists` in the pre-implementation gate. Step 1 drops `--require-tasks`. Step 2 writes `tasks.md` only when it is missing or unfilled. Step 3 assigns severities and has an `on_fail` branch |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modified | Three gates as required checks. `phase_gate` and the step 7 checkpoint point at `quality_gates.planning_gate`. Step 8 has an `on_fail` branch |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Six dispatches went to DeepSeek V4.1 Flash on the Mistral provider through OpenCode, one at a time in worktree 381. After each one the orchestrating session ran that task's checks, a YAML parse of all three files and a scope check, then read the diff.

One check failed on the first dispatch, and the cause was the brief, not the worker. The brief's `on_fail` text held the words `from: and`, which the producer check reads as a step key named `and`. The orchestrating session reworded that sentence in `speckit-plan.yaml` and in two pending briefs, reran the check and continued.

Every command in `acceptance-criteria.md` was then run on the committed tree, with the workflow contract test and the goal offer test.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `no_blocking_deps` and `continuity_ladder_walked` were removed, not given a producer | No step in either workflow makes them true, and the requirement says a check with no producer is removed |
| `review_integration` left complete's planning gate with `review_approval` | It only described what happens when that check fails |
| The failure messages say "the producing step" and never the literal `from:` | The producer check extracts every `from: <word>` in the gate block, so prose that holds that text reads as a step key |
| `memory_saved` keeps its name | Phase 7 owns the retired vocabulary |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Gate score terms in the three `quality_gates` blocks | PASS: 0 lines hold `points:`, `threshold:` or `{score}` |
| `pass_when:` count | PASS: 2 for plan, 2 for implement, 3 for complete |
| `exists_rule` | PASS: one line per file, each holding `YOUR_VALUE_HERE:` |
| Checks without `from:` or `criteria:` | PASS: 0 in each file |
| Each `from:` key names a step in its own file | PASS: every key other than `invocation` matches one step line |
| Plan exit gate ids | PASS: `spec_exists`, `plan_exists`, `tasks_exists`, `context_saved` and no other |
| Analysis `on_fail` branches | PASS: one in implement step 3 and one in complete step 8, both naming CRITICAL |
| `test-phase-command-workflows.js` | PASS: `Result: passed=154 failed=0`, equal to the baseline |
| `speckit-goal-offer-contract.test.cjs` | PASS: `pass 5`, `fail 0` |
| Consumers of gate names in code | PASS: the search over `.skilled` code files prints nothing |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The rules are text an agent reads, not code.** Nothing executes `exists_rule` or `pass_when`. A run obeys them only as far as the agent follows the workflow.
2. **Presentation files still describe no gate failure by check name.** They show no score either, so nothing is wrong, but the failed-check list has no display row yet. Phase 8 aligns presentation text.
<!-- /ANCHOR:limitations -->

---


