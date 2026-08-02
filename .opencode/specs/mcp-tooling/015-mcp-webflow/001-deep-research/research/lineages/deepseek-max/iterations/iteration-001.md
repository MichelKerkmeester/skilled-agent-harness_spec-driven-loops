# Iteration 1: Official surface inventory and tool taxonomy

## Focus

Map the official Webflow MCP surface: server flavors (remote vs local), package identity, tool modules, and MCP 2.0 headline capabilities, as the foundation for classifying operations (Q1) and authentication (Q2).

## Findings

1. **Official server identity.** The maintained implementation is `webflow/mcp-server` (GitHub) published as npm `webflow-mcp-server` (v1.0.1, MIT). Built on `@modelcontextprotocol/sdk` 1.25.2, `webflow-api` (official JS SDK) 3.2.1, express 5 + socket.io 4 (bridge-app transport), zod. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/package.json]
2. **Two connection modes exist.** (a) Remote: `"url": "https://mcp.webflow.com/sse"` with OAuth login (MCP remote auth) — no bridge app needed for most actions; (b) Local: `npx -y webflow-mcp-server@latest` with `WEBFLOW_TOKEN` env var (Data API token), requiring a user-registered, published "Webflow MCP Bridge App" Designer extension for canvas-bound operations. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md]
3. **MCP 2.0 headline capabilities** (per official announcement): component creation from screenshot with props/variants/slots/metadata; full CSS variable collection access (read, create, reorder, add modes); per-site Agent Instructions; plain-language analytics queries; plus forms, assets, SEO schemas, custom code in agent conversations. [SOURCE: https://webflow.com/blog/mcp-2-features]
4. **Tool module inventory (official repo `src/tools/`)**: aiChat, cms, comments, components, deAsset, deComponents, deElement, dePages, deStyle, deVariable, enterprise, localDeMCPConnection, pages, rules, scripts, sites, webhooks, workflows. The `de*` prefix modules are Designer/bridge-app-bound (canvas, elements, pages, styles, variables, assets, connection info). [SOURCE: https://api.github.com/repos/webflow/mcp-server/git/trees/main?recursive=1]
5. **Bridge app is now optional for most actions.** Only canvas-dependent capabilities need the Designer open with the Bridge App connected: capturing visual snapshots of elements, and reading/changing the current selection, page, mode, branch, canvas, and breakpoints. [SOURCE: https://developers.webflow.com/data/v2.0.0/docs/ai-tools]
6. **Documented limitations** (official): cannot create/apply Interactions (IX3); manages only uploaded custom font files; cannot create new localized CMS items (can read/update existing and secondary-locale static content); cannot change site/workspace access settings; each authorization grants a single workspace. [SOURCE: https://developers.webflow.com/data/v2.0.0/docs/ai-tools]
7. **Runtime requirement**: Node.js 22.3.0+ for the MCP server. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md]

## Sources Consulted

- [SOURCE: https://webflow.com/blog/mcp-2-features] (seed blog, fetched 200)
- [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md]
- [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/package.json]
- [SOURCE: https://api.github.com/repos/webflow/mcp-server/git/trees/main?recursive=1]
- [SOURCE: https://developers.webflow.com/data/v2.0.0/docs/ai-tools]

## Assessment

- **newInfoRatio: 1.0** — First pass; every finding is net-new to this lineage.
- Confidence: high for server identity, modes, and module inventory (all from official sources). Tool-level action semantics (which are destructive/publish-capable) not yet enumerated — deferred to iterations 2-3.

## Reflection

- What worked: GitHub API tree listing is the fastest authoritative way to enumerate the tool surface; official README covers both connection flavors explicitly.
- What failed: `tools/` path in README is stale relative to the repo layout (`src/tools/`); two developer-docs URLs 404'd before the correct slug was found.
- Ruled out: `webflow-mcp` npm package (v0.4.0, unrelated third-party) is NOT the official server; official is `webflow-mcp-server`.

## Recommended Next Focus

Deep-dive the `de*` + `pages`/`cms`/`components`/`scripts`/`workflows` tool modules to classify each operation class (read-only / draft-safe / destructive / publish / deploy) for Q1, and pin down the OAuth + token + scopes model for Q2.
