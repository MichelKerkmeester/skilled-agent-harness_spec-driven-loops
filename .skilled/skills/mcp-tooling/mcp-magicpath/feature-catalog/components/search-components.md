---
title: "search_components"
description: "Per-tool leaf for search_components: semantic name search across every accessible MagicPath project, personal and team; the first call when looking for a component by name. Read-only."
trigger_phrases:
  - "magicpath search components tool"
  - "search components magicpath"
  - "magicpath find component"
version: 1.0.0.0
---

# search_components

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Component name search across personal and team projects. READ-ONLY. Canonical callable: `magicpath.search_components({ query, limit?, team? })` (confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | `query: string` (text to match against component names) |
| Optional args | `limit: string` (maximum results, default 20); `team: string` (restrict to one team, by name or id) |
| Returns | Component matches across every accessible project, personal and team |
| Funnel role | The first call when looking for a component by name; shortlist feeds [`inspect_component`](inspect-component.md) |

---

## 2. HOW IT WORKS

`search_components` runs a name match across every accessible project, personal and team. Use it first when looking for a component by name, shortlist on the returned metadata, then `inspect_component` for the chosen `generated_name`. `limit` is declared as a `string` in the registered schema, not a number; pass string values. The `team` filter accepts a team name or id, the same value `list_teams` returns. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | Args, bounds, result shape, and the search-before-detail funnel (Sections 2-3) |
| `../../references/credential-setup.md` | The credential this tool requires |

---

## 4. SOURCE METADATA

- Group: Components
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [components.md](components.md)
- Feature file path: `components/search-components.md`
