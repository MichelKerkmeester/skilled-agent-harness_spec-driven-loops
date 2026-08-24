# Iteration 6: Notion Knowledge Layer — Databases, Data Sources, and Property Types

## Focus
Document the Notion knowledge layer the mode must encode: the database → data source → page hierarchy, the 22 property types with their schema configurations, and the page property value model. This is the core domain knowledge analogous to mcp-obsidian's plugin file-layer doctrine.

## Findings

### F6.1 — Database → Data Source → Page hierarchy (API 2025-09-03)

As of API version 2025-09-03, the Notion data model has a three-level hierarchy:

```
Database (container)
  └── Data Source (individual table of data)
        └── Pages (items/rows in the data source)
              └── Page Property Values (must conform to the data source's property schema)
```

**Key change**: Previously, databases could only have one data source, so the concepts were combined. Now a database can have **multiple data sources**, each with its own schema. This is why v2.0.0 of the MCP server migrated from `database_id` to `data_source_id` for query/retrieve/update/create operations.

- `retrieve-a-database` returns database metadata **including the list of data source IDs**
- `retrieve-a-data-source` returns the schema and properties of a specific data source
- `query-data-source` queries a specific data source with filters and sorts
- Wiki data sources can contain either pages or databases as children; all other data sources contain only pages

