# Obsidian automation surfaces — BUILD vs ADOPT

## 1. Executive Decision

Use a dual surface, but do not build two data planes:

- **CLI:** adopt the official `obsidian` CLI for desktop-local workflows.
- **MCP, current Code Mode:** adopt the verified `obsidian-mcp-server` stdio wrapper around Local REST API.
- **MCP, future simpler topology:** adopt Local REST API's built-in Streamable HTTP MCP directly when Code Mode's HTTP-manual/custom-header schema is confirmed.
- **Strictly headless:** build a deliberately reduced filesystem backend only if a running Obsidian app is unacceptable.

The constraint is runtime, not package selection. The official CLI requires a running desktop app, and the rich REST/MCP surface lives in a plugin loaded by that app. A terminal command or stdio transport does not make either headless. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

## 2. Research Question

Which Obsidian automation surfaces should a new mcp-obsidian mode adopt or build for a dual CLI+MCP integration that mirrors mcp-click-up, while preserving accurate package identity, app/token requirements, Code Mode configuration conventions, and the requested feature surface?

## 3. Scope and Constraints

- This assessment covers official CLI/help, `obsidian://`, the plugin API, Local REST API, verified community CLI/MCP packages, and repository-local mcp-click-up conventions.
- No repository configuration, source code, user vault, token, or running Obsidian application was changed or accessed.
- “Headless” means usable with **no running Obsidian app**. A command that launches or controls the desktop app is app-backed.
- Package identity is treated as a release-time proof obligation because the local ClickUp notes record a public-npm 404 for the configured `@clickup/mcp-server` name. [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:65]

## 4. Method

Three evidence passes were completed: official surfaces and local integration precedent; CLI package/binary and headless boundary; then MCP package/transport/auth/configuration. The final registry reports three completed iterations, five answered questions, and zero open questions. [SOURCE: deep-research-dashboard.md]

## 5. Official Surface Map

