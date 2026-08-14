---
title: "Devin CLI - Complete Command Reference"
description: "Comprehensive reference for Devin CLI flags, commands, models, configuration, authentication, permission modes, and troubleshooting."
trigger_phrases:
  - "devin cli flags"
  - "devin -p command reference"
  - "devin permission modes"
  - "devin model selection"
  - "devin config json"
  - "devin session resume continue"
importance_tier: important
contextType: implementation
version: 1.1.0.0
---

# Devin CLI - Complete Command Reference

Comprehensive reference for all Devin CLI commands, flags, models, configuration, and troubleshooting.

---

## 1. OVERVIEW

### Core Principle

Devin CLI is Cognition's terminal-based AI coding agent — a fast, minimal agent that lives both in the terminal and in the cloud. It fronts a broad multi-model surface; this skill curates five families in scope — DeepSeek, GLM-5.2, GPT-5.6 (Luna Max), Grok (4.5 and 4.6), and SWE-1.7 (full catalog: [providers-and-models.md](./providers-and-models.md)). Devin's native Adaptive model router and its full 37-family roster remain available via `devin models list` but are out of this skill's curated scope. The skill dispatches `swe` (alias → `swe-1-7-lightning`) at `accept-edits` permission mode by default; users can override the model and mode. It provides direct access to multi-model coding, subagent delegation, cloud handoff, MCP integration, and session management — all governed by configurable permission modes.

### Purpose

Provide a comprehensive, single-source reference for all Devin CLI commands, flags, models, configuration options, permission modes, and troubleshooting guidance.

### When to Use

- Setting up or configuring Devin CLI
- Looking up command-line flags, subcommands, or permission modes
- Troubleshooting authentication, sandbox, or session issues
- Configuring subagents via `.devin/agents/[name]/AGENT.md`
- Selecting the right permission mode for a task

### Key Sources

| Source | URL |
|--------|-----|
| **Documentation** | https://docs.devin.ai/cli |
| **Web App** | https://app.devin.ai |
| **Runtime** | Node.js / native binary |
| **Version** | 3000.2.17 |

---

## 2. INSTALLATION

| Method | Command | Notes |
|--------|---------|-------|
| **Interactive setup** | `devin setup` | Wizard for auth + MCP configuration |
| **Direct install** | `curl -fsSL https://devin.ai/install \| bash` | Persistent install |
| **Update** | `devin update` | Check for and install updates |
| **Force update** | `devin update --force` | Re-install even if on latest version |

**Platform support:**

| Platform | Status |
|----------|--------|
| macOS | Full support (sandbox via Seatbelt, works out of the box) |
| Linux | Full support (sandbox requires `bwrap` + `socat`) |
| Windows (WSL) | Use WSL 2; native Windows cannot run the sandbox |

After installation, run `devin` for the interactive REPL or `devin -p -- "prompt"` for non-interactive use.

---

## 3. AUTHENTICATION

cli-devin authenticates through **Devin account OAuth only** — `devin auth login` (browser flow). It does not use an API key.

**OAuth login/logout:**

```bash
# Authenticate via Devin account (opens browser)
devin auth login

# For SSH/remote sessions (skip browser, manually paste token)
devin auth login --force-manual-token-flow

# View authentication status
devin auth status

# Log out and clear stored credentials
devin auth logout
```

**Auth status output:**

```
Logged in (via Devin).

Credentials:
  File:              ~/.local/share/devin/credentials.toml
  API server:        https://server.codeium.com
  Devin webapp:      https://app.devin.ai
  Devin API:         https://api.devin.ai
```

---

## 4. COMMAND-LINE FLAGS

### Essential Flags

| Flag | Short | Values | Description |
|------|-------|--------|-------------|
| `--model` | | `<model-name>` | Model to use — `swe` (default alias → `swe-1-7-lightning`), plus the curated DeepSeek / GLM-5.2 / GPT-5.6 Luna Max / Grok (4.5 and 4.6) / SWE-1.7 families (see §5) |
| `--permission-mode` | | `auto`, `accept-edits`, `smart`, `dangerous` | Permission mode controlling tool auto-approval |
| `--print` | `-p` | `[<prompt>]` | Non-interactive mode: print response and exit |
| `--continue` | `-c` | (none) | Continue the most recent session in the current directory |
| `--resume` | `-r` | `[<session-id>]` | Resume a specific session by ID, or select interactively |
| `--sandbox` | | (none) | Enable OS-level process sandboxing (selects `autonomous` permission mode) |
| `--prompt-file` | | `<file>` | Load the initial prompt from a file |
| `--config` | | `<path>` | Configuration file path (override default `~/.config/devin/config.json`) |
| `--export` | | `[<path>]` | Export conversation to a file after each turn (ATIF format) |
| `--agent-config` | | `<file>` | Declarative agent configuration file (JSON or YAML) |
| `--respect-workspace-trust` | | `true`, `false` | Respect workspace trust settings |

