---
title: "list_components"
description: "Per-tool leaf for list_components: list the components inside one MagicPath project, cursor-paginated by after; limit is a string with default 100. Read-only."
trigger_phrases:
  - "magicpath list components tool"
  - "list components magicpath"
  - "magicpath project components"
version: 1.0.0.0
---

# list_components

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Project contents enumeration. READ-ONLY. Canonical callable: `magicpath.list_components({ project_id, limit?, after? })` (confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | `project_id: string` (the project id) |
| Optional args | `limit: string` (maximum results per page, default 100); `after: string` (fetch components after this id) |
| Returns | The components inside one project |
| Pagination | **Cursor-based**: pass the previous page's last id as `after`, never a page number |

---

## 2. HOW IT WORKS

`list_components` enumerates the components inside one `project_id`. It paginates by cursor, not by page number: take the last id of the current page and pass it as `after` to fetch the next page. `limit` is declared as a `string` in the registered schema (default 100); pass string values. Get the `project_id` from `list_projects` or `active_project`. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | Args, bounds, the cursor-pagination rule, and the read funnel (Sections 2-3) |
| `../../references/credential-setup.md` | The credential this tool requires |

---

## 4. SOURCE METADATA

- Group: Components
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [components.md](components.md)
- Feature file path: `components/list-components.md`
