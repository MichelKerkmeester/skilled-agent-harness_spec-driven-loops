---
title: "Goal: Phase 12: session-name-carry"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "session name carry goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry"
    last_updated_at: "2026-11-13T00:00:00Z"
    last_updated_by: "builder"
    recent_action: "Built and verified the phase: reader, prepare, consume, wrapper and tests"
    next_safe_action: "The orchestrator commits the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-session-name-carry"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 12: session-name-carry

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude or Pi receiver starts with the sender's live session name plus its own session number, with no stacked suffix, and the wrapper's option comments state what it really does with a name flag.

### Decisions

Frozen choices. Changing one is an amendment. The parent's decisions bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | Nothing is built before the operator's greenlight, and this phase builds after phase 011, which also edits `.skilled/bin/skilled-loop` and `bin/session-relaunch.cjs`. |
| D2 | The live Claude name is the last `customTitle` in the session log. It wins over `SKILLED_LOOP_NAME` in `prepare`. |
| D3 | `consume` prints `name`, and the wrapper reads it there, not from `should-relaunch`, because `consume` is the locked read the live model and effort already use. |
| D4 | On hop H the receiver is named `<stem> (H+1)`. The stem drops a trailing ` (H)` only when H is 2 or more, so only the number this wrapper wrote is removed and suffixes never stack. |
| D5 | The manual command keeps the stem with no number, because a manual claim starts a new wrapper at hop 0. |
| D6 | A consumed name that is empty, starts with `-` or holds a control character is not used, and the launch name stays. |
| D7 | The `-n/--name` entries for Codex, Cursor, Devin and OpenCode stay so a hop still strips them. Only the two comments change. |
| D8 | Test first. Each new test holds a failing run before its source edit, and five existing guards change only their expected hop name. |
| D9 | The OpenCode title, README text and Pi live names stay out of this phase. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n '^\| T001 custom-title' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry/goal.md` prints the one Progress row, which ends in yes.
- [ ] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`.
- [ ] `rg -n 'no name flag' .skilled/bin/skilled-loop` prints 2 lines.
- [ ] `rg -c '\| Met \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry/acceptance-criteria.md` prints 9.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry --strict` prints `RESULT: PASSED`.
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
| Planning documents | Done | 2026-11-13: spec, plan, tasks, criteria and goal written from research.md section 9 ranks 6, 9 and 11 and from the code at the cited lines |
| T001 custom-title on a launch name | Done | 2026-11-13: Claude Code 2.1.323 in print mode with `claude -p --name probe-name "Reply OK"`, never renamed, exit 0; the entry types in order begin custom-title, agent-name, session-owner, the custom-title and agent-name pair appears three times in all, and each custom-title entry holds customTitle probe-name. This was print mode, not an interactive session with the operator. Answer: yes |
| T002 phase 011 built | Done | 2026-11-13: phase 011 is committed as 0e516a4ab6 and every row of its acceptance-criteria.md is Met |
| T003 baseline | Done | 2026-11-13: 915 tests, 915 pass, fail 0, exit 0; saved in `scratch/baseline.txt` |
| T006 through T017 | Done | 2026-11-13: the reader, prepare, consume and wrapper changes landed after their red runs; `scratch/red.txt` holds 17 `not ok` lines and `scratch/green.txt` holds the passing runs |
| T018 full suite | Done | 2026-11-13: 928 tests, 928 pass, fail 0, exit 0; the baseline 915 plus the 13 new tests |
| T019 prepare timing | Done | 2026-11-13: `prepare` wall 137.2 ms before and 279.8 ms after on the same 16 MiB untitled log; delta 142.6 ms, inside the 200 ms bound in NFR-P01 |
| T020 scope check | Done with a note | 2026-11-13: the two files `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` and `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` are the concurrent builder's, not this phase's; the other ten changed files are the ones in the spec.md table |
| T021 comment labels | Done | 2026-11-13: no added line in the phase diff matches `specs/`, `REQ-` or `012-` |
| T022 strict validation | Done | 2026-11-13: validate.sh printed `RESULT: PASSED` |
| Build | Done | 2026-11-13: T003 through T022 ran under the operator's greenlight |

### Deviations and findings

| Item | Note |
|------|------|
| research.md section 4 on `consume` | It says `consume` returns `name` at `bin/session-relaunch.cjs:641`. Line 641 is in `should-relaunch`. The `consume` loop at line 793 prints only model, provider and effort, so this phase adds `name` to it |
| research.md section 9 rank 6 line for the reader | `context-usage.cjs:229` is `readClaudeSettings`, which searches for the last main-chain assistant entry. Its trail holds only entries after the last assistant turn, so a `/rename` before that turn is missed, and the plan uses a separate tail search for the title |
| Rank 11 drop or correct | Codex and Devin exit 2 on `-n probe-name --version`, while Cursor and OpenCode print their version. The plan corrects the comments and keeps the entries, because the existing strip cases rely on them |
| T002 verify command | tasks.md T002 expects `rg -n 'Closeable:\*\* Yes' ../011-permission-mode-carry/acceptance-criteria.md` to print 1 line. That file line 91 still says `**Closeable:** No` while every AC row is `Met`; phase 011 is committed as 0e516a4ab6, so T002 holds on the commit and the rows, and the closure sentence is stale |
| REQ-002 versus REQ-009 | REQ-002 makes `readClaudeSettings` return `name` and REQ-009 says every existing `readClaudeSettings` test passes unchanged. They cannot both hold: the eight existing `deepEqual` expectations compared `{model, effort}` and needed `name: ''` added. Only those expectations changed |
| Sixth guard on the hop name | REQ-008 names five guards. `a hop replaces the start prompt and the record settings` at `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:183` also expects the hop name and changed `launch name` to `launch name (2)`; no other assertion in it changed |
| Manual-command test source | The manual case reads the record name with no launch name, so it failed before the change as T014 requires; it names `X` and asserts no `(2)`. The wrapper now applies the consumed name in the manual template too, which is why the decline keeps the stem |
| Goal completion criterion | The first criterion quoted the same phrase it checked, so `rg` printed 2 lines and no run could print 1. The bullet now matches `^\| T001 custom-title`; the acceptance check still finds the one Progress row, which ends in yes |
| T005 and T019 prepare timing | Before edit: `prepare wall 137.2 ms`, `/usr/bin/time -p real 0.17, user 0.07, sys 0.07`. After edit: `prepare wall 279.8 ms`, `real 0.32, user 0.10, sys 0.11`. Delta 142.6 ms on the same 16 MiB log, inside the 200 ms bound |
<!-- /ANCHOR:log -->
