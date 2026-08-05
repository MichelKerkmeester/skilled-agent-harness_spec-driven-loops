---
title: "Excalidraw drawing-note file layer"
description: "Create, validate, read and modify Excalidraw drawing notes at the file layer: frontmatter keys and the embedded scene JSON in .excalidraw.md files."
trigger_phrases:
  - "excalidraw drawing note"
  - "excalidraw scene json"
  - "excalidraw frontmatter keys"
  - "excalidraw embed drawing"
  - "excalidraw blank canvas"
version: "0.10.0.0"
---

# Excalidraw drawing-note file layer (`obsidian-excalidraw-plugin`)

## 1. OVERVIEW

Excalidraw (repo `zsviczian/obsidian-excalidraw-plugin`, installed v2.26.2 from the vault plugin manifest) renders vector drawings inside Obsidian. Each drawing is its own Markdown note with the `.excalidraw.md` extension: YAML frontmatter plus an embedded Excalidraw JSON document in the body. The mode operates these notes and the settings JSON at the file layer. It never drives the drawing UI headlessly.

## 2. HOW IT WORKS

Read the note and split it at the second `---` fence into frontmatter and body. Confirm `excalidraw-plugin` with value `parsed` or `raw`. Locate the `## Drawing` section and parse the scene JSON from its `json` fenced block. The document envelope is `type`, `version`, `source`, `elements`, `appState` and optionally `files`. Modify with a timestamped backup and re-validate after every write. A `compressed-json` block defers to the in-app decompress command. Rendering is confirmed by JSON round-trip only.

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/excalidraw/excalidraw.md`
- Data contract: `references/plugins/excalidraw/data-model.md`
- Recipes: `references/plugins/excalidraw/workflows.md`
- Diagnostics: `references/plugins/excalidraw/troubleshooting.md`

### Assets

- `assets/plugins/excalidraw/drawing-note.example.excalidraw.md` is a copyable minimal drawing note with verified frontmatter and an honest empty canvas
- `assets/plugins/excalidraw/drawing-scene.example.json` holds the embedded scene document alone with documented keys only

### Verification

- Manual scenario: `manual-testing-playbook/plugin-tie-ins/excalidraw-drawing-note.md`

## 4. GUARDRAILS

- Back up every drawing note with a timestamped sibling before any write.
- Keep the JSON document valid. A drawing that fails JSON parse renders as an error or an empty canvas.
- Never fabricate element data. Only copy JSON from a verified source drawing or from the example assets.
- Only use frontmatter keys from the verified registry. Never write deprecated keys.
- Do not hand-compress or hand-decompress drawing bodies. Use the verified plugin command.
- Do not rewrite `source` URLs or `version` fields in existing drawings.
- Do not claim render results. The file layer proves JSON validity only.
