---
title: "Implementation Plan: skeleton-first-2d (geometry kernel)"
description: "A7 renderer-first approach: GLM emits a semantic plan, a deterministic renderer (branched by layout_mode) computes all 2D-tile pixels, gated by a Phase-0 plan-obedience pilot + verifier re-baseline, with best-of-3 (named variation axis) + downgrade wired into the bento gen-tile flow."
trigger_phrases:
  - "skeleton-first 2d plan"
  - "geometry kernel plan"
  - "skeleton compute module"
  - "render contract"
  - "best-of-3 downgrade"
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
      - "Depends on 001 gate + failure-JSON and 002 primitive routing"
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/scratch/faithful-import/gen-tile.mjs"
      - ".opencode/specs/anobel.com/004-bento-visuals/scratch/faithful-import/_audit.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: skeleton-first-2d (geometry kernel)

<!-- SPECKIT_LEVEL: 3 -->
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
| **Language/Stack** | Node.js (ESM `.mjs`), browser-rendered HTML/CSS/SVG |
| **Framework** | Existing bento generation harness (`faithful-import/`), Z.AI GLM-5.2 multimodal API |
| **Storage** | None (file outputs: per-tile HTML + audit JSONL rows) |
| **Testing** | Headless browser geometry audit (Playwright/Puppeteer as used by `_audit.mjs`), JSONL ship-gate rows |

### Overview
Add a deterministic geometry layer so GLM-5.2 never authors 2D coordinates at all (A7 renderer-first). GLM emits only a semantic plan (nodes/edges/roles, or template+params); a deterministic renderer — branched by `layout_mode` — computes the full 560×480 coordinate layout (regions, boxes, row caps, anchors, routes, AABB gaps) as its OUTPUT. A **Phase-0 plan-obedience pilot + verifier re-baseline gates the build**; a geometry verifier extends the 001 ship-gate; best-of-3 recomputes upstream over a named variation axis (row-height/layout-mode/node-order) on first failure and a downgrade module linearizes on second failure. The mechanism mirrors LaySPA explicit layout objects, LaTCoder bounded-region assembly, GeoSVG-RL browser-backed geometry checks, and AdaCoder failure-triggered escalation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md REQ-001..REQ-008)
- [ ] Success criteria measurable (SC-001..SC-005 with baseline numbers)
- [ ] Dependencies identified (001 gate + failure-JSON; 002 primitive routing)

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001..REQ-005)
- [ ] A5 geometry verifier extends the 001 ship-gate (REQ-006)
- [ ] Docs synchronized (spec/plan/tasks/checklist/decision-record)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A7 renderer-first: model-emits-plan, code-owns-pixels. GLM is demoted from coordinate-author to semantic planner; a deterministic renderer computes and audits all placement outside the model (`iter-r2-A7.md` Renderer mapping). This removes the untested "GLM obeys coordinates" premise and the audit-tag circular dependency in one move.

