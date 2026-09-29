---
title: "Implementation Plan: Phase 28: confirm-mode-stop-hint"
description: "Build one read-only evaluator in the system-deep-loop runtime that reads phase 027's replay report, turns each signal column's stop into a confirm-mode hint and prints whether the hint would be right and save iterations often enough to show, with no model call in any mode."
trigger_phrases:
  - "stop hint evaluator plan"
  - "score-stop-hint build"
  - "confirm-mode hint precision plan"
  - "rater report reader"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 28: confirm-mode-stop-hint

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (`.cjs`), standard library only |
| **Framework** | None. The script reads JSON and spawns nothing |
| **Storage** | None. Reads 027's report and writes only to an operator-named directory |
| **Testing** | Vitest, the `system-deep-loop/runtime` config (`tests/**/*.{vitest,test}.ts`) |

### Overview

`score-stop-hint.cjs` (proposed) reads one `report.json` from phase 027, checks that its label gate passed and, per signal column, turns the column's replayed stop into a hint iteration. It counts right hints (at or after the gold, before the recorded stop) and wrong ones (before the gold) and prints one verdict per column under spec section 4's Keep Rule. `legacy` and `sources` print by default. `--jev` and `--deem` add 027's recorded rater columns. No mode calls a model, because the research gives R9 no judgment at use time.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel
- [ ] Phase 027's report format is fixed in its build, so the reader has a real shape to parse
- [ ] The Keep Rule is unchanged since this spec was written

### Definition of Done
- [ ] The vitest file exits 0 with at least 10 passed tests and 0 failed
- [ ] One run on a real 027 report printed each column's verdict, or the phase closed on `stop: rater report has no confirmed gold`
- [ ] `git status --porcelain` is the same before and after every run, and no workflow YAML changed
- [ ] `validate_document.py` exits 0 on every skill doc the phase changed (parent D6)
- [ ] A cross-family review leaves no open P0 or P1 finding, and the runtime vitest suite fails nothing beyond its baseline (parent D5)
- [ ] Every stop or verdict line is in `goal.md`'s log for the parent's log
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file offline evaluator with exported pure functions for the tests and a `main()` behind `require.main === module`.

### Key Components
- **Report reader**: parses 027's `report.json`, checks the label-gate state and hashes the file.
- **Hint counter**: REQ-003's rule per column and lineage, giving W, L, no-hint counts and iterations saved.
- **Column selector**: `legacy` and `sources` always, `jev` and `deem` on their switches, each with its skip line when 027 recorded none.
- **Verdict**: the Keep Rule in its fixed order and the proposed hint line for a kept column.

### Data Flow

027's report becomes per-lineage stops. Each selected column turns its stops into hints, the counter scores them against the gold and the recorded stop, and the verdict applies the rule. Nothing flows back into any loop.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

**Who builds (parent D5).** A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief per step and runs the CLI executors by Bash only: Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` at thinking `high`. The orchestrator session verifies each step, gets a cross-family review of the code, fixes P0 and P1 findings, records P2 findings and commits path-scoped. Code follows sk-code's OpenCode route, and the docs go through sk-doc (parent D6).

Each step's observable check:

1. **Baseline.** Record the runtime vitest pass count at HEAD. Check: the number is in `goal.md`'s log.
2. **Report reader.** Check: a passed fixture parses, an ungated one prints `stop: rater report has no confirmed gold`, a broken one exits 2.
3. **Hint counter.** Check: the fixture's right, wrong and saved counts match hand-written values.
4. **Columns and verdict.** Check: the skip lines, the byte-identical default output and the `keep`, `kill` and `stop (precision)` cases pass.
5. **Run.** One run on the real 027 report once 027 has one. Check: each verdict line goes in `goal.md`'s log.
6. **Skill docs.** Check: `validate_document.py` exits 0 on each changed doc.
7. **Review and commit.** Check: no open P0 or P1, and the runtime suite fails nothing beyond step 1's baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Report reader, hint counter, each Keep Rule step, the proposed line for a kept column | Vitest with fixture 027 reports |
| Integration | Default run, `--jev` and `--deem` skip lines on a report without those columns, stub `jev` and `cli-deem` first on `PATH` logging nothing | Vitest |
| Manual | One run on the real 027 report | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The operator's release | Operator | Given 2026-09-29: "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel | Nothing is built |
| Phase 027's gated report | Internal | Planned | Step 5 waits. Steps 1 to 4 run on fixtures |
| Phases 027, 029 and 030 | Internal | Planned | Shared doc files, so doc steps run one after another |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A test fails after merge, a run writes outside its report directory, or the operator drops R9.
- **Procedure**: Revert the phase's path-scoped commits: the script, its test, the README rows and the skill docs, then regenerate any generated copy they touched. No gate or loop changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
