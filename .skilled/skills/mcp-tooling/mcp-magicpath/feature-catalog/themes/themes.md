---
title: "Themes"
description: "MagicPath design-system inventory and detail: list the design systems available to the user or one team, and fetch a theme's CSS variables, fonts, and styling prompt to match generated UI to an existing brand. Both read-only."
trigger_phrases:
  - "magicpath themes"
  - "magicpath list themes"
  - "magicpath get theme"
  - "magicpath design system"
version: 1.0.0.0
---

# Themes (list_themes / get_theme)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries design-system lookup. `list_themes` lists the design systems available to the user, or to one team. `get_theme` fetches a design system's CSS variables, fonts, and styling prompt, to match generated UI to an existing brand rather than inventing values.

Both tools are READ-ONLY. A theme's styling prompt is reference material, not a taste verdict; this transport issues no design judgment.

---

## 2. HOW IT WORKS

`magicpath.list_themes({ team? })` takes an optional `team` (restrict to one team, by name or id) and returns the available design systems. `magicpath.get_theme({ theme, team? })` takes a required `theme` (theme id or name) and an optional `team` (look the theme up within one team), and returns the theme's CSS variables, fonts, and styling prompt. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool-surface.md` | Shared | Theme tool arguments, bounds, result shape, and the brand-matching role |
| `references/credential-setup.md` | Shared | The credential these tools require |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `references/mutation-boundary.md` | Reference | The read-only boundary; a styling prompt is reference, not a verdict |

---

## 4. SOURCE METADATA

- Group: Themes
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `themes/themes.md`

Per-tool leaves in this domain:
- [list-themes.md](list-themes.md) - design-system inventory for the user or one team
- [get-theme.md](get-theme.md) - CSS variables, fonts, and styling prompt for one theme

Related references:
- [teams.md](../teams/teams.md) covers the `team` filter `list_themes` accepts
- [components.md](../components/components.md) covers the components a theme's tokens would style
