---
title: "Decision Record: skeleton-first-2d (geometry kernel)"
description: "Architectural decisions for the geometry kernel: where 2D geometry is computed, how best-of-3 escalation works, and how the skeleton contract is represented."
trigger_phrases:
  - "skeleton-first 2d decision"
  - "geometry kernel adr"
  - "skeleton representation"
  - "best-of-3 decision"
  - "decision record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/004-skeleton-first-2d"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Revised to A7 renderer-first after the 5-model panel"
    next_safe_action: "Run the GLM plan-obedience pilot + verifier re-baseline before any build"
    blockers: []
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/research/iterations/iter-r2-A7.md"
      - ".opencode/specs/anobel.com/004-bento-visuals/research/iterations/iter-r2-A5.md"
      - ".opencode/specs/anobel.com/005-glm-visual-refinement/reviews/004-skeleton-first-2d-panel.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: skeleton-first-2d (geometry kernel)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Compute 2D geometry upstream and demote GLM to a renderer

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (planning) |
| **Date** | 2026-06-29 |
| **Deciders** | anobel.com bento program |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to decide who owns 2D placement for matrix, node, routing, funnel, and popover tiles, because GLM-5.2 places rows and nodes at fixed pixel heights with no constraint solver. That produces vertical overflow (RC-1), node and text collisions (RC-2), and title-band overruns (RC-3), and it drives the ~41-point gap between 2D tiles (35-58) and linear tiles (86-94) recorded in `../../004-bento-visuals/research/research.md` (Root cause table, rows RC-1..RC-3).

### Constraints

- The fix must target geometry, not taste, since every RC-1/RC-2/RC-3 failure is a hard-fact, bbox-checkable defect.
- The approved house style, Product register V4/M2/D6, and palette are frozen.
- The model contract must stay short, because instruction-following degrades under instruction density (IFScale, `iter-r2-A5.md` Why it works).

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: compute a canonical 560×480 coordinate layout (regions, boxes, row caps, anchors, connector routes, AABB gaps) outside the model in a deterministic renderer, driven by a GLM-authored semantic plan. The model never owns pixels.

**How it works**: GLM emits only a semantic plan (nodes/edges/roles, or a layout template + params) and may choose copy, emphasis, component variant, and palette tokens. A deterministic renderer then measures the Dutch copy, reserves the title band, allocates the diagram region, places boxes within caps, and computes connector anchors and routes — owning every x, y, w, h, transform, row height, and connector endpoint. The coordinate JSON is the renderer's OUTPUT, not GLM's input; GLM may not emit coordinates or extra rows (`iter-r2-A7.md` Renderer mapping). See ADR-003 for the A5-vs-A7 resolution that fixes this contract direction.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Renderer computes geometry from GLM's semantic plan (chosen)** | Removes the dominant defect class; GLM never authors pixels; geometry becomes deterministic and auditable | Needs a renderer plus schema to build and maintain | 9/10 |
| More layout prose in the prompt | Cheapest to try | Fails under instruction density; this is the status quo that already lost 18 tiles | 2/10 |
| Fine-tune or RL a layout model | Could internalize layout | Heavy cost, out of scope for this phase, no training pipeline | 2/10 |

**Why this one**: the evidence (LaTCoder bounded regions, LaySPA explicit layout objects, GeoSVG-RL browser-backed geometry) consistently points to computed geometry plus deterministic audit as the correct fix for layout-primitive failures (`iter-r2-A5.md`, `iter-r2-A7.md`).
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Weak 2D tiles are projected to move from 35-58 into 65-82, closing the diagram gap from ~41 toward ~16-23 points (`iter-r2-A5.md` Predicted effect).
- RC-1/RC-2/RC-3 become preflight-blockable instead of post-hoc discoveries.

**What it costs**:
- A new deterministic renderer plus a schema. Mitigation: scope it to the five 2D treatments and reuse the 001 bbox audit surface.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Production Dutch font metrics differ from the verifier env | H | Freeze the title band (104px) against measured production fonts (REQ-010); summarize or downgrade rather than shrink below 13px |
| GLM emits an unfaithful semantic plan | M | Phase-0 plan-obedience pilot measures this before building; renderer-first means GLM cannot inject coordinates at all (`forbid_glm_coordinate_text=true`), so the residual risk is plan fidelity, not coordinate math |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | RC-1/RC-2/RC-3 are the measured dominant defect; 18 tiles failed on geometry |
| 2 | **Beyond Local Maxima?** | PASS | Prose, fine-tune, and RL alternatives weighed and scored |
| 3 | **Sufficient?** | PASS | Skeleton plus verifier directly addresses the observed failures without extra machinery |
| 4 | **Fits Goal?** | PASS | This is the geometry kernel on the critical path to the 80-90% SHIP target |
| 5 | **Open Horizons?** | PASS | The skeleton schema is the substrate the 005 GPT-5.5 author and an A7 kernel can extend |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New `skeleton/compute-skeleton.mjs` plus `skeleton-schema.json` own all 2D geometry.
- `gen-tile.mjs` branches 2D tiles into the skeleton contract and forbids model coordinate text.

