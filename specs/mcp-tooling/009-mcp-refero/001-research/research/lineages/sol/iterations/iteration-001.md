# Iteration 1: Authoritative Refero MCP surface and live unauthenticated behavior

## Focus

Establish the current official developer surface from Refero documentation and the official skill repository, then compare it with a non-mutating unauthenticated request to the live MCP endpoint.

## Actions Taken

1. Searched current official Refero documentation for MCP tools, setup, authentication, plans, and limits.
2. Opened the current Getting Started and Tools documentation plus the official `referodesign/refero_skill` repository.
3. Sent read-only GET and JSON-RPC `initialize` requests to the live MCP URL without credentials.
4. Requested the advertised OAuth protected-resource metadata and authorization-server metadata.
5. Read the official repository's raw `SKILL.md`; the recursive GitHub tree request failed because the shell treated the unquoted query string as a glob.

## Findings

- F-001: Current official documentation exposes eight tools across three layers: `refero_search_styles`, `refero_get_style`, `refero_search_screens`, `refero_get_screen`, `refero_get_similar_screens`, `refero_get_screen_image`, `refero_search_flows`, and `refero_get_flow`. The current docs explicitly reject old `_tool` names, numeric screen IDs, `get_design_guidance`, and old search arguments such as `limit`, `offset`, `image_size`, and `include_similar`. [SOURCE: https://doc.refero.design/mcp/tools]
- F-002: Styles are the visual-direction layer; screens are the concrete interface-pattern layer; flows are the journey-sequencing layer. Official guidance says visual work should begin with styles, then use screens and flows for product-specific decisions. [SOURCE: https://doc.refero.design/mcp/getting-started] [SOURCE: https://doc.refero.design/mcp/tools]
- F-003: The documented remote transport is HTTP at `https://api.refero.design/mcp`. Authentication can use OAuth or `Authorization: Bearer <token>`. Refero Pro is required, and Pro includes 8,000 MCP tool calls per month; Business offers higher limits and usage-based/custom arrangements. [SOURCE: https://doc.refero.design/mcp/getting-started]
- F-004: Both unauthenticated GET and JSON-RPC `initialize` returned HTTP 401 with `WWW-Authenticate: Bearer`, required scope `files:read`, and a protected-resource metadata URL. That advertised protected-resource URL returned 404, while `/.well-known/oauth-authorization-server` returned usable metadata: issuer `https://refero.design`, authorization-code and client-credentials grants, dynamic client registration, token and revocation endpoints, and scopes `read` and `files:read`. This confirms authentication is mandatory and identifies a discovery inconsistency that the transport must surface rather than hide. [SOURCE: https://api.refero.design/mcp] [SOURCE: https://api.refero.design/.well-known/oauth-authorization-server]
- F-005: The official skill's methodology is research-first and reference-locked: do not copy one reference, do not average conflicting references into a safe middle, preserve token/component roles, synthesize before implementation, and validate the rendered result against the locked direction. This is design judgment, not transport behavior. [SOURCE: https://github.com/referodesign/refero_skill/blob/master/SKILL.md]
- F-006: The existing manual's stdio command (`npx -y mcp-remote https://api.refero.design/mcp`) is a bridge to the documented remote HTTP endpoint. The downstream packet should preserve that existing manual and call through Code Mode; it should not invent a second server URL or silently inject credentials. [SOURCE: file:.utcp_config.json:148] [SOURCE: https://doc.refero.design/mcp/getting-started]

## Questions Answered

- What tools does the live Refero MCP expose for apps, screens, flows, and elements, with which parameters, defaults, and response shapes? Official current schemas establish the exposed surface; authenticated `tools/list` remains a later verification angle.
- How does the official `referodesign/refero_skill` repository structure UI-reference search workflows, prompts, output handling, and failure guidance? The root skill establishes the three-layer research workflow and judgment rules; referenced files still need inventory.

## Questions Remaining

- Confirm all parameter constraints and detailed response fields against Data Model and Examples pages.
- Determine how `mcp-remote` handles Refero OAuth in the existing stdio manual and how bearer-token setups should be represented without secrets.
- Separate documented monthly call quota from undocumented burst/rate limits and batch/image constraints.
- Inventory the repository's reference files and translate its methodology into a non-overlapping `sk-design` pairing.
- Map current tools into a minimal Code Mode API and error contract.

## Sources Consulted

- https://doc.refero.design/mcp/getting-started
- https://doc.refero.design/mcp/tools
- https://github.com/referodesign/refero_skill
- https://github.com/referodesign/refero_skill/blob/master/SKILL.md
- https://api.refero.design/mcp
- https://api.refero.design/.well-known/oauth-authorization-server
- file:.utcp_config.json:148

## Assessment

- newInfoRatio: 1.00
- Novelty justification: This first evidence pass established the current eight-tool surface, current Pro/auth limits, official methodology, and a previously unknown live OAuth discovery inconsistency.
- Confidence: High for documented tool names, documented quota, and observed 401/auth metadata; medium for authenticated runtime parity because no Refero credential was used.

## Reflection

- What worked and why: Current Mintlify documentation plus direct unauthenticated HTTP probes provided authoritative schemas and observable auth behavior without mutating the remote service.
- What did not work and why: The recursive GitHub tree query was unquoted, so zsh rejected the URL before the read-only request ran.
- What I would do differently: Quote every URL containing `?`, then read the repository reference files and Refero Data Model/Examples pages in the next pass.

## Ruled Out

- Treat the cached four-tool, numeric-ID, `limit`/`offset` documentation as current: the current official Tools page explicitly defines an eight-tool UUID/page-based surface and lists the older patterns as mistakes. [SOURCE: https://doc.refero.design/mcp/tools]
- Treat Refero MCP as anonymously usable: the live endpoint rejects both GET and `initialize` without Bearer authorization. [SOURCE: https://api.refero.design/mcp]

## Dead Ends

- Unauthenticated `tools/list`: authentication blocks live tool enumeration, so official schemas are the authoritative source until a credentialed verification is available. [SOURCE: https://api.refero.design/mcp]

## Recommended Next Focus

Complete the exact schema inventory from the current Tools, Data Model, and Examples documentation and quote-safe GitHub repository tree/reference reads; explicitly reconcile obsolete repository/docs examples with the current surface.
