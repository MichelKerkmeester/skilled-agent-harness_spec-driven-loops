---
title: "Advanced Canvas Plugin File-Layer Workflows"
description: "Safe file-layer recipes for the Advanced Canvas community plugin: add a styled or typed node, style an edge and set its pathfinding, make a floating edge, create a portal, build a presentation from a start node, wire auto file-node edges, and export to PNG/SVG."
trigger_phrases:
  - "add advanced canvas styled node"
  - "advanced canvas flowchart shape"
  - "advanced canvas edge pathfinding recipe"
  - "advanced canvas floating edge recipe"
  - "create advanced canvas portal"
  - "build advanced canvas presentation"
  - "advanced canvas export png svg"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Advanced Canvas Plugin File-Layer Workflows

These recipes change the **`.canvas` JSON file** the plugin reads — the `nodes` array, the `edges` array and the top-level `metadata` object. The JSON write is the operation; an in-app canvas reload is the render step. Every extended key and every style value below was read from the installed `main.js` (6.5.4). Cross-portal edges are confirmed: they live in an `interdimensionalEdges` array on the portal `file` node (`data-model.md` §5). The exact endpoint-id encoding is confirmed from the plugin's own serialization code and is only unverified at the byte level, since no captured portal `.canvas` file exists to diff against.

---

## 1. OVERVIEW

### Operating sequence

1. Read the whole `.canvas` file and confirm it parses as JSON with `nodes` and `edges` arrays.
2. Identify the exact node/edge objects the edit will touch by their `id`. Read them before changing anything.
3. Add or edit only the extended keys the recipe names; leave native fields (`id`, `type`, `x`, `y`, `width`, `height`) intact.
4. Use only the confirmed style values (`data-model.md` §3–§4). An unknown value silently defaults.
5. Back up the `.canvas` file before any in-place edit.
6. Verify at the file layer: re-read the file, confirm it still parses and the new keys are well-formed and reference real node ids.
7. Tell the user to reload the canvas so the plugin re-renders.

### Backup discipline

- Take a `.bak` copy of the `.canvas` file before any structural edit.
- Never rewrite the file wholesale — merge keys into the existing node/edge objects so native fields survive.
- Keep the original node/edge objects in the working transcript for row-level edits.

---

## 2. ADD A STYLED OR TYPED (FLOWCHART) NODE

Goal: give a text node a flowchart shape, alignment and border.

### Steps

1. Locate the target text node by `id` (or append a new one with unique `id`, `type: "text"`, position and size).
2. Add a `styleAttributes` object using only confirmed values: `shape` (`pill`/`diamond`/`parallelogram`/`circle`/`predefined-process`/`document`/`database`), `textAlign` (`center`/`right`), `border` (`dashed`/`dotted`/`invisible`).
3. Re-read the file and confirm it parses and the values are in range.

### Before

```json
{ "id": "n1", "type": "text", "x": 0, "y": 0, "width": 200, "height": 80, "text": "Start" }
```

### After

```json
{
  "id": "n1", "type": "text", "x": 0, "y": 0, "width": 200, "height": 80,
  "text": "Start",
  "styleAttributes": { "shape": "pill", "textAlign": "center" }
}
```

### Checkpoint

`node_style_valid`: `styleAttributes` is an object, every attribute value is in the confirmed enumeration, and `shape`/`textAlign` are used only on a `text` node.

---

## 3. STYLE AN EDGE AND SET ITS PATHFINDING

Goal: change an edge's line style, arrowhead and routing method.

### Steps

1. Locate the edge by `id`.
2. Add a `styleAttributes` object with confirmed values: `path` (`dotted`/`short-dashed`/`long-dashed`), `arrow` (one of the 8 confirmed arrow values), `pathfindingMethod` (`direct`/`square`/`a-star`).
3. Re-read and confirm the values are in range and `fromNode`/`toNode` still resolve to real nodes.

### Before

```json
{ "id": "e1", "fromNode": "n1", "toNode": "n2", "fromSide": "right", "toSide": "left" }
```

