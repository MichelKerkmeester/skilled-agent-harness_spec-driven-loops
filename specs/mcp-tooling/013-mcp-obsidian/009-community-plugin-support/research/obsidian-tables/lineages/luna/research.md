---
title: "obsidian-tables: verified file-layer data model and AI workflows"
description: "Source-cited synthesis of aztekgold/obsidian-tables current main source, README, and changelog."
---

# obsidian-tables: verified file-layer knowledge base

This document is the synthesis artifact for the detached luna research lineage. It is written for an AI that reads and mutates an Obsidian vault at the file layer, rather than driving the plugin UI.

## 1. Executive Summary

obsidian-tables stores a table as an Agentable V1.0 object. A .table.md file is still Markdown: the JSON payload is valid only inside a json-table fenced block, and the frontmatter must contain the exact boolean marker json-table-plugin: true. The canonical root has version, metadata, columns, views, and rows; policy is optional. There is no top-level table id or order; the vault path identifies the table and metadata.title supplies its title. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]

The most important file-layer rules are:

- Store row cells by column ID, not by column name or array position.
- Use type "boolean" for the UI's Checkbox column; its cells are the strings "true" and "false".
- Use type "select" with constraints.multiSelect: true for multi-select; selected values are one comma-separated string with no escaping.
- Store note-link cells as vault path strings, not [[...]] markup.
- Store date cells as millisecond timestamps serialized as strings.
- Persist formula source text in constraints.formula; the plugin also persists computed row results in the ordinary editable table view, but inline/embed recomputation is passive and can leave the file unchanged.
- Treat views[*].sorts as serialized intent, not proof of multi-level behavior: current main applies only the first sort rule.
- Treat views[*].columnOrder as compatibility data in current main: it is serialized but not consumed by the renderer; header drag changes the table-wide columns array.
- Use CSV import to create a persistent table. Direct .csv editing in the table view is transient because the normal save path returns early for CSV.
- An embed alias such as ![[Name.table.md|View]] is a view name. If that view does not exist, the plugin may create and save it.

The evidence base is the repository source, README, and changelog for aztekgold/obsidian-tables, with source behavior taking precedence over README feature claims where they diverge. The inspected changelog identifies the current repository release as 1.5.0; upstream changes after this run are outside the evidence boundary. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/CHANGELOG.md] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]

## 2. Scope, Evidence, and Confidence

The research read the source behind the installed minified main.js: types.ts, migration utilities, Markdown/JSON/CSV handlers, table routing, renderers, view/filter/sort/search handlers, embed and inline renderers, and the formula tokenizer/parser/evaluator. The README and changelog were used to identify intended feature behavior and version context. [SOURCE: https://github.com/aztekgold/obsidian-tables] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]

Claims marked source-confirmed describe code paths or types. AI safety procedures such as atomic replacement, backup retention, and stricter uniqueness validation are recommendations inferred from those contracts; the plugin does not expose a general external transaction or schema-validation API.

The companion resource-map.md records the five iteration delta inventories and their source coverage. The full iteration trail remains in iterations/iteration-001.md through iterations/iteration-005.md.

## 3. .table.md Container Contract

### 3.1 Required Markdown wrapper

The handler requires:

1. YAML frontmatter containing json-table-plugin: true, where the value is the boolean true.
2. A fenced block whose opening marker is json-table.
3. A JSON object inside that block with valid columns and rows arrays; normal saved files also contain views.

A minimal wrapper is:

```markdown
---
json-table-plugin: true
table-links: []
---

## Reading List

```json-table
{
  "version": "agentable-1.0.0",
  "metadata": { "title": "Reading List" },
  "columns": [],
  "views": [],
  "rows": []
}
```
```

The generated creator normally adds two text columns, one empty row, a heading, and a comment warning about the code block. Those presentation details are not the data-model requirement. The handler preserves surrounding Markdown and frontmatter on save, replacing the first matching json-table block. If no matching block exists during a save, it can append a block; a read still fails when the required marker or block is absent. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]

The parser uses the first matching json-table block. Multiple blocks are therefore ambiguous for an AI writer: require one deterministic target block or preserve and identify the intended block before changing anything. An empty block is accepted and becomes an empty table with a default view. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]

### 3.2 Frontmatter links

