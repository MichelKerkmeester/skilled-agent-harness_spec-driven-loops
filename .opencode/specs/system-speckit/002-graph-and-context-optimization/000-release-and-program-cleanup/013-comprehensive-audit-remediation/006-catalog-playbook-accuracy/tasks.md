---
title: "Tasks: Phase 6: catalog-playbook-accuracy"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "catalog playbook tasks"
  - "F-catalog-playbook tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/006-catalog-playbook-accuracy"
    last_updated_at: "2026-06-04T20:45:44Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Fill tasks.md with real content"
    next_safe_action: "implement fixes in sequence F1 through F10"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "subagent-F-catalog-playbook-implement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: catalog-playbook-accuracy

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

- [x] T001 F1+F7: Replace universal coverage claims + qualify cleanup-complete claim (feature_catalog.md lines 3946, 3950)
- [x] T002 F7: Qualify cleanup-complete claim in leaf file (feature-catalog-code-references.md line 30)
- [x] T003 F6: Fix stale implementation paths in local-LLM category overview (category-overview.md lines 40-47)
- [x] T004 [P] F2: Replace all 5 occurrences of 36-tool with 37-tool (README.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 F2: Change toBe(36) to toBe(37) in test file (mcp_server/tests/review-fixes.vitest.ts line 117)
- [x] T006 F3: Update release gate threshold 380 -> 384 and date (manual_testing_playbook.md lines 166, 173)
- [x] T007 F5: Fix garbled expected-signals fragment at root playbook line 2692 (manual_testing_playbook.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P] F4: Fix broken catalog link in scenario 019 (mutation/019-*.md)
- [x] T009 [P] F4: Fix broken catalog link in scenario 006-hybrid (retrieval/006-*.md)
- [x] T010 [P] F4: Fix broken catalog link in scenario 007-4-stage (retrieval/007-*.md)
- [x] T011 [P] F4: Fix broken catalog link in scenario 170 (stress-testing/170-*.md)
- [x] T012 [P] F4: Fix broken catalog link in scenario 036 (maintenance/036-*.md)
- [x] T013 F5: Fix garbled Real user request + Expected signals in scenario 232 (feature-catalog-annotation-name-validity.md lines 18, 21)
- [x] T014 F9: Update scenario numbers 401-415 -> 361-375 in playbook 24 README
- [x] T015 F9: Update scenario range in category-overview.md line 47
- [x] T016 F8: Fix verifier path in scenario 234 line 38 (module-header-compliance-via-verify-alignment-drift-py.md)
- [x] T017 F10: Fix stale session_bootstrap call in scenario 032 line 37
- [x] T018 F10: Fix stale memory_ingest_start call in catalog 253 line 28
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] grep/ls verification passed for each finding
- [x] validate.sh --strict passes with Errors: 0
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
