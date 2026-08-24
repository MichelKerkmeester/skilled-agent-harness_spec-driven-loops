---
title: "Retrieve page as Markdown"
description: "Read a Notion page's block content as token-efficient Markdown through the confirmed notion_retrieve-page-markdown MCP tool."
trigger_phrases:
  - "Retrieve page as Markdown"
  - "notion_retrieve-page-markdown"
  - "read a Notion page as Markdown"
version: 0.1.0.0
---

# Retrieve page as Markdown (`notion_retrieve-page-markdown`)

## 1. OVERVIEW

`notion_retrieve-page-markdown` renders a page's block content as Markdown in one call — the most token-efficient way to read a page's body, avoiding a paginated `retrieve-block-children` walk of individual block objects.

Code Mode callable: `notion["notion_retrieve-page-markdown"]`. VERIFY the callable and schema with `list_tools()` / `tool_info("notion.notion_retrieve-page-markdown")` before hardcoding.

---

## 2. HOW IT WORKS

Needs the registered `notion` manual, `NOTION_TOKEN`, and the target page shared with the integration. Runs under `GET /v1/pages/{page_id}/markdown` and **requires API version `2026-03-11`** — the `2025-09-03` pin used by the other 22 tools does not expose this endpoint, and a call pinned to the older version fails with a 400.

Behavior note: this reads block content, not page properties — pair it with `notion_retrieve-a-page` when both the property values and the body are needed. An empty page returns an empty or near-empty Markdown body; that is a valid outcome, never evidence to fabricate content.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | States the markdown round-trip tools' API-version requirement. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, and the `2026-03-11` version pin. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/pages/retrieve-page-markdown.md`](../../manual-testing-playbook/pages/retrieve-page-markdown.md) | Manual playbook | Reads a scratch page's content as Markdown as a read-only scenario. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern used by this scenario. |

---

## 4. SOURCE METADATA

- Group: Pages
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `pages/retrieve-page-markdown.md`

Related references:
- [`update-page-markdown.md`](update-page-markdown.md) — write counterpart of the Markdown round trip.
- [`retrieve-a-page.md`](retrieve-a-page.md) — reads properties/metadata rather than block content.
