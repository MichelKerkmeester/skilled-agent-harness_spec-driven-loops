---
title: "mcp-magicpath: Feature Catalog"
description: "Unified capability inventory for the mcp-magicpath transport: the fourteen read-only MagicPath CLI tools across six themes (session, components, projects, teams, themes, local & canvas), each with its canonical callable, arguments, bounds, and read-only classification."
trigger_phrases:
  - "magicpath"
  - "magicpath feature catalog"
  - "magicpath capabilities"
last_updated: "2026-08-29"
version: 1.0.0.0
---

# mcp-magicpath: Feature Catalog

This document is the canonical capability inventory for the `mcp-magicpath` skill. The root catalog acts as the system-level directory: it summarizes each theme, names the canonical Code Mode callable for each tool, and tags every capability read-only, since the entire registered surface is read-only. The skill looks up MagicPath components, projects, teams, design systems, and the live web canvas through the `magicpath` Code Mode manual (a UTCP `cli` transport, not an MCP server).

> **Transport shape (read first).** Callables use the form `magicpath.<tool>(...)`, from Code Mode's `{manual}.{tool}` rule applied once (the tool names have no `magicpath_` prefix of their own). A mandatory `tool_info` confirmation still precedes first use, and the packet fails closed on catalog drift.

> **Calling convention (hard).** Tools are synchronous inside `call_tool_chain`: no `await`, no top-level `await`, no returned Promise (a returned Promise silently marshals as `{}`). Plain JavaScript only; TypeScript type annotations fail to parse. A failing command does not throw; it returns the error text or a JSON error object as an ordinary value, so inspect the returned value rather than rely on `try`/`catch`.

> **Verification note.** The tool rows below are the documented contract from the registered manual (`node .opencode/bin/magicpath-utcp-manual.cjs`), which is the source of truth for what an agent can call. `magicpath-ai info -o json`'s `cli.commands` list is stale and under-reports; `magicpath-ai --help` is authoritative. Most tools require a credential (`magicpath-ai login` or `MAGICPATH_TOKEN`); `info` is the exception and answers without one. Verify any argument or result field with `tool_info` before relying on it; the provider surface can grow, so unknown fields are preserved, never stripped.

---

## 1. OVERVIEW

Use this catalog as the inventory for the live `mcp-magicpath` surface. The numbered sections below group the fourteen tools by theme so readers can move from a top-level summary into per-theme detail without losing the read-only context.

The capability surface has one hard prerequisite and six themes. Everything depends on **access**: the `magicpath-ai` CLI must be on PATH and, for every tool except `info`, a credential must be present. From there the **session** theme carries reachability and identity, the **components** theme carries component search and source inspection, the **projects** theme carries project inventory and sharing, the **teams** theme carries team and member listings, the **themes** theme carries design-system inventory and detail, and the **local & canvas** theme carries the project directory and the web canvas.

A note on what stays out of scope. This skill is the read-only transport, not the write surface: the CLI's `add`, `code`, `image`, `create-project`, and `clone` commands are deliberately not registered, and this catalog documents none of them as reachable. The transport never mutates this workspace (`mutatesWorkspace: false`; Write/Edit/Task forbidden), never edits the `magicpath` manual, never touches auth state, and never invents rate limits (none is published for the CLI).

### Capability class

Every tool below is READ-ONLY against both this workspace and the provider: the registered manual exposes no mutating tools. The only writes anywhere in the workflow are the operator-owned credential state and the provider-side read accounting, both outside this repo.

### Capability areas

| Capability area | Theme role | Key constraint |
|---|---|---|
| Session | Reachability and identity; `info` answers without credentials | `whoami` requires a credential |
| Components | Component name search and source inspection | `inspect_component` writes no files; `list_components` cursor-paginates with `after` |
| Projects | Project inventory, open projects, shareable URLs | `share_link` takes a generated name or numeric project id in one `identifier` |
| Teams | Team and member listings | `list_members` requires a `team` |
| Themes | Design-system inventory and detail | `get_theme` fetches CSS variables, fonts, and a styling prompt |
| Local & canvas | Project directory and web canvas | `selection` returns empty collections when nothing is selected, safe to call speculatively |

---

## 2. SESSION

Reachability and identity. `info` answers without credentials and is the cheapest check that MagicPath is reachable and set up; `whoami` returns the authenticated user and fails when no credential is present.

| Feature | One-line description | Class | Canonical callable |
|---|---|---|---|
| Info | Authentication state, signed-in user, teams, projects, and CLI version; answers without credentials | READ-ONLY | `magicpath.info({})` |
| Whoami | The currently authenticated MagicPath user; fails without a credential | READ-ONLY | `magicpath.whoami({})` |

See [`session/session.md`](session/session.md) for the reachability-first role and the credential split.

---

## 3. COMPONENTS

