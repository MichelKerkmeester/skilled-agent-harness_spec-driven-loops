---
title: "Create a data source"
description: "Create a new data source schema under a page or database through the confirmed notion_create-a-data-source tool."
trigger_phrases:
  - "Create a data source"
  - "notion_create-a-data-source"
  - "define a new Notion data source schema"
version: 0.1.0.0
---

# Create a data source (`notion_create-a-data-source`)

## 1. OVERVIEW

`notion_create-a-data-source` creates a new data source — a table with its own `properties` schema — under a parent page or an existing database container. It defines the schema only; rows are added afterward with `create-a-page` targeting the new data source's `data_source_id`.

The Code Mode callable form is `notion["notion_create-a-data-source"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set in the Code Mode runtime, and the parent page or database shared with the integration in the Notion UI with insert-content capability granted.

`notion_create-a-data-source` calls `POST /v1/data_sources` under API version `2025-09-03`. Inputs are `parent` (a `page_id` or a `database_id`), `title`, and `properties` (the schema config, keyed by column name). The minimum viable schema is a single `title` property; other columns use the type configs documented in `references/property-types.md` and `references/database-model.md` (select options, relation targets, rollup functions, formula expressions).

There is no `create-a-database` tool in the official 24-tool catalog — this is the only creation path in the domain, and it always produces a data source, never a bare database container. When the parent is a `page_id`, Notion implicitly creates the database container to hold it; when the parent is an existing `database_id`, the new data source joins that container alongside any siblings it already has. Expressions and relation targets are validated on save; an invalid expression or a relation pointing at an unshared data source is rejected, not silently stored.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes database/data-source ops to the Databases and data sources domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and key inputs (§5 Databases / Data Sources). |
| [`../../references/database-model.md`](../../references/database-model.md) | Shared | Documents the schema-config example this tool's `properties` input follows, and the property/relation/rollup shapes. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/data-sources/create-a-data-source.md`](../../manual-testing-playbook/data-sources/create-a-data-source.md) | Manual playbook | Exercises a scratch data-source creation as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern and preflight before any Notion call. |

---

## 4. SOURCE METADATA

- Group: Databases and data sources
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `data-sources/create-a-data-source.md`

Related references:
- [`update-a-data-source.md`](update-a-data-source.md) — edits the schema this tool defines.
- [`retrieve-a-database.md`](retrieve-a-database.md) — confirms the container a `database_id` parent belongs to.
