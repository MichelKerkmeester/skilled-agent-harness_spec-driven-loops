# Iteration 1: Official automation baseline

## Focus

Establish the first-party capability boundary: the official Obsidian CLI, the in-app plugin API, the built-in `obsidian://` URI scheme, and the community Local REST API plugin that now also exposes MCP.

## Findings

1. **The official Obsidian CLI is now the default CLI adoption candidate.** It is an Obsidian-owned binary named `obsidian`, bundled with installer 1.12.7+, and registered into `PATH` by the app. It is not an npm package and must not be confused with older third-party projects named `obsidian-cli`. It covers file create/read/append/prepend/move/rename/delete, full-text search with JSON output, backlinks and outgoing links, daily-note operations, tag enumeration, typed property/frontmatter read-set-remove, template list/read/insert, and arbitrary in-app JavaScript through `eval`. [SOURCE: https://obsidian.md/help/cli]
2. **The official CLI is app-coupled, not headless.** Obsidian explicitly says the desktop app must be running; a first command launches it when absent. This makes it excellent for local interactive automation and unsuitable as the sole server/CI backend. It needs no API token or environment-secret scheme. [SOURCE: https://obsidian.md/help/cli]
3. **The official plugin API is also app-coupled.** `Vault` provides cached and uncached reads, atomic `process()`-style modification, file listing, deletion/trash, and file-system event integration inside the Obsidian plugin runtime. Rich metadata, link, command, workspace, and plugin surfaces are reachable through the in-app `App`; they are not a supported standalone Node SDK for opening a vault headlessly. [SOURCE: https://docs.obsidian.md/Plugins/Vault]
4. **`obsidian://` is a narrow app-launch protocol, not a query API.** Core actions cover open, new/append/overwrite, daily, unique-note creation, search-view opening, and vault selection. It can navigate to headings/blocks and can use x-callback URLs, but it provides no general read response, backlinks, tag/frontmatter enumeration, or robust machine-readable search results. It necessarily invokes/focuses the registered Obsidian application. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI]
5. **Local REST API is a community Obsidian plugin, so the server also requires a running app.** Its identity is the Obsidian community plugin/repository `coddingtonbear/obsidian-local-rest-api`; the npm name `obsidian-local-rest-api` documented in its README is a development/type entry point, not a separately runnable headless server. Default endpoints are HTTPS `127.0.0.1:27124` with a self-signed certificate and optional HTTP `127.0.0.1:27123`. Authentication is `Authorization: Bearer <API key>` from the plugin settings. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
6. **Local REST API now includes a first-party-to-the-plugin Streamable HTTP MCP endpoint.** `/mcp/` exposes vault list/read/write/append/patch/delete/move/copy, document maps, active-file path, simple and structured search, tags, command list/execute, and UI open. This materially changes the MCP decision: a custom stdio wrapper is no longer required for clients that can use authenticated Streamable HTTP. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
7. **Feature gaps differ by surface.** The official CLI directly covers all requested categories, including backlinks, daily notes, frontmatter/properties, and templates. Local REST API directly covers CRUD, search, tags, frontmatter patching, and (through its extension/plugin command surface) periodic notes/templates; its documented MCP tool table does not expose backlinks or templates as dedicated tools. `obsidian://` covers only create/open/daily/search UI flows. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

## Sources Consulted

- Official Obsidian CLI help: https://obsidian.md/help/cli
- Official Obsidian URI help: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI
- Official Obsidian developer Vault guide: https://docs.obsidian.md/Plugins/Vault
- Local REST API repository and current README: https://github.com/coddingtonbear/obsidian-local-rest-api

## Assessment

- `newInfoRatio`: **1.00**
- Novelty justification: first evidence pass established a new 2026 fact that dominates the architecture—the official CLI exists and has near-complete feature coverage—while also proving both first-party automation and Local REST API remain app-coupled.
- Confidence: high for documented capability and app-dependency claims; medium for template/periodic coverage through Local REST API extensions until extension installation details are verified.

## Reflection

What worked: current official help and the active upstream Local REST API README provided primary-source capability and auth evidence.

What failed or was ruled out: the initial assumption that Obsidian lacks an official CLI is obsolete; treating `obsidian-local-rest-api` as a headless npm executable is ruled out; `obsidian://` is too narrow to serve as the primary CLI or MCP transport.

## Recommended Next Focus

Verify community CLI candidate identities and determine which, if any, still add value over the official `obsidian` binary—especially for genuinely headless vault access.