For link columns, the plugin derives table-links frontmatter entries from path-valued cells and writes them as Markdown links such as [[Projects/Alpha.md]]. The row cell itself remains the path string. table-links is derived metadata, not the row-value encoding. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NoteLinkRenderer.ts]

### 3.3 Other file formats

- .table.json stores the root object directly as pretty-printed JSON.
- .csv is parsed into an in-memory Agentable table when CSV support is enabled. It is useful for inspection and import, but the normal table-view save path deliberately does not persist edits back to the CSV.
- A generic .json that is not .table.json is not routed as a table file by the table view.

Routing is extension-based. tableRenderer: "default" creates Markdown tables; tableRenderer: "json" creates .table.json tables. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]

## 4. Canonical Agentable V1.0 JSON Schema

### 4.1 Root object

The canonical root is:

```json
{
  "version": "agentable-1.0.0",
  "metadata": {
    "title": "Table title"
  },
  "policy": {
    "permissions": {
      "allowAgentRead": true,
      "allowAgentCreate": true,
      "allowAgentUpdate": true,
      "allowAgentDelete": true
    }
  },
  "columns": [],
  "views": [],
  "rows": []
}
```

Top-level fields:

| Key | Required | Shape | File-layer meaning |
|---|---:|---|---|
| version | yes | string | Canonical creator value is "agentable-1.0.0". The JSON handler does not reject an arbitrary truthy version string. |
| metadata | yes | { "title": string } | Display title; not a table ID. |
| policy | no | optional permission object | Typed in types.ts, but current handlers/renderers do not enforce it. It is not a security boundary. |
| columns | yes | ColumnDef[] | Ordered table-wide column definitions. |
| views | yes for normal saved JSON | ViewDef[] | Saved view definitions. The normalizer can add a default view when absent in a newly loaded/legacy payload. |
| rows | yes | AgentableRow[] | Ordered row objects. |

The exact typed policy.permissions flags are allowAgentRead, allowAgentCreate, allowAgentUpdate, and allowAgentDelete. No top-level id, order, or title field belongs to the current TableData interface. Table identity is the vault path; title is nested under metadata. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts]

### 4.2 Column definition

The general column shape is:

```json
{
  "id": "col_title",
  "name": "Title",
  "type": "text",
  "display": {
    "width": 220,
    "dateFormat": "YYYY/MM/DD"
  },
  "constraints": {
    "options": [
      { "value": "Done", "color": "green" }
    ],
    "multiSelect": false,
    "suggestAllFiles": false,
    "wrap": true,
    "formula": "{{ col_price }} * {{ col_qty }}",
    "formulaResultKind": "number"
  }
}
```

display and constraints are omitted when they have no values. Their fields are:

- display.width?: number
- display.dateFormat?: string
- constraints.options?: { value: string; color?: string }[]
- constraints.multiSelect?: boolean
- constraints.suggestAllFiles?: boolean
- constraints.wrap?: boolean
- constraints.formula?: string
- constraints.formulaResultKind?: "number" | "date" | "text"

ColumnDef.type is typed as a string rather than a closed runtime enum. The canonical current types are text, number, boolean, select, date, url, link, and the plugin extension formula. Legacy aliases are normalized during migration. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]

### 4.3 View definition

Each saved view has this shape:

```json
{
  "id": "view_default",
  "name": "Default",
  "sorts": [
    {
      "id": "srt_title",
      "columnId": "col_title",
      "direction": "asc"
    }
  ],
  "filters": [
    {
      "id": "flt_status",
      "columnId": "col_status",
      "operator": "is",
      "value": "Done"
    }
  ],
  "hiddenColumns": ["col_internal"],
  "columnOrder": ["col_title", "col_status"]
}
```

ViewDef requires id, name, sorts, filters, hiddenColumns, and columnOrder. IDs use view_, srt_, and flt_ prefixes in the type definitions. The normal default view uses the name Default and empty arrays. New views are appended with names such as View 2; the last remaining view cannot be deleted. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/ViewManager.ts]

### 4.4 Row definition

Rows are:

```json
{
  "id": "row_001",
  "cells": {
    "col_title": "A book",
    "col_done": "false",
    "col_tags": "AI,Research"
  }
}
```

id is an opaque string; the interface does not require a row_ prefix. cells is a record keyed by column ID and can contain values of different JSON types. Missing cells render as empty. Extra cell keys have no matching visible column and should be retained only deliberately. Row order in rows is the stored table order and is changed by row drag/reorder. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts]

