---
title: "Implementation Plan: Route Receipts Research"
description: "The conductor reruns the 003 follow-up bench on the final strip rule and stops on the no-guard branch. Otherwise /deep:research:auto runs 3 iterations on Claude Opus 5.5 at high effort through cli-claude-code on the second Claude account, and the conductor re-checks every citation behind the receipt design."
trigger_phrases:
  - "route receipts research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Route Receipts Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSONL research artifacts. The sources read are TypeScript, JavaScript and one Python helper |
| **Framework** | The deep-research loop in `system-deep-loop`, and the advisor's Vitest calibration bench for Q0 |
| **Storage** | Files under `research/` |
| **Testing** | The Q0 bench run, strict spec validation and a citation re-check by the conductor |

### Overview
The conductor first reruns the follow-up bench from phase 003 on the strip rule as phase 006 leaves it, and applies 003's rule unchanged. On the no-guard branch the phase stops and the operator is told. On the over-suppresses branch, one deep-research lineage of 3 iterations answers Q1 to Q5 in `spec.md`. Each iteration is a `claude -p` call on `claude-opus-5-5` at `--effort high`, with `CLAUDE_CONFIG_DIR` set to the second account. The conductor then re-checks every citation behind the recommended design.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 006 to 009 have no open task: `grep -c '^- \[ \] T[0-9]'` prints `:0` for each of their `tasks.md` files
- [ ] `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` exits 0 on the commit Q0 runs on
- [ ] The nine pairs in `runtime/bench/scorer-calibration.bench.ts:94-104` are unchanged since phase 003: `rg -c 'negativeControl: (true|false)' runtime/bench/scorer-calibration.bench.ts` prints 9

### Definition of Done
- [ ] `rg -n 'Q0 branch' implementation-summary.md` prints one line naming the branch
- [ ] On the over-suppresses branch: `rg -c '"type":"iteration"' research/deep-research-state.jsonl` prints 3
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Premise gate, then a single-lineage deep-research loop.

### Key Components
- **Q0 gate**: the existing `logFollowUpRouting` in `runtime/bench/scorer-calibration.bench.ts:216-252` prints `N`, `H` and `Hsame`, and the `advisor-scorer-calibration` line carries `C` and its row ids (`:330`). The bench reads the policy reason from stripped text (`:231`). The conductor adds the raw-text reading with a one-off in-process probe on `dist/`, as in `spec.md` Measured Behavior, and changes no file to do it.
- **`/deep:research:auto`**: owns setup, iteration dispatch, convergence and synthesis.
- **cli-claude-code executor**: runs each iteration as a fresh `claude -p` on the second account.

### Executor, an assumption
The operator did not set an executor for this phase. The plan mirrors phase 005, the closest precedent: its config names `cli-claude-code`, `claude-opus-5-5`, reasoning effort `high`, config dir `/Users/michelkerkmeester/.claude-account2`, a 900-second iteration timeout, 3 iterations and stop policy `max-iterations` (`../005-plan-validation-research/research/deep-research-config.json`). Phase 001 used the same account on Opus 5.5 at medium effort for 5 iterations. The parent goal's Luna rule binds builds only (`../goal.md` D2), so it does not apply to research. If the operator names another executor, that replaces this assumption before T003.

### Data Flow
The bench run feeds the Q0 record. On the over-suppresses branch, the workflow writes the config and strategy, dispatches one iteration at a time and each iteration reads the state and writes its own iteration file and delta. The reducer folds them into the state log. Synthesis writes `research/research.md`, which phase 011's T001 reads.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms phases 006 to 009 are done, rebuilds the advisor and runs Q0, then stops on the no-guard branch. Implementation runs `/deep:research:auto` with `--executor=cli-claude-code --model=claude-opus-5-5 --reasoning-effort=high --config-dir=/Users/michelkerkmeester/.claude-account2 --max-iterations=3 --stop-policy=max-iterations`. Verification counts the iteration records, re-checks the citations behind each recommended design and runs strict validation. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Q0 is the one measurement: `SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts --reporter=verbose` from `runtime/` must exit 0 and print both log lines. The default reporter hides a passing test's console output, so the flag is required (`../003-follow-up-routing-benchmark/implementation-summary.md:81`). After the loop, `rg -c '"type":"iteration"' research/deep-research-state.jsonl` prints 3, and `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `claude` CLI with the second account logged in at `/Users/michelkerkmeester/.claude-account2`, a current advisor build and `SPECKIT_RUN_BENCHES=true` for the bench. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The run writes only under `research/` and into this phase's docs. To discard it, delete `research/`. The Q0 record in `implementation-summary.md` stays, because it is a measurement, not a design.
<!-- /ANCHOR:rollback -->

---
