---
title: "Goal: Phase 22: stop-park-notices"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "stop park notices goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/022-stop-park-notices"
    last_updated_at: "2026-11-14T17:30:00Z"
    last_updated_by: "code-agent"
    recent_action: "Built both parked-Stop notices and verified the suites"
    next_safe_action: "The orchestrator commits and reruns the two commit-scoped checks"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs", ".skilled/hooks/session-relaunch/claude/README.md", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-022-stop-park-notices"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the arm-throw notice reach the operator from a spawned hook? The direct import proves the write seam."
    answered_questions:
      - "Is a new log event needed? No, the target-pid and arm events already record each cause."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 22: stop-park-notices

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude Stop that parks a prepared hand-over because it resolved no target pid, or because its arm call threw, prints one line that names the cause, the withdrawal on the next prompt and the retry at a later Stop, while the stamp, the log line and the withdrawal stay as they are.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | Both silent parking branches print one notice each, after `markParked`. The missing-transcript and background-task notices stay as they are. |
| D2 | The line names the cause, the withdrawal on the next prompt and the retry at a later Stop, as the missing-transcript notice does. |
| D3 | The line is a `systemMessage` with no `decision` key, written through `dependencies.write`, and a failed write is logged as `stop-arm-error stage=notice`. |
| D4 | No new log event. The `target-pid` and `arm` lines already record the cause, and the failed write reuses `stop-arm-error`. |
| D5 | Each fix lands with a test that failed first, per parent D1. The target-pid test reads the spawned stdout and the arm test injects the write seam. |
| D6 | The Claude adapter only, per parent D2. No new module or record key, per parent D3. No live Stop, and nothing is merged or pushed without the operator, per parent D4. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The red run saved in `scratch/red.txt` shows both changed tests failing before the source edit (tests 2, pass 0, fail 2, exit 1), and `scratch/green.txt` shows both passing after (tests 2, pass 2, fail 0, exit 0).
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` exits 0 with `fail 0`, saved to `scratch/claude-conformance.txt` at tests 115, pass 115.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and the `tests` count in `scratch/baseline.txt`, saved to `scratch/final-suite.txt` at tests 1555, pass 1555, fail 0, exit 0.
- [x] `rg -c 'no target pid'` and `rg -c 'arm that throws'` print 1 or more for each of `.skilled/hooks/session-relaunch/README.md` and `.skilled/hooks/session-relaunch/claude/README.md`. Observed: each printed 1, exit 0.
- [x] `validate.sh 022-stop-park-notices --strict` prints `RESULT: PASSED`. Observed 2026-11-14: after `repair-derived.cjs --apply` reported `inspected=1 repaired=1 failed=0`, validate printed Errors 0, Warnings 0, `RESULT: PASSED` and exit 0.
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
| Review finding | Done | 2026-11-14, the whole-epic review finding F4, CONFIRMED against the tree at `fa6a56f0fc`: the two parking branches at `claude/stop-arm.mjs:196` and `:215` print nothing |
| Code read | Done | 2026-11-14 at `fa6a56f0fc`: the three parking branches, the one printed notice at `claude/stop-arm.mjs:146`, and the two tests at `tests/claude-adapters.test.cjs:1351` and `:1380` |
| Plan documents | Done | 2026-11-14: spec, plan, tasks, criteria and this goal written |
| Build | Done | 2026-11-14: `scratch/red.txt` failed at tests 2, pass 0, fail 2, exit 1, `scratch/green.txt` passed at tests 2, pass 2, fail 0, exit 0, `scratch/claude-conformance.txt` passed at 115, and `scratch/final-suite.txt` passed at 1555 against the 1555 baseline in `scratch/baseline.txt` |
| Fix commit | Pending | The orchestrator commits this tree. The working tree shows four modified files and no added file outside this child, and the added `logEvent('` count is 2, both reused `stop-arm-error` |
| Merge and push | Pending | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| The arm test does not spawn the hook | A `cwd` value of `1n` makes `arm` throw after the target resolves, and the direct `armPendingRecord` import lets the test inject `write`. The spawned stdout path is proved by the target-pid test. |
| One line per Stop | Each branch returns after its notice, so a Stop prints at most one line and the issue count cannot stack. |
<!-- /ANCHOR:log -->
