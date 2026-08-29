---
title: "get_theme"
description: "Per-tool leaf for get_theme: fetch a MagicPath design system's CSS variables, fonts, and styling prompt to match generated UI to an existing brand rather than inventing values; theme required, team optional. Read-only."
trigger_phrases:
  - "magicpath get theme tool"
  - "get theme magicpath"
  - "magicpath css variables"
  - "magicpath styling prompt"
version: 1.0.0.0
---

# get_theme

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Design-system detail for brand matching. READ-ONLY. Canonical callable: `magicpath.get_theme({ theme, team? })` (confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | `theme: string` (theme id or name) |
| Optional args | `team: string` (look the theme up within one team) |
| Returns | The design system's CSS variables, fonts, and styling prompt |
| Purpose | Match generated UI to an existing brand rather than inventing values |

---

## 2. HOW IT WORKS

`get_theme` takes a required `theme` (theme id or name, the value `list_themes` returns) and an optional `team` (look the theme up within one team), and returns the theme's CSS variables, fonts, and styling prompt. Use this to match generated UI to an existing brand rather than inventing values. A theme's styling prompt is reference material, not a taste verdict; this transport issues no design judgment. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | Args, bounds, result shape, and the brand-matching role (Sections 2-3) |
| `../../references/mutation-boundary.md` | The read-only boundary; a styling prompt is reference, not a verdict |

---

## 4. SOURCE METADATA

- Group: Themes
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [themes.md](themes.md)
- Feature file path: `themes/get-theme.md`
