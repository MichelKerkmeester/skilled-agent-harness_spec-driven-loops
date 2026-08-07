---
title: "Tasks: Phase 5: Lifecycle Taxonomy Guards"
description: "Completed task ledger for the lifecycle taxonomy, transition map, and paused-wait gate contract."
trigger_phrases:
  - "lifecycle-taxonomy-guards"
  - "loop-state-machine-taxonomy"
  - "lifecycle-transition-guards"
  - "loop-status-contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/002-deep-loop-runtime/005-lifecycle-taxonomy-guards"
    last_updated_at: "2026-07-01T21:28:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold tasks with completed lifecycle-taxonomy ledger from spec.md"
    next_safe_action: "Use this task ledger as completion evidence for the shipped lifecycle taxonomy contract"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs"
    session_dedup:
      fingerprint: "sha256:005b6f8d0e2c4a7193d5f7a9b1c3e5d7f9a0b2c4d6e8f1a3b5c7d9e0f2a4b6d2"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: Lifecycle Taxonomy Guards

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

- [x] T001 Read the shipped phase spec and confirm `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs` is the only file in scope.
- [x] T002 Identify required active statuses: `running`, `waiting`, `paused`, `idle`, and `stopped`.
- [x] T003 Confirm runtime enforcement and caller migration are out of scope for this contract-definition phase.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Export `LoopActiveStatus` taxonomy from `lifecycle-taxonomy.cjs`.
- [x] T005 Export `LoopStopReason` terminal reason taxonomy.
- [x] T006 Encode `LEGAL_TRANSITIONS` for every active source status.
- [x] T007 Export and document the one-shot `resumeResolve` paused-wait gate contract.
- [x] T008 Preserve backward-compatible exports so existing string-literal callers continue to compile.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify `LEGAL_TRANSITIONS` covers all five active statuses.
- [x] T010 Verify illegal transitions such as `stopped -> running` are absent.
- [x] T011 Verify taxonomy exports are importable and existing callers remain compatible.
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
