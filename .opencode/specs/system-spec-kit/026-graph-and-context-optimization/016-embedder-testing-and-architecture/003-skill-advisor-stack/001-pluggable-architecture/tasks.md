---
title: "Tasks: 022/001 pluggable architecture"
description: "Tasks"
trigger_phrases: ["022/001 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/001-pluggable-architecture"
    last_updated_at: "2026-05-17T22:05:00Z"
    last_updated_by: "main_agent"
    recent_action: "Completed pluggable embedder architecture tasks"
    next_safe_action: "Resolve or waive full-suite drift before 001 commit"
    blockers: ["Full skill-advisor suite fails outside 001 scope: manual playbook inventory, corpus parity, graph health"]
    key_files: ["mcp_server/lib/embedders/"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000022001"
      session_id: "022-001-pluggable-architecture-tasks"
      parent_session_id: "022-001-pluggable-architecture"
    completion_pct: 90
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

- [x] T001 Read 016 mk-spec-memory embedders/ as reference
- [x] T002 Snapshot current skill-graph.sqlite schema for rollback
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Create `mcp_server/lib/embedders/adapter.ts` (EmbedderAdapter interface)
- [x] T004 Create `mcp_server/lib/embedders/types.ts` (BackendKind + EmbedderManifest)
- [x] T005 Create `mcp_server/lib/embedders/registry.ts` (MANIFESTS + getAdapter)
- [x] T006 [P] Create `mcp_server/lib/embedders/adapters/ollama.ts`
- [x] T007 [P] Create `mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts`
- [x] T008 Create `mcp_server/lib/embedders/schema.ts` (vec_metadata + ensureVecTableForDim)
- [x] T009 Update `mcp_server/lib/skill-graph/skill-graph-db.ts` migration to include vec_metadata
- [x] T010 Update `mcp_server/lib/scorer/lanes/semantic-shadow.ts` to use registry
- [x] T011 [P] Author `tests/embedders/registry.vitest.ts`
- [x] T012 [P] Author `tests/embedders/schema.vitest.ts`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [B] T013 npm test in skill-advisor — full suite passes (blocked by existing suite drift outside 001 write scope)
- [x] T014 Schema snapshot post-migration matches expected (vec_metadata present)
- [x] T015 Strict-validate this packet
- [ ] T016 Commit + push
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

15/16 tasks `[x]`; full-suite gate, commit, and push pending. Targeted embedder tests, build, and strict validation pass. Full suite runs under `vitest@4.0.18` but has corpus/playbook/graph-health drift outside the 001 write scope.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Reference: `../../016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/`
- Consumers: `../002-jina-swap-and-reindex/`, `../003-install-guide-docs/`
<!-- /ANCHOR:cross-refs -->
