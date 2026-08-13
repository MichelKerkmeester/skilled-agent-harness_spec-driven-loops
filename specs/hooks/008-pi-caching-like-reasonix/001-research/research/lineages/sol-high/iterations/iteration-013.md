# Iteration 13: Classify the MCP claim

## Focus

Determine whether “MCP first-class support missing” is a real platform gap and whether it belongs in a cache plugin.

## Findings

- Pi intentionally omits built-in MCP from core. [SOURCE: https://pi.dev/docs/latest/usage]
- Pi’s package catalog contains multiple MCP adapters, including `pi-mcp-adapter`, with server discovery, lazy connection, cached tool metadata, OAuth, prompts, and direct-tool promotion. [SOURCE: https://pi.dev/packages/pi-mcp-adapter]
- Verdict: MCP is absent from core but available through packages. The `lumo.md` phrasing is accurate only if “missing” means “not built in.”
- MCP tool catalogs affect cache stability because tool schemas appear early in provider prompts, but implementing MCP transport is orthogonal to caching and should not be bundled into a cache optimizer.

## Sources Consulted

- `https://pi.dev/docs/latest/usage`
- `https://pi.dev/packages/pi-mcp-adapter`
- `https://pi.dev/packages?name=mcp`

## Assessment

- newInfoRatio: 0.55
- Novelty justification: Resolves the core-versus-package status and removes MCP transport from the proposed caching scope.
- Confidence: High.

## Reflection

- Worked: Package catalog evidence turns a binary gap claim into a platform-layer classification.
- Failed/ruled out: Building an MCP client inside a cache plugin is ruled out.

## Recommended Next Focus

Classify plan mode and approval workflows.
