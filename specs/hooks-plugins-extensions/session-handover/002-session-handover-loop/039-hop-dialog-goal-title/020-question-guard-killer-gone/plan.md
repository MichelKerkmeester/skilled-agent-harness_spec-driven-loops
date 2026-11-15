---
title: "Implementation Plan: Phase 20: question-guard-killer-gone"
description: "Deny a question dialog for any record the core calls armable, allow it once a live killer owns the lock, test the split first, and prove the throwing read."
trigger_phrases:
  - "question guard killer gone plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 20: question-guard-killer-gone

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ES modules) in the guard, CommonJS in the test |
| **Framework** | None, Node built-in modules |
| **Storage** | The relaunch record and the killer lock in the relaunch state directory |
| **Testing** | `node:test` through `runGuard` in `tests/subagent-guard.test.cjs` |

### Overview
`pendingHandOver` asks `armableRecord` whether this session's record can be armed and then keeps only the `pending` answer. The core also answers `killer-gone` for an armed record with no live killer, and that state follows a killer spawn failure that leaves the record armed. The guard will return the record for either armable answer. The armed-record test at line 313 splits into a denial for an armed record with no killer and a control for an armed record with a live killer, and one added test proves the throwing read that phase 1 recorded as source-only evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] The 2026-11-14 whole-epic review names this finding, and the orchestrator confirmed it against the code

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `scratch/green.txt` shows the split denial and the throwing-read test passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One verdict, read once, and the guard acts on it.

### Key Components
- **`pendingHandOver` (`claude/subagent-guard.mjs:65` to `:85`)**: reads the record, asks `armableRecord` and returns the record only for a pending status. After the change it returns the record for any armable verdict.
- **`armableRecord` (`lib/relaunch-core.cjs:1172` to `:1185`)**: the one owner of the verdict. A pending record is armable. An armed record is armable only when `liveKillerPid` finds no live lock owner. Unchanged.
- **`liveKillerPid` and the killer lock**: the lock is `killer-<loopId>.lock` under `stateDir(env)` and holds `<pid> <iso>`. The live-killer control writes `process.pid` into it, as `tests/relaunch-core.test.cjs:1686` does.
- **`runGuard` (`tests/subagent-guard.test.cjs:55`)**: spawns the guard as Claude would, with the sandbox environment, and reads stdout.

### Data Flow
An `AskUserQuestion` PreToolUse reaches the guard. The guard reads this session's record. `armableRecord` returns `pending`, `killer-gone`, `killer-live` or a refusal. `pending` and `killer-gone` produce the denial that names the note and the `cancel` command. `killer-live` and every refusal produce no output, so the dialog opens and a live killer ends the idle session as it does today.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The 2026-11-14 whole-epic review finding F1 is CONFIRMED against the tree at `fa6a56f0fc`. Its planned change is to deny for every armable verdict and to split the test that pins the armed-no-killer pass-through.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `pendingHandOver` in `subagent-guard.mjs` | Keeps the `pending` answer only | update | The split denial test turns from red to green |
| `readRelaunchFile` call in the same function | Fails open on a thrown read | unchanged | The new throwing-read test passes before and after the edit |
| `armableRecord` in `relaunch-core.cjs` | Owns the verdict | unchanged | `git diff --name-only -- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints nothing |
| The `subagent-guard.mjs` row in `claude/README.md` | Says the dialog passes once the record is armed | update | `rg -c 'live killer' .skilled/hooks/session-relaunch/claude/README.md` prints 1 or more |
| The Claude adapter registry and settings | Bind the guard to `Bash` and `AskUserQuestion` | unchanged | `sync-hook-registrations.cjs --check` prints `PASS` |

Required inventories:
- Same-class producers: `rg -n "verdict.reason === 'pending'" .skilled` prints the one condition this phase changes. No other adapter reads the verdict.
- Consumers of changed symbols: `pendingHandOver` is called once, from `main` at `claude/subagent-guard.mjs:117`. `armableRecord` has other callers and does not change.
- Matrix axes: record state (pending, armed with no killer, armed with a live killer, other session, no record) crossed with stdout (a denial or empty). The existing tests cover every row and the split adds the armed rows.
- Algorithm invariant: a dialog is refused exactly when the core says the record can be armed, and allowed exactly when it cannot.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup takes the suite baseline and confirms the three current states by reading the guard, the core and the tests. Implementation changes the split tests, saves the red run, then changes the condition and its comment until the split denial passes. The throwing-read test is added beside it and run once before and once after the edit. Verification runs the guard suite, the Claude adapter and conformance suites, the whole relaunch and OpenCode plugin run, `node --check` and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. The guard is reached through the hook process | Not applicable |
| Integration | The guard run by `runGuard` with a pending record, an armed record with no lock, an armed record with a live lock and an unreadable record | `node:test` in `tests/subagent-guard.test.cjs` |
| Manual | None. No live Claude session is run in this phase | Not run |

The split denial and the throwing-read test run first with `--test-name-pattern` and their output is saved to `scratch/red.txt`. After the edit the same command must pass, saved to `scratch/green.txt`. The live-killer control is expected to pass before and after, and `scratch/control.txt` records that it does.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `createSandbox`, `preparePendingRecord`, `questionPayload` and `runGuard` in `tests/subagent-guard.test.cjs` | Internal | Green | The test would need its own harness |
| `core.stateDir` and `core.relaunchFilePath` exports | Internal | Green | The live-killer lock could not be placed where the guard reads it |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a question dialog is refused after a live killer armed the record, or any relaunch test fails after the edit.
- **Procedure**: revert the fix commit. No record format, log format or registration changes.
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
| Setup | The guard built in phase 1 and the stamp built in phase 5 | Implementation |
| Implementation | The baseline count and the red split test | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
