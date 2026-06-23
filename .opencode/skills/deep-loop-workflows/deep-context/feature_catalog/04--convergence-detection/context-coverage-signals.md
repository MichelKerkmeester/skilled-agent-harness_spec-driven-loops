---
title: "Context Coverage Signals"
description: "Tracks five convergence signals — sliceCoverage, reuseCatalogCoverage, agreementRate, relevanceFloor, dependencyCompleteness — as the basis for stop decisions."
trigger_phrases:
  - "context coverage signals"
  - "sliceCoverage"
  - "reuseCatalogCoverage"
  - "convergence signals context"
  - "ContextConvergenceSignals"
  - "five coverage signals"
version: 1.2.0.4
---

# Context Coverage Signals

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Tracks five convergence signals — `sliceCoverage`, `reuseCatalogCoverage`, `agreementRate`, `relevanceFloor`, and `dependencyCompleteness` — as the basis for stop decisions.

These signals are computed from the coverage graph state after each iteration and used by `convergence.cjs` to decide CONTINUE, STOP_ALLOWED, or STOP_BLOCKED. Unlike `deep-research` (which uses `newInfoRatio`) and `deep-review` (which uses severity-weighted ratio), `deep-context` uses a reuse-first saturation model with agreement and relevance as blocking guards.

---

## 2. HOW IT WORKS

### Signal Definitions

| Signal | Source | Meaning |
|---|---|---|
| `sliceCoverage` | SLICE nodes with outgoing COVERED_BY edges / total SLICE nodes | Fraction of frontier slices that have been swept |
| `reuseCatalogCoverage` | REUSE_CANDIDATE nodes with CONFIRMS edges from ≥2 executors / total REUSE_CANDIDATE nodes | Fraction of reuse candidates with cross-executor confirmation |
| `agreementRate` | Agreement-eligible findings / all relevance-gated surviving findings | Fraction of findings that have multi-executor confirmation |
| `relevanceFloor` | Minimum relevance score among all surviving (non-gated-out) findings | Lowest relevance of anything still in the finding set |
| `dependencyCompleteness` | DEPENDS_ON / IMPORTS edges within the touch radius / expected edges | Fraction of known dependency edges that have been mapped |

### Computation

`coverage-graph-signals.ts` exports `evaluateContext(ns: Namespace): ContextConvergenceSignals` which queries the SQLite `coverage_nodes` and `coverage_edges` tables for the session's namespace and derives all five signals. A `blendedScore` combines them (weighted toward reuse-first) and is recorded as `graph_convergence_score` in the JSONL log.

### Iteration Record

After each iteration, `step_write_iteration` appends a JSONL iteration record that includes all five signal values alongside the stop reason, seat counts, and sweep duration. These records are the source of truth for trending and stuck detection.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Shared | `ContextConvergenceSignals` interface, `evaluateContext` function, `CONTEXT_AGREEMENT_MIN`, `CONTEXT_RELEVANCE_GATE` constants |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Script | CLI entrypoint that calls `evaluateContext` and returns CONTINUE / STOP_ALLOWED / STOP_BLOCKED |
| `.opencode/skills/deep-loop-workflows/deep-context/references/convergence/convergence_signals.md` | Reference | Full signal table, composite-score weights, and stop contract for the context loop |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/04--convergence-detection/context-coverage-signals.md` | Manual playbook | Verifies all five signals are present in JSONL records and that convergence.cjs returns parseable JSON |

---

## 4. SOURCE METADATA

- Group: Convergence Detection
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--convergence-detection/context-coverage-signals.md`

Related references:
- [relevance-gate.md](relevance-gate.md) — How relevanceFloor and agreementRate act as blocking guards
- [evaluate-context.md](evaluate-context.md) — The convergence.cjs invocation that computes these signals
