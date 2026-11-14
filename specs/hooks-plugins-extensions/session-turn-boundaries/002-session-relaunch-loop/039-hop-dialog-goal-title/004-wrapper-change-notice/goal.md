---
title: "Goal: Phase 4: wrapper-change-notice"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "wrapper change notice goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/004-wrapper-change-notice"
    last_updated_at: "2026-11-14T06:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the wrapper change notice, its tests and the checks run in worktree 373"
    next_safe_action: "None. The code is committed and the operator decides the merge"
    blockers: []
    key_files: [".skilled/bin/skilled-loop", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-wrapper-change-notice"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: wrapper-change-notice

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A hop that runs on a wrapper whose file changed after the loop started says so on stderr and names the restart, so the operator is never left hopping on old code without knowing.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The wrapper takes a checksum of its own file before the loop and compares it at the end of the hop branch. A difference prints one stderr line that names the restart. |
| D2 | The hop still goes ahead on the code the loop started with. The notice never stops, delays or restarts a hop. |
| D3 | A notice and not a re-execution of the wrapper, as the operator chose on 2026-11-14. |
| D4 | No module and no relaunch record key is added. The change stays in the wrapper, its test harness, its tests and the README. |
| D5 | The code change lands with a test that failed first, per parent D1. |
| D6 | No live hop is run in this phase. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `scratch/red.txt` shows `tests 2`, `pass 1` and `fail 1` before the source edit.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='wrapper file' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `pass 2` and `fail 0`.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [x] `git show --stat 89e246760e` lists four files and `git show 89e246760e | rg -c '^new file'` prints nothing.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/004-wrapper-change-notice --strict` prints `RESULT: PASSED`.
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
| Research finding | Done | `../research/research.md` under "The running wrappers predate the fix": four `skilled-loop` processes started before the wrapper gained the name carry, cause INFERRED. Section 9 rank 2 and section 11 recommendation 2 ask for a notice and not a re-execution |
| Operator choice | Done | 2026-11-14, through the question tool: work chosen "Wrapper notice + safety fixes (Recommended)", recorded in the parent goal log |
| Test-first red | Done | `scratch/red.txt`: 2 tests, 1 pass, 1 fail. The changed-file test failed with `0 !== 1`. The unchanged-file test passed because it guards behaviour that already held |
| Tests after edit | Done | `scratch/green.txt`: 2 of 2 |
| Whole suites | Done | The commit message records 1538 of 1538 from 1536 before. This author reran the command at the branch head on 2026-11-14: exit 0, 1548 of 1548 |
| Commit | Done | `89e246760e` on `worktrees/373-relaunch-gap-fixes`. Four files, no new file |
| Packet documents | Done | 2026-11-14: spec, plan, tasks, criteria, summary and goal written from the diff and the saved evidence. Every criterion Met |
| Validation | Done | 2026-11-14: a first run failed on stale generated metadata, `repair-derived.cjs --apply` re-derived it, then `validate.sh ... --strict` printed `Errors: 0  Warnings: 0` and `RESULT: PASSED`. `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` |
| Merge and push | Not done | Left to the operator, per parent D4 |

### Deviations and findings

| Item | Note |
|------|------|
| Unchanged test passed in red | Parent D1 asks for a test that fails first. One of two did. The second guards the unchanged case and could not fail before the edit |
| No live hop | The note on a real terminal rests on the stubbed wrapper test. A live run was not made |
| Suite count differs from the commit message | The message says 1538 and the branch head ran 1548, because later commits added tests. The 1538 figure was not reproduced |
| Notice repeats | The start checksum is never refreshed, so every later hop of a changed loop prints the note again. Inferred from the code, not run over several hops |
<!-- /ANCHOR:log -->
