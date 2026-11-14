---
title: "Implementation Summary"
description: "A Claude goal you ended now stays ended across every later hop, because the hand-over note carries a goal_ended mark that a receiver with no goal of its own reads and passes on."
trigger_phrases:
  - "goal ending carry implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/010-goal-ending-carry"
    last_updated_at: "2026-11-14T07:10:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the goal ending mark, its four tests and the checks run in worktree 373"
    next_safe_action: "None. Not merged or pushed, which parent decision D4 leaves to the operator"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-goal-ending-carry"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does a live Claude receiver stay without a goal two hops after a cleared goal? Not run."
    answered_questions:
      - "Did a cleared or finished Claude goal come back one hop later? Yes, confirmed in code by the 2026-11-13 research and shown failing in scratch/red.txt."
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
| **Spec Folder** | 010-goal-ending-carry |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Claude goal you met, failed or cleared now stays ended. The note your session hands over says so, the next session passes that on, and nothing starts on the packet goal again until you set a new goal.

### Phase 10: goal-ending-carry

Before this change a Claude session whose goal had ended handed over no goal. Its receiver set none, so the receiver's own log held no goal entry and read like a session that never had one. The receiver's next hand-over then fell back to the unfinished goal of the packet and started a session on the goal you had ended. The ending held for exactly one hop.

`resolveGoalPacketResult` now returns `ended` beside the packet and the reason on every path, and a Claude goal that is met, failed or cleared sets it. `recordGoalPacket` writes `goal_ended: true` to the note for such a goal and removes the field otherwise. When a Claude session has no goal entry, `claimedNoteEndedGoal` scans the folder of the outgoing note for the note this session claimed. If that note carries the mark, the session carries no packet goal and writes the mark onward, also when its log was read only in part. A goal set in a later session is carried as usual and takes the mark away. This amends sibling 002-packet-goal-fallback, which chose not to carry a goal's ending, and the operator approved the amendment on 2026-11-14 as "Goal continuity".

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | The resolver returns `ended` and takes `handoffPath`, `recordGoalPacket` writes the mark and `claimedNoteEndedGoal` reads it |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | The shared goal-recording helper behind `prepare` and `keep` passes `handoffPath` and `ended` |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | Three new tests and `ended: false` on two existing assertions |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | One new test that runs `prepare` across two hops |
| `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | Modified | `ended: false` on one existing assertion |
| `.skilled/hooks/session-relaunch/README.md` | Modified | The Goal Packet section describes the field and the lookup in two places |
| `scratch/red.txt` | Created | The four new tests before the source edit, 0 pass and 4 fail |
| `scratch/green.txt` | Created | The same four tests after the edit, 4 pass |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The gap came from the 2026-11-13 research. Its section 4 reads "A cleared goal comes back: CONFIRMED", names that "the tests cover the clearing hop and not the hop after it", and its section 9 ranks the fix sixth. Its section 10 names the choice as an operator decision, because sibling 002-packet-goal-fallback had chosen not to carry an ending. The operator approved it on 2026-11-14 as "Goal continuity".

The four tests were written before the source edit. `scratch/red.txt` shows 4 tests with 0 pass and 4 fail, and each failure names what was missing: an `ended` key, the packet goal returned for a silent receiver, no `goal_ended` field and a `prepare` note without the mark. After the edit `scratch/green.txt` shows 4 of 4. The relaunch and OpenCode plugin suites then ran on the tree of the commit, and its message records 1547 of 1547 from 1543 before.

The code is committed as `aee4ae8080` on branch `worktrees/373-relaunch-gap-fixes`. This author reran the two suites on 2026-11-14 on the working tree at `eba587cae7`, which also holds the next child's test: exit 0 with 1548 of 1548. Nothing is merged or pushed, because parent decision D4 leaves that to the operator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read the ending from the note the session claimed, not from a wrapper environment variable | The research sketched a variable. The note already travels with the hop and is a frontmatter field, so parent decision D3 holds and no wrapper change is needed. The cost is that the claimed note must still sit beside the outgoing one |
| Put the lookup before the check for a log read only in part | A log too large to read whole cannot rule a goal in or out, and the note still says the goal ended. The receiver test covers a log of 17 entries of 1 MiB each |
| Write the mark only when no packet is carried | A goal that is carried again is live, so a mark beside its packet would contradict it. `recordGoalPacket` removes the mark when a packet is written |
| Match the note by `claimed_by` and by the word `true` | Only the note this session claimed speaks for it, and a note another session claimed says nothing, as the receiver test asserts |
| Return `ended` on every path of the resolver | A caller never has to tell a missing key from a false one, and the resolver test asserts the key for a met, failed, cleared, active and absent goal |
| Leave the packet goal fallback itself unchanged here | Bounding it to the note's folder and its parent is the next child's change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New tests before the edit (`scratch/red.txt`) | 4 tests, 0 pass, 4 fail |
| New tests after the edit (`scratch/green.txt`) | 4 tests, 4 pass, 0 fail |
| Relaunch and OpenCode plugin suites at the commit | 1547 of 1547 from 1543 before, as the commit message records. Not rerun on that tree alone |
| The same suites on the working tree at `eba587cae7` | Exit 0, tests 1548, pass 1548, fail 0, run by this author on 2026-11-14 |
| `node --check` on the two changed sources | Exit 0 for each |
| No module, no record key, wrapper unchanged | `git show --stat aee4ae8080` lists six files, none under `.skilled/bin`, and no new file |
| Strict validation and the goal check | Recorded in `goal.md` section 4 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live hop was run for this child.** That the receiver stays without a goal two hops after a cleared goal rests on the unit tests and the two-hop `prepare` test, which writes the sender's log and the claimed note by hand. A live hop from a session whose goal was cleared, then a second hop from its receiver, would confirm it end to end.
2. **The lookup needs the claimed note beside the outgoing note.** `claimedNoteEndedGoal` scans the folder of the outgoing note only. A receiver whose claimed note was moved or removed finds no mark and takes the packet goal fallback again. No test covers a moved note.
3. **Claude Code goals only.** The other runtimes read their goal from a record the mark does not touch, and parent decision D2 bars changing their adapters.
4. **`keep` has no test of its own.** `prepare` and `keep` reach the same helper through `validatedNote`, and only `prepare` runs in the new CLI test.
5. **The cost of the folder scan is not measured.** A session with no goal entry reads each `.md` note in the outgoing note's folder once.
6. **The suite count at the commit alone was not rerun.** The 1547 figure is the commit message's. This author reran the suites at `eba587cae7`.
<!-- /ANCHOR:limitations -->

---
