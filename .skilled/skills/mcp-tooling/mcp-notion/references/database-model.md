---
title: "Notion Database Model Reference"
description: "The Notion database → data source → page hierarchy for mcp-notion: the 2.0 data-sources migration, single/dual relations, the 14 rollup functions, and Formulas 2.0 syntax and function families."
trigger_phrases:
  - "notion data source hierarchy"
  - "notion database vs data source"
  - "notion relation rollup"
  - "notion formulas 2.0"
  - "notion query data source"
importance_tier: "important"
contextType: "implementation"
version: 0.1.0.0
---

# Notion Database Model Reference

**Scope:** the structural and relational/computed model of a Notion database — how containers, tables, and rows nest; how the API 2.0 data-sources migration reshaped every query; how relations link tables; how rollups aggregate across them; and how Formulas 2.0 compute per-row values. Per-column property shapes live in `property-types.md`; this doc is the layer above them.

**API baseline:** Notion API version `2025-09-03`, the version that introduced data sources as the primary abstraction. The MCP server that operates this model is `@notionhq/notion-mcp-server` (see `mcp-tools.md`); several reads in this doc that the MCP truncates are completed with direct API calls (see `api-gap-tools.md`).

**Verification status (2026-08-21):** the hierarchy, the `database_id` → `data_source_id` migration, the relation config shapes, and the 14-function rollup config enum were confirmed against the live Notion API reference (`data-source`, `property-schema-object`, `property-object`, `retrieve-a-page-property`). Formula function families were confirmed against Notion's formula help plus widely-cited third-party references; the full ~50-function list is summarized by family below and marked `VERIFY` where an exact count matters — confirm against `notion.com/help/formula-syntax`.

---

## 1. OVERVIEW

A Notion "database" is not a single flat table. As of API `2025-09-03` it is a three-level nesting:

```
Database (container)
  └── Data Source (a table with its own property schema)
        └── Page (a row / item in that data source)
              └── Page Property Values (must conform to the data source schema)
```

The consequence for an agent is concrete: **you query and write against a data source, not a database.** A database is a shell that holds one or more data sources; the schema, the rows, the filters, and the sorts all belong to a data source. Get the `data_source_id` first, then operate.

Three capabilities make this model more than a spreadsheet, and they are the heart of the knowledge layer:

- **Relations** link rows in one data source to rows in another (§5).
- **Rollups** aggregate a related data source's values back into a row (§6).
- **Formulas** compute a per-row value from other properties (§7).

---

## 2. THE DATABASE → DATA SOURCE → PAGE HIERARCHY

- **Database** — the container. `retrieve-a-database` returns its metadata **including the list of data source IDs** it holds.
- **Data source** — one table of data with its own `properties` schema. `retrieve-a-data-source` returns that schema; `query-data-source` returns its rows with filters and sorts.
- **Page** — one row. Its `properties` map holds one value per schema column, in the shapes documented in `property-types.md`.

A **wiki** data source can contain either pages or child databases; every other data source contains only pages.

Why the split exists: previously a database held exactly one data source, so the two ideas were merged and everything keyed off `database_id`. A database can now hold **multiple data sources**, each with a distinct schema — so the API had to separate the container from the table.

---

## 3. THE 2.0 DATA-SOURCES MIGRATION

This is the single most important operational fact in the model. Notion API `2025-09-03` (and MCP server v2.0.0) migrated the primary key for schema and row operations from `database_id` to **`data_source_id`**.

| Operation | Old key (pre-migration) | Current key |
|---|---|---|
| Retrieve schema | `database_id` | `data_source_id` |
| Query rows with filters/sorts | `database_id` | `data_source_id` |
| Create a row | parent `database_id` | parent `data_source_id` |
| Retrieve container / discover tables | `database_id` | `database_id` (still returns `data_source_id` list) |

Migration rule for an agent holding only a `database_id`: call `retrieve-a-database` to read its data source IDs, pick the target data source, then use its `data_source_id` for schema, query, and create. Relation configs also moved from `database_id` to `data_source_id` in the property object (§5).

---

## 4. HOW AN AGENT CREATES AND QUERIES A DATA SOURCE

The MCP tools that cover this surface (full catalog in `mcp-tools.md`):

| Goal | MCP tool |
|---|---|
| Discover a database's data sources | `retrieve-a-database` |
| Read a data source's schema | `retrieve-a-data-source` |
| Create a data source with a schema | `create-a-data-source` |
| Add / modify / remove columns | `update-a-data-source` |
| Query rows with filters and sorts | `query-data-source` |
| Create a row | `create-a-page` (parent = data source) |

### Create a data source

