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
    completion_pct: 0
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

- [ ] `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/loop-counters-derivation.vitest.ts` exits 0, including the four-failure research case and the resume case.
- [ ] `rg -c -e 'step_generate_dashboard' -e 'Accumulate from severity_counts' -e 'trigger stuck_recovery event' -e 'After 3 consecutive errors' .skilled/commands/deep/assets/deep-re*.yaml` prints nothing, `rg -c 'Retry / Skip / Cancel' .skilled/commands/deep/assets/deep-re*-auto.yaml` prints nothing and `rg -c 'Retry / Skip / Cancel' .skilled/commands/deep/assets/deep-re*-confirm.yaml` prints a count for each of the two confirm files.
- [ ] `rg -n -e 'stuck_count: 0' -e 'stuck_count \+ 1' .skilled/commands/deep/assets/deep-re*.yaml` prints nothing.
- [ ] `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs --command deep/research` and the same with `deep/review` exit 0.
- [ ] `npm --prefix .skilled/skills/system-deep-loop/runtime test` exits 0.
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
| Spec docs authored | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` were authored on 2026-11-14. Implementation has not started. |

### Open questions

- Settled: The confirm files name Retry / Skip / Cancel (`deep-research-confirm.yaml:1943` and `deep-review-confirm.yaml:2155`) but never define what each choice does. The counter is derived from the state log, so a choice changes it only through a persisted event. Adopted meaning: Retry appends a gate-decision event that resets `consecutiveFailureCount` to 0 and dispatches the next iteration with the same focus. Skip appends the same event and dispatches the next iteration with the next focus. Cancel ends the run with status CANCELLED and no synthesis, as the other confirm gates do. Tasks T024 and T026 use this meaning. Adopted as the default on 2026-11-14: announced to the operator, who did not object.
- Answered: phase 001 confirmed on 2026-11-14 that `runtime/scripts/convergence.cjs` owns the stop decision. D6 stands.

### Deviations and findings

| Item | Note |
|------|------|
| F03 in review | `step_read_state` already recounts `p0_count`, `p1_count` and `p2_count` each pass. The defect is three competing definitions, so D7 picks one. |
| F04 in review | The two review ratio signals weigh 0.55 together, below the 0.60 bar, so failures alone do not make a stop candidate. The fix still applies D2. |
| F07 in review confirm | `deep-review-confirm.yaml` has no `escalation` line. Only two rules disagree there. |
| Operator decision 2026-11-14: confirm gate | Confirm mode keeps a Retry / Skip / Cancel gate after three consecutive failed iterations. Auto mode halts straight to synthesis with stop reason `error`. D3 and D8 were amended. |
| Operator decision 2026-11-14: stop-decision owner | Phase 001 confirmed that `runtime/scripts/convergence.cjs` owns the stop decision. |
| Docs for phase 005 | The loop-protocol references, the dashboard asset templates and the playbooks still describe the old rules. Phase 005 owns them. |
<!-- /ANCHOR:log -->
