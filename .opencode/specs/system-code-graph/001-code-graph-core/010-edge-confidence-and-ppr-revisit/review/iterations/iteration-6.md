# Dimension

Runtime integration correctness: MCP handler reachability, package/build-order assumptions, and live `includeTrace` plus seeded-PPR impact reachability.

# Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:28` - severity and evidence doctrine loaded before final calls.
- `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md:166` - iteration artifact contract loaded.
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-state.jsonl:1` - run config and lineage.
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-findings-registry.json:11` - active P1-001 registry entry.
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-findings-registry.json:45` - active P1-002 registry entry.
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/review/deep-review-strategy.md:128` - iteration 6 focus.
- `.opencode/skills/system-code-graph/mcp_server/index.ts:17` - server entrypoint imports `./tools/index.js` at module load.
- `.opencode/skills/system-code-graph/mcp_server/index.ts:84` - MCP call handler dispatches all tool calls through `codeGraphTools.dispatch`.
- `.opencode/skills/system-code-graph/mcp_server/tools/index.ts:5` - tools barrel imports `handleTool` at module load.
- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:5` - dispatcher imports all handler exports at module load.
- `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:92` - real `code_graph_context` tool dispatch path.
- `.opencode/skills/system-code-graph/mcp_server/handlers/index.ts:7` - handler barrel exports `handleCodeGraphContext` from `context.js`.
- `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:6` - context handler imports `buildContext` from `code-graph-context.js` at module load.
- `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:301` - handler passes live MCP args into `buildContext`, including `includeTrace`.
- `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:75` - advertised `code_graph_context` tool schema.
- `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:82` - schema accepts `queryMode: "impact"`.
- `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:105` - schema accepts `includeTrace`.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:16` - type import references the spec-kit dist traversal module.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:20` - resolver throws when neither compiled dist candidate exists.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:32` - top-level awaited dynamic import runs during module load.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:274` - file-anchor trace output is gated by `args.includeTrace === true`.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:295` - symbol expansion receives `args.includeTrace === true`.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:452` - seeded-PPR flag reads `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` from process env.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:457` - seeded-PPR branch requires `mode === "impact"` plus enabled flag.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:528` - PPR algorithm depends on `collectMemoryWeightedWalk` from the compiled dist module.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1112` - impact mode switches into seeded-PPR ranking when enabled.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1129` - seeded-PPR candidates record only the candidate edge into `why_included`.
- `.opencode/skills/system-code-graph/package.json:7` - code-graph build script only runs its own `tsc --build`.
- `.opencode/skills/system-code-graph/package.json:9` - code-graph clean removes only code-graph dist roots.
- `.opencode/skills/system-code-graph/tsconfig.json:23` - code-graph compilation includes only `mcp_server/**/*.ts` under this skill.
- `.opencode/skills/system-spec-kit/mcp_server/package.json:20` - spec-kit MCP can build its own dist, but it is not wired from code-graph package scripts.
- `.opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs:19` - spec-kit build asserts a limited required artifact set, not the graph traversal module.
- `.opencode/skills/system-code-graph/feature_catalog/context-retrieval/code-graph-context.md:33` - operator docs describe live debug callers passing `includeTrace:true`.

# Findings by Severity

## P0

None.

## P1

No new P1 findings. Two active P1s are strengthened by runtime integration evidence:

### P1-001 [P1] Seeded-PPR recovery adds an unconditional missing compiled-module dependency

- Claim adjudication update: The failure is reachable at MCP server startup, not only first `code_graph_context` invocation.
- Evidence: `index.ts` imports `./tools/index.js` at startup, `tools/index.ts` imports `code-graph-tools.js`, `code-graph-tools.ts` imports `../handlers/index.js`, `handlers/index.ts` exports `context.js`, and `handlers/context.ts` imports `buildContext` from `../lib/code-graph-context.js`. That target module performs a top-level awaited import after resolving `../../../system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js` or `../../../../system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js`, and throws `Memory weighted-walk traversal module not found` if neither exists. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/index.ts:17`, `.opencode/skills/system-code-graph/mcp_server/tools/index.ts:5`, `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:5`, `.opencode/skills/system-code-graph/mcp_server/handlers/index.ts:7`, `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:6`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:20`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:32`]
- Counterevidence sought: A package/build-order step that always builds spec-kit before code-graph starts, or a present compiled `.opencode/skills/system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.*` artifact.
- Counterevidence result: No code-graph `package.json` script invokes the spec-kit MCP build, code-graph `tsconfig.json` compiles only the code-graph `mcp_server/**/*.ts` tree, spec-kit `package.json` owns its own build, and the expected dist artifact glob returned no files. [SOURCE: `.opencode/skills/system-code-graph/package.json:7`, `.opencode/skills/system-code-graph/tsconfig.json:23`, `.opencode/skills/system-spec-kit/mcp_server/package.json:20`]
- Alternative explanation considered: A production launcher might build spec-kit separately before starting code-graph. This remains possible outside the reviewed package scripts, but no reviewed runtime/build surface guarantees it.
- Final severity: P1 remains appropriate because a missing local generated artifact can prevent the MCP server from loading at all in a clean checkout/runtime.
- Confidence: high.
- Downgrade trigger: Add and verify a deterministic build/start dependency that creates the traversal dist before code-graph imports `code-graph-context.js`, or move the import behind the flagged branch with a graceful disabled/error path.

