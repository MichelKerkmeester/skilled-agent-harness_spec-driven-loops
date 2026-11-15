---
title: "Feature Specification: Phase 10: goal-ending-carry"
description: "A Claude sender whose goal was met, failed or cleared hands over no goal. Its receiver sets none, so the receiver's own log reads like a session that never had one and its next hand-over fell back to the packet goal. The ending held for exactly one hop."
trigger_phrases:
  - "goal ending carry"
  - "phase 10 goal ending carry"
  - "ended claude goal comes back after a hop"
  - "goal_ended note field"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: goal-ending-carry

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/373-relaunch-gap-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 11 |
| **Predecessor** | 009-document-corrections |
| **Successor** | 011-goal-fallback-bound |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 010-goal-ending-carry --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Close the research gaps of the relaunch hop dialog, goal and title fixes specification.

**Scope Boundary**: `resolveGoalPacketResult`, `recordGoalPacket` and a new lookup `claimedNoteEndedGoal` in `lib/relaunch-core.cjs`, the two call sites in `bin/session-relaunch.cjs`, three test files and the Goal Packet section of the session-relaunch README. Claude Code goals only.

**Dependencies**:
- Sibling 002-packet-goal-fallback built the fallback this phase bounds. It chose to skip finished goal documents and not to carry a goal's ending. This phase amends that choice, and the operator approved the amendment on 2026-11-14 as "Goal continuity".
- `parseHandoff`, `readHandoffText`, `safeDirectory` and `updateFrontmatter` in `lib/relaunch-core.cjs` already read and write a note's frontmatter. They are reused unchanged.
- Parent decision D3 allows no new module and no new relaunch record key. The mark is a field of the handoff note's frontmatter, so it holds.

**Deliverables**:
- `resolveGoalPacketResult` returns `{ packet, reason, ended }` on every path and takes `handoffPath`.
- `recordGoalPacket` writes `goal_ended: true` to the note for an ended goal and removes the field otherwise.
- `claimedNoteEndedGoal` reads the mark from the note the session claimed.
- Four tests that failed first, and three existing assertions that gained `ended: false`.
- The README describes the field and the lookup.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A Claude sender whose goal was met, failed or cleared hands over no goal. Its receiver sets none, so the receiver's own log holds no goal entry and reads like a session that never had one. The receiver's next hand-over then fell back to the packet goal and started a session on the goal the operator had ended, so the ending held for exactly one hop.

The 2026-11-13 research confirmed this in code and named the gap: "The clear suppresses exactly one hop. A goal recorded as met or failed returns the same way when its `goal.md` still has an unticked box. The tests cover the clearing hop and not the hop after it." (`research/research.md`, section 4, "002, the packet goal fallback", first bullet.) Rank 6 of section 9 asked for a note field that `recordGoalPacket` writes and the fallback reads, and decision 4 of section 10 named it an amendment of sibling 002.

### Purpose
A Claude goal that the operator ended stays ended across every later hop until a session sets a new goal.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the worktree root. The four new tests were written first, so `scratch/red.txt` records them against the code of the parent of the fix commit. The block quotes the command and the lines of `scratch/red.txt` that name each failure.

```text
$ env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='goal has ended|stays ended for a receiver|mark of an ended goal|marks an ended Claude goal' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs
✖ resolveGoalPacketResult says when the Claude goal has ended (4.074166ms)
✖ a goal the sender ended stays ended for a receiver that sets none (5.26275ms)
✖ recordGoalPacket writes and removes the mark of an ended goal (1.836ms)
✖ prepare marks an ended Claude goal in the note and keeps it ended one hop later (231.484625ms)
ℹ tests 4
ℹ pass 0
ℹ fail 4

  + actual - expected
  + undefined
  - true            (a met goal: ended was not reported)

  actual:   { packet: 'specs/hooks/023-session-relaunch-loop', reason: '' }
  expected: { packet: 'specs/hooks/023-session-relaunch-loop', reason: '', ended: false }
                    (a receiver with no goal entry: the packet goal came back)

  actual:   { packet: undefined, ended: undefined }
  expected: { packet: undefined, ended: 'true' }
                    (prepare wrote no mark for a cleared goal)
```

Before the fix a Claude goal that ended returned `{ packet: '', reason: '' }` with no `ended` key, `recordGoalPacket` held no `goal_ended` handling and a receiver with no goal entry took the fallback to the packet goal. The same file holds the source of each line: `scratch/red.txt:2` to `scratch/red.txt:5` for the four failures, `scratch/red.txt:22` for the undefined `ended`, `scratch/red.txt:44` for the receiver case and `scratch/red.txt:105` for the `prepare` test. A search of the parent of the fix commit for `goal_ended` in `relaunch-core.cjs`, `session-relaunch.cjs` and the README printed nothing for each, with exit 1.

The block above is an excerpt. The assertion lines are copied from `scratch/red.txt` and the notes in brackets are this packet's reading of them.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Return `ended` from `resolveGoalPacketResult` on every path, true for a Claude goal that is met, failed or cleared.
- Write `goal_ended: true` to the note in `prepare` and `keep`, and remove the field otherwise.
- Look up the note the session claimed beside the outgoing note, and when it carries the mark carry no packet goal and report `ended: true`, also for a log read only in part.
- Describe the field and the lookup in the session-relaunch README.

