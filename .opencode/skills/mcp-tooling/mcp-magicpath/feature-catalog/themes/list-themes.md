---
title: "list_themes"
description: "Per-tool leaf for list_themes: list the MagicPath design systems available to the user, or to one team; team optional. Read-only."
trigger_phrases:
  - "magicpath list themes tool"
  - "list themes magicpath"
  - "magicpath design systems"
version: 1.0.0.0
---

# list_themes

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Design-system inventory. READ-ONLY. Canonical callable: `magicpath.list_themes({ team? })` (confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | none |
| Optional args | `team: string` (restrict to one team, by name or id) |
| Returns | The design systems available to the user, or to one team |
| Funnel role | Establishes the `theme` values [`get_theme`](get-theme.md) fetches |

---

## 2. HOW IT WORKS

`list_themes` returns the design systems available to the user, or to one team when the optional `team` filter (team name or id, the value `list_teams` returns) is supplied. Use the returned theme ids or names as the `theme` argument to `get_theme`. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | Args, bounds, result shape, and the brand-matching role (Sections 2-3) |
| `../../references/credential-setup.md` | The credential this tool requires |

---

## 4. SOURCE METADATA

- Group: Themes
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [themes.md](themes.md)
- Feature file path: `themes/list-themes.md`
