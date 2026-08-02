# Iteration 1: Official surface inventory and tool taxonomy

## Focus

Map the official Webflow MCP surface: server identity and package identity, deployment modes (remote vs local), tool module inventory, and MCP 2.0 headline capabilities — the foundation for classifying operations (Q1) and authentication (Q2).

## Findings

1. **Official server identity.** The maintained implementation is `webflow/mcp-server` (GitHub, open-source) published as npm `webflow-mcp-server` v1.0.1 (MIT, `bin: dist/index.js`). Built on `@modelcontextprotocol/sdk` 1.25.2, `webflow-api` (official JS SDK) 3.2.1, express 5.1.0, socket.io 4.8.1, zod 3.25.76. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/package.json]
2. **Architecture: translation layer, not passthrough.** The server "acts as a translation layer that exposes Webflow's APIs as MCP tools", wrapping Webflow's REST (Data) and Designer APIs into MCP tools any MCP-compatible agent can execute. Repo layout: `src/index.ts`, `src/mcp.ts`, `src/modules/`, `src/schemas/`, `src/tools/`, `src/types/`, `src/utils/`. [SOURCE: https://developers.webflow.com/data/v2.0.0/docs/ai-tools.md §"How the MCP server works"]
3. **Two deployment modes.** (a) **Remote**: `{"url": "https://mcp.webflow.com/sse"}` with OAuth authorization per-site — "authorize multiple Webflow sites without storing API keys locally"; remote authorization is **experimental** (relies on `mcp-remote` npm package). (b) **Local**: `npx -y webflow-mcp-server@latest` with `WEBFLOW_TOKEN` env var; requires the operator to register and publish their own "Webflow MCP Bridge App" Designer extension (workspace Admin permissions). [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md; https://developers.webflow.com/data/v2.0.0/docs/ai-tools.md §"Remote deployment"]
4. **Tool module inventory (official repo `src/tools/`)**: aiChat, cms, comments, components, deAsset, deComponents, deElement, dePages, deStyle, deVariable, enterprise, localDeMCPConnection, pages, rules, scripts, sites, webhooks, workflows — 18 modules total. The `de*` prefix (Designer) modules plus `localDeMCPConnection` are canvas/bridge-bound. [SOURCE: https://api.github.com/repos/webflow/mcp-server/git/trees/main?recursive=1]
5. **Bridge App is optional for most actions (MCP 2.0 change).** The earlier "keep a browser tab with the bridge app open" requirement is gone for most actions; only canvas-bound access (current canvas, "update the page I'm on", current selection/page/mode/branch/breakpoints) triggers bridge-app instructions. The companion app auto-installs to authorized sites after OAuth and "must remain open in the Designer" only for Designer API tools. [SOURCE: https://webflow.com/blog/mcp-2-features; https://developers.webflow.com/data/v2.0.0/docs/ai-tools.md §"Designer companion app"]
6. **MCP 2.0 headline capabilities** (official announcement): component creation from screenshot (props, variants, slots, metadata, built from existing elements/styles); full CSS variable collection access (read, create, reorder, add variable modes — 50+ design tokens in one conversation); per-site Agent Instructions (always-on **rules** + on-demand **skills**, can reference Webflow primitives); plain-language analytics queries; plus forms, assets, SEO schemas, custom code accessible in agent conversations. [SOURCE: https://webflow.com/blog/mcp-2-features]
7. **Runtime and operational requirements.** Node.js 22.3.0+ for the MCP server; OAuth token reset via `rm -rf ~/.mcp-auth`; docs accessible as `https://developers.webflow.com/llms.txt` and per-page markdown via `.md` suffix (e.g. `/data/docs/ai-tools.md`). [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md; https://developers.webflow.com/data/v2.0.0/docs/ai-tools.md §"Node.js compatibility", §"LLMS.txt documentation"]

## Sources Consulted

- [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md] (fetched 200)
- [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/package.json] (fetched 200)
- [SOURCE: https://api.github.com/repos/webflow/mcp-server/git/trees/main?recursive=1] (fetched 200)
- [SOURCE: https://webflow.com/blog/mcp-2-features] (fetched 200)
- [SOURCE: https://developers.webflow.com/data/v2.0.0/docs/ai-tools.md] (fetched 200)

## Assessment

- **newInfoRatio: 1.0** — First pass; every finding is net-new to this lineage.
- Confidence: high for server identity, deployment modes, and module inventory (all official sources). Per-module action semantics (which actions are destructive/publish-capable/deploy-capable) not yet enumerated — deferred to iteration 2.

## Reflection

- What worked: GitHub tree API is the authoritative module inventory source; the announcement blog explicitly confirms the "no more bridge app" change; docs `.md` suffix yields clean markdown for citation.
- What failed: none material this iteration.
- Ruled out: the assumption that the Bridge App is always required (official MCP 2.0 announcement explicitly removes that requirement for non-canvas actions).

## Recommended Next Focus

Extract the per-module action inventory and operation classes from `src/tools/*.ts` (combined-tool pattern, HTTP-method classification) to answer Q1 (read-only / draft-safe / destructive / publish-capable / deployment-capable), and record which modules carry `de*` Designer/bridge gating.
