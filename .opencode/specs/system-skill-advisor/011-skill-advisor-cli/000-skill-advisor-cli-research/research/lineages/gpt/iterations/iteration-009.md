# Iteration 9: KQ9 Risks and Design Deltas

## Focus

Create implementation deltas with file/mechanism/acceptance evidence.

## Findings

1. D1: Generated Node CLI registry. Mechanism: combine `TOOL_DEFINITIONS`, advisor Zod schemas, and skill graph descriptor schemas into subcommands. Acceptance: `--help` lists all 9 tools and schema validation matches MCP errors [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts:37].
2. D2: Legacy Python reconciliation. Mechanism: keep `skill_advisor.py` for `advisor_recommend` and batch modes while delegating new full-parity subcommands to the Node CLI or documenting unsupported modes. Acceptance: 10-prompt parity fixture passes both paths [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:3603].
3. D3: Trusted-caller CLI policy. Mechanism: require explicit maintainer flag or local operator token for `skill_graph_scan` and `skill_graph_propagate_enhances --mode apply`. Acceptance: untrusted default fails closed [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts:34].
4. D4: Warm hook path. Mechanism: hooks use daemon IPC or in-process compat, never one native Python bridge per prompt. Acceptance: cache-hit p95 stays below existing hook tests' 60ms bar [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/codex-user-prompt-submit-hook.vitest.ts:198].
5. D5: Rebuild/scan job semantics. Mechanism: expose synchronous CLI for manual runs with progress and nonzero exits; do not run in prompt-submit hooks. Acceptance: rebuild publishes generation and reports before/after status [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-rebuild.ts:84].
6. D6: Orphan reaping. Mechanism: lease owner, process group, stale socket probe, and worktree-aware sweeper integration. Acceptance: simulated stale lease/no-socket does not leave extra launchers.
7. D7: Config migration. Mechanism: keep MCP registrations unchanged; add CLI docs and optional hook fallback env. Acceptance: OpenCode/Codex/Claude configs continue to register `mk_skill_advisor` [SOURCE: file:opencode.json:47].
8. D8: Exit map. Mechanism: inherit 0 success, 1 runtime/error, 64 usage, 69 unavailable, 75 temporary/stale dependency. Acceptance: CLI failures are scriptable and match spec-memory convention.

## Sources Consulted

- Registry, Python shim, trusted handlers, tests, config

## Assessment

`newInfoRatio`: 0.66. Deltas are implementation-ready; some acceptance tests will need a mutation-capable phase.

## Reflection

What worked: risk-to-delta conversion. What failed: no direct implementation in research scope. Ruled out: a recommend-only final CLI.

## Recommended Next Focus

KQ10: final verdict and effort.