### Prompt Syntax

```bash
# Interactive REPL (no prompt)
devin

# Start REPL with initial prompt (use -- before the prompt)
devin -- your prompt here

# Non-interactive: print mode
devin -p -- "prompt"
devin -p -- "prompt words here"    # Same, using -- separator
```

### Permission Mode Values

| Value | Behavior | Best For |
|-------|----------|----------|
| `auto` | Auto-approves read-only tools; prompts for writes and shell | Review, analysis, research |
| `accept-edits` | Auto-approves workspace edits + read-only; prompts for shell | Code generation, bug fixing, documentation |
| `smart` | Auto-runs actions a fast model judges safe | Trusted workflows with judgment calls |
| `dangerous` | Auto-approves all tools without prompting | Full trust — **requires explicit user approval** |
| `autonomous` | Sandbox-enforced; only available with `--sandbox` | Unattended execution with OS-level limits |

### Usage Examples

```bash
# Interactive REPL
devin

# Non-interactive with model selection
devin -p --model grok-4-6-high -- "Refactor utils.ts to use async/await"

# With permission mode for file edits
devin -p --permission-mode accept-edits -- "Add error handling to auth.ts"

# Continue the most recent session
devin -c

# Resume a specific session
devin -r brisk-otter

# With OS-level sandbox
devin --sandbox -p -- "Run the test suite and fix failures"

# Load prompt from file
devin -p --prompt-file ./prompt.txt

# Export conversation
devin --export out.json -- fix the tests

# Start REPL with initial prompt
devin -- add a login page
```

---

## 5. MODEL SELECTION

### Supported Models

Devin dispatches **`swe`** (alias → `swe-1-7-lightning`) at the **`accept-edits`** permission mode by default. The model is switched per-dispatch with `--model <alias>` (short names resolve to the latest version in that family). There is no headless reasoning-effort flag — depth is expressed through the permission mode (autonomy) and the chosen model, not a reasoning flag; interactive REPL sessions cycle thinking depth with `Alt+T` (macOS: `Opt+T`).

**Full curated roster (DeepSeek / GLM-5.2 / GPT-5.6 Luna Max / Grok (4.5 and 4.6) / SWE-1.7 families) → [providers-and-models.md](./providers-and-models.md).** Devin's native Adaptive router and full 37-family roster are out of this skill's curated scope.

### Setting the Model

```bash
# Command flag
devin --model grok-4-6-high -- refactor this module
devin --model glm-5-2 -- explain this code
devin -p --model swe -- "list all TODO comments"

# Slash command (inside REPL)
/model grok-4-6-high
/model glm-5-2
/model deepseek-v4-pro

# Config file (~/.config/devin/config.json)
{
  "agent": {
    "model": "swe"
  }
}
```

### Selection Strategy

| Task Type | Model | Rationale |
|-----------|-------|-----------|
| Architecture decisions | `grok-4-6-high` | Multi-faceted analysis benefits from deep reasoning |
| Security audits | `grok-4-6-high` | Catches subtle vulnerability patterns |
| Complex planning | `grok-4-6-high` / `glm-5-2-max` | Multi-strategy evaluation benefits from depth |
| Code generation | `glm-5-2` / `glm-5-2-max` | Balanced for most generation tasks |
| Standard code review | `glm-5-2` / `swe-1-7` | Efficient for pattern-based review |
| Implementation | `glm-5-2` / `swe-1-7` | Balanced for translating specs to code |
| Test generation | `swe-1-7` / `glm-5-2` | Solid test structure output |
| Documentation | `glm-5-2` / `swe` | Efficient for structured doc generation |
| Quick edits / lookups | `swe` | Minimize cost and latency (lightning tier) |
| Cost-sensitive work | `swe` / `swe-1-7-medium` | Reasonable intelligence at low cost |

