# Resource Map (evidence-derived) — Webflow MCP 2.0 lineage

Generated from converged deltas. Categories: official documentation, official server source, repository surfaces.

## Documents

| Resource | Type | Theme |
|----------|------|-------|
| https://webflow.com/blog/mcp-2-features | Official announcement | MCP 2.0 capabilities: components, CSS variables, agent instructions, analytics |
| https://developers.webflow.com/data/docs/ai-tools.md | Official docs | MCP server overview, limitations, installation, FAQs |
| https://developers.webflow.com/data/reference/authentication.md | Official docs | Token types: site, workspace, OAuth |
| https://developers.webflow.com/data/v2.0.0/reference/scopes.md | Official docs | Site-level and workspace-level permission scopes |
| https://developers.webflow.com/data/v2.0.0/reference/authentication/site-token.md | Official docs | Site token creation, minimal-scope practice |
| https://developers.webflow.com/data/v2.0.0/reference/authentication/workspace-token.md | Official docs | Workspace token limits (no site scope) |
| https://developers.webflow.com/data/reference/rate-limits.md | Official docs | Plan-based rate limits, 429 handling, headers |
| https://developers.webflow.com/data/v2.0.0/reference/sites/publish.md | Official docs | Publish endpoint: staging subdomain vs custom domains, 1/min |
| https://developers.webflow.com/llms.txt | Official index | LLM-readable docs index |

## Commands

| Resource | Type | Theme |
|----------|------|-------|
| npx -y webflow-mcp-server@latest (WEBFLOW_TOKEN) | Local server | Local MCP server for stdio transport |
| npx mcp-remote https://mcp.webflow.com/sse | Remote client | Remote OAuth transport (experimental) |

## Code

| Resource | Type | Theme |
|----------|------|-------|
| github.com/webflow/mcp-server | Official source | Server implementation; src/tools/*.ts action schemas |
| npm webflow-mcp-server 1.0.1 | Package | Published server (MIT; MCP SDK 1.25.2, webflow-api 3.2.1) |
| .opencode/skills/mcp-tooling/ | Repository hub | Transport-leaf registration target (mode-registry.json, hub-router.json) |

## Meta

- resource_map_present (spec folder): false — this map is evidence-derived from lineage deltas
- Lineage: deepseek-max (cli-pi deepseek-v4-flash), 5 iterations, stopReason maxIterationsReached
