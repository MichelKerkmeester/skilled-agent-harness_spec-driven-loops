# Iteration 1: Aside CLI Command Surface + MCP Server Mechanics

## Focus
Map the full Aside CLI command surface (install, run, session, account, exec, repl, mcp) and the Aside MCP server mechanics (transport, invocation, tool set, auth, session/daemon model) directly from the public developer docs. This is the core evidence the `mcp-aside-devtools` skill packet's CLI-primary path is built on.

## Findings

### F1.1 — CLI installation model (curl install script, not a package manager)
The Aside CLI is installed via a curl-piped shell script, surfaced on the Aside Developer settings page:

```bash
curl -fsSL https://releases.aside.com/install.sh | bash
```

The same Developer settings page can also install, update, or reinstall the CLI directly from the GUI. There is no `npm install -g` path documented (contrast: Chrome DevTools `bdg` ships via `npm install -g browser-debugger-cli@alpha`). The binary is named `aside`.
[SOURCE: https://docs.aside.com/help/developers]

### F1.2 — Core task runner: `aside "<prompt>"` (natural-language browser agent)
Running `aside` with a positional prompt starts a browser agent session from the terminal:

```bash
aside "Open localhost:3000 and run a smoke test"
```

This is the primary invocation: a natural-language task that the agent executes in the browser. This is fundamentally different from `bdg`, which exposes low-level CDP primitives (`bdg <url>`, `bdg dom eval`). Aside's primary surface is **agentic/NL**, not imperative CDP calls.
[SOURCE: https://docs.aside.com/help/developers]

### F1.3 — Session continuation via `--session <id>`
A session can be continued by name/id:

```bash
aside --session <session-id> "Continue"
```

Sessions are resumable artifacts with their own context. The docs model sessions as continuations of prior agent runs, implying a server-side or locally-persisted session store keyed by id. (The exact storage backend is not documented publicly.)
[SOURCE: https://docs.aside.com/help/developers]

### F1.4 — Multi-account model: `aside account` subcommands + `--account` flag
When signed in to more than one Aside account, each CLI command runs under one selected account. The `account` command group inspects/switches/targets accounts:

| Command | Purpose |
|---------|---------|
| `aside account list` | List accounts on device; current marked `*` |
| `aside account status` | Show current account (or a specific id) |
| `aside account use u1` | Set default account for future commands |
| `aside --account u1 "<prompt>"` | Target a single run at a specific account |
| `aside exec --account u1 -m openai-codex/gpt-5.5 "<prompt>"` | Account-scoped exec with model selection |

If the selected account is signed out, the CLI prints a recovery warning. Own provider keys (OpenAI, Anthropic) keep working, but **built-in Aside models require an active sign-in**. Recovery is via Aside Settings > Account or `aside account use <id>` / `--account <id>`.
[SOURCE: https://docs.aside.com/help/developers]

### F1.5 — `aside exec` with explicit model selection (`-m <model>`)
There is a distinct `exec` subcommand that accepts a model flag, enabling per-run model routing:

```bash
aside exec -m openai-codex/gpt-5.5 "Plan this workflow"
```

The model identifier uses a `provider/model` convention (e.g. `openai-codex/gpt-5.5`). This is the mechanism by which the CLI can target BYO-provider models vs built-in Aside models. This is relevant for auth: built-in models need an active Aside account sign-in; API-key providers route through the user's own provider account.
[SOURCE: https://docs.aside.com/help/developers]

### F1.6 — REPL mode: `aside repl` for deterministic browser automation
A dedicated REPL provides direct page inspection, screenshots, downloads, and deterministic browser steps via JS expressions:

```bash
aside repl "const p = await openTab('https://example.com')"
```

The REPL is the deterministic/low-level surface — closest analog to `bdg dom eval` / `bdg dom screenshot`. It exposes functions like `openTab(...)`. Use the REPL when you need **direct page inspection, screenshots, downloads, or deterministic browser steps** (as opposed to the NL agent loop of `aside "<prompt>"`).
[SOURCE: https://docs.aside.com/help/developers]

### F1.7 — MCP server: `aside mcp` over stdio
`aside mcp` runs Aside itself as a Model Context Protocol server, connecting it to another agent or coding tool:

```bash
aside mcp
```

For clients that support `mcp.json`, the registration is:

```json
{
  "mcpServers": {
    "aside": {
      "command": "aside",
      "args": ["mcp"]
    }
  }
}
```

If Developer settings found a concrete CLI path, use that absolute path for `command`. **Transport is stdio** (inferred from the `command`/`args` invocation pattern, identical to every other stdio MCP server in `.utcp_config.json`). Aside can also install browser-automation setup for supported coding tools, and Developer settings describes MCP setup for tools that support `mcp.json`.
[SOURCE: https://docs.aside.com/help/developers]

### F1.8 — Auth model: account-based sign-in + BYO provider API keys (three provider tiers)
From the AI-providers docs, Aside supports three provider tiers, all relevant to CLI/MCP auth:

1. **Aside (built-in):** models included with the Aside plan; requires active cloud-account sign-in.
2. **Subscription:** reuse an existing AI subscription via OAuth (ChatGPT Plus/Pro, Claude Pro/Max, GitHub Copilot).
3. **API (BYO key):** bring your own provider key (Anthropic, OpenAI, OpenRouter, Google, xAI, Vercel AI Gateway, Cloudflare AI Gateway).

Connected providers appear under Settings > AI > Providers. Built-in models are labelled with the current plan; subscription providers as `Subscription`; API-key providers as `API`. **Implication for the MCP server:** `aside mcp` inherits the account/provider context of the logged-in CLI account; built-in models fail closed when the account is signed out, while BYO keys keep working.
[SOURCE: https://docs.aside.com/help/ai]

### F1.9 — Session/daemon model: resumable tasks with permission modes and persistence
From the tasks + security docs, the underlying execution/session model is:

- **Task modes:** `Default` (normal browser profile) or `Incognito` (no normal profile state).
- **Permission modes:** `Read only` (inspect only), `Guard` (approved folders + ask elsewhere — the default), `Full access` (read/write anywhere; does NOT expose saved password values).
- **Permissions are layered:** agent-level rules (Agent Settings > Permissions) + session-level overrides per task. Rule values: `Allow` / `Ask` / `Deny`; Deny takes precedence.
- **Permission areas:** Sandbox, readable/writable file roots, reads/writes outside allowed roots, tool rules, browser rules, network rules.
- **Task persistence:** regular task transcripts are stored in the task folder; generated files remain until the task/folder is deleted. A task can pause for input, request approval, wait for a notification, and resume.

This is a **richer session/permission model than bdg** (which has no first-class account/permission/sandbox GUI-state — bdg sessions are transient CDP targets). The Aside daemon/account state is the part that makes `--session` and `--account` meaningful: state is account-scoped and persists across CLI invocations.
[SOURCE: https://docs.aside.com/help/tasks] [SOURCE: https://docs.aside.com/help/security]

### F1.10 — Password boundary: autofill exists but values stay hidden from the agent
Aside can sign in via its password manager (autofill), but saved password values stay hidden from the AI agent. Aside checks password-access policy and the target URL before building an autofill payload. This is relevant to the skill packet's security guidance: the MCP/CLI agent can perform authenticated navigation without ever surfacing raw credentials to the calling model.
[SOURCE: https://docs.aside.com/help/security]

## Sources Consulted
- [SOURCE: https://docs.aside.com/help/developers] — CLI install, run, session, account, exec, repl, mcp (primary page)
- [SOURCE: https://docs.aside.com/help/ai] — provider tiers, auth (Aside/Subscription/API)
- [SOURCE: https://docs.aside.com/help/tasks] — task modes, permission modes, task persistence
- [SOURCE: https://docs.aside.com/help/security] — agent permissions, sandbox, rule values, password boundary
- [SOURCE: https://docs.aside.com/llms.txt] — docs index used to discover pages
- [SOURCE: file:.utcp_config.json] — existing UTCP manual_call_templates format (context, not fetched this iteration)
- [SOURCE: file:.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md] — sibling skill pattern (context)

## Assessment
- **newInfoRatio: 1.0** — First pass; every finding (CLI surface, MCP server, auth model, session model, REPL) is new to this packet. No prior iterations exist.
- **noveltyJustification:** Iteration 1 establishes the entire baseline CLI/MCP surface from authoritative docs; all 10 findings are net-new.
- **confidence:** High — all findings cite the primary public docs (docs.aside.com). Session/daemon storage backend and exact MCP tool inventory remain partially undocumented (the `aside mcp` tool list is not enumerated in the public docs).

## Reflection
### What Worked
- Direct fetch of the canonical developer page yielded the complete documented CLI command surface in one pass.
- Fetching the linked AI-providers, tasks, and security pages enriched the auth/session/permission model well beyond the developer page alone.

### What Failed
- The public docs do NOT enumerate the specific MCP tools exposed by `aside mcp` (no tool-by-tool manifest). The tool set must be discovered at runtime via Code Mode `call_tool_chain` discovery or `search_tools`/`list_tools`.

### Ruled Out
- `npm install -g` as an install path: the documented installer is a curl script, not npm. (Do not assume an npm package name.)

## Recommended Next Focus
Iteration 2: (a) the concrete AI-browser-automation workflow capability set (navigate, DOM inspection, screenshots, console/network capture) as exposed by the NL agent + REPL; (b) contrast with Chrome DevTools bdg patterns and the mcp-chrome-devtools CLI-primary/MCP-fallback architecture; (c) the exact `.utcp_config.json` aside manual registration and everything needed to author the `mcp-aside-devtools` packet.