### P1-002 [P1] Seeded-PPR trace output loses the multi-hop provenance chain

- Claim adjudication update: The trace-loss path is reachable from the live `code_graph_context` MCP tool surface when the process env flag is enabled and a caller requests impact mode with trace output.
- Evidence: The advertised schema accepts `queryMode: "impact"` and `includeTrace`; the handler passes `args.includeTrace` into `buildContext`; `buildContext` passes `args.includeTrace === true` into `expandAnchor`; seeded-PPR activates for `mode === "impact"` plus `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`; and the seeded-PPR branch records `recordWhyIncluded` from only the candidate edge. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:82`, `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:105`, `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:301`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:295`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:452`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:457`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1112`, `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:1129`]
- Counterevidence sought: A real handler guard forbidding `includeTrace` with seeded-PPR impact mode, or evidence that no live caller can set `includeTrace:true`.
- Counterevidence result: No such guard appears on the handler path; the feature catalog explicitly tells debug callers they can pass `includeTrace:true`. [SOURCE: `.opencode/skills/system-code-graph/feature_catalog/context-retrieval/code-graph-context.md:33`]
- Alternative explanation considered: No internal production caller hardcodes this combination today. That does not make it future-only because MCP callers can supply the schema-declared arguments directly when the env flag is enabled.
- Final severity: P1 remains appropriate because the flagged feature's live trace mode can emit incomplete provenance for multi-hop impact candidates.
- Confidence: high.
- Downgrade trigger: Add a handler/schema gate that prevents the combination, or preserve and assert the full PPR hop chain in `why_included.edgeChain` for multi-hop candidates.

## P2

No new P2 findings.

# Traceability Checks

- `spec_code` core: CONDITIONAL. Runtime handler tracing confirms P1-001 is startup-reachable and P1-002 is live-tool reachable under the experimental flag; no counterevidence in reviewed package/build scripts mitigates them.
- `checklist_evidence` core: CONDITIONAL inherited from P1-003. This iteration did not re-adjudicate packet completion-state drift.
- `feature_catalog_code` overlay: CONDITIONAL. The feature catalog confirms `includeTrace:true` is operator-facing, which supports P1-002 reachability.
- `playbook_capability` overlay: CONDITIONAL inherited from P2-005.
- `skill_agent` and `agent_cross_runtime` overlays: not re-reviewed in this iteration.

# Verdict

CONDITIONAL. No new findings, but P1-001 and P1-002 are stronger after runtime reachability review, and all three active P1s remain unresolved.

# Next Dimension

Iteration 7 should keep `stopPolicy=max-iterations` and broaden into runtime launcher/daemon surfaces: inspect `.opencode/bin/code-index.cjs`, IPC socket launch paths, opencode/Claude MCP config references, and any startup docs/scripts that could provide or fail to provide the missing spec-kit dist build guarantee.

Review verdict: CONDITIONAL
