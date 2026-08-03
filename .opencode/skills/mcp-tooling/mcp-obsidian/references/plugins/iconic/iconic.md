---
title: "Iconic File-Layer Index"
description: "Lean entry point for operating the Iconic Obsidian plugin (gfxholo/iconic) through its single data.json rulebook in the vault."
trigger_phrases:
  - "iconic obsidian plugin"
  - "iconic data json"
  - "icon rules file layer"
  - "folder icon colors"
importance_tier: "normal"
contextType: "implementation"
version: 1.3.0.0
---

# Iconic Plugin Index (`iconic`)

The `mcp-obsidian` mode operates this plugin by **editing its `data.json` rulebook** — never by driving the icon-picker UI.

## 1. IDENTITY

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Obsidian plugin ID | `iconic` | Plugin directory name + enablement entry |
| Display name | **Iconic** | Current manifest name |
| Plugin repository | [`gfxholo/iconic`](https://github.com/gfxholo/iconic) | Source of behavior facts |
| Version installed | 1.1.10 (all 3 vaults) | Verified on-disk |
| State file | `<vault>/.obsidian/plugins/iconic/data.json` | The ENTIRE configuration surface |

## 2. WHAT IT DOES

Customizes icons and their colors directly in the Obsidian UI: tabs, files & folders, bookmarks, tags, properties, and ribbon commands. Rules can match by file extension or folder name; per-item overrides exist for individual icons. Rendering happens in-app; the mode touches only the JSON.

## 3. FILE-LAYER SURFACE (what the AI edits)

| Layer | Path / artifact | Operable by AI |
|---|---|---|
| Rulebook + settings | `.obsidian/plugins/iconic/data.json` | **Yes** — toggles, colors, `fileRules`/`folderRules`, per-item icon maps |
| Enablement | `.obsidian/community-plugins.json` | Yes (already enabled in all vaults) |
| In-app icon picking | — | **No** — out of reach headlessly; edit rules instead |

## 4. RULE SHAPE (one rule)

```json
{
  "id": "FE8l6",
  "name": "Canvas boards",
  "icon": "lucide-layout-template",
  "color": "#8b5cf6",
  "match": "any",
  "conditions": [
    { "source": "extension", "operator": "is", "value": "canvas" }
  ],
  "enabled": true
}
```

- `source`: `extension` (file rules) or `name` (folder rules).
- `operator`: `is` / `contains` (per the live vault rulebook).
- `match`: `any` (any condition matches) — `all` is supported by the schema.
- `icon`: `lucide-*` names; `color`: hex.

## 5. GOTCHAS

- **Backup before every write.** Take a `.bak` copy of `data.json` before merging (the bundle's `merge_rules.py` pattern: backup → merge → write).
- **Merge, never replace.** Preserve every setting and rule not being changed; user-customized rules stay untouched.
- **Never downgrade the plugin.** Only the rulebook is (re)applied.
- **Re-read `data.json` before operating** — the user may have changed icons in-app since the last read.
- Render confirmation needs an in-app reload; the file-layer claim is verified by JSON round-trip only.
