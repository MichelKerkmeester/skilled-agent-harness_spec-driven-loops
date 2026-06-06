---
title: "Offline Mode Flag"
description: "--offline — use local cache on list and show commands."
trigger_phrases:
  - "offline mode flag"
  - "--offline"
  - "cache-backed offline operation"
  - "no api call mode"
  - "offline flag for cupt"
---

# Offline Mode Flag

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Directs `cupt list` and `cupt show` to return data from the local cache without making API calls. Cache is populated by any `cupt list` call or by `cupt prefetch`.

---

## 2. HOW IT WORKS

Stale risk: data may be minutes to hours old. Check cache age with `cupt config --show`. Not available on write commands (done, note, time, tag).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/config.py` | CLI | Cache-backed offline operation |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Global Flags
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `10--cupt-global-flags/offline-flag.md`
Related references:
- [json-flag.md](json-flag.md) — JSON Output Flag
- [debug-flag.md](debug-flag.md) — Debug Logging Flag
