---
title: "Goal: Phase 15: pi-mode-and-descendant-walk"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "pi mode and descendant walk goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk"
    last_updated_at: "2026-11-13T09:30:00Z"
    last_updated_by: "planner"
    recent_action: "Planned the Pi mode carry and the descendant walk decline"
    next_safe_action: "Wait for the operator greenlight, then run T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-pi-mode-and-descendant-walk"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 15: pi-mode-and-descendant-walk

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Pi receiver starts in the Plan or Build mode its sender was in, and the descendant walk in `prepare` is settled by a recorded decision with its evidence.

### Decisions

Frozen choices. Changing one is an amendment. The parent decisions bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | Nothing is built before the operator's greenlight. The standing words are "Dont implement untill i give greenlight". |
| D2 | Rank 13 is confirmed before any code edit. A failed check in T001 or T002 declines it as ADR-001 and waives AC-002 to AC-006. |
| D3 | The mode is read from the last `pi-plan-build-state` entry on the session branch, and only the literals `plan` and `build` are carried. |
| D4 | A Pi hop launch line holds at most one mode flag, and the consumed mode wins over the launch flag. |
| D5 | Rank 14 is declined as ADR-002, because the backgrounded worker it targets had parent pid 1 when `prepare` ran. The running work check in `bin/session-relaunch.cjs` lines 270-312 stays unchanged unless the operator asks for the walk. |
| D6 | The `Running workers:` note line stays in phase 009. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n '^rank 13: (build|decline)$' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/scratch/confirm-pi-mode.txt` prints 1 line.
- [ ] `rg -n '^### ADR-002' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md` prints 1 line.
- [ ] `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0 with no failed test.
- [ ] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`.
- [ ] `rg -c '\| Unmet \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/acceptance-criteria.md` prints nothing.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk --strict` prints `RESULT: PASSED`.
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
| Planning documents | Done | 2026-11-13: spec, plan, tasks, criteria and goal written from research sections 5, 9 and 12 and the live run in `../scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/` |
| Operator greenlight | Pending | Not given |
| T001 to T002 confirmation | Pending | No `scratch/confirm-pi-mode.txt` yet |
| Rank 13 build | Pending | No test or source change yet |
| Rank 14 ADR-002 | Pending | No `decision-record.md` yet |

### Deviations and findings

| Item | Note |
|------|------|
| Research open question 3 | Answered from source during planning. The plan-build extension writes `selectedMode` into a `pi-plan-build-state` custom entry (`.pi/git/github.com/janvitos/pi-plan-build/index.ts:228`, `plan-state.ts:6`), and a fresh session takes the mode from that entry, then from `--plan` or `--build` (`index.ts:1378-1379`). The Pi session store holds 185 plan and 1858 build entries. The launch flag on a receiver is still unconfirmed, so T002 stays. |
| Rank 13 label | `--approve` is a trust flag, not a mode (research section 5). This phase carries only Plan and Build. |
| Rank 14 citation | `bin/session-relaunch.cjs:270-310` in the research holds `shellChildOfRuntime` (270-283) and `refuseForShellChild` (285-312). The direct-child test is line 278. |
<!-- /ANCHOR:log -->
