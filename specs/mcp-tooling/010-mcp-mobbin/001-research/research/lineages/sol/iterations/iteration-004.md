# Iteration 4: Code Mode Manual and Transport-Packet Architecture

## Focus

Translate the official Mobbin endpoint and OAuth model into this repository's actual Code Mode/UTCP conventions, then define the read-only transport boundary and `sk-design` pairing that phases 002–003 must author.

## Actions Taken

1. Inspected the current name-keyed `.utcp_config.json` schema and its hosted-OAuth `refero` precedent.
2. Read the local Code Mode configuration, naming, discovery, and invocation contracts.
3. Compared Mobbin's Streamable HTTP + OAuth requirement with `mcp-remote`'s stdio bridge, HTTP-first transport, OAuth support, token persistence, and runtime prerequisites.
4. Read `sk-design`'s transport-versus-judgment boundary and the exact phase 002/003 deliverables.

## Findings

1. The ready-to-paste manual should be a new element of `manual_call_templates[]` with the same value in `name` and `config.mcpServers` key. The evidence-backed shape is:

   ```json
   {
     "name": "mobbin",
     "call_template_type": "mcp",
     "config": {
       "mcpServers": {
         "mobbin": {
           "transport": "stdio",
           "command": "npx",
           "args": [
             "-y",
             "mcp-remote",
             "https://api.mobbin.com/mcp"
           ],
           "env": {}
         }
       }
     }
   }
   ```

   This is a Code Mode stdio adapter around Mobbin's hosted Streamable HTTP server, not a claim that Mobbin itself speaks stdio. It mirrors the existing `refero` remote-manual shape and the Code Mode remote-OAuth example. [SOURCE: .utcp_config.json:147] [SOURCE: .opencode/skills/mcp-code-mode/references/configuration.md:162] [SOURCE: .opencode/skills/mcp-code-mode/references/configuration.md:468] [SOURCE: https://docs.mobbin.com/mcp/clients/other]
