---
title: "Goal: Phase 2: persisted-loop-state-and-failure-policy"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "persisted loop state and failure policy goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/002-persisted-loop-state-and-failure-policy"
    last_updated_at: "2026-11-14T11:33:19Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
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
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: persisted-loop-state-and-failure-policy

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every deep-research and deep-review stop counter come from the state log through one script, keep failed iterations out of the stop vote and leave one failure rule and one dashboard writer.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every counter the stop decision reads is derived from the state log by a script on each pass, never held in orchestrator memory. The owner is `runtime/scripts/convergence.cjs` unless phase 001 records another owner. Extend that script or the reducer before adding a new one. |
| D2 | An iteration with status `error` or `timeout` is excluded from every ratio signal and from the stuck counter. |
| D3 | Three consecutive failed iterations end the iteration loop with stop reason `error` and partial findings. Auto mode enters synthesis with no question. Confirm mode asks the operator Retry / Skip / Cancel before synthesis starts. The failure rule is one rule, and mode changes only the approval checkpoint. Stuck recovery is reserved for completed iterations with low novelty. The `escalation` wording is removed. Amended by operator decision on 2026-11-14. |
| D4 | The reducer is the only writer of the dashboard. The model-written step is removed from all four workflow files. |
| D5 | This phase edits all four workflow files. Single-sourcing them is phase 004's job. This phase depends on phase 001. |
| D6 | `deriveLoopCounters` lives in `runtime/scripts/convergence.cjs` and runs in `step_graph_convergence`. The research reducer runs before the failure row is appended, so a reducer-derived counter would miss the latest failure. |
| D7 | The review severity counters come from the reducer's `findingsBySeverity`, because the review reducer runs after the failure row and already deduplicates findings. |
| D8 | The one failure rule reads, in all four files: "After 3 consecutive failed iterations (status error or timeout), halt the loop and enter synthesis with stop reason error and partial findings." The two confirm files add: "In confirm mode, ask the operator Retry / Skip / Cancel before synthesis starts." The two auto files carry no gate wording. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts` exits 0, including the four-failure research case and the resume case.
- [x] `rg -c -e 'step_generate_dashboard' -e 'Accumulate from severity_counts' -e 'trigger stuck_recovery event' -e 'After 3 consecutive errors' .skilled/commands/deep/assets/deep-re*.yaml` prints nothing, `rg -c 'Retry / Skip / Cancel' .skilled/commands/deep/assets/deep-re*-auto.yaml` prints nothing and `rg -c 'Retry / Skip / Cancel' .skilled/commands/deep/assets/deep-re*-confirm.yaml` prints a count for each of the two confirm files.
- [x] `rg -n -e 'stuck_count: 0' -e 'stuck_count \+ 1' .skilled/commands/deep/assets/deep-re*.yaml` prints nothing.
- [x] `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs --command deep/research` and the same with `deep/review` exit 0.
- [x] `npm --prefix .skilled/skills/system-deep-loop/runtime test` exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Spec docs authored | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` were authored on 2026-11-14. Implementation started after phase 001 closed. |
| Baseline suite | Done | `npm test` in the runtime folder on the phase 001 final tree: 175 test files, 2986 passed, 8 skipped, 0 failed. |
| Failing-first tests, T003 to T009 | Done | `loop-counters-derivation.vitest.ts` held 15 cases, and 13 failed before `deriveLoopCounters` existed. |
| Script, T010 to T012 | Done | `deriveLoopCounters` is exported, the `--stuck-count` flag is gone and failed iterations are left out of the ratios. The test file reports 16 passed and `npm run typecheck` exits 0. |
| Workflow files, T013 to T030 | Done | All four files bind both counters from `loop_counters_json`, state the one failure rule and hold no `step_generate_dashboard`. Every `rg` check in `tasks.md` gives the expected result and the four files parse as YAML. |
| Dashboard, T031 | Done | `reduce-state.cjs:2871` prints the stuck count from `deriveLoopCounters`. The `research dashboard` case passes. |
| Contracts, T033 and T034 | Done | `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`, and `OK commands=1` for each of `deep/research` and `deep/review`. |
| Full suite, T036 | Done | 176 test files, 3002 passed, 8 skipped, 0 failed, exit 0. The baseline plus 16 new tests. |
| Fix SHA | Done | `485fd61d0a` on branch `worktrees/382-deep-loop-workflow-logic-hardening`. Nothing is pushed. |
| Phase close | Done | Every `acceptance-criteria.md` row is `Met`. |

