---
title: "Implementation Summary"
description: "Implement, complete and plan now run every verification step and gate after the step that produces what it checks."
trigger_phrases:
  - "step order acceptance after development implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/001-step-order-acceptance-after-development"
    last_updated_at: "2026-11-14T12:29:42Z"
    last_updated_by: "generate-context"
    recent_action: "Phase 1 implemented and verified at f125d45652"
    next_safe_action: "Implement phase 2, 002-required-artifact-gates"
    packet_purpose: "Purpose: Every step that verifies, checks or gates something runs after the step that produces what it checks, and every gate location names a real step boundary before termination."
    blockers: []
    key_files:
      - "specs/system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/spec.md"
      - ".skilled/commands/speckit/assets/speckit-implement.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-step-order-acceptance-after-development"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "f863f57a-786e-4240-ba81-28682740098f"
      workspace: "/Users/michelkerkmeester/worktrees/public/381-speckit-command-gates-step-order-drift"
      savedAt: "2026-11-14T12:29:42Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 001-step-order-acceptance-after-development |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An agent that runs `/speckit:implement` no longer marks acceptance rows Met before any code exists. It authors the rows before development and verifies them in a new step after it. `/speckit:complete` and `/speckit:plan` got the same treatment: each gate now sits after the step that produces what it checks.

### Phase 1: step-order-acceptance-after-development

You can follow any of the three lifecycle workflows top to bottom and every check comes after its producer. Implement stops in step 1 when `plan.md` leaves a design choice open, before it touches `tasks.md`. Complete's exit gate runs after the save it scores, and the autopilot close step runs after that gate. Plan writes `tasks.md` in a task breakdown step of its own.

The spec folder has one creator per path. The intake Emit phase creates it on the single-packet path, and P3 of phase decomposition creates it under `:with-phases`. Phase decomposition runs after request analysis, takes its level from `recommend-level.sh` and names the children it did not plan at termination.

Step keys that changed:

- Added `step_6_7_acceptance_verify` in `speckit-implement.yaml`.
- Added `step_5_5_task_breakdown` in `speckit-plan.yaml`.
- Renamed `step_12_5_autopilot_archive_verify_merge` to `step_13_5_autopilot_archive_verify_merge` in `speckit-complete.yaml`. Phase 3 renames it again when it removes the merge.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modified | Step 4 authors rows and sets none Met. New `step_6_7_acceptance_verify`. Design-choice check in step 1. `checklist_verified` out of the pre-implementation gate. Coding-start rule names Step 6 |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modified | Author-only step 5. Step 9 confirms rows exist. Exit gate between Step 13 and Step 13.5. Close step renamed and moved after the save. One folder creator. Phase decomposition after step 1 |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Modified | Exit gate after Step 6. New `step_5_5_task_breakdown` with a `tasks_md` scaffold. One folder creator. Phase decomposition after step 1. Remaining children named at termination |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each edit was dispatched as one short brief to DeepSeek V4.1 Flash on the Mistral provider through OpenCode, one dispatch at a time in worktree 381. After every dispatch the orchestrating session ran the task's Verify command, a YAML parse of all three files and a scope check on `git status`, then read the diff. Fourteen dispatches ran and none needed a retry.

The ordering checks on the final tree, at commit `f125d45652`:

- T027, implement: `awk '/^  step_6_development:/{d=NR} /to Met/{print (d?"after":"before"), NR}'` prints `after 680` and nothing else. The design-choice `awk` prints `before 390`, `before 480` and `before 481` and no `after` line.
- T028, complete: the `to Met|set Met|Met or Waived` `awk` prints `after 1206` and nothing else.

Routers, presentation files and the README still list the old step order. Phase 8 aligns them.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The dispatched worker ran under a focused `@markdown` persona, not `@code` | The implement workflow routes command workflow files to `@markdown`, and the `@code` persona refuses to author them |
| Single literal line edits to one file were grouped, up to seven per dispatch | One dispatch per line would have tripled the run time. Every edit in a group still has its own check |
| The new step's question avoids the text `Step 6.7` | The T008 check expects that text on two lines only, the code review option and the step 6 child dispatch |
| Implement step 5 keeps an `on_fail` with generic wording | Removing the design-choice text left the step with no failure branch at all |
| `--phases {phase_count}` stays in the P3 command | The count now comes from the phases P2 defined. Only the fixed default of 3 was the defect |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T027 implement ordering `awk` | PASS: `after 680`, no `before` line |
| T028 complete ordering `awk` | PASS: `after 1206`, no `before` line |
| T029 checkpoints check on each workflow | PASS: prints nothing for all three files |
| T030 step-key `diff` against the Setup list | PASS: `step_12_5_autopilot_archive_verify_merge` removed. `step_13_5_autopilot_archive_verify_merge`, `step_6_7_acceptance_verify` and `step_5_5_task_breakdown` added. No other line |
| T031 YAML parse | PASS: `0` errors for each of the three files |
| T032 consumers of moved keys outside `specs/` | PASS: only the three workflow files |
| T039 `test-phase-command-workflows.js` | PASS: `Result: passed=154 failed=0`. Baseline was `passed=150 failed=0`. The four new passes are the two new checkpoint steps |
| `speckit-goal-offer-contract.test.cjs` | PASS: `pass 5`, `fail 0` |
| Em dash, credential and comment-label scans of the diff | PASS: each prints nothing |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Routers and presentation files show the old step order.** `implement.md` still says 9 steps and no presentation file names Step 6.7 or Step 5.5. The workflow file is what the agent executes, and phase 8 aligns the rest.
2. **Under `:with-phases` the entry gate checks a folder that does not exist yet.** `spec_path_valid` runs before Step 1 and P3 now creates the folder after it. Phase 2 exempts `:with-phases` runs from that check.
3. **The autopilot close step still merges.** This phase only moved it after the exit gate. Phase 3 removes the merge.
<!-- /ANCHOR:limitations -->

---


