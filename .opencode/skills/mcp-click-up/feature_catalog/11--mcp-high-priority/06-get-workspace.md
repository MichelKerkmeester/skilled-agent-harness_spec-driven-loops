---
title: "clickup_get_workspace"
description: "Get workspace (team) details including ID, name, members, and plan information."
---

# clickup_get_workspace

---

## 1. OVERVIEW

Returns the workspace object for the configured `CLICKUP_TEAM_ID`. Includes: workspace name, ID, plan type, and member list with user IDs and emails.

---

## 2. CURRENT REALITY

Primary use: discovering user IDs for `assignees` fields, confirming workspace identity, and verifying MCP connection. Use as the MCP equivalent of `cupt status`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `github.com/clickup/clickup-mcp-server` | MCP | Official ClickUp MCP via Code Mode |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `11--mcp-high-priority/06-get-workspace.md`
