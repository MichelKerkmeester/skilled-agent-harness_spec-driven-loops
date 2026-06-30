---
title: "Feature Specification: primitive-routing"
description: "The bento pipeline treats every tile as the same layout task, so 2D-positioned diagrams (matrix/node/funnel) and linear-flow tiles (table/timeline/list) all flow down one generation path. The two primitives have a ~41-point score gap, so they need different sub-pipelines decided BEFORE generation."
trigger_phrases:
  - "002-primitive-routing"
  - "primitive routing"
  - "layout primitive classifier"
  - "linear-flow vs 2d-positioned"
  - "treatment primitive map"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/002-primitive-routing"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Folded 5-model panel refinements into spec (map-prior, route-by-defect, safe default)"
    next_safe_action: "Transcribe concepts.md §2 into primitive-map.mjs, add primitiveFor with safe default"
    blockers:
      - "Depends on phase 001 (spatial-contract-and-gate) shipping the gate + per-tile failure-JSON measurement surface"
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs"
      - ".opencode/specs/anobel.com/004-bento-visuals/concepts.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should per-tile routing metadata live inline in gen-tile.mjs output or in a sidecar JSONL aligned with iter-r3-A3.md metrics? The render override now also needs defectClass + triage carried, leaning toward the sidecar the gate can write back to"
    answered_questions:
      - "The route key is the layout PRIMITIVE, not the a/b/c/d/e treatment index: a '(d)' donut (aangepast-assortiment-4) scored 88 SHIP and is linear-flow, while '(d)' tiles in other concepts are 2D diagrams"
      - "Ambiguous treatment wording: the map encodes the curated per-tile primitive as a PRIOR (REQ-007); a post-render reclassification step re-routes any tile the phase-001 gate reports overflowing/colliding, so the map need not be perfect and no hand-edited override layer is required"
---
# Feature Specification: primitive-routing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-29 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` (Phase 2 of glm-visual-refinement) |
| **Implements** | Research angle A3 (primitive-routed repair) = pipeline step 3 |
| **Depends On** | Phase 001 (spatial-contract-and-gate) — gate + failure-JSON surface |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 45-tile GLM-5.2 run (`../../004-bento-visuals`) sends every tile down a single generation path, but the score data shows two distinct layout primitives with a ~41-point gap: linear-flow tiles (table/timeline/list/donut/hero) score 86-94, while 2D-positioned tiles (matrix/node/routing/funnel/popover/connector-map/dense-chart) collapse to 35-58. GLM cannot self-resolve 2D coordinate placement from prose, so those tiles need a different sub-pipeline — but the pipeline currently has no step that decides which primitive a tile is before it is generated.

### Purpose
Add a deterministic classifier that labels each tile by layout primitive before generation and routes it: linear-flow tiles continue down the normal flow path, and 2D-positioned tiles are flagged for the skeleton-first sub-pipeline (phase 004) and bound to the primitive-routed repair contract. The static map is a PRIOR, not a prison: after the phase-001 gate renders a tile, a reclassification step re-routes any tile the gate reports overflowing or colliding — regardless of its static label — so the live render, not the lookup table, is the final arbiter. Routing also keys on defect, not primitive alone: an overflowing linear-flow tile earns a mandatory repair pass instead of being skipped.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

This phase ships the routing decision ONLY. It does not build the skeleton service, the GPT-5.5 author, the deterministic gate, or the MiniMax fix-adapter — it produces the per-tile primitive label and route those phases consume.

