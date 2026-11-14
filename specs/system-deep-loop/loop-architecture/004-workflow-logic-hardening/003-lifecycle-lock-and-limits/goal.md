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
    completion_pct: 0
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

- [ ] `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/workflow-restart-lifecycle.vitest.ts tests/unit/workflow-lock-lifetime.vitest.ts tests/unit/deep-research-lock-release.vitest.ts tests/unit/workflow-max-duration.vitest.ts` exits 0 on the fix commit and exited 1 on the start commit.
- [ ] `npm --prefix .skilled/skills/system-deep-loop/runtime test` reports no failing test that `scratch/baseline-suite.txt` does not list.
- [ ] `rg -c -- '--restart|--lineage-mode' .skilled/commands/deep/research.md` prints a number above 0.
- [ ] `rg -c 'applies_to: \[' .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-review-auto.yaml` prints no line.
- [ ] Every row in `acceptance-criteria.md` is `Met`.
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
| Spec docs | Done | Authored on 2026-11-14. Implementation has not started. |

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
| Fact to check in code | Is a native dispatch bounded by `timeoutSeconds`? The REQ-007 work reads the native dispatch path first. If the answer is no, REQ-007 needs a separate native bound. This is not an operator decision. |
<!-- /ANCHOR:log -->
