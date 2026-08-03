# Iteration 3: MCP identity, runtime boundary, and Code Mode configuration

## Focus

Close the three remaining MCP and configuration questions. The reducer's carried-forward CLI focus was already resolved in iteration 2, so this forced final iteration broadens to the outstanding MCP candidates, Local REST API contract, and the concrete mcp-click-up-shaped configuration decision.

## Actions Taken

- Verified the Local REST API plugin's built-in Streamable HTTP MCP endpoint, authentication, and endpoint-level feature contract.
- Verified the maintained `obsidian-mcp-server` package identity and its documented `npx` stdio launch path, prerequisites, configuration, and safety controls.
- Verified the published `mcp-obsidian` PyPI package and `uvx` binary path as a lower-scope alternative.
- Compared the candidates against the repository's current stdio Code Mode manual and prefixed environment-variable convention.

## Findings

1. The Local REST API plugin itself is the least-layered MCP candidate: its built-in server is Streamable HTTP at `https://127.0.0.1:27124/mcp/`, authenticated with `Authorization: Bearer <API key>`. The plugin must be installed and enabled in a running Obsidian vault; its self-signed HTTPS certificate must be trusted, or its opt-in HTTP endpoint at `http://127.0.0.1:27123/mcp/` can be used. It is therefore local/app-backed, not headless. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
2. The Local REST API plugin exposes full file CRUD, simple and structured search, tags, active-file operations, targeted frontmatter/heading/block patching, command listing/execution, and UI open. It does not document a first-class backlinks endpoint or a native template API; daily/periodic-note behavior can be reached through configured commands or the active-file/command surface, not assumed as a dedicated neutral API. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
3. `obsidian-mcp-server` is a verified community npm package and executable identity: its upstream documentation provides `npx -y obsidian-mcp-server@latest` for stdio and identifies the same package by name. It wraps Local REST API v4+, so it still requires the running app, enabled plugin, and `OBSIDIAN_API_KEY`; it is not a headless replacement. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://www.npmjs.com/package/obsidian-mcp-server]
4. The cyanheads wrapper is the strongest immediate stdio candidate. Its documented tool surface covers note read/list/search/write/append/targeted patch/replace/delete, tags, frontmatter, UI open, and guarded command execution. It adds `OBSIDIAN_READ_PATHS`, `OBSIDIAN_WRITE_PATHS`, `OBSIDIAN_READ_ONLY`, and opt-in commands, which are useful agent-safety controls absent from a raw remote-endpoint configuration. Its link support is outgoing-link parsing, not a verified backlinks service. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]
5. `mcp-obsidian` is a real PyPI package (0.2.2) with the `uvx mcp-obsidian` executable and `OBSIDIAN_API_KEY` configuration. Its own quick start requires the Local REST API community plugin to be running. It is a valid fallback, but its older release and smaller documented operation set make it lower-ranked than `obsidian-mcp-server`. [SOURCE: https://pypi.org/project/mcp-obsidian/]
6. The existing Code Mode manual establishes an immediately usable stdio shape—`transport: "stdio"`, `command: "npx"`, argument array, and an `env` object. The `.env.example` convention prefixes every server variable with the manual name, so a manual named `obsidian` maps `OBSIDIAN_API_KEY` to `obsidian_OBSIDIAN_API_KEY`, rather than exposing an unprefixed shared secret. [SOURCE: .utcp_config.json:66] [SOURCE: .env.example:1]
7. Direct adoption of the plugin's built-in MCP is architecturally preferred only if Code Mode supports a header-bearing Streamable HTTP manual. The local `.utcp_config.json` examples inspected here establish stdio, not that HTTP schema. Until that capability is confirmed, adopt the verified `obsidian-mcp-server` stdio wrapper; do not invent a remote-HTTP configuration shape. [INFERENCE: based on .utcp_config.json:66 and https://github.com/coddingtonbear/obsidian-local-rest-api]
8. Recommended immediate configuration is a manual named `obsidian`, launched as `npx -y obsidian-mcp-server@latest`, with the mapped secrets/configuration `OBSIDIAN_API_KEY`, `OBSIDIAN_BASE_URL`, `OBSIDIAN_VERIFY_SSL`, `OBSIDIAN_READ_ONLY`, `OBSIDIAN_READ_PATHS`, and `OBSIDIAN_WRITE_PATHS`. Start `OBSIDIAN_READ_ONLY=true` and scoped paths; enable writes or commands only for an explicit operational need. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: .env.example:1]

