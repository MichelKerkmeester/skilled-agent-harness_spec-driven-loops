# Iteration 4: Final Convergence Pass — VERIFY Flag Audit, Q1/Q5 Closure, Complete Recommendation Synthesis

## Focus

Final convergence pass with four objectives:
1. **Audit all VERIFY flags** across all 4 reference docs — locate every instance, confirm each is now resolved by evidence, and enumerate the exact replacement text needed.
2. **Close Q1 (extended schema)** — produce the definitive extended `.canvas` JSON schema table including every non-standard key: spec-defined, plugin-runtime-only, and internal.
3. **Close Q5 (doc vs actual differences)** — produce the exhaustive gap inventory between the current reference docs and the real plugin v6.5.4 behavior, with priorities and evidence sources.
4. **Update `advanced-canvas.md` overview** — identify every location where `zIndex`, `interdimensionalEdges`, and `collapsedData` must be added to the coverage claim.

## Actions Taken

1. Read state files: config (progressiveSynthesis=true, maxIterations=4), JSONL (3 prior iterations), strategy (machine-owned sections reflect iteration 1-3 findings), findings registry (all 5 questions still marked unresolved).
2. Read all 4 reference docs in full and mapped every VERIFY flag and coverage gap to exact line numbers.
3. Verified that no exhausted approaches were violated — all evidence is from existing sources (spec, types, main.js).
4. Synthesized the convergence summary across all 4 iterations into a single authoritative document.

## Findings

### Part A: VERIFY Flag Audit — Complete Inventory

Every VERIFY flag across all 4 docs is listed below with its resolution status. All are now confirmable as RESOLVED against spec + main.js evidence.

| # | Doc | Line | Text Excerpt | Resolution |
|---|-----|------|-------------|------------|
| 1 | `advanced-canvas.md` | 34 | "The single detail marked `VERIFY` is the exact serialized shape of a cross-portal ("interdimensional") edge" | **RESOLVED** — `interdimensionalEdges[]` on portal file node with composite `${portalId}-${nodeId}` IDs. Confirmed at spec level (`spec/1.0-1.0.md`, `1.0-1.0.d.ts`) and code level (`main.js` v6.5.4). |
| 2 | `advanced-canvas.md` | 65 | "The exact serialized shape of a *cross-portal edge* (an edge whose endpoint is a node inside a portal) is the one detail marked `VERIFY` — do not hand-author interdimensional edges as fact" | **RESOLVED** — Replace with confirmed serialization: "Interdimensional edges are confirmed. An edge that connects into or out of a portal lives in the portal node's `interdimensionalEdges` array, using composite IDs (`portalId-nestedNodeId`)." |
| 3 | `data-model.md` | 20 | "The single open item is the serialized shape of a cross-portal edge — **VERIFY** before hand-authoring one (§7)." | **RESOLVED** — Replace with: "Cross-portal edges use the `interdimensionalEdges` array on the portal file node with composite `${portalId}-${nodeId}` endpoint IDs — confirmed from the Advanced JSON Canvas spec (§5)." |
| 4 | `data-model.md` §5 | 165 | "the exact serialized shape of such an edge — how its endpoint references a nested portal node — is not confirmed from the installed build. **VERIFY**" | **RESOLVED** — Replace entire paragraph with confirmed documentation: `interdimensionalEdges` array, composite ID pattern, concrete JSON example, dash constraint. (See Recommendation 2 from Iteration 3.) |
| 5 | `data-model.md` §7 | 205 | "Never hand-author a cross-portal ("interdimensional") edge as byte-verified syntax — that serialized shape is the one `VERIFY` item (§5)." | **RESOLVED** — Replace with: "Cross-portal edge authoring is now confirmed. Use the `interdimensionalEdges` array on the portal node with composite IDs (`${portalId}-${nodeId}`). Never use `-` in manually-chosen node IDs (see §5)." |
| 6 | `workflows.md` | 20 | "The one open item is the serialized shape of a cross-portal edge — `VERIFY` before hand-authoring one (`data-model.md` §5/§7)." | **RESOLVED** — Replace with: "Cross-portal edges use `interdimensionalEdges[]` on the portal node. The serialized shape is confirmed against the Advanced JSON Canvas spec — see `data-model.md` §5 for the documented pattern." |
| 7 | `workflows.md` §5 step 4 | 143 | "Do **not** hand-author edges into nodes inside the portal — that serialized shape is unconfirmed (`data-model.md` §5)." | **RESOLVED** — Replace with the confirmed interdimensional edge authoring recipe (see Iteration 3, Recommendation 2 workflow step 4). |
| 8 | `workflows.md` §5 checkpoint | 159 | "No hand-authored cross-portal edge." | **RESOLVED** — Update to: "No malformed cross-portal edge — `interdimensionalEdges[]` uses composite IDs (`portalId-nestedNodeId`), the nested node ID exists in the embedded canvas, and no manually-chosen node ID contains a `-`." |
| 9 | `troubleshooting.md` §1 | 30 | "Cross-portal edge is wrong or lost \| Hand-authored interdimensional edge — its serialized shape is unconfirmed (`VERIFY`)" | **RESOLVED** — Replace row with the confirmed symptom/diagnosis/fix from Iteration 3, Recommendation 2. |
| 10 | `troubleshooting.md` §4 | 84 | "The exact serialized shape is `VERIFY`" | **RESOLVED** — Replace with the confirmed fix: "Move the edge to `interdimensionalEdges[]` on the portal node. Use composite IDs of the form `portalId-nestedNodeId`. Confirm the nested node ID exists in the embedded `.canvas`." |
| 11 | `troubleshooting.md` §7 | 119 | "Cross-portal edge wrong \| Remove the hand-authored interdimensional edge; connect top-level nodes only" | **RESOLVED** — Update recovery row to reflect confirmed pattern instead of "remove." |
| 12 | `troubleshooting.md` §9 | 146 | "The one open item is the serialized shape of a cross-portal ("interdimensional") edge — `VERIFY` before hand-authoring one (`data-model.md` §5/§7)." | **RESOLVED** — Remove the VERIFY language; replace with confirmed statement that cross-portal edges use `interdimensionalEdges[]`. |

