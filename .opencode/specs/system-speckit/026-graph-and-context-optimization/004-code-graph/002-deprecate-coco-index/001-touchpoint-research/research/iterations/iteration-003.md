# Iteration 003 - RQ3 Code-Graph Decouple Edit-Set

## Focus (RQ3)

Precise edit-set to decouple `system-code-graph` from CocoIndex while keeping the structural skill green. This iteration maps the exact surgical changes needed to sever the CCC bridge coupling and neutralize semantic routing, with file:line citations for each mutation.

## Code-graph decouple edit-set

| File (file:line) | Current coco coupling | Surgical change | Mutation Class |
|------------------|----------------------|-----------------|----------------|
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:195-228` | Three CCC tool definitions: `cccStatus` (195-199), `cccReindex` (202-212), `cccFeedback` (215-228) | Remove these three tool definitions from the file and from `CODE_GRAPH_TOOL_SCHEMAS` array (lines 240-242) | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:231-243` | `CODE_GRAPH_TOOL_SCHEMAS` array exports 11 tools including the 3 CCC tools | Remove `cccStatus`, `cccReindex`, `cccFeedback` from the array (11 tools → 8 tools) | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:13-15` | Handler imports: `handleCccStatus`, `handleCccReindex`, `handleCccFeedback` | Remove these three imports from the handler imports block | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:35-37` | TOOL_NAMES Set includes `'ccc_status'`, `'ccc_reindex'`, `'ccc_feedback'` | Remove these three tool names from the TOOL_NAMES Set | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:105-116` | Dispatcher cases for `ccc_status` (105-107), `ccc_reindex` (108-109), `ccc_feedback` (110-116) | Remove these three switch cases from the dispatcher | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-status.ts:1-64` | Entire handler file for `ccc_status` tool | Delete the entire file | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts:1-103` | Entire handler file for `ccc_reindex` tool | Delete the entire file | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:1-113` | Entire handler file for `ccc_feedback` tool | Delete the entire file | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/handlers/index.ts` | Handler index exports CCC handlers (implied from code-graph-tools.ts imports) | Remove exports for `handleCccStatus`, `handleCccReindex`, `handleCccFeedback` | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/lib/query-intent-classifier.ts:167-175` | Semantic routing branch returns `intent: 'semantic'` when `semanticRatio > 0.65` | Neutralize semantic routing: change to return `intent: 'structural'` or remove semantic branch entirely. The semantic intent implies CocoIndex usage which no longer exists. | EDIT-decouple |
| `.opencode/skills/system-code-graph/mcp_server/lib/query-intent-classifier.ts:47-61` | `SEMANTIC_KEYWORDS` Set and `SEMANTIC_PATTERNS` array (lines 74-82) used for semantic classification | Remove or comment out semantic keyword/pattern definitions since semantic routing is being neutralized | EDIT-decouple |
| `.opencode/skills/system-code-graph/mcp_server/lib/query-intent-classifier.ts:119-122` | Docstring mentions "semantic (CocoIndex)" routing | Update docstring to remove CocoIndex reference and semantic routing explanation | EDIT-remove-ref |
| `.opencode/skills/system-code-graph/references/integrations/ccc_bridge_integration.md:1-160` | Entire integration document explaining CCC bridge tools and hybrid workflows | Delete the entire file - it's entirely about CCC/CocoIndex integration | DELETE |
| `.opencode/skills/system-code-graph/SKILL.md:8` | Keywords include `ccc_status` | Remove `ccc_status` from keywords line | EDIT-remove-ref |
| `.opencode/skills/system-code-graph/SKILL.md:16` | Glossary defines "Semantic search" as "Vector-embedding lookup over code (CocoIndex)" | Update glossary entry to remove CocoIndex reference or remove the entry entirely | EDIT-remove-ref |
| `.opencode/skills/system-code-graph/SKILL.md:22-23` | Glossary defines "Semantic search" with CocoIndex reference | Same as line 16 - update or remove | EDIT-remove-ref |
| `.opencode/skills/system-code-graph/SKILL.md:46` | "MCP tool workflows using `code_graph_*`, `ccc_*` or `detect_changes`" | Remove `ccc_*` from the list | EDIT-remove-ref |
| `.opencode/skills/system-code-graph/SKILL.md:66` | Router pseudocode: "named code_graph_*, detect_changes, or ccc_* tool" | Remove `ccc_*` from the router pseudocode | EDIT-remove-ref |
| `.opencode/skills/system-code-graph/SKILL.md:70` | Router pseudocode: "code_graph_classify_query_intent -> structural / semantic / hybrid" | Update to remove semantic/hybrid branches since CocoIndex is being removed | EDIT-decouple |
| `.opencode/skills/system-code-graph/SKILL.md:74-76` | Router pseudocode: "semantic -> mcp-coco-index resources" and "hybrid -> CocoIndex seeds" | Remove these routing branches from the pseudocode | EDIT-decouple |
| `.opencode/skills/system-code-graph/SKILL.md:117` | INTENT_SIGNALS "TOOL_SURFACE" includes `"ccc_"` keyword | Remove `"ccc_"` from the keywords array | EDIT-remove-ref |
| `.opencode/skills/system-code-graph/SKILL.md:123` | INTENT_SIGNALS "CCC" intent signal with cocoindex/semantic/hybrid keywords | Remove the entire "CCC" intent signal entry | DELETE |
| `.opencode/skills/system-code-graph/SKILL.md:159-164` | RESOURCE_MAP "CCC" entry maps to ccc_bridge_integration.md and feature_catalog CCC files | Remove the entire "CCC" resource map entry | DELETE |
| `.opencode/skills/system-code-graph/SKILL.md:285` | Tool dispatch table row: "Classify natural-language queries into structural/semantic/hybrid intent" | Update to remove semantic/hybrid from the description | EDIT-remove-ref |
| `.opencode/skills/system-code-graph/SKILL.md:291` | Tool dispatch table row: "Bridge CocoIndex status, reindexing and feedback" | Remove this entire table row | DELETE |
| `.opencode/skills/system-code-graph/SKILL.md:294` | "Tool IDs (`code_graph_*`, `detect_changes`, and `ccc_*`)" | Remove `ccc_*` from the tool IDs list | EDIT-remove-ref |
| `.opencode/skills/system-code-graph/SKILL.md:336` | "Tool IDs (`code_graph_*`, `detect_changes`, `ccc_*`)" | Remove `ccc_*` from the tool IDs list | EDIT-remove-ref |
| `.opencode/skills/system-code-graph/SKILL.md:387` | "MCP callers... `mcp__mk_code_index__ccc_*`" | Remove `mcp__mk_code_index__ccc_*` from the MCP callers list | EDIT-remove-ref |
| `.opencode/skills/system-code-graph/SKILL.md:404` | Related resources reference to `ccc_bridge_integration.md` | Remove this related resource entry | EDIT-remove-ref |
| `.opencode/skills/system-code-graph/mcp_server/lib/shared/cocoindex-path.ts:1-60` | Entire utility module for resolving CocoIndex binary path | Delete the entire file - it's only used by CCC handlers | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:424-425` | Comment mentions "ccc-status, ccc-reindex, ccc-feedback" as sibling handlers | Update comment to remove CCC handler references | EDIT-remove-ref |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-siblings-readiness.vitest.ts:144-146` | Test imports: `handleCccStatus`, `handleCccReindex`, `handleCccFeedback` | Remove these three handler imports | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-siblings-readiness.vitest.ts:346-362` | Test cases for `ccc-status`, `ccc-reindex`, `ccc-feedback` readiness emission | Remove these three test cases from the test suite | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-siblings-readiness.vitest.ts:34-41` | Mock for `probeCocoIndexReadiness` function | Remove this mock since it's only used by CCC handlers | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-siblings-readiness.vitest.ts:132-134` | Mock import for `../lib/ccc-readiness-probe.js` | Remove this mock import | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/ccc-integration-stress.vitest.ts` | Entire stress test file for CCC integration | Delete the entire file | DELETE |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` | Test file for CocoIndex telemetry passthrough | Delete the entire file (or evaluate if it tests non-CCC functionality) | DELETE (likely) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts:62` | MCP_SUBPROCESS_ENV_NAMESPACE_PREFIXES includes `'COCOINDEX_'` | Remove `'COCOINDEX_'` from the namespace prefixes array | EDIT-remove-ref |
| `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts:227` | `getStartupBriefFromMarker` returns `cocoIndexAvailable: false` field | Remove the `cocoIndexAvailable` field from the startup brief | EDIT-remove-ref |

