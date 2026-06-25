---
title: "Tasks: Phase 2: architecture-decision [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-design decision tasks"
  - "architecture decision tasks"
  - "lock taxonomy tasks"
  - "design migration order tasks"
  - "tasks core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/002-architecture-decision"
    last_updated_at: "2026-06-25T12:41:14Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the decision-locking steps as completed"
    next_safe_action: "Hand off to 003-scaffold-parent to scaffold the umbrella skill and registry"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "../001-corpus-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skilled-agent-orchestration/154-sk-design-parent/002-architecture-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Foundations grain (color/layout split) deferred to 005"
      - "Optional sk-design-output child revisit deferred"
    answered_questions:
      - "Structural model: umbrella-router over a sibling family"
      - "Taxonomy: 5 core children, output deferred"
      - "Naming/compat: keep flat sk-design-* names, preserve legacy triggers"
      - "Migration order: 003 scaffold, 004 onboard, 005 build, 006 integrate"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: architecture-decision

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Extract the structural-model and taxonomy recommendation from the synthesis (`../001-corpus-research/research/research.md`)
- [x] T002 Confirm the operator's locked calls against the research recommendation (spec.md)
- [x] T003 [P] Confirm this is a documentation-only decision phase, no build (plan.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Confirm and record the structural model: umbrella-router over a sibling family, hub only inside the interface child (spec.md, plan.md)
- [x] T005 Lock the taxonomy: 5 core children (interface, spec, foundations, motion, audit) with output deferred (spec.md)
- [x] T006 Lock the naming and backward-compat policy: keep flat names, preserve legacy triggers, interface references resolve unchanged (spec.md)
- [x] T007 Lock the migration order: 003 scaffold -> 004 onboard -> 005 build -> 006 integrate (spec.md, plan.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Record the decision in this phase's docs, including the rejected hub alternative and consequences (spec.md, plan.md, implementation-summary.md)
- [x] T009 Confirm deferred open questions (foundations grain, output child) are captured, not dropped (spec.md)
- [x] T010 Update documentation across spec/plan/tasks/implementation-summary (this folder)
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

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