## 5. Column Types, Constraints, and Cell Storage

The table below distinguishes the canonical stored type from the UI label. Values are what the current renderer writes or expects, not a recommendation to accept arbitrary values without validation.

| User-facing type | Stored type | Definition fields | Cell representation and caveats |
|---|---|---|---|
| Text | text | constraints.wrap?: boolean | Normally a string; empty is "". |
| Number | number | No type-specific constraint | Valid edits are JSON numbers; empty edits may become null; invalid text can remain a string. File-layer writers should use numbers for valid numeric values. |
| Checkbox | boolean | None | The renderer writes and tests the strings "true" and "false", not JSON booleans. Legacy checkbox migrates to boolean. |
| Select | select | constraints.options | One option value as a string. Options are ordered {value,color?} objects. |
| Multi-select | select plus constraints.multiSelect: true | Same options array plus multiSelect | One comma-separated string, for example "Urgent,Research". There is no escaping for a comma inside an option value. Legacy multiselect and multi-select migrate to this representation. |
| URL | url | None | String. http://, https://, ftp://, and protocol-relative // values render as links; other strings remain text. |
| Email | email | None | String. A simple local@host.tld match renders as mailto:; nonmatching text remains text. |
| Note link | link | constraints.suggestAllFiles?: boolean | Vault path string such as Projects/Alpha.md, not [[Projects/Alpha]]. Legacy notelink and wikilink migrate to link. |
| Date | date | display.dateFormat?: string | Millisecond timestamp serialized as a string by the date picker. |
| Formula | formula | constraints.formula, optional formulaResultKind | Formula source is stored in the column; the row cell may contain the latest computed result as a string/number-like value. Formula cells are not directly editable. |

Sources for renderer storage and migration: [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/CheckboxRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NumberRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/MultiSelectRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DateRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NoteLinkRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/UrlRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/EmailRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]

### 5.1 Select options and colors

Options are stored under the column, not under the row:

```json
"constraints": {
  "options": [
    { "value": "Todo", "color": "default" },
    { "value": "Doing", "color": "blue" },
    { "value": "Done", "color": "green" }
  ]
}
```

The UI color tokens observed in source are default, accent, red, orange, yellow, green, blue, indigo, violet, and pink. The file stores the token string. The plugin does not provide a separate color registry. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts]

### 5.2 Dates and links

The display format is presentation metadata, with supported values including MMMM D, YYYY; MMM D; DD/MM/YYYY; MM/DD/YYYY; and YYYY/MM/DD. It does not change the stored timestamp. Link paths are resolved against the vault by the editor and can trigger broad smart-link maintenance when notes are renamed or deleted. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]

## 6. Formula Persistence and Evaluation

### 6.1 What is persisted

The author-facing expression can use column names, for example:

```
{{ Price }} * {{ Quantity }}
```

FormulaHandler resolves those names and persists the expression with stable column IDs, such as {{ col_price }} * {{ col_quantity }}. This preserves references when a referenced column is renamed. Duplicate names resolve to the first exact match and produce a warning; an unknown name can remain unresolved and fail later. The column also stores formulaResultKind (number, date, or text) when inference succeeds. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]

### 6.2 Render-time computation versus write-through

Formula results are recomputed before rendering. In the ordinary editable DivTableRenderer, recomputeAll updates row.cells[formulaColumnId], updates the inferred result kind, and the table save path can persist those values. A file changed outside Obsidian can therefore contain a stale computed cell until the plugin renders/recomputes it.

Inline and linked-embed renderers mark the table as inline. Their passive recomputation is kept in memory rather than automatically saved to the source table. User edit paths may still save supported inline content, but an AI must not assume that simply opening an embed refreshes persisted formula cells. Formula failures store an empty string internally and display as an em dash (—); the detailed error is not serialized. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts]

### 6.3 Supported grammar

The tokenizer/parser supports:

- Column references in {{ ... }}.
- String and number literals.
- Arithmetic +, -, *, /.
- Comparisons ==, >, and <; only one comparison is allowed in an expression.
- Parentheses.
- Functions if, contains, today, and date.

