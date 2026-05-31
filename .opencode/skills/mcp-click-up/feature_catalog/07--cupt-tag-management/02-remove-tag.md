---
title: "Remove Tag"
description: "cupt tag remove <id> <name> — remove a named tag from the task."
---

# Remove Tag

---

## 1. OVERVIEW

Removes a tag from the specified task. If the tag is not present, the command exits with an error.

---

## 2. CURRENT REALITY

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
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Tag Management
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `07--cupt-tag-management/02-remove-tag.md`
