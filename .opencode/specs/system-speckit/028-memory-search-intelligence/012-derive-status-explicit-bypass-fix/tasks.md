---
title: "Tasks: Phase 12: derive-status-explicit-bypass-fix"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "derive status explicit bypass fix tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/012-derive-status-explicit-bypass-fix"
    last_updated_at: "2026-07-02T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks from plan.md"
    next_safe_action: "Execute T003"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-012-derive-status-bypass-20260702"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: derive-status-explicit-bypass-fix

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

- [ ] T001 Run the existing test suite touching graph-metadata-parser.ts/orchestrator.ts, capture baseline
- [ ] T002 Confirm the exact explicit-status branch line range and the pinned test asserting the bypass
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Route explicit `complete` status through the completion-evidence gate (graph-metadata-parser.ts:1185-1195)
- [ ] T004 Wire statusCompletionConsistencyEnforced into orchestrator.ts's resolveGeneratedMetadataIntegrity call (orchestrator.ts:563-568)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Fix the pinned test that currently asserts the old bypass (graph-metadata-schema.vitest.ts:510-520)
- [ ] T006 Add tests: explicit-status-without-evidence non-complete, explicit-status-with-evidence still-complete
- [ ] T007 Add orchestrator-level enforced-mode regression test (generated-metadata-integrity.vitest.ts)
- [ ] T008 (P2) Add direct parser edge-case tests: malformed/quoted completion_pct, comments-only tasks.md, whitespace-only implementation-summary.md, derive-only concurrency
- [ ] T009 Amend phase 010 spec.md REQ-001/REQ-002/REQ-005 wording
- [ ] T010 Run targeted suite fresh, confirm zero regressions
- [ ] T011 Update this phase's spec.md Status to Complete and write implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Fresh test suite run pasted as evidence, not cited from a prior run
- [ ] Phase 010 spec.md amendment applied
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../010-generated-metadata-status-integrity/review/review-report.md` (T2-P1-001, T2-P1-002, T2-P1-003, T2-P2-001)
<!-- /ANCHOR:cross-refs -->
