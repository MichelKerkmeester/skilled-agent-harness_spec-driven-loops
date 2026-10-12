---
title: "Obsidian theme system file-layer operations"
description: "Operate the Obsidian theme system at the file layer: activate a community theme through the cssTheme key, customize with CSS snippets and variables, and build or publish themes — never editing a shipped theme's own files. Minimal is the worked example."
trigger_phrases:
  - "obsidian theme system"
  - "theme file layer"
  - "cssTheme appearance"
  - "css snippet customization"
  - "obsidian theme development"
version: 0.11.0.0
---

# Obsidian theme system file-layer operations

## 1. OVERVIEW

The `mcp-obsidian` mode operates the Obsidian theme system at the file layer — the system in general, not one specific theme. A community theme is a folder under `.obsidian/themes/<name>/` holding `manifest.json` plus `theme.css`; the active theme is the `cssTheme` string in `.obsidian/appearance.json`. Appearance is customized without touching a theme's own files, through CSS snippets in `.obsidian/snippets/` and the 400+ built-in CSS variables. Minimal (by @kepano) is used across the references as the worked example theme.

---

## 2. HOW IT WORKS

The mode reads the theme package and `appearance.json`, verifies activation (the `cssTheme` value matches an installed theme folder), and proposes CSS snippets — written under `.obsidian/snippets/*.css` and enabled through `enabledCssSnippets` — with backup discipline. It never edits a community theme's `theme.css` or `manifest.json` in a real vault, because Obsidian replaces the theme folder on update; overrides layer on top as snippets. The same file-layer model covers building a theme (manifest + `theme.css` driven by CSS variables) and, as the behavioral counterpart, plugin development (manifest + `main.js`).

---

## 3. SOURCE FILES

### Implementation

- Theme system index: `references/themes/themes.md`
- Customization (snippets and CSS variables): `references/themes/customization.md`
- Theme development: `references/themes/theme-development.md`
- Plugin development overview: `references/themes/plugin-development.md`

### Verification

- Manual scenario: `manual-testing-playbook/plugin-tie-ins/theme-activation.md`

---

## 4. GUARDRAILS

- Never edit a community theme's `theme.css` or `manifest.json` in a real vault. Both are shipped artifacts Obsidian overwrites on update.
- Read `appearance.json` always. Write it only with explicit approval and a backup.
- Customize through snippets and CSS variables; propose a snippet before writing and back up any existing file first.
- Never invent CSS variable names, manifest fields, or plugin API names — ground them in the theme references.
- File-layer checks end at valid JSON/CSS, present files and exact key values. Never claim rendered pixels.
