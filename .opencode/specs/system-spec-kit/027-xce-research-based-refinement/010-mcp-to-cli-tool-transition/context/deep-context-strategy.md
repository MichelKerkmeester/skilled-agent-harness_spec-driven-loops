# Deep Context Strategy: MCP to CLI Tool Transition

## Scope

Gather context on:

- `.opencode/skills/system-code-graph`
- `.opencode/skills/system-skill-advisor`
- `.opencode/skills/system-spec-kit`

Target packet: `specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition`.

## Recovery Note

The first invocation bypassed the command host workflow and dispatched a leaf `deep-context` analyzer directly. That produced an in-chat package only. This packet restores the expected host-owned artifact layout under `context/` using two native seats that swept the same focus.

This recovery packet is intentionally honest about limitations:

- It is native-only. The default CLI seats were not run.
- Code Graph was reindexed, but structural reads were blocked by a stale/failing gold-query verification gate referencing old pre-extraction paths.

## Frontier

| rank | slice | source | notes |
|------|-------|--------|-------|
| 1 | `system-code-graph` MCP tool schema/dispatch/readiness boundary | direct-read fallback | `code_graph_query` remained blocked after reindex due verification gate failure |
| 2 | `system-skill-advisor` MCP tool schema/dispatch/plugin bridge | direct-read fallback | stable advisor and skill-graph tool IDs are migration constraints |
| 3 | `system-spec-kit` boundary/hook/bootstrap/memory dispatch | direct-read fallback | caller side of code graph and advisor ownership boundaries |

## Executor Pool

| label | kind | model | prompt framework | status |
|-------|------|-------|------------------|--------|
| native-a | native | default `deep-context` seat | none | succeeded |
| native-b | native | default `deep-context` seat | none | succeeded |

## Known Context

- Parent spec states the program spans spec-memory CLI, code-index CLI, and skill-advisor CLI workstreams.
- Parent spec explicitly says `code_graph_query` and `code_graph_context` remain stable MCP tool IDs while implementation and docs live under `system-code-graph`.

## Thresholds

| threshold | value |
|-----------|-------|
| maxIterations | 8 |
| convergenceThreshold | 0.10 |
| relevanceGate | 0.55 |
| agreementMin | 2 |

## Next Focus

Use this report as a planning input. If a full default-pool run is required later, archive this `context/` packet and rerun `/deep:start-context-loop:auto` after repairing the code-graph gold-query battery.