**Result: All 12 VERIFY flags resolved.** Every instance has a confirmed resolution backed by three independent evidence layers: the Advanced JSON Canvas specification (`spec/1.0-1.0.md`), the TypeScript type definitions (`1.0-1.0.d.ts`), and the compiled plugin (`main.js` v6.5.4).

[SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/advanced-canvas.md` — lines 34, 65]
[SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/data-model.md` — lines 20, 165, 205]
[SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/workflows.md` — lines 20, 143, 159]
[SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/troubleshooting.md` — lines 30, 84, 119, 146]
[SOURCE: `https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.md` — File type nodes: `interdimensionalEdges`]
[SOURCE: `https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.d.ts` — `interdimensionalEdges?: CanvasEdgeData[]`]
[SOURCE: `main.js` v6.5.4 — `edge.fromNode = \`${portalId}-${edge.fromNode}\`` (iteration 1)]

---

### Part B: Q1 Closure — Definitive Extended .canvas JSON Schema

The complete extended `.canvas` JSON schema for Advanced Canvas v6.5.4, including all keys beyond the native JSON Canvas 1.0 spec:

#### Extended Node Keys

| Key | Type(s) | Spec Status | Documentation |
|-----|---------|-------------|---------------|
| `zIndex` | `number` (integer) | **Spec-defined** — on `CanvasNodeData` base | Draw order. Higher values render on top. Should be unique. Absent → plugin auto-assigns from internal counter. The `nodes[]` array must be in ascending `zIndex` order per spec. |
| `styleAttributes` | `object` — see below | **Spec-defined** | Node styling: `shape`, `textAlign`, `border`. Type: `{ [key: string]: string \| null }`. `null` is valid. |
| `collapsed` | `boolean` | **Spec-defined** — on `CanvasGroupNodeData` | `true` collapses a group node. |
| `collapsedData` | `object` | **Runtime-only** — NOT in spec | When `collapsed: true`, the plugin nests member nodes/edges here with offset coordinates (`x: nodeData.x + collapsedGroupData.x`). Expanding the group deletes this key. Never create from scratch. |
| `portal` | `boolean` | **Spec-defined** — on `CanvasFileNodeData` | `true` on a `file` node embeds the referenced `.canvas` as canvas-in-canvas. |
| `interdimensionalEdges` | `CanvasEdgeData[]` | **Spec-defined** — on `CanvasFileNodeData` | Cross-portal edges stored on the portal file node, NOT in top-level `edges[]`. Each edge uses composite `${portalId}-${nodeId}` endpoint IDs. |
| `dynamicHeight` | `boolean` | **Spec-defined** | Per-node auto-resize toggle. Maps to `node.autoResizeHeight` in main.js. Docs already correct. |
| `ratio` | `number` \| `"No ratio enforcement"` | **Spec: `number` only** | Aspect ratio (`width / height`). main.js defines a string sentinel. Spec type is `number`; runtime may write the string. Read: tolerate both. Write: numeric or omit. |

