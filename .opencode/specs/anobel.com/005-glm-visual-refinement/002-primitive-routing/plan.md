---
title: "Implementation Plan: primitive-routing"
description: "Add a deterministic treatment->primitive map (transcribed from concepts.md §2) plus a classifier in gen-tile.mjs that labels each tile linear-flow or 2d-positioned before generation and routes it down the matching sub-pipeline."
trigger_phrases:
  - "primitive routing plan"
  - "treatment primitive map"
  - "gen-tile classifier"
  - "linear-flow 2d-positioned route"
  - "primitive-routed repair contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/002-primitive-routing"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Folded 5-model panel refinements into plan (map-prior, route-by-defect, pilot)"
    next_safe_action: "Transcribe concepts.md §2 into primitive-map.mjs, add primitiveFor with safe default"
    blockers:
      - "Depends on phase 001 gate for the linear failure-only repair trigger"
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs"
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/primitive-map.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Routing metadata location: inline in gen-tile.mjs output vs sidecar JSONL (must now carry defectClass + triage for the render override)"
    answered_questions:
      - "Map is a prior, render is the arbiter: a post-render reclassification step (reclassifyFromRender) re-routes gate-flagged overflow/collision tiles regardless of static label"
---
# Implementation Plan: primitive-routing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`) |
| **Framework** | None — standalone tile-generation harness (`gen-tile.mjs`) calling the Z.AI GLM-5.2 API |
| **Storage** | Filesystem: `spec-*.json` inputs, HTML outputs, JSONL run metadata |
| **Testing** | Node assertion over the 45-tile map vs the frozen manual labels; manual run of `gen-tile.mjs` |

### Overview
Introduce a deterministic primitive classifier upstream of the GLM generation call. A new `primitive-map.mjs` transcribes `concepts.md` §2 into a `(concept, treatment-n) -> primitive` lookup that serves as a PRIOR, not the final word; `gen-tile.mjs` derives each tile's slug, resolves its primitive via `primitiveFor()` (safe-defaulting unmapped tiles to `linear-flow` + a `triage` flag rather than throwing), and branches: `linear-flow` keeps the existing normal-flow path, `2d-positioned` is flagged for skeleton-first (phase 004) and bound to the primitive-routed repair contract. After the phase-001 gate renders a tile, `reclassifyFromRender()` re-routes any tile the gate reports overflowing or colliding to `2d-positioned` + mandatory repair regardless of its static label — the render is the arbiter — and an overflowing linear tile is repaired by defect, not skipped. A score-moving pilot validates that routing actually closes the score gap before the full build. The label, route, repair policy, defect class, and triage flag are emitted per tile for downstream phases.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] Classifier labels all 45 tiles with a 10/35 split matching the manual labels
- [ ] `(d)` proof passes (`aangepast-assortiment-4` = `linear-flow`)
- [ ] Unmapped tiles safe-default to `linear-flow` + `triage` flag (no throw, no crash)
- [ ] Post-render reclassification re-routes gate-flagged overflow/collision tiles regardless of static label
- [ ] Overflowing linear tiles get a mandatory Round-2 (route-by-defect), not `failure-only`
- [ ] Score-moving pilot run: ≥3/5 routed `2d-positioned` tiles improve ≥10 points (SC-003)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic lookup + branch, inserted as a pre-generation step in the existing single-file harness. No new service.

### Key Components
- **`primitive-map.mjs` (new)**: exports `PRIMITIVE_MAP`, a `concept -> { 1..5: 'linear-flow' | '2d-positioned' }` table transcribed from `concepts.md` §2, each cell annotated with the source form. This is where the curated per-tile primitive lives.
- **`slugFromOut(out)` (in `gen-tile.mjs`)**: derives `<concept>-<n>` from a treatment's `out` path (`dist/<concept>-glm-<n>.html`), giving the `tileId` and the `(concept, n)` lookup key.
- **`primitiveFor(t)` (in `gen-tile.mjs`)**: returns the primitive for treatment `t` by looking up `PRIMITIVE_MAP[concept][n]`. For an unmapped tile it safe-defaults to `linear-flow` and sets `triage=true` rather than throwing, so a missing entry never crashes the batch (REQ-009). The map is a PRIOR, not the final word.
- **Route branch (in `gen(t)` / the per-treatment loop)**: `linear-flow` -> existing `body`/`contract()` path, `repair=failure-only`; `2d-positioned` -> same generation call but tagged `skeletonFirst=true` + `repair=mandatory-round-2`, the metadata that phase 004 consumes.
- **`reclassifyFromRender(tile, gateResult)` (new, in `gen-tile.mjs`)**: runs after the phase-001 gate measures a rendered tile. Any tile the gate reports `overflow` or `collision` is re-routed to `2d-positioned` + `repair=mandatory-round-2` regardless of its static label, and an overflowing `linear-flow` tile is escalated from `failure-only` to a mandatory Round-2 (route-by-defect). Render = arbiter (REQ-007/REQ-008).