Always specify `--model` explicitly in scripts for predictability; omitting it relies on the CLI default from `~/.config/devin/config.json`, which may differ across machines.

---

## 6. OUTPUT HANDLING

### Print Mode Output

`devin -p` writes its output to stdout. Use shell redirection or command substitution to capture it.

```bash
# Capture to file
devin -p \
  --model swe \
  -- \
  "Generate a TypeScript interface for the User model" > /tmp/user-interface.ts

# Capture to variable
RESULT=$(devin -p --model swe -- "List all exported functions in src/")
echo "$RESULT"

# Pipe to another command
devin -p --model swe -- "Generate SQL schema for users table" | psql -d mydb -f -

# Redirect stderr separately
devin -p --model swe -- "Analyze auth flow" > /tmp/analysis.txt 2>/tmp/errors.txt
```

### Export Format

Use `--export` to save the full conversation in ATIF format:

```bash
# Export to default path
devin --export -- fix the tests

# Export to specific file
devin --export out.json -- fix tests
```

### Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| Non-zero | Error (check stderr for details) |

---

## 7. INTERACTIVE COMMANDS

When running `devin` in interactive (REPL) mode, these slash commands are available:

### Navigation & Control

| Command | Description |
|---------|-------------|
| `/help` | See all available commands |
| `/exit` or `/quit` | Exit the application |
| `/clear` or `/new` | Clear conversation history (start fresh) |

### Mode Switching

| Command | Description |
|---------|-------------|
| `/mode` | Show current mode |
| `/mode <name>` | Switch mode (`normal`, `accept-edits`, `plan`, `bypass`; `autonomous` in sandbox sessions) |
| `/normal` | Switch to Normal mode (default) |
| `/accept-edits` | Switch to Accept Edits mode |
| `/plan` | Switch to Plan mode (read-only planning) |
| `/ask <question>` | Ask a question without making code changes (oneshot) |
| `/bypass` | Switch to Bypass mode (aliases: `/yolo`, `/dangerous`) |

### Model Switching

| Command | Description |
|---------|-------------|
| `/model` | Show model selector |
| `/model <name>` | Switch to a specific model |
| `/fast` | Switch to SWE-1.6 Fast |

### Session Management

| Command | Description |
|---------|-------------|
| `/resume` | Open the interactive session picker |
| `/resume <id>` | Resume session by ID |
| `/continue [id]` | Resume most recent or specific session |
| `/fork [step]` | Fork the current session to a new session |
| `/steps` | List conversation steps (use with `/fork` and `/revert`) |
| `/revert <step>` | Revert file changes from a specific step onwards |
| `/ls [--all]` | List recent sessions (current directory only by default) |
| `/rm-session <id>` | Irreversibly delete a session |
| `/rename-session <title>` | Rename the current session |

### Cloud Sessions

| Command | Description |
|---------|-------------|
| `/handoff [task]` | Hand off the current session to a cloud Devin session |
| `/cloud-sessions [--all]` | Open interactive picker of recent cloud sessions |
| `/cloud-attach <id>` | Attach to a cloud Devin session with full TUI |

### Workspace

| Command | Description |
|---------|-------------|
| `/workspace` | List workspace directories |
| `/add-dir <path>` | Add additional workspace directory |
| `/undo-add-dir <path>` | Remove a workspace directory |

### Automation

| Command | Description |
|---------|-------------|
| `/loop <prompt>` | Run a prompt then auto-review the diff in a loop |

### Utilities

| Command | Description |
|---------|-------------|
| `/context` | Show context window usage |
| `/usage` | Show estimated credit/ACU usage for the session |
| `/compact` | Force conversation compaction |
| `/login` | Authenticate with your account |
| `/logout` | Clear stored credentials and exit |
| `/update [--force]` | Check for and install updates |
| `/hooks` | List all loaded hooks |

---

## 8. SPECIAL INPUT SYNTAX

### File References

Use `@` in the REPL to open autocomplete for local files/directories. Selected files are added as context.

```bash
# In the REPL, type:
@src/utils.ts refactor this to use the repository pattern
```

### Image Input

Paste images from your clipboard with `Ctrl+V`. Attached images appear in the input area and can be managed with `Left/Right` to navigate and `Backspace` to remove.

### Shell Integration

```bash
# Pass git diff as context
git diff HEAD~1 | devin -p --model swe -- "Summarize these changes"

# Combine file content with prompt
cat src/auth.ts | devin -p --model swe -- "Add input validation to all functions"
```

