---
title: "Outliner File-Layer Data Model"
description: "Complete settings schema for the Outliner plugin: storage keys, defaults, value enums, the no-note-format contract and the dependency contract."
trigger_phrases:
  - "outliner data model"
  - "outliner data json"
  - "outliner settings schema"
  - "outliner stickCursor"
  - "outliner listLineAction"
  - "outliner zoom dependency"
importance_tier: "normal"
contextType: "implementation"
version: "0.10.0.0"
---

# Outliner File-Layer Data Model

Outliner stores configuration only. Its whole file-layer contract is one optional settings file plus enablement.

## 1. OVERVIEW

### Canonical identity

| Identity field | Current value |
| --- | --- |
| Obsidian plugin ID | obsidian-outliner |
| Display name | Outliner |
| Plugin repository | vslinko/obsidian-outliner |
| Installed version | 4.10.2 (active vault) |
| Author | Viacheslav Slinko |

### Core contract

- Settings live at `<vault>/.obsidian/plugins/obsidian-outliner/data.json`.
- The plugin has no note format and writes no content into notes.
- The plugin merges loaded settings over its defaults on startup.
- The active vault has no `data.json`, so all defaults apply.
- The plugin folder contains `main.js`, `manifest.json` and `styles.css` only.

---

## 2. SETTINGS CONTRACT

The plugin loads settings with `Object.assign({}, DEFAULT_SETTINGS, loadedData)`. A missing key falls back to its default. A partial `data.json` is valid. An unknown key is stored but never read, so it is inert.

| Storage key | Default | Type or values | Notes |
| --- | --- | --- | --- |
| `stickCursor` | `bullet-and-checkbox` | `never`, `bullet-only`, `bullet-and-checkbox` | Cursor sticking mode |
| `betterTab` | `true` | boolean | Enhance the Tab key |
| `betterEnter` | `true` | boolean | Enhance the Enter key |
| `betterVimO` | `true` | boolean | Vim-mode `o` and `O` insert bullets |
| `selectAll` | `true` | boolean | Enhanced select-all |
| `styleLists` | `true` | boolean | Improved list styles |
| `listLines` | `false` | boolean | Vertical indentation lines |
| `listLineAction` | `toggle-folding` | `none`, `zoom-in`, `toggle-folding` | Click action on vertical lines |
| `dnd` | `true` | boolean | Drag and drop |
| `debug` | `false` | boolean | Debug mode |
| `previousRelease` | `null` | string or null | Release bookkeeping |

Legacy values `true` and `false` for `stickCursor` map to `bullet-and-checkbox` and `never`. The plugin keeps this mapping for users migrating from an older version.

---

## 3. SETTINGS SCHEMA DETAIL

### `stickCursor`

Type: string. Values: `never`, `bullet-only`, `bullet-and-checkbox`. Default: `bullet-and-checkbox`.

Controls whether the cursor can land on bullet markers or checkbox markers. The settings UI calls it "Stick the cursor to the content" with the description "Don't let the cursor move to the bullet position." The `bullet-and-checkbox` value extends the stick to checkbox markers as well.

### `betterTab`

Type: boolean. Default: `true`.

Makes Tab and Shift+Tab behave the same as other outliners. The plugin runs an indent operation on Tab when this is on and no IME composition is active.

### `betterEnter`

Type: boolean. Default: `true`.

Makes the Enter key behave the same as other outliners. The plugin runs its Enter handling when this is on and no IME composition is active.

### `betterVimO`

Type: boolean. Default: `true`.

Creates a bullet when pressing `o` or `O` in Vim mode.

### `selectAll`

Type: boolean. Default: `true`.

Enhances the Ctrl+A or Cmd+A behavior. One press selects the current list item. A second press selects the entire list.

### `styleLists`

Type: boolean. Default: `true`.

Improves the style of lists. The settings UI warns that the styles only work with built-in Obsidian themes and may not fit other themes.

### `listLines`

Type: boolean. Default: `false`.

Draws vertical indentation lines under list items. The line click action is controlled by `listLineAction`.

### `listLineAction`

Type: string. Values: `none`, `zoom-in`, `toggle-folding`. Default: `toggle-folding`.

Sets what happens when a vertical indentation line is clicked. The `zoom-in` value needs the separate Zoom plugin. The `toggle-folding` value folds or unfolds the subtree and needs the core editor setting "Fold indent".

### `dnd`

Type: boolean. Default: `true`.

Enables drag and drop of list items. The plugin places moved items using the vault default indent characters.

### `debug`

Type: boolean. Default: `false`.

Turns on debug logging. The settings UI directs the user to DevTools to copy debug logs.

### `previousRelease`

Type: string or null. Default: `null`.

Bookkeeping for update notices. It is not user-configurable. Never set it.

---

## 4. NOTE-FORMAT CONTRACT

- None. Outliner defines no note format and writes nothing to notes.
- The plugin parses standard Markdown list items in the editor, including task list items with `[ ]` or `[x]` markers.
- Plugin operations use the vault default indent characters for new indentation.
- When the plugin rewrites list lines during an operation, it preserves existing task markers and text content.
- Fold state lives in Obsidian session state, not in note text (VERIFY per Obsidian version).

---

## 5. DEPENDENCY CONTRACT

### Zoom plugin

- `window.ObsidianZoomPlugin` comes from the separate Zoom plugin.
- Zoom in, zoom out and the `zoom-in` line action work only when that plugin is installed.
- The active vault does not list the Zoom plugin in `community-plugins.json`, so zoom features are unavailable there (VERIFY per vault).

### Obsidian core folding

- The fold and unfold commands show a notice and abort when the core editor setting "Fold indent" is off.
- The `toggle-folding` line action depends on the same core setting.

### IME composition

- The Tab and Enter overrides skip while an input method editor is composing text.
- This is deliberate, so typing with an IME never triggers list operations.

---

## 6. WHAT THE AI MUST NOT DO

- Never invent settings keys or values beyond this schema.
- Never write `data.json` without a backup first.
- Never drop unrelated keys when merging a change.
- Never claim zoom behavior without checking the Zoom plugin in the vault.
- Never assert keyboard shortcuts beyond the confirmed defaults.
- Never edit `main.js` or `styles.css`.
- Never fabricate note formats or data artifacts that the plugin does not have.

---

## 7. EXAMPLE FILE STATES

### Defaults snapshot

A fresh install with no `data.json` behaves as if this object were loaded:

```json
{
  "styleLists": true,
  "debug": false,
  "stickCursor": "bullet-and-checkbox",
  "betterEnter": true,
  "betterVimO": true,
  "betterTab": true,
  "selectAll": true,
  "listLines": false,
  "listLineAction": "toggle-folding",
  "dnd": true,
  "previousRelease": null
}
```

### Minimal valid partial file

Missing keys fall back to defaults. This file is valid and complete in effect:

```json
{
  "listLines": true,
  "dnd": false
}
```

### Legacy stickCursor values

Older plugin versions wrote booleans. Both forms are still read correctly:

```json
{
  "stickCursor": true,
  "dnd": true
}
```

`true` maps to `bullet-and-checkbox` and `false` maps to `never`.
