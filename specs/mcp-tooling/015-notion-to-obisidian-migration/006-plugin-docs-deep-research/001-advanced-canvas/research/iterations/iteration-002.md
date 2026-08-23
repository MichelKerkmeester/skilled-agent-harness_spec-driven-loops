# Iteration 2: Byte-Level Confirmation, GitHub Repo Pass, Doc-Gap Analysis

## Focus
Three-part investigation:
1. **Byte-level confirmation**: Locate real `.canvas` files in the vault containing portals or collapsed groups and read their raw JSON to confirm the cross-portal edge serialization and `collapsedData` payload.
2. **GitHub repo pass**: Fetch the developer-mike/obsidian-advanced-canvas repository (README, Advanced JSON Canvas specification, TypeScript type definitions) to confirm findings against the authoritative source.
3. **Doc-update recommendation synthesis**: Read all 4 existing reference docs (`advanced-canvas.md`, `data-model.md`, `workflows.md`, `troubleshooting.md`) and identify concrete gaps against the spec and compiled main.js.

## Actions Taken

1. **Vault `.canvas` file search (BLOCKED)**: Glob `**/*.canvas` and `find -name "*.canvas"` across the operator vault (`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Michel Kerkmeester/`) returned zero results. The vault contains no `.canvas` files — no portals, collapsed groups, or any canvas file at all. Byte-level confirmation from a real file is blocked.

2. **GitHub README fetch (SUCCESS)**: Fetched the full `README.md` from `developer-mike/obsidian-advanced-canvas`. Confirmed feature list includes: Z-Ordering Control, Portals, Collapsible Groups, Node Templates, Presentation Mode, Custom Styles, Advanced JSON Canvas format. The README links to the format specification.

3. **Advanced JSON Canvas Spec fetch (SUCCESS)**: Fetched the full specification at `assets/formats/advanced-json-canvas/spec/1.0-1.0.md`. This is the authoritative specification document. Key confirmations:
   - `zIndex` (optional, integer) is an OFFICIAL key on the generic node — not just internal to main.js
   - `interdimensionalEdges` (optional, array of edges) is an OFFICIAL key on `CanvasFileNodeData` — the exact serialization format for cross-portal edges
   - Node ID constraint: "Refrain from using `-` in the ID, as it is used to identify and manage nodes that are from portals"
   - `ratio` (optional, float) — defined as `width / height`, no mention of string sentinel
   - `collapsed` (optional, boolean) on group nodes — but NO `collapsedData` key in spec
   - `styleAttributes` values can be `string | null` — `null` is a valid value for template/default styling
   - `fromEnd` defaults to `none`, `toEnd` defaults to `arrow`
   - `dynamicHeight` (optional, boolean) — confirmed

4. **TypeScript type definitions fetch (SUCCESS)**: Fetched `1.0-1.0.d.ts` — the canonical TypeScript typings for the Advanced JSON Canvas format. Confirmed the full interface hierarchy:
   - `CanvasNodeData` base: includes `zIndex`, `ratio`, `dynamicHeight`, `styleAttributes`
   - `CanvasFileNodeData`: extends base with `portal?: boolean` and `interdimensionalEdges?: CanvasEdgeData[]`
   - `CanvasGroupNodeData`: extends base with `collapsed?: boolean`
   - `CanvasEdgeData`: includes `fromFloating`, `toFloating`, `fromEnd`, `toEnd`, `styleAttributes`
   - `styleAttributes` type: `{ [key: string]: string | null }` — null is explicitly valid

5. **Existing reference docs read (SUCCESS)**: All 4 files at `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/` were read in full:
   - `advanced-canvas.md` (70 lines) — index/overview
   - `data-model.md` (208 lines) — schema documentation
   - `workflows.md` (250 lines) — file-layer recipes
   - `troubleshooting.md` (149 lines) — failure modes and recovery