Arithmetic requires number operands. > and < accept number/date operands. if takes two or three arguments and requires a comparison as its first argument. contains takes two arguments and requires a column reference as its first argument. today() takes no arguments. date() takes a literal value and optional format under the plugin's fixed token rules. Formula columns cannot reference other Formula columns. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/tokenizer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/parser.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts]

contains() performs exact case-insensitive membership for a multi-select value split on commas, but substring matching for other column types. today() uses local midnight. Formula date() accepts fixed YYYY, YY, MM, and DD token layouts; it is not the same format language as display formats with MMMM, MMM, or flexible M/D tokens. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts]

## 7. Rows, Identity, and Derived Link State

Use row.id as the patch key and column.id as the cell key. Row positions change after drag reorder; column names can be edited or duplicated. The plugin's root checks are shallow, so an AI should enforce unique column, view, row, filter, and sort IDs before writing even though only column/view/filter/sort prefixes are typed.

Recommended type-compatible empty values:

- text, URL, email, note-link, select, multi-select: ""
- checkbox: "false"
- number: null or "" for an explicitly empty cell; JSON number for a valid value
- date: "" until a timestamp is assigned
- formula: leave the cell empty or retain the last computed value; do not fabricate a fresh result

These defaults are an AI workflow recommendation based on renderer behavior, not a strict plugin validator. Missing cell keys are rendered as empty. Extra keys without a corresponding column are not visible and can disappear from view exports. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NumberRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/CheckboxRenderer.ts]

For link columns, note rename/delete events scan table files and update exact matching path values across the vault: renames replace matching paths; deletes clear them. This is a plugin side effect an AI should account for when changing note paths. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]

## 8. Views, Filters, Sorts, Search, and Serialization Gaps

### 8.1 Filters

Filter rules are:

```json
{
  "id": "flt_status",
  "columnId": "col_status",
  "operator": "is",
  "value": "Done"
}
```

Supported operators are contains, doesNotContain, startsWith, endsWith, isEmpty, isNotEmpty, gt, lt, is, and isNot. All active rules are combined with logical AND. Text matching is case-insensitive. Number filter values are stored as strings; date filter values are converted to local-midnight millisecond timestamps before storage. Empty-value gt/lt rules can pass every row in the current handler. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts]

gt and lt are offered for date/number columns and formula columns whose cached result kind is date/number. Invalid numeric comparisons fail rather than matching. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts]

### 8.2 Sorts

sorts is an ordered array of {id, columnId, direction} rules and the README describes multi-level sorting. The current SortHandler.getSortedRows() destructures only rules[0], so later rules are ignored by the active comparator. This is a confirmed implementation mismatch: preserve later rules when editing the file, but do not claim they currently affect the displayed order. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]

The first rule sorts type-aware: dates parse timestamps, booleans map to false/true order, numbers and numeric/date formula results compare numerically, and other values compare lower-cased strings after emoji stripping. Empty values sort after non-empty values. A sort disables row dragging in the editable renderer. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts]

### 8.3 Hidden columns, column order, and search

hiddenColumns is active per view and affects rendering and view CSV export. columnOrder is stored in the view shape but current source search finds no renderer that consumes it. Header drag reorders the global data.columns array instead, so actual column order is table-wide in current main.

Search is an ephemeral, case-insensitive substring query over visible columns. It is not serialized in TableData or ViewDef. The current render pipeline applies the first sort, then AND filters, then search. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SearchHandler.ts]

## 9. Feature Surface: Views, Reordering, CSV, Embeds

### 9.1 Multiple views

The plugin supports saved named views. View creation appends a new definition with a unique ID and default empty arrays; rename and delete are persisted, with the last view protected. A view is not a separate file; it is an element of the root views array. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/ViewManager.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/fileUtils.ts]

### 9.2 Drag reorder and resize

Column drag is available in the editable table and persists by mutating the root columns order. Row drag requires enableBetaFeatures, is disabled for inline tables and while sorting is active, and splices the root rows order. Column width is stored as columns[*].display.width; live resizing has a minimum width of 40 pixels. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts]

### 9.3 CSV export

The table export contains all columns and all rows in stored order. The view export contains visible columns after the active first sort, filters, and ephemeral search. Headers are the first CSV row. Fields containing commas, quotes, or line breaks are quoted and embedded quotes are doubled. Formula recomputation happens before export and can persist in the editable view. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/AbstractTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts]

### 9.4 Linked embeds and inline tables

