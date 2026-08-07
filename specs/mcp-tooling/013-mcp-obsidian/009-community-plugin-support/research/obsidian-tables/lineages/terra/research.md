# Obsidian Tables: File-Layer AI Knowledge Base

## 1. Scope and Evidence Status

This report covers the current TypeScript source for [aztekgold/obsidian-tables](https://github.com/aztekgold/obsidian-tables) and its [README](https://github.com/aztekgold/obsidian-tables/blob/main/README.md), specifically an AI operating directly on table files rather than through the Obsidian UI.

The source establishes the persisted data model, file parsers, serializers, migrations, view mutations, CSV transforms, formula evaluator, and cell renderers. Runtime testing inside Obsidian was out of scope. Where a recommendation goes beyond a direct source fact, it is marked conservative guidance.

## 2. Verified Persisted Model

The source-defined table root is:

    TableData {
      version: string
      metadata: { title: string }
      policy?: {
        permissions?: {
          allowAgentRead?: boolean
          allowAgentCreate?: boolean
          allowAgentUpdate?: boolean
          allowAgentDelete?: boolean
        }
      }
      columns: ColumnDef[]
      views: ViewDef[]
      rows: Array<{ id: string, cells: Record<string, unknown> }>
    }

The current version constant is agentable-1.0.0. The root keys above are the source-defined contract; unknown extra keys were not evaluated as a compatibility guarantee. [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts)

Persisted ordering is array ordering:

- columns controls global column order;
- rows controls row order;
- views controls view order;
- a view also carries columnOrder for a view-specific display order.

Generated IDs use col_ for columns, view_ for views, flt_ for filters, and srt_ for sort rules. Row IDs are strings; the source does not require a particular row-ID prefix. [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts) [migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts)

## 3. Exact .table.md Envelope

A Markdown-backed table must contain both:

    ---
    json-table-plugin: true
    ---
    ```json-table
    { valid TableData JSON }
    ```

On save, the plugin serializes the table payload with JSON.stringify(data, null, 2), replaces or appends that json-table block, and refreshes a plugin-managed table-links frontmatter value from link-column cells. A file-layer agent should preserve ordinary Markdown and frontmatter outside the payload, and should not invent table-links formatting when it does not need to modify it. [MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts)

A .table.json file contains the same TableData object directly, serialized with JSON.stringify(data, null, 2). [JsonFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts)

## 4. Source-Compatible Example

This is an illustrative current-format object. Its identifiers are examples; do not reuse them in another table. It deliberately demonstrates the stored representation of every user-facing column type.

```json
{
  "version": "agentable-1.0.0",
  "metadata": { "title": "AI-managed tracker" },
  "policy": {
    "permissions": {
      "allowAgentRead": true,
      "allowAgentCreate": true,
      "allowAgentUpdate": true,
      "allowAgentDelete": false
    }
  },
  "columns": [
    { "id": "col_title", "name": "Title", "type": "text", "display": { "width": 240 }, "constraints": { "wrap": true } },
    { "id": "col_cost", "name": "Cost", "type": "number" },
    { "id": "col_done", "name": "Done", "type": "boolean" },
    {
      "id": "col_status",
      "name": "Status",
      "type": "select",
      "constraints": {
        "options": [
          { "value": "Todo", "color": "default" },
          { "value": "Done", "color": "green" }
        ]
      }
    },
    {
      "id": "col_tags",
      "name": "Tags",
      "type": "select",
      "constraints": {
        "multiSelect": true,
        "options": [
          { "value": "Research", "color": "blue" },
          { "value": "Writing", "color": "purple" }
        ]
      }
    },
    { "id": "col_url", "name": "URL", "type": "url" },
    { "id": "col_email", "name": "Email", "type": "email" },
    { "id": "col_note", "name": "Note", "type": "link", "constraints": { "suggestAllFiles": true } },
    { "id": "col_due", "name": "Due", "type": "date", "display": { "dateFormat": "plugin-configured format" } },
    {
      "id": "col_total",
      "name": "Total",
      "type": "formula",
      "constraints": {
        "formula": "{{col_cost}} * 2",
        "formulaResultKind": "number"
      }
    }
  ],
  "views": [
    {
      "id": "view_main",
      "name": "Main",
      "sorts": [],
      "filters": [],
      "hiddenColumns": [],
      "columnOrder": []
    }
  ],
  "rows": [
    {
      "id": "row-001",
      "cells": {
        "col_title": "Verify source model",
        "col_cost": 21,
        "col_done": "false",
        "col_status": "Todo",
        "col_tags": "Research,Writing",
        "col_url": "https://example.invalid",
        "col_email": "owner@example.invalid",
        "col_note": "Projects/Obsidian Tables.md",
        "col_due": "1767225600000",
        "col_total": 42
      }
    }
  ]
}
```

The displayed date-format value is deliberately schematic: source establishes the display.dateFormat field but this research did not establish an exhaustive accepted formatting-token set. [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts)

## 5. Column Types, Metadata, and Cell Values

The UI labels and the persisted type differ in three places: Checkbox persists as boolean, Multi-select persists as select plus constraints.multiSelect: true, and Note Link persists as link. Legacy aliases normalize accordingly. [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts) [migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts)

| UI type | Persisted type and metadata | Stored row.cells[columnId] value |
| --- | --- | --- |
| Text | type: text; constraints.wrap is optional | String copied from editable innerText. |
| Number | type: number | Parsed number; null for an empty edit; a nonnumeric string can also persist as a fallback. |
| Checkbox | type: boolean | The strings "true" or "false", not JSON booleans. |
| Select | type: select; constraints.options is an array of { value, color } | One option-value string. |
| Multi-select | type: select; constraints.multiSelect: true; same options structure | Comma-separated option strings. Values containing commas are unsafe. |
| URL | type: url | Trimmed string; rendered as a link only when validation passes. |
| Email | type: email | Trimmed string; rendered as a mail link only when validation passes. |
| Note Link | type: link; constraints.suggestAllFiles is optional | Resolved Obsidian file path when resolution succeeds; otherwise raw trimmed text. |
| Date | type: date; display.dateFormat is optional | Millisecond timestamp string. |
| Formula | type: formula; constraints.formula and constraints.formulaResultKind | Computed value persisted in the formula column's cell. |

New select options are created with color: "default"; colors are stored alongside the option, not in the row cell. [DropdownRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DropdownRenderer.ts) [MultiSelectRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/MultiSelectRenderer.ts) [TableMenuManager.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts)

The remaining value claims come from the corresponding renderers: [TextRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TextRenderer.ts), [NumberRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NumberRenderer.ts), [CheckboxRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/CheckboxRenderer.ts), [AbstractLinkRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/AbstractLinkRenderer.ts), [UrlRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/UrlRenderer.ts), [EmailRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/EmailRenderer.ts), [NoteLinkRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NoteLinkRenderer.ts), and [DateRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DateRenderer.ts).

## 6. Formula Persistence and Evaluation

Formula expressions persist under constraints.formula, and the plugin translates user-facing column references to column IDs. constraints.formulaResultKind caches number, date, or text. Recalculation writes the computed result into row.cells[formulaColumnId], so formulas are not a purely render-time calculation. Formula cells are read-only in the UI. [FormulaHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts) [FormulaRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts)

The parser supports numeric and string literals, {{ columnRef }}, function calls, parentheses, unary minus, arithmetic + - * /, and one optional comparison operator from ==, >, or <. The evaluator supports if, contains, today, and date. [parser.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/parser.ts) [evaluator.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts)

Formula failures include unknown columns/functions, references to a Formula column, wrong function arity, non-boolean if conditions, invalid dates, division by zero, and nonnumeric operands where numeric/date operands are required. FormulaRenderer displays an error as an em dash. [evaluator.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts) [FormulaRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts)

File-layer rule: do not patch a formula result cell as if it were independent data. After changing dependent cells or a formula, either reproduce the evaluator exactly or let the plugin recompute and save it; otherwise the persisted result can be stale. This is conservative guidance derived from the source's persisted result write-through. [FormulaHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts)

## 7. Views, Filters, Sorts, and Embeds

Each view is:

    {
      id: "view_...",
      name: "Human-facing name",
      sorts: SortRule[],
      filters: FilterRule[],
      hiddenColumns: string[],
      columnOrder: string[]
    }

A sort rule is { id: "srt_...", columnId, direction: "asc" | "desc" }. A filter rule is { id: "flt_...", columnId, operator, value? }. Valid operators are contains, doesNotContain, startsWith, endsWith, isEmpty, isNotEmpty, gt, lt, is, and isNot. Multiple filters combine with AND semantics. Date filter values persist as millisecond timestamp strings; gt and lt are offered for numeric/date/formula columns whose cached result kind permits it. [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts) [FilterHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts)

The UI stores multiple sort rules and presents later ones as “then by.” The fetched SortHandler implementation only applies rules[0] in getSortedRows(). Treat multi-rule serialization as confirmed but multi-level application as unresolved until runtime testing or additional source evidence settles the mismatch with the README. [SortHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts) [README](https://github.com/aztekgold/obsidian-tables/blob/main/README.md)

hiddenColumns is a view-local list of column IDs. Dragging rows splices data.rows and saves; it is disabled for inline/embed read-only tables, when an active sort exists, or when beta row-reordering is off. Dragging columns splices data.columns and saves. The source observed here did not show drag reorder writing view.columnOrder, so preserve columnOrder unless an intentional operation has source-backed semantics. [TableMenuManager.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts) [DivTableRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts)

The README documents embeds such as ![[Name.table.md|View]]. The embed renderer matches a view name case-insensitively. If the named view does not exist, it creates an empty view and saves the table. An AI should therefore regard a novel embed alias as a potentially mutating action, not merely a read. [README](https://github.com/aztekgold/obsidian-tables/blob/main/README.md) [EmbedTableRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/EmbedTableRenderer.ts)

## 8. Commands, Settings, and File-Affecting Features

- Create new table constructs default TableData with the current version, a default view, and starter rows/columns. [main.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts)
- Import CSV creates a new .table.md or .table.json table. The configured default format selects Markdown versus JSON for new tables. [main.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts)
- Add table inline inserts a jsontable fenced skeleton into the active note. [main.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts)
- CSV support enables opening CSV files in the plugin, but saveTableData keeps edits to an opened CSV in memory; it does not turn direct CSV edits into a persistent source-file update. [JsonTableView.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts) [CsvFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts)
- Beta row reordering gates the row-drag UI. [main.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts)
- Export serializes current column names and row.cells[columnId] values with CSV escaping. [csv.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts)

## 9. File-Layer Workflows

### Create a valid table

1. Choose .table.md when the table needs Obsidian frontmatter/backlink integration; otherwise use .table.json.
2. Set version to agentable-1.0.0, metadata.title, columns, rows, and at least one default view with its four empty arrays.
3. Generate unique col_ and view_ identifiers. Generate a unique string for every row.
4. Key every row cell by its column ID, not by column name.
5. Use the exact stored cell forms in Section 5, especially string booleans, timestamp strings, and comma-separated multi-select data.
6. For Markdown, add json-table-plugin: true and exactly one json-table fence. Preserve surrounding note content.
7. Parse the resulting JSON before writing, then reopen/extract it after writing as a verification pass.

This workflow is source-compatible; atomic replacement of the one payload block is conservative operational guidance. [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts) [MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts) [JsonFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts)

### Add or patch rows safely

1. Parse the entire source table before calculating a patch.
2. Resolve columns by immutable ID; use names only to locate a candidate for human review.
3. Preserve untouched columns, views, row IDs, optional policy, unknown optional metadata, and array ordering.
4. Add a row as { id, cells }, assigning only column-ID keys.
5. When deleting a column, deliberately repair every row cell map, every view filter/sort/hiddenColumns/columnOrder reference, and every formula reference. Do not rely on an implicit cleanup.
6. Do not change cached formula result cells alone; recompute or defer to the plugin.
7. Verify the extracted payload is valid JSON and its required columns, rows, and views are present before atomically replacing the file.

### Query rows at the file layer

Read .table.json as root JSON. For .table.md, first validate frontmatter and extract only the json-table payload. Apply active-view filters with AND semantics using the stored values, then hiddenColumns only as a presentation concern. Emulate at most the first verified sort rule until the multi-level sort mismatch is resolved. [MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts) [FilterHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts) [SortHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts)

### Import CSV into a table

The plugin CSV handler maps headers to text columns, creates deterministic IDs from each header's base-36 index, and creates row cells from CSV fields. Direct CSV parsing trims fields, drops blank lines, supports doubled quotes, and accepts jagged row arrays. It is therefore a lossy source format for surrounding whitespace and cannot represent comma-containing multi-select values without a separate conversion rule. Create a new table file for durable changes rather than relying on edits to an opened CSV. [CsvFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts) [csv.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts)

### Migrate an older table

Missing version or an array-shaped first row activates legacy migration. Migration creates current version/metadata, normalizes aliases, converts array rows to { id, cells }, converts legacy sort/filter keys to arrays, maps equals and notEqual to is and isNot, and ensures every view has sorts, filters, hiddenColumns, and columnOrder arrays. Prefer opening and saving through the plugin for a full migration. If a file-layer agent must migrate, transform the whole object coherently; changing version alone is not a migration. [migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts)

## 10. Eliminated Alternatives

- Do not use the installed minified main.js as schema authority when the source repository provides typed model, parser, migration, and renderer implementations.
- Do not model Checkbox as a JSON boolean or Multi-select as a JSON array; current renderer behavior persists string forms.
- Do not treat a .table.md file as arbitrary Markdown: missing plugin frontmatter or the json-table fence changes its parse path.
- Do not emulate multiple sort rules as verified behavior. Storage is proven; full execution is not.
- Do not use a first-time embed alias casually: the renderer can create and save a view.

## 11. Divergence Map

No divergent-mode pivots were recorded. The remaining evidence frontiers are:

| Frontier | Evidence | Operating position |
| --- | --- | --- |
| Multi-level sort execution | Multiple rules persist; fetched getSortedRows() applies only the first. | Store them if the plugin UI produces them, but do not rely on file-layer multi-key ordering. |
| columnOrder writer | The schema has it; fetched drag code reordered global columns instead. | Preserve it verbatim until a source/runtime path proves its mutation semantics. |
| Live Obsidian effects | Not tested in this lineage. | Treat source-level facts as file-compatibility evidence, not a UI regression suite. |

## 12. Open Questions

The five planned research questions are answered at the source-model level. The following are intentionally not claimed:

- A runtime proof that all stored multi-sort rules are applied in every renderer path.
- A runtime proof of columnOrder mutation/application outside the fetched source paths.
- A complete list of date-format tokens accepted by the plugin.
- A compatibility commitment for unknown top-level JSON fields or future Agentable versions.

## 13. Troubleshooting and Edge Cases

| Symptom | Likely cause and recovery |
| --- | --- |
| “not a valid table file” mentioning json-table-plugin: true | .table.md is missing the required true frontmatter flag. Add it, then ensure the payload is fenced. |
| “Could not find \`\`\`json-table code block start” | The Markdown file lacks the literal json-table fence. Restore the exact fence syntax. |
| “Could not extract content” | The opening fence exists but the payload/end fence cannot be extracted. Repair the block before editing rows. |
| “Invalid embedded JSON: …” | The extracted Markdown payload is invalid JSON or lacks required columns/rows. Parse and repair the whole payload. |
| “Invalid JSON: …” | A .table.json file is malformed. Parse it before any incremental patch. |
| “Invalid table JSON: missing columns, rows, or views.” | A raw JSON table lacks a required array. Restore all three; new tables should also carry version and metadata. |
| Formula displays an em dash | The evaluator recorded an error. Check function/column references, operand types, date inputs, division by zero, and formula-to-formula references. |
| A formula appears stale after a file-layer patch | Formula results are persisted cells. Recompute faithfully or open/save with the plugin. |
| Multi-select round-trip corrupts a value | Its storage is comma-separated, so commas inside option values are ambiguous. Use values without commas or redesign the column. |
| CSV import/export lost formatting | CSV parsing trims values and drops blank lines; it is not a whitespace-preserving table backup. |
| Viewing an embed changed the file | A missing alias view was created and saved by the embed renderer. Use an existing view name for read-only intent. |

The parser message forms and validation order come from [MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts) and [JsonFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts). Formula behavior comes from [evaluator.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts) and [FormulaRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts).

## 14. AI Usage Recipes

### Create a project tracker

Create a Markdown-backed table with text, select, date, note-link, and formula columns. Give it a Main view with empty arrays. Then write one row at a time using the stored forms above. On a later plugin save, expect table-links to be refreshed from link cells.

### Patch a status value

Find the Status column by id, validate that its constraints.options contains the desired value, then change only row.cells[col_status]. Keep the view arrays and other cells unchanged. If the status feeds a formula, schedule a recomputation before treating formula results as current.

### Convert incoming CSV

Parse CSV into text columns first, then create a new .table.md or .table.json. After import, explicitly upgrade columns to number/date/select only after validating their input values. This avoids accidentally interpreting stripped whitespace, blank fields, or mixed types as authoritative schema.

### Query an actionable view

Select a named view, evaluate each stored filter with AND semantics, expose only non-hidden columns to the caller, and apply the first sort rule. State in the result that multi-level ordering is unverified if sorts has more than one rule.

### Recover malformed Markdown

Take a byte-for-byte backup, verify the frontmatter flag, locate exactly one json-table block, parse it, repair missing required arrays, migrate legacy fields if applicable, then atomically replace only the JSON payload. Do not rewrite the rest of the note unless a repair requires it.

## 15. Source Index

Primary source:

- [Repository README](https://github.com/aztekgold/obsidian-tables/blob/main/README.md)
- [types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts)
- [MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts)
- [JsonFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts)
- [CsvFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts)
- [migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts)
- [FilterHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts)
- [SortHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts)
- [FormulaHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts)
- [Formula parser](https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/parser.ts) and [evaluator](https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts)
- [ViewManager.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/ViewManager.ts), [TableMenuManager.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts), [DivTableRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts), and [EmbedTableRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/EmbedTableRenderer.ts)

## 16. Confidence and Limits

High confidence: root schema, Markdown/JSON parser requirements, migration triggers, stored primitive forms, filters, view mutation, CSV transformation boundaries, formula storage/evaluation behavior, and parser error symptoms.

Medium confidence: operational recipes, because they are conservative extrapolations from source behavior rather than a live Obsidian test.

Unresolved: the multi-sort execution discrepancy and columnOrder runtime semantics. Those are explicitly preserved as limitations rather than smoothed over.

## 17. Convergence Report

- Stop reason: maxIterationsReached.
- Total iterations: 3 of 3 required by the configured max-iterations policy.
- Questions answered: 5 / 5.
- Remaining planned questions: 0.
- New-information sequence: 1.00 → 0.88 → 0.74; average 0.87.
- Convergence threshold: 0.05. It was telemetry only; the loop did not synthesise early.
- Source diversity: 32 GitHub source references indexed by the reducer.

The iteration audit trail, reducer state, and generated resource map are co-located in this detached lineage directory.