Supply a `properties` schema whose keys are column names and whose values are the type configs from `property-types.md`. Minimum viable schema: one `title` property. Example schema fragment:

```json
{
  "Name":     { "title": {} },
  "Priority": { "select": { "options": [{ "name": "High", "color": "red" }] } },
  "Due":      { "date": {} },
  "Done":     { "checkbox": {} }
}
```

### Query a data source

`query-data-source` takes a `filter` and `sorts`. Filters are per-property and their operators depend on the column type (see `property-types.md §7`); compound filters nest under `and` / `or`. Example:

```json
{
  "filter": {
    "and": [
      { "property": "Done", "checkbox": { "equals": false } },
      { "property": "Due",  "date": { "on_or_before": "2026-08-31" } }
    ]
  },
  "sorts": [{ "property": "Due", "direction": "ascending" }]
}
```

Query results paginate (`start_cursor` / `has_more`). Large `relation`, `people`, and `rich_text` values in a returned page may be **truncated**; read a single non-truncated property with the direct-API gap in §8.

---

## 5. RELATIONS — SINGLE VS DUAL

A `relation` property links rows in one data source to rows in another. There are two config types, and the choice shapes both data sources.

### `single_property` (one-way)

Only the source data source has the relation column. The target has **no back-reference**. Use when the link only needs to be traversed one way — e.g. Tasks → Project, where a Project does not need a column listing its Tasks.

### `dual_property` (two-way)

Both data sources get a relation column. Creating a dual relation on the source **automatically creates the back-reference column** in the target, described by `synced_property_id` and `synced_property_name`. Use when both sides must see the link — e.g. Tasks ↔ Project, where the Project shows its Tasks and each Task shows its Project.

### Config and value shapes

Schema config (create/update a data source):

```json
{
  "Project": {
    "type": "relation",
    "relation": { "data_source_id": "<target-uuid>", "type": "single_property" }
  }
}
```

On read (API `2025-09-03`), a dual relation reports its synced back-reference:

```json
{
  "Project": {
    "type": "relation",
    "relation": {
      "data_source_id": "<target-uuid>",
      "dual_property": { "synced_property_name": "Tasks", "synced_property_id": "JU]K" }
    }
  }
}
```

Page value (set the link on a row) — an array of target page ids:

```json
{ "Project": { "relation": [{ "id": "<page-uuid>" }] } }
```

**Hard constraint:** the target data source **must be shared with the integration**. If it is not, reads and writes of the relation property fail. This is the most common relation error.

To add a relation with the MCP: `update-a-data-source` on the source data source, adding a `relation` property whose `data_source_id` points at the (shared) target. Then set values per row with `update-page-properties`.

---

## 6. ROLLUPS — 14 AGGREGATION FUNCTIONS

A `rollup` aggregates a property from a **related** data source, reached through a `relation` column on the same row. A rollup therefore always depends on an existing relation.

Config requires three parts:
- `relation_property_name` or `relation_property_id` — the relation column to traverse.
- `rollup_property_name` or `rollup_property_id` — the property in the related data source to aggregate.
- `function` — one of the 14 config functions below.

### The 14 config functions (`property-schema-object`)

| Function | Aggregates | Output |
|---|---|---|
| `count_all` | every related item | Number |
| `count_values` | non-empty values | Number |
| `count_unique_values` | distinct non-empty values | Number |
| `count_empty` | empty values | Number |
| `count_not_empty` | non-empty values | Number |
| `percent_empty` | share that are empty | Number (%) |
| `percent_not_empty` | share that are non-empty | Number (%) |
| `sum` | numeric total | Number |
| `average` | numeric mean | Number |
| `median` | numeric median | Number |
| `min` | smallest value | Number / Date |
| `max` | largest value | Number / Date |
| `range` | `max − min` | Number |
| `show_original` | no aggregation; passes values through | List |

### Read-side behavior

