---
title: "Outliner File-Layer Index"
description: "Entry point for operating the Outliner Obsidian plugin through its minimal data.json settings surface and its editor-behavior contract."
trigger_phrases:
  - "outliner plugin index"
  - "obsidian outliner reference"
  - "outliner file layer"
  - "outliner settings"
  - "outliner commands"
  - "outliner list editing"
importance_tier: "normal"
contextType: "implementation"
version: "0.10.0.0"
---

# Outliner Plugin Index (`obsidian-outliner`)

The `mcp-obsidian` mode operates this plugin by reading and validating its settings file. The plugin is editor behavior only. It never writes content into notes, so the mode never edits notes on the plugin's behalf.

## 1. IDENTITY

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Obsidian plugin ID | `obsidian-outliner` | Plugin directory name and enablement entry |
| Display name | **Outliner** | Current manifest name |
| Plugin repository | [`vslinko/obsidian-outliner`](https://github.com/vslinko/obsidian-outliner) | Source of behavior facts |
| Author | Viacheslav Slinko (`vslinko`) | Maintainer identity |
| Version installed | 4.10.2 | Verified from manifest.json in the active vault |
| Minimum Obsidian version | 1.11.7 | Older Obsidian builds do not load the plugin |
| Enabled | Yes | `community-plugins.json` lists `obsidian-outliner` |
| State file | `<vault>/.obsidian/plugins/obsidian-outliner/data.json` | The only settings surface |

---

## 2. WHAT IT DOES

Outliner makes list editing behave like Workflowy or RoamResearch. It changes editor interactions: folding and unfolding subtrees, moving list items with their sublists, indenting and outdenting, drag and drop, cursor behavior around bullets and checkboxes, Enter and Tab handling, Vim-mode `o` and `O` bullet insertion, extended select-all, smart Backspace at line content starts, vertical indentation lines and a system info dialog.

All of these are in-app behaviors. The plugin holds no note format and stores no data in notes.

### Behaviors in detail

- Folding: fold and unfold the subtree under the cursor line.
- Moving: move a list item and its sublists up or down.
- Indentation: indent and outdent a list item with its sublists.
- Drag and drop: drag an item to a new position in the list tree.
- Cursor stick: keep the cursor on content, away from bullets and checkboxes.
- Enter and Tab: list-friendly Enter and Tab behavior.
- Vim: `o` and `O` insert a bullet in Vim mode.
- Select-all: one press selects the current item, two presses select the whole list.
- Backspace: Meta+Backspace deletes back to the start of the line content.
- Vertical lines: indentation guides with a configurable click action.
- System info: a modal with version and environment details.

### What it does NOT do

- It does not store data in notes.
- It does not define a note format.
- It does not generate charts, databases or other artifacts.
- It does not zoom on its own. Zoom behavior needs the separate Zoom plugin.

---

## 3. FILE-LAYER SURFACE

| Layer | Path or artifact | Operable by AI |
| --- | --- | --- |
| Settings | `<vault>/.obsidian/plugins/obsidian-outliner/data.json` | **Yes** |
| Enablement | `<vault>/.obsidian/community-plugins.json` | Read-only confirmation |
| Note content | Any note in the vault | **No** |
| Plugin code | `main.js`, `styles.css` | **No** |

The active vault plugin folder contains only `main.js`, `manifest.json` and `styles.css`. There is no `data.json`, so every setting uses its default value.

---

## 4. SETTINGS AT A GLANCE

| Storage key | Default | Meaning |
| --- | --- | --- |
| `stickCursor` | `bullet-and-checkbox` | Keep the cursor out of bullets and checkboxes |
| `betterTab` | `true` | Enhance the Tab key |
| `betterEnter` | `true` | Enhance the Enter key |
| `betterVimO` | `true` | Vim-mode `o` and `O` insert bullets |
| `selectAll` | `true` | Enhanced select-all behavior |
| `styleLists` | `true` | Improved list styling |
| `listLines` | `false` | Draw vertical indentation lines |
| `listLineAction` | `toggle-folding` | Click action on vertical lines |
| `dnd` | `true` | Drag and drop of list items |
| `debug` | `false` | Debug mode |
| `previousRelease` | `null` | Release bookkeeping, leave untouched |

Settings live in one file only. The plugin merges loaded values over its defaults, so a partial file is valid. The full schema with value enums lives in `data-model.md`.

---

## 5. COMMANDS AT A GLANCE

| Command id | Command name | Default hotkey |
| --- | --- | --- |
| `fold` | Fold the list | Mod+ArrowUp |
| `unfold` | Unfold the list | Mod+ArrowDown |
| `move-list-item-up` | Move list and sublists up | Mod+Shift+ArrowUp |
| `move-list-item-down` | Move list and sublists down | Mod+Shift+ArrowDown |
| `indent-list` | Indent the list and sublists | none |
| `outdent-list` | Outdent the list and sublists | none |
| `system-info` | Show System Info | Mod+Shift+Alt+I |

`Mod` means Command on macOS and Control on Windows and Linux. These are the plugin defaults read from `main.js`. Users can rebind them in Obsidian hotkey settings, so never assert a hotkey as permanent.

---

## 6. WHEN TO USE THIS REFERENCE SET

Use this set when the task names Outliner or obsidian-outliner, when a user reports list-editing behavior that the plugin owns, or when the mode must read or change plugin settings.

- Read or validate `data.json`.
- Toggle a documented setting with backup discipline.
- Diagnose fold, drag and drop, zoom or Enter and Tab complaints.
- Answer list-editing capability questions at the behavior level.
- Explain why a setting change needs a plugin reload.

Do not use this set for note content transformations. The plugin does not own a note format, so list edits in notes are plain markdown editing.

---

## 7. SIBLING REFERENCES

| File | Purpose |
| --- | --- |
| `data-model.md` | Exact settings schema, value enums, dependency contract |
| `workflows.md` | Numbered read, validate, modify and restore operations |
| `troubleshooting.md` | Failure modes and named validation checkpoints |

---

## 8. VERIFY ZONES

- Zoom features need the separate Zoom plugin. The active vault does not have it. Check `community-plugins.json` before claiming zoom behavior (VERIFY per vault).
- The fold commands need the Obsidian core setting "Fold indent" enabled.
- Default hotkeys can be rebound by the user (VERIFY per vault).
- IME composition pauses the Tab and Enter overrides, which users may read as a defect.

---

## 9. OPERATING BOUNDARY

The mode works at the file layer. In-app interactions are out of reach headlessly.

| Interaction | Where it happens | Mode access |
| --- | --- | --- |
| Fold, unfold, move, drag and drop | Editor | No, in-app only |
| Hotkey rebinding | Obsidian settings | No, user action |
| System info dialog | Plugin modal | No, user action |
| Settings toggles | `data.json` | **Yes** |
| Enablement | `community-plugins.json` | Read-only |

Behavior claims need the user to confirm in-app results. The file-layer proof is the JSON round trip.

---

## 10. GROUND TRUTH PROVENANCE

Verified on disk during this reference authoring:

- Version 4.10.2 from `manifest.json`.
- Minimum Obsidian version 1.11.7 from `manifest.json`.
- All settings keys and defaults from the `DEFAULT_SETTINGS` block in `main.js`.
- All command ids and default hotkeys from `addCommand` registrations in `main.js`.
- No `data.json` in the active vault, so defaults apply.
- Zoom plugin absent from `community-plugins.json`.

Anything not verified here is marked VERIFY in the sibling files.