### Key Components
- **compute-skeleton.mjs** (the renderer): validate the GLM semantic plan → select the `layout_mode` template → measure copy → reserve title band → allocate diagram region → place node/row boxes within caps → compute connector anchors + orthogonal routes → emit the schema-valid coordinate layout (the renderer's OUTPUT).
- **skeleton-schema.json**: two `layout_mode`-branched schemas — a GLM semantic-plan INPUT schema (nodes/edges/roles, no coordinates) and the renderer coordinate-OUTPUT schema (`canvas{560×480}`, `regions{eyebrow,diagram,title}`, `constraints`, `nodes[]`, `connectors[]`, `coordinate_transport`); matrix/hub-spoke/routing/funnel/popover each carry their own geometry contract.
- **verify-skeleton.mjs**: preflight AABB validator (step 7) + best-of-3 candidate scorer over the named variation axis (step 8).
- **downgrade.mjs**: step-9 linearization to linear-flow / stacked-list / compact-matrix with "+N more".
- **gen-tile.mjs (modified)**: requests a semantic plan from GLM for 2D tiles, forbids GLM coordinate text, passes the plan to the renderer, orchestrates best-of-3 → downgrade.
- **_audit.mjs (modified)**: `auditA5Geometry` DOM/SVG bbox checks (reads computed bboxes directly) + extended ship-gate.

### Data Flow
002 labels tile `2d_positioned` → GLM emits a semantic plan → compute-skeleton (renderer) computes the coordinate layout per `layout_mode` → verify-skeleton preflight (step 7) → render → browser → auditA5Geometry → ship-gate. On FAIL#1 → recompute best-of-3 varying the named axis (step 8). On FAIL#2 → downgrade (step 9). The renderer owns all coordinates; it emits inline-style/CSS-vars; the verifier reads computed geometry directly (no GLM-authored `data-a5-*` tags required). Gated upstream of all of this by the Phase-0 pilot + re-baseline.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase fixes geometry bugs (RC-1/RC-2/RC-3) and touches the shared generation flow + audit gate, so the surface inventory is required.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `gen-tile.mjs` request body / prompt builder | Owns the single-shot GLM prompt incl. layout prose | update — branch 2D tiles to request a semantic plan, pass it to the renderer, forbid coordinate text | `rg -n "buildCurrentPrompt|messages\\[" gen-tile.mjs` |
| `_audit.mjs` ship-gate | Computes pass/fail from contrast + bbox checks | update — add `auditA5Geometry` (reads computed bboxes) + 6 geometry fields | `rg -n "ship_gate|getBoundingClientRect" _audit.mjs` |
| 001 deterministic gate / failure-JSON | Produces per-tile bbox + overflow + contrast surface | unchanged consumer — reuse its bbox extraction | `rg -n "overflow|title_at_bottom" <001-gate>` |
| 002 primitive router | Labels linear vs 2d_positioned | unchanged consumer — read `primitive_class` | `rg -n "primitive_class|2d_positioned" <002-router>` |
| Linear-flow render path | Renders already-strong linear tiles | not a consumer — must be bypassed | confirm linear tiles never call the renderer (compute-skeleton) |

Required inventories (run before implementation):
- Same-class producers: `rg -n "position:absolute|x/y/w/h|transform:" <harness>` to find every place geometry is currently authored.
- Consumers of changed symbols: `rg -n "buildA7Plan|auditA5Geometry|skeleton|fallback_triggered" . --glob '*.mjs' --glob '*.md'`.
- Matrix axes: {treatment ∈ matrix|node|routing|funnel|popover} × {pass | FAIL#1→best-of-3 | FAIL#2→downgrade} × {legend | no-legend}.
- Algorithm invariant: a shipped 2D tile has overflow=false ∧ diagram∩title=false ∧ node_collision_count=0 ∧ title_at_bottom=true ∧ every connector endpoint ≤ 4px from its declared anchor. Adversarial cases: 6th matrix row, 6 absolute nodes, title-claims-canvas, connector off-anchor.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Falsify the premise (BUILD GATE)
- [ ] Plan-obedience pilot: hand-author semantic plans for 2-3 sentinel tiles (`accountbeheer-4 matrix`, `oci-4 node`) and measure whether GLM-5.2 faithfully renders from them (REQ-009)
- [ ] Re-baseline: re-score the old 2D outputs through the NEW geometry verifier so lift is apples-to-apples; exclude downgraded tiles from the 2D denominator (REQ-012)
- [ ] Freeze constants before schema freeze: `canvas`=560×480 and title band=104px on measured production Dutch copy (REQ-010)
- [ ] GATE: ≥85% plan-obedience to proceed; <85% forces a documented scope/sequencing change before any module code

### Phase 1: Setup
- [ ] Confirm 001 failure-JSON + 002 `primitive_class` are available in the harness
- [ ] Create `skeleton/` module group + the `layout_mode`-branched `skeleton-schema.json` (semantic-plan input schema + renderer coordinate-output schema) (REQ-011)
- [ ] Add a JSON-schema validator for both the plan input and the renderer output

### Phase 2: Core Implementation
- [ ] compute-skeleton.mjs (renderer): validate plan → select `layout_mode` template → copy measurement + region reservation + box/cap/anchor/route computation
- [ ] verify-skeleton.mjs: preflight AABB (step 7) + best-of-3 scorer over the named variation axis (step 8)
- [ ] downgrade.mjs: step-9 linearization with "+N more"
- [ ] gen-tile.mjs: request a semantic plan, pass it to the renderer, forbid coordinate text, orchestrate best-of-3 → downgrade
- [ ] _audit.mjs: auditA5Geometry (reads computed bboxes) + extended ship-gate

### Phase 3: Verification
- [ ] Run on the 2D holdout (matrix/node/routing/funnel/popover) and confirm SC-001..SC-006 (honest +8-12 vs re-baselined)
- [ ] Confirm linear-flow negative control unchanged (REQ-007)
- [ ] Update spec/tasks/checklist/decision-record with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Pilot (Phase-0 gate) | GLM-5.2 plan-obedience on 2-3 sentinel tiles (`accountbeheer-4 matrix`, `oci-4 node`) + re-baseline of old outputs through the new verifier | hand-authored plans + headless browser + blind MiniMax-M3 |
| Unit | renderer (compute-skeleton) region math, plan validation, AABB preflight, best-of-3 variation-axis scoring, downgrade selection | node test runner |
| Integration | gen-tile 2D path: plan→renderer→render→audit→ship-gate; FAIL#1/FAIL#2 transitions | harness run on sentinel tiles |
| Manual/Visual | Blind audit on `accountbeheer-4 matrix`, `oci-4 node`; linear control `accountbeheer-5 timeline`, `oci-5 timeline`; templated-feel check across same-type tiles (SC-006) | headless browser + blind MiniMax-M3 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 deterministic gate + failure-JSON | Internal | Red (not built) | No verifier surface / ship-gate to extend |
| 002 primitive routing | Internal | Red (not built) | Cannot scope 2D tiles into the skeleton path |
| Z.AI GLM-5.2 multimodal API | External | Green | No renderer for skeleton contract |
| Headless browser audit (`_audit.mjs`) | Internal | Green | No DOM/SVG geometry measurement |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: 2D SHIP does not improve ≥ +3 pts, or linear tiles regress materially, or downgrade rate > 25%.
- **Procedure**: Disable the skeleton path via the arm switch (`A5_ARM=control`) so 2D tiles fall back to the 001 prompt+gate behavior; skeleton modules remain dormant.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001 gate + failure-JSON ──┐
                          ├──► 004 skeleton-first-2d ──► 005 GPT-5.5 author
002 primitive routing ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 001, 002 | Core |
| Core | Setup | Verify |
| Verify | Core | 005 escalation, 006 rerun |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 0 (pilot + re-baseline + freeze) | Med | 2-4 hours (falsify the premise before building) |
| Setup | Low | 1-2 hours |
| Core Implementation | High | 11-18 hours (renderer + 5 `layout_mode` templates + plan contract + best-of-3 variation + downgrade + verifier) |
| Verification | Med | 2-4 hours |
| **Total** | | **16-28 hours** (revised up from 11-20h per the panel's effort flag; the per-`layout_mode` renderer + Phase-0 pilot are the added cost) |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Arm switch (`A5_ARM`) wired so the skeleton path is toggleable
- [ ] Baseline 2D scores + diagram-gap captured before enabling
- [ ] Audit JSONL rows include `fallback_triggered` for downgrade-rate monitoring

### Rollback Procedure
1. Set `A5_ARM=control` to bypass the skeleton path.
2. Re-run gen-tile; 2D tiles revert to the 001 prompt+gate flow.
3. Smoke-test the sentinel tiles to confirm no regression.
4. No data reversal needed (file outputs only).

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (regenerate tile HTML)
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐   ┌──────────────────────┐   ┌──────────────────┐
│ 001 gate +       │──►│ 004 skeleton-first-2d│──►│ 005 GPT-5.5      │
│ failure-JSON     │   │  (geometry kernel)   │   │ skeleton author  │
└──────────────────┘   └──────────┬───────────┘   └──────────────────┘
┌──────────────────┐              │
│ 002 primitive    │──────────────┘
│ routing          │
└──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| compute-skeleton.mjs | 002 labels, copy metrics | skeleton JSON | verify, gen-tile |
| verify-skeleton.mjs | skeleton JSON | preflight verdict, best-of-3 pick | gen-tile |
| downgrade.mjs | FAIL#2 signal | linearized primitive | ship-gate |
| _audit.mjs (A5 hook) | rendered DOM | 6 geometry fields | ship-gate |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **compute-skeleton.mjs** - 4-6h - CRITICAL (everything renders from it)
2. **verify-skeleton.mjs (preflight + best-of-3)** - 2-4h - CRITICAL (gates GLM calls)
3. **gen-tile.mjs contract wiring** - 2-3h - CRITICAL (connects skeleton to GLM)

**Total Critical Path**: ~8-13 hours

**Parallel Opportunities**:
- `downgrade.mjs` and the `_audit.mjs` A5 hook can be built alongside the skeleton math once `skeleton-schema.json` is frozen.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Schema frozen + preflight gate live | No invalid skeleton reaches GLM | Phase 1-2 |
| M2 | Skeleton render contract working | 2D tiles render from skeleton, no GLM coordinates (REQ-002) | Phase 2 |
| M3 | best-of-3 + downgrade wired | FAIL#1→recompute, FAIL#2→linearize (REQ-004/005) | Phase 2-3 |
| M4 | Lift verified | SC-001..SC-005 met on the holdout | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the full architecture decision (ADR-001 geometry ownership, ADR-002 best-of-3 mechanism, ADR-003 A7 renderer-first contract). Summary:

### ADR-001 / ADR-003: A7 renderer-first — GLM emits a semantic plan, the renderer owns pixels

**Status**: Accepted (planning)

**Context**: GLM-5.2 cannot reliably author 2D geometry (RC-1/RC-2/RC-3), and the 5-model panel showed the original A5 "GLM obeys an explicit pixel skeleton" premise is untested and likely false.

**Decision**: GLM emits only a semantic plan (nodes/edges/roles, or template+params); a deterministic renderer (branched by `layout_mode`) computes all pixels. The A5 coordinate JSON is the renderer's OUTPUT, not GLM's input.

**Consequences**:
- Removes the dominant defect class AND the untested coordinate-obedience premise AND the audit-tag circular dependency; adds a per-`layout_mode` renderer + two schemas to maintain.

**Alternatives Rejected**:
- More layout prose: fails under instruction density (IFScale).
- A5 coordinate JSON as GLM INPUT (the original chosen path): rests on the untested "GLM obeys coordinates" premise and creates an audit-tag circular dependency — flipped to renderer-first per the panel (5/5).

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records (full detail in decision-record.md)
-->