#### Extended Edge Keys

| Key | Type | Spec Status | Documentation |
|-----|------|-------------|---------------|
| `styleAttributes` | `object` | **Spec-defined** | Edge styling: `path`, `arrow`, `pathfindingMethod`. Type: `{ [key: string]: string \| null }`. |
| `fromFloating` | `boolean` | **Spec-defined** | `true` lets plugin auto-pick `fromSide`. Remove `fromSide` when set. |
| `toFloating` | `boolean` | **Spec-defined** | `true` lets plugin auto-pick `toSide`. Remove `toSide` when set. |
| `fromEnd` | `"none"` \| `"arrow"` | **Native field, defaults documented in spec** | Defaults to `none`. Omitted → no arrow at source. |
| `toEnd` | `"none"` \| `"arrow"` | **Native field, defaults documented in spec** | Defaults to `arrow`. Omitted → arrow at target. |

#### Metadata Block Keys

| Key | Type | Spec Status | Documentation |
|-----|------|-------------|---------------|
| `version` | `string` | **Spec-defined** | Advanced JSON Canvas spec marker (`"1.0-1.0"` on v6.5.4). |
| `frontmatter` | `object` | **Spec-defined** | `.canvas` file frontmatter. Any keys. |
| `startNode` | `string` (node id) | **Spec-defined** | Presentation start slide node id. |

#### Internal / Runtime-Only (not documented in spec)

| Item | Location | Behavior |
|------|----------|----------|
| `collapsedData` | On group nodes | Nested member nodes/edges when collapsed. Runtime-only — never write manually. |
| `metadata.frontmatterPosition` | `metadata` object | Proxy-computed field for frontmatter position tracking. Runtime-only. |
| `metadata.frontmatterLinks` | `metadata` object | Proxy-derived field for frontmatter link processing. Runtime-only. |
| Template definitions | Plugin settings (`data.json`) | Templates carry `width`, `height`, `type`, `color`, `styleAttributes`, `label`, `icon`, `path`/`url`. NOT in `.canvas` files. When applied, `...template.styleAttributes` is spread onto the new node. |

#### Confirmed Style Enumerations (no gaps — docs are accurate)

- **`shape`** (text nodes): `pill`, `diamond`, `parallelogram`, `circle`, `predefined-process`, `document`, `database`
- **`textAlign`** (text nodes): `center`, `right`
- **`border`** (any node): `dashed`, `dotted`, `invisible`
- **`path`** (edges): `dotted`, `short-dashed`, `long-dashed`
- **`arrow`** (edges): `triangle-outline`, `thin-triangle`, `halved-triangle`, `diamond`, `diamond-outline`, `circle`, `circle-outline`, `blunt`
- **`pathfindingMethod`** (edges): `direct`, `square`, `a-star`

