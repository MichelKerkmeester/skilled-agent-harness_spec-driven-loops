---
title: "Goal: Phase 3: lifecycle-lock-and-limits"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "lifecycle lock and limits goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/003-lifecycle-lock-and-limits"
    last_updated_at: "2026-11-14T11:33:20Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-003-lifecycle-lock-and-limits"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: lifecycle-lock-and-limits

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make deep-research and deep-review restart, lock lifetime, lock release and the duration limit behave as their workflow configs claim.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research gets the same restart surface and behavior as review: the same `--restart` and `--lineage-mode` flags, the same archive-then-new-generation semantics and the same recorded `run_restarted` event. Research does not invent a second design. |
| D2 | A restart never moves a held lock file and never loses the lineage values it set. The new config carries the incremented generation, the parent session id and lineage mode `restart`. |
| D3 | The lock stays valid for the whole of the longest allowed dispatch. The mechanism is a TTL derived from the configured dispatch timeout, the larger of 1800000 ms and `timeoutSeconds` times 1000, with a refresh right before and right after each dispatch. The trade-off is that a crashed run blocks its packet for twice the TTL, 120 minutes at the 3600-second cap. A dispatch heartbeat is rejected because the lock CLI exits after each call and an orphaned refresher would hold a transient lock forever. |
| D4 | Every terminal path releases the lock through one shared `step_release_lock`, and a test enumerates the halt branches. |
| D5 | `maxDurationMinutes` is enforced at the loop boundary as a terminal stop that still runs synthesis, with stop reason `maxDurationReached`, a new member that phase 001 adds to the frozen `stop_reasons_enum`. This phase only uses it. Removing the field is rejected, because the config and both templates advertise a wall-clock ceiling and an unattended auto run has no other bound on total time. |
| D6 | This phase edits all four workflow files, because single-sourcing them is phase 004's job. It depends on phases 001 and 002. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/workflow-restart-lifecycle.vitest.ts tests/unit/workflow-lock-lifetime.vitest.ts tests/unit/deep-research-lock-release.vitest.ts tests/unit/workflow-max-duration.vitest.ts` exits 0 on the fix commit and exited 1 on the start commit.
- [x] `npm --prefix .skilled/skills/system-deep-loop/runtime test` reports no failing test that `scratch/baseline-suite.txt` does not list.
- [x] `rg -c -- '--restart|--lineage-mode' .skilled/commands/deep/research.md` prints a number above 0.
- [x] `rg -c 'applies_to: \[' .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-review-auto.yaml` prints no line.
- [x] Every row in `acceptance-criteria.md` is `Met`.
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
| Spec docs | Done | Authored on 2026-11-14. Implementation started after phase 002 closed. |
| Start commit | Done | `2ead06cf42`, the phase 002 close. |
| Baseline suite | Done | `scratch/baseline-suite.txt`: 176 test files, 3002 passed, 8 skipped, 0 failed. |
| Failing-first tests, T003 to T006 | Done | `workflow-restart-lifecycle.vitest.ts` reported 30 failed and 1 passed before the workflow edits. `workflow-lock-lifetime.vitest.ts`, `workflow-max-duration.vitest.ts` and the new block in `deep-research-lock-release.vitest.ts` reported 20 failed and 10 passed. The native dispatch case reported 4 failed before its edit. |
| Restart, T007 to T022 | Done | The restart test file reports 32 passed. Research accepts `--restart` and `--lineage-mode`, and all four files bind the prior lineage before the archive. |
| Lock lifetime and release, T023 to T030 | Done | The lock lifetime file reports 14 passed and the lock release file 12 passed. `--ttl-ms 1800000` and `applies_to: [` appear in no workflow file. |
| Duration limit, T031 to T034 | Done | The duration file reports 8 passed. `maxDurationMinutes` appears 6 times in each workflow file. |
| Contracts, T035 and T036 | Done | `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`. `npm run typecheck` exits 0. |
| Full suite, T038 | Done | 179 test files, 3060 passed, 8 skipped, 0 failed, exit 0. The baseline plus 58 new tests. The first full run had 7 failures in 4 files and the second 2 in 1 file, each traced to this phase's changes and fixed, see the deviations. |
| Restart drill, T039 | Done | A copy of `specs/system-deep-loop/z_archive/001-sk-recursive-agent-loop/research` was restarted with the binding and archive commands read from `deep-research-auto.yaml`. The binding printed `priorSessionId` `dr-2026-04-03T12-22-09Z` and `priorGeneration` 2. `ls research_archive` listed one folder, `20261114T170500Z`. The archived config holds `"generation": 2`. The new config, rendered from `lineage_values`, holds `"generation": 3`, lineage mode `restart` and the prior session id as parent. A second archive run against the same slug exited 1. The drill folder is deleted. |
| Fix SHA | Done | `0554ea051f` on branch `worktrees/382-deep-loop-workflow-logic-hardening`. Nothing is pushed. |
| Phase close | Done | Every `acceptance-criteria.md` row is `Met`. |

