# Iteration 3: Feature matrix and BUILD-vs-ADOPT decision

## Focus

Close the feature and configuration gaps, rank adoption candidates, and define the smallest safe dual CLI+MCP boundary for the new `mcp-obsidian` mode.

## Actions Taken

- Re-read the Local REST API endpoint, MCP tool, patch, search, TLS, and extension sections.
- Cross-checked the official CLI feature families and the verified community CLI/MCP candidates against the requested surface.
- Separated filesystem headlessness, process-level headlessness, and app-backed behavior.
- Designed a normalized `OBSIDIAN_` configuration contract for `.utcp_config.json` and `.env.example` without writing either implementation file.
- Forced the recommendation through the max-iterations policy even though the convergence telemetry was already above the configured threshold.

## Findings

1. Local REST API is the shared adoption substrate for the MCP side. Its documented endpoint matrix and built-in MCP server cover vault CRUD, targeted heading/block/frontmatter patching, simple and structured search, tags, command discovery/execution, and UI opening; the same authenticated local service can serve a CLI adapter and a third-party stdio MCP adapter. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

2. The built-in `/mcp/` endpoint should rank first when the host supports Streamable HTTP because it removes an extra server process and has direct access to live Obsidian metadata and commands. The canonical `obsidian-mcp-server` npm package ranks first among stdio adapters because it is an identifiable package/repository pair, supports stdio and HTTP, and adds typed note/tag/frontmatter/search tools over the same backend. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://registry.npmjs.org/obsidian-mcp-server] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

3. The CLI recommendation must be split by runtime contract. Adopt `notesmd-cli` for a truly headless filesystem mode: it has a real binary/install identity, direct vault registration, note CRUD/search/daily/frontmatter, and no Obsidian process or token. Adopt the official `obsidian` CLI for an app-backed mode when native tags, templates, plugin commands, and live Obsidian semantics are required. Do not present either one as covering both contracts transparently. [SOURCE: https://github.com/Yakitrak/notesmd-cli] [SOURCE: https://obsidian.md/help/cli]

4. Note CRUD is an ADOPT decision with a BUILD facade. Use Local REST API or the canonical MCP adapter for the app-backed path and `notesmd-cli` for the headless CLI path; build only a common operation schema, path validation, structured errors, optimistic-concurrency handling, and explicit destructive confirmation. Local REST API supports full file CRUD and its default delete behavior can move files to trash. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/Yakitrak/notesmd-cli]

5. Search is an ADOPT decision with normalization. Local REST API provides built-in fuzzy search and JsonLogic metadata search; cyanheads adds text, JsonLogic, and optional Omnisearch modes. The dual facade should expose a stable text/structured query shape and use filesystem search only as the headless fallback. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

6. Backlinks are a BUILD/DERIVE decision. The Local REST API endpoint and tool lists document outgoing-link/metadata access only indirectly and do not expose a core backlinks query; the official MetadataCache API can support an in-app plugin implementation, while a headless implementation can scan `[[wikilinks]]` and Markdown links. Treat backlink indexing, alias resolution, embeds, and cache invalidation as an explicit feature rather than claiming it is supplied by CRUD/search adoption. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://docs.obsidian.md/Reference/TypeScript%20API/MetadataCache/unresolvedLinks] [SOURCE: https://github.com/Yakitrak/notesmd-cli]

7. Daily notes are an ADOPT/ADAPT decision. The official CLI exposes daily and daily append/prepend commands; `notesmd-cli` reads the vault daily-notes configuration and template directly; community MCP servers can expose periodic-note tools when the relevant plugin or command is available. Build one `daily_note` facade that selects the app-backed command path, filesystem config path, or REST command path and reports which backend was used. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/Yakitrak/notesmd-cli] [SOURCE: https://github.com/newtype-01/obsidian-mcp] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

8. Tags are an ADOPT decision. Local REST API has a tag list endpoint, the official CLI has tag commands, and cyanheads provides list/manage behavior for frontmatter and inline tags. Build only canonical tag normalization, scope filtering, and conflict behavior between inline `#tags` and frontmatter `tags:`. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

9. Frontmatter is an ADOPT decision with a safety wrapper. Local REST API can target a frontmatter key through GET/PATCH, `notesmd-cli` can print/edit/delete YAML fields, and cyanheads offers atomic frontmatter management. The wrapper should preserve YAML types, support read-modify-write or `ifMatch`, and reject silent whole-file clobbering. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/Yakitrak/notesmd-cli] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

10. Templates are a split decision. The official CLI exposes template listing, reading, insertion, variable resolution, and creation; `notesmd-cli` documents template use for daily-note creation but not a general template manager; the Local REST API core endpoint matrix does not establish a portable template CRUD surface. Adopt the official CLI for app-backed template semantics and build a small filesystem renderer only as an explicitly limited headless fallback. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/Yakitrak/notesmd-cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

