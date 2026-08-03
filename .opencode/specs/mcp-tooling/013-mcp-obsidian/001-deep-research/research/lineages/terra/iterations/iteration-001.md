# Iteration 1: Official Obsidian automation contract and local dual-surface precedent

## Focus

Establish the supported Obsidian automation boundaries, then inspect the local `mcp-click-up` wiring that the proposed mode is meant to mirror.

## Actions Taken

- Read Obsidian Help for the official CLI and URI protocol.
- Read the official plugin API Vault documentation.
- Read the Local REST API project's current README and API overview.
- Read the local Code Mode manual and environment example for `mcp-click-up`.

## Findings

1. The official `obsidian` CLI is the only first-party command-line candidate. It requires the 1.12.7+ installer, must be enabled in Obsidian settings, and requires the desktop app; the first command starts the app if it is not running. [SOURCE: https://obsidian.md/help/cli]
2. The official CLI already covers the CLI target surface: file CRUD (including template-based create), search, backlinks/outgoing links, daily-note read/append/prepend, tags, and frontmatter through the `property:*` commands. [SOURCE: https://obsidian.md/help/cli]
3. `obsidian://` is a supported UI-automation protocol for open/new/daily/search flows and can append, prepend, or overwrite a note, but it drives Obsidian UI behavior rather than offering a headless query API; it has no documented backlinks/tag/frontmatter enumeration surface. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI]
4. The plugin API is richer than the URI scheme—`Vault` can read/write/process notes safely—but it is an in-app extension API (`this.app.vault`), not a standalone CLI or headless server. [SOURCE: https://docs.obsidian.md/Plugins/Vault]
5. The Local REST API community plugin now exposes both authenticated REST and a built-in Streamable HTTP MCP endpoint. Its core capabilities include full CRUD, section/frontmatter patching, text/JSONLogic search, tags, command execution, and opening notes in the UI. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
6. Local REST API is app-bound: it only exists after the plugin is installed and enabled in a running Obsidian vault. It uses a bearer API key and HTTPS on `127.0.0.1:27124` by default with a self-signed certificate; HTTP on 27123 is opt-in. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
7. The local ClickUp precedent uses a named Code Mode manual, stdio `npx` launch, and manual-prefixed environment variables; its own verification note records that `@clickup/mcp-server` returned a public-registry 404. The new mode must copy the configuration shape, not blindly copy the package-name practice. [SOURCE: .utcp_config.json:66] [SOURCE: .env.example:1] [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:65]

## Questions Answered

- Which official Obsidian surfaces are automation-capable, and what is their supported feature and runtime boundary?
- What configuration convention does the existing `mcp-click-up` manual establish, and what identity-validation lesson does it carry?

## Questions Remaining

- Which community CLI candidates add value over the official CLI without requiring the app?
- Which MCP package should be adopted, if any, instead of connecting to the Local REST API plugin's built-in MCP endpoint?
- What exact environment variables and safety controls should the mcp-obsidian manual expose?

## Ruled Out

- Treating `obsidian://` as a full data-plane API: it lacks the documented rich query and metadata surface needed for agent operations. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI]
- Calling the official `obsidian` CLI headless: the official documentation requires a running desktop app and launches it on first use. [SOURCE: https://obsidian.md/help/cli]

## Dead Ends

- Do not adopt the existing ClickUp package name as a template without a registry verification; the local documentation records a 404 for it. [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:65]

## Edge Cases

- Ambiguous input: “headless” is treated strictly as usable without a running Obsidian app. The official CLI can launch the app but does not satisfy that condition.
- Contradictory evidence: none found.
- Missing dependencies: the Local REST API plugin needs a local desktop vault and a generated API key, which cannot be verified from this detached research run.
- Partial success: the built-in MCP endpoint is documented, but Code Mode HTTP transport support must still be checked against the repository’s manual schema before recommending direct registration.

## Sources Consulted

- https://obsidian.md/help/cli
- https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI
- https://docs.obsidian.md/Plugins/Vault
- https://github.com/coddingtonbear/obsidian-local-rest-api
- .utcp_config.json:66
- .env.example:1
- .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:65

## Assessment

- New information ratio: 1.00
- Novelty justification: This first pass established the first-party surface, direct MCP capability, runtime constraints, and relevant in-repo integration pattern from scratch.
- Questions addressed: official surfaces; Local REST API runtime/auth boundary; existing Code Mode manual convention.
- Questions answered: official runtime/feature boundary; configuration-pattern lesson.

## Reflection

- What worked and why: Primary documentation exposed the decisive split quickly: the official CLI is app-backed while the Local REST API plugin exposes the only documented network API plus MCP endpoint.
- What did not work and why: The local ClickUp manual cannot serve as package proof because its configured package is explicitly documented as a registry 404.
- What I would do differently: Verify executable identities through package registries before ranking third-party MCP wrappers.

## Recommended Next Focus

Verify community MCP/CLI package identities and compare direct Local REST API MCP with maintained wrappers, including transport, auth, feature coverage, and running-app dependency.
