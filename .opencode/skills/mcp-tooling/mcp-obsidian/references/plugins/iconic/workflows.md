---
title: "Iconic File-Layer Workflows"
description: "Safe file-layer recipes for Iconic: add/edit/disable rules, flip visibility toggles, change colors, and merge rulebooks with backup discipline."
trigger_phrases:
  - "add iconic rule"
  - "change icon color"
  - "iconic visibility toggle"
  - "merge iconic rulebook"
  - "iconic backup"
importance_tier: "normal"
contextType: "implementation"
version: 1.3.0.0
---

# Iconic File-Layer Workflows

These recipes edit `.obsidian/plugins/iconic/data.json`. Every operation starts with a fresh read and a backup; every write is a merge, never a replace.

---

## 1. OVERVIEW

### Operating sequence

1. Read `<vault>/.obsidian/plugins/iconic/data.json`.
2. Back up: `cp data.json data.json.bak-$(date +%s)`.
3. Apply the minimal merge (below).
4. Write + re-parse JSON.
5. Tell the user the icons render after an in-app reload.

## 2. RECIPES

### 2.1 Give an extension an icon (add a file rule)

- Append to `fileRules` (or edit the existing rule for that extension):

```json
{ "id": "gen<4chars>", "name": "PDF documents", "icon": "lucide-file-text", "color": "#ef4444", "match": "any", "conditions": [{ "source": "extension", "operator": "is", "value": "pdf" }], "enabled": true }
```

- Prefer editing the existing rule when one matches the extension — merging beats duplicating.

### 2.2 Change a color

- Find the rule by `name` or `conditions.value`, set `color` to the new hex, keep `id` and everything else.

### 2.3 Disable/enable a rule

- Flip the rule's `enabled` boolean. Do not delete the rule unless asked.

### 2.4 Flip a visibility toggle

- e.g. `showAllFolderIcons` → `true` / `false`, or `showTagPillIcons`. Single-key merge.

### 2.5 Apply a rulebook (bundle pattern)

- Same as the Iconic-Setup `merge_rules.py`: back up, then merge ONLY the `fileRules`/`folderRules` arrays (and any explicitly requested keys) into the existing file, preserving user settings.

### 2.6 Add a folder rule

- Append to `folderRules` with `source: name` conditions (`is` for exact names, `contains` for partial):

```json
{ "id": "gen<4chars>", "name": "Screenshots", "icon": "lucide-camera", "color": "#64748b", "match": "any", "conditions": [{ "source": "name", "operator": "is", "value": "screenshots" }], "enabled": true }
```

## 3. VERIFYING

- Re-parse the written JSON; confirm the changed rule/toggle reads back.
- Confirm no unrelated keys changed (diff against the backup).
- Rendering itself is in-app; state that the reload is the user's step.
