---
title: "Feature Specification: Code Graph RPC Classifier Surface"
description: "Expose code-graph query intent classification through mk-code-index and remove the spec-kit local classifier shim."
trigger_phrases:
  - "021 codegraph rpc surface"
  - "code graph classify query intent"
  - "replace spec-kit classifier shim"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/021-codegraph-rpc-surface"
    last_updated_at: "2026-05-15T09:20:31Z"
    last_updated_by: "codex"
    recent_action: "Verified classifier RPC packet"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/tool-schemas.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/classify-query-intent.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts"
    session_dedup:
      fingerprint: "sha256:0210210210210210210210210210210210210210210210210210210210210210"
      session_id: "021-codegraph-rpc-surface-2026-05-15"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Packet 020 left classifier parity as the only code-graph RPC gap."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Code Graph RPC Classifier Surface

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Review |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 020 removed direct source imports from system-spec-kit to system-code-graph, but `classifyQueryIntent()` had no MCP surface to call. The workaround was a local heuristic shim inside `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`, which kept functional behavior but left one duplicated classifier implementation outside code-graph ownership.

### Purpose
Expose the canonical code-graph classifier as `code_graph_classify_query_intent` on `mk-code-index`, then make spec-kit call it through the existing code-graph boundary RPC path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one MCP tool descriptor, handler, and dispatcher case to `system-code-graph`.
- Wrap the existing `query-intent-classifier.ts` function without changing classifier logic.
- Replace the spec-kit local classifier implementation with an RPC-backed boundary function.
- Update the spec-kit call site for async classification.
- Add focused MCP-dispatch coverage for the new tool.
- Update this packet and parent continuity metadata.

### Out of Scope
- Tool id, server id, or skill id renames.
- Changes to the existing 10 mk-code-index tool behaviors.
- Changes to `query-intent-classifier.ts` scoring logic.
- Refactors outside the classifier RPC surface.
- Touching older child packets 001-020 except parent continuity.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` | Modify | Add `code_graph_classify_query_intent` schema. |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts` | Modify | Register the new dispatcher case. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/classify-query-intent.ts` | Create | Wrap canonical `classifyQueryIntent()`. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/index.ts` | Modify | Export the handler. |
| `.opencode/skills/system-code-graph/mcp_server/tests/handlers/classify-query-intent.vitest.ts` | Create | Cover schema count, dispatch success, and validation failure. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts` | Modify | Replace local shim with RPC wrapper. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modify | Await the async classifier call. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts` | Modify | Update the existing spec-kit classifier test to the async RPC boundary. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `mk-code-index` exposes the classifier as the 11th tool. | `CODE_GRAPH_TOOL_SCHEMAS` has 11 entries and `opencode mcp tools mk_code_index` lists `code_graph_classify_query_intent`. |
| REQ-002 | The new handler uses canonical code-graph classifier logic. | Handler imports `classifyQueryIntent` from `../lib/query-intent-classifier.js` and does not reimplement scoring. |
| REQ-003 | Spec-kit no longer owns a local classifier shim. | `code-graph-boundary.ts` contains no keyword/pattern classifier implementation and calls `code_graph_classify_query_intent`. |
| REQ-004 | Functional routing behavior stays unchanged. | Existing classifier mapping tests pass through the RPC-backed path. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | TypeScript surfaces compile. | Code-graph and spec-kit MCP typechecks pass. |
| REQ-006 | No test regressions are introduced. | Focused tests pass and broader package tests show no new regression beyond known baselines. |
| REQ-007 | Parent continuity points at packet 021. | Parent `graph-metadata.json` includes child 021 and `handover.md` notes closure. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `mk-code-index` advertises 11 tools, including `code_graph_classify_query_intent`.
- **SC-002**: Spec-kit classification crosses the MCP boundary instead of using local code.
- **SC-003**: `memory_context` query-intent routing continues to classify structural, semantic, and hybrid inputs correctly.
- **SC-004**: Typechecks pass for system-code-graph and system-spec-kit.
- **SC-005**: Strict validation passes for packet 021 and its parent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing mk-code-index launcher | Spec-kit classifier calls depend on the MCP child being available. | Reuse `callCodeGraphTool()` timeout and fail-closed behavior already used by graph context. |
| Dependency | Generated code-graph dist artifacts | Existing dist can be stale while source is correct. | Build code-graph before MCP-list and RPC verification. |
| Risk | Async classifier call adds latency. | `memory_context` can spend extra time before semantic search. | Keep classifier payload small and use the existing bounded MCP timeout. |
| Risk | Tests still assume sync shim. | Old shim tests fail after replacing implementation. | Update active tests to await the RPC-backed boundary. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Classifier responses remain small and do not invoke graph DB reads.
- **NFR-P02**: Spec-kit classifier RPC uses the existing 8 second MCP timeout.

### Security
- **NFR-S01**: The new tool accepts only a string `query` argument.
- **NFR-S02**: The handler performs no filesystem writes and no shell execution.

### Reliability
- **NFR-R01**: Missing or invalid classifier payloads throw inside the existing try/catch boundary and degrade to semantic-only behavior.
- **NFR-R02**: Tool validation rejects missing `query` input before handler dispatch.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: rejected at MCP dispatcher validation for the tool surface; canonical classifier still handles empty strings if called directly.
- Maximum length: no new limit beyond MCP payload handling; classifier remains linear over query tokens and patterns.
- Invalid format: missing or non-string `query` returns a validation error.

### Error Scenarios
- MCP child unavailable: spec-kit `memory_context` catches classifier failure and falls through to existing semantic logic.
- Stale dist artifact: build code-graph before live MCP verification.
- Unknown tool response: spec-kit treats it as classifier failure and does not block memory context.

### State Transitions
- Packet 020 local shim state: replaced by packet 021 RPC state.
- Parent phase state: active child advances from 020 to 021 after strict validation.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One new MCP tool, one consumer wrapper, focused tests, packet docs. |
| Risk | 10/25 | Async boundary and stale dist are the main risks. |
| Research | 8/20 | Prior packet 020 plus current dispatcher patterns are sufficient. |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
