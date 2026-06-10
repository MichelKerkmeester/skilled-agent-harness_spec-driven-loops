---
title: "Tasks: Storage Adapter Ports (Five Divergence Seams) [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "015-storage-adapter-ports tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/015-storage-adapter-ports"
    last_updated_at: "2026-06-10T22:54:23Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Slice 2 VectorStore adapter tasks completed; slices 3-5 remain pending"
    next_safe_action: "Run the next per-port slice without broad call-site routing outside that slice"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-storage-adapter-ports"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Storage Adapter Ports (Five Divergence Seams)

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

- [x] T001 Planning decision row: phase-sized per-port slices vs promotion to standalone packet
- [ ] T002 Call-site inventory per port (vector/lexical/traversal/maintenance/contention) - vector inventory complete; remaining ports deferred to slices 3-5
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Port interface definitions + docs
- [ ] T004 Extract better-sqlite3 implementations (no-logic-edit rule) - VectorStore complete; Maintenance and ContentionPolicy deferred to slices 3-4
- [x] T005 Adopt 012 traversal helper and 014 packed engine as port impls
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Route call sites through ports in reviewable slices - VectorStore legacy export routed through the port; remaining routing deferred to slices 3-5
- [x] T007 Port contract tests + fakes
- [ ] T008 Before/after golden evals + full suites green; coupling grep recorded - Slice 2 vector/search/eval subset passed before and after; full phase gate deferred

### Deferred Slices

- [x] Slice 2: VectorStore better-sqlite3 adapter, legacy export routing, and contract coverage verified.
- [ ] Slice 3: route and verify the second production port slice.
- [ ] Slice 4: route and verify the third production port slice.
- [ ] Slice 5: finish remaining concrete implementations, routing, coupling grep, and full phase completion gates.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` - not yet; only Slice 1 foundation is complete
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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
