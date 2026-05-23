---
title: "Tasks: Test-Only Barrel Export Cleanup for F44 and F109"
description: "Task list for closing F44 and F109 with direct test imports, barrel export deletion, and verification."
trigger_phrases:
  - "020 001 tasks"
  - "F44 F109 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/001-fix-deferred-p2s-for-test-only-and-shared-exports"
    last_updated_at: "2026-05-23T10:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed"
    next_safe_action: "Parent agent may commit packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0200010200010200010200010200010200010200010200010200010200010200"
      session_id: "020-001-f44-f109-barrel-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Test-Only Barrel Export Cleanup for F44 and F109

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

- [x] T001 Scaffold Level 2 packet docs (`<this-folder>/`)
- [x] T002 Strict-validate scaffold before source edits (`validate.sh`)
- [x] T003 Read parent spec, predecessor checklist, source files, and test consumers
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Group `listSupportedDimensions` consumers as test-only or live source
- [x] T005 Group `EmbedderManifest` consumers as test-only or live source
- [x] T006 Refactor test imports to direct source modules
- [x] T007 Run typecheck after test import refactor
- [x] T008 Remove `listSupportedDimensions` and `EmbedderManifest` from the barrel
- [x] T009 Run typecheck after barrel deletion
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run full embedders vitest suite
- [x] T011 Run final mcp-server typecheck
- [x] T012 Fill checklist, decision record, implementation summary, and handoff
- [x] T013 Run final strict spec validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Requested verification commands exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Scope**: See `../spec.md`
- **Predecessor Deferral**: See `../../017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep/checklist.md`
<!-- /ANCHOR:cross-refs -->
