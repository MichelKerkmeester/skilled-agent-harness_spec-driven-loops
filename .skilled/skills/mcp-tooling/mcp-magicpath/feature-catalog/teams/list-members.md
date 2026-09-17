---
title: "list_members"
description: "Per-tool leaf for list_members: the members of one MagicPath team; team is required (name or id). Read-only."
trigger_phrases:
  - "magicpath list members tool"
  - "list members magicpath"
  - "magicpath team members"
version: 1.0.0.0
---

# list_members

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Team membership lookup. READ-ONLY. Canonical callable: `magicpath.list_members({ team })` (confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | `team: string` (team name or id) |
| Optional args | none |
| Returns | The members of one team |
| Funnel role | Pairs with [`list_teams`](list-teams.md) to inspect one team's membership |

---

## 2. HOW IT WORKS

`list_members` takes one required `team` (team name or id, the value `list_teams` returns) and returns the members of that team. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | Args, bounds, result shape, and the team-scope role (Section 2) |
| `../../references/credential-setup.md` | The credential this tool requires |

---

## 4. SOURCE METADATA

- Group: Teams
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [teams.md](teams.md)
- Feature file path: `teams/list-members.md`
