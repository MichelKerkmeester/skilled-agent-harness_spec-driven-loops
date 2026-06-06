---
title: "clickup_manage_task_attachments"
description: "Upload or list task attachments via MCP."
trigger_phrases:
  - "task attachments mcp"
  - "clickup_manage_task_attachments"
  - "upload attachment mcp"
  - "list attachments mcp"
  - "file upload via mcp"
---

# clickup_manage_task_attachments

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Upload a file (requires `task_id`, `file_content`) or list existing attachments (requires `task_id`). MCP alternative to `cupt attach`.

---

## 2. HOW IT WORKS

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
- Feature file path: `12--mcp-medium-priority/task-attachments.md`
Related references:
- [multi-list.md](multi-list.md) — clickup_add_task_to_multiple_lists
- [manage-lists.md](manage-lists.md) — clickup_manage_lists
