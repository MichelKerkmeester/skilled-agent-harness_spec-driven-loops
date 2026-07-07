---
title: "Tasks: 022/002"
description: "Tasks"
trigger_phrases: ["022/002 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/007-skill-advisor-embedder-stack/002-jina-swap-and-reindex"
    last_updated_at: "2026-05-17T21:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored tasks"
    next_safe_action: "T001 after 022/001"
    blockers: ["depends on 022/001"]
    key_files: ["evidence/swap-runbook.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000022002"
      session_id: "022-002-jina-swap-and-reindex-tasks"
      parent_session_id: "022-002-jina-swap-and-reindex"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 022/002

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

- [ ] T001 [B] Verify 022/001 shipped + pluggable layer wired
- [ ] T002 Snapshot skill-graph.sqlite for rollback
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Stop skill-advisor daemon (operator action documented)
- [ ] T004 Call `setActiveEmbedder('jina-embeddings-v3')` via test harness or one-shot script
- [ ] T005 Run reindex script; capture wall-clock + row count
- [ ] T006 Restart daemon
- [ ] T007 Smoke-test 5 `recommend` queries with expected top-3 baseline
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 vitest regression suite passes
- [ ] T009 Write `evidence/swap-runbook.md`
- [ ] T010 Strict-validate this packet
- [ ] T011 Commit + push
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

11 tasks `[x]`. Active embedder = jina-v3. Strict-validate PASSED.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Dependency: `../001-pluggable-architecture/`
- Consumer: `../003-install-guide-docs/`
<!-- /ANCHOR:cross-refs -->
