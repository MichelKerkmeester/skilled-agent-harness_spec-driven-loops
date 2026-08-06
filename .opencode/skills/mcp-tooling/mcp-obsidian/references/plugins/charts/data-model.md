---
title: Charts File-Layer Data Model
description: "Complete file-layer contract for the Charts plugin: settings keys, chart YAML and advanced-chart JSON block models, table-reference mode, image export and the global render API."
trigger_phrases:
  - "charts data model"
  - "charts settings keys"
  - "chart yaml block syntax"
  - "advanced chart json config"
  - "chart table reference"
  - "charts render block schema"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Charts File-Layer Data Model

Charts renders from fenced code blocks inside notes and stores its settings in one JSON file. The AI operates the blocks and the settings file. The app renders.

---

## 1. OVERVIEW

### Canonical identity

| Identity field | Current value |
| --- | --- |
| Obsidian plugin ID | `obsidian-charts` |
| Display name | Charts |
| Plugin repository | `phibr0/obsidian-charts` |
| Installed version | 3.9.0 (verified on-disk) |
| Bundled Chart.js | 3.9.1 (verified in the bundle license banner) |
| State file | `.obsidian/plugins/obsidian-charts/data.json` |
| Data.json present | No. Plugin defaults apply |

### Core contract

- Two fenced block languages render charts: `chart` with a YAML body and `advanced-chart` with a JSON body.
- `chart` bodies parse as YAML. Tabs are replaced with four spaces before parsing.
- `advanced-chart` bodies parse as JSON and pass directly to Chart.js.
- Settings live in `data.json`. The vault has no `data.json`, so the bundled defaults apply.
- The AI edits blocks and settings. Rendering happens in-app.

---

## 2. SETTINGS CONTRACT

The defaults below come from the DEFAULT_SETTINGS object bundled in main.js 3.9.0. The plugin loads settings with `Object.assign({}, defaults, await loadData())`, so a partial `data.json` fills missing keys from defaults.

| Key | Type | Default | Meaning |
| --- | --- | --- | --- |
| `colors` | string array | six rgba strings | Dataset border colors. Color 1 applies to the first dataset and so on |
| `contextMenu` | bool | `true` | Shows an Insert Chart button in the editor context menu |
| `imageSettings` | object | `{"format": "image/png", "quality": 0.92}` | Image export format and quality |
| `themeable` | bool | `false` | Reads colors from CSS custom properties `--chart-color-1` upward |

### The default palette

```json
[
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)"
]
```

### imageSettings details

- `format`: one of `image/jpeg`, `image/png`, `image/webp`.
- `quality`: a slider value from 0.01 to 1. It matters for lossy formats.

### themeable details

- The plugin reads `--chart-color-1`, `--chart-color-2` and so on until a variable is empty.
- An Obsidian theme or CSS snippet must provide the variables.
- When no theme colors exist, the `colors` setting is used.

### Reading and writing

- Read `data.json` fresh before any change. The user may have changed settings in-app.
- No `data.json` means defaults apply. Do not write a file just to mirror defaults.
- Preserve unknown keys when editing. Newer plugin versions may add settings.

---

## 3. CHART BLOCK MODELS

### chart block (YAML)

Minimal block:

```chart
type: bar
labels: [A, B, C]
series:
  - title: Series 1
    data: [3, 7, 2]
```

Required keys: `type`, `labels`, `series`. Each series item carries `title` and `data`. The parser replaces tabs with four spaces before parsing YAML. A block with an `id` key switches to table-reference mode and no longer needs `labels` or `series`.

Key reference, verified from the postprocessor and the dataset preparation code in main.js:

| Key | Type | Meaning |
| --- | --- | --- |
| `type` | string | Chart type: bar, line, pie, doughnut, radar, scatter, bubble, polarArea or sankey |
| `labels` | array | Category labels |
| `series` | array | Series objects with `title` and `data` |
| `width` | string | CSS width for the canvas, default `100%` |
| `legend` | bool | Show the legend, default `true` |
| `legendPosition` | string | Legend position, default `top` |
| `padding` | number | Chart layout padding |
| `textColor` | string | Chart text color, default `--text-muted` |
| `time` | string | Time unit for the x scale, for example `day` or `month` |
| `indexAxis` | string | Set `y` for a horizontal bar chart |
| `spanGaps` | bool | Connect gaps in line data |

The YAML path special-cases four types. bar and line get explicit x and y scale configuration. radar and polarArea get a radial scale. sankey converts three-element data rows into from, flow and to triples. Any other type string passes through to Chart.js.

### advanced-chart block (JSON)

Minimal block:

```advanced-chart
{
  "type": "line",
  "data": {
    "labels": ["Jan", "Feb"],
    "datasets": [{ "label": "Value", "data": [4, 9] }]
  }
}
```

The body is a JSON object. Without a `chartOptions` key the object is the Chart.js configuration itself. With a `chartOptions` key the Chart.js configuration sits inside it and `width` may sit beside it. Any valid Chart.js 3.x configuration works, including `options` for scales, tooltips and plugins.