| Surface | What it provides | Headless? | Role in the mode |
| --- | --- | --- | --- |
| Official `obsidian` CLI | File operations, daily-note operations, search, backlinks/outgoing links, tags/properties, template-based create, and command execution | No — needs/runs the app | Primary desktop-local CLI. [SOURCE: https://obsidian.md/help/cli] |
| `obsidian://` URI | UI actions for open/new/daily/search plus limited note-content actions | No — drives the app UI | Optional deep-link/launcher helper; not an agent data plane. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI] |
| Plugin API | In-app vault access via `this.app.vault` | No — runs inside a plugin | Build only for a proven missing capability. [SOURCE: https://docs.obsidian.md/Plugins/Vault] |
| Local REST API | Authenticated REST plus built-in Streamable HTTP MCP | No — enabled plugin in running vault | Preferred shared data plane and eventual direct MCP. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] |
| Official Headless Sync (`ob`) | Synchronizes an Obsidian Sync vault to disk | Yes, but Sync-only | Optional filesystem-backend prerequisite, never a rich CLI/MCP substitute. [SOURCE: https://obsidian.md/help/sync/headless] |

## 6. Verified Candidate Identity

| Candidate | Identity proof | Launch / transport | Runtime dependency | Verdict |
| --- | --- | --- | --- | --- |
| Official CLI | Obsidian documents the `obsidian` command | Local terminal to app | Running desktop app | Adopt for normal CLI. [SOURCE: https://obsidian.md/help/cli] |
| Official Headless Sync | `npm install -g obsidian-headless` exposes `ob` | Local/server terminal | Obsidian Sync subscription; synchronization only | Use only to materialize a vault. [SOURCE: https://obsidian.md/help/sync/headless] |
| `@obsidian-vfs/core` | Real npm package, but a library rather than executable | Library API | Direct filesystem; degraded without the app | Do not adopt as CLI; optional helper for a bounded fallback. [SOURCE: https://www.npmjs.com/package/%40obsidian-vfs/core] |
| PyPI `obsidian-cli` | Real package, exporting an `obsidian` binary | Terminal | Its documented scope is vault/open/template oriented | Do not adopt: binary collision and inadequate verified feature coverage. [SOURCE: https://pypi.org/project/obsidian-cli/] |
| Local REST API built-in MCP | Plugin-owned `/mcp/` endpoint, not a separate package | Streamable HTTP | Running app + enabled plugin + bearer token | Adopt when Code Mode HTTP config is proven. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] |
| `obsidian-mcp-server` | Verified npm package and documented `npx` executable | `npx -y obsidian-mcp-server@latest`, stdio | Local REST API v4+ + bearer token | Adopt now for Code Mode. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://www.npmjs.com/package/obsidian-mcp-server] |
| `mcp-obsidian` | Published PyPI package, version 0.2.2 | `uvx mcp-obsidian`, stdio | Local REST API plugin + bearer token | Lower-ranked fallback only. [SOURCE: https://pypi.org/project/mcp-obsidian/] |

## 7. Runtime and Headless Boundary

The official CLI can start Obsidian if needed, but still depends on the desktop app. Local REST API and both reviewed MCP wrappers require an enabled Local REST API plugin inside that running app. Therefore none of the rich selected paths is genuinely headless. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://pypi.org/project/mcp-obsidian/]

For a server with no running app, official Headless Sync can materialize a vault on disk, then a custom direct-filesystem backend can operate on Markdown. It must not claim parity with Obsidian's index, backlinks, template plugins, or app-managed link updates. [INFERENCE: based on https://obsidian.md/help/sync/headless and https://www.npmjs.com/package/%40obsidian-vfs/core]

## 8. Feature Coverage

| Required feature | Official CLI | URI | Local REST API / native MCP | `obsidian-mcp-server` | Decision |
| --- | --- | --- | --- | --- | --- |
| Note CRUD | Full file operations including move/rename/delete | New/open plus limited content actions; not full CRUD | Full file CRUD | Read/list/write/append/patch/replace/delete | Use CLI for operator workflows; MCP for agent data-plane workflows. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] |
| Search | Supported CLI search | UI search action | Simple full-text and structured JsonLogic search | Text, JsonLogic, optional Omnisearch | MCP is the stronger agent-search surface. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] |
| Backlinks | Supported backlinks/outgoing-link commands | No documented query surface | No first-class backlinks endpoint established | Outgoing-link parsing; backlinks not established | Retain official CLI for verified backlinks. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] |
| Daily notes | Direct read/append/prepend commands | `daily` UI action | Active-note and command surface; no dedicated neutral daily endpoint established | Periodic-note addressing when configured; workflow remains command/vault dependent | Keep official CLI as the reliable daily-note path. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] |
| Tags | Supported tag operations | No documented enumeration | Vault-wide tag query | List/add/remove tags | MCP is suitable; tag names may remain vault-wide. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] |
| Frontmatter | `property:*` commands | No documented metadata surface | Targeted frontmatter patch | Atomic get/set/delete | MCP is suitable for structured automation. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] |
| Templates | Template-based note create | No documented native template operation | Through configured commands only; no native template endpoint established | Through optional commands only | Keep CLI as primary template surface. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] |

## 9. Authentication and Safety Model

Local REST API uses an API key as a bearer token. Its default HTTPS endpoint is `https://127.0.0.1:27124`, uses a self-signed certificate, and serves native MCP at `/mcp/`; HTTP at port 27123 is opt-in. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

For the stdio wrapper, use `OBSIDIAN_API_KEY`, `OBSIDIAN_BASE_URL`, and the wrapper's scoped controls: `OBSIDIAN_READ_PATHS`, `OBSIDIAN_WRITE_PATHS`, `OBSIDIAN_READ_ONLY`, and opt-in `OBSIDIAN_ENABLE_COMMANDS`. Start read-only and folder-scoped. The wrapper's command palette tools are off by default because individual Obsidian commands can be destructive. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

