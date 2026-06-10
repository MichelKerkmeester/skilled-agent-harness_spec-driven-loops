---
title: "Learning feedback reducers"
description: "Shared feedback aggregation, deferred session-trace causal inference, and triple-gated feedback retention learning with shadow-first safety."
trigger_phrases:
  - "learning feedback reducers"
  - "SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE"
  - "SPECKIT_FEEDBACK_RETENTION_LEARNING"
  - "SPECKIT_FEEDBACK_RETENTION_MODE"
---

# Learning feedback reducers

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Feedback learning now has reducer components that can aggregate interaction evidence, infer weak session-trace causal edges, and propose retention decisions under strict safety gates.

The aggregator is read-only and flagless. The causal reducer is deferred-only and default-off. The retention reducer is shadow-first and requires explicit active-mode evidence before mutating retention state.

---

## 2. HOW IT WORKS

`aggregateEvents` emits `queryCount`, `firstSeen`, `lastSeen`, and `weightedHitCount` alongside existing score fields for each per-memory signal. It does not write or change behavior by itself.

The session-trace causal reducer selects prior same-session feedback sources, prefers same-query matches, caps generated sources, and inserts weak `auto-session` edges only when `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE` is enabled. Dry-run mode returns candidates and skip reasons without writes.

The retention reducer issues `delete`, `extend`, and `protect` decisions from aggregated feedback summaries. It requires `SPECKIT_FEEDBACK_RETENTION_LEARNING`, active `SPECKIT_FEEDBACK_RETENTION_MODE`, and caller-supplied shadow evidence before changing retention rows. Shadow mode writes governance audit rows only.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/lib/feedback/batch-learning.ts` | Shared | Shared aggregate fields for reducer consumers |
| `mcp_server/lib/feedback/session-trace-causal-reducer.ts` | Shared | Deferred causal reducer and dry-run shadow replay |
| `mcp_server/lib/feedback/feedback-retention-reducer.ts` | Shared | Triple-gated retention decision reducer |
| `mcp_server/lib/feedback/edge-tier-basement.ts` | Shared | Narrow edge-floor helper for manual and constitutional edges |
| `mcp_server/ENV_REFERENCE.md` | Reference | Documents reducer flags and shadow default |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/batch-learning.vitest.ts` | Automated test | Aggregator field, formula, idempotency, and read-only coverage |
| `mcp_server/tests/session-trace-causal-reducer.vitest.ts` | Automated test | Flag-off, idempotency, manual protection, caps, and dry-run coverage |
| `mcp_server/tests/feedback-retention-reducer.vitest.ts` | Automated test | Gating, dry-run, shadow, and active apply coverage |
| `mcp_server/tests/memory-retention-feedback-learning.vitest.ts` | Automated test | Retention sweep integration and constitutional immunity |
| `mcp_server/tests/feedback-reducers-integration.vitest.ts` | Automated test | Cross-consumer default-off and independence coverage |

---

## 4. SOURCE METADATA

- Group: Analysis
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--analysis/learning-feedback-reducers.md`

Related references:
- [learning-history-memorygetlearninghistory.md](learning-history-memorygetlearninghistory.md) - Learning history reporting
- [causal-edge-creation-memorycausallink.md](causal-edge-creation-memorycausallink.md) - Causal edge creation surface
