---
title: "Implementation Plan: Offline Advisor Jev Tie-Break Arm"
description: "One new read-only script beside the routing-accuracy evals, plus its vitest file: a zero-call census with comparators and a power line by default, a --jev arm gated on jev 0.6.2 and a provider-scoped jev auth status, and a Gate 3 calibration that runs only when the census prints underpowered."
trigger_phrases:
  - "advisor jev tie-break plan"
  - "score-jev-tiebreak plan"
  - "jev census baseline column"
  - "jev arm key gate"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Offline Advisor Jev Tie-Break Arm

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES module (`.mjs`) for the script and a TypeScript vitest file, no new dependency |
| **Framework** | The advisor's built `dist` scorer, imported the way `capture-scorer-eval-baseline.mjs:48-50` imports it. The Python `jev-cli` 0.6.2 spawned as a child process for the arm only |
| **Storage** | None in the repository. `report.json` and `calls.jsonl` go to a directory the operator names with `--out` |
| **Testing** | `tests/parity/score-jev-tiebreak.vitest.ts` with a stub `jev` for the zero-call, gate and exit paths, one keyed run for the arm, `git status --porcelain` for read-only proof |

### Overview

The script scores every skill-firing row of the labeled and holdout files with the built scorer under the baseline capture's exact env. It reads each row's near-tie cluster from `ambiguousWith` and counts eligible, movable, gold-first, gold-outside and gold-in-top-3 rows. It then scores the scorer's order and three zero-call comparators and prints a power line. That census is the default output, with zero Jev calls. With `--jev` and every gate check passing, it asks one `jev choice` per eligible row per pass over the cluster keys plus `none`, takes the modal pick over three passes and returns one pre-registered verdict. When the census prints `underpowered`, the same switch and gate run a Gate 3 calibration instead.

The plan was amended on 2026-09-27 from the final synthesis, `../004-deep-research-expansion/research/research.md` section 13. `spec.md` section 4 traces each changed requirement.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A standalone offline eval script: read the corpus, score it, print a report. It copies the corpus filter, split and metric code of `score-outcome-rerank.mjs` (`:40-51`, `:85-121`, about 35 to 40 lines), because that script exports nothing and runs its eval on import (`:159`). A separate file keeps the rerank eval's read-only meaning and deletes cleanly.

### Key Components

