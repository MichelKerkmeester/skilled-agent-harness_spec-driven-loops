---
title: "Tasks: 022/001 pluggable architecture"
description: "Tasks"
trigger_phrases: ["022/001 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/022-skill-advisor-embedder-parity/001-pluggable-architecture"
    last_updated_at: "2026-05-17T21:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored tasks"
    next_safe_action: "Execute T001"
    blockers: []
    key_files: ["mcp_server/lib/embedders/"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000022001"
      session_id: "022-001-pluggable-architecture-tasks"
      parent_session_id: "022-001-pluggable-architecture"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 022/001 pluggable architecture

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

- [ ] T001 Read 016 mk-spec-memory embedders/ as reference
- [ ] T002 Snapshot current skill-graph.sqlite schema for rollback
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create `mcp_server/lib/embedders/adapter.ts` (EmbedderAdapter interface)
- [ ] T004 Create `mcp_server/lib/embedders/types.ts` (BackendKind + EmbedderManifest)
- [ ] T005 Create `mcp_server/lib/embedders/registry.ts` (MANIFESTS + getAdapter)
- [ ] T006 [P] Create `mcp_server/lib/embedders/adapters/ollama.ts`
- [ ] T007 [P] Create `mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts`
- [ ] T008 Create `mcp_server/lib/embedders/schema.ts` (vec_metadata + ensureVecTableForDim)
- [ ] T009 Update `mcp_server/lib/skill-graph/skill-graph-db.ts` migration to include vec_metadata
- [ ] T010 Update `mcp_server/lib/scorer/lanes/semantic-shadow.ts` to use registry
- [ ] T011 [P] Author `tests/embedders/registry.vitest.ts`
- [ ] T012 [P] Author `tests/embedders/schema.vitest.ts`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 npm test in skill-advisor — full suite passes
- [ ] T014 Schema snapshot post-migration matches expected (vec_metadata present)
- [ ] T015 Strict-validate this packet
- [ ] T016 Commit + push
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

16 tasks `[x]`. Full test suite passes. Strict-validate PASSED.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Reference: `../../016-pluggable-embedder-architecture/004-mxbai-swap-and-008-closure/`
- Consumers: `../002-jina-swap-and-reindex/`, `../003-install-guide-docs/`
<!-- /ANCHOR:cross-refs -->
