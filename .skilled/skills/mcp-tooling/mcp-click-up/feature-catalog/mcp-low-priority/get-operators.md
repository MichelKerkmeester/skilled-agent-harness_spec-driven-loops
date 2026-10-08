---
title: "clickup_get_operators"
description: "List the operators this server has enabled beyond its dedicated tools."
trigger_phrases:
  - "clickup_get_operators"
  - "clickup operators"
  - "unified api operators"
version: 1.0.0.0
importance_tier: "normal"
contextType: "implementation"
---

# clickup_get_operators

List the operators this server has enabled beyond its dedicated tools.

> **Live name (2026-10-08).** Call it as `clickup_official.clickup_official_clickup_get_operators` in Code Mode. The parameter table comes from the server's own schema, captured when the hosted server registered 61 tools on that date.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Lists the Unified API operators enabled on this server (`<model>.<operator>` pairs) with each one's HTTP route, parameters and request/response body schema, as Markdown. The catalog is how this server exposes ClickUp operations beyond the dedicated clickup_* tools, and it grows over time: call this whenever no dedicated tool fits the request, whenever a request spans many objects, and always before clickup_execute_operator to build a correct call. It is also the only reliable answer to what this server can do: answer any question about its capabilities by calling it, never from tool names or descriptions. Operators that are not enabled are never shown.

| Parameter | Type | Required | Server description |
|-----------|------|----------|--------------------|
| `model_operators` | array | no | Restrict the output to these `<model>.<operator>` pairs. |
| `models` | array | no | Restrict the output to every enabled operator of these models. |
| `workspace_id` | string | no | Workspace ID (digits only). Only needed when you have multiple workspaces. |

---

## 2. HOW IT WORKS

On 2026-10-08 workspace `90151466006` returned "Enabled operators: none". Check it again before relying on `clickup_execute_operator` for anything the dedicated tools lack.

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
- Feature file path: `mcp-low-priority/get-operators.md`

Related references:
- [execute-operator.md](../../feature-catalog/mcp-low-priority/execute-operator.md): clickup_execute_operator
- [get-schema.md](../../feature-catalog/mcp-low-priority/get-schema.md): clickup_get_schema