### After

```json
{
  "id": "e1", "fromNode": "n1", "toNode": "n2", "fromSide": "right", "toSide": "left",
  "styleAttributes": { "path": "short-dashed", "arrow": "circle", "pathfindingMethod": "a-star" }
}
```

### Checkpoint

`edge_style_valid`: `path`, `arrow` and `pathfindingMethod` are each in the confirmed enumeration, and both endpoint node ids exist.

---

## 4. MAKE A FLOATING EDGE

Goal: let the plugin choose the optimal connection side instead of a fixed one.

### Steps

1. Locate the edge by `id`.
2. Set `fromFloating: true` and/or `toFloating: true` and remove the matching `fromSide`/`toSide` so the side is not pinned.
3. Re-read and confirm both endpoints still resolve.

### Before

```json
{ "id": "e1", "fromNode": "n1", "toNode": "n2", "fromSide": "right", "toSide": "left" }
```

### After

```json
{ "id": "e1", "fromNode": "n1", "toNode": "n2", "fromFloating": true, "toFloating": true }
```

### Checkpoint

`floating_edge_valid`: each floating end has no competing `fromSide`/`toSide`, and both endpoint node ids exist.

---

## 5. CREATE A PORTAL (CANVAS-IN-CANVAS)

Goal: embed another `.canvas` inside this one as a live portal.

### Steps

1. Confirm the target `.canvas` file exists at the vault path you will reference.
2. Add (or convert) a `file` node whose `file` is the target `.canvas`, and set `portal: true`.
3. Re-read and confirm the `file` path resolves and `portal` is `true`.
4. To connect a top-level node to a node **inside** the portal, add the edge to the portal node's `interdimensionalEdges` array with composite `portalId-nestedNodeId` endpoints (see the recipe below). The container is confirmed; the exact endpoint encoding is confirmed from the plugin's own serialization code and only lacks a byte-check against a captured portal `.canvas` file. For a fully byte-verified path, connect top-level nodes only and let the plugin manage portal-internal edges after a reload.

### Before

```json
{ "id": "p1", "type": "file", "file": "Maps/Sub-canvas.canvas", "x": 0, "y": 0, "width": 600, "height": 400 }
```

### After

```json
{ "id": "p1", "type": "file", "file": "Maps/Sub-canvas.canvas", "x": 0, "y": 0, "width": 600, "height": 400, "portal": true }
```

### Add a cross-portal (interdimensional) edge

An edge from a top-level node to a node **inside** the portal is not a top-level edge — it goes in the portal node's `interdimensionalEdges` array, with the nested endpoint written as a composite `portalId-nestedNodeId` id:

```json
{
  "id": "p1", "type": "file", "file": "Maps/Sub-canvas.canvas",
  "x": 0, "y": 0, "width": 600, "height": 400, "portal": true,
  "interdimensionalEdges": [
    { "id": "ie1", "fromNode": "n1", "toNode": "p1-innerNodeId" }
  ]
}
```

The `interdimensionalEdges` container is confirmed, and the exact endpoint encoding is confirmed from the plugin's own serialization code (it joins the portal id and the nested node id with a `-` delimiter). The only remaining gap is a byte-check against a captured portal `.canvas` file; none exists, because the vault is read-only.

### Checkpoint

`portal_node_valid`: the node is `type: "file"`, `portal` is `true`, and `file` resolves to a real `.canvas` in the vault; any cross-portal edge is a well-formed entry in the portal node's `interdimensionalEdges[]`, not the top-level `edges` array.

---

## 6. BUILD A PRESENTATION

Goal: define a slide deck from the canvas graph.

### Steps

1. Pick the first slide's node and write its `id` into the top-level `metadata.startNode` (create `metadata` if the file has none — `data-model.md` §6).
2. Connect slides with edges in the order they should advance.
3. Where a slide has several outgoing edges, number each edge's `label` to fix the branch order.
4. Re-read and confirm `metadata.startNode` names a real node and every slide edge resolves.

