---
title: "Cursor CLI - Complete Command Reference"
description: "Comprehensive reference for Cursor CLI flags, commands, models, configuration, authentication, and troubleshooting."
trigger_phrases:
  - "cursor cli flags"
  - "cursor-agent command reference"
  - "cursor approval modes"
  - "cursor model selection"
  - "cursor cli config"
  - "cursor session resume"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Cursor CLI - Complete Command Reference

Comprehensive reference for all Cursor CLI commands, flags, models, configuration, and troubleshooting.

---

## 1. OVERVIEW

### Core Principle

Cursor CLI (`cursor-agent`) is a terminal-based AI coding agent from Cursor, distinct from the Cursor editor but sharing its entire config surface. It defaults to the `auto` model (an intelligent router) and dispatches non-interactively via `-p`. Unlike sibling CLIs, Cursor has no `--reasoning-effort` flag and no `model[effort=...]` bracket support — effort tiers are baked into the model id itself.

### Purpose

Provide a comprehensive, single-source reference for all Cursor CLI commands, flags, models, configuration options, and troubleshooting guidance.

### When to Use

- Setting up or configuring Cursor CLI
- Looking up command-line flags or subcommands
- Troubleshooting authentication or dispatch issues
- Selecting the right model or execution mode for a task
- Understanding the shared editor-config surface before a dispatch

### Key Sources

| Source | URL |
|--------|-----|
| **Docs** | https://cursor.com/docs/cli/overview |
| **Install** | https://cursor.com/install |
| **Account** | https://cursor.com |

---

## 2. INSTALLATION

| Method | Command | Notes |
|--------|---------|-------|
| **Install script (macOS/Linux)** | `curl https://cursor.com/install -fsS \| bash` | Downloads the platform-matched binary; installs to `~/.local/bin` |
| **Install script (Windows)** | `irm 'https://cursor.com/install?win32=true' \| iex` | PowerShell installer |
| **Verify** | `cursor-agent --version` | Prints the installed build (e.g. `2026.07.23-e383d2b`) |

**Binary naming**: the canonical on-PATH binary is `cursor-agent`; `agent` is an alias symlink to the same binary. Scripts and process-ancestry checks must probe `command -v cursor-agent`, never assume a bare `agent` command.

**Platform support:**

| Platform | Status |
|----------|--------|
| macOS (arm64/x86_64) | Full support |
| Linux | Full support |
| Windows | Supported via the win32 install script |

After installation, run `cursor-agent` for the interactive mode or `cursor-agent -p "prompt"` for non-interactive use.

---

## 3. AUTHENTICATION

cli-cursor authenticates through **Cursor account OAuth** — `cursor-agent login` (browser flow; `NO_OPEN_BROWSER=1` disables automatic browser opening for headless hosts).

**OAuth login/logout/status:**

```bash
# Authenticate via Cursor account (opens browser)
cursor-agent login

# View authentication status (text output, not a reliable exit code)
cursor-agent about

# Log out and clear stored credentials
cursor-agent logout
```

**Headless/CI auth:** `CURSOR_API_KEY` env var, `CURSOR_AUTH_TOKEN` env var, `--api-key <key>`, or `--auth-token <token>`. Endpoint override via `--endpoint`/`CURSOR_API_ENDPOINT` (default `https://api2.cursor.sh`); custom headers via `-H`/`--header`.

**Auth-state caveat**: `cursor-agent status` can print a misleadingly cached "Login successful" even when the account is not actually authenticated. `cursor-agent about`'s "User Email" field (or a fail-closed `-p` dispatch's output text) is the reliable check — never trust `status` alone, and never trust the dispatch exit code (always `0`, even on auth failure).

---

## 4. COMMAND-LINE FLAGS

### Essential Flags

| Flag | Values | Description |
|------|--------|-------------|
| `-p` / `--print` | (none) | Non-interactive/print mode — required for orchestrated dispatch |
| `--output-format` | `text`, `json`, `stream-json` | `text` (default, final-answer-only), `json` (structured, includes `session_id`), `stream-json` (message-level progress) |
| `--stream-partial-output` | (none) | Pairs with `stream-json` for text deltas |
| `--model` | model id or `auto` | Model to use — see §5 |
| `--mode` | `plan`, `ask` | `plan` = read-only planning; `ask` = read-only Q&A; omit for the default read-write agent mode (`--plan` is a shorthand for `--mode plan`) |
| `--force` / `-f` / `--yolo` | (none) | "Run Everything" — auto-approves unless explicitly denied |
| `--auto-review` | (none) | "Smart Auto" — auto-runs safe tool calls, prompts for the rest |
| `--sandbox` | `enabled`, `disabled` | Toggles the OS-level sandbox (overrides config) |
| `--trust` | (none) | Trusts the workspace without prompting for workspace-trust confirmation |
| `--approve-mcps` | (none) | Auto-approves all configured MCP servers |