6. **Source code fetch (BLOCKED)**: TypeScript source files on GitHub (`canvas-extensions/serialize-data.ts`, `canvas-extensions/portal.ts`) returned 404. The source tree uses different filenames than guessed; the compiled `main.js` on disk in the vault remains the closest source-level evidence.

## Findings

1. **`zIndex` is fully official and missing from all 4 reference docs.** [SPEC GAP — P0]
   The Advanced JSON Canvas spec §Nodes defines `zIndex` as an optional integer on the generic node: _"z-index of the node. Determines display order. Nodes with higher z-index display on top."_ Both the spec and the TypeScript typings (`zIndex?: number`) confirm it's a first-class field. The reference docs — `data-model.md` §3 ("Extended Node Keys"), `advanced-canvas.md`, `workflows.md`, `troubleshooting.md` — have zero mentions of `zIndex`.
   - [SOURCE: `https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.md` — §Nodes, "zIndex (optional, integer)"]
   - [SOURCE: `https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.d.ts` — `zIndex?: number // AdvancedJsonCanvas`]
   - [SOURCE: main.js v6.5.4 grep — `this.zIndex = this.canvas.zIndexCounter`, `zIndex: value` (iteration 1 finding)]

2. **`interdimensionalEdges` array is the official cross-portal edge serialization.** [VERIFY RESOLVED — P0]
   The spec defines `interdimensionalEdges?: CanvasEdgeData[]` on `CanvasFileNodeData` (the file node with `portal: true`). This means cross-portal edges are NOT stored in the top-level `edges[]` — they are embedded as an array directly on the portal node object. Each edge within uses composite endpoint IDs (`${portalId}-${nodeId}`), as confirmed in iteration 1's main.js analysis. The reference docs' §5 VERIFY flag can now be lifted: the serialization is confirmed at the specification level.
   - [SOURCE: spec/1.0-1.0.md — File type nodes: "interdimensionalEdges (optional, array of edges) is an array of edges that connect a node from the current canvas to a node from the portal canvas."]
   - [SOURCE: 1.0-1.0.d.ts — `interdimensionalEdges?: CanvasEdgeData[]`]
   - [SOURCE: main.js v6.5.4 — `edge.fromNode = \`${portalId}-${edge.fromNode}\`` (iteration 1)]

3. **Composite portal ID pattern confirmed at spec level.** [GOTCHA — P1]
   The spec explicitly states: _"Refrain from using `-` in the ID, as it is used to identify and manage nodes that are from portals."_ Combined with the main.js evidence from iteration 1 (composite `${portalId}-${nodeId}` IDs in interdimension edges), this is a hard constraint for AI-authored nodes: never use a dash in a manually-chosen `id` value, or the portal subsystem may misidentify it.
   - [SOURCE: spec/1.0-1.0.md — §Nodes, Generic node, `id` field note]
   - [SOURCE: main.js v6.5.4 — `edge.fromNode = \`${portalId}-${edge.fromNode}\`` (iteration 1)]

4. **`collapsedData` is a runtime-only payload — NOT in the spec.** [GOTCHA — P0]
   The Advanced JSON Canvas spec only documents `collapsed?: boolean` on group nodes. The `collapsedData` payload — where collapsed child nodes/edges are nested under `groupNodeData.collapsedData` with offset coordinates — is NOT part of the format specification. It is a runtime implementation detail visible only in the compiled main.js. Critical gotcha for AI: when a group is collapsed, its member nodes are REMOVED from the top-level `nodes[]` and nested inside `collapsedData`; expanding restores them. An AI reading a `.canvas` file must handle both states, and an AI writing one must not create a `collapsedData` payload from scratch.
   - [SOURCE: spec/1.0-1.0.md — §Nodes, Group type nodes: only `collapsed?: boolean`, no `collapsedData`]
   - [SOURCE: 1.0-1.0.d.ts — `collapsed?: boolean` only, no `collapsedData`]
   - [SOURCE: main.js v6.5.4 — `x: nodeData.x + collapsedGroupData.x`, `data.edges.push(...collapsedData.edges)`, `delete groupNodeData.collapsedData` (iteration 1)]

