---
title: "Implementation Plan: Phase 12: wrapper-notice-log"
description: "Make the wrapper change notice durable and honest, test first: one wrapper-changed line in relaunch.log when the note prints, and no note for a wrapper file that cannot be read at the hop."
trigger_phrases:
  - "wrapper notice log plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: wrapper-notice-log

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash in the wrapper, JavaScript (CommonJS) in the core and the tests |
| **Framework** | None, Node built-in modules |
| **Storage** | `relaunch.log` in the relaunch state directory, appended through the core |
| **Testing** | `node:test` with `node:assert/strict`, through the wrapper harness |

### Overview
The notice block of `.skilled/bin/skilled-loop` reads the checksum once, does nothing when it is empty, and otherwise prints the note and appends one `wrapper-changed` line through the core's `appendLog`. Two tests fail before the edit: one reads the log after a hop under a changed wrapper, the other runs a hop whose wrapper copy cannot be read. The proof is the four tests the name pattern `wrapper file` selects and the whole relaunch and OpenCode plugin run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] `rg -c 'wrapper-changed' .skilled/bin/skilled-loop .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/bin .skilled/hooks/session-relaunch/tests` prints nothing with exit 1, so no log line exists before the fix

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `scratch/green.txt` prints `ℹ pass 4` and `ℹ fail 0` for the name pattern `wrapper file`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guarded notice block.

### Key Components
- **The notice block of `.skilled/bin/skilled-loop` (lines 1469 to 1472)**: compares the wrapper checksum with the one taken at line 1208. Without the change it prints to stderr only and treats an empty read as a change.
- **`appendLog` in `lib/relaunch-core.cjs` (line 1732)**: appends one event line to `relaunch.log`. Reused unchanged.

### Data Flow
Before a hop the wrapper reads its own checksum into one variable. An empty value ends the block. A value that differs from the start checksum prints the stderr note and then runs `node -e` with the core path and the loop id as arguments, which calls `appendLog('wrapper-changed', { loopId })`. The call's output is discarded and its failure is ignored, so the hop goes ahead in every case.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The notice block of `skilled-loop` | Prints the stderr note before a hop | update | `rg -n 'wrapper-changed' .skilled/bin/skilled-loop` prints one line |
| `wrapper_checksum` in `skilled-loop` (lines 34 to 36) | Prints the checksum, or nothing for an unreadable file | unchanged | `git show` of the fix commit shows no change above line 1460 of the wrapper |
| `appendLog` in `relaunch-core.cjs` | Writes `relaunch.log` lines | unchanged | `git show --stat` of the fix commit does not list `relaunch-core.cjs` |
| The wrapper harness stub | Can append to the wrapper copy during a run | update | `rg -n 'WRAPPER_APPEND_ON_INVOCATION' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` still prints its lines, and the new option sits beside it |
| The note sentence in the README (line 112) | Says what the wrapper prints | update | `rg -n 'wrapper-changed' .skilled/hooks/session-relaunch/README.md` prints one line |

Required inventories:
- Same-class producers: `rg -n 'wrapper_checksum' .skilled/bin/skilled-loop` prints the definition at 34, the start read at 1208 and the hop read at 1469. Only 1469 compares.
- Consumers of changed symbols: no symbol changes. `relaunch.log` gains one event name, and `rg -n 'wrapper-changed' .skilled .opencode` after the fix lists the wrapper, the test and the README only.
- Matrix axes: the hop-time checksum (equal to the start, different, empty) crossed with the two outputs (stderr note, log line). Three rows, each with a test.
- Algorithm invariant: the block never holds a hop back, and it reports a change only when a checksum was read and differs.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup takes the suite baseline and confirms the notice block and the missing log event. Implementation adds the two failing tests and the harness option, then edits the block until they pass, then adds the README sentence. Verification runs the four selected tests, the whole relaunch and OpenCode plugin run, `bash -n` and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. The block is shell and has no unit seam | Not applicable |
| Integration | The wrapper copy run through the harness with a stub runtime: a changed file, an unchanged file and an unreadable file, each read for stderr, `relaunch.log` and the number of runtime invocations | `node:test` through `skilled-loop-wrapper-harness.cjs` |
| Manual | None. No live hop is run in this phase | Not run |

The two new tests run first with `--test-name-pattern='wrapper file'` and must show 2 pass and 2 fail, saved to `scratch/red.txt`. After the edit the same command must show 4 of 4, saved to `scratch/green.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `appendLog` exported by `lib/relaunch-core.cjs` | Internal | Green | The wrapper would need a new CLI command to write the line |
| `readLog`, `installWrapperCopy` and `runWrapperScript` in the wrapper harness | Internal | Green | The tests would need their own sandbox |
| Node.js test runner, `bash`, `cksum` and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a hop is held back or fails at the notice block, or any relaunch test fails after the edit.
- **Procedure**: revert the fix commit. No record format changes. A `wrapper-changed` line already in `relaunch.log` is plain text that no reader parses.
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
| Setup | The notice built in phase 4 | Implementation |
| Implementation | The baseline count and the two red tests | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
