---
title: "Tasks: system-deep-loop Routing Research"
description: "Iteration and question workplan to be executed by the /deep:research loop bound to this packet, producing research/research.md."
trigger_phrases:
  - "system-deep-loop routing research tasks"
  - "system-deep-loop routing research iterations"
  - "deep-loop packet-qualified leaf paths"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research"
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
      session_id: "018-system-deep-loop-routing-research-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: system-deep-loop Routing Research

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

Surface mapping: classify the seven per-mode routers against the typed-pair surface.

- [ ] T001 Classify each per-mode router's leaf set into `(workflowMode, leafResourceId)` pairs across five children (`research/iterations/iteration-001.md`)
- [ ] T002 Confirm the ~71 baseline against a fresh router-mode run (`research/iterations/iteration-002.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Typed-pair feasibility: what it takes to measure system-deep-loop routing.

- [ ] T003 Enumerate the flat child-relative path collision set and propose a packet-qualification scheme (`research/iterations/iteration-003.md`)
- [ ] T004 Check leaf-manifest generation across five children and `--check` byte-stability (`research/iterations/iteration-004.md`)
- [ ] T005 Partition the ~319 playbook scenarios into routing vs non-routing (`research/iterations/iteration-005.md`)
- [ ] T006 Draft the dependency-ordered fix plan tied to each diagnosed failure mode (`research/iterations/iteration-006.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Fix-plan hardening: edge cases and implementability before handoff.

- [ ] T007 Harden the packet-qualification migration and dominant-mode narrowing edge cases (`research/iterations/iteration-007.md`)
- [ ] T008 Verify manifest byte-stable reproducibility across five children and implementability, then freeze the fix-plan contract (`research/iterations/iteration-008.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All five key research questions answered with file:line evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Synthesis**: See `research/research.md` (canonical findings and fix plan, produced by the bound loop)
<!-- /ANCHOR:cross-refs -->

---
