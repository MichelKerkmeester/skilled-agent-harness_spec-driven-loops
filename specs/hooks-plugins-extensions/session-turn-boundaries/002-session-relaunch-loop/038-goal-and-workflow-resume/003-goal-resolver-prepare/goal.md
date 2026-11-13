---
title: "Goal: Phase 3: goal-resolver-prepare"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "goal resolver prepare goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/003-goal-resolver-prepare"
    last_updated_at: "2026-11-12T22:42:03Z"
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
# Goal: Phase 3: goal-resolver-prepare

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prepare carries a sender's goal on Devin and Cursor, finds the one packet outside the lineage whose `goal.md` carries the headline, and states in one stderr line why a goal was not carried, without changing the record format or the stdout contract.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `resolveGoalPacket` keeps its string return. A sibling reports the reason, and only stderr carries it, because prepare stdout is pinned and the CLI path reads a string. |
| D2 | `SESSION_RELAUNCH_GOAL_PACKET` is read only for `devin` and `cursor`, only when no record matches, and only when `goalPacketProblem` accepts it. It stays off for `claude`, `codex`, `pi` and `opencode`. |
| D3 | The outside-lineage find walks `specs/` once, skips `scratch/`, `lineages/` and `z_archive/`, and takes a packet only when exactly one `goal.md` carries the headline. |
| D4 | Codex gets the stderr signal only. The `Active goal:` note prose in `nudge.cjs` belongs to phase 001. |
| D5 | Cursor and Devin prepare text names the manual route. The loop does not end their session, and the wrapper prints the claim command on its decline. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`.
- [ ] `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`.
- [ ] `node --test --test-name-pattern 'hand-over packet|goal reason|outside the packet lineage|manual route|prepared handoff and the stop instruction' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/003-goal-resolver-prepare --strict` prints `RESULT: PASSED`.
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
| Baseline | Done | 2026-11-12: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exited 0 with 304 tests and `fail 0`. |
| Resolver baseline | Done | 2026-11-12: `node --test --test-name-pattern 'resolveGoalPacket' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exited 0 with 10 tests and `fail 0`. |
| Validation | Done | 2026-11-12: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/003-goal-resolver-prepare --strict` printed `RESULT: PASSED` with 0 errors and 1 warning. |
| Strict-run metadata repair | Recorded | The Draft auto-repair re-derived `graph-metadata.json` and normalized the `implementation-summary.md` packet pointer. No planning content was written in either file. |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | No implementation has run. |
<!-- /ANCHOR:log -->
