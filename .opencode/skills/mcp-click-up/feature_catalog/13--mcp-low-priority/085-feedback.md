---
title: "clickup_provide_feedback"
description: "Submit product feedback directly to ClickUp. Rarely used in agent workflows."
trigger_phrases:
  - "provide feedback"
  - "clickup_provide_feedback"
  - "submit product feedback"
  - "send feedback to clickup"
  - "user rating submission"
---

# clickup_provide_feedback

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
| `github.com/clickup/clickup-mcp-server` | MCP | Official ClickUp MCP via Code Mode |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `13--mcp-low-priority/085-feedback.md`
Related references:
- [084-audit-logs.md](084-audit-logs.md) — clickup_get_audit_logs
- [086-create-checklist.md](086-create-checklist.md) — clickup_create_checklist
