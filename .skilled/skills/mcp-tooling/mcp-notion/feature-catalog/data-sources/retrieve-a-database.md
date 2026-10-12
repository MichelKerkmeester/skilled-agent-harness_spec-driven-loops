---
title: "Retrieve a database"
description: "Read a Notion database container's metadata and data-source IDs through the confirmed notion_retrieve-a-database tool."
trigger_phrases:
  - "Retrieve a database"
  - "notion_retrieve-a-database"
  - "list the data sources inside a Notion database"
version: 0.1.0.0
---

# Retrieve a database (`notion_retrieve-a-database`)

## 1. OVERVIEW

`notion_retrieve-a-database` reads a Notion database **container's** metadata by its `database_id` — title, icon, cover, and (critically) the list of data-source IDs the container holds. It does not return rows: a database is a shell, and every row lives one level down in a data source.

The Code Mode callable form is `notion["notion_retrieve-a-database"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set in the Code Mode runtime, and the target database shared with the integration in the Notion UI.

`notion_retrieve-a-database` calls `GET /v1/databases/{database_id}` under API version `2025-09-03`. The only required input is `database_id`; the response carries container-level metadata plus the `data_source_id` list the database currently holds. This is the entry point of the API 2.0 hierarchy — **database (container) → data source (schema + rows) → page (row)** — and the first call whenever an agent has only a `database_id` and needs a `data_source_id` to query, read a schema, or write rows.

There is no MCP tool to *create* a database container — only its data sources (`create-a-data-source`, §5 of `references/mcp-tools.md`); a scratch database container must already exist and be shared with the integration before this tool can be exercised. A `restricted_resource` or 404-style error usually means the database was never shared with the integration, not that it does not exist; re-share it in the Notion UI and retry rather than assuming it was deleted.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes database/data-source ops to the Databases and data sources domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and key inputs (§5 Databases / Data Sources). |
| [`../../references/database-model.md`](../../references/database-model.md) | Shared | Documents the database → data-source → page hierarchy and the migration rule for holding only a `database_id`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/data-sources/retrieve-a-database.md`](../../manual-testing-playbook/data-sources/retrieve-a-database.md) | Manual playbook | Exercises a scratch-database container read as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern and preflight before any Notion call. |

---

## 4. SOURCE METADATA

- Group: Databases and data sources
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `data-sources/retrieve-a-database.md`

Related references:
- [`retrieve-a-data-source.md`](retrieve-a-data-source.md) — reads the schema of one data-source ID this tool discovers.
- [`create-a-data-source.md`](create-a-data-source.md) — adds a new data source under this container.
