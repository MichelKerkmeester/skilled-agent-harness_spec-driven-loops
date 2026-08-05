---
title: "Excalidraw File-Layer Workflows"
description: "Numbered operational workflows for the Excalidraw Obsidian plugin at the file layer: read, validate, create, modify with backup discipline, embed, add scripts and set export frontmatter."
trigger_phrases:
  - "excalidraw read drawing"
  - "excalidraw validate drawing file"
  - "excalidraw create drawing note"
  - "excalidraw modify drawing json"
  - "excalidraw embed drawing workflow"
  - "excalidraw add script note"
  - "excalidraw export frontmatter workflow"
importance_tier: "normal"
contextType: "implementation"
version: "0.10.0.0"
---

# Excalidraw File-Layer Workflows

Every workflow below runs at the file layer: reading notes, validating structure and editing with backup discipline. Render results are never claimed from the file layer.

---

## 1. READ A DRAWING

Goal: extract the drawing state without changing anything.

1. Resolve the note path with a glob for `*.excalidraw.md` under the target folder.
2. Read the note. Split it into frontmatter and body at the second `---` fence.
3. Read the frontmatter keys. Confirm `excalidraw-plugin` exists.
4. Read the body. Locate the `## Drawing` section and extract the scene JSON from its code block.
5. When the block is `compressed-json`, stop and report that the drawing is compressed. Run the `Decompress current Excalidraw file` command or ask the user to decompress in-app.
6. When the JSON does not parse, stop and report the drawing as corrupt.
7. Report the drawing identity, element count and frontmatter state.

Before (no write happens):

```text
read: Excalidraw/Architecture.excalidraw.md
frontmatter: excalidraw-plugin: parsed
section: ## Drawing, json block
elements: 12
appState: viewBackgroundColor #ffffff
```

After (read summary only):

```text
drawing: Excalidraw/Architecture.excalidraw.md
schema: {type: excalidraw, version: 2}
elements: 12
links: none
```

## 2. VALIDATE A DRAWING

Goal: prove a drawing note is loadable before any edit.

Checkpoints in order:

1. Frontmatter parses as YAML.
2. `excalidraw-plugin` is present with value `parsed` or `raw`.
3. The body has a `## Drawing` or `# Drawing` section header.
4. The scene JSON sits in a `json` code block under the header or in a raw fallback line. The `compressed-json` case defers to the decompress command.
5. The JSON parses with `type` equal to `excalidraw` and `version` equal to `2`.
6. `elements` is an array and every entry has an `id` and a `type`.
7. `appState` is an object.
8. `files` is an object when present.
9. No stray content breaks the block. The `%%` marker may close the section.

Pass example:

```text
VALID: Architecture.excalidraw.md
- frontmatter: ok
- excalidraw-plugin: parsed
- section: ## Drawing, json block
- json: type=excalidraw version=2
- elements: 12 ids unique
- files: 2 entries
```

Fail example:

```text
INVALID: Architecture.excalidraw.md
- section: ## Drawing found
- json: parse error inside code block
- cause: truncated elements array
- action: restore from backup or ask the user to repair in-app
```

## 3. CREATE A DRAWING FROM TEMPLATE

Goal: create a new drawing note that the plugin can open.

1. Read the template at `templateFilePath` when it exists.
2. Copy the template content when it exists. Otherwise write the default structure: frontmatter, warning line, `## Drawing` header, a `json` fenced block with a valid empty scene and the `%%` marker.
3. Target a filename following the default naming: `Drawing YYYY-MM-DD HH.mm.ss.excalidraw.md`.
4. Place the note in the `folder` setting directory by default.
5. Keep the frontmatter and the scene JSON exactly as copied.
6. Do not invent element content. An empty `elements` array is valid.
7. Do not copy the raw blank constant from `main.js`. Write a hand-verified JSON document instead.

Before (no template present):

```text
path: Excalidraw/Drawing 2026-01-01 10.00.00.excalidraw.md
frontmatter: excalidraw-plugin: parsed
section: ## Drawing, json block
body: {"type":"excalidraw","version":2,"source":"<release-url>","elements":[],"appState":{}}
```

After:

```text
created: Excalidraw/Drawing 2026-01-01 10.00.00.excalidraw.md
json: valid, elements 0
```

## 4. MODIFY DRAWING JSON WITH BACKUP DISCIPLINE

Goal: change element or appState data with a safe rollback path.

