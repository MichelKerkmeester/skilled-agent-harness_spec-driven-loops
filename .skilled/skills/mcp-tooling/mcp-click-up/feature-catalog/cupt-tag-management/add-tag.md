---
title: "Add Tag"
description: "cupt tag add <id> <name> — apply a named tag to the task."
trigger_phrases:
  - "add tag"
  - "cupt tag add"
  - "apply tag to task"
  - "tag task"
  - "label task with tag"
version: 1.0.0.3
---

# Add Tag

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds a tag to the specified task. The tag must already exist in the workspace — cupt does not create new tags.

---

## 2. HOW IT WORKS

Used in agent queue management: add tags like `needs_review`, `processed`, or `blocked` to signal state. Tag names are case-sensitive and must match exactly.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tags.py` | CLI | Tag addition via ClickUp API |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Tag Management
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-tag-management/add-tag.md`
Related references:
- [remove-tag.md](../../feature-catalog/cupt-tag-management/remove-tag.md) — Remove Tag
