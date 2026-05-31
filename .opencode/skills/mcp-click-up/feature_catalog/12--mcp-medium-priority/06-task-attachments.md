---
title: "clickup_manage_task_attachments"
description: "Upload or list task attachments via MCP."
---

# clickup_manage_task_attachments

---

## 1. OVERVIEW

Upload a file (requires `task_id`, `file_content`) or list existing attachments (requires `task_id`). MCP alternative to `cupt attach`.

---

## 2. CURRENT REALITY

Use when already in an MCP workflow context. For CLI-first workflows, `cupt attach` is simpler.

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

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `12--mcp-medium-priority/06-task-attachments.md`
