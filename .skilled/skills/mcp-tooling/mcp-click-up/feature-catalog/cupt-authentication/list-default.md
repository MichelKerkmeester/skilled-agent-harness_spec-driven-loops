---
title: "List Default"
description: "cupt config --default-list <id> — persist a default list ID."
trigger_phrases:
  - "list default"
  - "cupt config --default-list"
  - "set default list"
  - "persist default list id"
  - "sprint list default"
version: 1.0.0.3
---

# List Default

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Saves a ClickUp list ID as the workspace default. Useful when most agent work targets a single sprint or project list.

---

## 2. HOW IT WORKS

Stored in `~/.cupt/config.yaml`. Used by commands that accept a list context when none is provided.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/config.py` | CLI | Persistent config storage |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Authentication
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-authentication/list-default.md`
Related references:
- [workspace-default.md](../../feature-catalog/cupt-authentication/workspace-default.md) — Workspace Default
- [show-config.md](../../feature-catalog/cupt-authentication/show-config.md) — Show Config
