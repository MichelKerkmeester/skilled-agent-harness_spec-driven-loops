---
title: "Devin CLI Built-in Tools Reference"
description: "Reference for Devin CLI built-in capabilities including run_subagent, /handoff, MCP integration, Fetch, session management, and the 4-tier permission model."
trigger_phrases:
  - "devin run_subagent"
  - "devin handoff command"
  - "devin built-in tools"
  - "devin mcp integration"
  - "devin permission model"
  - "devin fetch tool"
  - "devin tool surface"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Devin CLI Built-in Tools Reference

Reference for all Devin CLI capabilities, highlighting unique features and the 4-tier permission model.

---

## 1. OVERVIEW

### Core Principle

Delegate to Devin CLI for capabilities the calling AI lacks natively — especially `run_subagent` for parallel subagent delegation, `/handoff` for cloud session transfer, multi-model selection, and the OS-level sandbox for autonomous execution.

### Purpose

Covers all built-in capabilities available in Devin CLI, highlights what is unique compared to other CLI executors, and provides the 4-tier permission model for task routing decisions.

### When to Use

- Choosing whether to delegate a task to Devin CLI or handle it in the calling AI
- Understanding which Devin tools and permission modes to use for different task types
- Mapping calling AI capabilities to Devin CLI equivalents
- Leveraging Devin-exclusive features (subagents, /handoff, multi-model, sandbox)

---

## 2. UNIQUE CAPABILITIES

These capabilities are exclusive to Devin CLI or provide significantly different workflows.

### run_subagent Tool

**Native subagent spawning for parallel work.** Devin's `run_subagent` tool lets the parent agent spawn independent workers that share tools and codebase context but operate in their own conversation chain.