[SOURCE: https://developers.notion.com/reference/data-source]

### F6.2 — The 22 property types and their schema configurations

Every data source has a `properties` object defining its schema. Each property has a `type` that controls its behavior. The mode must encode all 22 types and their configurations:

**Properties with no additional configuration (10 types):**
- `title` — exactly one per database; controls the page title
- `rich_text` — free-form text
- `date` — date or date range (time optional)
- `people` — references to Notion users
- `files` — file attachments
- `checkbox` — boolean
- `url` — web URL
- `email` — email address
- `phone_number` — phone number
- `unique_id` — auto-incrementing identifier (read from property-object; not configurable via schema)

**Properties with options arrays (3 types):**
- `select` — `options: [{name, color}]` — single choice from predefined options; colors: default, gray, brown, orange, yellow, green, blue, purple, pink, red
- `multi_select` — `options: [{name, color}]` — multiple choices; same color enum
- `status` — `options: [{name, color, group}]` — track progress; group is one of `To-do`, `In progress`, `Complete`; defaults to "Not started"/"In progress"/"Done" in three groups

**Properties with format configuration (1 type):**
- `number` — `format` enum: `number`, `number_with_commas`, `percent`, or 40+ currency formats (dollar, euro, pound, yen, ruble, rupee, won, yuan, real, lira, etc.)

**Computed properties (4 types):**
- `formula` — `expression` string in Notion formula language (e.g., `prop("Price") * 1.1`, `if(prop("In stock"), "yes", "no")`, `dateBetween(prop("Due"), now(), "days")`). Expressions are validated on save; `prop()` references by name but stored by ID (renaming doesn't break formulas)
- `rollup` — aggregates a property from a related database via a relation property. Config: `relation_property_name`/`id` + `rollup_property_name`/`id` + `function` enum: `count_all`, `count_values`, `count_unique_values`, `count_empty`, `count_not_empty`, `percent_empty`, `percent_not_empty`, `sum`, `average`, `median`, `min`, `max`, `range`, `show_original`
- `created_time` — auto-populated creation timestamp; no config
- `last_edited_time` — auto-populated last edit timestamp; no config

**User reference properties (2 types):**
- `created_by` — auto-populated creator user; no config
- `last_edited_by` — auto-populated last editor user; no config

**Relation property (1 type):**
- `relation` — connects databases. Config: `database_id` (target database UUID) + `type` (`single_property` or `dual_property`). Dual property creates a back-reference in the target database.

**Location property (1 type):**
- `place` — geographic location (from property-object reference; likely newer addition)

[SOURCE: https://developers.notion.com/reference/property-schema-object] [SOURCE: https://developers.notion.com/reference/property-object]

### F6.3 — Page property values: the row-level data model

When creating or updating pages in a data source, page property values must conform to the data source's schema. Each property type has a specific value format:

- `title` / `rich_text` — array of text content objects: `[{"text": {"content": "Hello"}}]`
- `number` — numeric value: `42`
- `select` — `{"name": "Option Name"}` (references option by name)
- `multi_select` — `[{"name": "Tag1"}, {"name": "Tag2"}]`
- `status` — `{"name": "In progress"}`
- `date` — `{"start": "2026-08-21", "end": "2026-08-22"}` (end optional)
- `people` — `[{"id": "user-uuid"}]`
- `files` — `[{"name": "doc.pdf", "file_upload": {"id": "upload-id"}}]` (requires file upload first)
- `checkbox` — `true` / `false`
- `url` — `"https://example.com"`
- `email` — `"user@example.com"`
- `phone_number` — `"+1-555-0100"`
- `relation` — `[{"id": "page-uuid"}]` (references pages in the target database)
- `formula`, `rollup`, `created_time`, `created_by`, `last_edited_time`, `last_edited_by` — read-only; cannot be set on page creation

[SOURCE: https://developers.notion.com/reference/page-property-values]

### F6.4 — Knowledge layer encoding: what the mode's reference docs must contain

Based on the property type analysis, the mode's `references/property-types.md` must encode:

1. **The database → data source → page hierarchy** and the `database_id` → `data_source_id` migration
2. **All 22 property types** with their schema configurations (which have options, formats, expressions, relations, rollup functions)
3. **Page property value formats** for each type (how to set values when creating/updating pages)
4. **Read-only vs writable properties** (formula, rollup, created_time, created_by, last_edited_time, last_edited_by are read-only)
5. **The `prop()` formula syntax** and expression validation rules
6. **Relation types** (single_property vs dual_property) and their implications for back-references
7. **Rollup function enumeration** (14 functions) and their use cases
8. **Status groups** (To-do, In progress, Complete) and their immutability (groups are always created; can only be reconfigured via UI)

### F6.5 — MCP tool coverage of the knowledge layer

The official MCP server's data source tools cover the schema-level operations:

| Operation | MCP tool | Coverage |
|---|---|---|
| Retrieve data source schema | `retrieve-a-data-source` | ✅ Returns full `properties` object |
| Query data source with filters | `query-data-source` | ✅ Supports filter/sort by property |
| Create data source with schema | `create-a-data-source` | ✅ Accepts `properties` schema object |
| Update data source properties | `update-a-data-source` | ✅ Can add/modify/remove properties |
| List data source templates | `list-data-source-templates` | ✅ Discover available templates |
| Retrieve database metadata | `retrieve-a-database` | ✅ Returns data source IDs |

The MCP covers the **schema management** surface. What it doesn't cover is the **knowledge** of how to use those schemas — when to use a relation vs a rollup, how to write formula expressions, how status groups work, etc. That knowledge is what the mode's reference docs must encode.

### F6.6 — Filter and sort operations for query-data-source

The `query-data-source` tool supports filtering and sorting by property values. The mode must encode the filter/sort model:

**Filter conditions** vary by property type:
- `title` / `rich_text` — `equals`, `does_not_equal`, `contains`, `does_not_contain`, `starts_with`, `ends_with`, `is_empty`, `is_not_empty`
- `number` — `equals`, `does_not_equal`, `greater_than`, `less_than`, `greater_than_or_equal_to`, `less_than_or_equal_to`
- `select` / `status` — `equals`, `does_not_equal`
- `multi_select` — `contains`, `does_not_contain`, `is_empty`, `is_not_empty`
- `date` — `equals`, `before`, `after`, `on_or_before`, `on_or_after`, `is_empty`, `is_not_empty`, `past_week`, `past_month`, `past_year`, `next_week`, `next_month`, `next_year`
- `checkbox` — `equals`, `does_not_equal`
- `people` / `created_by` / `last_edited_by` — `contains`, `does_not_contain`, `is_empty`, `is_not_empty`
- `relation` — `contains`, `does_not_contain`, `is_empty`, `is_not_empty`

**Compound filters**: `and` / `or` arrays nesting sub-conditions.

**Sort**: `[{property, direction: "ascending" | "descending"}]`

[SOURCE: https://developers.notion.com/reference/query-a-data-source] [SOURCE: https://developers.notion.com/reference/post-search]

## Sources Consulted
- https://developers.notion.com/reference/data-source (database → data source → page hierarchy)
- https://developers.notion.com/reference/property-schema-object (all 22 property type configurations)
- https://developers.notion.com/reference/property-object (property object fields including unique_id, place)
- https://developers.notion.com/reference/page-property-values (page property value formats)
- https://developers.notion.com/reference/query-a-data-source (filter/sort operations)

## Assessment
- **newInfoRatio: 0.65** — The property type catalog was partially enumerated in iteration 2 (F2.6), but now with full schema configurations, page property value formats, filter/sort operations, and the database → data source → page hierarchy, this is significantly expanded detail.
- **Novelty justification**: Full schema configuration details (options, formats, formula expressions, relation types, rollup functions), page property value formats, and filter/sort model are all net-new.
- **Confidence**: High — sourced from official Notion API reference documentation.

## Reflection
- **What worked**: Official property-schema-object and data-source reference pages gave authoritative, complete schema data.
- **What failed**: Nothing significant.
- **Ruled out**: Nothing new.

## Recommended Next Focus
Iteration 7: Advanced knowledge layer — relations, rollups, and formulas in depth. How relation types (single vs dual) affect database design, how rollup functions aggregate related data, how formula expressions reference properties and compute values, and what the mode must encode to help agents design and query Notion databases effectively.
