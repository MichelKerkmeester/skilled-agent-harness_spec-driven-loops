---
title: "Excalidraw File-Layer Troubleshooting"
description: "Failure modes and fixes for the Excalidraw Obsidian plugin at the file layer: render failures, frontmatter drift, corrupt JSON, compressed bodies, embed gaps, missing scripts and settings staleness."
trigger_phrases:
  - "excalidraw drawing not rendering"
  - "excalidraw frontmatter missing"
  - "excalidraw json corrupt"
  - "excalidraw compressed body unreadable"
  - "excalidraw embed not showing"
  - "excalidraw script missing from menu"
  - "excalidraw settings not applying"
  - "excalidraw file extension wrong"
importance_tier: "normal"
contextType: "implementation"
version: "0.10.0.0"
---

# Excalidraw File-Layer Troubleshooting

Each failure mode names a checkpoint and a fix. Run the named checkpoint before and after the fix. Never claim a render result from the file layer.

---

## 1. DRAWING DOES NOT RENDER

### Symptoms

- The note opens as plain text or shows an error message.
- The canvas is empty when it should show elements.

### Checkpoints

1. `frontmatter-check`: `excalidraw-plugin` is present with value `parsed` or `raw`.
2. `section-check`: the body has a `## Drawing` or `# Drawing` header.
3. `json-parse-check`: the scene JSON inside the section parses with `type` equal to `excalidraw`.
4. `elements-check`: `elements` is an array.

### Fixes

- Restore the missing `excalidraw-plugin` frontmatter key from the verified registry.
- Repair the scene JSON. Use the nearest timestamped backup when one exists.
- When the scene is compressed, run the command `Decompress current Excalidraw file` in-app.

### After

- Re-run all four checkpoints. Report pass or fail per checkpoint.

---

## 2. FRONTMATTER DRIFT

### Symptoms

- A drawing note opens as a plain Markdown file.
- The plugin no longer recognizes the note as a drawing.

### Checkpoints

1. `plugin-key-check`: `excalidraw-plugin` key exists.
2. `plugin-value-check`: the value is `parsed` or `raw`.
3. `fence-check`: the frontmatter block closes with a second `---` fence.

### Fixes

- Add the missing key with value `parsed`.
- Repair an unterminated frontmatter fence.
- Do not add keys outside the verified registry in `data-model.md` section 3.

### After

- Re-run the three checkpoints. The note must show as a drawing again.

---

## 3. CORRUPT OR TRUNCATED JSON BODY

### Symptoms

- The drawing shows a partial canvas or an error.
- A JSON parser fails inside the `## Drawing` section.

### Checkpoints

1. `section-check`: the `## Drawing` or `# Drawing` header exists.
2. `extract-check`: the scene JSON is taken from the `json` code block or the raw fallback line under the header.
3. `json-parse-check`: the extracted document parses.
4. `balance-check`: every `{` and `[` in the document has a matching close.

### Fixes

- Restore from the timestamped backup.
- When no backup exists, ask the user to repair in-app. Do not hand-reconstruct element data.
- Never rewrite a compressed block by hand. Decompress with the plugin command first.

### After

- Re-run all four checkpoints. A pass proves file-layer validity only.

---

## 4. COMPRESSED DRAWING SECTION IS UNREADABLE

### Symptoms

- The drawing section holds one long string that does not parse as JSON.
- The `compress` setting is on and the drawing section is deflate-compressed.

### Checkpoints

1. `compress-setting-check`: read `compress` in `data.json` or apply the default `true`.
2. `fence-check`: the drawing section uses a `compressed-json` fenced block.
3. `template-warning-check`: the note carries the default warning line about the decompress command.
4. `decompress-check`: after running `Decompress current Excalidraw file`, the section contains a plain `json` block that parses.

### Fixes

- Run the decompress command in-app and re-read the note.
- Do not attempt manual decompression or compression of the drawing section.

### After

- Re-run the decompress check. The section must parse as JSON.

---

## 5. EMBED DOES NOT SHOW

### Symptoms

- `![[file.excalidraw.md]]` renders nothing in the target note.
- A single-element embed shows an empty box.

### Checkpoints

1. `path-check`: the embedded path resolves to an existing drawing note.
2. `syntax-check`: the link matches the verified syntax in `data-model.md` section 6.
3. `anchor-check`: the `#^` anchor id exists in the drawing `elements` or group ids.
4. `extension-check`: the link uses `.excalidraw.md` for whole-drawing embeds.

### Fixes

- Fix the path or extension to match the actual file.
- Correct the anchor to a real element id read from the drawing JSON.
- Remove unsupported link parameters. Only size, percent and padding forms are verified.

### After

- Re-run all four checkpoints. The last mile is a render in the Obsidian UI, which the file layer cannot prove.

---

## 6. SCRIPT MISSING FROM THE SCRIPT MENU

### Symptoms

- A script note exists in the script folder but does not appear in the menu.
- A changed script still runs the old version.

### Checkpoints

1. `folder-check`: the note sits directly under `scriptFolderPath`.
2. `extension-check`: the note has the `md` extension, matching the installed loader filter.
3. `reload-check`: the plugin has reloaded after the create or rename event.
4. `format-check`: the note matches the official script note format. VERIFY the format from an official example.

### Fixes

- Move the note directly into the script folder. The loader filters only direct children by path prefix and `md` extension.
- Trigger a reload by renaming the file or toggling the plugin.
- Author the inner script format from an official example, never from invention.

### After

- Re-run the four checkpoints. Menu appearance is an in-app result the file layer cannot prove.

---

## 7. SETTINGS CHANGES DO NOT APPLY

### Symptoms

- An edit to `data.json` has no visible effect.
- The plugin still behaves with old defaults.

### Checkpoints

1. `file-check`: `data.json` exists at the plugin folder path.
2. `json-check`: the file parses as JSON.
3. `key-check`: the edited keys match the verified registry in `data-model.md` section 5.
4. `reload-check`: Obsidian has reloaded the plugin since the edit.

### Fixes

- Create `data.json` when absent. The plugin writes and reads it at load.
- Preserve unknown keys byte-identical when merging.
- Reload Obsidian or disable and enable the plugin to force a settings read.

### After

- Re-run the four checkpoints. Behavior confirmation needs the app reloaded.

---

## 8. WRONG FILE EXTENSION

### Symptoms

- A drawing note uses `.md` without the frontmatter mark and the plugin treats it as a plain note.
- New drawings use the wrong extension.

### Checkpoints

1. `setting-check`: read `useExcalidrawExtension` in `data.json` or apply the default `true`.
2. `drawing-mark-check`: the note has `excalidraw-plugin` in frontmatter regardless of extension.
3. `embed-path-check`: embeds reference the actual extension of the drawing note.

### Fixes

- Keep the drawing mark in frontmatter so the plugin recognizes the note.
- Match embed links to the real note extension.
- Renaming a drawing note is a user decision. Propose it, do not perform it silently.

### After

- Re-run the three checkpoints. The drawing mark is the durable recognition signal.

---

## 9. GENERAL REPAIR SEQUENCE

Use this order when the root cause is unclear.

1. Run the read workflow from `workflows.md` section 1.
2. Run the validation workflow from `workflows.md` section 2.
3. Name the failing checkpoint from the list above.
4. Apply the matching fix with a timestamped backup.
5. Re-run the failing checkpoint and the full validation.
6. Report the checkpoint results and the backup path.
