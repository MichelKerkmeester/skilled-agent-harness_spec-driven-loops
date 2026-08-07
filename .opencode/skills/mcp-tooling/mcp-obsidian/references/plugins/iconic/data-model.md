---
title: "Iconic File-Layer Data Model"
description: "Complete file-layer contract for the Iconic plugin: data.json keys, rulebook schema, visibility toggles, per-item icon maps, and the safe-merge discipline."
trigger_phrases:
  - "iconic data model"
  - "iconic data.json schema"
  - "iconic fileRules folderRules"
  - "iconic visibility toggles"
  - "iconic backup merge"
importance_tier: "normal"
contextType: "implementation"
version: 0.7.0.0
---

# Iconic File-Layer Data Model

Iconic stores its entire configuration in one JSON file: `<vault>/.obsidian/plugins/iconic/data.json`. The AI operates that file; the app renders.

---

## 1. OVERVIEW

### Canonical identity

| Identity field | Current value |
| --- | --- |
| Obsidian plugin ID | `iconic` |
| Display name | Iconic |
| Plugin repository | `gfxholo/iconic` |
| Installed version | 1.1.10 (all vaults, verified) |
| State file | `.obsidian/plugins/iconic/data.json` |

### Core contract

- One JSON file = whole configuration: appearance toggles, colors, rulebook, per-item overrides, backup settings.
- Rendering is in-app only; the AI edits the JSON and the app reflects it after reload.
- Safe-merge discipline (from the Iconic-Setup bundle's `merge_rules.py`): back up `data.json` before any change, merge only what was requested, preserve everything else.

## 2. TOP-LEVEL KEYS (from the live vault rulebook)

| Key | Type | Meaning |
|---|---|---|
| `biggerIcons` | string | Icon size mode |
| `clickableIcons` | string | Click behavior mode |
| `showAllFileIcons` / `showAllFolderIcons` | bool | "Icon everywhere" visibility toggles |
| `minimalFolderIcons` | bool | Folder icon density mode |
| `showMarkdownTabIcons` / `showTitleIcons` / `showTagPillIcons` | bool | Per-surface visibility |
| `showMenuActions` / `showSuggestionIcons` / `showQuickSwitcherIcons` / `showMoveFileIcons` | bool | Context-surface visibility |
| `showItemName` / `useSearchKeywords` | string | Display/search behavior |
| `maxSearchResults` | int | Search cap |
| `colorPicker1` / `colorPicker2` | string | Custom color picker presets |
| `uncolorHover` / `uncolorDrag` / `uncolorSelect` / `uncolorQuick` | bool | Color-clearing behaviors |
| `maxBackups` | int | Backup retention count |
| `dialogState` | dict | UI dialog state (do not hand-edit) |
| `appIcons` / `tabIcons` / `fileIcons` / `bookmarkIcons` / `tagIcons` / `propertyIcons` / `ribbonIcons` | dict | Per-item icon overrides (empty in the stock rulebook) |
| `fileRules` | list | 21 rules by file extension |
| `folderRules` | list | 11 rules by folder name |

## 3. RULEBOOK SCHEMA

### Rule object

```json
{
  "id": "e71lH",
  "name": "Markdown notes",
  "icon": "lucide-file-text",
  "color": "#3b82f6",
  "match": "any",
  "conditions": [
    { "source": "extension", "operator": "is", "value": "md" }
  ],
  "enabled": true
}
```

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Stable rule id (preserve on edit) |
| `name` | string | Human label |
| `icon` | string | `lucide-*` icon name |
| `color` | string | Hex color |
| `match` | string | `any` / `all` condition semantics |
| `conditions` | list | `{source, operator, value}`; `source` = `extension` (file rules) or `name` (folder rules); `operator` = `is` / `contains` |
| `enabled` | bool | Rule on/off |

### Stock rulebook (installed in all vaults)

- `fileRules`: 21 rules by extension — markdown (`lucide-file-text`, blue), canvas (`lucide-layout-template`, purple), plus images, PDF, code, data, docs, audio, video, archives, etc.
- `folderRules`: 11 rules by name — attachments/assets/media, images/img/pictures/photos, documents, code, templates, notes, archives, etc.; folder rules carry multiple `name is` conditions with `match: any`.

### Canonical rulebook asset

- `assets/plugins/iconic/iconic-rules.full.json` — the canonical complete automatic-rule payload: all 21 file rules + 11 folder rules, normalized identical across the Obsidian, iCloud, and Barter vaults.
- It deliberately contains **ONLY the two mergeable rule arrays** — no `data.json` settings, no `dialogState`, no per-item override maps — so it can never act as a whole-`data.json` replacement.
- Merge it by stable rule `id` into a freshly-read vault `data.json`: update rules whose ids already exist, append rules with missing ids, preserve everything else.
- `assets/plugins/iconic/iconic-rules.full.md` is the template-conformant usage companion: rule-class coverage and the safe-merge contract, with the full JSON as the exact source.
- `assets/plugins/iconic/iconic-rules.example.json` remains the compact schema sample (2 file + 1 folder rules).

## 4. SAFE-MERGE DISCIPLINE (mandatory)

1. **Read** `data.json` fresh.
2. **Back up**: copy to `data.json.bak-<timestamp>` (or follow `maxBackups` rotation).
3. **Merge**: change only the requested keys/rules; preserve all other settings and rules; keep rule `id`s stable. When applying the canonical asset, update matching ids and append missing ids only.
4. **Write** valid JSON; re-parse to verify.
5. **Never downgrade** the plugin binary when installing (the rulebook is the only thing (re)applied).

## 5. WHAT THE AI MUST NOT DO

- Do not hand-edit `dialogState` (UI state) — harmless to preserve, risky to invent.
- Do not replace the whole `data.json` with a stock copy when the user has custom icons (merge, don't overwrite).
- Do not invent `lucide-*` names — reuse icons already present in the rulebook or the app's icon set.
- Do not claim in-app rendering was verified from the file layer.
