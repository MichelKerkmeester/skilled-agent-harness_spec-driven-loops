---
title: "Goal: Phase 10: goal-ending-carry"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "goal ending carry goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/010-goal-ending-carry"
    last_updated_at: "2026-11-14T07:10:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the goal ending mark, its four tests and the checks run in worktree 373"
    next_safe_action: "None. Not merged or pushed, which parent decision D4 leaves to the operator"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "8d16c027-15a3-4944-a1d2-eef7cc2cb0b8"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: goal-ending-carry

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude goal that the operator ended, by meeting it, failing it or clearing it, stays ended across every later hop, so a receiver that sets no goal does not start on the packet goal again.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | `resolveGoalPacketResult` returns `{ packet, reason, ended }` on every path, and a Claude goal that is met, failed or cleared gives `ended: true`. |
| D2 | `recordGoalPacket` writes `goal_ended: true` to the note for an ended goal and removes the field otherwise. The field never sits beside a `goal_packet`. |
| D3 | A Claude session with no goal entry reads the mark from the note it claimed, found in the folder of the outgoing note. The mark outranks the packet goal fallback, also for a log read only in part. |
| D4 | No module, no environment variable and no relaunch record key is added, and `.skilled/bin/skilled-loop` is unchanged. `goal_ended` is a field of the handoff note's frontmatter, so parent decision D3 holds. |
| D5 | Each code change lands with a test that failed first, per parent D1. |
| D6 | This child amends the choice of sibling 002-packet-goal-fallback not to carry a goal's ending. The operator approved the amendment on 2026-11-14 as "Goal continuity". |
| D7 | Claude Code goals only. No adapter for another runtime changes. No live hop is run, and nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='goal has ended|stays ended for a receiver|mark of an ended goal|marks an ended Claude goal' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` prints `fail 4` before the source edit and `pass 4` after it.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [x] `git show --stat aee4ae8080` lists no file under `.skilled/bin` and `git show aee4ae8080 | rg -c '^new file'` prints nothing.
- [x] `rg -n 'goal_ended' .skilled/hooks/session-relaunch/README.md` prints a line in the Goal Packet section.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/010-goal-ending-carry --strict` prints `RESULT: PASSED`.
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
| Research finding | Done | 2026-11-13, `research/research.md` section 4, "002, the packet goal fallback", first bullet: "A cleared goal comes back: CONFIRMED." Section 9 rank 6 and section 10 decision 4 name the amendment |
| Operator approval | Done | 2026-11-14, through the question tool, work chosen "Wrapper notice + safety fixes (Recommended), Document fixes, Goal continuity", as the parent goal records |
| Test-first red | Done | `scratch/red.txt`: 4 tests, 0 pass, 4 fail |
| Tests after edit | Done | `scratch/green.txt`: 4 tests, 4 pass, 0 fail |
| Commit | Done | `aee4ae8080` on `worktrees/373-relaunch-gap-fixes`. Six files, no new file, 209 insertions and 35 deletions |
| Whole suites | Done | The commit message records 1547 of 1547, from 1543 before. Rerun by this author on 2026-11-14 at `eba587cae7`: exit 0, 1548 of 1548, which includes the next commit's test |
| Packet documents | Done | 2026-11-14: spec, plan, tasks, criteria, summary and goal written from the commit, the two scratch runs and the research. Every criterion Met |
| Validation | Done | 2026-11-14: `validate.sh ... --strict` printed `Errors: 0  Warnings: 0` and `RESULT: PASSED`, and `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` |
| Merge and push | Not done | Left to the operator by parent decision D4 |

### Deviations and findings

| Item | Note |
|------|------|
| Environment variable not used | The research sketched a wrapper environment variable. The build reads the ending from the note the session claimed instead, which keeps the wrapper and the relaunch record unchanged. It needs that claimed note to still sit beside the outgoing one |
| No live hop | The receiver staying without a goal two hops after a cleared goal rests on the unit and CLI tests. No child of the parent ran a live hop |
| Later commit on the same file | `eba587cae7` changes `relaunch-core.cjs` after this commit, so line numbers in these documents are the lines of `aee4ae8080` |
| Scoped diff | The worktree held a modified `.skilled/skills/sk-git/SKILL.md` that this packet did not touch |
<!-- /ANCHOR:log -->
