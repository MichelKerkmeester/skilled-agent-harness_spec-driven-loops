---
title: "Obsidian Plugin Development Overview"
description: "Concise overview of Obsidian plugin development as the behavioral counterpart to themes: anatomy, the sample plugin starting point, the Plugin API, and submission. Not an exhaustive tutorial."
trigger_phrases:
  - "obsidian plugin development"
  - "obsidian plugin manifest"
  - "obsidian sample plugin"
  - "obsidian plugin main.js"
  - "obsidian plugin api"
  - "submit obsidian plugin"
  - "community-plugins json"
importance_tier: "normal"
contextType: "reference"
version: "1.0.0.0"
---

# Obsidian Plugin Development Overview

A plugin is JavaScript that changes Obsidian's **behavior** — commands, views, settings. It is the behavioral counterpart to a theme (styling only). This is an overview that points to `docs.obsidian.md/Plugins` for depth, not an exhaustive tutorial.

## 1. OVERVIEW

| Surface | What it changes | Carrier |
| --- | --- | --- |
| **Theme** | Look only | `theme.css` |
| **Snippet** | Small CSS overrides | a `.css` file |
| **Plugin** | Behavior / logic (commands, views, settings) | `main.js` |

A plugin adds behavior a theme cannot: commands, custom views, workspace actions, persisted settings. If a need is purely visual, use a theme or snippet instead.

---

## 2. PLUGIN ANATOMY

Plugin files live in `.obsidian/plugins/<plugin-id>/`:

| File | Role |
| --- | --- |
| `manifest.json` | Metadata: `id`, `name`, `version`, `minAppVersion`, `description`, `author`, `main` |
| `main.js` | Compiled plugin entry point (the loaded code) |
| `styles.css` | Optional plugin-scoped styles |
| `data.json` | Persisted plugin settings (written by the plugin at runtime) |

The `manifest.json` fields listed above are the documented required set. `main` points to the compiled entry file (conventionally `main.js`).

---

## 3. THE SAMPLE PLUGIN STARTING POINT

The official starting point is the sample plugin repository at `github.com/obsidianmd/obsidian-sample-plugin`. It provides the `manifest.json` shape, a build setup that compiles to `main.js`, and a minimal plugin skeleton to extend.

The **Plugin API** is documented at `docs.obsidian.md/Plugins` — that is the authoritative reference for the API surface (commands, views, settings, vault access, workspace). This overview does not reproduce it.

---

## 4. SUBMITTING TO COMMUNITY PLUGINS

Community plugins are listed via a pull request against the `obsidianmd/obsidian-releases` repository, adding an entry to `community-plugins.json`.

The exact current submission steps (required manifest fields for the listing entry, review criteria, any asset or release requirements) are **VERIFY** — they are not in this digest. Consult `github.com/obsidianmd/obsidian-releases` and the contributing guide there before opening the PR.

---

## 5. SCOPE OF THIS REFERENCE

This document is deliberately an **overview**. For depth on the Plugin API, build tooling, lifecycle hooks, settings UI, and publishing, read `docs.obsidian.md/Plugins`. The `mcp-obsidian` mode interacts with installed plugins at the file layer (manifest, `data.json` settings, enablement in `community-plugins.json`); authoring and compiling a plugin is out of scope for the mode.

---

## 6. RELATED RESOURCES

| File | Use it for |
| --- | --- |
| `themes.md` | The theme system — the styling counterpart to a plugin |
| `customization.md` | CSS snippets and variables for visual changes that do not need a plugin |
| `theme-development.md` | Building a theme when the need is purely visual |

The general file-layer operating model for installed plugins lives in `references/plugins/plugin-operation-logic.md`.
