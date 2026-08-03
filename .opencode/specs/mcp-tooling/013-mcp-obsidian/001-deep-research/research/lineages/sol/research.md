# Obsidian Automation Surfaces: BUILD-vs-ADOPT Research

## 1. Executive Summary

Adopt existing providers for both surfaces. Use the official bundled `obsidian` binary as the primary CLI, and use the Local REST API community plugin's built-in Streamable HTTP MCP endpoint as the primary MCP backend. Build only the `mcp-obsidian` mode packet around them: operation routing, install/doctor checks, safety policy, Code Mode wiring, and explicit live-app versus headless profiles.

The decisive 2026 change is the official Obsidian CLI. It covers note CRUD, search, backlinks, daily notes, tags, frontmatter/properties, and templates, but requires the desktop app. The Local REST API plugin now ships MCP directly, also app-coupled, with bearer auth and live metadata access. Headless needs are real but narrower: `notesmd-cli` is the verified headless content CLI; npm/binary `obsidian-mcp` is the verified filesystem MCP candidate.

## 2. Research Question and Scope

This research mapped official help/developer surfaces, community CLIs, community MCP servers, Local REST API, and `obsidian://` to decide BUILD versus ADOPT for a dual CLI+MCP mode modeled structurally on `mcp-click-up`.

Required evaluation dimensions were:

- Exact package, repository, and binary identity.
- Whether vault operations work without a running Obsidian app.
- Auth, transport, configuration, and Code Mode environment-prefix behavior.
- CRUD, search, backlinks, daily notes, tags, frontmatter, and templates.
- The smallest justified implementation boundary.

## 3. Decision

### CLI

1. **ADOPT — official `obsidian`** as the default live-vault CLI.
2. **ADOPT conditionally — `notesmd-cli`** as an explicit headless-filesystem profile.
3. **BUILD narrowly — mode-level routing/output normalization only**, if callers need a common envelope.
4. **DO NOT BUILD — a new general Obsidian CLI or vault engine.**

### MCP

1. **ADOPT — Local REST API built-in `/mcp/` endpoint** for the default live-vault profile.
2. **ADOPT conditionally — npm/binary `obsidian-mcp-server`** when stdio, path policy, read-only controls, or pagination justify an extra wrapper.
3. **ADOPT conditionally — npm/binary `obsidian-mcp`** for an explicit headless-filesystem profile.
4. **BUILD narrowly — compatibility tools only if dedicated backlinks/templates must be identical across profiles.**
5. **DO NOT BUILD — a redundant default REST-to-MCP server.**

## 4. Verified Identity Ledger

