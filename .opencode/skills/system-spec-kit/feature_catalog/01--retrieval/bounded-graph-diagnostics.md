---
title: "Bounded graph diagnostics"
description: "memory_search trace responses expose raw, normalized, appliedBonus, and capApplied fields for the bounded graph bonus so operators can reason about ranking shifts without depending on the retired rollout-state ladder."
trigger_phrases:
  - "bounded graph diagnostics"
  - "graphContribution trace"
  - "graph bonus ranking"
  - "appliedBonus capApplied"
  - "search result graph contribution"
version: 3.6.0.4
---

# Bounded graph diagnostics

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Bounded graph diagnostics surface the live trace fields that explain how the graph contribution affects each search result: the raw signal, the normalized value, the bonus actually applied to score, and whether the per-result cap clipped the bonus. The diagnostics are stable across identical runs, so operators can verify deterministic ordering without dredging the retired rollout-state ladder.

Any legacy `rolloutState` label that still appears in the trace envelope is compatibility metadata only. The active operator contract no longer depends on `trace_only`, `bounded_runtime`, or `off` transitions for ordering or behavior decisions.

---

## 2. HOW IT WORKS

The hybrid-search formatter writes `trace.graphContribution` onto each result when `includeTrace` is set. The bonus pipeline normalizes the raw score, applies the bonus subject to the per-result cap, and records both the applied delta and a `capApplied` flag.

- `trace.graphContribution.raw`: pre-normalization score from the graph walk
- `trace.graphContribution.normalized`: clamped score after normalization
- `trace.graphContribution.appliedBonus`: actual bonus added to the result score
- `trace.graphContribution.capApplied`: `true` when the bonus was clipped at the per-result cap

Repeated identical queries return identical ordering because the contribution math is pure given the same corpus, and the formatter preserves field order across runs.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/formatters/search-results.ts` | Formatter | Attaches `trace.graphContribution` envelope to each result when tracing is on |
| `mcp_server/lib/search/hybrid-search.ts` | Library | Computes raw, normalized, and applied bonus values; emits `capApplied` flag |
| `mcp_server/handlers/memory-search.ts` | Handler | Surfaces the trace envelope to callers when `includeTrace` is true |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/search-results-format.vitest.ts` | Automated test | Trace envelope shape, ordering stability, cap behavior |
| `mcp_server/tests/hybrid-search.vitest.ts` | Automated test | Bonus math, normalization, and cap thresholds |

---

## 4. SOURCE METADATA
- Group: Retrieval
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--retrieval/bounded-graph-diagnostics.md`
Related references:
- [session-transition-trace-contract.md](session-transition-trace-contract.md) — Session transition trace contract
- [memory-search-command-routing.md](memory-search-command-routing.md) — /memory:search command routing
