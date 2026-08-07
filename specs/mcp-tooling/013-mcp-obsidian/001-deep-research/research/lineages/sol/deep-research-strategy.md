# Deep Research Strategy

## Research Topic

Map official and community Obsidian automation surfaces, then rank BUILD-vs-ADOPT options for a dual CLI+MCP `mcp-obsidian` mode.

## Known Context

- The artifact directory is bound directly from `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` was not run.
- This detached lineage may write only inside its own `sol` directory.
- `resource-map.md` was absent from the target spec folder at initialization; the coverage gate is informationally skipped.
- The target mode should mirror `mcp-click-up` structurally: one CLI surface plus one MCP surface, with shared auth/config documentation.

## Key Questions

- [x] What official Obsidian automation surfaces exist, and which require a running desktop app?
- [x] Which community CLI candidates have verified package/binary identities, headless behavior, maintenance evidence, and adequate feature coverage?
- [x] Which community MCP candidates have verified package identities, transports, auth requirements, and adequate feature coverage?
- [x] What Local REST API and `obsidian://` URI constraints determine auth, headless operation, and configuration?
- [x] What ranked BUILD-vs-ADOPT recommendation best fits each surface, including the env-prefix and `.utcp_config.json` pattern?

## Answered Questions

- Official `obsidian` CLI: bundled with Obsidian 1.12.7+, comprehensive feature surface, requires the running app.
- Official plugin API and `obsidian://` are app-coupled; URI automation is narrow and mostly one-way.
- Local REST API is an in-app community plugin with bearer-token REST and Streamable HTTP MCP endpoints.
- Community headless content option: `Yakitrak/notesmd-cli`, binary `notesmd-cli`; filesystem-scoped, no token, narrower semantics.
- Official headless Sync/Publish option: npm `obsidian-headless`, binary `ob`; not a note-management CLI.
- Primary app-running MCP: Local REST API's built-in package-less Streamable HTTP endpoint at `/mcp/`, authenticated with the plugin bearer token.
- Verified wrapper identity: npm and binary `obsidian-mcp-server`; useful for STDIO/safety policy, but still app-coupled through Local REST API.
- Verified headless MCP identity: npm and binary `obsidian-mcp`; filesystem-direct and tokenless, with reduced Obsidian semantics.
- Final decision: adopt official `obsidian` plus Local REST API built-in MCP; build only routing, safety, doctor/install, and optional compatibility/profile layers.
- Code Mode manual `obsidian` maps `${OBSIDIAN_AUTH_HEADER}` to `.env` key `obsidian_OBSIDIAN_AUTH_HEADER` and bridges `/mcp/` through verified `mcp-remote@latest`.

## What Worked

- Primary-source current documentation exposed the newly released official CLI and the Local REST API plugin's built-in MCP server.
- Upstream migration notes and command inventories gave exact current package/binary identities and headless boundaries.
- Upstream package manifests disambiguated similarly named MCP servers and exposed exact binaries, transports, and environment variables.

## What Failed

- Broad search terms initially mixed the new official CLI with older community tools; exact official-domain queries resolved the identity.
- npm-only discovery misses `notesmd-cli`, which is primarily a Go binary distributed through Homebrew/Scoop/AUR.
- Broad MCP discovery produced many similarly named repositories; upstream `package.json` and runnable examples were needed to prove package identity.

## Exhausted Approaches

None yet.

## Ruled-Out Directions

- Running the artifact-root resolver: explicitly prohibited by the fan-out binding contract.
- Writing parent spec, memory, lock, staging, or reducer outputs outside this lineage: prohibited by the containment boundary.
- Building around `obsidian://` as the main automation surface: too narrow and UI-oriented.
- Treating the Local REST API npm package as a runnable headless service: it is an in-app plugin/type package.
- Using `obsidian-headless` as a note CLI: it handles Sync/Publish only.
- Preferring `obsidian-cli-rest` as the MCP server: it is a redundant app-plus-official-CLI wrapper with a narrower two-tool MCP model.
- Treating a standalone REST-to-MCP wrapper process as headless vault access: all Local REST API wrappers still require the running desktop app.
- Building a redundant default REST-to-MCP translation layer now that Local REST API exposes Streamable HTTP MCP directly.
- Silently mixing live-app and filesystem profiles despite observable feature and consistency differences.
- Copying the sibling ClickUp package identity without registry/launch verification; its own packet records a 404.

## Next Focus

Maximum iterations reached. Canonical synthesis is `research.md`; live fixture-vault validation is the next implementation-phase gate.
