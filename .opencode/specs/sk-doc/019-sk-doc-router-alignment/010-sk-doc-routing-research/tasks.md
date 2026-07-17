---
title: "Tasks: sk-doc Routing Foundation Research"
description: "Iteration and question workplan executed by the 10-iteration deep-research loop that produced research/research.md."
trigger_phrases:
  - "sk-doc routing research tasks"
  - "sk-doc routing research iterations"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research"
    last_updated_at: "2026-07-16T08:08:19Z"
    last_updated_by: "claude"
    recent_action: "Authored tasks.md documenting the executed iteration workplan"
    next_safe_action: "Plan 012-sk-doc-routing-fixes against research.md Section 8"
    blockers: []
    key_files:
      - "research/iterations/iteration-001.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-20260716-052950-sk-doc-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1: alias coverage gap falsified, 113/113 match"
      - "Q2: two coordinate systems, no handoff contract"
      - "Q3: 19-row failure classification complete"
      - "Q4: drift guard scoped to deep-loop only"
      - "Q5: 9-item dependency-ordered fix plan delivered"
---
# Tasks: sk-doc Routing Foundation Research

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

This packet's tasks are research iterations, not code changes. Each maps to one `research/iterations/iteration-NNN.md` write-up and one `research/deltas/iter-NNN.jsonl` delta.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Premise testing (Q1): whether the ~34-alias coverage gap is real.

- [x] T001 Diff `mode-registry.json` aliases against `hub-router.json` vocabularyClasses (`research/iterations/iteration-001.md`)
- [x] T002 Trace the ~34-alias figure to its source in create-skill canon (`research/iterations/iteration-002.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Failure classification (Q2-Q4): what actually causes the 20/100 score.

- [x] T003 Classify all 19 benchmark rows individually against D1intra/D2/D3/D5 (`research/iterations/iteration-003.md`)
- [x] T004 Trace the wrong-path-root class to the coordinate-system handoff gap (`research/iterations/iteration-004.md`)
- [x] T005 Check `routing-registry-drift-guard` coverage against the failure classes (`research/iterations/iteration-005.md`)
- [x] T006 Draft the dependency-ordered fix plan (`research/iterations/iteration-006.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Fix-plan hardening (Q5): edge cases and implementability before handoff.

- [x] T007 Harden namespace-collision and composite-uniqueness edge cases (`research/iterations/iteration-007.md`)
- [x] T008 Verify manifest byte-stable reproducibility (`research/iterations/iteration-008.md`)
- [x] T009 Review implementability: one owner, one test layer per guard (`research/iterations/iteration-009.md`)
- [x] T010 Run the terminal consistency audit and freeze contract names (`research/iterations/iteration-010.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All five key research questions answered with file:line evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Synthesis**: See `research/research.md` (canonical findings and Section 8 fix plan)
<!-- /ANCHOR:cross-refs -->

---
