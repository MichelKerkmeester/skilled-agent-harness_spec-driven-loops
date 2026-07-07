---
title: "Implementation Plan: Scope-Change Guard"
description: "Add a scope-fingerprint promotion guard to code_graph_scan, expose forceScopeChange, and verify F-002 behavior with targeted regression tests."
trigger_phrases:
  - "026/007/012/005 plan"
  - "scope-change guard plan"
  - "forceScopeChange schema"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/008-real-world-usefulness-test-planning/006-scope-change-scan-guard"
    last_updated_at: "2026-05-06T07:44:35Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Completed scope-fingerprint guard"
    next_safe_action: "Review and commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "026-007-012-006-scope-change-scan-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Scope-Change Guard

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, NodeNext ESM |
| **Framework** | system-spec-kit MCP server |
| **Storage** | Existing SQLite `code_graph_metadata` key-value metadata |
| **Testing** | Vitest plus `npm run build` and strict spec validation |

### Overview
Add an explicit scope-change promotion guard after candidate scan counting and before stale-file pruning. The guard compares `getStoredCodeGraphScope().fingerprint` with `scopePolicy.fingerprint`, blocks destructive promotion over populated graphs unless `forceScopeChange: true` is present, and leaves the existing zero-node guard responsible for same-scope empty scans.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Council decision selected Option B: scope fingerprint.
- [x] Target spec folder pre-approved by user.
- [x] Existing zero-node guard and schema surfaces read before editing.

### Definition of Done
- [x] Scope-mismatched nonzero scan test fails before implementation and passes after implementation.
- [x] `forceScopeChange` accepted by public and internal schemas.
- [x] Same-scope shrink test passes to prove no ratio-based block.
- [x] Dist files rebuilt through `npm run build`.
- [x] Targeted and directory vitest commands pass.
- [x] Strict validation passes for child and parent packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fail-closed scan promotion guard in the MCP handler, using existing DB metadata helpers and existing response envelope style.

### Key Components
- **`handleCodeGraphScan()`**: owns scan policy resolution, candidate indexing, guard predicates, and promotion side effects.
- **`getStoredCodeGraphScope()`**: reads prior live graph scope metadata from `code_graph_metadata`.
- **`scopePolicy.fingerprint`**: current candidate scan fingerprint from `resolveIndexScopePolicy()`.
- **`forceScopeChange`**: explicit operator override for intentional populated graph replacement.

### Data Flow
The scan handler resolves the candidate scope, runs `indexFiles()`, computes prior stats and candidate node count, and then checks scope mismatch before any destructive full-scan reconciliation. If blocked, it records a failed scan and returns the prior graph totals. If not blocked, the existing scan persistence path continues unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scan.ts` guard predicates | Blocks literal zero-node destructive scans only. | Add `scopeChangePromotionBlocked` before zero-node block. | F-002 vitest cases inspect response and side-effect mocks. |
| `code-graph-db.ts` scope metadata | Stores current live scope fingerprint. | Reuse unchanged. | No new schema or migration; tests mock stored fingerprints. |
| `tool-schemas.ts` | Public MCP JSON schema. | Add `forceScopeChange`. | `tests/tool-input-schema.vitest.ts`. |
| `tool-input-schemas.ts` | Zod validation and allowed-key list. | Add `forceScopeChange`. | `tests/tool-input-schema.vitest.ts`. |
| Dist build output | Runtime JS consumed by MCP server. | Rebuild from source. | `npm run build`. |

Required inventories:
- Same-class producers: `rg -n "forceZeroNodeReset|setCodeGraphScope|getStoredCodeGraphScope|recordCandidateManifest" .opencode/skills/system-spec-kit/mcp_server`.
- Consumers of changed public field: `rg -n "forceScopeChange|forceZeroNodeReset" .opencode/skills/system-spec-kit/mcp_server`.
- Matrix axes: stored fingerprint present/missing, candidate fingerprint same/different, prior graph populated/empty, candidate nodes zero/nonzero, override present/absent.
- Algorithm invariant: no full-scan scope mismatch may mutate live graph state while prior nodes exist unless `forceScopeChange: true` is explicit.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold Level 2 spec folder.
- [x] Read council plan and existing scan guard.
- [x] Read schema and test surfaces.

### Phase 2: Core Implementation
- [x] Add failing F-002 tests for mismatched nonzero scan, forced replacement, and same-scope shrink.
- [x] Add `forceScopeChange` to `ScanArgs`, tool schema, Zod schema, and allowed-key list.
- [x] Add scope-change blocked response before zero-node blocked response.
- [x] Rebuild source to dist.

### Phase 3: Verification
- [x] Run `npm run build` in the MCP server package.
- [x] Run targeted `code-graph-scan` vitest.
- [x] Run all `code_graph/tests/` vitest.
- [x] Run tool-input schema vitest.
- [x] Run `verify_alignment_drift.py` on changed source scope.
- [x] Run strict child and parent spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Scope-mismatched nonzero scan blocks over populated graph. | `npx vitest run code_graph/tests/code-graph-scan.vitest.ts` |
| Regression | `forceScopeChange` permits intentional nonzero scope replacement. | `npx vitest run code_graph/tests/code-graph-scan.vitest.ts` |
| Regression | Same-scope dramatic nonzero shrink is allowed. | `npx vitest run code_graph/tests/code-graph-scan.vitest.ts` |
| Schema | `forceScopeChange` accepted by scan controls. | `npx vitest run tests/tool-input-schema.vitest.ts` |
| Build | Source and dist synchronization. | `npm run build` |
| Spec | Packet docs and parent metadata. | `validate.sh <spec-folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing scope fingerprint metadata | Internal | Green | Guard can reuse stored fingerprints without DB migration. |
| Existing zero-node guard response style | Internal | Green | Scope-change block can mirror the established failed-scan envelope. |
| Vitest mocks in `code-graph-scan.vitest.ts` | Internal | Green | New tests can assert side effects without live DB mutation. |
| `npm run build` | Tooling | Green | Required to update dist files. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Scope-change guard blocks intended operational scans without an explicit override path, or schemas fail to expose the new override.
- **Procedure**: Revert the Phase 005 source/schema/test changes and rebuild dist. The DB schema remains unchanged, so rollback has no data migration step.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Read existing guard -> Add regression tests -> Implement predicate -> Rebuild dist -> Verify suites
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | User-provided council plan | Implementation |
| Tests | Existing vitest mock shape | Handler change |
| Handler/schema | Tests and file reads | Build and verification |
| Verification | Implementation and dist rebuild | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20-30 minutes |
| Core Implementation | Medium | 45-75 minutes |
| Verification | Medium | 30-60 minutes |
| **Total** | | **2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm no DB schema migration was added.
- [x] Confirm `forceScopeChange` is documented in the tool schema.
- [x] Confirm existing `forceZeroNodeReset` behavior still has coverage.

### Rollback Procedure
1. Revert the handler predicate and blocked response.
2. Remove `forceScopeChange` from source schemas and tests.
3. Run `npm run build`.
4. Run the same vitest and strict validation commands to prove rollback consistency.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
