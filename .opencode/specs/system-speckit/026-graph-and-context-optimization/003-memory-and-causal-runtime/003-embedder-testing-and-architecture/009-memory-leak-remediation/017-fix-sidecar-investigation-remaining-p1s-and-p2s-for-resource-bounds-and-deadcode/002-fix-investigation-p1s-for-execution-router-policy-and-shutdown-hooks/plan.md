---
title: "Plan: Investigation P1 Fixes for Execution-Router Policy and Shutdown Hooks"
description: "Canonical-anchor plan for closing F6, F31, F52, F53, F58, F61, and F74 in execution-router.ts."
trigger_phrases:
  - "arc 010 003 002 plan"
  - "execution-router p1 policy shutdown fallback plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks"
    last_updated_at: "2026-05-23T06:22:00Z"
    last_updated_by: "codex"
    recent_action: "completed-execution-router-plan"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "plan.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0100030020100030020100030020100030020100030020100030020100030020"
      session_id: "010-003-002-execution-router-p1"
      parent_session_id: null
    completion_pct: 100
---

# Plan: Investigation P1 Fixes for Execution-Router Policy and Shutdown Hooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js MCP server embedder routing |
| **Findings** | F6, F31, F52, F53, F58, F61, F74 |
| **Evidence** | Arc 010/001 `findings-registry.json`; phase parent 010/003 |

This phase hardens the embedder execution router by splitting test-only exports away from the production API, making resolver/logging boundaries explicit, pruning dead dimension fallback branches, and simplifying shutdown signal registration.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase parent scope confirms this child owns only execution-router source, execution-router tests, optional testables seam, and this packet's docs.
- [x] Registry rows for F6, F31, F52, F53, F58, F61, and F74 are identified.
- [x] F37 precedent from 010/002/004 is loaded for production/test API separation.

### Definition of Done
- [x] All 7 P1 finding rows are closed in `checklist.md` with evidence.
- [x] Fallback and mismatch behavior have focused fixtures in `execution-router.vitest.ts`.
- [x] Embedder vitest, MCP server typecheck, and strict spec validation exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Invariants Enforced
- Production `execution-router.ts` no longer exports a `__embedderExecutionRouterTestables` aggregate.
- Tests use `execution-router.testables.ts` as the explicit test-only import path.
- `resolveExecutionPolicy()` is pure; `logPolicyResolution()` owns policy warning side effects.
- Dimension resolution has two effective sources: explicit/configured dimensions, then default startup profile fallback.
- Default profile mismatch emits a warning instead of silently returning dimensions for a different provider/model.
- Process signal handling uses one shared handler for SIGINT, SIGTERM, and SIGHUP.
- `DirectProviderAdapter.ready()` is removed because production has zero callers.

### Affected Surfaces

| Surface | Findings | Invariant |
|---------|----------|-----------|
| Production router exports | F6 | No production `__*Testables` export; named internals support a separate test seam. |
| Policy resolver | F31 | Pure resolver plus caller-side logging helper. |
| Dimension resolver | F52, F61 | Dead fallback branch removed; mismatch warning covered by tests. |
| Shutdown hooks | F53, F58 | Shared signal handler; best-effort async cleanup documented. |
| Direct adapter | F74 | Zero-caller readiness method deleted. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `execution-router.ts` | Router, resolver, adapter cache owner | Modify only finding-local helpers and adapter class | Typecheck + vitest |
| `execution-router.testables.ts` | Test-only seam | Create separate module importing named internals | Test import path proves separation |
| `execution-router.vitest.ts` | Fixture coverage | Create focused tests for policy, fallback, warning, hooks, ready deletion | Vitest embedder suite |
| Production callers | Use `getEmbedderAdapter()`, snapshot, shutdown | No direct import of testables or removed ready method | `rg` evidence |

Required inventories:
- Same-class producers: `rg -n "resolveExecutionPolicy|resolveDimensions|registerShutdownHooks|ready\\(|__embedderExecutionRouterTestables" .opencode/skills/system-spec-kit/mcp_server`.
- Consumers of changed symbols: `rg -n "getEmbedderAdapter|shutdownAllSidecars|execution-router.testables|__embedderExecutionRouterTestables" .opencode/skills/system-spec-kit/mcp_server`.
- Matrix axes: execution policy env (`unset`, `auto`, `direct`, `sidecar`, `invalid`), dimensions (`explicit`, `default-match`, `default-mismatch`), hooks (`beforeExit`, `SIGINT`, `SIGTERM`, `SIGHUP`).
- Algorithm invariant: resolver output must be deterministic for the same env/profile inputs; warning side effects are separate and test-spied.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Read packet docs, phase parent, findings registry, F37 precedent, `execution-router.ts`, and current embedder tests. Validate scaffold before source edits.

### Phase 2: Core Implementation
Extract the testables object to `execution-router.testables.ts`, split policy logging from resolution, collapse dimension fallback and add mismatch warning, simplify shutdown signals with a shared handler, document best-effort async cleanup, and delete `DirectProviderAdapter.ready()`.

### Phase 3: Verification
Add fixture tests, run embedder vitest, run MCP server typecheck, fill checklist/ADR/implementation summary with evidence, and run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Finding | Required Test |
|---------|---------------|
| F6 | Tests import `__embedderExecutionRouterTestables` from `execution-router.testables.ts`; production module no longer exports that symbol. |
| F31 | Invalid policy returns `auto`; warning is emitted by `logPolicyResolution()` or caller flow, not resolver-only call. |
| F52 | Explicit dimensions and default fallback are the reachable paths; dead third branch is absent by behavior and ADR. |
| F53/F58 | Hook registration attaches one shared signal handler for SIGINT, SIGTERM, and SIGHUP and keeps beforeExit cleanup best-effort. |
| F61 | Mismatched provider/model default fallback emits stderr warning. |
| F74 | Direct adapter instances expose no `ready` method. |
| All | Embedder vitest, MCP server typecheck, and strict validation pass. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@spec-kit/shared/embeddings` startup profile | Runtime import | Available | F52/F61 fixtures mock profile behavior. |
| `@spec-kit/shared/embeddings/factory` | Runtime import | Available | Direct adapter fixtures mock provider factory when needed. |
| Vitest module mocking | Test infrastructure | Available | Needed for deterministic profile, adapter, and factory tests. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If verification fails, revert only `execution-router.ts`, `execution-router.testables.ts`, `execution-router.vitest.ts`, and this packet's docs. No sidecar-worker, sidecar-client, launcher, reindex, registry, schema, type, or barrel files are in rollback scope.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Setup | Arc 010/001 evidence, 010/002/004 precedent, generated scaffold | Phase 2 implementation |
| Phase 2: Core Implementation | Current router/test files | Phase 3 verification |
| Phase 3: Verification | Successful source/test edits | Parent handoff and later phase 003 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| API seam cleanup | Small | F6 and F74 are low-risk export/surface cleanup. |
| Resolver/fallback changes | Medium | F31, F52, and F61 need fixture coverage. |
| Shutdown hook simplification | Small | F53 and F58 share one best-effort hook edit plus ADR. |
| Documentation and validation | Small | Canonical anchors, ADRs, checklist evidence, strict validate. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Record any failed verification command in `implementation-summary.md` with exit code and stderr summary. Do not advance phase 003 if embedder vitest, typecheck, or strict validation fails.
<!-- /ANCHOR:enhanced-rollback -->
