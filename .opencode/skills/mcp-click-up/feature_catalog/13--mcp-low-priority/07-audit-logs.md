---
title: "clickup_get_audit_logs"
description: "Access workspace audit logs for compliance and security review. Enterprise feature."
---

# clickup_get_audit_logs

---

## 1. OVERVIEW

Returns audit log entries showing workspace activity: user actions, permission changes, and data access events. Enterprise plan required.

---

## 2. CURRENT REALITY

Used for compliance reporting and security investigation. Logs cover the last 90 days (or plan-specific retention). Requires admin token.

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

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `13--mcp-low-priority/07-audit-logs.md`
