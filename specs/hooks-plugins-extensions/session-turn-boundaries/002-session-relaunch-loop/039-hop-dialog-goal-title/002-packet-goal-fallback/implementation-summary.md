---
title: "Implementation Summary"
description: "A Claude sender that never set a goal now hands on the unfinished goal of its note's packet, so the receiver starts on /goal without the operator typing it."
trigger_phrases:
  - "packet goal fallback implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/002-packet-goal-fallback"
    last_updated_at: "2026-11-13T19:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the packet goal fallback, its tests and the checks run in worktree 366"
    next_safe_action: "Operator decides on merge and push of worktree 366"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs", ".skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-packet-goal-fallback"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does a live Claude receiver start on /goal from a fallback packet? Not run live."
    answered_questions:
      - "Which goal does a sender with no goal hand on? The note's packet goal, the nearest unfinished one in the lineage."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-packet-goal-fallback |
| **Completed** | 2026-11-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Claude sender that never set a goal now hands on the goal of the packet its note names. The receiver starts on `/goal <slice>` and the operator no longer types the goal again after each hop.

### Phase 2: packet-goal-fallback

Claude Code lets no hook set a goal. The loop can only start the receiver on the `/goal` command, and `skilled-loop` already does that when the note carries `goal_packet`. Before this change `prepare` wrote that field only when the sender's session log held an active goal. A sender with no goal entry handed on nothing.

Now, when the Claude log is readable, was read whole and holds no goal entry, `prepare` names the nearest packet in `packetLineage(specFolder)` whose `goal.md` passes `goalPacketProblem`, has `budgetState` `ok` from `readPacketGoal` and still has an unticked `- [ ]` line in its durable slice. A goal the sender set still wins. Met, failed and cleared goals stay uncarried. A log not read whole stays uncarried. A finished `goal.md` is skipped. A leaf phase goal has budget `unknown` and gives way to its parent.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | Adds `OPEN_CRITERION_PATTERN`, `packetGoalIsSettable` and the `whole` flag from `latestGoalLogEntry`, and carries the packet goal when no goal entry exists |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | Adds the fallback test and the ended or unreadable test |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | Adds a `prepare` test that writes `goal_packet` and removes it once the goal is finished |
| `.skilled/hooks/session-relaunch/README.md` | Modified | States the fallback in the Claude row and the troubleshooting list |
| `scratch/red.txt` | Created | The resolver tests before the source edit, 11 pass and 1 fail |
| `scratch/green.txt` | Created | The resolver test file after the edit, 159 of 159 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The tests came first. `scratch/red.txt` shows 12 resolver tests with 11 pass and 1 fail, the failing one being the fallback test. The ended or unreadable test passed before the edit too, because the old code already carried nothing in those cases. `scratch/green.txt` shows 159 of 159 after the edit.

A read-only review of the plan ran before the code was committed. The operator asked for Fable 5.2 at medium effort through the second Claude account, with no implementing and no sub-agents. It reported three findings, and the orchestrator checked each in the code. First, the goal log is per session, so a goal met or cleared in session 1 leaves session 2 with no goal entry, and the plain rule would start session 3 on the ended goal. Second, `latestGoalLogEntry` returned null both for a whole log with no entry and for a log cut at the 16 MB tail cap. Third, the fallback drops the headline proof, so a stale parent `goal.md` could be picked. Finding 2 is closed by the `whole` flag. Findings 1 and 3 are narrowed, not closed, by skipping finished goal docs.

The orchestrator ran the suites in worktree 366 at the final state. The relaunch and OpenCode plugin suites ran 1536 of 1536 with exit 0. The goal hook suites ran 200 of 200 with exit 0. The Pi adapter suite ran 62 of 62. Removing `if (!whole) return none;` made the case `a log read only in part` fail. This author reran the resolver test file and the new CLI test on 2026-11-13, both with exit 0.

The code is committed on branch `worktrees/366-hop-after-question-dialog` as `c461b79a71`. It is not merged and not pushed. These documents are committed on the same branch. That commit left the comment on where Claude session logs sit above `packetGoalIsSettable`, one function too early. Commit `085449ab6a` put it back above `claudeSessionLogPath` and changes no behaviour.

The operator's answers on 2026-11-13, given through the question tool: spec folder "C) Related: children 019 and 020 (Recommended)". Goal rule "The note's packet goal (Recommended)". Workspace "Same worktree 366 (Recommended)". After the review: "Skip finished goal docs (Recommended)". The spec folder answer was replaced later that day by "Move to new packet 039 (Recommended)", because the goal of packet 038 was at 3,996 of its 4,000 characters and could not bind more children. These documents moved from `038-goal-and-workflow-resume/019-packet-goal-fallback` to this folder before they were committed, and the `Spec:` line of the code commit was reworded to match.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Carry the note's packet goal | The note already names the packet the work is for, and the wrapper already turns `goal_packet` into `/goal` |
| Only when no goal entry exists | A goal the sender set says more about the session than a file does, and an ended goal must stay ended |
| Only when the log was read whole | A log cut at the tail cap cannot rule out a goal that ended earlier |
| Skip a finished `goal.md` | It narrows review findings 1 and 3. A goal with every criterion ticked has no work to start a session on |
| Require `budgetState` `ok` | A slice the wrapper cannot send would start nothing. A leaf phase goal has no budget, so its parent is used |
| Read open criteria in the durable slice only | An unticked box in the log section is a note, not a criterion |
| Not carrying the ending through the chain | It would close the cleared-goal gap but needs a new note field. The operator chose to skip finished goal docs |
| No new module and no record change | Parent decision D3 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Resolver tests before the edit (`scratch/red.txt`) | 12 tests, 11 pass, 1 fail on the fallback test |
| Resolver test file after the edit | 159 tests, 159 pass, `fail 0`, exit 0 on rerun |
| New CLI test | 1 test, 1 pass, exit 0 on rerun |
| Mutation of the whole-log guard | The case `a log read only in part` fails, reported by the orchestrator |
| Relaunch and OpenCode plugin suites | Exit 0, 1536 of 1536, run by the orchestrator |
| Goal hook suites | Exit 0, 200 of 200, run by the orchestrator |
| Pi adapter suite | 62 of 62, run by the orchestrator |
| `node --check` on the core | Exit 0 |
| No module added | `git show --summary --format= c461b79a71 \| rg 'create mode'` printed nothing |
| Strict validation | `RESULT: PASSED` with Errors 0 and Warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A goal cleared by hand can come back.** When the operator clears a goal while its criteria are still unticked, the next session has no goal entry, so the hop after it starts on that goal again. `SESSION_RELAUNCH_GOAL=0` or ticking the criteria stops it. Carrying the ending through the chain would close this and needs a new note field.
2. **No headline proof in the fallback.** A stale parent `goal.md` with an open criterion can still be picked. Only finished goal docs are skipped.
3. **Not run live.** No hop was run for this child. The receiver starting on `/goal` from a fallback packet is proven by unit and CLI tests only. The wrapper path from `goal_packet` to `/goal` is unchanged code, live-proven in earlier phases 028 and 038/016.
4. **Claude only.** Pi, OpenCode, Devin and Cursor read goal records and are unchanged. Codex carries no packet.
5. **The CLI test has no saved red run.** Only the resolver tests were run before the edit. The CLI test's own failure before the edit is not shown.
<!-- /ANCHOR:limitations -->

---
