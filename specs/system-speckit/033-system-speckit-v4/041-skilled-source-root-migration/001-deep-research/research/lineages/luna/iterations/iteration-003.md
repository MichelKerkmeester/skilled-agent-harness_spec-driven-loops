# Iteration 3: OpenCode compatibility surface

## Focus

Identify the smallest `.opencode/` surface that the OpenCode project contract still
needs, including the MCP launcher, plugins, hooks and build products.

## Findings

### Surface: 3, what `.opencode/` must keep

- **Finding:** The root OpenCode configuration invokes `node .opencode/bin/mcp-code-mode-launcher.cjs`; the launcher resolves its repository root from its own directory and then constructs `.opencode/skills/mcp-code-mode/mcp-server`, its `package.json`, and `dist/index.js`. **Classification:** `blocker`. **Consequence for the cutover:** `.opencode/bin/mcp-code-mode-launcher.cjs`, its adjacent resolver library, and the nested MCP server path must remain resolvable at those exact relative names, or the checked-in OpenCode configuration cannot start its registered MCP server.
  - [SOURCE: `opencode.json:10-19`]
  - [SOURCE: `.opencode/bin/mcp-code-mode-launcher.cjs:11-28`]
  - [SOURCE: `.opencode/bin/mcp-code-mode-launcher.cjs:129-145`]

- **Finding:** The MCP install contract requires `mcp-server/dist/index.js` and `mcp-server/node_modules`, and identifies `scripts/install.sh` plus `npm install && npm run build` as the ways to produce them. The current tracked source set contains the TypeScript entrypoint and lockfile, while `dist/` is ignored by the repository-wide rule. **Classification:** `regenerate`. **Consequence for the cutover:** A source-root move must preserve the MCP server's install/build contract and must not treat a path-preserving symlink as proof that the runtime artifact exists. The existing checkout's missing build output is an independent pre-cutover health gap, not evidence that the launcher path is optional.
  - [SOURCE: `.opencode/commands/doctor/assets/doctor-mcp-install.yaml:97-113`]
  - [SOURCE: `.opencode/skills/mcp-code-mode/mcp-server/tsconfig.json:14-35`]
  - [SOURCE: `.gitignore:49-53`]

- **Finding:** OpenCode project plugins are discovered from a flat glob over `.opencode/plugins/`; only modules directly in that directory are loadable plugin sources, while `lib/` and `tests/` are support trees. The same plugin contract persists hook flags in `.opencode/hooks/hook-flags.env`. **Classification:** `blocker`. **Consequence for the cutover:** The runtime-visible `.opencode/plugins/` and `.opencode/hooks/` positions cannot simply disappear. A compatibility link can preserve the positions only if OpenCode and the hook code follow links; otherwise the design must leave runtime-visible directories at those names. The flat-glob rule also means a link to the whole plugin directory is materially different from linking only selected plugin files.
  - [SOURCE: `.opencode/plugins/README.md:14-20`]
  - [SOURCE: `.opencode/plugins/README.md:94-103`]

- **Finding:** The OpenCode delegation contract says project-local agents live under `.opencode/agents`, and an `opencode run` resolves that directory while loading project plugins, skills and MCP. **Classification:** `blocker`. **Consequence for the cutover:** Full OpenCode behavior needs `.opencode/agents`, `.opencode/plugins`, `.opencode/skills` and the MCP launcher/server paths to resolve at their current runtime names. The evidence does not establish an upstream configuration switch for replacing the `.opencode` project directory, so that configurability remains UNKNOWN.
  - [SOURCE: `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:21-36`]
  - [SOURCE: `.opencode/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:55-60`]
  - [SOURCE: `.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:108-117`]

- **Finding:** Host-specific hook and MCP configurations outside `.opencode/` invoke `.opencode/hooks/...` and `.opencode/bin/mcp-code-mode-launcher.cjs` directly, rather than discovering those paths through a central manifest. **Classification:** `mechanical`. **Consequence for the cutover:** Every direct command-string reference is an independent path-rewrite target; preserving only the OpenCode launcher does not preserve Claude, Codex, Cursor, Devin, Pi or other host hook/MCP behavior.
  - [SOURCE: `.claude/settings.json:23-63`]
  - [SOURCE: `.codex/hooks.json:69-116`]
  - [SOURCE: `.cursor/hooks.json:36-99`]
  - [SOURCE: `.devin/hooks.v1.json:33-134`]
  - [SOURCE: `.claude/mcp.json:1-8`]
  - [SOURCE: `.cursor/mcp.json:1-8`]

## Sources Consulted

- Root OpenCode configuration and MCP launcher.
- OpenCode plugin contract and CLI delegation references.
- MCP doctor contract, server TypeScript configuration and host hook/MCP configurations.

## Assessment

- `newInfoRatio`: 0.9
- Novelty justification: The launcher and doctor configuration separate path-preserving requirements from generated MCP build products, while the plugin contract adds a discovery-specific constraint.
- Confidence: high for repository-owned OpenCode paths; UNKNOWN for whether upstream OpenCode can be configured to use a different project asset root.

## Reflection

- Worked: reading the launcher and doctor definitions together exposed both required names and the named regeneration path.
- Ruled out: treating every `.opencode` item as equally required by the OpenCode process.
- Failed: upstream OpenCode discovery configurability is not implemented in this checkout.

## Recommended Next Focus

Enumerate generated and derived artifacts that store `.opencode` as path data, and identify the command that regenerates each one.
