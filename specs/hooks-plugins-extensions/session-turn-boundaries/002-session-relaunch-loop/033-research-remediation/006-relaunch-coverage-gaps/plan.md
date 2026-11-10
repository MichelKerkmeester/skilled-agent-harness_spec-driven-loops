---
title: "Implementation Plan: Phase 6: relaunch-coverage-gaps"
description: "Add coverage tests for three relaunch paths, a failing-first test for the reused-note defect, and a record-based fix for it."
trigger_phrases:
  - "relaunch coverage gaps plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: relaunch-coverage-gaps

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash wrapper and Node.js CommonJS |
| **Framework** | None |
| **Storage** | Handoff notes on disk, guarded by a file lock |
| **Testing** | `node --test`, plus vitest for the Pi extension |

### Overview
Add four tests for paths the research found uncovered. Three are coverage tests that pass on current code: the OpenCode 2 equals-form server, the missing runtime binary and the concurrent claim. The fourth, a reused note with the goal switch off at prepare and on at consume, is failing-first: it fails today because consume reads the switch again and hands on the old packet. The fix records the goal-switch state on the relaunch record at prepare, and consume hands on `goal_packet` only when that recorded state was on.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 002 and 004 are Complete
- [ ] Baseline test run recorded

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Both test commands pass with no new failures against the baseline
- [ ] Implementation summary records the reused-note test failing first and passing after the fix
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Test additions against existing stubs and fixtures; one record field written at prepare and read at consume.

### Key Components
- **`skilled-loop` argument scan** (`.skilled/bin/skilled-loop:576`): sets `opencode_server_seen` for `--server` and `--server=*`; the warning prints at `:625-628`; the launch at `:661-665` keeps `runtime_exit`.
- **`claimHandoff`** (`lib/relaunch-core.cjs:1065-1085`): status check and write inside `withAppendLock`, which runs the work without the lock once its 2000 ms wait expires (`:26`, ~1284-1321).
- **`recordGoalPacket`** (`bin/session-relaunch.cjs:387-398`): returns early with the switch off (`:388`), leaving the note's old `goal_packet`.
- **`preparePending`** (`lib/relaunch-core.cjs:734-766`, called from the CLI prepare at `bin/session-relaunch.cjs:525`): builds the relaunch record. Arm spreads the record (`:812-819`), so a new field survives to consume.
- **`usableGoalPacket`** (moved into `relaunch-core.cjs` by phase 004; was `bin/session-relaunch.cjs:376-381`, called from consume at `:708` and from `claim` at `:639`): returns the note packet when the switch is on and the packet still holds `goal.md`.

### Data Flow
Test 1 (coverage) runs the wrapper with a stub `opencode` whose `--help` lists `--standalone`, passing `--server=http://localhost:4096`. It asserts the shared-server warning and that the stub's launch arguments equal `['--server=http://localhost:4096']` with no `--standalone`, as the spaced-form test at `skilled-loop.test.cjs:1056-1063` does.

Test 2 (coverage) builds its own PATH: a temporary directory holding a link to the current `node`, plus `/usr/bin:/bin`. It must not reuse the harness PATH, which puts the stub directory in front of the real PATH (`skilled-loop.test.cjs:299`), and every runtime binary is on this machine's PATH. The test asserts exit 127, and first asserts that the chosen runtime does not resolve on that PATH.

Test 3 (coverage) forks two Node processes that each load the core, signal ready and wait on a start barrier (for example a go file the parent creates once both are ready). Both then call `claimHandoff` on one open note with different session ids. The test asserts exactly one winner, the other refused with the prefix `cannot claim handoff with status`, and the note's `claimed_by` equal to the winner's session id. Run it once by hand with the lock removed from `claimHandoff` and record in the implementation summary whether it then fails; do not keep that variant. Flake risk: `withAppendLock` runs the claim unlocked after 2000 ms, so a machine stalled that long can let both claims through.

Test 4 (failing-first) writes a note holding `goal_packet` and its `goal.md`, runs prepare with `SESSION_RELAUNCH_GOAL=0` so the note is reused, then runs consume once with the switch off and once with it on, asserting neither reports `goal_packet`. The on-at-consume run fails today; the off-at-consume run passes and repeats the check at `session-relaunch-cli.test.cjs:2510`.

Fix: the CLI prepare passes the current goal-switch state to `preparePending`, which writes it on the record. Consume reads it from the record and passes it to the moved `usableGoalPacket`, which hands on a packet only when the recorded state was on. Only a recorded `false` counts as off. A record with no field (written before the fix, or by a test fixture such as the existing test at `session-relaunch-cli.test.cjs:2496-2516`) falls back to the switch at consume, so that test keeps passing. `claim` has no record and keeps reading the switch at claim time, a limit the spec records as out of scope.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `preparePending` in `lib/relaunch-core.cjs` | Builds the relaunch record | Record the goal-switch state passed in by the CLI | Test 4, existing core record tests |
| CLI prepare in `bin/session-relaunch.cjs` | Calls `preparePending` | Pass the switch state | Test 4, existing prepare tests |
| `usableGoalPacket` (moved into `lib/relaunch-core.cjs` by phase 004) | Decides the packet consume and claim hand on | Take the recorded state; only a recorded `false` blocks the packet | Test 4, existing consume test at `session-relaunch-cli.test.cjs:2496-2516` |
| CLI consume in `bin/session-relaunch.cjs` | Calls `usableGoalPacket` | Pass the record's switch state | Test 4 |
| CLI `claim` in `bin/session-relaunch.cjs` | Calls `usableGoalPacket` with no record | Unchanged; keeps the switch at claim time, a documented limit | Existing claim tests |
| Prepare reuse path (`recordGoalPacket`) | Keeps an existing `goal_packet` when the switch is off | Unchanged | Existing prepare tests |
| README `.skilled/hooks/session-relaunch/README.md:164-174` | Documents the keep behavior | Out of scope for this phase; note any drift in the implementation summary | Read |

Required inventories:
- Same-class producers: `rg -n 'goal_packet' .skilled/hooks/session-relaunch`.
- Consumers of changed symbols: `rg -n 'usableGoalPacket|goalSwitchOn|preparePending' .skilled/hooks`.
- Matrix axes: recorded switch (off, on, absent) by switch at consume (off, on), giving six rows; test 4 covers off by both, the existing consume test covers absent by both.
- Algorithm invariant: a packet that a switch-off prepare kept is never handed on by consume, whatever the switch reads at consume. Any code comment states that why and carries no spec or phase id.
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
| Unit | Concurrent `claimHandoff` with two real processes | `node --test` |
| Integration | Wrapper equals-form server and missing binary; CLI reused note | `node --test` |
| Manual | None; the brief names no live proof | None |

Baseline before, rerun after:

```bash
node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs
npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 consume rewrite | Internal | Yellow | Test 4 would target code about to change |
| Phase 004 move of `usableGoalPacket` | Internal | Yellow | The fix would edit a copy about to move |
| Phase 008 claimed message | Internal | Green | None, tests assert the kept prefix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new test is flaky or the record-based fix breaks an existing test.
- **Procedure**: Revert the commit that added the test or fix; no data or state changes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline) ──► Core (tests, conditional fix) ──► Verify (full rerun)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 002 and 004 Complete | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Med | 2-3 hours |
| Verification | Low | 30 minutes |
| **Total** | | **3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline test counts recorded
- [ ] Test 4 first-run failure recorded

### Rollback Procedure
1. Revert the test or fix commit.
2. Rerun both test commands.
3. Confirm the counts match the baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
