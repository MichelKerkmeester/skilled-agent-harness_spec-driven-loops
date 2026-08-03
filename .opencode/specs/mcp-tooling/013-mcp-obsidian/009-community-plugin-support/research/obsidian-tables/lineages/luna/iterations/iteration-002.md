# Iteration 2: Views, queries, ordering, exports, and embeds

## Focus

Resolve the serialized `views` shape and compare README feature claims with the current source behavior for filters, multi-level sort, drag reorder, CSV export, and embeds.

## Actions Taken

- Read `ViewManager`, `SortHandler`, `FilterHandler`, `SearchHandler`, `DivTableRenderer`, CSV utilities, and the embed/live-preview renderers.
- Searched the repository for every `columnOrder` use to determine whether it is behaviorally active or only a compatibility field.
- Cross-checked the behavior against the README and changelog feature descriptions.

## Findings

### 1. View serialization

Each view is stored as:

```json
{
  "id": "view_<opaque>",
  "name": "Default",
  "sorts": [
    { "id": "srt_<opaque>", "columnId": "col_abc", "direction": "asc" }
  ],
  "filters": [
    { "id": "flt_<opaque>", "columnId": "col_def", "operator": "is", "value": "Done" }
  ],
  "hiddenColumns": ["col_ghi"],
  "columnOrder": ["col_abc", "col_def"]
}
```

The default view is named `Default` with empty arrays for sorts, filters, hidden columns, and column order. View creation appends a new view named `View N`; rename and delete are persisted. The last remaining view cannot be deleted. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/fileUtils.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/ViewManager.ts]`

### 2. Filters

Filters are attached to the active view and all rules are combined with logical AND (`rules.every`). Supported operators are `contains`, `doesNotContain`, `startsWith`, `endsWith`, `gt`, `lt`, `isEmpty`, `isNotEmpty`, `is`, and `isNot`. Text matching is case-insensitive. Empty filter values make `gt`/`lt` pass every row; empty-value rules are represented by the operator and omit the meaningful value in practice. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts]`

`gt` and `lt` are offered only for date/number columns and Formula columns whose cached result kind is numeric/date. Date range UI values are converted from `YYYY-MM-DD` into local-midnight millisecond timestamps before being stored in `FilterRule.value`; number filters store the typed string. Invalid numeric values fail the comparison rather than matching. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts]`

### 3. Sorts: serialized array, single-level implementation

The UI persists an ordered `sorts` array and labels later rows “then by”, matching the README's multi-level-sort claim. However, the current `SortHandler.getSortedRows()` destructures only `rules[0]` and sorts once. The remaining serialized sort rules are ignored by the actual comparator. This is a confirmed source/README mismatch: an AI should not assume a second sort key is effective merely because it is present in JSON. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]`

The first key is type-aware: dates parse timestamps, booleans map true/false to 1/0, numbers and numeric/date Formula results compare numerically, and other values compare lower-cased strings after emoji stripping. Empty values sort after non-empty values. A sort also disables the row-drag handle in the renderer. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts]`

### 4. Search and visible rows

The search box is an ephemeral, case-insensitive substring search across visible columns only. It is not serialized into the table or view and resets when the view instance is recreated. Rendering applies sort, then filters, then search. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SearchHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts]`

`hiddenColumns` is active per view and controls both rendering and view CSV export. `columnOrder` is part of the persisted interface and is carried through migration/default creation, but repository search finds no renderer that reads it. Actual header drag reorder mutates the global `data.columns` array, so column order is table-wide rather than view-specific in the current implementation. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts]`

### 5. Row and column drag reorder

Row drag reorder is gated by the experimental `enableBetaFeatures` setting, disabled for inline tables, and hidden while a sort is active. Dropping splices the original `data.rows` array and saves immediately. Column headers are draggable without that setting; dropping splices `data.columns` and saves immediately. Resizing persists `column.display.width`, with a minimum live width of 40px. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]`

### 6. CSV export

There are two menu actions:

- **Export table as CSV:** all columns and all rows in current stored order.
- **Export view to CSV:** visible columns only, after the current first sort, all active AND filters, and ephemeral search.

Both exports recompute formulas first; the real editable view may persist those computed results before downloading. `generateCsv()` emits the column names as the first row, converts missing cells to empty strings, quotes fields containing commas, quotes, or line breaks, and doubles embedded quotes. Multi-select values remain one comma-containing cell and are quoted when needed. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/AbstractTableRenderer.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts]`

### 7. Linked embeds and view pinning

Live Preview and the Markdown postprocessor recognize `.table.md` and `.table.json` files in `![[...]]`. The pipe alias is parsed as a view name:

```markdown
![[MyTable.table.md]]
![[MyTable.table.md|Sprint Board]]
```

Without an alias, the first view renders. With an alias, the renderer resolves a case-insensitive view-name match; if absent, it creates a new view with that name, saves it, locks the embed to that view, hides its view tabs, and displays a title header with `table name › view name`. The embed uses the same interactive renderer and a mock save view, but it is marked inline, so passive formula recomputation is not automatically written back. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/livePreviewExtension.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/EmbedTableRenderer.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]`

Inline code blocks use `jsontable`, not the linked-embed syntax. The plugin parses the block JSON and can write the matching block back by its first view ID (using a first-column/name hash to disambiguate duplicate view IDs). `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/InlineTableRenderer.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]`

## Questions Answered

- How do rows, views, filters, multi-level sorts, reordering, exports, and embeds serialize at the file layer? **Answered, including the `sorts`/`columnOrder` implementation gaps.**
- Which README behaviors are confirmed versus merely represented in JSON? **Multi-level sort and per-view column order require caution; the current source only implements the first sort rule and global column order.**

## Questions Remaining

- What commands/settings and format-specific file creation/import behavior must an AI account for?
- What safe read/patch/query/migration recipes avoid corrupting `.table.md` wrappers?
- What malformed JSON, markdown extraction, CSV, and formula error messages are observable?

## Ruled Out

- `columnOrder` is not a reliable active per-view ordering mechanism in current `main`; it is serialized but not consumed by the renderer.
- An embed alias is not arbitrary display text only; it is interpreted as a view name and may mutate the table by creating that view.

## Sources Consulted

- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SearchHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/AbstractTableRenderer.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/livePreviewExtension.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/EmbedTableRenderer.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/InlineTableRenderer.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts]`

## Assessment

- `newInfoRatio`: `0.90`
- Novelty: source inspection confirmed the serialized arrays and found two behaviorally important mismatches: only the first sort rule is applied, and `columnOrder` is not consumed for per-view rendering.

## Reflection

The data model now has enough query semantics to design deterministic AI recipes. The next pass should inventory user commands/settings and creation/import paths, including the CSV direct-open save trap.

## Recommended Next Focus

Inspect `main.ts`, `JsonTableView`, all file handlers, and settings defaults for commands, file creation, CSV import/direct edit behavior, and smart link maintenance.
