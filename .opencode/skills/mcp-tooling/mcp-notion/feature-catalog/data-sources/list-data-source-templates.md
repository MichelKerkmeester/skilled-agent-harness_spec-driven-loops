---
title: "List data source templates"
description: "List a data source's page templates through the confirmed notion_list-data-source-templates tool."
trigger_phrases:
  - "List data source templates"
  - "notion_list-data-source-templates"
  - "see the page templates on a Notion data source"
version: 0.1.0.0
---

# List data source templates (`notion_list-data-source-templates`)

## 1. OVERVIEW

`notion_list-data-source-templates` lists the page templates configured on a data source — the pre-filled "New" button options a Notion user sees when adding a row by hand (e.g. "Meeting notes", "Bug report"). It is a low-priority lookup: most agent workflows create rows directly with `create-a-page` rather than instantiating a template.

The Code Mode callable form is `notion["notion_list-data-source-templates"]` — bracket access, since the tool name's hyphen is not a valid JavaScript dot-identifier. Confirm the exact callable and input schema with `list_tools()` / `tool_info()` before hardcoding a call; the manual is not yet runtime-registered in this environment, so the name below is source-confirmed only, not runtime-confirmed.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set in the Code Mode runtime, and the data source shared with the integration in the Notion UI.

`notion_list-data-source-templates` calls `GET /v1/data_sources/{data_source_id}/templates` under API version `2025-09-03`. The only required input is `data_source_id`; the response returns the data source's configured page templates. Most data sources — including any newly created via `create-a-data-source` — have no templates configured, so **an empty result is a valid and common outcome**, never a signal that the call failed or that a template should be fabricated.

A `restricted_resource` or 404-style error usually means the data source was never shared with the integration; re-share it in the Notion UI and retry.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes database/data-source ops to the Databases and data sources domain in the mode's operation table. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, API-version pin, and key inputs (§5 Databases / Data Sources). |
| [`../../references/database-model.md`](../../references/database-model.md) | Shared | Documents the data-source hierarchy this template listing sits under. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/data-sources/list-data-source-templates.md`](../../manual-testing-playbook/data-sources/list-data-source-templates.md) | Manual playbook | Exercises a scratch data-source template listing, including the common empty-result case, as a scratch-safe scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern and preflight before any Notion call. |

---

## 4. SOURCE METADATA

- Group: Databases and data sources
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `data-sources/list-data-source-templates.md`

Related references:
- [`retrieve-a-data-source.md`](retrieve-a-data-source.md) — reads the schema of the same data source this tool lists templates for.
- [`query-data-source.md`](query-data-source.md) — reads rows from the same data source instead of its template configuration.
