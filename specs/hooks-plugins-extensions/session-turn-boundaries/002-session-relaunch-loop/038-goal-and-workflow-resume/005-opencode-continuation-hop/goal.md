---
title: "Goal: Phase 5: opencode-continuation-hop"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "opencode continuation hop goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/005-opencode-continuation-hop"
    last_updated_at: "2026-11-12T22:42:05Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-opencode-continuation-hop"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: opencode-continuation-hop

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** After a prepared OpenCode hop, the goal continuation leaves the record alone, and a nested runtime started from the receiver does not inherit the hop's packet variable.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The continuation reads the relaunch record only when `SKILLED_LOOP_ID` is set. A record for this session with status `pending` or `armed` suppresses the continuation. |
| D2 | The packet variable is deleted after the one bind attempt at session start. No second bind path is added. |
| D3 | The relaunch record format and the relaunch plugin stay unchanged, and no module is added. Parent decision D3 freezes the format and the no-module rule, and this phase does not touch the plugin. |
| D4 | The review's fixes for a cleared Claude goal, the shared goal off switch and the resend reminder are not applied. Parent decision D4 rules them out. |
| D5 | Each behavior lands with a test that failed before it. The phase changes only the plugin and its lifecycle suite. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0 and its output names `a pending relaunch record suppresses the goal continuation` and `the hand-over packet variable is deleted after the one bind attempt`.
- [ ] `node --test .opencode/plugins/tests/opencode-goal-handover.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/005-opencode-continuation-hop --strict` prints `RESULT: PASSED` and every row of `acceptance-criteria.md` is `Met`.
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
| Review | Done | 2026-11-12: the verification kept N1 and N3 for this phase in `../scratch/verify-1.md`. |
| Finding brief | Done | `scratch/finding.md` names the three files and the pending-record case that must fail first. |
| Planning documents | Done | 2026-11-13: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` were filled. |
| Implementation | Pending | No code change yet. |

### Deviations and findings

| Item | Note |
|------|------|
| Planning only | No changed file was run. The measured block reads the current plugin. |
<!-- /ANCHOR:log -->
