---
title: "Goal: Phase 5: parked-record-escape"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "parked record escape goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/005-parked-record-escape"
    last_updated_at: "2026-11-14T07:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the parked-record stamp, its tests and the checks run in worktree 373"
    next_safe_action: "None. The code is committed and nothing is merged or pushed without the operator"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-parked-record-escape"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: parked-record-escape

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude Code session whose Stop cannot arm a prepared hand-over is not left parked: the pending record carries a stamp, so the operator's next prompt withdraws it and question dialogs work again without running `cancel`.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | Stop stamps `deferredAt` on the pending record when the event has no transcript path, when no kill target resolves and when the arm throws. One helper, `markParked`, owns every stamp Stop writes, the background-task deferral included. |
| D2 | The stamp is the existing `deferredAt` written by the existing `markDeferred`. No module and no record key is added. |
| D3 | Each code change lands with a test that failed first, per parent D1. |
| D4 | Claude Code only. No Codex, Pi, OpenCode, Cursor or Devin adapter is edited, so Codex Stop still leaves such a record unmarked. |
| D5 | No live hop is run in this phase. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `scratch/red.txt` shows `tests 3`, `pass 0` and `fail 3` before the source edit.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='marks the pending record deferred' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `pass 3` and `fail 0`.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [x] `git show --stat eaf24f999e` lists no Codex adapter file and `git show eaf24f999e | rg -c '^new file'` prints nothing.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/005-parked-record-escape --strict` prints `RESULT: PASSED`.
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
| Research finding | Done | `research/research.md` section 4 under "001, the question dialog after `prepare`" confirms that Stop leaves a record pending on three paths and that only the background-task deferral stamps it. Section 9 ranks the fix third |
| Test-first red | Done | `scratch/red.txt`: 3 tests, 0 pass, 3 fail, each on the `deferredAt` assertion |
| Tests after edit | Done | `scratch/green.txt`: 3 of 3. Rerun 2026-11-14 by this author: exit 0, 3 of 3 |
| Changed test files whole | Done | 2026-11-14 by this author on a tree that holds later commits: `claude-adapters.test.cjs` and `adapter-conformance.test.cjs`, exit 0, 115 of 115 |
| Whole suites | Done | Orchestrator on this commit's tree: relaunch and OpenCode plugin suites exit 0, 1539 of 1539, from 1538 before. Not rerun by this author, no output saved |
| Commit | Done | `eaf24f999e` on `worktrees/373-relaunch-gap-fixes`. Four files, no new file |
| Packet documents | Done | 2026-11-14: spec, plan, tasks, criteria, summary and goal written from the diff and the saved evidence. Every criterion Met |
| Validation | Done | 2026-11-14: a first strict run failed on stale generated metadata, so `repair-derived.cjs --apply` re-derived the graph metadata. Then `validate.sh ... --strict` printed `Errors: 0  Warnings: 0` and `RESULT: PASSED`, and `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` |
| Merge and push | Not done | The operator decides. Parent decision D4 |

### Deviations and findings

| Item | Note |
|------|------|
| Conformance case edited | The shared no-target case could not require the stamp, because Codex Stop does not stamp and parent D2 forbids editing the Codex adapter. `assertStillPending` sets the stamp aside and keeps the rest of the assertion |
| Codex unmarked | Codex Stop still leaves a pending record unmarked after this change. Recorded as a known limitation, not fixed |
| No live hop | The dialog coming back after one prompt rests on the three unit tests and on `withdraw.cjs` accepting a stamped pending record |
| Suite output not saved | The 1539 count is the orchestrator's only. No delta beyond the commit message's 1538 is claimed |
<!-- /ANCHOR:log -->
