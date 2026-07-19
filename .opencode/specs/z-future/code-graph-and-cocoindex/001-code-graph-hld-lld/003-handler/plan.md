---
title: "Implementation Plan: 003 Handler"
description: "Plan for adding the code_graph_hld_lld MCP handler and optional omni wire integration."
trigger_phrases:
  - "027 phase 002 handler plan"
  - "code_graph_hld_lld handler plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/001-code-graph-hld-lld/003-handler"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded handler plan"
    next_safe_action: "Wait for 001-contract"
    blockers:
      - "001-contract"
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-002-003-handler-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: 003 Handler

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
| **Storage** | Existing code_graph SQLite tables through library |
| **Testing** | Vitest handler integration via child 004 |

### Overview

This child owns the MCP surface extracted from the parent plan: handler, validation, readiness reuse, tool registration, and optional omni wire integration. It should use the contract from `001-contract` and call the generator implemented by `002-lib-impl`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `001-contract` has shipped.
- [ ] Handler request and response contract is known.
- [ ] Omni decision is explicit.

### Definition of Done
- [ ] Tool is registered.
- [ ] Handler returns structured success and error payloads.
- [ ] Optional omni payload is fully wired or removed from scope.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin MCP handler over deterministic generator library.

### Key Components
- **Handler**: Input validation, readiness checks, response envelope.
- **Tool registration**: Adds `code_graph_hld_lld` to code graph tools.
- **Optional omni integration**: Adds and serializes `hld_lld` only if kept in scope.

### Data Flow
MCP input enters the handler, passes readiness and schema validation, calls the contract-backed generator, and returns a JSON-serializable response.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/hld-lld.ts` | New MCP handler | Create | Handler integration tests |
| `tools/code-graph-tools.ts` | Tool registry | Modify | Tool listing or metadata test |
| `code-graph-context.ts` | Context result contract | Modify if omni remains | Serialization test |
| `handlers/context.ts` | Context request parser | Modify if omni remains | JSON parse integration test |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Import contract types.
- [ ] Reuse readiness helper or mirror existing context handler pattern.
- [ ] Decide omni keep/remove path.

### Phase 2: Core Implementation
- [ ] Implement handler validation and dispatch.
- [ ] Register `code_graph_hld_lld`.
- [ ] Wire optional omni contract completely if kept.

### Phase 3: Verification
- [ ] Run handler integration tests from child 004.
- [ ] Run typecheck and strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Handler request, response, and JSON serialization | Vitest |
| Static | Tool registration and type compatibility | TypeScript |
| Validation | Child spec structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-contract` | Internal | Pending | Handler cannot type inputs or output |
| `002-lib-impl` | Internal | Parallel after contract | Final runtime handler cannot call generator |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Tool registration breaks MCP startup or omni serialization.
- **Procedure**: Revert handler and registry edits; if omni was touched, revert all QueryMode/ContextResult/parser/serialization changes together.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `001-contract` | Handler implementation |
| Handler implementation | Setup | Verification |
| Verification | Handler implementation | Release |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Handler implementation | Medium | 45-75 minutes |
| Verification | Medium | 30 minutes |
| **Total** | | **1.5-2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm tool registration diff is minimal.
- [ ] Confirm omni edits are grouped if included.

### Rollback Procedure
1. Revert handler and tool registration changes.
2. Revert all omni wire edits together if they exist.
3. Run handler tests and strict validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