## 10. Code Mode Configuration Pattern

The local mcp-click-up pattern is a named manual using `transport: "stdio"`, `command: "npx"`, an argument array, and an `env` object. The environment example maps a manual named `X` to `X_VAR`, so a manual named `obsidian` maps `OBSIDIAN_API_KEY` to `obsidian_OBSIDIAN_API_KEY`. [SOURCE: .utcp_config.json:66] [SOURCE: .env.example:1]

This is a research proposal, not an applied configuration change:

```json
{
  "name": "obsidian",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "obsidian": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "obsidian-mcp-server@latest"],
        "env": {
          "MCP_TRANSPORT_TYPE": "stdio",
          "MCP_LOG_LEVEL": "info",
          "OBSIDIAN_API_KEY": "${OBSIDIAN_API_KEY}",
          "OBSIDIAN_BASE_URL": "${OBSIDIAN_BASE_URL}",
          "OBSIDIAN_VERIFY_SSL": "${OBSIDIAN_VERIFY_SSL}",
          "OBSIDIAN_READ_ONLY": "${OBSIDIAN_READ_ONLY}",
          "OBSIDIAN_READ_PATHS": "${OBSIDIAN_READ_PATHS}",
          "OBSIDIAN_WRITE_PATHS": "${OBSIDIAN_WRITE_PATHS}",
          "OBSIDIAN_ENABLE_COMMANDS": "${OBSIDIAN_ENABLE_COMMANDS}"
        }
      }
    }
  }
}
```

```dotenv
# Obsidian
# (Code Mode uses prefixed variable names: {manual_name}_{VAR})
obsidian_OBSIDIAN_API_KEY=your_local_rest_api_key
obsidian_OBSIDIAN_BASE_URL=https://127.0.0.1:27124
obsidian_OBSIDIAN_VERIFY_SSL=false
obsidian_OBSIDIAN_READ_ONLY=true
obsidian_OBSIDIAN_READ_PATHS=notes/,inbox/
obsidian_OBSIDIAN_WRITE_PATHS=inbox/
obsidian_OBSIDIAN_ENABLE_COMMANDS=false
```

Trust the local certificate where practical. `OBSIDIAN_VERIFY_SSL=false` is appropriate only for the plugin's localhost self-signed endpoint, not as a general TLS setting. The documented `@latest` launch syntax establishes executable identity but must be replaced by a verified version pin at implementation time. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

## 11. Implementation Recommendation

Build a thin mcp-obsidian mode dispatcher—not a custom Obsidian data service:

1. Route desktop-local CLI tasks to official `obsidian`.
2. Register the `obsidian` stdio manual around `obsidian-mcp-server` when Code Mode needs MCP tools.
3. Keep URI handling optional and limited to UI navigation/deep links.
4. Make the filesystem backend a separate, explicitly reduced variant only when strict headless use is a real requirement.
5. Re-evaluate direct native MCP once Code Mode's remote HTTP plus custom-header configuration is demonstrated.

