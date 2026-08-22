---
title: "Advanced Canvas Plugin File-Layer Index"
description: "Lean entry point for operating the Advanced Canvas community plugin (Developer-Mike/obsidian-advanced-canvas) at the file layer: the Advanced JSON Canvas extensions to .canvas nodes and edges — styleAttributes, flowchart shapes, edge pathfinding, floating edges, portals, collapsible groups, presentation start node and PNG/SVG export."
trigger_phrases:
  - "advanced canvas plugin"
  - "advanced-canvas plugin"
  - "obsidian-advanced-canvas"
  - "advanced canvas node style"
  - "advanced canvas edge pathfinding"
  - "advanced canvas portal"
  - "advanced canvas presentation"
  - "advanced json canvas"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Advanced Canvas Plugin File-Layer Index (`advanced-canvas`)

The `mcp-obsidian` mode operates the Advanced Canvas community plugin by **editing the `.canvas` JSON file directly** — the node and edge objects, plus the top-level `metadata` block the plugin adds. It never drives the in-app canvas toolbar, popup menus or presentation controls. Advanced Canvas extends Obsidian's native JSON Canvas format (it calls the result **Advanced JSON Canvas**), so every operation is a JSON edit whose result a canvas reload renders.

## 1. OVERVIEW

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Plugin repository | [`Developer-Mike/obsidian-advanced-canvas`](https://github.com/Developer-Mike/obsidian-advanced-canvas) | Source of behavior facts |
| Display name | **Advanced Canvas** | Name shown in Community Plugins → Browse |
| Community store slug / manifest id | `advanced-canvas` | Store listing `obsidian.md/plugins?id=advanced-canvas`; the on-disk `manifest.json` `id` is `advanced-canvas`, so the plugin folder is `.obsidian/plugins/advanced-canvas/` — confirmed against the installed manifest |
| Version pin | **6.5.4 installed; minAppVersion 1.13.0** | The plugin requires Obsidian **1.13.0+**; below it the plugin will not load. The Advanced JSON Canvas spec marker written into `metadata.version` is `"1.0-1.0"` on this build |
| Installed version (operator vault) | **6.5.4** | Confirmed against `manifest.json` on disk — every extended key documented here was read from this build's `main.js`, not inferred |
| Storage model | One `.canvas` JSON file per canvas: `{ "nodes": [...], "edges": [...], "metadata": {...} }`. Advanced Canvas is backward-compatible with the native format and adds extra keys on nodes, edges and a top-level `metadata` object | A canvas edited by Advanced Canvas still opens in vanilla Obsidian — the native reader ignores the extra keys. The plugin persists nothing outside the `.canvas` file |
| Coverage claim | Custom node shapes/borders, edge path/arrow styles, 4 edge pathfinding methods, floating edges, portals (canvas-in-canvas) with cross-portal `interdimensionalEdges`, collapsible groups (and their runtime `collapsedData`), node draw order (`zIndex`), a presentation start node, `.canvas` frontmatter + metadata-cache integration, and PNG/SVG export | This is why the canvas is fully AI-operable at the JSON layer — none of it needs the UI |

Every extended key name below was read from the installed `main.js` (6.5.4). The native node/edge fields match the published JSON Canvas 1.0 spec. Cross-portal ("interdimensional") edges are confirmed: they live in an `interdimensionalEdges` array on the portal `file` node with composite `portalId-nodeId` endpoints (see §4 Guardrails and `data-model.md` §5). The one residual precision caveat is that the exact endpoint-id encoding is inferred from the plugin's runtime rewrite, not byte-verified against a captured portal file.

---

## 2. HOW IT WORKS

A `.canvas` file is a JSON document. Native Obsidian stores two arrays — `nodes` and `edges`. Advanced Canvas keeps both and adds three things: extra keys on individual node objects, extra keys on individual edge objects, and a top-level `metadata` object (`{ version, frontmatter, startNode }`).

A **styled or typed node** carries a `styleAttributes` object — `shape` and `textAlign` (text nodes) and `border` (any node). A **collapsible group** carries `collapsed: true`; when collapsed, its member nodes and edges move into a runtime `collapsedData` payload and leave the top-level arrays. A **portal** is a `file` node carrying `portal: true`, embedding another `.canvas` as canvas-in-canvas. The **presentation start slide** is not a per-node flag — its node id lives in `metadata.startNode`, and slide order follows the edge graph out of that node (number the edge labels to disambiguate branches).

A **styled edge** carries a `styleAttributes` object — `path`, `arrow` and `pathfindingMethod`. A **floating edge** carries `fromFloating: true` and/or `toFloating: true`, letting the plugin pick the optimal connection side at render time instead of pinning `fromSide`/`toSide`.

The AI writes these keys into the JSON and validates structurally — valid node/edge shape, referenced node ids exist, style values are from the confirmed enumerations. Confirming the shape, portal or presentation actually renders needs a running Obsidian and a canvas reload; that is the render step, not the write.

---

## 3. SOURCE FILES

| File | Use it for |
| --- | --- |
| [`data-model.md`](data-model.md) | The Advanced JSON Canvas schema: the native node/edge fields, the extended node keys (`styleAttributes`, `collapsed`, `collapsedData`, `portal`, `dynamicHeight`, `zIndex`, `ratio`), the extended edge keys (`styleAttributes`, `fromFloating`, `toFloating`), cross-portal `interdimensionalEdges`, the `metadata` block, and every confirmed `styleAttributes` value |
| [`workflows.md`](workflows.md) | Numbered file-layer recipes: add a styled/typed node, style an edge and set its pathfinding, make a floating edge, create a portal, build a presentation, wire auto file-node edges, and export |
| [`troubleshooting.md`](troubleshooting.md) | Failure modes and recovery: node/edge not rendering, invalid style value, broken portal, presentation not starting, version-gated features and native-reader compatibility |

The general file-layer operating model (locate data, edit data, never drive the UI) lives in [`../plugin-operation-logic.md`](../plugin-operation-logic.md).

---

## 4. GUARDRAILS

- **Use only the confirmed style values.** `shape`, `border`, `path`, `arrow` and `pathfindingMethod` each have a fixed enumeration read from the installed build (`data-model.md` §3–§4). An unlisted value renders as the default, not the shape you wanted — never invent a value.
- **A portal is `portal: true` on a `file` node.** A *cross-portal edge* (an edge whose endpoint is a node inside a portal) lives in an `interdimensionalEdges` array on the portal `file` node, using composite `portalId-nodeId` endpoints (`data-model.md` §5) — never place it in the top-level `edges` array. The exact endpoint encoding is inferred, not byte-verified; confirm against a real portal file before hand-authoring, or let the plugin manage portal-internal edges.
- **`startNode` is canvas-level, not per-node.** The presentation start slide is `metadata.startNode` (a node id). Older canvases used a per-node `isStartNode`; the plugin migrates it away on save. Write the start node id into `metadata`, never a per-node flag.
- **Respect the version floor.** Advanced Canvas 6.5.4 needs Obsidian **1.13.0+** (`minAppVersion`). Confirm the app version before promising any feature.
- **Stay native-compatible.** Every extra key is additive; vanilla Obsidian ignores it. Never remove or rename the native `nodes`/`edges`/`id`/`type`/`x`/`y`/`width`/`height` fields — that breaks the file for both readers.
- **File-layer verification proves the write, not the render.** A reload inside a running Obsidian is required to see the shape, portal, presentation or export — that check belongs to the plugin-install phase, not this reference set.
- **No plugin install or live vault work happens from this reference set.** It documents the JSON shapes an already-installed plugin reads; installing the plugin and confirming its render is a separate, later step.
