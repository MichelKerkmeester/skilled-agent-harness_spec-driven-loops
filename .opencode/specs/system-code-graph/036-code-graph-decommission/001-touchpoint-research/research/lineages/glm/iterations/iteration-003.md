# Iteration 003 — External Executable Dependencies and Shared Contracts

**Lineage:** glm | **Iteration:** 3 of 5 | **Focus:** system-spec-kit integration, skill-advisor graph, deep-loop coverage-graph
**Timestamp:** 2026-07-27T20:40:00.000Z

## Focus
Map the external executable dependencies and shared contracts: `system-spec-kit` process boundary (`code-graph-boundary.ts`), CLI fallback hook, context-server routing, tool-schemas, shared contracts, hooks (cursor/claude), passive enrichment, runtime detection, and the skill-advisor graph + scorer lanes. Plus the deep-loop coverage-graph integration points.

## Method
- `rg --hidden --no-ignore -n` for code-graph references in each spec-kit subsystem file.
- `rg` for skill-advisor scorer lanes (fusion, explicit, lexical) and skill-graph.json.
- `rg` for deep-loop integration-points and runtime README.
- `wc -l` for file sizes.

## Findings

### F3.1 — `code-graph-boundary.ts`: the spec-kit process boundary (CONFIRMED, blocking)
- **File:** `.opencode/skills/system-spec-kit/mcp-server/lib/code-graph-boundary.ts` (452 lines)
- **Purpose:** "Spec-kit side of the system-code-graph process boundary" (line 4)
- **Imports:** `@spec-kit/shared/code-graph-contracts` (lines 20, 28)
- **Path bindings:** `../../../system-code-graph/mcp-server/database/` (line 32), `.../.code-graph-readiness.json` (line 36), `LAUNCHER_PATH = ...bin/mk-code-index-launcher.cjs` (line 39)
- **MCP client calls:** `code_graph_status` (line 325), `code_graph_classify_query_intent` (line 364), `code_graph_context` (via callCodeGraphTool)
- **Failure mode if skill removed:** spec-kit's context-server, session-prime hook, memory-surface hook, and passive-enrichment all import from this file. If the boundary file is removed without decoupling, spec-kit MCP server fails to build/start. [SOURCE: code-graph-boundary.ts:4,20,32,36,39,325,364]

### F3.2 — `code-index-cli-fallback.ts`: CLI fallback hook (CONFIRMED, blocking)
- **File:** `.opencode/skills/system-spec-kit/mcp-server/hooks/code-index-cli-fallback.ts` (401 lines)
- **Constants:** `SERVICE_NAME = 'mk-code-index'` (line 14), `DEFAULT_SOCKET_DIR = '/tmp/mk-code-index'` (line 15)
- **References:** `bin/code-index.cjs` shim (line 58, 197), `system-code-graph/mcp-server/database` (line 65)
- **Failure mode:** This hook provides bounded code-graph reads without cold starts. If removed, spec-kit loses its CLI fallback path. Must be removed or stubbed in lockstep with the MCP server. [SOURCE: code-index-cli-fallback.ts:14,15,58,65,197]

### F3.3 — `context-server.ts`: code-graph routing and session bootstrap (CONFIRMED, blocking)
- **File:** `.opencode/skills/system-spec-kit/mcp-server/context-server.ts`
- **Import:** `callCodeGraphTool` from `./lib/code-graph-boundary.js` (line 101)
- **Routing fields:** `preferredTool: 'mcp__mk_code_index__code_graph_query'` (lines 335, 721), `secondaryTool: 'mcp__mk_code_index__code_graph_context'` (lines 336, 722)
- **Advisory message:** line 723 — "Prefer `mcp__mk_code_index__code_graph_query` before Grep or Glob..."
- **Session bootstrap:** calls `code_graph_context` (line 937), recommends `code_graph_scan` when graph empty (line 1165), checks graph freshness (lines 1067-1068, 1156-1181)
- **Failure mode:** context-server is the spec-kit MCP server's main entry point. Code-graph routing must be stripped or the server crashes on any structural query. [SOURCE: context-server.ts:101,335,336,721,723,937,1165]

