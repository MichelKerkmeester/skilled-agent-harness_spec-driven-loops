# Iteration 4: File-layer AI workflows

## Focus

Derive safe, schema-preserving recipes for an AI operating directly on vault files: create, append/patch rows, CSV conversion, querying, in-place updates, view edits, and legacy migration.

## Actions Taken

- Reconciled the canonical `TableData` types with the Markdown/JSON/CSV handlers and renderer write paths.
- Built recipes from the exact source invariants: column-ID keyed cells, fenced Markdown payloads, `vault.process` saves, view-scoped filters/sorts, and migration aliases.
- Marked recommendations as inference where they describe an AI safety procedure rather than plugin-enforced behavior.

## Findings

### 1. Create a valid `.table.md` from scratch

The minimal robust file-layer recipe is:

1. Choose a unique filename ending in `.table.md`.
2. Write frontmatter with the exact boolean `json-table-plugin: true` and a `table-links` list.
3. Put one valid `TableData` object inside a ` ```json-table ` block.
4. Use stable unique IDs with the expected prefixes (`col_`, `view_`, `row_`/opaque row ID, `flt_`, `srt_`) and reference cells by column ID, never by column name.
5. Include `version: "agentable-1.0.0"`, `metadata.title`, arrays for `columns`, `views`, and `rows`, and a default view with all five view fields.
6. Parse the block back after writing and assert that every row cell key is either a known column ID or intentionally retained extension data.

Example payload:

```json
{
  "version": "agentable-1.0.0",
  "metadata": { "title": "Reading List" },
  "columns": [
    { "id": "col_title", "name": "Title", "type": "text", "display": { "width": 220 } },
    { "id": "col_done", "name": "Done", "type": "boolean", "display": { "width": 100 } },
    { "id": "col_tags", "name": "Tags", "type": "select", "constraints": { "multiSelect": true, "options": [{ "value": "AI", "color": "violet" }] } }
  ],
  "views": [{ "id": "view_default", "name": "Default", "sorts": [], "filters": [], "hiddenColumns": [], "columnOrder": [] }],
  "rows": [{ "id": "row_001", "cells": { "col_title": "A book", "col_done": "false", "col_tags": "AI" } }]
}
```

The plugin's creator generates more collision-resistant opaque IDs; the deterministic IDs above are a file-layer recipe, not a claim about the dependency's generator. The interface requires prefixed column/view IDs, while rows are opaque strings. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]`

### 2. Add a row safely

Read and parse the existing payload first; construct a fresh row object with a unique row ID; populate every current column ID with a type-appropriate empty/default value; then add only the intended values. Recommended defaults are `""` for text/url/email/link/date/formula, `"false"` for checkbox, `null` or `""` for empty number (the UI uses both paths), and `""` for empty select/multi-select. For multi-select, join option values with commas and avoid commas inside option values because the renderer has no escaping. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/MultiSelectRenderer.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/CheckboxRenderer.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NumberRenderer.ts]`

For `.table.md`, replace only the JSON payload inside the exact `json-table` block and preserve frontmatter, headings, comments, and other Markdown. For `.table.json`, serialize the root object with stable indentation. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts]`

### 3. Patch a row or cell

Use `row.id` as the primary key; array position is mutable because row drag reorder changes `rows`. Use `column.id` as the cell key; column names are presentation labels and may duplicate. Patch only the targeted cell/field, preserving unknown top-level fields and unrelated rows. For a note-link cell, store the vault path string, not Markdown link syntax. For a date, store the millisecond timestamp string used by the picker. For checkbox, write `"true"`/`"false"` to match the renderer. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DateRenderer.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NoteLinkRenderer.ts]`

Do not treat a Formula cell as an authoritative manually edited value. Patch its source columns and let the plugin recompute; otherwise the persisted formula result may be stale until the next render. If the AI must leave a self-consistent file without opening Obsidian, it must implement the documented formula subset or explicitly mark the formula result as pending. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts]`

### 4. CSV to table conversion

For a persistent import, parse CSV with quote-aware handling, preserve header order, create text columns with `col_<base36-index>` IDs, create rows with fresh IDs, and write the resulting root object in the selected `.table.md` or `.table.json` format. This mirrors the plugin's `Import CSV file` command. Normalize jagged rows to the header count before writing; the built-in parser accepts jagged rows, but cells beyond the known columns are not part of the canonical column set. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts]`

