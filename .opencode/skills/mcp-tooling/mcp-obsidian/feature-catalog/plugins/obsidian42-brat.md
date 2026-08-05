---
title: "BRAT file-layer installation operations"
description: "Stage, register, activate, pin, and verify GitHub beta plugins through BRAT's Obsidian vault files."
trigger_phrases:
  - "BRAT file-layer install"
  - "stage register activate beta plugin"
  - "install plugin from GitHub"
  - "BRAT frozen version"
  - "headless BRAT workflow"
version: 0.1.0.0
---

# BRAT file-layer installation operations (`obsidian42-brat`)

## 1. OVERVIEW

BRAT (Beta Reviewers Auto-update Tool, repo `TfTHacker/obsidian42-brat`) uses GitHub releases to install and update beta plugins and themes. Its plugin policy lives in `.obsidian/plugins/obsidian42-brat/data.json`; staged plugin files live below `.obsidian/plugins/<manifest.id>/`; activation is a separate manifest-ID entry in `.obsidian/community-plugins.json`.

This file-layer card covers beta-plugin operations only. Themes use a different path and checksum record. A frozen release is an exact tag in `pluginSubListFrozenVersion`, and update-all deliberately skips that entry.

## 2. HOW IT WORKS

Keep the three install stages separate and verifiable. First fetch the exact GitHub release assets `main.js` and `manifest.json` plus optional `styles.css`, validate the manifest, and stage them in the folder named by `manifest.id`. Then register the repository string in BRAT's `pluginList` and upsert its moving or frozen policy. Finally add the manifest ID to `community-plugins.json` when activation is requested.

Write these files while Obsidian is closed, retain backups, re-parse every JSON file, and reload the app only after the staged files, BRAT registration, and activation entry all pass. Never place GitHub token values in `data.json`; v2.0+ token names point to Obsidian SecretStorage.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Shared | Routes BRAT-specific requests to only the BRAT reference family. |
| [`../../references/plugins/plugin-operation-logic.md`](../../references/plugins/plugin-operation-logic.md) | Shared | Defines the file-layer-over-UI operating boundary. |
| [`../../references/plugins/obsidian42-brat/data-model.md`](../../references/plugins/obsidian42-brat/data-model.md) | Plugin | Defines BRAT settings, repository records, frozen policies, and SecretStorage boundaries. |
| [`../../references/plugins/obsidian42-brat/workflows.md`](../../references/plugins/obsidian42-brat/workflows.md) | Plugin | Defines stage, register, activate, pin, update, remove, and sibling-plugin recipes. |
| [`../../references/plugins/obsidian42-brat/troubleshooting.md`](../../references/plugins/obsidian42-brat/troubleshooting.md) | Plugin | Defines release, asset, compatibility, token, update, theme, and path recovery. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| [`../../manual-testing-playbook/plugin-tie-ins/brat-headless-install.md`](../../manual-testing-playbook/plugin-tie-ins/brat-headless-install.md) | Manual playbook | Exercises a headless stage → register → activate install. |
| [`../../assets/brat-data-entry.example.json`](../../assets/brat-data-entry.example.json) | Fixture | Provides a populated BRAT policy fixture without credentials. |
| [`../../references/plugins/obsidian42-brat/workflows.md`](../../references/plugins/obsidian42-brat/workflows.md) | Reference | Defines exact asset checks and the three-stage post-write verification. |

## 4. SOURCE METADATA

- Group: Plugins
- Canonical catalog source: `FEATURE-CATALOG.md`
- Feature file path: `plugins/obsidian42-brat.md`

Related references:
- [`../../references/plugins/obsidian42-brat/obsidian42-brat.md`](../../references/plugins/obsidian42-brat/obsidian42-brat.md) — plugin identity and deep-reference index.
- [`../../assets/workflows.md`](../../assets/workflows.md) — shared cross-plugin file-layer workflow asset.
