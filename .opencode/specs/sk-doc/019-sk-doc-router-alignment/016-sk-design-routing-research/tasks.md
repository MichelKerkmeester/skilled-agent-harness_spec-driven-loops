---
title: "Tasks: sk-design Routing Research"
description: "Iteration and question workplan to be executed by the /deep:research loop bound to this packet, producing research/research.md."
trigger_phrases:
  - "sk-design routing research tasks"
  - "sk-design routing research iterations"
  - "sk-design typed pair routing"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md documenting the planned iteration workplan"
    next_safe_action: "Launch the /deep:research loop bound to this packet; it populates research/"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-sk-design-routing-research-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-design Routing Research

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

This packet's tasks are research iterations, not code changes. Each maps to one `research/iterations/iteration-NNN.md` write-up and one `research/deltas/iter-NNN.jsonl` delta, produced by the bound `/deep:research` loop.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Surface mapping: classify the six per-mode routers against the typed-pair surface.

- [x] T001 Classify each per-mode router's leaf set into `(workflowMode, leafResourceId)` pairs (`research/iterations/iteration-001.md`)
- [x] T002 Confirm the current D5=100 resolution and attribute the ~69 CONDITIONAL baseline (`research/iterations/iteration-004.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Typed-pair feasibility: what it takes to measure sk-design routing.

- [x] T003 Check leaf-manifest generation for the hub plus nested `design-mcp-open-design` transport, and byte stability (`research/iterations/iteration-002.md`)
- [x] T004 Partition playbook scenarios into routing vs non-routing and test independent typed-gold derivation (`research/iterations/iteration-003.md`)
- [x] T005 Attribute the ~69 CONDITIONAL verdict to a measurement artifact or a real fault (`research/iterations/iteration-004.md`)
- [x] T006 Draft the dependency-ordered fix plan tied to each diagnosed failure mode (`research/iterations/iteration-005.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Fix-plan hardening: edge cases and implementability before handoff.

- [x] T007 Harden nested-transport attribution and dominant-mode narrowing edge cases (`research/iterations/iteration-007.md`)
- [x] T008 Verify manifest byte-stable reproducibility and implementability, then freeze the fix-plan contract (`research/iterations/iteration-008.md`)
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
- **Synthesis**: See `research/research.md` (canonical findings and fix plan, produced by the bound loop)
<!-- /ANCHOR:cross-refs -->

---
