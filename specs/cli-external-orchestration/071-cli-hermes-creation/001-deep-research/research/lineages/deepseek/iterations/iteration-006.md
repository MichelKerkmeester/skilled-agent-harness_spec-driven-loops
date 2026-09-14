# Iteration 6: Angle 6 — Hooks and plugins

## Focus

Which events Hermes shell hooks fire on, what payload they receive, the consent allowlist,
what `--accept-hooks`/`HERMES_ACCEPT_HOOKS` change; whether the repo's guard cores can be
bridged as shell hooks, as a native plugin under `~/.hermes/plugins/`, or as an Agent
Plugins v1 package; which is the smaller, safer move; whether hooks are user-config-only.

## Actions Taken

- Read `hermes_cli/plugins.py` lines 1-8 and 107-135: `VALID_HOOKS` event set and plugin
  model (`register(ctx)`, later-wins).
- Read `hermes_cli/hooks.py` lines 10-61 and 167-210: hooks command, allowlist status
  rendering, `_cmd_test` payloads, `VALID_HOOKS` import.
- Read `agent/shell_hooks.py` lines 40-56 and 141-163: allowlist file
  `shell-hooks-allowlist.json` (per-user), TTY prompt + `--accept-hooks`/`HERMES_ACCEPT_HOOKS`
  /`hooks_auto_accept` bypass.
- Read `plugins/AGENTS.md`: plugin kinds, discovery (bundled → `~/.hermes/plugins/` →
  `./.hermes/plugins/` opt-in via `HERMES_ENABLE_PROJECT_PLUGINS` → pip), plugin catalog
  policy, compat contract.
- Read `hermes_cli/agent_plugins.py` lines 1-90 and 351+: Agent Plugins v1 portable
  directory packages (plugin.json, skills/, MCP stdio/remote, SSE rejected).
- Read `docs/rfcs/plugin-config-state-bridge.md`: `ctx.get_config`/`ctx.set_config`/
  `ctx.state` (namespace-jailed, profile-scoped).
- Ran `hermes hooks list` (exit 0: none configured) and `hermes plugins list` (exit 0:
  bundled plugins, orca-status enabled) live.
- Inventoried the repo's guard cores under `.opencode/hooks/`: dispatch (with
  `dispatch-audit.mjs`), completion, git-preflight, git-hooks-check, dist-freshness,
  session-lifecycle, session-cleanup, spec-gate, permission-policy, task-dispatch,
  mcp-route-guard, directive-lifecycle, goal, post-edit-quality, skill-advisor.

## Findings

1. **Hooks are user-config-only: the repo cannot carry them.** Shell hooks are declared in
   `~/.hermes/config.yaml` (`hooks:`), consented per (event, command) in
   `~/.hermes/shell-hooks-allowlist.json`, and fired only when allowlisted — a TTY prompt
   otherwise (shell_hooks.py:141-163). `--accept-hooks`/`HERMES_ACCEPT_HOOKS=1`/
   `hooks_auto_accept: true` auto-approve unseen hooks on headless runs. Live check:
   `hermes hooks list` → none configured. Any repo guard bridged as a shell hook is an
   OPERATOR-level install (config edit + allowlist), outside the repo's write surface.
   [SOURCE: agent/shell_hooks.py:141-163; hermes_cli/hooks.py:10-61; live `hermes hooks list`,
   2026-09-14]

2. **The plugin event set is rich enough to carry every repo guard core.** `VALID_HOOKS`
   includes `pre_tool_call`, `post_tool_call`, `pre_llm_call`, `post_llm_call`,
   `transform_tool_result`, `pre_verify` (return `{"decision":"block","reason"}` to stop —
   the Claude-Code Stop shape), `on_session_start`, `on_session_end`,
   `on_session_finalize`, `on_session_reset`, `subagent_start`/`stop`,
   `pre_gateway_dispatch` (skip/rewrite), API-call hooks, and streaming observers
   (plugins.py:107-135).
   [SOURCE: hermes_cli/plugins.py:107-135]

