---
title: "Spec: Runtime Process Lifecycle Closure for F41 F43 F51 F90 F110"
description: "Level 2 packet closing deferred P2 lifecycle findings in reindex.ts and execution-router.ts."
trigger_phrases:
  - "020 005 runtime lifecycle"
  - "F41 F43 F51 F90 F110"
  - "reindex execution router lifecycle"
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
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.testables.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.testables.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-reindex.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0200050200050200050200050200050200050200050200050200050200050200"
      session_id: "020-005-runtime-process-lifecycle"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User pre-approved this Level 2 spec folder on branch main."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Runtime Process Lifecycle Closure for F41 F43 F51 F90 F110

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (020 deferred P2 bucket parent) |
| **Predecessors** | `../001-fix-deferred-p2s-for-test-only-and-shared-exports/`; `../002-fix-deferred-p2s-for-env-and-config-behavior/`; `../003-fix-deferred-p2s-for-filesystem-durability/`; `../004-fix-deferred-p2s-for-api-response-shape/`; `../../017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks/decision-record.md` |
| **Handoff Criteria** | F41/F43/F51/F90/F110 closed or explicitly DEFERRED-AGAIN; embedders vitest green; mcp-server typecheck green; strict validate exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five deferred P2 findings remained in runtime/process lifecycle code. `reindex.ts` had test-only lifecycle controls and a silent in-memory database branch, while `execution-router.ts` had unsafe signal re-entry and indefinitely cached direct provider adapters.

### Purpose
Close the five findings with explicit runtime contracts, test-only seams where behavior is only needed by fixtures, and regression tests that exercise startup, cancellation, duplicate signals, and adapter rotation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Validate file-backed database directory availability before reindex jobs are constructed or resumed.
- Gate paused reindex startup behind `reindex.testables.ts` while keeping production `startReindex()` auto-start behavior.
- Keep the live `cancelJob` production export and document its cancellation lifecycle because `index.ts` is a frozen live barrel consumer for this bucket.
- Make router shutdown signal handling once-only, duplicate-signal idempotent, and best-effort without awaiting before signal replay.
- Emit credential-cache invalidation events and clear direct provider adapter cache entries when the active adapter key rotates.
- Add focused vitest fixtures for all five findings.

### Out of Scope
- Modifying `index.ts`, `registry.ts`, `sidecar-client.ts`, `sidecar-worker.ts`, or `ensure-rerank-sidecar.cjs`.
- Introducing a new public MCP cancel tool.
- Forcibly restarting old sidecar worker processes on adapter rotation.
- Git commit, push, or branch mutation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modify | Add file-backed DB validation, internal auto-start seam, and exported error type |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.testables.ts` | Create | Expose paused-start and cancel helpers for tests |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Modify | Add signal re-entry guard and direct adapter credential-cache invalidation events |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.testables.ts` | Modify | Expose router cache/event test seams |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-reindex.vitest.ts` | Modify | Add F43/F110 fixtures and move cancel/start controls to testables |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts` | Modify | Add F51/F90 fixtures |
| `<this-folder>/*.md` | Modify/Create | Record plan, checklist evidence, ADRs, verification, and summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F110 fail-fast database directory validation | `startReindex()` throws `InvalidDatabaseDirError` with a clear file-backed DB message for `:memory:` databases |
| REQ-002 | F43 production auto-start contract | Production `startReindex()` auto-starts jobs; paused startup is reachable only through `reindex.testables.ts` |
| REQ-003 | F41 cancellation lifecycle | `cancelJob()` behavior remains covered and documented because the live barrel export is out of scope for this packet |
| REQ-004 | F51 signal idempotency | Shutdown hooks register once; duplicate SIGTERM handler invocation warns and does not re-enter shutdown or replay the signal twice |
| REQ-005 | F90 credential cache invalidation | Direct provider adapter cache clears on active adapter key rotation and emits an invalidation event with prior/next keys |

### P1 - Required (complete OR documented deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preserve targeted tests | `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` exits 0, with one F48 retry allowed |
| REQ-007 | Preserve type safety | `npm run typecheck --workspace=@spec-kit/mcp-server` exits 0 |
| REQ-008 | Preserve packet docs | `validate.sh <spec-folder> --strict` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: F41, F43, F51, F90, and F110 are marked closed in `checklist.md`.
- **SC-002**: In-memory or anonymous databases no longer silently skip vector shard writes during reindex startup.
- **SC-003**: Test-only paused startup lives in `reindex.testables.ts`; production startup queues immediately.
- **SC-004**: Duplicate signal handling is idempotent and preserves the F53 best-effort cleanup chain.
- **SC-005**: Direct provider credential caches do not persist across active adapter rotation.
- **SC-006**: All requested verification commands exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reindex now rejects in-memory DB startup | Medium | Tests moved to file-backed temp DBs; clear error identifies required database shape |
| Risk | Signal handler changes process lifecycle | High | Preserve F53 best-effort signal replay while adding one in-flight guard |
| Risk | Adapter cache invalidation can discard warm providers | Medium | Clear only direct provider cache on active key rotation; document stale window |
| Dependency | `index.ts` frozen by Bucket 6 | Medium | Treat `cancelJob` as live via barrel export and ADR-document lifecycle instead of editing the barrel |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Adapter-rotation invalidation remains O(number of cached direct adapters), which is currently a small in-process map.

### Security
- **NFR-S01**: Credential invalidation events include provider/model cache keys only; no credential values or environment variables are logged.

### Reliability
- **NFR-R01**: Signal replay remains best-effort and does not await cleanup before returning from the handler.
- **NFR-R02**: Reindex fails before job construction when the database cannot support vector shard paths.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `:memory:` databases are invalid for reindex startup and resume because no stable vector shard directory exists.
- Existing file-backed databases continue to derive vector shard paths from the main database directory.

### Error Scenarios
- Duplicate SIGTERM while shutdown is in flight warns once per duplicate invocation and does not replay the signal again.
- Direct provider creation rejection clears the cached promise so the next call can retry.

### State Transitions
- Active adapter key rotation clears direct provider cache entries at the next adapter resolution.
- Sidecar worker process restarts on credential rotation remain out of scope; the stale window is documented in ADR-005.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Two runtime files, two test seams, two sibling vitest files |
| Risk | 22/25 | Startup validation, signal handling, provider-cache lifecycle |
| Research | 12/20 | Required F53 and F37 baselines plus findings registry audit |
| **Total** | **50/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The packet used the prompt's pre-approved scope and halted only for non-F48 regressions.
<!-- /ANCHOR:questions -->
