---
title: Charts Plugin Index (obsidian-charts)
description: "Lean entry point for operating the Charts Obsidian plugin (phibr0/obsidian-charts) through chart and advanced-chart render blocks plus its settings file in the vault."
trigger_phrases:
  - "charts plugin obsidian"
  - "obsidian charts render block"
  - "charts settings data json"
  - "advanced chart json block"
  - "chart from table obsidian"
  - "chart file layer"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Charts Plugin Index (obsidian-charts)

The `mcp-obsidian` mode operates this plugin by **editing render blocks inside notes and the plugin settings file**. It never drives the chart creator dialog.

---

## 1. OVERVIEW
| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Obsidian plugin ID | `obsidian-charts` | Plugin directory name plus enablement entry |
| Display name | **Charts** | Current manifest name |
| Plugin repository | [phibr0/obsidian-charts](https://github.com/phibr0/obsidian-charts) | Source of behavior facts |
| Author | phibr0 | Manifest author |
| Version installed | 3.9.0 | Verified on-disk from manifest.json |
| minAppVersion | 0.12.7 | Oldest supported Obsidian release |
| Desktop only | false | Works on desktop and mobile |
| Enablement | Enabled in `community-plugins.json` | Verified in this vault |
| State file | `<vault>/.obsidian/plugins/obsidian-charts/data.json` | Settings surface. Absent in this vault, so plugin defaults apply |

---

## 2. WHAT IT DOES

Renders interactive charts inside notes from fenced code blocks. Two block languages exist in the installed version. A `chart` block carries a YAML body with `type`, `labels` and `series`. An `advanced-chart` block carries a raw Chart.js JSON configuration. A chart can read its data from a table in the same note or in another note.

Rendering uses the bundled Chart.js library at version 3.9.1. The chart type set therefore follows Chart.js: bar, line, pie, doughnut, radar, scatter, bubble and polarArea. The YAML path special-cases bar, line, radar, polarArea and sankey with explicit axis and styling configuration. Any other type string passes through to Chart.js.

### Companion commands

The plugin registers four commands plus one context menu entry.

| Command id | Command name | What it does |
| --- | --- | --- |
| `creation-helper` | Insert new Chart | Opens the chart creator dialog |
| `chart-from-table-column` | Create Chart from Table (Column oriented Layout) | Turns the selected table into a chart block |
| `chart-from-table-row` | Create Chart from Table (Row oriented Layout) | Turns the selected table into a chart block |
| `chart-to-svg` | Create Image from Chart | Exports the selected chart block to an image file |

The editor context menu shows an Insert Chart entry when the `contextMenu` setting is on. All four commands are UI surface. The AI cannot click them, but it can reproduce the blocks they generate and verify the artifacts they leave behind.

### What it does not do

- It does not read external data files or network APIs. Data comes from the block body or from a table inside a note.
- It offers no custom sidebar view in this version. VERIFY: older release notes describe a Charts View sidebar pane. The installed 3.9.0 bundle registers no custom view.
- The creator dialog and the table wizard are UI-only. The AI works at the file layer instead.

---

## 3. FILE-LAYER SURFACE (what the AI touches)

| Layer | Path / artifact | Safe handling |
| --- | --- | --- |
| Render blocks | `chart` YAML and `advanced-chart` JSON fenced blocks inside notes | Read and write. Preserve unrelated note content |
| Settings | `.obsidian/plugins/obsidian-charts/data.json` | Read and edit with backup discipline. Defaults apply while the file is absent |
| Enablement | `.obsidian/community-plugins.json` | Already enabled. No action needed |
| Chart creator dialog | UI only | No. Out of reach headlessly |
| Table wizard commands | UI only | No. Edit the generated block instead |

### Block language summary

| Language | Body syntax | Rendered by |
| --- | --- | --- |
| `chart` | YAML with `type`, `labels`, `series` | Renderer pipeline: YAML to Chart.js config |
| `advanced-chart` | JSON, a Chart.js configuration | Direct Chart.js render |

---

## 4. RENDER BLOCK CONTRACT (quick start)

A minimal `chart` block:

```chart
type: bar
labels: [Mon, Tue, Wed]
series:
  - title: Sales
    data: [10, 20, 15]
```

A minimal `advanced-chart` block:

```advanced-chart
{
  "type": "pie",
  "data": {
    "labels": ["A", "B"],
    "datasets": [{ "data": [30, 70] }]
  }
}
```

- `chart` bodies parse as YAML. Tabs are replaced with four spaces before parsing.
- A `chart` block requires `type`, `labels` and `series` unless it references a table through the `id` key.
- `advanced-chart` bodies parse as JSON and pass straight to Chart.js.
- A `width` value sizes the canvas and defaults to 100 percent.

### Choosing a language

| Need | Language |
| --- | --- |
| Simple charts from inline YAML data | `chart` |
| Raw Chart.js configuration control | `advanced-chart` |
| Data from a table in a note | `chart` with `id`, `file`, `layout` and `select` |

---

## 5. SETTINGS LOCATION

Settings live in `.obsidian/plugins/obsidian-charts/data.json`. This vault has no `data.json` yet, so the plugin defaults apply. The defaults carry four keys: `colors`, `contextMenu`, `imageSettings` and `themeable`.

| Key | Default | Meaning |
| --- | --- | --- |
| `colors` | six rgba strings | Dataset border colors |
| `contextMenu` | `true` | Insert Chart entry in the editor context menu |
| `imageSettings` | `{"format": "image/png", "quality": 0.92}` | Chart image export settings |
| `themeable` | `false` | Use `--chart-color-N` CSS variables when a theme provides them |

The settings tab renders the heading Settings - Charts. Its controls map one-to-one to the file keys. Control names are verified from the settings tab code in main.js.

| File key | Settings tab control |
| --- | --- |
| `contextMenu` | Show Button in Context Menu toggle |
| `colors` | Color 1 through Color 6 pickers |
| `themeable` | Enable Theme Colors toggle |
| `imageSettings.format` | Image Format dropdown |
| `imageSettings.quality` | Image Quality slider |

Read the full contract in data-model.md section 2.

---

## 6. WHEN TO USE THIS REFERENCE SET

Use this reference set when the user asks to create a chart in a note, edit an existing chart block, point a chart at a table, export a chart as an image, change chart colors or fix a chart that fails to render. Use it before touching chart-related settings or plugin enablement.

---

## 7. SIBLING FILES

| File | Contents |
| --- | --- |
| data-model.md | Exact artifact schemas: settings keys, chart block models, table-reference mode, image export and the global API |
| workflows.md | Numbered file-layer recipes with before and after patterns |
| troubleshooting.md | Failure modes, fixes and named validation checkpoints |

---

## 8. GOTCHAS

- Read the target note before editing a chart block. Preserve every unrelated line.
- `chart` is YAML. `advanced-chart` is JSON. The two syntaxes are not interchangeable.
- Keep every copyable example aligned with the installed 3.9.0 syntax. Details outside the installed artifact carry a VERIFY marker.
- Do not create `data.json` just to mirror defaults. Write it only when the user asks for a settings change.
- The bundle header names the dictionary repository. That banner is a stale esbuild artifact. The canonical repository is phibr0/obsidian-charts.
- A `chart` block uses YAML. Indentation errors are the top YAML failure. Validate before writing.
- The plugin renders in-app. File-layer verification ends at valid YAML or JSON plus correct keys.
- Never claim a chart renders correctly from the file layer alone.
