---
title: "clickup_remove_tag_from_task"
description: "Remove a tag from a task via MCP. Equivalent to cupt tag remove."
---

# clickup_remove_tag_from_task

---

## 1. OVERVIEW

Removes a named tag from the specified task. Required: `task_id`, `tag_name`.

---

## 2. CURRENT REALITY

Functionally equivalent to `cupt tag remove`. Use when already in an MCP workflow.

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
- Feature file path: `12--mcp-medium-priority/12-remove-tag.md`
