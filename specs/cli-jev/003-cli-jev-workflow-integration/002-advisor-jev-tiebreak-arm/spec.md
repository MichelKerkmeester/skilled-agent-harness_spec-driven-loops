---
title: "Build Phase: Offline Advisor Jev Tie-Break Arm"
description: "Measure, offline and by hand, whether a Python jev-cli choice over the skill advisor's near-tie cluster beats the scorer's order and three zero-call comparators, under a keep rule that can fail. The default run is a zero-call census that prints a power line first, and the Jev arm runs only behind --jev when all three key checks pass."
trigger_phrases:
  - "advisor jev tie-break arm"
  - "jev choice near-tie cluster"
  - "score-jev-tiebreak"
  - "advisor ambiguity cluster jev"
  - "jev arm skipped no credential"
  - "jev tie-break power line"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Build Phase: Offline Advisor Jev Tie-Break Arm

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-26 |
| **Amended** | 2026-09-27, from the final synthesis `../004-deep-research-expansion/research/research.md` section 13 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-deep-research |
| **Successor** | 003-goal-verifier-jev-shadow |
| **Handoff Criteria** | The census has printed its per-file counts, holdout top-1 at 53/70, the comparator metrics and the power line. Then either it printed `no headroom`, or a keyed run produced one verdict line or the conditional Gate 3 calibration, with a per-call JSONL that holds a wall time for every call. 003's plugin mode reads that latency record |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the cli-jev workflow integration specification. It builds recommendation R1, rank 1 and build-now, with R21 as a conditional arm inside the same script. The source is the final synthesis, `../004-deep-research-expansion/research/research.md`: section 11 (`### R1.`, `### R21.` and `### The shared gate contract`) and section 13 (`### 002-advisor-jev-tiebreak-arm`). It amends the round-1 plan drawn from `../001-deep-research/research/research.md`. Section 4 ends with a trace of every requirement the amendment changed.

**Scope Boundary**: One new, read-only measurement script beside the existing routing-accuracy evals, plus its vitest file. It changes no existing file, serves nothing and never runs inside a hook, so every live advisor path behaves as today by construction.

**Dependencies**:
- The built advisor `dist` under `.skilled/skills/system-skill-advisor/runtime/dist/`, which the script imports after setting the capture's env, as `capture-scorer-eval-baseline.mjs:35-50` does
- For the arm only: the Python `jev-cli` 0.6.2 on PATH and a credential that `jev auth status --provider <P>` resolves, where P is `JEV_PROVIDER` when set and `official` otherwise. Neither is needed for the default run

**Deliverables**:
- `score-jev-tiebreak.mjs` with a zero-call census, baseline column, comparators and power line by default, a `--jev` arm and the conditional Gate 3 calibration
- `tests/parity/score-jev-tiebreak.vitest.ts` with the stub-`jev` cases
- A report and a per-call JSONL in a directory the operator names, from one keyed run

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Nobody has measured whether a Jev `choice` would order the skill advisor's near-tie cluster better than its own fused scores. The advisor already names its near-ties: `applyAmbiguity` gives every passing recommendation within 0.05 of the passing top, on score or on confidence, an `ambiguousWith` list (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:7-8`, `:22-36`, `:44-58`). Inside that cluster the fused order decides which skill comes first. A live Jev call in the advisor cannot be tested at all, because the prompt hook kills the advisor child at 2500 ms. The recorded baselines leave room to improve: holdout top-1 is 53/70 = 0.7571, and the ambiguity slice is 18/24 = 0.75 at tau 0.03 (`routing-accuracy/scorer-eval-baseline.json:25-35`).

The room is small, and that decides what the phase can learn. A win needs a movable row, a wrong top-1 whose gold skill sits in the cluster. The committed counts cap those at 55: 38 wrong skill-firing rows in `labeled-prompts.jsonl` and 17 wrong rows in `holdout-prompts.jsonl`. At 55 decided rows an exact one-sided sign test at 0.05 needs 35 wins, and 80% power needs a true win rate near 0.68. At 5 to 20 decided rows it needs 0.80 to 0.96. How many rows are movable is UNKNOWN until the census runs.

### Purpose

