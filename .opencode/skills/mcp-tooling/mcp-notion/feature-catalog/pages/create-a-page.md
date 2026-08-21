---
title: "Create a page"
description: "Create a new Notion page under a parent page or data source through the confirmed notion_create-a-page MCP tool."
trigger_phrases:
  - "Create a page"
  - "notion_create-a-page"
  - "create a new Notion page"
version: 0.1.0.0
---

# Create a page (`notion_create-a-page`)

## 1. OVERVIEW

`notion_create-a-page` is one of the Notion MCP server's 7 Pages tools (`../../references/mcp-tools.md` §5 Pages). It creates a new page under a parent — either an existing page (`page_id`) or a data source (`data_source_id`), the schema-holding child of a database in Notion API 2.0.0 — optionally seeding it with `properties`, `children` blocks, an `icon`, and a `cover`.

The Code Mode callable form is `notion["notion_create-a-page"]` — bracket access, not dot access, because the tool name contains hyphens (`notion.notion_create-a-page` parses as subtraction and is invalid JavaScript). VERIFY: confirm the exact callable and its input schema with `list_tools()` / `tool_info("notion.notion_create-a-page")` before hardcoding a call — the `notion` manual is source-confirmed only, not yet runtime-registered in this environment.

---

## 2. HOW IT WORKS

The operator needs the `notion` manual registered in `.utcp_config.json`, `NOTION_TOKEN` set to an internal integration token, and the target parent page or data source explicitly shared with that integration in the Notion UI — an unshared parent surfaces as a 404-style `restricted_resource`, not proof the parent is missing.

The call runs under API version `2025-09-03` against `POST /v1/pages`. `parent` accepts either `{ page_id }` or `{ data_source_id }` — never a `database_id` directly, since a database is only the container; the schema and rows live on its data source(s) (see `../../references/database-model.md`). `properties` must match the parent data source's schema when creating a row; a bare page under a parent page needs only a `title` property. `children` seeds initial block content in the same call, avoiding a follow-up `append-block-children` round trip.

If the manual is unregistered, the token is unset, or the parent is unshared, Code Mode surfaces a tool-not-found or 401/404 error — treat that as a setup gap, not as license to fabricate a page ID.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes page-creation requests to the MCP and states the headless backend selection. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, parent shape, and API-version pin. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/pages/create-a-page.md`](../../manual-testing-playbook/pages/create-a-page.md) | Manual playbook | Creates a scratch page and archives it as cleanup. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern used by this scenario. |

---

## 4. SOURCE METADATA

- Group: Pages
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `pages/create-a-page.md`

Related references:
- [`retrieve-a-page.md`](retrieve-a-page.md) — read back a page created by this tool.
- [`archive-a-page.md`](archive-a-page.md) — reversible cleanup counterpart used by playbook scenarios.
