# Iteration 2: Community CLI and MCP identity audit

## Focus

Verify real community CLI and MCP packages/binaries, distinguish truly headless filesystem tools from app-backed Local REST API adapters, and compare their feature and environment contracts.

## Actions Taken

- Audited the official repository/package pages for `notesmd-cli`, `mcp-obsidian`, `obsidian-mcp-server`, `@mseep/obsidian-mcp-server`, `@connorbritain/obsidian-mcp-server`, `@huangyihe/obsidian-mcp`, and the Swift/Brew server.
- Checked the exact negative package example `@clickup/mcp-server` through npm search/page resolution and recorded it as unverified rather than inventing an install command.
- Compared app/plugin/token requirements, package managers, executable names, and environment prefixes.
- Mapped each candidate against note CRUD, search, backlinks, daily notes, tags, frontmatter, and templates.

## Findings

1. `notesmd-cli` is the strongest verified community CLI candidate for a truly headless dual mode. The maintained Go repository explicitly renamed itself from `obsidian-cli` to `notesmd-cli` after the official CLI appeared, publishes v0.3.6, and provides Homebrew, Scoop, AUR, and source-install identities. It registers a vault directory directly and does not require Obsidian to run. [SOURCE: https://github.com/Yakitrak/notesmd-cli]

2. `notesmd-cli` covers headless note list/read/search/create/update/delete/move, daily notes, and frontmatter. It reads `.obsidian/daily-notes.json` for daily-note folder/format/template behavior, and its move operation updates internal links. It does not document a first-class backlinks report, tag-management API, or template catalog; those should be treated as build/derived features rather than assumed CLI capabilities. [SOURCE: https://github.com/Yakitrak/notesmd-cli]

3. `mcp-obsidian` is a real PyPI distribution, not merely a GitHub repository name. PyPI identifies the project, maintainer, Python >=3.11 requirement, v0.2.2 release, and `mcp-obsidian`/`uvx` invocation. Its documented seven tools are file listing, read, search, patch, append, and delete. It requires the Local REST API plugin and `OBSIDIAN_API_KEY`, with optional `OBSIDIAN_HOST` and `OBSIDIAN_PORT`; the server process can be headless, but its Obsidian backend cannot. [SOURCE: https://pypi.org/project/mcp-obsidian/] [SOURCE: https://github.com/MarkusPfundstein/mcp-obsidian]

4. `obsidian-mcp-server` is a verified npm package identity. The npm registry record names the package, identifies cyanheads as author, points to the matching GitHub repository, and reports latest tag `3.2.9`; the repository documents `bunx obsidian-mcp-server@latest` and an npx equivalent. Its current server exposes 14 tools and 3 resources covering note CRUD, search, tags, frontmatter, structural patching, UI open, and opt-in command execution. [SOURCE: https://registry.npmjs.org/obsidian-mcp-server] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

5. The cyanheads server is process-headless but app-backed. It requires Local REST API plugin v4+, a running local endpoint, and `OBSIDIAN_API_KEY`; it defaults to HTTP `127.0.0.1:27123`, supports HTTPS `127.0.0.1:27124` through `OBSIDIAN_BASE_URL`, and makes self-signed TLS behavior explicit with `OBSIDIAN_VERIFY_SSL=false`. The configuration prefix is consistently `OBSIDIAN_`, with additional `MCP_` transport settings and optional path/read-only controls. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

6. `@connorbritain/obsidian-mcp-server` is a real scoped npm package/repository pair at v0.2.3. It adds graph analytics, periodic notes, JsonLogic search, and optional Dataview/Periodic Notes/Smart Connections integrations, but requires Node 18+, Obsidian, and Local REST API. Its `OBSIDIAN_API_KEY`, host, port, protocol, and vault-path contract fits the target prefix, but the optional plugin graph/semantic surface creates more runtime coupling than the cyanheads baseline. [SOURCE: https://www.npmjs.com/package/%40connorbritain/obsidian-mcp-server] [SOURCE: https://github.com/ConnorBritain/obsidian-mcp-server]

7. `@huangyihe/obsidian-mcp` is also a verified npm/repository pair at v1.6.0, but its contract differs. It requires the desktop app and Local REST API, uses `OBSIDIAN_API_TOKEN`, `OBSIDIAN_API_PORT`, and `OBSIDIAN_VAULT_PATH`, and explicitly warns that the `OBSIDIAN_` prefix is required. It advertises note/folder CRUD, search, frontmatter, daily/periodic notes, and a filesystem fallback, making it feature-rich but less compatible with a single `OBSIDIAN_API_KEY` convention. [SOURCE: https://www.npmjs.com/package/%40huangyihe/obsidian-mcp] [SOURCE: https://github.com/newtype-01/obsidian-mcp]

8. `@mseep/obsidian-mcp-server` exists as an npm package, but its package README directs users to clone `cyanheads/obsidian-mcp-server` while presenting a separately scoped package. That makes the identity resolvable but the provenance and release relationship less clear than the canonical unscoped package; it should not be the default adoption target without pinning and source/package audit. [SOURCE: https://www.npmjs.com/package/%40mseep%2Fobsidian-mcp-server] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

9. The Swift `otaviocc/ObsidianMCPServer` is an identifiable source/Brew/Mint binary, not a cross-platform npm or PyPI package. It requires macOS/Swift, the Local REST API plugin, and `OBSIDIAN_BASE_URL` plus `OBSIDIAN_API_KEY`; it has broad note, frontmatter, search, bulk-tag, and periodic-note operations. It is a valid platform-specific alternative but not the portable default for a dual CLI+MCP mode. [SOURCE: https://github.com/otaviocc/ObsidianMCPServer]

10. The exact `@clickup/mcp-server` name was not a resolvable npm package in this audit: npm search returned other ClickUp packages, while the exact package page did not resolve. The safe rule for this project is to require a successful registry/package-page identity check before adding any candidate to `.utcp_config.json`; an unresolvable name is not an installable dependency. [SOURCE: https://www.npmjs.com/package/%40clickup/mcp-server] [SOURCE: https://www.npmjs.com/search?q=keywords%3Aclickup]

11. The package `@questi0nm4rk/vori` is real but intentionally read-only: it queries Markdown vaults for frontmatter, hashtags, and wikilinks. It is useful as a search/indexing adjunct, but it cannot satisfy the requested dual CRUD CLI surface. [SOURCE: https://www.npmjs.com/package/%40questi0nm4rk/vori]

## Ruled Out

- The legacy `obsidian-cli` name as the primary install target: the maintained project explicitly renamed the binary/repository to `notesmd-cli`; use the current identity. [SOURCE: https://github.com/Yakitrak/notesmd-cli]
- `@questi0nm4rk/vori` as the dual CRUD CLI: its advertised surface is read-only query/search. [SOURCE: https://www.npmjs.com/package/%40questi0nm4rk/vori]
- `@clickup/mcp-server` as an adopted package: the exact name did not resolve during identity verification. [SOURCE: https://www.npmjs.com/package/%40clickup/mcp-server]

## Dead Ends

- Unscoped package-name assumptions are unsafe. `obsidian-mcp-server`, `@mseep/obsidian-mcp-server`, and `@connorbritain/obsidian-mcp-server` are distinct npm identities even when their names and README text overlap.
- A process being runnable with `npx`, `uvx`, or a native binary does not make the Obsidian backend headless; all Local REST API candidates still need the app/plugin/token.

## Edge Cases

- `notesmd-cli` writes directly to disk, so Obsidian metadata/cache refresh and concurrent app writes are operational concerns absent from Local REST API writes.
- The cyanheads server’s Omnisearch mode is conditional on a separate plugin endpoint; its core text/JsonLogic search should be the portable contract.
- The `OBSIDIAN_API_KEY` versus `OBSIDIAN_API_TOKEN` naming difference is material for `.env.example`; normalize it at the adapter boundary rather than expose multiple undocumented names.
- Official CLI templates/tags and community CLI frontmatter/daily behavior are not interchangeable semantics.

## Sources Consulted

- https://github.com/Yakitrak/notesmd-cli
- https://pypi.org/project/mcp-obsidian/
- https://github.com/MarkusPfundstein/mcp-obsidian
- https://registry.npmjs.org/obsidian-mcp-server
- https://github.com/cyanheads/obsidian-mcp-server
- https://www.npmjs.com/package/%40connorbritain/obsidian-mcp-server
- https://github.com/ConnorBritain/obsidian-mcp-server
- https://www.npmjs.com/package/%40huangyihe/obsidian-mcp
- https://github.com/newtype-01/obsidian-mcp
- https://www.npmjs.com/package/%40mseep%2Fobsidian-mcp-server
- https://github.com/otaviocc/ObsidianMCPServer
- https://www.npmjs.com/package/%40clickup/mcp-server
- https://www.npmjs.com/package/%40questi0nm4rk/vori

## Assessment

For the CLI side, adopt `notesmd-cli` for a true no-app/no-token filesystem mode and expose the official `obsidian` CLI as an explicitly app-backed mode when tags/templates/commands matter. For the MCP side, adopt the canonical `obsidian-mcp-server` package as the leading adapter over Local REST API; keep `mcp-obsidian` as the lean Python fallback and treat graph/periodic forks as optional alternatives.

## Reflection

The package audit removed the main identity risk: the names to pin are now concrete, and the exact negative example is not silently treated as available. The remaining work is to turn these facts into a ranked feature matrix, a normalized `OBSIDIAN_` environment contract, and a recommendation that separates filesystem headlessness from app-backed process headlessness.

## Recommended Next Focus

Produce the final BUILD-vs-ADOPT matrix for each requested feature and for the dual CLI+MCP mode. Include the `.utcp_config.json`/`.env.example` variable contract, backlinks and template gaps, security/rollback boundaries, and explicit unresolved verification items.
