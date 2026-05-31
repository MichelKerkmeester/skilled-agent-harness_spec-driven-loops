---
title: "clickup_manage_space_tags"
description: "Create or update workspace-level tag definitions in a space."
---

# clickup_manage_space_tags

---

## 1. OVERVIEW

Creates new tags available in a space, or updates existing tag properties (name, foreground color `tag_fg`, background color `tag_bg`). Required: `space_id`, `name`.

---

## 2. CURRENT REALITY

Tags must be created at the space level before they can be applied to tasks. Use hex color codes for `tag_fg` and `tag_bg`.

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
- Feature file path: `12--mcp-medium-priority/13-space-tags.md`
