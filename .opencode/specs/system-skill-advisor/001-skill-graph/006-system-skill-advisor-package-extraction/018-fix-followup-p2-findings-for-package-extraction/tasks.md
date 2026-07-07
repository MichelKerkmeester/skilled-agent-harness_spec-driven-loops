---
title: "Tasks: 10-iter P2 cleanup"
description: "Task ledger for 28 P2 audit buckets and remediation."
trigger_phrases:
  - "013/009/018 tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/018-fix-followup-p2-findings-for-package-extraction"
    last_updated_at: "2026-05-15T06:09:08Z"
    last_updated_by: "codex"
    recent_action: "P2 tasks implemented"
    next_safe_action: "Strict-validate packet and commit"
    blockers: []
    completion_pct: 100
---
# Tasks: 10-iter P2 cleanup

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read review report, all iter files, and state file.
- [x] T002 Verify all 28 P2 findings against current HEAD.
- [x] T003 Assign each finding to STILL_OPEN, NOT_APPLICABLE, or NEEDS_NEW_PACKET.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Consolidate tool dispatch registration.
- [x] T005 Normalize shared import and advisor-local fixture ownership.
- [x] T006 Add test coverage for all eight dispatch routes and runtime env parity.
- [x] T007 Improve artifact freshness, fatal cleanup, chokidar diagnostics, SQLite error reporting, scorer indexing, and watcher env tuning.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run full advisor Vitest.
- [x] T009 Run advisor typecheck.
- [x] T010 Parse runtime JSON configs.
- [x] T011 Run strict validation for 018 and parent 013/009.
- [x] T012 Prepare scoped 018 commit contents.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 28 P2 findings accounted for.
- [x] Closure/not-applicable rate reaches 21/28.
- [x] Named follow-ons documented.
- [x] Strict validation recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