## Questions Answered

- Which MCP-server candidates have a verified identity and transport, and do they require the Local REST API plugin and a running Obsidian app?
- How does the Local REST API community plugin authenticate and what CRUD/search/backlink/daily-note/tag/frontmatter/template operations does it expose?
- What configuration, auth, environment-prefix, and build-vs-adopt choice best mirrors the local mcp-click-up dual CLI+MCP pattern?

## Candidate Ranking

| Rank | Candidate | Decision | Transport and runtime | Reason |
| --- | --- | --- | --- | --- |
| 1 (current Code Mode) | `obsidian-mcp-server` | Adopt | `npx`/stdio; running Obsidian + Local REST API v4+ + bearer token | Verified executable, richest documented agent controls, fits existing stdio manual shape. |
| 1 (when HTTP manual is proven) | Local REST API built-in MCP | Adopt | Streamable HTTP; running Obsidian + enabled plugin + bearer token | Removes wrapper layer and is the source service itself. |
| 3 | `mcp-obsidian` | Fallback only | `uvx`/stdio; running Local REST API plugin + bearer token | Verified package/binary, but older and less capable in its documented surface. |
| — | A new bespoke MCP server | Do not build now | Would still need the plugin/app or a new vault abstraction | Duplicates native plugin and the stronger wrapper without solving the desktop boundary. |

## Ruled Out

- Treating any Local REST API wrapper as headless: every verified wrapper delegates to the plugin running inside Obsidian. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://pypi.org/project/mcp-obsidian/]
- Configuring the built-in HTTP MCP directly in `.utcp_config.json` before Code Mode's HTTP-manual and custom-header schema is verified. [INFERENCE: based on .utcp_config.json:66]
- Enabling unrestricted command execution or whole-vault writes by default for an autonomous client. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

## Edge Cases

- Self-signed certificate: using HTTPS requires trusting the Local REST API certificate or deliberately configuring the wrapper's `OBSIDIAN_VERIFY_SSL=false`; do not disable verification for unrelated endpoints. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]
- Daily notes and templates: the official CLI has direct documented daily/template commands. In the plugin path, keep these as command-dependent behavior until the target vault's installed plugins and commands are known. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
- Backlinks: preserve the official CLI for verified backlink queries. The reviewed MCP options offer note/link operations but did not establish equivalent first-class backlinks semantics. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

## Sources Consulted

- https://github.com/coddingtonbear/obsidian-local-rest-api
- https://github.com/cyanheads/obsidian-mcp-server
- https://www.npmjs.com/package/obsidian-mcp-server
- https://pypi.org/project/mcp-obsidian/
- .utcp_config.json:66
- .env.example:1

## Assessment

- New information ratio: 0.75
- Novelty justification: This pass resolved all remaining MCP identity, runtime, feature-boundary, and configuration questions; it also identified the only unverified integration assumption—Code Mode's remote HTTP manual schema.
- Questions addressed: verified MCP candidates; Local REST API authentication and capability boundary; mcp-click-up-compatible configuration.
- Questions answered: all remaining key questions.

## Reflection

- What worked and why: First-party plugin documentation established the native endpoint and auth contract, while the cyanheads documentation supplied an independently useful stdio safety layer that matches the existing repository pattern.
- What did not work and why: The current local configuration examples do not establish a safe custom-header Streamable HTTP schema, so the more direct native endpoint cannot be prescribed as the immediate Code Mode implementation.
- What I would do differently: Validate Code Mode HTTP-manual support before implementation; if supported, remove the wrapper rather than maintaining two MCP hops.

## Recommended Next Focus

Synthesize the final BUILD-vs-ADOPT matrix and retain Code Mode HTTP-manual support as the single implementation validation gate.
