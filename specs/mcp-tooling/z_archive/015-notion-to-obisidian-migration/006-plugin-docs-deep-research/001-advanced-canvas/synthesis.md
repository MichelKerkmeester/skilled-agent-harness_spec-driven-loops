---
title: "Advanced Canvas Docs — Research-to-Edit Synthesis"
trigger_phrases: []
---
# Advanced Canvas Docs — Research-to-Edit Synthesis

> Fresh-reviewer synthesis turning the 4-iteration deep-research loop into an actionable, evidence-cited edit plan for the shipped Advanced Canvas reference docs. Read-only on all shipped docs; this file is the only write.
>
> **Scope reviewed:** research `research.md` + `iterations/iteration-003.md` (exact prose) + `iterations/iteration-004.md` (VERIFY audit, schema closure); shipped `references/plugins/advanced-canvas/{advanced-canvas,data-model,workflows,troubleshooting}.md` and `feature-catalog/plugins/advanced-canvas.md`.

---

## Verdict

The shipped docs are **accurate but stale** — no invented style values, no false schema, and the native/extended split is correct, but they still carry the cross-portal-edge question as an unresolved `VERIFY` flag that the research has since resolved, and they omit three real persistent keys (`zIndex`, `interdimensionalEdges`, `collapsedData`). The single most consequential fix is lifting the 12-instance `VERIFY` flag: the docs currently tell the AI the interdimensional-edge shape is *unconfirmed* and to *never author it*, which is now a false, operation-blocking statement. One gap the research itself missed: the same stale `VERIFY` and incomplete coverage claim also live in a **fifth** shipped file, `feature-catalog/plugins/advanced-canvas.md`, which was outside the research's 4-doc scope.

---

## Evidence basis (CONFIRMED vs INFERRED)

Every row cites the originating research finding plus its ground source. Confidence is split as the task requires:

- **CONFIRMED** — research cites a concrete source: JSON-Canvas spec (`spec/1.0-1.0.md`), TypeScript typings (`1.0-1.0.d.ts`), or a `main.js` v6.5.4 line/token.
- **INFERRED** — derived from runtime code behavior but never observed in a captured `.canvas` file (the vault held no `.canvas` files during research — noted in iter-002/003/004 edge cases).

One structural caveat applies to the whole `interdimensionalEdges` set: the research confirms the **container** (`interdimensionalEdges?: CanvasEdgeData[]` on `CanvasFileNodeData`, per spec + `.d.ts`) with high confidence, but the **exact persisted endpoint-ID encoding** (`${portalId}-${nodeId}`) is inferred from a `main.js` runtime-rewrite line, not from a byte-verified file. Recommend the implementer capture one real portal `.canvas` before promising exact hand-authoring endpoint syntax in a recipe.

---

## Prioritized edit table

Ranked **P0** (factual error / current statement is false or corruption-inducing) → **P1** (missing or materially incomplete persistent key) → **P2** (polish). Deduplicated from the research's 20 file-instance recommendations into distinct `(file · section)` edits.

### P0 — factual / correctness

