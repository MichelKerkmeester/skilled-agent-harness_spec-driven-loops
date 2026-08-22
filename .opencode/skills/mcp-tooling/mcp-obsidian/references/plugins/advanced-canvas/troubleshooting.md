---
title: "Advanced Canvas Plugin File-Layer Troubleshooting"
description: "Cause, detection and file-layer recovery for Advanced Canvas plugin failures: node or edge style not rendering, invalid style value, broken portal, presentation not starting, version-gated features and native-reader compatibility."
trigger_phrases:
  - "advanced canvas node not rendering"
  - "advanced canvas style not applied"
  - "advanced canvas portal broken"
  - "advanced canvas presentation not starting"
  - "advanced canvas invalid canvas json"
  - "advanced canvas version compatibility"
importance_tier: "normal"
contextType: "general"
version: "0.1.0.0"
---

# Advanced Canvas Plugin File-Layer Troubleshooting

Diagnose the `.canvas` JSON, the individual node/edge objects and the `metadata` block separately. A file that parses can still carry a style value the plugin does not recognise, or a portal path that does not resolve.

---

## 1. OVERVIEW

| Symptom | Most likely cause |
| --- | --- |
| Node keeps its default look | `styleAttributes` value outside the confirmed enumeration, or `shape`/`textAlign` used on a non-`text` node |
| Edge style ignored | `path`/`arrow`/`pathfindingMethod` value misspelled, or written outside a `styleAttributes` object |
| Floating edge snaps to a fixed side | A `fromSide`/`toSide` is still pinned alongside `fromFloating`/`toFloating` |
| Portal shows nothing | `portal` not `true`, node not `type: "file"`, or the `file` path does not resolve to a real `.canvas` |
| Cross-portal edge is wrong or lost | Hand-authored interdimensional edge — its serialized shape is unconfirmed (`VERIFY`) |
| Presentation will not start | `metadata.startNode` missing, or it names a node id that no longer exists |
| Slide order wrong | Branch edges missing numeric `label`s to disambiguate multiple outgoing edges |
| Canvas will not open at all | Invalid JSON, or a native field (`id`/`type`/`x`/`y`/`width`/`height`) removed |
| Feature absent entirely | Obsidian below `minAppVersion` 1.13.0, or the feature disabled in plugin settings |
| Old look on screen | The canvas pane needs a reload |

---

## 2. DIAGNOSIS SEQUENCE

1. Read the whole `.canvas` file and confirm it parses as JSON with intact `nodes`/`edges` arrays.
2. Read the specific node/edge object by `id` before assuming a value is wrong.
3. For a style, compare every `styleAttributes` value against the confirmed enumeration in `data-model.md` §3–§4.
4. For a floating edge, confirm the floating end has no competing `fromSide`/`toSide`.
5. For a portal, confirm the node is `type: "file"`, `portal` is `true`, and `file` resolves to a real `.canvas`.
6. For a presentation, confirm `metadata.startNode` names an existing node and slide edges resolve.
7. Confirm the Obsidian app version is 1.13.0+ and the relevant feature is enabled in settings.
8. Check the render step last: the user must reload the canvas after any file change.

---

## 3. STYLE NOT APPLIED

| Cause | Check | Fix |
| --- | --- | --- |
| Style value misspelled (`dimond`, `astar`) | Compare against the confirmed enumeration | Correct to an exact value from `data-model.md` §3–§4 |
| `shape`/`textAlign` on a non-`text` node | Confirm the node's `type` | Move the styling to a `text` node; only `border` applies to any node |
| Style keys written directly on the node, not inside `styleAttributes` | Inspect the node object shape | Nest the keys inside a `styleAttributes` object |
| Node-styling / edge-styling feature disabled | Check plugin settings | Enable the feature, then reload |

### Example

Before (invalid `shape` value, and `path` written at the wrong level):

```json
{ "id": "n1", "type": "text", "x": 0, "y": 0, "width": 200, "height": 80, "text": "Q?", "shape": "rhombus" }
```

After (valid `shape`, nested correctly):

```json
{ "id": "n1", "type": "text", "x": 0, "y": 0, "width": 200, "height": 80, "text": "Q?", "styleAttributes": { "shape": "diamond" } }
```

---

## 4. PORTAL BROKEN

