---
title: "Tasks: Phase 1: Atomic State Serialize-Diff"
description: "Completed task ledger for the compare-before-write atomic state helper."
trigger_phrases:
  - "atomic-state-serialize-diff"
  - "write-only-on-change"
  - "atomic-state-dedup-write"
  - "state-diff-before-fsync"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/002-deep-loop-runtime/001-atomic-state-serialize-diff"
    last_updated_at: "2026-07-01T21:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold tasks with completed implementation ledger from spec.md"
    next_safe_action: "Use this task ledger as completion evidence for the shipped compare-before-write helper"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts"
    session_dedup:
      fingerprint: "sha256:001b6f8d0e2c4a7193d5f7a9b1c3e5d7f9a0b2c4d6e8f1a3b5c7d9e0f2a4b6c8"
      session_id: "scaffold-content-remediation-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: Atomic State Serialize-Diff

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

- [x] T001 Read the shipped phase spec and confirm the scope is limited to `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`.
- [x] T002 Identify the existing `writeStateAtomic` durability path that must remain intact.
- [x] T003 Confirm caller migration is out of scope for this phase and belongs in later task tracking.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `writeStateIfChangedAtomic(path, state, cache?)` to serialize incoming state and compare it against a canonical-path cache.
- [x] T005 Return `false` without calling the raw writer when the serialized state is unchanged.
- [x] T006 Delegate to `writeStateAtomic`, update the cache, and return `true` when the state is new or changed.
- [x] T007 Preserve the existing raw `writeStateAtomic` path and document the bypass/cache-staleness risk in JSDoc.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify first-call and changed-state scenarios perform a write and return `true`.
- [x] T009 Verify repeated identical state returns `false` and skips fsync+rename work.
- [x] T010 Confirm TypeScript callers remain compatible because the raw writer was not removed.
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
