---
title: "Health.md health-viz Render Blocks"
description: "Researched-validated health-viz render-block forms for the step-spiral renderer, with the documented optional keys and the mock-data warning."
trigger_phrases:
  - "health-viz render block"
  - "health-md step-spiral block"
importance_tier: "normal"
contextType: "implementation"
version: 0.24.2.0
---

# Health.md `health-viz` render blocks (researched-validated examples)

These blocks are the forms validated against the researched render contract. The fenced language is `health-viz` (the plugin does not read a `health-md` fence). Every block names a registered renderer via `type`; the research documents the `step-spiral` renderer explicitly, so it is the only renderer shown here. Documented optional keys are `width`, `height`, inclusive `from`, inclusive `to`, `last`, and `clickAction`. Dates may be ISO dates or built-in dynamic variables such as `{{today:YYYY-MM-DD}}`. The `clickAction` value below labels the first documented click behavior (pin the tooltip); the research does not enumerate exact value spellings.

**Mock-data warning**: when the configured `Health/` data folder is missing or empty, the plugin falls back to deterministic bundled example data. A rendered chart therefore proves neither that a data folder was found nor that real exports were loaded. Verify the selected data folder and at least one authentic source file before trusting a chart.

## 1. OVERVIEW

### Purpose

A note author can place a working `health-viz` chart without reading the render contract first.

### Usage

Paste the block that matches the window you need, then adjust its dates or `last` value.

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
