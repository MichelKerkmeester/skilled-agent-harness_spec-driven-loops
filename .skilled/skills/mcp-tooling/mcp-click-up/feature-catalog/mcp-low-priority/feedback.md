---
title: "clickup_provide_feedback"
description: "Submit product feedback directly to ClickUp. Rarely used in agent workflows."
trigger_phrases:
  - "provide feedback"
  - "clickup_provide_feedback"
  - "submit product feedback"
  - "send feedback to clickup"
  - "user rating submission"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_provide_feedback

Submit product feedback directly to ClickUp. Rarely used in agent workflows.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Sends product feedback to ClickUp's feedback system. Required: `feedback_text`. Optional: `rating`.

---

## 2. HOW IT WORKS

Rarely called in agent workflows. Documented for completeness.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y @clickup/mcp-server` (stdio), `CLICKUP_API_KEY`+`CLICKUP_TEAM_ID` env vars, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `mcp-low-priority/feedback.md`
Related references:
- [audit-logs.md](../../feature-catalog/mcp-low-priority/audit-logs.md) — clickup_get_audit_logs
- [create-checklist.md](../../feature-catalog/mcp-low-priority/create-checklist.md) — clickup_create_checklist