Linked embeds use:

```markdown
![[MyTable.table.md]]
![[MyTable.table.md|Sprint Board]]
```

The alias is a case-insensitive view name. Without an alias, the first view renders. If the named view is absent, the live-preview/embed path can create and save a new view, lock the embed to it, hide view tabs, and show a title header. Decide whether that mutation is intended before writing an alias into a note. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/livePreviewExtension.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/EmbedTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]

Inline tables use a jsontable code block rather than a linked embed. The inline renderer parses the JSON and can write the matching block by its first view ID and a first-column/name hash used to disambiguate duplicate view IDs. Passive inline formula recomputation remains in memory. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/InlineTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]

## 10. Commands, Settings, Installation, and Routing

### 10.1 Commands

Registered command IDs and labels are:

- create-new-table — Create new table; creates a .table.md or .table.json according to tableRenderer.
- import-csv — Import CSV file; creates a new persistent table beside the active file or at the vault root.
- add-table-inline — Add table inline; inserts a jsontable fenced block at the editor cursor.

UI actions additionally cover adding/deleting/renaming rows and columns, view management, hide/show columns, option and formula editing, exports, and drag reorder. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts]

### 10.2 Settings

The default settings are:

```json
{
  "tableRenderer": "default",
  "enableBetaFeatures": false,
  "enableCsvSupport": false,
  "stickyActionColumn": false
}
```

tableRenderer selects the persistent format (default Markdown or json JSON); it is not a second visual renderer in the current 1.5.0 code. enableBetaFeatures enables row drag and row-selection/bulk-action UI. enableCsvSupport enables .csv table routing. stickyActionColumn keeps row actions visible during horizontal scrolling. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/CHANGELOG.md]

### 10.3 Installation context

The manifest is mobile-capable (isDesktopOnly: false). The README still labels Community Plugins as “Coming Soon” and documents manual installation of main.js, manifest.json, and styles.css; manual or BRAT/GitHub installation is therefore the current repository assumption. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/manifest.json] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]

## 11. AI File-Layer Workflows

### 11.1 Create a valid table

1. Choose a unique .table.md or .table.json path.
2. Build a root with version, metadata.title, columns, views, and rows.
3. Give every column and view a unique ID; use row IDs as stable opaque keys.
4. Use a Default view with all five view arrays/fields present.
5. For .table.md, preserve the wrapper and put only the JSON payload inside the first intended json-table fence.
6. Parse the serialized result again before reporting success.

Example payload:

```json
{
  "version": "agentable-1.0.0",
  "metadata": { "title": "Reading List" },
  "columns": [
    { "id": "col_title", "name": "Title", "type": "text", "display": { "width": 220 } },
    { "id": "col_done", "name": "Done", "type": "boolean" },
    {
      "id": "col_tags",
      "name": "Tags",
      "type": "select",
      "constraints": {
        "multiSelect": true,
        "options": [{ "value": "AI", "color": "violet" }]
      }
    }
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
      "id": "row_001",
      "cells": {
        "col_title": "A book",
        "col_done": "false",
        "col_tags": "AI"
      }
    }
  ]
}
```

This deterministic ID scheme is a valid file-layer example, not a claim about the plugin's opaque ID generator. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]

### 11.2 Add or patch rows

Read the whole file first. Resolve the unique payload, map column names to IDs, generate a fresh row ID, and populate only known column IDs. Patch an existing cell using row.id and column.id; never use row index or column name as the persistent key.

Use type-compatible values: JSON numbers for valid number cells, "true"/"false" for checkboxes, timestamp strings for dates, vault path strings for links, and comma-joined option values for multi-select. Preserve unknown top-level properties and unrelated rows. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/CheckboxRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DateRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/MultiSelectRenderer.ts]

Do not manually patch a Formula result as though it were source data. Change the referenced source cell or constraints.formula, then allow the plugin to recompute. If Obsidian will not open the table, either implement the documented formula subset or label the cached result as stale/unknown. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts]

### 11.3 CSV to persistent table

For a durable conversion:

1. Preserve the original CSV as a rollback source.
2. Parse quoted commas and doubled quotes; normalize every row to the header count.
3. Create text columns in header order with col_<base36-index> IDs.
4. Create fresh row IDs and string cells.
5. Add a default view.
6. Write .table.md or .table.json according to the desired persistent format.
7. Re-read and validate.

