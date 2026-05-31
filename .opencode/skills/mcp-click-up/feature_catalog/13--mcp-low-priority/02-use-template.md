---
title: "clickup_use_task_template"
description: "Create a new task from a saved ClickUp task template."
---

# clickup_use_task_template

---

## 1. OVERVIEW

Creates a task pre-populated with the fields from a saved template. Required: `template_id`, `list_id`. The template must exist in the workspace.

---

## 2. CURRENT REALITY

Templates are created in the ClickUp UI. Template IDs are workspace-specific and must be discovered via the ClickUp web interface.

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
- Feature file path: `13--mcp-low-priority/02-use-template.md`
