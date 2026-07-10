---
title: "clickup_use_task_template"
description: "Create a new task from a saved ClickUp task template."
trigger_phrases:
  - "use task template"
  - "clickup_use_task_template"
  - "create from template"
  - "task template instantiation"
  - "pre-populated task from template"
version: 1.0.0.3
---

# clickup_use_task_template

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Creates a task pre-populated with the fields from a saved template. Required: `template_id`, `list_id`. The template must exist in the workspace.

---

## 2. HOW IT WORKS

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
- Feature file path: `13--mcp-low-priority/use-template.md`
Related references:
- [get-dependencies.md](get-dependencies.md) — clickup_get_task_dependencies
- [manage-chat.md](manage-chat.md) — clickup_manage_chat