[SOURCE: spec/1.0-1.0.md — all fields enumerated above]
[SOURCE: 1.0-1.0.d.ts — `CanvasNodeData`, `CanvasFileNodeData`, `CanvasGroupNodeData`, `CanvasEdgeData` interfaces]
[SOURCE: main.js v6.5.4 — `zIndex`, `collapsedData`, `NO_RATIO`, `dynamicHeight`, `metadata` Proxy (iterations 1-3)]
[SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/data-model.md` §3–§4 — current documented state]

---

### Part C: Q5 Closure — Complete Doc vs Actual Behavior Gap Inventory

6 confirmed gaps between current reference docs and real v6.5.4 behavior:

| # | Gap | Priority | Evidence Layers | Current Doc State |
|---|-----|----------|-----------------|-------------------|
| 1 | **`zIndex` absent from all 4 docs** | P0 | spec (§Nodes: `zIndex` optional integer), .d.ts (`zIndex?: number`), main.js (`this.zIndex = this.canvas.zIndexCounter`, `zIndex: value`) | Zero mentions across `data-model.md` §3, `advanced-canvas.md` overview, `workflows.md`, `troubleshooting.md` |
| 2 | **`interdimensionalEdges` absent — all docs say "VERIFY" instead** | P0 | spec (File type: `interdimensionalEdges` array), .d.ts (`interdimensionalEdges?: CanvasEdgeData[]`), main.js (composite `${portalId}-${nodeId}` rewrite) | 12 VERIFY flags across all 4 docs; no documentation of the confirmed array-on-portal serialization |
| 3 | **`collapsedData` runtime behavior not documented** | P0 | main.js (`x: nodeData.x + collapsedGroupData.x`, `data.edges.push(...collapsedData.edges)`, `delete groupNodeData.collapsedData`) | Only `collapsed: boolean` documented; zero mention that member nodes move out of `nodes[]` into a nested payload |
| 4 | **Portal composite ID constraint (`-` in IDs) not in `data-model.md` §2** | P1 | spec ("Refrain from using `-` in the ID"), main.js (`edge.fromNode = \`${portalId}-${edge.fromNode}\``) | `data-model.md` §2 `id` row: "Unique within the canvas" — no mention of dash constraint |
| 5 | **`ratio` type is `number \| "No ratio enforcement"` — docs say `number` only** | P1 | spec (float), .d.ts (`ratio?: number`), main.js (`NO_RATIO = "No ratio enforcement"`) | `data-model.md` §3: "ratio \| number \| Aspect ratio..." — no mention of string sentinel |
| 6 | **`fromEnd`/`toEnd` defaults not documented** | P2 | spec (`fromEnd` defaults to `none`, `toEnd` defaults to `arrow`) | `data-model.md` §2: "Optional. `none` / `arrow`" — no defaults stated; `toEnd` row says "defaults to `arrow`" but `fromEnd` row does not have the same detail |

**Confirmed non-gaps** (verified correct in existing docs):
- `dynamicHeight`: docs document it correctly — matches spec and main.js
- Style enumerations (§3–§4): all values confirmed verbatim in main.js
- Presentation migration (`isStartNode` → `metadata.startNode`): docs are correct
- Template storage model: templates live in plugin settings, not `.canvas` JSON — correct
- `metadata.frontmatterPosition`/`frontmatterLinks`: runtime-only internal fields, correctly not documented

