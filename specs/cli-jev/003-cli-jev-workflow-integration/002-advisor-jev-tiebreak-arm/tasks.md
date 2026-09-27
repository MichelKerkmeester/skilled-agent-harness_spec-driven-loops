---
title: "Tasks: Offline Advisor Jev Tie-Break Arm"
description: "Ordered tasks for the zero-call census with comparators and a power line, the provider-scoped jev key gate, the --jev arm with its verdict and per-call record, the conditional Gate 3 calibration, and the stub and keyed verification runs."
trigger_phrases:
  - "advisor jev tie-break tasks"
  - "score-jev-tiebreak tasks"
  - "jev key gate tasks"
  - "jev arm verification tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Offline Advisor Jev Tie-Break Arm

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Task IDs T001 to T019 keep their numbers from the first plan and were amended in place on 2026-09-27. Tasks added by that amendment start at T020 and sit where they run.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Build the advisor `dist` and confirm the H1 ratchet is green at HEAD (`.skilled/skills/system-skill-advisor/runtime/dist/`)
- [ ] T002 [P] Reopen the cluster rule, the corpus filter, the split and metric functions and the capture env before copying them (`ambiguity.ts:7-8`, `:22-36`, `:44-58`, `score-outcome-rerank.mjs:40-51`, `:85-123`, `capture-scorer-eval-baseline.mjs:35-50`, `:70-76`)
- [ ] T003 [P] Write a stub `jev` in a temporary directory that logs its arguments and answers per case, for the gate, exit-code and hang runs (outside the repository)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Set the capture's exact env before any `dist` import: a fresh `mkdtemp` DB directory, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`, `PYTHONDONTWRITEBYTECODE=1`, `VITEST=true` and the three lane variables deleted. Load the three corpus files, assert 195, 70 and 24 rows and keep the 177 and 64 skill-firing rows (`routing-accuracy/score-jev-tiebreak.mjs`)
- [ ] T005 Write the census: alias-aware eligible, movable, gold-first, gold-outside and gold-in-top-3 counts per file and per 50/50 split, cluster membership read from `ambiguousWith`, tau 0.03 membership beside it, `no headroom` at zero movable rows and `underpowered` at 1 to 4 (`score-jev-tiebreak.mjs`)
- [ ] T006 Write the baseline column: holdout top-1 over all 70 rows with `baseline mismatch: comparison void` when it is not 53/70, and MRR, right@1 and right@3 for the scorer's order (`score-jev-tiebreak.mjs`)
- [ ] T020 Write the comparators: confidence order inside the cluster, always-second and the outcome-weighted rerank on held-out rows only, each with MRR, right@1 and right@3 on the scorer column's rows (`score-jev-tiebreak.mjs`)
- [ ] T021 Write the power line: movable rows, the decided-row ceiling, the minimum wins for an exact one-sided sign test at 0.05 and the true win rate for 80% power, printed before any billed call (`score-jev-tiebreak.mjs`)
- [ ] T007 Stop here and record the reason if the baseline mismatches or the census prints `no headroom`. At `underpowered`, build only T008 and T024 after this point (`implementation-summary.md`)
- [ ] T008 Add the `--jev` key gate: resolve P as `JEV_PROVIDER` or `official`, print the identity line with the `jev` path and P, then `command -v jev`, `jev --version` equal to `jev 0.6.2` with a details line on failure and `jev auth status --provider P` exit 0. Each failure prints its `jev arm skipped:` line and exits 0 with the census byte-identical (`score-jev-tiebreak.mjs`)
- [ ] T009 Add the arm: payload class, planned calls and estimated input tokens with no dollar figure, one `jev auth test --provider P` for the model, then one `jev choice --provider P` per eligible row per pass over the cluster keys plus `none`, argument array, prompt on stdin with no `-s`, stdin closed, 90 s cap, no key read or passed (`score-jev-tiebreak.mjs`)
- [ ] T010 Add the exit handler for 0, `none`, 1, 2, 3 after the gate (`jev arm stopped: key rejected`, finished rows `partial`), 4 with one backoff retry, a spawn past 90 s (`unmeasured_timeout`), 130 and a key outside the submitted set, with no default score or verdict (`score-jev-tiebreak.mjs`)
- [ ] T022 Add the modal pick, decided rows (all 3 reruns answered and the gold's reciprocal rank changed, gold-first rows included), `unstable` rows, the aggregate flip rate and the exact one-sided sign test (`score-jev-tiebreak.mjs`)
- [ ] T023 Add the verdict: `keep` on the sign test at 0.05, a win over each comparator, no fall in right@3 and a flip rate of at most 0.10, `kill` when the sign test favors the scorer, `underpowered` below 5 decided rows and `inconclusive` otherwise (`score-jev-tiebreak.mjs`)
- [ ] T011 Write `calls.jsonl` and `report.json` to the `--out` directory: wins, losses, ties, abstentions and unmeasured rows, movable wins and gold demotions apart, the `none` count on gold-in-cluster rows, the exact p, the flip rate, p50 and p95, the tau 0.03 split with no veto and one verdict line, with pick and `none` probabilities on every call line (`score-jev-tiebreak.mjs`)
- [ ] T024 Add the conditional Gate 3 calibration: only at `underpowered` with the gate passing, one `jev noul --provider P` per labeled prompt over 3 reruns, accuracy, F1, Brier score, flip rate and p50 and p95 beside 0.9843, unmeasured rows out of every average (`score-jev-tiebreak.mjs`)
- [ ] T025 Write the vitest file with the stub cases: the 53/70 baseline, the synthetic four-column corpus, `no headroom` and `underpowered`, zero calls in the default and gate-failure runs, each exit code, a hang, a missing rerun answer and one malformed calibration answer (`tests/parity/score-jev-tiebreak.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run the default run with the stub first on PATH: per-file counts, 53/70, the comparator metrics, the power line, exit 0 and an empty stub log
- [ ] T013 Run `--jev` against the stub for no credential, the wrong version and no `jev` on PATH, with `JEV_PROVIDER=openrouter` for one run, and read each identity line, skip line, exit status and stub log
- [ ] T014 Run `--jev` against the stub for exits 4, 1, 2 and 3, a hang and a key outside the submitted set, and read each row's status and the `--provider` value on every logged call
- [ ] T015 Run `grep -nE 'API_KEY|TYPESAFE'` on the script and expect no match
- [ ] T026 Run the vitest file and read its pass count and exit status
- [ ] T016 Run the arm once with a real key and `--out` outside the repository, and read the report, the verdict line and every `calls.jsonl` line for a wall time
- [ ] T017 Run `git status --porcelain` and confirm only `score-jev-tiebreak.mjs` and `score-jev-tiebreak.vitest.ts` changed
- [ ] T018 Run `validate.sh --strict` on this phase until it prints `RESULT: PASSED`, and `check-goal.cjs` on this phase
- [ ] T019 Fill `implementation-summary.md` with the census counts, the comparator metrics, the power line, the verdict or calibration numbers and the latency figures
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
