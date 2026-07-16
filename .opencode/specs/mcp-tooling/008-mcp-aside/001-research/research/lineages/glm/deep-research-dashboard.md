# Deep Research Dashboard - Lineage: glm

> Auto-generated from JSONL state, strategy, and findings registry. Do not edit manually.

## Iteration Table

| run | focus | newInfoRatio | findings count | status |
|-----|-------|--------------|----------------|--------|
| 1 | Aside CLI command surface + MCP server mechanics (install, run/session/account/exec/repl, aside mcp stdio + auth + session/daemon) | 1.00 | 10 | complete |
| 2 | AI-browser workflows + Chrome DevTools bdg contrast + exact .utcp_config.json aside manual + mcp-aside-devtools packet authoring requirements | 0.65 | 7 | complete |

## Question Status

**8/8 answered**

Answered:
- q-cli-surface (run 1)
- q-mcp-server (run 1)
- q-auth-model (run 1)
- q-session-daemon (run 1)
- q-ai-workflows (run 2)
- q-cd-contrast (run 2)
- q-utcp-manual (run 2)
- q-skill-packet (run 2)

Remaining: none

## Convergence Trend

Last 2 newInfoRatio values: **1.00 -> 0.65** (descending)

- Rolling average: 0.825
- Note: convergence is **telemetry only** (stopPolicy = max-iterations); loop ran to maxIterations=2 as instructed.

## Dead Ends / Ruled Out

| Approach | Reason | Iteration |
|----------|--------|-----------|
| `npm install -g aside` | Documented installer is a curl script (releases.aside.com/install.sh), not npm | 1 |

## Blocked Stops

None.

## Graph Convergence

Not emitted (no graph events recorded this lineage).

## Next Focus

maxIterations (2) reached. Loop complete. Next step is out of research scope: author the mcp-aside-devtools packet and validate against a live `aside mcp` server.

## Active Risks

- Documentation gap: aside MCP tool inventory and full REPL function surface are not in public docs; packet must prescribe runtime discovery (not a research blocker — handled).
- Auth failure mode: built-in Aside models fail closed when the account is signed out; packet must document sign-in recovery (`aside account use` / `--account`).
