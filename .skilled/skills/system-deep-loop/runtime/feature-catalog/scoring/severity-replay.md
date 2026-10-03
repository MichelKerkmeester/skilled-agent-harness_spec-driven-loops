---
title: "Severity replay"
description: "Measures offline whether a Jev severity choice separates real P0 findings from false ones better than the recorded severity."
trigger_phrases:
  - "severity replay"
  - "severity-replay"
  - "score-severity-replay.cjs"
  - "severity replay runtime"
  - "scoring severity replay"
version: 1.8.0.0
---

# Severity replay (score-severity-replay.cjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Measures offline whether a Jev severity choice separates real P0 findings from false ones better than the recorded severity.

Run with `node` from the repository root, `scripts/score-severity-replay.cjs` reads every tracked deep-review findings registry and prints the P0 census, the label need and the label gate state. The default run makes no model call and writes no file, and the script holds and reads no credential. It changes no severity, no registry and no review gate. The supported invocation is `node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs [--write-label-sheet <path>] [--labels <file>] [--jev] [--out <dir>]`, and the `USAGE` constant holds `usage: score-severity-replay.cjs [--write-label-sheet <path>] [--labels <file>] [--jev] [--out <dir>]` without printing it.

This feature belongs to the scoring group and is catalogued as F058 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

### Census And P0 Rows

The census reads every tracked deep-review findings registry and prints `registries: <n>`, `findings: <n> (P0 <a>, P1 <b>, P2 <c>, other <d>)` and one `transitions: <from|none> -> <to|none> <n>` line per severity pair. It continues with `p0 rows: <n> in <r> registries (one <o>, two or more <m>)` over the deduplicated P0 rows and one `phrases: <files> review iteration files; "downgraded from P0" <n>; "from P0 to P1" <n>; "from P0 to P2" <n>; "retracted from P0" <n>; "P0 was retracted" <n>` line over review iteration files. The block ends with `labels needed: 20 P0 negatives among <n> P0 rows`, and the counts read the live tree so a later run may differ.

### Labels And The Gate

With `--write-label-sheet <path>` the script writes one JSON line per P0 row holding `registry`, `finding_id`, `title`, `dimension`, `evidence_refs` and an empty `label`. The operator fills each `label` with `real`, `P1`, `P2` or `not_a_finding`, and `--labels <file>` reads the filled sheet back. A negative is any label but `real`.

A labeled run prints `labels: none` or `labels: sha256=<sha> rows=<n>`, then `labeled: <K> (real <r>, P1 <a>, P2 <b>, not_a_finding <c>)`, `labels dropped: <n>` and `baseline: right <r> of <K>`. The question line, `margin: 0.10`, the keep rule line and the power line print before the gate line so every later result can be rechecked by hand:

```
keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= C
```

The gate line is `stop: fewer than 20 labeled P0 negatives` when fewer than 20 rows carry a label other than `real`, `no headroom` when more than nine labeled rows in ten are `real`, and `gate: open K=<k> negatives=<n>` otherwise. A closed gate spawns no `jev` process.

### The Arm And Refusals

The arm sits behind its switch and `--out <dir>`. A closed gate prints `jev arm skipped: label gate`, or `jev arm skipped: no headroom` in the headroom case. Past the gate the arm can skip with `jev arm skipped: jev not on PATH`, `jev arm skipped: version` or `jev arm skipped: no credential`. A run with the arm switch writes `report.json` in `<dir>`, and a run where the arm skips writes only that file and calls no backend.

Refusals exit 2 before any census line. `--jev` without `--out` prints `--jev needs --out <dir> so every call is recorded`. A `--write-label-sheet` path inside the repository prints `refusing to write the label sheet inside the repository` and writes no file. A bad labels row prints its row and its fault, for example `labels row 3: label must be "", real, P1, P2 or not_a_finding, got "x"` or `labels row 3: duplicate row <key>`.

The implementation is source-backed and covered by runtime-owned tests under `.skilled/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/score-severity-replay.cjs` | Script | The offline severity measurement over the P0 census, the label sheet and gate, the backend skip lines and the stored `report.json`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/score-severity-replay.vitest.ts` | Vitest | Covers the census counts, the phrase counter, the label sheet and reader, the gate states, the keep rule outcomes and the backend gate and skips against fixture registries and a stub `jev` binary. |

---

## 4. SOURCE METADATA

- Group: Scoring
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scoring/severity-replay.md`
- Primary sources: `scripts/score-severity-replay.cjs`, `tests/unit/score-severity-replay.vitest.ts`

Related references:
- [bayesian-scorer.md](bayesian-scorer.md) - Bayesian scorer
- [convergence-score-delta.md](convergence-score-delta.md) - Convergence score-delta
- [stop-hint-replay.md](stop-hint-replay.md) - Stop-hint replay
- [stop-rater-replay.md](stop-rater-replay.md) - Stop-rater replay
