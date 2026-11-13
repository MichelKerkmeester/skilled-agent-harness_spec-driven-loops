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
    last_updated_at: "2026-11-13T15:30:00Z"
    last_updated_by: "builder"
    recent_action: "Built the deferral notice and the cron count log; tests, suite and validation pass"
    next_safe_action: "None, the phase is complete"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-claude-stop-notice-and-crons"
      parent_session_id: null
    completion_pct: 100
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
- [x] `env -u AI_SESSION_CHILD node --test --test-name-pattern 'stop-arm defers pending state|stop-arm logs the cron count' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`, and `scratch/red.txt` holds both earlier failing runs.
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`.
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
| Build | Done | 2026-11-13: T002 to T012 built by DeepSeek V4.1 Flash max. T001 was run live after the build and confirmed both claims |
| Baseline | Done | T004: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` printed tests 914, pass 914, fail 0 |
| Test-first red | Done | `scratch/red.txt`: T005 exit 1 on the empty stdout; T006 exit 1 because no `relaunch.log` existed |
| Tests after edit | Done | `scratch/green.txt`: T007 and T008 exit 0 with fail 0. Guard tests 3 pass. Whole suite at T010: tests 915, pass 915, fail 0. Final-state rerun after a concurrent builder added six tests: tests 921, pass 921, fail 0 |
| Validation | Done | `validate.sh ... --strict` printed `RESULT: PASSED` after the build and again after the doc edits |

### Deviations and findings

| Item | Note |
|------|------|
| T001 run after the build | The builder could not start a live Claude session, so the orchestrator had an Opus sub-agent run the hop in a throwaway checkout after the build. Two runs: the first had no todo tool, because Claude Code 2.1.323 enables it for this model only with `CLAUDE_CODE_ENABLE_TODO_TOOLS=1`. Both claims are confirmed: crons end with the session and the todo list does not carry |
| Build order | `tasks.md:100` says a `[B]` on T001 blocks every implementation task. The dispatch told this build to mark T001 `[B]` and build anyway, so it did. T002 was confirmed from the vendor documentation, not marked `[B]` |
| Cron claim source | Research section 5 marks it CONFIRMED from Claude's scheduled-tasks page only. T001 observes it live before any edit |
| Existing test contract | `claude-adapters.test.cjs:653` asserts an empty stdout on deferral. T005 replaces that assertion, which is a planned contract change, not a regression |
| T011 diff scope | `git diff --name-only` also listed `012-session-name-carry/goal.md`, which a concurrent builder owns. This build wrote only the adapter, the test file and this phase's `scratch/` |
| Producer inventory | `plan.md:83` says the same-class search printed the fixture line only. It also matched one prose sentence at `README.md:51`; no other code producer existed |
| Consumer inventory | `tasks.md:142` listed `claude-adapters.test.cjs` as importing `armPendingRecord`. It spawns the adapter by path; only `adapter-conformance.test.cjs` imports the function |
<!-- /ANCHOR:log -->
