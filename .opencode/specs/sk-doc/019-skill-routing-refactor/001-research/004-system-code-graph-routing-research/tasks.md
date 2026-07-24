---
title: "Tasks: system-code-graph Routing Research"
description: "Iteration and question workplan to be executed by the /deep:research loop bound to this packet, producing research/research.md."
trigger_phrases:
  - "system-code-graph routing research tasks"
  - "system-code-graph routing research iterations"
  - "code-graph intent signals routing"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/017-system-code-graph-routing-research"
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
      session_id: "017-system-code-graph-routing-research-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: system-code-graph Routing Research

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

Surface mapping: classify the embedded routing pseudocode and test enumerability.

- [x] T001 Classify `INTENT_SIGNALS` + `RESOURCE_DOMAINS` into `(workflowMode, leafResourceId)` pairs (`research/iterations/iteration-001.md`)
- [x] T002 Determine whether the prefix/stem resource targets enumerate into a discrete, resolvable leaf set (`research/iterations/iteration-002.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Measurement feasibility: what it takes to score system-code-graph routing.

- [x] T003 Verdict on leaf-manifest generation given the enumerability result (`research/iterations/iteration-003.md`)
- [x] T004 Propose the first benchmark baseline procedure for a single-mode skill (`research/iterations/iteration-004.md`)
- [x] T005 Partition the 28 playbook scenarios into routing vs non-routing (`research/iterations/iteration-005.md`)
- [x] T006 Draft the dependency-ordered fix plan tied to each diagnosed gap (`research/iterations/iteration-006.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Fix-plan hardening: edge cases and implementability before handoff.

- [x] T007 Harden glob-enumeration ambiguity and single-mode degeneracy edge cases (`research/iterations/iteration-007.md`)
- [x] T008 Verify baseline reproducibility and implementability, then freeze the fix-plan contract (`research/iterations/iteration-008.md`)
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