Produce a number that settles whether a Python `jev-cli` `choice` over the advisor's near-tie cluster beats the scorer's own order and three zero-call comparators, and say before any billed call whether a `keep` is reachable at all. All of it costs zero calls and changes no behavior for anyone who has no Jev key or does not pass `--jev`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A census, with zero Jev calls, over every skill-firing row of both files: 177 in `labeled-prompts.jsonl` and 64 in `holdout-prompts.jsonl`, reported per file and per 50/50 split. It is alias-aware and prints eligible (a cluster of two or more), movable (gold in the cluster but not first), gold-first, gold-outside and gold-in-top-3 columns. Cluster membership is read from the scorer's own `ambiguousWith`, and membership in the frozen tau 0.03 slice is reported beside it.
- A baseline column and three zero-call comparators, each scored with MRR, right@1 and right@3: the scorer's own order, confidence order inside the cluster, always-second and the outcome-weighted rerank. The rerank is scored on held-out rows only, because it trains on the other half. Holdout top-1 is also printed with the alias-aware match.
- A power line, printed by the census before any billed call: movable rows, the decided-row ceiling, the wins a `keep` needs and the true win rate needed for 80% power.
- A Jev arm behind `--jev`: one `jev choice` per eligible row per pass over the cluster keys plus `none`, three passes with no answer cache, the modal pick moved first inside the cluster and a pre-registered four-outcome verdict.
- A conditional Gate 3 calibration (research R21). It runs only when the census prints `underpowered`, under the same `--jev` switch and the same gate, in place of the `choice` arm.
- A per-call JSONL and a report written to a directory the operator names.

### Out of Scope

