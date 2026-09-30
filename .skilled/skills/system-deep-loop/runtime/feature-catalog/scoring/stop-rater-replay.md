---
title: "Stop-rater replay"
description: "Replays recorded deep-research lineage states offline and rates each stop decision against gold derived from the delta files."
trigger_phrases:
  - "stop-rater replay"
  - "stop-rater-replay"
  - "score-stop-rater.cjs"
  - "stop-rater replay runtime"
  - "scoring stop-rater replay"
version: 1.6.0.0
---

# Stop-rater replay (score-stop-rater.cjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Replays recorded deep-research lineage states offline and rates each stop decision against gold derived from the delta files.

Run with `node` from the repository root, `scripts/score-stop-rater.cjs` walks the tracked lineage states and prints a census. The default run makes no model call and writes no file, the script holds and reads no credential, and it changes no stop. It replays recorded lineages offline.

This feature belongs to the scoring group and is catalogued as F056 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

### Census and Baseline

The census walks the tracked `deep-research-state.jsonl` lineages and prints the `lineages:`, `gold:`, `reads:`, `method recorded:`, `method legacy:`, `method sources:`, `baseline:` and `question counts:` lines, then `margin: 0.10`, the keep rule line, the power note and the gate line. The gate line is `no headroom` when the baseline is right on more than nine of every ten sampled lineages, and `planned calls: deem <n> jev <3n+1>` otherwise.

A lineage's gold iteration is the last iteration whose delta file introduces at least one source seen in no earlier iteration. A lineage whose findings carry no source has no gold and never enters the sample. A stop reads the evidence right when it lands at gold or one iteration after it.

The census rates three stop rules per sampled lineage. `recorded` is the last iteration the state recorded. `legacy` replays the convergence vote over the recorded novelty ratios, the rolling mean, the MAD noise floor and question coverage with the weights redistributed when a signal has no data, and falls back to the last iteration when the vote never stops. `sources` runs the same vote over per-iteration first-appearance ratios. The baseline is the method that read the most sampled lineages right, with a tie going to the first of `legacy`, `sources` and `recorded` in that order.

### Label Gate and Keep Rule

The label gate keeps every model arm closed until the operator's `--gold-reads <file>` confirms the derived gold. The file holds one JSON object per line with `lineage`, `gold_iteration` and `labeler`, and the gate checks the first five sampled lineages. Without five confirmed reads the run prints `stop: fewer than 5 confirmed lineages`, and a read that differs prints `stop: derived gold disagrees on <n> of 5 lineages`. Either stop line exits 0 before any backend gate and any call. A malformed reads row exits 2 before any line prints.

Every run prints `margin: 0.10`, the keep rule line and the power note so a decision can be rechecked by hand:

```
keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= C (jev only)
power: a keep needs at least 5 wins with no loss, since 0.5^5 = 0.03125 < 0.05
```

### Deem and Jev Arms

`--jev` and `--deem` each need `--out <dir>` so every call is recorded. Without one the run exits 2 with `--jev needs --out <dir> so every call is recorded` or the `--deem` form before any line prints. With both switches the Jev gate and arm run first, then the Deem gate and arm, each on its own gate and regardless of the other's outcome.

The Jev gate accepts the client only at version `jev 0.6.2` with a credential for its provider, `JEV_PROVIDER` or `official`. The arm sends published research delta text off the machine and withholds every lineage whose delta files are not all at `origin/main`, recording each withheld iteration as `unmeasured_unpublished`. It asks each iteration three times so unstable answers count as flips, and the median of the three levels becomes the iteration's ratio.

The Deem gate accepts only the local server that reports model `deem-0.8-v1` with its model and source commits. The arm asks each iteration once and nothing leaves the machine. A failed gate prints its skip line and runs no call, `jev arm skipped: jev not on PATH`, `jev arm skipped: version`, `jev arm skipped: no credential`, `deem arm skipped: not reachable`, `deem arm skipped: stub backend`, `deem arm skipped: model` or `deem arm skipped: bad health response`.

Every call lands in `<out>/calls.jsonl` with its status and wall time, and a run with `--out` writes `<out>/report.json`. A state over 24,000 characters is withheld as `unmeasured_oversize` with no call. A finished arm prints one `verdict <backend>:` line carrying `keep`, `kill` or `stop`, its reason and its counts, and a model or commit pair that changed since the stored report prints `requalify: model changed` or `requalify: model commit changed` first. An arm that stops mid-run prints its `<backend> arm stopped:` line and `<backend>: partial lineages=<n>` and no verdict.

The implementation is source-backed and covered by runtime-owned tests under `.skilled/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/score-stop-rater.cjs` | Script | Offline replay of recorded stop decisions, the census, the label gate and the opt-in Deem and Jev arms. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/score-stop-rater.vitest.ts` | Vitest | Covers the walker, the gold rule, the vote, the label gate and both arms against stub `cli-deem` and `jev` binaries. |

---

## 4. SOURCE METADATA

- Group: Scoring
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scoring/stop-rater-replay.md`
- Primary sources: `scripts/score-stop-rater.cjs`, `tests/unit/score-stop-rater.vitest.ts`

Related references:
- [bayesian-scorer.md](bayesian-scorer.md) - Bayesian scorer
- [convergence-score-delta.md](convergence-score-delta.md) - Convergence score-delta
