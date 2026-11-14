---
title: "Implementation Summary"
description: "A running skilled-loop wrapper now tells you, before a hop, when its own file changed after the loop started, so you know to restart it instead of hopping on old code."
trigger_phrases:
  - "wrapper change notice implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/004-wrapper-change-notice"
    last_updated_at: "2026-11-14T06:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the wrapper change notice, its tests and the checks run in worktree 373"
    next_safe_action: "None. The code is committed and the operator decides the merge"
    blockers: []
    key_files: [".skilled/bin/skilled-loop", ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs", ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-wrapper-change-notice"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does a live hop from a wrapper edited mid-loop print the note on the operator's terminal? Not run."
    answered_questions:
      - "Did a running wrapper have any check of its own file? No, the pre-change file holds no checksum text."
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
| **Spec Folder** | 004-wrapper-change-notice |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A running `skilled-loop` wrapper now tells you when its file changed after the loop started. Before a hop it prints `note: skilled-loop changed on disk after this loop started, restart the wrapper to run the new code` on stderr, and the hop still goes ahead.

### Phase 4: wrapper-change-notice

A wrapper keeps the code it read when it started. A fix to `.skilled/bin/skilled-loop` therefore reached no hop of a loop that was already running, and nothing said so. The research of 2026-11-13 found four wrappers on one machine that predated the name carry the wrapper gained that day.

The wrapper now takes a checksum of its own file with `wrapper_checksum` before the loop and keeps it in `started_wrapper_checksum`. At the end of the hop branch it takes the checksum again and prints the note when the two differ. The function prints nothing when the file cannot be read, as it can be for a moment while a checkout replaces it, so a failed read never stops the wrapper. The hop launches on the code the loop started with. To pick the change up you exit the session and start the runtime again, which the README now says.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | `wrapper_checksum`, `started_wrapper_checksum` and the stderr line in the hop branch |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` | Modified | The stub appends to the wrapper copy when `WRAPPER_APPEND_ON_INVOCATION` and `WRAPPER_APPEND_PATH` are set |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modified | Adds the changed-file test and the unchanged-file test |
| `.skilled/hooks/session-relaunch/README.md` | Modified | One paragraph on the note and the restart |
| `scratch/red.txt` | Created | The two new tests before the source edit, 1 pass and 1 fail |
| `scratch/green.txt` | Created | The two new tests after the edit, 2 of 2 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The gap came from the research of 2026-11-13, where the running wrappers predating the fix are an OBSERVED finding with an INFERRED cause. The operator chose "Wrapper notice + safety fixes (Recommended)" on 2026-11-14. The research recommended a notice and not a re-execution of the wrapper.

The two tests were written before the source edit. `scratch/red.txt` shows 2 tests with 1 pass and 1 fail. The changed-file test failed with `0 !== 1`, zero notice lines where one was expected. The unchanged-file test passed, because it guards behaviour that already held. After the edit `scratch/green.txt` shows 2 of 2.

The code is committed as `89e246760e` on branch `worktrees/373-relaunch-gap-fixes`. Its message records the relaunch and OpenCode plugin suites at 1538 of 1538, from 1536 before. This author reran the same command at the branch head on 2026-11-14 and it exited 0 with 1548 of 1548, the extra tests coming from commits made after this one. Nothing was merged or pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A notice and not a re-execution | The loop's state lives in shell variables that are not exported, and start-up unsets `SKILLED_LOOP_NAME` and re-parses the arguments. A re-execution would have to carry that state, and a file caught mid-checkout could end every running loop at its next hop. The notice puts no loop at risk |
| The hop goes ahead on the old code | A notice that stopped the hop would trade a stale loop for a dead one. The operator decides when to restart |
| Print on every hop that differs | The start checksum is never refreshed, so the note repeats until the wrapper restarts. The operator may miss the first line |
| Swallow a failed checksum read | A file replaced mid-checkout must not stop the wrapper. The cost is an empty checksum, which at worst gives a false note at that hop |
| Test through the sandboxed wrapper copy | The wrapper is a script with no unit seam. The harness appends to a copy while the stub runs, so the real file is never touched |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New tests before the edit (`scratch/red.txt`) | 2 tests, 1 pass, 1 fail on the changed-file test |
| New tests after the edit (`scratch/green.txt`) | 2 of 2, `fail 0` |
| Relaunch and OpenCode plugin suites | Commit message: 1538 of 1538. Rerun at the branch head by this author: exit 0, 1548 of 1548 |
| `bash -n` on the wrapper, `node --check` on the harness and the wrapper test file | Exit 0 for each |
| No new file, no hook source touched | `git show --stat 89e246760e` lists four files, no new file |
| Strict validation | Recorded in `goal.md` section 4 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live hop was run for this child.** The note on a real terminal rests on the stubbed wrapper test. A live loop edited mid-run, then hopped once, would confirm that the operator sees the line and that the hop still launches.
2. **The inferred cause is not confirmed here.** The research inferred that each wrapper runs the loop body it parsed at start. This child makes a stale loop visible and does not test that inference. One restarted wrapper and one hop confirm it.
3. **The note repeats on every later hop.** The start checksum is never refreshed, so a changed loop prints the line before each hop until it is restarted. Inferred from the code and not run over several hops.
4. **A failed read has no test.** `wrapper_checksum` ends in `|| true` so an unreadable file gives an empty checksum. No test forces the read to fail, and an empty read at a hop would print a false note.
5. **The notice does not restart anything.** You restart the wrapper by exiting the session and starting the runtime again, as the README says.
6. **The 1538 count was not reproduced.** It comes from the commit message. The branch head runs more tests and passes all of them.
<!-- /ANCHOR:limitations -->

---
