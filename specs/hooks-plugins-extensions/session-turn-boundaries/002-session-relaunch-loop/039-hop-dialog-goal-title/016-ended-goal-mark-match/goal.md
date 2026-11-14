---
title: "Goal: Phase 16: ended-goal-mark-match"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "ended goal mark match goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/016-ended-goal-mark-match"
    last_updated_at: "2026-11-14T16:20:00Z"
    last_updated_by: "code-agent"
    recent_action: "Built the claimed-last mark and the unreadable-log guard test first, every criterion Met"
    next_safe_action: "The orchestrator commits and runs T014 on the fix commit"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-ended-goal-mark-match"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does a Claude session id change on /clear? Not confirmed. The mark is still matched on the claiming session id."
    answered_questions:
      - "Does a marked older note end the goal of a session that later claimed an unmarked note? Yes, before the fix; the new test reproduced it."
      - "Does a missing or unreadable log drop the mark? Yes, before the fix; the second new test reproduced it."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 16: ended-goal-mark-match

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The ended-goal mark is read from the one note a Claude session claimed last, and a missing or unreadable session log keeps that mark, so a goal the operator ended stays ended and a later claim does not inherit an older note's ending.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The claimed-last note is the one with the greatest `claimed_at` among the notes this session claimed in the outgoing note's folder. A note without `claimed_at` counts as oldest. |
| D2 | No status filter. A second `prepare` after a `cancel` finds its claimed note `done`, and the mark must still count. |
| D3 | A missing or unreadable log returns `ended: true` when the claimed-last note carries the mark, and `none` otherwise. |
| D4 | Two findings, one child, because both change the same helper and its caller. Each lands with its own test that failed first, per parent D1, the reading the operator accepted for child 012. |
| D5 | No note field, no record key and no module, per parent D3. `supersedeClaimed` and `claimHandoff` stay as they are. |
| D6 | No live hop is run in this phase. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The red run saved in `scratch/red.txt` shows `tests 2`, `pass 0` and `fail 2` for the name pattern `ended-goal mark counts only|session log cannot be read` before the source edit. Observed 2026-11-14: `scratch/red.txt:3` and `:4` print `✖` for both new tests, `:5` `ℹ tests 2`, `:7` `ℹ pass 0`, `:8` `ℹ fail 2` and `:68` `exit=1`.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='ended-goal mark counts only|session log cannot be read|stays ended for a receiver that sets none|answers empty when no Claude log' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `pass 4` and `fail 0`. Observed: `scratch/green.txt:7`, `:9`, `:10` and `:15` print `ℹ tests 4`, `ℹ pass 4`, `ℹ fail 0` and `exit=0`.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and two more tests than the baseline saved in `scratch/baseline.txt`. Observed: `scratch/final-suite.txt:1567`, `:1569`, `:1570` and `:1575` print `ℹ tests 1553`, `ℹ pass 1553`, `ℹ fail 0` and `exit=0`, against the 1551 baseline at `scratch/baseline.txt:1563`.
- [x] `node --check .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` exits 0 and `rg -c 'claimed last' .skilled/hooks/session-relaunch/README.md` prints 1 or more. Observed on 2026-11-14: `node --check` exited 0 and the search printed 1 at `.skilled/hooks/session-relaunch/README.md:182`.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/016-ended-goal-mark-match --strict` prints `RESULT: PASSED`. Observed 2026-11-14: Errors 0, Warnings 0, `RESULT: PASSED`, exit 0, after `repair-derived.cjs --apply` rewrote the generated metadata.
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
| Review findings | Done | 2026-11-14. Alignment run A-1, lowered from P1 to P2 by its critic, with both independent reviews: the mark is read from any note the session claimed. Review FH, P2 and inferred: an unreadable log returns before the mark is read |
| Code read | Done | 2026-11-14 at `99d197475d`: the match at `relaunch-core.cjs:639` has no status test, the returns at `:658` and `:664` come before the check at `:673`, and `prepare` resolves the goal at `bin/session-relaunch.cjs:485` before it supersedes at `:603`. The output is quoted in `spec.md` Measured Behavior |
| Plan documents | Done | 2026-11-14: spec, plan, tasks, criteria and this goal written. `implementation-summary.md` is written after the build |
| Build | Done | 2026-11-14: T001 to T013 and T015 complete. Red `scratch/red.txt` tests 2, pass 0, fail 2, exit 1; green `scratch/green.txt` tests 4, pass 4, fail 0, exit 0; full suite `scratch/final-suite.txt` tests 1553, pass 1553, fail 0, exit 0, two above the 1551 baseline. T014 is deferred to the orchestrator against the fix commit |
| Merge and push | Pending | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| Deferral superseded | The parent goal log of 2026-11-14 put "a change to what the ended-goal mark matches on" under Later packet. The operator now asks to fix every P0, P1 and P2 finding, and that supersedes the deferral for the two findings here. The parent log records it |
| Session id limit kept | The limit child 014 recorded, that the mark is matched on the claiming session id, is unchanged. It waits on a check of `CLAUDE_CODE_SESSION_ID` before and after `/clear` |
| Unreadable log is inferred | Review FH marked the dropped mark as inferred. The second test is what reproduces it |
<!-- /ANCHOR:log -->
