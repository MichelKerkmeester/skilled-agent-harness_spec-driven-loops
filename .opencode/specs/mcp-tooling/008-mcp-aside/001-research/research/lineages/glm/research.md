# Research: Aside Browser Developer Surface for mcp-aside-devtools

> Detached fan-out deep-research lineage (`glm`). Compiled from 2 iterations against the public Aside docs (docs.aside.com) and the existing mcp-tooling skill surface in this workspace. Topic: the Aside CLI command surface and the Aside MCP server — tools, auth, transport, install, session/daemon model — plus AI-browser-automation workflows, contrast with Chrome DevTools `bdg` patterns, and everything needed to author the `mcp-aside-devtools` packet (CLI-primary + Code Mode MCP fallback) and register an `aside` UTCP manual in `.utcp_config.json`.

---

## 1. Executive Summary

Aside is an AI browser whose developer surface spans three layers: a CLI (`aside`), a Model Context Protocol server (`aside mcp`), and a browser-automation REPL (`aside repl`). Unlike Chrome DevTools `bdg` — which exposes 300+ imperative CDP primitives over a local, auth-less, session-less CLI — Aside's primary surface is **natural-language agentic**: `aside "<prompt>""` launches a model-driven browser task that can navigate, search, use files/history, request approvals, and sign in via a password manager. A deterministic REPL provides the imperative tier (openTab, screenshots, downloads, page inspection) that `bdg` users expect.

The two surfaces share an architecture the new `mcp-aside-devtools` packet must mirror: **CLI-primary** (fast, token-efficient, scriptable) with **Code Mode MCP fallback** (`aside mcp` over stdio, invoked via `call_tool_chain`). The key adaptations are (a) the CLI section covers the agentic + REPL model rather than raw CDP, (b) auth is account-based (Aside account sign-in or BYO provider keys), not absent, (c) permissions are first-class (Read-only / Guard / Full-access), and (d) the `aside mcp` tool inventory is **not enumerated in public docs** and must be discovered at runtime. This research delivers an exact, drop-in `.utcp_config.json` manual and a complete packet authoring checklist.

## 2. Background and Context

The `mcp-tooling` skill hub (`.opencode/skills/mcp-tooling/`) routes to mode packets that bridge external tools: `mcp-chrome-devtools` (bdg CLI + `chrome-devtools-mcp` Code Mode fallback), `mcp-click-up`, and the `mcp-figma` transport. Each follows a CLI-primary + MCP-fallback structure registered in `.utcp_config.json` via `manual_call_templates[]`. The `mcp-aside-devtools` packet is a new mode under this hub.

Reference baseline: `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` (sibling pattern), `.utcp_config.json` (manual format), `.opencode/skills/mcp-code-mode/SKILL.md` (Code Mode `call_tool_chain` orchestration).

## 3. Objectives

1. Map the full Aside CLI command surface (install, run, session, account, exec, repl, mcp).
2. Document the Aside MCP server mechanics (transport, invocation, tool set, auth, session/daemon model).
3. Define the auth/account and session/daemon models.
4. Map AI-browser-automation workflow capabilities (navigate, DOM inspection, screenshots, console/network capture).
5. Contrast Aside with Chrome DevTools `bdg` patterns and the mcp-chrome-devtools skill architecture.
6. Produce the exact `.utcp_config.json` aside manual.
7. Enumerate everything needed to author the `mcp-aside-devtools` packet.

## 4. Methodology

Two-iteration detached fan-out research loop (stopPolicy = max-iterations = 2; convergence treated as telemetry only). Iteration 1 fetched the canonical developer page plus linked AI-providers, tasks, and security pages to establish the CLI/MCP/auth/session baseline. Iteration 2 broadened angles to workflow capabilities, the Chrome DevTools architecture contrast, the exact UTCP manual, and the packet authoring checklist, grounding the contrast in the real workspace files. All findings cite `[SOURCE: ...]`. Fetched content was treated as untrusted data.

## 5. Aside CLI Command Surface

