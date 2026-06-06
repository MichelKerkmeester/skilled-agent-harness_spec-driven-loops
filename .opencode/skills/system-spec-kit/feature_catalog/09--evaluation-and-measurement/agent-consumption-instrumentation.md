---
title: "Agent consumption instrumentation"
description: "Describes the active retrieval handler instrumentation wiring for agent consumption logging, gated by SPECKIT_CONSUMPTION_LOG and graduated default ON."
trigger_phrases:
  - "agent consumption instrumentation"
  - "consumption logging instrumentation"
  - "speckit_consumption_log feature flag"
  - "retrieval handler consumption wiring"
  - "agent retrieval usage logging"
---

# Agent consumption instrumentation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Describes the active retrieval handler instrumentation wiring for agent consumption logging, gated by `SPECKIT_CONSUMPTION_LOG` and graduated default ON.

This is the wiring that lets the system record how AI agents actually use search results in practice. The logger is now active through the graduated `SPECKIT_CONSUMPTION_LOG` feature flag, which defaults to enabled unless explicitly set to `false` or `0`.

---

## 2. HOW IT WORKS

Instrumentation wiring is present in the retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), and the runtime logger is active through `isConsumptionLogEnabled()`, which delegates to `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`.

Calls remain fail-safe so instrumentation errors never break the handlers, while production runtime can actively write new `consumption_log` rows whenever the flag remains enabled.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/telemetry/consumption-logger.ts` | Lib | Agent consumption logging |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/consumption-logger.vitest.ts` | Automated test | Consumption logger tests |

---

## 4. SOURCE METADATA
- Group: Evaluation And Measurement
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `09--evaluation-and-measurement/agent-consumption-instrumentation.md`
Related references:
- [bm25-only-baseline.md](bm25-only-baseline.md) — BM25-only baseline
- [scoring-observability.md](scoring-observability.md) — Scoring observability

---
## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 012
