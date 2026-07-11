---
title: "Direct API Token"
description: "cupt config --api-token pk_xxx — set a Personal API Token non-interactively."
trigger_phrases:
  - "direct api token"
  - "cupt config --api-token"
  - "set api token"
  - "personal api token non-interactive"
  - "ci token configuration"
version: 1.0.0.3
---

# Direct API Token

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Sets the Personal API Token directly without the interactive wizard. Token must begin with `pk_`. Preferred for automation and CI where interactive prompts are unavailable.

---

## 2. HOW IT WORKS

Stored as plaintext YAML in `~/.cupt/config.yaml`, protected by owner-only file permissions (mode `0600`) — not encrypted. Overwrites any existing OAuth credentials.

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
- Feature file path: `cupt-authentication/direct-token.md`
Related references:
- [interactive-auth.md](interactive-auth.md) — Interactive Auth
- [workspace-default.md](workspace-default.md) — Workspace Default
