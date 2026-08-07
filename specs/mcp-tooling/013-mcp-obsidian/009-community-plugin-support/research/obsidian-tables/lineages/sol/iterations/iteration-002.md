# Iteration 2: Verified schema, persistence, and file-layer operations

## Focus

This final forced-depth pass used the installed GitHub connector to read source bodies after raw GitHub transports failed. The plugin source at `main` is now Agentable v1.0-aligned; the findings below distinguish the current canonical format from legacy aliases migrated on read.

## Actions Taken

1. Read `src/types.ts`, both JSON/Markdown handlers, CSV handling, migration/default logic, formula evaluation/rendering, filter/sort handlers, `main.ts`, README, and the author’s `agentable` schema repository.
2. Cross-checked interface declarations against actual read/save/migrate behavior and default-file creation.
3. Derived safe file-layer create, query, patch, import, validate, and migration procedures from the code paths.

## Findings

1. Canonical root JSON is `{version, metadata, policy?, columns, views, rows}`. `version` is currently `"agentable-1.0.0"`; `metadata` requires `title`; `policy.permissions` is optional and contains optional `allowAgentRead/Create/Update/Delete` booleans. No separate root order key exists—array order is authoritative. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]

2. A `.table.md` is Markdown, not bare JSON. It must have YAML frontmatter `json-table-plugin: true` and a fenced `json-table` block containing the JSON. Save also regenerates `table-links` from link-column cell values while preserving other frontmatter/body content. Missing marker, missing/broken fence, invalid JSON, or missing `columns`/`rows` raises a specific error. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]

3. Canonical columns are `{id:"col_*", name, type, display?, constraints?}`. `display` carries optional `width` and `dateFormat`. `constraints` carries optional `options`, `multiSelect`, `suggestAllFiles`, `wrap`, `formula`, and `formulaResultKind`. Options are `{value,color?}`. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]

4. Canonical type strings are `text`, `number`, `boolean`, `select`, `url`, `email`, `link`, `date`, and `formula`; multi-select is not a separate canonical type—it is `type:"select"` with `constraints.multiSelect:true`. Legacy `checkbox→boolean`, `dropdown→select`, `multiselect|multi-select→select+multiSelect`, `notelink|wikilink→link`, and `function→formula` are normalized. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]

5. Rows are `{id, cells}` where `cells` is keyed by stable column ID. IDs come from Agentable: structural prefixes `col_`, `view_`, `flt_`, `srt_` plus random suffixes; row IDs are time-sortable Base36 time plus randomness. Row array order is manual display order when no sort is active. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts] [SOURCE: https://github.com/aztekgold/agentable]

6. Practical cell encodings are strings for text/url/email/link/select; arrays of option values for multi-select; booleans for boolean; numbers or numeric strings for number; millisecond timestamps for dates; and computed string values for formula cells. The interfaces intentionally type cell values as `unknown`, so these runtime conventions—not a strict cell union—govern file-layer edits. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts] [INFERENCE: renderer/filter/formula behavior]

7. Views serialize as `{id,name,sorts,filters,hiddenColumns,columnOrder}`. Each sort is `{id,columnId,direction:"asc"|"desc"}`; each filter is `{id,columnId,operator,value?}`. Operators are `contains`, `doesNotContain`, `startsWith`, `endsWith`, `isEmpty`, `isNotEmpty`, `gt`, `lt`, `is`, and `isNot`. Multiple filter rules are ANDed. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts]

8. The UI persists multiple sort rules, but current `getSortedRows()` applies only `rules[0]`. README’s “multi-level sorting” claim therefore exceeds current execution behavior, though extra rules remain serialized. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables#views-sorting--filtering]

9. Formula source is stored in `column.constraints.formula` using stable ID references such as `{{ col_ab1 }}`; the editor converts names to IDs. `formulaResultKind` is a persisted cache (`number|date|text`). On recompute, results are written into each row’s `cells[formulaColumnId]` as strings (empty string on failure), so both formula definition and last computed cell result are persisted. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts]

10. Empty JSON files load as a valid empty table with one default view; missing views are repaired similarly. Old row arrays/cell objects, old type options/colors, old widths/date formats, and legacy filter/sort property names are migrated in memory and become canonical on the next save. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]

11. CSV import treats the first parsed row as headers, creates only text columns with IDs `col_0`, `col_1`, …, width 150, and string cell values; it does not infer types. CSV export reads current cell values, including recomputed formula cells. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]

12. Settings are `tableRenderer:"default"|"json"`, `enableBetaFeatures`, `enableCsvSupport`, and `stickyActionColumn`; all booleans default false and Markdown is the default renderer. The primary command/file-menu action is “New table”; source also exposes CSV import when enabled. README documents inline editing, embeds, drag reorder, resize, rename, link maintenance, autosave, and mobile layouts. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables]

## Verified Data Model

Minimal valid `.table.md`:

