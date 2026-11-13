---
title: "Goal: Phase 1: sender-dialog-after-prepare"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "sender dialog after prepare goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare"
    last_updated_at: "2026-11-13T18:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the question dialog denial, its tests and the checks run in worktree 366"
    next_safe_action: "None. Merged into main and pushed on 2026-11-13"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/subagent-guard.mjs", ".skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-sender-dialog-after-prepare"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: sender-dialog-after-prepare

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude sender whose hand-over is pending cannot open a question dialog, so its turn ends and the Stop hook can arm the hop.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The opening check reads the four failed runs saved by child 016 of packet 038. A dialog must follow `prepare` in each, with no `killer-signal` and no `relaunch` line, before any source edit. |
| D2 | The fix refuses the dialog. `subagent-guard.mjs` denies `AskUserQuestion` at PreToolUse only while this session's record is pending for the `claude` runtime. |
| D3 | The guard reuses `readRelaunchFile` and `armableRecord`. No module is added and the core does not change. |
| D4 | A record that cannot be read lets the dialog through. |
| D5 | Claude Code only. Pi, OpenCode and Codex are not changed. |
| D6 | No live run is made in this phase. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] In the phase folder, `rg -o 'ts=\S+ tool_use AskUserQuestion' scratch/failed-runs/*/extract-*.txt` prints four lines and `rg -c 'killer-signal| relaunch ' scratch/failed-runs/*/relaunch-log.txt` prints nothing.
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with `fail 0`, and `scratch/red.txt` shows `fail 1` before the edit.
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [x] `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` prints `PASS`.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/001-sender-dialog-after-prepare --strict` prints `RESULT: PASSED`.
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
| Operator answers | Done | 2026-11-13, through the question tool: "Fix the dialog-after-prepare hop". Spec folder "C) Related: new child 018 (Recommended)". Workspace "A) Create a git worktree (Recommended)", worktree 366 on branch `worktrees/366-hop-after-question-dialog`. Design "Refuse the dialog (Recommended)", after a first answer of "Reproduce live first" that the saved evidence superseded. Builder "This session (Recommended)". The spec folder answer was replaced by "Move to new packet 039 (Recommended)" |
| Opening check | Done | Four of four saved runs: `prepare exit=0`, then `tool_use AskUserQuestion` 5.1 s to 42.6 s later, and a `relaunch-log.txt` of two lines ending at `prepare ... status=pending` |
| Baseline | Done | The orchestrator reported 1524 of 1524 in the relaunch and OpenCode plugin suites before the six new tests |
| Test-first red | Done | `scratch/red.txt`: 20 tests, 19 pass, 1 fail on `subagent-guard denies a question dialog while the session hand-over is pending` |
| Tests after edit | Done | `scratch/green.txt`: 20 of 20. Rerun 2026-11-13: 20 of 20 |
| Whole suite | Done | Rerun 2026-11-13 in worktree 366: exit 0, tests 1530, pass 1530, fail 0 |
| Sync checks | Done | `sync-hook-registrations.cjs --check`: `PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.` `sync-runtime-mirrors.cjs --check`: `PASS: 256 mirrors across 10 trees are in sync.` |
| Packet documents | Done | 2026-11-13: spec, plan, tasks, criteria, summary and goal written from the diff and the saved evidence. Every criterion Met |
| Validation | Done | 2026-11-13: `repair-derived.cjs --apply` re-derived the graph metadata, then `validate.sh ... --strict` printed `Errors: 0  Warnings: 0` and `RESULT: PASSED` |
| Goal budget | Not applicable | `goal.cjs packet` prints `packet_durable_chars=2385` and `packet_budget=unknown`. The cap skips a phase child that is not itself a phase parent (`.skilled/hooks/goal/lib/goal-slice.cjs:424`). Children 014 and 016 of packet 038 print `unknown` too |
| Commit | Done | `9d0c5368d1` on `worktrees/366-hop-after-question-dialog`, with these documents committed on the same branch |
| Merge and push | Done | 2026-11-13: merged into main as `bc670ffc21` and pushed, on the operator's answers "Merge to main locally (Recommended)" and "Push after tests pass (Recommended)" |

### Deviations and findings

| Item | Note |
|------|------|
| Harness ran prepare | In the four failed runs the harness, not the sender, ran `prepare`. The sender never saw "stop now and end this turn". A sender that runs `prepare` itself and then asks has not been observed live |
| Contrast run | `../../038-goal-and-workflow-resume/016-receiver-claim-under-goal/scratch/live-open/9/` shows a Stop (`goal_status` at `2026-11-13T12:42:59.451Z`) after `prepare` at `12:42:53Z` and `handed-over` at `12:43:03.935Z`. It keeps no `relaunch.log`, so its `killer-signal` line cannot be quoted from saved files |
| Pane captures | Each failed run's `pane-sender.txt` ends at a reply and `Goal not yet met… continuing`, with no dialog on screen and no capture time. The extracts are the evidence used |
| Packet move | This child was written as `038-goal-and-workflow-resume/018-sender-dialog-after-prepare` and moved here on the operator's answer "Move to new packet 039 (Recommended)". The `Spec:` line of the code commit was reworded to this folder, which changed its hash from `39bff1ce3d` to `9d0c5368d1` with the same tree |
| D6 amendment | D6 first said nothing is committed without the operator. The orchestrator committed the code on the worktree branch, so D6 now covers merge and push only |
| Pending record that Stop cannot arm | The guard refuses every question while the record is pending. When Stop does not arm it, the refusals last until `cancel --loop-id` clears the record. Raised by the read-only review of 2026-11-13 and confirmed in the guard's code |
| Other turn-holding dialogs | The binding matches `AskUserQuestion` only. A plan approval or a permission prompt after `prepare` is not covered. Inferred from the matcher, not tried |
| No fail-open test | The throwing-read path is confirmed by reading the code only |
<!-- /ANCHOR:log -->
