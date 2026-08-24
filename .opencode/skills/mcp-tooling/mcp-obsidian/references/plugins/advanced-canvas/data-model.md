---
title: "Advanced Canvas Plugin File-Layer Data Model"
description: "The Advanced JSON Canvas schema for the Advanced Canvas community plugin: native node/edge fields plus the extended keys it adds — styleAttributes (shape, border, textAlign, path, arrow, pathfindingMethod), collapsed groups, portals, floating edges, and the top-level metadata block with the presentation start node."
trigger_phrases:
  - "advanced canvas data model"
  - "advanced json canvas schema"
  - "advanced canvas styleAttributes"
  - "advanced canvas node shape"
  - "advanced canvas edge pathfinding"
  - "advanced canvas floating edge"
  - "advanced canvas portal"
  - "advanced canvas metadata startNode"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Advanced Canvas Plugin File-Layer Data Model

A `.canvas` file is a JSON document. Native Obsidian stores `{ "nodes": [...], "edges": [...] }`; Advanced Canvas keeps both arrays, adds extra keys to individual node and edge objects, and adds a top-level `metadata` object. It calls the extended format **Advanced JSON Canvas** and stamps `metadata.version` (`"1.0-1.0"` on the installed 6.5.4 build). Every extended key, and every `styleAttributes` value, below was read from the installed `main.js` (6.5.4). The native fields match the JSON Canvas 1.0 spec. Cross-portal ("interdimensional") edges are confirmed: they are stored in an `interdimensionalEdges` array on the portal `file` node, not the top-level `edges` array (§5).

---

## 1. OVERVIEW

### Storage model

| Layer | Artifact | AI-operable |
| --- | --- | --- |
| Canvas document | One `.canvas` JSON file: `{ "nodes": [...], "edges": [...], "metadata": {...} }` | Yes — read, back up, edit the JSON |
| Nodes | Objects in the `nodes` array | Yes — native fields plus extended keys |
| Edges | Objects in the `edges` array | Yes — native fields plus extended keys |
| Canvas metadata | Top-level `metadata` object (`version`, `frontmatter`, `startNode`) | Yes — this is where `.canvas` frontmatter and the presentation start node live |
| Enablement | `.obsidian/community-plugins.json` | Yes (already enabled when this reference set is loaded for a live vault) |
| Rendering | The open Obsidian window | No — JSON writes prove the shape, not the pixels |

### Core contract

- A `.canvas` edited by Advanced Canvas still opens in vanilla Obsidian. Every extra key is **additive**; the native reader ignores what it does not recognise.
- Never remove or rename the native `nodes`/`edges` arrays or a node's `id`/`type`/`x`/`y`/`width`/`height`. That breaks the file for both readers.
- The plugin persists everything inside the single `.canvas` file. There is no side-car database.
- **Array position is not visual draw order.** When some nodes carry `zIndex` and others do not, `nodes[0]` is not guaranteed to be the bottom-most node. Read `zIndex` explicitly instead of assuming array order, and never silently reorder the `nodes` array — that can change the stacking of nodes that rely on it (§3).

---

## 2. NATIVE NODE AND EDGE FIELDS (JSON Canvas 1.0)

These are the fields vanilla Obsidian already writes. Advanced Canvas builds on top of them.

### Node — common fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Unique within the canvas. Do not use `-` in a manually-chosen id — the plugin builds portal composite ids as `portalId-nodeId`, so a dashed id can be misread as a portal-node reference. Prefer `_`, camelCase or alphanumeric ids |
| `type` | string | One of `text`, `file`, `link`, `group` |
| `x`, `y` | integer | Top-left pixel position |
| `width`, `height` | integer | Pixel size |
| `color` | string | Optional. Hex (`"#FF0000"`) **or** a preset digit `"1"`–`"6"` (red, orange, yellow, green, cyan, purple) |

### Node — per-type fields

| `type` | Extra native fields |
| --- | --- |
| `text` | `text` (Markdown string) |
| `file` | `file` (vault path); optional `subpath` (starts with `#`) |
| `link` | `url` |
| `group` | optional `label`, `background` (image path), `backgroundStyle` (`cover` / `ratio` / `repeat`) |

### Edge — fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Unique within the canvas |
| `fromNode`, `toNode` | string | Node ids |
| `fromSide`, `toSide` | string | Optional. `top` / `right` / `bottom` / `left` |
| `fromEnd`, `toEnd` | string | Optional. `none` / `arrow`. `fromEnd` defaults to `none`; `toEnd` defaults to `arrow` |
| `color` | string | Optional. Same hex-or-`"1"`–`"6"` rule as nodes |
| `label` | string | Optional. Also used to number presentation slide branches (§6) |

