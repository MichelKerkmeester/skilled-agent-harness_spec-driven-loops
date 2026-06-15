---
title: "Cross-Executor Agreement"
description: "Applies the relevance gate, marks agreement-eligible findings, verifies each unit's file:symbol against the code graph, and computes the agreement rate metric."
trigger_phrases:
  - "cross-executor agreement"
  - "relevance gate"
  - "agreement eligible"
  - "code graph verification"
  - "freshness unverified"
  - "agreement rate metric"
---

# Cross-Executor Agreement

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Applies the relevance gate, marks agreement-eligible findings, verifies each unit's `file:symbol` against the code graph, and computes the agreement rate metric.

Cross-executor agreement is the primary confidence signal in `deep-context`. A finding confirmed by multiple distinct executors over the same shared focus is more trustworthy than one found by a single executor. This step applies the relevance floor to prune low-signal units, then promotes surviving units to agreement-eligible status when they cross the `agreementMin` threshold.

---

## 2. HOW IT WORKS

### Relevance Gate

After deduplication, `step_merge_findings` drops any unit whose maximum relevance score across all producers falls below `config.relevanceGate` (default 0.55). Units in the marginal range [0.40, 0.55) are not dropped outright — they are tagged `marginal` and routed to the Gaps section of the Context Report so they are visible without polluting the primary finding set.

### Code Graph Verification

Each surviving unit's `file:symbol` is verified against the code graph (`code_graph_query`). Units that pass verification are labeled `freshness: verified`. Units that cannot be confirmed are labeled `freshness: unverified`. An unverified citation in the final report is worse than omission — the report must never present an unverified ref as confirmed.

### Agreement Rate Metric

`agreementRate` is computed as `count(agreement-eligible units) / count(all surviving units after relevance gate)`. This metric is persisted in the JSONL iteration record and in the coverage graph snapshot. `convergence.cjs` uses it as a blocking guard: `agreementRate < 0.50` → `STOP_BLOCKED`. `reduce-state.cjs` recomputes it in the same way when run as a standalone reducer.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Workflow | `step_merge_findings` — relevance gate, verification, agreement-eligible marking, agreementRate computation |
| `.opencode/skills/deep-loop-workflows/deep-context/scripts/reduce-state.cjs` | Script | Constants `DEFAULT_RELEVANCE_GATE = 0.55` and `DEFAULT_AGREEMENT_MIN = 2`; same gate logic as step_merge_findings |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Shared | `ContextConvergenceSignals.agreementRate` and `evaluateContext` that uses it as a blocking signal |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/manual_testing_playbook/03--agreement-merge/cross-executor-agreement.md` | Manual playbook | Verifies relevance gate drops low-relevance units, marginal tagging, and freshness label on unverified refs |

---

## 4. SOURCE METADATA

- Group: Agreement Merge
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--agreement-merge/cross-executor-agreement.md`

Related references:
- [finding-dedup-by-symbol.md](finding-dedup-by-symbol.md) — Dedup and attribution that precedes this step
- [relevance-gate.md](../04--convergence-detection/relevance-gate.md) — How relevanceFloor feeds the STOP_BLOCKED convergence guard
