---
title: "Charts File-Layer Workflows"
description: "Numbered file-layer recipes for Charts: read and validate blocks, add chart and advanced-chart blocks, point charts at tables, style datasets, export images and edit settings with backup discipline."
trigger_phrases:
  - "create chart in note"
  - "add chart block"
  - "chart from table"
  - "edit chart colors"
  - "export chart image"
  - "charts settings edit"
importance_tier: "normal"
contextType: "implementation"
version: "0.10.0.0"
---

# Charts File-Layer Workflows

These recipes edit chart blocks inside notes and the plugin settings file. Every operation starts with a fresh read. Every settings write is a merge with a backup, never a replace.

## 1. OVERVIEW

### Operating sequence

1. Read the target note and the current block.
2. Decide the block language: `chart` for YAML, `advanced-chart` for raw Chart.js JSON.
3. Back up the settings file before any settings write: `cp data.json data.json.bak-$(date +%s)`.
4. Apply the minimal change to the block or the settings object.
5. Validate the YAML or JSON parse and the required keys.
6. Tell the user the chart renders after the note reloads in-app.

### Backup discipline

- Settings writes always start with a backup copy of `data.json`.
- Note edits keep the original block text in a scratch copy until the new block validates.
- A write is a merge. Unrelated note content and unrelated settings keys stay untouched.

---

## 2. READ AND VALIDATE A CHART BLOCK

1. Read the note that holds the block.
2. Copy the block body between the fences.
3. Parse the body as YAML for `chart` or as JSON for `advanced-chart`.
4. Check the required keys. A `chart` block needs `type`, `labels` and `series`. A `chart` block with `id` needs a resolvable table reference. An `advanced-chart` block needs a valid Chart.js configuration.
5. Report any parse error before touching the file.

Validation checkpoint names live in troubleshooting.md section 4.

---

## 3. ADD A BASIC CHART (chart YAML)

Before:

````markdown
## Weekly sales
````

After:

````markdown
## Weekly sales

```chart
type: bar
labels: [Mon, Tue, Wed, Thu]
series:
  - title: Sales
    data: [10, 20, 15, 25]
```
````

- Keep `type`, `labels` and `series`. These are required.
- Use the `width` key to size the canvas, for example `width: 80%`.
- Set `legend: false` when the chart has a single series.
- Prefer copying a working block from the vault over inventing keys.

---

## 4. ADD AN ADVANCED CHART (advanced-chart JSON)

Before:

````markdown
## Market share
````

After:

````markdown
## Market share

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
````

- The body must parse as JSON. Validate with a JSON parser before writing.
- Wrap the config in a `chartOptions` key when you also want a `width` value beside it. The width key only applies in that wrapper form.
- Any valid Chart.js 3.x configuration works inside the block.

---

## 5. POINT A CHART AT A TABLE

Before:

````markdown
| Month | Sales |
| --- | --- |
| Jan | 12 |
| Feb | 18 |
````

After:

````markdown
| Month | Sales |
| --- | --- |
| Jan | 12 |
| Feb | 18 |

```chart
type: bar
id: <section-id-from-the-cache>
layout: columns
```
````

Steps:

1. Read the note that holds the table.
2. Resolve the table's section id from the metadata cache.
3. Write the block with `id` and `layout`. Set `file` to the basename when the table lives in another note.
4. Use `select` to keep only chosen data titles.

VERIFY: confirm the section id against the metadata cache before writing. The exact string format is cache-owned. The example uses a placeholder on purpose.

When the table lives in another note:

````markdown
```chart
type: bar
id: <section-id-from-the-cache>
file: sales.md
layout: columns
select: [Sales]
```
````

- The plugin watches the referenced file and reloads the chart when it changes.
- A malformed table throws a Table malformed notice. Switch `layout` between `columns` and `rows` when a table fails to parse.

---

## 6. STYLE A CHART DATASET

Edit the styling keys inside an existing block. Each key merges into the chart config.

Before:

````chart
type: line
labels: [Jan, Feb, Mar]
series:
  - title: Value
    data: [3, 7, 2]
````

After:

````chart
type: line
labels: [Jan, Feb, Mar]
series:
  - title: Value
    data: [3, 7, 2]
beginAtZero: true
fill: true
tension: 0.4
````

- Preserve every key you are not changing.
- Use `stacked: true` for stacked bar charts.
- Use `labelColors` and `transparency` for palette-wide fills.
- Use `bestFit: true` on a line chart to add a line of best fit. The plugin computes the fit at render time.

---

## 7. EDIT PLUGIN SETTINGS (BACKUP DISCIPLINE)

1. Read `.obsidian/plugins/obsidian-charts/data.json`. When it does not exist, defaults apply and no file is written.
2. Back up: `cp data.json data.json.bak-$(date +%s)`.
3. Change only the requested keys. Keep the four known keys and any unknown keys intact.
4. Write valid JSON and re-parse.
5. Reload Obsidian so the settings tab reflects the change.

Example merge, disabling the context menu entry:

Before:

```json
{
  "colors": ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
  "contextMenu": true,
  "imageSettings": { "format": "image/png", "quality": 0.92 },
  "themeable": false
}
```

After:

```json
{
  "colors": ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
  "contextMenu": false,
  "imageSettings": { "format": "image/png", "quality": 0.92 },
  "themeable": false
}
```

- A partial `data.json` works. Missing keys fill from plugin defaults.
- Do not create `data.json` just to mirror defaults.
- Never replace the whole file when the user changed settings in-app.

---

## 8. EXPORT A CHART AS AN IMAGE

The Create Image from Chart command performs the export. The AI cannot click it. The file-layer role is prediction and verification.

1. Tell the user the command exists and what it produces.
2. Predict the artifact: `Chart <date>` with the format extension in the vault attachments location.
3. After the user runs it, verify the file exists and the note holds the markdown image link.
4. Confirm the image format matches the `imageSettings.format` value.

---

## 9. VERIFYING

- Re-parse the written YAML or JSON. Confirm the changed keys read back.
- Confirm no unrelated note content changed. Diff against the backup when one exists.
- For settings, confirm the four known keys plus any unknown keys are intact after the merge.
- Run the validation checkpoints from troubleshooting.md section 4 after any chart edit.
- Rendering happens in-app. State that the reload is the user's step.
