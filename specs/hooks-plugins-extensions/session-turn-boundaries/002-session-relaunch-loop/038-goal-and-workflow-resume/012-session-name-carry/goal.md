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
    last_updated_at: "2026-11-13T12:00:00Z"
    last_updated_by: "planner"
    recent_action: "Planned the phase: spec, plan, tasks, criteria and goal"
    next_safe_action: "Wait for the operator greenlight and phase 011, then run T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-session-name-carry"
      parent_session_id: null
    completion_pct: 0
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

- [ ] `rg -n 'custom-title on a launch name' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry/goal.md` prints 1 line.
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
| T001 custom-title on a launch name | Pending | UNCONFIRMED. 4 of 80 Claude logs in this project start with a `custom-title` entry before any user entry, read by entry type only, which does not show which flags started those sessions |
| Build | Pending | Waits on the operator greenlight and phase 011 |

### Deviations and findings

| Item | Note |
|------|------|
| research.md section 4 on `consume` | It says `consume` returns `name` at `bin/session-relaunch.cjs:641`. Line 641 is in `should-relaunch`. The `consume` loop at line 793 prints only model, provider and effort, so this phase adds `name` to it |
| research.md section 9 rank 6 line for the reader | `context-usage.cjs:229` is `readClaudeSettings`, which searches for the last main-chain assistant entry. Its trail holds only entries after the last assistant turn, so a `/rename` before that turn is missed, and the plan uses a separate tail search for the title |
| Rank 11 drop or correct | Codex and Devin exit 2 on `-n probe-name --version`, while Cursor and OpenCode print their version. The plan corrects the comments and keeps the entries, because the existing strip cases rely on them |
<!-- /ANCHOR:log -->