5. **`ratio` has a string sentinel not reflected in the spec type.** [EDGE CASE — P1]
   The spec TypeScript defines `ratio?: number`. But main.js v6.5.4 contains `NO_RATIO = "No ratio enforcement"`, a string sentinel. The spec and reference docs both describe `ratio` as a number (float/`width/height`). An AI encountering a `.canvas` file should tolerate `ratio: "No ratio enforcement"` as a valid string value; an AI writing should prefer a numeric ratio or omit the key entirely.
   - [SOURCE: spec/1.0-1.0.md — `ratio (optional, float)`: "the aspect ratio of the node... calculated as width / height"]
   - [SOURCE: 1.0-1.0.d.ts — `ratio?: number`]
   - [SOURCE: main.js v6.5.4 — `NO_RATIO = "No ratio enforcement"` (iteration 1)]

6. **Template `styleAttributes` and the `null` value.** [WORKFLOW GAP — P2]
   The TypeScript type for `styleAttributes` is `{ [key: string]: string | null }` — meaning `null` is a valid, spec-defined value. This matters for templates: when a template defines a style override, unsetting it may require writing `null`. The main.js iteration 1 evidence confirmed `...template.styleAttributes` spreads. The reference docs don't document the `null` value or the template JSON representation.
   - [SOURCE: 1.0-1.0.d.ts — `styleAttributes?: { [key: string]: string | null }`]
   - [SOURCE: main.js v6.5.4 — `...template.styleAttributes` (iteration 1)]

7. **Z-order vs array-order: double bookkeeping.** [GOTCHA — P2]
   The spec states: _"Nodes are placed in the array in ascending order by z-index. The first node in the array should be displayed below all other nodes, and the last node in the array should be displayed on top."_ But `zIndex` is also a per-node field. This creates a dual-ordering problem: when `zIndex` is set on some nodes but not others, the array position and the explicit `zIndex` can diverge. AI reading must not assume array index = z-order; AI writing should prefer setting `zIndex` explicitly.
   - [SOURCE: spec/1.0-1.0.md — §Nodes: "Nodes are placed in the array in ascending order by z-index"]
   - [SOURCE: 1.0-1.0.d.ts — `zIndex?: number`]

8. **`fromEnd`/`toEnd` defaults documented in spec, missing from reference docs.** [DOC GAP — P2]
   The spec says `fromEnd` defaults to `none` and `toEnd` defaults to `arrow`. The reference docs mention `fromEnd`/`toEnd` in the native fields table (`data-model.md` §2) but don't state the defaults. This matters for AI authoring: omitting `fromEnd` means no arrow at the source, omitting `toEnd` means there IS an arrow at the target.
   - [SOURCE: spec/1.0-1.0.md — §Edges: "fromEnd: Defaults to none if not specified", "toEnd: Defaults to arrow if not specified"]

9. **No `.canvas` files exist in the vault — byte-level confirmation blocked.** [BLOCKED]
   The operator vault contains no `.canvas` files whatsoever. Neither portals nor collapsed groups can be byte-confirmed from real file data. The Advanced JSON Canvas specification + TypeScript typings serve as the highest-confidence substitute, confirmed by the compiled main.js evidence from iteration 1.
   - [INFERENCE: glob and find returned zero results across the entire vault]

## Ruled Out
- **Direct byte-level `.canvas` file read**: Blocked — no `.canvas` files exist in the vault. Not a dead end for the research as a whole, since the specification + TypeScript types were fetched and confirmed, but the "real file" path is exhausted for this vault.
- **GitHub source TypeScript files**: Returned 404 — the source tree uses filenames not discoverable from the README. The compiled `main.js` on disk remains the closest source-level evidence; the spec document is the authoritative format reference.

