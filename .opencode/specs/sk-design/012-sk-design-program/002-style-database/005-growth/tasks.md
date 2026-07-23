---
title: "Tasks: Growth Architecture (10x-100x Scale)"
description: "Task breakdown for Roadmap Phase 3 of the sk-design styles-database evolution, distributed across setup, implementation, and verification buckets. All tasks are PLANNED; none are executed in this packet."
trigger_phrases:
  - "growth architecture styles database 10x 100x scale"
  - "eligible-id sql parameter limit hnsw ann"
  - "approximate search contract exact fallback rust"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/005-growth"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author 004-growth Level 2 spec-folder docs"
    next_safe_action: "Await measured 10x-100x corpus-growth pressure before starting Phase A (SQL-parameter"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/lib/database/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/lib/database/vectors.mjs"
      - ".opencode/specs/sk-design/012-sk-design-program/002-style-database/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Growth Architecture (10x-100x Scale)

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### Description [Roadmap Phase: P3 | REQ: REQ-NNN | STATUS: PLANNED]`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm measured 10x-100x growth pressure, else this phase does not trigger [Roadmap Phase: P3 | REQ: REQ-006 | STATUS: PLANNED]
- [ ] T002 Characterize the eligible-ID parameter shape at ~25.4% eligibility vs. the 32,766-variable limit [Roadmap Phase: P3 | REQ: REQ-001 | STATUS: PLANNED]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Fix the eligible-ID SQL-parameter shape, correctness before ANN [Roadmap Phase: P3 | REQ: REQ-001 | STATUS: PLANNED]
- [ ] T004 Maintain HNSW/ANN with filter-aware recall under the approximation contract, exact re-score + exact fallback, separately versioned [Roadmap Phase: P3 | REQ: REQ-002, REQ-003 | STATUS: PLANNED]
- [ ] T005 Custom Rust ANN, last resort, proven gap only [Roadmap Phase: P3 | REQ: REQ-004 | STATUS: PLANNED]
- [ ] T006 Shared cross-skill Rust core, gated on a spec-memory second consumer [Roadmap Phase: P3 | REQ: REQ-005 | STATUS: PLANNED]

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify the SQL-param fix precedes ANN AND the two "25%" figures are disambiguated [Roadmap Phase: P3 | REQ: REQ-001 | STATUS: PLANNED]
- [ ] T008 Verify the approximation contract: recall + exact re-score + exact fallback; no silent exact-path swap [Roadmap Phase: P3 | REQ: REQ-003 | STATUS: PLANNED]

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (deferred until the growth gate opens and Phase 3 work is executed)
- [ ] No `[B]` blocked tasks remaining
- [ ] Growth entry gate (measured 10x-100x pressure) confirmed before any task begins

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->
