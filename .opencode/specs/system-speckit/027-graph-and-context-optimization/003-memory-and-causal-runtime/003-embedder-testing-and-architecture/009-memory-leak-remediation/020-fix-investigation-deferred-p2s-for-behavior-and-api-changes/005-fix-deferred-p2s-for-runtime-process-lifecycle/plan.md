---
title: "Implementation Plan: Runtime Process Lifecycle Closure"
description: "Plan for closing five deferred P2 lifecycle findings in reindex and execution-router."
trigger_phrases:
  - "020 005 plan"
  - "runtime lifecycle remediation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/005-fix-deferred-p2s-for-runtime-process-lifecycle"
    last_updated_at: "2026-05-23T10:55:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented runtime lifecycle fixes"
    next_safe_action: "Review and optionally commit packet"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0200050200050200050200050200050200050200050200050200050200050200"
      session_id: "020-005-runtime-process-lifecycle"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Runtime Process Lifecycle Closure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, better-sqlite3 |
| **Framework** | Vitest in `@spec-kit/mcp-server` |
| **Storage** | File-backed SQLite memory DB plus vector shard sidecar DB |
| **Testing** | Embedders vitest slice and mcp-server typecheck |

### Overview
This packet narrows runtime lifecycle behavior in two places. Reindex startup now validates that a stable database directory exists before work is queued, and execution-router now treats signal and adapter-cache lifecycle as explicit state transitions with regression fixtures.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent packet `../spec.md` read; phase 005 scope is only F41/F43/F51/F90/F110.
- [x] F53 baseline ADR read; signal behavior must remain best-effort.
- [x] F37/testables precedent read; test-only seams move out of production where scope allows.

### Definition of Done
- [x] All five findings closed or ADR-documented with explicit constraints.
- [x] Embedders vitest slice exits 0 after one allowed F48 rerun.
- [x] mcp-server typecheck exits 0.
- [x] Strict spec validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Local lifecycle hardening with test-only seam modules.

### Key Components
- **Reindex startup**: validates file-backed DB directory before job construction and before resume.
- **Reindex testables**: exposes paused startup and cancellation tests without adding new production startup controls.
- **Execution router signals**: registers one shared signal handler and guards duplicate re-entry.
- **Execution router adapter cache**: clears direct provider adapters and emits invalidation events when the active adapter key rotates.

### Data Flow
`startReindex()` resolves the database, validates a directory, inserts a queued job, then auto-starts production work. Tests use `reindex.testables.ts` to construct a queued job without starting it. `getEmbedderAdapter()` computes the active provider/model key, invalidates stale direct adapters on rotation, then returns either a sidecar client or a direct provider adapter.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `reindex.ts` | Reindex job construction and cancellation | Validate DB dir, keep live `cancelJob`, add internal paused-start seam | `embedder-reindex.vitest.ts`, typecheck |
| `reindex.testables.ts` | New test seam | Export paused-start and cancel helpers | Import used by sibling vitest |
| `execution-router.ts` | Adapter and shutdown lifecycle owner | Add signal guard and direct adapter invalidation events | `execution-router.vitest.ts`, typecheck |
| `execution-router.testables.ts` | Existing test seam | Expose invalidation listener and direct adapter cache keys | `execution-router.vitest.ts` |
| `index.ts` | Frozen barrel consumer | Unchanged; proves `cancelJob` remains live | `rg -n "cancelJob"` evidence |

Required inventories:
- `rg -n "cancelJob|autoStart|databaseDir|registerShutdownHooks|SIGTERM|credential|providerPromise" .opencode/skills/system-spec-kit/mcp_server/lib/embedders .opencode/skills/system-spec-kit/mcp_server/tests`.
- `rg -n "F41|F43|F51|F90|F110" .../015-deep-research-drift-and-simplification/research/research.md .../017-.../005-.../checklist.md`.
- Matrix axes: DB type (`:memory:` vs file-backed), startup path (production vs testables), signal count (first vs duplicate), adapter key (same vs rotated), direct provider promise state (fresh vs rejected).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold Level 2 packet folder.
- [x] Read parent phase spec and predecessor ADRs.
- [x] Audit target files and sibling tests.

### Phase 2: Core Implementation
- [x] Add `InvalidDatabaseDirError` and fail-fast DB-dir validation.
- [x] Gate `autoStart=false` behind `reindex.testables.ts`.
- [x] Keep and document `cancelJob` because `index.ts` is a live frozen consumer.
- [x] Add duplicate-signal guard without blocking the shutdown promise chain.
- [x] Add direct provider credential-cache invalidation events on adapter rotation.

### Phase 3: Verification
- [x] Add focused fixtures for F43/F110/F41/F51/F90.
- [x] Run requested embedders vitest slice with allowed F48 rerun.
- [x] Run mcp-server typecheck.
- [x] Update packet docs and strict-validate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Reindex startup, paused test seam, cancellation | `mcp_server/tests/embedder-reindex.vitest.ts` |
| Unit | Signal duplicate handling and adapter cache rotation | `mcp_server/tests/embedders/execution-router.vitest.ts` |
| Integration slice | All embedders tests | `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` |
| Static | TypeScript API/type surface | `npm run typecheck --workspace=@spec-kit/mcp-server` |
| Docs | Packet contract | `validate.sh <spec-folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| F53 shutdown ADR | Internal precedent | Green | Signal lifecycle would risk regressing baseline |
| F37/testables pattern | Internal precedent | Green | Test-only seam decision would be weaker |
| Bucket 6 `index.ts` freeze | Scope constraint | Green | `cancelJob` remains live and documented instead of barrel removal |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any non-F48 regression in the requested embedders suite or typecheck.
- **Procedure**: Revert this packet's edits to `reindex.ts`, `reindex.testables.ts`, `execution-router.ts`, `execution-router.testables.ts`, and the two sibling vitest files. Keep packet docs as failed/deferred evidence if rollback is needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Parent spec and predecessor ADRs | Core |
| Core | Target file and consumer audits | Verify |
| Verify | Code and test edits | Handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Read parent, baselines, source, tests |
| Core Implementation | High | Lifecycle and cache semantics |
| Verification | Medium | Full embedders slice, typecheck, strict validation |
| **Total** | | **High-risk leaf packet** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations.
- [x] No git mutation.
- [x] No sidecar-client, sidecar-worker, registry, or index edits.

### Rollback Procedure
1. Revert the six code/test files changed by this packet.
2. Re-run the embedders vitest slice.
3. Re-run typecheck.
4. Mark this packet DEFERRED-AGAIN if rollback is required.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