---

## 3. EXTENDED NODE KEYS (Advanced Canvas)

Advanced Canvas adds these keys to node objects. All are optional; a node without them behaves natively.

| Key | Type | Meaning |
| --- | --- | --- |
| `styleAttributes` | object | Node styling — `shape`, `textAlign`, `border` (see below). Written when the node-styling feature is enabled |
| `collapsed` | boolean | `true` collapses a `group` node (collapsible groups) |
| `collapsedData` | object | **Runtime-only, not in the JSON Canvas spec.** When `collapsed: true`, the plugin moves the group's member nodes and edges out of the top-level `nodes`/`edges` arrays into this nested payload with offset coordinates; expanding the group deletes `collapsedData` and restores the members. Treat it as read-only — never author or "restore" members from it, or an AI can duplicate/corrupt the group |
| `portal` | boolean | `true` on a `file` node turns it into a portal — embeds the referenced `.canvas` as canvas-in-canvas (§5) |
| `dynamicHeight` | boolean | Per-node auto-resize toggle — the node grows to fit its content |
| `zIndex` | integer | Draw order — higher draws on top; should be unique. Absent → the plugin auto-assigns from an internal counter. The spec requires `nodes[]` sorted ascending by `zIndex` |
| `ratio` | number \| "No ratio enforcement" | Aspect ratio used when the node auto-resizes. Reading tolerates both the number and the internal string sentinel; when writing, use a numeric ratio or omit the key — never write the string sentinel |

### `styleAttributes` values for nodes (confirmed enumerations)

| Attribute | Applies to | Allowed values | Default |
| --- | --- | --- | --- |
| `shape` | `text` nodes | `pill`, `diamond`, `parallelogram`, `circle`, `predefined-process`, `document`, `database` | omit (a plain rectangle / flowchart "process") |
| `textAlign` | `text` nodes | `center`, `right` | omit (left) |
| `border` | any node | `dashed`, `dotted`, `invisible` | omit (solid) |

Flowchart shape names map to these values: **terminal → `pill`**, **decision → `diamond`**, **input/output → `parallelogram`**, **on-page reference → `circle`**, plus `predefined-process`, `document` and `database`. The default rectangle (no `shape` key) is the flowchart "process" box.

To set an attribute, write its string value; to leave it at the default, omit the key (an unset attribute is absent, not the literal `null`).

> `styleAttributes` is typed `{ [key: string]: string | null }` — `null` is a valid value the plugin's own templates use to *unset* an attribute. When hand-authoring, prefer omitting a key over writing `null`.

```json
{
  "id": "n1",
  "type": "text",
  "x": 0, "y": 0, "width": 200, "height": 80,
  "text": "Start",
  "color": "4",
  "styleAttributes": { "shape": "pill", "textAlign": "center", "border": "dashed" }
}
```

> Custom style attributes: Advanced Canvas lets a CSS snippet register extra `styleAttributes` keys that render via a `data-<key>` DOM attribute. Only the three built-in node attributes above are guaranteed on a stock install — any snippet-defined key is vault-specific and must be confirmed against that vault's snippet before use.

---

## 4. EXTENDED EDGE KEYS (Advanced Canvas)

Advanced Canvas adds these keys to edge objects.

| Key | Type | Meaning |
| --- | --- | --- |
| `styleAttributes` | object | Edge styling — `path`, `arrow`, `pathfindingMethod` (see below) |
| `fromFloating` | boolean | `true` lets the plugin pick the `from` connection side automatically instead of using `fromSide` |
| `toFloating` | boolean | `true` does the same for the `to` end |

### `styleAttributes` values for edges (confirmed enumerations)

| Attribute | Allowed values | Default |
| --- | --- | --- |
| `path` | `dotted`, `short-dashed`, `long-dashed` | omit (solid) |
| `arrow` | `triangle-outline`, `thin-triangle`, `halved-triangle`, `diamond`, `diamond-outline`, `circle`, `circle-outline`, `blunt` | omit (the native filled triangle) |
| `pathfindingMethod` | `direct`, `square`, `a-star` | omit (the native default routing) |

```json
{
  "id": "e1",
  "fromNode": "n1", "toNode": "n2",
  "fromSide": "right", "toSide": "left",
  "styleAttributes": { "path": "short-dashed", "arrow": "circle", "pathfindingMethod": "a-star" }
}
```

`pathfindingMethod` controls how the connector is routed: `direct` (straight line), `square` (right-angle / orthogonal), `a-star` (A\* obstacle-avoiding). A floating edge combines with these — set `fromFloating`/`toFloating` and omit the corresponding `fromSide`/`toSide`.

