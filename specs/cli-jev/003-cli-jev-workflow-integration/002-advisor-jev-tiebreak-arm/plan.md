---
title: "Implementation Plan: Offline Advisor Jev Tie-Break Arm"
description: "One new read-only script beside the routing-accuracy evals, plus its vitest file: a zero-call census with comparators and a power line by default, a --jev arm gated on jev 0.6.2 and a provider-scoped jev auth status, a --deem arm (proposed) gated on cli-deem health, and a Gate 3 calibration whose Deem half runs on every --deem run and whose Jev half runs only when the census prints underpowered."
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
| **Framework** | The advisor's built `dist` scorer, imported the way `capture-scorer-eval-baseline.mjs:48-50` imports it. The Python `jev-cli` 0.6.2 spawned as a child process for the Jev arm only. `cli-deem` (proposed, phase 008) spawned as a child process for the Deem arm only |
| **Storage** | None in the repository. `report.json` and `calls.jsonl` go to a directory the operator names with `--out` |
| **Testing** | `tests/parity/score-jev-tiebreak.vitest.ts` with a stub `jev` and a stub `cli-deem` for the zero-call, gate and exit paths and a fake Deem server for the Deem column, one keyed run for the Jev arm, one `--deem` run for the Deem arm, `git status --porcelain` for read-only proof |

### Overview

The script scores every skill-firing row of the labeled and holdout files with the built scorer under the baseline capture's exact env. It reads each row's near-tie cluster from `ambiguousWith` and counts eligible, movable, gold-first, gold-outside and gold-in-top-3 rows. It then scores the scorer's order and three zero-call comparators and prints a power line. That census is the default output, with zero Jev or Deem calls. With `--jev` and every gate check passing, it asks one `jev choice` per eligible row per pass over the cluster keys plus `none`, takes the modal pick over three passes and returns one pre-registered verdict in the Jev column. When the census prints `underpowered`, the same switch and gate run the Jev half of the Gate 3 calibration instead. With `--deem` (proposed) and `cli-deem health` passing, it asks one `cli-deem choice` per eligible row per option order over at most 25 cluster keys plus `none`, takes the modal pick over three option orders and returns its own verdict in the Deem column. R21's Deem half runs beside it on every `--deem` run. Each backend is gated on its own and never stands in for the other.

The plan was amended on 2026-09-27 from the final synthesis, `../004-deep-research-expansion/research/research.md` section 13, then amended again for two backends from `../007-classifier-deep-research/research/research.md` section 14. `spec.md` section 4 traces each changed requirement.
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
- **`classifyRows()`**: marks eligible, movable, gold-first, gold-outside and gold-in-top-3, with the alias-aware match of `capture-scorer-eval-baseline.mjs:70-76`, per file and per 50/50 split by sorted id (`score-outcome-rerank.mjs:118-121`). Frozen tau 0.03 membership comes from `ambiguity-prompts.jsonl`. It also counts clusters with more than 25 members, which the Deem arm prints as unmeasured.
- **`reprintBaseline()`**: prints holdout top-1 over all 70 rows. Anything other than 53/70 prints `baseline mismatch: comparison void` and stops the run.
- **`comparators()`**: scores the scorer's order, confidence order inside the cluster, always-second and the outcome-weighted rerank, each with MRR, right@1 and right@3 (`score-outcome-rerank.mjs:85-112`). The rerank is scored on held-out rows only, because its fold trains on the train half (`:123`).
- **`powerLine()`**: prints movable rows, the decided-row ceiling, the minimum wins for an exact one-sided sign test at 0.05 and the true win rate needed for 80% power. For example, 5 decided rows need 5 wins and a win rate of 0.956, and 55 need 35 wins and 0.680. Zero movable rows prints `no headroom`, and 1 to 4 prints `underpowered`. Neither runs a `choice` arm on either backend.
- **`gate()`**, the Jev half: runs only when `--jev` is set, once per run, stopping at the first failure. It first resolves the provider P as `process.env.JEV_PROVIDER` when set and `official` otherwise, then prints one identity line with the resolved `jev` path and P.
  1. `command -v jev`. Failing prints `jev arm skipped: jev not on PATH`.
  2. `jev --version` prints exactly `jev 0.6.2`, the Python `jev-cli` that `.skilled/skills/cli-jev/cli-usage/` wraps. Failing prints `jev arm skipped: version`, then one details line with the version line found and the binary's path. The npm `jevctl` prints a bare `0.2.3` and fails here.
  3. `jev auth status --provider P` exits 0. It tests presence, not validity, never prints the key and spends no quota. Failing prints `jev arm skipped: no credential`.
  Each failure leaves the census exactly as the default run prints it, and the script exits 0.