## Tool count

**Current state:** 11 tools in `CODE_GRAPH_TOOL_SCHEMAS` [SOURCE: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:231-243]

**Tools to remove:** 3 CCC tools
- `ccc_status` [SOURCE: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:195-199]
- `ccc_reindex` [SOURCE: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:202-212]
- `ccc_feedback` [SOURCE: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:215-228]

**Post-decouple state:** 8 tools remaining
- `code_graph_scan`
- `code_graph_query`
- `code_graph_status`
- `code_graph_context`
- `code_graph_classify_query_intent`
- `code_graph_verify`
- `code_graph_apply`
- `detect_changes`

**Note:** `code_graph_classify_query_intent` remains but its semantic routing logic will be neutralized to avoid references to CocoIndex.

## Verify gate

To prove code-graph stays green post-decouple, the following verification steps should pass:

1. **Core structural test suites** (must pass without CCC-specific tests):
   - `code-graph-scan.vitest.ts` - structural indexing functionality
   - `code-graph-query-handler.vitest.ts` - query operations (calls_from, imports_to, blast_radius)
   - `code-graph-context-handler.vitest.ts` - context retrieval and neighborhood expansion
   - `code-graph-status-readiness-snapshot.vitest.ts` - status and readiness reporting
   - `code-graph-verify.vitest.ts` - gold-query verification battery
   - `code-graph-apply-e2e.vitest.ts` - apply-mode recovery operations
   - `detect-changes-preflight-stress.vitest.ts` - change detection preflight

