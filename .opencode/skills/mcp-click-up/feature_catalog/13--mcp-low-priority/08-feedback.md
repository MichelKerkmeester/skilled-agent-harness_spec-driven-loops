---
title: "clickup_provide_feedback"
description: "Submit product feedback directly to ClickUp. Rarely used in agent workflows."
---

# clickup_provide_feedback

---

## 1. OVERVIEW

Sends product feedback to ClickUp's feedback system. Required: `feedback_text`. Optional: `rating`.

---

## 2. CURRENT REALITY

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
- Feature file path: `13--mcp-low-priority/08-feedback.md`
