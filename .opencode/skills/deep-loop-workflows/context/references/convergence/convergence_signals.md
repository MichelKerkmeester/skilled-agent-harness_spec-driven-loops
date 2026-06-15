---
title: "Deep Context: Convergence Signals"
description: The five context signals, their blocking-vs-weighted roles, composite-score weights, and the threshold reference table.
trigger_phrases:
  - "five context signals"
  - "blocking guards vs weighted signals"
  - "composite convergence score"
  - "agreement min threshold"
  - "relevance gate tuning"
importance_tier: normal
contextType: implementation
---

# Deep Context: Convergence Signals

The five signals that drive `deep-context` convergence — their meaning, role, scoring weights, and thresholds. The compact stop contract lives in [convergence.md](./convergence.md).

---

## 1. OVERVIEW

### Purpose

Define the five `deep-context` convergence signals, which of them are blocking guards versus weighted contributors, how the composite score is computed, and the threshold each signal is checked against.

### When to Use

Load this reference when tuning `convergenceThreshold` / `agreementMin` / `relevanceGate`, when diagnosing which signal caused a `STOP_BLOCKED` or held the loop in `CONTINUE`, or when interpreting the `graph_convergence_score` telemetry.

### Core Principle

Signals saturation-vote STOP; the blocking guards authorize or block it. A high composite score cannot buy past a failed guard.

### Key Sources

- Signal computation: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` (`computeContextSignalsFromData`, `CONTEXT_RELEVANCE_GATE`, `CONTEXT_AGREEMENT_MIN`).
- Threshold evaluation + composite weights: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` (`evaluateContext`, `computeCompositeScore`).
- Config defaults: `.opencode/skills/deep-loop-workflows/context/assets/deep_context_config.json`.

This reference cross-links its feature_catalog counterpart, [context-convergence-signals.md](../../feature_catalog/06--coverage-graph-schema/context-convergence-signals.md), which documents the `ContextConvergenceSignals` interface and per-signal query semantics; this file does not restate those queries.

---

## 2. THE FIVE SIGNALS

Each signal is a ratio in `[0.0, 1.0]` computed over the session-scoped coverage subgraph. "Finding nodes" are the kinds `REUSE_CANDIDATE`, `PATTERN`, and `CONSTRAINT`.

| Signal | Meaning | Role |
|--------|---------|------|
| `sliceCoverage` | SLICE nodes with an outgoing `COVERED_BY` edge / total SLICE nodes | Blocking guard |
| `reuseCatalogCoverage` | REUSE_CANDIDATE nodes confirmed (agreement ≥ 1 via a CONFIRMS edge or `metadata.confirmations`, OR `metadata.verified === true`) / total REUSE_CANDIDATE nodes | Weighted (highest) |
| `agreementRate` | Relevance-gated findings confirmed by ≥ `agreementMin` distinct executors / total relevance-gated findings | Blocking guard |
| `relevanceFloor` | Findings with `metadata.relevance ≥ 0.55` / total findings | Blocking guard |
| `dependencyCompleteness` | DEPENDENCY nodes that are the target of a resolved `DEPENDS_ON` edge / total DEPENDENCY nodes | Weighted |

Each signal **vacuous-passes** (`1.0`) when its node kind is absent — a feature with no dependencies is not penalized, matching the review `p0ResolutionRate` rule. An empty graph short-circuits to `CONTINUE` before signals are computed.

> **agreementRate is measured over relevance-gated findings only.** Below-gate noise is not real context and must not depress cross-executor agreement. `relevanceFloor` separately tracks how much of the catalog clears the gate. `DEPENDS_ON` is `SYMBOL → DEPENDENCY` (the DEPENDENCY node is the edge target), so a dependency is "resolved" when it is the target of a `DEPENDS_ON` edge; `IMPORTS` is `FILE → FILE` and is excluded from `dependencyCompleteness`.

---

## 3. BLOCKING GUARDS VS WEIGHTED SIGNALS

The two roles are enforced separately in `evaluateContext`.

### Blocking Guards

`sliceCoverage`, `relevanceFloor`, and `agreementRate` carry `role: 'blocking_guard'` in the decision trace. When any one falls below its threshold, `evaluateContext` pushes a `severity: 'blocking'` blocker and the decision becomes `STOP_BLOCKED` regardless of the other signals or the composite score. These are the guards described in [convergence.md](./convergence.md) §3.

### Weighted Signals