1. Read the drawing and back it up to a timestamped sibling first: `Architecture.excalidraw.md.bak-YYYYMMDD-HHMMSS`.
2. Read the JSON document. Verify it parses before editing.
3. Apply only the scoped change. Copy element JSON from a verified source, never fabricate ids.
4. Keep every element that is not part of the change byte-identical.
5. Write the note back with the frontmatter and warning line unchanged.
6. Re-run the validation workflow from section 2.
7. Report the diff summary and the backup path.

Before (the fragment shows only the `elements` array of the scene JSON):

```json
{ "elements": [
  { "id": "a1b2c3d4", "type": "rectangle", "x": 0, "y": 0, "width": 100, "height": 50 }
] }
```

After (one element added by copy):

```json
{ "elements": [
  { "id": "a1b2c3d4", "type": "rectangle", "x": 0, "y": 0, "width": 100, "height": 50 },
  { "id": "e5f6g7h8", "type": "text", "x": 120, "y": 0, "text": "Label" }
] }
```

- The added element must come from a verified source. If no verified source exists, do not write the element and report the gap.

## 5. EMBED A DRAWING IN A NOTE

Goal: render a drawing or a single element inside another Markdown note.

1. Resolve the drawing path relative to the target note.
2. Write the whole-drawing embed with the `.excalidraw.md` extension.
3. For a single element, append the element id as a block reference.
4. Add a size parameter only when the default render size is wrong.
5. Verify the embed link against the verified syntax in `data-model.md` section 6.

Whole drawing:

```markdown
![[Architecture.excalidraw.md]]
```

Single element with size:

```markdown
![[Architecture.excalidraw.md#^a1b2c3d4|100%]]
```

Group embed:

```markdown
![[Architecture.excalidraw.md#^group=core-group]]
```

- The `#^` anchor id must match a real element id or group id in the drawing. Verify it by reading the drawing JSON first.

## 6. ADD OR UPDATE A SCRIPT NOTE

Goal: make a script available in the Script Engine menu.

1. Read the current script folder listing under `scriptFolderPath`.
2. Create or update a Markdown note in that folder. The basename becomes the script name.
3. Match the official script note format. The installed `main.js` confirms `.md` files load and hot-reload, but not the inner structure. VERIFY the frontmatter and code block format from an official script example before authoring.
4. Never invent automation API calls. VERIFY each API name from the official `ExcalidrawAutomate.d.ts` reference.
5. Report that the script registers on vault reload. File-layer proof is the note existence plus valid structure.

Before:

```text
Excalidraw/Scripts/
  Add Circle.md
  Distribute Horizontally.md
```

After:

```text
Excalidraw/Scripts/
  Add Circle.md
  Distribute Horizontally.md
  My New Script.md
```

## 7. SET DRAWING-LEVEL EXPORT FRONTMATTER

Goal: change export behavior for one drawing only.

1. Read the drawing note.
2. Back up the note with a timestamped sibling.
3. Add or update the target frontmatter key from the verified registry.
4. Keep all other frontmatter keys unchanged.
5. Write the note and re-validate.

Before:

```yaml
---
excalidraw-plugin: parsed
tags: [excalidraw]
---
```

After:

```yaml
---
excalidraw-plugin: parsed
tags: [excalidraw]
excalidraw-export-padding: 20
excalidraw-export-pngscale: 2
---
```

- Only use keys from the verified registry in `data-model.md` section 3.

## 8. EDIT SETTINGS IN DATA.JSON

Goal: change plugin defaults without the UI.

1. Read `data.json` when it exists. When it is absent, defaults apply and the file can be created.
2. Back up any existing `data.json` before writing.
3. Change only the confirmed keys from `data-model.md` section 5.
4. Preserve every other key byte-identical.
5. Write the file and report that a plugin reload is required.

Before:

```json
{ "folder": "Excalidraw", "compress": true }
```

After:

```json
{ "folder": "Excalidraw", "compress": false }
```

- The plugin reads settings at load. The user must reload Obsidian or toggle the plugin off and on for the change to take effect.

## 9. BACKUP AND ROLLBACK PATTERN

Goal: keep every edit reversible.

1. Name backups with a fixed suffix pattern: `<note>.bak-YYYYMMDD-HHMMSS`.
2. Keep the backup in the same folder as the source note.
3. On failure, restore by copying the backup over the damaged note.
4. Re-run the validation workflow after any restore.
5. Report the exact backup path in the completion summary.

Example:

```text
backup:  Excalidraw/Architecture.excalidraw.md.bak-20260101-100000
restore: cp backup to note, then validate
```
