---
title: "Implementation Plan: Phase 27: stop-second-rater"
description: "Build one read-only replay script in the system-deep-loop runtime that derives a stop gold per archived lineage, scores three zero-call stop methods, stops at the operator's five-lineage gate, then runs a Jev and a Deem novelty score per iteration behind their own switches and prints one verdict per column."
trigger_phrases:
  - "stop rater replay plan"
  - "score-stop-rater build"
  - "stop gold derivation"
  - "novelty score arm plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 27: stop-second-rater

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (`.cjs`), standard library only, like the other `system-deep-loop/runtime/scripts/` entries |
| **Framework** | None. The script spawns `jev` and `cli-deem` as binaries, and `git cat-file` for the published-only check |
| **Storage** | None. Reads tracked lineage files and writes only to an operator-named directory |
| **Testing** | Vitest, the `system-deep-loop/runtime` config (`tests/**/*.{vitest,test}.ts`) |

### Overview

`score-stop-rater.cjs` (proposed) walks the tracked research lineages, keeps those whose config lets a stop move, derives each one's gold from first-appearance cited sources and replays three zero-call stop methods. It prints the census and the headroom line first. Past the operator's five-lineage gate, behind `--jev` or `--deem` and a passing gate, it asks one novelty `score` per iteration, replays the legacy vote on those levels and prints one verdict line per backend column under spec section 4's Keep Rule. Jev first, then Deem (parent D1).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator released this phase on 2026-09-29: the "Bind and release" answer amended parent D3, so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel
- [ ] The Keep Rule, the call shape of REQ-008 and the 24,000-character bound are unchanged since this spec was written
- [ ] Phase 008's `cli-deem` answers `health`, for the Deem arm only
- [ ] `jev --version` prints `jev 0.6.2` and `jev auth status --provider P` exits 0, for a `--jev` run only

### Definition of Done
- [ ] The vitest file exits 0 with at least 20 passed tests and 0 failed
- [ ] The default run printed its census, and either `no headroom`, a label-gate stop line or one verdict line per model column that ran
- [ ] `git status --porcelain` is the same before and after every run, and the build commit changes only spec section 3's paths and this folder
- [ ] `validate_document.py` exits 0 on every skill doc the phase changed (parent D6)
- [ ] A cross-family review leaves no open P0 or P1 finding, and the runtime vitest suite fails nothing beyond its baseline recorded before the build (parent D5)
- [ ] The census numbers and every stop or verdict line are in `goal.md`'s log for the parent's log
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file offline measurement script with exported pure functions for the tests and a `main()` behind `require.main === module`, the shape of `runtime/scripts/fanout-merge.cjs:1404-1420`.

### Key Components
- **Lineage walker**: `git ls-files` for `deep-research-state.jsonl`, reads the config beside each, applies REQ-002's movable rule and the `deltas/` check, and orders the sample.
- **Gold deriver**: reads `deltas/iter-NNN.jsonl`, tracks first-appearance sources and returns g or `no gold`.
- **Vote replayer**: one function for the legacy vote of `deep-research-confirm.yaml:648-661`, fed either recorded ratios, source ratios or model levels. The same function serves every method, so the arms differ from `legacy` only in their input.
- **Label gate**: reads `--gold-reads` and prints the two stop lines of REQ-006.
- **Jev arm and Deem arm**: phase 002's gates, the payload notice, the `score` calls, exit handling and one shared `calls.jsonl` writer.
- **Verdict**: the Keep Rule in its fixed order, integer counts, an exact binomial p and the line on stdout and in `report.json`.

### Data Flow

Tracked state files become a lineage set. Each lineage gets a gold and three zero-call stops. The census picks the baseline and prints headroom. The label gate either stops or passes. Past it, each backend scores each iteration, the replayer turns the levels into a stop and the verdict compares that stop with the baseline's on the lineages the backend measured.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

**Who builds (parent D5).** A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief per step and runs the CLI executors by Bash only: Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` at thinking `high`. The orchestrator session verifies each step against its check, gets a cross-family review of the code (Pi reviews Devin's files and Devin reviews Pi's), fixes P0 and P1 findings, records P2 findings and commits path-scoped. Code follows sk-code's OpenCode route. The skill docs go through sk-doc (parent D6).

Each step's observable check:

1. **Baseline.** Record the runtime vitest pass count at HEAD. Check: the number is in `goal.md`'s log before step 2.
2. **Lineage set and gold.** Check: the census prints kept, forced, `no gold` and sampled counts, and the fixture's gold matches its hand-written value.
3. **Zero-call methods and census.** Check: three method lines, the baseline line and the headroom line print, and stub `jev` and `cli-deem` log nothing.
4. **Label gate.** Check: both stop lines print on their fixtures and no stub logs a call.
5. **Model arms.** Jev first, then Deem, each with its gate, notice, calls, exits and records. Check: the stub cases pass and every logged `jev` call carries one `--provider`.
6. **Verdict.** Check: the `keep`, `kill` and `stop (coverage)` cases pass.
7. **Runs.** One zero-call run on the real tree, then, only when the operator's reads file exists and the gate passes, one `--deem --out` run and, on the operator's flag, one `--jev --out` run. Check: the stop line or each verdict line goes in `goal.md`'s log.
8. **Skill docs.** After the runs, so no doc names a verdict that did not print. Check: `validate_document.py` exits 0 on each changed doc.
9. **Review and commit.** Check: no open P0 or P1, and the runtime suite fails nothing beyond step 1's baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Movable filter, gold deriver, each zero-call method, `minIterations`, the vote's weight redistribution, the Keep Rule's order and integer checks | Vitest with a fixture lineage corpus under a temp directory |
| Integration | Default run with stub binaries (no call), both label-gate stops, Jev gate pass and `no credential` skip, Deem fake health pass and stub-backend skip byte-identical, Deem exit 4 with a new pair, an unpublished lineage withheld from Jev, `--jev` without `--out` exit 2 | Vitest with stub `jev` and `cli-deem` first on `PATH` |
| Manual | One zero-call run on the real tree, then the gated model runs | Terminal, operator-named `--out` directory |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The operator's release | Operator | Given 2026-09-29: "Bind and release" amended parent D3. Builds run in number order, and disjoint builds may run in parallel | Nothing is built |
| The operator's five-lineage reads file | Operator | Not written | Every model arm stops at the gate. The phase can still close there |
| Phase 008 `cli-deem` | Internal | Complete | The Deem arm cannot run |
| Local Deem server | External, operator-run | Served per `deem-local.md` | The Deem arm prints its skip line |
| `jev` 0.6.2 and a credential for P | External, operator-held | Used once by 017 on 2026-09-29 | The Jev arm prints its skip line |
| Phases 028, 029 and 030 | Internal | Planned | They share this phase's doc files, so doc steps run one after another |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A test fails after merge, a run writes outside its report directory, or the operator drops R8 after a `kill` or `stop`.
- **Procedure**: Revert the phase's path-scoped commits: the script, its test, the README rows and the skill docs of spec section 3, then regenerate any generated copy those commits touched. Delete the report directory if the operator named one inside the repository. No live path changed, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---