2. `mcp-remote` is the compatibility bridge because the repository's current Code Mode MCP manuals launch stdio processes, while Mobbin requires an HTTP MCP client with OAuth. `mcp-remote` explicitly adapts stdio-only clients to remote authorized MCP servers, tries HTTP first by default, and supports OAuth/DCR. The `-y` flag avoids an interactive npx install prompt. [SOURCE: https://github.com/geelen/mcp-remote] [SOURCE: .utcp_config.json:153] [SOURCE: https://docs.mobbin.com/mcp/build-an-integration]
3. The Mobbin manual must keep `env` empty. No `MOBBIN_API_KEY`, REST workspace key, client secret, access token, or refresh token belongs in `.utcp_config.json` or `.env`. First use should open a browser for Mobbin sign-in/authorization; the bridge persists OAuth client/token state locally under its own auth directory. Packet troubleshooting may name that storage location, but must never print, commit, or copy its contents. [SOURCE: https://docs.mobbin.com/mcp/clients/other] [SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://github.com/geelen/mcp-remote]
4. Runtime/install prerequisites are Node.js 18 or newer, working `node`/`npx`, outbound HTTPS to `api.mobbin.com`, a browser-capable local environment for the OAuth callback, and an eligible Pro/Team/Enterprise account. There is no Mobbin server checkout, global install, or local build step. `npx -y mcp-remote ...` resolves the adapter on demand. [SOURCE: https://github.com/geelen/mcp-remote] [SOURCE: https://github.com/mobbin/mobbin-mcp-server] [SOURCE: https://docs.mobbin.com/mcp/introduction]
5. Code Mode requires progressive discovery: `list_tools()` or `search_tools()`, then `tool_info()` for the exact schema/callable form, then `call_tool_chain({ code })`. With manual name `mobbin`, the documented public tool is expected to call as `mobbin.mobbin_search_screens(...)`, but that callable and its parameters remain **INFERRED until live discovery**. `list_tools()` can return a dotted catalog name while `tool_info()` supplies the underscore callable form. The packet must never guess or bypass this gate. [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:252] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:301] [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md]
6. The transport packet should authorize only Code Mode discovery and calls to the verified read/search surface. It must declare `packetKind: transport`, `mutatesWorkspace: false`, forbid Write/Edit/Task, avoid HTML evidence-board creation, and treat any future live-discovered mutating tool as out of scope pending an explicit contract change. Search results and images are evidence returned to the caller; they are not permission to create local artifacts. [SOURCE: .opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md:79] [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md] [INFERENCE: read-only authorization is narrower than any future server expansion]
7. `sk-design` must be loaded before Mobbin evidence informs a design decision. `mcp-mobbin` owns retrieval and reports only what it fetched; `sk-design` selects interface/foundations/motion/audit judgment, owns taste and proof expectations, and decides whether evidence supports acceptance. For a pure factual lookup with no design judgment, the transport can answer directly. [SOURCE: .opencode/skills/sk-design/SKILL.md:23] [SOURCE: .opencode/skills/sk-design/SKILL.md:172] [SOURCE: .opencode/skills/sk-design/SKILL.md:263]
8. Phase 002 must ship the full packet inventory plus a paste-ready manual asset and discovery/troubleshooting playbooks. Phase 003 adds the manual, registers `mcp-mobbin` on the hub transport axis, creates the `mcp-mobbin -> sk-design` cross-hub pairing, updates routing/metadata, and regenerates the advisor graph. The authoring phase must not edit shared hub files; the integration phase must not redesign packet content. [SOURCE: .opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md:70] [SOURCE: .opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/spec.md:68]

## Questions Answered

- What exact transport packet, `sk-design` pairing, discovery-first calling convention, UTCP registration shape, and troubleshooting guidance should phases 002–003 author? Answered with an evidence-backed manual, install/auth lifecycle, invocation gate, read-only capability boundary, pairing rule, and phase ownership split.

## Questions Remaining

- Does authenticated live `tools/list` expose exactly `search_screens`, and what exact JSON Schema does `tool_info()` report?
- Does a clean first Code Mode connection successfully complete Mobbin OAuth through the current `mcp-remote` release in this environment?
- What residual risks and unsupported claims must the final packet checklist retain?

## Ruled Out

- Registering Mobbin as an unbridged stdio server or local npm server.
- Adding a Mobbin API key, OAuth access token, or client secret to `.env`.
- Calling `mobbin.mobbin_search_screens` before discovery confirms the callable and schema.
- Allowing the transport to write a local evidence board or to act as design-acceptance authority.

## Dead Ends

- A direct Code Mode Streamable HTTP manual could be theoretically attractive, but no current repository manual proves that path; the local standard and hosted-server precedent use stdio plus `mcp-remote`.

## Edge Cases

- First run may appear stalled while the browser OAuth flow waits for the local callback.
- Headless/remote sessions may not be able to open the browser or receive the localhost redirect without operator action.
- `list_tools()` catalog spelling and callable spelling differ; only `tool_info()` is authoritative for invocation.
- `mcp-remote` is an external adapter described by its maintainer as experimental; the packet must keep discovery and doctor checks explicit rather than claiming guaranteed compatibility.

## Sources Consulted

- `.utcp_config.json`
- `.opencode/skills/mcp-code-mode/SKILL.md`
- `.opencode/skills/mcp-code-mode/references/configuration.md`
- `.opencode/skills/mcp-code-mode/references/naming_convention.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md`
- `.opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/spec.md`
- https://docs.mobbin.com/mcp/clients/other
- https://docs.mobbin.com/mcp/build-an-integration
- https://github.com/geelen/mcp-remote

## Assessment

- New information ratio: 0.82
- Novelty justification: Seven findings convert prior product facts into repository-ready wiring and packet rules; one maps those rules to the already-specified phase ownership.
- Confidence: high for the manual schema, read-only/pairing rules, and Code Mode workflow; medium for bridge compatibility until a clean authenticated live discovery run succeeds.

## Reflection

- What worked and why: The existing `refero` manual and Code Mode documentation made the repository's remote-OAuth adapter pattern explicit, while `sk-design` supplied a crisp evidence-versus-judgment boundary.
- What did not work and why: Static documentation cannot prove a live OAuth handshake or enumerate the authenticated server's current tool schema.
- What I would do differently: Treat the paste-ready snippet as deployable but unverified, then make live `list_tools`/`tool_info` the first phase-004 validation gate.

## Recommended Next Focus

Adversarial completeness and risk audit: probe public protocol metadata without credentials, retest source freshness and surface completeness, enumerate failure modes, and produce the final phase-002/003 authoring checklist with bounded UNKNOWNs.
