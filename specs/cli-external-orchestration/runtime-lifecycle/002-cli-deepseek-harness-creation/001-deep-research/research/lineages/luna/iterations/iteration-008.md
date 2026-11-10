# Iteration 8 — Angle 8: MCP configuration and enablement

**Timestamp:** 2026-11-05T22:41:24Z  
**Focus:** MCP server configuration, repo-local enablement, code-mode bridge fit, and per-dispatch controls.

## Findings

1. **DSH's MCP client is opt-in and server-scoped.** Each `@deepseek-ai/dsh-mcp-client` registration describes one server, and no server is enabled by default. The client documents stdio and Streamable HTTP transports, names tools `mcp__<serverName>__<tool>`, and uses the shared resource service shipped in profiles. The DSH headless profile is a one-shot composition over dsh-base; its bundle list includes `mcp-resources` but not `mcp-client`, so MCP tools require an explicit composition overlay. [SOURCES: dsh-src/packages/mcp/mcp-client/README.md:12,28-32,55-65,74-78; dsh-src/packages/bundle/base/cordis.patch.yml:505-506; dsh-src/packages/bundle/headless/cordis.patch.yml:1-7; https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/mcp/mcp-client/README.md (fetched 2026-11-05)]

2. **A repo-local patch can be the per-dispatch opt-in.** The CLI accepts ordered `--patch` overlays before the app-argument boundary, so a checked-in `.dsh/cordis.patch.yml` (name is a recommendation, not an existing DSH convention) can add only approved MCP registrations and the dispatch wrapper can pass it explicitly. Without that patch, the current headless bundle set does not mount the MCP client. The reviewed CLI docs do not establish a dedicated `--no-mcp` or per-call MCP enable flag; treat the overlay choice as the concrete enable/disable control. [SOURCES: dsh-src/apps/cli/src/args.ts:73-74; dsh-src/apps/cli/reference/README.md:28-34; dsh-src/packages/bundle/headless/cordis.patch.yml:1-7; dsh-src/packages/mcp/mcp-client/README.md:12]

3. **The current Code Mode server is portable through stdio, but its Pi JSON is not a DSH config.** `.pi/mcp.json` launches `node .skilled/bin/mcp-code-mode-launcher.cjs` and sets `UTCP_CONFIG_FILE=.utcp_config.json`; the launcher resolves the server entrypoint from the shared `.skilled` source tree. DSH's adapter must translate these values into a `dsh-mcp-client` YAML entry (`transport: stdio`, command/args/env/cwd), preserving the repository working directory. Pi's advisor is an in-process extension and is not an MCP server to port. No live DSH connection was run, so successful handshake through that launcher remains unconfirmed. [SOURCES: .pi/mcp.json:1-12; .pi/SYNC.md:26-30; .skilled/bin/mcp-code-mode-launcher.cjs:22-34,67-80; dsh-src/packages/mcp/mcp-client/README.md:34-60; https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/mcp.md (fetched 2026-11-05)]

4. **Per-tool restriction belongs in the adapter's tool policy.** DSH tool names are server-qualified, and the core tool registry exposes `ctx.tools.restrict(filter)` as an allow/deny mask over inherited tools. The docs reviewed do not show an MCP-specific per-tool allowlist field in the client config. The planned adapter should mount the server composition only when requested and apply a closed allowlist of `mcp__code_mode__*` names for a dispatch; the exact filter behavior and permission boundary should be verified against a harmless server before enabling it. [SOURCES: dsh-src/packages/mcp/mcp-client/README.md:74-84; dsh-src/packages/core/tools/README.md:88-92,108-112]

5. **MCP process startup and environment need explicit bounds.** Stdio negotiation starts a temporary probe process before the serving process; DSH offers startup timeout, per-call timeout, startup-failure policy, reconnect controls, and credential template expansion. Its MCP child environment drops inherited names matching `KEY|PASSWORD|SECRET|TOKEN` and inherited `DSH_*`, then merges configured env values. Configure `UTCP_CONFIG_FILE` explicitly and choose startup/failure policy deliberately; do not assume arbitrary secrets from the parent environment reach the child. [SOURCES: dsh-src/packages/mcp/mcp-client/README.md:28,55-70,94-103,161; https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/mcp-memory.md (fetched 2026-11-05)]

## Ruled Out

- Treating `.pi/mcp.json` as a config file DSH can load directly; DSH requires its own plugin-entry schema.
- Claiming a dedicated MCP toggle or live Code Mode connectivity before a credential-free handshake probe confirms it.
- Passing every inherited environment variable to a local MCP child; the DSH transport intentionally scrubs sensitive-name patterns and `DSH_*`.

## Uncertainties

- Whether the installed `0.2.2-rc.1` package and the inspected source snapshot expose identical patch/transport behavior has not been verified with a live DSH process.
- Exact `ctx.tools.restrict()` semantics for tools registered in nested Agent scopes, including interaction with any permission layer, need a small harmless-server probe.
- HTTP MCP auth, resource access, cancellation, startup and shutdown behavior for the proposed code-mode composition are documented but not live-confirmed.

## Sources

- `.pi/mcp.json`, `.pi/SYNC.md`
- `.skilled/bin/mcp-code-mode-launcher.cjs`
- `.skilled/skills/cli-external-orchestration/cli-pi/references/mcp-and-third-party-packages.md`
- DSH source snapshot: `apps/cli/src/args.ts`, `apps/cli/reference/README.md`, `packages/bundle/base/cordis.patch.yml`, `packages/bundle/headless/cordis.patch.yml`, `packages/core/tools/README.md`, `packages/mcp/mcp-client/README.md`, `docs/subsystems/mcp.md`
- DSH official MCP client, subsystem, and MCP memory docs fetched 2026-11-05
- Hermes MCP comparison: `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/lineages/deepseek/iterations/iteration-007.md`
- `steer.md` — absent when checked before this iteration

## Scope Violations

- The first gateway append for this iteration used the packet path as `--run-directory` instead of the lineage artifact path. The gateway returned `ok: true` but its sequence reset to 1 and the reducer stayed at 7 iterations; inspection showed packet-level research projections outside this lineage were touched. The conflict is recorded here. The event is being retried with the lineage directory as the run directory, as required for the fan-out artifact binding. No cleanup was attempted because this prompt forbids further writes outside the lineage. Earlier failed home-directory probe attempts are documented in iteration 1.

**Next Focus:** Angle 9: deep-loop fan-out executor fitness and complete cross-repo integration surface.
