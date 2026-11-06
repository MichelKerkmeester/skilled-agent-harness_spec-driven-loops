---
title: "clickup_create_space_tag"
description: "Create a tag in a space so tasks can carry it."
trigger_phrases:
  - "clickup_create_space_tag"
  - "create space tag"
  - "new clickup tag"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_create_space_tag

Create a tag in a space so tasks can carry it.

> **Live name (2026-11-06).** Call it as `clickup_official.clickup_official_clickup_create_space_tag` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 67 tools on that date.

---

## 1. OVERVIEW

Create a tag in a space. Tags belong to a space and every task in it shares them, so add one here before `clickup_add_tag_to_task` can put it on a task.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `space_id` | string | yes | ID of the space to create the tag in. Use clickup_get_workspace_hierarchy to find it, or clickup_get_task (space.id) when you only know a task in that space. |
| `name` | string | yes | Name of the tag. ClickUp stores tag names in lowercase, so matching against existing tags is case-insensitive and the returned tag carries the stored (lowercase) name. |
| `tag_bg` | string | no | Tag color as #RRGGBB (e.g. "#FF5733"). A tag shows one color, so this is also used for tag_fg when tag_fg is omitted. Omit both colors to let ClickUp pick the default. |
| `tag_fg` | string | no | Text color as #RRGGBB. Normally the same as tag_bg; used for tag_bg too when tag_bg is omitted. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

A tag with the same name already in the space is returned unchanged with `created: false`, and a deleted tag with that name comes back with its old colors. Read `created` before telling the user a tag is new.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y mcp-remote https://mcp.clickup.com/mcp` (stdio), OAuth sign-in, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual playbook | No dedicated scenario. Confirm the call with `tool_info()` before first use |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-medium-priority/create-space-tag.md`

Related references:
- [add-tag.md](../../feature-catalog/mcp-medium-priority/add-tag.md): clickup_add_tag_to_task
