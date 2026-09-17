---
title: "whoami"
description: "Per-tool leaf for whoami: the currently authenticated MagicPath user; fails when no credential is present. Read-only."
trigger_phrases:
  - "magicpath whoami tool"
  - "magicpath current user"
  - "magicpath signed in user"
version: 1.0.0.0
---

# whoami

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The authenticated-user lookup. READ-ONLY. Canonical callable: `magicpath.whoami({})` (confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | none |
| Optional args | none |
| Returns | The currently authenticated MagicPath user |
| Credential | **Fails when no credential is present** (returns the `NOT_AUTHENTICATED` error shape) |

---

## 2. HOW IT WORKS

`whoami` returns the authenticated user and, unlike `info`, requires a credential. Without one it returns the structured `NOT_AUTHENTICATED` error rather than a user record, so it is a direct credential probe: a successful result confirms a credential is wired; an `NOT_AUTHENTICATED` result confirms it is not. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The session tool contract and the credential split (Section 2) |
| `../../references/credential-setup.md` | The credential, the `.env` wiring, and the `NOT_AUTHENTICATED` failure shape |

---

## 4. SOURCE METADATA

- Group: Session
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [session.md](session.md)
- Feature file path: `session/whoami.md`
