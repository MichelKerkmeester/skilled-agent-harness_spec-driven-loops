# Iteration 002

## Focus

Verify whether `mcp-remote` persists OAuth credentials and identify the exact static-Bearer CLI flags needed to author the Refero transport packet, while reconciling those details with current Refero setup guidance.

## Actions Taken

- Read the current upstream `geelen/mcp-remote` README, including custom headers, credential storage, transport, debug, and OAuth-client flags.
- Re-read the current official Refero MCP getting-started page and the current `refero_skill` tool reference for setup and contract consistency.
- Compared the verified upstream behavior with the existing local `refero` manual and the phase-2 packet constraints; no installation was executed because the target runtime test could mutate package/auth caches outside the three permitted research-artifact paths.

## Findings

### 1. `mcp-remote` persists OAuth credentials in a local config directory

The upstream README explicitly says `mcp-remote` stores credential information in `~/.mcp-auth`, overridable with `MCP_REMOTE_CONFIG_DIR`. It also says the server URL, `--resource` value, and custom headers determine separate OAuth sessions/token storage. Therefore the packet may document persistence as an upstream `mcp-remote` behavior, but should avoid promising that any particular host/runtime preserves the home directory between runs. A runtime with ephemeral home storage will require re-authentication.

Source: https://github.com/geelen/mcp-remote#troubleshooting

### 2. Static Bearer configuration uses `--header`

The exact upstream form is:

```json
{
  "command": "npx",
  "args": [
    "-y",
    "mcp-remote",
    "https://api.refero.design/mcp",
    "--header",
    "Authorization: Bearer ${AUTH_TOKEN}"
  ],
  "env": { "AUTH_TOKEN": "<token>" }
}
```

For clients that mishandle spaces in argument values, upstream recommends `Authorization:${AUTH_HEADER}` with `AUTH_HEADER` set to `Bearer <token>`. The packet should keep the token in an environment variable and never place a real secret in the manual snippet. OAuth remains the default alternative when `--header` is omitted.

Source: https://github.com/geelen/mcp-remote#custom-headers

### 3. Relevant transport flags are available but should not be added to the base manual

`mcp-remote` defaults to `http-first` and supports `http-only`, `sse-first`, and `sse-only` via `--transport`. It also supports `--debug`, `--silent`, `--auth-timeout`, `--host`, `--resource`, and static OAuth client metadata/information flags. These are troubleshooting or environment-specific options, not required additions to the existing minimal Refero manual. The packet should mention them in troubleshooting only, especially `--debug` and `MCP_REMOTE_CONFIG_DIR`.

Source: https://github.com/geelen/mcp-remote#transport-strategies

### 4. Refero’s current setup guidance corroborates the packet auth posture

Refero documents the canonical endpoint as `https://api.refero.design/mcp`, requires an active Pro subscription, and supports either OAuth or `Authorization: Bearer <token>`. It gives direct HTTP-client examples and states Pro includes 8,000 MCP tool calls per month; business plans have higher/custom limits. The existing stdio bridge therefore remains appropriate for a stdio-only host, with authentication delegated to `mcp-remote` rather than encoded as an anonymous empty environment.

Source: https://doc.refero.design/mcp/getting-started

### 5. The current skill reference reinforces the stale-contract warning

The repository’s current `references/mcp-tools.md` uses the eight-tool surface and current names, requires `platform` for screen/flow search, distinguishes UUID screen/style IDs from flow IDs, and warns against old search parameters such as `limit`, `image_size`, and `include_similar`. Packet authoring should copy current contracts from the official docs/reference, while treating any older examples encountered in the repository history as non-authoritative.

Source: https://github.com/referodesign/refero_skill/blob/master/references/mcp-tools.md

## Questions Answered

- Does `mcp-remote` persist OAuth credentials? Yes: under `~/.mcp-auth`, configurable with `MCP_REMOTE_CONFIG_DIR`; persistence depends on the runtime filesystem.
- What exact static Bearer flags are needed? `--header` followed by `Authorization: Bearer ${AUTH_TOKEN}`; use an environment-backed header value without spaces around the colon when the client has argument-escaping bugs.
- Which extra flags matter for packet troubleshooting? `--debug`, `--transport`, `--auth-timeout`, and `MCP_REMOTE_CONFIG_DIR`; they are not needed in the minimal base manual.
- Do current Refero setup and quota claims agree with iteration 1? Yes: Pro is required, OAuth/Bearer are supported, and the documented Pro quota is 8,000 monthly MCP calls.

## Questions Remaining

- A live `tools/list` response and actual Refero OAuth challenge remain unverified because the API hostname was not reachable in this environment.
- A real installation test against the target host remains unperformed; the exact upstream flags are verified from documentation, but client-specific packaging/caching behavior is not.
- No authoritative per-minute, concurrency, or per-tool Refero rate limit was found.

## Next Focus

Synthesize the final research packet with explicit confidence labels: documented Refero contracts, documented upstream `mcp-remote` behavior, and runtime behavior that still requires installation/live verification.