`reuseCatalogCoverage` and `dependencyCompleteness` carry `role: 'weighted'`. They must still clear their thresholds for `STOP_ALLOWED` (the decision is `STOP_ALLOWED` only when **every** trace entry passes), but a sub-threshold weighted signal yields `CONTINUE`, not a hard block — there is no blocker pushed for them, so they never trigger a recovery focus on their own.

### Contradiction Warning

When seats assert incompatible contracts for the same `unit_id`, `evaluateContext` records a `context_contradictions` blocker at `severity: 'warning'`. Warnings are surfaced for reconciliation but do **not** block STOP by themselves.

---

## 4. COMPOSITE SCORE

`computeCompositeScore(signals, 'context')` blends the five signals with reuse-first weights:

```text
reuseCatalogCoverage   × 0.30   (reuse-first principle)
agreementRate          × 0.25   (by-model confidence)
sliceCoverage          × 0.20
relevanceFloor         × 0.15
dependencyCompleteness × 0.10
```

Each input is clamped to `[0.0, 1.0]`; non-finite values are treated as `0`. The result is rounded to three decimals and surfaced as `graph_convergence_score` in the JSONL `graph_convergence` event.

The composite score is **telemetry for trend analysis — it is not a stop gate.** `STOP_ALLOWED` is decided by the per-signal thresholds in §5 combined with the host's per-iteration saturation check; the composite score is never compared against any threshold.

---

## 5. THRESHOLD REFERENCE

| Parameter | Default | Role | Purpose |
|-----------|---------|------|---------|
| `relevanceGate` | `0.55` | gate | Findings below this go to `lowConfidence`; excluded from convergence signals (`CONTEXT_RELEVANCE_GATE`) |
| `agreementMin` | `2` | gate | Minimum distinct executors for a finding to be agreement-eligible (`CONTEXT_AGREEMENT_MIN`) |
| `convergenceThreshold` | `0.10` | host saturation | New agreement-eligible findings per iteration below which a sweep counts as low-progress |
| `stuckThreshold` | `2` | host saturation | Consecutive low-progress sweeps before `stuckRecovery` |
| `sliceCoverage` | `0.70` | blocking guard | Minimum fraction of SLICE nodes swept |
| `relevanceFloor` | `0.50` | blocking guard | Minimum fraction of findings above the relevance gate |
| `agreementRate` | `0.50` | blocking guard | Minimum fraction of gated findings that are agreement-eligible |
| `reuseCatalogCoverage` | `0.60` | weighted | Minimum reuse-candidate confirmation rate |
| `dependencyCompleteness` | `0.70` | weighted | Minimum dependency resolution rate |

### Configurable vs Hardcoded

| Source of truth | Parameters | How to change |
|-----------------|------------|---------------|
| `deep_context_config.json` (overridable per run) | `relevanceGate`, `agreementMin`, `convergenceThreshold`, `stuckThreshold`, `maxIterations` | Edit config or pass the matching command flag |
| `convergence.cjs#evaluateContext` (hardcoded) | The graph STOP thresholds: `sliceCoverage 0.70`, `relevanceFloor 0.50`, `agreementRate 0.50`, `reuseCatalogCoverage 0.60`, `dependencyCompleteness 0.70` | Edit the `thresholds` object in `evaluateContext`; they are NOT read from config |
| `coverage-graph-signals.ts` (hardcoded) | `CONTEXT_RELEVANCE_GATE 0.55`, `CONTEXT_AGREEMENT_MIN 2` (used during signal computation) | Edit the module constants |

> Note: `relevanceGate` and `agreementMin` appear in both config and the signals module. The config values drive the host-side merge (which findings are kept / counted agreement-eligible); the module constants drive the graph-side signal recomputation. Keep them aligned when tuning.

---

## 6. TUNING

| Goal | Adjustment |
|------|------------|
| Broader, deeper context | Raise `maxIterations`; lower `convergenceThreshold` so saturation requires more genuinely-new agreement |
| Faster completion | Raise `convergenceThreshold`; lower `maxIterations` |
| Higher-confidence catalog | Raise `agreementMin` (more executors must agree) — requires a larger pool |
| Stricter relevance | Raise `relevanceGate` so more marginal findings drop to `lowConfidence` |
| Tighter scope sweep | Raise the hardcoded `sliceCoverage` guard in `evaluateContext` (requires editing the function) |

Changing `agreementMin` above the pool size makes `agreementRate` unsatisfiable; the preflight contract warns when the pool has only one seat (no agreement signal possible).