---

## 5. PORTALS (canvas-in-canvas)

A portal embeds one `.canvas` inside another. It is a native `file` node (its `file` points at the embedded `.canvas`) with the extended key `portal: true`.

```json
{
  "id": "p1",
  "type": "file",
  "file": "Maps/Sub-canvas.canvas",
  "x": 0, "y": 0, "width": 600, "height": 400,
  "portal": true
}
```

The embedded canvas's nodes are loaded and rendered inside the portal at runtime. Edges can connect a top-level node to a node **inside** a portal ("interdimensional edges"). These are **not** stored in the top-level `edges` array — they live in an `interdimensionalEdges` array **on the portal `file` node**, and their endpoints use composite ids of the form `portalId-nestedNodeId`:

```json
{
  "id": "p1",
  "type": "file",
  "file": "Maps/Sub-canvas.canvas",
  "x": 0, "y": 0, "width": 600, "height": 400,
  "portal": true,
  "interdimensionalEdges": [
    { "id": "ie1", "fromNode": "topLevelNodeId", "toNode": "p1-nestedNodeId" }
  ]
}
```

The `interdimensionalEdges` container is confirmed from the JSON Canvas typings and the installed build. The exact persisted endpoint-id encoding (`portalId-nestedNodeId`) is confirmed from the plugin's own serialization code — it builds the endpoint by joining the portal id and the nested node id with a `-` delimiter — and is only unverified at the byte level, since no captured portal `.canvas` file exists to diff against (the vault is read-only). The conservative path remains to author edges between top-level nodes and let the plugin manage portal-internal edges.

---

## 6. PRESENTATION AND THE `metadata` BLOCK

Advanced Canvas adds a top-level `metadata` object to the `.canvas` JSON:

```json
{
  "nodes": [ ... ],
  "edges": [ ... ],
  "metadata": {
    "version": "1.0-1.0",
    "frontmatter": {},
    "startNode": "n1"
  }
}
```

| Key | Meaning |
| --- | --- |
| `version` | The Advanced JSON Canvas spec marker (`"1.0-1.0"` on the installed 6.5.4 build) |
| `frontmatter` | The `.canvas` file's frontmatter object — `tags`, `aliases`, `cssclasses` and custom keys, feeding Obsidian's metadata cache, graph view and backlinks |
| `startNode` | The node id of the presentation's first slide. Absent = no start node set |

**Presentation order is derived, not stored as an array.** The first slide is `metadata.startNode`; from there the plugin walks the outgoing edges. When a node has several outgoing edges, the numeric `label` on each edge defines the branch order. To build a deck at the file layer: set `metadata.startNode`, then connect slides with edges and number the edge `label`s.

Older canvases stored the start slide as a per-node `isStartNode` flag; the plugin migrates that to `metadata.startNode` on save. Always write the canvas-level key, never the per-node flag.

### Auto file-node edges and single-node references

- **Auto file-node edges:** with the feature enabled, Advanced Canvas reads a frontmatter key on a file node's target note — default `canvas-edges` (configurable) — and auto-creates edges to the linked file nodes. The key lives in the note's own frontmatter, not the `.canvas`.
- **Single-node references (native-file links):** link to one node with `[[some-canvas#node-id]]`, or embed it with `![[some-canvas#node-id]]`.

---

## 7. WHAT THE AI MUST NOT DO

- Never write a `shape`, `border`, `path`, `arrow` or `pathfindingMethod` value outside the confirmed enumerations in §3–§4. An unknown value silently falls back to the default.
- Cross-portal ("interdimensional") edges live in an `interdimensionalEdges` array on the portal `file` node, with composite `portalId-nestedNodeId` endpoints (§5) — never put them in the top-level `edges` array, and never use `-` in a manually-chosen node id (it collides with the composite-id scheme). The exact endpoint encoding is confirmed from the plugin's own serialization code but not yet byte-verified against a captured portal `.canvas` file; for a fully byte-verified path, let the plugin manage portal-internal edges.
- Never write the presentation start slide as a per-node `isStartNode` flag. It belongs in `metadata.startNode` on this build.
- Never remove or rename the native `nodes`/`edges` arrays or a node's core `id`/`type`/`x`/`y`/`width`/`height` fields — that breaks the file for both the plugin and vanilla Obsidian.
- Never claim a node, edge, portal, presentation or export rendered in the plugin's UI. The JSON write proves the shape; a canvas reload proves the render, and that belongs to the plugin-install phase.
