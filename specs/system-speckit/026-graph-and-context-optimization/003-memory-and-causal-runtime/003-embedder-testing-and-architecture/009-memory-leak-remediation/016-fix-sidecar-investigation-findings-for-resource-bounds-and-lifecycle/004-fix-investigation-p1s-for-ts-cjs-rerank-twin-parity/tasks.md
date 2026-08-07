---
title: "Tasks: Investigation P1 Fixes for TS CJS Rerank Twin Parity"
description: "Task ledger for selected P1 drift and parity findings."
trigger_phrases:
  - "arc 010 parity tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "created-parity-task-ledger"
    next_safe_action: "start-F1"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100020040100020040100020040100020040100020040100020040100020040"
      session_id: "010-002-004-parity"
      parent_session_id: null
    completion_pct: 0
---
# Tasks: Investigation P1 Fixes for TS CJS Rerank Twin Parity

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

- [ ] T000 Read registry rows for F1, F2, F3, F37, F38, F69, F70, F101, and F102 plus target source files before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T001 Fix F1 in `.opencode/bin/lib/ensure-rerank-sidecar.cjs:136` and `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:140`: align empty revision handling so both treat empty string consistently.
- [ ] T002 Fix F2 in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:106-117` and `execution-router.ts:46-55`: move or align canonical `toBackendKind` implementation.
- [ ] T003 Fix F3 in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:229-233,80`: document and test recognized `SPECKIT_` env naming conventions.
- [ ] T004 Fix F37 in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:20-31` and `execution-router.ts:211-216`: narrow or clearly document test-only `SidecarClientOptions`.
- [ ] T005 Fix F38 in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:106-117` and `execution-router.ts:46-55`: align `toBackendKind` signatures and fallback behavior.
- [ ] T006 Fix F69 in `.opencode/bin/lib/ensure-rerank-sidecar.cjs:164-170` and `sidecar_ledger.py:94-104,187-189`: add JS ledger locking or a parity-backed lock contract.
- [ ] T007 Fix F70 in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/types.ts:4`: update the canonical-location comment or move implementation to the documented shared location.
- [ ] T008 Fix F101 in `.opencode/bin/lib/ensure-rerank-sidecar.cjs:36-49` and `ensure_rerank_sidecar.py:80-81`: align health payload body size limit behavior.
- [ ] T009 Fix F102 in `.opencode/bin/lib/ensure-rerank-sidecar.cjs:178-187` and `sidecar_ledger.py:150-161`: align process liveness error handling behavior.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Add parity tests or equivalent focused tests for all selected drift contracts.
- [ ] T011 Run targeted Node and Python tests for touched surfaces.
- [ ] T012 Run strict validation for this child and the phase parent.
- [ ] T013 Fill `implementation-summary.md` with final parity decisions and evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] F1, F2, F3, F37, F38, F69, F70, F101, and F102 checklist rows are closed.
- [ ] Cross-runtime parity is proven or deletion/documentation resolves the finding.
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
