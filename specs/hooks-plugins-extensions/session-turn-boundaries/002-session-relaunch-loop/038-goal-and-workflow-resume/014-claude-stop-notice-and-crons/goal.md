---
title: "Goal: Phase 14: claude-stop-notice-and-crons"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "claude stop notice and crons goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/014-claude-stop-notice-and-crons"
    last_updated_at: "2026-11-13T12:00:00Z"
    last_updated_by: "planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Run T001, the live cron check, once the operator gives the go-ahead"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-claude-stop-notice-and-crons"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 14: claude-stop-notice-and-crons

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A deferred Claude hop tells the operator what it waits on and how to call it off, and the relaunch log records how many crons a session held when its hop was armable.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The two runtime claims, crons end on a hop and a Stop `systemMessage` reaches the operator, are checked live or from Claude's own documentation before any source edit. A refuted claim stops the build. |
| D2 | The adapter logs the cron count only. The cron list reaches the note through phase 009's `Scheduled:` line, because Stop runs after `prepare` validated the note and fires at every turn end. |
| D3 | The notice is a `systemMessage` line with no `decision` key, so the turn never continues because of it. |
| D4 | Only `claude/stop-arm.mjs` and `tests/claude-adapters.test.cjs` change. Codex, Pi, OpenCode, the nudge and the README stay out. |
| D5 | The build waits for phase 011, which edits the same file, and for the operator's go-ahead. Nothing is pushed or merged without the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `scratch/live-crons.txt` shows one task in the sender's list, none in the receiver's, the saved `session_crons` entry and the `systemMessage` source.
- [ ] `env -u AI_SESSION_CHILD node --test --test-name-pattern 'stop-arm defers pending state|stop-arm logs the cron count' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`, and `scratch/red.txt` holds both earlier failing runs.
- [ ] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`.
- [ ] `validate.sh 014-claude-stop-notice-and-crons --strict` prints `RESULT: PASSED` and every row in `acceptance-criteria.md` is Met.
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
| Planning | Done | 2026-11-13: spec, plan, tasks, criteria and goal written from research section 9 ranks 4 and 8 and section 7 item 2. Every criterion Unmet |
| Build | Pending | Waits for phase 011 and the operator's go-ahead |

### Deviations and findings

| Item | Note |
|------|------|
| Cron claim source | Research section 5 marks it CONFIRMED from Claude's scheduled-tasks page only. T001 observes it live before any edit |
| Existing test contract | `claude-adapters.test.cjs:653` asserts an empty stdout on deferral. T005 replaces that assertion, which is a planned contract change, not a regression |
<!-- /ANCHOR:log -->
