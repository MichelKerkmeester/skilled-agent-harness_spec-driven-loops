---
title: "Notion Property Types Reference"
description: "The Notion database property-type system for mcp-notion: the ~22 property types with schema config, page-value, and filter/sort shapes, plus the read-only vs writable split."
trigger_phrases:
  - "notion property types"
  - "notion property schema"
  - "notion page property value"
  - "notion rollup relation formula property"
  - "notion filter sort properties"
importance_tier: "important"
contextType: "implementation"
version: 0.1.0.0
---

# Notion Property Types Reference

**Scope:** the property-type system that a Notion data source's schema is built from. This is the row-and-column knowledge layer that makes `mcp-notion` a workflow mode: to create a page, an agent must supply property values in the exact shape the data source's schema demands, and to query a data source it must know which filter conditions each type supports.

**API baseline:** Notion API version `2025-09-03` (the data-sources era). Property behavior is stable across recent versions; markdown round-trip tools pin `2026-03-11` but do not change the property model.

**Verification status (2026-08-21):** the type set, config shapes, and value shapes below were confirmed against the live Notion API reference — `property-object`, `property-schema-object`, and `page-property-values`. Points that could not be pinned to a single confirmed shape are marked `VERIFY` with the endpoint that would confirm them. Do not invent property types or filter operators; confirm a data source's real schema with `retrieve-a-data-source` before composing values.

---

## 1. OVERVIEW

A Notion data source (see `database-model.md`) has a `properties` object: a map of property name to a config whose `type` field is one of the types below. Each property type appears in **three different shapes**, and an agent that conflates them will send malformed requests:

| Shape | Where it appears | What it describes |
|---|---|---|
| **Schema config** | `properties[name]` on `create-a-data-source` / `retrieve-a-data-source` | How the column is defined (options, format, expression, relation target) |
| **Page value** | `properties[name]` on `create-a-page` / `update-page-properties` | The cell value for one row, conforming to the schema |
| **Filter / sort** | `filter` and `sorts` on `query-data-source` | Which conditions the type can be queried and ordered by |

Two facts govern everything else:

1. **Some types are read-only / computed.** `formula`, `rollup`, `created_time`, `created_by`, `last_edited_time`, `last_edited_by`, `unique_id`, and `verification` cannot be set on page creation or update. Attempting to write them fails.
2. **`title` is mandatory and singular.** Every data source has exactly one `title` property; it controls the page title and cannot be removed.

---

## 2. THE PROPERTY TYPE CATALOG

The confirmed set is **22 schema property types** (`property-object`), of which `place` is documented as not fully supported. Two additional value-level entries exist: `verification` (a read-only value type surfaced on wiki pages, not a schema-configurable column) and `button` (a UI-only property with no API representation). See §6 for those two.

| # | Type | What it is | Config? | Writable? |
|---|---|---|---|---|
| 1 | `title` | Page title; exactly one per data source | none | yes |
| 2 | `rich_text` | Free-form formatted text | none | yes |
| 3 | `number` | Numeric value with a display format | `format` | yes |
| 4 | `select` | Single choice from predefined options | `options[]` | yes |
| 5 | `multi_select` | Zero or more choices from options | `options[]` | yes |
| 6 | `status` | Progress state grouped into To-do / In progress / Complete | `options[]` + groups | yes |
| 7 | `date` | A date or date range, time optional | none | yes |
| 8 | `people` | References to Notion users | none | yes |
| 9 | `files` | File attachments / external file links | none | yes |
| 10 | `checkbox` | Boolean | none | yes |
| 11 | `url` | Web URL string | none | yes |
| 12 | `email` | Email-address string | none | yes |
| 13 | `phone_number` | Phone-number string | none | yes |
| 14 | `formula` | Computed value from an expression | `expression` | no (computed) |
| 15 | `relation` | Links to pages in another data source | `data_source_id` + type | yes |
| 16 | `rollup` | Aggregates a related property via a relation | relation + target + `function` | no (computed) |
| 17 | `created_time` | Creation timestamp | none | no (auto) |
| 18 | `created_by` | Creating user | none | no (auto) |
| 19 | `last_edited_time` | Last-edit timestamp | none | no (auto) |
| 20 | `last_edited_by` | Last-editing user | none | no (auto) |
| 21 | `unique_id` | Auto-incrementing ID, optional text prefix | none (UI-managed) | no (auto) |
| 22 | `place` | Geographic location | `VERIFY` | `VERIFY` (documented "not fully supported") |

---

## 3. NO-CONFIG WRITABLE TYPES

These types carry no schema configuration — the schema entry is just `{ "type": "<name>", "<name>": {} }`. What matters is the **page-value shape** used when creating or updating a page.

