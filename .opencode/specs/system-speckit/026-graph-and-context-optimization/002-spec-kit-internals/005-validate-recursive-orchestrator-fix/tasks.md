---
title: "Tasks: Fix validate.sh --recursive orchestrator-path silent no-op so phase children are validated"
description: "Task breakdown for reworking run_node_orchestrator to recurse over phase children on the orchestrator path."
trigger_phrases:
  - "validate recursive orchestrator tasks"
  - "run_node_orchestrator task list"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/005-validate-recursive-orchestrator-fix"
    last_updated_at: "2026-05-29T11:47:40Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed all implementation and verification tasks"
    next_safe_action: "Reconcile completion metadata across packet docs"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/032-validate-recursive-orchestrator-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fix validate.sh --recursive orchestrator-path silent no-op so phase children are validated

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read run_node_orchestrator, main, has_phase_children, run_recursive_validation (validate.sh)
- [x] T002 Confirm exit $? precedes main's recursive block (validate.sh)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Resolve orchestrator base once into base=(), keep return-1 fallback when neither JS nor tsx is available (validate.sh)
- [x] T005 Build the shared flag set once into flags=() (validate.sh)
- [x] T006 Validate parent with base + flags, capture rc (validate.sh)
- [x] T007 Under $RECURSIVE, enumerate NNN-* children, skip non-dirs and children lacking both spec.md and description.json, aggregate worst rc, single final exit (validate.sh)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 bash -n validate.sh passes
- [x] T009 Confirm non-recursive path byte-identical and review child-skip edge cases against the diff
- [x] T010 validate.sh --strict on this packet PASSED, packet docs synchronized
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

