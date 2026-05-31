---
title: "Version Flag"
description: "--version — print the installed cupt version string."
---

# Version Flag

---

## 1. OVERVIEW

Prints the installed cupt version (e.g. `cupt 0.7.1`) to stdout and exits. Used as an installation verification check.

---

## 2. CURRENT REALITY

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
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Global Flags
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `10--cupt-global-flags/04-version-flag.md`
