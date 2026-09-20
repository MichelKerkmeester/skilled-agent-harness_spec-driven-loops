---
title: "Iteration 3: Workflow Recipes, Gotchas, and Concrete Doc-Update Recommendations"
trigger_phrases: []
---
# Iteration 3: Workflow Recipes, Gotchas, and Concrete Doc-Update Recommendations

## Focus
Two-part synthesis:
1. **Missing workflows and gotchas synthesis** (Question #3): Collapse the 8 identified gaps into a structured set of gotchas with concrete `.canvas` JSON examples — especially `collapsedData` runtime state, the dash-in-composite-ID constraint, `zIndex` vs array-order duality, and `ratio` sentinel tolerance.
2. **Concrete doc-update recommendations** (Question #4): Draft specific additions per reference doc (`data-model.md`, `workflows.md`, `troubleshooting.md`, `advanced-canvas.md`) for each gap — naming the exact target section, the key/field/constraint to add, and recommended prose.

## Actions Taken

1. **Read all 4 reference docs** (`advanced-canvas.md`, `data-model.md`, `workflows.md`, `troubleshooting.md`) — mapped exact target sections, current content, and insertion points for every gap. [SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/*.md`]

2. **Re-read iteration 1 & 2 findings** and the progressive `research/research.md` — confirmed all 8 gaps from iteration 2 are still open and mapped to P0/P1/P2 priorities. The VERIFY item on cross-portal edges is already resolved at the spec level. [SOURCE: iteration-001.md, iteration-002.md, research.md]

3. **Verified `dynamicHeight` against spec and main.js** — the TypeScript typings define `dynamicHeight?: boolean` (confirmed). The main.js maps `dynamicHeight` to `node.autoResizeHeight`. The existing reference docs document `dynamicHeight` correctly; no gap. [SOURCE: 1.0-1.0.d.ts — `dynamicHeight?: boolean`; main.js v6.5.4 line 2457 — `node.dynamicHeight = node.autoResizeHeight`]

4. **Confirmed template storage model from main.js** — Template definitions carry `width`, `height`, `type`, `color`, `styleAttributes`, `label`, `icon`, and optionally `path` (file) / `url` (link). When a template node is created, `...template.styleAttributes` is spread onto the new node. Templates are stored in plugin settings (NOT in the `.canvas` file), but their effects manifest in the canvas JSON. The spec does not define a template storage format — templates are a plugin-UI feature. [SOURCE: main.js v6.5.4 lines 4032-4056 — template field reads and style spread]

5. **Verified metadata proxy from main.js** — `canvas.metadata` is wrapped in a `Proxy` with a validation handler. `frontmatterPosition` is computed and stored on the metadata object at save time. `frontmatterLinks` is derived. Neither `frontmatterPosition` nor `frontmatterLinks` are spec-defined; they are runtime-computed fields. [SOURCE: main.js v6.5.4 lines 3278-3296, 3696]

6. **Verified `fromEnd`/`toEnd` defaults from spec** — The spec states: `fromEnd` defaults to `none`, `toEnd` defaults to `arrow`. The reference docs mention these fields but not their defaults. Confirmed this is a concrete gap. [SOURCE: spec/1.0-1.0.md — §Edges]

7. **Crafted 4 structured gotchas with concrete examples and 8 doc-update recommendation blocks** (see Findings §1–§12 below).

## Findings

### Part A: Structured Gotchas (Workflow Synthesis)

#### Gotcha 1: `collapsedData` — Collapsed Group Members Vanish from `nodes[]` [P0]

When a group node is collapsed (`collapsed: true`), the plugin removes the group's member nodes from the top-level `nodes[]` array and stores them inside `groupNodeData.collapsedData` with offset coordinates:

```json
// BEFORE collapse — member nodes are in top-level nodes[]
{
  "nodes": [
    { "id": "g1", "type": "group", "x": 100, "y": 100, "width": 300, "height": 200, "collapsed": false },
    { "id": "n1", "type": "text", "x": 120, "y": 120, "width": 200, "height": 60, "text": "Member" }
  ],
  "edges": [
    { "id": "e1", "fromNode": "n1", "toNode": "n2" }
  ]
}

// AFTER collapse — member nodes REMOVED from nodes[], edges moved into collapsedData
{
  "nodes": [
    {
      "id": "g1", "type": "group", "x": 100, "y": 100, "width": 300, "height": 200, "collapsed": true,
      "collapsedData": {
        "nodes": [
          { "id": "n1", "type": "text", "x": 20, "y": 20, "width": 200, "height": 60, "text": "Member" }
        ],
        "edges": [
          { "id": "e1", "fromNode": "n1", "toNode": "n2" }
        ]
      }
    }
  ],
  "edges": []
}
```

**Critical:** The `collapsedData` coordinates are relative offsets from the group's origin (`x: nodeData.x + collapsedGroupData.x`). When the group is expanded, the plugin deletes `collapsedData` and restores member nodes to `nodes[]`. **`collapsedData` is NOT in the Advanced JSON Canvas spec** — it is a runtime-only payload. An AI reading a `.canvas` file must check for `collapsedData` to discover "hidden" member nodes. An AI writing should NOT create `collapsedData` from scratch — only the plugin should toggle it.

[SOURCE: main.js v6.5.4 — `x: nodeData.x + collapsedGroupData.x`, `data.edges.push(...collapsedData.edges)`, `delete groupNodeData.collapsedData` (iteration 1)]
[SOURCE: spec/1.0-1.0.md — only `collapsed?: boolean`, no `collapsedData` (iteration 2)]
[SOURCE: 1.0-1.0.d.ts — `collapsed?: boolean` only (iteration 2)]

---

#### Gotcha 2: The Dash in Node IDs — Never Use `-` in a Manual ID [P1]

The Advanced JSON Canvas spec states: _"Refrain from using `-` in the ID, as it is used to identify and manage nodes that are from portals."_ The plugin creates composite portal IDs as `${portalId}-${nodeId}` — a dash-joined string. If an AI manually assigns a node ID containing a dash (e.g., `"slide-1"`), the portal subsystem may misinterpret it as a portal-node reference.

**Safe pattern:** Use underscores, camelCase, or alphanumeric IDs: `"slide1"`, `"node_a"`, `"step2"`.

**Unsafe pattern:** `"canvas-1-node-5"` — contains dashes.

**Verification:** Before writing any `.canvas` file, scan all node IDs for `-` and flag any that collide with existing portal node IDs.

[SOURCE: spec/1.0-1.0.md — §Nodes: "Refrain from using `-` in the ID" (iteration 2)]
[SOURCE: main.js v6.5.4 — `edge.fromNode = \`${portalId}-${edge.fromNode}\`` (iteration 1)]

---

#### Gotcha 3: `zIndex` vs Array Order — Two Ordering Systems, One File [P2]

The spec states: _"Nodes are placed in the array in ascending order by z-index. The first node in the array should be displayed below all other nodes, and the last node in the array should be displayed on top."_

But `zIndex` is also a per-node persistent field. This creates a dual-ordering situation:

- **When `zIndex` is set on all nodes:** array position should mirror the zIndex sort.
- **When some nodes lack `zIndex`:** the plugin auto-assigns values from `this.canvas.zIndexCounter`. Array order and visual order can diverge.
- **AI reading:** Do not assume `nodes[0]` is the bottom-most node. Read `zIndex` values explicitly.
- **AI writing:** Prefer setting explicit `zIndex` values on all nodes, and ensure array order matches ascending zIndex.

```json
// Risky: array order says n1 (zIndex=10) before n2 (zIndex=5),
// but visual order puts n2 below n1
{
  "nodes": [
    { "id": "n1", "zIndex": 10, ... },
    { "id": "n2", "zIndex": 5, ... }
  ]
}
```

[SOURCE: spec/1.0-1.0.md — §Nodes: "Nodes are placed in the array in ascending order by z-index" (iteration 2)]
[SOURCE: main.js v6.5.4 — `this.zIndex = this.canvas.zIndexCounter`, `const finalZIndex = zIndex + i` (iteration 1)]

---

#### Gotcha 4: `ratio` Can Be a String — Tolerate `"No ratio enforcement"` [P1]

The spec TypeScript defines `ratio?: number`. But main.js v6.5.4 defines a sentinel `NO_RATIO = "No ratio enforcement"` — a **string** value used when ratio enforcement is disabled. An AI reading a `.canvas` file may encounter `"ratio": "No ratio enforcement"` on any node. Do NOT treat it as an error or try to parse it as a number.

**AI reading:** Tolerate `ratio` as `number | "No ratio enforcement"`. If `ratio` is absent or a number, treat it as the aspect ratio (`width / height`). If it is the string sentinel, treat it as "no ratio enforcement."

**AI writing:** Always write a numeric ratio (`width / height`) or omit the key entirely. Never write the string sentinel — it is an internal runtime constant.

```json
// Valid: numeric ratio
{ "id": "n1", "ratio": 1.5, ... }

// Valid at runtime (plugin may produce this): string sentinel
{ "id": "n1", "ratio": "No ratio enforcement", ... }

// Preferred for AI-authored nodes: omit when ratio enforcement is not needed
{ "id": "n1", ... }
```

[SOURCE: spec/1.0-1.0.md — `ratio (optional, float)` (iteration 2)]
[SOURCE: 1.0-1.0.d.ts — `ratio?: number` (iteration 2)]
[SOURCE: main.js v6.5.4 — `NO_RATIO = "No ratio enforcement"` (iteration 1)]

---

### Part B: Concrete Doc-Update Recommendations

#### Recommendation 1: Add `zIndex` to Extended Node Keys table [P0 — `data-model.md` §3]

**Insertion point:** In the Extended Node Keys table (§3), add a new row after `dynamicHeight`:

```markdown
| `zIndex` | integer | Draw order — higher values render on top of lower ones. Should be unique within a canvas. If absent, the plugin auto-assigns a value from an internal counter. The spec requires the `nodes[]` array to be in ascending `zIndex` order — the first node in the array is drawn below all others. |
```

**Insertion point:** In `data-model.md` §1 (Core contract), add a gotcha box after the third bullet:

```markdown
> **`zIndex` gotcha:** The `zIndex` field and the `nodes[]` array position are two ordering systems. When `zIndex` is set on some nodes but not others, array position and visual draw order can diverge. Always read `zIndex` explicitly — do not assume `nodes[0]` is the bottom-most element.
```

---

#### Recommendation 2: Document `interdimensionalEdges` and replace VERIFY flag [P0 — `data-model.md` §5, §7, `workflows.md` §5]

**Target: `data-model.md` §5 (Portals)**

Replace the VERIFY paragraph (lines 165–166) with:

```markdown
The embedded canvas's nodes are loaded and rendered inside the portal at runtime. Edges can connect a top-level node to a node **inside** a portal ("interdimensional edges"). These edges are stored in the portal node's `interdimensionalEdges` array — NOT in the top-level `edges[]`. Each edge in `interdimensionalEdges` uses composite endpoint IDs of the form `<portal-node-id>-<nested-node-id>` (e.g., `"p1-n3"` for node `n3` inside portal `p1`). The plugin rewrites the endpoint at save time; do not use `-` in manually-chosen node IDs.
```

**Insertion point:** Add a concrete example after the portal node JSON in §5:

```json
{
  "id": "p1",
  "type": "file",
  "file": "Maps/Sub-canvas.canvas",
  "x": 0, "y": 0, "width": 600, "height": 400,
  "portal": true,
  "interdimensionalEdges": [
    {
      "id": "ix1",
      "fromNode": "top-level-node-id",
      "toNode": "p1-nested-node-id",
      "fromSide": "right", "toSide": "left"
    }
  ]
}
```

**Target: `data-model.md` §7 (What the AI Must Not Do)**

Replace the second bullet (line 205) with:

```markdown
- Cross-portal edge authoring is now confirmed. Use the `interdimensionalEdges` array on the portal node with composite IDs (`${portalId}-${nodeId}`). Never use `-` in manually-chosen node IDs (see §5).
```

**Target: `workflows.md` §5 (Create a Portal)**

Add as step 4 (after the existing 3 steps):

```markdown
4. To connect a top-level node to a node inside the portal, add an edge to the portal node's `interdimensionalEdges` array. Use the composite ID pattern: `${portalId}-${nestedNodeId}` where `nestedNodeId` is the `id` of the target node inside the embedded `.canvas`. The `fromNode`/`toNode` endpoints use whichever side faces the portal.
```

**Target: `advanced-canvas.md` §4 (Guardrails)**

Replace the second bullet (line 65) with:

```markdown
- **Interdimensional edges are confirmed.** An edge that connects into or out of a portal lives in the portal node's `interdimensionalEdges` array, using composite IDs (`portalId-nestedNodeId`). Never use `-` in a manually-chosen node ID, as it conflicts with portal composite ID detection.
```

**Target: `troubleshooting.md` §4 (Portal Broken)**

Replace the "Cross-portal edge hand-authored" row (line 84) with:

```markdown
| Cross-portal edge wrong or missing | The edge is in the top-level `edges[]` instead of the portal node's `interdimensionalEdges[]`, the composite ID is malformed, or the nested node ID does not exist in the embedded canvas | Move the edge to `interdimensionalEdges[]` on the portal node. Use composite IDs of the form `portalId-nestedNodeId`. Confirm the nested node ID exists in the embedded `.canvas`. |
```

---

#### Recommendation 3: Document `collapsedData` runtime behavior [P0 — `data-model.md` §3, `troubleshooting.md`]

**Insertion point:** `data-model.md` §3 — add a detail row under the `collapsed` table row:

```markdown
| `collapsedData` | object | **Runtime-only.** When a group is collapsed (`collapsed: true`), the plugin removes its descendant nodes and edges from the top-level `nodes[]`/`edges[]` and nests them here with coordinates relative to the group's origin. Expanding the group restores them and deletes `collapsedData`. This key is NOT in the Advanced JSON Canvas spec — it is generated by the plugin at collapse time. Never create this payload manually; let the plugin toggle collapse. |
```

**Insertion point:** `troubleshooting.md` §1 symptom table — add before "Canvas will not open at all":

```markdown
| Group member nodes missing from `nodes[]` | The group is collapsed — members are nested inside `groupNodeData.collapsedData`, not in `nodes[]` | Check `collapsedData` on the group node. To expose members, set `collapsed: false` and delete `collapsedData`, then restore the member nodes and edges to the top-level arrays. |
```

---

#### Recommendation 4: Document the portal composite ID constraint [P1 — `data-model.md` §2]

**Insertion point:** `data-model.md` §2, in the `id` row of the Node — common fields table, add a note:

```markdown
| `id` | string | Unique within the canvas. **Constraint:** do not use `-` (dash) in manually-chosen IDs. The plugin uses dashes to construct composite IDs for portal nodes (`portalId-nodeId`). IDs containing dashes may be misidentified as portal-node references. Use underscores or camelCase instead. |
```

---

#### Recommendation 5: Update `ratio` type to include string sentinel [P1 — `data-model.md` §3]

**Target:** `data-model.md` §3 Extended Node Keys table — update the `ratio` row:

```markdown
| `ratio` | number \| string | Aspect ratio used when the node auto-resizes, normally `width / height`. The plugin may write the string `"No ratio enforcement"` as a sentinel when ratio enforcement is disabled. When reading, tolerate both. When writing, use a numeric ratio or omit the key entirely — never write the string sentinel. |
```

---

#### Recommendation 6: Document `styleAttributes` null values [P2 — `data-model.md` §3]

**Insertion point:** `data-model.md` §3, after the styleAttributes value table, add:

```markdown
\> **Null values in `styleAttributes`:** The plugin's TypeScript type allows `{ [key: string]: string | null }`. Writing `null` for a key unsets that attribute — the plugin treats it the same as omitting the key. This is used internally by the template system when a template defines a style that should not carry over. When hand-authoring, prefer omitting unused keys rather than writing `null`.
```

---

#### Recommendation 7: Add z-ordering workflow recipe [P2 — `workflows.md`]

**Insertion point:** `workflows.md` — add as §9 (after §8 Export), renumbering existing §9 to §10:

```markdown
## 9. CONTROL NODE Z-ORDER

Goal: set explicit draw order so nodes stack correctly.

### Steps

1. Set a numeric `zIndex` on each node. Higher values render on top.
2. Ensure `zIndex` values are unique within the canvas to avoid ties.
3. Sort the `nodes[]` array in ascending `zIndex` order — first node (lowest zIndex) at the bottom of the array.
4. Re-read and confirm the array order matches the zIndex sort.

### Before

\`\`\`json
{
  "nodes": [
    { "id": "bg", "type": "text", "x": 0, "y": 0, "width": 400, "height": 300 },
    { "id": "fg", "type": "text", "x": 50, "y": 50, "width": 300, "height": 200 }
  ]
}
\`\`\`

### After

\`\`\`json
{
  "nodes": [
    { "id": "bg", "type": "text", "x": 0, "y": 0, "width": 400, "height": 300, "zIndex": 1 },
    { "id": "fg", "type": "text", "x": 50, "y": 50, "width": 300, "height": 200, "zIndex": 2 }
  ]
}
\`\`\`

### Checkpoint

\`z_order_valid\`: every node has a numeric `zIndex`, values are unique, and the `nodes[]` array is sorted ascending by `zIndex`.
```

---

#### Recommendation 8: Document `fromEnd`/`toEnd` defaults [P2 — `data-model.md` §2]

**Target:** `data-model.md` §2 Edge — fields table — update the `fromEnd`/`toEnd` row:

```markdown
| `fromEnd`, `toEnd` | string | Optional. `none` / `arrow`. **Defaults:** `fromEnd` defaults to `none` (no arrow at source). `toEnd` defaults to `arrow` (arrow at target). Omitting both keys yields a standard arrow from source to target. |
```

---

### Additional Findings

#### Finding 9: Template definitions are plugin-setting data, not canvas JSON

Templates are stored in the plugin's settings (`data.json`), not inside `.canvas` files. When a template node is created, the plugin spreads `template.styleAttributes` onto the new node. The template definition itself carries `width`, `height`, `type`, `color`, `styleAttributes`, `label`, `icon`, and optionally `path` (file) / `url` (link). An AI reading a `.canvas` file sees only the resulting node, not the template that created it. This is relevant for `mcp-obsidian` operations: templates are a UI shortcut, not a file-layer construct. [SOURCE: main.js v6.5.4 lines 4032-4056]

#### Finding 10: `dynamicHeight` documentation matches spec — confirmed no gap

The spec defines `dynamicHeight?: boolean`. The reference docs document it as "Per-node auto-resize toggle — the node grows to fit its content." Both are correct. No update needed for this field. [SOURCE: 1.0-1.0.d.ts; data-model.md §3; main.js line 2457 — `node.dynamicHeight = node.autoResizeHeight`]

## Ruled Out

- No approaches ruled out. All targeted research actions (doc reads, main.js greps) produced useful evidence.
- The `dynamicHeight` verification confirmed the docs are already correct — no gap to add.

## Dead Ends

- None. The synthesis phase uses existing evidence; no new unproductive paths attempted.

## Edge Cases

- **Ambiguous input**: None — the two-part focus was clearly specified in dispatch context.
- **Contradictory evidence**: None — the spec, TypeScript types, and main.js behavior are consistent across all verified fields.
- **Missing dependencies**: No `.canvas` files in vault (already known from iteration 2). This does not block synthesis — all evidence is from spec + compiled code.
- **Partial success**: None — all research actions completed successfully.

## Sources Consulted

- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/advanced-canvas.md` (70 lines — read to map VERIFY item locations)
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/data-model.md` (208 lines — read to map section-level insertion points for all 8 gaps)
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/workflows.md` (250 lines — read to identify missing workflow recipes)
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/troubleshooting.md` (149 lines — read to map symptom-table additions)
- `specs/.../001-advanced-canvas/research/iterations/iteration-001.md` (prior findings re-cited)
- `specs/.../001-advanced-canvas/research/iterations/iteration-002.md` (8 gaps extracted)
- `specs/.../001-advanced-canvas/research/research.md` (progressive synthesis baseline)
- [https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.md](https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.md) (iteration 2 evidence re-cited)
- [https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.d.ts](https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.d.ts) (iteration 2 evidence re-cited)
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Michel Kerkmeester/.obsidian/plugins/advanced-canvas/main.js` (v6.5.4, compiled) — iteration 1 evidence re-cited; targeted greps for `dynamicHeight`, `metadata`, `template` confirmed

## Assessment

- New information ratio: **0.67** (4 fully new findings: the 4 structured gotchas with concrete JSON examples and operational rules; 4 partially new findings: the 8 doc-update recommendations build on known gaps but add exact target sections, prose, and insertion points; 2 confirmations: `dynamicHeight` no-gap, template storage model)
- Questions addressed: Q3 (workflows/gotchas), Q4 (concrete doc additions), Q1 (additional schema fields: `dynamicHeight` verified, template/`metadata.frontmatterPosition` confirmed runtime-only)
- Questions answered:
  - Q3 (Missing workflows and gotchas): **Answered** — 4 structured gotchas with concrete examples + 8 doc-update recommendations with exact prose
  - Q4 (Concrete doc additions): **Answered** — 8 recommendations with exact target sections, insertion points, and recommended prose for `data-model.md`, `workflows.md`, `troubleshooting.md`, and `advanced-canvas.md`
  - Q1 (Extended schema): **Advanced** — `dynamicHeight` gap disproven (docs match spec); template storage model and metadata internal fields confirmed as non-canvas-JSON data

## Reflection

- **What worked**: Mapping the exact target sections in every reference doc before drafting recommendations was essential. It turned the gap list from iteration 2 (abstract: "add zIndex to data-model.md §3") into actionable text (exact table row with type, meaning, and constraint notes). The structured gotchas with concrete JSON examples make the operational risks immediately clear to an AI reader.
- **What did not work**: Some findings turned out to be non-gaps after verification (`dynamicHeight` docs are correct). This is productive — it narrows the remaining work to exactly 8 concrete changes, not 10.
- **What I would do differently**: The 8 recommendations now cover every reference doc except `advanced-canvas.md` §1 (the overview table should list `zIndex` and `interdimensionalEdges` in the coverage claim). The final iteration should address that plus the remaining spec-level coverage gaps: the `advanced-canvas.md` VERIFY flags need updating, and the `metadata.frontmatterPosition`/`frontmatterLinks` fields should be documented as runtime-only to prevent AI confusion.

## Recommended Next Focus

1. **Final convergence pass** (iteration 4): Address the remaining loose ends:
   - Update `advanced-canvas.md`: ensure the overview/coverage claim lists `zIndex`, `interdimensionalEdges`, and `collapsedData` behavior
   - Verify all VERIFY flags across all 4 docs are resolved or documented as resolved
   - Confirm no remaining open questions from the key-questions list need further evidence
2. **Reduce and close**: The 8 concrete recommendations are ready for reducer promotion to the findings registry. The remaining question #5 (doc vs actual behavior differences) has 6+ confirmed gaps — all surfaced in the recommendations. Q1 (extended schema) is substantially answered — the remaining unknown is whether any additional undocumented keys exist in the plugin that the main.js grep passes may have missed, but the spec coverage is now authoritative.