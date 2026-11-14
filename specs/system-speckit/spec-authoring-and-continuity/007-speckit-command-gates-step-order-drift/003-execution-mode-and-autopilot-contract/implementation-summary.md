---
title: "Implementation Summary"
description: "Auto, confirm and autopilot now have one written contract in the plan, implement and complete workflows, their routers and their presentation files."
trigger_phrases:
  - "execution mode and autopilot contract implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/003-execution-mode-and-autopilot-contract"
    last_updated_at: "2026-11-14T13:07:27Z"
    last_updated_by: "generate-context"
    recent_action: "Phase 3 implemented and verified at 4838fb92b6"
    next_safe_action: "Implement phase 4, 004-code-review-and-dispatch-policy"
    packet_purpose: "Purpose: Each of the three modes has one written contract that is the same in all three lifecycle workflows, and an agent in any mode can tell from the branch it is on whether to ask, take a default or stop with a result line."
    blockers: []
    key_files:
      - ".skilled/commands/speckit/assets/speckit-complete.yaml"
      - ".skilled/commands/speckit/assets/speckit-plan.yaml"
      - ".skilled/commands/speckit/assets/speckit-implement.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-execution-mode-and-autopilot-contract"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "9e85479c-24ab-4018-b66b-e847e58920d5"
      workspace: "/Users/michelkerkmeester/worktrees/public/381-speckit-command-gates-step-order-drift"
      savedAt: "2026-11-14T13:07:27Z"
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
| **Spec Folder** | 003-execution-mode-and-autopilot-contract |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An agent that reaches a stop-and-ask branch in `/speckit:plan`, `/speckit:implement` or `/speckit:complete` can now read what its mode does there. Autopilot no longer creates a branch or merges on its own.

### Phase 3: execution-mode-and-autopilot-contract

The three workflows carry the same `unattended_autopilot` block. It takes the workspace from the operator as `workspace_choice`, creates a branch only with `git worktree add -b`, never merges or pushes and ends with one `SPECKIT_AUTOPILOT_RESULT` line. A run with no bound workspace stops with `uncertainty_blocked` before any write.

Every stop-and-ask branch has a `modes` map with `confirm`, `auto` and `autopilot`. Under `auto` only a confidence below 40 and the Gate 3 spec folder question still ask. Every other branch names its default. Under `autopilot` no branch asks.

The approval rules are split into `CONFIRM_ONLY` and `AUTO_AND_AUTOPILOT`, so an `auto` run is no longer told both to never prompt and to get approval. An unfinished P1 item stays Unmet outside confirm. The Review and Modify loop is stated once, with the same text, in each workflow.

The presentation files offer autopilot at startup, show it in the dashboard and print the result line. Plan has an Intake-Only Result block. Success and failure blocks list the defaults an `auto` run took.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modified | No-merge autopilot block, `step_0_autopilot_envelope` and `step_13_5_autopilot_archive_verify`, `modes` maps, rules split, loop text |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Modified | Autopilot block, `modes` maps, rules split, loop text, intake gate names its result block, task metadata rule on `step_5_5_task_breakdown` |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modified | Autopilot block, `modes` maps, rules split, loop text, task metadata rule on `step_2_task_breakdown` |
| `.skilled/commands/speckit/assets/speckit-{plan,implement,complete}-presentation.txt` | Modified | Autopilot startup, dashboard, fail-fast and result text, `Defaults taken:` line, plan's Intake-Only Result |
| `.skilled/commands/speckit/{plan,implement,complete}.md` | Modified | Routers name the in-workflow block, the workspace choice and no merge |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/speckit-autopilot-contract.vitest.ts` | Modified | Sequence without branch-first and merge, plus a no-merge assertion |
| `.skilled/skills/system-spec-kit/README.md`, its autopilot feature catalog and playbook entries, `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | No longer say autopilot merges |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Twenty-nine dispatches went to DeepSeek V4.1 Flash on the Mistral provider through OpenCode, one at a time in worktree 381. Each brief held exact old and new text. After each dispatch the orchestrating session ran that brief's check, parsed the three workflows with two YAML parsers and compared file hashes so only the file the brief named had changed. It then read the whole diff and ran every command in `acceptance-criteria.md` before the commit.

The first three dispatches were sent without the gate preamble, the persona and the banned-operations block, because an edit to the dispatcher broke its prompt assembly. Their edits passed the checks and match the briefs. The dispatcher was repaired and now refuses a prompt that lacks those blocks.

The checker `scratch/check-mode-tags.py` named 50 untagged asks on the unchanged files, which covered every key in the `spec.md` inventory and one it had missed, the intake prompt in the complete workflow. That row was added to the inventory.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Complete's `step_5_acceptance_criteria` got no P1 text | Phase 1 made that step author rows only, so it holds no P1 approval to split. The split is stated in `step_11_acceptance_verify` and in implement's `step_6_7_acceptance_verify`, where phase 1 moved it |
| `error_recovery` entries that ask became maps with `action` and `modes` | A plain string has no place for a mode statement |
| `user_approval` moved to `pre_change_validation_confirm` with `applies_to: confirm` | It is a confirm-only check, and a list item cannot carry a `modes` map |
| The second README sentence about autopilot was rewritten too | It said autopilot skips merge unless verification is clean, which still promised a merge |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-mode-tags.py` over the three workflows | PASS: `untagged: 0`, `autopilot_ask: 0`. Baseline was `untagged: 50`. `auto_ask: 12`, all confidence below 40 or Gate 3 |
| `unattended_autopilot` identical in three files | PASS: the PyYAML one-liner prints `1` |
| `checkpoint_behavior` identical in three files | PASS: prints `1` |
| Merge and branch-first text under `.skilled/commands/speckit` | PASS: both searches print nothing |
| Rules split | PASS: `CONFIRM_ONLY` three times and `AUTO_AND_AUTOPILOT` three times |
| Parallel checks | PASS: `speckit-implement.yaml []` and `speckit-complete.yaml []` |
| Measured Behavior command | PASS: 7, 8, 13, 3, 3, 3. Baseline was 0, 0, 3, 0, 0, 0 |
| `speckit-autopilot-contract.vitest.ts` | PASS: `Tests  4 passed (4)`, exit 0, before and after |
| `test-phase-command-workflows.js` | PASS: `Result: passed=154 failed=0`, equal to the baseline |
| `speckit-goal-offer-contract.test.cjs` | PASS: `pass 5`, `fail 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The contract is text an agent reads, not code.** Nothing executes a `modes` map or `workspace_choice`. A run obeys them only as far as the agent follows the workflow.
2. **The three copies of the autopilot block and of the loop text can drift.** Phase 7 lifts them into one shared include. Until then the two identity checks in `acceptance-criteria.md` catch a drift.
3. **The router Presentation Boundary lists and the autopilot feature catalog still describe only `:auto` setup text.** Phase 8 aligns routers, README and presentation wording.
<!-- /ANCHOR:limitations -->

---


