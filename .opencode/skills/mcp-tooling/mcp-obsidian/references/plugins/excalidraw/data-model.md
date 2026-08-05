---
title: "Excalidraw File-Layer Data Model"
description: "Complete file-layer contract for the Excalidraw Obsidian plugin: drawing note structure, frontmatter keys, embedded JSON schema, settings keys, embed syntax, scripts and templates."
trigger_phrases:
  - "excalidraw data model"
  - "excalidraw frontmatter keys"
  - "excalidraw embedded json"
  - "excalidraw md file structure"
  - "excalidraw settings keys"
  - "excalidraw embed syntax"
  - "excalidraw script note format"
  - "excalidraw library file"
importance_tier: "normal"
contextType: "implementation"
version: "0.10.0.0"
---

# Excalidraw File-Layer Data Model

Excalidraw stores every drawing as a **Markdown note** with frontmatter and an embedded JSON document. The AI operates these notes and the settings JSON. This document defines the exact shapes.

---

## 1. OVERVIEW

### Canonical identity

| Identity field | Current value |
| --- | --- |
| Obsidian plugin ID | obsidian-excalidraw-plugin |
| Display name | Excalidraw |
| Plugin repository | zsviczian/obsidian-excalidraw-plugin |
| Installed version | 2.26.2 (verified from manifest.json) |
| Settings file | `.obsidian/plugins/obsidian-excalidraw-plugin/data.json` |

### Core contract

- Each drawing is one note with the `.excalidraw.md` extension by default.
- The note has YAML frontmatter plus an embedded Excalidraw JSON document in the body.
- The JSON document holds the canvas content: `elements`, `appState` and `files`.
- The JSON document may be deflate-compressed when the `compress` setting is on.
- The vault has no `data.json`, so all documented setting defaults apply.

## 2. DRAWING NOTE STRUCTURE

A default new drawing note in the installed version looks like this shape (verified from the `FRONTMATTER` and `getMarkdownDrawingSection` code in `main.js`).

~~~markdown
---
excalidraw-plugin: parsed
tags: [excalidraw]
---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: 'Decompress current Excalidraw file'. For more info check in plugin settings under 'Saving'

## Drawing
```json
{"type":"excalidraw","version":2,"source":"https://github.com/zsviczian/obsidian-excalidraw-plugin/releases/tag/2.26.2","elements":[],"appState":{"gridSize":null,"viewBackgroundColor":"#ffffff"}}
```

%%
~~~

- The warning line is part of the default template. It is safe to keep it.
- The `## Drawing` section header marks where the scene data lives. The reader accepts `## Drawing` or `# Drawing`.
- The scene JSON sits in a fenced code block. The fence language is `json` when uncompressed.
- A `%%` marker closes the drawing section.
- When `compress` is on, the fence language is `compressed-json` and the block holds one long deflate-compressed string.
- The command `Decompress current Excalidraw file` rewrites the compressed block to plain JSON.
- The reader also accepts a raw JSON line after the section header without a fence. Older files use that legacy shape.

## 3. FRONTMATTER KEYS

All keys below are verified from the `FRONTMATTER_KEYS` registry in the installed `main.js`. The key name in the note is the `name` column. The short alias is the internal registry alias.

| Frontmatter key | Type | Purpose |
| --- | --- | --- |
| `excalidraw-plugin` | text | `parsed` or `raw`. Marks the note as an Excalidraw drawing |
| `tags` | list | Default drawing tag set by the template: `[excalidraw]` |
| `excalidraw-export-transparent` | checkbox | Export with transparent background |
| `excalidraw-mask` | checkbox | Export with mask |
| `excalidraw-export-dark` | checkbox | Export in dark theme |
| `excalidraw-export-padding` | number | Export padding in pixels |
| `excalidraw-export-pngscale` | number | PNG export scale |
| `excalidraw-export-embed-scene` | checkbox | Embed the full scene in exports |
| `excalidraw-export-internal-links` | checkbox | Resolve internal links in exports |
| `excalidraw-link-prefix` | text | Prefix for link text |
| `excalidraw-url-prefix` | text | Prefix for URL text |
| `excalidraw-link-brackets` | checkbox | Show square brackets around link text |
| `excalidraw-onload-script` | text | Script to run when the drawing loads |
| `excalidraw-linkbutton-opacity` | number | Link button opacity |
| `excalidraw-default-mode` | text | Default view mode |
| `excalidraw-font` | text | Font family for text elements |
| `excalidraw-font-color` | text | Font color for text elements |
| `excalidraw-border-color` | text | Border color |
| `excalidraw-css` | text | Extra CSS for the drawing |
| `excalidraw-autoexport` | text | Autoexport setting |
| `excalidraw-embeddable-theme` | text | Embed theme: `light`, `dark`, `auto` |
| `excalidraw-open-md` | checkbox | Open the note in Markdown mode |
| `excalidraw-embed-md` | checkbox | Embed the drawing as Markdown |

