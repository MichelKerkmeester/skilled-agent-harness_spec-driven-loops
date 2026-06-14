# Iteration 1: KQ1 Parity Matrix

## Focus

Classify all public `mk_skill_advisor` MCP tools and map the CLI shape each would need.

## Findings

1. The canonical registry is `TOOL_DEFINITIONS`, not the Python fallback. It registers `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, and the spread of skill graph tool definitions [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts:37].
2. Dispatch is split: advisor tools call handlers directly; all skill graph tools route through `skill-graph-tools.ts` [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts:51].
3. The skill graph registry contains five tools, including the internal trusted-caller `skill_graph_propagate_enhances` [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts:85].
4. CLI mapping should be generated as subcommands: `recommend`, `rebuild`, `status`, `validate`, `graph scan`, `graph query`, `graph status`, `graph validate`, `graph propagate-enhances`.
5. Classification: `advisor_recommend`, `advisor_status`, `advisor_validate`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate` can be read-only/stateless from a caller perspective. `advisor_rebuild`, `skill_graph_scan`, and `skill_graph_propagate_enhances --mode apply` are state-mutating or daemon-coordinated.

## Sources Consulted

- `.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/*.ts`

## Assessment

`newInfoRatio`: 0.92. Confidence high: registry and dispatch lines define the surface exactly.

## Reflection

What worked: starting from the registry avoided stale docs. What failed: assuming the old Python CLI was the registry. Ruled out: treating the existing Python CLI as full parity.

## Recommended Next Focus

KQ2: classify which resident daemon capabilities disappear in a daemonless CLI.
