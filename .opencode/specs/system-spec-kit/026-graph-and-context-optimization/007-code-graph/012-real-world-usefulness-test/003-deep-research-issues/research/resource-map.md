# Resource Map

## Code Graph

- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:14` — F-001 **[CLOSED — DESIGN-INTENT]**; default `.opencode` excludes are correct for end-user project-code indexing, with maintainer-mode opt-in available.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:75` — F-004 **[MAINTAINER-ONLY P2]**; invalid `SPECKIT_CODE_GRAPH_INDEX_SKILLS` values collapse to `none`.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:32` — `ReadyResult` lacks machine-readable full-scan reason/safety fields.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:202` — candidate manifest drift predicate.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:293` — active/stored scope fingerprint comparison and scan-argument exemption.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:467` — parse results persisted through per-file graph replacement.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:292` — full-scan stale-file pruning can delete the prior graph.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:335` — scan metadata promotion after zero-node or errored scan.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:348` — parse errors suppress candidate manifest recording.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:402` — scan response truncates errors.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:81` — `code_files` lacks durable parse error text.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:517` — edge replacement can insert edges with zero retained source nodes.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:722` — syntax errors and parser backend crashes share reporting path.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1089` — query read path disables inline full scans.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:166` — context read path disables inline full scans.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:240` — raw CocoIndex MCP seed shape is not normalized.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:153` — verify gates on generic readiness without scope-aware assertion.
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493` — `includeSkills` validates shape but not selected folder existence.

## Hooks

- `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md:63` — docs claim status JSON while implementation writes text payload.
- `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md:24` — registration docs cover advisor path but not startup/compact/stop hooks.
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/README.md:30` — docs register only `UserPromptSubmit`.
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts:206` — `--smoke` exists only for Codex SessionStart.
- `.opencode/skills/system-spec-kit/mcp_server/hooks/README.md:40` — OpenCode hook/plugin bridge smoke path is not concrete.

## Advisor

- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:63` — rebuild skip gate keys only on freshness.
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1487` — startup skill graph scan publishes live state before postcondition check.
- `.opencode/skills/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts:16` — tests conflate freshness and trust state.

## CocoIndex / Memory

- `.opencode/skills/mcp-coco-index/references/tool_reference.md:266` — docs describe stale `file`/`lines` result shape.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1177` — memory search marks CocoIndex available without channel evidence.

## Tests

- `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:285` — normal stale-file removal coverage misses zero-node preservation.
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:671` — parser-error coverage checks formatting, not recovery.
- `.opencode/skills/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:284` — tests lock no-inline-full-scan read-path behavior.

## Config / Docs

- `.codex/config.toml:13` — F-005 **[MAINTAINER-ONLY P2]**; Codex MCP env block lacks code graph maintainer-scope flags, but end users should not need those flags by default.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:261` — env docs omit query/readiness consumption and restart note.
