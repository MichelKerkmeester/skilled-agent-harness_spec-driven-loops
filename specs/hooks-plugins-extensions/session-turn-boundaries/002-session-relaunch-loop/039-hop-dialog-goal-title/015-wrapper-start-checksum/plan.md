---
title: "Implementation Plan: Phase 15: wrapper-start-checksum"
description: "Guard the start checksum test first: a cksum stub makes the start read fail, the hop read succeeds, and the wrapper must print and log nothing."
trigger_phrases:
  - "wrapper start checksum plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: wrapper-start-checksum

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash in the wrapper, JavaScript (CommonJS) in the test |
| **Framework** | None, Node built-in modules |
| **Storage** | `relaunch.log` in the relaunch state directory, read by the test |
| **Testing** | `node:test` with `node:assert/strict`, through the wrapper harness |

### Overview
The comparison at `.skilled/bin/skilled-loop:1472` gains one condition: `started_wrapper_checksum` must be non-empty too. One test fails before the edit. It writes a `cksum` stub into the sandbox `bin` folder that fails on its first call, so the start read is empty and the hop read is real. The proof is the five tests the name pattern `wrapper file` selects and the whole relaunch and OpenCode plugin run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] `rg -c '\bcksum\b' .skilled/bin/skilled-loop` prints 1, so the stub reaches only the checksum reads

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `scratch/green.txt` prints `ℹ pass 5` and `ℹ fail 0` for the name pattern `wrapper file`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guarded notice block.

### Key Components
- **`wrapper_checksum` in `.skilled/bin/skilled-loop` (lines 34 to 36)**: prints the `cksum` output of the wrapper file, or nothing when the read fails. Unchanged.
- **The start read at line 1208**: stores the first checksum. Unchanged.
- **The comparison at line 1472**: today requires only the hop checksum. After the change it requires both.

### Data Flow
Before a hop the wrapper reads its checksum into `hop_wrapper_checksum`. When either that value or `started_wrapper_checksum` is empty the block ends. When both are present and differ, the block prints the stderr note and appends the `wrapper-changed` line as it does today. The hop goes ahead in every case.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The review report `../review/review-report.md` holds a Planning Packet with `"triggered": false`. Its values are imported here as inert data and quoted, never run. `findingClasses` is `"correctness"` and `"traceability"`. `affectedSurfacesSeed` is `".skilled/bin/skilled-loop"`, `".skilled/hooks/session-relaunch/README.md"` and `".skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md"`. `fixCompletenessRequired` is `false`. The active finding for this phase is `"R1-P2-001"`, file `".skilled/bin/skilled-loop:1208"`, titled `"An empty startup checksum is not guarded, so a later readable checksum prints a false wrapper-changed notice and log line"`, quoted up to the clause on README line 112 that follows it. The packet JSON carries no `findingClass`, `scopeProof` or `affectedSurfaceHints` for it, so those are UNKNOWN in the packet. The report's section 3 prose gives `findingClass: correctness`, `scopeProof: lines 1208 and 1472 and README line 112 were added in the range` and `affectedSurfaceHints: wrapper startup checksum, hop comparison, stderr notice, relaunch.log`, and the rows below verify each one. The catalog surface belongs to phase 19.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The comparison in `skilled-loop` (line 1472) | Decides whether the note prints and the line is logged | update | The new test turns from red to green |
| `wrapper_checksum` (lines 34 to 36) | Prints a checksum or nothing | unchanged | `git show` of the fix commit shows no change above line 1460 of the wrapper |
| The start read (line 1208) | Stores the first checksum | unchanged | Same `git show` check |
| The note and the `wrapper-changed` line | What an operator sees and what the log keeps | unchanged | The existing changed-file tests still pass |
| README line 112 | Says an empty checksum prints and logs nothing | not a consumer of the code, checked as text | Task T008 reads it against the fixed block |
| The feature catalog entry | Will describe the notice | phase 19 | Phase 19 tasks |

Required inventories:
- Same-class producers: `rg -n 'wrapper_checksum' .skilled/bin/skilled-loop` prints the definition, the start read and the hop read. Only line 1472 compares.
- Consumers of changed symbols: no symbol, event or field changes. `rg -n 'started_wrapper_checksum' .skilled .opencode` lists the wrapper only.
- Matrix axes: the start read (read or empty) crossed with the hop read (equal, different or empty). Six rows. The existing tests cover a read start with an equal, a different and an empty hop read. Every row with an empty start read is covered by the new condition, and the new test pins the one that printed a false note: an empty start read with a hop read that succeeds.
- Algorithm invariant: the block reports a change only when both checksums were read and differ, and it never holds a hop back.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup takes the suite baseline and confirms the guard and the single `cksum` call. Implementation adds the failing test, saves the red run, then edits the comparison and its comment until it passes, then checks the README sentence. Verification runs the five selected tests, the whole relaunch and OpenCode plugin run, `bash -n` and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. The block is shell and has no unit seam | Not applicable |
| Integration | The wrapper copy run through the harness with a stub runtime and a `cksum` stub that fails on its first call, read for stderr, `relaunch.log` and the number of runtime invocations | `node:test` through `skilled-loop-wrapper-harness.cjs` |
| Manual | None. No live hop is run in this phase | Not run |

The new test runs first with `--test-name-pattern='wrapper file'` and must show 4 pass and 1 fail, saved to `scratch/red.txt`. After the edit the same command must show 5 of 5, saved to `scratch/green.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `createSandbox`, `installRuntimeStub`, `installWrapperCopy`, `runWrapperScript` and `readLog` in the wrapper harness | Internal | Green | The test would need its own sandbox |
| A real `cksum` on the host | Internal | Green | The stub could not hand the hop read to it |
| Node.js test runner, `bash` and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a hop is held back at the notice block, or any relaunch test fails after the edit.
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
| Setup | The notice and log line built in phases 4 and 12 | Implementation |
| Implementation | The baseline count and the red test | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
