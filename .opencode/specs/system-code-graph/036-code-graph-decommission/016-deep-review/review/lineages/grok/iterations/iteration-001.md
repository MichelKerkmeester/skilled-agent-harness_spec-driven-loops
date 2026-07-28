# Iteration 001 — Correctness (live behavioral residue)

## Focus
D1 Correctness: verify claimed residual-sweep cleanliness against live mcp-server guidance, session priming, and Cursor Write hook chaining after skill deletion.

## Method
- Confirmed skill directory absent and plugins `mk-code-graph.js` / `mk-code-graph-freshness.js` absent
- Re-read cited production files before recording P0s
- Compared against 015 REQ-002 ("only intended references survive") and phase 004/005 completion claims

## Findings

### P0 - Blockers
- **P0-001**: Live memory tools still recommend deleted `code_graph_query` — `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:1126` — Injects `mcp__mk_code_index__code_graph_query` tip into memory_search/memory_context envelopes for code-search-like queries. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:1126]
- **P0-002**: `tool-schemas` still advertise deleted structural search MCP — `.opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts:216` — `memory_context` and `memory_search` descriptions still direct agents to `mcp__mk_code_index__code_graph_query`. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts:216]

### P1 - Required
- **P1-001**: session-prime Recovery Tools lists deleted `code_graph_*` tools — `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:212` — Startup surface still names four removed tools. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts:212]
- **P1-002**: Cursor post-tool-use still spawns deleted code-graph-freshness hook — `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs:126` — Write path still `runChild`s missing script (fails open). [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs:126]

### P2 - Advisories
None this iteration.

## Adversarial self-check (P0)
- Hunter: tip strings are live executable guidance, not comments.
- Skeptic: could be intentional tombstone strings? No — they are injected into agent-facing envelopes and tool descriptions as actionable tips.
- Referee: CONFIRMED P0 — contradicts residual-sweep / no-live-reference claims and misroutes agents to a missing MCP.

## Ruled Out
- Runtime MCP registration residue in opencode.json / .claude/mcp.json / .codex/config.toml — clean.
- Doctor command tree still routing to code-graph — no matches under `.opencode/commands/doctor`.

## Dead Ends
- Searching CLAUDE.md/AGENTS.md for retired identities — already scrubbed.

## Recommended Next Focus
D2 Security: trust-boundary / fail-open paths around the dead freshness spawn, plus any remaining privilege or path-handling assumptions that still point at the deleted skill tree.

Review verdict: FAIL