This mirrors the Import CSV file command. The plugin imports every column as text; perform number/boolean/date/select conversion as a separately reviewed schema pass. Direct .csv editing is not persistent through the table view. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts]

### 11.4 Query rows and emulate a view

1. Parse the root and build column name -> column ID and column ID -> ColumnDef maps.
2. Read rows[*].cells directly.
3. For a saved view, apply all filters as AND rules.
4. Apply only the first sorts rule to match current renderer behavior; report later rules as serialized but ineffective.
5. Use hiddenColumns only when the requested result is the view projection.
6. Do not expect search state in the file; it is ephemeral.
7. Mark formula results as source-stored values with freshness unknown unless recomputed.

Return row IDs with query results so a later patch remains stable. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SearchHandler.ts]

### 11.5 Safe in-place patch

The recommended procedure is:

1. Read and retain the original bytes for diff/rollback.
2. Confirm the extension and, for .table.md, validate the exact frontmatter and unique target fence.
3. Parse the payload and validate root arrays, unique IDs, known cell keys, view existence, and formula references.
4. Apply the smallest object-level patch by stable IDs.
5. Serialize only the payload; preserve Markdown body, comments, frontmatter, and unrelated JSON fields.
6. Update derived table-links only when link cells changed.
7. Write atomically or through an equivalent vault.process-style operation.
8. Re-read the written file and validate the targeted change plus invariants.

The atomicity, backup, and stricter validation requirements are AI safety recommendations inferred from the plugin's read/modify/write handlers; the plugin itself does not expose an external transaction API. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts]

### 11.6 Migrate legacy payloads

The migration layer treats a payload as old when version is absent or the first row is an array. It:

- Converts old row arrays of { column, value } cells into { id, cells } rows.
- Normalizes checkbox -> boolean.
- Normalizes dropdown -> select.
- Normalizes multiselect and multi-select -> select plus multiSelect: true.
- Normalizes notelink and wikilink -> link.
- Moves date format data into display.dateFormat.
- Moves option/style/color data into constraints.options.
- Converts singular view sort/filter fields to sorts/filters.
- Maps equals -> is and notEqual -> isNot.
- Adds missing IDs, arrays, and a default view where needed.

For .table.md, migrate only the JSON inside the fence and preserve the Markdown wrapper. Do not replace the entire file with raw JSON. Retain unknown fields until the transformed file has been validated. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]

### 11.7 Add a view or embed

Append a ViewDef with a unique ID and all required arrays. Before writing ![[Name.table.md|View Name]], check whether the named view exists. The plugin can create and persist a missing alias-named view; writing the embed can therefore mutate the table indirectly. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/EmbedTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/livePreviewExtension.ts]

## Eliminated Alternatives

| Assumption or approach ruled out | Evidence and operational consequence |
|---|---|
| Add a top-level table id or order | Not present in TableData; use the vault path and nested metadata.title. |
| Use raw JSON as the whole .table.md file | The frontmatter marker and json-table fence are part of the Markdown handler contract. |
| Treat checkbox as the current canonical type | Current creator uses boolean; checkbox is a legacy alias. |
| Treat multi-select as a JSON array | Current storage is select plus multiSelect and one comma-separated string. |
| Assume every serialized sort rule is applied | SortHandler currently uses only rules[0]. |
| Assume columnOrder gives active per-view ordering | It is serialized but not consumed; header drag changes global columns. |
| Treat search as saved view state | Search is ephemeral and not serialized. |
| Use direct CSV editing for durable updates | JsonTableView.saveTableData() returns early for .csv; use CSV import/conversion. |
| Assume formula output is always fresh | Results can be cached/stale; inline/embed recomputation is not automatically persisted. |
| Treat a displayed formula em dash as stored data | Errors write an empty string and the renderer displays —. |
| Treat display date formats as formula date() formats | Display supports month-name formats; formula parsing uses fixed YYYY/YY/MM/DD tokens. |
| Rely on policy.permissions for security | The field is typed but not enforced by the plugin. |
| Assume CSV quoted newlines round-trip safely | The parser splits physical lines before parsing fields, so multiline quoted fields are unsafe. |

## Divergence Map

No divergent research pivot was required: all five configured iterations stayed within the requested source-first topic. The important breadth findings are implementation divergences between intended feature language and current source behavior:

