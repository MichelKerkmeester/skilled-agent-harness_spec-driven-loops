---
title: "Direct API Token"
description: "cupt config --api-token pk_xxx — set a Personal API Token non-interactively."
---

# Direct API Token

---

## 1. OVERVIEW

Sets the Personal API Token directly without the interactive wizard. Token must begin with `pk_`. Preferred for automation and CI where interactive prompts are unavailable.

---

## 2. CURRENT REALITY

Stored encrypted in `~/.cupt/config.yaml`. Overwrites any existing OAuth credentials.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/config.py` | CLI | Persistent config storage |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Authentication
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `01--cupt-authentication/02-direct-token.md`
