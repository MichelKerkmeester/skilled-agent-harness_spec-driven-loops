---
title: Health.md `health-viz` render blocks (researched-validated examples)
description: These blocks are the forms validated against the researched render contract. The fenced language is `health-viz` (the plugin does not read a `health-md` fence)
trigger_phrases:
  - "health-viz render block"
  - "healthmd example asset"
  - "health visualization example"
importance_tier: normal
contextType: general
version: 0.1.0.0
---

# Health.md `health-viz` render blocks (researched-validated examples)

These blocks are the forms validated against the researched render contract. The fenced language is `health-viz` (the plugin does not read a `health-md` fence). Every block names a registered renderer via `type`; the research documents the `step-spiral` renderer explicitly, so it is the only renderer shown here. Documented optional keys are `width`, `height`, inclusive `from`, inclusive `to`, `last`, and `clickAction`. Dates may be ISO dates or built-in dynamic variables such as `{{today:YYYY-MM-DD}}`. The `clickAction` value below labels the first documented click behavior (pin the tooltip); the research does not enumerate exact value spellings.

**Mock-data warning**: when the configured `Health/` data folder is missing or empty, the plugin falls back to deterministic bundled example data. A rendered chart therefore proves neither that a data folder was found nor that real exports were loaded. Verify the selected data folder and at least one authentic source file before trusting a chart.

## 1. OVERVIEW

### Purpose

This asset contains validated `health-viz` render blocks for the Health.md plugin.

### Usage

Copy a block into a note and verify the selected `Health/` data folder and an authentic source file before trusting the rendered chart.

---

## 2. MINIMAL DEFAULT

```health-viz
type: step-spiral
last: 7
```

---

## 3. SIZED CHART

```health-viz
type: step-spiral
last: 7
width: 400
height: 300
```

---

## 4. WINDOWED (INCLUSIVE FROM/TO)

```health-viz
type: step-spiral
from: 2026-08-01
to: 2026-08-07
```

---

## 5. LAST-N DAYS

```health-viz
type: step-spiral
last: 30
```

---

## 6. CLICK ACTION (PIN TOOLTIP)

```health-viz
type: step-spiral
last: 7
clickAction: pin-tooltip
```

---

## 7. DYNAMIC DATE VARIABLE

```health-viz
type: step-spiral
from: {{today:YYYY-MM-DD}}
to: {{today:YYYY-MM-DD}}
```

---

## 8. RELATED RESOURCES
