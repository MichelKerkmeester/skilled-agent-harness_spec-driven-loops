# Health.md `health-viz` render blocks (researched-validated examples)

These blocks are the forms validated against the researched render contract. The fenced language is `health-viz` (the plugin does not read a `health-md` fence). Every block names a registered renderer via `type`; the research documents the `step-spiral` renderer explicitly, so it is the only renderer shown here. Documented optional keys are `width`, `height`, inclusive `from`, inclusive `to`, `last`, and `clickAction`. Dates may be ISO dates or built-in dynamic variables such as `{{today:YYYY-MM-DD}}`. The `clickAction` value below labels the first documented click behavior (pin the tooltip); the research does not enumerate exact value spellings.

**Mock-data warning**: when the configured `Health/` data folder is missing or empty, the plugin falls back to deterministic bundled example data. A rendered chart therefore proves neither that a data folder was found nor that real exports were loaded. Verify the selected data folder and at least one authentic source file before trusting a chart.

## Minimal default

```health-viz
type: step-spiral
last: 7
```

## Sized chart

```health-viz
type: step-spiral
last: 7
width: 400
height: 300
```

## Windowed (inclusive from/to)

```health-viz
type: step-spiral
from: 2026-08-01
to: 2026-08-07
```

## Last-N days

```health-viz
type: step-spiral
last: 30
```

## Click action (pin tooltip)

```health-viz
type: step-spiral
last: 7
clickAction: pin-tooltip
```

## Dynamic date variable

```health-viz
type: step-spiral
from: {{today:YYYY-MM-DD}}
to: {{today:YYYY-MM-DD}}
```
