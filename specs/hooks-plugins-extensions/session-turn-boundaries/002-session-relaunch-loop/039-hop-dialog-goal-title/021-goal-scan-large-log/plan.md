---
title: "Implementation Plan: Phase 21: goal-scan-large-log"
description: "Read the bytes before a capped tail in fixed chunks when the tail holds no goal entry, count the newest entry and report the read whole."
trigger_phrases:
  - "goal scan large log plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 21: goal-scan-large-log

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS in the relaunch core, CommonJS in the test |
| **Framework** | None, Node built-in modules |
| **Storage** | The Claude session log under the configured projects folder |
| **Testing** | `node:test` through `createSandbox` and `writeClaudeLog` in `tests/relaunch-core.test.cjs` |

### Overview
`latestGoalLogEntry` widens the tail to 16 MB and then reports `whole: false`, which drops the packet goal fallback. The change reads the bytes before the capped tail from offset 0 in 64 KiB buffers when the tail holds no goal entry, parses only lines that contain `goal`, and returns the newest entry with `whole: true`. The tail loop keeps its behavior. Two assertions in one existing test change to prove both a log with no goal entry and an ended goal before the cap.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] The 2026-11-14 whole-epic review names this finding, and the orchestrator confirmed it against the code and a test

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `scratch/green.txt` shows both changed assertions passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A capped tail, then a bounded full read only when the tail cannot answer.

### Key Components
- **`GOAL_LOG_TAIL_BYTES` and `GOAL_LOG_MAX_TAIL_BYTES` (`lib/relaunch-core.cjs:60` to `:61`)**: the 256 KiB first read and the 16 MB cap. Unchanged.
- **`GOAL_LOG_SCAN_CHUNK_BYTES` (new)**: 64 KiB, the buffer size of the head scan.
- **`readLogTail` (`:537` to `:548`)**: returns `{ text, whole, start }`, where `start` is the byte offset the read began at. The one caller uses it.
- **`goalEntryFromLogLine` (new)**: returns a goal entry for a line that contains `goal` and parses as a goal status or a goal clear, and null otherwise. The tail loop and the head scan both call it.
- **`latestGoalLogEntry` (`:572` to `:595`)**: widens the tail, returns a tail entry when it finds one, and calls the head scan when the capped tail holds none.
- **`latestGoalLogEntryBefore(filePath, endByte)` (new)**: reads `[0, endByte)` in fixed buffers, keeps a remainder as bytes across chunk boundaries, and returns the newest entry found plus the trailing partial line. The caller joins that partial with the tail's first partial line, so a goal entry that straddles the tail start is parsed once.

### Data Flow
The reader opens the log and reads the tail. A tail that holds an entry returns it and the reader stops, with `whole` as the tail reports it. A tail that is the whole file returns the tail's answer. A capped tail with no entry sends the reader to the head scan, which reads from offset 0 to the tail start, parses only goal lines, and returns the last entry found plus its trailing partial line. The caller joins that partial with the tail's first partial line and parses the joined line once. The result is `{ latest, whole: true }`, so `claudeGoalPacketResult` either uses the entry it found or, when none exists, reaches the packet goal fallback.

### Invariants
- No byte is read twice. The head scan ends at the tail start.
- A line split across two chunks is joined before it is parsed.
- A line is decoded only after its bytes are complete, so a multi-byte character that crosses a boundary is not corrupted.
- A line that straddles the tail start is joined from the head's remainder and the tail's first partial line before it is parsed.
- A line that does not contain `goal` is never parsed.
- A goal entry in the tail outranks an older one in the head, because the tail is read first and the scan runs only when the tail holds none.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The 2026-11-14 whole-epic review finding F2 is CONFIRMED against the tree at `fa6a56f0fc`. The code at `lib/relaunch-core.cjs:687` and the test assertion at `tests/relaunch-core.test.cjs:2876` show the drop. The review measured 35 of 801 logs over 16 MB on one account.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `latestGoalLogEntry` | Drops the fallback past the cap | update | The changed assertion turns from an empty string to the packet |
| `readLogTail` | Returns text and whole | update | Its one caller reads `start` |
| The tail loop's per-line parse | Parses goal status and clear entries | extract | The two changed assertions and the existing goal tests pass |
| The packet goal fallback at `:687` | Refuses a partial read | unchanged | The changed test reaches the fallback |
| The claimed-note mark at `:686` | Runs before the whole check | unchanged | The second test keeps its `ended: true` result with a corrected comment |
| The README sentence on a large log | Calls the log unproven | update | `rg -c 'fixed chunks' .skilled/hooks/session-relaunch/README.md` prints 1 or more |

Required inventories:
- Same-class producers: `rg -n 'readLogTail|latestGoalLogEntry' .skilled` prints the one reader, its one caller and the tests. No other code reads a Claude log tail.
- Consumers of changed symbols: `claudeGoalPacketResult` reads `{ latest, whole }` at `lib/relaunch-core.cjs:674`. Its behavior for a whole read is already written at `:683` to `:695`.
- Matrix axes: log size (under the cap, over the cap with an entry in the tail, over the cap with an ended entry before the tail, over the cap with no entry) crossed with result (tail answer, packet, ended, packet fallback). The one changed test covers the last three, and the existing tests cover the first.
- Algorithm invariant: the newest goal entry in the log decides, whether it sits in the tail or before it.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup takes the suite baseline and confirms the cap, the refusal and the two assertions by reading the code and the test. Implementation changes the two assertions first, saves the red run, then adds the chunk constant, the line helper, the tail start and the head scan until the same command passes. Verification runs the goal test file, the whole relaunch and OpenCode plugin suites, `node --check` and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `latestGoalLogEntry` is reached through `resolveGoalPacket` and `resolveGoalPacketResult` | `node:test` in `tests/relaunch-core.test.cjs` |
| Integration | A Claude log written by `writeClaudeLog`, 17 one-MB filler lines, read through the public resolvers | `node:test` in `tests/relaunch-core.test.cjs` |
| Manual | None. No live session log is read in this phase | Not run |

The changed assertions run first with `--test-name-pattern='ended or unreadable Claude goal'` and must fail, saved to `scratch/red.txt`. After the edit the same command must pass, saved to `scratch/green.txt`. The test writes about 17 MB per run, so the scratch folder holds the output only, never the log.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `writeClaudeLog`, `writeGoalPacket`, `writeGoalBudget` and `goalStatus` in `tests/relaunch-core.test.cjs` | Internal | Green | The test would need its own fixture |
| `claudeSessionLogPath` finds the log under `CLAUDE_CONFIG_DIR` | Internal | Green | The reader would not find the fixture log |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a whole log with a goal entry returns the wrong entry, or any relaunch test fails after the edit.
- **Procedure**: revert the fix commit. No record format and no log format changes.
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
| Setup | The fallback built in phase 2 and the mark built in phase 10 | Implementation |
| Implementation | The baseline count and the red assertions | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
