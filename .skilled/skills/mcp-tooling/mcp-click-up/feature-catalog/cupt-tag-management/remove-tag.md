---
title: "Remove Tag"
description: "cupt tag remove <id> <name> — remove a named tag from the task."
trigger_phrases:
  - "remove tag"
  - "cupt tag remove"
  - "untag task"
  - "delete tag from task"
  - "strip processing tag"
version: 1.0.0.3
---

# Remove Tag

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Removes a tag from the specified task. If the tag is not present, the command exits with an error.

---

## 2. HOW IT WORKS

Used in agent handoff patterns to clean up processing tags: `cupt tag remove $id ai_ready`. Verify the tag is present with `cupt show $id --json | jq '.tags[].name'` before removing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/tags.py` | CLI | Tag removal via ClickUp API |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Tag Management
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-tag-management/remove-tag.md`
Related references:
- [add-tag.md](../../feature-catalog/cupt-tag-management/add-tag.md) — Add Tag
