---
title: "Goal: Phase 17: missing-transcript-notice"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "missing transcript notice goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/017-missing-transcript-notice"
    last_updated_at: "2026-11-14T18:10:00Z"
    last_updated_by: "code-agent"
    recent_action: "Recorded fix commit 78f9d39501 (Commit-Id 0014033) and its scoped file list"
    next_safe_action: "The operator decides the merge"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs", ".skilled/hooks/session-relaunch/README.md", ".skilled/hooks/session-relaunch/claude/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-missing-transcript-notice"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does Claude show a Stop systemMessage when the payload has no transcript path? Not run live; the background-task notice relies on the same contract."
    answered_questions:
      - "Is the silent withdrawal intended? The operator answered on 2026-11-14: Keep, add a notice (Recommended)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 17: missing-transcript-notice

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude Stop that cannot arm because its payload has no transcript path prints one line telling the operator that the next prompt withdraws the hop because the transcript was missing, and the withdrawal itself stays as it is.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The withdrawal stays. The operator answered "Keep, add a notice (Recommended)" on 2026-11-14. |
| D2 | The line prints at the Stop, the one place that knows the cause. Carrying the cause to the prompt would need a relaunch record key, which parent D3 forbids. |
| D3 | The line is a `systemMessage` with no `decision` key, written through `dependencies.write`, as the background-task notice is. A failed write is logged as `stop-arm-error stage=notice`. |
| D4 | No new log event. The existing `missing-transcript-path` line is the logged record, written once per Stop. |
| D5 | The fix lands with a test change that failed first, per parent D1. The Claude adapter only, per parent D2. |
| D6 | No live Stop is run in this phase. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The red run saved in `scratch/red.txt` shows `stop-arm logs missing-transcript-path and marks the pending record deferred` failing before the source edit. Observed 2026-11-14: `scratch/red.txt:2` prints `✖`, `:6` `ℹ fail 1`, the assertion at `:16` reads `stdout is empty: the missing-transcript Stop printed no notice`, and `:28` `exit=1`.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='missing-transcript-path and marks' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `pass 1` and `fail 0`. Observed 2026-11-14: `scratch/green.txt:2` prints `✔`, `:3` `ℹ tests 1`, `:5` `ℹ pass 1`, `:6` `ℹ fail 0` and `:11` `exit=0`.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and the test count saved in `scratch/baseline.txt`. Observed 2026-11-14: `scratch/final-suite.txt:1566` prints `ℹ tests 1553`, `:1568` `ℹ pass 1553`, `:1569` `ℹ fail 0` and `:1574` `exit=0`, equal to the 1553 baseline at `scratch/baseline.txt:1565`, `:1567` and `:1568`.
- [x] `rg -c 'could not arm the hop because this Stop carried no transcript path' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints 1, and `rg -c 'no transcript path' .skilled/hooks/session-relaunch/README.md .skilled/hooks/session-relaunch/claude/README.md` prints a count for each of the two files. Observed 2026-11-14: printed 1 with exit 0, then 1 for each README with exit 0.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/017-missing-transcript-notice --strict` prints `RESULT: PASSED`. Observed 2026-11-14: Errors 0, Warnings 0, `RESULT: PASSED`, exit 0, after `repair-derived.cjs --apply` reported `inspected=1 repaired=1 failed=0`.
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
| Review findings | Done | 2026-11-14. Both independent reviews: a Stop with no transcript path stamps the record, the next prompt withdraws the hop and nothing tells the operator. Both left it as a judgment call |
| Operator answer | Done | 2026-11-14, word for word: "Keep, add a notice (Recommended)" |
| Code read | Done | 2026-11-14 at `99d197475d`: the branch logs at `stop-arm.mjs:137` and stamps at `:138`, the only `systemMessage` is at `:162`, and the test asserts an empty stdout at `claude-adapters.test.cjs:958`. The output is quoted in `spec.md` Measured Behavior |
| Plan documents | Done | 2026-11-14: spec, plan, tasks, criteria and this goal written. `implementation-summary.md` is written after the build |
| Build | Done | 2026-11-14: T001 to T012 completed. Red `scratch/red.txt`: tests 1, pass 0, fail 1, exit 1, the failure naming the empty stdout. Green `scratch/green.txt`: tests 1, pass 1, fail 0, exit 0. Claude adapter and conformance suites: tests 115, pass 115, fail 0, exit 0. Relaunch and OpenCode plugin suites: tests 1553, pass 1553, fail 0, exit 0, the baseline count |
| Fix commit | Done | 2026-11-14: `78f9d39501`, Commit-Id 0014033. It changes `stop-arm.mjs`, `claude-adapters.test.cjs`, the relaunch README and the Claude adapter README plus this child's records, adds no file outside the child, and adds no log event, because the failure path reuses `stop-arm-error`. The old adapter failed the changed test 1 of 1, the suites printed tests 1553, pass 1553, fail 0, exit 0, and hook registration and runtime mirror checks both printed `PASS` |
| Merge and push | Pending | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| Where the line prints | The operator's answer asks for a line saying the hop was withdrawn because the transcript was missing. The withdrawal happens at the next prompt, and the prompt hook cannot tell this cause from the three other stamping paths without a record key. So the line prints at the Stop and says the next prompt withdraws the hop because the Stop had no transcript path. The meaning is the operator's, and the timing is the earliest point that knows the cause |
| Logging | No new event. The `missing-transcript-path` line already records the cause, and the prompt hook logs `withdrawn`. The test asserts exactly one `missing-transcript-path` line |
<!-- /ANCHOR:log -->
