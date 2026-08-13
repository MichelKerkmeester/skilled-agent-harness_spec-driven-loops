---
title: "Minimal Theme File-Layer Workflows"
description: "Safe file-layer recipes for the Minimal theme: verify the install, verify activation, propose snippet-based tweaks with backup discipline and validate at the file layer."
trigger_phrases:
  - "check minimal theme installed"
  - "check cssTheme active"
  - "propose css snippet"
  - "minimal theme snippet backup"
  - "validate minimal theme files"
  - "customize minimal theme"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Minimal Theme File-Layer Workflows

These recipes operate the Minimal theme at the file layer. The default posture is read-only: verify the package, verify activation and propose changes. The only write the AI performs in a real vault is a snippet file. Every snippet write starts with a backup.

## 1. OVERVIEW

### Operating sequence

1. Read the theme package and the appearance file.
2. Verify the theme folder and the `cssTheme` value.
3. For a customization request, propose the snippet CSS first.
4. On approval, back up, write the snippet and report the enable step.
5. Validate with the file-layer checks in section 6.

### Read-only defaults

- Reading `manifest.json`, `theme.css` and `appearance.json` is always safe.
- Writing `appearance.json` requires explicit approval and a backup.
- Writing `theme.css` or `manifest.json` is never done in a real vault.

---

## 2. VERIFY THE THEME IS INSTALLED

### Steps

1. List the theme folder.

```bash
ls /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/themes/Minimal/
```

2. Confirm the two expected files exist.

3. Read the manifest to report the installed version.

```bash
cat /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/themes/Minimal/manifest.json
```

### Before and after

Before, the folder may be absent or partial. After, the folder contains exactly `manifest.json` and `theme.css`.

| Check | Pass criteria |
| --- | --- |
| Folder exists | `themes/Minimal/` is a directory |
| Manifest present | `manifest.json` parses as JSON |
| Version field | `"version": "9.0.2"` in the installed copy |
| Stylesheet present | `theme.css` is non-empty |

Report the version verbatim from the manifest. Never guess the version.

---

## 3. VERIFY THE THEME IS ACTIVE

### Steps

1. Read the appearance file.

```bash
cat /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/appearance.json
```

2. Confirm the `cssTheme` key exists and equals `Minimal`.

3. Confirm a theme folder with the same name exists.

### Before and after

Before, the value may be missing, empty or pointing at another theme folder such as `Primary`. After, the value is exactly `Minimal`.

| Check | Pass criteria |
| --- | --- |
| File parses | `appearance.json` is valid JSON |
| Key exists | `cssTheme` is present |
| Value matches | `"cssTheme": "Minimal"` |
| Folder matches | `themes/Minimal/` exists with the exact name |

An exact match matters because this vault also holds a `Primary` theme folder.

---

## 4. PROPOSE A SNIPPET-BASED TWEAK

This is the main customization workflow. The AI proposes CSS, waits for approval, then writes with backup discipline.

### Steps

1. Read `appearance.json` to confirm the theme is active.
2. Check whether `.obsidian/snippets/` exists.
3. Identify the target CSS variables from the theme's `@settings` block in `theme.css`.
4. Draft the snippet with one logical change per file.
5. Show the user the proposed file and the enable step.
6. On approval, apply the snippet per section 5.
7. Tell the user the change renders after a reload.

### Example proposal

The user asks for smaller headings. The proposal reuses verified theme variables.

```css
/* Durable why: tighten heading sizes for dense reading */
body {
  --h1-size: 1.15em;
  --h2-size: 1.05em;
  --h3-size: 1em;
}
```

The variable names come from the installed `theme.css`. Do not propose variables that are absent from the file.

### Enable step

The snippet activates through Settings → Appearance → CSS snippets. The user adds the file there. The exact `appearance.json` key that records enabled snippets follows Obsidian's documented appearance format (VERIFY: this vault has no enabled snippet yet, so the key is not present to confirm on disk).

---

## 5. APPLY A SNIPPET WITH BACKUP DISCIPLINE

### Steps

1. Create the snippets folder if it is missing.

```bash
mkdir -p /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/snippets/
```

2. Back up any existing file with the same name.

```bash
cp snippet.css snippet.css.bak-$(date +%s)
```

3. Write the approved CSS to the snippet file.

4. Confirm the file is readable and non-empty.

5. Report the reload step to the user.

### Before and after

Before, the snippet file does not exist or holds the old content. After, the file holds the approved CSS and a timestamped backup exists when a previous version was replaced.

| Check | Pass criteria |
| --- | --- |
| Folder exists | `.obsidian/snippets/` is a directory |
| Backup exists | A `.bak-<timestamp>` copy exists when overwriting |
| File written | The snippet is non-empty and ends with a newline |
| CSS parses | Braces balance and selectors close |

The backup lives beside the snippet in the vault's `.obsidian` folder. Never place backups inside the vault's content folders.

---

## 6. VALIDATE AT THE FILE LAYER

### JSON validation

Every touched JSON file must parse.

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1])); print('ok')" \
  /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/appearance.json
```

Expected output is `ok`. A traceback means the file is corrupt and the diagnosis sequence in `troubleshooting.md` applies.

### CSS balance check

Count opening and closing braces in a snippet.

```bash
python3 -c "
s = open('snippet.css').read()
print('open', s.count('{'), 'close', s.count('}'))
"
```

Matching counts mean the block structure is sound. This is a syntax smoke check, not a render guarantee.

### Throwaway vault validation

For a new snippet, validate in a temporary vault before touching the live one. Create a scratch vault, copy the theme, enable the snippet there and confirm Obsidian renders without errors. The live vault stays untouched until the scratch vault passes.

### Re-read before concluding

Re-read `appearance.json` and the snippet after any write. The user may have changed settings in-app since the last read. Conclude only from the fresh state.

---

## 7. NEVER-OPERATIONS

- **Never edit `theme.css`.** The shipped artifact stays byte-identical.
- **Never edit `manifest.json`.** Version and identity stay untouched.
- **Never create a theme `data.json`.** Themes have no settings file.
- **Never overwrite an active snippet without a backup.** Backup first, write second.
- **Never report rendered pixels.** File-layer checks prove files and keys, not the rendered UI.