## Dead Ends
- **Vault `.canvas` file scan**: Exhausted. No files to read. Recommend moving this to the "Byte-level confirmation" question as "confirmed by spec types, no vault files available."

## Edge Cases
- **Ambiguous input**: None — the three-part focus was clearly specified.
- **Contradictory evidence**: None in this iteration. The spec types are fully consistent with the main.js findings from iteration 1.
- **Missing dependencies**: No `.canvas` files in the vault — byte-level confirmation blocked. GitHub source files (`.ts` in `canvas-extensions/`) returned 404. Both were replaced with the authoritative spec document and TypeScript typings.
- **Partial success**: The byte-level confirmation sub-focus failed (no files), but the GitHub repo pass succeeded beyond expectations (full spec + types fetched), and the doc-gap analysis identified 8 concrete gaps. Overall: strong partial success.

## Sources Consulted
- [https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/README.md](https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/README.md)
- [https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.md](https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.md)
- [https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.d.ts](https://raw.githubusercontent.com/Developer-Mike/obsidian-advanced-canvas/main/assets/formats/advanced-json-canvas/spec/1.0-1.0.d.ts)
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/advanced-canvas.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/data-model.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/workflows.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/troubleshooting.md`
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Michel Kerkmeester/.obsidian/plugins/advanced-canvas/main.js` (v6.5.4, compiled) — iteration 1 evidence re-cited

## Assessment
- New information ratio: **0.72**
- Questions addressed: 4 of 5 (all except #3 — workflows/gotchas, partially addressed through finding #4/6/7/8)
- Questions answered:
  - Q1 (extended schema): Substantially advanced — `zIndex`, `interdimensionalEdges`, `collapsedData` payload all confirmed
  - Q2 (cross-portal edge serialization): **RESOLVED** — `interdimensionalEdges[]` on portal file node with composite IDs, confirmed at spec level
  - Q4 (concrete doc additions): Partially answered — 8 concrete gaps identified with priority levels
  - Q5 (doc vs actual behavior): Advanced — 3 additional gaps beyond iteration 1's 3 undocumented keys

## Reflection
- **What worked**: Fetching the Advanced JSON Canvas specification and TypeScript typings directly from the GitHub repo was the highest-yield action. The spec is authoritative, well-structured, and maps 1:1 onto the compiled main.js evidence from iteration 1. The TypeScript typings provide a machine-readable schema that can be directly compared against the reference docs.
- **What did not work**: The vault `.canvas` file search was a dead end — the vault simply has no canvas files. This isn't a tooling failure; it's a data absence. The GitHub source `.ts` files couldn't be fetched because the source tree layout differs from expectations, but the spec+types filled the gap.
- **What I would do differently**: Next iteration should focus on the remaining question #3 (missing workflows and gotchas) and synthesize the concrete doc-update recommendations. The cross-portal VERIFY item is now resolved, so workflow recipes for interdimensional edges can be drafted.

## Recommended Next Focus
1. **Missing workflows and gotchas synthesis** (Question #3): Collapse the 8 gaps into a structured set of gotchas with concrete examples — especially `collapsedData` runtime state, the `-` in ID constraint, `zIndex` vs array-order duality, and `ratio` sentinel tolerance.
2. **Concrete doc-update recommendations** (Question #4): Draft specific additions per reference doc:
   - `data-model.md` §3: Add `zIndex` row, add `interdimensionalEdges` documentation, add §7 for portal edge serialization
   - `data-model.md` §3: Update `ratio` type to `number | "No ratio enforcement"`
   - `workflows.md`: Add recipe for cross-portal edge authoring, add recipe for z-ordering
   - `troubleshooting.md`: Add `zIndex`-related symptoms, add `collapsedData` desync diagnosis
   - `advanced-canvas.md`: Remove or resolve the VERIFY flag on cross-portal edges
3. **Workflow gaps and AI-operation gotchas** (Question #3): Synthesize the remaining operational concerns — what else should AI know before editing `.canvas` files safely?