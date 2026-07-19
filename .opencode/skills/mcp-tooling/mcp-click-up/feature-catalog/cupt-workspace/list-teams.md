---
title: "List Teams"
description: "cupt teams — lists user-groups in the workspace (UI: Teams; API: groups)."
trigger_phrases:
  - "list teams"
  - "cupt teams"
  - "list user groups"
  - "workspace teams"
  - "discover team names"
version: 1.0.0.3
---

# List Teams

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns all user-groups in the workspace. ClickUp's UI labels these 'Teams' but the REST API calls them 'groups'. cupt follows the UI terminology.

---

## 2. HOW IT WORKS

Use to discover valid team names before using `cupt list --team <name>`. Team names are case-sensitive and must match exactly in filter commands.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/main.py` | CLI | User-group listing via ClickUp API |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Workspace
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-workspace/list-teams.md`
Related references:
- [task-summary.md](../../feature-catalog/cupt-workspace/task-summary.md) — Task Summary
