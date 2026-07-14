---
title: "Tasks: model-profiles-and-benchmark-merge"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "benchmark merge tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/011-model-profiles-and-benchmark-merge"
    last_updated_at: "2026-06-03T09:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 011 task list"
    next_safe_action: "Validate then commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: model-profiles-and-benchmark-merge

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

- [x] T001 Confirm rename mapping (113-003→001 … 127-006→006) + git state; read 005 + 006 synthesis
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Merge 006 eval → 005/eval/strict-validation/; 005 eval → 005/eval/capability-discrimination/; remove 006 (benchmarks/005-*)
- [x] T003 Author merged top-level synthesis (benchmarks/005-*/synthesis.md)
- [x] T004 Repoint ~40 stale benchmark citations to `benchmark 00N` (delegated, verified) (profiles, _index, pattern-index, model-profiles.json)
- [x] T005 model-profiles.json comment-hygiene + benchmark-id refresh (assets/model-profiles.json)
- [x] T006 Scrub pattern-index ephemeral spec-phase refs (Phase NNN column → Status; 114 arc; deleted-phase line; spec links) (references/pattern-index.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 JSON valid; merge structure correct; 006 removed; guard green
- [x] T008 No stale benchmark/phase ids in active hub docs
- [ ] T009 Stage rename (git add -A benchmarks/); validate --strict exit 0; changelog v0.7.1.0; commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Merge + repoint + JSON hygiene done
- [ ] validate --strict exit 0 + committed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Merged benchmark**: `benchmarks/005-mimo-minimax-capability-discrimination/`
<!-- /ANCHOR:cross-refs -->
