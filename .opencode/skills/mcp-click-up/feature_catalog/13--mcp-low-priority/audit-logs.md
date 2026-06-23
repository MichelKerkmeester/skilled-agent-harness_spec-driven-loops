---
title: "clickup_get_audit_logs"
description: "Access workspace audit logs for compliance and security review. Enterprise feature."
trigger_phrases:
  - "audit logs"
  - "clickup_get_audit_logs"
  - "workspace audit trail"
  - "compliance log review"
  - "security event history"
version: 1.0.0.3
---

# clickup_get_audit_logs

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns audit log entries showing workspace activity: user actions, permission changes, and data access events. Enterprise plan required.

---

## 2. HOW IT WORKS

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
- Feature file path: `13--mcp-low-priority/audit-logs.md`
Related references:
- [manage-guests.md](manage-guests.md) — clickup_manage_guests
- [feedback.md](feedback.md) — clickup_provide_feedback
