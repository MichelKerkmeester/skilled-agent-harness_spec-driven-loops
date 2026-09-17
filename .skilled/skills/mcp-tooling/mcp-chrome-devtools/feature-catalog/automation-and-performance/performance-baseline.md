---
title: "Performance Baseline"
description: "examples/performance-baseline.sh — metrics, HAR, screenshot, console, and DOM stats in one capture."
trigger_phrases:
  - "performance baseline script"
  - "performance regression capture"
  - "bdg performance metrics"
version: 1.0.0.0
---

# Performance Baseline

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`./performance-baseline.sh [url] [output-dir]` captures a comprehensive baseline: performance metrics (Layout, Script, Task durations), a network HAR trace, a screenshot, console logs, DOM statistics, and a formatted summary — all timestamped for historical comparison.

---

## 2. HOW IT WORKS

Built on `bdg cdp Performance.enable` / `Performance.getMetrics` plus HAR export and screenshot capture. Use before/after an optimization and diff the `TaskDuration` metric with `jq`, or run in CI for pre-deployment validation.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `examples/performance-baseline.sh` | Script | The production baseline workflow |
| `references/cdp-patterns.md` §4, §8 | Reference | Performance domain patterns and monitoring pipeline |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `examples/README.md` §3.1 | Manual | Usage, captured outputs, and use cases |

---

## 4. SOURCE METADATA

- Group: Automation and Performance
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `automation-and-performance/performance-baseline.md`
Related references:
- [har-export.md](../../feature-catalog/console-and-network/har-export.md) — HAR Export
- [ci-integration.md](../../feature-catalog/automation-and-performance/ci-integration.md) — CI Integration
