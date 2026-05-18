---
title: "Tasks: 022/003"
description: "Tasks"
trigger_phrases: ["022/003 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/003-install-guide-docs"
    last_updated_at: "2026-05-17T21:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored tasks"
    next_safe_action: "T001 after 022/001+002"
    blockers: ["depends on 022/001+002"]
    key_files: ["INSTALL_GUIDE.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000022003"
      session_id: "022-003-install-guide-docs-tasks"
      parent_session_id: "022-003-install-guide-docs"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 022/003

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

- [ ] T001 [B] Verify 022/001+002 shipped
- [ ] T002 Author markdown agent dispatch prompt with scope + current state
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Dispatch markdown agent (background)
- [ ] T004 Review diff for surgical accuracy
- [ ] T005 Hand-fix any over-rewrites
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Link-check resolves
- [ ] T007 Strict-validate this packet
- [ ] T008 Commit + push
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

8 tasks `[x]`. No stale defaults. Strict-validate PASSED.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Source: `../001-pluggable-architecture/` (MANIFESTS content)
- Cross-links: `../002-jina-swap-and-reindex/evidence/swap-runbook.md`, `../../021-skill-docs-alignment/003-embedder-pluggability-narrative/`
<!-- /ANCHOR:cross-refs -->
