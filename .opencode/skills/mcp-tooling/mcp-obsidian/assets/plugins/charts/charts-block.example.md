---
title: "Charts render-block examples"
description: "Copyable chart and advanced-chart render blocks for the Charts plugin, aligned with the installed 3.9.0 data model and labeled as example data for replacement before use."
trigger_phrases:
  - "charts render block example"
  - "chart yaml block example"
  - "advanced chart json example"
  - "copyable charts block"
  - "obsidian charts block syntax"
importance_tier: "normal"
contextType: "implementation"
version: "0.10.0.0"
---

# Charts `chart` and `advanced-chart` render blocks (copyable examples)

These blocks are example forms aligned with the installed Charts 3.9.0 data model. The fenced language decides the body syntax: `chart` takes YAML and `advanced-chart` takes JSON. The two are not interchangeable.

**Example data warning**: every value below is invented for demonstration. It is not real vault data. Replace every value before copying a block into a real note.

**Render warning**: the plugin renders in-app. A block that parses is not proof that a chart renders. File-layer verification ends at valid YAML or JSON plus the documented keys.

## Minimal bar chart (chart, YAML)

```chart
type: bar
labels: [Mon, Tue, Wed, Thu]
series:
  - title: Sales
    data: [10, 20, 15, 25]
```

Required keys: `type`, `labels` and `series`. Each series item carries `title` and `data`.

## Sized single-series chart (chart, YAML)

```chart
type: line
labels: [Jan, Feb, Mar]
series:
  - title: Value
    data: [3, 7, 2]
width: 80%
legend: false
```

`width` sizes the canvas and defaults to 100 percent. `legend` defaults to true.

## Doughnut chart (advanced-chart, JSON)

```advanced-chart
{
  "type": "doughnut",
  "data": {
    "labels": ["North", "South", "East"],
    "datasets": [{ "data": [45, 30, 25] }]
  },
  "options": { "plugins": { "legend": { "position": "bottom" } } }
}
```

The body is a JSON object and passes straight to Chart.js. Any valid Chart.js 3.x configuration works, including `options` for scales, tooltips and plugins.

## Wrapper form with width (advanced-chart, JSON)

```advanced-chart
{
  "chartOptions": {
    "type": "pie",
    "data": {
      "labels": ["A", "B"],
      "datasets": [{ "data": [30, 70] }]
    }
  },
  "width": "70%"
}
```

With a `chartOptions` key the Chart.js configuration sits inside it and `width` may sit beside it. Without `chartOptions` the object is the configuration itself.

## Usage notes

- Match the fence language to the body syntax. Never put JSON inside a `chart` fence or YAML inside an `advanced-chart` fence.
- Validate the body before writing it into a note. A `chart` block needs `type`, `labels` and `series` unless it references a table through `id`.
- Do not invent keys. The keys shown here come from the installed 3.9.0 data model.
