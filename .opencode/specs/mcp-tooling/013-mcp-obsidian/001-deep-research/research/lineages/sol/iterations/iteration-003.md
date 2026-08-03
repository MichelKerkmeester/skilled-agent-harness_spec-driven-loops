# Iteration 3: MCP identities, transports, and app boundaries

## Focus

Verify the strongest MCP adoption candidates by exact install identity, transport, authentication, Obsidian-app dependency, and coverage of CRUD, search, backlinks, daily notes, tags, frontmatter, and templates.

## Findings

1. **Adopt the Local REST API plugin's built-in MCP endpoint as the primary app-running MCP surface.** This is not an npm MCP package: it is the MCP service bundled in the Obsidian community plugin `coddingtonbear/obsidian-local-rest-api`, reached at `https://127.0.0.1:27124/mcp/` over Streamable HTTP. It requires `Authorization: Bearer <API key>`, trust for the plugin's self-signed certificate, and a running Obsidian desktop app. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
2. **The built-in endpoint covers the core mcp-obsidian contract without a wrapper.** Its documented tools include vault list/read/write/append/patch/delete/move/copy, document maps, active-file lookup, simple and JsonLogic search, vault-wide tag counts, command list/execute, and opening a file in the UI. Frontmatter is available through read and patch operations. Daily/periodic notes and templates are reachable indirectly through Obsidian command execution, but there are no dedicated backlinks or template tools in the published table. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
3. **`cyanheads/obsidian-mcp-server` has a verified npm and binary identity, but remains app-coupled.** The npm package is exactly `obsidian-mcp-server`, version 3.2.9 in the inspected upstream `package.json`, and its bin is also `obsidian-mcp-server`; supported launches are `npx -y obsidian-mcp-server@latest` or `bunx obsidian-mcp-server@latest`. It offers STDIO and Streamable HTTP, but every tool call forwards to Local REST API, so it still requires the plugin, token, and running app. [SOURCE: https://raw.githubusercontent.com/cyanheads/obsidian-mcp-server/main/package.json] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]
4. **The cyanheads wrapper is richer and safer than the built-in endpoint in some client-facing details, not in headlessness.** It adds section-aware edits, path scopes, read-only mode, optional command exposure, pagination, optional Omnisearch, outgoing-link parsing, and server-side HTTP auth. It does not document true backlink queries or dedicated template tools. Its required vault token is `OBSIDIAN_API_KEY`; related configuration uses `OBSIDIAN_BASE_URL`, `OBSIDIAN_VERIFY_SSL`, `OBSIDIAN_REQUEST_TIMEOUT_MS`, `OBSIDIAN_READ_PATHS`, `OBSIDIAN_WRITE_PATHS`, and `OBSIDIAN_READ_ONLY`. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]
5. **`StevenStavrakis/obsidian-mcp` is the verified headless-filesystem MCP candidate.** The npm package and binary are both exactly `obsidian-mcp` (version 1.0.6 in the inspected upstream package file), launched with `npx -y obsidian-mcp /absolute/vault/path`. It talks directly to the vault filesystem, needs no Obsidian process and no bearer token, and covers note CRUD, move, directory creation, content search, and tag management. It does not expose documented backlinks, daily-note semantics, generic frontmatter operations, or templates. [SOURCE: https://github.com/StevenStavrakis/obsidian-mcp/blob/main/package.json] [SOURCE: https://github.com/StevenStavrakis/obsidian-mcp]
6. **`@huangyihe/obsidian-mcp` is a real scoped npm identity, not a placeholder, but its hybrid design adds ambiguity.** Its binary is documented as `obsidian-mcp`; configuration uses `OBSIDIAN_VAULT_PATH`, `OBSIDIAN_API_TOKEN`, and `OBSIDIAN_API_PORT`. It advertises Local REST API plus filesystem fallback and broad CRUD/search/folder/patch capabilities, yet still lists Obsidian Desktop and Local REST API as prerequisites. This is weaker operational clarity than either direct built-in MCP adoption or an explicitly filesystem-only profile. [SOURCE: https://github.com/newtype-01/obsidian-mcp]
7. **MCP ranking after identity verification:** (1) adopt Local REST API's built-in Streamable HTTP MCP for the default live-vault profile; (2) adopt `obsidian-mcp` only as an optional headless-filesystem profile when reduced semantics are acceptable; (3) use `obsidian-mcp-server` only if the host cannot consume authenticated remote MCP or needs its safety/pagination features; (4) do not build a fresh full MCP server unless the mode must expose one stable tool schema across both live-app and headless profiles. [INFERENCE: based on the verified Local REST API, cyanheads, StevenStavrakis, and newtype-01 capability and dependency contracts]

## Ruled Out

- Treating any Local REST API wrapper as headless: the wrapper process can run separately, but vault operations still require the in-app plugin and a running Obsidian instance.
- Assuming package names from repository names: each candidate's README or `package.json` was checked before recommendation.
- Selecting a third-party wrapper merely to obtain MCP: the Local REST API plugin now ships its own MCP endpoint.

## Dead Ends

- Build a redundant REST-to-MCP translation layer for the default profile.
- Use `@huangyihe/obsidian-mcp` as the default despite its mixed REST/filesystem contract and nonstandard `OBSIDIAN_API_TOKEN` naming.

## Edge Cases

- Ambiguous input: “headless MCP” can mean the MCP process is headless while Obsidian still runs; this iteration uses the stricter meaning that vault operations work without Obsidian.
- Contradictory evidence: none after separating wrapper-process headlessness from vault-backend headlessness.
- Missing dependencies: no live Obsidian instance was available for behavioral smoke tests; recommendations rely on upstream package metadata and tool inventories.
- Partial success: backlinks and template support remain gaps in the dedicated MCP tool surfaces and are deferred to the final architecture/config pass.

## Sources Consulted

- https://github.com/coddingtonbear/obsidian-local-rest-api
- https://github.com/cyanheads/obsidian-mcp-server
- https://raw.githubusercontent.com/cyanheads/obsidian-mcp-server/main/package.json
- https://github.com/StevenStavrakis/obsidian-mcp
- https://github.com/StevenStavrakis/obsidian-mcp/blob/main/package.json
- https://github.com/newtype-01/obsidian-mcp

## Assessment

- New information ratio: 0.79
- Questions addressed: community MCP identities; transports; authentication; app dependency; feature coverage.
- Questions answered: strongest default MCP candidate; exact package/binary identities; strict headless classification; major feature gaps.

## Reflection

- What worked and why: upstream package metadata removed identity ambiguity, while the current READMEs exposed transport and dependency boundaries.
- What did not work and why: marketplace-style discovery produced many similarly named servers without proving install identity; exact repositories and package files were required.
- What I would do differently: test the built-in endpoint and filesystem MCP against one fixture vault when implementation begins, because published inventories cannot prove edge-case behavior.

## Recommended Next Focus

Map the repository's existing `mcp-click-up` dual CLI+MCP conventions into an Obsidian-specific environment/config contract, then produce the final BUILD-vs-ADOPT ranking and feature matrix.