### Session & Continuity Flags

| Flag | Description |
|------|-------------|
| `--resume [chatId]` | Resume a prior chat/session by id |
| `--continue` | Continue the most recent session |
| `--workspace <path>` | Set the workspace root explicitly |
| `--add-dir <path>` | Add an additional accessible directory |
| `--plugin-dir <path>` | Add a plugin search directory |

### Native Worktree Flags (unique surface — see `cursor-tools.md`)

| Flag | Description |
|------|-------------|
| `-w` / `--worktree [name]` | Start in an isolated git worktree at `~/.cursor/worktrees/<repo>/<name>` |
| `--worktree-base <branch>` | Set the base ref for the new worktree |
| `--skip-worktree-setup` | Skip setup scripts declared in `.cursor/worktrees.json` |

### Auth Flags

| Flag | Description |
|------|-------------|
| `--api-key <key>` | Headless API-key auth |
| `--auth-token <token>` | Headless token auth |
| `-H` / `--header <k:v>` | Custom request header |
| `-e` / `--endpoint <url>` | Override the API endpoint |

### Usage Examples

```bash
# Non-interactive default dispatch
cursor-agent -p "Refactor utils.ts to use async/await" --model auto --output-format text

# With explicit approval + sandbox
cursor-agent -p "Add error handling to auth.ts" --model auto --auto-review --sandbox enabled

# Read-only planning
cursor-agent -p "Plan a migration to the new API" --mode plan --model auto

# Read-only Q&A
cursor-agent -p "Explain how the retry logic works" --mode ask --model auto

# Full unattended run
cursor-agent -p "Run the test suite and fix failures" --force --sandbox disabled --model auto

# JSON output (structured, includes session_id)
cursor-agent -p "Summarize this module" --output-format json --model auto
```

---

## 5. MODEL SELECTION

### Supported Models

`auto` (intelligent router) is the CLI default. Live enumeration via `cursor-agent --list-models` (requires authentication) returns dozens of ids; effort tiers are suffixes on the id (e.g. `-low`, `-medium`, `-high`, `-xhigh`, `-max`), not a separate flag.

| Model family | Example ids | Notes |
|-------|----|-------|
| **Auto** ★ default | `auto` | Cursor's own router picks the best model for the task |
| **Composer** (Cursor-native) | `composer-2.5`, `composer-2.5-fast` | The direct analog to a provider's own house model — Cursor-exclusive |
| **GPT family (via Cursor)** | `gpt-5.2`, `gpt-5.2-high`, `gpt-5.4-high`, `gpt-5.6-sol-xhigh`, etc. | Hosted OpenAI models dispatched through Cursor |
| **Claude family (via Cursor)** | `claude-opus-4-8-high`, `claude-sonnet-5-thinking-high`, etc. | Hosted Anthropic models dispatched through Cursor |
| **Gemini / Grok / GLM / Kimi (via Cursor)** | `gemini-3.1-pro`, `cursor-grok-4.5-high`, `glm-5.2-max`, `kimi-k2.7-code` | Additional hosted providers dispatched through Cursor |

### Reasoning Effort Configuration

