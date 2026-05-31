---
title: "clickup_get_task_dependencies"
description: "Query the dependency graph for a task (read-only)."
---

# clickup_get_task_dependencies

---

## 1. OVERVIEW

Returns all dependency relationships for a task: `depends_on` (tasks this one needs to complete first) and `dependency_of` (tasks this one blocks).

---

## 2. CURRENT REALITY

Read-only. Use to understand task sequencing before modifying dependencies. Results appear in ClickUp's Dependency view.

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
- Feature file path: `13--mcp-low-priority/01-get-dependencies.md`
