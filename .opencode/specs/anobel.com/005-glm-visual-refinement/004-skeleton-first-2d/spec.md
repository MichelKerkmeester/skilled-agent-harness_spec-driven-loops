---
title: "Feature Specification: skeleton-first-2d (geometry kernel)"
description: "A7 renderer-first geometry kernel: GLM-5.2 emits a semantic plan (nodes/edges/roles, or template+params) and a deterministic renderer computes all pixel positions for 2D-positioned tiles, so the model never owns geometry. A Phase-0 plan-obedience pilot + verifier re-baseline gates the build; best-of-3 varies a named axis (row-height/layout-mode/node-order) then downgrades to linear on repeated failure. Closes RC-1/RC-2/RC-3 — the ~41-pt diagram-vs-linear gap."
trigger_phrases:
  - "skeleton-first 2d"
  - "geometry kernel"
  - "bento skeleton"
  - "2d-positioned tiles"
  - "best-of-3 skeleton"
  - "downgrade to linear"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/004-skeleton-first-2d"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Revised to A7 renderer-first after the 5-model panel"
    next_safe_action: "Run the GLM plan-obedience pilot + verifier re-baseline before any build"
    blockers:
      - "Depends on 001 deterministic gate + per-tile failure-JSON measurement surface"
      - "Depends on 002 primitive routing to label which tiles are 2D-positioned"
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/scratch/faithful-import/gen-tile.mjs"
      - ".opencode/specs/anobel.com/004-bento-visuals/research/iterations/iter-r2-A5.md"
      - ".opencode/specs/anobel.com/004-bento-visuals/research/iterations/iter-r2-A7.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the renderer-first plan recover enough 2D tiles that the 005 GPT-5.5 escalation becom…"
    answered_questions:
      - "A5-vs-A7 resolved: A7 renderer-first — GLM emits a semantic plan, a deterministic renderer…"
      - "Reserved title region frozen at 104px (A7) and canvas at 560x480 as schema constants, conf…"
      - "Geometry is computed OUTSIDE the model; GLM authors only a semantic plan (iter-r2-A7, pane…"
      - "best-of-3 fires only AFTER first verifier failure AND must vary a named axis (row-height/l…"
---
# Feature Specification: skeleton-first-2d (geometry kernel)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

GLM-5.2 cannot self-resolve 2-D constraint layout: tiles needing coordinate placement plus collision avoidance under a height budget (matrix / node / routing / funnel / popover) score 35-58, while linear-flow tiles score 86-94 — a ~41-point primitive gap (`../../004-bento-visuals/research/research.md` §Root cause). This phase implements the **A7 renderer-first geometry kernel** (pipeline steps 7/8/9): GLM-5.2 emits a **semantic plan** (nodes/edges/roles, or layout template + params) and a **deterministic renderer** (code) computes the full 560×480 coordinate/safe-zone layout (regions, boxes, row caps, anchors, connector routes, AABB collision gaps). GLM never sees or authors pixel coordinates — the coordinate JSON is the renderer's OUTPUT, not the model's input. best-of-3 recompute varies a named axis (row-height ∈ {compact,default,generous} / layout-mode / node-order) on first verifier failure, and downgrades to linear/stacked/compact primitives on second failure. A **Phase-0 plan-obedience pilot + verifier re-baseline gates the build** before any module code.

**Key Decisions**: A7 renderer-first — GLM emits a semantic plan, a deterministic renderer owns all pixels; the A5 coordinate JSON becomes the renderer's output, not GLM's input (ADR-001, ADR-003). This removes the untested "GLM obeys coordinates" premise and the audit-tag circular dependency. best-of-3 is an upstream recompute over a named variation axis, not three GLM calls and not an identical-candidate no-op (ADR-002). The schema is branched by `layout_mode` (matrix/hub-spoke/routing/funnel/popover are distinct geometries).

