---
title: "Debug Logging Flag"
description: "--debug — enable verbose internal logging for troubleshooting."
trigger_phrases:
  - "debug logging flag"
  - "--debug"
  - "enable debug logging"
  - "verbose internal logging"
  - "troubleshoot api errors"
---

# Debug Logging Flag

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Prints internal debug information: API request URLs, response codes, cache hit/miss events, and config reads. Output goes to stderr.

---

## 2. HOW IT WORKS

Use when diagnosing auth failures, slow responses, or unexpected empty results. Do not use in production agent workflows — output is verbose and unstructured.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/main.py` | CLI | Debug logging across all commands |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Global Flags
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `10--cupt-global-flags/debug-flag.md`
Related references:
- [offline-flag.md](offline-flag.md) — Offline Mode Flag
- [version-flag.md](version-flag.md) — Version Flag
