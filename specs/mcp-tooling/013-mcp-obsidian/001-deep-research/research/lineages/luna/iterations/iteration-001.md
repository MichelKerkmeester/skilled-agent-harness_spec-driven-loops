# Iteration 1: Official surfaces and the app/headless boundary

## Focus

Establish the official Obsidian automation surface, the official headless package, the plugin API boundary, the Local REST API contract, and the `obsidian://` URI boundary.

## Actions Taken

- Read the official CLI, developer, Vault API, MetadataCache, headless, and URI documentation.
- Read the Local REST API community plugin documentation and its built-in MCP surface.
- Compared the surfaces against the requested feature set: note CRUD, search, backlinks, daily notes, tags, frontmatter, and templates.
- Recorded the app, plugin, token, and authentication prerequisites instead of inferring headless support from a command name.

## Findings

1. The official `obsidian` CLI is a desktop-app automation surface, not a standalone vault CLI. The help page documents the command-line interface as enabled from Obsidian settings, with commands for files, search, daily notes, tags, templates, commands, and note creation; when Obsidian is not running, the first command launches it. This makes it suitable for an app-backed adapter but not for a headless server process. [SOURCE: https://obsidian.md/help/cli]

2. `obsidian-headless` is a real official npm package, but its scope is Obsidian Sync and Publish. The npm identity is `obsidian-headless`, it exposes the `ob` binary, requires Node.js 22 or later, and authenticates with `ob login`; its documented commands sync or publish vaults rather than provide arbitrary note CRUD/search. It is therefore not the requested headless note API. [SOURCE: https://www.npmjs.com/package/obsidian-headless] [SOURCE: https://obsidian.md/help/sync/headless]

3. The official TypeScript Vault and MetadataCache APIs are plugin-process APIs. They expose the primitives needed for file mutation and metadata/link resolution, but the docs do not present them as a supported standalone CLI or remote MCP transport. A custom Obsidian plugin could build richer in-app behavior, but that is a different adoption surface from a process-level adapter. [SOURCE: https://docs.obsidian.md/Plugins/Vault] [SOURCE: https://docs.obsidian.md/Reference/TypeScript%20API/MetadataCache/unresolvedLinks]

4. The coddingtonbear Local REST API is a real community plugin with an explicit local-server contract. It runs inside desktop Obsidian, serves HTTP on `127.0.0.1:27123` or HTTPS on `127.0.0.1:27124`, and requires `Authorization: Bearer <api-key>` for protected routes. A process using it is not headless with respect to Obsidian: the desktop app, vault, plugin, and token must all be available. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

5. The Local REST API covers the strongest shared baseline for the requested mode: vault file list/read/write/append/patch/delete/move/copy, simple and JsonLogic search, tags, commands, and opening files. Its patch API supports headings, block references, and frontmatter fields, and the plugin documents a built-in Streamable HTTP MCP endpoint at `/mcp/`. This makes it the most direct transport to adopt for both a CLI wrapper and an MCP wrapper. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

6. The `obsidian://` URI scheme is an app-launch/action surface, not a data plane. Official actions include opening files, creating notes, opening the daily note, creating unique notes, searching, and choosing a vault. It relies on the desktop application registering the scheme and carries no REST-style bearer-token model; it cannot replace authenticated CRUD/search for a server integration. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI]

7. The initial feature split is clear. Adopt the official CLI for app-backed file/search/daily/tag/template commands when interactive Obsidian semantics are required; adopt Local REST API for process-level CRUD/search/tag/frontmatter operations; build only the missing normalization and mode contract. Backlinks and richer daily/template behavior require either Obsidian commands/plugin APIs or explicit derived logic, because they are not established as complete core Local REST API endpoints in the documented baseline. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://docs.obsidian.md/Reference/TypeScript%20API/MetadataCache/unresolvedLinks]

## Ruled Out

- `obsidian://` as the primary CRUD or MCP transport: it launches desktop actions and has no authenticated data API. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI]
- `obsidian-headless` as a note-operation backend: its verified package identity and documented command surface are Sync/Publish, not arbitrary vault operations. [SOURCE: https://www.npmjs.com/package/obsidian-headless]
- Treating the official TypeScript API as a headless binary: it is documented as an Obsidian plugin API. [SOURCE: https://docs.obsidian.md/Plugins/Vault]

## Dead Ends

- The nested `cli-codex` executor could not initialize its app-server client in this runtime. Direct-mode continuation is recorded in the lineage state; research evidence remains packet-local and citation-backed.

## Edge Cases

- The Local REST API HTTPS endpoint uses a self-signed certificate, so a client must make TLS verification an explicit configuration choice rather than silently disabling it.
- The official CLI may launch Obsidian on first use, but that still means the operation is app-backed and can inherit UI/profile/vault-selection state.
- A custom plugin can expose more metadata and backlinks than the REST baseline, but that increases install and lifecycle coupling.

## Sources Consulted

- https://obsidian.md/help/cli
- https://www.npmjs.com/package/obsidian-headless
- https://obsidian.md/help/sync/headless
- https://docs.obsidian.md/Plugins/Vault
- https://docs.obsidian.md/Reference/TypeScript%20API/MetadataCache/unresolvedLinks
- https://github.com/coddingtonbear/obsidian-local-rest-api
- https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI

## Assessment

The adoption boundary is now the Local REST API plugin plus a thin dual CLI/MCP adapter. The official desktop CLI is useful as a second, explicitly app-backed execution path; the official headless package is a Sync/Publish tool and should not be mislabeled as a note API.

## Reflection

The official sources answer the highest-risk architectural question: there is no verified official headless note CRUD CLI. The next iteration must verify community package identities and compare their feature/auth contracts rather than assuming similarly named npm packages are interchangeable.

## Recommended Next Focus

Verify package and binary identities for community MCP/CLI candidates, including `mcp-obsidian`, `obsidian-mcp-server`, scoped forks, and the negative `@clickup/mcp-server` example; then rank them by maintenance, feature coverage, and configuration fit.
