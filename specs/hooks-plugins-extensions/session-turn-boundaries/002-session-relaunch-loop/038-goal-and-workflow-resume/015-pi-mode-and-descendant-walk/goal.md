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
    last_updated_at: "2026-11-13T12:20:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built the Pi mode carry and recorded the descendant walk decline"
    next_safe_action: "None, the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-pi-mode-and-descendant-walk"
      parent_session_id: null
    completion_pct: 100
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

- [x] `rg -n '^rank 13: (build|decline)$' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/scratch/confirm-pi-mode.txt` prints 1 line.
- [x] `rg -n '^### ADR-002' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/decision-record.md` prints 1 line.
- [x] `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0 with no failed test.
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`.
- [x] `rg -c '\| Unmet \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk/acceptance-criteria.md` prints nothing.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/015-pi-mode-and-descendant-walk --strict` prints `RESULT: PASSED`.
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
| Operator greenlight | Done | 2026-11-13, verbatim: "Implement using deepseek v4.1 flash max cli opencode with opencode go provider, max parallel". Later the same day the operator moved the builds to `dsh` on the LLM Gateway route |
| T001 to T002 confirmation | Done | `scratch/confirm-pi-mode.txt`: pinned commit, lines 228 and 1379, 50 session files with a plan entry, and one Pi 1.5.2 launch with `--plan` that started in Plan mode. Verdict `rank 13: build` |
| Rank 13 build | Done | Five dsh briefs on DeepSeek V4.1 Flash, each test first: adapter, arm, consume, wrapper, and two adapter edge-case tests. Red runs in `scratch/red.txt`, green runs in `scratch/green.txt` |
| Rank 14 ADR-002 | Done | `decision-record.md` holds ADR-002. The running work check is unchanged: the only hunk in `bin/session-relaunch.cjs` is inside `consume` |
| Final gate | Done | On base commit `8b3868a028` plus this phase's edits: Vitest 62 of 62, exit 0. `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` 1524 of 1524, `fail 0`, exit 0, up from 1521. Strict validation `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Research open question 3 | Answered from source during planning. The plan-build extension writes `selectedMode` into a `pi-plan-build-state` custom entry (`.pi/git/github.com/janvitos/pi-plan-build/index.ts:228`, `plan-state.ts:6`), and a fresh session takes the mode from that entry, then from `--plan` or `--build` (`index.ts:1378-1379`). The Pi session store holds 185 plan and 1858 build entries. The launch flag on a receiver is still unconfirmed, so T002 stays. |
| Rank 13 label | `--approve` is a trust flag, not a mode (research section 5). This phase carries only Plan and Build. |
| Rank 14 citation | `bin/session-relaunch.cjs:270-310` in the research holds `shellChildOfRuntime` (270-283) and `refuseForShellChild` (285-312). The direct-child test is line 278. |
| Edge-case tests | Brief A wrote only the carried-mode test. AC-002 also names a branch with no entry and a throwing `getBranch`, so a fifth brief added those two tests. They passed at once, because the source already handled both |
| Brief D's grep edit | The builder wrote `consumed_field "model"` so that `rg -c 'consumed_field mode'` would print 1. The orchestrator restored the unquoted call: the pattern in CHK-FIX-003 matches `consumed_field model` too, and the check is recorded with the pattern `consumed_field mode\)` |
| CHK-FIX-002 | The arm keeps its loop over four keys, and the mode has its own line with the two-literal filter. The check as written expected the loop line to be gone |
| Mode flag as an option value | The wrapper drops every replayed `--plan` and `--build` element on a Pi hop that carries a mode. A launch that passed one of them as the value of another option would lose that value. No Pi option takes such a value today, and no test covers the shape |
| Type check | `npx tsc` resolves to a placeholder package in the worktree. The check ran with `./.pi/npm/node_modules/.bin/tsc -p tsconfig.pi.json --noEmit`, exit 0 |
<!-- /ANCHOR:log -->
