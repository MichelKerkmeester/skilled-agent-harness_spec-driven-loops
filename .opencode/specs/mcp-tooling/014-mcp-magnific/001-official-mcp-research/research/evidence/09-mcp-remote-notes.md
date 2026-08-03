# mcp-remote (npm) — capability notes for Magnific bridge evaluation

Source: `npm view mcp-remote readme`, version **0.1.38** (fetched 2026-08-02).

## Identity

- "Remote proxy for Model Context Protocol, allowing local-only clients to connect to remote
  servers using oAuth."

## OAuth support

- Implements the MCP authorization specification: browser-based OAuth flow (opens/prints a URL),
  PKCE, token storage and automatic refresh.
- OAuth state stored under `~/.mcp-auth/` keyed by server URL; `--resource <url>` isolates
  sessions per tenant/server instance (each unique combination of server URL, resource, and custom
  headers keeps separate OAuth sessions).
- OAuth redirect listener: default port `3334`, configurable by passing a port after the server URL;
  falls back to a random open port if unavailable. `--host` flag changes the registered callback
  host (default `localhost`).

## Token / header injection

- `--bearer-token <token>` — bypass interactive OAuth with an existing token.
- `--header "Authorization: Bearer ${AUTH_TOKEN}"` (or `--header "Authorization:${AUTH_HEADER}"` as
  an env var, no spaces around `:`; spaces are OK inside the env value) — custom headers on all
  requests, e.g. for token-based auth or non-OAuth servers.

## Transport

- Targets SSE (`https://.../sse`) and streamable HTTP endpoints (v0.1.38; DPoP support for
  streamable-http targets is in this line of releases).
- Exposes a stdio MCP server locally, so stdio-only clients (Code Mode manual templates) can reach
  remote OAuth-protected servers.

## Other flags relevant to the Magnific integration

- `--ignore-tool <pattern>` — filters matching tools from `tools/list` and blocks `tools/call`
  requests; supports wildcards (`*`). Can act as a hard safety block for destructive/credit tools.
- `--debug` — verbose auth/connection logs to `~/.mcp-auth/{server_hash}_debug.log`.
- `--silent`, `--enable-proxy`, `--allow-http` (trusted private networks only).

## Fit for mcp-magnific

- Magnific: streamable HTTP + OAuth 2.0 (Keycloak) → `npx -y mcp-remote https://mcp.magnific.com`
  is the same shape as the existing `mobbin` / `refero` Code Mode templates.
- No secrets in repo: token lives in `~/.mcp-auth/` after the operator completes the browser flow.
- Device-code grant advertised by Magnific's auth server is a documented fallback for headless
  environments; mcp-remote's browser flow is the primary path.