- Any live, served or hook-time Jev call in the advisor. The hook kills the child at 2500 ms, and serving a pick before this phase measures it is on the synthesis's what-not-to-build list.
- Editing, importing from or exporting from `score-outcome-rerank.mjs`. Its header promises a read-only eval of outcome weights (`:17-23`), it runs on import (`:159`) and its flip rule decides that flag (`:149-150`). The script copies the split and metric code instead.
- Writing `scorer-eval-baseline.json`, the corpus files or the advisor ratchet. They are pinned by hash (`scorer-eval-baseline.json:5-7`) and a network arm is not deterministic.
- An answer cache across passes. Cached answers make the flip rate zero by construction.
- Cluster membership from recomputed margins, `includeAllCandidates: true` or the frozen slice file. Each measures a different cluster than the live rule.
- A shared Jev client helper, a global Jev switch, a new command or a `cli-jev` mode. This script is the only caller and `--jev` is its own switch.
- Merging this census with the compaction census of phase 005. They have different owners and inputs, and each must delete cleanly on its own.
- The npm `rerank` pattern, one `noul` per key and then an argmax, as the modal pick. It stores a missing answer as 0, so a transport failure could fake a win.
- Reporting where the key came from. Testing a key variable would put a key name in the script.
- A dollar figure in any cost line. Every price here is a vendor claim.
- The npm `jevctl` package. It also installs a `jev` binary, with a different exit contract, and check 2 skips it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` | Create | The census, comparators, power line, `--jev` arm and conditional Gate 3 calibration. About 330 to 530 LOC, of which about 180 are the census, plus about 50 for the calibration (lineage estimates). Proposed name from the research |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts` | Create | The stub-`jev` test cases. It sits under `tests/` because the package's vitest config includes only `tests/**/*.vitest.ts` |
| `routing-accuracy/labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl` | Read only | The rows scored, the Gate 3 labels and the frozen tau 0.03 slice |
| `routing-accuracy/scorer-eval-baseline.json` | Read only | The pinned 53/70 the baseline column must reproduce |
| `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/*.js` | Read only | The built scorer, projection and alias helpers the script imports |
| `<operator-named report dir>/` | Create at run time | `report.json` and `calls.jsonl` from a keyed run. Outside the repository unless the operator names a path inside it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The default run makes zero Jev calls | Without `--jev`, the script prints the census, the baseline column, the comparators and the power line and never spawns `jev`. A stub `jev` placed first on PATH that appends one line per invocation to a log leaves that log empty |
| REQ-002 | The arm is dormant unless `--jev` is set and three checks pass, in order, once per run | With `--jev`, one identity line prints first: the resolved `jev` path and the provider P the arm will use, `JEV_PROVIDER` when set and `official` otherwise. Then check 1, `command -v jev`, failing prints `jev arm skipped: jev not on PATH`. Check 2, `jev --version` printing exactly `jev 0.6.2`, failing prints `jev arm skipped: version` and one details line with the version line found and the binary's path. Check 3, `jev auth status --provider P` exiting 0, failing prints `jev arm skipped: no credential`. Every gate failure leaves the census output byte-identical to the default run, runs no judgment and exits 0 |
| REQ-003 | The script never handles a credential | It never reads, stores, logs or passes a key, and it holds no key literal and no key variable name. `jev` resolves its own key from its store or the provider's environment variable. `grep -nE 'API_KEY\|TYPESAFE' score-jev-tiebreak.mjs` returns no match, and no spawned argument list carries a key. The same `--provider P` goes to check 3, to `jev auth test` and to every judgment |
| REQ-004 | The census counts headroom and prints the power line before any billed call | Over the 177 skill-firing rows of `labeled-prompts.jsonl` and the 64 of `holdout-prompts.jsonl`, per file and per 50/50 split, the report prints alias-aware eligible, movable, gold-first, gold-outside and gold-in-top-3 counts, with cluster membership read from `ambiguousWith` and tau 0.03 slice membership beside it. The power line prints movable rows, the decided-row ceiling, the wins a `keep` needs and the true win rate needed for 80% power, by the exact one-sided binomial at 0.05. Zero movable rows prints `no headroom`, and 1 to 4 prints `underpowered`. Neither runs the `choice` arm, even with `--jev` |
| REQ-005 | The baseline column reproduces the recorded baseline under the capture's exact env | Before any `dist` import the script sets the env of `capture-scorer-eval-baseline.mjs:35-46` exactly: a fresh `mkdtemp` directory as `SYSTEM_SKILL_ADVISOR_DB_DIR`, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`, `PYTHONDONTWRITEBYTECODE=1` and `VITEST=true`, and it deletes `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON`, `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` and `SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW`. With the alias-aware match (`:70-76`), holdout top-1 prints 53/70. Any other number prints `baseline mismatch: comparison void`, voids the run and runs no arm |
| REQ-006 | The script is read-only | After a default run and a keyed run, `git status --porcelain` lists only `score-jev-tiebreak.mjs`, `score-jev-tiebreak.vitest.ts` and, if the operator named one inside the repository, the report directory. The corpus files and `scorer-eval-baseline.json` are unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The arm returns one pre-registered verdict over decided rows | A decided row is an eligible row whose modal pick changes the gold's reciprocal rank, gold-first rows included. Movable wins and gold demotions print apart. `keep` needs all four: an exact one-sided sign test at 0.05 over decided rows, a win over each comparator on identical rows (the rerank on held-out rows only), no fall in right@3 and an aggregate flip rate of at most 0.10. `kill` means the sign test at 0.05 favors the scorer's order. Below 5 decided rows the verdict is `underpowered`, and anything else is `inconclusive`. The report prints wins, losses, ties, abstentions, unmeasured rows and the exact p |
| REQ-008 | The arm reports an aggregate flip rate over three passes | The arm runs three passes with no answer cache. The flip rate is the non-modal answers over all measured calls, and it must be at most 0.10 for `keep`. A row with three different picks is `unstable` and undecided |
| REQ-009 | Every call is recorded | `calls.jsonl` has one line per spawned `jev` call with row id, pass, wall time in ms, exit code, `jev` version, provider, model, the answer key or none, the pick probability, the `none` probability and a status of `measured`, `abstained`, `unmeasured` or `unmeasured_timeout`. Provider and model come from one `jev auth test --provider P` at the start of the arm. The report prints latency p50 and p95 |
| REQ-010 | Every exit code and missing answer has one handling | A row is decided only when all 3 reruns return a submitted key, and a missing answer never becomes 0 or `none`. Exit 0 with a submitted key is a pick. `none` keeps the scorer's order and counts as an abstention, and the report prints how many `none` answers fell on rows whose gold was in the cluster. Exit 1, unparseable stdout or a key outside the submitted set marks the row `unmeasured`. Exit 2 stops the arm, because the script built a bad command. Exit 3 after the gate prints `jev arm stopped: key rejected` and marks finished rows `partial`. Exit 4 gets one backoff retry, then the row is `unmeasured`. A spawn past its 90 s cap is killed and marked `unmeasured_timeout`. Exit 130 stops the arm as `interrupted`. No path writes a default score or a default verdict |
| REQ-011 | The operator sees the cost before the first billed call | Before `jev auth test`, the arm prints the payload class (routing corpus prompts and skill projection descriptions), the planned call count (eligible rows times three passes, plus one) and the estimated input tokens. No line prints a dollar figure |
| REQ-012 | The tau 0.03 split is reported, never a veto | The report splits the Jev column's wins and losses into rows inside and outside the frozen tau 0.03 slice. The split does not change the verdict |
| REQ-013 | The comparators are scored on identical rows | Confidence order inside the cluster, always-second and the outcome-weighted rerank are each scored with MRR, right@1 and right@3 on the same rows as the scorer column, the rerank on held-out rows only (`score-outcome-rerank.mjs:123`). The census prints them with zero calls |
| REQ-014 | The Gate 3 calibration runs only when the census prints `underpowered` | With `--jev`, the gate passing and the census at `underpowered`, the script asks one `jev noul --provider P` per labeled prompt (195 rows: 127 `yes`, 68 `no`) over 3 reruns, about 585 calls, on whether the request requires writing a file (proposed wording). It prints accuracy, F1, Brier score, the aggregate flip rate and latency p50 and p95 beside the classifier's archived F1 of 0.9843. It uses REQ-009's record and REQ-010's exit handling. Unmeasured rows leave every average. It has no switch and no verdict of its own, and with the gate failing it prints only the gate's skip line |