VERIFY: release notes for older versions describe a `charts` block language with `type`, `data` and `settings` keys. The installed 3.9.0 registers only `chart` and `advanced-chart`. A block fenced with another language renders as a plain code block, not a chart.

---

## 4. TABLE-REFERENCE MODE

A chart block can read its data from a table in the same note or in another note. Set the `id` key to the section id of the table. Set `file` when the table lives in another note. The plugin looks up the section in the metadata cache, extracts the table text and parses it into labels and datasets.

```chart
type: bar
id: <section-id-from-the-cache>
file: sales.md
layout: columns
```

VERIFY: the `id` must equal a section id from the target note's metadata cache. Confirm the exact string format against the cache before writing a block. The example above uses a placeholder on purpose.

Keys:

| Key | Type | Meaning |
| --- | --- | --- |
| `id` | string | Section id of the table in the cache. Required for table mode |
| `file` | string | Basename of the note that holds the table. Omit to use the chart's own note |
| `layout` | string | `columns` or `rows`, default `columns` |
| `select` | array | Data titles to keep. Filters the parsed columns |

Behavior:

- The plugin finds the section by `id` in the cached sections of the target note. A missing id throws an error.
- The chart reloads when the referenced note changes. With `file` it watches the basename. Without `file` it watches the chart's own note.
- A malformed table throws a Table malformed notice.
- Dataset styling keys still apply in table mode. Labels and datasets come from the table.
- The chart also reloads on workspace CSS changes.

---

## 5. DATASET AND STYLING KEYS

These keys apply to the YAML path and to table mode.

| Key | Type | Meaning |
| --- | --- | --- |
| `labelColors` | bool | Use the palette as a whole with the transparency value. When false each dataset takes its own palette color |
| `transparency` | number | Opacity applied to dataset colors |
| `fill` | bool | Fill the area under line datasets |
| `stacked` | bool | Stack datasets on the axis |
| `tension` | number | Curve tension for line datasets, default 0 |
| `bestFit` | bool | Add a line of best fit. line type only |
| `bestFitNumber` | number | Zero-based index of the series used for the fit |
| `bestFitTitle` | string | Title for the fit line |

Color flow:

- Theme colors win when `themeable` is on and CSS variables exist.
- The `colors` setting is the fallback palette.
- `labelColors` decides how the transparency value applies to the palette.

The best-fit keys are handled by the block processor before rendering. The fit line appends to `series` with computed regression values. The plugin computes the fit at render time. Do not re-derive the regression from the file layer.

---

## 6. AXIS AND SCALE KEYS

For bar and line types the YAML path builds explicit scales. The keys below control those scales.

| Key | Type | Meaning |
| --- | --- | --- |
| `beginAtZero` | bool | Start the axis at zero |
| `yMin` / `yMax` | number | Y axis range |
| `xMin` / `xMax` | number | X axis range |
| `yReverse` / `xReverse` | bool | Reverse the axis direction |
| `yTickDisplay` / `xTickDisplay` | bool | Show axis ticks |
| `yTickPadding` / `xTickPadding` | number | Tick padding |
| `yDisplay` / `xDisplay` | bool | Show the axis |
| `yTitle` / `xTitle` | string | Axis title |

For radar and polarArea the radial scale uses `rMin` and `rMax` to clamp the radius range and `beginAtZero` for the starting point.

---

## 7. IMAGE EXPORT ARTIFACT

The Create Image from Chart command exports a chart block to an image file. The AI cannot click the command, but it can predict and verify the artifact shape.

- The command renders the selected chart block to a canvas and waits briefly.
- It converts the canvas with the `imageSettings.format` and `imageSettings.quality` values.
- It saves a binary file named `Chart <date>` with the format extension into the vault attachments location.
- It replaces the selected block with a markdown image link to the new file.

The AI can verify that the exported artifact exists, carries the right extension and that the note holds the replacement link. VERIFY the image bytes with the user. The AI cannot read pixels.

---

## 8. GLOBAL API

The plugin exposes `window.renderChart` on load. It points at the renderer's raw render function. A user can call it from the developer console with a Chart.js configuration object. This is a debug surface, not a file-layer tool. Do not rely on it for automation.

---

## 9. WHAT THE AI MUST NOT DO

- Do not write `chart` blocks with JSON bodies or `advanced-chart` blocks with YAML bodies.
- Do not invent section ids or file references for table mode. Read the cache and the target note first.
- Do not fabricate settings keys. The installed defaults are `colors`, `contextMenu`, `imageSettings` and `themeable`.
- Do not replace a whole `data.json` when the user changed settings in-app. Merge, never overwrite.
- Do not claim pixel-perfect rendering from the file layer. Verification ends at valid YAML or JSON plus correct keys.
- Do not copy chart examples from memory. Keep every example aligned with the installed 3.9.0 syntax or mark it VERIFY.
