---
title: "Tasks: Storage Adapter Ports (Five Divergence Seams)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "015-storage-adapter-ports tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/003-storage-adapter-ports"
    last_updated_at: "2026-06-11T00:43:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Slice 5 final conservative routing completed and verified"
    next_safe_action: "No remaining 015 implementation work; preserve justified coupling exceptions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-storage-adapter-ports"
      parent_session_id: null
    completion_pct: 100
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
- [x] T002 Call-site inventory per port (vector/lexical/traversal/maintenance/contention) - final coupling grep recorded with justified lexical/vector exceptions
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Port interface definitions + docs
- [x] T004 Extract better-sqlite3 implementations (no-logic-edit rule) - VectorStore, Maintenance, and ContentionPolicy complete
- [x] T005 Adopt 012 traversal helper and 014 packed engine as port impls
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Route call sites through ports in reviewable slices - final conservative traversal and maintenance routing complete; fragile lexical combining left unchanged
- [x] T007 Port contract tests + fakes
- [x] T008 Before/after golden evals + full suites green; coupling grep recorded - targeted and golden/eval gates passed; broad-suite unrelated failures recorded in implementation-summary.md

### Deferred Slices

- [x] Slice 2: VectorStore better-sqlite3 adapter, legacy export routing, and contract coverage verified.
- [x] Slice 3: route and verify the Maintenance production port slice.
- [x] Slice 4: route and verify the ContentionPolicy production port slice.
- [x] Slice 5: finish remaining concrete implementations, routing, coupling grep, and full phase completion gates.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed - see implementation-summary.md verification table
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