This yields broad feature coverage now and preserves a clean removal path for the wrapper later. [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration(s) |
| --- | --- | --- | --- |
| Treat `obsidian://` as the MCP data plane | UI protocol lacks the documented rich metadata/query surface | [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI] | 1 |
| Call official CLI “headless” | CLI requires/launches the desktop app | [SOURCE: https://obsidian.md/help/cli] | 1 |
| Copy a package name from mcp-click-up without registry verification | Local notes document `@clickup/mcp-server` as a public-registry 404 | [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:65] | 1 |
| Use PyPI `obsidian-cli` as primary CLI | Same `obsidian` binary name as official CLI; narrower verified capability | [SOURCE: https://pypi.org/project/obsidian-cli/] | 2 |
| Treat `@obsidian-vfs/core` as CLI | Library, not executable; app-dependent search/wikilinks degrade | [SOURCE: https://www.npmjs.com/package/%40obsidian-vfs/core] | 2 |
| Treat official `ob` Headless Sync as automation API | It synchronizes a vault but does not establish note CRUD/search/backlink tooling | [SOURCE: https://obsidian.md/help/sync/headless] | 2 |
| Treat any Local REST wrapper as headless | Wrapper still delegates to enabled plugin inside running Obsidian | [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://pypi.org/project/mcp-obsidian/] | 3 |
| Build rich MCP now | Duplicates native plugin/verified wrapper without removing app dependency | [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] | 3 |
| Configure native HTTP MCP in Code Mode before proving schema | Current local examples establish stdio, not header-bearing HTTP syntax | [INFERENCE: based on .utcp_config.json:66] | 3 |

## Divergence Map

- **Saturated direction:** third-party CLI substitution. None reached full app-backed official CLI coverage while also being genuinely headless.
- **Pivots taken:** official automation contract → CLI/headless boundary → MCP/auth/config boundary.
- **Failed pivots:** none; no evidence justifies a bespoke rich MCP or plugin.
- **Remaining frontier:** Code Mode's documented HTTP MCP/manual-header schema. It is an implementation validation gate, not an unanswered research question.

## 12. Open Questions

No research questions remain. Before implementation, verify only whether Code Mode can register a Streamable HTTP MCP with an authorization header; that decides native Local REST API MCP versus the stdio wrapper.

## 13. Implementation Gates

1. Verify Code Mode's HTTP manual schema and custom-header support.
2. If supported, use `https://127.0.0.1:27124/mcp/` with `Authorization: Bearer …`; otherwise use the stdio wrapper proposal.
3. Validate against a disposable vault: read/search, CRUD, targeted frontmatter patch, tags, scoped path denial, read-only denial, and command opt-in.
4. Test official CLI separately for backlinks, daily-note, and template behavior.
5. Decide whether strict headless use is genuinely necessary before authoring a filesystem backend.

## 14. Risks and Limitations

- A Local REST API token grants access within the server's available vault surface; scope it through wrapper path policies and safe defaults. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]
- The native plugin uses a self-signed certificate, so TLS trust must be configured deliberately. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
- Tag listings may reveal tag names outside a read scope; treat it as metadata disclosure when setting policy. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]
- Direct native MCP remains conditional on Code Mode transport support; lack of a local example is not proof of lack of product support.

## 15. Headless Fallback Contract

If built, the fallback accepts only a local `OBSIDIAN_VAULT_PATH` and exposes direct Markdown CRUD, simple text search, and conservative frontmatter/tag parsing. It must label backlinks, index search, template-plugin execution, and link-management semantics as unavailable. Pair it with official Headless Sync only if the vault is licensed/configured for Obsidian Sync. [SOURCE: https://obsidian.md/help/sync/headless] [INFERENCE: based on https://www.npmjs.com/package/%40obsidian-vfs/core]

## 16. Convergence Report

- Iterations: 3 of 3, deliberately run to `maxIterations`.
- Questions: 5 resolved, 0 open.
- New-information ratios: 1.00 → 0.80 → 0.75; the threshold was telemetry only, so no early synthesis occurred.
- Stop reason: `maxIterationsReached`.
- Scope discipline: only this detached lineage received writes; no parent spec, repository source, or configuration was changed. [SOURCE: deep-research-dashboard.md]

## 17. References

- https://obsidian.md/help/cli
- https://obsidian.md/help/sync/headless
- https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI
- https://docs.obsidian.md/Plugins/Vault
- https://github.com/coddingtonbear/obsidian-local-rest-api
- https://github.com/cyanheads/obsidian-mcp-server
- https://www.npmjs.com/package/obsidian-mcp-server
- https://pypi.org/project/mcp-obsidian/
- https://pypi.org/project/obsidian-cli/
- https://www.npmjs.com/package/%40obsidian-vfs/core
- .utcp_config.json:66
- .env.example:1
- .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:65
