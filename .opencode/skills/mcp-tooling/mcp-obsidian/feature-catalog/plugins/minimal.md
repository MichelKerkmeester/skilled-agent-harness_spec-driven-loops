---
title: "Minimal theme file-layer operations"
description: "Activate the Minimal Obsidian theme through the cssTheme key and propose snippet-based tweaks with backup discipline, never editing the shipped theme files."
trigger_phrases:
  - "minimal theme file layer"
  - "minimal theme activation"
  - "cssTheme appearance"
  - "minimal theme snippets"
  - "minimal theme settings"
version: 0.10.0.0
---

# Minimal theme file-layer operations (`Minimal`)

## 1. OVERVIEW

Minimal is a theme by @kepano, installed v9.0.2 in every vault (verified in `.obsidian/themes/Minimal/manifest.json`). It is a complete UI theme shipped as one `theme.css` stylesheet plus a `manifest.json`. It has no plugin surface: no `main.js`, no `data.json`, no commands and no settings keys. Customization at the file layer happens through CSS snippets in `.obsidian/snippets/`.

## 2. HOW IT WORKS

The theme activates through a single string key, `cssTheme`, in `.obsidian/appearance.json`. The value must match the theme folder name exactly. The mode reads the package and the appearance file, verifies activation, proposes snippet files and writes them with backup discipline. It never edits `theme.css` or `manifest.json` in a real vault because Obsidian replaces the theme folder on updates.

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/minimal/minimal.md`
- Data contract: `references/plugins/minimal/data-model.md`
- Recipes: `references/plugins/minimal/workflows.md`
- Diagnostics: `references/plugins/minimal/troubleshooting.md`

### Assets

- `assets/plugins/minimal/minimal-activation.example.json` (example appearance file showing the activation key: `cssTheme` set to `Minimal`, the only key the data model documents in the installed file)
- `assets/plugins/minimal/minimal-snippet.example.css` (example snippet that tightens heading sizes through verified theme variables, labeled example, proposed shape for a real snippet)

### Verification

- Manual scenario: `manual-testing-playbook/plugin-tie-ins/minimal-theme-activation.md`

## 4. GUARDRAILS

- Never edit `theme.css` or `manifest.json` in a real vault. Both are shipped artifacts.
- Read `appearance.json` always. Write it only with explicit approval and a backup.
- Propose snippets before writing and back up any existing file first.
- Never invent settings keys or claim companion plugin data. The theme has no settings of its own.
- File-layer checks end at valid JSON, present files and exact key values. Never claim rendered pixels.
