---
title: "Auth Status"
description: "cupt status — workspace name, user, and auth health check. Use as agent preflight."
trigger_phrases:
  - "auth status"
  - "cupt status"
  - "check authentication"
  - "credential health check"
  - "agent preflight verification"
version: 1.0.0.3
---

# Auth Status

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Calls the ClickUp API to verify credentials. Prints exactly two lines: the authenticated username and the workspace name — no email address and no workspace ID. Use as the first command in any agent workflow to confirm connectivity.

---

## 2. HOW IT WORKS

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
- Feature file path: `cupt-authentication/auth-status.md`
Related references:
- [clear-cache.md](../cupt_authentication/clear_cache.md) — Clear Cache
- [logout.md](logout.md) — Logout
