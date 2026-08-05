---
title: "Charts render-block and settings file-layer operations"
description: "Create, edit and validate chart and advanced-chart render blocks plus the Charts plugin settings file in a vault, with copyable example assets and honest file-layer verification."
trigger_phrases:
  - "charts plugin obsidian"
  - "obsidian charts render block"
  - "advanced chart json block"
  - "chart from table obsidian"
  - "charts settings data json"
version: "0.10.0.0"
---

# Charts render-block operations (`charts`)

## 1. OVERVIEW

Charts (repo `phibr0/obsidian-charts`, installed v3.9.0 in the vault, verified from `manifest.json`) renders interactive charts inside notes from fenced code blocks. Two block languages exist: `chart` with a YAML body and `advanced-chart` with a raw Chart.js JSON configuration. A chart can also read its data from a table in the same note or in another note.

## 2. HOW IT WORKS

The mode operates this plugin at the file layer. It edits render blocks inside notes and the plugin settings file. It never drives the chart creator dialog.

A `chart` block requires `type`, `labels` and `series`. An `advanced-chart` block carries a JSON object that is the Chart.js configuration itself, or a wrapper with `chartOptions` and `width`. Settings live in `.obsidian/plugins/obsidian-charts/data.json`. The vault has no `data.json`, so the four bundled defaults apply: `colors`, `contextMenu`, `imageSettings` and `themeable`. The app renders the chart after a note reload. File-layer verification ends at valid YAML or JSON plus correct keys.

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/charts/charts.md`
- Data contract: `references/plugins/charts/data-model.md`
- Recipes: `references/plugins/charts/workflows.md`
- Diagnostics: `references/plugins/charts/troubleshooting.md`

### Assets

- `assets/plugins/charts/charts-block.example.md`: copyable render blocks for both languages, with example data labeled for replacement before use

### Verification

- Manual scenario: `manual-testing-playbook/plugin-tie-ins/charts-render-block.md`

## 4. GUARDRAILS

- Match the fence language to the body syntax. A `chart` block is YAML and an `advanced-chart` block is JSON. Never swap them.
- Validate the block body before writing it into a note. A `chart` block needs `type`, `labels` and `series`. An `advanced-chart` block needs a valid Chart.js configuration.
- Do not invent settings keys. The installed defaults are `colors`, `contextMenu`, `imageSettings` and `themeable`.
- Back up `data.json` before any settings write and merge, never replace.
- Never claim a chart renders from the file layer alone. Verification ends at valid YAML or JSON plus correct keys.
- Keep every example aligned with the installed 3.9.0 syntax or mark it VERIFY.