Import creates all columns as text. A follow-up schema pass may convert selected columns to number/boolean/date/select, but it must also normalize existing cells and add constraints/display settings. Directly opening a CSV is not a substitute: the current view path keeps changes in memory and does not write the CSV. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts]`

### 5. Query rows at the file layer

An AI can query all rows without traversing linked notes:

1. Parse the root and build `column name -> column ID` and `column ID -> definition` maps.
2. Read `rows[*].cells[columnId]` directly.
3. If emulating a saved view, apply its filters as AND rules using the operator semantics from `FilterHandler`.
4. Apply only the first `sorts` entry to match current plugin behavior; report additional sort entries as serialized but currently ineffective.
5. Ignore `hiddenColumns` for data retrieval unless the user explicitly asks for the view projection. Do not use `columnOrder` as a reliable active order in current `main`.
6. Treat search as unavailable from the file because it is ephemeral and not persisted.

Formula cells may contain a persisted computed result, but that result can be stale if a base cell was edited outside Obsidian. Query recipes should either recompute the supported formula subset or label formula-derived values as source-stored values with freshness unknown. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SearchHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts]`

### 6. Safe in-place patch protocol

The safest AI procedure is:

1. Read the complete file and retain the original bytes for rollback/diff.
2. Confirm the filename extension and, for `.table.md`, locate exactly one intended `json-table` block and validate frontmatter.
3. Parse JSON; validate root arrays and ID references before mutation.
4. Apply the smallest object-level patch keyed by row/column IDs.
5. Serialize only the payload. Preserve Markdown body and frontmatter keys; update `table-links` only when link cells changed.
6. Write through an atomic or vault-process equivalent, not a sequence of partial text substitutions.
7. Re-read and parse the written file; verify target change plus invariants: unchanged row count unless intended, unique IDs, every formula/column reference still resolves, and `views[0]` exists.
8. Keep a pre-write backup or reversible diff when the environment supports it.

This protocol is an AI safety recommendation inferred from the plugin's `vault.process` handlers and ID-keyed model; the plugin does not expose an external transaction API. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts]`

### 7. Schema migration

For an old payload, follow the plugin's migration rules: detect missing `version` or an array-shaped first row; convert old row arrays of `{column,value}` cells into `{id,cells}` rows; preserve row IDs when already available; normalize `checkbox -> boolean`, `dropdown -> select`, `multiselect`/`multi-select -> select + multiSelect`, and `notelink`/`wikilink -> link`; move date format into `display.dateFormat`; map `typeOptions.options` styles/colors into `constraints.options`; normalize view `sort`/`filter` to `sorts`/`filters`; map `equals -> is` and `notEqual -> isNot`; add IDs/default arrays. Save the migrated payload only after validation. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]`

For a `.table.md`, migrate the JSON inside the fence and preserve the wrapper. The plugin itself migrates in memory and persists the canonical shape on the next save; an AI can perform the same transformation proactively, but should not silently discard unsupported fields. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/CHANGELOG.md]`

### 8. View and embed workflows

To add a saved view, append a `ViewDef` with a unique view ID and all arrays present. To pin it from another note, use `![[Name.table.md|View Name]]`; note that an absent alias-named view is created and saved automatically by the plugin. An AI creating a view should therefore decide whether that mutation is intended before writing the embed alias. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/EmbedTableRenderer.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/livePreviewExtension.ts]`

## Questions Answered

- Which create, patch, import, query, migration, and safe in-place editing workflows are valid for an AI? **Answered with source-preserving protocols and current implementation caveats.**

## Questions Remaining

- What is the complete malformed-file/formula-error catalog, including exact user-visible symptoms and recovery choices?
- Which AI recipes need explicit warnings for formula limits, commas in multi-select values, stale computed cells, and missing views?

## Ruled Out

- Patching by row index or column name is not robust.
- Replacing an entire `.table.md` with JSON is not a safe migration.
- Treating persisted formula output as always fresh is not justified.

## Sources Consulted

- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/EmbedTableRenderer.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]`

## Assessment

- `newInfoRatio`: `0.72`
- Novelty: this pass converted source invariants into concrete file-layer procedures and explicitly separated plugin behavior from AI safety recommendations.

## Reflection

The operational model is complete enough for synthesis. The final research pass should focus on failure symptoms, formula grammar/runtime errors, malformed wrapper cases, and recipe-level troubleshooting.

## Recommended Next Focus

Build the edge-case catalog and test matrix: malformed JSON, missing frontmatter/block, legacy shapes, bad IDs, missing columns/views, CSV quoting/jagged rows, formula parse/type/runtime errors, and stale/unsupported values.
