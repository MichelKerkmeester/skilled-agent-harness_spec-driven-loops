---
title: "Tasks: Magnific verification and closeout"
description: "Integrated structural, routing, live, paid-consent, and metadata reconciliation tasks."
trigger_phrases: ["magnific verification tasks", "magnific closeout tasks", "mcp-magnific smoke tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-magnific/007-verification-and-closeout"
    last_updated_at: "2026-08-02T13:36:52Z"
    last_updated_by: "spec-author"
    recent_action: "Define closeout task sequence"
    next_safe_action: "Wait for prior phases"
    blockers: ["Phases 1 through 6 incomplete"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: {fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "014-mcp-magnific-007", parent_session_id: null}
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Magnific verification and closeout

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (artifact)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm Phases 1–6 evidence and capture baseline gate results
- [ ] T002 Confirm Magnific auth and no-cost live-test availability
- [ ] T003 [P] Obtain explicit paid-smoke consent and budget or record deferral
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Run recursive strict packet validation and package/hub structure checks
- [ ] T005 Run JSON, route, manifest, compiled freshness, advisor recall, and link checks
- [ ] T006 Run authenticated discovery and confirmed no-cost balance/history/browse test
- [ ] T007 Run one bounded paid generation/transformation only after consent; verify output and cleanup
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Route failures to owning phases and rerun the whole gate
- [ ] T009 Reconcile all child and parent statuses, tasks, summaries, descriptions, and graphs
- [ ] T010 Run final recursive strict validation and write closeout evidence
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks marked `[x]`
- [ ] Paid smoke passed with consent or is explicitly unproven
- [ ] No metadata surface contradicts the final evidence
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
