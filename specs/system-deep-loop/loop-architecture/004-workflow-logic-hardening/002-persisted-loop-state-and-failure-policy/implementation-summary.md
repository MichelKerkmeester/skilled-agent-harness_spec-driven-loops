---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "persisted loop state and failure policy implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/002-persisted-loop-state-and-failure-policy"
    last_updated_at: "2026-11-14T11:33:19Z"
    last_updated_by: "template-author"
    recent_action: "Closed phase 002 with every acceptance row met"
    next_safe_action: "Implement phase 003, lifecycle lock and limits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-persisted-loop-state-and-failure-policy"
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
| **Spec Folder** | 002-persisted-loop-state-and-failure-policy |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The deep-research and deep-review loops now read their stuck count and their failure count from the state log on every pass. A resumed run counts the same as a run that never paused, and three failed iterations in a row end the loop with stop reason `error`.

### Phase 2: persisted-loop-state-and-failure-policy

Before this phase the model running the loop held the stuck count in memory, so the count was lost on a resume and could drift from the log. `deriveLoopCounters` in `convergence.cjs` now rebuilds `stuckCount` and `consecutiveFailureCount` from the log rows, and each workflow binds both from the `loop_counters_json` the script prints. A workflow halts with stop reason `error` when that field is missing, and never binds a default.

A failed iteration, status `error` or `timeout`, no longer feeds the ratio signals or the stuck count. You get one failure rule in all four files. Auto mode goes straight to synthesis with partial findings. Confirm mode asks Retry / Skip / Cancel first. The review severity counts come from the reducer's `findingsBySeverity`, and the reducer is the only writer of the dashboard.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modified | `deriveLoopCounters`, failed iterations left out of the ratios, the stop at three trailing failures, `loop_counters_json` on the stop-decision payloads, the `--stuck-count` flag removed |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml`, `deep-review-auto.yaml`, `deep-review-confirm.yaml` | Modified | Counters bound from the script, one failure rule, the confirm gate, no model-written dashboard step |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown` | Modified | Rebuilt from the new workflow files |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modified | The dashboard stuck count comes from `deriveLoopCounters` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-counters-derivation.vitest.ts` | Created | 16 cases for the counters, the vote, the command line and the dashboard |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts` | Modified | The stop-decision fixtures moved to the git-ignored `runtime/tests/.tmp/` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Each change was written as one literal brief and dispatched to DeepSeek V4.1 Flash at max effort through `opencode run` on the `llmgateway` provider, five dispatches in all. The orchestrating session read every diff and reran every check before the commit. Tests came first: 13 of the 15 first cases failed on the old tree.

The work landed in one commit on branch `worktrees/382-deep-loop-workflow-logic-hardening`: `485fd61d0a`. Nothing is pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The counters live in `convergence.cjs`, not in the reducer | The research reducer runs before a failure row is appended, so a reducer-derived count would miss the latest failure |
| Retry and Skip record nothing | A persisted reset event needs a new ledger stem in two schemas, outside this phase's file list. A completed iteration already clears the count |
| The confirm gate sentence sits in the gate's `purpose` | The parity test requires the `algorithm` block to be identical in auto and confirm |
| The research confirm file appends the error row | Without the row the failure count never moves in confirm mode |
| The test fixtures moved inside the repository | The `--state-log` path check rejects a path outside it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Full runtime suite, `npm test` in the runtime folder | PASS: 176 test files, 3002 passed, 8 skipped, 0 failed, exit 0. Baseline on the phase 001 final tree: 175 files, 2986 passed. The 16 added tests are the new file |
| `loop-counters-derivation.vitest.ts`, with `deep-research-reduce-state.vitest.ts` and `deep-research-convergence-floor.vitest.ts` | PASS: 3 files, 52 passed |
| Each `-t` filter the acceptance rows name | PASS: `resume` 1, `four failed` 2, `review` 3, `stuck` 5, `consecutive` 2, `dashboard` 1, `recovery` 2, `no graph` 1, `empty` 1 |
| `check-contract-drift.cjs` | PASS: `[CONTRACT DRIFT] OK commands=3`, and `OK commands=1` for each of `deep/research` and `deep/review` |
| The workflow text checks in `tasks.md` T037 | PASS: the old wordings print nothing, `Retry / Skip / Cancel` prints 1 for each confirm file and nothing for the auto files |
| `node --check` on `convergence.cjs` and `reduce-state.cjs`, YAML parse of the four workflow files | PASS: exit 0, `yaml ok` |
| `npm run typecheck` in the runtime folder | PASS: exit 0, run before the dashboard change. The dashboard change touched one `.cjs` file and one test file, and the full suite ran after it |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Retry and Skip do not reset the failure count.** After three failures the confirm gate asks again after each further failed iteration. One completed iteration clears the count. A reset needs a persisted gate-decision event, which needs a new ledger stem.
2. **No workflow step writes a `timeout` row.** The script counts the status, but only `error` rows are appended today.
3. **`loop_counters_json` needs `--stop-decision`.** A bare `--state-log` call does not print it. Every workflow passes both.
4. **The reference docs still describe the old rules.** The loop-protocol references, the dashboard asset templates and the playbooks are phase 005's.
<!-- /ANCHOR:limitations -->

---


