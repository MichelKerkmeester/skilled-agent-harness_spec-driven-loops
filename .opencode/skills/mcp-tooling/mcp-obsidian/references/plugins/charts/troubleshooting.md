---
title: Charts File-Layer Troubleshooting
description: "Cause, detection and recovery for Charts failures: wrong block language, invalid YAML or JSON, missing required keys, broken table references, stale reads and settings regressions."
trigger_phrases:
  - "chart not rendering"
  - "charts block shows code"
  - "chart block invalid json"
  - "chart missing type labels"
  - "chart table not found"
  - "charts data json lost settings"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Charts File-Layer Troubleshooting

Diagnose the block, the data source and the settings separately. A valid block can still fail to render when the language is wrong, a key is missing or the table reference is stale.

---

## 1. OVERVIEW

| Symptom | Most likely cause |
| --- | --- |
| Chart shows as a plain code block | Block fenced with a language other than `chart` or `advanced-chart` |
| Couldn't render Chart error in the note | YAML or JSON parse failure or missing required keys |
| chart block renders nothing | Missing `type`, `labels` or `series` |
| advanced-chart block renders nothing | JSON parse failure or invalid Chart.js configuration |
| Invalid id and/or file error | Table-reference `id` does not match the cache or `file` is wrong |
| Table malformed notice | The referenced table does not parse with the given layout |
| Wrong colors | `themeable` picks theme variables or `labelColors` overrides the palette |
| Settings lost | `data.json` edited into invalid JSON or replaced wholesale |
| Chart does not update after a table edit | The chart watches the wrong note or the cache has not refreshed |
| Context menu entry missing | `contextMenu` is false in the settings file |
| Image export uses the wrong format | `imageSettings.format` does not match the wanted format |
| Colors shift after a theme change | `themeable` picks the new theme's CSS variables |
| Table mode renders an empty chart | The table has no data rows or `select` filtered everything out |
| Plugin fails to load | `data.json` is invalid JSON after a bad merge |
| Chart reloads on every edit | Normal. Table-mode blocks watch the referenced note and reload on change |

---

## 2. DIAGNOSIS SEQUENCE

1. Read the note and inspect the fence language. It must be `chart` or `advanced-chart`.
2. Copy the block body and parse it. YAML for `chart`, JSON for `advanced-chart`.
3. Check the required keys. A `chart` block needs `type`, `labels` and `series` unless `id` is set.
4. For table mode, resolve the table's section id from the metadata cache and confirm `file` matches the basename.
5. Read the settings file when colors or the context menu look wrong.
6. Open the developer console for the raw error text. The chart error block points at CTRL+SHIFT+I.

### Reading the in-note error

The plugin renders a `chart-error` div inside the block when rendering fails. It shows the message "Couldn't render Chart:" followed by the error text and a console hint. The error text names the failing step: a parse error, a missing-key error or an invalid table reference.

### Resolving a table reference

1. Read the note that holds the table. Confirm the table exists and carries a header row.
2. Ask the user to run Create Chart from Table on the table. The generated block carries a working `id`.
3. Update the failing block with that `id` and re-run the file-reference checkpoint.
4. Confirm `file` matches the basename when the table lives in another note.

Obsidian keeps the metadata cache in memory. The vault has no on-disk copy of it. The AI cannot resolve section ids from the file layer, so a working id comes from the wizard output or from the user.

### Diagnosing settings issues

1. Read data.json fresh. Confirm the four known keys.
2. Check `contextMenu` when the editor menu entry is missing.
3. Check `imageSettings` when an export artifact looks wrong.
4. Check `themeable` and the CSS variables when colors shift.
5. Reload Obsidian after a settings write. The settings tab reads the file on load.

### Reading the settings file

The settings file carries the four known keys. Read it fresh before diagnosing. When the file is absent, defaults apply and settings cannot be the cause of a failure. When the file exists, compare each key against the defaults in data-model.md section 2.

---

## 3. RECOVERY