### Edge Cases

- **No key.** `jev auth status --provider P` exits 3. With `--jev` the output says `jev arm skipped: no credential`, and the census is byte-identical to the default run. Confirmed live on 2026-09-26: `jev auth status` exits 0 for a stored or exported key, exits 3 with none, never prints the key and spends no quota.
- **A key for the wrong provider.** Judgments take their provider from `JEV_PROVIDER` (`jev_cli/__init__.py:307`), while `auth status` and `auth test` default to `official` (`:339`). Passing the same `--provider P` to all three keeps check 3 true for the provider the judgments use. The parent confirmed this live on 2026-09-27: with a dummy OpenRouter key, plain `auth status` exits 3 and `--provider openrouter` exits 0.
- **A bad key.** Check 3 tests presence, not validity, so a rejected key passes the gate. It surfaces as exit 3 on the first billed call, `jev auth test` or the first judgment. The arm prints `jev arm stopped: key rejected` and reports finished rows as `partial`.
- **The wrong `jev`.** The npm `jevctl` also installs a `jev` binary. It prints a bare `0.2.3`, and its exit 2 means a tripped `--fail-on` gate. Check 2 skips anything but `jev 0.6.2` before any exit code is read.
- **Exit 4.** Rate limit, 5xx or timeout. One backoff retry, then `unmeasured`. Never read as a judgment.
- **A hang.** A spawn that never exits is killed at 90 s and marked `unmeasured_timeout`. The client's own HTTP read stops at 60 s (`__init__.py:288`).
- **A missing rerun answer.** A row with fewer than 3 submitted keys never enters the sign test or the flip rate.
- **A `none` answer.** Jev declines every cluster key. The scorer's order stands, so the gold's rank does not move, and the row counts as an abstention, reported apart from `unmeasured`.
- **Unmeasured rows.** They leave every column, so the comparison stays on identical rows, and their count prints beside each metric.
- **Stdin.** The script always feeds the prompt text to stdin and closes it, with no `-s` flag, which the Python client reads by default. An inherited terminal on stdin makes `jev` exit 2 rather than hang (`__init__.py:180-184`).

### Amendment Trace (2026-09-27)

IDs were kept. Each amended requirement replaces its earlier wording in place, and new requirements take new IDs.

| ID | Earlier wording | Now |
|----|-----------------|-----|
| REQ-002 | Plain `jev auth status`. A version miss printed `jev arm refused: expected jev 0.6.2` | An identity line first, `jev arm skipped: version` plus a details line and `--provider P` on check 3 |
| REQ-003 | `grep -n API_KEY`, with `jev` resolving `TYPESAFE_API_KEY` | No key literal or key variable name, wider grep, one `--provider P` on check 3, `auth test` and every judgment |
| REQ-004 | Held-out half of the labeled file plus the holdout file, eligible and movable counts only | All 241 skill-firing rows of both files, five alias-aware columns, the power line and `underpowered` |
| REQ-005 | Partial env list | The capture's env exactly, including `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL`, `PYTHONDONTWRITEBYTECODE`, `VITEST` and the three lane deletes |
| REQ-006 | Only the script | The script, its vitest file and an in-repo report directory |
| REQ-007 | `keep` when Jev MRR rises and right@3 does not fall | Four-outcome rule over decided rows, gold demotions counted as losses |
| REQ-008 | Stability coefficient of at least 0.95 | Aggregate flip rate of at most 0.10, `unstable` rows undecided |
| REQ-009 | No probabilities, three statuses | Pick and `none` probabilities, `unmeasured_timeout`, provider-scoped `auth test`, p50 and p95 |
| REQ-010 | Exit table only | Decided only on 3 answers, 90 s cap, `none` count on gold-in-cluster rows, `jev arm stopped: key rejected` |
| REQ-011 | Payload class and call count | Adds estimated input tokens and bans a dollar figure |
| REQ-012 | A gain only inside the tau 0.03 slice is not kept | Split reported without a veto |
| REQ-013 | New | The three comparators |
| REQ-014 | New | The conditional Gate 3 calibration |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Before any billed call, the operator reads from the census how many rows can move, how the scorer compares with three zero-call comparators and what win rate a `keep` would need.
- **SC-002**: From one keyed run the operator gets one verdict line, `keep`, `kill`, `inconclusive` or `underpowered`, plus the first per-call latency record. When the census prints `underpowered`, the Gate 3 calibration supplies that latency record instead.
- **SC-003**: A machine with no Jev key, or a run without `--jev`, sees no new behavior and no call.

