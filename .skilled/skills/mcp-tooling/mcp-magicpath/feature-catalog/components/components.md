---
title: "Components"
description: "Search and inspect MagicPath components: name search across personal and team projects, source/dependencies/imports inspection without installing, and cursor-paginated project contents. All read-only."
trigger_phrases:
  - "magicpath components"
  - "magicpath search components"
  - "magicpath inspect component"
  - "magicpath list components"
version: 1.0.0.0
---

# Components (search_components / inspect_component / list_components)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries component lookup. `search_components` searches component names across every accessible project, personal and team, and is the first call when looking for a component by name. `inspect_component` reads a component's source, dependencies, and imports without installing anything and without a package manifest, so it is the safe way to read a component and the only way to read one into a non-React project. `list_components` enumerates the components inside one project, cursor-paginated by `after`.

All three tools are READ-ONLY. None writes a file or installs a package.

---

## 2. HOW IT WORKS

`magicpath.search_components({ query, limit?, team? })` takes a required `query` (text to match against component names) and optional `limit` (maximum results, default 20) and `team` (restrict to one team, by name or id). Shortlist on the returned metadata, then `magicpath.inspect_component({ generated_name })` reads the source, dependencies, and imports for one generated name (such as `wispy-river-5234`); it writes no files and needs no package manifest. `magicpath.list_components({ project_id, limit?, after? })` lists the components inside one project, with `limit` (default 100) and `after` cursor pagination: pass the previous page's last id as `after`, never a page number. `limit` is declared as a `string` in the registered schema; pass string values. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool-surface.md` | Shared | Component tool arguments, bounds, result shape, and the read funnel |
| `references/credential-setup.md` | Shared | The credential these tools require (except none here is credential-free) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `references/mutation-boundary.md` | Reference | The read-only boundary; `inspect_component` writes no files by design |

---

## 4. SOURCE METADATA

- Group: Components
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `components/components.md`

Per-tool leaves in this domain:
- [search-components.md](search-components.md) - name search across personal and team projects
- [inspect-component.md](inspect-component.md) - source/dependencies/imports without installing (writes no files)
- [list-components.md](list-components.md) - project contents, cursor-paginated by `after`

Related references:
- [session.md](../session/session.md) covers the reachability check that precedes component lookup
- [projects.md](../projects/projects.md) covers the projects whose contents `list_components` enumerates