| Type | Page-value shape | Example |
|---|---|---|
| `title` | array of rich-text objects | `{"title": [{"text": {"content": "Q3 Report"}}]}` |
| `rich_text` | array of rich-text objects | `{"Notes": {"rich_text": [{"text": {"content": "Draft"}}]}}` |
| `date` | `{start, end?}` ISO-8601; `end` optional for ranges | `{"Due": {"date": {"start": "2026-08-21", "end": "2026-08-25"}}}` |
| `people` | array of user references by id | `{"Owner": {"people": [{"id": "<user-uuid>"}]}}` |
| `files` | array of file objects (external URL or uploaded id) | `{"Docs": {"files": [{"name": "spec.pdf", "external": {"url": "https://…"}}]}}` |
| `checkbox` | boolean | `{"Done": {"checkbox": true}}` |
| `url` | string | `{"Link": {"url": "https://example.com"}}` |
| `email` | string | `{"Contact": {"email": "user@example.com"}}` |
| `phone_number` | string | `{"Phone": {"phone_number": "+1-555-0100"}}` |

Notes:
- `title` and `rich_text` share the rich-text array model; the difference is that `title` is the one designated page-title column.
- `files`: an **internal** (Notion-hosted) file requires a prior file upload — `{"file_upload": {"id": "<upload-id>"}}` — which is one of the mode's direct-API gaps (see `api-gap-tools.md`). An **external** file only needs its URL.

---

## 4. CONFIGURED WRITABLE TYPES

These require a config object in the schema, and their page values reference that config.

### `number` — display format

Schema config: `{"number": {"format": "<enum>"}}`. Format is one of `number`, `number_with_commas`, `percent`, or a currency format (`dollar`, `euro`, `pound`, `yen`, `ruble`, `rupee`, `won`, `yuan`, `real`, `lira`, and ~40 more). Page value: a bare number, e.g. `{"Price": {"number": 42}}`. Format is display-only and does not change the stored value.

### `select` / `multi_select` — options

Schema config: `{"select": {"options": [{"name": "High", "color": "red"}]}}`. Colors: `default`, `gray`, `brown`, `orange`, `yellow`, `green`, `blue`, `purple`, `pink`, `red`.

Page values reference an option **by name** (Notion creates the option if it does not exist, when writing to a `select`/`multi_select`):
- `select`: `{"Priority": {"select": {"name": "High"}}}`
- `multi_select`: `{"Tags": {"multi_select": [{"name": "backend"}, {"name": "urgent"}]}}`

On read, the value also carries `id` and `color`.

### `status` — options plus groups

Schema config adds a `group` to each option: `{"status": {"options": [{"name": "In progress", "color": "blue", "group": "In progress"}]}}`. The three groups are `To-do`, `In progress`, and `Complete`; they are always present and are reconfigured through the Notion UI, not typically via the API (`VERIFY` whether `update-a-data-source` accepts group edits, via the `property-schema-object` reference). Page value: `{"State": {"status": {"name": "In progress"}}}`.

### `relation` — link to another data source

Schema config: `{"relation": {"data_source_id": "<uuid>", "type": "single_property"}}` (or `dual_property`). The target data source **must be shared with the integration** or reads/writes of the relation fail. Page value: an array of page references — `{"Projects": {"relation": [{"id": "<page-uuid>"}]}}`. Full single-vs-dual design guidance lives in `database-model.md §5`.

---

## 5. COMPUTED AND READ-ONLY TYPES

None of these can be set on `create-a-page` or `update-page-properties`. They are populated by Notion. On read they carry a typed value.

| Type | Config (schema) | Read value shape |
|---|---|---|
| `formula` | `{"expression": "<formula>"}` | `{"formula": {"type": "number"\|"string"\|"boolean"\|"date", "<type>": …}}` |
| `rollup` | relation + target property + `function` | `{"rollup": {"type": …, "function": "<fn>", "<type>": …}}` |
| `created_time` | none | ISO-8601 string |
| `created_by` | none | user object |
| `last_edited_time` | none | ISO-8601 string |
| `last_edited_by` | none | user object |
| `unique_id` | none (prefix set in UI) | `{"unique_id": {"number": 17, "prefix": "TASK"}}` |
| `verification` | not schema-configurable (wiki feature) | `{"verification": {"state": "verified"\|"unverified"\|"expired", "verified_by": <user>, "date": {…}}}` |

Notes:
- `formula` and `rollup` are configured in the schema but their **values** are always computed — you author the `expression` / aggregation, never the result. Function catalogs and expression syntax are in `database-model.md §6-7`.
- `rollup` read values can be **truncated** for large related sets; the non-truncated read of a single property is a direct-API gap (`GET /v1/pages/{page_id}/properties/{property_id}`, see `api-gap-tools.md`).
- `unique_id` is read from `property-object` but is not created through a normal schema write; the incrementing counter and optional prefix are managed by Notion.

