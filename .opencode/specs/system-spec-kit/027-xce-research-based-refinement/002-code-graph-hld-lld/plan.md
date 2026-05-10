---
title: "Implementation Plan: 027/002 Code Graph HLD/LLD"
description: "Plan for deterministic HLD/LLD generation with explicit sorting, unresolved-edge policy, public role classifier, and optional omni wire integration."
trigger_phrases:
  - "027 001 hld lld plan"
  - "code graph hld lld plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-code-graph-hld-lld"
    last_updated_at: "2026-05-09T06:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned plan.md with manifest anchors and pt-02 amendments"
    next_safe_action: "Choose unresolved-edge policy before implementing generator"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-09-027-alignment-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Filter dangling dependencies or emit structured unresolved records."
    answered_questions:
      - "Use template-only deterministic generation for MVP."
---
# Implementation Plan: 027/002 Code Graph HLD/LLD

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | system-spec-kit MCP server |
| **Storage** | Existing code_graph SQLite tables |
| **Testing** | Vitest, `npm run check`, spec validator |

### Overview
Phase 002 adds a deterministic HLD/LLD narrative layer on top of existing graph data. The amended plan makes determinism and cross-phase contracts explicit before implementation: stable sorting before caps, a single dangling-edge policy, an open-string `file_role` contract, and an exported `classifyFileRole(filePath, db)` function.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Unresolved-edge policy selected.
- [ ] `file_role` open-string baseline and reserved labels documented.
- [ ] Omni integration either kept with full wire-contract scope or removed from this phase.

### Definition of Done
- [ ] `code_graph_hld_lld` handler and tool registration work.
- [ ] Determinism, dangling-edge, primary-module, classifier, and omni tests pass.
- [ ] `npm run check`, targeted Vitest, and strict spec validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic generator library plus MCP handler.

### Key Components
- **`code-graph-hld-lld.ts`**: owns HLD/LLD schema, role/layer helpers, stable sorting, and dependency row rendering.
- **`handlers/hld-lld.ts`**: owns readiness checks, input validation, and MCP response envelope.
- **`code-graph-context.ts` / `handlers/context.ts`**: optional omni wire integration if kept in this phase.

### Data Flow
The handler validates a target path or symbol, reads existing graph rows from SQLite, generates deterministic HLD and LLD payloads, and returns JSON-serializable output. Omni mode must preserve the same payload through the existing context handler serialization path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `code_graph/lib/code-graph-hld-lld.ts` | New generator | Create | Unit tests for all amended requirements |
| `code_graph/handlers/hld-lld.ts` | New MCP handler | Create | Handler call + JSON parse test |
| `code_graph/lib/code-graph-context.ts` | Existing context result type | Update only if omni kept | Integration test verifies `hld_lld` serialized |
| `code_graph/handlers/context.ts` | Existing context input parser | Update only if omni kept | Handler accepts `queryMode:'omni'` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Define interfaces and helper contracts.
- [ ] Choose unresolved-edge policy.
- [ ] Define stable sort helper and file-role domain.

### Phase 2: Core Implementation
- [ ] Implement HLD/LLD generator functions.
- [ ] Implement handler and tool registration.
- [ ] Implement full omni wire contract or remove omni from scope.

### Phase 3: Verification
- [ ] Add deterministic, dangling-edge, primary-module, classifier, and serialization fixtures.
- [ ] Run `npm run check`.
- [ ] Run targeted Vitest with coverage and strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | HLD/LLD helpers, sorting, dependency rows, role/layer helpers | Vitest |
| Integration | MCP handler and optional omni JSON serialization | Vitest |
| Validation | Spec folder structure and anchors | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing code_graph DB APIs | Internal | Available | Generator cannot read symbols or edges |
| Existing context handler | Internal | Available | Omni integration cannot be wired |
| Phase 003 | Downstream | Pending | Consumes `classifyFileRole` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: HLD/LLD handler breaks existing MCP registration or omni serialization.
- **Procedure**: Revert the implementation commit; if omni was included, ensure `QueryMode` and `ContextResult` return to the prior contract in the same revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core implementation |
| Core implementation | Setup | Verification |
| Verification | Core implementation | Phase 003 trace work |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 30-45 minutes |
| Core Implementation | Medium | 2-3 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **3.5-5.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Keep changes in one implementation commit.
- [ ] Confirm no schema migration is introduced.
- [ ] Confirm optional omni scope is explicit.

### Rollback Procedure
1. Revert the implementation commit.
2. Run `npm run check`.
3. Run context handler tests to confirm prior behavior.
4. Re-run strict validation for the packet.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
