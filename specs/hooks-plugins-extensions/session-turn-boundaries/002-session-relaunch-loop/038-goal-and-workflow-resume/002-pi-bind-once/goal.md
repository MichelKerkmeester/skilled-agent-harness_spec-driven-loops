---
title: "Goal: Phase 2: pi-bind-once"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "pi bind once goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/002-pi-bind-once"
    last_updated_at: "2026-11-13T03:55:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after the build, the review fixes and the final suite run"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: pi-bind-once

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** After a Pi receiver binds a hopped goal, no later session or nested runtime in that process binds it again.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The packet variable is cleared after the first hand-over attempt that has a session id. A later session or a nested runtime in the same process finds nothing to bind. |
| D2 | The existing per-session set stays. The variable clear is the only new guard, and no process-wide flag is added. |
| D3 | Only `goal-context.ts` and `goal-pi.test.mjs` change. The relaunch record, the goal core and every other runtime binder stay as they are, per parent D3. |
| D4 | The own goal and the cleared goal keep their precedence. The first attempt consumes the hop even when the session already has a goal. |
| D5 | The review's fixes for a cleared Claude goal, the shared goal off switch and the resend reminder stay out, per parent D4. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test --test-name-pattern 'a second session_start with a new id binds nothing' .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0.
- [x] `node --test .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0 with `fail 0`.
- [x] `rg -n 'SESSION_RELAUNCH_GOAL_PACKET' .skilled/hooks/goal/pi/goal-context.ts` prints only the clear line.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/002-pi-bind-once --strict` prints `RESULT: PASSED`.
- [x] Every row of `acceptance-criteria.md` is `Met`.
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
| Planning | Done | 2026-11-12: authored `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this goal from `scratch/finding.md`. |
| Baseline | Done | 2026-11-12: `node --test .skilled/hooks/goal/pi/goal-pi.test.mjs` printed 28 pass and 0 fail. |
| Validation | Done | 2026-11-12: the strict run printed `RESULT: PASSED` with 0 errors and 1 warning. The warning names the untouched `implementation-summary.md` tokens. |
| Strict-run metadata repair | Recorded | The Draft auto-repair normalized the seed pointers in `implementation-summary.md` and `graph-metadata.json`. No planning content was written in either file. |
| Build | Done | DeepSeek V4.1 Flash max built it through OpenCode, test first: `scratch/red.txt` shows 28 pass and 1 fail, the new case, and `scratch/green.txt` 29 of 29. |
| Suites | Done | The orchestrator reran every suite outside the builders' sandboxes from the final working tree: relaunch and OpenCode plugin suites 1471 of 1471, goal hook suites 200 of 200, Pi relaunch suite 59 of 59, each exit 0. |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | No implementation has run. |
<!-- /ANCHOR:log -->
