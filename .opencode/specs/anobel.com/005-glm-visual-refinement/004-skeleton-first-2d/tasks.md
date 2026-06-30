---
title: "Tasks: skeleton-first-2d (geometry kernel)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "skeleton-first 2d tasks"
  - "geometry kernel tasks"
  - "tasks"
  - "name"
  - "tasks core"
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
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: skeleton-first-2d (geometry kernel)

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] T001 [B] Confirm 001 failure-JSON + 002 `primitive_class` are emitted per tile (`…/faithful-import/_audit.mjs`)
- [ ] T002 Freeze the skeleton contract schema — `layout_mode`, `canvas`, `regions`, `constraints`, `nodes`, `connectors`, `glm_rules`, `coordinate_transport` (`…/faithful-import/skeleton/skeleton-schema.json`)
- [ ] T003 [P] Add a JSON-schema validator + fixtures for skeleton output (`…/faithful-import/skeleton/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement copy measurement + region reservation (eyebrow / diagram / reserved title band) (`…/faithful-import/skeleton/compute-skeleton.mjs`)
- [ ] T005 Implement node/row box placement with caps (matrix ≤4 with legend / ≤5 without; nodes≤5 / rows≤3 / edges≤6) (`…/faithful-import/skeleton/compute-skeleton.mjs`)
- [ ] T006 Implement connector anchors + orthogonal route computation with standoff gaps (`…/faithful-import/skeleton/compute-skeleton.mjs`)
- [ ] T007 Implement preflight AABB validator — step 7 (no diagram∩title, no node/row collision, padding budget, anchors terminate) (`…/faithful-import/skeleton/verify-skeleton.mjs`)
- [ ] T008 Implement best-of-3 candidate recompute + geometry scorer — step 8 (`…/faithful-import/skeleton/verify-skeleton.mjs`)
- [ ] T009 Implement downgrade to linear-flow / stacked-list / compact-matrix with "+N more" — step 9 (`…/faithful-import/skeleton/downgrade.mjs`)
- [ ] T010 Wire the skeleton render contract into gen-tile: `buildA7Plan(skeleton)`, forbid GLM coordinate text, branch only 2D tiles (`…/faithful-import/gen-tile.mjs`)
- [ ] T011 Orchestrate the failure state machine: render → audit → FAIL#1→best-of-3 → FAIL#2→downgrade (`…/faithful-import/gen-tile.mjs`)
- [ ] T012 Add `auditA5Geometry` DOM/SVG bbox hook + extend ship-gate with the 6 geometry fields (`…/faithful-import/_audit.mjs`)
- [ ] T013 [P] Emit `fallback_triggered` + geometry fields into the audit JSONL rows (`…/faithful-import/_audit.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Run the 2D holdout (matrix/node/routing/funnel/popover) and confirm SC-001 (+≥15 pts) and SC-002 (gap closes ≥35%)
- [ ] T015 Confirm linear-flow negative control unchanged — `accountbeheer-5 timeline`, `oci-5 timeline` (drop ≤3 pts, REQ-007/SC-003)
- [ ] T016 Confirm downgrade rate < 10% and zero RC-1/RC-2/RC-3 defects in shipped 2D outputs (SC-004/SC-005)
- [ ] T017 Update spec/plan/checklist/decision-record with evidence and resolve the 104px-vs-112px title-region question
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (001 + 002 landed)
- [ ] SC-001..SC-005 verified on the holdout with blind audit evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
