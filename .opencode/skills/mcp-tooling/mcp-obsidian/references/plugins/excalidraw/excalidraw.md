---
title: "Excalidraw File-Layer Index"
description: "Entry point for operating the Excalidraw Obsidian plugin (zsviczian) at the file layer: drawing notes, embedded JSON documents, settings, scripts, templates and embeds."
trigger_phrases:
  - "excalidraw obsidian plugin"
  - "excalidraw drawing file"
  - "excalidraw data json"
  - "excalidraw embed drawing"
  - "excalidraw scripts folder"
  - "excalidraw template"
  - "excalidraw md json elements"
  - "excalidrawautomate"
importance_tier: "normal"
contextType: "implementation"
version: "0.10.0.0"
---

# Excalidraw Plugin Index (`obsidian-excalidraw-plugin`)

The `mcp-obsidian` mode operates Excalidraw through its **drawing files and settings JSON**. It never drives the drawing UI headlessly.

## 1. IDENTITY

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Obsidian plugin ID | `obsidian-excalidraw-plugin` | Plugin directory name + enablement entry |
| Display name | **Excalidraw** | Current manifest name |
| Author | Zsolt Viczian | Manifest author field |
| Plugin repository | [`zsviczian/obsidian-excalidraw-plugin`](https://github.com/zsviczian/obsidian-excalidraw-plugin) | Source of behavior facts |
| Version installed | 2.26.2 | Verified from manifest.json |
| minAppVersion | 1.8.7 | Verified from manifest.json |
| Desktop only | No | Verified from manifest.json |
| Settings file | `<vault>/.obsidian/plugins/obsidian-excalidraw-plugin/data.json` | Absent in the vault, defaults apply |

## 2. WHAT IT DOES

Excalidraw renders vector drawings inside Obsidian. The manifest describes the plugin as a sketching surface for "4D Visual PKM". Each drawing lives in its own Markdown note with a YAML frontmatter block and an embedded Excalidraw JSON document in the body. The plugin edits and renders that document in a dedicated view.

The plugin surface includes more than the canvas.

- A Script Engine that loads script notes from a folder and hot-reloads them on change.
- Drawing templates that seed new drawings from a template note.
- A vault-based shape library with a local library file.
- Image export and embeddable Markdown rendering.
- PDF import with page and rect link parameters.
- An automation API exposed as `window.ExcalidrawAutomate`.
- Optional AI features and a Taskbone integration, both present in settings.

The AI operates the note layer and the settings JSON only.

## 3. FILE-LAYER SURFACE (what the AI edits)

| Layer | Path / artifact | Operable by AI |
| --- | --- | --- |
| Drawing notes | `<vault>/<any folder>/*.excalidraw.md` | **Yes**: frontmatter + embedded JSON document |
| Settings | `.obsidian/plugins/obsidian-excalidraw-plugin/data.json` | **Yes**: configuration keys only |
| Scripts | `<scriptFolderPath>/*.md` (default `Excalidraw/Scripts`) | **Yes**: add or update script notes |
| Drawing template | `<templateFilePath>` (default `Excalidraw/Template.excalidraw`) | **Yes**: copy into new drawings |
| Shape library | `<libraryFolderPath>/<libraryFileName>.excalidrawLib` (default `Excalidraw/Libraries/local-library`) | Read-only for the AI |
| In-app drawing UI | Excalidraw view | **No**: out of reach headlessly |

## 4. DRAWING FILE CONTRACT (summary)

A drawing note has two parts.

- YAML frontmatter with `excalidraw-plugin` metadata and optional per-drawing export keys.
- A body with a `## Drawing` section holding the Excalidraw JSON document: `type`, `version`, `source`, `elements`, `appState` and `files`.

The default new-drawing body wraps the JSON in a fenced code block. The fence language is `json` when uncompressed and `compressed-json` when the `compress` setting is on. A `%%` marker closes the section. The reader also accepts a raw JSON body after the section header. See `data-model.md` for the exact shapes.

The command palette action `Decompress current Excalidraw file` rewrites a compressed section to plain JSON.

### Drawing note example

~~~markdown
---
excalidraw-plugin: parsed
tags: [excalidraw]
---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==

## Drawing
```json
{"type":"excalidraw","version":2,"source":"<release-url>","elements":[],"appState":{}}
```

%%
~~~

## 5. DATA ARTIFACT QUICK MAP

| Artifact | Path / location | Shape | Full detail |
| --- | --- | --- | --- |
| Drawing note | `*.excalidraw.md` anywhere in the vault | Frontmatter + embedded JSON | `data-model.md` sections 2 to 4 |
| Settings | `.obsidian/plugins/obsidian-excalidraw-plugin/data.json` | JSON object, 200+ keys | `data-model.md` section 5 |
| Script notes | `<scriptFolderPath>/*.md` | Markdown notes, basename is the script name | `data-model.md` section 7 |
| Drawing template | `<templateFilePath>` | A normal drawing note | `data-model.md` section 7 |
| Shape library | `<libraryFolderPath>/<libraryFileName>.excalidrawLib` | JSON library file, read-only | `data-model.md` section 7 |
| Embeds | Any Markdown note | `![[...]]` links with block references | `data-model.md` section 6 |

## 6. SETTINGS LOCATION

Settings live in `.obsidian/plugins/obsidian-excalidraw-plugin/data.json`. The vault has **no `data.json` yet**, so every documented default applies until the user changes a setting in-app.

The settings object has 200+ top-level keys. Documented defaults verified from `main.js`:

| Setting | Default | Notes |
| --- | --- | --- |
| `folder` | `Excalidraw` | Default drawing folder |
| `useExcalidrawExtension` | `true` | New drawings use `.excalidraw.md` |
| `drawingFilenamePrefix` | `Drawing ` | Prefix for new drawing names |
| `drawingFilenameDateTime` | `YYYY-MM-DD HH.mm.ss` | Timestamp in new drawing names |
| `templateFilePath` | `Excalidraw/Template.excalidraw` | Drawing template note |
| `scriptFolderPath` | `Excalidraw/Scripts` | Script Engine folder |
| `autosave` | `true` | Autosave toggled on |
| `compress` | `true` | Compress new drawing JSON |
| `libraryStorageMode` | `vault` | Library stored in the vault |

See `data-model.md` section 5 for the full verified setting contract.

## 7. WHEN TO USE THIS REFERENCE SET

Use this reference set when the request involves any of these actions at the file layer.

- Read, validate, create or modify an `.excalidraw.md` drawing note.
- Change a drawing-level frontmatter key such as `excalidraw-export-padding` or `excalidraw-embed-md`.
- Embed a whole drawing or a single element in another note.
- Add or update a Script Engine script note.
- Answer how the plugin stores data or which settings keys exist.
- Explain why a drawing fails to render or an embed stays empty.

Do not use this set for pure UI questions about drawing tools or the canvas. Those are user-facing interactions the AI cannot perform. Do not use this set to author automation scripts without verifying each API call against the official reference. The file layer does not prove that a script runs.

## 8. REFERENCE SET MAP

| File | Purpose |
| --- | --- |
| [`data-model.md`](data-model.md) | Exact data artifacts: drawing note structure, frontmatter keys, embedded JSON schema, settings keys, embed syntax, scripts and templates |
| [`workflows.md`](workflows.md) | Numbered operational workflows: read, validate, create, modify with backup discipline, embed, add scripts |
| [`troubleshooting.md`](troubleshooting.md) | Failure modes and fixes with named validation checkpoints |

## 9. OPERATING PRINCIPLES

- **Backup before every write.** Take a timestamped copy of the drawing note and of `data.json` before modifying either.
- **Re-read before operating.** The user may have changed drawings or settings in-app since the last read.
- **Keep the JSON document valid.** A drawing that fails JSON parse renders as an error or an empty canvas.
- **Keep unknown keys intact.** Preserve frontmatter keys and settings keys that are not part of the change.
- **Never fabricate element data.** Only copy JSON from a verified source drawing or from this reference set.
- **Do not downgrade the plugin.** File-layer changes never change the installed plugin version.
- **Render confirmation needs an in-app view.** The file-layer claim is verified by JSON round-trip only.

### ExcalidrawAutomate at the file layer

- `window.ExcalidrawAutomate` is a real API surface in the installed plugin, verified from `main.js`.
- It is the correct target for programmatic drawing, but its method signatures are not documented here.
- Verify each method name against the official `ExcalidrawAutomate.d.ts` reference before writing script code.
- A script note that calls an unverified method is a file-layer valid note and a runtime error. Flag that risk to the user.