| # | Target file | Section / anchor | Change | Evidence (finding → source) | Conf. |
|---|-------------|------------------|--------|------------------------------|-------|
| 1 | `data-model.md` | §5 Portals (¶ at lines 165-166) | Replace the "serialized shape … not confirmed … **VERIFY**" paragraph with confirmed docs: cross-portal edges live in an `interdimensionalEdges` array **on the portal `file` node**, not top-level `edges[]`; add a concrete JSON example. | research Q2 RESOLVED; iter-003 Rec 2 → spec File-type `interdimensionalEdges`; `1.0-1.0.d.ts` `interdimensionalEdges?: CanvasEdgeData[]`; `main.js` `edge.fromNode = \`${portalId}-${edge.fromNode}\`` | CONFIRMED (container) / INFERRED (endpoint encoding) |
| 2 | `data-model.md` | §7 What the AI Must Not Do (bullet, line 205) | Replace "Never hand-author a cross-portal … edge — that serialized shape is the one `VERIFY` item" with confirmed guidance: use `interdimensionalEdges[]` with composite IDs; never use `-` in manual IDs. | iter-004 VERIFY audit #5 → same sources as #1 | CONFIRMED / INFERRED |
| 3 | `data-model.md` | §1 intro (line 20) | Delete the "single open item … **VERIFY** before hand-authoring" sentence; state cross-portal edges are confirmed (§5). | iter-004 VERIFY audit #3 | CONFIRMED |
| 4 | `advanced-canvas.md` | §1 intro (line 34) + §4 Guardrails (bullet, line 65) | Remove both `VERIFY` mentions of the interdimensional-edge shape; replace with the confirmed `interdimensionalEdges[]`-on-portal-node statement. | iter-004 VERIFY audit #1, #2 | CONFIRMED / INFERRED |
| 5 | `workflows.md` | §1 intro (line 20); §5 step 4 (line 143); §5 checkpoint (line 159) | Remove the "one open item / do **not** hand-author / no hand-authored cross-portal edge" language; point to the confirmed §5 pattern; loosen the checkpoint to "well-formed `interdimensionalEdges[]`". | iter-004 VERIFY audit #6, #7, #8 | CONFIRMED / INFERRED |
| 6 | `troubleshooting.md` | §1 symptom row (line 30); §4 Portal Broken row (line 84); §7 Recovery row (line 119); §9 Limits (line 146) | Replace all four "hand-authored / unconfirmed / `VERIFY`" cross-portal entries with confirmed diagnose-and-fix: edge belongs in `interdimensionalEdges[]` on the portal node, composite ID malformed, or nested id absent. | iter-004 VERIFY audit #9-#12; iter-003 Rec 2 | CONFIRMED / INFERRED |
| 7 | **`feature-catalog/plugins/advanced-canvas.md`** | §4 Guardrails (bullet, line 50) | **(Research-scope gap — this file was not in the 4-doc audit.)** Same VERIFY replacement: interdimensional edges are confirmed, live in `interdimensionalEdges[]` on the portal node. | fresh-eyes cross-check against shipped file; grounds on iter-004 resolution | CONFIRMED / INFERRED |
| 8 | `data-model.md` | §3 Extended Node Keys table (after `collapsed`, line 88) | Add `collapsedData` row: **runtime-only**, NOT in spec; when `collapsed: true` the plugin moves member nodes/edges out of top-level `nodes[]`/`edges[]` into this nested payload with offset coords; expanding deletes it; never author manually. Prevents an AI from "restoring" ghost members and duplicating/corrupting the group. | iter-003 Gotcha 1 + Rec 3 → `main.js` `x: nodeData.x + collapsedGroupData.x`, `data.edges.push(...collapsedData.edges)`, `delete groupNodeData.collapsedData`; spec/`.d.ts` define only `collapsed?: boolean` | CONFIRMED |
| 9 | `troubleshooting.md` | §1 symptom table (before "Canvas will not open", ~line 32) | Add row: "Group member nodes missing from `nodes[]`" → cause: group collapsed, members nested in `collapsedData`; fix: read `collapsedData`, don't recreate members. | iter-003 Rec 3 → same `main.js` sources as #8 | CONFIRMED |
| 10 | `advanced-canvas.md` | §2 How It Works (line 42, collapsible-group sentence) | Add sentence: when collapsed, member nodes/edges move into a runtime `collapsedData` payload and leave the top-level arrays. | iter-004 Part D.2 → same sources as #8 | CONFIRMED |

### P1 — missing / materially incomplete persistent key

