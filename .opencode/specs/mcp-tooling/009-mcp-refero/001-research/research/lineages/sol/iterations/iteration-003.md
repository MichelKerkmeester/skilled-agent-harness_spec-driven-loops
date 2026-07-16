# Iteration 3: mcp-remote OAuth, local state, and failure boundary

## Focus

Trace how the existing `npx -y mcp-remote https://api.refero.design/mcp` manual bridges stdio to Refero’s remote HTTP server, initiates OAuth, stores credentials, selects transports, and surfaces failures—without launching the package or changing authentication state.

## Actions Taken

1. Searched for the authoritative `mcp-remote` package repository and current published package metadata.
2. Read the official `geelen/mcp-remote` README, including auth, headers, transport strategies, flags, storage, and troubleshooting.
3. Enumerated current source files and package metadata from the official repository.
4. Read source excerpts for configuration storage, OAuth client provider, proxy setup, browser authorization, and protected-resource discovery.
5. Compared the bridge behavior with the Refero 401 and OAuth metadata observed in iteration 1.

## Findings

- F-015: `mcp-remote` is an experimental local bridge: it presents a stdio MCP server to the host and proxies bidirectionally to a remote MCP endpoint with auth. The existing manual is therefore structurally correct for a Code Mode runtime that consumes stdio manuals while Refero itself speaks remote HTTP. [SOURCE: https://github.com/geelen/mcp-remote] [SOURCE: file:.utcp_config.json:148]
- F-016: The default remote strategy is `http-first`, falling back to SSE only if HTTP returns 404. Refero documents MCP over HTTP, so the existing command needs no transport flag; forcing `sse-only` would contradict the official Refero setup. [SOURCE: https://github.com/geelen/mcp-remote#transport-strategies] [SOURCE: https://doc.refero.design/mcp/getting-started]
- F-017: With no custom `Authorization` header in `.utcp_config.json`, `mcp-remote` performs OAuth discovery, opens the system browser, listens on localhost port 3334 by default (choosing another free port if needed), and uses a 30-second callback timeout by default. Refero’s docs explicitly support OAuth when a bearer token is not supplied. [SOURCE: https://github.com/geelen/mcp-remote] [SOURCE: https://doc.refero.design/mcp/getting-started]
- F-018: OAuth material is persistent local state. `mcp-remote` stores client information, tokens, and the PKCE verifier beneath `MCP_REMOTE_CONFIG_DIR` or `~/.mcp-auth`, further namespaced by package version and a hash of server URL/resource/headers. Debug mode also writes detailed auth logs there. The transport packet must never read, return, log, or manage these credential files; it should only report actionable bridge errors. [SOURCE: https://github.com/geelen/mcp-remote/blob/main/src/lib/mcp-auth-config.ts] [SOURCE: https://github.com/geelen/mcp-remote/blob/main/src/lib/node-oauth-client-provider.ts]
- F-019: Refero’s `WWW-Authenticate` advertises a protected-resource metadata URL that currently returns 404. Current `mcp-remote` source treats 404 as a discovery miss and falls through to path/root well-known discovery. Because Refero’s authorization-server metadata is available at the API origin and advertises dynamic registration plus authorization-code flow, the existing OAuth bridge is plausibly recoverable, but this remains an inference until an authenticated browser flow is completed. [SOURCE: https://github.com/geelen/mcp-remote/blob/main/src/lib/protected-resource-metadata.ts] [SOURCE: https://api.refero.design/.well-known/oauth-authorization-server]
- F-020: Static bearer mode is possible through `--header` with an environment placeholder, but the existing manual intentionally has no credential field. A downstream skill should not add secrets, ask the model to handle tokens, or duplicate auth configuration. If operators choose bearer auth later, it belongs in manual/environment configuration, not Code Mode arguments or skill prose. [SOURCE: https://github.com/geelen/mcp-remote#custom-headers] [SOURCE: file:.utcp_config.json:152]
- F-021: The manual’s unpinned `mcp-remote` package name means runtime behavior can move with the npm latest/cache resolution. The current package is 0.1.38 and calls itself experimental. Research can document this dependency and test behavior, but this phase must not rewrite the pre-existing manual or claim a stable package-level API. [SOURCE: https://www.npmjs.com/package/mcp-remote] [SOURCE: https://github.com/geelen/mcp-remote/blob/main/package.json]
- F-022: Useful error classes for the packet are: auth required/browser action; callback timeout; token exchange/refresh failure; invalid/stale local auth state; remote transport mismatch/unavailable; unknown or gated tool; Refero quota/rate response; and invalid tool arguments. Remediation should point to operator-owned auth/configuration, never execute destructive token clearing automatically. [SOURCE: https://github.com/geelen/mcp-remote#troubleshooting] [SOURCE: https://doc.refero.design/mcp/tools]

## Questions Answered

- What authentication, session, transport, and error behavior applies when the existing `.utcp_config.json` manual launches `mcp-remote` against `https://api.refero.design/mcp`? The bridge is stdio-to-HTTP, OAuth-or-header capable, locally stateful, browser/callback based, and error-prone at specific operator-owned boundaries.

## Questions Remaining

- Determine the downstream packet’s exact Code Mode allowlist and argument validation.
- Determine how the packet delegates design intent, register, workflow mode, and reference synthesis to `sk-design` without making Refero the taste authority.
- Define verification fixtures that do not require committing credentials or invoking destructive auth cleanup.
- Verify whether existing sibling transport packets already provide reusable error/Code Mode patterns.

## Sources Consulted

- https://github.com/geelen/mcp-remote
- https://github.com/geelen/mcp-remote/blob/main/package.json
- https://github.com/geelen/mcp-remote/blob/main/src/lib/mcp-auth-config.ts
- https://github.com/geelen/mcp-remote/blob/main/src/lib/node-oauth-client-provider.ts
- https://github.com/geelen/mcp-remote/blob/main/src/lib/protected-resource-metadata.ts
- https://www.npmjs.com/package/mcp-remote
- https://api.refero.design/mcp
- https://api.refero.design/.well-known/oauth-authorization-server
- file:.utcp_config.json:148

## Assessment

- newInfoRatio: 0.66
- Novelty justification: This pass established the bridge’s OAuth discovery, browser callback, token-storage, transport-selection, versioning, and actionable error boundaries beyond the prior server-side 401 evidence.
- Confidence: High for `mcp-remote` documented/source behavior; medium for Refero end-to-end OAuth because the browser/token flow was intentionally not executed.

## Reflection

- What worked and why: Reading the package’s current source clarified persistent credential state and 404 fallback behavior that the README alone did not fully specify.
- What did not work and why: A credential-free research session cannot prove successful Refero token exchange, refresh, or authenticated tool listing.
- What I would do differently: Preserve the inference boundary explicitly and make a credentialed smoke test an operator-only downstream verification, not a research prerequisite.

## Ruled Out

- Force SSE for Refero: official Refero docs specify HTTP and `mcp-remote` already defaults to HTTP-first. [SOURCE: https://doc.refero.design/mcp/getting-started]
- Put bearer tokens in Code Mode calls or skill files: secrets belong in operator-controlled environment/manual configuration. [SOURCE: https://github.com/geelen/mcp-remote#custom-headers]
- Automatically delete `~/.mcp-auth` on failures: it is credential state and destructive cleanup requires operator intent. [SOURCE: https://github.com/geelen/mcp-remote#troubleshooting]

## Dead Ends

- Credential-free confirmation of Refero OAuth success: browser authorization and token exchange require a Refero account and would write local auth state outside the lineage. [SOURCE: https://doc.refero.design/mcp/getting-started]

## Recommended Next Focus

Inspect existing `mcp-tooling`, Code Mode, and `sk-design` packet contracts to derive the exact downstream `mcp-refero` architecture, allowlisted read-only functions, judgment handoff, and reusable verification/error patterns.
