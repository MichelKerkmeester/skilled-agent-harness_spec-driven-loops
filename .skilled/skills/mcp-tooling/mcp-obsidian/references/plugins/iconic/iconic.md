---
title: "Iconic File-Layer Index"
description: "Lean entry point for operating the Iconic Obsidian plugin (gfxholo/iconic) through its single data.json rulebook in the vault."
trigger_phrases:
  - "iconic obsidian plugin"
  - "iconic data json"
  - "iconic ruleset"
  - "full icon ruleset"
  - "icon rules file layer"
  - "folder icon colors"
importance_tier: "normal"
contextType: "implementation"
version: 0.7.2.0
---

# Iconic Plugin Index (`iconic`)

Open this first when a request touches Iconic. It maps the file-layer surface and names the companion reference that answers the next question.

---

## 1. OVERVIEW

### Purpose

The `mcp-obsidian` mode operates this plugin by **editing its `data.json` rulebook**, never by driving the icon-picker UI.

### When to Use

- A request names Iconic, an icon, a folder color, or an icon rule.
- Choosing between a rule, a visibility toggle, and a per-item override.
- Checking a rule's shape before merging it into a vault.

---

## 2. IDENTITY

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Obsidian plugin ID | `iconic` | Plugin directory name + enablement entry |
| Display name | **Iconic** | Current manifest name |
| Plugin repository | [`gfxholo/iconic`](https://github.com/gfxholo/iconic) | Source of behavior facts |
| Version installed | 1.1.10 (all 3 vaults) | Verified on-disk |
| State file | `<vault>/.obsidian/plugins/iconic/data.json` | The ENTIRE configuration surface |

---

## 3. WHAT IT DOES

Customizes icons and their colors directly in the Obsidian UI.

- **Surfaces:** tabs, files & folders, bookmarks, tags, properties, and ribbon commands.
- **Matching:** rules match by file extension or folder name; per-item overrides exist for individual icons.
- **Rendering:** in-app; the mode touches only the JSON.

---

## 4. FILE-LAYER SURFACE (WHAT THE AI EDITS)

| Layer | Path / artifact | Operable by AI |
|---|---|---|
| Rulebook + settings | `.obsidian/plugins/iconic/data.json` | **Yes** — toggles, colors, `fileRules`/`folderRules`, per-item icon maps |
| Enablement | `.obsidian/community-plugins.json` | Yes (already enabled in all vaults) |
| In-app icon picking | — | **No** — out of reach headlessly; edit rules instead |

### Rulebook assets

| Asset | Contents | Use |
| --- | --- | --- |
| `assets/plugins/iconic/iconic-rules.full.json` | **Complete** automatic-rule payload: all 21 `fileRules` + 11 `folderRules` | Canonical copy/merge payload — the only authoritative full rule content |
| `assets/plugins/iconic/iconic-rules.full.md` | Template-conformant usage guide: rule-class coverage + merge contract | Usage companion for the payload; never a copy/merge source |
| `assets/plugins/iconic/iconic-rules.example.json` | Compact schema sample (2 file + 1 folder rules) | Schema reference only |

- The full asset contains **only the two mergeable rule arrays** — no `data.json` settings, no `dialogState`, no per-item override maps.
- It is **never a whole-`data.json` replacement**: merge it by stable rule `id` into a freshly-read vault `data.json` (update matching ids, append missing ids), preserving unrelated settings and user overrides.

---

## 5. RULE SHAPE (ONE RULE)

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

---

## 6. GOTCHAS

- **Backup before every write.** Take a `.bak` copy of `data.json` before merging (the bundle's `merge_rules.py` pattern: backup → merge → write).
- **Merge, never replace.** Preserve every setting and rule not being changed; user-customized rules stay untouched.
- **Full asset ≠ full `data.json`.** The canonical rule asset carries only the two rule arrays; applying it never touches settings, `dialogState`, or per-item overrides.
- **Never downgrade the plugin.** Only the rulebook is (re)applied.
- **Re-read `data.json` before operating** — the user may have changed icons in-app since the last read.
- Render confirmation needs an in-app reload; the file-layer claim is verified by JSON round-trip only.

---

## 7. RELATED RESOURCES

| File | Use it for |
| --- | --- |
| `data-model.md` | The full `data.json` contract: top-level keys, rulebook schema, visibility toggles, per-item icon maps, and safe-merge discipline |
| `workflows.md` | Safe recipes: add or edit rules, flip toggles, change colors, and merge the canonical rulebook |
| `troubleshooting.md` | Cause, detection, and recovery for invalid JSON, lost rules, missing icons, stale reads, and version drift |
