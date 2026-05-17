---
title: "Tasks: 021/001 skill mds audit"
description: "Task checklist"
trigger_phrases: ["021/001 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/021-skill-docs-alignment/001-skill-mds-audit"
    last_updated_at: "2026-05-17T20:40:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored tasks"
    next_safe_action: "Execute T001"
    blockers: []
    key_files:
      - "evidence/skill-docs-audit.csv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000021001"
      session_id: "021-001-skill-mds-audit-tasks"
      parent_session_id: "021-001-skill-mds-audit"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 021/001 skill mds audit

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Author Explore-agent dispatch prompt with scope + severity rubric
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Dispatch Explore agent (background, parallel with 002 + 003)
- [ ] T003 Receive + spot-check agent output
- [ ] T004 Apply P0/P1 fixes inline
- [ ] T005 Log P2/P3 backlog
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Re-grep stale strings; expect 0 hits in audited surface
- [ ] T007 Strict-validate this packet
- [ ] T008 Commit + push
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All 8 tasks marked `[x]`. P0/P1 zero remaining. Strict-validate PASSED.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Sibling consumers: `../002-root-readme-update/`, `../003-embedder-pluggability-narrative/`
<!-- /ANCHOR:cross-refs -->
