---
title: "clickup_get_task_dependencies"
description: "Query the dependency graph for a task (read-only)."
trigger_phrases:
  - "get dependencies"
  - "clickup_get_task_dependencies"
  - "read task dependency graph"
  - "depends_on query"
  - "task blocking relationships"
version: 1.0.0.3
---

# clickup_get_task_dependencies

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns all dependency relationships for a task: `depends_on` (tasks this one needs to complete first) and `dependency_of` (tasks this one blocks).

---

## 2. HOW IT WORKS

Read-only. Use to understand task sequencing before modifying dependencies. Results appear in ClickUp's Dependency view.

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

- Group: MCP LOW Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `mcp-low-priority/get-dependencies.md`
Related references:
- [use-template.md](use-template.md) — clickup_use_task_template
