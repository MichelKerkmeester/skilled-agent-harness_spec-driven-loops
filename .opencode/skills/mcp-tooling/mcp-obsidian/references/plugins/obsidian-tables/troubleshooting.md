---
title: Tables File-Layer Troubleshooting
description: "Cause, detection, and recovery for Tables .table.md wrapper failures, ID integrity, formulas, constrained selects, legacy canonicalization, sort limits, and CSV text coercion."
trigger_phrases:
  - "tables table md error"
  - "tables malformed json"
  - "tables duplicate column id"
  - "tables formula rename error"
  - "tables multi select invalid value"
  - "tables first sort only"
  - "tables csv type coercion"
importance_tier: "normal"
contextType: "general"
version: 0.1.0.0
---

# Tables File-Layer Troubleshooting

Diagnose the Markdown wrapper, JSON graph, and renderer caveats separately. A file that is valid JSON can still fail as a Tables document when its frontmatter, fence, IDs, or value conventions are wrong.

---

## 1. OVERVIEW

### Triage order

1. Preserve the original file and stop further writes.
2. Confirm the `.table.md` wrapper: exact `json-table-plugin: true` frontmatter and one closed `json-table` fence.
3. Parse the payload, then validate root arrays and all IDs before changing values.
4. Inspect the specific column definition and `row.cells[columnId]` storage convention.
5. Repair the smallest broken object, reserialize the payload, re-read it, and reload the Obsidian view.

The Markdown handler gives wrapper-level errors; it does not deeply enforce unique IDs, valid option membership, or formula dependency integrity. File-layer writers must perform those checks explicitly. ([MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts), [JsonFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts), [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts))

---

## 2. WRAPPER AND JSON FAILURES

| Symptom | Cause | Detection | Fix |
| --- | --- | --- | --- |
| “Missing `json-table-plugin: true` in frontmatter” or “not a valid table file” | Missing frontmatter, wrong key, or a value other than boolean `true`. | Read the opening YAML block. | Add or repair the exact `json-table-plugin: true` key; preserve other frontmatter and body content. |
| “Could not find `json-table` code block start” | No fenced payload exists. | Search for the opening fence. | Add one fence only when the file is intended to be a table. |
| “Could not extract content” | The opening fence has no matching closing fence or usable payload. | Inspect the fence boundaries before parsing. | Repair the fence, then parse before any data mutation. |
| “Invalid embedded JSON: …” | JSON syntax failure or absent `columns`/`rows` arrays. | Extract the payload and parse it independently. | Restore from the saved original or fix the exact JSON error; retain the wrapper. |
| Table opens as raw text or an error view | The handler rejected the wrapper/payload. | Use raw text to inspect the original file rather than saving from the failed view. | Repair the wrapper or JSON first; then reload. |

The Markdown serializer operates on the first matching `json-table` block. Multiple blocks are ambiguous for file-layer edits, so keep one target block in a `.table.md` file. ([MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts))

---

## 3. ID AND COLUMN GRAPH FAILURES

| Symptom | Cause | Detection | Fix |
| --- | --- | --- | --- |
| Cells render blank, formulas resolve unexpectedly, or view rules target the wrong column | Duplicate `column.id` values. The handlers do not deeply reject them. | Build a set from `columns[].id`; it must have the same size as `columns`. | Assign a new unique `col_` ID to one duplicate, then migrate its `cells`, formula sources, filters, sorts, hidden columns, and `columnOrder` references deliberately. |
| A new cell has no visible column | The cell key is missing from `columns[].id`. | Compare every `row.cells` key to the column-ID set. | Add the intended column first or remove/migrate the extra key; do not invent a header-keyed cell. |
| A column shows empty values after a manual rename | The column ID changed instead of only `name`. | Compare the old/new column objects and affected cell keys. | Restore the original ID, change only `name`, and preserve all ID-keyed references. |
| A view fails to affect the intended data | `columnId` in a sort/filter/hidden array references a missing or duplicate column. | Resolve every view reference through the unique column-ID map. | Update the reference to the intended stable column ID and retain the view's other arrays. |

Columns, rows, filters, and sorts are ID-keyed; headers are presentation text. ([types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts), [FilterHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts), [SortHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts))

---

## 4. FORMULA AND RENAME FAILURES

| Symptom | Cause | Detection | Fix |
| --- | --- | --- | --- |
| Formula cell renders as `—` | Parse, type, or evaluation failure; the plugin stores an empty cached cell and marks the renderer state errored. | Read `constraints.formula`, its referenced column IDs/types, and source cell values. | Repair the source expression or input values; do not treat the em dash as a stored result. |
| Formula breaks after a renamed header | A hand-edited name reference was retained, an ID was changed during rename, or a referenced column was deleted. A normal name-only rename is stable. | Confirm every `{{ col_id }}` still resolves and the column ID was not changed. | Restore the original column ID and rewrite the formula with current ID tokens, for example `{{ col_hours }} * {{ col_rate }}`. |
| Formula cannot calculate | Unsupported operator/function, nonnumeric operand, division by zero, missing column, or Formula-to-Formula reference. | Compare the source to the supported grammar and column definitions. | Use `+ - * /`, one comparison, `if`, `contains`, `today`, or `date`; feed valid compatible source cells and avoid Formula dependencies. |
| Cached value is stale after a file-layer edit | Base cells changed outside the normal recompute path. | Compare the cached `row.cells[formulaColumnId]` string to the formula's inputs. | Recompute the supported expression and update the cached string, or reload in the editable table before relying on the derived value. |