### Open questions

- Answer: Retry and Skip both dispatch the next iteration and record nothing, Retry with the same focus and Skip with the next one. Cancel ends the run with status CANCELLED and no synthesis, as the other confirm gates do. The meaning adopted during planning had Retry and Skip append an event that resets `consecutiveFailureCount`. That was not built, see the first row under Deviations and findings. The gate asks again after each further failed iteration, and one completed iteration clears the count.
- Answered: phase 001 confirmed on 2026-11-14 that `runtime/scripts/convergence.cjs` owns the stop decision. D6 stands.

### Deviations and findings

| Item | Note |
|------|------|
| F03 in review | `step_read_state` already recounts `p0_count`, `p1_count` and `p2_count` each pass. The defect is three competing definitions, so D7 picks one. |
| F04 in review | The two review ratio signals weigh 0.55 together, below the 0.60 bar, so failures alone do not make a stop candidate. The fix still applies D2. |
| F07 in review confirm | `deep-review-confirm.yaml` has no `escalation` line. Only two rules disagree there. |
| Operator decision 2026-11-14: confirm gate | Confirm mode keeps a Retry / Skip / Cancel gate after three consecutive failed iterations. Auto mode halts straight to synthesis with stop reason `error`. D3 and D8 were amended. |
| Operator decision 2026-11-14: stop-decision owner | Phase 001 confirmed that `runtime/scripts/convergence.cjs` owns the stop decision. |
| Retry and Skip record nothing | The plan had them append an event that resets the failure count. The state log is a projection rebuilt from the ledger, and bookkeeping rows are printed, not persisted. Such an event needs a new ledger stem in two schemas, outside this phase's file list. The gate asks again after each further failed iteration, and a completed iteration clears the count. |
| `loop_counters_json` needs `--stop-decision` | The script prints the field on all three `--stop-decision` payloads, not for a bare `--state-log`. Every workflow passes both flags. |
| The gate sentence sits in `purpose` | The confirm-only Retry / Skip / Cancel sentence is the `purpose` of `gate_consecutive_failures`, not a line of the `algorithm` block. `stop-policy-yaml-parity.vitest.ts` requires that block to be identical in auto and confirm. |
| Research confirm gained the error row append | The spec noted the append as missing and did not list it as a change. Without it the failure count never moves in research confirm mode, so it was added to match the auto file. |
| Fixtures moved inside the repository | The stop-decision fixtures in `convergence-script.vitest.ts` moved from the system temp folder to the git-ignored `runtime/tests/.tmp/`, because the `--state-log` path check rejects a path outside the repository. |
| No workflow step persists a `timeout` row | `deriveLoopCounters` counts a `timeout` status, but nothing writes one today. Not fixed here. |
| `--stuck-count` flag removed | Phase 001 added the flag as a stopgap. The script now derives the count, so the flag is gone. |
| T032 needed no edit | The literal `stuck_count >= config.stuckThreshold` stays in the workflow text, so `deep-research-convergence-floor.vitest.ts` passes unchanged. |
| T011 `rg` prints two lines | The task expected one line for `'stateLog'`. Lines 87 and 1246 match, the flag list entry and the path check. |
| Docs for phase 005 | The loop-protocol references, the dashboard asset templates and the playbooks still describe the old rules. Phase 005 owns them. |
<!-- /ANCHOR:log -->
