---
title: "Implementation Plan: Code Graph RPC Classifier Surface"
description: "Add a classifier MCP tool to mk-code-index and route spec-kit query intent classification through it."
trigger_phrases:
  - "021 implementation plan"
  - "codegraph rpc surface plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/021-codegraph-rpc-surface"
    last_updated_at: "2026-05-15T09:20:31Z"
    last_updated_by: "codex"
    recent_action: "Planned classifier RPC implementation"
    next_safe_action: "Run verification"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Code Graph RPC Classifier Surface

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, NodeNext ESM |
| **Framework** | MCP SDK stdio server/client |
| **Storage** | None for this tool |
| **Testing** | Vitest, TypeScript typecheck, MCP CLI smoke |

### Overview
The code-graph package adds a small MCP handler around its existing query-intent classifier and registers it as the eleventh `mk-code-index` tool. Spec-kit keeps the same boundary module as the integration point, but the classifier export now calls `callCodeGraphTool('code_graph_classify_query_intent', { query })` and `memory_context` awaits the result.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified: `mk-code-index` launcher, code-graph build artifacts, spec-kit RPC boundary.

### Definition of Done
- [x] New MCP tool listed by schema and live MCP SDK tools output.
- [x] Spec-kit local shim removed.
- [x] Targeted tests and typechecks pass.
- [x] Strict validation passes for packet 021 and parent.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Process-boundary adapter: code-graph owns classifier logic, `mk-code-index` exposes it, and spec-kit consumes it only through an MCP RPC wrapper.

### Key Components
- **Code-graph tool schema**: advertises `code_graph_classify_query_intent` with required `query`.
- **Code-graph handler**: calls canonical `classifyQueryIntent()` and returns `{ status: 'ok', data }`.
- **Code-graph dispatcher**: validates `query` and routes the tool name to the handler.
- **Spec-kit boundary**: calls the new tool and validates the response shape.
- **Memory context call site**: awaits classification before deciding graph-context augmentation.

### Data Flow
`memory_context` receives user input, calls `classifyQueryIntent()` from `code-graph-boundary.ts`, the boundary starts `mk-code-index` through the existing launcher, `mk-code-index` dispatches `code_graph_classify_query_intent`, and the canonical classifier result returns to spec-kit as the routing signal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `query-intent-classifier.ts` | Owns classifier logic | Unchanged producer | Function-level tests remain in code-graph. |
| `tool-schemas.ts` | Tool manifest | Add one descriptor | Schema count and MCP tools list. |
| `code-graph-tools.ts` | Dispatcher | Add one validation and dispatch case | MCP dispatch test. |
| `code-graph-boundary.ts` | Spec-kit boundary | Replace local classifier body with RPC wrapper | Grep confirms local keyword/pattern shim removed. |
| `memory-context.ts` | Consumer | Await classifier | Typecheck and runtime-routing test. |

Required inventories:
- Same-class producer inventory: `rg -n "classifyQueryIntent" .opencode/skills/system-code-graph/mcp_server .opencode/skills/system-spec-kit/mcp_server`.
- Consumer inventory: `rg -n "code_graph_classify_query_intent|classifyQueryIntent" .opencode/skills/system-code-graph/mcp_server .opencode/skills/system-spec-kit/mcp_server`.
- Matrix axes: schema registration, dispatch success, missing input, spec-kit async consumer, live MCP listing.
- Algorithm invariant: classifier scoring logic remains unchanged in `query-intent-classifier.ts`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Locate packet 020 and confirm the current parent lane.
- [x] Scaffold packet 021 as Level 2.
- [x] Audit code-graph schema, dispatcher, handler, and spec-kit shim patterns.

### Phase 2: Core Implementation
- [x] Add `code_graph_classify_query_intent` descriptor.
- [x] Add `handleClassifyQueryIntent()`.
- [x] Register dispatcher and handler exports.
- [x] Replace spec-kit local shim with RPC wrapper.
- [x] Await classifier in `memory-context.ts`.
- [x] Add focused MCP-dispatch tests and update async spec-kit routing test.

### Phase 3: Verification
- [x] Run code-graph tests and typecheck.
- [x] Run advisor tests.
- [x] Run spec-kit tests and typecheck, recording known baseline behavior.
- [x] Verify live MCP connection and tool listing.
- [x] Strict-validate packet 021 and parent.
- [ ] Prepare scoped commit and push.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Canonical classifier function | `vitest run mcp_server/tests/query-intent-classifier.vitest.ts` |
| Integration | MCP dispatch path | `vitest run mcp_server/tests/handlers/classify-query-intent.vitest.ts` |
| Consumer | Spec-kit RPC-backed classifier use | `vitest run tests/runtime-routing.vitest.ts` |
| Static | TypeScript surfaces | `tsc --noEmit` for code-graph and spec-kit |
| Manual | Live MCP tool list | `opencode mcp list`, `opencode mcp tools mk_code_index` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mk-code-index` launcher | Internal | Green after build | Spec-kit RPC classifier cannot run. |
| Code-graph dist artifacts | Internal generated | Requires rebuild | Live MCP can expose stale 10-tool surface. |
| `@modelcontextprotocol/sdk` | External | Existing dependency | Boundary client and server startup depend on it. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New MCP tool breaks existing mk-code-index startup or spec-kit memory context routing.
- **Procedure**: Revert packet 021 commit. That restores packet 020's local classifier shim and removes the new tool surface.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Core) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Core Implementation | Medium | 45-75 minutes |
| Verification | Medium | 45-90 minutes |
| **Total** | | **2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm scoped git diff excludes unrelated dirty files before staging.
- [x] Confirm live MCP lists 11 tools.
- [x] Confirm spec-kit no longer contains the local shim body.

### Rollback Procedure
1. Revert the packet 021 commit.
2. Rebuild code-graph dist if live MCP artifacts were refreshed.
3. Run the focused runtime-routing test to confirm packet 020 behavior is restored.
4. Re-run strict validation for parent if metadata was reverted.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
