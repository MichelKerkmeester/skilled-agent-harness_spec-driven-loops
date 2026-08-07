---
title: "Outliner File-Layer Workflows"
description: "Numbered operational workflows for the Outliner plugin: verify installation, read settings, validate schema, modify with backup discipline, reset, restore and inspect list markdown."
trigger_phrases:
  - "outliner workflows"
  - "outliner settings edit"
  - "outliner backup settings"
  - "outliner validate settings"
  - "outliner enable drag drop"
  - "outliner restore data json"
importance_tier: "normal"
contextType: "implementation"
version: "0.10.0.0"
---

# Outliner File-Layer Workflows

Every operation below runs at the file layer. The mode cannot drive the Obsidian UI headlessly, so all changes happen in `data.json` and take effect after Obsidian reloads the plugin.

## 1. WORKFLOW DISCIPLINE

- Backup before every write.
- Read `data.json` fresh before any merge.
- Write the smallest change that satisfies the request.
- Verify by re-reading the written file.
- Leave no stray files behind.

Backup name convention: `data.json.bak-YYYYMMDD-HHMMSS` in the same folder.

## 2. VERIFY INSTALLATION AND VERSION

1. Read `<vault>/.obsidian/plugins/obsidian-outliner/manifest.json`.
2. Record `version` and `minAppVersion`.
3. Read `<vault>/.obsidian/community-plugins.json`.
4. Confirm `obsidian-outliner` is listed.

Checkpoint: the recorded version matches the manifest exactly and the plugin is enabled. Expected in the active vault: version 4.10.2, minimum 1.11.7, enabled.

## 3. READ CURRENT SETTINGS

1. Check whether `<vault>/.obsidian/plugins/obsidian-outliner/data.json` exists.
2. If absent, report that defaults apply.
3. If present, read it and note the plugin folder listing.

Checkpoint: the read result states file presence and the parsed JSON or the default values. In the active vault the file is absent, so defaults apply.

## 4. VALIDATE SETTINGS

1. Parse `data.json` as JSON.
2. Check every key against the schema in `data-model.md`.
3. Check every enum value for `stickCursor` and `listLineAction`.
4. Flag unknown keys as inert but reportable.

Before:

```json
{
  "stickCursor": "sometimes",
  "listLineAction": "spin",
  "dnd": true
}
```

After:

```json
{
  "stickCursor": "bullet-and-checkbox",
  "listLineAction": "toggle-folding",
  "dnd": true
}
```

Checkpoint: every key is known and every enum value is valid.

## 5. MODIFY A SETTING

Example: enable vertical indentation lines while keeping the click action on folding. The `zoom-in` action would need the Zoom plugin, which the active vault does not have.

1. Back up `data.json` to `data.json.bak-<timestamp>`.
2. Read `data.json` fresh.
3. Change only the target keys.
4. Write the merged file.
5. Re-read and compare.

Before:

```json
{
  "listLines": false,
  "listLineAction": "toggle-folding",
  "dnd": true
}
```

After:

```json
{
  "listLines": true,
  "listLineAction": "toggle-folding",
  "dnd": true
}
```

Checkpoint: the diff touches only the target keys and the backup exists.

## 6. RESET A SETTING TO DEFAULT

1. Back up `data.json`.
2. Remove the key or set it to the schema default.
3. Write and re-read.

Before: `"dnd": false`. After: the key is removed, or `"dnd": true`.

Checkpoint: the resulting file equals the schema default for that key.

## 7. RESTORE FROM BACKUP

1. List `data.json.bak-*` files newest first.
2. Diff the newest backup against the current file.
3. Copy the chosen backup over `data.json`.
4. Re-read and confirm JSON validity.

Checkpoint: the restored file parses and matches the backup byte for byte.

## 8. INSPECT LIST MARKDOWN COMPATIBILITY

Read-only check on a note the user reports as misbehaving.

1. Open the note and inspect the list block.
2. Check consistent indentation using the vault default indent characters.
3. Check task markers use `[ ]` for open and `[x]` for done.
4. Check for mixed tab and space indentation within one list.

Before (mixed indentation):

```markdown
- Plan the release
  - Write the notes
	- Review dates
```

After (consistent):

```markdown
- Plan the release
  - Write the notes
  - Review dates
```

Checkpoint: the list uses one indent character throughout and valid task markers. This is note hygiene, not a plugin transformation.

## 9. MAP INTENT TO SETTINGS

The mode cannot run in-app commands, so it translates user intent into settings where possible.

| User intent | Setting change | Gate |
| --- | --- | --- |
| Keep the cursor out of checkboxes | `stickCursor: "bullet-and-checkbox"` | none |
| Tab indents like other outliners | `betterTab: true` | none |
| Enter continues lists like other outliners | `betterEnter: true` | none |
| Move items by drag and drop | `dnd: true` | none |
| Draw guide lines under lists | `listLines: true` | none |
| Click a line to zoom | `listLineAction: "zoom-in"` | Zoom plugin installed |
| Click a line to fold | `listLineAction: "toggle-folding"` | core folding enabled |

Checkpoint: every proposed change uses only documented keys and respects the dependency gate.

## 10. POST-WRITE VERIFICATION

1. Re-read the written `data.json`.
2. Confirm the JSON parses.
3. Confirm only intended keys changed.
4. Confirm the backup exists and no stray temp files remain.

Checkpoint: file valid, diff scoped, backup present, plugin folder clean.

## 11. PLUGIN RELOAD AND SIDE EFFECTS

- Obsidian reads plugin `data.json` when the plugin loads.
- In-app setting changes write the file back through the plugin storage.
- The mode cannot trigger an in-app reload. Tell the user to reload Obsidian or restart the plugin.
- A reloaded plugin never rewrites note content, so reloads are safe for notes.
- A concurrent in-app change can overwrite a file-layer write. Warn the user not to change settings during an edit.
- Re-read `data.json` after any user action before merging again.
