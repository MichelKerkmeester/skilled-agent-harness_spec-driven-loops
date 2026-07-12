---
title: "Clear Cache"
description: "cupt config --clear-cache — remove all locally cached task data."
trigger_phrases:
  - "clear cache"
  - "cupt config --clear-cache"
  - "delete local cache"
  - "task cache removal"
  - "force fresh api fetch"
version: 1.0.0.3
---

# Clear Cache

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Deletes the local cache of task details, comments, and list metadata: `~/.cupt/parent_cache.json`, `~/.cupt/tasks_cache.json`, and every file under `~/.cupt/task_cache/`. Forces fresh API fetch on next `cupt list` or `cupt show`.

---

## 2. HOW IT WORKS

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
- Feature file path: `cupt-authentication/clear-cache.md`
Related references:
- [show-config.md](../cupt_authentication/show_config.md) — Show Config
- [auth-status.md](../cupt_authentication/auth_status.md) — Auth Status
