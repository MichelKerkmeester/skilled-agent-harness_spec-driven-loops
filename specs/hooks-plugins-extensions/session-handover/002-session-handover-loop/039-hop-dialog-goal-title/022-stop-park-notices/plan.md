---
title: "Implementation Plan: Phase 22: stop-park-notices"
description: "Print one cause-naming systemMessage on the target-pid and arm-throw Stop branches, test each first, and keep the stamp, the log line and the withdrawal."
trigger_phrases:
  - "stop park notices plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 22: stop-park-notices

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ES modules) in the Stop adapter, CommonJS in the test |
| **Framework** | None, Node built-in modules |
| **Storage** | The relaunch record and `relaunch.log` in the relaunch state directory |
| **Testing** | `node:test` through `runAdapter` and a direct `armPendingRecord` import in `tests/claude-adapters.test.cjs` |

### Overview
Two of the three branches that park a Claude hand-over print nothing. Each gains one JSON line with a fixed `systemMessage` through the same `dependencies.write` seam the missing-transcript and background-task branches use. The two existing tests change to expect the line, so both fail before the source edit. The stamp, the `target-pid` and `arm` log lines and the withdrawal stay as they are.
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
- [ ] `scratch/green.txt` shows both changed tests passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One notice on every Stop path that parks a hand-over, matching the branch that already prints one.

### Key Components
- **`markParked` (`claude/stop-arm.mjs:53` to `:59`)**: stamps the record and logs a stamp failure. Unchanged.
- **The target-pid branch (`:191` to `:200`)**: resolves the killer target. When it is null it logs `stop-arm-error stage=target-pid`, stamps and returns. It gains one notice after the stamp.
- **The arm-throw branch (`:202` to `:219`)**: calls `arm` in a `try`. A throw logs `stop-arm-error stage=arm`, stamps and returns. It gains one notice after the stamp.
- **`dependencies.write` (`:94` to `:99`, used at `:144`)**: the test seam for stdout. The JSDoc changes from "the deferral notice" to "an operator notice".
- **`lib/withdraw.cjs` and `claude/context-nudge.mjs`**: withdraw the stamped record on the next prompt. Unchanged.

### Data Flow
A Stop reaches the target-pid branch with no process below the loop. The branch logs `stop-arm-error stage=target-pid`, stamps `deferredAt`, writes one line that names the missing target, the withdrawal on the next prompt and the retry at a later Stop, then returns. A Stop whose `arm` call throws takes the same shape with the arm cause. A write that throws is logged as `stop-arm-error stage=notice`, and the hook exits 0. The operator's next prompt withdraws the record as it does today.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The 2026-11-14 whole-epic review finding F4 is CONFIRMED against the tree at `fa6a56f0fc`. The two branches at `claude/stop-arm.mjs:196` and `:215` stamp the record and print nothing, while the branch at `:138` prints a `systemMessage`.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Target-pid branch | Logs, stamps and returns | update | The changed test reads one line from stdout |
| Arm-throw branch | Logs, stamps and returns | update | The changed test collects one line through `write` |
| Missing-transcript branch | Prints its own notice | unchanged | Its test still passes in `scratch/claude-adapters.txt` |
| Background-task branch | Prints its own notice | unchanged | `stop-arm defers pending state when background tasks exist and logs the reason` still passes |
| `withdraw.cjs` and `context-nudge.mjs` | Withdraw on the next typed prompt | unchanged | `git show --stat FIX` lists neither |
| The two READMEs | Describe the Stop | update | Each names the notice on the two branches |

Required inventories:
- Same-class producers: `rg -n 'markParked\(loopId, env\)' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` lists four stamp calls. Two print a notice today, two gain one, and the fifth call inside `markParked` is the helper itself.
- Consumers of changed symbols: Claude reads the Stop stdout, and no repository code parses it. The only readers are test assertions on `result.stdout` and on the injected `write`.
- Matrix axes: Stop path (target pid, arm throw, missing transcript, background tasks, armed) crossed with stdout (one notice or empty). The two changed tests cover the first two rows and the existing tests cover the rest.
- Algorithm invariant: a Stop prints at most one line, and only on a path that leaves the record parked for a cause the operator can see.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup takes the suite baseline and confirms the two silent branches and the two tests. Implementation changes the two tests, saves the red run, then adds each notice inside its `try` until both pass, then corrects the comment and the two README rows. Verification runs the Claude adapter and conformance suites, the whole relaunch and OpenCode plugin run, `node --check` and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. Both branches are reached through the hook or its exported entry | Not applicable |
| Integration | The spawned Stop hook with no resolvable target pid, and `armPendingRecord` with a `write` seam and a `cwd` value that makes `arm` throw | `node:test` in `tests/claude-adapters.test.cjs` |
| Manual | None. No live Stop is run in this phase | Not run |

Both changed tests run first with `--test-name-pattern='no process below the loop|arming throws'` and must fail, saved to `scratch/red.txt`. After the edit the same command must pass, saved to `scratch/green.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `createPendingRecord`, `runAdapter`, `installKillerRecorder` and `STOP_PAYLOAD` in `tests/claude-adapters.test.cjs` | Internal | Green | Each test would need its own harness |
| Claude's handling of a Stop `systemMessage` | External | Green, by the two notices that already print | The line would not reach the operator |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a parked Stop fails, continues the turn, or any relaunch test fails after the edit.
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
| Setup | The stamp built in phase 5 and the notice built in phase 17 | Implementation |
| Implementation | The baseline count and the red tests | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
