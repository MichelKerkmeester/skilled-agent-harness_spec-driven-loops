---
title: "Goal: Phase 12: wrapper-notice-log"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "wrapper notice log goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/012-wrapper-notice-log"
    last_updated_at: "2026-11-14T08:10:00Z"
    last_updated_by: "code-agent"
    recent_action: "Built the log line and the empty-checksum guard test first and recorded every run in scratch/"
    next_safe_action: "The orchestrator commits the four files, runs T014 against the fix commit, and decides the merge"
    blockers: []
    key_files: [".skilled/bin/skilled-loop", ".skilled/hooks/session-relaunch/README.md", ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs", ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-wrapper-notice-log"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the operator see the stderr note above a full-screen receiver on Pi and OpenCode? Not run; one edited-wrapper hop on each runtime would answer it."
    answered_questions:
      - "Does a hop under an unreadable wrapper copy print the false note? Yes, before the fix, and the T006 test reproduces it."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 12: wrapper-notice-log

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A hop under a wrapper file that changed after the loop started leaves one `wrapper-changed` line in `relaunch.log` beside the stderr note, and a wrapper file that cannot be read at the hop prints and logs nothing.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The log line and the empty-checksum guard are one fix, because both change the same four lines of the notice block. Each lands with its own test that failed first, per parent D1. |
| D2 | The line is written through the core's `appendLog` in the `node -e ... -- "$relaunch_core"` form the wrapper already uses. No CLI command, no module and no relaunch record key is added, per parent D3. |
| D3 | A failed log write never holds a hop back. The call ends in `|| true`. |
| D4 | Only the hop-time checksum is guarded. An empty checksum at loop start has no test that can produce it and stays as it is. |
| D5 | The shared wrapper only. No adapter changes, and neither `history` nor `/doctor:setup` reads the line in this phase. |
| D6 | No live hop is run in this phase. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The red run saved in `scratch/red.txt` shows `tests 4`, `pass 2` and `fail 2` for the name pattern `wrapper file` before the source edit. `scratch/red.txt:10`, `:12` and `:13`, with `exit=1` at `:65`.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='wrapper file' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `pass 4` and `fail 0`. `scratch/green.txt:8`, `:9` and `:14`.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and two more tests than the baseline saved in `scratch/baseline.txt`. `scratch/final-suite.txt:1563` and `:1566` print tests 1550 and fail 0, against the 1548 baseline.
- [x] `bash -n .skilled/bin/skilled-loop` exits 0 and `rg -c 'wrapper-changed' .skilled/bin/skilled-loop .skilled/hooks/session-relaunch/README.md` prints 1 for each file. Both observed on 2026-11-14.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/012-wrapper-notice-log --strict` prints `RESULT: PASSED`. Observed 2026-11-14: Errors 0, Warnings 0, `RESULT: PASSED`, exit 0.
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
| Review findings | Done | 2026-11-14. Review A, P2: the notice is transient and reaches no log. Review B, P2: an unreadable file at hop time yields an empty checksum and prints the note. Both reviews are named in the parent goal log |
| Code read | Done | 2026-11-14 at `be1aebb9f3`: `.skilled/bin/skilled-loop:1469` to `:1472` print to stderr only, and `rg -c 'wrapper-changed'` over the wrapper, the core, the CLI and the tests printed nothing with exit 1. The output is quoted in `spec.md` Measured Behavior |
| Plan documents | Done | 2026-11-14: spec, plan, tasks, criteria and this goal written. `implementation-summary.md` was the scaffold and is now written |
| Build | Done | 2026-11-14: T001 to T013 run. Red `scratch/red.txt` is tests 4, pass 2, fail 2, exit 1; green `scratch/green.txt` is tests 4, pass 4, fail 0, exit 0; the whole relaunch and OpenCode plugin run is tests 1550, pass 1550, fail 0, exit 0 in `scratch/final-suite.txt`. T014 waits on the fix commit, which the orchestrator lands |
| Merge and push | Pending | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| Two findings, one child | The parent asks for one child per code fix. Both findings change the notice block at lines 1469 to 1472, so they are planned as one fix with two failing tests. The operator can split them if that reading of parent D1 is wrong |
| False note not reproduced | The false note for an unreadable file is read from the code. The test added in T006 is the first thing that reproduces it: `scratch/red.txt:8` fails on the note the old block printed for an unreadable file |
| Unreadable copy proved harmless to the loop | The harness makes the copied wrapper unreadable on the first runtime invocation with `chmod 0o000`. The hop still ran twice and the wrapper exited 0, so bash kept the descriptor it opened and only the fresh `cksum` read failed, as the risk table expected |
| Settings file not covered | Review B also asked for a note when `.claude/settings.json` changes. It is rejected in the parent log: a hop starts a new process that reads its settings at start. That is inferred, and one hop after a settings edit would confirm it |
<!-- /ANCHOR:log -->
