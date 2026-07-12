---
title: "Scoring observability"
description: "Describes the 5%-sampled scoring observation logger that persists before/after score deltas and novelty/interference fields to `scoring_observations` without blocking scoring execution."
trigger_phrases:
  - "scoring observability"
  - "scoring observation logger"
  - "5% sampled score delta logging"
  - "scoring_observations table"
  - "before after score snapshot"
version: 3.6.0.15
---

# Scoring observability

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Describes the 5%-sampled scoring observation logger that persists before/after score deltas and novelty/interference fields to `scoring_observations` without blocking scoring execution.

This is like a security camera for how scores change. It randomly samples a small percentage of scoring events and saves a before-and-after snapshot. If scores start behaving strangely, you can look at these recordings to understand what happened. The sampling keeps it lightweight so it does not slow anything down.

---

## 2. HOW IT WORKS

Scoring observability logs to `scoring_observations` with a 5% sampler (`SAMPLING_RATE = 0.05`). Each observation includes memory/query identifiers, score-before/score-after values, score delta and novelty/interference fields provided by the caller.

The observability module does not remove novelty fields or hardcode novelty values. It persists whatever `ScoringObservation` payload it receives. This keeps schema compatibility while allowing calling code to set novelty data to zero when the runtime feature is inactive.

Failures are fail-safe but not silent. Initialization, insert and stats-query errors are caught and logged with `console.error`, and scoring execution continues unchanged.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/telemetry/scoring-observability.ts` | Lib | Scoring observability |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/scoring-observability.vitest.ts` | Automated test | Scoring observability tests |
| `mcp_server/tests/scoring.vitest.ts` | Automated test | General scoring tests |

---

## 4. SOURCE METADATA
- Group: Evaluation And Measurement
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `evaluation_and_measurement/scoring_observability.md`
Related references:
- [agent-consumption-instrumentation.md](agent_consumption_instrumentation.md) — Agent consumption instrumentation
- [full-reporting-and-ablation-study-framework.md](full_reporting_and_ablation_study_framework.md) — Full reporting and ablation study framework

---
## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 013
