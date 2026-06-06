---
title: "Offline Listing"
description: "cupt list --offline — use local cache, no network call."
trigger_phrases:
  - "offline listing"
  - "cupt list --offline"
  - "cache-backed task listing"
  - "no network task fetch"
  - "offline task query"
---

# Offline Listing

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Returns task data from the local cache without making an API call. Requires prior caching via `cupt list` (auto-caches each run) or `cupt prefetch`.

---

## 2. HOW IT WORKS

Useful in network-restricted environments or for fast repeated reads. Stale cache risk: data may be seconds to hours old depending on last API call.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/config.py` | CLI | Cache-backed task listing |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Task Listing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `02--cupt-task-listing/offline.md`
Related references:
- [json-output.md](json-output.md) — JSON Output
- [stacked-filters.md](stacked-filters.md) — Stacked Filters