| Surface | Verified identity | Invocation | Identity risk |
| --- | --- | --- | --- |
| Official CLI | Bundled binary `obsidian`; no npm package | `obsidian <command>` | Low; official installer 1.12.7+ [SOURCE: https://obsidian.md/help/cli] |
| Headless content CLI | Repository `Yakitrak/notesmd-cli`; binary `notesmd-cli` | Homebrew/Scoop/AUR/Go build | Old `obsidian-cli` name is legacy [SOURCE: https://github.com/Yakitrak/notesmd-cli] |
| Official headless Sync/Publish | npm `obsidian-headless`; binary `ob` | `npm install -g obsidian-headless` | Not a note-management surface [SOURCE: https://github.com/obsidianmd/obsidian-headless] |
| Built-in MCP | Community plugin `coddingtonbear/obsidian-local-rest-api`; no standalone server package | `https://127.0.0.1:27124/mcp/` | npm `obsidian-local-rest-api` is types/extension API, not a headless server [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] |
| Rich REST wrapper MCP | npm and binary `obsidian-mcp-server` | `npx -y obsidian-mcp-server@latest` | Exact upstream package manifest verified [SOURCE: https://raw.githubusercontent.com/cyanheads/obsidian-mcp-server/main/package.json] |
| Filesystem MCP | npm and binary `obsidian-mcp` | `npx -y obsidian-mcp /vault/path` | Exact upstream package manifest verified [SOURCE: https://github.com/StevenStavrakis/obsidian-mcp/blob/main/package.json] |
| Hybrid MCP | npm `@huangyihe/obsidian-mcp`; binary `obsidian-mcp` | `npx @huangyihe/obsidian-mcp` | Real identity, but REST/filesystem fallback semantics are mixed [SOURCE: https://github.com/newtype-01/obsidian-mcp] |

The mode's installer/doctor must verify every package with registry metadata or an actual launch probe. This is a hard requirement because the sibling ClickUp packet records that its configured `@clickup/mcp-server` returns npm 404. [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:63]

## 5. Runtime and Headless Model

“Headless” must describe vault access, not merely the wrapper process.

| Surface | Obsidian required | Token required | Vault backend |
| --- | --- | --- | --- |
| Official `obsidian` CLI | Yes; first command launches it | No | Running app/live metadata |
| `notesmd-cli` | No | No | Filesystem |
| Local REST API MCP | Yes | Local REST API bearer token | Running app/live metadata |
| `obsidian-mcp-server` | Yes | `OBSIDIAN_API_KEY` | Local REST API |
| `obsidian-mcp` | No | No | Filesystem |
| `@huangyihe/obsidian-mcp` | Listed as required for default path | `OBSIDIAN_API_TOKEN` | REST with filesystem fallback |
| `obsidian://` | Yes | No | Application URL handler |

[SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/Yakitrak/notesmd-cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

## 6. Requested Feature Matrix

| Surface | CRUD | Search | Backlinks | Daily notes | Tags | Frontmatter | Templates |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Official `obsidian` CLI | Yes | Yes, structured formats | Yes, dedicated | Yes, dedicated | Yes, vault counts | Yes, typed property tools | Yes, list/read/insert/create |
| `notesmd-cli` | Yes | Yes | No dedicated query | Yes | No vault-wide index | Yes | Daily-template support only |
| Local REST API built-in MCP | Yes | Text + JsonLogic | No dedicated tool | Indirect via commands/extensions | Yes | Yes | Indirect via commands |
| `obsidian-mcp-server` | Yes | Text/JsonLogic/optional Omnisearch | Outgoing parse only | Periodic addressing | Yes | Yes | Indirect via commands |
| `obsidian-mcp` | Yes | Yes | No | No | Yes | YAML parsing, no generic dedicated tool | No |
| `obsidian://` | Create/open only | Opens search UI | No | Opens daily | No | No | No |

[SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://github.com/StevenStavrakis/obsidian-mcp]

## 7. CLI Architecture

The primary CLI route should call `obsidian` directly for live-vault operations. High-value routing examples:

- Backlinks, outgoing links, unresolved links, tags, property operations, templates, plugin commands, and developer automation always prefer official `obsidian`.
- CRUD, content search, daily-note creation, and frontmatter may use `notesmd-cli` only when the caller explicitly selects the `headless` profile.
- Never silently fall back between the two. Running-app semantics, metadata freshness, link resolution, template behavior, and concurrency differ.
- CLI doctor checks: `command -v obsidian`, `obsidian version`, and app-connectivity; for headless, `command -v notesmd-cli`, version, and registered vault path.

The official CLI needs no API-key entry in `.env.example`. [SOURCE: https://obsidian.md/help/cli]

## 8. MCP Architecture

The default backend should be the Local REST API plugin's own MCP endpoint, not a custom adapter. It exposes live vault CRUD/search/tag/frontmatter/command tools and keeps the provider closest to Obsidian's metadata cache.

Code Mode consumes stdio, so bridge the remote endpoint with the real npm package `mcp-remote@latest`. Prefer HTTPS after trusting the plugin certificate. The documented loopback-only fallback is HTTP port 27123 with `--allow-http`; it must never bind beyond `127.0.0.1`. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://www.npmjs.com/package/mcp-remote]

Use `obsidian-mcp-server` only when its additional policy layer earns the dependency. Use filesystem `obsidian-mcp` only under a separately named headless profile. Registering overlapping write-capable servers by default creates ambiguous tool choice and a larger mutation surface.

## 9. Authentication and Configuration Contract

Recommended `.utcp_config.json` manual:

```json
{
  "name": "obsidian",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "obsidian": {
        "transport": "stdio",
        "command": "npx",
        "args": [
          "-y",
          "mcp-remote@latest",
          "https://127.0.0.1:27124/mcp/",
          "--header",
          "Authorization:${OBSIDIAN_AUTH_HEADER}"
        ],
        "env": {
          "OBSIDIAN_AUTH_HEADER": "${OBSIDIAN_AUTH_HEADER}"
        }
      }
    }
  }
}
```

Recommended `.env.example` entry:

```dotenv
# Obsidian Local REST API MCP
# Code Mode prefixes variables with the manual name `obsidian`.
obsidian_OBSIDIAN_AUTH_HEADER=Bearer your_local_rest_api_key
```

The full bearer value is deliberate: `mcp-remote` supports environment substitution in headers, including spaces inside the environment value, and the token stays out of committed JSON and literal argv. Code Mode resolves `.env` as `{manual_name}_{VAR}`; therefore the configured `${OBSIDIAN_AUTH_HEADER}` maps to `obsidian_OBSIDIAN_AUTH_HEADER`. [SOURCE: .opencode/skills/mcp-code-mode/README.md:122] [SOURCE: https://www.npmjs.com/package/mcp-remote]

## 10. Safety and Operational Controls

- Default to read-only operations until the user authorizes a mutation.
- Require exact vault-relative paths for destructive operations.
- Move to trash by default; require a separate explicit flag for permanent deletion.
- Treat `obsidian eval` and MCP command execution as high-blast escape hatches, disabled unless explicitly requested.
- Require a disposable fixture vault for initial doctor/smoke tests.
- For `obsidian-mcp-server`, expose `OBSIDIAN_READ_ONLY`, `OBSIDIAN_READ_PATHS`, and `OBSIDIAN_WRITE_PATHS` when that wrapper is selected. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]
- Keep HTTPS certificate trust explicit; never use a process-wide TLS-disable setting as the default.

## 11. Recommendations

1. Build the `mcp-obsidian` mode as a router and safety/documentation layer.
2. Make official `obsidian` the primary CLI and capture its version/help in doctor output.
3. Make Local REST API `/mcp/` the primary MCP backend through `mcp-remote`.
4. Add a deliberate `headless` profile pairing `notesmd-cli` with filesystem `obsidian-mcp`; label capability loss in routing output.
5. Verify `mcp-remote@latest`, `obsidian-mcp-server`, and `obsidian-mcp` identities before committing configuration.
6. Add discovery fixtures from `list_tools` and a read-only fixture-vault smoke test before declaring the mode production-ready.
7. Build compatibility shims only for product-required gaps such as backlinks/templates; otherwise route those operations to the official CLI.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
| --- | --- | --- | --- |
| Assume no official Obsidian CLI exists | Obsolete after installer 1.12.7+ | [SOURCE: https://obsidian.md/help/cli] | 1 |
| Treat `obsidian-local-rest-api` npm as a headless server | It is a plugin/type extension surface resolving the running host plugin | [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] | 1, 3 |
| Use `obsidian://` as the primary automation transport | UI-oriented and lacks machine-readable reads/backlinks/tags/frontmatter/templates | [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI] | 1, 4 |
| Use `obsidian-headless` as the note CLI | Its scope is Sync and Publish | [SOURCE: https://github.com/obsidianmd/obsidian-headless] | 2 |
| Prefer `obsidian-cli-rest` | Adds app + official CLI + wrapper and only a narrow MCP abstraction | [SOURCE: https://github.com/dsebastien/obsidian-cli-rest] | 2 |
| Treat REST wrappers as headless | Vault operations still depend on the in-app Local REST API plugin | [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] | 3 |
| Build a new default REST-to-MCP adapter | Local REST API now ships `/mcp/` directly | [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] | 1, 3, 4 |
| Copy the sibling ClickUp package string | Its own packet records npm 404 for `@clickup/mcp-server` | [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:63] | 4 |
| Register all MCP candidates by default | Overlapping mutation tools increase ambiguity and blast radius | [INFERENCE: candidate tool inventories and scope model] | 3, 4 |

## Divergence Map

No divergent-pivot events were recorded. Breadth came from four sequential angles: official surfaces, CLI identities/headlessness, MCP identities/transports, and repository-specific integration. Saturated directions are official capability discovery, community identity verification, and transport/auth mapping. The remaining frontier is live fixture-vault validation, which belongs to implementation verification rather than another research iteration.

## 12. Open Questions

- Does the installed Code Mode runtime pass `${OBSIDIAN_AUTH_HEADER}` through the `mcp-remote` header exactly as expected? Confirm with `get_required_keys_for_tool`, `list_tools`, and one read-only call.
- Does the operator prefer OS certificate trust for HTTPS, or the plugin's loopback-only HTTP endpoint for local development?
- Are dedicated MCP backlinks/templates hard requirements, or is routing those operations to the official CLI acceptable?

## 13. Comparison to Existing `mcp-click-up`

Mirror these durable patterns:

- Operation-to-surface routing.
- One primary CLI plus one secondary MCP surface.
- Install pointers rather than vendored third-party source.
- Doctor checks for binary, auth, registration, and callable schema.
- Code Mode manual naming and prefixed `.env` variables.
- Feature catalog and manual testing playbook split by surface.

Do not mirror the stale provider assumption. The ClickUp packet's own verification records a 404 for its configured package, which makes identity verification part of the Obsidian acceptance gate. [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:63]

## 14. Testable Acceptance Conditions

- `command -v obsidian` resolves and `obsidian version` reports installer/app versions.
- With Obsidian running, read-only CLI probes pass for search, backlinks, tags, properties, daily note, and templates.
- The Local REST API status endpoint responds on loopback and rejects missing/invalid bearer tokens.
- `mcp-remote@latest` resolves from npm before the manual is accepted.
- Code Mode reports required key `obsidian_OBSIDIAN_AUTH_HEADER`.
- `list_tools` returns the documented Local REST API MCP tools.
- Read, search, and tag-list smoke tests pass against a disposable vault.
- Mutation tests verify create/patch/trash semantics and leave the fixture recoverable.
- Headless profile tests run with Obsidian stopped and prove the documented capability gaps rather than hiding them.

## 15. Implementation Boundaries

In scope for a follow-up implementation:

- `mcp-obsidian` skill/router and focused references.
- CLI/MCP install pointers, doctor scripts, configuration asset, examples, and tests.
- `.utcp_config.json` and `.env.example` integration after explicit implementation approval.
- Safety rules and operation routing.
- Optional headless profile.

Out of scope:

- A new note-storage engine.
- Forking or vendoring Obsidian, Local REST API, NotesMD CLI, or community MCP servers.
- Silent live/headless behavior normalization.
- Remote exposure of the Local REST API endpoint.

## 16. Trade-offs, Risks, and Convergence Report

The recommended path minimizes code ownership and uses live Obsidian semantics, but both primary surfaces depend on the GUI app. The headless profile restores automation without the app at the cost of metadata/link/template parity. Bridging Streamable HTTP through `mcp-remote` adds one small transport dependency; adopting `obsidian-mcp-server` instead adds a larger semantic wrapper but better policy controls.

### Convergence Report

- Stop reason: `maxIterationsReached`
- Stop policy: `max-iterations`
- Total iterations: 4
- Questions answered: 5 / 5 research questions; 3 implementation verification questions remain
- newInfoRatio trend: 1.00 → 0.78 → 0.79 → 0.68
- Average newInfoRatio: 0.8125
- Convergence threshold: 0.05
- Convergence before iteration 4: telemetry only by operator contract
- Quality guards: multiple official/upstream source families; focus alignment preserved; no recommendation depends on a single weak source

## 17. References

- [SOURCE: https://obsidian.md/help/cli]
- [SOURCE: https://docs.obsidian.md/Plugins/Vault]
- [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI]
- [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
- [SOURCE: https://github.com/Yakitrak/notesmd-cli]
- [SOURCE: https://github.com/obsidianmd/obsidian-headless]
- [SOURCE: https://github.com/dsebastien/obsidian-cli-rest]
- [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]
- [SOURCE: https://raw.githubusercontent.com/cyanheads/obsidian-mcp-server/main/package.json]
- [SOURCE: https://github.com/StevenStavrakis/obsidian-mcp]
- [SOURCE: https://github.com/StevenStavrakis/obsidian-mcp/blob/main/package.json]
- [SOURCE: https://github.com/newtype-01/obsidian-mcp]
- [SOURCE: https://www.npmjs.com/package/mcp-remote]
- [SOURCE: .utcp_config.json:66]
- [SOURCE: .env.example:1]
- [SOURCE: .opencode/skills/mcp-code-mode/README.md:112]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/SKILL.md:299]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:63]
