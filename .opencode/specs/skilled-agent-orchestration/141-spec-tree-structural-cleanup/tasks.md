---
title: "Tasks: Spec-tree structural cleanup"
description: "Audit, rename the duplicates, restructure the conformant phase parents, and verify each with strict validation."
trigger_phrases:
  - "spec tree cleanup tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/141-spec-tree-structural-cleanup"
    last_updated_at: "2026-06-08T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000141"
      session_id: "spec-141-spec-tree-structural-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Spec-tree structural cleanup

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

- [x] T001 Run the deterministic audit over active spec folders (`/tmp/spec-audit.py`)
- [x] T002 Cross-check the audit with an independent gpt-5.5-fast pass
- [x] T003 [P] Inspect each candidate's phase conformance before acting
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rename `029-post-027-findings-remediation` -> `030-` (Rule A)
- [x] T005 Rename `016-cross-session-kill-scoping` -> `029-` (Rule A)
- [x] T006 Restructure `014-infra-memory-db-and-graph-churn` (Rule B)
- [x] T007 Restructure `001-search-intelligence-stress-playbook` (Rule B)
- [x] T008 Restructure `011-source-bug-and-misalignment-audit` and `008-real-world-usefulness-test-planning` (Rule B)
- [x] T009 Revert `012-comprehensive-deep-review-audit` (non-conformant phases)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 `validate.sh --strict` on each parent and phase
- [x] T011 Verify identity and parent manifests resolve to new paths
- [x] T012 Commit each packet scoped; verify no foreign-file leak
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Strict validation passed on all restructured packets
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
