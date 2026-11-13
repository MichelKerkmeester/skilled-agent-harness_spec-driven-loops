---
title: "Goal: Phase 8: review-advisories"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review advisories goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/008-review-advisories"
    last_updated_at: "2026-11-13T05:44:01Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after four builds and the final suite run"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-review-advisories"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: review-advisories

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close the nine P2 advisories of the 2026-11-13 deep review with one failing test before each fix, while the relaunch record format stays the same and the named guard tests keep their assertions.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D5 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | Four work packages run in the order A, B, C and D. No two packages share a file. |
| D2 | Test first. Each of the seven must-fail tests holds a recorded failing run before its source edit. |
| D3 | The start claim names the literal `SessionStart` from the caller. `payloadEventName` and the compaction emit stay unchanged. |
| D4 | The nudge reads an invalid hop count as the limit reached only when the value is set and not empty. `bin/session-relaunch.cjs` and its parser stay unchanged. |
| D5 | The OpenCode record path stays built in two places. A contract test pins the plugin path to the core reader, and no source change is planned. |
| D6 | The parent's fourth decision keeps the cleared Claude goal, the shared goal off switch and the resend reminder out of this phase. |
| D7 | Local commits on the worktree branch only. Nothing is pushed or merged without the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/nudge.test.cjs .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0 with `fail 0`.
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [x] `rg -c '\| Met \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/008-review-advisories/acceptance-criteria.md` prints 10.
- [x] `rg -n 'at startup for the claim of a hop whose start prompt is the goal command' .skilled/hooks/session-relaunch/README.md` prints 1 line on line 19.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/008-review-advisories --strict` prints `RESULT: PASSED`.
- [x] `git diff --name-only -- .skilled/hooks/session-relaunch .opencode/plugins` lists only the nine files named in `spec.md`.
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
| Planning documents | Done | Five documents authored from `scratch/finding.md` on 2026-11-13 |
| Baseline | Pending | The four test files have not been run for this phase |
| WP-A | Pending | No test or source change yet |
| WP-B | Pending | No test or source change yet |
| WP-C | Pending | No test or source change yet |
| WP-D | Pending | No test or source change yet |
| Build | Done | DeepSeek V4.1 Flash max built work packages A to D through OpenCode, one dispatch each, test first. Red and green runs are in `scratch/`. |
| Suites | Done | The orchestrator reran every suite from the final working tree with the loop variables unset: relaunch and OpenCode plugin suites 1480 of 1480, goal hook suites 200 of 200, Pi relaunch suite 59 of 59, each exit 0. |

### Deviations and findings

| Item | Note |
|------|------|
| AC-007 wording | The criterion says the error still propagates. The plugin's event wrapper catches and logs event errors by design, so the test asserts the unset variable and the `event_error` log entry |
| Playbook suite count | The OpenCode goal playbook count went from 168 to 170. The file is outside the nine code files and a doc contract test checks it |
<!-- /ANCHOR:log -->