- README advertises multi-level sorting; current SortHandler applies only the first serialized rule.
- ViewDef carries columnOrder; current renderer does not consume it and column drag mutates table-wide order.
- The plugin exposes a CSV save handler, but the normal table-view route intentionally does not persist direct .csv edits.
- The Agentable interface includes optional agent permissions, but no current handler or renderer enforces them.
- The Markdown handler supports an empty block and can append a block during save, while read-time parsing still requires the exact frontmatter marker and a matching block.

No completed or failed divergent pivots, Council artifacts, or audited overrides were recorded in the lineage registry. The remaining frontier is upstream version drift, not an unresolved question in the inspected source. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts]

## 12. Open Questions

No material source question remains for the requested current main scope. The unresolved maintenance question is whether upstream changes the schema or fixes the known implementation gaps after the inspected release state. Re-run the source audit against a pinned commit before using this document as a long-lived migration contract.

## 13. Troubleshooting and Edge-Case Catalog

### 13.1 .table.md errors

| Observable symptom | Likely cause | Recovery |
|---|---|---|
| Missing json-table-plugin: true in frontmatter | Missing frontmatter, wrong key, or value not the boolean true | Preserve the file, repair the exact marker, then re-read. |
| Could not find json-table code block start in ... | No matching opening fence | Confirm the file is intended to be a table, then add one deterministic block. |
| Could not extract content from json-table code block in ... | Fence/payload boundaries do not match the handler's extraction pattern | Repair the fence and parse before writing. |
| Invalid embedded JSON: ... | JSON syntax failure or parsed root lacks required arrays | Restore the original, fix JSON, validate root arrays, then retry. |
| Opens with an error and offers raw text | Handler rejected the wrapper or rendering failed | Inspect the original bytes as raw text; do not click-save until the payload is repaired. |

Valid JSON outside the fenced block is not a valid .table.md payload. Multiple blocks make the first matching block authoritative for the handler. An empty block is accepted and produces an empty table/default view. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts]

### 13.2 .table.json errors and shallow validation

- Empty content is treated as a new empty table with a title derived from the file basename.
- Whitespace-only content is nonempty and fails JSON.parse, surfaced as Invalid JSON: <native message>.
- A parsed root missing columns, rows, or views ultimately surfaces as Invalid table JSON: missing columns, rows, or views. after normalization.
- An unknown truthy version is accepted; exact version validation is not enforced.
- Duplicate IDs, invalid cell-key references, malformed option values, and duplicate names are not deeply rejected by the handlers.

The last point is an inference from the source's shallow root checks and ID-based lookups. An AI should validate more strictly before writing. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]

### 13.3 Formula diagnostics

Tokenizer/parser failures include unsupported characters, unterminated {{...}} references, empty references, unterminated strings, unsupported operators such as !=, >=, <=, %, chained comparisons, trailing tokens, and bare column names used where a reference is required. String escaping inside literals is not implemented.

Evaluator failures include:

- Arithmetic applied to text or dates.
- > or < applied to unsupported types.
- Unary minus applied to a non-number.
- Unknown or deleted column reference.
- Formula referencing another formula column.
- Wrong if, contains, today, or date arity.
- if whose first argument is not a comparison.
- contains whose first argument is not a column reference.
- Invalid date format tokens, invalid dates, or mismatched date input.
- Invalid numeric/date source-cell values.
- Division by zero.

On failure, recomputeAll() writes an empty string to the formula cell, records an in-memory error state, and the formula renderer displays —. Inspect the formula source, stable column IDs, source column types, source values, and the plugin console; do not patch the em dash into the file as a literal result. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/tokenizer.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/parser.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts]

### 13.4 CSV errors and lossy edges

The CSV parser handles quoted commas and doubled quotes, trims fields, drops blank physical lines, and accepts jagged rows. It splits the file into physical lines before field parsing, so a quoted field containing a newline is not safely preserved. Unmatched quotes are not necessarily reported as an error. Empty CSV yields zero columns and rows; duplicate or empty headers are accepted; imported cells are text; row IDs are regenerated on each read. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts] [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts]

### 13.5 Silent-data risks

