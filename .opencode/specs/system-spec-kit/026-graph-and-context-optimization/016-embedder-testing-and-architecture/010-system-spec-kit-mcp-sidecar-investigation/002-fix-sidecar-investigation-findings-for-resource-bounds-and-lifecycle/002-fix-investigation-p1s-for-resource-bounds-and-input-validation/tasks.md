---
title: "Tasks: Investigation P1 Fixes for Resource Bounds and Input Validation"
description: "Task ledger for selected P1 resource-bound findings F48, F85, F86, and F87."
trigger_phrases:
  - "arc 010 resource bounds tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/002-fix-investigation-p1s-for-resource-bounds-and-input-validation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "created-resource-bound-task-ledger"
    next_safe_action: "start-F48"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100020020100020020100020020100020020100020020100020020100020020"
      session_id: "010-002-002-resource-bounds"
      parent_session_id: null
    completion_pct: 0
---
# Tasks: Investigation P1 Fixes for Resource Bounds and Input Validation

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

- [ ] T000 Read registry rows for F48, F85, F86, and F87 plus target source files before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T001 Fix F48 in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:214,443-444`: use cryptographically random request IDs, or a random prefix plus sequence if debugging requires order.
- [ ] T002 Fix F85 in `.opencode/bin/lib/ensure-rerank-sidecar.cjs:36-49`: add a maximum health body size, suggested cap 64KB unless parity chooses 8192 bytes.
- [ ] T003 Fix F86 in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:238-270,433-473`: add max embed batch size, suggested cap 500 texts.
- [ ] T004 Fix F87 in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:105-132,151-175`: mirror the client max input length in `parseRequest`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Add targeted tests for all four selected P1 contracts.
- [ ] T006 Run targeted sidecar and ensure-helper tests.
- [ ] T007 Run strict validation for this child and the phase parent.
- [ ] T008 Fill `implementation-summary.md` with commit hash, files changed, test evidence, and residual risks.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] F48, F85, F86, and F87 checklist rows are closed.
- [ ] Tests prove explicit caps or unpredictable request IDs.
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
