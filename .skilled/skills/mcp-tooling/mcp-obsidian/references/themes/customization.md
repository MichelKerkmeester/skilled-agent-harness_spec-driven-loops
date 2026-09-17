---
title: "Obsidian Theme Customization"
description: "General reference for customizing Obsidian's look without editing theme.css: CSS snippets (folder, enable, enabledCssSnippets, auto-detect), the 400+ CSS variables across six categories, and the override selectors."
trigger_phrases:
  - "obsidian css snippet"
  - "obsidian snippets folder"
  - "obsidian css variables"
  - "customize obsidian theme"
  - "enabledcsssnippets"
  - "obsidian appearance json"
  - "theme-dark theme-light"
importance_tier: "normal"
contextType: "reference"
version: "1.0.0.0"
---

# Obsidian Theme Customization

Customization in `mcp-obsidian` means **layering snippets and CSS-variable overrides on top of an installed theme** — never editing the theme's own `theme.css`. This keeps community themes update-safe and keeps every change reversible from the file layer.

## 1. OVERVIEW

There are two customization levers, both file-based:

| Lever | What it does | Carrier | Where |
| --- | --- | --- | --- |
| **CSS snippet** | Small targeted CSS override | a `.css` file | `.obsidian/snippets/` |
| **CSS variable override** | Restyle a design token (color, spacing, typography) | inside a snippet or theme | same `.css` file |

Snippets are the safe customization surface. A snippet overrides specific rules; the theme underneath stays intact and can still be updated without losing your changes.

---

## 2. CSS SNIPPETS

Snippets live in the vault config folder at `.obsidian/snippets/`. Each snippet is one `.css` file (for example `headers.css`).

```
.obsidian/snippets/
└── headers.css
```

On **mobile** you must create the `snippets` folder manually; on desktop Obsidian creates it on demand.

### Enabling a snippet

Via **Settings > Appearance > CSS snippets**:

1. **Open snippets folder** — reveals `.obsidian/snippets/` so you can drop a `.css` file in.
2. **Reload snippets** — refreshes the list after adding or renaming a file.
3. **Toggle a snippet on** — applies it.

### Auto-detect on save

Once a snippet is enabled, Obsidian **auto-detects changes and applies them on save** — no restart needed. The **Reload app without saving** command exists if a reload is ever required.

### Persistence

Enabled snippets persist as an `enabledCssSnippets` array in `.obsidian/appearance.json`. The mode proves a snippet is active by reading that array; toggling is an in-app action the mode cannot drive directly.

---

## 3. CSS VARIABLES

Obsidian exposes **400+ CSS variables** — abstracted design tokens for colors, spacing, typography and more. Override a variable instead of hard-coding a value so the theme adapts across modes.

### Six categories

| Category | Covers |
| --- | --- |
| **Foundations** | borders, colors, cursor, icons, layers, radiuses, spacing, typography |
| **Components** | buttons, checkboxes, dialogs, modals, sliders, tabs, toggles, popovers |
| **Editor** | blocks, code, headings, links, lists, tables, … |
| **Plugins** | canvas, file explorer, graph, search |
| **Window** | dividers, ribbons, scrollbars, status bar, workspace |
| **Obsidian Publish** | fonts, headers, nav, components, sidebars, pages |

The full variable catalog is documented at `docs.obsidian.md/Reference/CSS+variables/CSS+variables`.

### Override selectors

| Selector | Scope |
| --- | --- |
| `body` | Universal — applies to the whole app |
| `.theme-dark` | Dark mode only |
| `.theme-light` | Light mode only |
| `:root` | Inherited by every child |

Define dark and light values **separately** so a variable resolves correctly in each mode. For example, set `--background-primary` differently under `.theme-dark` versus `.theme-light`.

---

## 4. THE NEVER-EDIT-THEME.CSS DOCTRINE

The `mcp-obsidian` mode **never edits a community theme's own `theme.css`** in a real vault. Reasons:

- **Update safety** — a theme update overwrites `theme.css` and would destroy inline edits.
- **Reversibility** — a snippet can be toggled off or deleted; an in-place theme edit cannot.
- **Provenance** — changes live in `.obsidian/snippets/` where they are visible and auditable.

All customization goes through snippets layered on top. To restyle, author a snippet that overrides the relevant CSS variables or selectors.

---

## 5. A CORRECT SNIPPET EXAMPLE

A snippet that recolors the primary background per mode, using variables rather than hard-coded values:

```css
/* .obsidian/snippets/backgrounds.css */
.theme-light {
  --background-primary: #fafafa;
}

.theme-dark {
  --background-primary: #1a1a1a;
}
```

Enable it via **Settings > Appearance > CSS snippets** (reload, then toggle). Obsidian applies it on save; the change persists in `enabledCssSnippets` in `.obsidian/appearance.json`.

### Minimal as the running example

The `Minimal` theme (`cssTheme: Minimal`, author @kepano) is customized exactly this way — through CSS variables and snippets layered on top of its `theme.css`, never by editing the theme file. Its docs live at `minimal.guide`.

---

## 6. FILE-LAYER STANCE

- **Author snippets** in `.obsidian/snippets/<name>.css`.
- **Verify enablement** from the `enabledCssSnippets` array in `.obsidian/appearance.json`.
- **Never edit `theme.css`** in a real vault.
- **Rendering needs an in-app reload** when a snippet is first toggled. File-layer writes prove the file changed, not the pixels.

---

## 7. RELATED RESOURCES

| File | Use it for |
| --- | --- |
| `themes.md` | The theme system: install, activate, manage, and the theme-vs-snippet-vs-plugin distinction |
| `theme-development.md` | Building a theme that ships its own `theme.css` and uses these same variables |
| `plugin-development.md` | The behavioral counterpart — plugins change what Obsidian does |

The general file-layer operating model lives in `references/plugins/plugin-operation-logic.md`.
