---
title: "Logout"
description: "cupt logout — revoke stored credentials and clear the local cache."
trigger_phrases:
  - "logout"
  - "cupt logout"
  - "revoke credentials"
  - "remove stored token"
  - "sign out clickup"
version: 1.0.0.3
---

# Logout

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Removes the stored token and all cached task data. Does not revoke the token server-side — only removes local storage.

---

## 2. HOW IT WORKS

After logout, any cupt command requiring API access returns AuthError until `cupt auth` is run again.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/auth.py` | CLI | Credential removal |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual-testing-playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Authentication
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `cupt-authentication/logout.md`
Related references:
- [auth-status.md](../../feature-catalog/cupt-authentication/auth-status.md) — Auth Status
