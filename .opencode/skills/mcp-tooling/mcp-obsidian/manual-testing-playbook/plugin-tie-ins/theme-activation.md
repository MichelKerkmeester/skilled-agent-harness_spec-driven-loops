---
title: "OBS-021 -- theme-activation"
description: "This scenario validates the Obsidian theme system at the file layer: recreate a community theme package in a throwaway vault, activate it through the cssTheme key, layer a customization snippet with backup discipline, and verify all three layers. Minimal is used as the concrete example theme."
stage: routing
version: 0.11.0.0
---

# OBS-021 -- theme-activation

## 1. OVERVIEW

This scenario validates that the mode can operate the Obsidian theme system at the file layer, using Minimal as the concrete example theme: a theme package is copied into a throwaway vault, activation is set through the `cssTheme` key in `appearance.json`, one CSS snippet is proposed and written with backup discipline, and every layer is verified with headless checks. Rendering itself is in-app and only observable with a reload.

### Why This Matters

A theme is pure file layer: the package under `.obsidian/themes/<name>/`, the `cssTheme` activation key in `appearance.json`, and the customization snippets in `.obsidian/snippets/`. If the mode can recreate that layer for any community theme in a throwaway vault without touching a real vault — and customize through a snippet rather than the theme's own `theme.css` — theme operations are fully delegated to vault files.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-021
- Feature Name: theme install and activation
- Scenario Objective: Recreate a community theme's file layer in a throwaway vault at `/tmp/_pbtest-theme-activation` (Minimal as the example theme), activate it through `cssTheme` in `appearance.json`, write one customization snippet with backup discipline, and verify the package, the activation and the snippet.
- Exact Prompt: Set up the Minimal theme in my vault and make the headings smaller with a snippet, backing up anything you change.
- Exact Command Sequence: 1. Create the throwaway vault 2. Copy `theme.css` + `manifest.json` from the real vault (read-only source) 3. Write `appearance.json` with `cssTheme` set to the theme name 4. Write the snippet with a timestamped backup 5. Verify the manifest, the activation and the snippet 6. Remove the throwaway vault
- Expected Signals: The theme manifest parses, `appearance.json` parses with `cssTheme` equal to the theme folder name, the snippet is non-empty with balanced braces and a timestamped backup exists.
- Evidence: File listing, jq outputs, brace counts, backup path.
- Pass/Fail Criteria: PASS if all three layers verify and the throwaway vault is removed; FAIL if any file fails to parse, `cssTheme` mismatches the theme folder or the real vault is written.
- Failure Triage: 1. Recreate the throwaway vault from scratch. 2. Re-check the file paths against the theme references. 3. Re-run on a fresh copy.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Run everything against the throwaway vault at `/tmp/_pbtest-theme-activation`. The real vault path appears only as the read-only copy source for the example theme package. Never write into a real vault during the test.

### Prompt

Set up the Minimal theme in my vault and make the headings smaller with a snippet, backing up anything you change.

### Commands

1. Create the throwaway vault and copy the example theme package from the real vault.

   ~~~sh
   VB=/tmp/_pbtest-theme-activation
   SRC=/Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian
   THEME=Minimal
   rm -rf "$VB"
   mkdir -p "$VB/.obsidian/themes/$THEME" "$VB/.obsidian/snippets"
   cp "$SRC/themes/$THEME/theme.css" "$VB/.obsidian/themes/$THEME/theme.css"
   cp "$SRC/themes/$THEME/manifest.json" "$VB/.obsidian/themes/$THEME/manifest.json"
   ls -la "$VB/.obsidian/themes/$THEME/"
   ~~~

2. Activate the theme through `appearance.json`.

   ~~~sh
   printf '{\n  "cssTheme": "Minimal"\n}\n' > "$VB/.obsidian/appearance.json"
   python3 -m json.tool "$VB/.obsidian/appearance.json" >/dev/null
   jq -e '.cssTheme == "Minimal"' "$VB/.obsidian/appearance.json"
   ~~~

3. Propose and write one customization snippet with backup discipline.

   ~~~sh
   SNIP="$VB/.obsidian/snippets/example-heading-tighten.css"
   cat > "$SNIP" <<'EOF'
   /* Example snippet: tighten heading sizes for dense reading.
      Override the theme's CSS variables from a snippet, not theme.css. */
   body {
     --h1-size: 1.15em;
     --h2-size: 1.05em;
   }
   EOF
   cp "$SNIP" "$SNIP.bak-$(date +%s)"
   cat > "$SNIP" <<'EOF'
   body {
     --h1-size: 1.15em;
     --h2-size: 1.05em;
     --h3-size: 1em;
   }
   EOF
   ~~~

4. Verify all three layers.

   ~~~sh
   python3 -m json.tool "$VB/.obsidian/themes/Minimal/manifest.json" >/dev/null && echo "manifest parses"
   jq -e '.name == "Minimal"' "$VB/.obsidian/themes/Minimal/manifest.json"
   test -s "$VB/.obsidian/themes/Minimal/theme.css" && echo "theme.css non-empty"
   python3 -c "
   s = open('$VB/.obsidian/snippets/example-heading-tighten.css').read()
   print('open', s.count('{'), 'close', s.count('}'))
   "
   ls "$VB/.obsidian/snippets/" | rg '\.bak-'
   ~~~

5. Cleanup and confirm the throwaway vault is gone.

   ~~~sh
   rm -rf "$VB"
   test ! -e /tmp/_pbtest-theme-activation && echo "throwaway removed"
   ~~~

### Grading

| Verdict | Criteria |
|---|---|
| PASS | Manifest parses and its `name` matches the theme folder, `cssTheme` equals the theme folder name, the snippet has balanced braces and a backup exists, the throwaway vault is removed and the real vault is untouched |
| FAIL | Any parse error, `name`/folder mismatch, `cssTheme` mismatch, missing backup or a real vault file modified |
| SKIP | No source theme package available at the real vault path |

---

## 4. CLEANUP

The test owns one directory, `/tmp/_pbtest-theme-activation`. Remove it with `rm -rf` after the run and verify the path is gone. The real vault files were only ever read as copy sources. The snippet enablement step is an in-app action (Settings → Appearance → CSS snippets) and is out of scope for the file-layer test.

Honest grading note: the file-layer checks prove files and keys, not rendered pixels. A check that confirms an expected default or an absence, such as the missing enabled-snippet key in `appearance.json`, passes only with that limitation stated.

---

## 5. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [../manual-testing-playbook.md](../manual-testing-playbook.md) | Root policy and plugin tie-in index |
| [../../references/themes/themes.md](../../references/themes/themes.md) | Theme system: install, activate, manage, the theme package and cssTheme |
| [../../references/themes/customization.md](../../references/themes/customization.md) | CSS snippets, CSS variables, and the override selectors |
| [../../references/themes/theme-development.md](../../references/themes/theme-development.md) | Building a theme: manifest, theme.css, dark/light via CSS variables |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [../../references/themes/plugin-development.md](../../references/themes/plugin-development.md) | Plugin development overview (behavioral counterpart to themes) |
| [../../references/plugins/plugin-operation-logic.md](../../references/plugins/plugin-operation-logic.md) | File-layer versus UI boundary |

---

## 6. SOURCE METADATA

- Group: Plugin tie-ins
- Playbook ID: OBS-021
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugin-tie-ins/theme-activation.md
