---
title: "Goal: Apply the configured review minIterations floor in convergence"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review min iterations floor goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/003-review-min-iterations-floor"
    last_updated_at: "2026-11-17T17:15:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-child-authoring-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Apply the configured review minIterations floor in convergence

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A deep-review run never stops before its configured `minIterations` floor, and a run with the shipped floor of 2 stops exactly where it does today.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The new proving case uses a floor above 2 and is built from real loop state, which cannot produce an iteration-1 candidate; the existing direct-input iteration-1 case in `stop-decision.vitest.ts` is inverted, not added. |
| D2 | The shipped floor value in `deep-review-config.json` is not changed. |
| D3 | No other slice is a prerequisite. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/review-depth-convergence.vitest.ts tests/integration/review-stop-path-replay.vitest.ts tests/unit/stop-decision.vitest.ts` exits 0 with the configured-floor case and the inverted review case.
- [x] The configured-floor case and the inverted `stop-decision.vitest.ts` case fail against the pre-change `convergence.cjs`, and the full runtime suite shows one case changed and no new failure. Fail-before: `BLOCKED` and `STOP` before the fix (T003, T008). Full suite: integration gate `adedc72e930` (all phases 001-013 merged): 190 files, 3358 passed, 11 skipped, 0 failed, against baseline `c9d8ff4` with 3095 passed and 0 failed.
- [x] `grep -n 'minIterationsNotReached' .skilled/commands/deep/assets/deep-review.yaml` prints the stop-order line, and `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs --command deep/review` exits 0.
- [x] The `deep-review/manual-testing-playbook` index lists a review floor scenario written by `/create:manual-testing-playbook`.
- [x] `grep -n "loopType === 'research' && minIterations" .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` prints nothing.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase spec authored | Done | `spec.md`, `plan.md`, `tasks.md` written 2026-11-17 |
| Baseline (T001, T002) | Done | Three suites at `21c4b325b5a`: 3 files, **69 passed**, exit 0. Full runtime suite from the parent goal log: 3095 passed, 0 failed |
| Implementation | Done | 2026-11-17 in worktree `457-ed-003-review-min-iterations-floor`: floor check widened in `convergence.cjs`, loop-state case, inverted unit case, stop-order item `4a`, README sentence, review contract regenerated. Three suites plus the drift and YAML parity suites: 5 files, 83 passed, exit 0 |
| Full runtime suite (T007) | Open | Runs once per merge in the integration worktree |
| Playbook and changelog (T011, T012) | Done for 003, walk open | 2026-11-17, `@markdown`: `DRV-072` written through the update-mode steps (`validate-playbook-package.cjs` PASS, 59 scenarios) and listed in the root index. Changelog `deep-review v1.11.18.0` (DQI 89), with step 6 moving the packet SKILL.md version to 1.11.18.0 (parent-skill-check PASS). The `minIterations: 3` walk is not run. |

### Deviations and findings

| Item | Note |
|------|------|
| Changelog | Added T012 from the cross-phase handoff §3 (default-path change). Blocked by the same `@markdown` gate. |
| Fail-before evidence | Before the fix the loop-state case got `BLOCKED` at iteration 2, which shows the run reached a stop candidate and ran the gates; the floor now runs before them. |
| Plan review amendments 2026-11-17 | Applied the Fable 5.2 plan review: `stop-decision.vitest.ts:905-913` asserts the old research-only gate and is inverted (D1 reworded to match); the review stop order and README name the floor; the review contract is regenerated; test commands run from `runtime/`; the playbook scenario goes through `/create:manual-testing-playbook`. |
| 2026-11-18 00:1x | T007 and the last criterion closed at the integration gate `adedc72e930` (all phases 001-013 merged): 190 files, 3358 passed, 11 skipped, 0 failed, against baseline `c9d8ff4` with 3095 passed and 0 failed. |
<!-- /ANCHOR:log -->
