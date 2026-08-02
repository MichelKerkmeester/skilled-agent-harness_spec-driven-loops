# Iteration 2: Official Webflow MCP server surface, transport, setup, and capability organization

## Focus
Investigate one focus only: the official Webflow MCP server surface, transport, setup flow, supported client boundary, and capability organization. The selected interpretation of “supported client boundary” is the client connection support explicitly documented by Webflow, not an exhaustive compatibility claim for every MCP client. Authentication, scopes, rate limits, and safe integration design remain deferred.

## Findings
1. The current official remote surface is documented as Streamable HTTP at `https://mcp.webflow.com/mcp`: Webflow’s MCP registry metadata identifies `com.webflow/mcp` version `2.0.0` with a `streamable-http` remote, and the current getting-started and Claude Code guides use the `/mcp` endpoint with HTTP transport. The official repository README still shows the older `https://mcp.webflow.com/sse` configuration for Cursor and Claude Desktop. This is an unresolved version/documentation contradiction; the current registry metadata and developer setup guides are the stronger evidence for the presently advertised remote endpoint. `[INFERENCE: comparing https://raw.githubusercontent.com/webflow/mcp-server/main/server.json, https://developers.webflow.com/mcp/reference/getting-started.md, https://developers.webflow.com/mcp/installing/claude-code.md, and https://github.com/webflow/mcp-server]`
2. The documented remote setup boundary is client-side MCP configuration followed by Webflow authorization and prompting: Webflow says any agent that supports MCP can be connected manually, while it provides explicit instructions or plugins for Claude Desktop, Claude Code, Cursor, Postman, and Windsurf. The Bridge App installs automatically during OAuth authorization for the remote service. Claude Code uses `claude mcp add --transport http webflow https://mcp.webflow.com/mcp`; Cursor uses a project or global MCP configuration containing the same `/mcp` URL. `[SOURCE: https://developers.webflow.com/mcp/reference/getting-started.md]`
3. The official repository preserves a distinct local OSS path rather than implementing the remote setup in the checked-in entrypoint. Its package metadata exposes `dist/index.js` as the executable, the README launches `webflow-mcp-server@latest` with `WEBFLOW_TOKEN`, and `src/index.ts` requires that environment variable, constructs a `WebflowClient`, registers tool groups, and connects an `StdioServerTransport`. This establishes local stdio plus token configuration as a separate deployment path from the documented remote HTTP service. `[INFERENCE: based on https://raw.githubusercontent.com/webflow/mcp-server/main/package.json, https://raw.githubusercontent.com/webflow/mcp-server/main/README.md, and https://raw.githubusercontent.com/webflow/mcp-server/main/src/index.ts]`
4. The public source organizes capabilities by integration boundary and domain rather than as one flat tool list. `src/mcp.ts` registers Data API-oriented groups for AI chat, CMS, components, pages, scripts, sites, comments, Enterprise, and webhooks; separate Designer groups cover assets, components, elements, pages, styles, and variables; miscellaneous rules and OSS-only local Designer connection tools are registered separately. The repository’s `src/tools` tree mirrors these categories, while `src/modules/designerAppBridge.ts` isolates the Designer bridge module. `[INFERENCE: based on https://raw.githubusercontent.com/webflow/mcp-server/main/src/mcp.ts, https://raw.githubusercontent.com/webflow/mcp-server/main/src/index.ts, https://github.com/webflow/mcp-server/tree/main/src/tools, and https://github.com/webflow/mcp-server/tree/main/src/modules]`
5. The deployed documentation and public repository disagree on the MCP resource surface. Current Webflow documentation says the server exposes read-only MCP resources, including a Webflow Guide resource, and describes Agent Instructions as server-supplied site context; the repository README says this implementation does not include `prompts` or `resources`. The checked-in `mcp.ts` creates server-level instructions but does not by itself prove resource registration, so the remote deployed surface and the public OSS snapshot cannot be treated as identical without a version-specific reconciliation. `[INFERENCE: comparing https://developers.webflow.com/mcp/reference/how-it-works.md, https://github.com/webflow/mcp-server, and https://raw.githubusercontent.com/webflow/mcp-server/main/src/mcp.ts]`

