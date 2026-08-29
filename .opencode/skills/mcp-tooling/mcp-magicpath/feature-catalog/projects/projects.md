---
title: "Projects"
description: "MagicPath project inventory, open projects, and shareable URLs: list projects across the personal workspace and every team, read the projects open in the web app, and print a shareable URL without opening a browser. All read-only."
trigger_phrases:
  - "magicpath projects"
  - "magicpath list projects"
  - "magicpath active project"
  - "magicpath share link"
version: 1.0.0.0
---

# Projects (list_projects / active_project / share_link)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries project inventory and sharing. `list_projects` lists projects across the personal workspace and every team the user belongs to. `active_project` reads the projects the user currently has open in the MagicPath web app and is lighter than a `selection` lookup when only the project context is needed. `share_link` prints a shareable URL for a component or project on stdout without opening a browser.

All three tools are READ-ONLY. `share_link` prints a URL; it does not modify the resource it links to.

---

## 2. HOW IT WORKS

`magicpath.list_projects({ team?, limit? })` takes optional `team` (restrict to one team, by name or id) and `limit` (maximum results). `magicpath.active_project({})` takes no arguments and returns the projects open in the web app. `magicpath.share_link({ identifier })` takes one required `identifier` that is either a component generated name or a numeric project id; the tool disambiguates and prints a URL. `limit` is declared as a `string` in the registered schema; pass string values. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool-surface.md` | Shared | Project tool arguments, bounds, the `identifier` union, and the read funnel |
| `references/credential-setup.md` | Shared | The credential these tools require |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `references/mutation-boundary.md` | Reference | The read-only boundary; `share_link` opens no browser and modifies nothing |

---

## 4. SOURCE METADATA

- Group: Projects
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `projects/projects.md`

Per-tool leaves in this domain:
- [list-projects.md](list-projects.md) - project inventory across personal workspace and teams
- [active-project.md](active-project.md) - projects open in the web app (lighter than `selection`)
- [share-link.md](share-link.md) - shareable URL for a component or project (opens no browser)

Related references:
- [components.md](../components/components.md) covers `list_components`, which enumerates a project's contents
- [local-canvas.md](../local-canvas/local-canvas.md) covers `active_project`'s peer, `selection`