**Capabilities:**
- Two built-in profiles: `subagent_explore` (read-only, cheap SWE-1.6) and `subagent_general` (full access, parent's model)
- Custom profiles via `.devin/agents/[name]/AGENT.md` with model overrides and tool restrictions
- Foreground (parent pauses) or background (parallel) execution
- Background subagents auto-deny unapproved tools; foreground subagents prompt for approval
- Subagents can be resumed in the foreground if they fail due to denied tools

**Usage:**

```bash
# Request an explore subagent for read-only research
devin -p "Research the auth module using a subagent_explore subagent" \
  --model adaptive --permission-mode auto

# Request a general subagent for code changes
devin -p "Fix the failing tests using a subagent_general subagent" \
  --model adaptive --permission-mode accept-edits
```

**Best For:**
- Parallel research across multiple modules
- Cost-effective exploration (explore subagent runs on SWE-1.6)
- Specialized workers via custom AGENT.md profiles
- Isolating subtask context from the parent conversation

**Compared to other CLI executors:** Most CLI executors lack native subagent spawning. Devin's `run_subagent` is a first-class tool that the agent calls automatically when a task benefits from independent work.

Full subagent details: [agent-delegation.md](./agent-delegation.md)

---

### /handoff Command

**Cloud session transfer.** The `/handoff` command transfers the current session to a cloud Devin session with its own VM, shell, browser, and full repo access.

**Capabilities:**
- Packages conversation context and current git branch
- Cloud session clones the right repo and checks out the branch
- Uncommitted changes (work-in-progress diff) carry over
- Cloud session keeps working after you close your laptop
- Track progress from terminal or in the Devin web app

**Usage:**

```bash
# Start a session, then hand off to cloud
devin -- "Fix the flaky integration tests in CI"
# Inside the REPL:
/handoff fix the flaky integration tests in CI

# Without a task description, continues from where you left off
/handoff
```

**Best For:**
- Long-running tasks (migrations, batch jobs, large refactors)
- Browser-dependent workflows (OAuth flows, end-to-end tests, scraping)
- CI/CD pipeline debugging and deployments
- Parallel execution (offload to cloud while you keep coding locally)

Full handoff details: [cloud-handoff.md](./cloud-handoff.md)

---

### Multi-Model Selection

**Multiple AI models from multiple providers.** Devin CLI supports models from Anthropic, OpenAI, Google, Cognition, and leading open-source providers, with an intelligent Adaptive router.

**Capabilities:**
- Short names (`opus`, `sonnet`, `swe`, `gpt`, `codex`, `gemini`) resolve to latest versions
- `adaptive` mode auto-selects the best model per task
- Switch models mid-session with `/model <name>` slash command
- Configurable reasoning/thinking levels on supported models
- Cost optimization: use `swe` / `swe-1-6-fast` for cheap tasks, `opus` for deep reasoning

**Usage:**

```bash
# Command flag
devin -p --model opus "Refactor the auth module"
devin -p --model swe-1-6-fast "Fix the typo at line 42"

# Slash command (inside REPL)
/model opus
/model codex
```

**Best For:**
- Tasks that benefit from a specific provider's model
- Cost-sensitive workloads (SWE-1.6 for quick edits)
- Complex reasoning (Opus for architecture and security)
- Tasks where model diversity helps cross-validation

**Compared to other CLI executors:** Most CLI executors are locked to a single provider's models. Devin's multi-model surface lets the calling AI reach any provider through one binary.

---

### OS-Level Sandbox (--sandbox)

**Process sandboxing for autonomous execution.** The `--sandbox` flag enables OS-level sandboxing (macOS Seatbelt / Linux bwrap+seccomp) that enforces filesystem and network boundaries.

**Capabilities:**
- Shell commands and fetches auto-approve because the sandbox enforces what they can touch
- Direct file edits via `edit`/`write` tools still prompt (they run inside the CLI process, not the sandbox)
- Scopes granted mid-session dynamically expand the sandbox
- Domain allow/deny lists filter network access
- Only available with `autonomous` permission mode

**Usage:**

```bash
# Autonomous mode with OS-enforced sandbox
devin --sandbox -p "Run the test suite and fix any failures" --model adaptive
```

**Best For:**
- Unattended execution with OS-enforced safety limits
- Running untrusted or potentially destructive commands safely
- CI-like validation in an isolated environment

**Platform requirements:**
- macOS: works out of the box via Seatbelt
- Linux: requires `bwrap` and `socat` (run `devin sandbox setup` for prerequisites)
- Windows: use WSL 2 (native Windows cannot run the sandbox)

---

## 3. STANDARD TOOLS

These capabilities provide functionality comparable to other CLI executors, with Devin-specific syntax.

### File System Operations

| Capability | Description | Devin Behavior |
|------------|-------------|----------------|
| File reading | Read file contents | Automatic or `@` file mention in REPL |
| File writing | Create or overwrite a file | Requires `accept-edits` or higher permission mode |
| Surgical edits | Replace text in a file | Automatic (targeted edits within files) |
| Multi-file read | Read multiple files | `@` mentions in REPL; file content piped via stdin in `-p` mode |
| Directory listing | List files and directories | Automatic pattern exploration |
| File search | Find files by pattern | `glob` tool |
| Content search | Search for text/regex in files | `grep` tool |

### Shell Execution

| Capability | Description | Notes |
|------------|-------------|-------|
| Command execution | Run shell commands | `exec` tool; requires `accept-edits` or higher; auto-approved in `dangerous` or `autonomous` |
| Build and test | Run npm, cargo, pytest, etc. | Allowed at `accept-edits` and above |
| Git operations | git status, diff, add, commit | Allowed at `accept-edits` and above |

### Web Access

| Capability | Description | Notes |
|------------|-------------|-------|
| URL fetching | Fetch web content | `fetch` tool; prompts in `auto`/`accept-edits`, auto in `dangerous`/`autonomous` |
| Web search | Search the web | Available through subagent tools and model capabilities |

### Interaction

| Capability | Description | Notes |
|------------|-------------|-------|
| Clarification | Ask for input when needed | `ask_user_question` tool (not available to subagents) |
| Task tracking | Internal task management | Built into session context |

---

## 4. 4-TIER PERMISSION MODEL

Devin CLI uses a tiered permission system to balance power and safety. The `--permission-mode` flag controls which tools auto-approve and which prompt for approval.

### Permission Modes

| Mode | Flag | Read-only | Fetch | Bash | File edits | When to use |
|------|------|-----------|-------|------|------------|-------------|
| **Auto** | `auto` | Auto | Prompt | Prompt | Prompt | Analysis, review, research |
| **Accept Edits** | `accept-edits` | Auto | Prompt | Prompt | Auto (workspace) | Code generation, refactoring |
| **Smart** | `smart` | Auto | Safe auto | Safe auto | Auto (workspace) | Trusted workflows with judgment |
| **Dangerous** | `dangerous` | Auto | Auto | Auto | Auto | Full trust — **explicit approval** |
| **Autonomous** | `autonomous` | Auto | Auto (sandbox) | Auto (sandbox) | Prompt | Unattended with `--sandbox` |

### How Permissions Work

When the agent calls a tool, the permission system checks rules in priority order:

1. **Deny rules** — Checked first. If matched, the action is blocked immediately.
2. **Ask rules** — Checked second. If matched, always prompted (overrides allow rules).
3. **Allow rules** — Checked last. If matched, the action proceeds without prompting.
4. **Default** — If no rule matches, the behavior depends on the permission mode.

### Permission Rule Syntax

**Scope-based:**

| Matcher | Controls | Example |
|---------|----------|---------|
| `Read(glob)` | File read access | `Read(src/**)` — all files under src/ |
| `Write(glob)` | File write access | `Write(src/**)` — write anywhere in src/ |
| `Exec(prefix)` | Shell command execution | `Exec(git)` — git, git status, git commit... |
| `Fetch(pattern)` | HTTP fetch access | `Fetch(https://api.github.com/*)` |

**Tool-based:** `read`, `edit`, `grep`, `glob`, `exec`

**MCP tool-based:** `mcp__server__tool`, `mcp__server__*`, `mcp__*`

### Permission Precedence

1. Organization/team settings (if enterprise) — highest
2. Session-level grants (interactive approvals)
3. Project local config (`.devin/config.local.json`)
4. Project config (`.devin/config.json`)
5. User config (`~/.config/devin/config.json`) — lowest

Deny is checked before ask, and ask before allow. A deny rule always wins. Organization-level denials cannot be overridden.

### Bypass vs Autonomous

| | Bypass (`dangerous`) | Autonomous (`--sandbox`) |
|---|---|---|
| Requires `--sandbox` | No | Yes (only mode available in sandbox) |
| Shell commands | Auto-approved, unrestricted | Auto-approved, contained by sandbox |
| File writes via edit/write | Auto-approved anywhere | Still prompt (granting scope expands sandbox) |
| Network access | Unrestricted | Filtered by sandbox domain lists |
| Respects admin Team Settings | Yes | Yes |

Pick `dangerous` when you trust the agent with your whole machine. Pick `--sandbox` (autonomous) when you want unattended execution with OS-enforced limits.

---

## 5. MCP SERVER INTEGRATION (devin mcp)

**Model Context Protocol server support.** Devin CLI connects to MCP servers, extending its capabilities with custom tools and data sources.

**Subcommands:**

| Command | Description |
|---------|-------------|
| `devin mcp add <name>` | Add a new MCP server (stdio or HTTP transport) |
| `devin mcp list` | List all configured MCP servers |
| `devin mcp get <name>` | Show details for a specific server |
| `devin mcp remove <name>` | Remove a configured server |
| `devin mcp login <name>` | Authenticate with a server via OAuth |
| `devin mcp logout <name>` | Remove stored OAuth credentials |
| `devin mcp enable <name>` | Enable a disabled server |
| `devin mcp disable <name>` | Disable a server without removing it |

**Configuration:**

```json
// .devin/config.json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["./mcp-server.js"],
      "env": {
        "MY_API_KEY": "${MY_API_KEY}"
      },
      "transport": "stdio"
    }
  }
}
```

**Usage examples:**

```bash
# stdio server
devin mcp add my-server -- npx @company/mcp-server --port 3000

# HTTP server
devin mcp add notion https://mcp.notion.com/mcp

# With environment variables
devin mcp add -e GITHUB_TOKEN=ghp_xxx github -- npx -y @modelcontextprotocol/server-github

# Use MCP tools in a dispatch
devin -p "Use the database MCP tool to query user records" \
  --model adaptive --permission-mode auto
```

**MCP tool permissions:** Control access with `mcp__server__tool`, `mcp__server__*`, or `mcp__*` patterns in the permissions config.

---

## 6. SESSION MANAGEMENT

**Multi-turn workflow continuity.** Devin CLI supports continuing and resuming sessions, forking, and reverting.

**Capabilities:**
- `devin -c` / `--continue` — Continue the most recent session in the current directory
- `devin -r <id>` / `--resume <id>` — Resume a specific session by ID
- `/fork [step]` — Fork the current session to explore alternatives
- `/revert <step>` — Revert file changes from a specific step and rewind conversation
- `/ls [--all]` — List recent sessions
- `devin list --format json` — Scripted session listing
- Sessions persist conversation context across invocations

**Usage:**

```bash
# Continue most recent session
devin -c

# Resume specific session
devin -r brisk-otter

# Non-interactive continuation
devin -c -p "Continue implementing the rate limiter" --model adaptive

# List sessions as JSON
devin list --format json
```

**Compared to other CLI executors:** Session continuity with full conversation and tool-call context preservation. Fork and revert provide safe exploration of alternatives.

---

## 7. CAPABILITY COMPARISON

| Capability | Calling AI | Devin CLI | Notes |
|------------|-------------|-----------|-------|
| **File reading** | `Read` tool | `read` tool, `@` mentions | Devin `@` syntax is concise |
| **File writing** | `Write`, `Edit` | `edit`, `write` tools | Requires `accept-edits` or higher |
| **Code search** | `Grep` (ripgrep) | `grep` tool | Both ripgrep-powered |
| **File discovery** | `Glob` | `glob` tool | Functionally equivalent |
| **Shell commands** | `Bash` | `exec` tool | Both require appropriate permissions |
| **Web fetch** | `WebFetch` | `fetch` tool | Similar capabilities |
| **Subagent delegation** | Not native | `run_subagent` tool | Devin-exclusive native subagents |
| **Cloud handoff** | Not built-in | `/handoff` command | Devin-exclusive |
| **Multi-model** | Single model | Multiple providers | Devin supports Opus, Sonnet, GPT, SWE, Codex, Gemini, etc. |
| **OS-level sandbox** | Not built-in | `--sandbox` flag | Devin-exclusive |
| **Session continuity** | Built-in (conversation) | `-c`, `-r`, `/fork`, `/revert` | Devin preserves full context |
| **MCP integration** | Native | `devin mcp` subcommands | Both support MCP protocol |
| **Memory/persistence** | Spec Kit Memory MCP | Session resume/fork | Different approaches |
| **Image input** | `Read` (multimodal) | Clipboard paste (`Ctrl+V`) | Both support image input |

---

## 8. BEST PRACTICES

### When to Use run_subagent

- Parallel research across multiple independent modules
- Cost-effective exploration (explore subagent on SWE-1.6)
- Isolating subtask context from the parent conversation
- Code changes that benefit from focused, independent work

**Avoid for:** Tasks that share context with the parent or need the parent's full conversation history.

### When to Use /handoff

- Long-running tasks that exceed local session time
- Browser-dependent workflows (OAuth, E2E tests, scraping)
- CI/CD pipeline debugging and deployments
- Parallel execution (offload to cloud while you keep coding locally)

**Avoid for:** Quick edits that complete faster locally; tasks involving sensitive data without confirming cloud isolation.

### When to Use Multi-Model

- `adaptive` for general delegation (router picks the best model)
- `opus` for complex refactoring, architecture, security
- `swe-1-6-fast` for quick edits and cost-sensitive work
- `gpt` / `codex` when OpenAI-model strengths fit the task

**Avoid for:** Tasks where a single model already handles well and switching adds overhead.

### When to Use --sandbox

- Unattended execution with OS-enforced safety limits
- Running potentially destructive commands safely
- CI-like validation in an isolated environment

**Avoid for:** Interactive sessions where you want to approve actions; tasks needing unrestricted network access.

### Permission Mode Selection Patterns

| Use Case | Permission Mode | Rationale |
|----------|----------------|-----------|
| Code review | `auto` | Prevent accidental modifications |
| Security audit | `auto` | Strict isolation for safety analysis |
| Research | `auto` | No file system changes needed |
| Code generation | `accept-edits` | Files must be created |
| Bug fixing | `accept-edits` | Files must be modified |
| Test generation | `accept-edits` | Test files must be written |
| Documentation | `accept-edits` | Docs must be written |
| Unattended execution | `autonomous` (+ `--sandbox`) | OS-enforced safety |
| Full trust | `dangerous` | **Ask user first** |

### Capability Combination Patterns

| Goal | Capability Combination | Flow |
|------|----------------------|------|
| **Understand then fix** | `auto` analysis → `accept-edits` fix | Analyze, focus, edit |
| **Parallel research** | `run_subagent` with explore subagents | Spawn, wait, synthesize |
| **Offload long task** | `/handoff` to cloud | Start locally, hand off, track remotely |
| **Audit codebase** | `auto` analysis with `opus` | Deep read-only review |
| **Multi-session task** | Initial `-p` → `-c` continue → `/fork` alternatives | Start, continue, branch |
| **Safe unattended** | `--sandbox` autonomous | OS-enforced limits |