| Problem | Fix |
| --- | --- |
| Wrong fence language | Rename the fence to `chart` or `advanced-chart` and fix the body syntax to match |
| Invalid YAML in a chart block | Repair indentation and quotes. Tabs are replaced with four spaces |
| Invalid JSON in an advanced-chart block | Repair the JSON and re-parse before writing |
| Missing required keys | Add `type`, `labels` and `series` to the chart block |
| Stale table id | Re-resolve the section id from the metadata cache and update the block |
| Wrong file reference | Set `file` to the exact basename of the note that holds the table |
| Table malformed | Fix the table structure or switch `layout` between `columns` and `rows` |
| Colors unexpected | Check `themeable` and the CSS variables, then `labelColors` and `colors` |
| Invalid data.json | Restore the newest `.bak` copy and reload Obsidian |
| Settings silently missing | Confirm `data.json` still carries the four known keys after any merge |
| Chart stale after a table edit | Confirm `file` names the edited note. Re-save the table to refresh the cache |
| Context menu entry missing | Set `contextMenu` to `true` in data.json and reload |
| Wrong export format | Set `imageSettings.format` to the wanted value |
| Colors shift after a theme change | Set `themeable` to `false` to pin the `colors` palette |

---

## 4. VALIDATION CHECKPOINTS

Run these named checks in order after any chart edit. Stop at the first failure.

- Parse checkpoint. The block body parses as YAML for `chart` or as JSON for `advanced-chart`.
- Required-keys checkpoint. A `chart` block carries `type`, `labels` and `series`. Table mode carries an `id` instead.
- Syntax-match checkpoint. The body syntax matches the fence language. No JSON inside a `chart` fence and no YAML inside an `advanced-chart` fence.
- File-reference checkpoint. Table mode points at a real section id and a real basename. The cache confirms the section exists.
- Settings round-trip checkpoint. `data.json` re-parses after the merge and keeps every key not being changed.
- Scope checkpoint. The edit changed only the intended block or key. No unrelated note content moved.
- Image-export checkpoint. The exported file matches the format setting. The note holds the markdown link.

---

## 5. LIMITS

### Version boundaries

- Installed version 3.9.0. Bundled Chart.js 3.9.1.
- minAppVersion 0.12.7. Desktop and mobile supported.
- The bundle esbuild banner names the dictionary repository. That banner is stale. The canonical repository is phibr0/obsidian-charts.
- Do not apply block examples from other plugin versions without checking the syntax against 3.9.0.

### File-layer limits

- The AI cannot verify rendered pixels. File-layer checks end at valid syntax plus correct keys.
- The plugin computes best-fit regression and theme colors in-app. Do not re-derive them from the file layer.
- The Charts View sidebar pane from older release notes is not present in the installed 3.9.0 bundle. Do not assume it exists.
- A chart that renders is not proof the data is correct. Read the underlying table or series values when numbers matter.
- `window.renderChart` is a debug surface for the developer console. Do not rely on it for automation.

---

## 6. PREVENTION

- Keep one block language per chart. Do not switch fences casually.
- Validate the block body before writing it into the note.
- Back up data.json before every settings write.
- Prefer wizard-generated blocks for table mode. The Create Chart from Table commands emit working ids.
- Re-read the note and the settings file after the user reports a change.
- Keep the settings file valid. Re-parse after every merge.
- State the data source in the note when a block reads a table elsewhere.

---

## 7. ESCALATION

- Ask the user to open the developer console with CTRL+SHIFT+I and read the chart error block when the file layer looks correct.
- Ask the user to run the plugin commands when a block cannot be rebuilt by hand.
- Do not guess section ids, chart types or settings keys. Report the VERIFY markers instead.
- When the plugin misbehaves after an Obsidian update, compare the plugin version and the Obsidian version against minAppVersion 0.12.7.

---

## 8. COMMAND ARTIFACT MAP

The four commands leave different file-layer traces. Diagnose each one by its own artifact.

| Command | File-layer artifact | Failure to check |
| --- | --- | --- |
| Insert new Chart | none. Opens the creator dialog | UI only. No file artifact |
| Create Chart from Table (Column) | a `chart` block inserted at the cursor | Block must parse as YAML with `type`, `labels` and `series` |
| Create Chart from Table (Row) | a `chart` block inserted at the cursor | Same checks as the column layout |
| Create Image from Chart | an image file named `Chart <date>` plus a markdown link | Extension must match `imageSettings.format`. Link must resolve |

The wizard blocks carry working section ids because the plugin reads the cache in-app. Reuse those ids when hand-writing table-mode blocks.
