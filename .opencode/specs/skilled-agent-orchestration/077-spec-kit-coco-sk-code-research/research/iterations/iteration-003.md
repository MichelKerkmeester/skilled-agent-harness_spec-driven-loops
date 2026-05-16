# Iteration 3 — System-Spec-Kit MCP Surface Drift

## Focus
Audited the `system-spec-kit` MCP tool surface against the docs that describe memory, resume, graph, save, and CocoIndex maintenance behavior. This pass stayed on the MCP registration/dispatch boundary and the public docs that agents use to decide which tool to call.

## Actions Taken
- Action 1: Read strategy Sections 3, 6-12 and prior iterations `iteration-001.md` / `iteration-002.md` to avoid repeating the surface map and validator-default-path findings.
- Action 2: Read `mcp_server/tool-schemas.ts`, `mcp_server/context-server.ts`, `mcp_server/tools/index.ts`, and the dispatcher modules for memory, lifecycle, code graph, skill graph, advisor, and coverage graph routing.
- Action 3: Compared the MCP reference docs in `references/memory/memory_system.md` with the actual `TOOL_DEFINITIONS` registry.
- Action 4: Traced `memory_save` schema validation and handler behavior for routed canonical saves, including planner-mode defaults and generated follow-up arguments.
- Action 5: Spot-checked session resume/bootstrap handlers for the advertised memory/code-graph/CocoIndex composite payload shape.

## Findings

### system-spec-kit

### F-003-001 — Listed CocoIndex MCP tools are exposed but not dispatched [P1]
`tool-schemas.ts` defines `ccc_status`, `ccc_reindex`, and `ccc_feedback` at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:735`, `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:741`, and `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:753`, then includes them in `TOOL_DEFINITIONS` at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:975`-`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:978`. The memory reference also documents those tools as L7 maintenance calls at `.opencode/skills/system-spec-kit/references/memory/memory_system.md:139`-`.opencode/skills/system-spec-kit/references/memory/memory_system.md:141`.

The dispatch side does not include a CocoIndex dispatcher. `ALL_DISPATCHERS` only includes context, memory, causal, checkpoint, lifecycle, code graph, skill graph, advisor, and coverage graph modules at `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:91`-`.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:100`; `lifecycle-tools.ts` handles L7-ish tools but its `TOOL_NAMES` stops at `session_bootstrap` and does not include any `ccc_*` names at `.opencode/skills/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:39`-`.opencode/skills/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:52`. Because `dispatchTool()` returns `null` for unrecognized names at `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:109`-`.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:120`, `context-server.ts` then throws `Unknown tool: ${name}` at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1022`-`.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1028`.

Concrete fix target: either implement a `cccTools` dispatcher and handlers, or remove the `ccc_*` descriptors/docs and route CocoIndex status/reindex/feedback through the dedicated `mcp-coco-index` MCP surface.

### F-003-002 — `memory_save` advertises routed continuity writes but public schema cannot request the full-auto path [P1]
The public `memory_save` descriptor says routed saves write continuity into canonical spec documents at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:222`-`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:224`, and its schema exposes `routeAs` / `mergeModeHint` as canonical-routing hints. Runtime default is planner-first: `SPECKIT_SAVE_PLANNER_MODE` defaults to `plan-only` at `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:179`, and `handleMemorySave()` treats any routed save as a plan when `plannerMode !== 'full-auto'` at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2703`-`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2724`. That branch returns a `plannerMode: 'plan-only'` response rather than applying the canonical write at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3028`-`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3057`.

The handler's own follow-up tells callers to retry with `plannerMode: 'full-auto'` at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2980`-`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2987`, but `plannerMode` is not accepted by the MCP input schema. The Zod schema only allows `filePath`, `force`, `dryRun`, `skipPreflight`, `asyncEmbedding`, `routeAs`, `mergeModeHint`, and governance fields at `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:245`-`.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:255` and `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:720`-`.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:724`.

Concrete fix target: either expose `plannerMode` / `targetAnchorId` in the public schema with guarded semantics, or change the descriptor and planner follow-ups so agents do not believe MCP `memory_save({ routeAs })` can directly perform canonical continuity writes under the default configuration.

### F-003-003 — MCP reference table is stale relative to the registry [P2]
`references/memory/memory_system.md` says the public surface is "54 `spec_kit_memory` tools" and "50 local descriptors from `mcp_server/tool-schemas.ts` plus 4 Skill Advisor descriptors" at `.opencode/skills/system-spec-kit/references/memory/memory_system.md:96`-`.opencode/skills/system-spec-kit/references/memory/memory_system.md:99`. The table that follows ends after `ccc_feedback()` at `.opencode/skills/system-spec-kit/references/memory/memory_system.md:101`-`.opencode/skills/system-spec-kit/references/memory/memory_system.md:141`.

The registry now includes local descriptors that the table does not list, including `memory_retention_sweep` at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:329`-`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:332`, `code_graph_verify` at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:657`-`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:677`, `skill_graph_scan/query/status/validate` at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:692`-`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:731`, and `deep_loop_graph_*` tools at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:818`-`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:897`. `TOOL_DEFINITIONS` also imports the 4 advisor descriptors and then appends the CocoIndex and coverage graph tools at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:971`-`.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:984`.

Concrete fix target: generate this table from `TOOL_DEFINITIONS` or add a registry-vs-docs test. The current hand-maintained count and table can hide both missing docs and exposed-but-uncallable tools like `ccc_*`.

### mcp-coco-index

No new direct mcp-coco-index finding this iteration. The system-spec-kit MCP drift around `ccc_*` should feed iteration 4's CLI/MCP parity pass because it decides whether CocoIndex maintenance belongs in the spec-kit MCP or only in the coco-index MCP.

### sk-code

No new direct sk-code finding this iteration. Cross-skill interaction remains open for later iterations.

## Questions Answered
- Q1: Partially answered. The highest MCP-surface drift is that `ccc_*` tools are registered and documented but not dispatched, and the memory reference table is stale relative to `TOOL_DEFINITIONS`.
- Q2: Partially answered. Existing context-server dispatch coverage appears vulnerable to registry/dispatcher drift; it did not prevent exposed `ccc_*` descriptors from lacking handlers.
- Q3: Partially answered only at the integration boundary. system-spec-kit documents and registers CocoIndex maintenance tools, but the dispatch path does not implement them.

## Questions Remaining
- Q2: Still open for `generate-context.js` coverage depth and metadata refresh failure modes.
- Q3: Still open for mcp-coco-index CLI/MCP parity, freshness behavior, and decision-tree drift in the dedicated surface.
- Q4: Still open for live CocoIndex query/rank checks against `sk-code` resources.
- Q5: Still open for detailed sk-code OpenCode reference/assets gaps.
- Q6: Still open for `STACK_FOLDERS` and resource_map drift.
- Q7: Still open for cross-skill loading during `/spec_kit:complete`-style writes.

## Next Focus (for iteration 4)
Audit `mcp-coco-index` CLI vs MCP parity and decision-tree drift. Start with `mcp-coco-index/SKILL.md`, the CLI command definitions, the MCP server `search` schema/handler, and install/status scripts; explicitly compare them against the now-questionable `system-spec-kit` `ccc_*` maintenance descriptors so ownership of CocoIndex status, reindex, and feedback is clear.
