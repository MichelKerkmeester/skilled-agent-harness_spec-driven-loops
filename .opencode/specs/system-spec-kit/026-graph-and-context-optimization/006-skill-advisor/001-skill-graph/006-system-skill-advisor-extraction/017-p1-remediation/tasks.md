---
title: "Tasks: 10-iter P1 remediation"
description: "Task ledger for R-004 and S-004 remediation."
trigger_phrases:
  - "013/009/017 tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/017-p1-remediation"
    last_updated_at: "2026-05-15T06:09:08Z"
    last_updated_by: "codex"
    recent_action: "P1 tasks implemented"
    next_safe_action: "Strict-validate packet and commit"
    blockers: []
    completion_pct: 100
---
# Tasks: 10-iter P1 remediation

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

- [x] T001 Read `review-report.md`, iter-001 through iter-010, and `deep-review-state.jsonl`.
- [x] T002 Verify R-004 launcher lockdir behavior against current HEAD.
- [x] T003 Verify S-004 shadow sink env path behavior against current HEAD.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add stale lockdir removal before lock wait timeout.
- [x] T005 Make launcher artifact readiness source-mtime aware.
- [x] T006 Bound env-var shadow sink paths to workspace root.
- [x] T007 Add Vitest regression coverage for all three behaviors.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run full advisor Vitest.
- [x] T009 Run launcher syntax check.
- [x] T010 Run advisor TypeScript typecheck.
- [x] T011 Run strict validation for 017 and parent 013/009.
- [x] T012 Prepare scoped 017 commit contents.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks completed.
- [x] Strict validation recorded.
- [x] No public ids renamed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
