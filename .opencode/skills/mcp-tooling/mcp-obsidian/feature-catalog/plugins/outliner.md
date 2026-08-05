---
title: "Outliner settings file-layer operations"
description: "Read, validate and modify Outliner editor-behavior settings in data.json and report defaults honestly when the file is absent."
trigger_phrases:
  - "outliner file layer"
  - "outliner settings"
  - "obsidian outliner plugin"
  - "outliner data json"
  - "outliner defaults"
version: "0.10.0.0"
---

# Outliner settings file-layer operations (`obsidian-outliner`)

## 1. OVERVIEW

Outliner (repo `vslinko/obsidian-outliner`, installed v4.10.2 from the vault manifest) changes list editing to behave like Workflowy or RoamResearch. It is editor behavior only: folding and unfolding subtrees, moving list items with their sublists, indenting and outdenting, drag and drop, cursor sticking, Enter and Tab handling, Vim-mode bullets, vertical indentation lines and a system info dialog. It defines no note format and writes nothing into notes. Its ENTIRE file-layer surface is `.obsidian/plugins/obsidian-outliner/data.json`, which is currently absent in the active vault so every setting uses its default value. The mode edits or reads the JSON. The app applies behavior after reload.

## 2. HOW IT WORKS

Read `data.json` fresh if present → report defaults when absent → back up (`.bak` copy) → merge only the requested keys (documented schema, preserve everything else) → write + re-parse. Settings contract: 11 documented keys (`stickCursor`, `betterTab`, `betterEnter`, `betterVimO`, `selectAll`, `styleLists`, `listLines`, `listLineAction`, `dnd`, `debug`, `previousRelease`). The plugin merges loaded values over its defaults, so a partial file is valid and an unknown key is inert. A missing file is not an error, it means defaults apply.

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/outliner/outliner.md`
- Data contract: `references/plugins/outliner/data-model.md`
- Recipes: `references/plugins/outliner/workflows.md`
- Diagnostics: `references/plugins/outliner/troubleshooting.md`

### Assets

- `assets/plugins/outliner/outliner-settings.example.json` - defaults snapshot example, every key documented in the data model
- `assets/plugins/outliner/outliner-settings.partial.example.json` - minimal partial file example showing missing keys fall back to defaults

### Verification

- Manual scenario: `manual-testing-playbook/plugin-tie-ins/outliner-settings-defaults.md`

## 4. GUARDRAILS

- Report defaults when `data.json` is absent. Absence is not an error and needs no restore.
- Backup before EVERY write. Merge, never replace. Never drop unrelated keys.
- Never invent settings keys or values beyond the 11 documented ones.
- Never set `previousRelease`. It is bookkeeping.
- Gate `listLineAction: "zoom-in"` and every zoom claim on the Zoom plugin being present in the vault.
- The plugin holds no note format, so the mode never edits notes on its behalf.
