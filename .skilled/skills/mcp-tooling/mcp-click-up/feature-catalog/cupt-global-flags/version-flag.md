---
title: "Version Flag"
description: "--version — print the installed cupt version string."
trigger_phrases:
  - "version flag"
  - "--version"
  - "cupt version"
  - "check installed version"
  - "installation verification"
version: 1.0.0.3
---

# Version Flag

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Prints the installed cupt version (e.g. `cupt 0.7.1`) to stdout and exits. Used as an installation verification check.

---

## 2. HOW IT WORKS

Always run `cupt --version` as the first step in an install verification sequence. Exit 0 on success. 'command not found' means cupt is not installed or not in PATH.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/main.py` | CLI | Version display |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Global Flags
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-global-flags/version-flag.md`
Related references:
- [debug-flag.md](../../feature-catalog/cupt-global-flags/debug-flag.md) — Debug Logging Flag
