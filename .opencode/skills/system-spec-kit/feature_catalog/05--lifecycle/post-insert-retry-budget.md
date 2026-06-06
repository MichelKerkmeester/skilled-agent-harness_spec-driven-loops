---
title: "Post-insert retry budget"
description: "The implementation added a bounded retry budget for save-time enrichment so structurally non-retryable post-insert failures stop after three attempts instead of looping indefinitely."
trigger_phrases:
  - "post-insert retry budget"
  - "retry-budget"
  - "bounded enrichment retry"
  - "stop looping on post-insert failure"
  - "causal link retry limit"
---

# Post-insert retry budget

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The implementation added a bounded retry budget for save-time enrichment so structurally non-retryable post-insert failures stop after three attempts instead of looping indefinitely.

This is lifecycle control for the enrichment pipeline. It keeps the save path from re-scheduling the same doomed repair work forever and gives operators a deterministic reset point when a spec-doc record is retried successfully or the process restarts.

---

## 2. HOW IT WORKS

### Core Behavior

Commit `61f93c9bf` introduced `mcp_server/lib/enrichment/retry-budget.ts` and wired it into the `partial_causal_link_unresolved` branch of `handlers/save/post-insert.ts`.

The retry budget keys attempts on `(memoryId, step, reason)` tuples. `shouldRetry()` allows the first three attempts, `recordFailure()` increments the budget when the same unresolved condition recurs, and `clearBudget(memoryId?)` clears either one memory's counters or the whole in-memory budget. `getBudgetSize()` is exposed for diagnostics and tests.

### Configuration

The current `N=3` cap is a heuristic bounded hot-loop budget, not an empirically calibrated threshold. Runtime retry decisions now emit structured `retry_attempt` events with `{memoryId, step, reason, attempt, outcome, timestamp}` so future tuning can use real attempt histograms instead of guesswork.

### Edge Cases & Caveats

The current consumer is the deferred post-insert enrichment path. If causal-link backfill keeps returning `partial_causal_link_unresolved`, the save pipeline now stops requeueing after the third failure and emits a structured warning instead of continuing an unbounded retry loop. A successful completion clears the spec-doc record-specific budget.

The budget is intentionally process-local. It resets on restart, which is acceptable for the current save lifecycle because the feature is designed to prevent hot-loop retry churn inside one MCP process rather than to persist retry state across deployments.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/enrichment/retry-budget.ts` | Lib | In-memory retry budget keyed by memory ID, enrichment step, and failure reason |
| `mcp_server/handlers/save/post-insert.ts` | Handler | Consults the retry budget before re-scheduling deferred enrichment |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/retry-budget.vitest.ts` | Automated test | Budget counting, isolation, exhaustion, and reset behavior |
| `mcp_server/tests/post-insert-deferred.vitest.ts` | Automated test | Deferred enrichment interactions with retry-budget reset behavior |

---

## 4. SOURCE METADATA
- Group: Lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--lifecycle/post-insert-retry-budget.md`
Related references:
- [constitutional-memory-end-to-end-lifecycle.md](constitutional-memory-end-to-end-lifecycle.md) — Constitutional Memory end-to-end lifecycle
