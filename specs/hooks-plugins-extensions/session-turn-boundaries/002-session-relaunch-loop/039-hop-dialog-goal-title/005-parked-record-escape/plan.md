---
title: "Implementation Plan: Phase 5: parked-record-escape"
description: "Stamp deferredAt on the pending record from every Stop path that leaves it pending, test first, so the operator's next prompt withdraws it instead of the dialog guard refusing questions until cancel."
trigger_phrases:
  - "parked record escape plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: parked-record-escape

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, an ES module for the Stop hook and CommonJS for the tests |
| **Framework** | None, Node built-in modules |
| **Storage** | The relaunch record's existing `deferredAt` field, written by `markDeferred` |
| **Testing** | `node:test` with `node:assert/strict` |

### Overview
`stop-arm.mjs` gains one helper, `markParked`, that stamps the pending record through the existing `markDeferred`. Stop calls it on the three paths that leave a record pending and the background-task deferral calls it in place of its own inline stamp. The proof is three tests that fail before the edit, the conformance case adjusted for Codex and the whole relaunch suite.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] `git show eaf24f999e^:.skilled/hooks/session-relaunch/claude/stop-arm.mjs | rg -c 'markDeferred'` prints the import at line 21 and one call at line 143, so the background-task deferral was the only caller before the fix

### Definition of Done
- [x] All acceptance criteria met
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared helper extraction.

### Key Components
- **`markParked` in `claude/stop-arm.mjs`**: calls `markDeferred` and logs `stop-arm-error stage=defer` when the stamp fails. Without it each of the four call sites would repeat the try and the log.
- **The four call sites in `armPendingRecord`**: the missing transcript path, the background-task deferral, the unresolved target and the thrown arm. Without the three new ones the record stays unmarked and no prompt can withdraw it.

### Data Flow
`armPendingRecord` reads the record and returns when it is not armable. On a path that cannot arm it calls `markParked`, which takes the state lock, finds the record still `pending` and writes `deferredAt`. The operator's next prompt reaches the `UserPromptSubmit` nudge, which calls `withdraw.cjs`. That helper accepts a pending record that carries a non-empty `deferredAt` and disarms it, so the dialog guard no longer sees a pending hand-over.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `armPendingRecord` in `claude/stop-arm.mjs` | Arms the record or leaves it pending | update | `rg -n 'markParked' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints the helper at line 53 and calls at lines 137, 153, 183 and 202 |
| `markDeferred` in `lib/relaunch-core.cjs` | Stamps `deferredAt` on a pending record under the lock | unchanged | `git show --stat eaf24f999e` lists no `lib/` file |
| `acceptsRecord` in `lib/withdraw.cjs` | Withdraws an armed record or a pending one with `deferredAt` | unchanged | `git show --stat eaf24f999e` lists no `lib/` file |
| `pendingHandOver` in `claude/subagent-guard.mjs` | Refuses a dialog while the record is pending | not a consumer of the change | The guard reads the record and is not edited, so the dialog stays refused until the prompt withdraws the record |
| The Codex Stop adapter | Leaves a record it cannot arm unmarked | unchanged | `git diff eaf24f999e^ eaf24f999e --stat -- .skilled/hooks/session-relaunch/codex` prints nothing |
| `ARM_CASES` in `tests/adapter-conformance.test.cjs` | Runs one no-target case against every runtime | update | `rg -n 'assertStillPending' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` prints lines 414 and 465 |

Required inventories:
- Same-class producers: `rg -n 'markDeferred' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints the import at line 21 and the one call inside `markParked` at line 55, so every stamp Stop writes now goes through one helper.
- Consumers of changed symbols: the stamp is read by `acceptsRecord` in `lib/withdraw.cjs` and nothing else changed shape. The record's key set is the same.
- Matrix axes: the path that leaves the record pending (missing transcript path, background tasks, unresolved target, thrown arm). The three new tests cover the first, third and fourth rows and the existing test `stop-arm defers pending state when background tasks exist and logs the reason` (`tests/claude-adapters.test.cjs:683`) asserts the stamp for the second.
- Algorithm invariant: a record is stamped only when it is still `pending` and Stop found it armable, so an armed or withdrawn record is never stamped.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the pre-change Stop hook and confirms that the three paths left the record unmarked. Implementation renames two tests and adds one so that all three expect the stamp, then adds `markParked` and its calls until they pass, adjusts the conformance case and edits the README. Verification runs the three tests, the whole relaunch and OpenCode plugin suites and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `armPendingRecord` called in process with `cwd: 1n` so the arm throws | `node:test` |
| Integration | The Stop hook run as a child process in a sandbox for the missing path and the unresolved target | `node:test` |
| Manual | None. No live hop is run in this phase | Not run |

The three tests run first and must show 3 failing, saved to `scratch/red.txt`. After the edit the same command must show 3 passing, saved to `scratch/green.txt`. The whole suite then runs once at the final tree.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `markDeferred` in `lib/relaunch-core.cjs` | Internal | Green | The helper would need its own locked write |
| `withdraw.cjs` and the `UserPromptSubmit` nudge | Internal | Green | The stamp would have no reader and the record would stay parked |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a prompt withdraws a hand-over the operator meant to keep, or any relaunch test fails after the edit.
- **Procedure**: revert commit `eaf24f999e`. No record format changes, so a record stamped before the revert still reads.
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
| Setup | The background-task stamp and the prompt withdrawal already in place | Implementation |
| Implementation | The pre-change hook confirmed to leave the record unmarked on the three paths | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
