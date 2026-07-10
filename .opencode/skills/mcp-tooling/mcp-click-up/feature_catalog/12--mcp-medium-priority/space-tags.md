---
title: "clickup_manage_space_tags"
description: "Create or update workspace-level tag definitions in a space."
trigger_phrases:
  - "manage space tags"
  - "clickup_manage_space_tags"
  - "create workspace tag"
  - "space-level tag definition"
  - "tag color configuration"
version: 1.0.0.3
importance_tier: "normal"
contextType: "implementation"
---

# clickup_manage_space_tags

Create or update workspace-level tag definitions in a space.

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Creates new tags available in a space, or updates existing tag properties (name, foreground color `tag_fg`, background color `tag_bg`). Required: `space_id`, `name`.

---

## 2. HOW IT WORKS

Tags must be created at the space level before they can be applied to tasks. Use hex color codes for `tag_fg` and `tag_bg`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `clickup_official` | MCP | Official ClickUp MCP via Code Mode, `npx -y @clickup/mcp-server` (stdio), `CLICKUP_API_KEY`+`CLICKUP_TEAM_ID` env vars, registered in `.utcp_config.json` |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: MCP MEDIUM Priority
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `12--mcp-medium-priority/space-tags.md`
Related references:
- [remove-tag.md](remove-tag.md) — clickup_remove_tag_from_task
- [get-views.md](get-views.md) — clickup_get_views
