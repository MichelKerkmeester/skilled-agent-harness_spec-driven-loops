---
title: "Tasks: Lease Canonicalization and Cleanup Ordering"
description: "Task ledger for Phase 006 council remediation."
trigger_phrases:
  - "012/006 tasks"
  - "lease canonicalization tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/012-mcp-launcher-concurrency-arc/006-lease-canonicalization-and-cleanup-ordering"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored task ledger"
    next_safe_action: "Record final verification evidence"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
---
# Tasks: Lease Canonicalization and Cleanup Ordering

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read council report and scoped target files.
- [x] T002 Add realpath canonicalization to skill-advisor daemon lease.
- [x] T003 Add realpath canonicalization to all three launchers.
- [x] T004 Add current-plus-legacy lease probe behavior.
- [x] T005 Clear lease files before child signal mirroring.
- [x] T006 Tighten lease artifact permissions where in scope.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Add skill-advisor symlink-alias launcher test.
- [x] T008 Add legacy lease probe tests for all three launchers.
- [x] T009 Add SIGKILL-backstop cleanup tests for all three launchers.
- [x] T010 Namespace REQ anchors across launcher tests.
- [x] T011 Replace DB pragma static assertions with runtime rebuild-path coverage plus one static wiring check.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Reconcile 005 task contradiction.
- [x] T013 Split parent invariant into inline PID-file and daemon SQLite lease models.
- [x] T014 Replace stale pending text in 002 checklist.
- [x] T015 Update skill-advisor daemon lease reference contract.
- [x] T016 Generate `description.json` and `graph-metadata.json`.
- [x] T017 Run 006 strict validate.
- [x] T018 Run arc parent strict validate.
- [x] T019 Run skill-advisor typecheck.
- [x] T020 Run skill-advisor focused Vitest.
- [x] T021 Run code-graph launcher Vitest. Evidence: exact command hit Vite config temp-file EPERM; same suite passed with `--configLoader runner`.
- [x] T022 Run spec-kit launcher Vitest.
- [ ] T023 [B] Stage explicit paths and commit once on main. Blocked: sandbox cannot create `.git/index.lock`; `git add` exits 128 before staging. The exact explicit path list is recorded in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [x] Verification evidence copied into `checklist.md` and `implementation-summary.md`.
- [x] Commit hygiene handoff evidence recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Council report**: `../005-lease-correctness-and-arc-traceability/ai-council/council-review.md`
<!-- /ANCHOR:cross-refs -->