[SOURCE: iteration-001.md — findings 1-7 (main.js greps)]
[SOURCE: iteration-002.md — findings 1-9 (spec + .d.ts confirmations)]
[SOURCE: iteration-003.md — findings 1-12 (gap verification, gotcha synthesis, recommendation drafting)]
[SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/*.md` — current doc state audit (this iteration)]

---

### Part D: `advanced-canvas.md` Overview Update Needs

The `advanced-canvas.md` index file has three locations that need updating to reflect the converged research:

#### 1. Coverage claim (§1, line 32)

Current:
> "Custom node shapes/borders, edge path/arrow styles, 4 edge pathfinding methods, floating edges, portals (canvas-in-canvas), collapsible groups, a presentation start node, `.canvas` frontmatter + metadata-cache integration, and PNG/SVG export"

**Missing:** `zIndex` (node draw ordering), `interdimensionalEdges` (cross-portal edge serialization), `collapsedData` (collapsed group member payload).

Proposed:
> "Custom node shapes/borders, node z-ordering (`zIndex`), edge path/arrow styles, 4 edge pathfinding methods, floating edges, portals with cross-portal edges (`interdimensionalEdges`), collapsible groups (with runtime `collapsedData` payload awareness), a presentation start node, `.canvas` frontmatter + metadata-cache integration, and PNG/SVG export"

#### 2. How It Works (§2, line 40)

Current: no mention of `zIndex`, `interdimensionalEdges`, or `collapsedData`.

Proposed: Add a sentence after "A **portal** is a `file` node carrying `portal: true`":
> "Cross-portal edges are stored in the portal node's `interdimensionalEdges` array using composite `${portalId}-${nodeId}` IDs."

Add a sentence after "A **collapsible group** carries `collapsed: true`":
> "When collapsed, the group's member nodes and edges move into a runtime `collapsedData` payload with offset coordinates — they are no longer in the top-level `nodes[]`/`edges[]`."

Add a sentence after "A **styled node** carries a `styleAttributes` object":
> "Nodes carry an optional `zIndex` for explicit draw ordering."

#### 3. Source Files table (§3, line 52)

Current `data-model.md` row:
> "the extended node keys (`styleAttributes`, `collapsed`, `portal`, `dynamicHeight`, `ratio`)"

**Missing:** `zIndex`, `interdimensionalEdges`, `collapsedData`.

Proposed:
> "the extended node keys (`styleAttributes`, `collapsed`, `collapsedData`, `portal`, `interdimensionalEdges`, `zIndex`, `dynamicHeight`, `ratio`)"

[SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/advanced-canvas.md` — lines 32, 40-46, 52-56]

---

### Part E: Final Comprehensive Recommendation Synthesis

The complete, consolidated set of doc-update recommendations from all 4 iterations, organized by target doc and priority:

#### `data-model.md` (7 changes)

| # | Priority | Section | Change |
|---|----------|---------|--------|
| 1 | P0 | §3 Extended Node Keys | Add `zIndex` row: `integer`, draw order, unique values, array-sorting constraint |
| 2 | P0 | §3 Extended Node Keys | Add `collapsedData` row under `collapsed`: runtime-only, nested member data with offset coords, never write manually |
| 3 | P0 | §5 Portals | Replace VERIFY paragraph with confirmed `interdimensionalEdges[]` documentation, composite ID pattern, concrete JSON example |
| 4 | P0 | §7 What the AI Must Not Do | Replace VERIFY bullet with confirmed cross-portal authoring guidance |
| 5 | P1 | §2 Node — common fields | Update `id` row: add constraint "Do not use `-` in manually-chosen IDs (portal composite ID collision)" |
| 6 | P1 | §3 Extended Node Keys | Update `ratio` row: type is `number \| "No ratio enforcement"`, reading tolerates both, writing uses numeric or omit |
| 7 | P2 | §2 Edge — fields | Update `fromEnd`/`toEnd` row: document defaults (`fromEnd`→`none`, `toEnd`→`arrow`) |

#### `advanced-canvas.md` (3 changes)

| # | Priority | Section | Change |
|---|----------|---------|--------|
| 8 | P0 | §1 Overview — Coverage claim | Add `zIndex`, `interdimensionalEdges`, `collapsedData` to the feature list |
| 9 | P0 | §2 How It Works | Add sentences for `zIndex`, `interdimensionalEdges`, `collapsedData` |
| 10 | P0 | §3 Source Files | Update `data-model.md` row: add `zIndex`, `interdimensionalEdges`, `collapsedData` to extended keys list |
| 11 | P0 | §4 Guardrails | Remove VERIFY flag — replace with confirmed interdimensional edge serialization |

#### `workflows.md` (2 changes)

| # | Priority | Section | Change |
|---|----------|---------|--------|
| 12 | P0 | §5 Create a Portal | Replace step 4 (VERIFY "do not hand-author") with confirmed cross-portal edge recipe: use `interdimensionalEdges[]`, composite IDs, dash constraint |
| 13 | P2 | New §9 | Add "Control Node Z-Order" workflow recipe: set unique `zIndex`, sort `nodes[]` ascending, verify array order |

#### `troubleshooting.md` (4 changes)

| # | Priority | Section | Change |
|---|----------|---------|--------|
| 14 | P0 | §1 Symptom table | Replace "Cross-portal edge wrong or lost" row with confirmed diagnosis/fix |
| 15 | P0 | §4 Portal Broken | Replace "Cross-portal edge hand-authored" row with confirmed fix using `interdimensionalEdges[]` |
| 16 | P0 | §7 Recovery | Update cross-portal edge recovery row: fix instead of remove |
| 17 | P0 | §9 Limits | Remove VERIFY language — replace with confirmed statement |

#### Additional cross-cutting concerns (no new doc sections needed)

| # | Concern | Action |
|---|---------|--------|
| 18 | All docs: intro paragraphs referencing "one open item" or "VERIFY" | Remove VERIFY language; the cross-portal edge is confirmed |
| 19 | `data-model.md` §1 (Core contract) | Add `zIndex` gotcha box: array position ≠ visual order when some nodes lack `zIndex` |
| 20 | `data-model.md` §3 (styleAttributes) | Add note: `null` is a valid value, used by templates to unset attributes |

[SOURCE: iteration-003.md — Recommendations 1-8 with exact prose and insertion points]
[SOURCE: iteration-002.md — 8 identified gaps with P0/P1/P2 priorities]
[SOURCE: iteration-001.md — 7 initial findings from main.js]
[SOURCE: `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/*.md` — current doc state (this iteration)]

---

### Part F: Question Status — Final

| # | Question | Status | Evidence |
|---|----------|--------|----------|
| Q1 | Exact extended `.canvas` JSON schema | **ANSWERED** | Complete schema table in Part B above — 8 extended node keys, 5 extended edge keys, 3 metadata keys, 4 internal/runtime-only items. All confirmed against spec + .d.ts + main.js. |
| Q2 | Cross-portal edge serialization | **RESOLVED** | `interdimensionalEdges[]` on portal file node with composite `${portalId}-${nodeId}` IDs. Confirmed at all three evidence layers. 12 VERIFY flags across all 4 docs can now be lifted. |
| Q3 | Missing workflows and gotchas | **ANSWERED** | 4 structured gotchas with concrete JSON examples (iteration 3). Plus z-ordering workflow recipe recommendation. |
| Q4 | Concrete doc additions/updates | **ANSWERED** | 20 total recommendations (16 doc-level changes across all 4 files + 4 cross-cutting), each with exact target section, insertion point, and recommended prose. |
| Q5 | Doc vs actual behavior differences | **ANSWERED** | 6 confirmed gaps with evidence layers (Part C above). 3 confirmed non-gaps (dynamicHeight, style enums, presentation migration). 2 runtime-only fields correctly not documented (frontmatterPosition, frontmatterLinks). |

**No remaining open questions.** All 5 key questions are answered or resolved.

[INFERENCE: Based on iterative evidence from all 4 research passes — main.js v6.5.4, spec/1.0-1.0.md, 1.0-1.0.d.ts, reference docs, and progressive synthesis]

## Ruled Out

- No approaches ruled out this iteration. All evidence was drawn from existing sources (spec, types, main.js, reference docs).

## Dead Ends

- None. The synthesis phase used existing evidence; no new research paths attempted.

## Edge Cases

- **Ambiguous input**: None — the dispatch focus was specific and all 4 objectives were clearly defined.
- **Contradictory evidence**: None — spec, .d.ts, and main.js are fully consistent across all confirmed fields.
- **Missing dependencies**: `.canvas` vault files absent (known from iteration 2). This does not affect the convergence pass — the spec + types are authoritative and consistent with main.js.
- **Partial success**: None — all synthesis objectives completed successfully. Every VERIFY flag was located and mapped to a resolution. Both Q1 and Q5 are now fully answered.

## Sources Consulted

- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/advanced-canvas.md` — full read, VERIFY flag and coverage gap mapping (this iteration)
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/data-model.md` — full read, VERIFY flag and gap mapping (this iteration)
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/workflows.md` — full read, VERIFY flag mapping (this iteration)
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/troubleshooting.md` — full read, VERIFY flag mapping (this iteration)
- `specs/.../001-advanced-canvas/research/iterations/iteration-001.md` — main.js findings (cross-portal composite IDs, zIndex, collapsedData, ratio sentinel, template styleAttributes, style enums, presentation migration)
- `specs/.../001-advanced-canvas/research/iterations/iteration-002.md` — spec + .d.ts confirmations, 8 gap identifications
- `specs/.../001-advanced-canvas/research/iterations/iteration-003.md` — 4 gotchas, 8 doc-update recommendations, template storage model, dynamicHeight verification
- `specs/.../001-advanced-canvas/research/research.md` — progressive synthesis baseline
- [https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.md](https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.md) (re-cited, iteration 2)
- [https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.d.ts](https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.d.ts) (re-cited, iteration 2)
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Michel Kerkmeester/.obsidian/plugins/advanced-canvas/main.js` (v6.5.4, compiled) — iteration 1-3 evidence re-cited
- `specs/.../001-advanced-canvas/research/deep-research-config.json` — progressiveSynthesis, maxIterations, convergenceThreshold
- `specs/.../001-advanced-canvas/research/deep-research-state.jsonl` — iteration history
- `specs/.../001-advanced-canvas/research/deep-research-strategy.md` — exhausted approaches, next-focus
- `specs/.../001-advanced-canvas/research/findings-registry.json` — question and finding state

## Assessment

- New information ratio: **0.37** (1 of 4 major findings is fully new: the systematic 12-instance VERIFY flag audit with line-level mapping; 2 are substantially extended syntheses that close Q1 and Q5 — the definitive schema table and the complete 6-gap inventory; 1 is confirmatory: advanced-canvas.md overview update needs mapped to exact lines; +0.10 simplicity bonus for convergence synthesis that resolves all remaining questions and produces a single-source completion-ready artifact)
- Questions addressed: All 5 (Q1-Q5)
- Questions answered:
  - Q1 (Extended schema): **ANSWERED** — definitive table with 16 spec-defined + 4 runtime-only items
  - Q2 (Cross-portal edges): Already RESOLVED (iteration 2) — this pass audited and mapped all 12 VERIFY flags to resolutions
  - Q3 (Workflows/gotchas): Already ANSWERED (iteration 3)
  - Q4 (Doc additions): Already ANSWERED (iteration 3), consolidated into 20 recommendations
  - Q5 (Doc vs actual): **ANSWERED** — complete 6-gap inventory with evidence layers

## Reflection

- **What worked**: Mapping every VERIFY flag to exact line numbers across all 4 docs transformed the abstract "the VERIFY item is resolved" into an actionable, auditable change list. Each flag now has a line reference and a specific replacement recommendation. The Q1 schema table in Part B collapses 4 iterations of evidence into a single authoritative reference — this is the artifact that should drive synthesis. The Q5 gap inventory (Part C) provides the reducer with a prioritised, evidence-backed change backlog.
- **What did not work**: N/A — this was a pure synthesis pass drawing on existing evidence. No new tool calls or research actions were needed; the evidence was already complete from iterations 1-3.
- **What I would do differently**: The convergence pass could have been combined with iteration 3 if the budget allowed, but separating synthesis into its own iteration made the output cleaner — each iteration has a distinct purpose (discover → confirm → synthesize → converge).

## Recommended Next Focus

**Research loop is complete.** All 5 key questions are answered, all 12 VERIFY flags are audited and resolved, and 20 concrete recommendations are ready for reducer promotion. The next step is outside this agent's scope:

1. **Reducer sync**: The workflow reducer should refresh `deep-research-strategy.md` (mark all questions as answered, update exhausted approaches), `findings-registry.json` (mark all questions resolved, promote key findings), and `deep-research-dashboard.md` (convergence assessment).
2. **Synthesis into `research/research.md`**: Consolidate Parts B (schema), C (gaps), D (advanced-canvas.md needs), and E (recommendations) into the canonical research synthesis.
3. **Implementation**: Apply the 20 recommendations to `references/plugins/advanced-canvas/` (a separate implementation phase, not part of this research loop).

Convergence assessment: With newInfoRatio of 0.37 and all questions answered, the loop should converge. The 12-instance VERIFY flag audit is the novel contribution of this iteration — it bridges the gap between "we know the answer" (iterations 1-3) and "we know exactly what to change" (this iteration).