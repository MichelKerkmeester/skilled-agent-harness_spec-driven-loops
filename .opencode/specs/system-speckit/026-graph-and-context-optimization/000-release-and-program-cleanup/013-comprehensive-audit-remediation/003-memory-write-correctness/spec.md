---
title: "Feature Specification: Phase 3: memory-write-correctness [template:level_1/spec.md]"
description: "memory_update leaves the entity-density cache stale for up to 60s after a title/trigger-phrase rewrite, and the atomic-save crash-window orphan recovery lacks a regression test for its uuid-suffixed pending shape."
trigger_phrases:
  - "entity density cache invalidation"
  - "post mutation hook"
  - "atomic save pending recovery"
  - "transaction manager orphan"
  - "memory write correctness"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/003-memory-write-correctness"
    last_updated_at: "2026-06-04T20:45:42Z"
    last_updated_by: "cluster-c-write-correctness"
    recent_action: "Wired entity-density invalidation into shared hook and added orphan-recovery regression"
    next_safe_action: "Defer mcp_server typecheck and vitest to central verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-types.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/transaction-manager-recovery.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-memory-write-correctness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: memory-write-correctness

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-04 |
| **Branch** | `scaffold/003-memory-write-correctness` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 7 |
| **Predecessor** | 002-retrieval-scope-hardening |
| **Successor** | 004-mcp-contract-parity |
| **Handoff Criteria** | Source and test changes applied; mcp_server typecheck and vitest deferred to central verification |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the comprehensive audit remediation specification.

**Scope Boundary**: Owns the entity-density invalidation wiring in the shared post-mutation hook (`mutation-hooks.ts` + `memory-crud-types.ts`) and the atomic-save orphan-recovery regression test. Does not touch `memory-save.ts` (owned by phase 004) or reorder the atomic-save DB-commit/file-promote sequence.

**Dependencies**:
- `invalidateEntityDensityCache` exported by `lib/search/entity-density.ts` (unchanged).
- `recoverAllPendingFiles`, `findPendingFiles`, `isPendingFile`, `getPendingPath` exported by `lib/storage/transaction-manager.ts` (unchanged).

**Deliverables**:
- Entity-density cache cleared from the shared hook so the `memory_update` and atomic-save paths reflect title/trigger-phrase mutations immediately.
- Optional `entityDensityCacheCleared` field on `MutationHookResult` for observability.
- Regression coverage for the uuid-suffixed atomic-save pending orphan and for the update-path cache invalidation.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared post-mutation hook (`runPostMutationHooks`) clears trigger, tool, constitutional, graph-signal, degree, and co-activation caches but never invalidates the entity-density cache, so after a `memory_update` renames a high-degree memory or rewrites its trigger phrases, graph-channel routing keeps matching stale tokens until the 60s TTL lapses. Separately, the atomic-save crash-window recovery for the uuid-suffixed pending orphan is implemented and wired but has no end-to-end regression test, leaving that recovery link unprotected.

### Purpose
Make entity-density routing reflect title/trigger-phrase mutations immediately on every mutation path, and lock in the atomic-save orphan recovery with a regression test, without reordering the commit/promote sequence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Wire `invalidateEntityDensityCache` into `runPostMutationHooks` with a guarded try/catch.
- Add an optional `entityDensityCacheCleared` field to `MutationHookResult`.
- Add an update-path regression case and a uuid-suffixed orphan-recovery regression case.

### Out of Scope
- `memory-save.ts` edits - owned by phase 004 (contract parity).
- Reordering the atomic-save DB-commit before file-promote - no real two-phase commit across SQLite and the filesystem; reordering only moves which artifact is orphaned.
- Removing existing lower-layer invalidations in `vector-index-mutations.ts` / `memory-save.ts` - they are idempotent and out of scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/mutation-hooks.ts` | Modify | Import and call `invalidateEntityDensityCache`; record `entityDensityCacheCleared`. |
| `mcp_server/handlers/memory-crud-types.ts` | Modify | Add optional `entityDensityCacheCleared` field to `MutationHookResult`. |
| `mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts` | Modify | Add memory_update trigger-phrase rewrite case (no TTL wait). |
| `mcp_server/tests/transaction-manager-recovery.vitest.ts` | Modify | Add uuid-suffixed orphan-recovery regression case. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No new P0 blockers in this phase | Both findings are P1; recorded here for template completeness. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | C1: Entity-density cache invalidated by the shared post-mutation hook | `runPostMutationHooks` calls `invalidateEntityDensityCache` in a guarded block; the field is recorded; `memory_update` and atomic-save paths clear it without code duplication. |
| REQ-003 | C1: Optional result field keeps all consumers typechecking | `entityDensityCacheCleared` is optional on `MutationHookResult`; fallback literals in update/delete/bulk-delete/save still compile. |
| REQ-004 | C1: Update-path regression proves no TTL wait | New test renames trigger phrases via `handleMemoryUpdate` and asserts `getEntityDensityScore(oldToken)===0` without a manual invalidation or TTL wait. |
| REQ-005 | C2: Atomic-save orphan recovery is regression-protected | New test writes a `*_pending.md.<uuid8>` orphan plus committed-row probe and asserts `recoverAllPendingFiles` renames it to the final path with matching content. |
| REQ-006 | C2: Pending-file detection recognizes the double-suffix orphan | `findPendingFiles` includes the orphan and `isPendingFile` returns true for it. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `memory_update` that rewrites title or trigger_phrases changes entity-density routing immediately, with no 60s TTL lag, on every mutation path that calls the shared hook.
- **SC-002**: The atomic-save uuid-suffixed pending orphan is renamed to its final path by startup recovery, proven by an end-to-end regression test.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `MutationHookResult` shared by update/delete/bulk-delete/save and `buildMutationHookFeedback` | Typecheck break if the new field were required | Field is optional; verified all five fallback literals omit it safely. |
| Risk | Double invalidation on save/delete (shared hook plus lower-layer calls) | Low | `invalidateEntityDensityCache` is idempotent; it only resets the cache to empty/stale. |
| Risk | Concurrent peer edits in mcp_server during this work | Low | Verification deferred to central per cluster policy; changes are scope-locked to four files. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Both findings had verified fixes; C2 is intentionally test-only because reordering the commit/promote sequence is not advisable.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
