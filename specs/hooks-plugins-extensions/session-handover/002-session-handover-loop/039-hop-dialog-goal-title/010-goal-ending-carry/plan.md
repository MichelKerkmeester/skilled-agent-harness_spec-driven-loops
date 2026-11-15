---
title: "Implementation Plan: Phase 10: goal-ending-carry"
description: "Report whether a Claude goal ended, write that as a goal_ended field in the handoff note, and let a receiver with no goal entry read the field from the note it claimed, test first, so an ended goal stays ended beyond one hop."
trigger_phrases:
  - "goal ending carry plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: goal-ending-carry

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, CommonJS in the relaunch core, the CLI and the tests |
| **Framework** | None, Node built-in modules |
| **Storage** | The handoff note's frontmatter, which gains one optional `goal_ended` field. No relaunch record key |
| **Testing** | `node:test` with `node:assert/strict` |

### Overview
`resolveGoalPacketResult` gains a third result key, `ended`, and a `handoffPath` option. `recordGoalPacket` writes `goal_ended: true` to the note for an ended goal and removes the field otherwise. `claimedNoteEndedGoal` lets a Claude session with no goal entry read the mark from the note it claimed. The proof is four tests that fail before the edit, the three assertions that gained `ended: false` and the whole relaunch and OpenCode plugin suite.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] `git show aee4ae8080^:.skilled/hooks/session-relaunch/lib/relaunch-core.cjs | rg -c 'goal_ended'` prints nothing, so no source read or wrote the mark before the fix

### Definition of Done
- [x] All acceptance criteria met
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`, recorded in the fix commit message as 1547 of 1547
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A mark in the note.

### Key Components
- **`resolveGoalPacketResult` and `claudeGoalPacketResult` in `lib/relaunch-core.cjs`**: return `ended` on every path, true for a Claude goal that is met, failed or cleared and true when the claimed note carries the mark. Without them `prepare` cannot tell an ended goal from a session that never had one.
- **`recordGoalPacket` in `lib/relaunch-core.cjs`**: writes `goal_ended: true` when `ended` is true and no packet is carried, and removes the field otherwise. Without it the ending never reaches the note.
- **`claimedNoteEndedGoal` in `lib/relaunch-core.cjs`**: scans the `.md` notes in the folder of the outgoing note for one whose `claimed_by` is this session and whose `goal_ended` is `true`. Without it a receiver's silent log hides the ending.
- **The goal-recording helper in `bin/session-relaunch.cjs`**: passes `handoffPath` to the resolver and `ended` to `recordGoalPacket`. Without it neither new value leaves the CLI.

### Data Flow
`prepare` and `keep` call the goal-recording helper, which calls `resolveGoalPacketResult` with the outgoing note's path. For a Claude sender the newest goal entry decides first. A goal that is met, failed or cleared gives `ended: true` with no packet. When the log holds no goal entry, `claimedNoteEndedGoal` looks at the note this session claimed, and a mark there gives `ended: true` and no packet goal even when the log was read only in part. Otherwise the existing fallback to the packet goal runs. The helper then calls `recordGoalPacket`, which writes `goal_ended: true` to the outgoing note or removes it. The receiver of that note sets no goal, claims the note and repeats the same steps one hop later.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `resolveGoalPacketResult` and `claudeGoalPacketResult` in `lib/relaunch-core.cjs` | Resolve the sender's goal packet and the reason a known goal was not carried | update | `git show aee4ae8080:.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` holds `ended` in the result objects at lines 648, 673, 680 and 910, and `scratch/green.txt:2` shows the resolver test passing |
| `recordGoalPacket` in `lib/relaunch-core.cjs` | Writes or removes the note's `goal_packet` field | update | the same file holds the write and the removal at lines 978 to 980, and `scratch/green.txt:4` shows the record test passing |
| `claimedNoteEndedGoal` in `lib/relaunch-core.cjs` | New lookup of the mark in the claimed note | create | the same file reads the mark at line 639, and `scratch/green.txt:3` shows the receiver test passing |
| The goal-recording helper in `bin/session-relaunch.cjs` | Calls the two core functions for `prepare` and `keep` | update | the same commit's `bin/session-relaunch.cjs` passes the `handoffPath` option at line 400 and `ended` at lines 405 and 407, and `scratch/green.txt:5` shows the CLI test passing |
| `resolveGoalPacket` and `resolveGoalPacketReason` in `lib/relaunch-core.cjs` | Return one field of the result | unchanged | they read `.packet` and `.reason`, at lines 941 and 951 of the fix commit |
| `.skilled/bin/skilled-loop` and the relaunch record | Carry the name and the loop state | unchanged | `git show --stat aee4ae8080` lists no file under `.skilled/bin` |
| `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | Asserts the resolver's exact result | update | the diff of the fix commit adds `ended: false` to one `deepEqual` |

Required inventories:
- Same-class producers: `rg -n 'goal_ended' .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/bin` at the fix commit prints lines 639, 956, 979 and 980 in `relaunch-core.cjs`. Line 956 is a comment. The CLI holds no `goal_ended` literal, because it passes `ended` through.
- Consumers of changed symbols: `rg -l 'resolveGoalPacketResult|recordGoalPacket'` over `.skilled` and `.opencode` lists `relaunch-core.cjs`, `session-relaunch.cjs`, `relaunch-core.test.cjs` and `opencode-goal-lifecycle.test.cjs`. The two tests were updated and the two sources are the change.
- Matrix axes: the newest goal entry (met, failed, cleared, active, none), the claimed note (carries the mark, carries none, claimed by another session) and the log (whole, read only in part). The resolver test covers the first axis, the receiver test the second and third.
- Algorithm invariant: `ended` is never set beside a packet, and the mark is written only when no packet is carried (`markEnded = ended && goalPacket === ''` at line 978 of the fix commit).
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the resolver, the recorder and the pre-change absence of `goal_ended`. Implementation writes the four tests first, then edits the core, the CLI and the README until they pass. Verification runs the four tests, the whole relaunch and OpenCode plugin suite and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveGoalPacketResult` for a met, failed, cleared, active and absent goal, `claimedNoteEndedGoal` through the resolver, and `recordGoalPacket` writing and removing the mark | `node:test` |
| Integration | `prepare` run as a CLI in a sandbox across two hops, with a cleared goal first and a silent receiver after it | `node:test` |
| Manual | None. No live hop is run in this phase | Not run |

The four new tests run first and must show 0 pass and 4 fail, saved to `scratch/red.txt`. After the edit the same command must show 4 pass, saved to `scratch/green.txt`. The whole suite then runs once with `AI_SESSION_CHILD` and `OPENCODE_DB` unset.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `parseHandoff`, `readHandoffText`, `safeDirectory` and `updateFrontmatter` in `lib/relaunch-core.cjs` | Internal | Green | The lookup and the recorder would need their own note reader and writer |
| The packet goal fallback built by sibling 002-packet-goal-fallback | Internal | Green | There would be no fallback for an ended goal to come back through |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a receiver of a live goal is told to carry nothing, or a cleared goal still comes back at the second hop, or any relaunch test fails after the edit.
- **Procedure**: revert commit `aee4ae8080`. The field is optional, so a note that already holds `goal_ended: true` still claims and hands over, and the field is ignored.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The packet goal fallback of sibling 002-packet-goal-fallback | Implementation |
| Implementation | The pre-change code confirmed blind to `goal_ended` | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
