---
title: "Obsidian Theme System"
description: "General reference for the Obsidian theme system: install, activate and manage themes, the theme package layout, the theme-vs-snippet-vs-plugin distinction, and the mcp-obsidian file-layer stance."
trigger_phrases:
  - "obsidian theme"
  - "install obsidian theme"
  - "activate theme"
  - "community theme"
  - "csstheme"
  - "obsidian appearance"
  - "theme package"
  - "minimal theme"
importance_tier: "normal"
contextType: "reference"
version: "1.0.0.0"
---

# Obsidian Theme System

The `mcp-obsidian` mode treats a theme as a **file package plus an activation record**. It reads the theme package from `.obsidian/themes/` and verifies activation from `.obsidian/appearance.json`; it never edits a community theme's own `theme.css` in a real vault. All customization is layered on top via snippets (see `customization.md`).

## 1. OVERVIEW

A theme is a **full restyle of Obsidian's appearance** shipped as a single `theme.css` plus a `manifest.json`. It is one of three extension surfaces, and they are distinct:

| Surface | What it changes | Carrier file | Lives in |
| --- | --- | --- | --- |
| **Theme** | Look only (colors, spacing, typography) | `theme.css` | `.obsidian/themes/<ThemeName>/` |
| **Snippet** | Small targeted CSS overrides | a `.css` file | `.obsidian/snippets/` |
| **Plugin** | Behavior / logic (commands, views, settings) | `main.js` | `.obsidian/plugins/<plugin-id>/` |

A theme restyles; a snippet overrides; a plugin adds behavior. A theme package has **no `main.js` and no commands** — it cannot change what Obsidian does, only how it looks.

---

## 2. BASE COLOR SCHEME VS COMMUNITY THEME

These are two separate controls and both live under **Settings > Appearance**:

- **Base color scheme** — `light`, `dark`, or `adapt to system`. This is the built-in default look, independent of any community theme.
- **Community theme** — a full replacement stylesheet installed from the community catalog.

Selecting a base scheme does not install a community theme, and installing a community theme does not change the base scheme toggle. A community theme typically ships both `.theme-dark` and `.theme-light` rules so it adapts to whichever base mode is active.

---

## 3. INSTALLING AND ACTIVATING A COMMUNITY THEME

Via the app (the user-facing path documented at `obsidian.md/help/themes`):

1. Open **Settings > Appearance > Themes** and choose **Manage**.
2. The community themes list appears; pick one and select **Install and use**.
3. The theme is installed and applied immediately.

Browse the catalog online at `community.obsidian.md`.

From the file layer, activation is recorded as the `cssTheme` string in `.obsidian/appearance.json`. The mode proves a theme is active by reading that file; it does not drive the in-app picker.

---

## 4. MANAGING AN INSTALLED THEME

Per-theme controls and the bulk control both live under **Settings > Appearance**:

| Action | Where | Effect |
| --- | --- | --- |
| **Stop using this theme** | Per theme | Reverts to the default theme (package stays on disk) |
| **Check for updates** | Per theme, or **Appearance > Current community themes > Check for updates** | Pulls the latest `theme.css` |
| **Uninstall** | Per theme | Removes the package from `.obsidian/themes/` |

Themes update **manually** — there is no auto-update. The mode cannot trigger an in-app update; it can only report the on-disk version from `manifest.json`.

---

## 5. THE THEME PACKAGE

A theme is a folder under `.obsidian/themes/`:

```
.obsidian/themes/<ThemeName>/
├── manifest.json
└── theme.css
```

- `manifest.json` — metadata. Its `name` field **MUST equal the theme directory name**.
- `theme.css` — the **entire stylesheet**. There is no split into partials; one file holds the whole theme.

The active theme name is persisted as `cssTheme` in `.obsidian/appearance.json`. To confirm which theme is live, read `appearance.json` and match `cssTheme` to a directory under `.obsidian/themes/`.

---

## 6. THE MINIMAL THEME (WORKED EXAMPLE)

`Minimal` is one community theme used here as a running example, not the center of this reference.

| Field | Value |
| --- | --- |
| Theme id / `cssTheme` value | `Minimal` |
| Author | @kepano (Steph Ango) |
| Package | one `theme.css` + `manifest.json` |
| Plugin surface | none (no `main.js`, no commands, no settings keys) |
| Customization model | CSS variables + snippets layered on top |
| Docs | `minimal.guide` |

It illustrates the pure-theme shape: a stylesheet package with no behavioral surface, customized entirely through variables and snippets rather than by editing `theme.css`.

---

## 7. FILE-LAYER STANCE

The `mcp-obsidian` mode operates themes at the file layer with these rules:

- **Read the package** from `.obsidian/themes/<ThemeName>/` to report installed themes and their manifest metadata.
- **Verify activation** from `cssTheme` in `.obsidian/appearance.json`.
- **Never edit a community theme's `theme.css`** in a real vault. Customization goes through snippets (see `customization.md`).
- **Rendering needs an in-app reload.** File-layer writes prove the file changed, not the pixels. Tell the user to reload the app or note when an in-app reload is required.

---

## 8. RELATED RESOURCES

| File | Use it for |
| --- | --- |
| `customization.md` | CSS snippets, the 400+ CSS variables, and the never-edit-`theme.css` doctrine with a worked snippet |
| `theme-development.md` | Building a theme: package structure, the sample theme, dark/light support, submission |
| `plugin-development.md` | Overview of plugin development — the behavioral counterpart to themes |

The general file-layer operating model lives in `references/plugins/plugin-operation-logic.md`.
