---
title: "Goal: Phase 7: goal-handover-docs"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "goal handover docs goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/007-goal-handover-docs"
    last_updated_at: "2026-11-12T22:42:08Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-goal-handover-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: goal-handover-docs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the two handover documents say what the relaunch and goal layers do now: the Claude claim arrives with the switch off, the example flags carry the goal switch, the goal-continuation race is named, and the phase-child goal difference is explained.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D5 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | Documentation only. The phase changes `README.md` and `hook-flags.env.example` and no source, test or command file. |
| D2 | Every statement names the test that pins it. When a sentence and a test disagree, the test wins and the sentence changes. |
| D3 | The parent's fourth decision rules out the cleared Claude goal, the shared goal off switch and the resend reminder, so no document promises them. |
| D4 | Phase 007 runs after 003 and 004 are Complete. It records what they shipped, never what this phase plans. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n 'only while the switch is on' .skilled/hooks/session-relaunch/README.md` prints no line and exits 1.
- [ ] `rg -n 'even while the Claude enable switch is off' .skilled/hooks/session-relaunch/README.md` prints 1 line.
- [ ] `rg -n 'SESSION_RELAUNCH_GOAL=0' .skilled/hooks/hook-flags.env.example` prints 1 line.
- [ ] `rg -n -e '^### Known Race: A Claude Goal Continuation During The Arm$' -e '^A phase child' .skilled/hooks/session-relaunch/README.md` prints 2 lines.
- [ ] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs .skilled/hooks/session-relaunch/tests/killer.test.cjs .skilled/hooks/goal/lib/goal-slice.test.cjs` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/007-goal-handover-docs --strict` prints `RESULT: PASSED`.
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
| Planning documents | Done | Five docs authored from the phase brief on 2026-11-13 |
| Document baseline | Done | 2026-11-13: the example file holds 0 goal switch rows, the README states the old switch rule once, and `phase child` and `known race` appear 0 times |
| Guard baseline | Done | 2026-11-13: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'compact-pointer' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` printed 14 pass and 0 fail, and the killer timeout test printed 1 pass and 0 fail |
| Implementation | Pending | No document change yet |

### Deviations and findings

| Item | Note |
|------|------|
| None | - |
<!-- /ANCHOR:log -->