- **`deemGate()`**, the Deem half: runs only when `--deem` is set, once per run. It spawns `cli-deem health`, which applies the pinned Deem check within 2,000 ms: HTTP 200 from `http://127.0.0.1:8300/health`, status `ok`, model `deem-0.8-v1` and a backend of `torch` or an `ensemble:` backend with no `stub`. On a pass it records the backend, the model id and the commit pair it prints. On a failure it prints `deem arm skipped: not reachable`, `deem arm skipped: stub backend`, `deem arm skipped: model` with a details line naming the id found or `deem arm skipped: bad health response` (all proposed). It never starts the server. A skip leaves the census and the Jev column byte-identical, and the script exits 0.
- **`preflight()`**: for the Jev arm, prints the payload class (routing corpus prompts and skill projection descriptions), the planned calls (eligible rows times three, plus one) and the estimated input tokens. It prints no dollar figure. For the Deem arm, prints "nothing leaves the machine", the planned calls (eligible rows times three option orders, plus R21's 195) and an estimated wall time at the measured p50 of 65.6 ms (C14).
- **`askJev(row)`**: one `jev auth test --provider P` records the model (one billed call). Then per eligible row per pass it spawns `jev choice --provider P -q <fixed question> -o '<skill>=<projection description>' ... -o 'none=<none of these fits>'` with an argument array and no shell. The prompt text goes on stdin with no `-s` flag and stdin is closed, because an inherited terminal makes `jev` exit 2 (`__init__.py:180-184`). Each spawn has a 90 s cap. The skill description comes from the projection (`types.ts:43`, `projection.ts:49`). The script never reads or passes a key, and it holds no key variable name.
- **`askDeem(row, order)`**: per eligible row per option order it spawns `cli-deem choice -q <fixed question> -o '<skill>=<projection description>' ... -o 'none=<none of these fits>'` with an argument array and no shell, the prompt on stdin and stdin closed. It passes no key and no `--provider`. A row whose cluster has more than 25 members is never sent and prints as unmeasured, because the torch backend reads at most 26 options (C5). The three orders are fixed in `spec.md` REQ-008: the cluster keys in the scorer's order with `none` last, then that list rotated left by one, then by two. Calls go one at a time, because the server serves one request at a time.
- **`rerunLoop()`, `modalPick()`**: for Jev, three passes with no answer cache. For Deem, the three option orders, because the same request returns the same answer. A row is decided only when all 3 calls return a submitted key and the modal pick changes the gold's reciprocal rank. Three different picks make the row `unstable` and undecided.
- **Exit handler**: 0 with a submitted key is a pick and `none` an abstention. Exit 1, unparseable stdout or an unknown key is `unmeasured`. Exit 2 stops the arm. For Jev, exit 3 after the gate prints `jev arm stopped: key rejected` and marks finished rows `partial`, exit 4 gets one backoff retry, then `unmeasured`, and a spawn past 90 s is `unmeasured_timeout`. For Deem, an HTTP 400 is exit 1, exit 3 prints `deem arm stopped: backend refused`, and exit 4 triggers one recheck through `cli-deem health`: an unreachable server prints `deem arm stopped: server gone`, a changed commit pair prints `deem arm stopped: model commit changed mid-run` (all proposed), each with finished rows `partial`, and a passing recheck with the same pair retries the row once, then marks it `unmeasured`. Exit 130 stops either arm as `interrupted`. No path writes a default score or a default verdict.
- **`signTest()`, `flipRate()`, `verdict()`**: per backend column, the exact one-sided sign test over decided rows and the aggregate flip rate, non-modal answers over all measured calls, which for Deem is the order-flip rate. `keep` needs the sign test at 0.05, a win over each comparator on identical rows, no fall in right@3 and a flip rate of at most 0.10. `kill` means the sign test at 0.05 favors the scorer's order. Below 5 decided rows the verdict is `underpowered`, and anything else is `inconclusive`. A Deem `keep` holds only for the commit pair it was measured on (C3).
- **`compareColumns()`**: when both columns ran, compares them only on rows both decided and prints a one-sided bound on the paired gap, never the observed gap alone (C6).
- **Reporter**: per backend column, wins, losses, ties, abstentions and unmeasured rows, with movable wins and gold demotions apart, the `none` count on gold-in-cluster rows, the exact p, the flip rate, latency p50 and p95, the tau 0.03 split with no veto and one verdict line. `calls.jsonl` gets one line per call with row id, pass, wall time, exit code, `jev` version, provider, model, answer, pick probability, `none` probability and status. A `cli-deem` line carries backend `deem`, the model id, the model commit, the source commit and the option order in place of the `jev` version and provider (C2).
- **Gate 3 calibration, Deem half**: on every `--deem` run with the Deem gate passing, beside the `choice` arm, the script asks one `cli-deem noul` per labeled prompt in one pass (195 calls) on whether the request requires writing a file (proposed wording). It prints accuracy, F1, Brier score, a 5-bin ECE and a fitted temperature beside 0.9843, and sets no threshold on raw Deem probabilities before it runs (C7). It has no rerun clause. About 40 to 60 LOC shared with the Jev half, plus about 20 for the temperature fit (estimate).
- **Gate 3 calibration, Jev half (conditional)**: when the census prints `underpowered` and the gate passes, the script skips the Jev `choice` arm. It asks one `jev noul --provider P` per labeled prompt (195 rows, 127 `yes` and 68 `no`) over 3 reruns on whether the request requires writing a file (proposed wording). It prints accuracy, F1, Brier score, the aggregate flip rate and p50 and p95 beside the classifier's archived F1 of 0.9843. It reuses the exit handler and `calls.jsonl`, and unmeasured rows leave every average. It is about 40 to 60 LOC.

### Data Flow

Corpus rows go through the scorer to a fused order and a cluster. The census classifies rows, scores the scorer's order and the three comparators and prints the power line. With `--jev` and the gate passing, each eligible row's cluster and prompt go to `jev choice` three times. With `--deem` and the Deem gate passing, each eligible row of at most 25 cluster keys goes to `cli-deem choice` once per option order. Each modal pick reorders the cluster, and each backend column scores its own order on identical rows. Rows that are not eligible keep the fused order in every column. Every call appends one line to `calls.jsonl`, and the totals and the verdict go to `report.json` and stdout.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### First Slice, in Order

1. Build the advisor `dist` and confirm the H1 ratchet is green at HEAD, so the baseline column has a known scorer.
2. Write the census with no Jev code path at all: the env block, `loadCorpora()`, `clusterFor()`, `classifyRows()`, `reprintBaseline()`, `comparators()` and `powerLine()`, about 180 LOC. Run it and read the per-file counts, 53/70, the comparator metrics and the power line.
3. Stop if the baseline is not 53/70, and record why in `implementation-summary.md`. At `no headroom`, build no `choice` arm: only the Deem gate and R21's Deem half follow. At `underpowered`, only the Jev gate with the Jev calibration and the Deem gate with R21's Deem half are built after this point.
4. Add the Jev gate with its identity line, then prove each gate branch with a stub `jev` before any real call.
5. Add the Jev arm, the exit handler, the verdict and the per-call JSONL, or the Jev calibration when the census printed `underpowered`.
6. Run the Jev arm once with a real key and `--out` outside the repository, and read the report.
7. Once `cli-deem` from phase 008 exists, add the Deem gate and prove each skip line with a stub `cli-deem` before any real call.
8. Add the Deem arm with its option orders, its exits and its commit-pair records, R21's Deem half and the column comparison, tested against a fake server.
9. Run the Deem arm once against the live local server, which the operator started, with `--out` outside the repository, and read the report.

Steps 4 to 6 and 7 to 9 are independent halves. The synthesis orders the Deem half before the Jev half, because it is free and local (research section 10, order steps 3 and 4). The Jev half does not wait on phase 008, so it may be built first while 008 is open.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root, with `S=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs`. The stub is a temporary directory holding executable `jev` and `cli-deem` scripts that each append their arguments to their own log and answer as the case needs. The fake Deem server is an in-test HTTP server with a scripted `/health` and answers. The vitest file holds the same cases against synthetic corpora.

| Check | Command | Expected output |
|-------|---------|-----------------|
| Default run, zero calls | `PATH="$STUB:$PATH" node $S` | Per-file eligible, movable, gold-first, gold-outside and top-3 counts, the count of clusters over 25 members, holdout top-1 `53/70`, MRR, right@1 and right@3 for the scorer and three comparators, the power line, exit 0 and empty `jev` and `cli-deem` stub logs |
| Synthetic columns | vitest case | One movable win, one gold demotion, one gold-outside row and one `none` each land in their own column, and the demotion is a decided loss |
| Headroom stops | vitest case | Zero movable rows prints `no headroom`, and 1 to 4 prints `underpowered`. Neither spawns `jev choice` or `cli-deem choice` |
| No credential | stub `auth status` exits 3, `PATH="$STUB:$PATH" JEV_PROVIDER=openrouter node $S --jev` | The identity line names `openrouter`, then `jev arm skipped: no credential`. The census is byte-identical to the default run, exit 0, and the stub log holds only `--version` and `auth status --provider openrouter` |
| Wrong package | stub `--version` prints `0.2.3` | `jev arm skipped: version` and a details line with `0.2.3` and the stub's path, exit 0, and the stub log holds only `--version` |
| No `jev` | `PATH=/usr/bin:/bin node $S --jev` | `jev arm skipped: jev not on PATH`, exit 0 |
| Exit handling | stub `choice` exits 4, then 1, then 2 on successive rows, then exits 3, then hangs | Row `unmeasured` after one retry, row `unmeasured`, arm stops, `jev arm stopped: key rejected` with finished rows `partial`, row `unmeasured_timeout` at 90 s |
| Missing answer | stub answers 2 of 3 reruns for one row | That row never enters the sign test or the flip rate |
| One provider everywhere | stub log after a passing stub run | Every `auth status`, `auth test`, `choice` and `noul` line carries the same `--provider` value |
| No key in the script | `grep -nE 'API_KEY\|TYPESAFE' $S` | No match, exit 1 |
| Keyed arm | `node $S --jev --out <dir outside repo>` with a real key | Payload class, planned calls and estimated input tokens before the first call, then wins, losses, ties, abstentions, unmeasured rows, the exact p, the flip rate, p50 and p95 and one verdict line, with a wall time on every `calls.jsonl` line |
| Deem gate failures | stub `cli-deem health` answers not reachable, a stub backend, model `deem-1.5` and malformed output, `PATH="$STUB:$PATH" node $S --deem` | `deem arm skipped: not reachable`, `deem arm skipped: stub backend`, `deem arm skipped: model` with a details line naming `deem-1.5`, `deem arm skipped: bad health response`. Each exits 0 with the census byte-identical, and the stub log holds only `health` |
| Deem exit handling | stub `cli-deem choice` exits 1, then 2, then 3, then 4 with the recheck failing, then 4 with the recheck showing a new commit pair | Row `unmeasured`, arm stops, `deem arm stopped: backend refused`, `deem arm stopped: server gone`, `deem arm stopped: model commit changed mid-run`, each stop with finished rows `partial` |
| Deem column | vitest case against a fake server, with one cluster of 26 members | Its own column and verdict, the order-flip rate, the commit pair on every `calls.jsonl` line with the option order, the large cluster printed as unmeasured, and R21's Deem half with accuracy, F1, Brier score, ECE and a fitted temperature |
| No key to Deem | stub log after a passing stub `--deem` run | No `cli-deem` line carries a key or `--provider` |
| Deem arm | `node $S --deem --out <dir outside repo>` with the operator's server running | "nothing leaves the machine", planned calls and an estimated wall time before the first call, then the Deem column, the order-flip rate, the commit pair, p50 and p95, one verdict line and R21's Deem numbers |
| Read-only | `git status --porcelain` | Only `score-jev-tiebreak.mjs` and `score-jev-tiebreak.vitest.ts` |
| Phase docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The advisor `dist` must be built. The Jev arm needs the Python `jev-cli` 0.6.2 on PATH and a credential that `jev auth status --provider P` resolves, where P is `JEV_PROVIDER` or `official`. The Deem arm needs `cli-deem` from phase 008 and a local server that passes the Deem check, started by the operator with `deem-ctl`. The default run needs none of these. No package is installed by this phase.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete `score-jev-tiebreak.mjs`, `tests/parity/score-jev-tiebreak.vitest.ts` and the report directory the operator named. No other file changes, so nothing else needs reverting. The script never starts, stops or updates the Deem server.
<!-- /ANCHOR:rollback -->

---
