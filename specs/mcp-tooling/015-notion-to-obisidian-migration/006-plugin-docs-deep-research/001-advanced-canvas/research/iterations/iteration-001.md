# Iteration 1: Extended .canvas JSON Schema from main.js v6.5.4 (Cross-Portal Edges + Non-Standard Keys)

## Focus

Extract the extended .canvas JSON schema from the installed Advanced Canvas plugin `main.js` (v6.5.4), with emphasis on (a) the VERIFY-flagged cross-portal ("interdimensional") edge serialization and (b) non-standard node/edge keys missing from or needing confirmation in `references/plugins/advanced-canvas/`.

Source of truth used: the installed compiled plugin at `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Michel Kerkmeester/.obsidian/plugins/advanced-canvas/main.js` (378,820 bytes, manifest `id: advanced-canvas`, `version: 6.5.4`, `minAppVersion: 1.13.0`). The GitHub repo was not fetched this iteration (tool budget); it is deferred as next focus.

## Actions Taken

1. Read research state: config (progressiveSynthesis=true, maxIterations=4, convergenceThreshold=0.05), state JSONL (0 prior iteration records), strategy (5 open key questions, next focus = this topic), findings registry (empty).
2. Read the existing 4-file reference tree (`advanced-canvas.md` index, `data-model.md`, `workflows.md`) to establish the documented baseline; confirmed the single VERIFY item is the cross-portal edge serialized shape (`data-model.md` §5/§7, `workflows.md` §5).
3. Located the installed plugin folder in the real vault and verified version from `manifest.json`.
4. Grepped the minified `main.js` for portal-edge rewriting, extended keys, and style enumerations (three targeted passes; first `rg` attempt failed — `rg` not on PATH — retried with `grep -E`).

## Findings

1. **Cross-portal edge serialization: composite endpoint ids `${portalId}-${nodeId}`.** In `main.js`, when the plugin registers an edge into a node inside a portal, it rewrites the endpoint: `if (edge.fromNode !== node.id) edge.fromNode = `${portalId}-${edge.fromNode}`;` (same for `toNode`). These edges are collected per-portal in `globalInterdimensionalEdges[portalId]`. So an interdimensional edge is serialized with its portal-facing endpoint(s) as a composite id of the form `<portal-node-id>-<nested-node-id>` — a dash-joined string, not a nested object or a new key. [SOURCE: ~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Michel Kerkmeester/.obsidian/plugins/advanced-canvas/main.js — `for (const [portalId, edges] of Object.entries(edgesToNodeFromPortal))`, `edge.fromNode = `${portalId}-${edge.fromNode}``]
   - Caveat: this is the compiled runtime's remapping code. It resolves the VERIFY item at the code level, but byte-level confirmation still requires reading a real portal `.canvas` file that contains a cross-portal edge (see Questions Remaining).
2. **Undocumented persistent node key `zIndex`.** The build persists a per-node z-order: `this.zIndex = this.canvas.zIndexCounter + ...`, `const finalZIndex = zIndex + i`, `zIndex: value`, `this.nodeEl.style.zIndex = this.zIndex.toString()`. Nodes carry a numeric `zIndex` used for draw order (front/back arrangement). This key is absent from `data-model.md` §3. [SOURCE: main.js grep `zIndex` matches]
3. **Undocumented `collapsedData` group payload.** Collapsing a group serializes its contained nodes/edges into `groupNodeData.collapsedData` (with x/y offsets: `x: nodeData.x + collapsedGroupData.x`, `y: nodeData.y + collapsedGroupData.y`, and `data.edges.push(...collapsedData.edges)`), and on expand `delete groupNodeData.collapsedData`. The docs only mention `collapsed: true` on a group node; the actual collapsed-group serialization nests member data under `collapsedData` on the group node rather than flattening. This is load-bearing for AI ops: while a group is collapsed, its member nodes are NOT top-level `nodes[]` entries. [SOURCE: main.js grep `collapsedData` matches]
4. **`ratio` is not always a number.** The build computes `ratio: width / height` and has a sentinel `NO_RATIO = "No ratio enforcement"`, implying the `ratio` key can hold a numeric ratio or a string sentinel for "no ratio enforcement". `data-model.md` §3 documents `ratio` as `number` only — partially incomplete. [SOURCE: main.js grep `ratio` matches]
5. **Style enumerations confirmed — docs are accurate.** All documented values appear verbatim in the compiled build: arrows `triangle-outline`, `thin-triangle`, `halved-triangle`, `diamond-outline`, `circle-outline` (plus the other three documented values exist in the feature set); paths `short-dashed`, `long-dashed` (plus `dotted`); `pathfindingMethod` `a-star` (plus `direct`/`square`); shapes `predefined-process`, `parallelogram` (plus the other five). No unknown enum values found, so §3–§4 enumerations need no correction. [SOURCE: main.js grep enum values]
6. **Presentation migration confirmed.** The build still contains `delete node.isStartNode` and reads `canvas.metadata["startNode...` — confirming the documented migration path (per-node `isStartNode` removed in favor of `metadata.startNode`). `data-model.md` §6 is correct. [SOURCE: main.js grep `isStartNode`/`startNode` matches]
7. **Templates carry `styleAttributes` too.** `...template.styleAttributes` and `...template.styleAttributes` spreads show the "templates" (paste-as-template) feature stores style overrides on template objects — an additional non-standard key surface not covered by the docs. [SOURCE: main.js grep `template.styleAttributes`]

