---
title: "Advanced Canvas plugin file-layer nodes, edges and presentations"
description: "Author and validate Advanced Canvas community-plugin .canvas JSON at the file layer: extended node/edge styleAttributes (shapes, borders, path/arrow/pathfinding), floating edges, portals, collapsible groups, the presentation start node and PNG/SVG export."
trigger_phrases:
  - "advanced canvas plugin"
  - "advanced canvas node style"
  - "advanced canvas edge pathfinding"
  - "advanced canvas portal"
  - "advanced canvas presentation"
  - "advanced json canvas"
version: "0.1.0.0"
---

# Advanced Canvas plugin file-layer nodes, edges and presentations (`advanced-canvas`)

## 1. OVERVIEW

The Advanced Canvas community plugin (repo `Developer-Mike/obsidian-advanced-canvas`, id `advanced-canvas`, installed 6.5.4, minAppVersion 1.13.0) extends Obsidian's native JSON Canvas format — it calls the result **Advanced JSON Canvas**. It keeps the native `{ "nodes": [...], "edges": [...] }` shape and adds extended keys on nodes and edges plus a top-level `metadata` object. Because everything persists inside the single `.canvas` file, the whole feature set is AI-operable at the file layer: custom node shapes/borders, edge path/arrow styles, four pathfinding methods, floating edges, portals (canvas-in-canvas) with cross-portal `interdimensionalEdges`, collapsible groups (and their runtime `collapsedData`), node draw order (`zIndex`), a presentation start node, `.canvas` frontmatter/metadata-cache integration, and PNG/SVG export. Every extra key is additive, so the file still opens in vanilla Obsidian.

---

## 2. HOW IT WORKS

The mode edits the `.canvas` JSON: it adds a `styleAttributes` object to nodes (`shape`, `textAlign`, `border`) and edges (`path`, `arrow`, `pathfindingMethod`), sets `collapsed` on groups, `portal: true` on a file node, `fromFloating`/`toFloating` on edges, and writes the presentation start slide into `metadata.startNode`. Style values come from a fixed enumeration read from the installed build, and the edit is validated structurally — parseable JSON, real node ids, in-range values. Rendering stays in-app: the file write proves the shape and a canvas reload shows the styled nodes, routed edges, portal, presentation or export.

---

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/advanced-canvas/advanced-canvas.md`
- Data contract: `references/plugins/advanced-canvas/data-model.md`
- Recipes: `references/plugins/advanced-canvas/workflows.md`
- Diagnostics: `references/plugins/advanced-canvas/troubleshooting.md`

### Verification

- File-layer checkpoints: `references/plugins/advanced-canvas/workflows.md` §9 and `references/plugins/advanced-canvas/troubleshooting.md` §8 (a reload inside a running Obsidian confirms the render)

### Related

- General file-layer operating model: `references/plugins/plugin-operation-logic.md`

---

## 4. GUARDRAILS

- Use only the confirmed `styleAttributes` values for `shape`, `border`, `path`, `arrow` and `pathfindingMethod` (`data-model.md` §3–§4); an unlisted value silently falls back to the default.
- A portal is `portal: true` on a `file` node. A cross-portal ("interdimensional") edge lives in an `interdimensionalEdges` array on the portal `file` node with composite `portalId-nodeId` endpoints (`data-model.md` §5), never in the top-level `edges` array. The exact endpoint encoding is inferred, not byte-verified — confirm against a real portal file before hand-authoring.
- The presentation start slide lives in `metadata.startNode` (canvas-level), never a per-node `isStartNode` flag.
- Respect the version floor: Advanced Canvas 6.5.4 needs Obsidian 1.13.0+.
- Never remove or rename native fields (`nodes`/`edges`/`id`/`type`/`x`/`y`/`width`/`height`) — that breaks the file for both the plugin and vanilla Obsidian.
- Never claim a node, edge, portal, presentation or export rendered in the plugin's UI. File-layer verification proves the write, not the pixels.
