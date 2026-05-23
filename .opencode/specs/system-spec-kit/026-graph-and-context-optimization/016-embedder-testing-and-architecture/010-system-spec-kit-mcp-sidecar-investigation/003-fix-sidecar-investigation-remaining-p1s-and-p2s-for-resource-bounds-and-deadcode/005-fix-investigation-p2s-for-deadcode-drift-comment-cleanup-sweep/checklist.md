---
title: "Verification Checklist: Investigation P2 Cleanup Sweep"
description: "Closure/defer checklist for all 68 requested P2 findings."
trigger_phrases:
  - "arc 010 003 005 checklist"
  - "68 p2 cleanup checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep"
    last_updated_at: "2026-05-23T07:05:00Z"
    last_updated_by: "codex"
    recent_action: "completed-finding-checklist"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100030050100030050100030050100030050100030050100030050100030050"
      session_id: "010-003-005-p2-cleanup"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Investigation P2 Cleanup Sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
- [x] CHK-003 [P1] Registry and full source files read before edits.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] TypeScript typecheck passes for `@spec-kit/mcp-server`.
- [x] CHK-011 [P0] No behavior-changing cleanup was forced closed.
- [x] CHK-012 [P1] Code follows existing local patterns.
- [x] CHK-013 [P1] Dirty worktree entries outside this packet were not reverted.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Embedder vitest regression passed: 4 files, 40 tests.
- [x] CHK-021 [P0] CJS launcher vitest regression passed: 1 file, 11 passed, 5 skipped.
- [x] CHK-022 [P1] MCP server typecheck passed.
- [x] CHK-023 [P1] Final strict spec validation passed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

