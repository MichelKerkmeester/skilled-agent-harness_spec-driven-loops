---
title: "Code Graph RPC Classifier Surface"
description: "Spec-kit carried a duplicated local classifier heuristic because the canonical code-graph classifier had no MCP surface. mk-code-index now exposes query-intent classification as code_graph_classify_query_intent, and spec-kit calls it across the MCP boundary."
trigger_phrases:
  - "code_graph_classify_query_intent"
  - "classifier RPC surface"
  - "query intent classification MCP"
  - "code-graph boundary classifier"
  - "spec-kit classifier shim replacement"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/021-codegraph-rpc-surface` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

mk-code-index now exposes query-intent classification through the code_graph_classify_query_intent MCP tool. Spec-kit no longer duplicates classifier keywords and patterns locally. The memory_context handler reaches across the same MCP boundary used for graph context. The canonical classifier logic in query-intent-classifier.ts was left unchanged; only the RPC surface was added.

### Added
- code_graph_classify_query_intent MCP tool on mk-code-index.
- MCP handler wrapping the existing query intent classifier for external dispatch.
- Focused test coverage for the new classifier dispatch behavior.

### Changed
- Spec-kit code-graph boundary replaced the local classifier heuristic with an async RPC call to mk-code-index.
- Spec-kit memory-context.ts now awaits the async classifier boundary call.

### Fixed
- None.

### Verification
- Code-graph typecheck: PASS
- Spec-kit typecheck: PASS
- Focused code-graph tests: PASS (2 files, 15 tests)
- Focused spec-kit runtime-routing test: PASS (1 file, 26 tests)
- Advisor full Vitest: PASS (53 files, 368 passed, 4 skipped)
- Strict validate: PASS on packet and parent phase folder

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
- Checked-in code-graph root .js siblings are still used by some tests and were updated alongside TypeScript for parity.
- opencode mcp tools mk_code_index is unavailable in the installed CLI, so live tool listing used a direct MCP SDK client against the same launcher.
