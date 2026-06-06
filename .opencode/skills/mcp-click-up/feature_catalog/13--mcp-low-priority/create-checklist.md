---
title: "clickup_create_checklist"
description: "Create a named checklist inside a task."
trigger_phrases:
  - "create checklist"
  - "clickup_create_checklist"
  - "add checklist to task"
  - "task checklist creation"
  - "named checklist in task"
---

# clickup_create_checklist

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds a new checklist to the specified task. Required: `task_id`, `name`. Returns `checklist_id` for subsequent item operations.

---

## 2. HOW IT WORKS

A task can have multiple checklists. Items are added separately via `clickup_create_checklist_item`.

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
- Feature file path: `13--mcp-low-priority/create-checklist.md`
Related references:
- [feedback.md](feedback.md) — clickup_provide_feedback
- [update-checklist.md](update-checklist.md) — clickup_update_checklist
