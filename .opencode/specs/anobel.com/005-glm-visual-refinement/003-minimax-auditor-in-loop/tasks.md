---
title: "Tasks: minimax-auditor-in-loop"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "minimax auditor in loop tasks"
  - "issue to fix-json adapter"
  - "failure-only round-2 repair"
  - "a4 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/003-minimax-auditor-in-loop"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Folded panel refinements: re-sequence via FIX-type tally, audit-boolean routing"
    next_safe_action: "Tally the 18 FIX by defect-type; build standalone A4 only if justified"
    blockers:
      - "Re-sequenced (panel 4/5): build a standalone A4 only after phase 004 and only if the dec…"
      - "Hard predecessor: phase 001 gate + failure-JSON surface"
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: minimax-auditor-in-loop

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

- [ ] T001 Decision gate: tally the 18 baseline FIX findings by defect type (`004-bento-visuals/research/inputs/audit-*.json`); if >=70% collision-type, STOP and fund phase 004; if majority procedural, fold into phase 001
- [ ] T002 [B] Verify phase 001 deterministic gate + failure-JSON surface is available to consume (blocked until 001 ships); A4 is re-sequenced to run after phase 004
- [ ] T003 Snapshot the 18 FIX repair cohort + 27 SHIP sentinels with their `overflow`/`title_at_bottom`/`readable`/`on_brand` booleans (`004-bento-visuals/research/inputs/audit-*.json`)
- [ ] T004 Hand-label a gold set of the 18 FIX rows for the adapter precision gate
- [ ] T005 [P] Pin run config: glm-5.2, max_tokens 24000, temp 0.4, thinking disabled, retry 1, max 3 fixes/tile
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Build `routeFixes` boolean fix-router: audit JSON booleans (`overflow`->RC-1, `title_at_bottom`->RC-3, `readable`->RC-5, `on_brand`->RC-6) -> typed fix objects; RC-2 collisions routed to phase 004; no free-text regex (`004-bento-visuals/research/inputs/a4-adapter.mjs`)
- [ ] T007 Add the adapter precision gate: score `routeFixes` against the gold set, require >=85% before any round-2 generation (`004-bento-visuals/research/inputs/a4-adapter.mjs`)
- [ ] T008 Build `a4RepairContract` round-2 GLM prompt template: 9 hard invariants + `{{A4_FIXLIST_JSON}}` (`004-bento-visuals/research/inputs/a4-adapter.mjs`)
- [ ] T009 Wire the A4 arm into `gen(t)`: `A4_ARM`/`A4_AUDIT_JSON`/`A4_RUN_ID` switch, SHIP-skip, `.r2-a4.html` + `.meta.json` (`004-bento-visuals/research/inputs/gen-tile.mjs`)
- [ ] T010 Build `a4-rescore.mjs`: MiniMax rescore + 001 deterministic gate + primitive/semantic-consistency check + second-auditor spot-check; emit round-2 audit rows (`converted`/`false_fix`/`geometry_pass`/`contrast_exit_0`/`primitive_preserved`/`second_auditor_pass`) (`004-bento-visuals/research/inputs/a4-rescore.mjs`)
- [ ] T011 Implement the adopt-if decision (gates + MiniMax SHIP + precision + primitive-consistency + second-auditor + no regression -> adopt; else keep round-1) (`004-bento-visuals/research/inputs/a4-rescore.mjs`)
- [ ] T012 [P] Add the generic-retry (T0) comparator arm (`004-bento-visuals/research/inputs/gen-tile.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run T1 (A4 structured) + T0 (generic) on the 18 FIX tiles, alternating order by tile parity
- [ ] T014 Measure FIX->SHIP conversion split by class (mechanical/procedural vs collision/2D), MiniMax score delta, false-fix rate, geometry/contrast pass, primitive preservation, second-auditor agreement, and cost
- [ ] T015 Confirm T1 beats T0 (>=3 conversions or >=8 pts on the 2D cohort) and the 27 SHIP sentinels are untouched
- [ ] T016 Record adopt/iterate/reject verdict and hand round-2 audit rows to the phase-006 adoption gate
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Decision gate cleared (or phase skipped per the tally, with the decision recorded)
- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (T1 beats T0; `false_fix_rate <= 1/18`; primitive-consistency + second-auditor spot-check pass)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
