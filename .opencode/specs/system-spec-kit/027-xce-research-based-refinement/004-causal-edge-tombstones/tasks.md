---
title: "Tasks: 027/004 Causal Edge Tombstones"
description: "Task list for tombstone-backed causal edge deletion and orphan cleanup."
trigger_phrases:
  - "027 phase 004 tasks"
  - "causal edge tombstone tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/027-xce-research-based-refinement/004-causal-edge-tombstones"
    last_updated_at: "2026-06-04T00:00:00Z"
    last_updated_by: "gpt-5-5"
    recent_action: "Replaced scaffold defaults with tombstone lifecycle tasks from continuation research."
    next_safe_action: "Execute delete-path inventory before schema edits."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-phase-004-research-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 027/004 Causal Edge Tombstones

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

- [ ] T001 Inventory all active causal-edge delete paths with exact symbols and SQL strings.
- [ ] T002 Confirm transaction boundaries for single delete, bulk delete, stale cleanup, manual unlink, and health auto-repair.
- [ ] T003 Identify existing graph/degree/related cache invalidation after edge deletes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add additive `causal_edge_tombstones` schema and lifecycle generation support.
- [ ] T005 Add active-edge snapshot helpers in causal edge storage.
- [ ] T006 Create a central sweep helper for tombstone-then-delete behavior.
- [ ] T007 Route single-memory delete through the sweep helper.
- [ ] T008 Route bulk memory delete through the sweep helper.
- [ ] T009 Route stale memory-index cleanup through the sweep helper.
- [ ] T010 Route manual causal unlink through the sweep helper.
- [ ] T011 Route health auto-repair orphan cleanup through the sweep helper.
- [ ] T012 Confirm CLI cleanup paths preserve the helper semantics.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Test single delete tombstones all incoming and outgoing edges.
- [ ] T014 Test bulk delete produces one tombstone per removed active edge.
- [ ] T015 Test manual unlink includes reason and restore metadata.
- [ ] T016 Test health auto-repair reports orphans before tombstoning/deleting them.
- [ ] T017 Test active graph reads are unchanged for non-delete queries.
- [ ] T018 Run focused causal graph tests.
- [ ] T019 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/027-xce-research-based-refinement/004-causal-edge-tombstones --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Every active causal-edge delete path either uses the sweep helper or is documented as non-deleting.
- [ ] Tombstones preserve enough metadata for retention-window diagnosis or restore planning.
- [ ] Phase 005 generated-edge promotion can safely rely on tombstone-backed cleanup.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research Evidence**: `../research/research.md` iterations 046 and 060
<!-- /ANCHOR:cross-refs -->