```markdown
---
json-table-plugin: true
table-links: []
---

```json-table
{
  "version": "agentable-1.0.0",
  "metadata": { "title": "Tasks" },
  "columns": [
    { "id": "col_task", "name": "Task", "type": "text", "display": { "width": 150 } },
    { "id": "col_done", "name": "Done", "type": "boolean" },
    { "id": "col_status", "name": "Status", "type": "select", "constraints": { "options": [{ "value": "Todo", "color": "red" }] } },
    { "id": "col_tags", "name": "Tags", "type": "select", "constraints": { "multiSelect": true, "options": [{ "value": "AI", "color": "blue" }] } },
    { "id": "col_due", "name": "Due", "type": "date", "display": { "dateFormat": "YYYY/MM/DD" } },
    { "id": "col_formula", "name": "Label", "type": "formula", "constraints": { "formula": "{{ col_task }}", "formulaResultKind": "text" } }
  ],
  "views": [{ "id": "view_all", "name": "All", "sorts": [], "filters": [], "hiddenColumns": [], "columnOrder": [] }],
  "rows": [{ "id": "m0example001", "cells": { "col_task": "Ship", "col_done": false, "col_status": "Todo", "col_tags": ["AI"], "col_due": 1785715200000, "col_formula": "Ship" } }]
}
```

The sample IDs illustrate required prefixes/shapes; production writers should use collision-resistant Agentable generators or inspect existing IDs before creating unique replacements.

## File-Layer Workflows

- Create: build the full object, ensure every column/view/filter/sort ID is unique and prefixed, ensure row cells use column IDs, wrap it in valid frontmatter/fence, then parse the extracted JSON before atomic replacement.
- Add a row: generate a unique row ID; populate `cells` only with known column IDs; use native booleans, arrays for multi-select, and epoch milliseconds for date; leave formula cells empty or recompute them.
- Query: parse only the fenced block, index columns by ID/name, then project `rows[].cells[column.id]`; apply all filters with AND semantics and treat current code’s sort execution as first-rule-only.
- Safe patch: read the whole file, validate frontmatter/fence/JSON/root arrays, retain unknown root/column fields, patch by stable IDs, recompute formula cells if dependencies changed, regenerate `table-links`, serialize with two-space indentation, write a sibling temporary file, parse/validate it, then atomically replace while retaining a backup.
- CSV import: parse headers, create text columns and string cells first; perform an explicit second migration for desired types rather than guessing during import.
- Migration: run legacy conversions described above; preserve IDs where valid; generate missing IDs; move `width/dateFormat/options` into canonical `display/constraints`; then validate and save once.

## Troubleshooting and Edge Cases

- Missing `json-table-plugin: true`: file opens as ordinary Markdown or handler throws “not a valid table file.”
- Missing/malformed fence: “Could not find/extract `json-table` code block.”
- JSON syntax/trailing comma: `Invalid embedded JSON: ...`; bare `.table.json` reports `Invalid JSON: ...`.
- Missing `columns`/`rows`: invalid structure; bare JSON handler additionally requires `views` after repair.
- Duplicate column names in formula authoring: first name match wins and validation warns; stable IDs avoid rename breakage.
- Deleted/unknown formula dependency, parse/type/evaluation error: computed cell becomes empty string and UI renders an em dash; `formulaResultKind` may be cleared.
- Hand-edited name-based formula: recompute attempts a one-time self-heal to ID references.
- Multiple stored sorts: only the first currently affects row order.
- Manual row reordering under an active sort may appear ineffective because sort presentation overrides array order.
- Directly parsing `.table.md` as JSON fails because it is Markdown/YAML/fenced JSON; extract the fence first.
- `table-links` is derived metadata; stale values can be repaired by scanning link columns and regenerating it.

## Questions Answered

All requested schema, type, formula, view/filter/sort, wrapper, migration, workflow, and core troubleshooting questions were answered from source. The exact complete command IDs and every UI notice string were not exhaustively enumerated within the iteration budget.

## Questions Remaining

- Confirm release/tag parity for the user’s installed plugin version; this research describes repository `main` at the cited sources.
- Verify whether a later commit fixes multi-sort execution.

## Ruled Out

- Treating `.table.md` as raw JSON.
- Treating `multi-select` as a canonical current type.
- Assuming formula results are render-only; source writes them through to row cells.
- Claiming all serialized sort rules execute; current code uses only the first.

## Sources Consulted

- https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts
- https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts
- https://github.com/aztekgold/obsidian-tables
- https://github.com/aztekgold/agentable

## Assessment

- New information ratio: 1.00. Twelve source-backed findings resolved the exact-shape questions left open by iteration 1.
- Status: insight. Source access changed the data model from semantic guesses to a verified persistence contract.

## Reflection

The GitHub connector succeeded where raw/blob fetchers and shell DNS failed. Reading interfaces alone was insufficient: `FormulaHandler` proved computed results persist, `SortHandler` exposed the first-rule-only behavior, and Markdown handlers established the wrapper contract.

## Recommended Synthesis

Make the current Agentable-aligned schema the canonical model, keep a clearly labeled legacy-migration table, warn that repository `main` may differ from installed releases, and foreground parse-before-write plus atomic backup/replace as the AI safety contract.