3. **Project-local plugins are the repo-carriable bridge.** General plugins discover from
   bundled `plugins/<name>/`, `~/.hermes/plugins/`, **`./.hermes/plugins/`** (opt-in via
   `HERMES_ENABLE_PROJECT_PLUGINS`), and pip entry points; `register(ctx)` subscribes to the
   hook set, registers tools (`ctx.register_tool`) and CLI subcommands
   (`ctx.register_cli_command`); the config/state bridge gives namespace-jailed settings and
   atomic profile-scoped state (plugins/AGENTS.md; rfc/plugin-config-state-bridge.md).
   Mapping for the repo's guard cores:
   - completion-evidence stop → `pre_verify` (native block/continue semantics — best fit)
   - dispatch audit + dispatch preflight → `pre_tool_call` (audit/classify the command
     before execution)
   - git preflight advisory, check-git-hooks.sh, check-dist-staleness.sh → `on_session_start`
     (advisory) and/or `pre_tool_call` for git/file tools
   - session start/stop context → `on_session_start` / `on_session_end`
   - spec gate (write classification) → `pre_tool_call` on file tools, or prompt-level
     preamble (already the repo's pattern)
   [SOURCE: plugins/AGENTS.md discovery table; hermes_cli/plugins.py:107-135]

4. **The plugin bridge shells out to the existing guard cores rather than re-implementing
   them.** Hermes plugin callbacks are Python; the repo's guard cores are `.mjs`/`.sh`
   (e.g. `.opencode/hooks/dispatch/lib/dispatch-audit.mjs`). A thin plugin can exec the
   existing scripts with the event payload passed via env/stdin — same containment pattern
   as the `.pi/extensions` symlinked `.ts` hooks. This keeps one implementation per guard.
   Cost: `HERMES_ENABLE_PROJECT_PLUGINS=1` must be set on every dispatch (a fan-out env
   pass-through item, angle 8).
   [SOURCE: plugins/AGENTS.md; .opencode/hooks/dispatch/lib/dispatch-audit.mjs]

5. **Agent Plugins v1 is a third option but the least settled.** `agent_plugins.py` reads
   portable directory packages (`plugin.json` + `skills/` + MCP servers; stdio and remote
   transports, SSE rejected) with strict path scoping; MCP discovery from such packages is
   wired in plugins.py:1402. It is the most portable format (agentskills ecosystem) but adds
   a new manifest schema, an install/discovery surface, and its hook surface is not
   documented as equivalent to the native `VALID_HOOKS` set. Verdict: defer; revisit only if
   cross-agent plugin portability becomes a goal.
   [SOURCE: hermes_cli/agent_plugins.py:87-90, 257-316, 351+; plugins.py:1402-1403]

6. **Recommended bridge: one native project-local plugin (`./.hermes/plugins/repo-guards`)
   in the first integration phase.** Smaller than shell hooks (repo-carriable, no operator
   allowlist, no user-config edits) and safer than Agent Plugins v1 (native hook contract,
   existing compat guarantees). Shell hooks remain the fallback for operator-only machines
   that want the guards without the repo. Live baseline: `hermes plugins list` shows only
   bundled plugins + orca-status; nothing project-local today.
   [SOURCE: synthesis of 1-5; live `hermes plugins list`, 2026-09-14]

## Questions Answered

- Q6 (hooks/plugins): answered. Events/payloads/consent pinned; hooks are user-config-only;
  the smaller, safer move is a project-local native plugin (opt-in env var) shelling out to
  the existing guard cores; Agent Plugins v1 deferred.

## Questions Remaining

- Q7-Q10 (see strategy).

## Assessment

- newInfoRatio: 0.75 — the hook/plugin split, project-local plugin discovery (env-gated),
  the pre_verify mapping for completion-evidence, and the Agent Plugins v1 shape are new.
- Confidence: high (source + live commands).

## Reflection

- What worked: mapping each repo guard core to a specific Hermes hook event made the bridge
  concrete; the `pre_verify` block semantics is the exact match for completion-evidence.
- What failed / ruled out: shell hooks as the repo carrier (user-config-only); Agent Plugins
  v1 as the first move (new format, unsettled hook surface).
- Ruled-out direction: re-implementing guard cores inside a Hermes plugin — shell out to the
  existing .mjs/.sh instead.

## Recommended Next Focus

Angle 7: MCP (`tools/mcp_tool*.py`, `hermes_cli/` MCP commands, `hermes tools --help`; config
location, stdio vs remote transports, OAuth; repo native servers + code-mode manual over
stdio; deny-by-default `server:tool` enforcement; `hermes mcp serve` inverse integration).