- **Deterministic env**: set before any `dist` import, exactly as `capture-scorer-eval-baseline.mjs:35-46` sets it. A fresh `mkdtemp` directory as `SYSTEM_SKILL_ADVISOR_DB_DIR`, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`, `PYTHONDONTWRITEBYTECODE=1` and `VITEST=true`, with `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON`, `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` and `SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW` deleted. `VITEST=true` matters because the semantic-shadow lane substitutes fixture vectors under it, and the baseline was captured that way.
- **`loadCorpora()`**: reads `labeled-prompts.jsonl`, `holdout-prompts.jsonl` and `ambiguity-prompts.jsonl`, asserts 195, 70 and 24 rows and keeps skill-firing rows with the gold-none filter of `score-outcome-rerank.mjs:40-51`, which leaves 177 and 64.
- **`clusterFor(row)`**: runs the scorer once and reads the passing top and its `ambiguousWith` list as `applyAmbiguity` wrote them (`ambiguity.ts:44-58`). It never recomputes margins, because the cluster is a union of a score margin and a confidence margin (`:22-36`) and a member can sit below a non-member in score order.
- **`classifyRows()`**: marks eligible, movable, gold-first, gold-outside and gold-in-top-3, with the alias-aware match of `capture-scorer-eval-baseline.mjs:70-76`, per file and per 50/50 split by sorted id (`score-outcome-rerank.mjs:118-121`). Frozen tau 0.03 membership comes from `ambiguity-prompts.jsonl`.
- **`reprintBaseline()`**: prints holdout top-1 over all 70 rows. Anything other than 53/70 prints `baseline mismatch: comparison void` and stops the run.
- **`comparators()`**: scores the scorer's order, confidence order inside the cluster, always-second and the outcome-weighted rerank, each with MRR, right@1 and right@3 (`score-outcome-rerank.mjs:85-112`). The rerank is scored on held-out rows only, because its fold trains on the train half (`:123`).
- **`powerLine()`**: prints movable rows, the decided-row ceiling, the minimum wins for an exact one-sided sign test at 0.05 and the true win rate needed for 80% power. For example, 5 decided rows need 5 wins and a win rate of 0.956, and 55 need 35 wins and 0.680. Zero movable rows prints `no headroom`, and 1 to 4 prints `underpowered`. Neither runs the `choice` arm.
- **`gate()`**: runs only when `--jev` is set, once per run, stopping at the first failure. It first resolves the provider P as `process.env.JEV_PROVIDER` when set and `official` otherwise, then prints one identity line with the resolved `jev` path and P.
  1. `command -v jev`. Failing prints `jev arm skipped: jev not on PATH`.
  2. `jev --version` prints exactly `jev 0.6.2`, the Python `jev-cli` that `.skilled/skills/cli-jev/cli-usage/` wraps. Failing prints `jev arm skipped: version`, then one details line with the version line found and the binary's path. The npm `jevctl` prints a bare `0.2.3` and fails here.
  3. `jev auth status --provider P` exits 0. It tests presence, not validity, never prints the key and spends no quota. Failing prints `jev arm skipped: no credential`.
  Each failure leaves the census exactly as the default run prints it, and the script exits 0.
- **`preflight()`**: prints the payload class (routing corpus prompts and skill projection descriptions), the planned calls (eligible rows times three, plus one) and the estimated input tokens. It prints no dollar figure.
- **`askJev(row)`**: one `jev auth test --provider P` records the model (one billed call). Then per eligible row per pass it spawns `jev choice --provider P -q <fixed question> -o '<skill>=<projection description>' ... -o 'none=<none of these fits>'` with an argument array and no shell. The prompt text goes on stdin with no `-s` flag and stdin is closed, because an inherited terminal makes `jev` exit 2 (`__init__.py:180-184`). Each spawn has a 90 s cap. The skill description comes from the projection (`types.ts:43`, `projection.ts:49`). The script never reads or passes a key, and it holds no key variable name.
- **`rerunLoop()`, `modalPick()`**: three passes with no answer cache. A row is decided only when all 3 reruns return a submitted key and the modal pick changes the gold's reciprocal rank. Three different picks make the row `unstable` and undecided.
- **Exit handler**: 0 with a submitted key is a pick and `none` an abstention. Exit 1, unparseable stdout or an unknown key is `unmeasured`. Exit 2 stops the arm. Exit 3 after the gate prints `jev arm stopped: key rejected` and marks finished rows `partial`. Exit 4 gets one backoff retry, then `unmeasured`. A spawn past 90 s is `unmeasured_timeout`, and 130 stops the arm as `interrupted`. No path writes a default score or a default verdict.
- **`signTest()`, `flipRate()`, `verdict()`**: the exact one-sided sign test over decided rows and the aggregate flip rate, non-modal answers over all measured calls. `keep` needs the sign test at 0.05, a win over each comparator on identical rows, no fall in right@3 and a flip rate of at most 0.10. `kill` means the sign test at 0.05 favors the scorer's order. Below 5 decided rows the verdict is `underpowered`, and anything else is `inconclusive`.
- **Reporter**: wins, losses, ties, abstentions and unmeasured rows, with movable wins and gold demotions apart, the `none` count on gold-in-cluster rows, the exact p, the flip rate, latency p50 and p95, the tau 0.03 split with no veto and one verdict line. `calls.jsonl` gets one line per call with row id, pass, wall time, exit code, `jev` version, provider, model, answer, pick probability, `none` probability and status.
- **Gate 3 calibration (conditional)**: when the census prints `underpowered` and the gate passes, the script skips the `choice` arm. It asks one `jev noul --provider P` per labeled prompt (195 rows, 127 `yes` and 68 `no`) over 3 reruns on whether the request requires writing a file (proposed wording). It prints accuracy, F1, Brier score, the aggregate flip rate and p50 and p95 beside the classifier's archived F1 of 0.9843. It reuses the exit handler and `calls.jsonl`, and unmeasured rows leave every average. It is about 40 to 60 LOC.

### Data Flow

Corpus rows go through the scorer to a fused order and a cluster. The census classifies rows, scores the scorer's order and the three comparators and prints the power line. With `--jev` and the gate passing, each eligible row's cluster and prompt go to `jev choice` three times. The modal pick reorders the cluster, and the Jev column scores that order on identical rows. Rows that are not eligible keep the fused order in every column. Every call appends one line to `calls.jsonl`, and the totals and the verdict go to `report.json` and stdout.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### First Slice, in Order

1. Build the advisor `dist` and confirm the H1 ratchet is green at HEAD, so the baseline column has a known scorer.
2. Write the census with no Jev code path at all: the env block, `loadCorpora()`, `clusterFor()`, `classifyRows()`, `reprintBaseline()`, `comparators()` and `powerLine()`, about 180 LOC. Run it and read the per-file counts, 53/70, the comparator metrics and the power line.
3. Stop if the baseline is not 53/70 or the census prints `no headroom`, and record why in `implementation-summary.md`. At `underpowered`, only the Gate 3 calibration is built after the gate.
4. Add the gate with its identity line, then prove each gate branch with a stub `jev` before any real call.
5. Add the arm, the exit handler, the verdict and the per-call JSONL, or the calibration when the census printed `underpowered`.
6. Run the arm once with a real key and `--out` outside the repository, and read the report.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root, with `S=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs`. The stub is a temporary directory holding an executable `jev` script that appends its arguments to a log and answers as the case needs. The vitest file holds the same cases against synthetic corpora.

| Check | Command | Expected output |
|-------|---------|-----------------|
| Default run, zero calls | `PATH="$STUB:$PATH" node $S` | Per-file eligible, movable, gold-first, gold-outside and top-3 counts, holdout top-1 `53/70`, MRR, right@1 and right@3 for the scorer and three comparators, the power line, exit 0 and an empty stub log |
| Synthetic columns | vitest case | One movable win, one gold demotion, one gold-outside row and one `none` each land in their own column, and the demotion is a decided loss |
| Headroom stops | vitest case | Zero movable rows prints `no headroom`, and 1 to 4 prints `underpowered`. Neither spawns `jev choice` |
| No credential | stub `auth status` exits 3, `PATH="$STUB:$PATH" JEV_PROVIDER=openrouter node $S --jev` | The identity line names `openrouter`, then `jev arm skipped: no credential`. The census is byte-identical to the default run, exit 0, and the stub log holds only `--version` and `auth status --provider openrouter` |
| Wrong package | stub `--version` prints `0.2.3` | `jev arm skipped: version` and a details line with `0.2.3` and the stub's path, exit 0, and the stub log holds only `--version` |
| No `jev` | `PATH=/usr/bin:/bin node $S --jev` | `jev arm skipped: jev not on PATH`, exit 0 |
| Exit handling | stub `choice` exits 4, then 1, then 2 on successive rows, then exits 3, then hangs | Row `unmeasured` after one retry, row `unmeasured`, arm stops, `jev arm stopped: key rejected` with finished rows `partial`, row `unmeasured_timeout` at 90 s |
| Missing answer | stub answers 2 of 3 reruns for one row | That row never enters the sign test or the flip rate |
| One provider everywhere | stub log after a passing stub run | Every `auth status`, `auth test`, `choice` and `noul` line carries the same `--provider` value |
| No key in the script | `grep -nE 'API_KEY\|TYPESAFE' $S` | No match, exit 1 |
| Keyed arm | `node $S --jev --out <dir outside repo>` with a real key | Payload class, planned calls and estimated input tokens before the first call, then wins, losses, ties, abstentions, unmeasured rows, the exact p, the flip rate, p50 and p95 and one verdict line, with a wall time on every `calls.jsonl` line |
| Read-only | `git status --porcelain` | Only `score-jev-tiebreak.mjs` and `score-jev-tiebreak.vitest.ts` |
| Phase docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The advisor `dist` must be built. The arm needs the Python `jev-cli` 0.6.2 on PATH and a credential that `jev auth status --provider P` resolves, where P is `JEV_PROVIDER` or `official`. The default run needs neither. No package is installed by this phase.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete `score-jev-tiebreak.mjs`, `tests/parity/score-jev-tiebreak.vitest.ts` and the report directory the operator named. No other file changes, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->

---
