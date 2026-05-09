---
title: "Implementation Plan: 027/002 Code Graph Trace"
description: "Plan for filePath-based trace resolution with optional containment display, Phase 001 role reuse, and deferred package metadata."
trigger_phrases:
  - "027 002 trace plan"
  - "code graph trace plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-code-graph-trace"
    last_updated_at: "2026-05-09T06:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned plan.md with manifest anchors and pt-02 filePath amendments"
    next_safe_action: "Wait for Phase 001 classifyFileRole export, then implement trace core"
    blockers:
      - "Phase 001 classifyFileRole export."
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
      - "Choose exact filePath-derived module policy."
    answered_questions:
      - "Do not use fq_name dot splitting as P0 module ownership."
---
# Implementation Plan: 027/002 Code Graph Trace

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
Phase 002 adds a `code_graph_trace` tool that resolves architectural trace output from reliable graph facts. pt-02 corrected the original plan: file and module ownership come from `CodeNode.filePath` and an explicit file-path policy, while CONTAINS/fqName metadata is optional display context.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 `classifyFileRole(filePath, db)` signature exists.
- [ ] Module policy examples are documented.
- [ ] Sparse symbol fixtures are listed before implementation.

### Definition of Done
- [ ] Trace returns valid `symbol`, `file`, and `architectural_role` for sparse and normal symbols.
- [ ] `code_packages` is deferred or redesigned around file paths.
- [ ] Tests and strict validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Resolver library plus MCP handler.

### Key Components
- **`code-graph-trace.ts`**: owns trace construction, filePath module policy, and optional containment display.
- **`handlers/trace.ts`**: owns readiness checks and tool response.
- **Phase 001 `classifyFileRole`**: source of architectural role value.

### Data Flow
The handler receives a symbol id, the library loads the subject `CodeNode`, resolves file ownership from `filePath`, derives module from path policy, decorates the chain with available class/method metadata, and aliases architectural role to Phase 001's file role.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `code_graph/lib/code-graph-trace.ts` | New resolver | Create | Unit and sparse fixture tests |
| `code_graph/handlers/trace.ts` | New MCP handler | Create | Handler integration test |
| Phase 001 `classifyFileRole` | Role source | Consume | Equality contract test |
| `code_packages` | Optional future metadata | Defer or redesign | Checklist deferral evidence |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm Phase 001 export.
- [ ] Define output schema and module policy.

### Phase 2: Core Implementation
- [ ] Implement trace library.
- [ ] Implement handler and tool registration.
- [ ] Implement optional memoization only after P0 trace behavior is correct.

### Phase 3: Verification
- [ ] Add sparse, nested-class, shared-role, and depth-cap fixtures.
- [ ] Run checks and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | file/module resolution, sparse symbols, nested class matching | Vitest |
| Integration | MCP handler and Phase 001 role equality | Vitest |
| Validation | Spec folder structure and anchors | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 `classifyFileRole` | Internal | Pending | Cannot emit authoritative `architectural_role` |
| Existing code_graph DB APIs | Internal | Available | Cannot load symbol/file data |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: trace tool returns incorrect ownership or breaks tool registration.
- **Procedure**: Revert the trace implementation commit and remove `code_graph_trace` registration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 export | Core implementation |
| Core implementation | Setup | Verification |
| Verification | Core implementation | Phase 005 evaluation |
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
- [ ] Keep cache/package work separate or clearly optional.
- [ ] Confirm Phase 001 contract tests pass.

### Rollback Procedure
1. Revert trace implementation commit.
2. Run `npm run check`.
3. Run tool registration tests.

### Data Reversal
- **Has data migrations?** Only if optional cache/package table ships.
- **Reversal procedure**: Drop optional additive table only in the same rollback that introduced it.
<!-- /ANCHOR:enhanced-rollback -->
