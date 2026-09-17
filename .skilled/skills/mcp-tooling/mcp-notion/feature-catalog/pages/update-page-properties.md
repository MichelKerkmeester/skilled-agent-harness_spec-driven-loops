---
title: "Update page properties"
description: "Patch a Notion page's property values, icon, or cover through the confirmed notion_update-page-properties MCP tool."
trigger_phrases:
  - "Update page properties"
  - "notion_update-page-properties"
  - "patch a Notion page's properties"
version: 0.1.0.0
---

# Update page properties (`notion_update-page-properties`)

## 1. OVERVIEW

`notion_update-page-properties` patches a page's property values, icon, cover, or trash state by `page_id`. It is the general-purpose page-metadata edit tool — distinct from `notion_update-page-markdown`, which edits block content rather than properties.

Code Mode callable: `notion["notion_update-page-properties"]`. VERIFY the callable and schema with `list_tools()` / `tool_info("notion.notion_update-page-properties")` before hardcoding.

---

## 2. HOW IT WORKS

Needs the registered `notion` manual, `NOTION_TOKEN`, and the target page shared with the integration. Runs under API `2025-09-03` against `PATCH /v1/pages/{page_id}`.

Only the properties supplied in the call change — omitted properties are left untouched, so a partial-property patch is safe and does not need to restate the full schema. `properties` values must match the parent data source's property types (see `../../references/property-types.md`). The same endpoint can also flip `archived`/`in_trash`, but `notion_archive-a-page` is the dedicated tool for that lifecycle transition and should be preferred when the intent is purely archive/restore.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes property-update requests to the MCP. |
| [`../../references/mcp-tools.md`](../../references/mcp-tools.md) | Shared | Confirms the tool name, endpoint, and partial-update behavior. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/pages/update-page-properties.md`](../../manual-testing-playbook/pages/update-page-properties.md) | Manual playbook | Creates a scratch page, patches one property, and archives it as cleanup. |
| [`../../examples/README.md`](../../examples/README.md) | Reference | Documents the Code Mode invocation pattern used by this scenario. |

---

## 4. SOURCE METADATA

- Group: Pages
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `pages/update-page-properties.md`

Related references:
- [`create-a-page.md`](create-a-page.md) — creates the scratch page this tool patches.
- [`archive-a-page.md`](archive-a-page.md) — dedicated tool for the archive/restore lifecycle transition.
