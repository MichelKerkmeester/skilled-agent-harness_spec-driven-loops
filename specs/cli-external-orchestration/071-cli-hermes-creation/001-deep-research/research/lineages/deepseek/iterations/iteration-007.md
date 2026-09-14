# Iteration 7: Angle 7 — MCP

## Focus

How MCP servers are configured in Hermes (location, stdio vs remote transports, OAuth),
whether the repo's native servers and the code-mode manual can connect over stdio, the
deny-by-default enforcement point (`hermes tools disable`, `server:tool` notation), and
whether `hermes mcp serve` (Hermes as an MCP server) is a useful inverse integration.

## Actions Taken

- Ran `hermes mcp --help`, `hermes mcp add --help`, `hermes mcp serve --help`, `hermes tools
  --help`, `hermes mcp list` (all exit 0, live 2026-09-14).
- Read `hermes_cli/mcp_config.py` lines 55-141: `mcp_servers:` dict in config.yaml,
  add/remove/replace helpers, Bearer token persistence to `.env`.
- Read `tools/mcp_tool_config.py` lines 1-62 and 289-311: stdio launch env
  (`${VAR}`/Cursor-style substitution), filtered env for stdio subprocesses (no secrets),
  `_filter_suspicious_mcp_servers` exfiltration guard.
- Read `hermes_cli/mcp_security.py` lines 59-143: `validate_mcp_server_entry`,
  `is_mcp_server_entry_suspicious`.
- Read `hermes_cli/tools_config_mcp.py` lines 1-142: `hermes tools enable|disable|list`
  checklists with `server:tool` notation.
- Read the repo's MCP registrations: `.claude/mcp.json` and `opencode.json` (`code_mode`
  stdio server: `node .opencode/bin/mcp-code-mode-launcher.cjs`, env
  `UTCP_CONFIG_FILE=.utcp_config.json`); `.utcp_config.json` (code-mode manuals,
  in-memory tool repository).

## Findings

1. **MCP servers are user-config-only, like hooks and trust.** `mcp_servers:` lives in
   `~/.hermes/config.yaml` (mcp_config.py:55-141); `hermes mcp add` mutates that file. The
   repo cannot carry MCP config; a future phase must document the operator step (or use a
   profile, which is also user-level). Live: `hermes mcp list` → no servers configured.
   [SOURCE: hermes_cli/mcp_config.py:55-141; live `hermes mcp list`, 2026-09-14]

2. **Both transports are supported with the exact shapes the repo's servers need.** `hermes
   mcp add <name> --url <endpoint>` (remote HTTP/SSE, `--auth oauth|header`) or
   `--command <cmd> --args ... --env KEY=VALUE` (stdio). The repo's `code_mode` server is a
   stdio server (`node .opencode/bin/mcp-code-mode-launcher.cjs` with
   `UTCP_CONFIG_FILE=.utcp_config.json`) — the Hermes add shape fits byte-for-byte:
   `hermes mcp add code_mode --command node --args .opencode/bin/mcp-code-mode-launcher.cjs
   --env UTCP_CONFIG_FILE=.utcp_config.json` (`documented, unconfirmed` until a live add,
   which is an operator mutation). Env substitution is `${VAR}`-style and stdio subprocess
   env is filtered to keep secrets out (mcp_tool_config.py:1-62).
   [SOURCE: live `hermes mcp add --help`; tools/mcp_tool_config.py:1-62;
   .claude/mcp.json + opencode.json]

3. **Deny-by-default is per-tool via `server:tool` notation.** `hermes tools list` shows all
   tools with enabled/disabled status; `hermes tools disable <server>:<tool>` disables one
   MCP tool, `hermes tools disable <server>` (or `enable`) toggles whole servers; per-server
   tool checklists are stored in config (tools_config_mcp.py:1-142). This is the same
   notational shape the six runtimes use (e.g. `code_mode:*`), so the cli-hermes packet can
   carry an equivalent "disabled-by-default except roster" policy — but unlike cli-devin's
   repo-carried `mcp_config.json`, the enforcement state is operator-level config.
   [SOURCE: hermes_cli/tools_config_mcp.py:88-142; live `hermes tools --help`]

4. **Security hardening exists before any spawn.** `validate_mcp_server_entry` and
   `is_mcp_server_entry_suspicious` reject exfiltration-shaped configs, and
   `_filter_suspicious_mcp_servers` drops them before stdio spawn (mcp_security.py:59-143;
   mcp_tool_config.py:289-311). Remote servers support OAuth (device flow, `hermes mcp
   login|reauth`); Bearer tokens persist to `.env`, never config.yaml
   (mcp_config.py:178-238).
   [SOURCE: hermes_cli/mcp_security.py:59-143; hermes_cli/mcp_config.py:178-238]

5. **`hermes mcp serve` is a real inverse integration but niche for this repo.** Hermes can
   run as an MCP server exposing conversations to other agents (`hermes mcp serve --help`).
   For cli-external-orchestration, the interesting direction is the other six runtimes
   consuming Hermes as an MCP server — none of the six currently treat a peer runtime as an
   MCP endpoint, and the code-mode manual already covers that role for this repo. Verdict:
   not useful in the integration; note it as an option if a cross-runtime MCP topology ever
   materializes.
   [SOURCE: live `hermes mcp serve --help`, 2026-09-14]

6. **Comparison with the six runtimes' MCP surfaces.** cli-opencode (opencode.json `mcp`
   map), cli-claude-code (`.claude/mcp.json`), cli-codex (`.codex/config.toml`), cli-cursor
   (`.cursor/mcp.json`, `mcp enable` trust mutation), cli-pi (`.pi/mcp.json`), cli-devin
   (`.devin/mcp_config.json`) all carry MCP config IN THE REPO. Hermes is the only one where
   the config is user-level — the repo's integration surface for MCP is therefore just the
   documented operator step + the `server:tool` policy in the skill packet. This is a
   structural difference from the six and belongs in the cli-hermes skill packet as a
   hard-rule candidate (`mcp-config-operator-required`).
   [SOURCE: resource-map §Config; hermes_cli/mcp_config.py:55-141]

## Questions Answered

- Q7 (MCP): answered. Config user-level only; stdio and remote transports fit the repo's
  `code_mode` server shape; deny-by-default via `server:tool`; security filters pre-spawn;
  `mcp serve` inverse not useful now; the user-level config split is a structural difference
  from the six runtimes.

## Questions Remaining

- Q8-Q10 (see strategy).

## Assessment

- newInfoRatio: 0.70 — the user-level config split, the exact add-shape fit for code_mode,
  and the pre-spawn security filters are new; the live add is `documented, unconfirmed`.
- Confidence: high (live help + source).

## Reflection

- What worked: checking `mcp add --help` before judging fit — the `--env` flag closes the
  loop on the repo's `UTCP_CONFIG_FILE`-env server.
- What failed / ruled out: `hermes mcp serve` as an integration goal (no consumer topology);
  repo-carried MCP config (user-level only).
- Ruled-out direction: expecting the repo to carry MCP enforcement state like the six
  runtimes do.

## Recommended Next Focus

Angle 8: deep-loop fan-out fitness (`executor-config.ts`, `fanout-run.cjs` for what the six
kinds provide; `hermes_cli/_parser.py`, `agent/`, `tools/toolsets.py`; headless write flags,
`--yolo` semantics, per-iteration timeout, stdin closed, HERMES_HOME/profile isolation, env
pass-through, self-invocation detection, nested-hermes blocking, trustworthy exit codes,
writes outside the repo, web search forcing).
