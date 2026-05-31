---
title: "clickup_manage_task_dependencies"
description: "Set or remove dependencies between tasks."
---

# clickup_manage_task_dependencies

---

## 1. OVERVIEW

Creates or removes dependency relationships. Relationship types: `depends_on` (this task cannot start until the other is complete) and `dependency_of` (this task blocks the other).

---

## 2. CURRENT REALITY

Use for sprint sequencing and blocked-task workflows. Dependencies are visible in ClickUp's dependency view.

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
- Feature file path: `12--mcp-medium-priority/03-task-dependencies.md`
