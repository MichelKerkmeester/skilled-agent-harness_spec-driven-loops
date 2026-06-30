---
title: "Tasks: designer-skills-main → sk-design improvement research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "designer-skills-main research tasks"
  - "deep research tasks designer-skills"
  - "sk-design scope research tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/024-designer-skills-research"
    last_updated_at: "2026-06-27T11:12:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all research tasks complete after the 13-iteration run"
    next_safe_action: "A future build phase adopts backlog ranks 1-5 into existing sk-design modes"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-024-designer-skills-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: designer-skills-main → sk-design improvement research

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

- [x] T001 Create phase folder + research packet dirs
- [x] T002 Initialize config/state/strategy/registry; executor cli-codex gpt-5.5 xhigh fast (maxIterations 20)
- [x] T003 Write loop driver; verify iteration-1 test end-to-end
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Iterations 1-9 sequential: capability map, interaction-design, ui-design, out-of-scope plugins
- [x] T005 [P] Wave agent: visual-critique -> audit rubric crosswalk (`research/iterations/iteration-010.md`)
- [x] T006 [P] Wave agent: design-systems -> foundations/motion craft vs governance (`iteration-011.md`)
- [x] T007 [P] Wave agent: net-new technique extraction (`iteration-012.md`)
- [x] T008 [P] Wave agent: in/out-of-scope ledger + Q3 conflicts + draft backlog + new-mode call (`iteration-013.md`)
- [x] T009 Merge wave records into state log; run reducer (13 iterations, corruption 0)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify each iteration produced valid artifacts; spot-check cited anchors and scope line
- [x] T011 Synthesize `research/research.md`; emit resource-map; write spec findings summary
- [x] T012 Author wrapper docs; run `validate.sh --strict`; save continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (anchors confirmed; strict validation clean)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Sibling precedent**: See `../022-mifb-design-research/` and `../023-mifb-design-adoption/`
<!-- /ANCHOR:cross-refs -->
