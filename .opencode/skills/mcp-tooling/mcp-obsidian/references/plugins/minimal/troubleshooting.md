---
title: "Minimal Theme File-Layer Troubleshooting"
description: "Failure modes for the Minimal theme: missing package, inactive cssTheme, snippet syntax errors, disabled snippets, stale reads and theme-versus-plugin confusion, with named validation checkpoints."
trigger_phrases:
  - "minimal theme not applying"
  - "obsidian cssTheme not working"
  - "css snippet not showing"
  - "minimal theme missing"
  - "obsidian theme broke"
  - "minimal theme looks wrong"
importance_tier: "normal"
contextType: "implementation"
version: 0.10.0.0
---

# Minimal Theme File-Layer Troubleshooting

Diagnose the package, the activation key and the snippet separately. A valid install can still render nothing when the `cssTheme` value is wrong, the theme folder name mismatches or Obsidian has not reloaded. Start from the file layer and never guess a version.

## 1. OVERVIEW

| Symptom | Most likely cause |
| --- | --- |
| Default theme shows instead of Minimal | `cssTheme` missing, empty or pointing at another folder |
| Theme does nothing visually | `theme.css` missing or Obsidian needs a full restart |
| Version unknown or odd | Stale read of `manifest.json` or a hand-edited manifest |
| A tweak has no effect | Snippet file not created, not enabled or syntactically invalid |
| Theme looks broken after an update | Stale theme cache or a partial theme folder |
| User expects settings | Confusion between theme and plugin or a missing companion plugin |
| Settings panel missing | Companion plugin not installed. The theme alone exposes no settings |

## 2. DIAGNOSIS SEQUENCE

Run these checks in order. Each check is a named validation checkpoint from section 4.

### Check the theme package

```bash
ls /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/themes/Minimal/
```

Expect `manifest.json` and `theme.css`. A missing folder or a missing file fails the **Theme package present** checkpoint.

### Check the manifest

```bash
cat /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/themes/Minimal/manifest.json
```

Expect valid JSON with `"version": "9.0.2"`. A parse failure fails the **Manifest readable** checkpoint.

### Check activation

```bash
cat /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/appearance.json
```

Expect `"cssTheme": "Minimal"`. Any other value fails the **Activation set** and **Value matches folder** checkpoints.

### Check folder name exactness

```bash
ls /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/themes/
```

Expect `Minimal` and `Primary`. A spelling drift in either the folder or the key fails the **Value matches folder** checkpoint.

### Check snippet state

```bash
ls -la /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/snippets/
```

An empty or missing folder fails the **Snippet file valid** and **Snippet registered** checkpoints.

### Check the appearance file parses

```bash
python3 -c "import json,sys; json.load(open(sys.argv[1])); print('ok')" \
  /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/appearance.json
```

Expected output is `ok`. A traceback fails the **Appearance file parses** checkpoint.

### Check snippet syntax

```bash
python3 -c "
s = open('/Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/snippets/example.css').read()
print('open', s.count('{'), 'close', s.count('}'))
"
```

Adjust the filename to the real snippet. Matching counts pass the **Snippet file valid** checkpoint. A snippet with unbalanced braces never applies.

## 3. RECOVERY

| Problem | Fix |
| --- | --- |
| `cssTheme` missing or empty | Set the key to `Minimal` in `appearance.json` after a backup or instruct the user to pick the theme in Settings → Appearance → Themes |
| Value mismatch | Align the key with the real folder name. This vault uses `Minimal` |
| Theme folder missing | Reinstall from the community themes list or copy the package from another vault |
| Partial theme folder | Replace the folder with a complete package and restart Obsidian |
| Snippet file invalid CSS | Fix the brace balance, then reload |
| Snippet not applying | Confirm the snippet is enabled in Settings → Appearance → CSS snippets, then restart |
| Stale appearance | Re-read `appearance.json` and the snippet before concluding. The user may have changed settings in-app |
| Render still stale after fixes | Ask the user to fully quit and reopen Obsidian |
| User asks for theme settings | Explain the theme has no settings. Propose a snippet or the optional companion plugins |

### Restore discipline

Any `appearance.json` write starts with a timestamped backup.

```bash
cp appearance.json appearance.json.bak-$(date +%s)
```

Snippet files follow the same rule. The backup lives beside the original inside `.obsidian`.

### Prevention

- Keep the theme package untouched so updates install cleanly.
- Keep every tweak in a named snippet with a timestamped backup.
- Re-read `appearance.json` before every conclusion about activation.
- Ask the user to restart Obsidian after any snippet change before diagnosing a render issue.

## 4. NAMED VALIDATION CHECKPOINTS

Use these named checkpoints in every diagnosis. They are descriptive names, not tracking ids.

| Checkpoint | Check | Pass criteria |
| --- | --- | --- |
| Theme package present | `ls themes/Minimal/` | Both `manifest.json` and `theme.css` exist |
| Manifest readable | `cat manifest.json` | Parses as JSON, version reads `9.0.2` |
| Activation set | `cat appearance.json` | `cssTheme` key exists |
| Value matches folder | Compare key to folder listing | Key equals a real theme folder name |
| Appearance file parses | JSON parse of `appearance.json` | Parse succeeds with `ok` output |
| Snippet file valid | Brace count on the snippet | Opening and closing counts match |
| Snippet registered | Snippet enabled in Settings → Appearance → CSS snippets | Snippet listed as enabled |

A diagnosis reports the failing checkpoint by name and the fix from section 3. A clean diagnosis names every checkpoint as passed.

### Run the full sweep

```bash
ls /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/themes/Minimal/
cat /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/themes/Minimal/manifest.json
cat /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/appearance.json
ls /Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian/themes/
```

Read every output line. A clean sweep shows two theme files, version `9.0.2`, `cssTheme` set to `Minimal` and the theme folders listed. Report each checkpoint as passed only when its output matches.

## 5. LIMITS

- The AI cannot verify rendered pixels. File-layer checks end at valid JSON, present files and exact key values.
- The theme has no `data.json` and no settings keys. Do not look for either.
- Companion plugins are absent in this vault. Do not claim their settings exist.
- `theme.css` is never edited in a real vault, including as a recovery step.
- A hand-edited `manifest.json` version makes version checks unreliable. Report what the file says and flag the edit.
- A snippet the user edited by hand may hold changes the AI did not make. Re-read it before proposing edits.
