---
title: "active_project"
description: "Per-tool leaf for active_project: the projects the user currently has open in the MagicPath web app; lighter than a selection lookup when only the project context is needed. Read-only."
trigger_phrases:
  - "magicpath active project tool"
  - "active project magicpath"
  - "magicpath open projects"
version: 1.0.0.0
---

# active_project

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Open-project context from the web app. READ-ONLY. Canonical callable: `magicpath.active_project({})` (confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | none |
| Optional args | none |
| Returns | The projects the user currently has open in the MagicPath web app |
| Funnel role | Lighter than [`selection`](../local-canvas/selection.md) when only the project context is needed |

---

## 2. HOW IT WORKS

`active_project` returns the projects the user currently has open in the MagicPath web app. It is lighter than `selection`, which also returns the canvas selection; when only the project context is needed, prefer `active_project`. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | Args, bounds, result shape, and the local/canvas role (Sections 2-3) |
| `../../references/credential-setup.md` | The credential this tool requires |

---

## 4. SOURCE METADATA

- Group: Projects
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [projects.md](projects.md)
- Feature file path: `projects/active-project.md`
