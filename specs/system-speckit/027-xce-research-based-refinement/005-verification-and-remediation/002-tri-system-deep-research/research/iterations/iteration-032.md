# Iteration 032 — Angle 32

**Angle:** README/SKILL.md alignment with the shipped 8-tool surface, blocked payloads, and CLI fallback contract.

**Summary:** The shipped 8-tool code-index CLI surface is present and list-tools reports all 8 tools. The main gaps are contract-level doc drift: one direct MCP blocked payload is weaker than the documented/CLI-normalized shape, and SKILL fallback/routing prose still conflicts with or underrepresents the shipped CLI fallback and tool families.

**Findings kept:** 3

## [P1][BUG] detect_changes MCP blocked payload lacks explicit requiredAction

- Evidence: .opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:69-80 builds blocked payload with status/affectedSymbols/blockedReason/readiness only; .opencode/skills/system-code-graph/README.md:100-104 says blocked payload includes requiredAction; .opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:783-796 adds requiredAction only in CLI normalization.
- Detail: The direct MCP handler does block safely, but it does not emit the explicit requiredAction field promised by the docs and normalized by the CLI. MCP callers must parse blockedReason or readiness.action, while CLI callers get requiredAction, so the blocked payload contract differs by transport.
- Fix sketch: Add requiredAction: "code_graph_scan" to detect_changes blockedResponse, preferably both top-level and in data to match CLI-normalized shape, and cover direct MCP output in tests.

## [P1][DOC-DRIFT] SKILL fallback contract contradicts shipped CLI fallback

- Evidence: .opencode/skills/system-code-graph/SKILL.md:286 says every tool is callable through node .opencode/bin/code-index.cjs when MCP transport is missing/failed; .opencode/skills/system-code-graph/SKILL.md:294 says mk_code_index MCP unavailable means report state and stop.
- Detail: The same SKILL file both advertises the warm daemon CLI as the MCP transport fallback and then instructs agents to stop when MCP is unavailable. That can cause agents to skip the shipped recovery path for exactly the failure mode the CLI fallback was built to handle.
- Fix sketch: Rewrite the fallback bullet to say use warm-only code-index.cjs when MCP is unavailable, stop only when both MCP and warm CLI/daemon are unavailable, and still never substitute text search for structural answers.

## [P2][README-MISALIGNMENT] system-spec-kit SKILL underlists and overgeneralizes code-graph surface

- Evidence: .opencode/skills/system-spec-kit/SKILL.md:436 names only code_graph_scan/query/context/status/detect_changes and says they share the readiness contract and return blocked/degraded payloads; .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:187-196 defines 8 tools including code_graph_classify_query_intent, code_graph_verify, and code_graph_apply; command `node .opencode/bin/code-index.cjs list-tools --format text --warm-only` printed all 8 tool names.
- Detail: The cross-skill routing guidance is stale relative to the shipped 8-tool surface and blurs per-tool behavior. code_graph_status is always answerable with freshness metadata, classify is text-only, verify blocks on non-fresh readiness, and apply is maintenance/recovery, so grouping the named five under one blocked/degraded contract is misleading.
- Fix sketch: Replace the inline five-tool sentence with a pointer to system-code-graph/references/runtime/tool_surface.md and summarize the 8 tools by read, status/classify, verify, scan, and apply families.
