---
title: "Implementation Plan: Phase 35: suite-metrics-and-start-shape"
description: "Give the advisor suite its own temp folder from vitest.config.ts, and have the scorer report and tally the shape of every start, then prove both on the shared folder and the committed 033 lines."
trigger_phrases:
  - "suite metrics and start shape plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 35: suite-metrics-and-start-shape

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ES modules and TypeScript tests in the advisor runtime, Vitest |
| **Framework** | `vitest.config.ts`, and `startState`, the tally and `tallyBlock` in `score-command-transcripts.mjs` |
| **Storage** | The shared folder `<os tmpdir>/speckit-skill-advisor-metrics`, read for counts only. Evidence in this phase's `scratch/` |
| **Testing** | `tests/command-transcript-score.vitest.ts`, the full suite, `FLOOR` and `EVAL` |

### Overview
The config makes one `mkdtempSync` folder, sets `process.env.TMPDIR` to it before Vitest starts a worker, so every `tmpdir()` call in tests and their children lands there, and removes it on process exit. `startState` gains an optional checkout folder and a `shape` field. The summary tallies the shape of each counted start, so the split sums to `started`, and prints it as `startShapes`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The worktree is clean and the suite reports 0 failed
- [ ] The shared folder's file and line counts are recorded
- [ ] 034's `summary-rescore.json` is in place as the baseline

### Definition of Done
- [ ] All acceptance criteria met
- [ ] A full suite run leaves the shared counts unchanged and removes its own folder
- [ ] The 033 rescore prints equal rates and splits that sum
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix the producer's environment, not each test, and add a reported field without changing a counted one.

### Key Components
- **`vitest.config.ts`**: the one place every suite run passes through, so one folder there covers every test that writes health records, including those phase 015 listed
- **`startState(events, row, checkoutDir)`**: returns `{started, unsafe, selfAuto, shape}`. Shape order: `skill`, `reported`, `expanded`, `readWrite`, `readOnly`
- **`startShapes`**: a five-key count in `tallyBlock`, filled only where `started` is counted

No new file, module, option or dependency. `TMPDIR` is the variable `tmpdir()` already reads.

### Data Flow
Config load makes the folder and sets `TMPDIR`. Workers and their children inherit it, and `DURABLE_METRICS_ROOT` resolves inside it. On the scorer side, `scoreLine` passes the line's `projectDir` to `startState`, the tally adds the shape of each counted start, and `tallyBlock` prints the counts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `vitest.config.ts` | Suite config | Per-run `TMPDIR` | Shared counts unchanged after a full run |
| `lib/metrics.ts` `DURABLE_METRICS_ROOT` | Resolves under `tmpdir()` | None | Resolves inside the per-run folder |
| `startState` | Judges a start | Adds `shape` and an optional checkout folder | Five shape tests |
| `tallyBlock`, the text summary | Print the start rate | Add `startShapes` | Rescore check |
| `startState`'s `wrote` and `unsafe` | Read any write | Unchanged | Existing tests stay green |

Required inventories:
- Same-class producers: other tests that write into `tmpdir()` all move with `TMPDIR`. No other writer of the shared folder exists in the suite.
- Consumers of changed symbols: `startState` is called once in `scoreLine`. `tallyBlock` feeds `--summary` JSON and text output.
- Matrix axes: five shapes, a row with no expected command, a run that both loaded and read.
- Algorithm invariant: `startShapes` sums to `started` in every block, and `startRate` does not change.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the suite result, the shared folder's counts, `FLOOR` and `EVAL`. Implementation changes `vitest.config.ts`, then `startState`, the tally and `tallyBlock`, with their tests. Verification reruns the suite against the shared counts, rescores the 033 lines and checks every rate and split. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each start shape, and a summary whose split sums to its started count | Vitest |
| Integration | Full suite with the shared folder counted before and after, `FLOOR` and `EVAL` | Vitest, `find`, the capture scripts |
| Manual | None. The rescore check is a committed `jq` filter | `jq` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The five session stores holding the 033 sessions | Internal | Green, 401 of 401 loaded on 2026-11-16 | The rescore check cannot run |
| 034's `summary-rescore.json` | Internal | Green, committed | No baseline for the rates |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a suite failure the change causes, or any start rate that differs from the baseline
- **Procedure**: revert the phase's code commit. The shared folder holds no state this phase wrote, and goal rows get a correction row when wrong
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
| Setup (counts, gates) | A clean worktree | Implementation |
| Implementation (config, scorer, tests) | The before state on file | Verification |
| Verification (suite, rescore, goal row) | A green suite | Close-out |
<!-- /ANCHOR:phase-deps -->

---