| # | Target file | Section / anchor | Change | Evidence (finding → source) | Conf. |
|---|-------------|------------------|--------|------------------------------|-------|
| 11 | `data-model.md` | §3 Extended Node Keys table (after `dynamicHeight`, line 90) | Add `zIndex` row: integer draw order, higher = on top, should be unique; absent → plugin auto-assigns from an internal counter; spec requires `nodes[]` sorted ascending by `zIndex`. | iter-003 Gotcha 3 + Rec 1 → spec §Nodes `zIndex?` optional integer; `1.0-1.0.d.ts` `zIndex?: number`; `main.js` `this.zIndex = this.canvas.zIndexCounter` | CONFIRMED |
| 12 | `data-model.md` | §1 Core contract (after the 3rd bullet, ~line 41) | Add `zIndex`/array-order duality gotcha box: array position ≠ visual draw order when some nodes lack `zIndex`; read `zIndex` explicitly, do not assume `nodes[0]` is bottom-most; silently reordering `nodes[]` can change stacking. | iter-003 Rec 1 (2nd insertion) → same sources as #11 | CONFIRMED |
| 13 | `data-model.md` | §3 Extended Node Keys, `ratio` row (line 91) | Change type `number` → `number \| "No ratio enforcement"`; reading tolerates both, writing uses numeric-or-omit (never the string sentinel — it is an internal constant). | research iter-2 table + iter-003 Gotcha 4 + Rec 5 → `main.js` `NO_RATIO = "No ratio enforcement"`; spec/`.d.ts` `ratio?: number` | CONFIRMED |
| 14 | `data-model.md` | §2 Node common fields, `id` row (line 54) | Add constraint: do not use `-` in manually-chosen ids — the plugin builds portal composite ids as `portalId-nodeId`; dashed ids may be misread as portal-node references. Use `_`/camelCase/alphanumeric. | iter-003 Gotcha 2 + Rec 4 → spec §Nodes "Refrain from using `-` in the ID"; `main.js` composite-id build | CONFIRMED |
| 15 | `advanced-canvas.md` | §1 coverage claim (line 32); §3 Source Files `data-model.md` row (line 54) | Add `zIndex`, `interdimensionalEdges`, `collapsedData` to the coverage feature list and to the enumerated extended-key list. | iter-004 Part D.1, D.3 → sources per #8/#11/#1 | CONFIRMED |
| 16 | **`feature-catalog/plugins/advanced-canvas.md`** | §1 overview coverage claim (line 18) | **(Research-scope gap.)** Add `zIndex` (node z-ordering), cross-portal edges (`interdimensionalEdges`), and collapsed-group `collapsedData` awareness to the feature list, mirroring the `advanced-canvas.md` update. | fresh-eyes cross-check; grounds on #8/#11/#1 | CONFIRMED |
| 17 | `workflows.md` | §5 Create a Portal — add step 4 (after line 155) | Add the interdimensional-edge authoring recipe: edge goes in the portal node's `interdimensionalEdges[]` using composite `portalId-nestedNodeId` endpoints. **Hold to P1** (not P0) because the exact persisted endpoint encoding is inferred, not byte-verified — pair with a "confirm against one real portal file" note. | iter-003 Rec 2 (workflow step) → spec container + `main.js` rewrite | CONFIRMED (location) / INFERRED (endpoint syntax) |

### P2 — polish

| # | Target file | Section / anchor | Change | Evidence (finding → source) | Conf. |
|---|-------------|------------------|--------|------------------------------|-------|
| 18 | `data-model.md` | §2 Edge fields, `fromEnd`/`toEnd` row (line 75) | Add `fromEnd` default (`none`). **Note:** the shipped row already documents `toEnd` defaults to `arrow` — so this is a smaller gap than research iters 2-3 implied ("defaults not documented"); iter-004 Part C #6 correctly narrows it to `fromEnd` only. | iter-003 Rec 8 (narrowed by iter-004) → spec §Edges `fromEnd` defaults `none` | CONFIRMED |
| 19 | `workflows.md` | New §9 "Control Node Z-Order" (after §8 Export, line 233; renumber current §9→§10) | Add recipe: set unique numeric `zIndex` per node, sort `nodes[]` ascending, verify array order; checkpoint `z_order_valid`. | iter-003 Rec 7 → sources per #11 | CONFIRMED |
| 20 | `data-model.md` | §3 styleAttributes note (after value table, ~line 103/116) | Add note: `styleAttributes` value type is `{ [key: string]: string \| null }`; `null` is valid (used by templates to unset); when hand-authoring, prefer omitting a key over writing `null`. | iter-003 Rec 6 → `1.0-1.0.d.ts` `{ [key: string]: string \| null }` | CONFIRMED |

**Counts:** P0 = 10 rows · P1 = 7 rows · P2 = 3 rows (20 total distinct edits, of which rows 7 and 16 cover the research-missed `feature-catalog` file).

---

## VERIFY-flag resolution

