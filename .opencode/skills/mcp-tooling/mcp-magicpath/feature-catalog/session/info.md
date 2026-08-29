---
title: "info"
description: "Per-tool leaf for info: authentication state, the signed-in user, teams, projects, and the CLI version; answers without credentials, so it is the cheapest MagicPath reachability and setup check. Read-only."
trigger_phrases:
  - "magicpath info tool"
  - "magicpath reachability"
  - "magicpath cli version"
version: 1.0.0.0
---

# info

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The session entry point and the cheapest reachability check. READ-ONLY. Canonical callable: `magicpath.info({})` (confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | none |
| Optional args | none |
| Returns | Authentication state, the signed-in user, their teams and projects, and the CLI version |
| Credential | Answers **without** credentials; the one tool that does |

---

## 2. HOW IT WORKS

`info` is the first call of any session. Because it answers without a credential, it confirms MagicPath is reachable and set up before any authenticated call. It also reports the signed-in user, teams, projects, and the CLI version, so it doubles as an identity and inventory probe. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

> **Stale surface warning.** `magicpath-ai info -o json` reports a `cli.commands` list that is stale and under-reports the real surface. Do not infer the tool set from this tool's `cli.commands` field; the registered manual and `magicpath-ai --help` are authoritative.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The reachability-first role and the stale-`cli.commands` warning (Sections 2-4) |
| `../../references/credential-setup.md` | The credential this tool does not require, and the unauthenticated failure shape other tools return |

---

## 4. SOURCE METADATA

- Group: Session
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [session.md](session.md)
- Feature file path: `session/info.md`