### Out of Scope
- A wrapper environment variable - the research sketched one, and this build reads the note the session claimed instead.
- A new relaunch record key or a new module - parent decision D3 allows neither.
- Goals on OpenCode, Pi, Devin, Cursor and Codex - their goal records are read elsewhere, and parent decision D2 bars changing their adapters.
- Bounding the fallback to the note's folder and its parent - sibling 011-goal-fallback-bound owns that change.
- A live hop - the unit and CLI tests stand in for it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | `resolveGoalPacketResult` returns `ended` and takes `handoffPath`, `recordGoalPacket` writes the mark and `claimedNoteEndedGoal` reads it |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | The shared goal-recording helper passes `handoffPath` and `ended` |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Three new tests and `ended: false` on two existing assertions |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | One new test that runs `prepare` across two hops |
| `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | Modify | `ended: false` on one existing assertion |
| `.skilled/hooks/session-relaunch/README.md` | Modify | The Goal Packet section names `goal_ended` and the lookup |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `resolveGoalPacketResult` returns `{ packet, reason, ended }` on every path. A Claude goal that is met, failed or cleared gives `ended: true`, and an active goal or no goal at all gives `ended: false`. The test `resolveGoalPacketResult says when the Claude goal has ended` fails before the edit. |
| REQ-002 | `recordGoalPacket(filePath, packet, { ended })` writes `goal_ended: true` when `ended` is true and no packet is carried, and removes the field otherwise. The test `recordGoalPacket writes and removes the mark of an ended goal` fails before the edit. |
| REQ-003 | A Claude session with no goal entry reads the mark from the note it claimed, found in the folder of the outgoing note. When the mark is there the resolver carries no packet goal and reports `ended: true`, also for a log read only in part. The test `a goal the sender ended stays ended for a receiver that sets none` fails before the edit. |
| REQ-004 | `prepare` marks an ended Claude goal in the note and the next session's `prepare` writes the mark onward. The test `prepare marks an ended Claude goal in the note and keeps it ended one hop later` fails before the edit. |
| REQ-005 | No module, no environment variable, no relaunch record key and no wrapper change is added. `goal_ended` is a field of the handoff note's frontmatter. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | A goal set in a later session is carried as usual and takes the mark away, and a note another session claimed says nothing. The core test asserts both. |
| REQ-007 | The relaunch and OpenCode plugin suites pass at the final state. |
| REQ-008 | The session-relaunch README describes the `goal_ended` field and the lookup of the claimed note. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows 4 tests with 0 pass and 4 fail before the edit, and `scratch/green.txt` shows 4 tests with 4 pass after it.
- **SC-002**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with 1547 of 1547, from 1543 before the commit.
- **SC-003**: `git show --stat aee4ae8080` lists six files, none under `.skilled/bin`, and no new file.
- **SC-004**: `validate.sh 010-goal-ending-carry --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The claimed note still sits beside the outgoing note | Medium | `claimedNoteEndedGoal` scans the folder of the outgoing note. A receiver whose claimed note was moved or removed finds no mark and takes the packet goal fallback again. Recorded as a known limitation |
| Risk | A mark that outlives the operator's change of mind | Low | A goal set in a later session is carried as usual and `recordGoalPacket` removes the mark. The core test asserts the removal |
| Risk | A note that cannot be read or parsed while scanning | Low | The scan skips it and says nothing about a goal, by the `try` and `catch` in `claimedNoteEndedGoal` at `relaunch-core.cjs:632` of the fix commit |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A session with no goal entry reads each `.md` note in the outgoing note's folder once. Not measured.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The mark holds the word `true` and no path, so the field carries no value that a receiver could be led to open.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A failed write leaves the note as it was, because the call in `bin/session-relaunch.cjs` keeps its `try` and `catch`, so a hand-over never fails for want of a goal field.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a claimed note without the mark leaves the existing fallback unchanged, and the core test shows the packet goal returned with `ended: false`.
- Maximum input: a log of 17 entries of 1 MiB each is read only in part, and the mark in the claimed note still gives `ended: true` with no packet.
- Failure path: a note that cannot be read or parsed is skipped, and a note that another session claimed says nothing, so the fallback returns the parent packet as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Two source files, 86 lines changed in the core and 11 in the CLI, three test files and one README paragraph |
| Risk | 8/25 | A wrong mark would keep a live goal from reaching a receiver, and a missing mark brings an ended goal back |
| Research | 4/20 | The research named the gap, the field and the decision. The lookup of the claimed note is this build's own judgment |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a live Claude receiver stay without a goal two hops after a cleared goal? Not run. Decision: the unit and CLI tests stand in for it, and the Known Limitations in `implementation-summary.md` name what a live run would confirm.
- Does the lookup hold when a claimed note is moved out of the folder before the next hand-over? Not tested. The lookup scans the folder of the outgoing note only, so a moved note would not be found.
<!-- /ANCHOR:questions -->

---
