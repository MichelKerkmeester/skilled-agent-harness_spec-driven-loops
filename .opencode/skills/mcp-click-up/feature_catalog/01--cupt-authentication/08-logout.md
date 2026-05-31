---
title: "Logout"
description: "cupt logout — revoke stored credentials and clear the local cache."
---

# Logout

---

## 1. OVERVIEW

Removes the stored token and all cached task data. Does not revoke the token server-side — only removes local storage.

---

## 2. CURRENT REALITY

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
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Authentication
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `01--cupt-authentication/08-logout.md`
