---
title: "clickup_delete_task"
description: "Permanently delete a task. Not reversible."
trigger_phrases:
  - "delete task"
  - "clickup_delete_task"
  - "permanently remove task"
  - "irreversible task deletion"
  - "destroy clickup task"
version: 1.0.0.3
---

# clickup_delete_task

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Deletes the specified task permanently from ClickUp. The deletion is immediate and cannot be undone — there is no recycle bin for API deletions.

---

## 2. HOW IT WORKS

Use only on confirmed test or duplicate tasks. Verify task ID before calling. Consider updating status to 'closed' instead if auditability matters.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `https://mcp.clickup.com/mcp` | MCP | Official ClickUp MCP via Code Mode, OAuth, mcp-remote bridge in .utcp_config.json |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP HIGH Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `mcp-high-priority/delete-task.md`
Related references:
- [update-task.md](update-task.md) — clickup_update_task
- [search-tasks.md](search-tasks.md) — clickup_search_tasks