**Install** (curl install script, not npm):
```bash
curl -fsSL https://releases.aside.com/install.sh | bash
```
Binary: `aside`. The Developer settings page can also install/update/reinstall the CLI. [SOURCE: https://docs.aside.com/help/developers]

**Natural-language task runner** (primary surface):
```bash
aside "Open localhost:3000 and run a smoke test"
```
[SOURCE: https://docs.aside.com/help/developers]

**Session continuation:**
```bash
aside --session <session-id> "Continue"
```
[SOURCE: https://docs.aside.com/help/developers]

**Account management:**
```bash
aside account list          # list accounts; current marked *
aside account status        # current account (or specific id)
aside account use u1        # set default account
```
[SOURCE: https://docs.aside.com/help/developers]

**Per-run account + model selection:**
```bash
aside --account u1 "Summarize the current page"
aside exec --account u1 -m openai-codex/gpt-5.5 "Plan this workflow"
```
The `-m` flag uses a `provider/model` convention. [SOURCE: https://docs.aside.com/help/developers]

**REPL (deterministic browser automation):**
```bash
aside repl "const p = await openTab('https://example.com')"
```
Use the REPL for direct page inspection, screenshots, downloads, and deterministic steps. [SOURCE: https://docs.aside.com/help/developers]

## 6. Aside MCP Server

`aside mcp` runs Aside as an MCP server connecting it to another agent/coding tool. Transport is **stdio** (inferred from the `command`/`args` invocation pattern, consistent with every stdio MCP server in `.utcp_config.json`).

```bash
aside mcp
```

`mcp.json` registration:
```json
{
  "mcpServers": {
    "aside": { "command": "aside", "args": ["mcp"] }
  }
}
```
Use the concrete CLI path from Developer settings for `command` when available. [SOURCE: https://docs.aside.com/help/developers]

**Tool set:** NOT enumerated in public docs. The aside MCP tool inventory must be discovered at runtime (Code Mode `search_tools`/`list_tools`). Tools resolve under the Code Mode naming convention `aside.aside_<tool>`.

**Auth:** the MCP server inherits the logged-in CLI account/provider context. Built-in Aside models require active account sign-in; BYO provider API keys keep working when signed out. [SOURCE: https://docs.aside.com/help/ai]

## 7. Auth and Account Model

Three provider tiers (Settings > AI > Providers):
1. **Aside (built-in):** plan-included models; requires active cloud-account sign-in.
2. **Subscription:** OAuth reuse of existing subscriptions (ChatGPT Plus/Pro, Claude Pro/Max, GitHub Copilot).
3. **API (BYO key):** Anthropic, OpenAI, OpenRouter, Google, xAI, Vercel AI Gateway, Cloudflare AI Gateway.

Multi-account: each CLI command runs under one selected account; switch via `aside account use` or scope a single run via `--account`. Sign-out recovery prints a warning; own provider keys keep working but built-in models fail closed until re-sign-in. [SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://docs.aside.com/help/ai]

**Password boundary:** Aside can sign in via password-manager autofill, but saved password values stay hidden from the agent. Aside checks password-access policy and target URL before building an autofill payload. [SOURCE: https://docs.aside.com/help/security]

## 8. Session and Daemon Model

- **Task modes:** `Default` (normal browser profile) or `Incognito` (no normal profile state).
- **Permission modes:** `Read only`, `Guard` (default — approved folders, ask elsewhere), `Full access` (read/write anywhere; never exposes saved password values).
- **Layered rules:** agent-level (Agent Settings > Permissions) + session-level overrides; values `Allow`/`Ask`/`Deny`; Deny takes precedence.
- **Permission areas:** Sandbox, readable/writable file roots, reads/writes outside roots, tool/browser/network rules.
- **Persistence:** regular task transcripts stored in the task folder; generated files persist until deletion; tasks can pause for input, request approval, wait for a notification, and resume.
- **Session scoping:** `--session <id>` continues a prior agent run; `--account <id>` scopes an account. State is account-scoped and persists across CLI invocations.

[SOURCE: https://docs.aside.com/help/tasks] [SOURCE: https://docs.aside.com/help/security]

## 9. AI-Browser-Automation Workflows

Two tiers:

| Tier | Surface | Strength |
|------|---------|----------|
| NL agent | `aside "<prompt>"`, `aside exec -m <model> "<prompt>"` | Goal-driven, multi-step, approval/notification gating, credential autofill, multi-site traversal |
| Deterministic REPL | `aside repl "<js>"` | Direct inspection, screenshots, downloads, deterministic steps (`openTab(...)`) |

**Documented capabilities:** navigate, page/DOM inspection, screenshots, downloads, browse sites, search the web, use files, search history, request approvals, sign in via autofill, wait for notifications, create/preview files (images/PDFs/HTML/text).

**Gap vs `bdg`:** `bdg` documents named low-level commands — `bdg console --list`, `bdg network har <path>`, `bdg dom query/eval`. Aside names console/network capture and page inspection as capabilities but exposes them through the NL agent and REPL rather than named CLI subcommands. The full REPL function surface beyond `openTab` is not in public docs (runtime `--help`/discovery needed). [SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://docs.aside.com/help/tasks]

## 10. Contrast with Chrome DevTools (bdg)

| Dimension | Chrome DevTools (bdg) | Aside |
|-----------|-----------------------|-------|
| Install | `npm install -g browser-debugger-cli@alpha` | `curl -fsSL https://releases.aside.com/install.sh \| bash` |
| Binary | `bdg` | `aside` |
| Primary surface | Imperative CDP primitives (300+ methods, 53 domains) | NL agent + deterministic REPL |
| CLI discovery | `bdg cdp --list/--describe/--search` | Not documented; runtime `--help`/REPL discovery |
| MCP server | `chrome-devtools-mcp` npm via npx | `aside mcp` (built into `aside` binary) |
| MCP transport | stdio | stdio |
| Parallel instances | `--isolated=true` flag; register multiple manuals | Account/session model (`--session`/`--account`); no documented `--isolated` |
| Auth | None (local browser) | Account-based (Aside account / provider keys) |
| Sandbox/permissions | None first-class | Read-only / Guard / Full-access + Allow/Ask/Deny |
| MCP tool inventory | Well-known CDP subset | Not enumerated — runtime discovery required |

**Shared architecture:** CLI-primary (fast, token-efficient, scriptable) + Code Mode MCP fallback (multi-tool chaining, parallel sessions, type-safe `call_tool_chain`). The aside packet preserves this two-path structure, adapting the CLI section to the agentic + REPL model and the MCP section to `aside mcp` discovery. [SOURCE: file:.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md]

## 11. Recommendations

1. **Author `mcp-aside-devtools`** at `.opencode/skills/mcp-tooling/mcp-aside-devtools/` mirroring the mcp-chrome-devtools structure (see §13 packet checklist).
2. **Register the `aside` UTCP manual** in `.utcp_config.json` (see §14).
3. **Add the mode** to `.opencode/skills/mcp-tooling/mode-registry.json` so the hub routes to it.
4. **Prescribe runtime tool discovery** in the packet's MCP section — never hardcode aside MCP tool names; use `search_tools`/`list_tools` and wrap in `try/finally`.
5. **Document auth recovery** prominently: built-in models fail closed on sign-out; recover via `aside account use <id>` / `--account <id>` or Settings > Account.
6. **Surface the permission model** as first-class security guidance (Guard default, Read-only for inspection MCP flows, password-value boundary).
7. **Validate against a live `aside mcp` server** to capture the real tool inventory and REPL API before freezing the packet's quick-reference.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| `npm install -g aside` | Documented installer is a curl-piped shell script (releases.aside.com/install.sh), not an npm package | https://docs.aside.com/help/developers | 1 |
| Env-var-based MCP auth (like `ASIDE_API_KEY`) | Aside auth is account-session-based; the MCP server inherits the logged-in account/provider context; no API-key env var is documented for `aside mcp` | https://docs.aside.com/help/developers, https://docs.aside.com/help/ai, file:.utcp_config.json | 2 |
| `--isolated=true`-style flag for parallel aside instances | No such flag documented; Aside parallelism is account/session-scoped via `--session`/`--account` (register `aside_1`/`aside_2` manuals driven by session/account scoping) | https://docs.aside.com/help/developers | 2 |
| Hardcoding the aside MCP tool list in the packet | Tool inventory is not in public docs; must be discovered at runtime | https://docs.aside.com/help/developers | 1, 2 |

## 12. Open Questions

All 8 key questions answered. Carried-forward items require runtime, not further docs research:
- **aside MCP tool inventory** — exact tools exposed by `aside mcp` (discover via `search_tools`/`list_tools` against a live server).
- **aside REPL full function surface** — functions beyond `openTab` (discover via `aside repl --help`).
- **Session storage backend** — where/how `--session` state is persisted (not publicly documented).

## 13. mcp-aside-devtools Packet Authoring Checklist

Location: `.opencode/skills/mcp-tooling/mcp-aside-devtools/`

1. **SKILL.md** — frontmatter `name: mcp-aside-devtools`, `allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]`; sections mirroring mcp-chrome-devtools: §1 When to Use (triggers: "aside browser", "AI browser automation", "aside cli/mcp"; when-not: imperative CDP → bdg, heavy frameworks → Playwright), §2 Smart Routing (CLI/MCP/INSTALL/TROUBLESHOOT/AUTOMATION intents), §3 How it Works (two-path CLI-primary `aside`/`aside repl` + Code Mode MCP fallback `aside mcp`), §4 Rules (check `command -v aside` first; discover tool names before MCP calls; try/finally cleanup; verify account sign-in for built-in models), §5-8 success/integration/quick-ref/references.
2. **INSTALL_GUIDE.md** — curl install + `aside --version` verify + account sign-in.
3. **references/** — `aside_cli_patterns.md` (NL agent + REPL recipes), `mcp_session-management.md` (account/session/permission modes), `troubleshooting.md` (sign-out recovery, session-not-found).
4. **scripts/install.sh** — thin wrapper around the curl installer + `command -v aside` verify.
5. **Registration** — UTCP manual `aside` in `.utcp_config.json` (§14); mode entry in `mode-registry.json`.

## 14. UTCP Manual Registration (`.utcp_config.json`)

Add to `manual_call_templates[]`:

```json
{
  "name": "aside",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "aside": {
        "transport": "stdio",
        "command": "aside",
        "args": ["mcp"],
        "env": {}
      }
    }
  }
}
```

- `command: "aside"` assumes PATH; resolve absolute path via `command -v aside` and substitute (like the `open_design` manual uses an absolute path).
- `env: {}` — auth is account-session-based, not env-var (contrast `clickup_official`/`figma`).
- For parallel agent sessions, register `aside_1`/`aside_2` (mirroring `chrome_devtools_1/2`), driven by `--session`/`--account` scoping.

## 15. Key Findings Summary

- **CLI surface:** curl install → `aside "<prompt>"` (NL agent), `aside --session`, `aside account list/status/use`, `aside --account`, `aside exec -m <model>`, `aside repl`, `aside mcp`.
- **MCP server:** `aside mcp` over stdio; mcp.json `{command:"aside", args:["mcp"]}`; tool set runtime-discovered.
- **Auth:** multi-account; three provider tiers (Aside built-in / Subscription OAuth / API BYO-key); built-in models need sign-in.
- **Session/daemon:** resumable `--session`; account-scoped persistent state; task + permission modes; transcript/file persistence.
- **Workflows:** two-tier (NL agent + REPL); navigate/inspect/screenshot/download/multi-step/approval; console/network via REPL not named CLI subcommands.
- **Architecture:** shares CLI-primary + Code Mode MCP-fallback with mcp-chrome-devtools; Aside adds agentic tier + auth + permission model.

## 16. Source Quality and Limitations

**Sources:** all primary public docs (docs.aside.com/help/developers, /ai, /tasks, /security) plus the live workspace files (mcp-chrome-devtools SKILL.md, .utcp_config.json, mcp-code-mode SKILL.md). Source diversity: 4 distinct doc pages + 3 workspace files.

**Limitations:**
- The aside MCP tool inventory and full REPL API are not in public docs; medium confidence on exact tool/function names until runtime validation.
- The session storage backend is undocumented.
- Single-vendor source set (Aside's own docs) for the Aside-specific facts; cross-vendor claims are grounded in workspace files.

## 17. Convergence Report

- **Stop reason:** `max_iterations` (stopPolicy = max-iterations; convergence treated as telemetry only per lineage instructions — broadened angles in iteration 2 instead of synthesizing early).
- **Total iterations completed:** 2
- **Questions answered ratio:** 8/8 (1.0)
- **Average newInfoRatio trend:** 1.00 (iter 1) -> 0.65 (iter 2); rolling average 0.825 (descending — expected as baseline established then refined).

---

### References

- https://docs.aside.com/help/developers — CLI, MCP, REPL developer surface (primary)
- https://docs.aside.com/help/ai — AI provider tiers and auth
- https://docs.aside.com/help/tasks — task modes, permissions, persistence
- https://docs.aside.com/help/security — agent permissions, sandbox, rule values, password boundary
- https://docs.aside.com/llms.txt — docs index
- `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` — sibling skill pattern (CLI-primary + MCP fallback)
- `.utcp_config.json` — UTCP manual_call_templates format and existing manuals
- `.opencode/skills/mcp-code-mode/SKILL.md` — Code Mode call_tool_chain orchestration