---

## 6. EDGE AND UNSUPPORTED TYPES

Three entries need explicit handling so an agent does not treat them like ordinary columns:

- **`verification`** — a real page-property **value** type (confirmed on `page-property-values`), used by Notion **wiki** verification. It reports `state` (verified / unverified / expired), a `verified_by` user, and an optional `date` range. It is **read-only** and is **not** a schema-configurable column type — it does not appear in the `property-schema-object` create/update type set. Read it; never try to write it or add it to a schema.
- **`place`** — appears in the `property-object` schema type list but is documented as **not fully supported**. Treat its config and value shapes as `VERIFY` (confirm current support against the `property-object` reference before relying on it); do not depend on it in generated schemas.
- **`button`** — a Notion UI property that triggers actions. It has **no API representation**: it is not in `property-schema-object` (cannot be created via the API) and not in `page-property-values` (no readable value). If a workspace column is a button, the API simply will not expose it as a settable/gettable property. `VERIFY` only if a future API version adds it.

The task brief's candidate list included `verification` and `button`; the reconciliation above is the confirmed outcome — `verification` is value-only and read-only, `button` is not in the API, and `place` is the schema-only type the brief omitted.

---

## 7. FILTER AND SORT SUPPORT

`query-data-source` filters by property, and the available operators depend on the property type. Compound filters nest sub-conditions under `and` / `or` arrays. Sorts take `[{"property": "<name>", "direction": "ascending" | "descending"}]` (or `{"timestamp": "created_time"|"last_edited_time", "direction": …}`).

| Type(s) | Filter operators |
|---|---|
| `title`, `rich_text`, `url`, `email`, `phone_number` | `equals`, `does_not_equal`, `contains`, `does_not_contain`, `starts_with`, `ends_with`, `is_empty`, `is_not_empty` |
| `number`, `unique_id` | `equals`, `does_not_equal`, `greater_than`, `less_than`, `greater_than_or_equal_to`, `less_than_or_equal_to`, `is_empty`, `is_not_empty` |
| `select`, `status` | `equals`, `does_not_equal`, `is_empty`, `is_not_empty` |
| `multi_select` | `contains`, `does_not_contain`, `is_empty`, `is_not_empty` |
| `date`, `created_time`, `last_edited_time` | `equals`, `before`, `after`, `on_or_before`, `on_or_after`, `is_empty`, `is_not_empty`, plus relative ranges (`past_week`, `past_month`, `past_year`, `this_week`, `next_week`, `next_month`, `next_year`) |
| `checkbox` | `equals`, `does_not_equal` |
| `people`, `created_by`, `last_edited_by` | `contains`, `does_not_contain`, `is_empty`, `is_not_empty` |
| `files` | `is_empty`, `is_not_empty` |
| `relation` | `contains`, `does_not_contain`, `is_empty`, `is_not_empty` |
| `formula` | filtered by the formula's return type — nest the matching `string`, `number`, `checkbox`, or `date` filter under `formula` |
| `rollup` | filter by the underlying value type, or use `any` / `every` / `none` for `show_original` rollups (`VERIFY` exact wrapper via `query-a-data-source`) |

Sort support: writable and timestamp types sort directly. `formula` and `rollup` sortability follows their computed return type; confirm against `query-a-data-source` for a specific schema.

---

## 8. READ-ONLY VS WRITABLE — QUICK RULE

When building a `create-a-page` or `update-page-properties` payload, include **only** writable types. Strip these eight before sending, or the request is rejected:

`formula`, `rollup`, `created_time`, `created_by`, `last_edited_time`, `last_edited_by`, `unique_id`, `verification`.

Everything else in §3-§4 is writable. When echoing a page you just read back into an update, filter the property map by type first — round-tripping a full read (which contains computed values) is the most common cause of write failures.

---

## 9. RELATED RESOURCES

- `database-model.md` — the database → data source → page hierarchy, relations (single/dual), rollup functions, and Formulas 2.0 syntax and function families.
- `mcp-tools.md` — the official Notion MCP tool catalog (`retrieve-a-data-source`, `create-a-data-source`, `query-data-source`, page CRUD) and Code Mode invocation.
- `api-gap-tools.md` — direct Notion API calls for capabilities the MCP does not cover, including file uploads and non-truncated page-property-item reads.
- Notion API reference: `property-object`, `property-schema-object`, `page-property-values`, `query-a-data-source` on `developers.notion.com`.
