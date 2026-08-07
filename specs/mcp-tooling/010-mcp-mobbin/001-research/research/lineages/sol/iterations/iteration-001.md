# Iteration 1: Official Server, Transport, and Authorization Baseline

## Focus

Establish what the official `mobbin-mcp-server` repository actually ships, how a client connects, what authorization mechanism is authoritative, and which parts of the requested "API key model" are disproved before investigating the tool/workflow layer.

## Actions Taken

1. Inspected the official repository landing page and its machine-readable MCP manifests.
2. Followed the repository's documentation link into the official MCP introduction.
3. Cross-checked generic-client, Codex CLI, custom-integration, and revoke-access instructions.
4. Looked for a published local package/runtime implementation and source-level tool definitions.

## Findings

1. The official repository is a registration/documentation repository rather than a published local server implementation: its README points clients to the hosted endpoint, while `mcp.json` contains only a URL registration and `server.json` declares a remote. There is no `package.json`, local launch command, or tool implementation in the repository inventory. [SOURCE: https://github.com/mobbin/mobbin-mcp-server] [SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/mcp.json] [SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/server.json]
2. The canonical endpoint is `https://api.mobbin.com/mcp`, and both repository metadata and product documentation identify the transport as Streamable HTTP. A transport packet should therefore register the remote directly when its client supports HTTP/OAuth; `npx`, a locally installed package, and an stdio server command are not the official install path. [SOURCE: https://github.com/mobbin/mobbin-mcp-server] [SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://docs.mobbin.com/mcp/clients/other]
3. The user-visible credential model is OAuth, not a Mobbin API key: supported MCP clients open a browser on first connection, and the official introduction explicitly says no API key or manual token setup is needed. [SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://docs.mobbin.com/mcp/clients/codex-cli]
4. A custom integration uses OAuth Dynamic Client Registration, PKCE `S256`, and `openid`; it discovers endpoints from protected-resource and authorization-server metadata, obtains access and refresh tokens, and calls the MCP endpoint with a Bearer access token. This is a token-storage hook requirement for a custom client, not a static API-key field for the UTCP manual. [SOURCE: https://docs.mobbin.com/mcp/build-an-integration]
5. Access is account-scoped and revocable. Mobbin documents per-client revocation under Account Settings > MCP, after which the client loses access immediately and must reauthorize. [SOURCE: https://docs.mobbin.com/mcp/disconnect]
6. The official MCP introduction and integration guide both gate server access to Pro, Team, and Enterprise plans. This is the first authoritative plan boundary; free-plan behavior still needs a dedicated pass. [SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://docs.mobbin.com/mcp/build-an-integration]
7. The server's public description is limited to searching real-world UI/UX references and returning screen images inline. That strongly supports a read-only transport classification, but a definitive tool-by-tool read-only claim requires the official skills/tool contracts in the next pass. [SOURCE: https://docs.mobbin.com/mcp/introduction] [INFERENCE: the documented operation retrieves search results and images, but this iteration did not yet enumerate every live tool]

## Questions Answered

- What credential model does the server use, how is the key provisioned/stored, and what does a correct Code Mode manual need to expose? Answered at the protocol level: OAuth/DCR/PKCE with client-managed access and refresh tokens; no static Mobbin API key.
- What is the official transport and install path? Answered: hosted Streamable HTTP remote, registered by URL and authorized interactively.

## Questions Remaining

- What are the exact tool names, inputs, response shapes, and tool-by-tool read-only guarantees?
- How do the official skills decompose app, screen, flow, and element research?
- What exact error does a free account receive and are any limited free MCP calls available?
- Can Code Mode/UTCP natively complete this OAuth flow, or is an OAuth-capable bridge required?

## Ruled Out

- Static `MOBBIN_API_KEY` as the official MCP credential: contradicted by the official MCP introduction and client setup docs.
- An npm-installed local Mobbin server as the official transport: the official repository and manifests publish a hosted Streamable HTTP remote instead.

## Dead Ends

- Searching the server repository for runtime source or a `package.json` cannot produce tool implementations because the published repository inventory contains only registration metadata, docs/rules, and client-plugin assets.

## Edge Cases

- Ambiguous input: the research topic's "auth/API key model" could imply either an MCP credential or the separate REST API key; this iteration selected the MCP credential and defers the REST API distinction.
- Contradictory evidence: none among official sources; the prompt's API-key assumption is corrected by those sources.
- Missing dependencies: no authenticated live MCP session was used, so live `tools/list` output remains unverified.
- Partial success: transport and authorization are authoritative; tool enumeration remains open.

## Sources Consulted

- https://github.com/mobbin/mobbin-mcp-server
- https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/mcp.json
- https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/server.json
- https://docs.mobbin.com/mcp/introduction
- https://docs.mobbin.com/mcp/clients/other
- https://docs.mobbin.com/mcp/clients/codex-cli
- https://docs.mobbin.com/mcp/build-an-integration
- https://docs.mobbin.com/mcp/disconnect

## Assessment

- New information ratio: 1.00
- Novelty justification: This first evidence pass established seven packet-level facts, including the remote-only transport and correction of the presumed API-key model.
- Confidence: high for endpoint, transport, OAuth flow, and eligible plans; medium for global read-only posture pending tool enumeration.

## Reflection

- What worked and why: Following the repository's official documentation link and machine-readable manifests produced mutually consistent protocol and client-setup evidence.
- What did not work and why: Generic code search returned similarly named MCP servers; it was discarded because only the named Mobbin repository and Mobbin-hosted documentation are authoritative.
- What I would do differently: Start the next pass from the official skills repository and docs index instead of expecting the registration repository to contain runtime tool source.

## Recommended Next Focus

Enumerate the official Mobbin skills and their referenced MCP tools, parameters, staged workflows, returned resources, and explicit read-only semantics; compare those contracts with any official API search schema where it clarifies results.
