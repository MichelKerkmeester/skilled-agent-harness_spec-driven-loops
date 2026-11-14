---
title: "Implementation Plan: Phase 11: goal-fallback-bound"
description: "Bound the packet goal fallback for a Claude sender with no goal entry to the note's folder and its parent, test first, so a receiver is never started on the goal of work the sender never touched."
trigger_phrases:
  - "goal fallback bound plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: goal-fallback-bound

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, CommonJS in the relaunch core and the tests |
| **Framework** | None, Node built-in modules |
| **Storage** | The Claude session log and the packet `goal.md` files, both read only |
| **Testing** | `node:test` with `node:assert/strict` |

### Overview
The no-goal-entry branch of `claudeGoalPacketResult` passes `lineage.slice(0, 2)` to `firstUsablePacket` in place of the whole lineage. One test sets the only open goal two levels above the note's folder and fails before the edit. The proof is that test, its neighbour, and the whole relaunch and OpenCode plugin run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] `git show eba587cae7^:.skilled/hooks/session-relaunch/lib/relaunch-core.cjs | rg -n 'firstUsablePacket\(lineage'` prints line 677, so the fallback took the whole lineage before the fix

### Definition of Done
- [x] All acceptance criteria met
- [x] `scratch/green.txt` prints `ℹ pass 2` and `ℹ fail 0` for the two tests the name pattern selects
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded candidate list.

### Key Components
- **The no-goal-entry branch of `claudeGoalPacketResult` in `lib/relaunch-core.cjs`**: builds the candidate folders for the fallback. Without the change it hands over every ancestor up to `specs`.

### Data Flow
`packetLineage` returns the note's folder and then each parent. The fallback now keeps the first two and `firstUsablePacket` returns the first that `packetGoalIsSettable` accepts, or an empty string. The active-goal branch below it still builds `[...lineage, ...named]` and checks the goal's opening line against each `goal.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The no-goal-entry branch of `claudeGoalPacketResult` | Picks the fallback packet for a sender with no goal entry | update | `rg -n 'lineage.slice\(0, 2\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints line 678 |
| The active-goal branch of `claudeGoalPacketResult` | Matches the goal's opening line against the lineage and the named packets | unchanged | `rg -n 'lineage, \.\.\.named' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints line 692 |
| `packetLineage` and `firstUsablePacket` | Return and filter the candidate folders | unchanged | `git show --stat eba587cae7` lists no change to them beyond the one call site, and `rg -n 'packetLineage' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints lines 509 and 649 |
| The Claude row of the goal table in the README | States where the fallback looks | update | `rg -n 'no packet further up' .skilled/hooks/session-relaunch/README.md` prints line 182 |

Required inventories:
- Same-class producers: `rg -n 'packetLineage|lineage' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints the definition at 509 to 516, the use at 649, the bounded fallback at 678 and the active-goal list at 692. No other producer of a fallback packet.
- Consumers of changed symbols: no symbol changes. The one call site takes a shorter array.
- Matrix axes: where the only open goal sits (the note's folder, its parent, two levels up). The new test covers the parent and two levels up, and the existing fallback test covers the folder itself (`the phase goal is nearer than its parent`).
- Algorithm invariant: the fallback never returns a packet more than one level above the note's folder.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the fallback took the whole lineage before the fix. Implementation adds the test and then bounds the call until it passes. Verification runs the two selected tests, the whole relaunch and OpenCode plugin run and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveGoalPacket` for a Claude sender with a log that holds no goal entry, over a leaf folder, its parent and an open goal two levels up | `node:test` |
| Integration | None. The existing fallback test already runs the resolver end to end against written packets | Not applicable |
| Manual | None. No live hop is run in this phase | Not run |

The new test runs first with the name pattern `looks no further up|nearest unfinished packet goal` and must show 1 pass and 1 fail, saved to `scratch/red.txt`. After the edit the same command must show 2 of 2, saved to `scratch/green.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `packetLineage` and `firstUsablePacket` in `lib/relaunch-core.cjs` | Internal | Green | The bound would need its own folder walk |
| The sandbox helpers `createSandbox`, `writeGoalPacket` and `writeClaudeLog` in the test file | Internal | Green | The test would need its own fixtures |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a receiver whose sender worked a leaf phase of an open packet is started on no goal when the goal sits in the folder or its parent, or any relaunch test fails after the edit.
- **Procedure**: revert commit `eba587cae7`. No record format changes, so a note written before the revert still reads.
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
| Setup | The fallback built in phase 2 and the ended-goal carry of phase 10 | Implementation |
| Implementation | The pre-change call confirmed to take the whole lineage | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
