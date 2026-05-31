---
title: "Clear Cache"
description: "cupt config --clear-cache — remove all locally cached task data."
---

# Clear Cache

---

## 1. OVERVIEW

Deletes the local cache of task details, comments, and list metadata stored under `~/.cupt/cache/`. Forces fresh API fetch on next `cupt list` or `cupt show`.

---

## 2. CURRENT REALITY

Does not affect credentials — only the data cache is cleared. Use after prolonged offline use or when stale cache causes incorrect display.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/config.py` | CLI | Cache management |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Authentication
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `01--cupt-authentication/06-clear-cache.md`
