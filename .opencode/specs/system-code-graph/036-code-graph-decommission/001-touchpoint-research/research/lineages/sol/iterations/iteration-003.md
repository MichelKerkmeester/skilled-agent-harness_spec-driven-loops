# Iteration 3: External executable dependencies and shared contracts

## Focus

Traced imports, RPC calls, CLI shell-outs, generated mirrors, and shared contracts outside the retiring skill tree, while separating the unrelated deep-loop coverage graph.

## Actions Taken

1. Re-read config, state, and strategy.
2. Swept executable file types with `rg --hidden --no-ignore` for skill paths, launcher/shim names, environment keys, MCP namespace, and structural tool calls.
3. Narrowed the results to live `system-spec-kit`, deep-loop, root-bin, plugin, and script source.
4. Read the neutral shared contracts and the Spec Kit code-graph boundary implementation.

## Findings

1. `system-spec-kit/mcp-server/lib/code-graph-boundary.ts` is the primary external programmatic client. It imports MCP client/stdio transport, reads readiness markers, exposes status/query-intent helpers, and calls graph tools over RPC. Removing the server requires deleting or replacing this boundary and every caller, not merely changing docs. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/code-graph-boundary.ts:11] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/code-graph-boundary.ts:167] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/code-graph-boundary.ts:288] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/code-graph-boundary.ts:323]
2. Spec Kit actively consumes the boundary in startup/context behavior: passive enrichment calls `code_graph_context`; memory-surface and Claude session-prime hooks recommend scans/queries; context-server emits `mcp__mk_code_index__*` routing nudges and startup recovery guidance. These must degrade to Grep/Glob/direct-read doctrine or remove the graph channel. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/enrichment/passive-enrichment.ts:1] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/memory-surface.ts:429] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:245] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:490]
3. `system-spec-kit/shared/code-graph-contracts.ts` is nominally neutral but hard-codes the producer `mk-code-index`, readiness vocabulary, tool recommendations, and operational contract. Its exports and `shared/index.ts` consumers need removal or a compatibility stub decision. [SOURCE: .opencode/skills/system-spec-kit/shared/code-graph-contracts.ts:85] [SOURCE: .opencode/skills/system-spec-kit/shared/code-graph-contracts.ts:158] [SOURCE: .opencode/skills/system-spec-kit/shared/index.ts:1]
4. Root maintainers have a dedicated filter script that toggles `SPECKIT_CODE_GRAPH_INDEX_*` values in runtime configs. That script becomes dead and should be deleted or rewritten after registration removal. [SOURCE: scripts/setup-maintainer-filters.sh:24] [SOURCE: scripts/setup-maintainer-filters.sh:47]
5. Generated `dist/` artifacts mirror at least 27 direct graph-dependent source outputs. Decommission changes must modify source and rebuild/remove generated output; hand-editing only `dist/` is invalid, while leaving stale `dist/` preserves behavior after source cleanup. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/dist/lib/code-graph-boundary.js:245] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/dist/context-server.js:490]
6. Tests and stress fixtures assert graph routing, readiness, launcher proxying, CLI behavior, search-quality channels, and plugin status. They are live validation touchpoints and must be removed or replaced alongside source, including `launcher-code-index-*`, `graph-first-routing-nudge`, `session-bootstrap`, `context-server`, `code-graph-boundary`, and search-quality harness cases. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/launcher-code-index-proxy.vitest.ts:55] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/graph-first-routing-nudge.vitest.ts:25] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/stress-test/durability/release-cleanup-new-surfaces-stress.vitest.ts:383]
7. Deep-loop `coverage-graph` storage and its `runtime/scripts/convergence.cjs`/`upsert.cjs` are a separate, direct SQLite evidence graph owned by `system-deep-loop`; they do not use `mk_code_index` and should survive. Only their references that point back into the retiring skill's feature catalog/playbook are stale. [SOURCE: .opencode/skills/system-deep-loop/runtime/references/coverage-graph-schema.md:22] [SOURCE: .opencode/skills/system-deep-loop/runtime/references/integration-points.md:53] [SOURCE: .opencode/skills/system-deep-loop/runtime/references/integration-points.md:87]

## Questions Answered

- Identified the major external RPC boundary, startup/context callers, shared contracts, generated artifacts, and test families.
- Ruled the deep-loop coverage graph out of the decommission blast radius.

## Questions Remaining

- Complete hooks/CI lifecycle inventory.
- Agent grants, command workflows, live doctrine, and archival boundary.
- Ordering and rollback.

## Ruled Out

- Removing all code whose prose contains “code graph”: that would wrongly delete the independent deep-loop coverage graph.
- Editing compiled output without source or source without regenerated output.
- Preserving graph routing hints after server removal without a working replacement.

## Dead Ends

- Generic `code_graph_*` search alone conflates structural MCP tools, internal coverage-graph concepts, test data, and archival prose.

## Edge Cases

- Ambiguous input: “code graph” names two independent live systems.
- Contradictory evidence: none after ownership verification.
- Missing dependencies: none.
- Partial success: source callers are identified; hook and doctrine passes remain.

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp-server/lib/code-graph-boundary.ts:11`
- `.opencode/skills/system-spec-kit/mcp-server/lib/enrichment/passive-enrichment.ts:1`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/memory-surface.ts:429`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:245`
- `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:490`
- `.opencode/skills/system-spec-kit/shared/code-graph-contracts.ts:85`
- `scripts/setup-maintainer-filters.sh:24`
- `.opencode/skills/system-deep-loop/runtime/references/coverage-graph-schema.md:22`

## Assessment

- New information ratio: 0.90
- Novelty: six findings were new; one prevented an over-broad removal.
- Questions addressed: imports, RPC calls, shared contracts, generated artifacts, subsystem boundary.
- Questions answered: executable dependency spine and coverage-graph exclusion.

## Reflection

- What worked and why: searching executable extensions first surfaced actual runtime callers before documentation.
- What did not work and why: generic tool-name output remained too broad until ownership was verified at source.
- What I would do differently: treat system ownership as a first-class classifier for every same-vocabulary match.

## Recommended Next Focus

Inventory every runtime hook, plugin hook, Git hook, CI job, installer, and lifecycle check that starts, refreshes, validates, or cleans up the graph.
