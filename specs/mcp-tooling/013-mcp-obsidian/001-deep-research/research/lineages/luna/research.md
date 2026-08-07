# Obsidian Automation Surfaces: BUILD-vs-ADOPT Research

## 1. Executive Summary

Adopt existing transports and build a thin `mcp-obsidian` facade. The strongest overall composition is:

1. Use the Local REST API plugin's built-in Streamable HTTP MCP endpoint when the MCP host supports remote HTTP.
2. Pin and adopt the canonical `obsidian-mcp-server` npm package for stdio MCP, with the Local REST API plugin as its backend.
3. Adopt `notesmd-cli` for a genuinely headless filesystem CLI.
4. Adopt the official `obsidian` CLI for an explicitly app-backed CLI when live Obsidian commands, tags, templates, or plugin behavior matter.
5. Build only the common facade: capability detection, normalized operations/errors, environment mapping, path and destructive-operation policy, backlinks derivation, and a limited headless template fallback.

There is no single verified “headless Obsidian” backend covering all requested semantics. The official `obsidian-headless` package is a Sync/Publish client, the official `obsidian` CLI is desktop-app backed, and Local REST API/MCP candidates require a running Obsidian app with the community plugin and bearer token. [SOURCE: https://www.npmjs.com/package/obsidian-headless] [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

## 2. Research Question and Scope

This research maps official help/developer surfaces, the plugin API, community CLIs, community MCP servers, the Local REST API plugin, and the `obsidian://` URI scheme. It answers two decisions for a new mode that mirrors the existing dual CLI+MCP pattern:

- What should the Obsidian CLI tool adopt versus build?
- What should the Obsidian MCP tool adopt versus build?

The required feature surface is note CRUD, search, backlinks, daily notes, tags, frontmatter, templates, package/binary identity, headless/app requirements, and the auth/config/env-prefix contract for `.utcp_config.json` and `.env.example`.

Non-goals are implementing the mode, changing `.utcp_config.json`, changing `.env.example`, or treating an unverified package name as a dependency.

## 3. Method and Evidence Quality

The loop used primary or first-party evidence where available: official Obsidian help and developer docs, npm registry/package pages, PyPI, and candidate GitHub repositories. Package identity was checked separately from repository identity so a repository name could not silently become an install command. The exact `@clickup/mcp-server` example was withheld after its package page did not resolve and npm search returned other ClickUp packages instead. [SOURCE: https://www.npmjs.com/package/%40clickup/mcp-server] [SOURCE: https://www.npmjs.com/search?q=keywords%3Aclickup]

Claims about app/headless behavior are based on documented prerequisites, not on whether a wrapper itself can run as a detached process. The Local REST API adapter process can be headless, while its Obsidian backend still requires the desktop app, plugin, vault, endpoint, and token. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

The requested `cli-codex` executor failed before leaf research because its nested app-server client could not initialize in this runtime. The three research passes therefore ran in the workflow's direct-mode recovery path, with the same artifact root, route proof, state records, and live citations. This affects executor provenance, not the source evidence.

## 4. Official Obsidian Surfaces

The official desktop CLI is enabled from Obsidian settings and requires the desktop app. Its documented surface includes vault/file targeting, reading, creating, searching, daily notes, tags, templates, commands, and other app operations; if Obsidian is not running, the first command launches it. It is an app-backed automation API, not a standalone vault binary. [SOURCE: https://obsidian.md/help/cli]

The official `obsidian-headless` npm package is a real package with the `ob` binary, Node.js 22+ requirement, and `ob login` authentication. Its documented scope is Obsidian Sync and Publish: login, remote vault listing, sync setup, sync, publish setup, and publish. It should not be selected as a general note CRUD/search backend. [SOURCE: https://www.npmjs.com/package/obsidian-headless] [SOURCE: https://obsidian.md/help/sync/headless]

The official TypeScript API exposes `Vault` and `MetadataCache` inside an Obsidian plugin. It supplies the primitives for custom in-app CRUD and link metadata, but it is not documented as a standalone CLI or remote MCP transport. [SOURCE: https://docs.obsidian.md/Plugins/Vault] [SOURCE: https://docs.obsidian.md/Reference/TypeScript%20API/MetadataCache/unresolvedLinks]

The official `obsidian` npm package is API type definitions for plugin development, not a CLI server. Its package description explicitly places `Vault` and `MetadataCache` in the plugin architecture. [SOURCE: https://www.npmjs.com/package/obsidian]

## 5. Local REST API and `obsidian://` URI

The coddingtonbear Local REST API is the key shared backend. It is installed and enabled as an Obsidian community plugin, serves authenticated local HTTP/HTTPS, and exposes:

| Surface | Documented capability | Boundary |
|---|---|---|
| Vault files | GET/PUT/PATCH/POST/DELETE, move, copy, list, active-file operations | Desktop Obsidian + plugin + token |
| Search | Built-in fuzzy search and JsonLogic over content, path, frontmatter, and tags | Desktop Obsidian + plugin + token |
| Targeted editing | Headings, block references, and frontmatter fields; optimistic `ifMatch` support | Desktop Obsidian + plugin + token |
| Tags | Vault-wide tag listing with usage counts | Desktop Obsidian + plugin + token |
| Commands/UI | List/execute command palette commands and open files | Desktop Obsidian + plugin + token |
| MCP | Streamable HTTP at `/mcp/` with bearer authentication | MCP host must support HTTP or a bridge |

The default endpoints are `http://127.0.0.1:27123` when HTTP is enabled and `https://127.0.0.1:27124` for the HTTPS server. Protected routes require `Authorization: Bearer <api-key>`; the HTTPS certificate is self-signed. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

The plugin's own MCP server has direct access to live metadata, the active file, and command palette. Its documented tools include vault list/read/write/append/patch/delete/move/copy, document maps, simple and structured search, tags, commands, and UI open. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

The `obsidian://` scheme is a desktop deep-link/action surface. Official actions include open, new, daily, unique, search, and choose-vault. It depends on the desktop application registering the scheme and has no bearer-token data API, so it is suitable for UI activation but not as the primary CRUD or MCP transport. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI]

## 6. Community CLI Candidates

### `notesmd-cli` — recommended headless CLI adoption

`notesmd-cli` is the maintained Go project formerly named “Obsidian CLI.” It explicitly renamed itself after the official CLI appeared, has a current v0.3.6 release, and publishes identities through Homebrew, Scoop, AUR, and source builds. It can register a vault directory without Obsidian installed or running. [SOURCE: https://github.com/Yakitrak/notesmd-cli]

Its documented headless feature set includes listing, reading, content search, creating/updating/deleting, moving/renaming, daily notes, and frontmatter. It reads `.obsidian/daily-notes.json` for daily-note folder, format, and template behavior; moving a note updates internal links. It does not document a first-class backlink report, tag-management API, or general template catalog. [SOURCE: https://github.com/Yakitrak/notesmd-cli]

Recommendation: adopt the current `notesmd-cli` binary for filesystem headless operations, but do not use the legacy `obsidian-cli` name in configuration. Add a thin facade for JSON output, errors, path policy, and capability reporting.

### Official `obsidian` CLI — recommended app-backed CLI adoption

Use the official CLI when native Obsidian semantics matter: command palette execution, live tags, templates, daily-note commands, plugin behavior, and UI actions. Its required running-app boundary must be explicit in the mode contract. [SOURCE: https://obsidian.md/help/cli]

Recommendation: expose it as an `app` backend, not as a fallback that silently changes a headless deployment into a GUI-dependent one.

### `vori` — useful read-only adjunct, not the dual CLI

`@questi0nm4rk/vori` is a real npm package for read-only querying of Markdown vaults, frontmatter, hashtags, and wikilinks. It lacks the requested CRUD surface, so it is not the mode's primary CLI. [SOURCE: https://www.npmjs.com/package/%40questi0nm4rk/vori]

## 7. Community MCP Candidates

| Candidate | Verified identity | Backend/runtime | Feature surface | Recommendation |
|---|---|---|---|---|
| Built-in Local REST MCP | Plugin endpoint `/mcp/` | Obsidian desktop + Local REST + bearer key | CRUD, patch, search, tags, commands, open | Rank 1 where HTTP MCP is supported |
| `obsidian-mcp-server` | npm `obsidian-mcp-server`, registry latest `3.2.9`, cyanheads repo | Local REST API; Bun 1.3.11+ or Node 24+ | 14 tools/3 resources; CRUD, search, tags, frontmatter, patch, optional commands | Rank 1 stdio adapter; pin exact version |
| `mcp-obsidian` | PyPI `mcp-obsidian` v0.2.2; `uvx` binary | Local REST API; Python >=3.11 | list/read/search/patch/append/delete | Rank 2 lean fallback |
| `@connorbritain/obsidian-mcp-server` | npm scoped package v0.2.3 and matching repo | Local REST API; Node 18+; optional plugins | CRUD, periodic notes, JsonLogic, graph, semantic search | Secondary; optional-plugin coupling |
| `@huangyihe/obsidian-mcp` | npm scoped package v1.6.0 and matching repo | Desktop + Local REST; Node 16+; filesystem fallback | CRUD, folders, search, frontmatter, periodic notes | Secondary; differing token/env contract |
| `@mseep/obsidian-mcp-server` | Resolvable npm package page | Local REST; README points toward cyanheads source | File/search/frontmatter/security features | Audit provenance before adoption |
| `otaviocc/ObsidianMCPServer` | Swift repo, Brew/Mint/source identities | macOS + Local REST | Note/frontmatter/search/bulk/periodic operations | macOS-specific alternative |

The canonical unscoped npm package is preferable to similarly named scoped packages because its registry metadata, author, repository, install command, transport choices, and environment contract agree. [SOURCE: https://registry.npmjs.org/obsidian-mcp-server] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

`mcp-obsidian` is real and easy to launch with `uvx`, but its seven-tool surface is narrower. It requires `OBSIDIAN_API_KEY` and the Local REST API plugin; its process can run detached, but it is not backend-headless. [SOURCE: https://pypi.org/project/mcp-obsidian/] [SOURCE: https://github.com/MarkusPfundstein/mcp-obsidian]

The scoped forks are real package identities, not aliases. `@connorbritain` adds graph and optional semantic/periodic integrations; `@huangyihe` uses `OBSIDIAN_API_TOKEN`, `OBSIDIAN_API_PORT`, and `OBSIDIAN_VAULT_PATH`; `@mseep` has a less clear source/package relationship because its README directs users to the cyanheads repository. [SOURCE: https://www.npmjs.com/package/%40connorbritain/obsidian-mcp-server] [SOURCE: https://www.npmjs.com/package/%40huangyihe/obsidian-mcp] [SOURCE: https://www.npmjs.com/package/%40mseep%2Fobsidian-mcp-server]

## 8. Headless vs App-Backed Matrix

| Surface | Wrapper can run without GUI | Obsidian app/plugin/token required | Notes |
|---|---:|---:|---|
| `notesmd-cli` filesystem mode | Yes | No | Direct vault reads/writes; metadata/cache race is the trade-off. [SOURCE: https://github.com/Yakitrak/notesmd-cli] |
| Official `obsidian` CLI | No | Yes | First command may launch the app. [SOURCE: https://obsidian.md/help/cli] |
| `obsidian-headless` | Yes | No | Sync/Publish only, not note CRUD. [SOURCE: https://www.npmjs.com/package/obsidian-headless] |
| Local REST API client | Process yes | Yes | Local plugin server and bearer token required. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] |
| `obsidian-mcp-server` | Process yes | Yes | Local REST API plugin v4+ and `OBSIDIAN_API_KEY`. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] |
| `mcp-obsidian` | Process yes | Yes | Local REST API plugin and API key. [SOURCE: https://pypi.org/project/mcp-obsidian/] |
| `obsidian://` | No | Yes | Deep-links desktop actions; no data API. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI] |

The mode should surface this distinction as capability metadata. “Headless MCP process” means only that the MCP server process is detached; it does not mean the vault backend is available without Obsidian.

## 9. Requested Feature Surface Matrix

| Feature | Best adopted surface | BUILD work | Decision |
|---|---|---|---|
| Note CRUD | Local REST/cyanheads for app-backed MCP; `notesmd-cli` for headless CLI | Common schema, path policy, errors, confirmation, concurrency | ADOPT + thin BUILD |
| Search | Local REST fuzzy/JsonLogic; cyanheads text/JsonLogic/Omnisearch when available; filesystem fallback | Normalize query/result shape and capability flags | ADOPT + normalize |
| Backlinks | MetadataCache in a custom plugin or direct Markdown link scan | Incoming-link index, aliases, embeds, invalidation, scope policy | BUILD/DERIVE |
| Daily notes | Official CLI; `notesmd-cli` vault config; periodic-note commands/plugins | One facade with backend-specific capability reporting | ADAPT adopted surfaces |
| Tags | Local REST tag list; official CLI; cyanheads tag manager | Reconcile inline tags and frontmatter tags | ADOPT + normalize |
| Frontmatter | Local REST targeted PATCH; `notesmd-cli`; cyanheads manager | Typed merge, `ifMatch`, no-clobber guard | ADOPT + safety wrapper |
| Templates | Official CLI for native semantics; `notesmd-cli` only for daily config/template | Limited filesystem renderer and explicit incompatibility reporting | ADOPT app path + BUILD fallback |

The Local REST API documents no complete portable backlinks or general template-management endpoint. The official MetadataCache API can support backlinks inside a plugin, but a headless path needs explicit derived indexing. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://docs.obsidian.md/Reference/TypeScript%20API/MetadataCache/unresolvedLinks]

## 10. Candidate Ranking and Package Identity

### CLI ranking

1. `notesmd-cli` v0.3.6 for true headless filesystem operations.
2. Official `obsidian` CLI for app-backed native semantics.
3. `vori` as an optional read-only search adjunct.
4. Do not use the superseded `obsidian-cli` label as the install identity.

### MCP ranking

1. Local REST API built-in `/mcp/` for HTTP-capable hosts.
2. `obsidian-mcp-server@3.2.9` for stdio, pinned by exact version and lockfile.
3. `mcp-obsidian==0.2.2` as a lean Python fallback.
4. `@connorbritain/obsidian-mcp-server` when graph/periodic/semantic optional plugins are deliberate requirements.
5. `@huangyihe/obsidian-mcp` or Swift `otaviocc/ObsidianMCPServer` only for their specific runtime/platform trade-offs.
6. `@mseep/obsidian-mcp-server` only after source/package provenance is audited.

The exact `@clickup/mcp-server` name is not an adoption candidate from this run. A package identity check must return a real registry/package record before any command or config entry is generated. [SOURCE: https://www.npmjs.com/package/%40clickup/mcp-server]

## 11. Recommendations

Build a thin `mcp-obsidian` dual facade with two explicit backend families:

- `cli.filesystem`: invoke or embed `notesmd-cli` for no-app/no-token operation.
- `cli.obsidian`: invoke the official `obsidian` CLI only when the desktop app is intentionally required.
- `mcp.http`: connect to Local REST API `/mcp/` with bearer authentication.
- `mcp.stdio`: invoke pinned `obsidian-mcp-server` over stdio and let it call Local REST API.

The facade should report selected backend, app/plugin reachability, supported feature flags, TLS mode, and whether a write is direct-to-disk or app-mediated. It should not implement another vault engine before fixture-vault tests show a missing invariant.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| `obsidian-headless` as note backend | Verified package is Sync/Publish, not note CRUD/search | [SOURCE: https://www.npmjs.com/package/obsidian-headless] | 1, 3 |
| `obsidian://` as CRUD/MCP transport | Desktop action scheme with no authenticated data plane | [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI] | 1 |
| Official TypeScript API as a standalone binary | Plugin-process API, not documented CLI/MCP transport | [SOURCE: https://docs.obsidian.md/Plugins/Vault] | 1 |
| Legacy `obsidian-cli` install name | Maintained project renamed to `notesmd-cli` | [SOURCE: https://github.com/Yakitrak/notesmd-cli] | 2 |
| `vori` as dual CRUD CLI | Read-only query/search surface | [SOURCE: https://www.npmjs.com/package/%40questi0nm4rk/vori] | 2 |
| `@clickup/mcp-server` | Exact scoped package did not resolve in identity check | [SOURCE: https://www.npmjs.com/package/%40clickup/mcp-server] | 2, 3 |
| One universal headless backend | Official CLI, Local REST, and Sync have different runtime contracts | [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] | 3 |
| Full replacement vault engine first | Adopted transports cover most CRUD/search/tags/frontmatter | [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] | 3 |

## Divergence Map

No formal divergent pivots, audited overrides, or Council artifact references were recorded. The deliberate breadth expansion was across runtime contracts and feature gaps, not competing research branches:

- Official app-backed surfaces → community filesystem CLI and Local REST adapters.
- Local REST core → package identity and stdio/HTTP transport comparison.
- Adopted CRUD/search/tag/frontmatter → explicit BUILD gaps for backlinks, template fallback, and normalization.

The remaining frontier is implementation validation in a fixture vault: package pin/install checks, Local REST API version compatibility, direct filesystem/app concurrency, backlinks semantics, and template behavior.

## 12. Open Questions

The five research questions are answered, but these implementation-validation questions remain:

- Does the target runtime support Streamable HTTP directly, or must `.utcp_config.json` use stdio `npx`/Bun?
- Does the target Obsidian installation run Local REST API v4+ with the documented endpoint and certificate behavior?
- Which exact `obsidian-mcp-server` version and lockfile/checksum policy will the repository accept at implementation time?
- Should backlinks be computed by a filesystem index, an Obsidian plugin/MetadataCache endpoint, or both?
- Which template variable semantics are required beyond the official CLI's `{{date}}`, `{{time}}`, and `{{title}}` behavior?
- What concurrency policy is required when `notesmd-cli` direct writes and a live Obsidian app touch the same vault?

## 13. Configuration Contract for `.utcp_config.json` and `.env.example`

Use one canonical secret and normalize candidate-specific aliases at the adapter boundary:

```dotenv
# Canonical Local REST API connection
OBSIDIAN_API_KEY=
OBSIDIAN_BASE_URL=http://127.0.0.1:27123
OBSIDIAN_VERIFY_SSL=false
OBSIDIAN_REQUEST_TIMEOUT_MS=30000

# Least-privilege controls
OBSIDIAN_READ_PATHS=
OBSIDIAN_WRITE_PATHS=
OBSIDIAN_READ_ONLY=false
OBSIDIAN_ENABLE_COMMANDS=false

# MCP adapter process
MCP_TRANSPORT_TYPE=stdio
MCP_LOG_LEVEL=info
MCP_HTTP_HOST=127.0.0.1
MCP_HTTP_PORT=3010

# Optional filesystem CLI backend
OBSIDIAN_VAULT_PATH=
```

The canonical stdio package entry should be conceptually equivalent to:

```json
{
  "command": "npx",
  "args": ["-y", "obsidian-mcp-server@3.2.9"],
  "env": {
    "OBSIDIAN_API_KEY": "${OBSIDIAN_API_KEY}",
    "OBSIDIAN_BASE_URL": "${OBSIDIAN_BASE_URL}",
    "OBSIDIAN_VERIFY_SSL": "${OBSIDIAN_VERIFY_SSL}",
    "OBSIDIAN_READ_ONLY": "${OBSIDIAN_READ_ONLY}",
    "OBSIDIAN_ENABLE_COMMANDS": "${OBSIDIAN_ENABLE_COMMANDS}",
    "MCP_TRANSPORT_TYPE": "stdio",
    "MCP_LOG_LEVEL": "info"
  }
}
```

The exact interpolation syntax must follow the repository's `.utcp_config.json` loader; this is a contract sketch, not an implementation edit. The package documents `OBSIDIAN_API_KEY`, `OBSIDIAN_BASE_URL`, `OBSIDIAN_VERIFY_SSL`, request timeout, path allowlists, read-only, command opt-in, and MCP transport settings. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

For the direct HTTP MCP path, use the same base URL and bearer key against `/mcp/`. Prefer trusted certificate handling; if loopback development uses `OBSIDIAN_VERIFY_SSL=false`, document the local-only scope and do not generalize it to remote endpoints. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

Candidate-specific aliases should be compatibility inputs only:

- `OBSIDIAN_API_TOKEN` → map to `OBSIDIAN_API_KEY` for the huangyihe server.
- `OBSIDIAN_HOST`/`OBSIDIAN_PORT` → derive `OBSIDIAN_BASE_URL` for older servers.
- `OBSIDIAN_VAULT_PATH` → use only for direct filesystem/graph features, never as proof that the REST backend is headless.

## 14. Implementation Boundary and Safety

Adopted code owns transport behavior; the repository-owned facade owns product semantics:

- validate package identity and exact version before generating or launching a server;
- detect backend reachability before mutating;
- default to read-only or path allowlists until fixture-vault tests pass;
- require explicit confirmation for delete/overwrite/move operations;
- use Local REST document-map versions and `ifMatch` where available;
- serialize or refresh around direct filesystem writes to avoid stale Obsidian metadata;
- expose unsupported backlinks/templates as capability errors, not silent fallbacks;
- keep bearer secrets in environment/config injection, never in checked-in JSON or logs.

The Local REST API documents self-signed HTTPS and bearer authentication, while the cyanheads adapter documents path allowlists, a read-only kill switch, and opt-in command execution. Those are the right safety primitives to preserve in the facade. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

## 15. Risks and Verification Plan

Before implementation is called complete, run a disposable fixture-vault matrix:

1. Verify the exact npm/PyPI/binary identity and pinned version in a clean environment.
2. Test Local REST API HTTP and HTTPS, bearer auth, self-signed certificate handling, timeout, read-only, and path policies.
3. Exercise CRUD, search, tags, and frontmatter through both stdio MCP and direct CLI paths.
4. Compare daily note and template behavior against a vault with configured daily-notes and template settings.
5. Build and test backlink derivation against aliases, headings, block IDs, embeds, and case variants.
6. Test concurrent direct filesystem/app writes and verify refresh or conflict behavior.
7. Test missing app, missing plugin, invalid token, unsupported feature, package-not-found, and certificate failures as typed errors.
8. Only then add the selected package/binary entries to `.utcp_config.json` and `.env.example`.

## 16. References

- https://obsidian.md/help/cli
- https://obsidian.md/help/sync/headless
- https://www.npmjs.com/package/obsidian-headless
- https://docs.obsidian.md/Plugins/Vault
- https://docs.obsidian.md/Reference/TypeScript%20API/MetadataCache/unresolvedLinks
- https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI
- https://github.com/coddingtonbear/obsidian-local-rest-api
- https://github.com/Yakitrak/notesmd-cli
- https://pypi.org/project/mcp-obsidian/
- https://github.com/MarkusPfundstein/mcp-obsidian
- https://registry.npmjs.org/obsidian-mcp-server
- https://github.com/cyanheads/obsidian-mcp-server
- https://www.npmjs.com/package/%40connorbritain/obsidian-mcp-server
- https://www.npmjs.com/package/%40huangyihe/obsidian-mcp
- https://www.npmjs.com/package/%40mseep/obsidian-mcp-server
- https://github.com/otaviocc/ObsidianMCPServer
- https://www.npmjs.com/package/%40questi0nm4rk/vori
- https://www.npmjs.com/package/%40clickup/mcp-server

## 17. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining research questions: none; implementation validation items remain in Section 12.
- Last 3 new-info ratios: `0.94 -> 0.81 -> 0.58`
- Configured convergence threshold: `0.05`
- Convergence before the cap was telemetry only, as required by `stopPolicy: max-iterations`.
- The final recommendation is stable across the three passes: adopt the verified transports, build the normalized dual facade and explicit missing-feature behavior.
