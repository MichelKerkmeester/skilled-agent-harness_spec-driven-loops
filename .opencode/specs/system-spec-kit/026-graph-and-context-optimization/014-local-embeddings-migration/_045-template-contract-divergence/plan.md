---
title: "Implementation Plan: 044 Template contract divergence [template:level_2/plan.md]"
description: "Trace the strict validator and memory_save contracts, then align memory_save so canonical spec docs use the spec-doc health contract instead of generated-memory wrapper sections."
trigger_phrases:
  - "044 implementation plan"
  - "memory_save contract bypass plan"
  - "spec doc health save plan"
  - "template contract divergence plan"
importance_tier: "important"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/_045-template-contract-divergence"
    last_updated_at: "2026-05-14T16:49:00Z"
    last_updated_by: "codex"
    recent_action: "Plan executed: reproduce, map, patch, test, document"
    next_safe_action: "Use this packet as the reference for future save/validate contract alignment"
    blockers: []
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 044 Template contract divergence

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Bash validation scripts |
| **Framework** | system-spec-kit MCP server and spec validator |
| **Storage** | Local SQLite memory DB for handler dry-run setup |
| **Testing** | Vitest, TypeScript typecheck, strict spec validation |

### Overview

The fix keeps two contracts separate. Generated memory files still use `validateMemoryTemplateContract()`, while canonical spec docs that already satisfy `evaluateSpecDocHealth()` can bypass generated-memory wrapper violations in manual-fallback mode.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.

### Definition of Done
- [x] Divergence reproduced on 040 implementation summary.
- [x] Source patch applied.
- [x] Regression test passing.
- [x] 044 packet strict validation passing.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Predicate refinement in the existing memory-save gate.

### Key Components
- **`validateMemoryTemplateContract()`**: Generated-memory wrapper contract. It still reports violations for canonical spec docs, but those violations are no longer blocking when spec-doc health passes.
- **`evaluateSpecDocHealth()`**: Canonical spec-doc health contract used as the acceptance predicate for V2.2 spec docs.
- **`shouldBypassTemplateContract()`**: Shared predicate used by dry-run and full save processing.

### Data Flow

`handleMemorySave()` parses the file, runs quality loop and sufficiency checks, evaluates template contract, annotates spec-doc health, and then decides whether template-contract violations are blocking. The patch adds canonical spec-doc type and `specDocHealth.pass` to that final decision.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `memory-save.ts` template bypass predicate | Decides whether template-contract violations block save and dry-run | Modified to accept canonical spec docs with passing spec-doc health | Focused dry-run reproduction and full save-pipeline Vitest |
| `memory-save-pipeline-enforcement.vitest.ts` | Regression suite for save pipeline gate ordering | Added canonical spec-doc dry-run acceptance test | 59/59 tests passed |
| `validate.sh` strict validator | Canonical spec-folder validation | Unchanged | 037, 040, and 044 strict validation passed |

Required inventories:
- Same-class producers: `rg -n "shouldBypassTemplateContract|validateMemoryTemplateContract|specDocHealth" .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skills/system-spec-kit/mcp_server -S`.
- Consumers of changed symbol: `rg -n "shouldBypassTemplateContract\\(" .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`.
- Matrix axes: generated-memory wrapper file versus canonical spec doc; `specDocHealth.pass` true versus false; sufficiency pass versus fail; dry-run versus full save path.
- Algorithm invariant: wrapper-contract bypass requires manual-fallback classification, sufficiency pass, invalid template contract, and either the legacy evidence-only bypass or a recognized canonical spec-doc type with passing spec-doc health.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold Level 2 packet at the pre-bound phase path.
- [x] Reproduce strict validation pass on 040.
- [x] Reproduce memory-save dry-run rejection envelope.

### Phase 2: Core Implementation
- [x] Trace save-side contract sources and strict validator sources.
- [x] Patch `shouldBypassTemplateContract()`.
- [x] Add regression coverage.

### Phase 3: Verification
- [x] Run focused and full Vitest coverage for save pipeline.
- [x] Run MCP server typecheck.
- [x] Run strict validation on existing and new packets.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Canonical spec-doc dry-run acceptance | Vitest |
| Integration-style handler check | 040 dry-run before and after fix | `node --import tsx` invoking `handleMemorySave()` |
| Static | TypeScript compile health | `npm run typecheck --workspace=@spec-kit/mcp-server` |
| Spec validation | 037, 040, 044 packets | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Local TypeScript workspace | Internal | Green | Needed for handler tests and typecheck. |
| Existing 053 compliant fixture | Internal test fixture | Green | Used to test canonical spec-doc dry-run acceptance. |
| 040 packet | Internal evidence fixture | Green | Used to reproduce the divergence. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Generated-memory malformed files start passing unexpectedly or canonical spec docs with failed health bypass template contract.
- **Procedure**: Revert the `CANONICAL_SPEC_DOCUMENT_TYPES` addition and extended `shouldBypassTemplateContract()` predicate, then rerun the save-pipeline suite.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Reproduce -> Map contracts -> Patch predicate -> Regression test -> Strict validate
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Reproduce | 040 packet fixture | Contract mapping |
| Contract mapping | Reproduction output | Fix direction |
| Patch | Fix direction | Verification |
| Verification | Patch and test | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and reproduction | Medium | 30 minutes |
| Core implementation | Medium | 45 minutes |
| Verification and docs | Medium | 45 minutes |
| **Total** | | **2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration.
- [x] No feature flag required.
- [x] Existing generated-memory rejection tests still pass.

### Rollback Procedure
1. Revert `memory-save.ts` predicate changes.
2. Remove the canonical spec-doc dry-run regression test.
3. Rerun `env -u EMBEDDINGS_PROVIDER npx vitest run tests/memory-save-pipeline-enforcement.vitest.ts`.
4. Rerun strict validation on affected packets.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
