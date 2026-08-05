---
title: "Excalidraw drawing note skeleton example"
description: "Copyable minimal drawing note for the Excalidraw Obsidian plugin: verified frontmatter and an honest empty canvas, ready to validate at the file layer."
trigger_phrases:
  - "excalidraw drawing note example"
  - "excalidraw blank canvas skeleton"
  - "excalidraw empty drawing file"
  - "excalidraw drawing frontmatter sample"
  - "excalidraw scene json example"
  - "excalidraw copyable drawing note"
importance_tier: "normal"
contextType: "implementation"
version: "0.10.0.0"
---

# Excalidraw Drawing Note Skeleton — Example

Copyable example of a valid drawing note for the `obsidian-excalidraw-plugin` (installed 2.26.2). This is an EXAMPLE file, not a live drawing. Copy the block in section 2 into a vault as a `.excalidraw.md` note and validate it before use.

## 1. What this file is

A minimal drawing note with the verified default shape from the data model:

- Frontmatter with `excalidraw-plugin: parsed` and `tags: [excalidraw]`
- The default warning line, a `## Drawing` section header, a `json` fenced block and the `%%` closing marker
- A hand-verified empty scene document with `elements: []` and the default `appState`

The scene JSON uses only keys documented in the data model: `type`, `version`, `source`, `elements`, `appState`. No element data is invented.

## 2. Copyable drawing note

Copy the block below verbatim into a new note named like `Drawing 2026-01-01 10.00.00.excalidraw.md`:

````markdown
---
excalidraw-plugin: parsed
tags: [excalidraw]
---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==

## Drawing
```json
{"type":"excalidraw","version":2,"source":"https://github.com/zsviczian/obsidian-excalidraw-plugin/releases/tag/2.26.2","elements":[],"appState":{"gridSize":null,"viewBackgroundColor":"#ffffff"}}
```

%%
```
````

## 3. Honesty notes

- The canvas is empty by design. An empty `elements` array is valid and loadable.
- `source` points at the installed release tag `2.26.2`. Do not rewrite `source` or `version` when copying an existing drawing.
- `appState` uses the two default keys verified in the data model. Do not invent `appState` values.
- File-layer validity does not prove in-app render. Open the note in Obsidian for visual confirmation.
