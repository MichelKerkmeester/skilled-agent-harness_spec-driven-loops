---
title: "OBS-021 -- minimal-theme-activation"
description: "This scenario validates the Minimal theme file-layer contract by recreating the theme package in a throwaway vault, activating it through the cssTheme key, writing a snippet with backup discipline and verifying all three layers."
stage: routing
version: 0.10.0.0
---

# OBS-021 -- minimal-theme-activation

## 1. OVERVIEW

This scenario validates that the mode can operate the Minimal theme at the file layer: the theme package is copied into a throwaway vault, activation is set through the `cssTheme` key in `appearance.json`, one snippet is proposed and written with backup discipline, and every layer is verified with headless checks. Rendering itself is in-app and only observable with a reload.

### Why This Matters

Minimal is a theme, not a plugin. Its entire configuration is the file layer: the package, the activation key and the snippets folder. If the mode can recreate that layer in a throwaway vault without touching a real vault, theme operations are fully delegated to vault files.

## 2. SCENARIO CONTRACT

- Feature ID: OBS-021
- Feature Name: minimal-theme-activation
- Scenario Objective: Recreate the Minimal theme file layer in a throwaway vault at `/tmp/_pbtest-minimal-theme-activation`, activate the theme through `cssTheme` in `appearance.json`, write one snippet with backup discipline and verify the package, the activation and the snippet.
- Exact Prompt: Set up the Minimal theme in my vault and make the headings smaller with a snippet, backing up anything you change.
- Exact Command Sequence: 1. Create the throwaway vault 2. Copy `theme.css` + `manifest.json` from the real vault (read-only source) 3. Write `appearance.json` with `cssTheme` set to `Minimal` 4. Write the snippet with a timestamped backup 5. Verify the manifest, the activation and the snippet 6. Remove the throwaway vault
- Expected Signals: Manifest parses with version `9.0.2`, `appearance.json` parses with `cssTheme` equal to `Minimal`, the snippet is non-empty with balanced braces and a timestamped backup exists.
- Evidence: File listing, jq outputs, brace counts, backup path.
- Pass/Fail Criteria: PASS if all three layers verify and the throwaway vault is removed; FAIL if any file fails to parse, the version differs, `cssTheme` mismatches or the real vault is written.
- Failure Triage: 1. Recreate the throwaway vault from scratch. 2. Re-check the file paths against the data model. 3. Re-run on a fresh copy.

## 3. TEST EXECUTION

### Recommended Orchestration Process

Run everything against the throwaway vault at `/tmp/_pbtest-minimal-theme-activation`. The real vault path appears only as the read-only copy source. Never write into a real vault during the test.

### Prompt

Set up the Minimal theme in my vault and make the headings smaller with a snippet, backing up anything you change.

### Commands

1. Create the throwaway vault and copy the theme package from the real vault.

   ~~~sh
   VB=/tmp/_pbtest-minimal-theme-activation
   SRC=/Users/michelkerkmeester/MEGA/Documents/Obsidian/.obsidian
   rm -rf "$VB"
   mkdir -p "$VB/.obsidian/themes/Minimal" "$VB/.obsidian/snippets"
   cp "$SRC/themes/Minimal/theme.css" "$VB/.obsidian/themes/Minimal/theme.css"
   cp "$SRC/themes/Minimal/manifest.json" "$VB/.obsidian/themes/Minimal/manifest.json"
   ls -la "$VB/.obsidian/themes/Minimal/"
   ~~~

2. Activate the theme through `appearance.json`.

   ~~~sh
   printf '{\n  "cssTheme": "Minimal"\n}\n' > "$VB/.obsidian/appearance.json"
   python3 -m json.tool "$VB/.obsidian/appearance.json" >/dev/null
   jq -e '.cssTheme == "Minimal"' "$VB/.obsidian/appearance.json"
   ~~~

3. Propose and write one snippet with backup discipline.

   ~~~sh
   SNIP="$VB/.obsidian/snippets/example-heading-tighten.css"
   cat > "$SNIP" <<'EOF'
   /* Example snippet: tighten heading sizes for dense reading.
      The variable names come from the installed theme.css. */
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
   jq -e '.version == "9.0.2"' "$VB/.obsidian/themes/Minimal/manifest.json"
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
   test ! -e /tmp/_pbtest-minimal-theme-activation && echo "throwaway removed"
   ~~~

### Grading

| Verdict | Criteria |
|---|---|
| PASS | Manifest parses with version `9.0.2`, `cssTheme` equals `Minimal`, the snippet has balanced braces and a backup exists, the throwaway vault is removed and the real vault is untouched |
| FAIL | Any parse error, version mismatch, `cssTheme` mismatch, missing backup or a real vault file modified |
| SKIP | No source theme package available at the real vault path |

## 4. CLEANUP

The test owns one directory, `/tmp/_pbtest-minimal-theme-activation`. Remove it with `rm -rf` after the run and verify the path is gone. The real vault files were only ever read as copy sources. The snippet enablement step is an in-app action (Settings → Appearance → CSS snippets) and is out of scope for the file-layer test.

Honest grading note: the file-layer checks prove files and keys, not rendered pixels. A check that confirms an expected default or an absence, such as the missing enabled-snippet key in `appearance.json`, passes only with that limitation stated.
