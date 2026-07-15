---
title: "Implementation Plan: memory_embedding_reconcile() MCP maintenance tool"
description: "Plan for a guarded, dry-run-default reconcile tool that converges embedding_status for vector-present stale rows, mirroring the memory_retention_sweep handler pattern."
trigger_phrases:
  - "memory_embedding_reconcile plan"
  - "embedding reconcile implementation"
  - "embedding status convergence"
  - "reconcile handler registration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/006-memory-embedding-reconcile-tool"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 2 plan for memory_embedding_reconcile() tool"
    next_safe_action: "Implement core logic + handler + registration, then run vitest + build"
    blockers: []
    key_files:
      - "mcp_server/lib/embedders/embedding-reconcile.ts"
      - "mcp_server/handlers/memory-embedding-reconcile.ts"
      - "mcp_server/tests/embedding-reconcile.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: memory_embedding_reconcile() MCP maintenance tool

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js, MCP server) |
| **Framework** | mk-spec-memory MCP context-server + better-sqlite3 |
| **Storage** | `context-index.sqlite` (`memory_index`) + attached active vector shard (`vec_<dim>`, `vec_memories_rowids`) |
| **Testing** | Vitest (`mcp_server/tests/embedding-reconcile.vitest.ts`) |

### Overview
This implementation adds a guarded `memory_embedding_reconcile()` MCP maintenance tool that converts the previously hand-written backlog repair SQL into a first-class, dry-run-default operation. Core logic lives in `lib/embedders/embedding-reconcile.ts`; a thin handler in `handlers/memory-embedding-reconcile.ts` delegates to it. The tool resolves the active embedder from runtime `vec_metadata`, verifies the attached active shard, and either reports four reconciliation buckets (dry-run) or runs one ordered transaction (apply). It mirrors the existing `memory_retention_sweep` handler/lib/registration pattern so wiring stays consistent.

**Non-obvious operational note:** The live ~17k-row backlog was ALREADY cleared this session via the guarded emergency SQL plus a lease-owner daemon restart (see 005 `implementation-summary.md` "Operator Run Record — One-Time Backlog Reconcile (2026-05-27)": 17,241 vector-present rows flipped to `success`; `failed/pending/retry = 0` confirmed under the new daemon). Therefore running `apply` against the current DB is a **near-noop** (0 stale rows now). This tool exists for repeatability and future recurrences, NOT to drain 17k rows today. Nobody should re-run it expecting 17k rows — the dry-run buckets on the current DB will read ~0.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (active shard, `memory_retention_sweep` pattern)
- [x] NFRs defined with targets (dry-run read-only, single transaction apply, fail-closed)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..004)
- [ ] Tests passing (the new vitest suite green + no regressions)
- [ ] Docs updated (spec/plan/tasks/checklist/implementation-summary)
- [ ] Checklist items verified


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin-handler + core-lib, mirroring `handlers/memory-retention-sweep.ts` → `lib/.../*-sweep` logic. The handler validates/parses args and delegates; the lib owns SQL, shard verification, and the guarded transaction.

### Key Components
- **runMemoryEmbeddingReconcile(database, args)** (`lib/embedders/embedding-reconcile.ts`): active-embedder resolution, shard verification, bucket aggregation, dry-run result assembly, and the apply transaction.
- **memory-embedding-reconcile handler** (`handlers/memory-embedding-reconcile.ts`): args validation + delegation to core logic; returns the typed result.
- **Registration surfaces**: `tools/memory-tools.ts`, `schemas/tool-input-schemas.ts`, `tool-schemas.ts`, `handlers/index.ts`, `tools/types.ts`, `context-server.ts` (`MEMORY_RUNTIME_TOOL_NAMES`).

### Data Flow
1. Handler receives args; defaults applied (`mode='dry-run'`, `activeOnly=true`, `resetMissing=true`, `missingFailureScope='retry-retention'`, `maskedFailedPolicy='reconcile'`, `providerFailurePolicy='report-only'`, `requireActiveShard=true`).
2. Core resolves active embedder from main `vec_metadata` and attaches the active shard derived from the active profile slug.
3. Shard metadata is compared (name + dim + provider, null main-provider passes) → `activeShardVerified`; `requireActiveShard` + unverified → fail closed.
4. Dry-run: run bucket aggregate queries (004 `iteration-008.md` §F2 dry-run SQL) and assemble `activeEmbedder`/`safety`/`buckets`/`plannedMutations`.
5. Apply: `BEGIN IMMEDIATE` → (1) vector-present non-success → `success`; (2) if `resetMissing`, missing-vector retry-retention rows → `retry`; `COMMIT`.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `handlers/memory-retention-sweep.ts` and its lib to capture the exact pattern
- [ ] Confirm active-shard resolution anchor (`lib/search/vector-index-store.ts:364-372`)
- [ ] Confirm dimension table + `vec_memories_rowids` join shape from 004 `iteration-008.md` §F2

### Phase 2: Core Implementation
- [ ] Implement `runMemoryEmbeddingReconcile()` core logic + buckets + dry-run schema (REQ-001)
- [ ] Implement apply-mode guarded ordered transaction (REQ-002)
- [ ] Implement args defaults + fail-closed guards (REQ-003)
- [ ] Add thin handler and wire all six registration surfaces

### Phase 3: Verification
- [ ] Write the 7-scenario vitest suite (REQ-004)
- [ ] `npm run build` green
- [ ] Full vitest suite green, no regressions
- [ ] Documentation reconciled (spec/plan/tasks/checklist/implementation-summary)


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Bucket counting, shard verification, args defaults, fail-closed guard | Vitest |
| Integration | Apply transaction ordering + idempotency against a seeded SQLite fixture | Vitest + better-sqlite3 |
| Build | TypeScript compile + tool/handler registration integrity | `npm run build` |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Active vector shard + `vec_metadata` | Internal | Green | Cannot verify shard → reconcile fails closed |
| `memory_retention_sweep` handler pattern | Internal | Green | No reference for handler/lib/registration shape |
| better-sqlite3 + attached shard | Internal | Green | Cannot run guarded SQL |
| 004 acceptance contract (iteration-008/010, research §7-§8) | Internal | Green | No precise bucket schema / SQL |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Tool mutates unexpected rows, registration breaks an existing tool, or build/tests fail.
- **Procedure**: Revert the packet commits (new lib + handler + registration edits); the tool is additive so removal restores prior behavior.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup/Pattern study) ──> Phase 2 (Core + Handler + Registration) ──> Phase 3 (Tests + Build + Docs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |


<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup / pattern study | Low | 30-45 minutes |
| Core logic + handler + registration | Medium | 3-4 hours |
| Tests + build + docs reconcile | Medium | 2-3 hours |
| **Total** | | **5.5-7.75 hours** |


<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Dry-run verified against current DB (expected near-zero buckets)
- [ ] No feature flag required (additive maintenance tool)
- [ ] Build + vitest green before any apply run

### Rollback Procedure
1. **Immediate**: Do not call the tool in `apply` mode if dry-run buckets look unexpected.
2. **Revert code**: `git revert` the packet commits (new files + registration edits).
3. **Database**: No DB rollback needed — apply only converges `embedding_status`; it never deletes rows. If an erroneous apply occurred, re-run a corrected dry-run to confirm convergence state.
4. **Verify**: Confirm the tool is de-registered and existing tools load cleanly.
5. **Notify**: Note in the spec packet if any apply was run against the live DB.

### Data Reversal
- **Has data migrations?** No schema migration; apply only updates `embedding_status` and adjacent retry/failure columns.
- **Reversal procedure**: No destructive reversal needed; rows are preserved (no deletes).

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
