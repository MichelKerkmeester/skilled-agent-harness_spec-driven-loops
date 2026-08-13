---
title: "BRAT Plugin Index"
description: "Slim entry point for operating BRAT as the file-layer installer and updater for GitHub beta plugins and themes in an Obsidian vault."
trigger_phrases:
  - "brat obsidian plugin"
  - "obsidian beta plugin install"
  - "brat file layer"
  - "brat release update"
  - "brat theme tracking"
importance_tier: "normal"
contextType: "implementation"
version: 0.1.0.0
---

# BRAT Plugin Index

BRAT (Beta Reviewers Auto-update Tool) installs and updates GitHub beta plugins and themes that are not in Obsidian's official community list. Use this page for routing; the deep references hold the complete schema, file-layer recipes, and failure recovery.

## 1. OVERVIEW

| Field | Value |
|---|---|
| Name | BRAT (Beta Reviewers Auto-update Tool) |
| Manifest ID | `obsidian42-brat` |
| Author | `TfTHacker` |
| Repository | [`TfTHacker/obsidian42-brat`](https://github.com/TfTHacker/obsidian42-brat) |
| Coverage | v2.2.0+ |

BRAT selects GitHub releases and writes the exact plugin assets `main.js`, `manifest.json`, and optional `styles.css` below `.obsidian/plugins/<manifest.id>/`. Its persisted beta policy is in `.obsidian/plugins/obsidian42-brat/data.json`; plugin activation is a separate entry in `.obsidian/community-plugins.json`.

For headless work, keep the stages explicit: stage release assets to disk, register the repository in BRAT's `pluginList` and release policy, then activate the manifest ID in Obsidian's community-plugin list. A frozen version is an exact tag in `pluginSubListFrozenVersion`; update-all skips that entry.

---

## 2. DEEP REFERENCES

- [`data-model.md`](data-model.md) — complete `data.json` keys, defaults, repository/theme records, schema version, and v2.0+ SecretStorage boundary.
- [`workflows.md`](workflows.md) — stage→register→activate recipes for plugins, frozen tags, updates, themes, removal, and the two sibling mode plugins.
- [`troubleshooting.md`](troubleshooting.md) — cause→detection→fix catalog for release, asset, compatibility, token, update, and path failures.

---

## 3. STARTER ASSET

Use [`brat-data-entry.example.json`](../../../assets/brat-data-entry.example.json) as a valid populated example, not as a replacement for an existing vault file. Merge into the existing BRAT settings while preserving unrelated keys and entries.

---

## 4. SOURCE BOUNDARY

The source-of-truth implementation references are [`src/settings.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts) for defaults and SecretStorage names, [`src/features/BetaPlugins.ts`](https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts) for release installation and frozen policy, and the [`TfTHacker/obsidian42-brat`](https://github.com/TfTHacker/obsidian42-brat) repository for the plugin identity.
