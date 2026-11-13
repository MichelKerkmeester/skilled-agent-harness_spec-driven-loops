---
title: "Goal: Phase 3: generated-title-carry"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "generated title carry goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/003-generated-title-carry"
    last_updated_at: "2026-11-13T19:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the generated title fallback, its tests and the checks run in worktree 366"
    next_safe_action: "None. Merged into main and pushed on 2026-11-13"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/context-usage.cjs", ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-generated-title-carry"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: generated-title-carry

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude receiver whose sender had only the title Claude generated starts with that title and its hop number, such as `<title> (2)`, instead of a new title.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | `readClaudeSettings` returns the last non-empty `aiTitle` as `generatedName`, present only when the log holds one. |
| D2 | `prepare` records `name` as the custom title, else `SKILLED_LOOP_NAME`, else the generated title. |
| D3 | No module and no record key is added. The record's `name` field carries the value and `.skilled/bin/skilled-loop` is unchanged. |
| D4 | Each code change lands with a test that failed first, per parent D1. |
| D5 | Claude Code only. Codex, Cursor, Devin, OpenCode and Pi are not changed. |
| D6 | No live hop is run in this phase. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `scratch/red.txt` shows `tests 3`, `pass 1` and `fail 2` before the source edit.
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`.
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [x] `git show --stat 7d6077678e` lists no file under `.skilled/bin` and `git show 7d6077678e | rg -c '^new file'` prints nothing.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/003-generated-title-carry --strict` prints `RESULT: PASSED`.
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
| Operator request | Done | 2026-11-13, verbatim: "Also after in session handover the session name is reset and manually generated in ckaude code and maybe other runtimes too inwant to orevent that somehow and makensure same new with new number at end or something is auto set so user knows what is was doing" |
| Operator answers | Done | 2026-11-13, through the question tool: spec folder "C) Related: children 019 and 020 (Recommended)" and workspace "Same worktree 366 (Recommended)". The spec folder answer was replaced by "Move to new packet 039 (Recommended)". The question stated the plan: fall back to Claude's generated title and reuse the existing numbering |
| Live observation | Done | Orchestrator read of `~/.claude/projects/`, not in the repository: sender `b8ee8a81-e316-4f1a-ba26-b9481c493496` with 55 `ai-title` entries and no `custom-title`, receiver `53e771b8-c072-45b2-b8e1-c6a16e34711f` launched with no `--name` and holding 39 `ai-title` entries of a new title |
| Plan review | Done | Fable 5.2 at medium effort through `claude2`, read-only. No defect for spaces in a title or for a title that changes between hops. One edge named and not confirmed |
| Test-first red | Done | `scratch/red.txt`: 3 tests, 1 pass, 2 fail. The ranking test passed because it guards a rank that already held |
| Tests after edit | Done | `scratch/green.txt`: 359 of 359. Rerun 2026-11-13 by this author: exit 0, 359 of 359 |
| Whole suites | Done | Orchestrator at the final state: relaunch and OpenCode plugin 1536 of 1536 with exit 0, goal 200 of 200 with exit 0, Pi 62 of 62. Rerun of the relaunch and OpenCode plugin suites by this author on 2026-11-13: exit 0, 1536 of 1536, in `scratch/suite.txt` |
| Commit | Done | `7d6077678e` on `worktrees/366-hop-after-question-dialog`. Six files, no new file |
| Packet documents | Done | 2026-11-13: spec, plan, tasks, criteria, summary and goal written from the diff and the saved evidence. Every criterion Met |
| Validation | Done | 2026-11-13: `repair-derived.cjs --apply` re-derived the graph metadata, then `validate.sh ... --strict` printed `Errors: 0  Warnings: 0` and `RESULT: PASSED`. A first pass flagged AC-006 as an advisory for lacking a file:line citation, so the suite was rerun into `scratch/suite.txt` and cited |
| Goal budget | Not applicable | `goal.cjs packet` prints `packet_durable_chars=2271` and `packet_budget=unknown`, as sibling 001 records for a phase child that is not itself a phase parent |
| Merge and push | Done | 2026-11-13: merged into main as `bc670ffc21` and pushed, on the operator's answers "Merge to main locally (Recommended)" and "Push after tests pass (Recommended)". The documents are committed on the same branch |

### Deviations and findings

| Item | Note |
|------|------|
| Ranking test passed in red | Parent D1 asks for a test that fails first. Two of three did. The third guards the existing rank and could not fail before the edit |
| Hop number edge | A generated title such as "Fix bug (2)" at hop 2 would lose " (2)" to `name_stem`. Inferred by the review, not reproduced |
| No live hop | The receiver showing `<title> (2)` rests on tests and the numbering phase 012 of packet 038 tested |
| Packet move | This child was written as `038-goal-and-workflow-resume/020-generated-title-carry` and moved here on the operator's answer "Move to new packet 039 (Recommended)". The `Spec:` line of the code commit was reworded to this folder, which changed its hash from `e80b78d029` to `7d6077678e` with the same tree |
| Suite outputs not saved | The 200 and 62 counts are the orchestrator's only. No baseline count before this child was recorded, so no delta is claimed |
<!-- /ANCHOR:log -->
