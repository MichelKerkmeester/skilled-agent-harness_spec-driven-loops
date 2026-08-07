---
title: "Tables File-Layer Workflows"
description: "Safe file-layer recipes for creating and editing Tables .table.md files, preserving stable IDs, formulas, named views, text-only CSV imports, and current sort behavior."
trigger_phrases:
  - "create tables table md"
  - "add tables column"
  - "edit tables row"
  - "tables formula column"
  - "tables named view"
  - "tables csv import"
  - "tables sort workflow"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
---

# Tables File-Layer Workflows

These recipes change the `.table.md` JSON that Tables reads. Each one treats the Markdown wrapper as durable document structure and the embedded JSON as the mutable table state.

---

## 1. OVERVIEW

### Operating sequence

Use this sequence for every mutation:

1. Read the complete `.table.md` file and retain its original contents for a diff or rollback.
2. Confirm `json-table-plugin: true`, locate exactly one `json-table` fence, and parse its JSON payload.
3. Build maps by `column.id`, `view.id`, and `row.id`; never select a row by array index or a cell by header text.
4. Apply the smallest object-level edit, preserving unknown root fields, Markdown body text, and unrelated JSON arrays.
5. Serialize only the payload with two-space JSON indentation, write it back inside the existing fence, then re-read and parse it.
6. Check ID uniqueness, cell keys, view references, formula references, and the requested outcome before reloading Obsidian.

The plugin itself uses a read/process/save flow and serializes the payload with `JSON.stringify(data, null, 2)`. This procedure adds the ID and readback checks the plugin does not expose as a file-layer transaction API. ([MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts), [JsonTableView.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts), [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts))

### Shared invariants

| Invariant | Required state |
| --- | --- |
| Envelope | Exact boolean `json-table-plugin: true` plus one fenced `json-table` payload. |
| Root | `version`, `metadata.title`, `columns`, `views`, and `rows`. |
| IDs | Unique column/view/filter/sort IDs; stable row IDs. |
| Cells | `row.cells` keys are stable column IDs. |
| Views | At least one view, each with `sorts`, `filters`, `hiddenColumns`, and `columnOrder` arrays. |
| Formula values | Formula source and cached computed cell value agree before downstream use. |

For field definitions and the copyable full-file skeleton, read [data-model.md](data-model.md). ([MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts), [migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts))

---

## 2. CREATE A TABLE

### Goal

Create one portable table that Tables can open and render without any UI-driven setup.

### Exact `.table.md` edit

1. Create a uniquely named `<name>.table.md` file.
2. Copy [`example.table.md`](../../../assets/plugins/obsidian-tables/example.table.md) or the complete skeleton in [data-model.md](data-model.md).
3. Change `metadata.title`, the Markdown heading, and the row/column content together. Keep every `col_` ID unique within the file; row IDs may be any unique opaque strings.
4. Retain `json-table-plugin: true`, the single `json-table` fence, and `table-links` consistent with every non-empty `link` cell.

The minimal canonical payload is:

```json
{
  "version": "agentable-1.0.0",
  "metadata": { "title": "Work Queue" },
  "columns": [
    { "id": "col_task", "name": "Task", "type": "text" }
  ],
  "views": [
    {
      "id": "view_default",
      "name": "Default",
      "sorts": [],
      "filters": [],
      "hiddenColumns": [],
      "columnOrder": []
    }
  ],
  "rows": [
    {
      "id": "row_first",
      "cells": { "col_task": "Read the source table" }
    }
  ]
}
```

### Verify

- The wrapper has the exact boolean frontmatter marker and exactly one `json-table` fence.
- JSON parses and has all required root arrays.
- `col_task` appears once in `columns` and once as the cell key in the row.
- The default view exists with its four empty arrays.

The default creator uses the same root/version family and file handler. ([main.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts), [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts), [MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts))

---

## 3. ADD OR RENAME A COLUMN

### Goal

Extend the schema or change a visible header without breaking existing row cells, filters, views, or formulas.

### Exact `.table.md` edit

To add a Select column, append one definition to `columns` and populate that new ID in every row:

```json
{
  "id": "col_priority",
  "name": "Priority",
  "type": "select",
  "constraints": {
    "options": [
      { "value": "Low", "color": "default" },
      { "value": "High", "color": "red" }
    ]
  }
}
```

For each row, add a matching value:

```json
{
  "col_priority": "Low"
}
```

Use the correct canonical representation for each user-facing kind: Checkbox is `type: "boolean"` with `"true"`/`"false"` cells; Multi-select is `type: "select"` with `constraints.multiSelect: true` and a comma-separated cell string; Note Link is `type: "link"` with a vault-path cell string. ([migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts), [CheckboxRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/CheckboxRenderer.ts), [MultiSelectRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/MultiSelectRenderer.ts), [NoteLinkRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NoteLinkRenderer.ts))

To rename a column, change only its `name`:

```json
{
  "id": "col_priority",
  "name": "Delivery priority",
  "type": "select"
}
```

Do not change `col_priority`, rewrite `row.cells`, or rewrite ID-based formula sources when the operation is a rename. Those references are deliberately header-independent. ([FormulaHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts))

### Verify

- The appended column ID is unique.
- Every intended row contains its new `cells[col_priority]` value.
- Every Select or Multi-select value appears in `constraints.options`.
- A rename changed only `name`; `id`, cells, sort/filter references, and formula references still resolve.

---

## 4. ADD OR EDIT A ROW

### Goal

Append one stable record or patch one existing record without depending on mutable row order.

### Exact `.table.md` edit

To add a row, append a new object to `rows` with a unique `id` and values keyed by current column IDs:

```json
{
  "id": "row_launch_notes",
  "cells": {
    "col_task": "Publish launch notes",
    "col_hours": 3,
    "col_done": "false",
    "col_status": "In progress",
    "col_tags": "Research,Urgent",
    "col_url": "https://example.com/launch-notes",
    "col_email": "owner@example.com",
    "col_note": "Projects/Launch.md",
    "col_due": "1767225600000",
    "col_total": "375"
  }
}
```

To edit a row, find `rows[]` by `row.id` and replace only the intended `cells[col_id]` value. Keep links as vault paths, dates as millisecond timestamp strings, valid numbers as JSON numbers, and Multi-select values as comma-separated allowed values. Do not manually overwrite a Formula cell unless you also recompute it. ([NumberRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NumberRenderer.ts), [DateRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DateRenderer.ts), [FormulaHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts))

### Verify

- The new or edited row ID appears exactly once.
- Each cell key references an existing column ID.
- The `table-links` frontmatter list matches non-empty Note Link cell paths after a link change.
- Formula source cells and cached formula strings are internally consistent before reporting formula-derived data.

---

## 5. ADD A FORMULA COLUMN

### Goal

Add a rename-stable derived value without treating the cached result as user-editable source data.

### Exact `.table.md` edit

Append a Formula column whose source uses existing column IDs:

```json
{
  "id": "col_estimated_cost",
  "name": "Estimated cost",
  "type": "formula",
  "constraints": {
    "formula": "{{ col_hours }} * {{ col_rate }}",
    "formulaResultKind": "number"
  }
}
```

Add a cached computed string for each row:

```json
{
  "col_estimated_cost": "375"
}
```

The supported source language has arithmetic, one comparison, `if`, `contains`, `today`, and `date`; Formula columns cannot reference other Formula columns. When the agent cannot safely calculate a result from the supported grammar, retain an empty cached string and reload the table before using the derived value. The plugin recomputes formulas and persists the result in normal table rendering. ([parser.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/parser.ts), [evaluator.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts), [FormulaHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts))

### Verify

- Every `{{ col_id }}` token resolves to a non-Formula column.
- The formula has no unsupported operator or function.
- Cached outputs are strings and match the source inputs when calculated by the agent.
- Renaming a source header leaves the formula source unchanged because it uses IDs.

---

## 6. ADD A NAMED VIEW

### Goal

Persist a filtered or sorted perspective of the same rows, then optionally embed it from another note.

### Exact `.table.md` edit

Append a complete view object to `views`:

```json
{
  "id": "view_open_work",
  "name": "Open work",
  "sorts": [
    { "id": "srt_due", "columnId": "col_due", "direction": "asc" }
  ],
  "filters": [
    { "id": "flt_not_done", "columnId": "col_done", "operator": "isNot", "value": "true" }
  ],
  "hiddenColumns": ["col_email"],
  "columnOrder": []
}
```

Use one of `contains`, `doesNotContain`, `startsWith`, `endsWith`, `isEmpty`, `isNotEmpty`, `gt`, `lt`, `is`, or `isNot` as a filter operator. Filters are ANDed. After the view exists, a note can embed it with:

```markdown
![[Project Tracker.table.md|Open work]]
```

An absent alias-named view is created and saved by the plugin, so create the view first when the alias must not carry an implicit schema mutation. ([FilterHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts), [EmbedTableRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/EmbedTableRenderer.ts))

### Verify

- The view ID, filter IDs, and sort IDs are unique.
- Every `columnId` resolves to an existing column.
- The view has all four array fields, even when some are empty.
- The intended embed alias matches the persisted view name.

---

## 7. IMPORT CSV AS TEXT

### Goal

Convert CSV into a durable `.table.md` table without silently guessing types.

### Exact `.table.md` edit

1. Parse the CSV with quote-aware rules; preserve header order, trim the parsed fields, and normalize each row to the header count.
2. Create one `text` column per header, using deterministic IDs such as `col_0`, `col_1`, and so on.
3. Copy every imported field as a string into `row.cells[columnId]`.
4. Write the complete canonical table to `.table.md` or `.table.json`.
5. Make any desired Number, Date, Checkbox, Select, or Link conversions as a separate reviewed schema edit.

The plugin's CSV import creates text-only columns and string cells. Opening a `.csv` directly is different: it creates an in-memory table, and normal save deliberately does not write edits back to the CSV. ([CsvFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts), [JsonTableView.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts), [csv.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts))

### Verify

- Every imported column has `type: "text"` initially.
- Header order equals `columns` array order.
- Every cell is a string, including numerals and date-looking values.
- The resulting table parses as canonical JSON; the original CSV remains untouched.

---

## 8. APPLY A SORT

### Goal

Save the row ordering rule the current plugin actually executes.

### Exact `.table.md` edit

Add one rule to the target view's `sorts` array:

```json
{
  "id": "srt_priority",
  "columnId": "col_priority",
  "direction": "asc"
}
```

Additional sort objects can be stored, but current `SortHandler.getSortedRows()` applies only the first array entry. Use the primary sort as `sorts[0]`; do not promise a second `then by` rule will affect current output. ([SortHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts))

### Verify

- The first sort references a real column and has `asc` or `desc` direction.
- The primary sort produces the intended presentation after reload.
- Any later sort rules are documented as persisted-but-not-executed current behavior.

---

## 9. SOURCES AND RELATED REFERENCES

- [Data model](data-model.md) — canonical JSON contract and all-type skeleton.
- [Troubleshooting](troubleshooting.md) — malformed wrappers, IDs, formulas, constrained selects, migration, sorting, and CSV failures.
- [Starter table asset](../../../assets/plugins/obsidian-tables/example.table.md) — valid ready-to-copy `.table.md`.
- [Tables source repository](https://github.com/aztekgold/obsidian-tables) — current implementation boundary.
