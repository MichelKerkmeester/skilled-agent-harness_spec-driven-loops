---
title: "Tasks: deep-research gap backstop for 008 doc-evolution"
description: "Task list for the convergence-gated cli-devin SWE-1.6 residual-gap backstop over the 5 deep-* skills."
trigger_phrases:
  - "deep-research gap backstop tasks"
  - "008 residual gap research tasks"
  - "deep-skill doc-evolution backstop tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/008-deep-skill-doc-evolution/009-deep-research-gap-backstop"
    last_updated_at: "2026-05-25T18:48:00Z"
    last_updated_by: "main_agent"
    recent_action: "deep-research-loop-converged-negative"
    next_safe_action: "final-closeout-reindex-and-post-impl-deep-review"
    blockers: []
    key_files:
      - "research/deep-research-state.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000902"
      session_id: "116-008-009-deep-research-gap-backstop"
      parent_session_id: "116-008-009-deep-research-gap-backstop"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1-Q5 residual-gap questions answered NEGATIVE across 2 iterations"
---
# Tasks: deep-research gap backstop for 008 doc-evolution

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

- [x] T001 Write canonical INIT state (config, state.jsonl, anchored strategy, registry) (research/)
- [x] T002 Substitute + tighten the cli-devin agent-config recipe to narrative-only writes (research/prompts/agent-config-iter-001.json)
- [x] T003 [P] Dry-run reduce-state.cjs to confirm strategy anchors parse (research/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Dispatch iteration 1, full residual-gap sweep (research/iterations/iteration-001.md)
- [x] T005 Post-process iter-1: append state record + delta + reduce (research/deltas/iter-001.jsonl)
- [x] T006 Dispatch iteration 2, adversarial concrete re-verification (research/iterations/iteration-002.md)
- [x] T007 Post-process iter-2: append state record + delta + reduce (research/deltas/iter-002.jsonl)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Convergence vote: 2 consecutive concrete negatives, newInfoRatio 0.0 (research/deep-research-state.jsonl)
- [x] T009 Append converged + synthesis_complete events; reduce-state reports COMPLETE (research/deep-research-dashboard.md)
- [x] T010 Merge loop outcome into the 008 deferred backlog (../001-spec-and-resource-map/resource-map.yaml)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
