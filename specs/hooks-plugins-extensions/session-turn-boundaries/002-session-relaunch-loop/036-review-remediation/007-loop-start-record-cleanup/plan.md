---
title: "Implementation Plan: Phase 7: loop-start-record-cleanup"
description: "Remove the wrapper's own leftover `relaunch-<loop id>.json` before the first launch in `.skilled/bin/skilled-loop`, build the path through the core's `relaunchFilePath`, and add a regression case with a planted record."
trigger_phrases:
  - "loop start record cleanup plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: loop-start-record-cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2+ for the wrapper, Node.js for the test runner |
| **Framework** | None, the wrapper is one shell script |
| **Storage** | The per-user relaunch state directory holds `relaunch-<loop id>.json`, and its format does not change |
| **Testing** | `node --test` with `node:assert/strict` |

### Overview
Change the startup section of `.skilled/bin/skilled-loop` so it removes the one record file that carries its own loop id before the launch loop starts. Build that path through the core's exported `relaunchFilePath`, so the state-directory rule keeps one owner, and ignore a removal failure so the launch goes on. Prove it in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` with a launcher that plants `relaunch-$$.json` and then `exec`s the wrapper, where the case fails before the change and the whole suite passes after it.
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
- [x] `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single startup cleanup

### Key Components
- **The startup section of `.skilled/bin/skilled-loop`**: exports `SKILLED_LOOP_ID="$$"` at line 799 and starts the first launch at line 813. No function encloses line 799, because the last function in the file closes at line 581.
- **`relaunchFilePath` in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`**: builds and validates `relaunch-<loop id>.json` in the per-user state directory, defined at line 282.
- **The regression case in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`**: plants the record from a launcher that writes its own `$$` and then `exec`s the wrapper.

### Data Flow
The wrapper sets `SKILLED_LOOP_ID` from its process id, asks the core for the one record path that id names, removes that file with `rm -f --` and ignores a removal failure, then enters the launch loop at line 813. No other path is built and no record field is read, so another loop's record is never opened.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Finding class: `instance-only`. The wrapper names its own record in one place, the `SKILLED_LOOP_ID="$$"` export at line 799, and the record path has one builder, `relaunchFilePath`.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The startup section of `.skilled/bin/skilled-loop` | Owns the loop id export at line 799 and starts the launch loop at line 813 | update | `rg -n 'SKILLED_LOOP_ID' .skilled/bin/skilled-loop` prints the export and the cleanup's loop id read |
| `relaunchFilePath` in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Builds and validates the record path from a loop id, defined at line 282 | unchanged, the cleanup calls it and adds no path rule | `rg -n '^function relaunchFilePath' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints one line |
| `should-relaunch` and `consume` in `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Read a record by `--loop-id` after the runtime exits | not a consumer, the cleanup only removes a file before the launch | `rg -n 'should-relaunch --loop-id' .skilled/bin/skilled-loop` prints one line |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Spawns the wrapper in a sandbox whose `XDG_RUNTIME_DIR` holds the records | update | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 |
| `.skilled/hooks/session-relaunch/README.md` | Says the wrapper exports one loop id at line 85 and states no record lifetime | not a consumer, the sentence stays true | `rg -n 'exports one loop id' .skilled/hooks/session-relaunch/README.md` prints one line |

Required inventories:
- Same-class producers: `rg -n 'SKILLED_LOOP_ID="\$\$"' .skilled/bin/skilled-loop` prints one line.
- Consumers of changed symbols: `rg -n 'relaunchFilePath|SKILLED_LOOP_ID' .skilled/hooks/session-relaunch .skilled/bin/skilled-loop --glob '*.cjs' --glob '*.md'` prints the path builder, the wrapper export and every CLI read.
- Matrix axes: record state at start (present or absent) times record owner (the wrapper's own loop id or another loop id). Minimum rows: 4, plus one row for an own record that cannot be removed.
- Algorithm invariant: at most one path may be removed and it must be `relaunchFilePath($$, env)` inside `stateDir(env)`. No other file is opened, renamed or removed, and the cleanup runs before the launch loop. Adversarial cases: no record, another loop's record, an own record that is a symlink, and a state directory that does not exist.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the Setup, Implementation and Verification checkboxes and task state.

- Setup reads the loop id export and `relaunchFilePath`.
- Implementation writes the failing planted-record case first, then removes the wrapper's own record at startup in `.skilled/bin/skilled-loop`.
- Verification runs the full wrapper suite, the comment-hygiene check and the strict validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `relaunchFilePath` path building, unchanged and called by the cleanup | `node --test` with `node:assert/strict` |
| Integration | The wrapper's first launch with a planted record in the suite's sandbox | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` |
| Manual | N/A: the suite spawns the wrapper with stub runtimes, so no manual launch is needed | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `node` with `node --test` | Internal | Green | No regression case can run and the handoff criterion cannot be met |
| `bash` 3.2+ | Internal | Green | The wrapper cannot run, so the cleanup cannot execute |
| Phase 003's edits to `.skilled/bin/skilled-loop` | Internal | Yellow | The cleanup must land after those edits and rebase onto the changed startup section |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the cleanup removes a record whose loop id is not the wrapper's, or the wrapper suite fails outside the two new cases.
- **Procedure**: revert the commit that changes `.skilled/bin/skilled-loop` and `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`, then run `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` and confirm it exits 0.
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
| Setup | - | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet close |
<!-- /ANCHOR:phase-deps -->

---
