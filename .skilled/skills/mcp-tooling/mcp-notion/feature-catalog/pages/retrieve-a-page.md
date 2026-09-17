---
title: "Retrieve a page"
description: "Read a Notion page's properties and metadata by ID through the confirmed notion_retrieve-a-page MCP tool."
trigger_phrases:
  - "Retrieve a page"
  - "notion_retrieve-a-page"
  - "read a Notion page's properties"
version: 0.1.0.0
---

# Retrieve a page (`notion_retrieve-a-page`)

## 1. OVERVIEW

`notion_retrieve-a-page` is one of the Notion MCP server's 7 Pages tools. It reads a single page's properties and metadata by `page_id`, with an optional `filter_properties` to narrow the response.

Code Mode callable: `notion["notion_retrieve-a-page"]`. VERIFY the exact callable and schema with `list_tools()` / `tool_info("notion.notion_retrieve-a-page")` before hardcoding — the manual is source-confirmed, not runtime-registered.

---

## 2. HOW IT WORKS

Needs the registered `notion` manual, `NOTION_TOKEN`, and the target page shared with the integration. Runs under API `2025-09-03` against `GET /v1/pages/{page_id}`.

Key behavior note: relation, rollup, and people properties truncate past roughly 25 items in the returned payload — a structural read limit, not a bug. Retrieving the full paginated value for a truncated property requires the direct-API page-property-item gap fill documented in `../../references/api-gap-tools.md`, not this tool. An empty or minimal property set on a bare page is a valid outcome, never evidence to fabricate additional properties.

A missing or unshared page returns a 404-style `restricted_resource` — treat it as a sharing gap, not proof the page does not exist.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes structured page reads to the MCP when prerequisites are met. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, and the ~25-item truncation behavior. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/pages/retrieve-a-page.md`](../../manual-testing-playbook/pages/retrieve-a-page.md) | Manual playbook | Reads a scratch page's properties as a read-only scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern used by this scenario. |

---

## 4. SOURCE METADATA

- Group: Pages
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `pages/retrieve-a-page.md`

Related references:
- [`create-a-page.md`](create-a-page.md) — creates the page this tool reads back.
- [`retrieve-page-markdown.md`](retrieve-page-markdown.md) — token-efficient alternative for full page content.
