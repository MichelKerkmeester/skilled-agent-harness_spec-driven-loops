---
title: "Tasks: Phase 6: JSONL Lock-Held Merge"
description: "Completed task ledger for lock-held JSONL read-merge-write repair."
trigger_phrases:
  - "jsonl-lock-held-merge"
  - "jsonl-set-union-merge"
  - "fanout-lock-read-merge"
  - "jsonl-repair-dedup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/002-deep-loop-runtime/006-jsonl-lock-held-merge"
    last_updated_at: "2026-07-01T21:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold tasks with completed JSONL merge ledger from spec.md"
    next_safe_action: "Use this task ledger as completion evidence for the shipped JSONL repair merge path"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs"
    session_dedup:
      fingerprint: "sha256:006b6f8d0e2c4a7193d5f7a9b1c3e5d7f9a0b2c4d6e8f1a3b5c7d9e0f2a4b6d3"
      session_id: "scaffold-content-remediation-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: JSONL Lock-Held Merge

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

- [x] T001 Read the shipped phase spec and confirm `jsonl-repair.ts` and `fanout-salvage.cjs` are in scope.
- [x] T002 Define stable record identity as `(type, iteration, focus, id ?? event.id)`.
- [x] T003 Confirm registry recomputation is out of scope and remains with downstream reducers.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `mergeJsonlUnderLock(path, incomingRecords)` to `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts`.
- [x] T005 Implement reread-under-lock behavior before writing the merged JSONL.
- [x] T006 Implement set-union deduplication by stable record identity.
- [x] T007 Ensure the file lock is released on success and error paths.
- [x] T008 Wire `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs` to call `mergeJsonlUnderLock` instead of bare append.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify concurrent overlapping append scenarios produce exactly one copy per identity.
- [x] T010 Verify no unique incoming or existing records are lost during merge.
- [x] T011 Verify `jsonl-repair.ts` does not trigger registry recomputation.
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
