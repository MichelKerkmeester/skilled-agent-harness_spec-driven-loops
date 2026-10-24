---
title: "Implementation Plan: Phase 23: relaunch-cancel-and-test-isolation"
description: "Scrub the loop environment from the relaunch tests, withdraw a deferred Claude hand-over when the operator carries on, add cancel and hand-over subcommands, and record the hop only on the wrapper path that relaunches."
trigger_phrases:
  - "relaunch cancel and test isolation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 23: relaunch-cancel-and-test-isolation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS and ESM hooks), Bash wrapper |
| **Framework** | Claude Code hooks, the `skilled-loop` wrapper |
| **Storage** | JSON relaunch records and a tab-separated hop history under the runtime state directory |
| **Testing** | `node --test`, vitest for the Pi extension |

### Overview
The tests drop every `SKILLED_LOOP_*` variable at load time and give the two `dropNestedLoop` tests a sandbox runtime directory. The Claude Stop hook marks a deferred record, and the prompt hook withdraws that record when an operator prompt arrives. A new `cancel` subcommand gives the session a named way back. The hop record moves from `should-relaunch` into a new `hand-over` subcommand, which the wrapper calls only once it has decided to relaunch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing in both environments
- [x] Docs updated (spec/plan/tasks and the four runtime docs)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared core library with thin runtime adapters and a CLI the wrapper calls.

### Key Components
- **relaunch-core.cjs**: Owns record state. It gains `markDeferred` and `withdrawDeferred`, both built on the guarded `unarm`.
- **session-relaunch.cjs**: The CLI. It gains `cancel` and `hand-over`, and `should-relaunch` stops writing history.
- **claude/stop-arm.mjs and claude/context-nudge.mjs**: The Claude adapters. One marks a deferral and the other withdraws it.
- **skilled-loop**: The wrapper. Its relaunch path calls `consume_record hand-over`.
- **hop-history.cjs**: Writes and reads the history. It gains an optional eighth column.

### Data Flow
A session runs prepare and the record goes `pending`. If the Stop hook sees a running background task, it defers and marks `deferredAt`. An operator prompt in the same session then makes the prompt hook call `withdrawDeferred`, which disarms the record with reason `user-message` and prints a withdrawn notice. A `<task-notification>` prompt leaves the record alone. Without a withdraw, the next clean Stop arms the record, the killer ends the session, and the wrapper checks the cwd and the note. Only then does it call `hand-over`, which writes the `handed-over` line and the notice when the note is open.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shouldRelaunch` in the CLI | Wrote `handed-over` and the notice on approval | Update: writes neither | `hop-history.test.cjs` hand-over tests |
| `consume` in the CLI | Hands the wrapper the note path | Unchanged for every caller | `skilled-loop.test.cjs` |
| `skilled-loop` relaunch path | Called `consume_record` | Update: calls plain `consume`, then `hand-over --handoff --hop --runtime` only for an open note, ignoring its exit | `skilled-loop.test.cjs` counts `handed-over` lines and covers a failing `hand-over` |
| `unarm` in the core | Disarms with a guard | Unchanged; new callers `cancel` and `withdrawDeferred` | CLI and adapter tests |
| Pi and OpenCode adapters | Already withdraw on `user-message` | Not a consumer of the Claude change | Pi vitest 49/49, OpenCode plugin tests |
| `recordHop` and `readHistory` | Seven columns | Update: optional eighth `session` column | `hop-history.test.cjs` checks both line shapes |
| Tests reading `process.env` | Inherited the wrapper's loop variables | Update: scrub at load | Suite run with the loop environment set |
| `shouldRelaunch` in the core | Reported `not-armed` for any unarmed record | Update: reports `withdrawn` for a cancelled or withdrawn record, which the wrapper answers with one line and no manual claim command | `relaunch-core.test.cjs`, `skilled-loop.test.cjs` |
| Killer timeout | Recorded `timed-out` and notified for a cancelled record | Update: treats a disarmed record as superseded | `killer.test.cjs` |
| Nudge state file | Held the level only | Update: an optional one-shot re-arm beside the level, cleared by compaction | `nudge.test.cjs`, `claude-adapters.test.cjs` |
| Compaction pointer | Seeded a claim of any open note | Update: a withdrawn note the session has not updated gets a read-only pointer | `claude-adapters.test.cjs` |
| `openNotesLine` | Counted every open note as unclaimed | Update: reports withdrawn notes apart | `hop-history.test.cjs` |
| `arm`, `unarm`, `markDeferred`, `withdrawDeferred`, `claimHandoff`, `completeHandoff` | Unlocked read-then-write | Update: run under the existing mkdir lock | `relaunch-core.test.cjs` lock tests |
| `validatedNote` for prepare and keep | Checked the spec folder's shape | Update: also requires the folder to exist | `session-relaunch-cli.test.cjs` |

Required inventories:
- Same-class producers: `rg -n "recordHop\('handed-over'|notifyHandOver" .skilled .opencode` shows the CLI `consume` as the one writer after the change.
- Consumers of changed symbols: `rg -n "consume_record|should-relaunch|withdrawDeferred|markDeferred" .skilled .opencode`.
- Matrix axes: environment (loop variables set or unset) by suite (relaunch node tests, OpenCode plugin tests, Pi vitest), six runs.
- Algorithm invariant: a record is withdrawn only when it is pending, deferred and owned by the prompting session.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Core transitions, history columns, nudge text | `node --test` |
| Integration | CLI subcommands, the Claude hooks through their entry points, the wrapper against a stub runtime | `node --test` |
| Negative control | Each new-behavior test against main's code | Copies of main's files in the scratchpad |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Claude's `<task-notification>` prompt prefix | External | Green, seen in a session transcript | A background-task completion would withdraw the hand-over |
| Phase 022 Pi and OpenCode withdraw | Internal | Green | None for this phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A live hand-over that relaunches without a `handed-over` line, or a deferred hand-over withdrawn by a background-task completion.
- **Procedure**: Revert the phase commit. Records and history lines written by the new code stay readable by the old code.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Med | 3 hours |
| Verification | Med | 1 hour |
| **Total** | | **4 to 5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (not needed, no data migration)
- [x] Feature flag configured (`SYSTEM_SESSION_RELAUNCH_DISABLED=1` still turns the loop off)
- [x] Monitoring alerts set (the `withdrawn`, `cancel` and `handed-over` events land in `relaunch.log` and the hop history)

### Rollback Procedure
1. Set `SYSTEM_SESSION_RELAUNCH_DISABLED=1` to stop new hand-overs at once.
2. Revert the phase commit.
3. Run the relaunch suite and one live hop to confirm the old behavior.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. An eighth history column and a `deferredAt` field are ignored by the old code.
<!-- /ANCHOR:enhanced-rollback -->

---