### In Scope
- A deterministic `treatment -> primitive` map for all 45 tiles (9 concepts x 5 treatments), transcribed from `concepts.md` §2's per-concept treatment plan, keyed on the concept slug + treatment index.
- A classifier in/around `gen-tile.mjs` that resolves each tile's primitive (`linear-flow` | `2d-positioned`) from the map before the generation call.
- Two route definitions: `linear-flow` -> the current Product V4/M2/D6 normal-flow generation path; `2d-positioned` -> flagged for skeleton-first (phase 004) plus the primitive-routed repair contract.
- The primitive-routed repair contract: a per-route repair policy attached at routing time (linear-flow = Round-2 only on a gate FIX; 2d-positioned = mandatory one Round-2 after first render).
- Per-tile routing metadata emitted into the pipeline so downstream phases (003/004/005) read the primitive + route rather than re-deriving them.
- A post-render reclassification step (map-as-prior, render-as-arbiter): after the phase-001 gate measures a tile, any tile flagged `overflow` or `collision` is re-routed to `2d-positioned` + mandatory repair regardless of its static label.
- Route-by-defect for linear-flow tiles: a `linear-flow` tile the gate flags `overflow` (e.g. `goedkeuringssysteem-1`, `goedkeuringssysteem-3`, `favorieten-3`, `een-factuur-1`) escalates to a mandatory Round-2 repair instead of `failure-only`.
- A safe default for unmapped/unknown tiles: the classifier returns `linear-flow` plus a loud `triage=true` flag and never throws, so an unmapped tile can never crash the batch.

