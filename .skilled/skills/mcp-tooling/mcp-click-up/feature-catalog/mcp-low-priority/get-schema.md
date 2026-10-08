---
title: "clickup_get_schema"
description: "Return the data model behind the enabled operators."
trigger_phrases:
  - "clickup_get_schema"
  - "operator schema"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_schema

Return the data model behind the enabled operators.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_schema` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns the entity-relationship schema (Markdown with a Mermaid ER diagram) for the models behind the enabled Unified API operators. Optional background before a clickup_execute_operator call; not needed for the dedicated clickup_* tools.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `detailed` | boolean | no | Include the long-form description of each entity and relationship instead of the one-line summary. |
| `entities_only` | boolean | no | Return only the entity list, no relationships, no diagram. |
| `names` | array | no | Restrict the output to these entity names (lowercase). Only enabled models are returned. |
| `tier` | string (`primary`, `secondary`, `attribute`) | no | Minimum importance tier to include: `primary` (overview), `secondary`, or `attribute` (everything, the default). |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Optional background before `clickup_execute_operator`. The dedicated tools do not need it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | No dedicated scenario. Confirm the call with `tool_info()` before first use |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-low-priority/get-schema.md`

Related references:
- [get-operators.md](../../feature-catalog/mcp-low-priority/get-operators.md): clickup_get_operators
