---
title: "Feature Specification: Spec Kit Code Graph Decoupling"
description: "Remove system-spec-kit MCP server source imports from system-code-graph and lock a process-boundary integration pattern."
trigger_phrases:
  - "020 codegraph decoupling"
  - "spec-kit code graph decoupling"
  - "zero system-code-graph imports"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/020-spec-kit-codegraph-decoupling"
    last_updated_at: "2026-05-15T09:35:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented full spec-kit to code-graph source decoupling"
    next_safe_action: "Run full verification matrix and commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts"
      - ".opencode/skills/system-spec-kit/shared/code-graph-contracts.ts"
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "Operator narrowed 014/007 ADR-002: spec-kit may not import system-code-graph source."
---
# Feature Specification: Spec Kit Code Graph Decoupling

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

## EXECUTIVE SUMMARY

System-spec-kit now crosses the code-graph boundary through shared contracts, a readiness marker, and MCP RPC. ADR-001 supersedes the older sibling-import allowance.

**Key Decisions**: shared contracts, marker reads for startup, RPC for request-time graph data.

**Critical Dependencies**: mk-code-index launcher and readiness marker.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Level | 3 |
| Priority | P0 |
| Status | In Progress |
| Created | 2026-05-15 |
| Branch | `main` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

System-spec-kit MCP server still imported system-code-graph source files directly after the standalone code-graph extraction. That made the process boundary nominal rather than real: tests, hooks, and runtime handlers could compile or execute code-graph internals in-process.

Success means `.opencode/skills/system-spec-kit/mcp_server/` has zero `from.*system-code-graph` imports and uses only neutral shared contracts, a readiness marker, MCP RPC, or documented plugin bridges.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Move shared code-graph contract types to `@spec-kit/shared`.
- Move code-graph-owned tests from spec-kit to `system-code-graph/mcp_server/tests` or stress tests.
- Add a code-graph readiness marker written by `mk-code-index` startup/status paths.
- Add a spec-kit code-graph boundary wrapper for marker reads and MCP RPC calls.
- Retrofit spec-kit handlers, hooks, and session helpers away from in-process code-graph imports.
- Document ADR-001 as the superseding decision over 014/007 ADR-002.

### Out Of Scope

- Renaming MCP server ids, tool ids, or skill ids.
- Moving code-graph back into spec-kit.
- Modifying 019 advisor decoupling work.
- Adding new code-graph RPC tools unless an existing surface is truly missing.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove spec-kit MCP source imports from system-code-graph. | `rg -n 'from.*system-code-graph' .opencode/skills/system-spec-kit/mcp_server --glob '!**/node_modules/**' --glob '!**/dist/**'` returns 0. |
| REQ-002 | Move neutral types into shared. | Shared contracts are exported from `@spec-kit/shared/code-graph-contracts`; spec-kit and code-graph both compile against them. |
| REQ-003 | Keep startup hooks synchronous and process-safe. | Hooks read `getStartupBriefFromMarker()` instead of importing code-graph startup code. |
| REQ-004 | Route request-time graph reads through MCP. | Runtime context/status reads use `lib/code-graph-boundary.ts` RPC wrapper or marker fallback. |
| REQ-005 | Move code-graph tests to code-graph ownership. | Code-graph internals are tested under `system-code-graph/mcp_server/tests` or `stress_test/code-graph`. |
| REQ-006 | Preserve strict architecture documentation. | ADR-001 states the new boundary and supersedes 014/007 ADR-002. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- SC-001: Code import audit returns 0.
- SC-002: `system-spec-kit/mcp_server` typecheck passes.
- SC-003: `system-code-graph` typecheck passes.
- SC-004: Strict validate passes for packet 020 and the parent phase folder.
- SC-005: No unrelated dirty files are staged in the final commit.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| MCP RPC adds request-time latency. | Medium | Use marker reads for startup paths and bounded RPC timeouts for request paths. |
| Moved tests expose mixed ownership assumptions. | Medium | Keep code-graph internals local; point spec-kit helper imports explicitly across package boundary only from code-graph tests. |
| Marker freshness can lag behind repo state. | Medium | Refresh marker on code-graph startup and `code_graph_status`; runtime reads can still call RPC. |
| Missing RPC parity for classifier internals. | Low | Spec-kit keeps a local classifier heuristic and records a follow-on option if a canonical RPC classifier is needed. |
<!-- /ANCHOR:risks -->

## 7. Non-Functional Requirements

- Startup hooks must not spawn MCP children for routine brief generation.
- Request-time RPC calls must fail closed with unavailable/empty graph state instead of blocking spec-kit responses.
- Shared contracts must avoid importing either skill package.

## 8. EDGE CASES

- Missing marker: spec-kit reports unavailable graph state.
- RPC timeout: request-time graph context returns degraded/unavailable state.
- Empty graph: marker and status report empty rather than failing.

## 9. Complexity Assessment

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Cross-skill source, tests, hooks, handlers, docs |
| Risk | 18/25 | Startup surfaces and MCP status paths |
| Research | 14/20 | 25-file audit plus ADR supersession |
| Multi-Agent | 0/15 | SpawnAgent forbidden |
| Coordination | 12/15 | Parent phase metadata and moved tests |
| Total | 66/100 | Level 3 |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Marker stale/missing | M | M | Fail closed and refresh through status/RPC. |
| R-002 | RPC timeout | M | L | Bound timeout and return degraded payload. |

## 11. User Stories

### US-001: Source Isolation

As an operator, I want system-spec-kit to avoid importing code-graph source so that the standalone MCP boundary is real.

Acceptance: the import audit returns zero and typecheck still passes.

### US-002: Startup Safety

As a runtime hook, I want code-graph readiness through a file marker so that startup context does not depend on spawning code-graph internals.

Acceptance: Claude, Codex, and Gemini startup hooks read the marker-backed startup brief.

### US-003: Runtime Graph Access

As a spec-kit handler, I want graph status/context through MCP RPC so that runtime calls respect the process boundary.

Acceptance: session resume/search/context code no longer imports code-graph DB or readiness helpers.

<!-- ANCHOR:questions -->
## 12. Open Questions

- Whether mk-code-index should expose a first-class `classify_query_intent` RPC surface in a follow-on packet. Current implementation keeps a local spec-kit heuristic to avoid blocking 020.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- `decision-record.md`
- `plan.md`
- `implementation-summary.md`
