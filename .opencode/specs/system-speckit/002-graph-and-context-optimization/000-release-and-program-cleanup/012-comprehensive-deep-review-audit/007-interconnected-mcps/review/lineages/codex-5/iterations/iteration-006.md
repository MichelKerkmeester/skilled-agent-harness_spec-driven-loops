# Iteration 006 - Interconnected MCP Degradation Replay

Session: fanout-codex-5-1780596001496-uhn96t
Executor: cli-codex model=gpt-5.5
Focus: stabilization: interconnected MCP degradation replay

## Scope Reviewed

- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts`

## Replay Result

No new findings were added. Code-graph and skill-advisor tool IDs are registered in their standalone packages:

- `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:186`
- `.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts:37`

The stale-query degradation mismatch from F006 remained active:

- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:953`
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:875`

Review verdict: PASS
