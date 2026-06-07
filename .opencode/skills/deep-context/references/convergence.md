---
title: "Deep Context: Convergence"
description: Stop contract, composite score formula, guard thresholds, and why agreement + relevance are blocking gates for the deep-context loop.
---

# Deep Context: Convergence

`deep-context` converges on **relevance-gated coverage saturation** with **cross-executor agreement** — distinct from `deep-research` (newInfoRatio) and `deep-review` (severity). Computed by `deep-loop-runtime` (`coverage-graph-signals.ts` `computeContextSignals` + `scripts/convergence.cjs` `evaluateContext`).

---

## 1. OVERVIEW

### Purpose

Defines the stop contract for the `deep-context` loop. Every iteration produces signals; the convergence engine evaluates them against thresholds and returns one of `CONTINUE`, `STOP_ALLOWED`, or `STOP_BLOCKED`. The contract ensures the loop stops only when the gathered context is trustworthy (agreement-eligible) and complete (coverage-saturated), not just voluminous.

### When to Use

Load this reference when:
- Tuning convergence thresholds (`convergenceThreshold`, `agreementMin`, `relevanceGate`).
- Diagnosing a `STOP_BLOCKED` outcome and understanding which gate is failing.
- Understanding how agreement and relevance guard against premature or noise-saturated stops.

---

## 2. SIGNALS

| Signal | Meaning | Role |
|--------|---------|------|
| `sliceCoverage` | SLICE nodes with an outgoing `COVERED_BY` edge / total slices | Blocking guard |
| `reuseCatalogCoverage` | REUSE_CANDIDATE nodes confirmed (≥ 1 CONFIRMS or `metadata.verified`) / total | Weighted (highest) |
| `agreementRate` | Findings confirmed by ≥ `agreementMin` (default 2) distinct executors / total findings | Blocking guard |
| `relevanceFloor` | Findings with `metadata.relevance ≥ 0.55` / total findings | Blocking guard |
| `dependencyCompleteness` | DEPENDENCY nodes with a resolved `DEPENDS_ON`/`IMPORTS` edge / total | Weighted |

Each signal **vacuous-passes** (1.0) when its node kind is absent — a feature with no dependencies is not penalized. An empty graph → `CONTINUE`.

---

## 3. COMPOSITE SCORE (STOP SCORE)

```
reuseCatalogCoverage   × 0.30   (reuse-first principle)
agreementRate          × 0.25   (by-model confidence)
sliceCoverage          × 0.20
relevanceFloor         × 0.15
dependencyCompleteness × 0.10
```

The composite score is telemetry (surfaced as `graph_convergence_score`) for trend analysis — it is not a stop gate. `STOP_ALLOWED` is decided by the per-signal thresholds in §4 combined with the host's per-iteration saturation check; the composite score is not compared against any threshold.

---

## 4. STOP CONTRACT

**STOP_BLOCKED** if any blocking guard fails:
- `sliceCoverage < 0.70` — the defined scope has not been swept.
- `relevanceFloor < 0.50` — the loop is collecting tangential noise, not focused context.
- `agreementRate < 0.50` — findings are not yet multi-model-confirmed.

The host records the blocker(s) and continues with a recovery focus targeting the failing gate.

**STOP_ALLOWED** when:
- All blocking guards pass (`sliceCoverage ≥ 0.70`, `relevanceFloor ≥ 0.50`, `agreementRate ≥ 0.50`).
- All weighted thresholds pass (`reuseCatalogCoverage ≥ 0.60`, `dependencyCompleteness ≥ 0.70`).
- The host's per-iteration saturation check passes: new agreement-eligible findings per iteration below `convergenceThreshold` (default 0.10) for K consecutive iterations.

**CONTINUE** otherwise.

---

## 5. WHY AGREEMENT + RELEVANCE ARE GUARDS

By-model shared scope means N executors sweep the **same** code. Without the agreement guard the loop could stop on single-executor (low-confidence) findings; without the relevance guard, small-model over-collection of tangential context would masquerade as coverage and the loop would never saturate. Both gates make "enough, and trustworthy, context" the stop condition — not raw volume.

---

## 6. THRESHOLD REFERENCE

| Parameter | Default | Purpose |
|-----------|---------|---------|
| `relevanceGate` | 0.55 | Findings below this go to `lowConfidence`; excluded from convergence signals |
| `agreementMin` | 2 | Minimum distinct executors for a finding to be agreement-eligible |
| `convergenceThreshold` | 0.10 | New agreement-eligible findings per iteration at which saturation is considered |
| `sliceCoverage` guard | 0.70 | Minimum fraction of SLICE nodes swept |
| `relevanceFloor` guard | 0.50 | Minimum fraction of findings above the relevance gate |
| `agreementRate` guard | 0.50 | Minimum fraction of gated findings that are agreement-eligible |
| `reuseCatalogCoverage` stop | 0.60 | Minimum reuse candidate confirmation rate |
| `dependencyCompleteness` stop | 0.70 | Minimum dependency resolution rate |

`relevanceGate`, `agreementMin`, and `convergenceThreshold` are configurable in `assets/deep_context_config.json` (and overridable in the command's runtime config). The graph STOP thresholds (`sliceCoverage` 0.70, `relevanceFloor` 0.50, `agreementRate` 0.50, `reuseCatalogCoverage` 0.60, `dependencyCompleteness` 0.70) are currently hardcoded in `convergence.cjs#evaluateContext` and are NOT read from config — changing them requires editing that function.
