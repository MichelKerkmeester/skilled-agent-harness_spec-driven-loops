---
title: "Iconic rulebook file-layer operations"
description: "Add, edit, and disable Iconic icon rules and visibility toggles in data.json with backup-before-merge discipline."
trigger_phrases:
  - "iconic file layer"
  - "icon rulebook"
  - "iconic ruleset"
  - "icon color rules"
  - "folder icons"
version: 0.7.0.0
---

# Iconic rulebook file-layer operations (`iconic`)

## 1. OVERVIEW

Iconic (repo `gfxholo/iconic`, installed v1.1.10 in every vault) customizes icons/colors for tabs, files & folders, bookmarks, tags, properties, and ribbon. Its ENTIRE configuration is `.obsidian/plugins/iconic/data.json`: visibility toggles (`showAllFileIcons`, `showAllFolderIcons`, `showMenuActions`, …), color pickers, per-item icon maps, and the rulebook (`fileRules` 21 rules by extension + `folderRules` 11 rules by name — already applied in all vaults). The mode edits the JSON; the app renders after reload.

## 2. HOW IT WORKS

Read `data.json` fresh → back up (`.bak` copy) → merge only the requested keys/rules (stable `id`s, preserve everything else) → write + re-parse. Rule shape: `{id, name, icon (lucide-*), color (hex), match (any/all), conditions: [{source: extension|name, operator: is|contains, value}], enabled}`.

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/iconic/iconic.md`
- Data contract: `references/plugins/iconic/data-model.md`
- Recipes: `references/plugins/iconic/workflows.md`
- Diagnostics: `references/plugins/iconic/troubleshooting.md`

### Assets

- `assets/plugins/iconic/iconic-rules.full.json` — canonical complete automatic-rule payload: all 21 `fileRules` + 11 `folderRules` (normalized objects verified identical across the Obsidian, iCloud, and Barter vaults); the exact copy/merge payload
- `assets/plugins/iconic/iconic-rules.full.md` — template-conformant usage companion (rule-class coverage + merge contract); the full JSON remains the exact copy/merge payload
- `assets/plugins/iconic/iconic-rules.example.json` — compact schema sample (2 file rules + 1 folder rule)

### Verification

- Manual scenario: `manual-testing-playbook/plugin-tie-ins/iconic-rules.md`

## 4. GUARDRAILS

- Backup before EVERY write; merge, never replace; preserve user-customized rules.
- The full rule asset is merge-only: apply it by stable rule `id` into a freshly-read vault `data.json` (update matching ids, append missing ids) — never as a whole-file replacement; it deliberately excludes settings, `dialogState`, and per-item overrides.
- Never downgrade the plugin binary; the rulebook is the only thing (re)applied.
- Do not fabricate `lucide-*` icon names or `dialogState` keys.
