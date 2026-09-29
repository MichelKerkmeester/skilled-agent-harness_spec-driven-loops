---
title: "Implementation Plan: Phase 30: fanout-merge-shadow-record"
description: "Build one read-only pair script in the system-deep-loop runtime that finds near-line and cross-body finding pairs in recorded fan-out runs, reads the merge's own decision on each, stops at the operator's pair-label gate, then runs a Jev and a Deem same-or-different judgment behind their own switches and prints one verdict per column."
trigger_phrases:
  - "fanout pair replay plan"
  - "score-fanout-pairs build"
  - "pair label gate plan"
  - "merge baseline decision"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 30: fanout-merge-shadow-record

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (`.cjs`), standard library plus `require('./fanout-merge.cjs')` for its two exported merge functions |
| **Framework** | None. The script spawns `jev`, `cli-deem` and `git cat-file` as binaries |
| **Storage** | None. Reads tracked lineage registries, writes only to operator-named paths |
| **Testing** | Vitest, the `system-deep-loop/runtime` config (`tests/**/*.{vitest,test}.ts`) |

### Overview

`score-fanout-pairs.cjs` (proposed) walks the tracked fan-out runs, pairs findings across lineages, keeps the near-line and cross-body candidates and asks the merge's own exports whether each pair collapses with dedup on and off. It writes a pair sheet outside the repository and reads the operator's labels. Below 40 labeled pairs or 10 cross-body ones it prints its stop line. Past the gate, behind `--jev` or `--deem` and a passing gate, it asks one `noul` per pair in both orders and prints one verdict per backend column under spec section 4's Keep Rule. Jev first, then Deem (parent D1).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel
- [ ] The Keep Rule, the class bands, the label counts and the `-q` wording are unchanged since this spec was written
- [ ] `mergeResearchRegistries` and `mergeReviewRegistries` are still exported from `fanout-merge.cjs:1404`
- [ ] Phase 008's `cli-deem` answers `health` for the Deem arm, and `jev --version` prints `jev 0.6.2` with `jev auth status --provider P` exiting 0 for a `--jev` run

### Definition of Done
- [ ] The vitest file exits 0 with at least 22 passed tests and 0 failed
- [ ] The census printed on the real tree, and either a gate stop line, `no headroom` or one verdict per model column that ran
- [ ] `fanout-merge.cjs` is unchanged and `git status --porcelain` is the same before and after every run
- [ ] `validate_document.py` exits 0 on every skill doc the phase changed (parent D6)
- [ ] A cross-family review leaves no open P0 or P1 finding, and the runtime vitest suite fails nothing beyond its baseline (parent D5)
- [ ] The census numbers and every stop or verdict line are in `goal.md`'s log for the parent's log
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file offline measurement script with exported pure functions for the tests and a `main()` behind `require.main === module`. It reuses the merge through its public exports only.

### Key Components
- **Run walker and pairer**: finds runs with two or more lineage registries and yields cross-lineage pairs.
- **Classifier**: a selection copy of the body key and title overlap, pinned by a parity test, sorting pairs into `near-line` and `cross-body`.
- **Merge oracle**: calls the exported merge on a two-registry copy per pair, with dedup on and off, and records "same" when the pair collapsed.
- **Pair sheet and label reader**: writes outside the repository, validates `same` or `different` and applies both gate counts.
- **Jev arm and Deem arm**: phase 002's gates, the notice, the published-only check, the order scheme of REQ-008, exit handling and one `calls.jsonl` writer.
- **Verdict**: the Keep Rule in its fixed order with `reader=none named` on every line.

### Data Flow

Lineage registries become cross-lineage pairs. The classifier keeps the two candidate classes, and the merge oracle gives each its baseline decision. The operator's labels turn a sample into K pairs, the gate stops or passes, and past it each backend's modal answer scores against the label and the baseline. The merge code and its outputs are never touched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

**Who builds (parent D5).** A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief per step and runs the CLI executors by Bash only: Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` at thinking `high`. The orchestrator session verifies each step, gets a cross-family review of the code, fixes P0 and P1 findings, records P2 findings and commits path-scoped. Code follows sk-code's OpenCode route, and the docs go through sk-doc (parent D6).

Each step's observable check:

1. **Baseline.** Record the runtime vitest pass count at HEAD. Check: the number is in `goal.md`'s log.
2. **Runs, pairs and classes.** Check: the census prints runs, pairs and both classes, and the parity case agrees with the merge on every fixture pair.
3. **Merge oracle.** Check: a fixture pair that collapses with dedup on and not off reads "same" and "different" in the two decisions.
4. **Pair sheet and gate.** Check: the sheet refuses a path inside the repository, and both stop lines print on their fixtures.
5. **Model arms.** Jev first, then Deem. Check: the stub cases pass, one `--provider` appears on every logged `jev` call and a Deem pair with disagreeing orders is `unstable`.
6. **Verdict.** Check: the `keep`, `kill` and `stop (coverage)` cases pass and every line ends `reader=none named`.
7. **Runs.** One census and one pair sheet on the real tree. Model runs only after the labels pass the gate. Check: the stop or verdict lines go in `goal.md`'s log.
8. **Skill docs.** Check: `validate_document.py` exits 0 on each changed doc.
9. **Review and commit.** Check: no open P0 or P1, `fanout-merge.cjs` unchanged, and the runtime suite fails nothing beyond step 1's baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Run walker, pairer, both classes with in-band and out-of-band pairs, the selection parity, the merge oracle, label reader, both gate counts, headroom, each Keep Rule step | Vitest with fixture lineage registries in a temp directory |
| Integration | Default run with stub binaries, pair sheet inside and outside the repository, Jev gate pass and `no credential` skip, Deem fake health and stub-backend skip byte-identical, Deem exit 4 with a new pair, an unpublished pair withheld from Jev, `--jev` without `--out` exit 2 | Vitest with stub `jev` and `cli-deem` first on `PATH` |
| Manual | One census and one pair sheet on the real tree, then gated model runs | Terminal, operator-named paths |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The operator's release | Operator | Given 2026-09-29: "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel | Nothing is built |
| The operator's pair labels | Operator | Not written | Every model arm stops at the gate. The phase can close there |
| `fanout-merge.cjs` exports | Internal | Present at `:1404` | The baseline cannot be read without them |
| Phase 008 `cli-deem` and a served Deem | Internal and external | Complete, served per `deem-local.md` | The Deem arm prints its skip line |
| `jev` 0.6.2 and a credential for P | External, operator-held | Used once by 017 on 2026-09-29 | The Jev arm prints its skip line |
| Phases 027, 028 and 029 | Internal | Planned | Shared doc files, so doc steps run one after another |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A test fails after merge, a run writes outside its operator-named paths, or the operator drops R15.
- **Procedure**: Revert the phase's path-scoped commits: the script, its test, the README rows and the skill docs, then regenerate any generated copy they touched. The merge never changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
