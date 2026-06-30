---
title: "Tasks: Investigation P0 Fixes for Resource Exhaustion and Symlink Attack"
description: "Task ledger for F12, F13, and F47 P0 remediation."
trigger_phrases:
  - "arc 010 p0 tasks"
  - "F12 F13 F47 tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "created-p0-task-ledger"
    next_safe_action: "start-T001"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100020010100020010100020010100020010100020010100020010100020010"
      session_id: "010-002-001-p0"
      parent_session_id: null
    completion_pct: 0
---
# Tasks: Investigation P0 Fixes for Resource Exhaustion and Symlink Attack

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after P0 ordering is satisfied |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T000 Read `research.md`, `findings-registry.json`, and the three target source files before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T001 Fix F12 in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:476-497`: add a max line length cap, max buffer cap, rejection path, and child termination for oversized stdout JSON lines.
- [ ] T002 Fix F13 in `.opencode/bin/lib/ensure-rerank-sidecar.cjs:167-169`: replace `process.pid + Date.now()` temp suffixes with `crypto.randomBytes(16).toString('hex')` and exclusive `'wx'` creation.
- [ ] T003 Fix F47 in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:105-132`: add a max line length cap before `JSON.parse` and validate `input.length` before embedding.
- [ ] T004 Add targeted tests for the F12, F13, and F47 contracts.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Run targeted sidecar and ensure-helper tests.
- [ ] T006 Run strict validation for this child and the phase parent.
- [ ] T007 Fill `implementation-summary.md` with commit hash, files changed, test evidence, and residual risks.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] F12, F13, and F47 checklist rows are closed.
- [ ] Tests cover the explicit resource and temp-file contracts.
- [ ] No research artifact or unrelated source file is modified.
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
