---
title: "Show Config"
description: "cupt config --show — display current workspace ID, default list, user ID, and auth method."
trigger_phrases:
  - "show config"
  - "cupt config --show"
  - "display configuration"
  - "auth method display"
  - "check cupt defaults"
version: 1.0.0.3
---

# Show Config

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Prints the current cupt configuration: Workspace ID, Default List ID, User ID, Authenticated state, and Auth Method (Personal API Token vs OAuth). Never prints any part of the token itself, masked or otherwise.

---

## 2. HOW IT WORKS

Human-readable output only. Used to confirm defaults are set correctly before running agent workflows.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/config.py` | CLI | Config display |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Authentication
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `cupt-authentication/show-config.md`
Related references:
- [list-default.md](list-default.md) — List Default
- [clear-cache.md](clear-cache.md) — Clear Cache