The legacy key `excalidraw-iframe-theme` exists in the registry and is marked deprecated. Do not write it into new files.

## 4. EMBEDDED JSON DOCUMENT

The body document is the Excalidraw scene file. Its top-level shape is stable.

| Key | Type | Meaning |
| --- | --- | --- |
| `type` | string | Always `excalidraw` for drawing files |
| `version` | number | Schema version, currently `2` |
| `source` | string | URL of the plugin release that last wrote the file |
| `elements` | array | The drawing elements: shapes, text, lines, images |
| `appState` | object | View and tool state such as `gridSize` and `viewBackgroundColor` |
| `files` | object | Embedded binary files keyed by file id |

- `elements` entries carry ids, types, coordinates, styles and link fields. Do not invent element schemas. Copy only from a verified source.
- `appState` may include theme, grid and tool settings. The default blank drawing writes `gridSize: null` and `viewBackgroundColor: "#ffffff"`.
- `files` appears when the drawing embeds binary assets such as images. It is keyed by file id.
- The verified blank scene base is `{"type":"excalidraw","version":2,"source":"<release-url>","elements":[],"appState":{"gridSize":null,"viewBackgroundColor":"#ffffff"}}`. Do not copy the raw constant from `main.js` into a file: the shipped literal has a brace quirk. Write a hand-verified JSON document instead.

### Compression

- With `compress: true` the plugin deflates the JSON document and writes it in a `compressed-json` fenced block under the `## Drawing` header.
- A compressed block is not human-readable. Validate it by decompressing with the plugin command, not by eyeballing the string.
- Only the command `Decompress current Excalidraw file` is verified to exist in the installed version. VERIFY the exact names of compress commands before quoting them.

## 5. SETTINGS CONTRACT

Settings live in `data.json` with 200+ top-level keys. The vault has no `data.json`, so defaults apply. The verified defaults below come from the `DEFAULT_SETTINGS` object in the installed `main.js`.

| Setting | Default | Notes |
| --- | --- | --- |
| `folder` | `Excalidraw` | Default folder for new drawings |
| `useExcalidrawExtension` | `true` | Use `.excalidraw.md` for new drawings |
| `drawingFilenamePrefix` | `Drawing ` | Name prefix for new drawings |
| `drawingFilenameDateTime` | `YYYY-MM-DD HH.mm.ss` | Timestamp format for new drawing names |
| `templateFilePath` | `Excalidraw/Template.excalidraw` | Drawing template note path |
| `scriptFolderPath` | `Excalidraw/Scripts` | Script Engine folder path |
| `libraryFolderPath` | `Excalidraw/Libraries` | Library storage folder |
| `libraryFileName` | `local-library` | Default library file name |
| `libraryStorageMode` | `vault` | Library stored in the vault |
| `autosave` | `true` | Autosave on |
| `compress` | `true` | Compress new drawing JSON |
| `previewImageType` | `SVG` | Preview format for drawing embeds |
| `embedType` | `excalidraw` | Default embed mode |
| `exportEmbedScene` | `false` | Do not embed the scene in exports |
| `pngExportScale` | `1` | PNG export scale |
| `startupScriptPath` | `` | No startup script set |
| `scriptEngineSettings` | `{}` | Empty script engine settings |
| `pdfSettings.pageSize` | `A4` | PDF export page size |
| `aiEnabled` | `true` | AI features enabled |
| `taskboneEnabled` | `false` | Taskbone integration off |

