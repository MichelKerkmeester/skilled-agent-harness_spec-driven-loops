---
title: "Plan: Test-Only Barrel Export Cleanup for F44 and F109"
description: "Refactor test imports to direct source modules, then remove production-dead barrel exports with typecheck and vitest verification."
trigger_phrases:
  - "020 001 plan"
  - "F44 F109 direct imports"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/001-fix-deferred-p2s-for-test-only-and-shared-exports"
    last_updated_at: "2026-05-23T10:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed"
    next_safe_action: "Parent agent may commit packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-registry.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0200010200010200010200010200010200010200010200010200010200010200"
      session_id: "020-001-f44-f109-barrel-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Test-Only Barrel Export Cleanup for F44 and F109

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Vitest mcp-server test suite |
| **Storage** | None for this change |
| **Testing** | `vitest`, `npm run typecheck --workspace=@spec-kit/mcp-server` |

### Overview
This packet closes two deferred P2 dead-export findings by removing test dependencies on public barrels. The sequence is consumer proof, test import refactor, typecheck, barrel export deletion, typecheck, embedders vitest, and strict spec validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent 020 scope confirms bucket 6 owns F44 and F109 only.
- [x] Predecessor 017/005 checklist confirms both findings were deferred because tests imported the barrel surface.
- [x] Halt rule documented for any non-test consumer found by grep.

### Definition of Done
- [x] Test consumers import from direct modules.
- [x] Barrel no longer exports the two test-only members.
- [x] Requested typecheck, embedders vitest, and strict spec validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Public barrel minimization with direct test imports for internal validation.

### Key Components
- **Shared embedding registry**: owns `listSupportedDimensions`.
- **Shared embedding types**: owns `EmbedderManifest`.
- **MCP embedders barrel**: exposes production-consumed embedders surface and should not carry test-only exports.

### Data Flow
Production handlers continue to consume manifest data through existing registry functions. Tests that inspect internals import the internal shared modules directly.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/embeddings/registry.ts` | Source function owner for F44 | Read only; keep function available for direct tests | Typecheck and registry vitest |
| `shared/embeddings/types.ts` | Source type owner for F109 | Read only; direct test type import | Typecheck |
| `mcp_server/lib/embedders/index.ts` | Public barrel | Remove `listSupportedDimensions` and `EmbedderManifest` exports | Typecheck after deletion |
| `mcp_server/tests/embedder-registry.vitest.ts` | Test consumer | Repoint imports to source modules | Typecheck after refactor |

Required inventories:
- `rg -l "listSupportedDimensions" .opencode/`
- `rg -l "EmbedderManifest" .opencode/`
- Any live source consumer outside allowed source/barrel definitions triggers ADR escalation and no barrel deletion.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold packet docs.
- [x] Strict-validate scaffold before source edits.
- [x] Read source and test files.

### Phase 2: Core Implementation
- [x] Group F44/F109 grep results into test vs live source.
- [x] Refactor test imports to direct source modules.
- [x] Run mcp-server typecheck after test import refactor.
- [x] Remove the two barrel exports.
- [x] Run mcp-server typecheck after export deletion.

### Phase 3: Verification
- [x] Run requested embedders vitest suite.
- [x] Run final mcp-server typecheck.
- [x] Fill checklist, ADR, and implementation summary.
- [x] Run final strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Compile | Import graph and public barrel deletion | `npm run typecheck --workspace=@spec-kit/mcp-server` |
| Unit | Embedder tests | `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` |
| Spec | Packet contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@spec-kit/mcp-server` workspace | Internal | Green expected | Cannot claim barrel deletion compiles |
| Vitest install under `mcp_server/node_modules` | Internal | Green expected | Cannot prove embedders suite |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Typecheck or embedders vitest fails after import/export edits.
- **Procedure**: Restore the previous test imports and barrel export members, then document the blocker in the checklist/ADR.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Core) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Parent/predecessor docs | Core |
| Core | Test-only consumer proof | Verify |
| Verify | Typecheck after export deletion | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15-30 minutes |
| Core Implementation | Low | 15-30 minutes |
| Verification | Medium | 20-40 minutes |
| **Total** | | **50-100 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration.
- [x] No runtime behavior change intended.
- [x] Typecheck succeeds after each edit stage.

### Rollback Procedure
1. Re-add the removed barrel exports.
2. Revert test imports to the prior barrel imports if direct source imports fail.
3. Re-run typecheck and embedders vitest.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
