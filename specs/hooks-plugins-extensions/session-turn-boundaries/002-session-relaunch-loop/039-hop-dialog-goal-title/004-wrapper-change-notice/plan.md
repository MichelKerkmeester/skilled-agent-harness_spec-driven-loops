---
title: "Implementation Plan: Phase 4: wrapper-change-notice"
description: "Take a checksum of the wrapper file before the loop starts and compare it at the end of each hop branch, test first, so a hop that runs on stale wrapper code prints one stderr line that names the restart."
trigger_phrases:
  - "wrapper change notice plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: wrapper-change-notice

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash in the wrapper, JavaScript CommonJS in the tests |
| **Framework** | None, Node built-in modules for the tests |
| **Storage** | None. The checksum lives in one shell variable for the life of the loop |
| **Testing** | `node:test` with `node:assert/strict` |

### Overview
`.skilled/bin/skilled-loop` gains a `wrapper_checksum` function and a `started_wrapper_checksum` variable taken before the `while true` loop. The end of the hop branch compares the two and prints one stderr line when they differ. The proof is one test that fails before the edit, one that guards the unchanged case, and the whole relaunch and OpenCode plugin suite.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] `git show 89e246760e^:.skilled/bin/skilled-loop | rg -n 'cksum|checksum|changed on disk'` prints nothing, so the wrapper had no check of its own file before the change

### Definition of Done
- [x] All acceptance criteria met
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Checksum at start, compare at hop.

### Key Components
- **`wrapper_checksum` in `.skilled/bin/skilled-loop`**: prints `cksum` of the wrapper file and prints nothing when the file cannot be read. Without it the two checksums could not be taken the same way.
- **`started_wrapper_checksum`**: holds the value taken before the first launch. Without it nothing marks the code the loop started with.
- **The stderr line at the end of the hop branch**: compares and prints. Without it the operator is never told.

### Data Flow
The wrapper takes `started_wrapper_checksum` once, before the loop. Each hop that reaches the end of the hop branch runs `wrapper_checksum` again and compares. A difference prints `note: skilled-loop changed on disk after this loop started, restart the wrapper to run the new code` on stderr. The hop then launches the receiver on the code the loop already holds.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/bin/skilled-loop` | The wrapper that loops and hops | update | `rg -n 'wrapper_checksum\|started_wrapper_checksum\|changed on disk' .skilled/bin/skilled-loop` prints lines 34, 1208, 1469 and 1471 at commit `89e246760e` |
| `skilled-loop-wrapper-harness.cjs` | Installs the wrapper copy and the runtime stub | update | `rg -n 'WRAPPER_APPEND' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` prints lines 213 and 215 |
| `skilled-loop-wrapper-launch-arguments.test.cjs` | Runs the wrapper against the stub | update | `scratch/green.txt:2` and `scratch/green.txt:3` show both new tests passing |
| `.skilled/hooks/session-relaunch/README.md` | Describes the wrapper to the operator | update | `rg -n 'changed on disk' .skilled/hooks/session-relaunch/README.md` prints line 112 |
| The relaunch record schema and the session-relaunch CLI | Carry the hop's state | not a consumer | `git show --stat 89e246760e` lists no file under `lib/` or `bin/` of the hook |

Required inventories:
- Same-class producers: `rg -l 'skilled-loop changed on disk' .skilled` prints the wrapper, the README and the wrapper test file. Only the wrapper prints the note.
- Consumers of changed symbols: `wrapper_checksum` and `started_wrapper_checksum` are read only inside `.skilled/bin/skilled-loop`. The harness switch is read only by the stub.
- Matrix axes: wrapper file (unchanged, appended during the first launch). The two tests cover both rows. An unreadable file has no test row.
- Algorithm invariant: the notice prints only when the checksum at the hop differs from the checksum at start, and the hop is never blocked by it.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the wrapper before the change and confirms it held no check of its own file. Implementation adds the harness switch and the two tests, then adds the checksum function, the start variable and the stderr line until they pass. Verification runs the two tests, the whole relaunch and OpenCode plugin suite and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. The wrapper is a script and has no unit seam | Not run |
| Integration | The wrapper copy run against a runtime stub that appends to the copy during the first launch, then once with no append | `node:test` |
| Manual | None. No live hop is run in this phase | Not run |

The two new tests run first and must show 1 pass and 1 fail, saved to `scratch/red.txt`. After the edit the same command must show 2 of 2, saved to `scratch/green.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cksum` | External | Green | The checksum would be empty at start and at each hop, so no notice would print |
| Wrapper test harness `installWrapperCopy` | Internal | Green | The test would need its own wrapper copy |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a hop prints the note with an unchanged wrapper, or any relaunch test fails after the edit.
- **Procedure**: revert commit `89e246760e`. No record format changes, so a record written before the revert still reads.
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
| Setup | The research finding that the wrapper has no check of its own file | Implementation |
| Implementation | The wrapper confirmed to hold no checksum before the change | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
