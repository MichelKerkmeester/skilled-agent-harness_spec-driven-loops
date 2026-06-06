---
title: "Prefetch Cache"
description: "cupt prefetch — eagerly download and cache task details for offline use."
trigger_phrases:
  - "prefetch cache"
  - "cupt prefetch"
  - "eager cache population"
  - "preload tasks offline"
  - "batch cache before offline use"
---

# Prefetch Cache

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Fetches all tasks and their details proactively, populating the local cache. After prefetch, all `cupt show <id> --offline` and `cupt list --offline` calls work without network access.

---

## 2. HOW IT WORKS

Useful before entering a low-connectivity environment or for batch processing where minimizing API calls matters. Prefetch can take 10-30s on large workspaces.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/main.py` | CLI | Eager cache population |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Workspace
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `09--cupt-workspace/prefetch.md`
Related references:
- [task-summary.md](task-summary.md) — Task Summary
