---
title: "Convergence check"
description: "The CONVERGE-state decision: artifact-coverage AND dry-run-stability, with max-iterations as an independent hard stop."
trigger_phrases:
  - "convergence check"
  - "check-convergence.cjs"
  - "coverage and stability AND"
  - "max-iterations hard stop"
  - "nothing to converge"
version: 1.0.0.1
---

# Convergence check

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The `CONVERGE`-state decision: artifact-coverage AND dry-run-stability, with max-iterations as an independent hard stop.

`check-convergence.cjs` is the single-shot convergence check the planned command loop (phase-009, not yet built) will call once per iteration, and it is runnable directly via its own CLI today. It is the NFR-R01-sanctioned "documented manual coverage check" fallback — deliberately not a `runtime/scripts/convergence.cjs` code path, because that engine's loopType enum rejects `alignment` and its review-shaped composite score depends on graph conventions deep-alignment's adapters have no reason to produce.

## 2. HOW IT WORKS

It reduces the state log into the registry, reads iteration records and the corpus sizes, then evaluates two signals. Artifact-coverage is the fraction of discovered artifacts checked at least once across all applicable lanes (a zero-artifact lane is excluded from both sides of the ratio — vacuously covered, matching the reducer's `NOT_APPLICABLE` treatment); default threshold 100%. Dry-run stability requires the last N iteration records (default window 2, across all lanes in append order) to all report `newFindingsRatio === 0`; fewer than N recorded fails closed to "not stable," so a fresh run can never converge on its first iteration. `CONVERGED` requires both — never OR — because full coverage with unstable findings is not done, and stability with incomplete coverage is not done either.

`max-iterations` is an independent hard stop applied after the AND-pair regardless of its outcome: `iterationsRun >= maxIterations` forces `STOP_MAX_ITERATIONS` even when neither signal is met. A run with zero applicable lanes returns `NOTHING_TO_CONVERGE` rather than a false trivial pass. The script writes nothing — it is a decision only.

**Difference from deep-review:** deep-review's convergence is a graph-assisted weighted composite vote over three signals plus a legal-stop gate bundle, gated by a `graph_convergence` event. deep-alignment's is a simpler, self-contained coverage-AND-stability formula computed directly against its own reducer registry and JSONL log, precisely because it does not seed deep-review's `DIMENSION`/`FINDING` graph vocabulary and so cannot reuse that composite score meaningfully.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/check-convergence.cjs` | Script | Implements `computeArtifactCoverage`, `computeDryRunStability`, and the AND-plus-hard-stop decision (`CONVERGED`/`CONTINUE`/`STOP_MAX_ITERATIONS`/`NOTHING_TO_CONVERGE`). |
| `runtime/scripts/reduce-alignment-state.cjs` | Runtime | Supplies the registry (per-lane checked counts, applicable-lane verdicts) the coverage math reads. |
| `references/state-machine-wiring.md` | Reference | Section 4 states the AND formula and the independent max-iterations stop; Section 5 explains the loopType decision behind the standalone script. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/tests/state-machine-wiring.test.cjs` | Regression test | Proves the AND semantics (coverage 100% but not-yet-stable → CONTINUE, then CONVERGED once stable), the independent max-iterations stop, and the zero-lanes `NOTHING_TO_CONVERGE` exit. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `loop-lifecycle/convergence-check.md`
- Primary sources: `scripts/check-convergence.cjs`, `runtime/scripts/reduce-alignment-state.cjs`, `references/state-machine-wiring.md`
Related references:
- [corpus-partitioning.md](../../feature-catalog/loop-lifecycle/corpus-partitioning.md) — Corpus partitioning
- [alignment-report-reducer.md](../../feature-catalog/loop-lifecycle/alignment-report-reducer.md) — Alignment-report reducer
