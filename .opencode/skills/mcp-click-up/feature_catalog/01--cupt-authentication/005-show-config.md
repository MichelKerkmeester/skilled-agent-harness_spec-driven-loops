---
title: "Show Config"
description: "cupt config --show — display current workspace, default list, and masked auth state."
trigger_phrases:
  - "show config"
  - "cupt config --show"
  - "display configuration"
  - "masked token display"
  - "check cupt defaults"
---

# Show Config

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Prints the current cupt configuration: workspace ID, default list ID, auth method (token vs OAuth), and masked token (first 6 chars + asterisks).

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
- Feature file path: `01--cupt-authentication/005-show-config.md`
Related references:
- [004-list-default.md](004-list-default.md) — List Default
- [006-clear-cache.md](006-clear-cache.md) — Clear Cache
