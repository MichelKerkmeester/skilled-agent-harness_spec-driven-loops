---
title: "Tasks: Offline Advisor Jev Tie-Break Arm"
description: "Ordered tasks for the zero-call census with comparators and a power line, the provider-scoped jev key gate, the --jev arm with its verdict and per-call record, the --deem arm (proposed) behind cli-deem health, both halves of the Gate 3 calibration, and the stub, fake-server and live verification runs."
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

Task IDs T001 to T019 keep their numbers from the first plan and were amended in place on 2026-09-27. Tasks added by that amendment start at T020 and sit where they run. The round-3 two-backend amendment, from `../007-classifier-deep-research/research/research.md` section 14, amended T005, T007, T011, T012, T024 and T025 in place and added T027 to T037 for the Deem half. The wave 3 amendment of 2026-09-28, from the parent goal's D4, D5 and D6, amended T017, T019, T023 and T025 in place and added T038 to T042 for the skill docs and the verdict record.

A fresh Opus 5.5 xhigh build orchestrator sends each code task as a single-change brief to a CLI executor by Bash only, and the orchestrator session verifies, gets a cross-family review and commits (D5 of the parent goal). Code tasks follow `sk-code-opencode`, and doc tasks go through sk-doc (D6 of the parent goal). The live runs, T016 and T036, are the orchestrator session's.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Build the advisor `dist` and confirm the H1 ratchet is green at HEAD (`.skilled/skills/system-skill-advisor/runtime/dist/`)
- [ ] T002 [P] Reopen the cluster rule, the corpus filter, the split and metric functions and the capture env before copying them (`ambiguity.ts:7-8`, `:22-36`, `:44-58`, `score-outcome-rerank.mjs:40-51`, `:85-123`, `capture-scorer-eval-baseline.mjs:35-50`, `:70-76`)
- [ ] T003 [P] Write a stub `jev` in a temporary directory that logs its arguments and answers per case, for the gate, exit-code and hang runs (outside the repository)
- [ ] T027 [P] Write a stub `cli-deem` (proposed) that logs its arguments and answers `health` and `choice` per case, and an in-test fake Deem server with a scripted `/health` and answers (outside the repository and inside the vitest file)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Set the capture's exact env before any `dist` import: a fresh `mkdtemp` DB directory, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`, `PYTHONDONTWRITEBYTECODE=1`, `VITEST=true` and the three lane variables deleted. Load the three corpus files, assert 195, 70 and 24 rows and keep the 177 and 64 skill-firing rows (`routing-accuracy/score-jev-tiebreak.mjs`)
- [ ] T005 Write the census: alias-aware eligible, movable, gold-first, gold-outside and gold-in-top-3 counts per file and per 50/50 split, cluster membership read from `ambiguousWith`, tau 0.03 membership beside it, the count of clusters over 25 members, `no headroom` at zero movable rows and `underpowered` at 1 to 4 (`score-jev-tiebreak.mjs`)
- [ ] T006 Write the baseline column: holdout top-1 over all 70 rows with `baseline mismatch: comparison void` when it is not 53/70, and MRR, right@1 and right@3 for the scorer's order (`score-jev-tiebreak.mjs`)
- [ ] T020 Write the comparators: confidence order inside the cluster, always-second and the outcome-weighted rerank on held-out rows only, each with MRR, right@1 and right@3 on the scorer column's rows (`score-jev-tiebreak.mjs`)
- [ ] T021 Write the power line: movable rows, the decided-row ceiling, the minimum wins for an exact one-sided sign test at 0.05 and the true win rate for 80% power, printed before any billed call (`score-jev-tiebreak.mjs`)
- [ ] T007 Stop here and record the reason if the baseline mismatches. At `no headroom`, build only T028 and T032 after this point. At `underpowered`, build only T008, T024, T028 and T032 (`implementation-summary.md`)
- [ ] T008 Add the `--jev` key gate: resolve P as `JEV_PROVIDER` or `official`, print the identity line with the `jev` path and P, then `command -v jev`, `jev --version` equal to `jev 0.6.2` with a details line on failure and `jev auth status --provider P` exit 0. Each failure prints its `jev arm skipped:` line and exits 0 with the census byte-identical (`score-jev-tiebreak.mjs`)
- [ ] T009 Add the arm: payload class, planned calls and estimated input tokens with no dollar figure, one `jev auth test --provider P` for the model, then one `jev choice --provider P` per eligible row per pass over the cluster keys plus `none`, argument array, prompt on stdin with no `-s`, stdin closed, 90 s cap, no key read or passed (`score-jev-tiebreak.mjs`)
- [ ] T010 Add the exit handler for 0, `none`, 1, 2, 3 after the gate (`jev arm stopped: key rejected`, finished rows `partial`), 4 with one backoff retry, a spawn past 90 s (`unmeasured_timeout`), 130 and a key outside the submitted set, with no default score or verdict (`score-jev-tiebreak.mjs`)
- [ ] T022 Add the modal pick, decided rows (all 3 reruns answered and the gold's reciprocal rank changed, gold-first rows included), `unstable` rows, the aggregate flip rate and the exact one-sided sign test (`score-jev-tiebreak.mjs`)
- [ ] T023 Add the verdict under the Keep Rule of `spec.md` section 4, in its fixed order: `underpowered` below 5 decided rows, `kill` when the sign test at 0.05 favors the scorer, `keep` on the sign test at 0.05, an MRR above each comparator's on the same rows, no fall in right@3 and a flip rate of at most 0.10. Anything else is `inconclusive`, and a stopped arm prints no verdict. Print the rule's verdict line with the commit pair on a Deem line, and write the four keep conditions to `report.json` (`score-jev-tiebreak.mjs`)
- [ ] T011 Write `calls.jsonl` and `report.json` to the `--out` directory, per backend column: wins, losses, ties, abstentions and unmeasured rows, movable wins and gold demotions apart, the `none` count on gold-in-cluster rows, the exact p, the flip rate, p50 and p95, the tau 0.03 split with no veto and one verdict line, with pick and `none` probabilities on every call line (`score-jev-tiebreak.mjs`)
- [ ] T024 Add the Jev half of the Gate 3 calibration: only at `underpowered` with the gate passing, one `jev noul --provider P` per labeled prompt over 3 reruns, accuracy, F1, Brier score, flip rate and p50 and p95 beside 0.9843, unmeasured rows out of every average (`score-jev-tiebreak.mjs`)
- [ ] T025 Write the vitest file with the stub cases: the 53/70 baseline, the synthetic four-column corpus, `no headroom` and `underpowered`, zero calls in the default and gate-failure runs, each exit code, a hang, a missing rerun answer and one malformed calibration answer. Add the Deem cases: an empty stub `cli-deem` log in the default run, each Deem skip line, exits 3 and 4 after the Deem gate, and a fake-server run that prints its own column, its order-flip rate, the commit pair and a 26-member cluster as unmeasured. Add the Keep Rule cases: a synthetic Deem column meeting all four conditions prints `verdict: keep backend=deem` with the commit pair, the same column with its MRR at or below one comparator's prints `verdict: inconclusive` and a stopped arm prints no verdict line (`tests/parity/score-jev-tiebreak.vitest.ts`)
- [ ] T028 Add the `--deem` (proposed) gate: spawn `cli-deem health` once per run, apply the pinned check within 2,000 ms, record the backend, model id and commit pair, and print `deem arm skipped: not reachable`, `stub backend`, `model` with a details line or `bad health response` on failure, exiting 0 with the census and the Jev column byte-identical. Never start the server (`score-jev-tiebreak.mjs`)
- [ ] T029 Add the Deem arm: print "nothing leaves the machine", the planned calls and an estimated wall time at 65.6 ms p50, then one `cli-deem choice` per eligible row per option order in the three rotations of REQ-008, one request at a time, argument array, prompt on stdin, no key and no `--provider`. Send no cluster over 25 members and print it as unmeasured (`score-jev-tiebreak.mjs`)
- [ ] T030 Add the Deem exit handler: 1 or HTTP 400 `unmeasured`, 2 stops the arm, 3 `deem arm stopped: backend refused`, 4 one recheck through `cli-deem health` with `deem arm stopped: server gone` or `deem arm stopped: model commit changed mid-run` and finished rows `partial`, a same-pair recheck retrying the row once, and 130 `interrupted` (`score-jev-tiebreak.mjs`)
- [ ] T031 Add the Deem column: the modal pick over the three orders, the order-flip rate, the four-outcome verdict in its own column, a keep tied to its commit pair, and `calls.jsonl` lines with backend `deem`, model id, model commit, source commit and option order (`score-jev-tiebreak.mjs`)
- [ ] T032 Add R21's Deem half: on every `--deem` run with the Deem gate passing, one `cli-deem noul` per labeled prompt in one pass (195 calls), printing accuracy, F1, Brier score, a 5-bin ECE and a fitted temperature beside 0.9843, with no threshold on raw probabilities (`score-jev-tiebreak.mjs`)
- [ ] T033 Add the column comparison: when both columns ran, only rows both decided, with a one-sided bound on the paired gap (`score-jev-tiebreak.mjs`)
- [ ] T038 Write the system-skill-advisor docs of `spec.md` Files to Change through sk-doc: `SKILL.md` (version and a pointer, with `description` and the Keywords line unchanged), README, a new changelog entry, a feature catalog entry with its index row, a playbook scenario with its index row and the rows for the new files in `runtime/scripts/routing-accuracy/README.md` and `runtime/tests/parity/README.md` (`.skilled/skills/system-skill-advisor/`)
- [ ] T039 Regenerate `leaf-manifest.json` and `leaf-aliases.json` with `ci-skill-root-metadata.cjs --fix`, the Hermes copy with `sync-skills-hermes.cjs` and, when its `--check` reports stale docs, the trigger index (`.skilled/skills/system-skill-advisor/`, `.hermes/skills/system-skill-advisor/SKILL.md`, `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run the default run with the stub first on PATH: per-file counts, 53/70, the comparator metrics, the power line, exit 0 and empty `jev` and `cli-deem` stub logs
- [ ] T013 Run `--jev` against the stub for no credential, the wrong version and no `jev` on PATH, with `JEV_PROVIDER=openrouter` for one run, and read each identity line, skip line, exit status and stub log
- [ ] T014 Run `--jev` against the stub for exits 4, 1, 2 and 3, a hang and a key outside the submitted set, and read each row's status and the `--provider` value on every logged call
- [ ] T015 Run `grep -nE 'API_KEY|TYPESAFE'` on the script and expect no match
- [ ] T026 Run the vitest file and read its pass count and exit status
- [ ] T016 Run the arm once with a real key and `--out` outside the repository, and read the report, the verdict line and every `calls.jsonl` line for a wall time
- [ ] T034 Run `--deem` against the stub `cli-deem` for each health failure, and read each skip line, exit status, the census against the default run and the stub log
- [ ] T035 Run `--deem` against the stub for exits 1, 2, 3 and 4 with both recheck outcomes, and confirm no logged `cli-deem` call carries a key or `--provider`
- [ ] T036 Run the Deem arm once against the local server the operator started, with `--out` outside the repository, and read the Deem column, the order-flip rate, the commit pair, R21's Deem numbers and every `calls.jsonl` line
- [ ] T017 Run `git status --porcelain` before and after each script run and confirm a run adds nothing. At close, confirm only the rows of `spec.md` Files to Change and this phase folder changed
- [ ] T040 Run `validate_document.py` on each skill doc T038 changed and read exit 0 on every one (parent criterion 3)
- [ ] T041 After the doc commit, rerun the H1 ratchet and the census, then read holdout top-1 at 53/70 before any model run
- [ ] T018 Run `validate.sh --strict` on this phase until it prints `RESULT: PASSED`, and `check-goal.cjs` on this phase
- [ ] T019 Fill `implementation-summary.md` with the census counts, the comparator metrics, the power line, every column's verdict line as printed, the calibration numbers and the latency figures
- [ ] T037 Add the Deem column, its commit pair, the column comparison and R21's Deem numbers to `implementation-summary.md`
- [ ] T042 Hand the orchestrator every verdict line for the parent goal's log. A Deem `keep` line with its commit pair is what phase 009 reads, and with no Deem `keep` the phase still closes (parent D4)
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