11. The normalized auth contract should use `OBSIDIAN_API_KEY` as the canonical secret, `OBSIDIAN_BASE_URL` for the Local REST endpoint, `OBSIDIAN_VERIFY_SSL` for the self-signed local certificate policy, `OBSIDIAN_REQUEST_TIMEOUT_MS` for bounded calls, and `OBSIDIAN_READ_PATHS`, `OBSIDIAN_WRITE_PATHS`, `OBSIDIAN_READ_ONLY`, and `OBSIDIAN_ENABLE_COMMANDS` for least-privilege controls. `MCP_TRANSPORT_TYPE`, `MCP_LOG_LEVEL`, `MCP_HTTP_HOST`, and `MCP_HTTP_PORT` belong to the adapter/server layer. Map forks that use `OBSIDIAN_API_TOKEN` to the canonical key at the boundary; do not make two secret names equally authoritative. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/newtype-01/obsidian-mcp]

12. The `.utcp_config.json` entry should pin an identity rather than use a moving `@latest` tag. The preferred stdio shape is `npx -y obsidian-mcp-server@3.2.9` (or a lockfile-controlled Bun equivalent) with the canonical `OBSIDIAN_` and `MCP_` variables; the preferred HTTP shape points to the Local REST API `/mcp/` endpoint with a bearer header if the host supports remote Streamable HTTP. The implementation must validate the exact package/version at install time because similarly named scoped packages are not interchangeable. [SOURCE: https://registry.npmjs.org/obsidian-mcp-server] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

13. The ranked overall decision is: (1) adopt Local REST API’s built-in MCP for HTTP-capable hosts; (2) adopt pinned `obsidian-mcp-server` for stdio and use it as the MCP backend behind the new mode; (3) adopt `notesmd-cli` for headless CLI operations; (4) adopt official `obsidian` CLI for app-backed CLI operations; (5) build the `mcp-obsidian` facade, normalization, feature routing, backlinks derivation, safety policy, and package identity checks. Do not build a replacement vault engine before these boundaries are tested against a fixture vault. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://registry.npmjs.org/obsidian-mcp-server] [SOURCE: https://github.com/Yakitrak/notesmd-cli] [SOURCE: https://obsidian.md/help/cli]

## Ruled Out

- A single “headless Obsidian” backend covering all semantics: official headless is Sync/Publish, the official CLI is app-backed, and Local REST/MCP requires the desktop plugin. [SOURCE: https://www.npmjs.com/package/obsidian-headless] [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
- Building a full replacement note engine as the first implementation: the adopted transports already cover the majority of CRUD/search/tag/frontmatter behavior. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]
- Treating backlinks or template management as guaranteed core Local REST API features: the documented endpoint/tool matrix does not establish those complete portable surfaces. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

## Dead Ends

- Convergence telemetry fell below the first iteration ratio but remained above the configured threshold; the max-iterations policy still required this third pass, so synthesis was intentionally deferred until after these feature and configuration checks.
- The negative package identity remains unresolved as an installable candidate; no dependency should be generated from an unresolvable scoped name.

## Edge Cases

- Local REST API HTTPS uses a self-signed certificate; `OBSIDIAN_VERIFY_SSL=false` is convenient for loopback but should be documented as a trust decision, with certificate pin/trust preferred where possible.
- `notesmd-cli` direct writes can race with Obsidian’s live metadata/cache state; the adapter should either serialize writes or refresh/retry before subsequent metadata-sensitive calls.
- Backlink derivation must handle aliases, headings, block IDs, embeds, case normalization, and notes outside the requested path allowlist.
- Periodic-note features can require the Periodic Notes plugin, command IDs, or a particular vault configuration; a missing extension must return capability metadata rather than a false success.
- Package release pages and `@latest` tags can change after this research date; lock exact versions and verify checksums or lockfile provenance during implementation.

## Sources Consulted

- https://github.com/coddingtonbear/obsidian-local-rest-api
- https://github.com/cyanheads/obsidian-mcp-server
- https://registry.npmjs.org/obsidian-mcp-server
- https://github.com/Yakitrak/notesmd-cli
- https://obsidian.md/help/cli
- https://docs.obsidian.md/Reference/TypeScript%20API/MetadataCache/unresolvedLinks
- https://www.npmjs.com/package/obsidian-headless
- https://github.com/newtype-01/obsidian-mcp

## Assessment

The research supports a thin BUILD layer over adopted transports. The dual mode should not pretend that filesystem headlessness and live Obsidian semantics are the same capability; it should expose backend/capability metadata and route each feature to the strongest available surface.

## Reflection

The first two passes established identity and dependency boundaries; this pass converted them into a feature-level decision. The only substantial BUILD work left is intentional product behavior—normalization, backlink derivation, template fallback, safety, and capability reporting—not a replacement REST/MCP implementation.

## Recommended Next Focus

Synthesis: write the ranked research report and resource map, preserve unresolved implementation-validation items, update terminal state to max-iterations reached, and do not write implementation files outside this lineage.
