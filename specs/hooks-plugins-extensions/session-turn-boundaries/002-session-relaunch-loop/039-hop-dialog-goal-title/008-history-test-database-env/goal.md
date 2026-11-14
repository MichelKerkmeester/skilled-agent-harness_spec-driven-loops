---
title: "Goal: Phase 8: history-test-database-env"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "history test database env goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/008-history-test-database-env"
    last_updated_at: "2026-11-14T06:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the test fix, the red and green runs and the checks run in worktree 373"
    next_safe_action: "None. Nothing is merged or pushed without the operator"
    blockers: []
    key_files: [".opencode/plugins/tests/session-history-lookup.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-history-test-database-env"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: history-test-database-env

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The history lookup plugin test that redeems an offer passes whatever `OPENCODE_DB` the shell holds, so the full relaunch and OpenCode plugin run no longer needs that variable unset.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The test drops `OPENCODE_DB` from the environment it hands the history reader, with a comment that says why. |
| D2 | No product code changes. The coupling is one test's inherited environment, so the reader keeps taking its database name from `OPENCODE_DB`. |
| D3 | The change lands with a run that failed first: `OPENCODE_DB=other-session.db` set, red before the edit and green after. |
| D4 | Only `.opencode/plugins/tests/session-history-lookup.test.cjs` changes. It is an OpenCode plugin test and not an adapter, so parent D2 allows it. |
| D5 | No live hop is run in this phase. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `scratch/red.txt` shows `tests 3`, `pass 2` and `fail 1` with `OPENCODE_DB=other-session.db` set and the test unedited.
- [x] `env -u AI_SESSION_CHILD OPENCODE_DB=other-session.db node --test .opencode/plugins/tests/session-history-lookup.test.cjs` exits 0 with `pass 3` and `fail 0`.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [x] `git show --stat 94af61c540` lists one file, `.opencode/plugins/tests/session-history-lookup.test.cjs`, and `git show 94af61c540 | rg -c '^new file'` prints nothing.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/008-history-test-database-env --strict` prints `RESULT: PASSED`.
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
| Research finding | Done | `research/research.md` section 5, row "009, 013": "The full suite needs `OPENCODE_DB` unset", CONFIRMED, "a test defect, not a relaunch defect". Section 9 rank 16 asks for the one-line unset in this test |
| Test-first red | Done | `scratch/red.txt:1` to `scratch/red.txt:8`: 3 tests, 2 pass, 1 fail. The failing test is `a compacted session started in a subfolder gets an offer that redeems`, with `{"ok":false,"code":"store_unreadable"}` at `scratch/red.txt:28` |
| Green after edit | Done | `scratch/green.txt:5` to `scratch/green.txt:8`: 3 tests, 3 pass, 0 fail, with the variable still set. Rerun by this author on 2026-11-14: exit 0, 3 of 3 |
| Whole suite | Done | The commit message records 1543 of 1543, unchanged. This author reran the same command on the current tree on 2026-11-14: exit 0, 1548 of 1548. The tree holds two later commits, and this author did not check whether they added the five extra tests. Neither run is saved under `scratch/` |
| Commit | Done | `94af61c540` on `worktrees/373-relaunch-gap-fixes`. One file, 4 insertions and 1 deletion, no new file |
| Packet documents | Done | 2026-11-14: spec, plan, tasks, criteria, summary and goal written from the diff and the saved runs. Every criterion Met |
| Validation | Done | 2026-11-14: `validate.sh ... --strict` and `check-goal.cjs` run on this folder. The results are in the closing report of this phase |
| Merge and push | Not done | Parent D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| Suite count differs from the commit message | The commit message says 1543 and the run on the merged tree says 1548. The 3 failures in an earlier run came from several agents running the suite at the same time. On 2026-11-14 the same suite with nothing else running passed 1548 of 1548, exit 0, on the merged tree `be56fabc7b`, and 1550 of 1550, exit 0, after children 012 and 013. Neither file in those failures is part of this change |
| No live hop | This is a test defect. No hop was needed and none was run |
<!-- /ANCHOR:log -->
