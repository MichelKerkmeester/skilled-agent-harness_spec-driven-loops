# Iteration 002 — Security (fail-open and trust boundaries)

## Focus
D2 Security: inspect fail-open hook behavior around the deleted freshness script, and whether retired tool names remain in recovery/compact surfaces that could confuse agents about available capabilities.

## Method
- Re-read post-tool-use.mjs spawn/error path
- Re-read compact-inject topic extraction
- Confirmed no remaining mk_code_index registration that could be an auth/trust boundary issue

## Findings

### P0 - Blockers
None new this iteration (prior P0-001/P0-002 remain active from correctness).

### P1 - Required
- **P1-003**: Fail-open dead spawn masks incomplete hook removal — `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs:62` — Missing freshness script fails silently via runChild null return. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs:62]

### P2 - Advisories
- **P2-001**: compact-inject still tokenizes `code_graph_*` as attention topics — `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/compact-inject.ts:121` — Regex keeps retired tool names in compact context. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/compact-inject.ts:121]

## Adversarial self-check
No new P0 this iteration. P1-003 confirmed as degraded observability / incomplete removal, not an auth bypass.

## Ruled Out
- Active MCP server still exposing code_graph tools with elevated privileges — runtime configs clean; skill absent.
- Doctor route still able to mutate code-graph state — doctor tree has no retired-identity matches.

## Dead Ends
- Process/socket check for mk-code-index blocked in sandbox (sysmon); file absence of socket path `/tmp/mk-code-index` checked (absent).

## Recommended Next Focus
D3 Traceability: map 015/parent completion claims and checklist evidence against live residue; audit matrix-manifest, graph-metadata edges, and plugins README.

Review verdict: CONDITIONAL
