---
title: "Tasks: Phase 14: Coverage Graph Fuzzy Merge"
description: "Completed task ledger for query-only coverage graph near-duplicate discovery."
trigger_phrases:
  - "coverage-graph fuzzy merge"
  - "finding consolidation candidates"
  - "near-duplicate nodes"
  - "namespace alias memo"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/002-deep-loop-runtime/014-coverage-graph-fuzzy-merge"
    last_updated_at: "2026-07-01T21:46:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold tasks with completed fuzzy-merge query ledger from spec.md"
    next_safe_action: "Use this task ledger as completion evidence for the shipped query-only consolidation discovery"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts"
    session_dedup:
      fingerprint: "sha256:014b6f8d0e2c4a7193d5f7a9b1c3e5d7f9a0b2c4d6e8f1a3b5c7d9e0f2a4b6e1"
      session_id: "scaffold-content-remediation-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 14: Coverage Graph Fuzzy Merge

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

- [x] T001 Read the shipped phase spec and confirm `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts` is the only implementation file in scope.
- [x] T002 Confirm deterministic string similarity is available and no LLM calls are needed.
- [x] T003 Confirm row mutation and auto-merge are explicitly out of scope.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `findSimilarNodes(ns, { kind, name, threshold })`.
- [x] T005 Enforce category guard before any similarity check.
- [x] T006 Add bounded namespace alias memo support.
- [x] T007 Add `findConsolidationCandidates()` returning clusters and leftover nodes in one pass.
- [x] T008 Preserve query-only behavior with no DB writes or row mutation.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify identical names in different categories return an empty result set.
- [x] T010 Verify threshold 0.85 clusters seeded near-duplicate fixtures.
- [x] T011 Verify candidate discovery returns clusters plus leftovers.
- [x] T012 Verify DB row count and content are identical before and after both query functions.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the spec.md acceptance criteria.
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
