# Iteration 1: Canonical schema and column storage

## Focus

Resolve the current Agentable V1.0 `.table.md` JSON contract, all requested column types, option/color storage, and formula persistence versus render-time computation.

## Actions Taken

- Read the current repository source at `main`, prioritizing `types.ts`, `migrateUtils.ts`, the file handlers, formula engine, and cell renderers.
- Cross-checked the source model against the repository README and the 1.4/1.5 changelog entries.
- Distinguished canonical V1.0 fields from legacy aliases accepted by the migration layer.

## Findings

### 1. Canonical root object

The current root is:

```json
{
  "version": "agentable-1.0.0",
  "metadata": { "title": "Table title" },
  "columns": [],
  "views": [],
  "rows": []
}
```

`policy` is an optional TypeScript field containing optional agent permission booleans, but the plugin's file handlers neither create nor enforce it. There is no top-level table `id`, `order`, or `title` field; identity is the file path and the title is nested under `metadata`. IDs live on columns, rows, views, filters, and sort rules. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]`

The normal creator emits two text columns, one empty row, and one default view. A new `.table.md` file also has frontmatter and a fenced `json-table` block; the JSON object is the data payload inside that block. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]`

### 2. Column definition

The canonical column shape is:

```json
{
  "id": "col_<opaque>",
  "name": "Column name",
  "type": "text",
  "display": {
    "width": 150,
    "dateFormat": "YYYY/MM/DD"
  },
  "constraints": {}
}
```

`display` and `constraints` are omitted when empty. `display.width` is a number. `display.dateFormat` is the canonical location for date formatting. `constraints` may contain:

```json
{
  "options": [{ "value": "Done", "color": "green" }],
  "multiSelect": true,
  "suggestAllFiles": false,
  "wrap": true,
  "formula": "{{ col_abc }} * {{ col_def }}",
  "formulaResultKind": "number"
}
```

The supported option color tokens used by the UI are `default`, `accent`, `red`, `orange`, `yellow`, `green`, `blue`, `indigo`, `violet`, and `pink`; source stores the token as the option's `color` string. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts]`

### 3. Per-type cell and definition rules

- **Text:** `type: "text"`; cell values are normally strings. `constraints.wrap` controls display wrapping. Empty cells are `""`.
- **Number:** `type: "number"`; the editor saves a parsed JSON number, `null` when emptied, or a string if invalid text is entered. File-layer writers should use JSON numbers for valid numeric cells. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NumberRenderer.ts]`
- **Checkbox:** canonical creator type is `"boolean"` (the UI label is Checkbox). Cells are saved as the strings `"true"` and `"false"`, and the renderer checks specifically for `"true"`. The migration layer accepts legacy `"checkbox"` and normalizes it to `"boolean"`. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/CheckboxRenderer.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]`
- **Select:** `type: "select"`; `constraints.options` is an ordered array of `{value,color?}` objects. A selected cell stores the option value as one string. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DropdownRenderer.ts]`
- **Multi-select:** current creation still uses `type: "select"` plus `constraints.multiSelect: true`. The renderer stores selected values as one comma-separated string such as `"Urgent,Research"`; there is no escaping layer for commas. Legacy `"multiselect"` and `"multi-select"` are migrated to `type: "select"` with `multiSelect: true`. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/columnUtils.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/MultiSelectRenderer.ts]`
- **URL:** `type: "url"`; the cell remains a string. Values matching `http://`, `https://`, `ftp://`, or protocol-relative `//` render as external links; other strings remain plain text. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/UrlRenderer.ts]`
- **Email:** `type: "email"`; the cell remains a string. Values matching the plugin's simple `local@host.tld` pattern render as `mailto:` links; non-matching text remains plain text. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/EmailRenderer.ts]`
- **Note link:** canonical `type: "link"`; the cell is a vault path string such as `Projects/Alpha.md`, not a wrapped `[[...]]` value. The editor resolves a typed link to the full path when possible. `constraints.suggestAllFiles` controls whether the suggester includes all files. Legacy `"notelink"` and `"wikilink"` are accepted. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NoteLinkRenderer.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]`
- **Date:** `type: "date"`; cells are millisecond timestamps serialized as strings by the picker. `display.dateFormat` defaults to `"YYYY/MM/DD"` and supports `"MMMM D, YYYY"`, `"MMM D"`, `"DD/MM/YYYY"`, `"MM/DD/YYYY"`, and `"YYYY/MM/DD"`. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DateRenderer.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]`
- **Formula:** `type: "formula"`; `constraints.formula` stores the expression and `constraints.formulaResultKind` caches `number`, `date`, or `text` for sort/filter gating. Formula columns are not directly editable cells. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts]`

### 4. Formula persistence and computation

Formulas are authored with names (`{{ Price }}`) but persisted with stable column IDs (`{{ col_abc }}`), so a referenced column rename does not break the stored reference. The editor warns when duplicate names resolve first-match-wins; unknown names remain and later surface as evaluation errors. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts]`

The plugin computes formulas on render, but the result is not purely ephemeral in the normal table view: `recomputeAll()` writes the computed value into `row.cells[formulaColumnId]`, updates `formulaResultKind`, and the editable `DivTableRenderer` saves the changed data. Formula failures write `""`, mark the cell errored, and render as `—`. Inline and embedded renderers set `isInline: true`, so passive formula recomputation is kept in memory and is not automatically persisted. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts]`

Formula syntax is recursive-descent: arithmetic only accepts number operands; `>`/`<` accept number/date operands; `==` compares any operands as text. Functions are `if`, `contains`, `today`, and `date`. A formula cannot reference another Formula column. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/parser.ts]` `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts]`

### 5. Legacy migration boundary

`isOldFormat()` treats a payload as legacy when `version` is absent or the first row is an array. `migrateToAgentable()` converts old row arrays, `typeOptions`, old type aliases, `sort`/`filter` singular keys, and `equals`/`notEqual` operators; it generates IDs and defaults a view when needed. A truthy but unknown `version` is not rejected as a version mismatch. `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]`

## Questions Answered

- What are the exact top-level keys and per-column structures for every supported type, including option/color storage and formula behavior? **Answered for current source and legacy aliases.**
- Is formula text persisted or computed only at render time? **Answered: expression and cached result kind persist; row result is recomputed and normally written through, with inline/embed persistence suppressed for passive recomputation.**

## Questions Remaining

- How views, filters, sorting, column/row reorder, CSV export, and embeds serialize and behave in practice?
- Which commands/settings and file-layer workflows are safest for AI operation?
- What exact malformed-file and formula-error symptoms should troubleshooting recipes cover?

## Ruled Out

- The installed minified `main.js` is not needed for the current schema resolution; repository source is authoritative for this pass.
- A top-level table `id` or `order` key is not part of the current `TableData` interface.

## Sources Consulted

- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts]`
- `[SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/CHANGELOG.md]`

## Assessment

- `newInfoRatio`: `0.95`
- Novelty: direct source inspection resolved canonical V1.0 names, string-vs-number cell behavior, multi-select comma storage, and the important distinction between persisted formula results in the normal view and in-memory recomputation for inline/embed renderers.

## Reflection

The schema question is sufficiently grounded to move to serialization and behavior. The next pass must test README claims against implementation, especially multi-level sort and per-view column order.

## Recommended Next Focus

Inspect `ViewDef`, `SortHandler`, `FilterHandler`, `DivTableRenderer`, `ViewManager`, CSV utilities, and embed renderers for exact persisted shapes and implementation mismatches.