The rollup **read value** (in a page's properties, and on `retrieve-a-page-property`) uses a wider function vocabulary than the 14 config names — it can surface `checked`, `unchecked`, `percent_checked`, `earliest_date`, `latest_date`, `date_range`, `show_unique`, `unique`, and others depending on the aggregated type. Do not assume the read-value `function` string matches the config enum one-to-one.

Two consequences for reads:
- Some aggregations are **not computed by the property endpoint** and instead return a list of `property_item` objects for client-side computation (notably `show_unique`, `unique`, and `median`). Compute those yourself from the returned list.
- Large rollups can be **truncated** on `retrieve-a-page`; use the non-truncated single-property read in §8.

Selection guidance: `count_all` vs `count_values` (all items vs non-empty), `sum`/`average` for numeric totals, `show_original` when you need the underlying values rather than a statistic. Changing or deleting the underlying relation breaks any rollup that depends on it.

---

## 7. FORMULAS 2.0

A `formula` property computes a per-row value from an `expression` string. Formulas 2.0 is a JavaScript-like expression language — constrained (no arbitrary code, no side effects), but with a rich function set (~50 functions; `VERIFY` exact count against `notion.com/help/formula-syntax`).

### Syntax essentials

- **Property references:** `prop("Property Name")`. Notion stores the reference by **ID**, so renaming a property does not break the formula.
- **Ternary:** `condition ? whenTrue : whenFalse` — shorthand for `if(condition, whenTrue, whenFalse)`.
- **Dot notation (2.0):** `prop("Date").dateStart()` reads the same as `dateStart(prop("Date"))`.
- **Data types:** String, Number, Boolean, Date, List, Person, Page. A formula may return any of them.

### Property type → formula data type

| Property type | Formula type |
|---|---|
| Title, Rich text, Select, Status, URL, Email, Phone | String |
| Number | Number |
| Checkbox | Boolean |
| Date, Created/Last-edited time | Date |
| Multi-select | List (of strings) |
| People, Relation, Files | List |
| Created/Last-edited by | Person |
| Rollup | String / Number / Date (depends on target + function) |
| Formula | any (whatever it returns) |

### Function families

| Family | Functions (representative) |
|---|---|
| **Logical** | `if`, `ifs`, `and`, `or`, `not`, `empty` |
| **Text** | `concat`, `join`, `slice`, `length`, `format`, `contains`, `replace`, `replaceAll`, `style` |
| **Math** | `toNumber`, `sqrt`, `abs`, `round`, `floor`, `ceil`, `min`, `max`, `mod`, `pow` |
| **Date** | `now`, `today`, `timestamp`, `fromTimestamp`, `dateAdd`, `dateSubtract`, `dateBetween`, `formatDate`, `dateStart`, `dateEnd`, `dateRange`, `minute`, `hour`, `day`, `date`, `month`, `year` |
| **Person** | `name`, `email` |
| **List** | `map`, `filter`, `sort`, `unique`, `concat`, `slice`, `length`, `contains`, `join` |

`style()` adds formatting to text output: `style("Overdue", "red", "b")` → bold red. Style flags: `b` bold, `i` italic, `u` underline, `s` strikethrough, `c` code; colors match the option-color palette, with a `_background` suffix for backgrounds.

### Examples

```
prop("Price") * 1.1                                     → Number
if(prop("In stock"), "yes", "no")                       → String
dateBetween(prop("Due"), now(), "days")                 → Number (days remaining)
if(and(now() > prop("Due"), prop("Status") != "Done"),
   style("Overdue", "red", "b"), "")                    → styled String
```

Expressions are validated **on save** — an invalid expression is rejected by `create-a-data-source` / `update-a-data-source`, not silently stored.

---

## 8. CROSS-PROPERTY DEPENDENCIES AND CONSTRAINTS

The computed layer forms a dependency chain, and an agent editing a schema must respect it:

- **Rollups depend on relations.** A rollup names a relation column; delete or retype that relation and the rollup breaks.
- **Formulas can reference rollups, relations, and other formulas.** A formula reading `prop("Total")` where Total is a rollup inherits that rollup's fragility.
- **Read-only on write.** `formula`, `rollup`, `created_time`, `created_by`, `last_edited_time`, `last_edited_by`, `unique_id`, and `verification` cannot be set on `create-a-page` / `update-page-properties`. Strip them from any write payload (see `property-types.md §8`).
- **Relation target must be shared** with the integration, or relation and dependent-rollup reads/writes fail.
- **Truncation gap.** `retrieve-a-page` truncates large `relation`, `people`, `rich_text`, and rollup values. The non-truncated read of one property is a direct-API call — `GET /v1/pages/{page_id}/properties/{property_id}` — which the MCP does not expose. Use the pattern in `api-gap-tools.md`; that endpoint also paginates and is where you compute the non-computed rollup aggregations (§6).

---

## 9. RELATED RESOURCES

- `property-types.md` — the ~22 property types with per-type schema config, page-value, and filter/sort shapes, and the read-only vs writable split.
- `mcp-tools.md` — the official Notion MCP tool catalog and Code Mode invocation for `retrieve-a-database`, `retrieve-a-data-source`, `create-a-data-source`, `update-a-data-source`, `query-data-source`, and page CRUD.
- `api-gap-tools.md` — direct Notion API calls for the capabilities the MCP does not cover, including the non-truncated page-property-item read used in §8.
- Notion API reference: `data-source`, `property-schema-object`, `property-object`, `retrieve-a-page-property`, `query-a-data-source`; formula syntax at `notion.com/help/formula-syntax`.