## Ruled Out
- Invoking remote or local Webflow MCP tools was not attempted because the dispatch forbids mutation and repository/Webflow changes; therefore no live tool inventory or runtime transport handshake was collected.
- Non-official client documentation and third-party bridge repositories were excluded; only Webflow developer documentation and the official `webflow/mcp-server` repository were used.
- The guessed `https://developers.webflow.com/mcp/docs/quickstart` path returned “Page Not Found”; the official getting-started page linked by Webflow was used instead. `[SOURCE: https://developers.webflow.com/mcp/docs/quickstart]`
- Authentication, scopes, roles, token handling, rate limits, and operational retry analysis were not expanded because they belong to later strategy questions.

## Dead Ends
The repository README and current developer docs are not a single consistent versioned contract: the README retains an SSE remote URL and says prompts/resources are absent, while current metadata/docs advertise Streamable HTTP and resources. Treating either source alone as the complete current remote surface would overstate certainty. `[INFERENCE: comparing https://github.com/webflow/mcp-server, https://raw.githubusercontent.com/webflow/mcp-server/main/server.json, and https://developers.webflow.com/mcp/reference/how-it-works.md]`

## Edge Cases
- Ambiguous input: “supported client boundary” was limited to Webflow’s named connectors/plugins and its explicit “any MCP-compatible client” manual-connection statement; it is not a certification of every client implementation.
- Contradictory evidence: the official README uses `/sse` and denies prompts/resources, while current Webflow metadata/docs use `/mcp` Streamable HTTP and describe resources. The contradiction remains unresolved and is recorded as likely deployed-surface versus public-repository version drift.
- Missing dependencies: the guessed quickstart URL was unavailable; the official getting-started guide provided the fallback setup evidence.
- Partial success: Q2 is answered for the documented remote/local transport paths, client setup boundary, and source taxonomy, but exact parity between the deployed remote server and the checked-in OSS repository remains open.

## Sources Consulted
- https://developers.webflow.com/mcp/reference/getting-started.md
- https://developers.webflow.com/mcp/reference/how-it-works.md
- https://developers.webflow.com/mcp/installing/claude-code.md
- https://developers.webflow.com/mcp/installing/cursor.md
- https://github.com/webflow/mcp-server
- https://raw.githubusercontent.com/webflow/mcp-server/main/server.json
- https://raw.githubusercontent.com/webflow/mcp-server/main/package.json
- https://raw.githubusercontent.com/webflow/mcp-server/main/README.md
- https://raw.githubusercontent.com/webflow/mcp-server/main/src/index.ts
- https://raw.githubusercontent.com/webflow/mcp-server/main/src/mcp.ts
- https://github.com/webflow/mcp-server/tree/main/src/tools
- https://github.com/webflow/mcp-server/tree/main/src/modules

## Assessment
- New information ratio: 0.90
- Questions addressed: Q2: What is the official MCP server surface, transport, client setup, and supported capability boundary?
- Questions answered: Q2 partially — remote and local transports, setup boundary, named clients, and source-level capability organization are documented; remote/OSS parity remains unresolved.
- Fully new findings: 4
- Partially new findings: 1
- Redundant findings: 0

## Reflection
- What worked and why: Pairing current Webflow setup pages and registry metadata with the repository entrypoint, package metadata, and `mcp.ts` exposed both the deployed remote contract and the local OSS architecture.
- What did not work and why: The repository README and current docs are version-skewed on transport and resources, so neither can independently establish complete current parity.
- What I would do differently: Use official per-tool documentation, tool-directory entries, and changelog records to map which capabilities are available on the remote server versus the OSS/local path and to date the observed version split.

## Recommended Next Focus
Verify unresolved capabilities via official per-tool documentation, tool-directory entries, and changelog records, beginning with the announcement claims that were not mapped to the source-level tool taxonomy. `[INFERENCE: based on the transport/resource contradictions and the remaining Q1 capability gaps]`
