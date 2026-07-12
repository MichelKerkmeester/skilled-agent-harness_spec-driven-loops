---
title: "Dashboard sparkline trend"
description: "Renders new-information and score history as dashboard sparklines with a flatline advisory signal."
trigger_phrases:
  - "dashboard sparkline trend"
  - "renderSparkline"
  - "trend_flatline"
  - "dashboard TREND section"
  - "newInfoRatio sparkline"
version: 1.14.0.13
---

# Dashboard sparkline trend

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Renders new-information and score history as dashboard sparklines with a flatline advisory signal.

The dashboard trend makes novelty decay, recovery spikes, and flatlining visible without manually comparing iteration rows. It is additive to the reducer output and does not change convergence decisions by itself.

---

## 2. HOW IT WORKS

`renderSparkline(history, opts)` converts numeric history arrays into fixed-width sparkline strings. The reducer uses it when enough history exists, rendering a `## 5. TREND` dashboard section with separate lines for `newInfoRatio` and score history.

When the recent trend is flat for the configured window, the reducer can emit a `trend_flatline` advisory event. The event is diagnostic, not a stop decision, so operators can see a flatline without confusing it with convergence or quality-guard state.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Reducer | Defines `renderSparkline()`, renders the dashboard trend section, and emits flatline advisory events. |
| `.opencode/skills/system-deep-loop/deep-research/assets/deep_research_dashboard.md` | Asset | Documents the dashboard trend section shape. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state-sparkline.test.cjs` | Node test | Verifies growth, decay, and flat sparkline rendering. |
| `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/iteration_execution_and_state_discipline/dashboard_sparkline_trend.md` | Manual playbook | Verifies dashboard trend rendering and advisory flatline evidence. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `state-management/dashboard-sparkline-trend.md`
Related references:
- [strategy-tracking.md](../state_management/strategy_tracking.md) - Strategy tracking
- [jsonl-state-log.md](../state_management/jsonl_state_log.md) - JSONL state log
