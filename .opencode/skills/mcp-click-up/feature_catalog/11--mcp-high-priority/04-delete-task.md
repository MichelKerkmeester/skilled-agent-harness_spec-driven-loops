---
title: "clickup_delete_task"
description: "Permanently delete a task. Not reversible."
---

# clickup_delete_task

---

## 1. OVERVIEW

Deletes the specified task permanently from ClickUp. The deletion is immediate and cannot be undone — there is no recycle bin for API deletions.

---

## 2. CURRENT REALITY

Use only on confirmed test or duplicate tasks. Verify task ID before calling. Consider updating status to 'closed' instead if auditability matters.

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
- Feature file path: `11--mcp-high-priority/04-delete-task.md`
