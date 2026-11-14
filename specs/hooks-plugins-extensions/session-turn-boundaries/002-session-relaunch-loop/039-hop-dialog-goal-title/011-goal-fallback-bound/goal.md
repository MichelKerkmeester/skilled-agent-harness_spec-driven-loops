---
title: "Goal: Phase 11: goal-fallback-bound"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "goal fallback bound goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/011-goal-fallback-bound"
    last_updated_at: "2026-11-14T07:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the bounded goal fallback, its test and the checks run in worktree 373"
    next_safe_action: "None. Not merged or pushed, per the parent decision that nothing lands without the operator"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-goal-fallback-bound"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 11: goal-fallback-bound

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude receiver whose sender set no goal is started on an unfinished packet goal only when that goal sits in the note's spec folder or in its parent, so it is never started on the goal of work the sender never touched.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The no-goal-entry fallback takes `lineage.slice(0, 2)`, the note's folder and its parent. The parent stays because a leaf phase binds through its parent. |
| D2 | The active-goal path is unchanged. It still takes the whole lineage and the packets the goal text names, because there the goal's opening line must match the packet's `goal.md`. |
| D3 | No module, no relaunch record key and no new relation check is added. The change is the length of the candidate list. |
| D4 | The code change lands with a test that failed first, per parent D1. |
| D5 | Claude Code only. No Pi, OpenCode, Codex, Cursor or Devin adapter changes. |
| D6 | No live hop is run in this phase. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `scratch/red.txt` shows `tests 2`, `pass 1` and `fail 1` before the source edit.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='looks no further up|nearest unfinished packet goal' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `pass 2` and `fail 0`.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with 1548 of 1548 and `fail 0`.
- [x] `git show --stat eba587cae7` lists three files and `git show eba587cae7 | rg -c '^new file'` prints nothing.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/011-goal-fallback-bound --strict` prints `RESULT: PASSED`.
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
| Research finding | Done | 2026-11-13, `research/research.md` section 4 under "002, the packet goal fallback", the bullet "A stale ancestor can be picked: CONFIRMED", and section 9 rank 7 |
| Operator approval | Done | 2026-11-14, through the question tool: work "Wrapper notice + safety fixes (Recommended), Document fixes, Goal continuity". Section 10 decision 4 of the research asked whether a goal's ending is carried, and "Goal continuity" amends the choice recorded in the packet's phase 2 |
| Test-first red | Done | `scratch/red.txt`: 2 tests, 1 pass, 1 fail. The new test failed with `the only open goal is two levels up` and `specs/hooks/023-session-relaunch-loop` where an empty string was expected |
| Test after edit | Done | `scratch/green.txt`: 2 of 2, `fail 0` |
| Whole suites | Done | The commit message of `eba587cae7` and the parent goal log record the relaunch and OpenCode plugin run at 1548 of 1548 from 1547 before. The output is not saved in this packet. On 2026-11-14 the same suite with nothing else running passed 1548 of 1548, exit 0, on the merged tree `be56fabc7b`, and 1550 of 1550, exit 0, after children 012 and 013. The earlier 3 failures came from several agents running the suite at the same time |
| Commit | Done | `eba587cae7` on `worktrees/373-relaunch-gap-fixes`. Three files, 30 insertions and 2 deletions, no new file |
| Packet documents | Done | 2026-11-14: spec, plan, tasks, criteria, summary and goal written from the diff and the saved evidence. Every criterion Met |
| Validation | Done | 2026-11-14: `validate.sh` on this folder with `--strict` printed `Errors: 0  Warnings: 0` and `RESULT: PASSED`, and `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` |
| Merge and push | Not done | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| Amends an earlier choice | Phase 2 chose to start a no-goal sender on the nearest unfinished goal in the whole lineage. This phase and phase 10 amend it, with the operator's approval of "Goal continuity" on 2026-11-14 |
| Whole run not saved here | On 2026-11-14 the same suite with nothing else running passed 1548 of 1548, exit 0, on the merged tree `be56fabc7b`, and 1550 of 1550, exit 0, after children 012 and 013. The earlier 3 failures came from several agents running the suite at the same time, and none of them touched `relaunch-core.test.cjs`. The output is not saved in this packet |
| No live hop | A receiver started on no goal from a deep folder rests on the unit test |
| Depth of the bound | Two levels is the operator-approved trade. A phase tree deeper than a leaf and its parent would need its own case and its own decision |
<!-- /ANCHOR:log -->