### F3.4 — `tool-schemas.ts` (spec-kit): code-graph tool descriptions (CONFIRMED, live)
- **File:** `.opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts`
- Lines 216, 230 — tool descriptions reference `mcp__mk_code_index__code_graph_query` for structural code queries
- Lines 893-894 — "Code-graph tool schemas migrated to system-code-graph standalone MCP server. Tool IDs unchanged; namespace changed: mcp__mk_spec_memory__code_graph_* → mcp__mk_code_index__code_graph_*"
- Lines 904, 911, 918, 941 — session_bootstrap and session_resume tools include code-graph freshness and structuralContext fields
- Line 1005 — "L8: Code Graph schemas live in system-code-graph"
- **Classification:** Live doc/schemas. Must update descriptions and remove code-graph freshness fields. [SOURCE: tool-schemas.ts:216,230,893-894,904,911,918,941,1005]

### F3.5 — `shared/code-graph-contracts.ts`: neutral shared contracts (CONFIRMED, shared)
- **File:** `.opencode/skills/system-spec-kit/shared/code-graph-contracts.ts` (228 lines)
- **Purpose:** "Neutral contracts shared by system-spec-kit and system-code-graph" (line 5)
- **Exports:** `GraphFreshness`, `ReadyAction`, `StructuralReadiness`, `ReadinessScopeDiagnostic`, `GraphReadinessSnapshot`, `CodeGraphStatsSnapshot`, `StartupGraphSummary`, `StartupGraphQualitySummary`, `StartupBriefResult`, `CodeGraphReadinessMarker`, `MetadataOnlyPreview`, `CodeGraphOpsContract`, `normalizeStructuralReadiness()`, `buildCodeGraphOpsContract()`
- **Implication:** These types are imported by both spec-kit and code-graph. If code-graph is removed, spec-kit still imports them for its boundary/hook code. The contracts file may need to stay (or be trimmed to only what spec-kit still uses) rather than being deleted outright. [SOURCE: code-graph-contracts.ts:5,9-147]

### F3.6 — spec-kit hooks: three code-graph hook integrations (CONFIRMED, blocking)
1. **`hooks/cursor/post-tool-use.mjs:39`** — `CODE_GRAPH_FRESHNESS_RELATIVE = '.opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs'`. The cursor hook shells out to the code-graph freshness runtime. [SOURCE: post-tool-use.mjs:15,20,39]
2. **`hooks/claude/session-prime.ts:28`** — `import { getStartupBriefFromMarker } from '../../lib/code-graph-boundary.js'`. Injects code_graph_* tool guidance into session priming (lines 245, 263, 284). Handles stale code-graph status across compaction (line 374). [SOURCE: session-prime.ts:28,245,263,284,374]
3. **`hooks/memory-surface.ts:12`** — `import { getCodeGraphStatusSnapshotFromMarker } from '../lib/code-graph-boundary.js'`. Recommends `code_graph_scan` (line 429) and `code_graph_query` routing (line 440). [SOURCE: memory-surface.ts:12,429,440]

### F3.7 — `passive-enrichment.ts` and `runtime-detection.ts` (CONFIRMED, blocking)
- **`lib/enrichment/passive-enrichment.ts:16`** — `import { callCodeGraphTool } from '../code-graph-boundary.js'`. Calls `code_graph_context` for symbol enrichment near mentioned files (line 114). [SOURCE: passive-enrichment.ts:16,114]
- **`lib/runtime-detection.ts:5`** — "system-code-graph, but startup ownership belongs with spec-kit hooks." [SOURCE: runtime-detection.ts:5]

### F3.8 — `finalize-dist.mjs`: dist finalization includes system-code-graph (CONFIRMED)
- `.opencode/skills/system-spec-kit/mcp-server/scripts/finalize-dist.mjs:22` — `'system-code-graph'` in the dist finalization list. The spec-kit dist build references the code-graph skill. [SOURCE: finalize-dist.mjs:22]

