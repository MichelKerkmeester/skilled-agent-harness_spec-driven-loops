---
title: "Stop-hint replay"
description: "Replays one stop-rater report offline and scores whether each recorded stop would have made a good confirm-mode hint."
trigger_phrases:
  - "stop-hint replay"
  - "stop-hint-replay"
  - "score-stop-hint.cjs"
  - "stop-hint replay runtime"
  - "scoring stop-hint replay"
version: 1.7.0.0
---

# Stop-hint replay (score-stop-hint.cjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Replays one stop-rater report offline and scores whether each recorded stop would have made a good confirm-mode hint.

Run with `node` from the repository root, `scripts/score-stop-hint.cjs` reads the report under `--rater-report <dir>` and prints a hint count and one Keep-Rule verdict per column. The default run makes no model call and writes no file, and it changes no gate and no live loop. The supported invocation is `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report <dir> [--jev] [--deem] [--out <dir>]`.

This feature belongs to the scoring group and is catalogued as F057 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

### Hints and Columns

The script reads one stop-rater report, the `report.json` that `scripts/score-stop-rater.cjs --out <dir>` writes. It spawns no process and calls no model in any mode. The default run scores `legacy` and `sources`, the two columns every report carries, and `--jev` and `--deem` add the rater's recorded `jev` and `deem` columns. A model column needs no `--out`, since no call is made.

A column's recorded stop is a hint only when it lands strictly before the lineage's recorded last iteration. A hint at or after the gold iteration is right and saves the iterations from the hint to the last. A hint before gold is wrong and saves nothing. A lineage with no recorded stop for a column leaves that lineage unmeasured for that column. A requested model column the rater skipped, stopped or never recorded prints `jev column skipped: rater report has none` or the `deem` form instead of that column's lines.

### Label Gate and Keep Rule

Once the refusals listed under Stored Report and the Hint Line have passed (each exits 2 before any output line), a run on a report whose label gate did not pass prints `stop: rater report has no confirmed gold` and exits 0 before any other line. Nothing is written even when `--out` is given. Past the gate the keep rule line prints first so every verdict can be rechecked by hand:

```
keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, precision 10*W >= 9*(W+L), savings 5*W >= M, sign test p_win < 0.05, flips 10*F <= C (jev only)
```

Each column prints `column <name>: measured <M> hints <n> right <W> wrong <L> no hint <n> saved <n>` and then its verdict line `verdict <name>: <keep|kill|stop (coverage)|stop (precision)|stop (savings)|stop (sign test)|stop (flips)> K=<n> M=<n> W=<n> L=<n> saved=<n> p=<p> report=<first 12 hex of the report's SHA-256>`. The columns print in the order `legacy`, `sources`, `jev`, `deem`. The first failed check decides the outcome in the order the rule prints: coverage, kill, precision, savings, sign test, then flips for `jev` alone. A kill prints its loss tail and every other outcome its win tail. A model column's verdict carries the rater identity the report recorded: `jev_version`, `provider` and `model` for `jev`, `model`, `model_commit` and `source_commit` for `deem`.

### Stored Report and the Hint Line

With `--out <dir>` a run past the gate writes `<dir>/report.json` holding every verdict line and, for each kept column, the stored hint `**Stop hint**: <column> replay says this loop found its last new cited source by iteration <t>`. The `<t>` stays literal for the live gate to fill. A run stopped at the gate writes nothing. A model column whose stored rater identity changed prints `requalify: rater changed` before its verdict.

Refusals exit 2 before any output line. A run without `--rater-report` prints `--rater-report <dir> is required`. A missing report prints `rater report not found: <dir>/report.json`, a report that is not JSON prints `rater report is not JSON: <path>`, one without a lineage list prints `rater report has no lineage list: <path>`, and a lineage without numeric gold and last iteration prints `rater report lineage <i> is missing gold or lastIteration`. An `--out` naming the report's own folder prints `--out <dir> would overwrite the rater report: <dir>/report.json`. An unknown switch prints node's own parser message.

The implementation is source-backed and covered by runtime-owned tests under `.skilled/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/score-stop-hint.cjs` | Script | Offline replay of one stop-rater report, the hint counts, one Keep-Rule verdict per column and the stored report. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/score-stop-hint.vitest.ts` | Vitest | Covers the report reader, the hint rule, column skips, the Keep Rule verdicts, the requalify line and the stored report against fixture reports and stub `cli-deem` and `jev` binaries. |

---

## 4. SOURCE METADATA

- Group: Scoring
- Canonical catalog source: `feature-catalog.md`
- Feature ID: F057
- Feature file path: `scoring/stop-hint-replay.md`
- Primary sources: `scripts/score-stop-hint.cjs`, `tests/unit/score-stop-hint.vitest.ts`

Related references:
- [bayesian-scorer.md](bayesian-scorer.md) - Bayesian scorer
- [convergence-score-delta.md](convergence-score-delta.md) - Convergence score-delta
- [stop-rater-replay.md](stop-rater-replay.md) - Stop-rater replay