### Data Flow
1. `gen-tile.mjs` loads a `spec-*.json` and iterates `spec.treatments`.
2. For each treatment `t`: `slugFromOut(t.out)` -> `tileId` + `(concept, n)`.
3. `primitiveFor(t)` -> `linear-flow` | `2d-positioned` from `PRIMITIVE_MAP`, or the safe default (`linear-flow` + `triage=true`) when unmapped.
4. Route branch sets `{ route, repair, skeletonFirst }` from this static prior.
5. Generation proceeds on the resolved route.
6. After the phase-001 gate measures the rendered tile, `reclassifyFromRender(tile, gateResult)` re-routes any `overflow`/`collision` tile to `2d-positioned` + `mandatory-round-2` and escalates overflowing linear tiles' repair (route-by-defect).
7. `{ tileId, primitive, route, repair, skeletonFirst, defectClass, triage }` is emitted to the run metadata for phases 003/004/005.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Map (treatment -> primitive)
- [ ] Transcribe `concepts.md` §2 into `primitive-map.mjs` for all 9 concepts x 5 treatments
- [ ] Annotate each cell with its source form (e.g. `kwartaalcijfers-4 = "quarter category breakdown / dense chart"`)
- [ ] Cross-check the 10 `2d-positioned` entries against the `iter-r3-A3.md` frozen stratum

### Phase 2: Classifier + routes
- [ ] Add `slugFromOut(out)` to `gen-tile.mjs`
- [ ] Add `primitiveFor(t)` resolving via `PRIMITIVE_MAP`, safe-defaulting unmapped tiles to `linear-flow` + `triage=true` (never throw)
- [ ] Add the route branch (linear -> normal path + `failure-only`; 2d -> `skeletonFirst=true` + `mandatory-round-2`)
- [ ] Add `reclassifyFromRender(tile, gateResult)` — re-route gate-flagged `overflow`/`collision` tiles to `2d-positioned` + `mandatory-round-2` regardless of static label (map-as-prior); escalate overflowing linear tiles by defect
- [ ] Emit per-tile routing metadata `{ tileId, primitive, route, repair, skeletonFirst, defectClass, triage }`

### Phase 3: Verification
- [ ] Assert the 45-tile classifier output is a 10/35 split equal to the manual labels (0 mismatches)
- [ ] Assert `aangepast-assortiment-4` = `linear-flow` and `-3`/`-5` = `2d-positioned`
- [ ] Assert an unmapped key returns `linear-flow` + `triage=true` and does not throw
- [ ] Assert `reclassifyFromRender()` re-routes a synthetic overflowing `linear-flow` tile to `2d-positioned` + `mandatory-round-2`
- [ ] Confirm no generation call runs before a primitive is resolved

### Phase 4: Score-moving pilot (SC-003)
- [ ] Route 5 `2d-positioned` tiles down the routed path (skeleton flag + mandatory Round-2) vs their baseline render
- [ ] Require ≥3/5 tiles to improve ≥10 points; if not, stop and revisit the routing premise before phases 003/004/005 build on it
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `primitiveFor()` over all 45 `(concept, n)` keys vs the frozen manual labels | Node `assert` |
| Unit | `(d)` route-by-form proof (aangepast-assortiment 3/4/5) | Node `assert` |
| Unit | Safe default — an unmapped `(concept, n)` returns `linear-flow` + `triage=true` and never throws | Node `assert` |
| Integration | `reclassifyFromRender()` re-routes a synthetic overflowing `linear-flow` tile to `2d-positioned` + `mandatory-round-2` | Node `assert` |
| Pilot | 5 `2d-positioned` tiles routed vs baseline; score delta ≥10pts on ≥3/5 (SC-003) | `gen-tile.mjs` + scorer |
| Manual | Dry run of `gen-tile.mjs` printing the resolved `{ primitive, route }` per tile without calling the API | Node CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 gate + failure-JSON | Internal | Yellow | Without the gate the post-render reclassification (REQ-007) and route-by-defect (REQ-008) cannot fire; the static-prior classifier, routes, and safe default still land, but the render override and the `failure-only`->mandatory escalation stay inert until 001 ships |
| `concepts.md` §2 treatment plan | Internal | Green | The map cannot be transcribed; routing is undefined |
| `gen-tile.mjs` harness | Internal | Green | No insertion point for the classifier |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The classifier mislabels tiles (split != 10/35), the route branch breaks the existing linear generation path, or `reclassifyFromRender()` over-routes (flips too many linear tiles to 2D / inflates mandatory Round-2 cost).
- **Procedure**:
  1. Disable the `reclassifyFromRender()` hook first so routing falls back to the static-prior labels only (cheapest revert, keeps the classifier).
  2. If still broken, revert the `gen(t)` route branch so all tiles flow down the original single path (delete the `primitiveFor()` call and metadata emission).
  3. Leave `primitive-map.mjs` in place (pure data, no runtime effect when unused) or remove it.
  4. Re-run `gen-tile.mjs` on one concept to confirm the original behavior is restored.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