**How to roll back**: set `A5_ARM=control` so 2D tiles revert to the 001 prompt and gate; the skeleton modules stay dormant and no data reversal is required.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: best-of-3 is an upstream skeleton recompute, not three GLM calls

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (planning) |
| **Date** | 2026-06-29 |
| **Deciders** | anobel.com bento program |

---

<!-- ANCHOR:adr-002-context -->
### Context

When a skeleton render fails the post-render verifier, we needed to decide how to retry. Asking GLM to retry coordinates re-introduces the exact failure mode this phase removes. The research recommends starting cheap and escalating only after the verifier proves native generation failed (AdaCoder adaptive planning, `iter-r2-A5.md`, `iter-r4-pipeline.md` step 8).

### Constraints

- No free GLM coordinate retries.
- Cost must stay bounded: best-of-3 should not triple GLM spend.

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: on the first verifier failure, recompute up to three candidate layouts upstream that vary a **named axis**, pick the best geometry score, then render once from the winner.

**How it works**: the candidates must differ along an explicit variation axis — row-height ∈ {compact, default, generous}, layout-mode, or node-order — so they are genuinely different geometries, not identical recomputes. The panel flagged that a deterministic recompute of the same parameters is a no-op ("best-of-3 is theater"); naming the axis fixes that. Candidates are scored by a continuous function before any render, e.g. `score = (preflight_pass ? 1000 : 0) − overlap_area − anchor_error − overflow`, so the extra cost is upstream compute, not extra model generations (`../reviews/004-skeleton-first-2d-panel.md` adopt-worthy #4; `iter-r3-A5.md` wall-clock row).
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Best-of-3 upstream recompute over a named axis (chosen)** | Cheap, deterministic, genuinely different candidates, avoids the model's weak geometry | Needs a candidate scorer + a defined variation axis | 9/10 |
| Best-of-3 recompute of identical deterministic parameters | Trivial to wire | A no-op — the same input yields the same layout three times ("best-of-3 is theater", panel) | 1/10 |
| Three GLM render attempts | Simple to wire | Triples cost and repeats the coordinate-invention failure | 2/10 |
| Always generate three candidates up front | Fewer branches | Pays the cost on every tile, including ones that pass first try | 4/10 |

**Why this one**: it matches AdaCoder's escalate-only-after-failure pattern, keeps the model out of geometry entirely, and — by naming the variation axis — avoids the no-op trap all five panel models flagged.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Recovery from a first failure with no extra GLM coordinate risk and near-zero added latency.

**What it costs**:
- A candidate generator and scorer. Mitigation: reuse the preflight AABB scorer from `verify-skeleton.mjs`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| All three candidates fail the same constraint | M | Fall through to ADR-driven downgrade (step 9) rather than loop |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A first-failure recovery path is needed before downgrading |
| 2 | **Beyond Local Maxima?** | PASS | Three retry strategies compared |
| 3 | **Sufficient?** | PASS | Upstream recompute resolves most first failures without model risk |
| 4 | **Fits Goal?** | PASS | Keeps cost bounded on the path to the SHIP target |
| 5 | **Open Horizons?** | PASS | The candidate scorer is reused by the downgrade and the 005 escalation |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `verify-skeleton.mjs` gains a candidate generator plus geometry scorer.
- `gen-tile.mjs` calls best-of-3 on the first verifier FAIL and downgrade on the second.

**How to roll back**: gate best-of-3 behind a flag; on disable, a first failure routes straight to downgrade.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Adopt A7 renderer-first — GLM emits a semantic plan; a deterministic renderer owns all pixels

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (planning) |
| **Date** | 2026-06-29 |
| **Deciders** | anobel.com bento program |

---

<!-- ANCHOR:adr-003-context -->
### Context

The two source angles describe two contract shapes, and the original ADR chose the wrong direction. A5 specifies an explicit coordinate skeleton handed to GLM as input, with regions, node boxes, anchors, and connector routes (`iter-r2-A5.md`). A7 specifies a semantic `bento_plan_v2` where GLM emits nodes, edges, and a tile type and a deterministic renderer computes all bboxes from layout-mode templates (`iter-r2-A7.md`). The 5-model second-opinion panel (`../reviews/004-skeleton-first-2d-panel.md`) was unanimous that the program's biggest methodological gap is the untested premise that GLM *obeys* an explicit pixel skeleton — and 4-5 of 5 recommended switching to the A7 renderer-first path so GLM never owns pixels. We therefore re-decide the contract direction this phase ships.

### Constraints

- The contract must produce exact, auditable geometry now AND must not rest on the untested "GLM obeys coordinates" assumption.
- It must avoid the audit-tag circular dependency (`data-a5-*` tags authored by GLM and then read back to audit GLM's own placement).
- The schema must cover five distinct geometries (matrix/hub-spoke/routing/funnel/popover), not one matrix-shaped contract.

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: ship the **A7 renderer-first** contract. GLM emits only a semantic plan (nodes/edges/roles, or a layout template + params) and never sees or authors pixel coordinates. A deterministic renderer, branched by `layout_mode`, computes all bboxes from per-mode templates; the A5 coordinate JSON is now what the renderer OUTPUTS, not what GLM receives.

**How it works**: `skeleton-schema.json` carries two `layout_mode`-branched shapes — a semantic-plan INPUT schema (nodes/edges/roles, no coordinates) and the renderer coordinate-OUTPUT schema (regions, constraints, node boxes, connector routes on a frozen 560×480 canvas). The renderer emits inline style or CSS variables from the computed output, and the verifier reads computed bboxes directly from the rendered DOM/SVG — so no GLM-authored `data-a5-*` audit tags are needed, removing the circular dependency. Each of matrix (grid), hub-spoke (polar), routing (orthogonal-router), funnel (trapezoidal), and popover (z-stack) has its own template; a single matrix-shaped `nodes[]`/`connectors[]` schema is rejected. When a diagram exceeds budget (nodes>5, rows>3, edges>6), it converts to a stacked-rows / linearized mode for the downgrade path.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A7 renderer-first: GLM plan in, renderer computes pixels (chosen)** | Removes the untested "GLM obeys coordinates" premise; kills the audit-tag circular dependency; smaller, more reliable model contract | A renderer per `layout_mode` to build and two schemas to align | 9/10 |
| A5 coordinate JSON as GLM INPUT, A7 modes for downgrade (original choice, now rejected) | Exact geometry spec; reuses A7 modes where they fit | Rests on the untested premise that GLM obeys pixel coordinates (rated "Low" with zero evidence — the panel's top gap); audit-tag circular dependency | 3/10 |
| Prose constraints only | No schema | Re-creates RC-1/RC-2/RC-3 | 1/10 |

**Why this one**: the 5-model panel (5/5 on this phase, 4/5 recommending the switch outright) showed that demoting GLM from coordinate-author to semantic planner removes both the dominant failure premise and the circular audit dependency in a single move, and yields a ~70%-smaller model contract. The coordinate JSON still exists — it is just the renderer's output now, not GLM's input.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The untested "GLM obeys coordinates" premise is eliminated — GLM cannot cause RC-1/RC-2/RC-3 because it never authors pixels.
- The audit-tag circular dependency is removed — the verifier reads computed bboxes directly.
- The model contract shrinks (semantic plan only), improving instruction-following under density (IFScale).

**What it costs**:
- A renderer per `layout_mode` plus two schemas (plan input + coordinate output) to build and keep aligned. Mitigation: the `layout_mode` field selects the template, and all modes share the AABB verifier.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| GLM emits an unfaithful semantic plan | M | Phase-0 plan-obedience pilot (≥85% gate) before building; <85% re-scopes |
| Reserved title region height was unresolved (104px A7 vs 112px A5) | — | Resolved: frozen at 104px (A7) on measured production Dutch copy as a schema constant (REQ-010); no longer an open question |
| Semantic-plan + renderer adds prompt/compute tokens | L | The plan replaces dense layout prose, so net prompt cost stays within -100 to +400 tokens |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A concrete contract is required to ship the kernel, and the original A5-input direction was unsound (untested premise + circular audit) |
| 2 | **Beyond Local Maxima?** | PASS | A7 renderer-first, A5 GLM-input, and prose contracts compared against the 5-model panel |
| 3 | **Sufficient?** | PASS | Renderer-first gives exact geometry AND removes the failure premise; the Phase-0 pilot confirms plan fidelity |
| 4 | **Fits Goal?** | PASS | Matches the panel's 5/5 endorsement of demoting GLM to a semantic planner |
| 5 | **Open Horizons?** | PASS | The semantic-plan substrate is exactly what the 005 GPT-5.5 author extends; per-`layout_mode` templates ease later modes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `skeleton-schema.json` defines the GLM semantic-plan INPUT schema plus the renderer coordinate-OUTPUT schema, both branched by a `layout_mode` enum (matrix/hub-spoke/routing/funnel/popover + the downgrade modes).
- `compute-skeleton.mjs` becomes the renderer: it validates the plan and computes all coordinates per template.
- `downgrade.mjs` maps over-budget diagrams onto stacked-rows and linearized modes.

**How to roll back**: the schema is additive to the harness; disabling the 2D path (ADR-001 rollback) leaves the schema unused.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