### Proof Plan

Written before the build, from the final synthesis's R1 slice and test cases.

1. With no key, `node score-jev-tiebreak.mjs` prints per-file counts, 53/70, the comparator metrics and the power line, while a stub `jev` first on PATH logs no call. Boundary: zero movable rows prints `no headroom`, and 1 to 4 prints `underpowered`. Neither runs the `choice` arm.
2. The baseline column reproduces 53/70 under the pinned env. Boundary: any other number prints `baseline mismatch: comparison void`, and the run stops.
3. A synthetic corpus with one movable win, one gold demotion, one gold-outside row and one `none` lands each row in its own column. Boundary: the demotion counts as a decided loss, and the `none` counts as an abstention.
4. With the stub, each gate failure prints its skip line and leaves the census byte-identical. Exit 3 after the gate prints `jev arm stopped: key rejected`, exit 4 retries once, exit 2 stops the arm and a hang past 90 s is `unmeasured_timeout`. Boundary: a row with one missing rerun answer never enters the sign test.
5. With a key and `--jev`, the report prints wins, losses, ties, abstentions and unmeasured rows, the exact p, the aggregate flip rate, p50 and p95 and one verdict line. Every `calls.jsonl` line carries wall time, exit code, provider, model and status.
6. `git status --porcelain` shows no change outside the new script, its vitest file and its report directory. Boundary: any write to the corpus, `scorer-eval-baseline.json` or the ratchet fails the phase.

**Kill criterion.** `baseline mismatch: comparison void` voids the run. Only `verdict: kill` closes research R3's served order and the live advisor forms. `no headroom`, `underpowered` and `inconclusive` close nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor `dist` build | The script cannot import the scorer, or scores with a stale one | Build `dist` first. REQ-005 voids the comparison when the baseline is not 53/70 |
| Dependency | A Jev credential for provider P | The arm cannot run | The default run needs none. The arm skips with `jev arm skipped: no credential` and the operator sets a key |
| Risk | Headroom is small: at most 55 movable rows, 38 labeled and 17 holdout | High | The census prints the power line before any call. Below 5 movable rows the `choice` arm does not run |
| Risk | A keep is unreachable even above 5 rows: at 5 to 20 decided rows it needs a true win rate of 0.80 to 0.96 | Med | The power line says so first. A low power line does not stop the arm, because an `inconclusive` run still yields the first latency record |
| Risk | A pick that demotes correct rows earns `keep` | Med | Decided rows include gold-first rows, so a demotion counts as a loss (REQ-007) |
| Risk | Corpus prompts and skill descriptions leave the machine | Low. Both are authored in this repository, and prompt provenance was not checked | The arm prints the payload class and estimated input tokens before the first call. It sends no secret and no session content |
| Risk | A reordered gain that is noise | Med | Three passes, no answer cache, the aggregate flip rate and a sign test over decided rows |
| Risk | Cost | Low | The ceiling is 723 judgments, at most 241 eligible rows times 3 passes, plus 1 `jev auth test`. Retries after exit 4 add to it. The conditional calibration is about 585 short calls. No dollar figure is printed, because every price is a vendor claim |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How many rows are movable, and how many eligible gold-first rows can a pick demote? The census answers both with zero calls.
- Can provider and model be read from each `choice` output, or only from `jev auth test --provider P`? Reading one judgment's JSON at build time answers it. The plan records them from `auth test` until then.
- Is any routing corpus prompt private? The corpus authoring history answers it. The operator decides before the first keyed run.
- Should the Gate 3 calibration also run at `no headroom`? The synthesis triggers it on `underpowered` only (1 to 4 movable rows), yet its stated value is a latency number even when the advisor leaves no headroom. This phase follows the trigger as written. The operator decides whether to widen it.
<!-- /ANCHOR:questions -->

---
