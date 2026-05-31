---
title: "Add Tag"
description: "cupt tag add <id> <name> — apply a named tag to the task."
---

# Add Tag

---

## 1. OVERVIEW

Adds a tag to the specified task. The tag must already exist in the workspace — cupt does not create new tags.

---

## 2. CURRENT REALITY

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
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Tag Management
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `07--cupt-tag-management/01-add-tag.md`
