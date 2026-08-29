---
title: "share_link"
description: "Per-tool leaf for share_link: print a shareable URL for a MagicPath component or project on stdout without opening a browser; identifier is a component generated name or a numeric project id. Read-only."
trigger_phrases:
  - "magicpath share link tool"
  - "share link magicpath"
  - "magicpath shareable url"
version: 1.0.0.0
---

# share_link

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Shareable-URL production. READ-ONLY. Canonical callable: `magicpath.share_link({ identifier })` (confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | `identifier: string` (a component generated name, or a numeric project id) |
| Optional args | none |
| Returns | A shareable URL for the component or project, printed on stdout |
| Behavior | **Opens no browser**; use this when a link has to be presented in conversation |

---

## 2. HOW IT WORKS

`share_link` takes one required `identifier` that is either a component generated name (such as `wispy-river-5234`, the value `search_components` or `inspect_component` returns) or a numeric project id (the value `list_projects` or `active_project` returns). The tool disambiguates and prints a shareable URL on stdout without opening a browser. It does not modify the resource it links to. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | The `identifier` union, bounds, and the share-last funnel role (Sections 2-3) |
| `../../references/mutation-boundary.md` | The read-only boundary; `share_link` opens no browser and modifies nothing |

---

## 4. SOURCE METADATA

- Group: Projects
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [projects.md](projects.md)
- Feature file path: `projects/share-link.md`