**There is no `--reasoning-effort` flag, and no `model[effort=...]` parameterized bracket support.** Live-tested against two real model ids (`gpt-5.2[effort=high]` and the exact bracket example from Cursor's own `--help` text, `claude-opus-4-8[context=1m,effort=high,fast=false]`) — both were rejected outright with `Cannot use this model: <literal string>`. Effort is selected by choosing the exact enumerated id with the desired tier suffix (e.g. `gpt-5.2-high` instead of `gpt-5.2` + a bracket).

### Selection Strategy

| Task Type | Model choice | Rationale |
|-----------|-----------------|-----------|
| General delegation | `auto` (default) | Cursor's router balances speed/cost/quality automatically |
| Task specifically wants Cursor's own model | `composer-2.5` / `composer-2.5-fast` | Cursor-exclusive, no hosted-provider equivalent |
| Task wants a specific provider at a specific tier | An exact enumerated id (e.g. `gpt-5.2-high`) | Effort is baked into the id; query `--list-models` for the current roster |
| Trivial lookups | `auto` | The router already selects an appropriately fast model for simple tasks |

Always specify `--model` explicitly in scripts for predictability; omitting it defaults to `auto`, which is fine for general delegation but not reproducible across runs if Cursor's routing logic changes.

---

## 6. OUTPUT HANDLING

### Print Mode Output

`cursor-agent -p` writes its final answer to stdout in `text` mode (default). Use `--output-format json` for structured output including `session_id`, `usage`, and `request_id`.

```bash
# Capture to file
cursor-agent -p "Generate a TypeScript interface for the User model" \
  --model auto --output-format text > /tmp/user-interface.ts

# Capture structured JSON (includes session_id)
cursor-agent -p "List all exported functions in src/" \
  --model auto --output-format json > /tmp/result.json
jq -r '.result' /tmp/result.json

# Redirect stderr separately
cursor-agent -p "Analyze auth flow" --model auto > /tmp/analysis.txt 2>/tmp/errors.txt
```

### Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Process completed — **NOT proof of success or authentication**; always inspect output text |
| Non-zero | A CLI-level failure (e.g. invalid flag) — this is the ONE case exit code is meaningful |

---

## 7. WORKSPACE TRUST

Cursor Agent can execute code and access files in the target directory. On an untrusted directory, a dispatch fails with a "Workspace Trust Required" error unless `--trust`, `--yolo`, or `-f` is passed. For orchestrated repo-scoped dispatches inside a repo the operator already trusts, pass `--trust` (or rely on `--force` already implying trust).

---

## 8. RULES SOURCES

Cursor CLI reads project rules from multiple sources, applied automatically: `.cursor/rules` (directory), `AGENTS.md` (project root), `CLAUDE.md` (project root), and legacy `.cursorrules`. A dispatched session in this repo picks up `AGENTS.md` at the repo root automatically — relevant when composing a delegation prompt, since the delegated session already has this project's governing rules loaded.

---

## 9. MCP INTEGRATION

`cursor-agent mcp` subcommands: `login <id>`, `list`, `list-tools <id>`, `enable <id>`, `disable <id>`. Config file: `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (user) — "the CLI uses the same configuration as the editor". Precedence: project → global → nested. `--approve-mcps` auto-approves all configured servers for a dispatch. Cursor CLI is an MCP *client* only — it discovers and uses configured servers; there is no documented mode of it acting as an MCP server itself.

---

## 10. SUBCOMMANDS

| Subcommand | Description |
|------------|-------------|
| `cursor-agent -p "<prompt>"` | Non-interactive execution — runs a single prompt and exits |
| `cursor-agent login` / `logout` | Authenticate / clear credentials via Cursor account OAuth |
| `cursor-agent status` / `whoami` | Session/account status (caution: `status` can show stale cached state) |
| `cursor-agent about` | Reliable account/auth info, including CLI version and login email |
| `cursor-agent models` | List available models (requires authentication) |
| `cursor-agent mcp <subcommand>` | Manage MCP server connections |
| `cursor-agent plugin marketplace` | Manage plugins and plugin marketplaces |
| `cursor-agent worker` | Run a private cloud worker (see `cursor-tools.md`) |
| `cursor-agent install-shell-integration` / `uninstall-shell-integration` | Manage shell integration |

---

## 11. TROUBLESHOOTING

| Problem | Cause | Solution |
|---------|-------|----------|
| Output contains `Error: Authentication required` (exit `0`) | Not authenticated | Run `cursor-agent login`, or set `CURSOR_API_KEY`/`CURSOR_AUTH_TOKEN` |
| `cursor-agent status` says "Login successful" but `about` says "Not logged in" | `status` uses a stale cache | Trust `about`'s "User Email" field, not `status` |
| `Workspace Trust Required` | Directory not yet trusted | Pass `--trust`, `--yolo`, or `-f` |
| `Cannot use this model: <id>[...]` | Parameterized model bracket, not supported | Use an exact enumerated id from `--list-models` |
| Task ran but no files changed | `--mode plan`/`--mode ask` used, or neither `--auto-review` nor `--force` was passed | Use the default agent mode with an approval flag for edit tasks |
| `command not found: cursor-agent` | Not installed or PATH not updated | `curl https://cursor.com/install -fsS \| bash`; verify with `which cursor-agent` |
| Unexpected hook fires, or dispatch behaves per operator's editor config | Shared `.cursor/`/`~/.cursor/` config surface | See `shared-editor-config.md` for the isolation implications |

---

## 12. ENVIRONMENT VARIABLES

| Variable | Purpose |
|----------|---------|
| `CURSOR_API_KEY` | Headless API-key authentication |
| `CURSOR_AUTH_TOKEN` | Headless token authentication |
| `CURSOR_API_ENDPOINT` | Override the default API endpoint (`https://api2.cursor.sh`) |
| `CURSOR_AGENT` | Confirmed live: set to `1` unconditionally whenever the current process runs under `cursor-agent` — the primary self-invocation-guard signal |
| `CURSOR_CONVERSATION_ID` | Confirmed live: the active session/chat id, matching `--output-format json`'s `session_id` field |
| `CURSOR_INVOKED_AS` | Confirmed live: how the binary was invoked (`cursor-agent`) |
| `NO_OPEN_BROWSER` | Disables automatic browser opening during `cursor-agent login` |
