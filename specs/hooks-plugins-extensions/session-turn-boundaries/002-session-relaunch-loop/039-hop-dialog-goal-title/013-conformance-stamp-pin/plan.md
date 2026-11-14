---
title: "Implementation Plan: Phase 13: conformance-stamp-pin"
description: "Make the shared no-target conformance case assert the deferral stamp per runtime, in one test file, and prove each assertion by a working-tree mutation that is reverted before the commit."
trigger_phrases:
  - "conformance stamp pin plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: conformance-stamp-pin

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, CommonJS in the conformance test |
| **Framework** | None, Node built-in modules |
| **Storage** | None. The test writes relaunch records in a sandbox |
| **Testing** | `node:test` with `node:assert/strict` |

### Overview
`assertStillPending` in `tests/adapter-conformance.test.cjs` stops dropping `deferredAt` for every runtime. It reads a mark from the adapter it is given and asserts a parseable stamp for a runtime that stamps and no stamp for one that does not. The change is to a test, so no test can fail first in the usual way. The proof is three mutations in the working tree: the Claude stamp call taken out, the mark set for Codex, and the mark taken off the Claude entry. The first two reach the branch where a stamp is expected and none is found. The third reaches the branch where a runtime that should not stamp does. Each must turn its case red, and all three are reverted before the commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] `rg -c 'deferredAt' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` prints 1, so the stamp is named only where it is dropped

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `scratch/green.txt` prints `ℹ fail 0` for the name pattern `no process below the loop`, and `git diff --quiet HEAD -- .skilled/hooks/session-relaunch/claude/stop-arm.mjs` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-runtime test expectation.

### Key Components
- **`assertStillPending` (`adapter-conformance.test.cjs:414`)**: the check of the shared no-target case. Without the change it sets the stamp aside for every runtime, so the case holds no expectation about it.
- **The adapter table `ADAPTERS` (`adapter-conformance.test.cjs:182`)**: holds the per-runtime facts the cases read, such as `killerTarget`. It gains one mark on the Claude entry.

### Data Flow
The arm loop runs each case for each adapter and passes the adapter as the second argument of the check. The helper splits `deferredAt` from the record as now. It then asserts on the split value: a parseable time when the adapter carries the mark, and an absent key when it does not. The remaining fields are compared with the record before, unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assertStillPending` | Checks the record a Stop could not arm | update | `rg -c 'deferredAt' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` prints more than 1 |
| The Claude entry of `ADAPTERS` | Holds the Claude facts the cases read | update | `sed -n '182,220p' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` shows the mark |
| The Codex and OpenCode entries of `ADAPTERS` | Hold their runtime facts | unchanged | `git show` of the fix commit shows no change between lines 219 and 290 |
| `claude/stop-arm.mjs` | Stamps the record through `markParked` | unchanged | `git show --stat` of the fix commit does not list it |
| The three Claude stamp tests in `claude-adapters.test.cjs` | Assert the stamp on each path that leaves a record pending | unchanged | `git show --stat` of the fix commit does not list the file |

Required inventories:
- Same-class producers: `rg -n 'check: assert' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` prints the two uses of `assertUntouched` and the one use of `assertStillPending`. Only the last sets a field aside.
- Consumers of changed symbols: `rg -n 'assertStillPending' .skilled/hooks/session-relaunch/tests` prints lines 414 and 465 of the conformance file and no other file.
- Matrix axes: the runtime (stamps, does not stamp) crossed with the record (stamped, unstamped). Four rows: two pass and two fail, and each failing row has a saved red run. A marked runtime with no stamp is `scratch/red-claude.txt` and `scratch/red-codex.txt`. An unmarked runtime with a stamp is `scratch/red-unmarked.txt`.
- Algorithm invariant: for every runtime that runs the case, the case fails when the record's stamp differs from what the table says that runtime does.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup takes the suite baseline, lists the runtimes that run the case and shows the hole by removing the Claude stamp call under the old helper. Implementation adds the mark, changes the helper and the comment, and saves three red runs, each from a reverted mutation. Verification runs the selected cases, the whole relaunch and OpenCode plugin run, the clean-tree check and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. The change is to an assertion | Not applicable |
| Integration | The shared no-target arm case, run for each adapter in the table that looks a target up | `node:test` |
| Manual | Three mutations in the working tree, each run once and reverted: the stamp call removed from `claude/stop-arm.mjs`, the mark taken off the Claude entry of the table, and the mark set on the Codex entry of the table | `node:test` and `git diff --quiet` |

The selected cases run with `--test-name-pattern='no process below the loop'`. The runs are saved as `scratch/hole.txt`, `scratch/red-claude.txt`, `scratch/red-unmarked.txt`, `scratch/red-codex.txt` and `scratch/green.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The arm loop passing the adapter to each check (`adapter-conformance.test.cjs:494` to `:499`) | Internal | Green | The helper would need the runtime passed another way |
| `markParked` at `claude/stop-arm.mjs:183` (`c69f278cfc`) on the no-target path | Internal | Green | The Claude mutation would have no line to remove |
| Node.js test runner, `git` and `rg` | Internal | Green | No test, revert check or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the conformance suite fails on a tree where Claude stamps and Codex does not, or any relaunch test fails after the edit.
- **Procedure**: revert the fix commit. One test file changes, so no record, note or log format is affected.
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
| Setup | The stamp built in phase 5 | Implementation |
| Implementation | The baseline count and the saved run that shows the hole | Verification |
| Verification | Implementation, with all three mutations reverted | Close |
<!-- /ANCHOR:phase-deps -->

---