- Unknown keys in an existing `data.json` are user or feature settings. Preserve them on any merge.
- Never enumerate or invent settings keys beyond what `main.js` confirms.
- Editing `data.json` takes effect when Obsidian reloads the plugin. The user must reload the app or disable and enable the plugin.

## 6. EMBED SYNTAX

The plugin resolves Obsidian embeds of drawing notes. All patterns below are verified from the installed `main.js` regexes.

### Whole drawing

```markdown
![[my-drawing.excalidraw.md]]
```

### Single element or group

```markdown
![[my-drawing.excalidraw.md#^elementId]]
```

- `^elementId` is the block reference form. The plugin reads the anchor after `#^`.
- The anchor may carry a prefix: `group=`, `area=`, `frame=`, `clippedframe=` or `taskbone=`.
- Verified prefix list: `group=`, `area=`, `frame=`, `clippedframe=`.

```markdown
![[my-drawing.excalidraw.md#^group=myGroupId]]
```

### Size and padding parameters

```markdown
![[my-drawing.excalidraw.md#^elementId|WIDTHxMAXHEIGHT]]
![[my-drawing.excalidraw.md#^elementId|100%]]
![[my-drawing.excalidraw.md#^elementId|300x200,padding=10]]
```

- The `|WIDTHxMAXHEIGHT` form sets render size.
- The `|100%` form anchors the image to its natural size.
- The `,padding=N` parameter sets padding and appears at the end of the link.

### Embeddable Markdown form

Drawings can render as Markdown inside other notes with the `.excalidraw` shorthand.

```markdown
[[drawing.excalidraw]]
[[drawing.excalidraw|100]]
[[drawing.excalidraw|100x100]]
```

### PDF link parameters

Links to PDF pages and crops use fragment parameters on the embedded file.

```markdown
![[document.pdf#page=2]]
![[document.pdf#rect=0,0,500,500]]
```

- `#page=N` selects a PDF page.
- `#rect=left,bottom,right,top` crops a rectangle in PDF units.

## 7. SCRIPTS AND TEMPLATES

### Script Engine notes

- Scripts are **Markdown notes** in the script folder, verified from the installed `main.js` loader which filters `md` extension files under the script folder path.
- The script name is the note basename.
- The plugin reloads scripts on vault create, rename and delete events under the script folder.
- Script bodies execute in the plugin context and can call the automation API.
- Script note content structure beyond the basename rule is not verified from `main.js`. VERIFY the required frontmatter or code block format from official script examples before authoring one.

### ExcalidrawAutomate

- The plugin exposes a window-level automation object: `window.ExcalidrawAutomate`, verified by the `window.ExcalidrawAutomate=` assignment in the installed `main.js`.
- It is a programmatic drawing API usable from scripts and the developer console.
- API method details are not extracted from `main.js`. VERIFY method names from the official type definitions before use.
- Official reference: `docs/API/ExcalidrawAutomate.d.ts` in the plugin repository.

### Drawing template

- The template file lives at `templateFilePath`, default `Excalidraw/Template.excalidraw`.
- A template is a normal drawing note. New drawings copy its structure.
- When the template file does not exist, new drawings use the blank drawing base.

### Library files

- The library is a vault file at `<libraryFolderPath>/<libraryFileName>.excalidrawLib`, default `Excalidraw/Libraries/local-library`.
- Library content is user-created shape collections. Treat it as read-only.

## 8. WHAT THE AI MUST NOT DO

- Never fabricate element JSON, element ids, appState values or file hashes. Copy only from a verified source drawing.
- Never write frontmatter keys that are not in the verified registry above.
- Never claim a setting default that `main.js` does not confirm.
- Do not decompress or compress drawing bodies by hand. Hand-written compression breaks the file. Use the verified plugin command instead.
- Do not rewrite `source` URLs or `version` fields in existing drawings.
- Do not edit library `.excalidrawLib` files.
- Keep the warning line and frontmatter of existing drawings intact unless the change explicitly targets them.
- Do not claim render results. The file layer only proves JSON validity, not how the drawing looks in-app.
