---
title: "Implementation Summary: Spec Kit Code Graph Decoupling"
description: "Spec-kit no longer imports system-code-graph source; startup and runtime graph access now cross explicit boundaries."
trigger_phrases:
  - "020 implementation summary"
  - "codegraph decoupling summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/020-spec-kit-codegraph-decoupling"
    last_updated_at: "2026-05-15T09:35:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented source decoupling and passed static verification"
    next_safe_action: "Run remaining tests and strict validation before commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts"
      - ".opencode/skills/system-spec-kit/shared/code-graph-contracts.ts"
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| Spec Folder | 020-spec-kit-codegraph-decoupling |
| Updated | 2026-05-15 |
| Level | 3 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

System-spec-kit now treats system-code-graph as a sibling process, not an in-process library. Startup code reads a readiness marker, runtime code calls `mk_code_index` over MCP, and shared type contracts live in `@spec-kit/shared`.

### Shared Contracts

`@spec-kit/shared/code-graph-contracts` now owns graph freshness, readiness snapshot, startup brief, status snapshot, and ops contract shapes. That lets spec-kit and code-graph agree on the wire contract without either side importing the other's source.

### Readiness Marker

Code-graph writes `.opencode/skills/system-code-graph/mcp_server/database/.code-graph-readiness.json` on startup and status calls. Spec-kit hooks use that marker for startup brief context and treat a missing marker as an unavailable graph rather than reaching into code-graph internals.

### Boundary Wrapper

Spec-kit has a single code-graph boundary module. It reads the marker for startup/session fallbacks and calls `code_graph_status` or `code_graph_context` through the existing mk-code-index launcher for request-time graph data.

### Test Ownership

Code-graph-owned tests moved into `system-code-graph/mcp_server/tests` or `stress_test/code-graph`. Remaining spec-kit tests mock `lib/code-graph-boundary.ts` or local helpers instead of mocking code-graph internals.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Work proceeded bucket by bucket: audit, shared contracts, test moves, marker, RPC retrofit, and static verification. The hard audit is clean and both TypeScript projects compile. Full Vitest, strict validation, MCP list, and hook smoke remain the final evidence before commit.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Supersede 014/007 ADR-002 | The operator narrowed the architecture: direct sibling imports are no longer allowed. |
| Use marker for startup | Hooks must be fast and must not wait on MCP child startup. |
| Use RPC for request-time reads | Runtime handlers can tolerate bounded latency and should respect the process boundary. |
| Keep local classifier heuristic | Existing mk-code-index tools do not expose a classifier RPC; local heuristic avoids blocking decoupling. |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Shared build | PASS: `npm run build` in `system-spec-kit/shared`. |
| Spec-kit typecheck | PASS: `npx tsc -p tsconfig.json --noEmit`. |
| Code-graph typecheck | PASS: `node node_modules/typescript/bin/tsc -p tsconfig.json --noEmit`. |
| Import audit | PASS: zero `from.*system-code-graph` matches under spec-kit MCP server. |
| Spec-kit targeted Vitest | PASS: 11 files, 177 passed, 2 skipped. |
| Code-graph moved smoke subset | PASS: 7 files, 66 passed; broader moved mixed suites exposed legacy/spec-kit fixture drift. |
| Hook smoke | PASS: 5 files, 20 passed, 2 skipped. |
| MCP list | PASS: 6 connected servers. |
| Strict validate | PASS: packet 020 and parent phase. |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. `classifyQueryIntent` remains local in spec-kit because mk-code-index does not expose a dedicated classifier RPC. Follow-on packet candidate: `021-codegraph-rpc-surface`.
2. Marker freshness is snapshot-based. Runtime RPC can provide fresher status when a request path needs live data.
<!-- /ANCHOR:limitations -->