2. **Build verification:**
   - TypeScript compilation: `npm run build` or equivalent in the system-code-graph skill
   - No import errors after removing CCC handler imports
   - No type errors in tool-schemas.ts after removing CCC tool definitions

3. **Handler index verification:**
   - Verify `handlers/index.ts` compiles without the CCC handler exports
   - Verify all remaining handler imports resolve correctly

4. **Test suite filtering:**
   - Run test suite excluding CCC-specific tests: `vitest run --exclude '*ccc*' --exclude '*cocoindex*'`
   - Ensure all non-CCC tests pass

5. **MCP server startup verification:**
   - Verify the mk-code-index MCP server starts successfully with only 8 tools registered
   - Verify tool list via MCP server introspection shows only the 8 remaining tools

## Gaps for next iteration

1. **Feature catalog CCC files:** SKILL.md RESOURCE_MAP references `feature_catalog/07--ccc-integration/01-ccc-reindex.md`, `02-ccc-feedback.md`, `03-ccc-status.md` [SOURCE: .opencode/skills/system-code-graph/SKILL.md:160-163]. These files need to be located and classified (DELETE vs EDIT-decouple).

2. **Query-intent-classifier neutralization strategy:** The current semantic routing logic (lines 167-175) needs a precise neutralization strategy. Options: (a) remove semantic branch entirely and default ambiguous queries to structural, (b) keep the classifier but have semantic intent return a "no semantic backend available" error, (c) stub the semantic keywords/patterns to force structural routing. Need to determine the safest approach that preserves the tool contract while breaking CocoIndex coupling.

3. **Code-graph-context CocoIndex seed handling:** The `code_graph_context` tool accepts `provider: "cocoindex"` seeds [SOURCE: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:91]. Need to determine if this seed provider should be removed or stubbed to return an error.

4. **System-spec-kit CCC coupling:** The `code-graph-boundary.ts` file has `COCOINDEX_` env prefix and `cocoIndexAvailable` field. Need to verify if there are other CCC-related surfaces in system-spec-kit that depend on these fields.

5. **Test coverage completeness:** Need to verify that removing CCC-specific tests doesn't reduce coverage for the remaining 8 tools. May need to add new tests to ensure structural functionality is fully covered without CCC integration.

6. **Documentation cascades:** The SKILL.md edits may cascade to other documentation files in `references/` and `feature_catalog/` that reference CCC integration. Need to trace these documentation dependencies.