### F3.9 — skill-advisor graph: system-code-graph is a first-class node (CONFIRMED, blocking)
- **`skill-graph.json`** — `system-code-graph` in `families.system` (line 1), adjacency: `depends_on: {system-spec-kit: 0.8}`, `enhances: {system-spec-kit: 0.6}`, `siblings: {system-spec-kit: 0.5}`. Signals: `["code graph", "code-graph", "structural code indexing", "code graph scan", "code graph query", "code graph context", "blast radius", "impact analysis", "detect changes"]`. Also `system-skill-advisor` has `enhances: {system-code-graph: 0.7}`. [SOURCE: skill-graph.json:1]
- **`scorer/fusion.ts:530`** — `if (recommendation.skill === 'system-code-graph') return R.semanticSearchCodeGraphBonus;` [SOURCE: fusion.ts:530]
- **`scorer/lanes/explicit.ts`** — `system-code-graph` scoring weights at lines 41 (0.45), 67 (0.55), 122-125 (1.5, 1.4), 216 (0.8), 222 (0.6) [SOURCE: explicit.ts:41,67,122-125,216,222]
- **`scorer/lanes/lexical.ts:29`** — `'system-code-graph': ['code graph', 'structural search', 'grep not enough', 'find code', 'where logic']` [SOURCE: lexical.ts:29]
- **`skill_advisor.py:1747-1903`** — Python parity: `system-code-graph` scoring in semantic, discover, structural search, code graph search, code search, vector search, concept search, find implementation lanes. [SOURCE: skill_advisor.py:1747,1748,1759,1895-1903]
- **Failure mode:** skill-advisor will route queries to a non-existent skill. Must remove the node from skill-graph.json and all scorer lane entries (TS + Python parity).

### F3.10 — deep-loop integration points (CONFIRMED, live doc)
- **`runtime/references/integration-points.md:82-90`** — "system-code-graph no longer owns the deep-loop coverage graph, but it retains catalog and playbook references that point operators to current script paths." Lists 5 feature-catalog files and 2 playbook files that point to deep-loop scripts. [SOURCE: integration-points.md:82-90,168]
- **`runtime/lib/deep-loop/README.md:40`** — "Code Graph: `system-code-graph/mcp-server/lib/owner-lease.ts`, `canonical-db-dir.ts`, `close-db-assertion.ts`." [SOURCE: deep-loop/README.md:40]
- **Classification:** These are live docs that reference the code-graph skill. Must be updated to remove the references.

## Assessment
- **newInfoRatio:** 0.88 — 9 of 10 findings fully new; F3.5 (shared contracts) refines the shared-infrastructure theme from iteration 2.
- **Questions advanced:** q2 (external imports and shell-outs — spec-kit boundary, hooks, enrichment, dist), q4 (skill-advisor graph + deep-loop docs), q5 (ordering: shared contracts and boundary must be decoupled before skill deletion).
- **Critical ordering constraint surfaced:** `code-graph-boundary.ts` is imported by 4 spec-kit subsystems (context-server, session-prime, memory-surface, passive-enrichment). The boundary must be decoupled/stubbed BEFORE the skill directory is deleted. `shared/code-graph-contracts.ts` may need to survive as a spec-kit-local file since spec-kit types still depend on it.

## Dead Ends
- `coverage-graph-schema.md` path from the sol lineage didn't resolve; the actual coverage-graph docs are under `runtime/feature-catalog/coverage-graph/` (5 files). These are feature-catalog docs, not a schema file — lower priority for decommission since they describe deep-loop's own coverage graph, not the code-graph MCP.

## Next Focus
Iteration 4: Hooks, lifecycle automation, and CI — `.claude/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`, `.github/workflows/isolation-check.yml`, `.opencode/scripts/git-hooks/post-commit`, `session-cleanup.sh`, `orphan-mcp-sweeper.sh`, and the `/doctor` surface (`doctor/_routes.yaml`, `doctor-code-graph.yaml`).
