---
title: "Changelog: Code Graph RPC Classifier Surface"
description: "mk-code-index now exposes query-intent classification through a new MCP tool, and spec-kit no longer carries a local classifier shim."
trigger_phrases:
  - "021 codegraph rpc surface"
  - "code graph classify query intent"
  - "replace spec-kit classifier shim"
  - "codegraph rpc surface phase"
  - "classifier RPC summary"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/021-codegraph-rpc-surface` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

mk-code-index now exposes query-intent classification through code_graph_classify_query_intent. Spec-kit no longer duplicates classifier keywords and patterns locally. memory_context reaches across the same MCP boundary used for graph context, so code-graph now owns the canonical classifier surface.

### Added

- code_graph_classify_query_intent MCP tool descriptor in mk-code-index.
- classify-query-intent handler that wraps the canonical query-intent-classifier logic.
- Focused MCP dispatch test for the new classifier tool.

### Changed

- spec-kit code-graph-boundary.ts now calls the MCP boundary instead of a local heuristic shim.
- memory-context.ts awaits the async classifier call through the RPC boundary.

### Fixed

- None.

### Verification

- Code-graph typecheck - PASS: node node_modules/typescript/bin/tsc -p tsconfig.json --noEmit.
- Spec-kit typecheck - PASS: npx tsc -p tsconfig.json --noEmit.
- Focused code-graph tests - PASS: 2 files, 15 tests.
- Focused spec-kit runtime-routing test - PASS: 1 file, 26 tests.
- Code-graph full Vitest - FAIL baseline-class: 50 files passed, 1 skipped, 2 failed, 514 passed, 9 skipped, 5 failed. Failures are unrelated code_graph_context shared-schema registration checks and symlink hardening.
- Advisor full Vitest - PASS: 53 files, 368 passed, 4 skipped.
- Spec-kit full Vitest - FAIL baseline-class: 566 files passed, 15 skipped, 22 failed, 10,909 passed, 87 skipped, 105 failed. Expected baseline was around 114 failures, focused classifier path is green.
- Live MCP list - PASS: opencode mcp list shows mk_code_index connected.
- Live MCP tools - PASS via direct MCP SDK listTools(): 11 tools confirmed including code_graph_classify_query_intent.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` | Modified | Add the 11th tool descriptor. |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts` | Modified | Register validation and dispatch. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/classify-query-intent.ts` | Created | Wrap canonical classifier logic. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/index.ts` | Modified | Export the new handler. |
| `.opencode/skills/system-code-graph/mcp_server/tests/handlers/classify-query-intent.vitest.ts` | Created | Cover MCP dispatch behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts` | Modified | Replace local shim with RPC wrapper. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modified | Await the async classifier. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts` | Modified | Assert classifier behavior through the async boundary. |

### Follow-Ups

- The checked-in code-graph root .js siblings were updated alongside TypeScript for parity with the new handler.
- opencode mcp tools mk_code_index is unavailable in the installed CLI, so live tool listing used a direct MCP SDK client against the same launcher.