| Cause | Check | Fix |
| --- | --- | --- |
| `portal` not set | Read the node for `portal: true` | Add `portal: true` to the `file` node |
| Node is not a file node | Confirm `type: "file"` | A portal must be a `file` node whose `file` is a `.canvas` |
| `file` path does not resolve | Compare the `file` value against the vault's real paths | Correct the path, or create the missing `.canvas` |
| Cross-portal edge hand-authored | Look for an edge whose endpoint targets a node inside the portal | Remove the hand-authored interdimensional edge; connect top-level nodes only and let the plugin manage portal-internal edges after a reload. The exact serialized shape is `VERIFY` |

---

## 5. PRESENTATION NOT STARTING OR OUT OF ORDER

| Cause | Check | Fix |
| --- | --- | --- |
| No start node | Read `metadata.startNode` | Set it to the first slide's node id (`data-model.md` §6) |
| Start node id stale | Confirm the id still exists in `nodes` | Point `startNode` at a real node |
| Per-node `isStartNode` used | Grep the nodes for a legacy `isStartNode` flag | Remove it and set `metadata.startNode` instead — this build stores the start slide at canvas level |
| Branch order ambiguous | Check outgoing edges on a slide with several exits | Number each branch edge's `label` to fix the order |

---

## 6. VERSION-GATED AND COMPATIBILITY ISSUES

| Cause | Check | Fix |
| --- | --- | --- |
| Feature missing entirely | Confirm Obsidian is 1.13.0+ (`minAppVersion`) | Update Obsidian; below the floor the plugin will not load |
| Feature disabled | Check the plugin's settings for that feature toggle | Enable it, then reload the canvas |
| Extended keys stripped by another tool | Diff against the `.bak` backup | Restore and re-apply only the intended edit — some editors that only understand native canvas will drop the extra keys |
| Canvas opened in vanilla Obsidian looks plain | Expected — native reader ignores extended keys | No fix needed; the keys persist and re-render when Advanced Canvas is active |

Advanced Canvas keys are additive, so a canvas stays openable in vanilla Obsidian. The risk is a third-party tool that rewrites the `.canvas` and drops the extra keys — always back up before letting another tool touch the file.

---

## 7. RECOVERY

| Problem | Fix |
| --- | --- |
| Style ignored | Correct the value to a confirmed enumeration and nest it in `styleAttributes` |
| Floating edge snaps to a side | Remove the competing `fromSide`/`toSide` |
| Portal blank | Set `portal: true` on a `file` node with a resolving `.canvas` path |
| Cross-portal edge wrong | Remove the hand-authored interdimensional edge; connect top-level nodes only |
| Presentation dead | Set `metadata.startNode` to a real node id; number branch edge labels |
| Canvas will not open | Restore from `.bak`; re-apply only the intended edit; confirm native fields intact |
| Feature absent | Update Obsidian to 1.13.0+ and enable the feature in settings |
| Stale render | Reload the canvas pane |

---

## 8. VALIDATION CHECKPOINTS

| Checkpoint | What it proves |
| --- | --- |
| `canvas_json_valid` | The `.canvas` parses and its `nodes`/`edges` arrays and native fields are intact |
| `canvas_backed_up` | A `.bak` copy exists before any structural write |
| `node_style_valid` | Node `styleAttributes` values are in range and used on the correct node type |
| `edge_style_valid` | Edge `path`/`arrow`/`pathfindingMethod` are in range and endpoints resolve |
| `floating_edge_valid` | Each floating end has no competing fixed side |
| `portal_node_valid` | The portal is a `file` node with `portal: true` and a resolving path; no hand-authored cross-portal edge |
| `presentation_startnode_valid` | `metadata.startNode` names a real node and slide edges resolve |
| `app_version_supported` | Obsidian is at or above `minAppVersion` 1.13.0 |
| `reload_advised` | The user knows a canvas reload is required to see the render |

---

## 9. LIMITS

- The AI verifies the `.canvas` JSON and computes structure by hand. The plugin renders in-app, so visual confirmation of a shape, portal, presentation or export needs the user.
- Every extended node/edge key and every `styleAttributes` value is confirmed against the installed build (`main.js` 6.5.4). The one open item is the serialized shape of a cross-portal ("interdimensional") edge — `VERIFY` before hand-authoring one (`data-model.md` §5/§7).
- Export (PNG/SVG) is an in-app command with no file-layer key; the AI can only prepare the canvas JSON, not trigger the export.
- Extended keys are additive and native-compatible, but a third-party tool that only understands native canvas can strip them — back up first.
- Never claim a shape, edge, portal, presentation or export rendered in the plugin's UI. The JSON write proves the shape; a reload proves the render.
