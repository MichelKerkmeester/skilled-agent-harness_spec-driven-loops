---
title: "Auth Status"
description: "cupt status — workspace name, user, and auth health check. Use as agent preflight."
---

# Auth Status

---

## 1. OVERVIEW

Calls the ClickUp API to verify credentials. Returns: authenticated user email, workspace name, workspace ID. Use as the first command in any agent workflow to confirm connectivity.

---

## 2. CURRENT REALITY

Exit 0 on success, non-zero on 401/network error. Pattern: `cupt status && cupt list --today --json` as preflight.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/main.py` | CLI | Auth verification via ClickUp REST API |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Authentication
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `01--cupt-authentication/07-auth-status.md`
