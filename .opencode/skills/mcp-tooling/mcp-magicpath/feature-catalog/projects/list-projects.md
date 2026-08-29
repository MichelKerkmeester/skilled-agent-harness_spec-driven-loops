---
title: "list_projects"
description: "Per-tool leaf for list_projects: list MagicPath projects across the personal workspace and every team the user belongs to; team and limit optional. Read-only."
trigger_phrases:
  - "magicpath list projects tool"
  - "list projects magicpath"
  - "magicpath projects inventory"
version: 1.0.0.0
---

# list_projects

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Project inventory across the personal workspace and teams. READ-ONLY. Canonical callable: `magicpath.list_projects({ team?, limit? })` (confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | none |
| Optional args | `team: string` (restrict to one team, by name or id); `limit: string` (maximum results) |
| Returns | Projects across the personal workspace and every team the user belongs to |
| Funnel role | Establishes the `project_id` values [`list_components`](../components/list-components.md) enumerates |

---

## 2. HOW IT WORKS

`list_projects` spans the personal workspace and every team the user belongs to. The optional `team` filter accepts a team name or id (the value `list_teams` returns); the optional `limit` is declared as a `string` in the registered schema, so pass string values. Use the returned project ids as the `project_id` for `list_components`. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | Args, bounds, result shape, and the read funnel (Sections 2-3) |
| `../../references/credential-setup.md` | The credential this tool requires |

---

## 4. SOURCE METADATA

- Group: Projects
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [projects.md](projects.md)
- Feature file path: `projects/list-projects.md`