### Before

```json
{ "nodes": [ { "id": "s1", "type": "text", "x": 0, "y": 0, "width": 400, "height": 300, "text": "Title" } ], "edges": [] }
```

### After

```json
{
  "nodes": [
    { "id": "s1", "type": "text", "x": 0, "y": 0, "width": 400, "height": 300, "text": "Title" },
    { "id": "s2", "type": "text", "x": 500, "y": 0, "width": 400, "height": 300, "text": "Agenda" }
  ],
  "edges": [ { "id": "e1", "fromNode": "s1", "toNode": "s2", "label": "1" } ],
  "metadata": { "version": "1.0-1.0", "frontmatter": {}, "startNode": "s1" }
}
```

### Checkpoint

`presentation_startnode_valid`: `metadata.startNode` is a real node id, and every outgoing slide edge resolves; branch edges carry numeric `label`s.

---

## 7. WIRE AUTO FILE-NODE EDGES

Goal: let file nodes auto-connect from frontmatter instead of hand-drawn edges.

### Steps

1. Confirm the Auto File Node Edges feature is enabled (a plugin setting) and the configured frontmatter key — default `canvas-edges`.
2. In the **target note's** frontmatter (not the `.canvas`), add the key listing the linked notes, so file nodes for those notes gain edges automatically.
3. Re-read the note frontmatter and confirm the linked targets exist as file nodes on the canvas.

### Example (in a note's frontmatter)

```yaml
---
canvas-edges:
  - "[[Related note]]"
---
```

### Checkpoint

`auto_edge_frontmatter_valid`: the configured key (default `canvas-edges`) lists real notes, and those notes appear as file nodes on the canvas.

---

## 8. EXPORT TO PNG / SVG

Goal: produce an image of the canvas or a selection.

Advanced Canvas exports **PNG and SVG** with options for transparency, a privacy mode, a logo toggle, and full-canvas or selection scope. Export is an **in-app command**, not a `.canvas` JSON key — there is no file-layer field to set. The AI prepares the canvas (nodes, styles, layout) at the JSON layer, then the export itself is run by the user from the canvas after a reload.

### Checkpoint

`export_is_in_app`: the export step is documented as an in-app action, and the file-layer work is limited to preparing the canvas JSON.

---

## 9. CONTROL NODE Z-ORDER

Goal: make a node draw on top of (or behind) overlapping nodes.

### Steps

1. Assign each overlapping node a unique integer `zIndex` — higher draws on top.
2. Sort the `nodes` array ascending by `zIndex` so array order matches the spec's requirement.
3. Re-read and confirm every `zIndex` is unique and the array is sorted ascending.

### Checkpoint

`z_order_valid`: overlapping nodes carry unique integer `zIndex` values and the `nodes` array is sorted ascending by `zIndex`.

---

## 10. VERIFYING

Run these named checkpoints after any Advanced Canvas operation:

| Checkpoint | What it proves |
| --- | --- |
| `canvas_json_valid` | The `.canvas` file still parses as JSON with intact `nodes`/`edges` arrays |
| `node_style_valid` | Node `styleAttributes` values are in the confirmed enumeration and used on the right node type |
| `edge_style_valid` | Edge `path`/`arrow`/`pathfindingMethod` are in range and endpoints resolve |
| `floating_edge_valid` | Floating ends have no competing fixed side and both endpoints resolve |
| `portal_node_valid` | The portal is a `file` node with `portal: true` and a resolving `.canvas` path |
| `presentation_startnode_valid` | `metadata.startNode` names a real node and slide edges resolve |
| `auto_edge_frontmatter_valid` | The auto-edge frontmatter key lists real notes present as file nodes |
| `z_order_valid` | Overlapping nodes carry unique integer `zIndex` values and `nodes[]` is sorted ascending by `zIndex` |

The file layer proves the write. The render proves itself in-app after the user reloads the canvas — that check belongs to the plugin-install phase, not this reference set.
