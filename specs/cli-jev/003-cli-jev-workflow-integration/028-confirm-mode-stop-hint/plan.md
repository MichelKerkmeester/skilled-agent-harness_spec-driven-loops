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
- [x] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel. Evidence: the build ran under the release; the build commit `97200ea481` sits directly on phase 027's closure commit `c91420429b`, and phase 027 reads `Status | Complete` (`git log` at this closure pass)
- [x] Phase 027's report format is fixed in its build, so the reader has a real shape to parse. Evidence: 027's final report (`$SP/w4v/027/c2a-out/report.json`, 5,721 bytes, 16 lineages, `gate.label.passed=false`) was read by this phase's session runs; the reader's shapes and refusals are pinned in `V` (`SE` section 2; design section 1)
- [x] The Keep Rule is unchanged since this spec was written. Evidence: no fix touched `decideVerdict`; the two P1 fixes changed the requalify comparison and its test, and `V` cases 16 to 23 pin the Keep Rule's fixed order and every outcome (`SE` section 3; `scratch/w4-build/logs/c4.check.txt`)

### Definition of Done
- [x] The vitest file exits 0 with at least 10 passed tests and 0 failed. Evidence: `Tests 28 passed (28)`, exit 0 (`scratch/w4-build/logs/c6g.check.txt`; `SE` section 2)
- [x] One run on a real 027 report printed each column's verdict, or the phase closed on `stop: rater report has no confirmed gold`. Evidence: the default run and the `--jev --deem` run on 027's final report printed `stop: rater report has no confirmed gold`, exit 0; no verdict line exists (`SE` section 2; facts.txt)
- [x] `git status --porcelain` is the same before and after every run, and no workflow YAML changed. Evidence: porcelain outside `specs/` was equal before and after every run; `git diff --stat .skilled/commands/deep/assets/` is empty at this closure pass and the commit `97200ea481` touches no workflow YAML (`SE` sections 2 and 5)
- [x] `validate_document.py` exits 0 on every skill doc the phase changed (parent D6). Evidence: exit 0 on all eight changed docs, including both index roots (`SE` section 2; the doc briefs' checks)
- [x] A cross-family review leaves no open P0 or P1 finding, and the runtime vitest suite fails nothing beyond its baseline (parent D5). Evidence: the code review printed `VERDICT: FAIL` with 2 P1 and 2 P2, both P1s closed by c6f and c6g and the recheck prints `VERDICT: PASS`; the docs review printed `VERDICT: PASS` with 1 P2 fixed by f1 and a `VERDICT: PASS` recheck, 1 P2 recorded; the suite from the staged state printed 126 files and 2,456 tests all passing against 027's 125 files and 2,428 tests (`SE` sections 2 and 3)
- [x] Every stop or verdict line is in `goal.md`'s log for the parent's log. Evidence: `stop: rater report has no confirmed gold` is in `goal.md`'s log and `implementation-summary.md` Verification, recorded by this closure pass; no verdict line was printed (`SE` section 2; facts.txt)
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

**Who builds (parent D5, amended on 2026-09-29).** Only Pi writes, with no Claude leaves: DeepSeek V4.1 Flash on Cline at `--thinking xhigh`, then OpenCode Go, then LLM Gateway at `--thinking max`, and `llmgateway/mimo-v2.6-pro` at `high`. The session writes one single-change brief per step, runs the CLI executors by Bash only, verifies each step against its check, gets a cross-family review (a file goes to the family that did not write it), fixes P0 and P1 findings, records P2 findings and commits path-scoped. Code follows sk-code's OpenCode route, and the docs go through sk-doc (parent D6).

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
