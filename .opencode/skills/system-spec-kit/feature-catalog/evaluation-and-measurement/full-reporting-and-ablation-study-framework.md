---
title: "Full reporting and ablation study framework"
description: "Describes the ablation study framework that disables one retrieval channel at a time to measure Recall@20 impact, and the reporting dashboard that aggregates per-sprint metric summaries with trend analysis."
trigger_phrases:
  - "full reporting and ablation study framework"
  - "ablation study framework"
  - "retrieval channel ablation"
  - "eval_run_ablation eval_reporting_dashboard"
  - "per-sprint metric dashboard"
version: 3.6.0.16
---

# Full reporting and ablation study framework

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Describes the ablation study framework that disables one retrieval channel at a time to measure Recall@20 impact, and the reporting dashboard that aggregates per-sprint metric summaries with trend analysis.

Imagine a car with five engines and you want to know which ones actually help. This feature turns off one engine at a time and measures whether the car goes slower or faster. If removing an engine makes things worse, it is pulling its weight. If removing it makes things better, it was actually hurting. A dashboard then shows trends over time so you can spot problems early.

---

## 2. HOW IT WORKS

The ablation study framework disables one retrieval channel at a time (vector, BM25, FTS5, graph or trigger) and measures Recall@20 delta against a full-pipeline baseline. "What happens if we turn off the graph channel?" now has a measured answer rather than speculation.

The framework uses dependency injection for the search function, making it testable without the full pipeline. Statistical significance is assessed via a sign test using log-space binomial coefficient computation (preventing overflow for n>50, fixed in Sprint 8). Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results). Results are stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation data. The framework runs behind the `SPECKIT_ABLATION` flag. Token-usage aggregation now filters to finite values greater than zero, so ablation reports stop emitting synthetic `0` token rows when `runAblation()` has no real token-usage samples to aggregate.

The reporting dashboard aggregates per-sprint metric summaries (mean, min, max, latest and count) and per-channel performance views (hit count, average latency and query count) from the evaluation database. Trend analysis compares consecutive runs to detect regressions. Sprint labels are inferred from metadata JSON. A `isHigherBetter()` helper correctly interprets trend direction for different metric types. The dashboard now calls `getEvalDb()` before falling back to `initEvalDb()`, which preserves an already-selected non-default or test eval DB instead of silently switching back to the default one. Its request `limit` is the number of sprint groups kept after grouping, not the number of raw eval runs fetched. Both the ablation runner and the dashboard are exposed as new MCP tools: `eval_run_ablation` and `eval_reporting_dashboard`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/lib/eval/ablation-framework.ts` | Lib | Ablation study framework |
| `mcp-server/lib/eval/eval-db.ts` | Lib | Evaluation database |
| `mcp-server/lib/eval/eval-metrics.ts` | Lib | Core metric computation |
| `mcp-server/lib/eval/ground-truth-data.ts` | Lib | Ground truth data |
| `mcp-server/lib/eval/reporting-dashboard.ts` | Lib | Reporting dashboard |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/ablation-framework.vitest.ts` | Automated test | Ablation framework tests |
| `mcp-server/tests/eval-db.vitest.ts` | Automated test | Eval database operations |
| `mcp-server/tests/eval-metrics.vitest.ts` | Automated test | Eval metrics computation |
| `mcp-server/tests/ground-truth.vitest.ts` | Automated test | Ground truth tests |
| `mcp-server/tests/reporting-dashboard.vitest.ts` | Automated test | Dashboard reporting tests |

---

## 4. SOURCE METADATA
- Group: Evaluation And Measurement
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `evaluation-and-measurement/full-reporting-and-ablation-study-framework.md`
Related references:
- [scoring-observability.md](../../feature-catalog/evaluation-and-measurement/scoring-observability.md) — Scoring observability
- [test-quality-improvements.md](../../feature-catalog/evaluation-and-measurement/test-quality-improvements.md) — Test quality improvements

---
## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 014
