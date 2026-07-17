---
title: "Tasks: sk-prompt Routing Research"
description: "Iteration and question workplan to be executed by the /deep:research loop bound to this packet, producing research/research.md."
trigger_phrases:
  - "sk-prompt routing research tasks"
  - "sk-prompt routing research iterations"
  - "prompt-models missing router map"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/019-sk-prompt-routing-research"
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
      session_id: "019-sk-prompt-routing-research-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-prompt Routing Research

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

Surface mapping: classify both modes against the typed-pair surface.

- [x] T001 Classify `prompt-improve` and `prompt-models` leaf sets into `(workflowMode, leafResourceId)` pairs (`research/iterations/iteration-001.md`)
- [x] T002 Confirm the six-leaf prompt-improve surface and reconcile the aggregate-100 hub report with the null child report (`research/iterations/iteration-004.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Typed-pair feasibility: what it takes to measure sk-prompt routing.

- [x] T003 Specify the missing `prompt-models` RESOURCE_MAP and verify each leaf resolves (`research/iterations/iteration-003.md`)
- [x] T004 Specify leaf-manifest generation and `--check` byte-stability as implementation acceptance gates (`research/iterations/iteration-002.md`)
- [x] T005 Partition the 32 playbook scenarios into routing vs non-routing (`research/iterations/iteration-005.md`)
- [x] T006 Draft the dependency-ordered fix plan tied to each diagnosed gap (`research/iterations/iteration-002.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Fix-plan hardening: edge cases and implementability before handoff.

- [x] T007 Harden the prompt-models lookup-vs-routing classification and dominant-mode narrowing edge cases (`research/iterations/iteration-003.md`, `iteration-005.md`)
- [x] T008 Define manifest byte-stable reproducibility and implementation gates, then freeze the fix-plan contract (`research/research.md` Sections 8-11)
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
