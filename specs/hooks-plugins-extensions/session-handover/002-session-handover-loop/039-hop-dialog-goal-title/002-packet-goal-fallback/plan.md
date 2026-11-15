---
title: "Implementation Plan: Phase 2: packet-goal-fallback"
description: "When a Claude sender's whole session log holds no goal entry, prepare names the nearest unfinished packet goal in the note's spec folder lineage, so the wrapper starts the receiver on /goal. Test first, in the core resolver only."
trigger_phrases:
  - "packet goal fallback plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: packet-goal-fallback

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, CommonJS in the core and the tests |
| **Framework** | None, Node built-in modules |
| **Storage** | The Claude session log and each packet's `goal.md`, read only |
| **Testing** | `node:test` with `node:assert/strict` |

### Overview
The Claude branch of the goal resolver in `lib/relaunch-core.cjs` gains a fallback for a session log that holds no goal entry. The fallback walks the note's spec folder lineage and carries the first packet whose goal can still be sent and still has work. The proof is one resolver test that fails before the edit, a second resolver test for the cases that stay uncarried, one CLI test and a mutation check on the whole-log guard.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] `git show 'c461b79a71^:.skilled/hooks/session-relaunch/lib/relaunch-core.cjs' | rg -n 'if \(latest === null \|\| !latest.active\) return none'` prints one line, so a log with no goal entry carried nothing

### Definition of Done
- [x] All acceptance criteria met
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`
- [x] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `pass 159`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single resolver branch.

### Key Components
- **`latestGoalLogEntry` in `lib/relaunch-core.cjs`**: now returns `{ latest, whole }`. Without `whole` a log cut at the tail cap reads the same as a session that never set a goal.
- **`packetGoalIsSettable` in `lib/relaunch-core.cjs`**: accepts a packet when `readPacketGoal` reports `budgetState` `ok` and `OPEN_CRITERION_PATTERN` finds an unticked `- [ ]` line in the durable slice. Without it a finished goal or a leaf phase goal with no budget would be carried.
- **The `latest === null` branch in `claudeGoalPacketResult`**: returns none when the log was not read whole, and otherwise the first packet in `packetLineage(specFolder)` that passes `firstUsablePacket` with `packetGoalIsSettable`.

### Data Flow
`prepare` calls `resolveGoalPacket` for a Claude sender. The resolver finds the session log and reads its newest goal entry with the `whole` flag. A goal entry keeps the old path: active goals are proven by their headline, and ended goals carry nothing. No goal entry in a log read whole walks the lineage from the spec folder up and returns the first settable packet. `prepare` writes that packet as `goal_packet` in the note, and `skilled-loop` starts the receiver on `/goal <slice>` as before.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `claudeGoalPacketResult` in `lib/relaunch-core.cjs` | Resolves the Claude sender's goal packet | update | The two new resolver tests pass |
| `latestGoalLogEntry` in `lib/relaunch-core.cjs` | Reads the newest goal entry of a session log | update | `rg -n 'latestGoalLogEntry\(' .skilled/hooks/session-relaunch --glob '*.cjs'` prints the definition and one caller |
| `packetLineage`, `firstUsablePacket` and `goalPacketProblem` | Walk and check candidate packets | unchanged | Not in the diff of `c461b79a71` |
| `readPacketGoal` in `.skilled/hooks/goal/lib/goal-slice.cjs` | Reads the durable slice and its budget state | unchanged | `git show --name-only --format= c461b79a71` does not list it |
| `.skilled/bin/skilled-loop` | Starts a Claude receiver on `/goal <slice>` from `goal_packet` | not a consumer of the change | Not in the diff. It reads the note field as before |
| Pi, OpenCode, Devin and Cursor goal readers | Read goal records | not a consumer | Only the Claude branch changed |

Required inventories:
- Same-class producers: only `claudeGoalPacketResult` reads a Claude session log for a goal. `rg -n 'latestGoalLogEntry\(' .skilled/hooks/session-relaunch --glob '*.cjs'` prints two lines.
- Consumers of changed symbols: `latestGoalLogEntry` has one caller, so its new return shape stays inside the core.
- Matrix axes: goal entry (none, active, met, failed, cleared), log (read whole, read in part, missing), lineage goal (open, finished, no criteria, open only in the log, over budget, leaf phase). Each row is an assertion in the two resolver tests.
- Algorithm invariant: a packet is carried with no goal entry only when the log was read whole and the packet's slice is within budget with an unticked criterion.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads `claudeGoalPacketResult` in the parent of `c461b79a71` and confirms that a log with no goal entry carried nothing. Implementation adds the tests to `relaunch-core.test.cjs` and `session-relaunch-cli.test.cjs`, changes `relaunch-core.cjs` until they pass and updates the README. Verification runs the four suites, the mutation check and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveGoalPacket` for a Claude sender in a sandbox with a written session log and `goal.md` files | `node:test` |
| Integration | `prepare` writes and then removes `goal_packet` in a real note | `node:test` through `runCli` |
| Manual | None in this phase. No live hop is run | Not run |

The fallback test runs first as `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` and must show 1 fail, saved to `scratch/red.txt`. After the edit the same command must show `fail 0`, saved to `scratch/green.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `readPacketGoal` in `.skilled/hooks/goal/lib/goal-slice.cjs` | Internal | Green | No budget state, so no packet could be judged settable |
| `packetLineage` and `firstUsablePacket` in `lib/relaunch-core.cjs` | Internal | Green | The fallback would need a second lineage walk |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a receiver starts on a goal the operator did not want, or any relaunch test fails after the edit.
- **Procedure**: set `SESSION_RELAUNCH_GOAL=0` to stop all goal carry at once, or revert commit `c461b79a71`. No note or record format changes.
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
| Setup | The resolver code before `c461b79a71` | Implementation |
| Implementation | The confirmed gap and the operator's goal rule | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