**Critical Dependencies**: A Phase-0 plan-obedience pilot (gates the build), Phase 001 (deterministic gate + per-tile failure-JSON), and Phase 002 (primitive routing that labels 2D-positioned tiles).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft (planning only — no code) |
| **Created** | 2026-06-29 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` (Phase 4 row) |
| **Parent Packet** | anobel.com/005-glm-visual-refinement |
| **Architecture** | A7 renderer-first — GLM emits a semantic plan; a deterministic renderer computes all pixels (A5 coordinate JSON = renderer output) |
| **Implements** | A7 renderer-first kernel; A5 coordinate JSON as renderer output; pipeline steps 7, 8, 9 |
| **Predecessor** | 001-spatial-contract-and-gate, 002-primitive-routing |
| **Successor** | 005-gpt5-5-skeleton-author (escalation path) |
| **RC coverage** | RC-1 (vertical overflow), RC-2 (2D node collisions), RC-3 (title-at-bottom) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
2D-positioned bento tiles fail because GLM-5.2 owns the geometry: it places N rows/nodes at fixed pixel heights with no constraint solver, so cumulative height exceeds the 480px height budget (RC-1), nodes/pills/text collide (RC-2), and the bottom title band is overrun when the diagram claims the whole canvas (RC-3) (`../../004-bento-visuals/research/research.md` §Root cause, rows RC-1..RC-3). Concrete failures: `accountbeheer-4 matrix` scored 35 (4th row spills onto the title), `oci-4 node` scored 58 (6 `position:absolute`, "Verbonden" pill overlaps the SAP card), `goedkeuringssysteem-4` scored 55 (`title_at_bottom:false`). These are hard-fact, geometry-checkable defects — not taste. The original A5 plan tried to fix this by handing GLM an explicit pixel skeleton, but that rests on an untested premise — that GLM *obeys* coordinates — which the 5-model panel rated the program's biggest methodological gap (`../reviews/004-skeleton-first-2d-panel.md`).

### Purpose
Move 2D layout out of token prediction entirely: GLM emits only a semantic plan (nodes/edges/roles, or template+params) and a **deterministic renderer computes all geometry**, audited by a rendered verifier. This structurally removes GLM from pixel authorship (it can no longer overflow, collide, or overrun the title), so the ~41-pt diagram-vs-linear gap closes toward ~16-23 pts and weak 2D tiles move up a band — with an honest, re-baselined target of +8-12 pts (geometry-only fix plus a templated-feel tax), not the original +15 (`../reviews/004-skeleton-first-2d-panel.md`; `iter-r2-A7.md` Renderer mapping).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A **Phase-0 plan-obedience pilot + verifier re-baseline** that GATES the build (before any module code): measure GLM-5.2's semantic-plan/skeleton obedience on 2-3 sentinel tiles (`accountbeheer-4 matrix`, `oci-4 node`), and re-score the old 2D outputs through the NEW geometry verifier so lift is measured apples-to-apples. <85% plan-obedience forces a scope/sequencing change before building (`../reviews/004-skeleton-first-2d-panel.md` consensus 8).
- A **deterministic renderer** that consumes GLM's semantic plan and, for 2D-positioned treatments (matrix, hub-spoke/node, routing, funnel, popover), measures Dutch copy and computes a 560×480 coordinate layout: fixed regions (eyebrow / diagram / reserved title band), node/row boxes, row caps, connector anchors + routes, and AABB collision gaps. The coordinate JSON is the renderer's OUTPUT (`iter-r2-A7.md` Renderer mapping; the former `iter-r2-A5.md` skeleton JSON is now what the renderer emits, not what GLM receives).
- A **`layout_mode`-branched schema**: matrix / hub-spoke / routing / funnel / popover are distinct geometries (grid / polar / orthogonal-router / trapezoidal / z-stack), each with its own contract — one shared `nodes[]`/`connectors[]` schema is matrix-shaped only and is rejected (`../reviews/004-skeleton-first-2d-panel.md` divergence).
- A **preflight AABB validator** that rejects a computed layout before any render (no diagram/title intersection, no node/row collision, padding budget present, connectors terminate on declared anchors) — pipeline step 7.
- A **GLM→renderer plan contract**: GLM emits ONLY a semantic plan (nodes/edges/roles, or layout template + params) and may choose copy/emphasis/variant/palette-token; GLM MUST NOT emit x/y/w/h, transforms, absolute positions, row heights, connector endpoints, or extra rows — the renderer owns every pixel (`iter-r2-A7.md`).
- A **geometry verifier hook** after browser render that measures DOM/SVG bboxes for overflow, diagram∩title, node collisions, text padding, connector-anchor error, and title-at-bottom, extending the 001 ship-gate; it reads computed bboxes directly (no GLM-authored audit tags required) (`iter-r3-A5.md` `auditA5Geometry`).
- **best-of-3 recompute** (pipeline step 8): on first verifier failure, recompute up to 3 candidate layouts upstream that **vary a named axis** (row-height ∈ {compact,default,generous} / layout-mode / node-order) and pick the best geometry/AABB score via a continuous scorer — never a free GLM retry and never an identical-candidate no-op (`iter-r4-pipeline.md` step 8; AdaCoder).
- **Downgrade-to-linear** (pipeline step 9): on second 2D failure, downgrade to linear-flow / stacked-list / compact-matrix preserving semantic intent via "+N more", not crowded geometry, and not by loosening budgets to fake a pass (`iter-r4-pipeline.md` step 9).

### Out of Scope
- The GPT-5.5 skeleton author — that is the 005 escalation path; this phase ships the deterministic skeleton only.
- The A1 spatial contract and deterministic DOM/CSS gate (owned by 001) and the linear/2D primitive classifier (owned by 002) — consumed here, not built here.
- The MiniMax-M3 issue→fix-JSON adapter (owned by 003).
- Any implementation code in this pass (planning only).
- Changing the approved house style, Product register (V4/M2/D6), or palette.

### Files to Change
> Harness root: `.opencode/specs/anobel.com/004-bento-visuals/scratch/faithful-import/`. The generation entrypoint is `gen-tile.mjs` (current working copy at `004-bento-visuals/research/inputs/gen-tile.mjs`); the deterministic audit harness is `_audit.mjs`. New skeleton modules group under a new `skeleton/` folder. Exact wiring follows the 002 primitive-router output.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `…/faithful-import/skeleton/compute-skeleton.mjs` | Create | Deterministic renderer: consume GLM's semantic plan + compute the 560×480 coordinate layout (regions, boxes, row caps, anchors, routes, AABB gaps) per `layout_mode` template for 2D treatments |
| `…/faithful-import/skeleton/skeleton-schema.json` | Create | Two `layout_mode`-branched schemas — the GLM semantic-plan INPUT schema (nodes/edges/roles, no coordinates) and the renderer coordinate-OUTPUT schema (`canvas` 560×480, `regions`, `constraints`, `nodes`, `connectors`); one geometry contract per matrix/hub-spoke/routing/funnel/popover |
| `…/faithful-import/skeleton/verify-skeleton.mjs` | Create | Preflight AABB validator (step 7) + best-of-3 candidate scorer over the named variation axis (step 8) |
| `…/faithful-import/skeleton/downgrade.mjs` | Create | Step-9 downgrade to linear-flow / stacked-list / compact-matrix with "+N more" semantic preservation |
| `…/faithful-import/gen-tile.mjs` | Modify | Route 2D tiles: request a semantic plan from GLM, pass it to the renderer, forbid GLM coordinate text; wire best-of-3 + downgrade |
| `…/faithful-import/_audit.mjs` | Modify | Add `auditA5Geometry` hook (reads computed bboxes) + extend ship-gate with the 6 geometry fields |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Renderer computes the layout from GLM's semantic plan for every 2D-positioned tile | For each 2D tile, the deterministic renderer produces a schema-valid 560×480 coordinate layout (reserved title region, diagram region, node/row boxes, connector routes) from the GLM semantic plan, before any render |
| REQ-002 | GLM emits only a semantic plan; the renderer owns all pixels | GLM output contains no x/y/w/h/transform/row-height/connector-endpoint; all rendered DOM/SVG geometry traces to the renderer, not GLM (RC-1, RC-2, RC-3 are structurally impossible for GLM to cause) |
| REQ-003 | Preflight AABB gate blocks bad layouts (step 7) | A computed layout that fails any preflight check (diagram∩title, node collision, padding budget, anchor termination) is never rendered |
| REQ-004 | best-of-3 recompute varies a named axis on first failure (step 8) | On first post-render verifier FAIL, up to 3 candidate layouts are recomputed that genuinely differ along a named axis (row-height ∈ {compact,default,generous} / layout-mode / node-order) and the best continuous geometry score is chosen; identical-candidate recompute (a no-op) and extra GLM retries are forbidden |
| REQ-005 | Downgrade on second 2D failure (step 9) | On second FAIL, the tile downgrades to linear-flow / stacked-list / compact-matrix and preserves semantic intent via "+N more"; no crowded-geometry retry and no budget-loosening to fake a pass |
| REQ-009 | Phase-0 plan-obedience pilot gates the build | Before any module code, GLM-5.2 plan-obedience is measured on 2-3 sentinel tiles (`accountbeheer-4 matrix`, `oci-4 node`); ≥85% compliance is required to proceed, <85% forces a documented scope/sequencing change |
| REQ-010 | Schema constants are frozen BEFORE schema freeze | `canvas`=560×480 and the reserved title band=104px (A7, validated against measured production Dutch copy) are schema requirements locked before the schema is frozen — not open questions |
| REQ-011 | Schema is branched by `layout_mode` | Each of matrix / hub-spoke / routing / funnel / popover has its own geometry schema + renderer template; a single shared (matrix-shaped) `nodes[]`/`connectors[]` schema is rejected |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Geometry verifier extends the 001 ship-gate | `auditA5Geometry` reports overflow, diagram_intersects_title, node_collision_count, text_padding_violation_count, connector_anchor_error_count, title_at_bottom; ship-gate consumes all six |
| REQ-007 | Linear-flow tiles are untouched (negative control) | Tiles routed linear by 002 bypass the renderer path entirely; their score stays in the 86-94 band (drop ≤ 3 pts) |
| REQ-008 | Coordinate transport is renderer-canonical | The renderer emits inline-style/CSS-vars; the verifier reads computed geometry directly from the rendered DOM/SVG (no GLM-authored `data-a5-*` audit tags required, removing the audit-tag circular dependency); `forbid_glm_coordinate_text=true` |
| REQ-012 | Phase-0 re-baseline through the new verifier | The old 2D outputs (35-58) are re-scored through the NEW geometry verifier before any lift claim; downgraded tiles are excluded from the 2D denominator (survivorship bias) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On the 2D-positioned holdout (matrix/node/routing/funnel/popover), mean blind audit score improves by **+8-12 pts vs the RE-BASELINED 2D scores** (the new-verifier baseline from REQ-012, not the apples-to-oranges old 35-58 audit). The mean is computed only over tiles that stay 2D — downgraded tiles are excluded from the denominator (`../reviews/004-skeleton-first-2d-panel.md` honest-lift finding).
- **SC-002**: Diagram-vs-linear score gap closes by ≥ 35% — from ~41 pts toward ~16-23 pts, measured against the re-baselined numbers (`iter-r2-A7.md` Renderer mapping).
- **SC-003**: Linear-flow tiles do not regress: mean score drop ≤ 3 pts and linear SHIP drop ≤ 1 tile-equivalent/45 (`iter-r3-A5.md` linear non-regression gate).
- **SC-004**: Final downgrade rate stays under 10% of affected 2D outputs AND is not gamed — a downgrade must preserve semantic intent, never loosen budgets/row caps to fake a sparse pass; >10% signals budgets too tight for the Dutch copy (`iter-r3-A5.md` fallback guard; panel anti-gaming flag).
- **SC-005**: Zero RC-1/RC-2/RC-3 defects in accepted (shipped) 2D outputs (overflow=false, node_collision_count=0, title_at_bottom=true).
- **SC-006**: No systematic templated-feel penalty — blind MiniMax-M3 audit shows the 2D set incurs no new "mass-produced / templated" anti-slop deduction beyond the geometry gain (the +8-12 target already nets this tax); per-`layout_mode` variant pools keep five same-type tiles from looking identical (`../reviews/004-skeleton-first-2d-panel.md` templated-feel tax).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase-0 plan-obedience pilot + re-baseline | Gates the build; <85% obedience changes scope | Run before module code; re-scope/re-sequence on failure (REQ-009/REQ-012) |
| Dependency | 001 gate + per-tile failure-JSON | Blocks the verifier hook + ship-gate extension | 004 holds until 001 emits failure-JSON; verifier reuses 001's bbox surface |
| Dependency | 002 primitive routing | Without 2D labels the renderer path cannot be scoped | Consume 002's `primitive_class=2d_positioned`; default unknown tiles to the safer linear path |
| Risk | GLM emits an unfaithful semantic plan (the central premise) | High — the whole approach assumes GLM obeys the plan | Phase-0 pilot measures obedience BEFORE building (panel's biggest flagged gap); renderer-first already removes pixel authorship, so the residual risk is plan fidelity, not coordinate math |
| Risk | Production Dutch font metrics differ from verifier env | High — title may overflow the reserved band | Freeze title band 104px against measured production fonts (REQ-010); summarize or downgrade rather than shrink below 13px |
| Risk | One matrix-shaped schema fails non-matrix geometries | High — hub-spoke/routing/funnel/popover special-cased or broken | Branch the schema by `layout_mode` with a per-mode template (REQ-011) |
| Risk | Dense matrices still exceed the diagram budget | Med — high downgrade rate | Row caps (4 with legend / 5 without) + auto-linearize when nodes>5 / rows>3 / edges>6 |
| Risk | Deterministic templates reduce visual variety (templated feel) | Med — anti-slop tax on a B2B set of similar tiles | Per-`layout_mode` variant pool (≥3 variants, seeded by tile_id) + keep semantic variety in copy/emphasis/color/icon (SC-006; `iter-r2-A7.md`) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Skeleton compute + preflight adds negligible CPU; net prompt cost on affected 2D tiles stays within −100 to +400 tokens (skeleton JSON replaces dense layout prose) (`iter-r2-A5.md` §Cost).
- **NFR-P02**: Browser geometry verification adds ≤ ~1.0s per tile; best-of-3 recompute is upstream geometry (no extra GLM call) (`iter-r3-A5.md` wall-clock row).

### Reliability
- **NFR-R01**: Preflight rejects every schema-invalid or AABB-failing skeleton before a GLM call (no bad geometry reaches the model).
- **NFR-R02**: The downgrade path is total — any tile that fails 2D twice always resolves to a valid linear/stacked/compact primitive (no crash, no crowded retry).

---

## 8. EDGE CASES

### Data Boundaries
- Empty/short copy: skeleton still reserves the title band; diagram region may shrink but never overlaps the title.
- Maximum rows: matrix capped at 4 (with legend) / 5 (without); excess routes to "+N more" or downgrade.
- Over-budget diagram: nodes>5 / rows>3 / edges>6 auto-linearizes before code (`iter-r2-A7.md`).

### Error Scenarios
- GLM emits an invalid or over-dense semantic plan: reject and recompute the renderer layout (plan-only retry), never accept model coordinates.
- GLM injects coordinate text into the plan despite the contract: rejected at plan validation (`forbid_glm_coordinate_text`); the renderer ignores it and owns all geometry.
- Connector endpoint > 4px from declared anchor (in the renderer output): `connector_anchor_error_count > 0` → FAIL.

### State Transitions
- First verifier FAIL → best-of-3 recompute (step 8).
- Second verifier FAIL → downgrade (step 9).
- Downgrade success → ship downgraded primitive with semantic-intent preserved.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | 1 new module group (4 files) incl. 5 per-`layout_mode` renderer templates + a Phase-0 pilot harness, 2 modified harness surfaces, ~700-1000 LOC |
| Risk | 18/25 | No auth/API; rendering-correctness critical; modifies the core generation flow; central premise must be falsified in Phase-0 |
| Research | 16/20 | Grounded in A7 renderer-first research + the 5-model panel + external lit (LaTCoder, LaySPA, GeoSVG-RL, AdaCoder) |
| Multi-Agent | 6/15 | Single workstream; GPT-5.5 escalation handoff to 005 |
| Coordination | 10/15 | Hard dependency on Phase-0 pilot + 001 + 002; hands off to 005 |
| **Total** | **70/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Title overflow under real Dutch copy | H | M | Freeze title band 104px on measured prod fonts (REQ-010); summarize/downgrade over shrink |
| R-002 | High downgrade rate (>10%) hides a tuning problem, or is gamed by loosening budgets | M | M | Row caps + auto-linearize; downgrades must preserve intent; treat >10% as a budget-tuning signal (SC-004) |
| R-003 | GLM emits an unfaithful semantic plan (central premise untested) | H | M | Phase-0 pilot measures plan-obedience BEFORE the build; <85% re-scopes. Renderer-first removes GLM from pixel authorship, so it can no longer *invent coordinates* — only mis-plan. (Re-rated from the original "Low / zero-evidence" rating flagged by the panel.) |
| R-004 | Linear winners regress from harness changes | H | L | 002 routes linear tiles around the renderer path entirely (REQ-007) |
| R-005 | "GLM obeys coordinates" (original A5 input) was an untested premise | — | — | Eliminated by the A7 renderer-first flip — GLM never receives pixel coordinates (ADR-003) |

---

## 11. USER STORIES

### US-001: Reliable 2D diagrams (Priority: P0)

**As a** bento generation operator, **I want** 2D-positioned tiles to render from a renderer-computed layout (the model only supplies a semantic plan), **so that** matrix/node/funnel tiles stop overflowing, colliding, and overrunning the title.

**Acceptance Criteria**:
1. Given a `matrix` tile, When generation runs, Then geometry comes from the skeleton and the verifier reports overflow=false, node_collision_count=0, title_at_bottom=true.

### US-002: Graceful failure (Priority: P1)

**As a** bento generation operator, **I want** a tile that cannot fit 2D to downgrade to a clean linear/stacked layout, **so that** I never ship crowded geometry.

**Acceptance Criteria**:
1. Given two consecutive verifier FAILs, When step 9 runs, Then the tile renders as linear-flow / stacked-list / compact-matrix with "+N more" and passes the ship-gate.

---

## 12. OPEN QUESTIONS

- Does the renderer-first plan recover enough 2D tiles that the 005 GPT-5.5 escalation becomes optional rather than required? (Answered by the holdout run.)

**Resolved (moved into requirements/criteria):**
- ~~Reserved title region 104px vs 112px~~ → frozen at 104px (A7) on measured production Dutch copy, with canvas 560×480, as schema constants (REQ-010).
- ~~A5 coordinate JSON vs A7 semantic plan~~ → A7 renderer-first adopted; GLM emits a semantic plan, the renderer owns pixels (ADR-003, REQ-001/REQ-002).
- ~~Does a first-pass downgrade count as a 2D SHIP or a soft-fail?~~ → soft-fail: downgraded tiles are excluded from the 2D denominator and counted against the fallback-rate guard (REQ-012, SC-004).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: `../spec.md` (Phase 4 — skeleton-first-2d)
- **5-model panel**: `../reviews/004-skeleton-first-2d-panel.md` (A7 renderer-first consensus; pilot, frozen constants, best-of-3 variation, honest lift), `../reviews/SUMMARY.md`
- **Research source**: `../../004-bento-visuals/research/iterations/iter-r2-A7.md` (Renderer mapping — primary), `iter-r2-A5.md` (now the renderer's coordinate output), `iter-r3-A5.md`, `iter-r4-pipeline.md` (steps 7/8/9), `research.md` §Root cause (RC-1/RC-2/RC-3)
