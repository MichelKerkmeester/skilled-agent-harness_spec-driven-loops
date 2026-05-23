---
title: "Plan: Investigation P2 Cleanup Sweep"
description: "Surface-by-surface cleanup plan for 68 P2 findings with behavior-changing findings deferred."
trigger_phrases:
  - "arc 010 003 005 plan"
  - "embedder p2 cleanup plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep"
    last_updated_at: "2026-05-23T07:05:00Z"
    last_updated_by: "codex"
    recent_action: "completed-cleanup-plan"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0100030050100030050100030050100030050100030050100030050100030050"
      session_id: "010-003-005-p2-cleanup"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Investigation P2 Cleanup Sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS, Node |
| **Framework** | Spec Kit MCP server embedder modules |
| **Storage** | SQLite / sqlite-vec paths in existing code |
| **Testing** | Vitest + TypeScript typecheck |

### Overview
Process the 68 P2 registry findings by current source evidence. Apply comment, export, helper, type, and SQL hygiene edits where behavior stays stable; defer public API, runtime policy, security hardening, and test-only export removals that require broader packets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Registry F-IDs and source files read.
- [x] Sibling canonical-anchor packet read.
- [x] Level 2 packet scaffold strict validation passed.

### Definition of Done
- [x] Each F-ID is marked closed or deferred.
- [x] Regression commands pass or equivalent path correction is documented.
- [x] Strict validation passes after docs are finalized.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical leaf cleanup inside existing embedder modules.

### Key Components
- **Reindex**: job-row normalization, vector-write helpers, shard metadata writes.
- **Sidecar client/worker**: type surface and worker request hygiene.
- **Execution router**: provider normalization and adapter cache surface.
- **CJS launcher**: ensure-sidecar exports and parser naming.
- **Barrel/schema**: public re-export hygiene and helper-chain simplification.

### Data Flow
No data-flow changes. Existing callers continue to use the same embedder, sidecar, reindex, and active-embedder pathways.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `reindex.ts` | Reindex job orchestration and vector writes | Internal cleanup only | Embedder vitest + typecheck |
| `sidecar-client.ts` | Worker lifecycle client | Docs and type export cleanup | Embedder vitest + typecheck |
| `ensure-rerank-sidecar.cjs` | Cross-encoder sidecar launcher | Export pruning and parser split | CJS launcher vitest |
| `execution-router.ts` | Adapter selection/cache | Provider normalization cleanup | Embedder vitest + typecheck |
| `sidecar-worker.ts` | Forked worker protocol | Type and parse cleanup | Embedder vitest + typecheck |
| `index.ts` / `schema.ts` | Barrel and active embedder schema helpers | Export/comment/helper cleanup | Typecheck |

Required inventories were performed with `rg` for changed symbols and current importers before deletion.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold child packet.
- [x] Validate scaffold with strict validation.
- [x] Read registry and source files.

### Phase 2: Core Implementation
- [x] Batch 1: reindex cleanup.
- [x] Batch 2: sidecar-client cleanup.
- [x] Batch 3: ensure-rerank-sidecar cleanup.
- [x] Batch 4: execution-router cleanup.
- [x] Batch 5: sidecar-worker cleanup.
- [x] Batch 6: barrel/schema cleanup.

### Phase 3: Verification
- [x] Run embedder vitest regression.
- [x] Run CJS launcher vitest regression.
- [x] Run MCP server typecheck.
- [x] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | MCP embedder tests | `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` |
| Regression | CJS launcher tests | `node skills/system-spec-kit/mcp_server/node_modules/vitest/vitest.mjs run bin/lib/ensure-rerank-sidecar.vitest.ts --config vitest.config.bin.ts` from `.opencode` |
| Static | MCP server TypeScript | `npm run typecheck --workspace=@spec-kit/mcp-server` |
| Docs | Packet strict validation | `validate.sh <packet> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Arc 010/001 findings registry | Internal | Available | Source of F-ID scope |
| Vitest binary location | Tooling | Path-adjusted | Root command path absent; equivalent installed binary used |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any regression tied to a cleanup deletion or inline.
- **Procedure**: Revert the specific source-file hunk and move the affected F-ID to deferred in `checklist.md`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup -> Batch cleanup -> Regression -> Docs/validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Batch cleanup |
| Batch cleanup | Registry/source reads | Regression |
| Regression | Source edits | Completion |
| Docs | Closure/defer classifications | Handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Completed |
| Core Implementation | Medium | Completed |
| Verification | Medium | Completed |
| **Total** | | **Completed in-session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No commit performed.
- [x] Dirty worktree entries outside packet left untouched.
- [x] Behavioral findings deferred.

### Rollback Procedure
Use targeted reverse patches for this packet's source hunks only.
<!-- /ANCHOR:enhanced-rollback -->