- A multi-select option containing a comma cannot be represented unambiguously by the renderer's storage format.
- Missing row cell keys look empty; extra keys are not visible.
- Duplicate column names make formula authoring first-match-wins.
- Duplicate column IDs can make cell and formula lookup ambiguous.
- Formula results can be stale after external edits.
- Later sort rules and columnOrder can look authoritative in JSON but are not fully honored.
- table-links is derived frontmatter and can become stale if an external writer changes link cells without updating it.
- Smart-link rename/delete hooks can modify many table files beyond the one explicitly edited.

The consequences are direct inferences from the absence of deep validation and the source lookup paths; validate and report them explicitly in AI workflows.

## 14. AI Usage Recipes

### Read/query recipe

Parse the wrapper, normalize legacy types in memory, construct ID maps, read cells by ID, apply the requested saved view's AND filters, apply only the first sort, and return row IDs. Report formula values as cached unless recomputed.

### Add/patch recipe

Snapshot the original file, identify the exact payload, validate IDs, patch only the target row/column object, preserve wrapper/body/unowned fields, write once, re-read, and report a diff plus invariant checks.

### Formula recipe

Change formula source columns or constraints.formula. Do not guess a computed cell. If a result must be generated outside Obsidian, implement only the documented grammar and surface unsupported constructs rather than silently producing a value.

### CSV recipe

Keep the source CSV, parse quote-aware, reject or normalize multiline/jagged ambiguity, import as text, then perform an explicit type-conversion review.

### Migration recipe

Back up bytes, transform only the JSON payload using the plugin's alias mappings, preserve Markdown wrapper and unrelated fields, add/verify views[0], enforce unique IDs, and re-read after save.

### Embed recipe

Resolve the requested view name before writing an alias. If the name is absent, decide explicitly whether allowing the plugin to create and save that view is acceptable.

## 15. Verification Checklist for a File-Layer Writer

Before write:

- [ ] Correct extension and handler selected.
- [ ] .table.md has exact boolean frontmatter marker and exactly one intended target fence.
- [ ] JSON parses.
- [ ] Root has version, metadata.title, columns, views, and rows.
- [ ] Column, view, filter, sort, and row IDs are unique.
- [ ] Every cell key refers to a known column ID unless intentionally retained as extension data.
- [ ] Every view points at existing column IDs.
- [ ] Formula references resolve to non-formula columns.
- [ ] Date cells use timestamp strings; checkboxes use "true"/"false"; links use vault paths.
- [ ] Multi-select values do not contain unescaped commas.

After write:

- [ ] Re-read the complete file.
- [ ] Re-parse the exact payload.
- [ ] Confirm the requested change and unchanged row/column counts unless intended.
- [ ] Confirm wrapper, frontmatter, body text, and derived table-links are intact.
- [ ] Confirm formula source and view definitions were not accidentally rewritten.
- [ ] Retain a reversible diff or backup.

## 16. Source Register

Primary sources:

- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/README.md]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/CHANGELOG.md]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/manifest.json]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/fileUtils.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/csv.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/CsvFileHandler.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/tokenizer.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/parser.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/SearchHandler.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/CheckboxRenderer.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NumberRenderer.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/MultiSelectRenderer.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DateRenderer.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NoteLinkRenderer.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/UrlRenderer.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/EmailRenderer.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/AbstractTableRenderer.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/ViewManager.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/livePreviewExtension.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/EmbedTableRenderer.ts]
- [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/src/InlineTableRenderer.ts]

Companion artifact: [resource-map.md](resource-map.md).

## 17. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Iteration focus sequence: schema (0.95), views (0.90), features (0.84), workflows (0.72), edge-cases (0.61)
- Convergence threshold: 0.05; convergence was telemetry only because the configured stop policy required all five iterations.
- Questions answered: 5 / 5 in the strategy checklist; all requested research angles are covered in this synthesis.
- Remaining questions: 0 material source questions; upstream version drift remains an external maintenance concern.
- Divergence summary: no divergent pivots, failed pivots, Council artifacts, or audited overrides; implementation caveats are recorded in Eliminated Alternatives and Divergence Map.
- Verification: each iteration passed the official iteration verifier; five delta files and five iteration narratives are present; the lineage reducer reported no state corruption.

The final source boundary is the inspected aztekgold/obsidian-tables repository state. Pin a commit and repeat the source audit before treating this as a permanent migration specification. [SOURCE: https://github.com/aztekgold/obsidian-tables/blob/main/CHANGELOG.md]
