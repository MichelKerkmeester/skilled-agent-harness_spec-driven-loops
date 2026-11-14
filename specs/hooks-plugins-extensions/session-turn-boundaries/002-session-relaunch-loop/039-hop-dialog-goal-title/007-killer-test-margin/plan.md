---
title: "Implementation Plan: Phase 7: killer-test-margin"
description: "Reproduce the killer grace-period test's failure under load, widen its deadline from 450 ms to 1000 ms and show the same load run passes, so the suite stops failing on a late poll."
trigger_phrases:
  - "killer test margin plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: killer-test-margin

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, CommonJS in the killer test, bash for the load script |
| **Framework** | None, Node built-in modules |
| **Storage** | None |
| **Testing** | `node:test` with `node:assert/strict`, run 160 at once by `scratch/killer-load.sh` |

### Overview
One value changes in one test: `timeoutMs` goes from 450 to 1000, with a two-line comment. The proof is a load run that fails 14 of 160 at 450 ms and passes 160 of 160 twice at 1000 ms, then the whole relaunch and OpenCode plugin suite.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] `rg -n 'POLL_INTERVAL_MS = ' .skilled/hooks/session-relaunch/lib/killer.cjs` prints line 22 with the value 100, so the poll interval the margin lost to is confirmed

### Definition of Done
- [x] All acceptance criteria met
- [x] `scratch/green.txt` prints `failed runs: 0` for both rounds at `timeoutMs: 1000`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Test margin widening.

### Key Components
- **The grace-period test in `tests/killer.test.cjs`**: starts the killer with `idleMs: 400` and a deadline. Without a deadline well past the idle window one late poll fails it.
- **`scratch/killer-load.sh`**: runs the one test N times at once and prints how many runs failed. Without it the failure under load cannot be reproduced.

### Data Flow
The load script starts N copies of `node --test --test-name-pattern=<the test name> killer.test.cjs` in the background and waits for each. It counts the copies that exit nonzero and prints `parallel runs: N, failed runs: M`. Each copy builds its own sandbox, so the copies share no file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The grace-period test in `tests/killer.test.cjs` | Gives the killer a deadline over a 400 ms idle window | update | `git show 8a113b68ae` shows `timeoutMs: 450` becoming `timeoutMs: 1000` |
| `waitForIdle` and `POLL_INTERVAL_MS` in `lib/killer.cjs` | Poll the transcript every 100 ms until the deadline | unchanged | `git show --stat 8a113b68ae` lists no file under `lib` |
| The other tests in `tests/killer.test.cjs` | Run the killer with their own deadlines | not a consumer | `scratch/green.txt:15` to `scratch/green.txt:18` show the whole file passing 64 of 64 |

Required inventories:
- Same-class producers: `rg -n 'timeoutMs: ' .skilled/hooks/session-relaunch/tests/killer.test.cjs` lists every deadline the file sets. Only the one in the grace-period test is changed, because only that one was named as failing.
- Consumers of changed symbols: none. The change is a literal inside one test.
- Matrix axes: the deadline (450 ms, 1000 ms) against the load (160 at once). Both rows are in `scratch/`.
- Algorithm invariant: the deadline must exceed the idle window by more than a few poll intervals, so one late poll cannot miss it.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the test, `waitForIdle` and the poll interval and writes the load script. Implementation runs the load at 450 ms for the red result, then changes `timeoutMs` to 1000 and adds the comment. Verification runs the load twice at 1000 ms, the whole file, the whole relaunch and OpenCode plugin suite and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The one grace-period test, run 160 at once | `node:test` through `scratch/killer-load.sh` |
| Integration | The whole relaunch and OpenCode plugin suite | `node:test` |
| Manual | None. No live hop is run in this phase | Not run |

The load run at 450 ms must print a nonzero failed count and is saved to `scratch/red.txt`. After the edit the same command must print `failed runs: 0` in two rounds and is saved to `scratch/green.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `scratch/killer-load.sh` | Internal | Green | The failure could not be reproduced under load |
| Node.js test runner | Internal | Green | No test can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the grace-period test fails at 1000 ms for a reason other than a late poll, or any killer test fails after the edit.
- **Procedure**: revert commit `8a113b68ae`. It changes one test and nothing reads the value, so the revert restores the earlier flaky margin and nothing else.
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
| Setup | The research's ranked change 14 | Implementation |
| Implementation | The load script and its red result at 450 ms | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
