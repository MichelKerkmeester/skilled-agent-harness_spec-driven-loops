# Iteration 1: Official server identity, transport, authorization, and plan eligibility

## Focus

Establish the official Mobbin MCP endpoint, protocol transport, authorization model, plan gate, and the distinction between MCP access and the separate REST API.

## Actions Taken

- Read the official Mobbin MCP server README, `mcp.json`, and `server.json`.
- Read Mobbin's MCP introduction, integration guide, client guide, product overview, REST API quickstart, and rate-limit documentation.
- Performed a read-only request to the hosted endpoint and its OAuth protected-resource metadata endpoint.

## Findings

1. The official server is hosted at `https://api.mobbin.com/mcp`. The public server manifest identifies the remote as `streamable-http`; the repository does not describe a local package or stdio launch command. [SOURCE: https://github.com/mobbin/mobbin-mcp-server/blob/main/server.json]

2. The official client configuration is intentionally minimal: clients that support remote MCP add a server URL of `https://api.mobbin.com/mcp`. [SOURCE: https://github.com/mobbin/mobbin-mcp-server/blob/main/mcp.json]

3. MCP authorization is OAuth/browser based. Mobbin's integration guide describes protected-resource metadata, Dynamic Client Registration, PKCE with `S256`, the `openid` scope, and Bearer access tokens after authorization; the client guide tells users to add the URL and sign in in a browser on first use. [SOURCE: https://docs.mobbin.com/mcp/build-an-integration] [SOURCE: https://docs.mobbin.com/mcp/clients/other]

4. A read-only request without an `Authorization` header returned `401` and a `WWW-Authenticate` protected-resource metadata reference. The protected-resource document names `https://api.mobbin.com/mcp` and supports the `openid` scope. This corroborates the OAuth model but does not replace a successful authenticated MCP handshake. [SOURCE: https://api.mobbin.com/mcp] [SOURCE: https://api.mobbin.com/.well-known/oauth-protected-resource/mcp]

5. Mobbin documents MCP availability for Pro, Team, and Enterprise. The MCP documentation does not list the Free plan as eligible, so the packet must gate MCP setup as paid-plan-only rather than presenting it as a Free-plan capability. [SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://docs.mobbin.com/mcp/build-an-integration]

6. The API-key model belongs to the separate REST API: the overview assigns REST API access to Team and Enterprise and MCP access to OAuth-backed remote MCP plans, while the REST quickstart specifies an API-key Bearer header. A Mobbin API key must not be requested or placed in the MCP manual. [SOURCE: https://docs.mobbin.com/overview] [SOURCE: https://docs.mobbin.com/api/quickstart]

7. Mobbin documents a per-user MCP limit of 60 requests per 60 seconds and `429` recovery via `Retry-After` and exponential backoff. This is an operational guard for the packet, not evidence of a tool schema. [SOURCE: https://docs.mobbin.com/rate-limits]

## Questions Answered

- What is the official endpoint? `https://api.mobbin.com/mcp`.
- What is the external transport? Streamable HTTP.
- Is an API key required for MCP? No; OAuth/browser authorization is the documented model.
- Which plans are eligible? Pro, Team, or Enterprise; Free is not documented as eligible.
- Is the REST API credential model interchangeable with MCP? No.

## Questions Remaining

- Which authenticated tools and exact JSON schemas are returned by `tools/list`?
- Does the live server expose only `search_screens` or additional search/detail tools?

## Ruled Out

- Local Mobbin stdio server package: official manifests identify a hosted remote endpoint.
- API-key-only MCP authentication: OAuth is the documented MCP model; API keys belong to the separate REST API.
- Free-plan MCP entitlement: Free is not listed in the official MCP plan gate.

## Assessment

- `newInfoRatio`: `0.95`
- Novelty justification: This pass established the complete public protocol/auth/plan baseline needed to reject local stdio and API-key-only designs.
- Confidence: high for endpoint, transport, OAuth, plan gate, and REST/MCP credential separation; medium for rate-limit behavior until a real authenticated request is observed.

## Reflection

- Worked: first-party GitHub manifests and Mobbin docs agree on the hosted endpoint and remote model.
- Ruled out: a local Mobbin server package, a Free-plan MCP assumption, and an MCP API-key configuration.
- Limitation: public metadata does not publish the authenticated tool inventory.

## Recommended Next Focus

Read the official Mobbin skills repository and `mobbin-search` skill to establish the concrete search workflow, query semantics, response shape, and install path.

## Sources Consulted

- [SOURCE: https://github.com/mobbin/mobbin-mcp-server]
- [SOURCE: https://github.com/mobbin/mobbin-mcp-server/blob/main/README.md]
- [SOURCE: https://github.com/mobbin/mobbin-mcp-server/blob/main/mcp.json]
- [SOURCE: https://github.com/mobbin/mobbin-mcp-server/blob/main/server.json]
- [SOURCE: https://docs.mobbin.com/mcp/introduction]
- [SOURCE: https://docs.mobbin.com/mcp/build-an-integration]
- [SOURCE: https://docs.mobbin.com/mcp/clients/other]
- [SOURCE: https://docs.mobbin.com/overview]
- [SOURCE: https://docs.mobbin.com/api/quickstart]
- [SOURCE: https://docs.mobbin.com/rate-limits]
- [SOURCE: https://api.mobbin.com/mcp]
- [SOURCE: https://api.mobbin.com/.well-known/oauth-protected-resource/mcp]
