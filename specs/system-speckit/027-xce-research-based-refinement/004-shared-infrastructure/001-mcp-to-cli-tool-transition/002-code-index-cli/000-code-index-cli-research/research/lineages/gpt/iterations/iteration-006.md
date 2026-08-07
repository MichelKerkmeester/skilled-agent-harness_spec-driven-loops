# Iteration 6: Integration-Surface Migration Map

## Focus

Measure and classify the active surfaces that mention `mk_code_index` or code graph tools.

## Findings

1. Runtime configs register `mk_code_index` in Codex, Claude, and OpenCode with the same launcher and short `/tmp/mk-code-index` socket pin. [SOURCE: file:.codex/config.toml:87] [SOURCE: file:.claude/mcp.json:55] [SOURCE: file:opencode.json:66]
2. The configs document the 8-tool surface and maintainer-mode scan-scope flags. [SOURCE: file:.codex/config.toml:100] [SOURCE: file:opencode.json:81]
3. Doctor routes already list stable code-graph MCP tools as route dependencies. [SOURCE: file:.opencode/commands/doctor/_routes.yaml:85]
4. `/doctor:update` can invoke `code_graph_scan` and `code_graph_apply`; those calls are higher-risk maintenance surfaces and should be migrated later than simple status/read fallback guidance. [SOURCE: file:.opencode/commands/doctor/update.md:98] [SOURCE: file:.opencode/commands/doctor/update.md:213]
5. Deep-research command docs and Codex deep-research agent notes name `code_graph_query` and `code_graph_context` as stable deep-loop tools. [SOURCE: file:.opencode/commands/deep/start-research-loop.md:4] [SOURCE: file:.codex/agents/deep-research.toml:6]
6. The OpenCode plugin has a code-graph status surface and a naming asymmetry: plugin/bridge are `mk-code-graph`, MCP server/tool prefix remains `mk-code-index` / `mcp__mk_code_index__*`. [SOURCE: file:.opencode/plugins/mk-code-graph.js:395] [SOURCE: file:.opencode/plugins/README.md:60]

## Sources Consulted

- `.codex/config.toml`
- `.claude/mcp.json`
- `opencode.json`
- `.opencode/commands/doctor/*`
- `.opencode/commands/deep/start-research-loop.md`
- `.codex/agents/deep-research.toml`
- `.opencode/plugins/*`

## Assessment

`newInfoRatio`: 0.62. The active migration surface is concrete: about 51 files / 163 matching lines in agents, commands, runtime configs, and plugins.

Confidence: medium-high. Counts are pattern-based and should be re-run in the implementation packet.

## Reflection

Worked: separating active surfaces from broad docs/history avoided a misleading 1000+ reference migration scope.

Failed/ruled out: migration of all prose references during dual-stack implementation.

## Recommended Next Focus

Hook latency and warm-only policy.
