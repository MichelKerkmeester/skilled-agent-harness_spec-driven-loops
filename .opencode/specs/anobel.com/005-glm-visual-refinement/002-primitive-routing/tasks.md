---
title: "Tasks: primitive-routing"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "primitive routing tasks"
  - "treatment primitive map tasks"
  - "gen-tile classifier tasks"
  - "linear-flow 2d-positioned tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/002-primitive-routing"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Folded 5-model panel refinements into tasks (safe default, render override, pilot)"
    next_safe_action: "Start T001 — transcribe concepts.md §2 into primitive-map.mjs (the prior)"
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
    open_questions: []
    answered_questions: []
---
# Tasks: primitive-routing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

<!-- Phase 1 work = build the treatment -> primitive map -->


- [ ] T001 Transcribe `concepts.md` §2 into a `(concept, treatment-n) -> primitive` table for all 9 concepts x 5 treatments (`.opencode/specs/anobel.com/004-bento-visuals/research/inputs/primitive-map.mjs`)
- [ ] T002 Annotate each cell with its `concepts.md` §2 source form so the label is auditable (`primitive-map.mjs`)
- [ ] T003 Cross-check the 10 `2d-positioned` cells against the `iter-r3-A3.md` frozen stratum (`primitive-map.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `slugFromOut(out)` deriving `<concept>-<n>` from a treatment's `out` path (`gen-tile.mjs`)
- [ ] T005 Add `primitiveFor(t)` resolving via `PRIMITIVE_MAP`, safe-defaulting unmapped tiles to `linear-flow` + `triage=true` (never throw) (`gen-tile.mjs`)
- [ ] T006 Add the route branch — `linear-flow` to the normal path with `repair=failure-only`; `2d-positioned` with `skeletonFirst=true` + `repair=mandatory-round-2` (`gen-tile.mjs`)
- [ ] T007 Add `reclassifyFromRender(tile, gateResult)` — re-route gate-flagged `overflow`/`collision` tiles to `2d-positioned` + `mandatory-round-2` regardless of static label, and escalate overflowing linear tiles by defect (`gen-tile.mjs`)
- [ ] T008 Emit per-tile routing metadata `{ tileId, primitive, route, repair, skeletonFirst, defectClass, triage }` for downstream phases 003/004/005 (`gen-tile.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Assert the 45-tile classifier output is a 10/35 split equal to the manual labels (0 mismatches)
- [ ] T010 Assert the `(d)` route-by-form proof: `aangepast-assortiment-4` = `linear-flow`, `-3`/`-5` = `2d-positioned`
- [ ] T011 Assert an unmapped key returns `linear-flow` + `triage=true` and does not throw (safe default)
- [ ] T012 Assert `reclassifyFromRender()` re-routes a synthetic overflowing `linear-flow` tile to `2d-positioned` + `mandatory-round-2`
- [ ] T013 Dry-run `gen-tile.mjs` to confirm every tile resolves a primitive before any generation call and routing metadata is emitted
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Score-moving pilot

<!-- Phase 4 work = falsify the routing premise (SC-003) before phases 003/004/005 build on it -->

- [ ] T014 Route 5 `2d-positioned` tiles down the routed path (skeleton flag + mandatory Round-2) vs baseline; require ≥3/5 to improve ≥10 points, else stop and revisit the routing premise (SC-003)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
