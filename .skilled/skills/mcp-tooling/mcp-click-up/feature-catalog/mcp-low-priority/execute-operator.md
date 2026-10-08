---
title: "clickup_execute_operator"
description: "Run one enabled operator, as the signed-in user."
trigger_phrases:
  - "clickup_execute_operator"
  - "execute operator"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_execute_operator

Run one enabled operator, as the signed-in user.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_execute_operator` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Run one enabled Unified API operator (a `<model>.<operator>` pair) as the authenticated user, in the session workspace. The operator catalog is how this server exposes ClickUp operations beyond the dedicated clickup_* tools, and it grows over time: reach for it when no dedicated tool fits the request or when a request spans many objects (for example several tasks to change, create or read). Call clickup_get_operators first; it lists the enabled operators with each one's parameters and request-body schema, and only enabled operators are callable. Prefer a dedicated clickup_* tool when one covers the whole request in a single call. workspace_id is taken from the session and cannot be overridden. Operators that return full objects (creates and updates included) can produce very large results: pass query with the request to project only the fields you need. Errors carry the upstream status, operationId and response body. Do not retry a call that timed out: the operation may have completed.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `model` | string | yes | Lowercase model name from clickup_get_operators. |
| `operator` | string (`get`, `list`, `create`, `update`, `delete`, `get_many`, `list_children`, `duplicate`, `merge`, `archive`, `unarchive`, `restore`, `search`, `move`, `create_many`, `update_many`, `delete_many`) | yes | Operator from the canonical taxonomy, e.g. `get_many`, `update_many`. Only enabled pairs are accepted. |
| `operation_id` | string | no | Underlying API operationId; only needed when clickup_get_operators lists several for the pair. |
| `parameters` | object | no | Path and query parameters keyed by the names shown by clickup_get_operators (e.g. `list_id`). workspace_id is filled in automatically. |
| `body` | object | no | Request body shaped per the schema shown by clickup_get_operators. |
| `query` | string | no | Optional JMESPath expression applied to the response to return only what you need, e.g. `items[*].{id: id, name: name}`. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

Only operators that `clickup_get_operators` lists can run. None were enabled on 2026-10-08, so goals, webhooks and checklist edits have no route here either.

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
- Feature file path: `mcp-low-priority/execute-operator.md`

Related references:
- [get-operators.md](../../feature-catalog/mcp-low-priority/get-operators.md): clickup_get_operators
