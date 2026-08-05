---
title: "Tables File-Layer Data Model"
description: "Complete file-layer contract for the Tables Obsidian plugin: the Agentable 1.0 .table.md envelope, canonical columns, ID-keyed rows, formulas, views, settings, and migration behavior."
trigger_phrases:
  - "tables table md schema"
  - "obsidian tables data model"
  - "agentable table json"
  - "tables column constraints"
  - "tables formula persistence"
  - "tables stable column ids"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
---

# Tables File-Layer Data Model

Tables stores one portable table per `.table.md` file. The file is Markdown with a marked `json-table` payload; edit that payload by stable IDs and let the plugin render it.

---

## 1. OVERVIEW

### Canonical identity

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Obsidian plugin ID | `tables` | Use this ID for the installed plugin directory and enablement state. |
| Display name | **Tables** | This is the current manifest name. |
| Plugin repository | [`aztekgold/obsidian-tables`](https://github.com/aztekgold/obsidian-tables) | This repository owns the Obsidian plugin and its serializers. |
| Schema upstream | [`aztekgold/agentable`](https://github.com/aztekgold/agentable) | Agentable defines the aligned JSON table standard; it is not a replacement Obsidian plugin or a different plugin ID. |

The manifest establishes the plugin identity as `tables` / **Tables**; the repository README supplies the user-facing “Obsidian Tables” wording. Agentable 1.0 is the current data-model root used by this plugin. ([manifest.json](https://github.com/aztekgold/obsidian-tables/blob/main/manifest.json), [plugin README](https://github.com/aztekgold/obsidian-tables), [Agentable](https://github.com/aztekgold/agentable))

### File-layer doctrine

The plugin is a rendering/editor layer over a single vault file. Read the full `.table.md`, parse the one `json-table` payload, patch objects by ID, serialize only that payload, and read it back before declaring the edit valid. Do not drive the plugin UI or replace the Markdown wrapper with raw JSON. ([MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts), [JsonTableView.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/JsonTableView.ts))

### Canonical persistence contract

- The current root version is `agentable-1.0.0`.
- `columns`, `views`, and `rows` are ordered arrays; no top-level table ID or order field exists.
- Structural IDs use `col_`, `view_`, `flt_`, and `srt_` prefixes. Row IDs are opaque strings.
- A row stores values under `cells[column.id]`, never under a column header. Renaming `column.name` therefore leaves row cells and ID-based formulas stable.

These are the source-defined shapes for the plugin repository's `main` branch. ([types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts), [migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts), [FormulaHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts))

---

## 2. `.TABLE.MD` ENVELOPE AND ROOT OBJECT

### Markdown envelope

A valid `.table.md` has the exact boolean frontmatter marker and one fenced JSON payload:

````markdown
---
json-table-plugin: true
table-links: []
---

```json-table
{
  "version": "agentable-1.0.0",
  "metadata": { "title": "Example" },
  "columns": [],
  "views": [],
  "rows": []
}
```
````

`table-links` is derived frontmatter for link-column values, not the row-cell encoding. The serializer rewrites that list and replaces or appends the JSON block while preserving unrelated Markdown body text and frontmatter fields. ([MarkdownFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts))

### Root fields

| Field | Required | Shape | File-layer rule |
| --- | --- | --- | --- |
| `version` | Yes for canonical output | `"agentable-1.0.0"` | Write the current canonical version. |
| `metadata` | Yes | `{ "title": string }` | The table title lives here, not at the root. |
| `policy` | No | `{ "permissions": { ... } }` | Typed Agentable metadata only; current plugin code does not enforce it as a security boundary. |
| `columns` | Yes | `ColumnDef[]` | Global column order is the persisted table order. |
| `views` | Yes | `ViewDef[]` | Keep at least one view. |
| `rows` | Yes | `Row[]` | Row order is the manual order when no active sort overrides presentation. |

An empty JSON payload can initialize to an empty current-version table in the plugin, but file-layer creation should write the full canonical root explicitly. ([types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts), [JsonFileHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/JsonFileHandler.ts), [migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts))

---

## 3. COLUMN DEFINITIONS AND THE TEN USER-FACING KINDS

Every column has this base shape:

```json
{
  "id": "col_unique_stable_id",
  "name": "Visible header",
  "type": "text",
  "display": {},
  "constraints": {}
}
```

`display` and `constraints` are optional when empty. Their recognized fields are below. ([types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts))

### Display and constraint fields

| Path | Shape | Applies to | Meaning |
| --- | --- | --- | --- |
| `display.width` | number | Any column | Persisted display width. |
| `display.dateFormat` | string | Date | Display-only date format; it does not change the stored timestamp. |
| `constraints.wrap` | boolean | Text | Enables wrapping for text cells. |
| `constraints.options` | `{ value, color? }[]` | Select / Multi-select | Ordered allowed values and their color tokens. |
| `constraints.multiSelect` | boolean | Select | Makes the canonical `select` column behave as Multi-select. |
| `constraints.suggestAllFiles` | boolean | Note Link | Controls all-file suggestions in the link editor. |
| `constraints.formula` | string | Formula | Formula source, stored with stable column-ID references. |
| `constraints.formulaResultKind` | `"number" \| "date" \| "text"` | Formula | Cached result kind used by formula sorting/filtering. |

Option colors are persisted as strings; current UI tokens include `default`, `accent`, `red`, `orange`, `yellow`, `green`, `blue`, `indigo`, `violet`, and `pink`. ([types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts), [TableMenuManager.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/TableMenuManager.ts))

### User-facing kinds mapped to canonical storage

| User-facing kind | Canonical `type` | `cells[column.id]` form | Required metadata / constraint |
| --- | --- | --- | --- |
| Text | `text` | string | Optional `constraints.wrap`. |
| Number | `number` | JSON number; the UI may retain `null` when emptied or a nonnumeric fallback string | Use JSON numbers for file-layer numeric values. |
| Checkbox | `boolean` | string `"true"` or `"false"` | `checkbox` is a legacy alias normalized on save. |
| Select | `select` | One option-value string | `constraints.options`. |
| Multi-select | `select` | Comma-separated option values, such as `"Research,Urgent"` | `constraints.multiSelect: true` plus `constraints.options`; do not use commas inside option values. |
| URL | `url` | Trimmed string | No extra schema field. |
| Email | `email` | Trimmed string | No extra schema field. |
| Note Link | `link` | Vault path string, for example `Projects/Atlas.md` | Optional `constraints.suggestAllFiles`; do not store `[[...]]` in the cell. |
| Date | `date` | Millisecond timestamp string | Optional `display.dateFormat`. |
| Formula | `formula` | Last computed string | `constraints.formula` and optional `constraints.formulaResultKind`; cells are read-only in the plugin UI. |

The ten labels are the documented feature surface. Storage has nine canonical type strings because Multi-select is a constrained Select; legacy aliases include `dropdown`, `multiselect`, `multi-select`, `notelink`, `wikilink`, and `function`. ([plugin README](https://github.com/aztekgold/obsidian-tables#multiple-column-types), [migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts), [NumberRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NumberRenderer.ts), [CheckboxRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/CheckboxRenderer.ts), [MultiSelectRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/MultiSelectRenderer.ts), [DateRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DateRenderer.ts), [NoteLinkRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/NoteLinkRenderer.ts))

---

## 4. ROWS, FORMULAS, AND RENAME STABILITY

### Row model

```json
{
  "id": "row_2026_001",
  "cells": {
    "col_task": "Prepare launch notes",
    "col_done": "false"
  }
}
```

Use `row.id` to target a row and `column.id` to target a cell. Array indices and column headers are presentation details that can change through reordering or renaming. A complete agent-written row should include a sensible value for every current column ID; the renderer treats a missing key as empty. ([types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts), [DivTableRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts))

### Formula persistence

Authors enter formulas with display names, such as `{{ Hours }} * {{ Rate }}`. The plugin resolves those names and persists ID-based source, such as `{{ col_hours }} * {{ col_rate }}`, under `constraints.formula`. It also writes the last computed string to each `row.cells[formulaColumnId]` and caches the inferred result kind under `constraints.formulaResultKind`.

Rename only the column's `name`; do not change its `id`. That preserves formula references. A hand-edited legacy name reference can be self-healed during recomputation, but a missing or deleted ID reference becomes a formula error and renders as an em dash. ([FormulaHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts), [FormulaRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/FormulaRenderer.ts))

Formula source supports numbers, strings, `{{ columnRef }}`, parentheses, unary minus, `+ - * /`, one comparison (`==`, `>`, or `<`), and `if`, `contains`, `today`, and `date`. Do not edit a cached formula cell as if it were user input: change source cells or the formula source, then allow a recompute. ([parser.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/parser.ts), [evaluator.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/formula/evaluator.ts))

---

## 5. NAMED VIEWS, FILTERS, SORTS, AND EMBEDS

Each saved view is an object in `views`:

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
  "hiddenColumns": [],
  "columnOrder": []
}
```

Filters are view-scoped and ANDed. Supported operators are `contains`, `doesNotContain`, `startsWith`, `endsWith`, `isEmpty`, `isNotEmpty`, `gt`, `lt`, `is`, and `isNot`. `gt` and `lt` are for numeric/date values and compatible formula result kinds. ([types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts), [FilterHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts))

Embed a table or pin a view from another note:

```markdown
![[Project Tracker.table.md]]
![[Project Tracker.table.md|Open work]]
```

The first form renders the first view. The alias form resolves the view name case-insensitively and, when no match exists, creates and persists a new empty named view. Treat an embed alias as a possible data mutation. ([EmbedTableRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/EmbedTableRenderer.ts), [livePreviewExtension.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/livePreviewExtension.ts))

The current source stores multiple sort rules but executes only `sorts[0]`. It also persists `columnOrder`, while drag-reordering writes the global `columns` array rather than relying on that per-view field. Preserve both fields, but do not rely on later sort rules or `columnOrder` for current rendered behavior. ([SortHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts), [DivTableRenderer.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/renderers/DivTableRenderer.ts))

---

## 6. SETTINGS AND LEGACY CANONICALIZATION

### Current settings object

The plugin settings file has four current fields:

| Field | Default | File-layer meaning |
| --- | --- | --- |
| `tableRenderer` | `"default"` | Chooses `.table.md`; `"json"` chooses `.table.json` for new tables. |
| `enableBetaFeatures` | `false` | Enables beta row reordering and bulk-action UI. |
| `enableCsvSupport` | `false` | Enables direct `.csv` table opening. |
| `stickyActionColumn` | `false` | Keeps row actions visible while horizontally scrolling. |

These settings affect creation or UI behavior, not the canonical row/column schema. ([types.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts), [main.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/main.ts))

### Legacy-to-canonical save behavior

On load/save, the plugin recognizes legacy data when `version` is absent or the first row is an array. It canonicalizes the root version and title, row arrays into `{ id, cells }`, old `typeOptions`, date format placement, singular `sort`/`filter` keys, filter operators `equals`/`notEqual`, and the aliases below:

| Legacy representation | Canonical result |
| --- | --- |
| `checkbox` | `boolean` |
| `dropdown` | `select` |
| `multiselect` / `multi-select` | `select` plus `constraints.multiSelect: true` |
| `notelink` / `wikilink` | `link` |
| `function` | `formula` |

Canonicalization fills missing view arrays and IDs, then persists the updated object on save. Preserve fields outside the schema you are changing instead of using migration as permission to discard data. ([migrateUtils.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts))

---

## 7. COMPLETE COPYABLE `.TABLE.MD` SKELETON

This is a valid Markdown table file with all ten user-facing kinds represented. Replace names, IDs, option values, and row data as one coherent object; retain the wrapper and ID relationships.

````markdown
---
json-table-plugin: true
table-links:
  - "[[Projects/Atlas.md]]"
---

# Project Tracker

```json-table
{
  "version": "agentable-1.0.0",
  "metadata": {
    "title": "Project Tracker"
  },
  "policy": {
    "permissions": {
      "allowAgentRead": true,
      "allowAgentCreate": true,
      "allowAgentUpdate": true,
      "allowAgentDelete": false
    }
  },
  "columns": [
    {
      "id": "col_task",
      "name": "Task",
      "type": "text",
      "display": { "width": 240 },
      "constraints": { "wrap": true }
    },
    {
      "id": "col_hours",
      "name": "Hours",
      "type": "number"
    },
    {
      "id": "col_done",
      "name": "Done",
      "type": "boolean"
    },
    {
      "id": "col_status",
      "name": "Status",
      "type": "select",
      "constraints": {
        "options": [
          { "value": "Not started", "color": "default" },
          { "value": "In progress", "color": "blue" },
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
          { "value": "Research", "color": "violet" },
          { "value": "Urgent", "color": "red" }
        ]
      }
    },
    {
      "id": "col_url",
      "name": "Reference",
      "type": "url"
    },
    {
      "id": "col_email",
      "name": "Owner email",
      "type": "email"
    },
    {
      "id": "col_note",
      "name": "Project note",
      "type": "link",
      "constraints": { "suggestAllFiles": true }
    },
    {
      "id": "col_due",
      "name": "Due",
      "type": "date",
      "display": { "dateFormat": "YYYY/MM/DD" }
    },
    {
      "id": "col_total",
      "name": "Total",
      "type": "formula",
      "constraints": {
        "formula": "{{ col_hours }} * 125",
        "formulaResultKind": "number"
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
    },
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
  ],
  "rows": [
    {
      "id": "row_atlas",
      "cells": {
        "col_task": "Map plugin data model",
        "col_hours": 8,
        "col_done": "false",
        "col_status": "In progress",
        "col_tags": "Research,Urgent",
        "col_url": "https://github.com/aztekgold/obsidian-tables",
        "col_email": "owner@example.com",
        "col_note": "Projects/Atlas.md",
        "col_due": "1767225600000",
        "col_total": "1000"
      }
    }
  ]
}
```
````

### Skeleton annotations

- The `policy` block is optional metadata; omit it when no agent-policy metadata is needed, and do not treat it as authorization enforcement.
- `col_total` demonstrates the two persisted formula parts: the ID-based source in the column and the cached computed string in the row.
- `table-links` mirrors the `col_note` path as a derived `[[...]]` entry. If link cells change, regenerate this frontmatter list consistently.
- The `Open work` view has one sort rule intentionally. A second serialized sort rule is retained by the model but not currently executed by the renderer.

The same ready-to-copy data file is available as [`example.table.md`](../../../assets/plugins/obsidian-tables/example.table.md).

---

## 8. SOURCES AND RELATED REFERENCES

- [Tables manifest](https://github.com/aztekgold/obsidian-tables/blob/main/manifest.json)
- [Tables README](https://github.com/aztekgold/obsidian-tables)
- [Type definitions](https://github.com/aztekgold/obsidian-tables/blob/main/src/types.ts)
- [Markdown serializer](https://github.com/aztekgold/obsidian-tables/blob/main/src/fileHandlers/MarkdownFileHandler.ts)
- [Migration rules](https://github.com/aztekgold/obsidian-tables/blob/main/src/utils/migrateUtils.ts)
- [Formula persistence](https://github.com/aztekgold/obsidian-tables/blob/main/src/FormulaHandler.ts)
- [View/filter/sort behavior](https://github.com/aztekgold/obsidian-tables/blob/main/src/FilterHandler.ts) and [SortHandler.ts](https://github.com/aztekgold/obsidian-tables/blob/main/src/SortHandler.ts)
- [Agentable JSON table standard](https://github.com/aztekgold/agentable)
- [File-layer workflows](workflows.md) and [troubleshooting](troubleshooting.md)
