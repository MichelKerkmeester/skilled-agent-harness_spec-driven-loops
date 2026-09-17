---
title: "Session"
description: "MagicPath reachability and identity: info answers without credentials and reports auth state, the signed-in user, teams, projects, and the CLI version; whoami returns the authenticated user and fails without a credential. Both read-only."
trigger_phrases:
  - "magicpath info"
  - "magicpath whoami"
  - "magicpath session"
  - "magicpath reachability"
version: 1.0.0.0
---

# Session (info / whoami)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries reachability and identity. `info` is the entry point of any session: it answers without credentials and reports authentication state, the signed-in user, their teams and projects, and the CLI version, so it is the cheapest way to check whether MagicPath is reachable and set up. `whoami` returns the currently authenticated user and fails when no credential is present.

Both tools are READ-ONLY. The credential split is the key fact: `info` works without a credential, `whoami` does not.

---

## 2. HOW IT WORKS

`magicpath.info({})` takes no arguments and returns authentication state, the signed-in user, teams, projects, and the CLI version. Because it answers without credentials, it is the first call of any session and the cheapest reachability check. `magicpath.whoami({})` takes no arguments and returns the authenticated user; without a credential it returns the `NOT_AUTHENTICATED` error shape rather than a user record. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

> **Stale surface warning.** `magicpath-ai info -o json` reports a `cli.commands` list that is stale and under-reports the real surface. Do not infer the tool set from `info`'s `cli.commands`; the registered manual and `magicpath-ai --help` are authoritative.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool-surface.md` | Shared | Session tool arguments, bounds, and the reachability-first role |
| `references/credential-setup.md` | Shared | The credential, the `.env` wiring, and the unauthenticated failure shape |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `references/mutation-boundary.md` | Reference | The read-only boundary these tools sit inside |

---

## 4. SOURCE METADATA

- Group: Session
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `session/session.md`

Per-tool leaves in this domain:
- [info.md](info.md) - reachability and setup check (answers without credentials)
- [whoami.md](whoami.md) - the authenticated user (fails without a credential)

Related references:
- [components.md](../components/components.md) covers the component search that follows a reachability check
- [credential-setup.md](../../references/credential-setup.md) covers the credential both tools depend on
