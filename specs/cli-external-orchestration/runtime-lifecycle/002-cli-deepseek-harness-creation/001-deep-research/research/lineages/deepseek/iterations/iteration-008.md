# Iteration 8: MCP

## Focus

Angle 8: how MCP servers are configured, which transports exist, where the config lives, whether
`.pi/mcp.json` and the code-mode manual can connect, and whether a dispatch can enable or deny MCP
tools per run.

## Actions Taken

- Read the MCP client and MCP manager references and the memory-server guide.
- Read `.pi/mcp.json` and the installed package inventory for `dsh-mcp-client` and the hook bridge.
- Checked the base and web bundle patches for which MCP rows are mounted.

## Findings

1. One `@deepseek-ai/dsh-mcp-client` row per server, with required `serverName` and `transport`
   (`stdio` or `streamable-http`), then `command`/`args`/`env`/`cwd` for a local program or
   `url`/`headers` for a service, plus `toolCallTimeoutMs` (60 s default), optional
   `startupTimeoutMs`, `closeTimeoutMs`, `expandTemplates` and `failOnStartupError`.
   [SOURCE: dsh-src/packages/mcp/mcp-client/README.md:32-66]
2. Tools are exposed as `mcp__<serverName>__<rawName>`, with the server namespace taken from local
   configuration rather than the remote `serverInfo.name`, so restarts and upgrades do not rename
   model-facing tools. Two servers may offer the same raw tool name under different namespaces.
   [SOURCE: dsh-src/packages/mcp/mcp-client/README.md:78-86]
3. Server instructions join the logged system prompt as literal text, up to 32,768 bytes, and MCP
   prompt templates are unsupported. That makes a server's instructions untrusted prompt input: a
   hostile server can put directives in the description or instructions, and the same
   data-not-instructions rule that covers fetched web pages must cover MCP text.
   [SOURCE: dsh-src/packages/mcp/mcp-client/README.md:12]
   [SOURCE: dsh-src/packages/mcp/mcp-client/README.md:65]
4. MCP configuration lives only in the active profile's `cordis.patch.yml` or a `--patch` overlay;
   there is no project MCP file. `.pi/mcp.json` cannot be read by the harness and must be translated
   into `.dsh/mcp.yml` rows, one per server. [SOURCE: dsh-src/docs/user/guide/mcp-memory.md:23-33]
5. The stdio bridge scrubs ambient variables whose names usually identify credentials and every
   `DSH_*` variable before launching the child; everything a server needs must be named in the row's
   `env`. `expandTemplates: true` adds `${credential:REF}` resolution, but requires a credentials
   provider, which the headless profile disables by default.
   [SOURCE: dsh-src/docs/user/guide/mcp-memory.md:13]
   [SOURCE: dsh-src/packages/mcp/mcp-client/README.md:101]
6. The repo's code-mode entry translates directly: `command: node`, `args: [.skilled/bin/mcp-code-mode-launcher.cjs]`,
   `transport: stdio`, `env: { UTCP_CONFIG_FILE: .utcp_config.json }`, `cwd: <repo root>`. Its
   `lifecycle: lazy` has no harness equivalent — a dsh MCP client connects with the plugin lifecycle
   — so porting trades lazy startup for an eager connection bounded by `startupTimeoutMs`.
   [SOURCE: .pi/mcp.json:1]
   [SOURCE: dsh-src/packages/mcp/mcp-client/README.md:32]
7. Per-dispatch enable/deny has no CLI flag: the lever is the patch file. A dispatch that omits the
   MCP rows has no MCP tools at all, and one that passes an MCP patch gets exactly the servers in
   that patch. The live `mcp-manager` fleet controls exist only in the web/desktop profiles, not in
   base or headless. [SOURCE: dsh-src/packages/mcp/mcp-manager/README.md:12]
   [SOURCE: dsh-src/packages/bundle/web-app/cordis.patch.yml:153-154]
8. `dsh-mcp-client` is bundled inside the installed `@deepseek-ai/dsh@0.2.2-rc.1` package (319
   `@deepseek-ai/dsh-*` packages present), while `dsh-hooks-claude-code` is not bundled despite being
   a public, version-matched package. MCP therefore needs only a profile row; the hook bridge needs
   an install step. This corrects the Angle 6 shorthand that called the bridge "shipped".
   [SOURCE: /Users/michelkerkmeester/.local/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-mcp-client/package.json:1]
   [SOURCE: dsh-src/packages/experimental/hooks-claude-code/package.json:1]
9. Base mounts `mcp-resources` but not `mcp-client`, so a headless dispatch has no MCP tool until a
   patch adds a server row; the MCP route guard's `mcp__.*` matcher shape still fits the generated
   tool names once it is rewritten as a regex. [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:505-506]

## Ruled Out

- Reading `.pi/mcp.json` directly: no project MCP config is scanned.
- Per-dispatch `--mcp` or tool-allowlist flags: none exist; composition is the control.
- Lazy MCP startup: no `lifecycle` field on the harness client.

## Dead Ends

- Looking for an MCP manager in base or headless: only the web bundle mounts it, so a headless
  dispatch cannot enable or restart a server mid-run.

## Edge Cases

- Ambiguous input: "per-dispatch enable or deny" could mean server selection or tool filtering; the
  harness offers server selection by composition only.
- Contradictory evidence: the Angle 6 note treated the Claude hook bridge as shipped; the installed
  package inventory shows it is not, and this iteration supersedes that wording.
- Missing dependencies: no MCP server is installed or configured, so nothing was connected.
- Partial success: the schema and translation are confirmed; a live code-mode connection is not.

## Sources Consulted

- `dsh-src/packages/mcp/mcp-client/README.md:12-101`
- `dsh-src/packages/mcp/mcp-manager/README.md:12`
- `dsh-src/docs/user/guide/mcp-memory.md:9-33`
- `.pi/mcp.json`
- `dsh-src/packages/bundle/base/cordis.patch.yml:505-506`
- `dsh-src/packages/bundle/web-app/cordis.patch.yml:153-154`
- Installed package inventory at `~/.local/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai`
- `dsh-src/packages/experimental/hooks-claude-code/package.json:1`

## Assessment

- New information ratio: 0.88 (seven fully new findings, one correction to the Angle 6 cost model,
  one that confirms the built-in tool-name shape)
- Questions addressed: Angle 8 MCP configuration, transports and per-dispatch control
- Questions answered: How are MCP servers configured, and can this repo's servers and code-mode connect?

## Reflection

- What worked and why: translating `.pi/mcp.json` field by field found the one unsupported key
  (`lifecycle`) and the one required addition (`cwd`), which a schema summary would have missed.
- What did not work and why: assuming the hook bridge shipped because it exists in the source tree;
  the installed inventory is the authority and it corrected the cost.
- What I would do differently: run the installed-package inventory in Angle 6, since every port
  verdict depends on whether the package is actually present.

## Recommended Next Focus

Angle 9: deep-loop fan-out fitness, the lineage command builder, and every consumer that must learn
a new executor kind.
