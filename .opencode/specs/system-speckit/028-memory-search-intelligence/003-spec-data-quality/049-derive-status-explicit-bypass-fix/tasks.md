---
title: "Tasks: Phase 12: derive-status-explicit-bypass-fix"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "derive status explicit bypass fix tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/049-derive-status-explicit-bypass-fix"
    last_updated_at: "2026-07-04T17:11:49.896Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All 11 tasks complete and evidenced"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-012-derive-status-bypass-20260702"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Run the existing test suite touching graph-metadata-parser.ts/orchestrator.ts, capture baseline - 9 files, 108 tests passing (phase 010's baseline)
- [x] T002 Confirm the exact explicit-status branch line range and the pinned test asserting the bypass - confirmed graph-metadata-parser.ts:1192-1198, test at graph-metadata-schema.vitest.ts:510-521
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Route explicit `complete` status through the completion-evidence gate (graph-metadata-parser.ts:1192-1198)
- [x] T004 Wire statusCompletionConsistencyEnforced into orchestrator.ts's resolveGeneratedMetadataIntegrity call (orchestrator.ts:563-569)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Fix the pinned test that currently asserts the old bypass (graph-metadata-schema.vitest.ts) - split into 2 tests: without-evidence (non-complete) and with-evidence (still complete); also fixed the canonical happy-path fixture that relied on the same bypass
- [x] T006 Add tests: explicit-status-without-evidence non-complete, explicit-status-with-evidence still-complete - done as part of T005's split
- [x] T007 Add orchestrator-level enforced-mode regression test (generated-metadata-integrity.vitest.ts) - 2 new tests added, exercising validateFolder() directly (enforced + default report-mode)
- [x] T008 (P2) Add direct parser edge-case tests: malformed/quoted completion_pct, comments-only tasks.md, whitespace-only implementation-summary.md, derive-only concurrency - 5 new tests added
- [x] T009 Amend phase 010 spec.md REQ-001/REQ-002/REQ-005 wording
- [x] T010 Run targeted suite fresh, confirm zero regressions - 9 files, 119 tests passing (108 baseline + 11 new); mcp_server TypeScript build clean
- [x] T011 Update this phase's spec.md Status to Complete and write implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Fresh test suite run pasted as evidence, not cited from a prior run
- [x] Phase 010 spec.md amendment applied
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../047-generated-metadata-status-integrity/review/review-report.md` (T2-P1-001, T2-P1-002, T2-P1-003, T2-P2-001)
<!-- /ANCHOR:cross-refs -->
