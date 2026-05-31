---
title: "Interactive Auth"
description: "cupt auth — interactive wizard for OAuth or Personal API Token credential setup."
---

# Interactive Auth

---

## 1. OVERVIEW

cupt auth launches an interactive credential wizard supporting two flows: (1) Personal API Token entry — prompts for a `pk_` token from https://app.clickup.com/settings/apps; (2) OAuth — prompts for Client ID and Secret, then handles the localhost:4321 redirect.

---

## 2. CURRENT REALITY

Credentials stored encrypted in `~/.cupt/config.yaml`. Exit 0 on success. AuthError on failure.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `cupt/auth.py` | CLI | OAuth and token management |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `manual_testing_playbook/` | Manual | Per-scenario playbook files for this feature |

---

## 4. SOURCE METADATA

- Group: cupt Authentication
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `01--cupt-authentication/01-interactive-auth.md`
