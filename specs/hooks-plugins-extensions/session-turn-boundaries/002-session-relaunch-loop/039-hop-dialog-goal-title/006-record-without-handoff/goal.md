---
title: "Goal: Phase 6: record-without-handoff"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "record without handoff goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/006-record-without-handoff"
    last_updated_at: "2026-11-14T06:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the no-handoff read fix, its tests and the checks run in worktree 373"
    next_safe_action: "None. Not merged or pushed, which the operator decides"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-record-without-handoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: record-without-handoff

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A relaunch record that parses but holds no handoff note is read as absent, so the question guard lets a dialog through and Stop arms no hop for it.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | `readRelaunchFile` returns null and logs `corrupt-relaunch-file` for a parsed record whose `handoff` is not a string. |
| D2 | A record whose `handoff` is an empty string is still read. `should-relaunch` declines it as `incomplete-record` and a wrapper test depends on that. |
| D3 | No module and no record key is added, and no adapter file is edited. The check sits in the shared reader. |
| D4 | Each code change lands with a test that failed first, per parent D1. |
| D5 | Fixtures that hand-wrote a record with no `handoff` are given one, so no test depends on the old read. |
| D6 | No live hop is run in this phase. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `scratch/red.txt` shows `tests 5`, `pass 2` and `fail 3` before the source edit.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='no handoff|names no note|handoff is an empty string' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `tests 5`, `pass 5` and `fail 0`.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [x] `git show --stat f4cf59b93f` lists seven files and `git show f4cf59b93f | grep -c '^new file'` prints 0.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/006-record-without-handoff --strict` prints `RESULT: PASSED`.
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
| Research | Done | 2026-11-13: `research/research.md` section 4, 001, third bullet, confirmed that a record with no `handoff` was read as pending, with the guard printing `undefined` and Stop able to arm a hop with no note. Section 9 rank 5 asked for the fix |
| Operator answers | Done | 2026-11-14, recorded in the parent goal log: spec folder "New children of 039", workspace "A) Create a git worktree (Recommended)" which is worktree 373, and amendment "8 children, docs batched (Recommended)" |
| Test-first red | Done | `scratch/red.txt`: 5 tests, 2 pass, 3 fail. The read, guard and Stop tests failed. The empty-string keep test and the `shouldRelaunch` test passed because they guard behavior that already held |
| Tests after edit | Done | `scratch/green.txt`: 5 of 5. Rerun 2026-11-14 by this author at the current tree: `tests 5`, `pass 5`, `fail 0` |
| Whole suites | Done | The fix commit message records 1543 of 1543, from 1539 before. This author ran the relaunch and OpenCode plugin suites at the current tree on 2026-11-14. The first run failed 3 tests and the rerun exited 0 with 1548 of 1548. The Pi adapter suite printed 62 of 62 with exit 0 |
| Commit | Done | `f4cf59b93f` on `worktrees/373-relaunch-gap-fixes`. Seven files, no new file |
| Packet documents | Done | 2026-11-14: spec, plan, tasks, criteria, summary and goal written from the commit, the saved runs and the research. Every criterion Met |
| Validation | Done | 2026-11-14: the first strict run printed 2 errors, stale generated metadata with a source fingerprint mismatch, and listed one unresolved evidence citation. `repair-derived.cjs --apply` re-derived `description.json` and `graph-metadata.json`, AC-003 got the full path of its cited file, and the rerun printed `Errors: 0  Warnings: 0` and `RESULT: PASSED`. `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` |
| Merge and push | Not done | The operator decides |

### Deviations and findings

| Item | Note |
|------|------|
| Empty string kept | The ask was to reject a record with no `handoff`. The build read "no handoff" as "no handoff field" and left an empty string readable. Rejecting it too would change the wrapper's `incomplete-record` decline |
| Two tests passed in red | Parent D1 asks for a test that fails first. Three of five did. The other two guard behavior that already held |
| No live hop | A real hop over a record with no note rests on the unit and hook tests. No live hop was run |
| Earlier suite run had 3 failures | The 3 failures came from several agents running the suite at the same time. On 2026-11-14 the same suite with nothing else running passed 1548 of 1548, exit 0, on the merged tree `be56fabc7b`, and 1550 of 1550, exit 0, after children 012 and 013. The failing tests were not the five new ones |
| Counts are not the commit's | 1548 is the count at the current tree, which holds later commits. 1543 is the commit message's figure and was not rerun on that tree |
| Generated metadata repaired | The brief said to leave `description.json` and `graph-metadata.json` alone, but strict validation fails on their stale derived fields once the documents change. `repair-derived.cjs --apply` rewrote only those two generated files |
| Suite outputs not saved | The suite and Pi runs were not saved in the packet |
<!-- /ANCHOR:log -->
