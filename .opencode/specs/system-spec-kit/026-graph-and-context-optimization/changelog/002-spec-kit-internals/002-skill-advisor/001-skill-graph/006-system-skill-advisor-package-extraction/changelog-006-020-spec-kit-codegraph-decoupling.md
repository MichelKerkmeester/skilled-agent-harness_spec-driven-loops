---
title: "Spec Kit Code Graph Decoupling"
description: "System-spec-kit imported system-code-graph source directly, making the process boundary nominal. This phase ships shared contracts, a readiness marker, and an MCP RPC boundary so spec-kit and code-graph operate as true siblings."
trigger_phrases:
  - "spec kit code graph decoupling"
  - "codegraph decoupling"
  - "zero system-code-graph imports"
  - "shared code-graph contracts"
  - "readiness marker"
importance_tier: "critical"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/020-spec-kit-codegraph-decoupling` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

System-spec-kit imported system-code-graph source directly, making the process boundary nominal rather than real. This phase ships shared contract types in @spec-kit/shared, a readiness marker written by code-graph and read by spec-kit at startup, and an MCP RPC boundary wrapper so the two MCP servers operate as true siblings. ADR-001 supersedes the prior sibling-import allowance.

### Added

- Shared code-graph contract types in @spec-kit/shared for graph freshness, readiness snapshot, startup brief, status snapshot, and ops shapes.
- Code-graph readiness marker writer that emits `.code-graph-readiness.json` on startup and status calls.
- Spec-kit marker reader with startup brief fallback for session context when the marker is absent.
- Spec-kit boundary module at `lib/code-graph-boundary.ts` that reads the marker for startup fallbacks and calls `code_graph_status` or `code_graph_context` over MCP at request time.
- ADR-001 documenting the architecture decision to prohibit direct sibling imports and superseding 014/007 ADR-002.

### Changed

- Spec-kit and code-graph imports updated to use @spec-kit/shared contracts instead of each other's source.
- Code-graph-owned unit tests moved from spec-kit into `system-code-graph/mcp_server/tests` or `stress_test/code-graph`.
- Spec-kit runtime handlers, hooks, and session helpers retrofitted away from in-process code-graph imports to the boundary wrapper.

### Fixed

- None.

### Verification

- Shared build: PASS, `npm run build` in `system-spec-kit/shared`.
- Spec-kit typecheck: PASS, `npx tsc -p tsconfig.json --noEmit`.
- Code-graph typecheck: PASS, `node node_modules/typescript/bin/tsc -p tsconfig.json --noEmit`.
- Import audit: PASS, zero `from.*system-code-graph` matches under spec-kit MCP server.
- Spec-kit targeted Vitest: 11 files, 177 passed, 2 skipped.
- Code-graph moved smoke subset: 7 files, 66 passed.
- Hook smoke: 5 files, 20 passed, 2 skipped.
- MCP list: 6 connected servers.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/shared/code-graph-contracts.ts` | Created | Shared contract types for graph readiness, status, and ops |
| `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts` | Created | Spec-kit boundary wrapper for marker reads and MCP RPC calls |
| `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts` | Created | Readiness marker writer for startup and status snapshot |
| `.opencode/skills/system-spec-kit/mcp_server/lib/readiness-marker.ts` | Created | Spec-kit marker reader and startup brief fallback |
| Packet docs | Created | Spec, plan, tasks, checklist, implementation-summary |

### Follow-Ups

- `classifyQueryIntent` remains local in spec-kit because mk-code-index does not expose a classifier RPC. Follow-on packet candidate: `021-codegraph-rpc-surface`.
- Marker freshness is snapshot-based. Runtime RPC can provide fresher status when a request path needs live data.