The shipped docs carry **one distinct uncertainty** — the serialized shape of a cross-portal ("interdimensional") edge — surfaced in **12 textual instances** across 5 files (all 12 line references in iter-004's audit were re-verified against the live shipped files and are accurate). Additionally the same uncertainty appears a **13th** time in the un-audited `feature-catalog` file.

| Location | Instances | Resolution | Source | Status |
|----------|-----------|------------|--------|--------|
| `advanced-canvas.md` | lines 34, 65 | Cross-portal edges are stored in `interdimensionalEdges[]` on the portal `file` node with composite `portalId-nodeId` endpoints | spec File-type field; `1.0-1.0.d.ts` `interdimensionalEdges?: CanvasEdgeData[]`; `main.js` composite rewrite | **RESOLVED** |
| `data-model.md` | lines 20, 165, 205 | same | same | **RESOLVED** |
| `workflows.md` | lines 20, 143, 159 | same | same | **RESOLVED** |
| `troubleshooting.md` | lines 30, 84, 119, 146 | same | same | **RESOLVED** |
| `feature-catalog/plugins/advanced-canvas.md` | line 50 (**not in research scope**) | same | fresh cross-check | **RESOLVED** |

**STILL-UNRESOLVED VERIFY flags: 0.** One residual precision caveat (not a fresh unknown): the `interdimensionalEdges[]` *container* is CONFIRMED from spec + `.d.ts`; the *exact persisted endpoint-ID encoding* is INFERRED from a `main.js` runtime-rewrite line and was never byte-verified against a captured `.canvas` file. Safe to lift all VERIFY language now; capture one real portal file before shipping an exact-syntax hand-authoring recipe (row 17).

---

## Do-NOT-change (research confirms already correct)

Leave these as-is; the research explicitly verified them and adding to or "fixing" them would be churn or regression:

- **Style enumerations** — `shape` (`pill`, `diamond`, `parallelogram`, `circle`, `predefined-process`, `document`, `database`), `textAlign` (`center`, `right`), `border` (`dashed`, `dotted`, `invisible`), edge `path` (`dotted`, `short-dashed`, `long-dashed`), the 8 `arrow` values, and `pathfindingMethod` (`direct`, `square`, `a-star`) all match `main.js` v6.5.4 verbatim. **CONFIRMED** (iter-001/004 Part B).
- **`dynamicHeight`** — documented correctly; matches spec `dynamicHeight?: boolean` and `main.js` line 2457 (`node.dynamicHeight = node.autoResizeHeight`). Do not add a "gap" here. **CONFIRMED** (iter-003 Finding 10).
- **Presentation migration** — `isStartNode` (per-node) → `metadata.startNode` (canvas-level) guidance is correct. **CONFIRMED** (iter-001).
- **Template storage model** — templates live in plugin `data.json`, not `.canvas`; the docs' `styleAttributes` snippet caveat is consistent with this. Do not document templates as a file-layer key. **CONFIRMED** (iter-003 Finding 9).
- **`metadata.frontmatterPosition` / `metadata.frontmatterLinks`** — Proxy-computed runtime-only fields; **correctly absent** from the docs. Do not add them. **CONFIRMED** (iter-003 action 5, iter-004 Part B internal table).
- **Native node/edge fields, color presets (`"1"`–`"6"`), `metadata` block shape** — match JSON Canvas 1.0 spec. **CONFIRMED** (iter-002).
- **`collapsed: boolean`** row itself is correct; it only needs the `collapsedData` companion (row 8), not a rewrite.

---

## Notes for the implementer

- Rows 1-6 are one logical change (lift the VERIFY flag) applied across four files; do them as a set so the docs stay internally consistent. Rows 7 and 16 extend that same set to the `feature-catalog` file the research omitted — do not skip them, or the skill's catalog entry will contradict the reference docs.
- The `collapsedData` set (rows 8-10) is the highest corruption-risk omission after the VERIFY flag: an AI that reads a collapsed group and doesn't know about `collapsedData` can conclude members were deleted, or write them back into `nodes[]` and duplicate them.
- Exact recommended prose for every row exists verbatim in `research/iterations/iteration-003.md` (Recs 1-8) and `iteration-004.md` (Parts A/D/E); reuse it rather than re-deriving.
