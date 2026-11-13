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
    last_updated_at: "2026-11-12T22:42:02Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
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

- [ ] `node --test --test-name-pattern 'a second session_start with a new id binds nothing' .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0.
- [ ] `node --test .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0 with `fail 0`.
- [ ] `rg -n 'SESSION_RELAUNCH_GOAL_PACKET' .skilled/hooks/goal/pi/goal-context.ts` prints only the clear line.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/002-pi-bind-once --strict` prints `RESULT: PASSED`.
- [ ] Every row of `acceptance-criteria.md` is `Met`.
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

### Deviations and findings

| Item | Note |
|------|------|
| None yet | No implementation has run. |
<!-- /ANCHOR:log -->