---

## 9. CONFIGURATION FILES

### Directory Structure

```
.devin/
├── config.json          # Project-level CLI configuration
├── config.local.json    # Local override (not shared with team)
├── hooks/               # Lifecycle hooks
└── agents/
    └── [name]/
        └── AGENT.md     # Custom subagent profile
```

### config.json Format

```json
// .devin/config.json or ~/.config/devin/config.json
{
  "agent": {
    "model": "swe"
  },
  "permissions": {
    "allow": [
      "Read(src/**)",
      "Write(src/**)",
      "Exec(git)",
      "Exec(npm run)"
    ],
    "deny": [
      "Exec(rm -rf)",
      "Exec(sudo)"
    ]
  },
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["@company/mcp-server"],
      "transport": "stdio"
    }
  }
}
```

### Permission Syntax

**Scope-based:**

| Matcher | Controls | Example |
|---------|----------|---------|
| `Read(glob)` | File read access | `Read(src/**)` |
| `Write(glob)` | File write access | `Write(src/**)` |
| `Exec(prefix)` | Shell command execution | `Exec(git)`, `Exec(npm run)` |
| `Fetch(pattern)` | HTTP fetch access | `Fetch(https://api.github.com/*)` |

**Tool-based:** `read`, `edit`, `grep`, `glob`, `exec`

**MCP tool-based:** `mcp__server__tool`, `mcp__server__*`, `mcp__*`

### Permission Precedence

1. Organization/team settings (if enterprise) — highest
2. Session-level grants (interactive approvals)
3. Project local config (`.devin/config.local.json`)
4. Project config (`.devin/config.json`)
5. User config (`~/.config/devin/config.json`) — lowest

Deny is checked before ask, and ask is checked before allow. A deny rule always wins.

---

## 10. PERMISSION MODES

Permission modes control what the agent can do without asking for approval. Always choose the least-permissive mode that allows the task to complete.

### Mode Reference

| Mode | Flag | Read-only | Fetch | Bash | File edits | Use Case |
|------|------|-----------|-------|------|------------|----------|
| **Auto** | `auto` | Auto | Prompt | Prompt | Prompt | Analysis, review, exploration |
| **Accept Edits** | `accept-edits` | Auto | Prompt | Prompt | Auto (workspace) | Code generation, refactoring |
| **Smart** | `smart` | Auto | Safe actions | Safe actions | Auto (workspace) | Trusted workflows with judgment |
| **Dangerous** | `dangerous` | Auto | Auto | Auto | Auto | Full trust — **requires explicit approval** |
| **Autonomous** | `autonomous` (+ `--sandbox`) | Auto | Auto (sandbox) | Auto (sandbox) | Prompt (edit/write tools bypass sandbox) | Unattended execution with OS limits |

### Safety Guidance

```bash
# SAFE: Auto mode for analysis
devin -p --permission-mode auto --model swe -- "Map the authentication flow"

# STANDARD: Accept Edits for code changes
devin -p --permission-mode accept-edits --model swe -- "Add error handling to all API routes"

# ELEVATED RISK: Dangerous mode — use only with explicit approval
devin -p --permission-mode dangerous --model grok-4-6-high -- "Migrate database schema"

# AUTONOMOUS: OS-enforced sandbox
devin --sandbox -p --model swe -- "Run the test suite and fix failures"
```

### Bypass vs Autonomous

| | Bypass (`dangerous`) | Autonomous (`--sandbox`) |
|---|---|---|
| Requires `--sandbox` | No | Yes (only available in sandbox sessions) |
| Shell commands | Auto-approved, unrestricted | Auto-approved, contained by sandbox |
| File writes via edit/write tools | Auto-approved anywhere | Still prompt (granting a scope expands the sandbox) |
| Network access | Unrestricted | Filtered by sandbox domain allow/deny lists |
| Respects admin Team Settings | Yes | Yes |

Pick `dangerous` when you trust the agent with your whole machine. Pick `--sandbox` (autonomous) when you want unattended execution with OS-enforced limits.

---

## 11. SESSION MANAGEMENT

### Session Subcommands

| Subcommand | Description |
|------------|-------------|
| `devin` | Launch REPL; session picker available |
| `devin -c` | Continue the most recent session in the current directory |
| `devin -r` | Resume — pick from recent sessions interactively |
| `devin -r <session-id>` | Resume a specific session by ID |
| `devin list` | List sessions in the current directory (alias: `devin ls`) |
| `devin list --format json` | Output sessions as JSON |
| `devin list --format csv` | Output sessions as CSV |

