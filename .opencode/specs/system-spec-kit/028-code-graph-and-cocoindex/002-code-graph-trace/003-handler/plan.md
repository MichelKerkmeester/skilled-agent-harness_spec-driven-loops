---
title: "Implementation Plan: 027/003/003 Trace Handler"
description: "Plan for handlers/trace.ts and optional tool registration."
trigger_phrases:
  - "027 003 003 plan"
  - "trace handler plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/003-handler"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded trace handler plan"
    next_safe_action: "Implement handler after local contract publishes"
    blockers:
      - "system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/001-contract"
    key_files: ["spec.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-12-027-003-003-handler-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 027/003/003 Trace Handler

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | MCP code graph handlers |
| **Storage** | Delegated to trace tool |
| **Testing** | Vitest handler tests and `npm run check` |

Build a thin handler around the trace contract. The handler validates input, checks readiness, delegates to `TraceTool`, and formats the existing response envelope.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Local `001-contract` is complete.
- [ ] Existing handler/readiness patterns are identified.

### Definition of Done
- [ ] Handler validates input and delegates to contract.
- [ ] Tool registration path is complete or assigned to integration work.
- [ ] Strict child validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin MCP handler.

### Key Components
- **Input schema**: zod validation.
- **Readiness guard**: existing code-graph readiness helper.
- **TraceTool delegation**: call contract interface.
- **Response envelope**: existing MCP response helper.

### Data Flow
MCP input is parsed, readiness is checked, the trace tool is called, and the result is returned through the standard code-graph response path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/trace.ts` | New handler | Create | Handler test |
| `code-graph-tools.ts` | Tool registry | Modify if needed | MCP tool listing or registry test |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read existing code graph handler patterns.
- [ ] Import trace contract.

### Phase 2: Implementation
- [ ] Add zod schema.
- [ ] Add readiness check.
- [ ] Delegate to trace tool and format response.
- [ ] Register `code_graph_trace` if in scope.

### Phase 3: Verification
- [ ] Add/coordinate handler tests.
- [ ] Run type checks and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Input validation and delegation | Vitest |
| Integration | Tool registration | Existing registry tests |
| Validation | Child packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-contract` | Local | Pending | Handler cannot type against trace tool |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Handler breaks existing tool registration or readiness behavior.
- **Procedure**: Remove `handlers/trace.ts` and unregister `code_graph_trace`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `001-contract` | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Tool integration |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Implementation | Low | 45 minutes |
| Verification | Low | 30 minutes |
| **Total** | | **~1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No data migrations. Revert handler and registry changes, then rerun handler tests.
<!-- /ANCHOR:enhanced-rollback -->