| Finding | Surface | Status | Evidence or Rationale |
|---------|---------|--------|-----------------------|
| F24 | reindex | closed | SQL aliases remove snake/camel dual row conversion. |
| F27 | reindex | closed | `JOB_SELECT_COLUMNS` aliases rows to `ReindexJob` shape. |
| F33 | reindex | closed | Section dividers now match embedder module style. |
| F35 | reindex | DEFERRED | Error text is observable behavior. |
| F41 | reindex | DEFERRED | `cancelJob` is exported and used by regression tests; removal needs test/API packet. |
| F42 | reindex | closed | Removed `ACTIVE_REINDEX_STATUSES` export and barrel re-export. |
| F43 | reindex | DEFERRED | Removing `autoStart=false` changes test/runtime API behavior. |
| F54 | reindex | closed | No `getCancellationStatus` duplicate exists in current source. |
| F60 | reindex | closed | Duplicate cardinality checks consolidated through `getBatchPair`. |
| F65 | reindex | closed | Shard schema/metadata write split out of `writeVectorsToShard`. |
| F81 | reindex | closed | Single-call event-loop helper inlined. |
| F82 | reindex | closed | Dynamic status SQL replaced with explicit update branches. |
| F93 | reindex | closed | Nested cancellation-check branch is absent in current source. |
| F96 | reindex | closed | Shard metadata values use prepared statements instead of manual quote escaping. |
| F98 | reindex | closed | Silent cancellation-exit branch is absent in current source. |
| F110 | reindex | DEFERRED | Removing null database-dir return changes in-memory DB behavior. |
| F4 | sidecar-client | closed | Added JSDoc for public sidecar APIs. |
| F7 | sidecar-client | closed | `EmbedderSidecarInputType` is no longer exported. |
| F9 | sidecar-client | DEFERRED | `buildSidecarEnv` is imported by current regression tests. |
| F16 | sidecar-client | DEFERRED | Env allowlist narrowing changes child process behavior. |
| F29 | sidecar-client | closed | `responseHasId` helper is already absent in current source. |
| F32 | sidecar-client | DEFERRED | Worker-info field rename changes public response shape. |
| F36 | sidecar-client | closed | `toErrorMessage` extraction is already local and consistent for this module. |
| F39 | sidecar-client | DEFERRED | Same public worker-info naming change as F32. |
| F40 | sidecar-client | DEFERRED | Env variable policy drift is behavior/config surface. |
| F46 | sidecar-client | DEFERRED | Removing mock env prefix breaks existing tests. |
| F84 | sidecar-client | closed | `sleep()` helper is already absent in current source. |
| F97 | sidecar-client | DEFERRED | `dimensions`/`dim` rename changes public option/response shape. |
| F99 | sidecar-client | DEFERRED | Resolving the typed pending-map cast needs protocol/type redesign. |
| F11 | ensure-rerank-sidecar | closed | Pruned unused constants and helper exports with no direct consumers. |
| F17 | ensure-rerank-sidecar | DEFERRED | Config-hash sanitization changes runtime identity behavior. |
| F21 | ensure-rerank-sidecar | closed | Split timeout parsing from `resolvePort`. |
| F22 | ensure-rerank-sidecar | DEFERRED | Removing `skipIfDisabled` changes option API behavior. |
| F28 | ensure-rerank-sidecar | DEFERRED | Dependency injection is required by current tests. |
| F59 | ensure-rerank-sidecar | DEFERRED | Health payload refactor not taken; current behavior left untouched. |
| F66 | ensure-rerank-sidecar | DEFERRED | Log fd stdio shape is runtime-spawn behavior. |
| F67 | ensure-rerank-sidecar | DEFERRED | God-function split is larger than safe cleanup under launcher lifecycle. |
| F72 | ensure-rerank-sidecar | DEFERRED | Directory fsync parity changes filesystem durability behavior. |
| F89 | ensure-rerank-sidecar | DEFERRED | State-dir path validation changes accepted configuration. |
| F92 | ensure-rerank-sidecar | DEFERRED | Owner-token nested error flow left stable. |
| F103 | ensure-rerank-sidecar | DEFERRED | Log open mode is observable filesystem behavior. |
| F104 | ensure-rerank-sidecar | DEFERRED | Temp-file naming is asserted by current tests/parity. |
| F8 | execution-router | closed | `EmbedderExecutionPolicy` is local; input-type duplicate already removed. |
| F23 | execution-router | DEFERRED | Direct adapter class removal is larger behavior-risk refactor. |
| F51 | execution-router | DEFERRED | Signal handling changes process lifecycle behavior. |
| F56 | execution-router | closed | Provider normalization now happens once in `getEmbedderAdapter`. |
| F63 | execution-router | DEFERRED | Adapter rename/decomposition tied to F23. |
| F64 | execution-router | DEFERRED | Ollama delegation assertion needs adapter contract redesign. |
| F80 | execution-router | closed | Removed single-call `normalizeProviderForFactory`. |
| F90 | execution-router | DEFERRED | Credential cache invalidation changes adapter lifecycle behavior. |
| F10 | sidecar-worker | DEFERRED | Dimension fallback removal changes invalid-request fallback behavior. |
| F34 | sidecar-worker | closed | Worker input type now derives from `EmbedOptions['inputType']`. |
| F50 | sidecar-worker | DEFERRED | Poll jitter changes timing/liveness behavior. |
| F55 | sidecar-worker | closed | Removed standalone `BaseRequest` indirection. |
| F71 | sidecar-worker | DEFERRED | Provider default documentation/removal changes config semantics. |
| F75 | sidecar-worker | DEFERRED | Provider default fallback is runtime behavior. |
| F76 | sidecar-worker | closed | Removed dead `request.inputType ?? 'document'` fallback. |
| F100 | sidecar-worker | closed | `parseRequest` parses as `unknown` before envelope validation. |
| F44 | registry/index | DEFERRED | Shared registry implementation is forbidden scope; barrel export has test consumers. |
| F45 | index | closed | Removed unused Ollama option/input barrel type exports. |
| F68 | index | closed | Replaced stale phase-plan comments. |
| F77 | index | closed | Removed unused Ollama adapter/error barrel re-exports. |
| F78 | index | closed | Removed unused `NotImplementedError` barrel re-export. |
| F83 | schema | closed | Inlined single-call active-pointer/provider/db-name helper chain. |
| F106 | index | closed | Removed unused `ActiveEmbedder` barrel type export. |
| F107 | index | closed | Removed unused `ReindexJobStatus` barrel type export. |
| F108 | index | closed | Removed unused `StartReindexOptions` barrel type export. |
| F109 | index | DEFERRED | `EmbedderManifest` barrel type is imported by current tests. |
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced.
- [x] CHK-031 [P0] Security findings requiring behavior changes deferred instead of silently changed.
- [x] CHK-032 [P1] Manual SQL escaping in shard metadata removed via prepared statements.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, decision record, and summary synchronized.
- [x] CHK-041 [P1] Deferred findings include rationale.
- [x] CHK-042 [P2] Commit handoff included in implementation summary.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files limited to generated scaffold `scratch/.gitkeep`.
- [x] CHK-051 [P1] No out-of-scope spec docs edited by this packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 8 | 8/8 |
| P2 Findings | 68 | 34 closed, 34 deferred |

**Verification Date**: 2026-05-23
<!-- /ANCHOR:summary -->
