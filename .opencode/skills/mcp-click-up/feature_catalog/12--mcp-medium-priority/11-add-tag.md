---
title: "clickup_add_tag_to_task"
description: "Add a tag to a task via MCP. Equivalent to cupt tag add."
---

# clickup_add_tag_to_task

---

## 1. OVERVIEW

Adds a named tag to the specified task. Required: `task_id`, `tag_name`. The tag must exist in the workspace.

---

## 2. CURRENT REALITY

Functionally equivalent to `cupt tag add`. Use when already in an MCP workflow. cupt is simpler for standalone tag operations.

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
- Feature file path: `12--mcp-medium-priority/11-add-tag.md`
