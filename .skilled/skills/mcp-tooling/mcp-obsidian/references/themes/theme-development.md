---
title: "Obsidian Theme Development"
description: "General reference for building an Obsidian theme: required files, the sample theme starting point, dark/light support via CSS variables, and submission to the community catalog."
trigger_phrases:
  - "build obsidian theme"
  - "obsidian theme manifest"
  - "obsidian sample theme"
  - "obsidian theme.css"
  - "submit obsidian theme"
  - "community-css-themes json"
  - "obsidian theme dark light"
importance_tier: "normal"
contextType: "reference"
version: "1.0.0.0"
---

# Obsidian Theme Development

Building a theme means authoring a `manifest.json` and a single `theme.css` that restyles Obsidian. This reference covers the package contract, the official starting point, dark/light support, and submission. It is not an exhaustive CSS tutorial.

## 1. OVERVIEW

A theme is a folder under `.obsidian/themes/` containing two required files:

```
.obsidian/themes/<ThemeName>/
├── manifest.json
└── theme.css
```

- `manifest.json` — metadata. Its `name` field **MUST equal the theme directory name**.
- `theme.css` — the **entire stylesheet**. One file holds the whole theme; there is no partials split.

There is no `main.js`, no commands, no settings — a theme is styling only. Behavioral changes belong to a plugin (see `plugin-development.md`).

---

## 2. THE SAMPLE THEME STARTING POINT

The official starting point is the sample theme repository at `github.com/obsidianmd/obsidian-sample-theme`. Clone it into `.obsidian/themes/` under your theme name to get a working `manifest.json` and `theme.css` skeleton.

The sample theme gives you the package shape and a baseline stylesheet to edit; it is not a published community theme itself.

---

## 3. DARK AND LIGHT SUPPORT

A good theme supports **both** dark and light modes via the `.theme-dark` and `.theme-light` selectors. Define each variable under both so the theme adapts to whichever base mode is active:

```css
.theme-light {
  --background-primary: #fafafa;
}

.theme-dark {
  --background-primary: #1a1a1a;
}
```

### Prefer built-in CSS variables over hard-coded values

Obsidian exposes **400+ CSS variables** across six categories (Foundations, Components, Editor, Plugins, Window, Obsidian Publish). Override these tokens instead of hard-coding colors, spacing, or typography so the theme inherits Obsidian's structural design and adapts across modes. The full variable catalog is at `docs.obsidian.md/Reference/CSS+variables/CSS+variables`.

---

## 4. SUBMITTING TO COMMUNITY THEMES

Community themes are listed via a pull request against the `obsidianmd/obsidian-releases` repository, adding an entry to `community-css-themes.json`.

The exact current submission steps (required manifest fields for the listing entry, review criteria, asset requirements such as a screenshot URL) are **VERIFY** — they are not in this digest. Consult `github.com/obsidianmd/obsidian-releases` and the contributing guide there before opening the PR.

---

## 5. PRACTICAL GUIDANCE

- **Keep `manifest.json` `name` equal to the directory name** — Obsidian enforces this match.
- **Ship one `theme.css`** — the whole stylesheet lives in that single file.
- **Support both modes** — define variables under `.theme-dark` and `.theme-light`.
- **Use variables, not hard-coded values** — so the theme adapts and stays maintainable.
- **Test in a real vault** — file-layer checks prove the package is well-formed; rendering must be verified in-app.
- **Do not bundle behavior** — if you need commands, views, or settings, that is a plugin, not a theme.

---

## 6. RELATED RESOURCES

| File | Use it for |
| --- | --- |
| `themes.md` | The theme system from the user's side: install, activate, manage |
| `customization.md` | Customizing an existing theme via snippets and CSS variables (the never-edit-`theme.css` doctrine) |
| `plugin-development.md` | When a restyle is not enough — adding behavior via a plugin |

The general file-layer operating model lives in `references/plugins/plugin-operation-logic.md`.