Search and inspect MagicPath components. `search_components` is the first call when looking for a component by name; `inspect_component` reads source, dependencies, and imports without installing anything; `list_components` enumerates a project's contents, cursor-paginated by `after`.

| Feature | One-line description | Class | Canonical callable |
|---|---|---|---|
| Search components | Name search across personal and team projects; `limit` (default 20), `team` optional | READ-ONLY | `magicpath.search_components({ query, limit?, team? })` |
| Inspect component | Source, dependencies, and imports for one generated name; writes no files, needs no manifest | READ-ONLY | `magicpath.inspect_component({ generated_name })` |
| List components | Components inside one project; `limit` (default 100), `after` cursor | READ-ONLY | `magicpath.list_components({ project_id, limit?, after? })` |

See [`components/components.md`](components/components.md) for the search-before-detail funnel and the cursor-pagination rule.

---

## 4. PROJECTS

Project inventory, open projects, and shareable URLs. `list_projects` spans the personal workspace and every team; `active_project` reads the projects open in the web app; `share_link` prints a URL for a component or project without opening a browser.

| Feature | One-line description | Class | Canonical callable |
|---|---|---|---|
| List projects | Projects across the personal workspace and every team; `team`, `limit` optional | READ-ONLY | `magicpath.list_projects({ team?, limit? })` |
| Active project | Projects currently open in the MagicPath web app; lighter than `selection` | READ-ONLY | `magicpath.active_project({})` |
| Share link | Shareable URL for a component generated name or numeric project id; opens no browser | READ-ONLY | `magicpath.share_link({ identifier })` |

See [`projects/projects.md`](projects/projects.md) for the inventory-then-share role and the `identifier` union.

---

## 5. TEAMS

Team and member listings. `list_teams` returns the teams the user belongs to with their role; `list_members` returns the members of one team.

| Feature | One-line description | Class | Canonical callable |
|---|---|---|---|
| List teams | Teams the current user belongs to, with role in each | READ-ONLY | `magicpath.list_teams({})` |
| List members | Members of one team (name or id) | READ-ONLY | `magicpath.list_members({ team })` |

See [`teams/teams.md`](teams/teams.md) for the team-scope role.

---

## 6. THEMES

Design-system inventory and detail. `list_themes` lists the design systems available to the user or one team; `get_theme` fetches a theme's CSS variables, fonts, and styling prompt to match generated UI to an existing brand.

| Feature | One-line description | Class | Canonical callable |
|---|---|---|---|
| List themes | Design systems available to the user, or to one team; `team` optional | READ-ONLY | `magicpath.list_themes({ team? })` |
| Get theme | CSS variables, fonts, and styling prompt for one theme; `team` optional | READ-ONLY | `magicpath.get_theme({ theme, team? })` |

See [`themes/themes.md`](themes/themes.md) for the brand-matching role.

---

## 7. LOCAL & CANVAS

The project directory and the web canvas. `list_installed` scans the current project directory for MagicPath components already present; `selection` reads the components and images currently selected on the web canvas plus the open projects.

| Feature | One-line description | Class | Canonical callable |
|---|---|---|---|
| List installed | MagicPath components already in the current project directory; `path` optional | READ-ONLY | `magicpath.list_installed({ path? })` |
| Selection | Web-canvas selection plus open projects; empty when nothing is selected, safe to call speculatively | READ-ONLY | `magicpath.selection({})` |

See [`local-canvas/local-canvas.md`](local-canvas/local-canvas.md) for the speculative-call safety and the local/canvas split.

---

## 8. CAPABILITY COUNT SUMMARY

Each theme maps to one domain overview file plus one per-tool leaf per documented tool, so every one of the fourteen tools has its own home.

| Section | Theme | Tools listed | Domain overview | Per-tool leaves |
|---|---|---|---|---|
| 2 | Session | 2 | `session/session.md` | `session/info.md`, `session/whoami.md` |
| 3 | Components | 3 | `components/components.md` | `components/search-components.md`, `components/inspect-component.md`, `components/list-components.md` |
| 4 | Projects | 3 | `projects/projects.md` | `projects/list-projects.md`, `projects/active-project.md`, `projects/share-link.md` |
| 5 | Teams | 2 | `teams/teams.md` | `teams/list-teams.md`, `teams/list-members.md` |
| 6 | Themes | 2 | `themes/themes.md` | `themes/list-themes.md`, `themes/get-theme.md` |
| 7 | Local & canvas | 2 | `local-canvas/local-canvas.md` | `local-canvas/list-installed.md`, `local-canvas/selection.md` |
| **Total** | **6 themes** | **14 tools** | **6 domain files** | **14 per-tool leaves** |

> The fourteen tools are the complete registered surface. The unregistered write surface (`add`, `code`, `image`, `create-project`, `clone`) is deliberately out of reach and documented only as a boundary, never as a capability. The per-tool leaf count MUST equal the 14 registered tools; keep them in sync as the registered surface evolves, and treat any live drift from these 14 tools as a fail-closed escalation.
