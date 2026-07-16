# Iteration 3: Read-only Code Mode transport packet, UTCP manual, and sk-design pairing

## Focus

Convert the first-party findings into implementation-ready transport and registration guidance without inventing an unauthenticated tool inventory or allowing the transport to make design judgments.

## Actions Taken

- Read the local Code Mode configuration guide and validator to confirm the `manual_call_templates` and MCP server shape.
- Read the local mcp-figma transport contract and its UTCP manual exemplar for read-only transport and `sk-design` pairing conventions.
- Reconciled those local contracts with Mobbin's Streamable HTTP endpoint and OAuth flow.
- Reviewed the public source surface again for exact tool-schema gaps and operational constraints.

## Findings

1. The paste-ready manual should be named `mobbin`, use `call_template_type: "mcp"`, and register a single `mobbin` server. Code Mode's local validator requires a transport field; its documented remote-MCP compatibility pattern is a stdio `mcp-remote` wrapper. The wrapper should target `https://api.mobbin.com/mcp`, preserving Streamable HTTP at the external hop while satisfying the current Code Mode config shape. [SOURCE: file:.opencode/skills/mcp-code-mode/references/configuration.md] [SOURCE: file:.opencode/skills/mcp-code-mode/scripts/validate_config.py] [SOURCE: https://github.com/mobbin/mobbin-mcp-server/blob/main/mcp.json]

2. The manual should contain no Mobbin API-key environment variable. First-use browser OAuth belongs to the remote MCP connection; API-key Bearer auth is documented for the separate REST API. [SOURCE: https://docs.mobbin.com/mcp/build-an-integration] [SOURCE: https://docs.mobbin.com/api/quickstart]

3. Code Mode calls should go through `mcp__code_mode__call_tool_chain` only. With the standard manual namespace rule, the likely call name is `mobbin.mobbin_search_screens`, but the packet must first run `search_tools()`/`tool_info()` and record the live name and schema after OAuth. The public skill confirms the logical MCP operation as `search_screens`; it does not prove the prefixed runtime name or full input/output JSON schema. [SOURCE: file:.opencode/skills/mcp-code-mode/references/naming_convention.md] [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/assets/utcp_figma_manual.md] [SOURCE: https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md]

4. The packet should declare `packetKind: "transport"`, `backendKind: "mobbin-remote-mcp"`, `mutatesWorkspace: false`, and forbid `Write`, `Edit`, `Bash`, and `Task`. It may return links, metadata, and inline images as ephemeral research context, but it must not write `.mobbin` boards or any workspace artifact. This follows the repository's transport convention and the requested read-only boundary. [SOURCE: file:.opencode/skills/mcp-tooling/mode-registry.json] [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/SKILL.md]

5. `mcp-mobbin` must not make palette, typography, hierarchy, or other taste decisions. After retrieval, pair the transport with `sk-design` and load the appropriate design context before making a judgment; the transport's output is evidence, not an authority. [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md] [SOURCE: file:.opencode/skills/sk-design/design-md-generator/SKILL.md]

6. The packet's first live smoke test is: authenticate in the browser, discover the tool surface, verify the `search_screens` schema, call one narrow query with a limit of five, confirm the response includes expected screen metadata and image/link evidence, and confirm no write-capable tool is admitted to the read-only route. [SOURCE: https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md] [SOURCE: https://docs.mobbin.com/mcp/clients/other]

7. Rate limiting and revocation belong in operational guidance: back off on `429` using `Retry-After`, and revoke the integration from Mobbin Account Settings → MCP when access must be removed. [SOURCE: https://docs.mobbin.com/rate-limits] [SOURCE: https://docs.mobbin.com/mcp/disconnect]

## Questions Answered

- What UTCP shape? An `mcp` manual named `mobbin` with a stdio `mcp-remote` adapter to the official URL.
- Is an API key needed? No; do not add an env key.
- What runtime method? Code Mode `call_tool_chain` only, after discovery.
- What packet boundary? Read-only transport, no workspace mutation, no board writes.
- Who owns judgment? `sk-design`, as the mandatory cross-hub pairing.
- What remains a gate? Authenticated `tools/list`, exact prefixed tool name/schema, and one live `search_screens` call.

## Questions Remaining

- Whether this Code Mode version's `mcp-remote` dependency negotiates Mobbin's Streamable HTTP and OAuth flow without extra flags.
- Whether the live Mobbin server exposes additional read tools beyond `search_screens`.
- Whether the server's authenticated response schema has changed since the published skill text.

## Ruled Out

- Direct SSE declaration for a Streamable HTTP-only endpoint without runtime support.
- Hardcoded full tool inventory before authenticated `tools/list` discovery.
- Workspace board writes or transport-owned design judgment.

## Assessment

- `newInfoRatio`: `0.62`
- Novelty justification: This pass converted evidence into the packet/manual contract and made runtime validation and unknown-schema handling explicit.
- Confidence: high for the external URL, no-key OAuth model, Code Mode manual shape, read-only boundary, and pairing rule; medium for the adapter's live negotiation and exact tool schema.

## Reflection

- Worked: local Code Mode examples resolve the mismatch between a remote Streamable HTTP server and the repository's validated MCP configuration shape.
- Ruled out: direct SSE claims, hardcoded full tool inventories, workspace writes, and transport-owned design judgment.
- Limitation: no authenticated live MCP session was available to freeze the final schema.

## Recommended Next Focus

Implement the packet and manual from `research.md`, then run the authenticated discovery/smoke-test gate before enabling any tool call in production routing.

## Sources Consulted

- [SOURCE: file:.opencode/skills/mcp-code-mode/references/configuration.md]
- [SOURCE: file:.opencode/skills/mcp-code-mode/scripts/validate_config.py]
- [SOURCE: file:.opencode/skills/mcp-code-mode/references/naming_convention.md]
- [SOURCE: file:.opencode/skills/mcp-tooling/mode-registry.json]
- [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md]
- [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/SKILL.md]
- [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/assets/utcp_figma_manual.md]
- [SOURCE: file:.opencode/skills/sk-design/design-md-generator/SKILL.md]
- [SOURCE: https://github.com/mobbin/mobbin-mcp-server/blob/main/mcp.json]
- [SOURCE: https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md]
- [SOURCE: https://docs.mobbin.com/mcp/build-an-integration]
- [SOURCE: https://docs.mobbin.com/mcp/clients/other]
- [SOURCE: https://docs.mobbin.com/rate-limits]
- [SOURCE: https://docs.mobbin.com/mcp/disconnect]
