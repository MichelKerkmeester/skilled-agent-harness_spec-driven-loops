---
title: "Animation Testing"
description: "examples/animation-testing.sh — layout/recalc/task-duration assertions with thresholds and exit codes."
trigger_phrases:
  - "animation performance test"
  - "animation testing script"
  - "layout recalc thresholds"
version: 1.0.0.0
---

# Animation Testing

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`./animation-testing.sh [url] [selector] [trigger-class]` asserts animation performance: layout count (3 or fewer), style recalc count (5 or fewer), task duration (200ms or less), plus before/after visual states and console error checks. Exit `0` means all assertions passed, `1` means one or more failed.

---

## 2. HOW IT WORKS

Thresholds are configurable in the script (`MAX_LAYOUT_COUNT`, `MAX_RECALC_COUNT`, `MAX_TASK_DURATION`), and animation wait times are adjustable per animation duration. Suited for pre-deployment animation validation, regression testing, and CI animation checks.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `examples/animation-testing.sh` | Script | The assertion workflow |
| `references/cdp_patterns.md` §4 | Reference | Performance metrics collection under the hood |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `examples/README.md` §3.2, §5 | Manual | Usage, thresholds, exit codes, customization |

---

## 4. SOURCE METADATA

- Group: Automation and Performance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `automation_and_performance/animation_testing.md`
Related references:
- [performance_baseline.md](../automation_and_performance/performance_baseline.md) — Performance Baseline
- [multi_viewport_test.md](../automation_and_performance/multi_viewport_test.md) — Multi-Viewport Testing