### Session Picker

Running `devin` without arguments opens the REPL. Use `/resume` inside the REPL to open the interactive session picker, or `/continue` to resume the most recent session.

### Scripted Session Resume

```bash
# Continue the most recent session non-interactively
devin -c -p "Continue implementing the rate limiter" --model swe

# Resume a specific session
devin -r brisk-otter -p "Continue from where we left off" --model swe

# List sessions as JSON for scripting
devin list --format json
```

### When to Use Each Operation

| Operation | When to Use |
|-----------|-------------|
| `-c` / `--continue` | Continue the most recent session with existing context |
| `-r` / `--resume` | Resume a specific session by ID |
| `/fork` | Fork the current session to try a different approach |
| `/revert` | Revert file changes from a specific step and rewind conversation |
| New session | Fresh context; previous session is not relevant |
| `-p` (stateless) | One-shot tasks; simpler to re-provide context than manage sessions |

---

## 12. SUBCOMMANDS

| Subcommand | Description |
|------------|-------------|
| `devin auth` | Authentication (login, logout, status) |
| `devin mcp` | MCP server management (add, list, get, remove, login, logout, enable, disable) |
| `devin models` | List available models organized by family |
| `devin rules` | Manage agent rules (always-on context blobs) |
| `devin skills` | Manage agent skills (slash commands and context blobs) |
| `devin plugins` | Manage plugins (install, list, info, update, remove) |
| `devin cloud` | Manage Devin Cloud resources (DRS: environment blueprints, sandbox sessions, builds) |
| `devin list` | List sessions in the current directory (alias: `ls`) |
| `devin update` | Check for and optionally install updates |
| `devin version` | Print the current version |
| `devin migrate` | Migrate configuration from other tools |
| `devin sandbox` | Process sandboxing for the exec tool (research preview) |
| `devin setup` | Interactive setup wizard |
| `devin uninstall` | Uninstall and remove data |
| `devin acp` | Run as an ACP (Agent Client Protocol) server over stdio |
| `devin shell` | Shell integration (init, run, setup) |

---

## 13. TROUBLESHOOTING

| Problem | Cause | Solution |
|---------|-------|----------|
| `not authenticated` / auth error | Devin account OAuth not configured | Run `devin auth login` (browser flow) |
| `Authentication failed` | OAuth session expired or invalid | Re-run `devin auth login` to re-authenticate |
| `Command not found: devin` | Not installed or not in PATH | Run `devin setup` or `curl -fsSL https://devin.ai/install \| bash`; verify with `which devin` |
| Task ran but no files changed | `devin -p` defaulted to `auto` (read-only) | Add `--permission-mode accept-edits` or `dangerous` |
| Session resume fails | Session ID invalid or expired | List sessions via `devin list`; start a new session |
| Slow response | Large context or complex task | Break task into smaller steps; use `auto` for analysis; use `swe` (lightning tier) for quick lookups |
| `--sandbox` fails to start | Platform prerequisites missing | Run `devin sandbox setup` (Linux needs `bwrap` + `socat`; macOS works out of the box) |
| Cloud handoff fails | Network issue or uncommitted changes blocking | Commit or stash unwanted changes; verify connectivity to `app.devin.ai` |
| Subagent denied tools | Background subagent cannot prompt for permissions | Resume the subagent in the foreground to approve tools |
| MCP server not responding | Server not running or misconfigured | Check `devin mcp list`; verify server config in `.devin/config.json` |
| Windows compatibility | WSL not configured | Use WSL 2; native Windows cannot run the sandbox |

---

## 14. ENVIRONMENT VARIABLES

| Variable | Purpose | Example |
|----------|---------|---------|
| `DEVIN_MODEL` | Default model override | `swe`, `glm-5-2`, `grok-4-6-high` |
| `DEVIN_PERMISSION_MODE` | Default permission mode | `auto`, `accept-edits`, `smart`, `dangerous` |
| `DEVIN_SANDBOX` | Enable sandbox | `1` |
| `DEVIN_PROJECT_DIR` | Project root directory (set automatically by Devin on session start) | `/path/to/project` |
| `WINDSURF_API_KEY` | ACP server credentials (alternative to stored auth) | API key string |