## Ruled Out

- No approaches ruled out this iteration. The one failed action (`rg` missing from PATH) was recovered with `grep -E` — a tooling quirk, not a dead end.

## Dead Ends

- None. (Fetching the GitHub repo directly was deferred by budget, not eliminated.)

## Edge Cases

- Ambiguous input: none — dispatch focus was specific and matched strategy "Next Focus".
- Contradictory evidence: none — doc enumerations and compiled code agree.
- Missing dependencies: `rg` unavailable in the shell (Tier 1 recovery: retried with `grep -E`, succeeded). GitHub repo fetch skipped by budget; finding #1's caveat records the residual uncertainty instead.
- Partial success: none — all research actions succeeded.

## Sources Consulted

- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Michel Kerkmeester/.obsidian/plugins/advanced-canvas/main.js` (v6.5.4, compiled)
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Michel Kerkmeester/.obsidian/plugins/advanced-canvas/manifest.json` (id/version/minAppVersion)
- `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/data-model.md`
- `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/workflows.md`
- `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/advanced-canvas.md` (index)

## Assessment

- New information ratio: 0.57 (3 fully new findings: cross-portal composite ids, `zIndex`, `collapsedData`; 1 partially new: `ratio` sentinel nuance; 3 confirmations of existing docs: enums, `metadata.startNode` migration, plus template `styleAttributes` counted as partial)
- Questions addressed: Q1 (extended schema incl. non-standard keys), Q2 (cross-portal edge serialization), Q5 (documented vs compiled behavior) — partial
- Questions answered: Q2 at code level (composite `${portalId}-${nodeId}` endpoint ids; byte-level file confirmation still pending). Q1 substantially expanded (three undocumented keys/payloads found).

## Reflection

- What worked and why: grepping the compiled plugin directly turned the VERIFY item from "unknown" into a concrete code-backed serialization rule, because the minified bundle retains the string literals and the remapping logic verbatim. Reading the existing docs first made the delta cheap to compute — every hit could be classified as confirm/new/conflict against a written baseline.
- What did not work and why: `rg` is not on this shell's PATH, so the first grep pass failed; the cost was one wasted call under a tight budget.
- What I would do differently: reserve the GitHub fetch for a dedicated iteration instead of trying to fit it here; and validate `collapsedData`/cross-portal shapes against a real `.canvas` file in the vault (a live sample would confirm byte-level serialization without any repo access).

## Recommended Next Focus

1. **Byte-level confirmation of cross-portal edges and `collapsedData`**: locate any real `.canvas` files in the vault that contain portals or collapsed groups and read their raw JSON — this converts the code-level findings into byte-verified facts and closes the remaining VERIFY caveat.
2. **GitHub repo pass**: fetch `developer-mike/obsidian-advanced-canvas` (README, and source for canvas data serialization/migrations) to confirm the composite-id rule and `collapsedData` against unminified source and any documented schema.
3. **Doc-update recommendation synthesis**: draft the concrete additions for `references/plugins/advanced-canvas/` — `zIndex` key, `collapsedData` group payload, `ratio` sentinel, cross-portal composite-id rule replacing the VERIFY flags, and template `styleAttributes` — for reducer review.
