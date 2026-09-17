---
title: "list_teams"
description: "Per-tool leaf for list_teams: the teams the current MagicPath user belongs to, with their role in each. Read-only."
trigger_phrases:
  - "magicpath list teams tool"
  - "list teams magicpath"
  - "magicpath teams role"
version: 1.0.0.0
---

# list_teams

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Team inventory with role. READ-ONLY. Canonical callable: `magicpath.list_teams({})` (confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | none |
| Optional args | none |
| Returns | The teams the current user belongs to, with their role in each |
| Funnel role | Establishes the `team` values [`search_components`](../components/search-components.md), [`list_projects`](../projects/list-projects.md), and [`list_themes`](../themes/list-themes.md) accept |

---

## 2. HOW IT WORKS

`list_teams` returns the teams the current user belongs to, with their role in each. The returned team names or ids are the `team` filter values the other tools accept. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

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
- Feature file path: `teams/list-teams.md`