### Out of Scope
- The coordinate/safe-zone skeleton compute service — phase 004 (skeleton-first-2d).
- The GPT-5.5 skeleton/geometry author — phase 005.
- The deterministic DOM/CSS gate + failure-JSON surface — phase 001 (consumed here as a dependency, not built here).
- The MiniMax-M3 issue->fix-JSON adapter and the actual round-2 execution — phase 003.
- Any change to the approved house style, Product register (V4/M2/D6), or palette.
- Re-running or re-scoring the 45 tiles — phase 006.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/primitive-map.mjs` | Create | The 45-entry `(concept, treatment-n) -> primitive` map transcribed from `concepts.md` §2, each entry annotated with the source form |
| `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs` | Modify | Add `slugFromOut()`, `primitiveFor()` (with safe default + triage flag), the pre-generation route branch, `reclassifyFromRender()` for the post-gate override, and per-tile routing metadata (`primitive`, `route`, `repair`, `skeletonFirst`, `defectClass`, `triage`) emission |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every tile is classified by layout primitive before generation | For each of the 45 tiles, `primitiveFor(tile)` returns exactly one of `linear-flow` or `2d-positioned`; no tile reaches the generation call unlabeled. An unmapped tile resolves via the safe default (REQ-009), never by blocking the batch |
| REQ-002 | Router output matches the manual primitive labels on all 45 tiles | The classifier labels exactly these 10 tiles `2d-positioned` — `goedkeuringssysteem-4`, `oci-2`, `oci-4`, `accountbeheer-4`, `aangepast-assortiment-3`, `aangepast-assortiment-5`, `favorieten-4`, `een-factuur-4`, `prijzen-condities-3`, `kwartaalcijfers-4` — and the other 35 `linear-flow`, matching the frozen strata in `../../004-bento-visuals/research/iterations/iter-r3-A3.md` |
| REQ-003 | The route key is the primitive, never the a/b/c/d/e index | `aangepast-assortiment-4` (treatment `(d)`, donut/ring) resolves to `linear-flow` while `aangepast-assortiment-3` `(c)` and `-5` `(e)` resolve to `2d-positioned`; within one concept three different letters yield route-by-form, not route-by-letter |
| REQ-004 | Each route carries its repair policy and downstream flag | At initial (static) routing a `linear-flow` tile is tagged `repair=failure-only` and stays on the normal path; a `2d-positioned` tile is tagged `repair=mandatory-round-2` and `skeletonFirst=true` (consumed by phase 004). The render override (REQ-007/REQ-008) can later escalate a linear tile's repair to `mandatory-round-2` |
| REQ-007 | The static map is a PRIOR the live render can override | After the phase-001 gate measures a rendered tile, `reclassifyFromRender(tile, gateResult)` re-routes any tile the gate reports `overflow` or `collision` to `2d-positioned` + `repair=mandatory-round-2`, regardless of its static label; the render, not the lookup table, is the final arbiter (resolves the ambiguous-wording open question) |
| REQ-008 | Routing keys on defect, not primitive alone | A `linear-flow` tile the gate flags `overflow` (named cases: `goedkeuringssysteem-1`, `goedkeuringssysteem-3`, `favorieten-3`, `een-factuur-1`) gets a mandatory Round-2 repair, not `failure-only`; no overflowing tile is skipped because its primitive was linear |
| REQ-009 | Unmapped/unknown tiles fail safe, never crash | `primitiveFor()` returns `linear-flow` plus a `triage=true` flag for any tile absent from `PRIMITIVE_MAP`; it never throws, so a missing entry cannot crash the generation batch |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Routing metadata is emitted per tile for downstream phases | Each tile run records `{ tileId, primitive, route, repair, skeletonFirst }` so phases 003/004/005 read it rather than re-classifying |
| REQ-006 | The map is auditable against `concepts.md` §2 | Each `primitive-map.mjs` entry names the `concepts.md` §2 form it was derived from (e.g. `aangepast-assortiment-3 = "ship x category matrix"`), so a reviewer can verify the label against the source |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** (structural, necessary not sufficient): Running the classifier over the 45 tiles produces a 10/35 split that matches the manual primitive labels exactly (0 mismatches against the `iter-r3-A3.md` frozen strata). This checks fidelity to the manual strata, not score movement.
- **SC-002**: The `(d)` proof holds — `aangepast-assortiment-4` is labeled `linear-flow` and is the only `(d)` tile in its concept routed away from 2D, demonstrating the classifier keys on primitive form rather than treatment index.
- **SC-003** (primary — routing must close the score gap): A score-moving pilot routes 5 `2d-positioned` tiles down the routed path (skeleton-first flag + mandatory Round-2) versus their baseline render; ≥3 of 5 must improve by ≥10 points. If the routed path does not move the score, the routing premise is wrong regardless of how well the labels match the strata. Success is "routing closes the gap," not "labels match."
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 gate + failure-JSON surface | The `failure-only` linear repair policy has nothing to trigger on until the gate emits FIX verdicts | Treat 001 as a hard predecessor; the classifier can land first but the repair policy is inert until 001's gate is live |
| Risk | Borderline `concepts.md` §2 wording (e.g. `aangepast-assortiment-2` "funnel/scope", `favorieten-2` "folder tree") | A naive keyword match would over-classify these as 2D and break the 10/35 split | The map encodes the curated per-tile primitive matching the manual labels, not a raw keyword guess; borderline entries are annotated as curation decisions |
| Risk | Map drifts from `concepts.md` §2 if treatments are re-briefed | Router labels could silently diverge from the rendered tiles | Keep the map a single transcribed source-of-truth file with per-entry source annotations; re-verify against the frozen strata if concepts change |
| Risk | The donut `aangepast-assortiment-4` is radial/2D mechanically (arc/center/angles) but scored `linear-flow` because this instance rendered at 88 | A future low-scoring donut would silently route down the linear path and never get the 2D skeleton it needs — a class-vs-instance label error | The render override (REQ-007) catches it: a donut that overflows or collides at the gate is re-routed to `2d-positioned` regardless of its static linear label; annotate the map entry as a render-dependent (instance-scored) label, not a class guarantee |
| Risk | The static map is treated as ground truth on its own | RC-1 overflow on linear winners and any post-hoc/score-driven labels would silently misroute | Map-as-prior, render-as-arbiter: REQ-007/REQ-008 make the phase-001 gate the final arbiter; the map only seeds the first routing pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the per-tile routing metadata live inline in `gen-tile.mjs` output or in a sidecar JSONL the downstream phases already read (aligning with the `iter-r3-A3.md` metrics format)? The render override now requires the metadata to carry `defectClass` + `triage`, which leans toward the sidecar the gate can write back to.

_Resolved during the 5-model panel fold-in: the ambiguous-wording routing question is now REQ-007/REQ-008 (map-as-prior, render-as-arbiter) — the map hard-codes the manual primitive as a prior and the post-render reclassification step re-routes from the live gate render, so no separate hand-edited override layer is needed._
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
