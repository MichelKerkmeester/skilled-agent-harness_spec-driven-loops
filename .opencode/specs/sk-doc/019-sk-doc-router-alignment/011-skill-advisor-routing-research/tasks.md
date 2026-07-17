---
title: "Tasks: system-skill-advisor Routing Research"
description: "Iteration and question workplan executed by the 10-iteration deep-research loop that produced research/research.md."
trigger_phrases:
  - "skill advisor routing research tasks"
  - "skill advisor routing research iterations"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/011-skill-advisor-routing-research"
    last_updated_at: "2026-07-16T08:20:00Z"
    last_updated_by: "claude"
    recent_action: "Authored tasks.md documenting the executed iteration workplan"
    next_safe_action: "Plan 013-skill-advisor-routing-fixes against research.md Section 8"
    blockers: []
    key_files:
      - "research/iterations/iteration-001.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-20260716-054704-skill-advisor-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "REQ-001: holdout 73.08%, confidence dominated by 0.82 floor"
      - "REQ-002: fallback chain traced, hook tests 4/11 red"
      - "REQ-003: no drift, separate eligibility gate confirmed"
      - "REQ-004: no, guard hard-codes deep-loop registry only"
      - "REQ-005: P0-1 through P2-8 delivered to 013"
---
# Tasks: system-skill-advisor Routing Research

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

### Pipeline and Vocabulary Boundary (REQ-001, REQ-004)

- [x] T001 Trace the advisor_recommend four-layer path and 5-lane RRF scorer surface (research/iterations/iteration-001.md:1)
- [x] T002 Check advisor vocabulary alignment against sk-doc's hub registries (research/iterations/iteration-002.md:1)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Transport and Gate Sync (REQ-002, REQ-003)

- [x] T003 Trace the Claude hook brief and its CLI fallback chain for unhealthy transport (research/iterations/iteration-003.md:1)
- [x] T004 Prove sync or find drift between shouldFireAdvisor and MCP threshold resolution (research/iterations/iteration-004.md:1)
- [x] T005 Run a named end-to-end threshold parity suite (research/iterations/iteration-005.md:1)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Fix Plan and Hardening (REQ-005)

- [x] T006 Draft the priority order for advisor routing improvements (research/iterations/iteration-006.md:1)
- [x] T007 Recover from a blocked joined-calibration execution path (research/iterations/iteration-007.md:1)
- [x] T008 Run a fresh current-source joined RRF calibration and bounded proposal (research/iterations/iteration-008.md:1)
- [x] T009 Quantify result ambiguity versus executor attribution incoherence (research/iterations/iteration-009.md:1)
- [x] T010 Verify executor delegation branch coverage against 8 frozen fixtures (research/iterations/iteration-010.md:1)
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
