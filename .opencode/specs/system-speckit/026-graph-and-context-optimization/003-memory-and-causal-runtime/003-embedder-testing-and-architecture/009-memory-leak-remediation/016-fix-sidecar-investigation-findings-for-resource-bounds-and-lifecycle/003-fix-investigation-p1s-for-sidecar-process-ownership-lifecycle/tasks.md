---
title: "Tasks: Investigation P1 Fixes for Sidecar Process Ownership Lifecycle"
description: "Task ledger for selected lifecycle findings F79 and F88."
trigger_phrases:
  - "arc 010 lifecycle tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/003-fix-investigation-p1s-for-sidecar-process-ownership-lifecycle"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "created-lifecycle-task-ledger"
    next_safe_action: "start-F79"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100020030100020030100020030100020030100020030100020030100020030"
      session_id: "010-002-003-lifecycle"
      parent_session_id: null
    completion_pct: 0
---
# Tasks: Investigation P1 Fixes for Sidecar Process Ownership Lifecycle

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [ ] T000 Read registry rows for F79 and F88 plus target source files before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T001 Fix F79 in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:385-408`: simplify the dual-promise lifecycle into one termination state and remove the `sleep(0)` dependency if tests preserve behavior.
- [ ] T002 Fix F88 in `.opencode/bin/lib/ensure-rerank-sidecar.cjs:178-187`: make unknown liveness errors explicit, warning-backed, or fail-closed instead of silent default-alive reuse.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T003 Add targeted tests for termination concurrency and liveness classification.
- [ ] T004 Run targeted sidecar and ensure-helper tests.
- [ ] T005 Run strict validation for this child and the phase parent.
- [ ] T006 Fill `implementation-summary.md` with the final lifecycle contract and evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] F79 and F88 checklist rows are closed.
- [ ] Tests prove lifecycle and ownership invariants.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Research**: `../../001-deep-research-drift-and-simplification/research/research.md`
- **Registry**: `../../001-deep-research-drift-and-simplification/research/findings-registry.json`
<!-- /ANCHOR:cross-refs -->