### Deviations and findings

| Item | Note |
|------|------|
| F06 holds in part | Restart is unreachable in research auto only. Research confirm reaches it through `on_restart_choice`. Review's restart also loses lineage: nothing binds `prior_session_id` before the archive and its config writes generation 1. Requirements REQ-003 to REQ-005 cover all four files. |
| F09 holds in a narrower form | The four-hour figure is the fan-out lineage ceiling in `fanout-run.cjs`. The lock is refreshed per iteration, so the risk is one dispatch of up to 3600 seconds against a 60-minute stale window. |
| Decision beyond D1 to D6 | The confirm restart choices archive the packet contents and leave the held lock file in place, because the operator answers only after the lock is taken. |
| Decision beyond D1 to D6 | The research restart flags are added to `research.md` and `deep-research-presentation.txt` in this phase, because D1 needs them to run. Skill prose stays with phase 005. |
| Finding classes | F06 `cross-consumer`, F09 `class-of-bug`, F10 `instance-only`. |
| Operator decision 2026-11-14 | The duration stop uses the new stop-reason member `maxDurationReached`. Phase 001 adds it to the frozen list, and this phase only uses it. |
| Operator decision 2026-11-14 | The council mode is out of scope here. The new sibling phase `006-ai-council-mode-deprecation` retires it. |
| Adopted default 2026-11-14 | The duration clock starts at the config `createdAt` of the current generation. A resume keeps the clock and a restart resets it, so paused and waiting time counts. Announced to the operator, who did not object. |
| Native dispatch was not bounded | Checked in code: the `if_native` branch of `step_dispatch_iteration` held no timeout in any of the four files, while every CLI branch holds `timeout_seconds`. The native branch now carries the same line, with a test per file. The bound is workflow text the orchestrating runtime follows. Nothing in the runtime scripts enforces it. |
| The duration stop prints its row | The step prints a bookkeeping row instead of appending one, because the gateway refuses an event with no ledger stem (probed: `unknown-legacy-record`). The reason reaches synthesis through the bound `reason`. `maxDurationReached` is declared in `pinned_bookkeeping.events` of all four files. |
| The restarted row uses the structured stem form | The stem checker credits only a `"stem":` key. The row needs `priorTailDigest`, so the prior-lineage binding also prints the sha256 of the old state log. That also binds `prior_tail_digest` for the review restart, which was unbound in auto mode. |
| Three test files outside the spec's file list changed | `check-ledger-stem-producers.vitest.ts` expects 24 spoken and 62 reserved stems, and one line of its emitter list was added by hand. `deep-review-lock-refresh.vitest.ts` expects `--ttl-ms {lock_ttl_ms}` in place of the fixed value. `deep-research-bookkeeping-emission.vitest.ts` fills the restarted row's digest with a real digest and its `generation_init` with 1, the second by hand. The gateway accepted the row with those values and refused it with the test's dummy values. No assertion was loosened. |
| Research confirm declares the auto-only step | `confirm_parity.omitted_steps` in `deep-research-confirm.yaml` names `step_apply_lifecycle_request`, as the review confirm file does. |
| The lock TTL reads `executor_timeout` | No config exists yet when the lock is taken, so the TTL is derived from the setup value, 900 when unset. |
| Shape of the release routing | `release_lock: step_release_lock` is the routing key beside each `halt: true`. The lost-lock lines and the cancel choices name the step in their text, and `on_missing_counters` counts as a halting path. |
| Not fixed, found | Review confirm `on_restart_choice` still skips to `step_create_config`, past scope discovery. The review `step_record_restarted_run` still uses `{iteration_count}` and `{generation}`, which a fresh restart does not bind. The pivot seat dispatches carry neither a lock refresh nor a timeout. |
| T011 `rg` prints nothing as written | The archive command quotes the path now. The quoted form prints one line, inside `step_apply_lifecycle_request`. |
| CHK-010 command fails as written | No `yaml` package exists at the named path. The same parse with `js-yaml` exits 0 for the four files. |
<!-- /ANCHOR:log -->
