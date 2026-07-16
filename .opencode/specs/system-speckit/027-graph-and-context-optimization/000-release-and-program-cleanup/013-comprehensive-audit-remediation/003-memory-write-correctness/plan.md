---
title: "Implementation Plan: Phase 3: memory-write-correctness [template:level_1/plan.md]"
description: "Wire entity-density invalidation into the shared post-mutation hook and add regression tests for the update-path cache clear and the atomic-save uuid-suffixed orphan recovery."
trigger_phrases:
  - "entity density invalidation plan"
  - "mutation hook wiring"
  - "atomic save recovery test"
  - "transaction manager regression"
  - "memory write correctness plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/003-memory-write-correctness"
    last_updated_at: "2026-06-04T20:45:42Z"
    last_updated_by: "cluster-c-write-correctness"
    recent_action: "Implemented C1 source wiring and C1/C2 regression tests"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: memory-write-correctness

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node MCP server) |
| **Framework** | better-sqlite3 storage, custom MCP handlers |
| **Storage** | SQLite (`memory_index`, `causal_edges`) plus filesystem pending-file recovery |
| **Testing** | Vitest |

### Overview
C1 moves entity-density cache invalidation into the single shared post-mutation hook so no mutation path can forget it, fixing the `memory_update` staleness and covering atomic-save for free. C2 adds a regression test that exercises the already-implemented uuid-suffixed orphan recovery end-to-end; no production reorder is performed because there is no real two-phase commit across SQLite and the filesystem.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests authored (execution deferred to central verification)
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared-hook fan-in: every CRUD handler routes cache invalidation through one `runPostMutationHooks` function, so adding a clear there covers update, atomic-save, delete, and bulk-delete at once.

### Key Components
- **runPostMutationHooks (mutation-hooks.ts)**: central post-commit cache invalidation; now also clears entity-density.
- **MutationHookResult (memory-crud-types.ts)**: result contract; gains an optional `entityDensityCacheCleared` field.
- **transaction-manager.ts recovery**: `recoverAllPendingFiles` / `findPendingFiles` / `parsePendingPath` already handle the double-suffix orphan; the test pins that behavior.

### Data Flow
A mutation handler commits its transaction, then calls `runPostMutationHooks`, which invalidates the entity-density cache so the next `getEntityDensityScore` rebuild reflects the new title/trigger_phrases instead of waiting for the 60s TTL.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mutation-hooks.ts` runPostMutationHooks | Shared post-mutation cache invalidator | update (add entity-density clear) | Read-back; deferred vitest on entity-density-commit-hooks |
| `memory-crud-types.ts` MutationHookResult | Result contract for all mutation handlers | update (add optional field) | Grep of fallback literals confirms optional-field safety |
| `entity-density.ts` invalidateEntityDensityCache | Cache reset entry point | not a consumer (unchanged) | Existing export confirmed |
| `transaction-manager.ts` recovery helpers | Orphan detection and rename | unchanged (test-only) | New regression test asserts behavior |

Required inventories:
- Same-class producers: `rg -n 'invalidateEntityDensityCache' mcp_server/` confirms save/bulk-delete/delete callers remain in place.
- Consumers of changed symbols: `rg -n 'MutationHookResult' mcp_server/` confirms update/delete/bulk-delete/save and buildMutationHookFeedback all tolerate an optional field.
- Matrix axes: mutation operation (update vs atomic-save) X cache state (warm vs cleared).
- Algorithm invariant: a committed-row orphan at `*_pending.md.<uuid8>` with no original file must rename to the final path with content preserved.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read backlog findings C1 and C2
- [x] Read all owned source and test files
- [x] Confirm export names and import paths

### Phase 2: Core Implementation
- [x] Add optional `entityDensityCacheCleared` to `MutationHookResult`
- [x] Import and call `invalidateEntityDensityCache` in `runPostMutationHooks`
- [x] Record the field in the returned result

### Phase 3: Verification
- [x] Add update-path regression test
- [x] Add uuid-suffixed orphan-recovery regression test
- [x] Read-back self-review; defer execution to central
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | memory_update trigger-phrase rewrite clears entity-density cache | Vitest |
| Unit | uuid-suffixed orphan recovery via recoverAllPendingFiles | Vitest |
| Manual | Read-back review of optional-field typecheck safety | Grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `lib/search/entity-density.ts` exports | Internal | Green | Hook wiring cannot import the invalidator |
| `lib/storage/transaction-manager.ts` exports | Internal | Green | Orphan-recovery test cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Central verification reports a typecheck or vitest failure tied to these four files.
- **Procedure**: Revert the four edits; the shared hook returns to its prior six-cache invalidation set and the regression tests are removed. No data migration is involved.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