Formula source is persisted under `constraints.formula` with stable IDs, while computed strings are persisted under each row's Formula cell. ([FormulaHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts), [parser.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/parser.ts), [evaluator.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts), [FormulaRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts))

---

## 5. SELECT, MULTI-SELECT, AND LINK FAILURES

| Symptom | Cause | Detection | Fix |
| --- | --- | --- | --- |
| Select value does not render as an allowed choice | `cells[columnId]` does not equal an entry in `constraints.options[].value`. | Compare the cell string against the option-value set. | Use an existing option value exactly, or add an explicit `{ value, color }` option before assigning it. |
| Multi-select appears split or malformed | The value uses a noncanonical array or contains commas inside an option value. | Check for `type: "select"`, `multiSelect: true`, and split the cell string on commas. | Store a comma-separated string of allowed values; rename options so individual values never contain commas. |
| Note link is not recognized | Cell contains `[[Note]]` syntax rather than a vault path, or the path is stale. | Inspect `cells[columnId]` and the derived `table-links` list. | Store a trimmed path such as `Projects/Atlas.md`; regenerate `table-links` as `[[Projects/Atlas.md]]` entries. |

Multi-select is constrained Select storage, and Note Link is canonical `link` storage. ([MultiSelectRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/MultiSelectRenderer.ts), [DropdownRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DropdownRenderer.ts), [NoteLinkRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NoteLinkRenderer.ts), [MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts))

---

## 6. LEGACY SAVE SURPRISES

### Cause

The plugin treats a missing `version` or an array-shaped first row as old format. Its migration path can change aliases, options, date display placement, row shape, view keys, operators, IDs, and empty view arrays on the next save.

### Detection

Look for any of the following before patching:

- no `version`;
- row arrays instead of `{ id, cells }` objects;
- `checkbox`, `dropdown`, `multiselect`, `multi-select`, `notelink`, `wikilink`, or `function` type values;
- `typeOptions`, top-level date-format fields, singular `sort`/`filter`, or `equals`/`notEqual` operators.

### Fix

Take a byte-for-byte backup, transform only the fenced JSON payload to canonical Agentable 1.0 form, preserve the Markdown wrapper and unrelated fields, and then validate IDs/references before saving. The canonical aliases are `boolean`, `select`, `select + multiSelect`, `link`, and `formula`; legacy operators become `is` and `isNot`. ([migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts))

---

## 7. VIEW, SORT, AND EMBED TRAPS

| Symptom | Cause | Detection | Fix |
| --- | --- | --- | --- |
| A second “then by” sort is present but has no effect | Current source stores multiple rules but `getSortedRows()` applies only `sorts[0]`. | Inspect the target view's `sorts` array. | Put the actual required sort first and document later rules as persisted-only current behavior. |
| A `columnOrder` array has no rendered effect | Current drag reorder writes global `columns` order; `columnOrder` is persisted but not a reliable active ordering mechanism. | Compare `columns` order with the view's `columnOrder`. | Reorder `columns` for current display behavior; preserve `columnOrder` for compatibility. |
| An embed unexpectedly adds a view | A pipe alias is interpreted as a view name and missing names are created/persisted by the embed renderer. | Check whether the alias exists in `views[].name`. | Create the view deliberately first, or use an existing view name. |

These are current source behaviors, not intended multi-sort semantics inferred from README copy. ([SortHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts), [DivTableRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts), [EmbedTableRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/EmbedTableRenderer.ts))

---

## 8. CSV TYPE-COERCION TRAP

### Cause

CSV import is deliberately text-only. A field such as `42`, `true`, or `2026-01-01` is imported as a string under a `text` column, not inferred into Number, Checkbox, or Date. Directly opened CSV files are in-memory tables whose edits are not written back by the normal save path.

### Detection

- Every imported column has `type: "text"`.
- Imported `row.cells` values are strings.
- A direct `.csv` edit disappears after reopening because no durable table file was created.

### Fix

Import into a `.table.md` or `.table.json` table first, then run a separate type-conversion pass: change the column definition, normalize each cell to the target storage form, add Select options where required, and verify formula/filter compatibility afterward. Preserve the original CSV because parsing trims fields, drops blank lines, and accepts jagged input. ([CsvFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts), [JsonTableView.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts), [csv.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts))

---

## 9. RECOVERY CHECKLIST

1. Preserve both the original and current file; do not overwrite the only evidence.
2. Repair the envelope before editing JSON.
3. Parse the JSON and validate root arrays, ID uniqueness, and all references.
4. Change one broken object at a time.
5. Rebuild `table-links` after Link-cell changes.
6. Re-read the written file and validate the exact intended change.
7. Reload the table only after file-layer checks pass.

Related references: [data model](data-model.md), [workflows](workflows.md), and the valid [starter asset](../../../assets/plugins/obsidian-tables/sample.example.table.md).
