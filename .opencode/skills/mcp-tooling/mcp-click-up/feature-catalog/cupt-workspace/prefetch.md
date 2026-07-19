---
title: "Prefetch Cache"
description: "cupt prefetch — eagerly download and cache the current user's task details for offline use."
trigger_phrases:
  - "prefetch cache"
  - "cupt prefetch"
  - "eager cache population"
  - "preload tasks offline"
  - "batch cache before offline use"
version: 1.0.0.3
---

# Prefetch Cache

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Fetches tasks assigned to the configured user — not the whole workspace — and their details proactively, populating the local cache. Supports `-n`/`--limit` to cap how many tasks are prefetched. After prefetch, `cupt show <id> --offline` and `cupt list --offline` work for the cached tasks without network access.

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
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Workspace
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-workspace/prefetch.md`
Related references:
- [task-summary.md](../../feature-catalog/cupt-workspace/task-summary.md) — Task Summary
