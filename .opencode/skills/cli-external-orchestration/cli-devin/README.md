---
title: cli-devin
description: Cross-AI dispatcher that delegates a task to Cognition's Devin CLI for multi-model coding, subagent delegation, cloud handoff and cross-model validation.
trigger_phrases:
  - "devin"
  - "devin cli"
  - "cognition"
  - "cloud handoff"
  - "subagent delegation"
  - "second opinion"
  - "cross-validate"
version: 1.0.0.0
---

# cli-devin

> Dispatch a task to Cognition's `devin` CLI and get back multi-model coding, subagent delegation, cloud handoff or a second-model opinion, without leaving your current runtime.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Multi-model coding, subagent delegation, cloud handoff, and cross-model validation through Cognition's `devin` CLI |
| **Invoke with** | "devin", "cognition", "cloud handoff", "subagent", "second opinion" or auto-routing on Devin keywords |
| **Works on** | Any external runtime (Claude Code, Codex, Cursor, OpenCode, raw shell) that needs to reach the `devin` binary |
| **Produces** | Code edits, text responses, subagent task results, cloud handoff sessions, and web-enriched research |

---

## 2. PREREQUISITES

### Install Devin CLI

```bash
# Interactive setup wizard (auth + MCP configuration)
devin setup

# Or install directly
curl -fsSL https://devin.ai/install | bash
```

### Authenticate

```bash
# Browser-based OAuth login
devin auth login

# For SSH/remote sessions
devin auth login --force-manual-token-flow

# Verify authentication
devin auth status
```

A Devin account (free, team, or enterprise) is required. The CLI authenticates through Cognition's OAuth flow — it does not use an API key.

### Verify Installation

```bash
command -v devin      # Should print the binary path
devin --version       # Should print the version (e.g. 3000.2.17)
```

---

## 3. QUICK START

**Step 1: Verify the CLI is installed.**

```bash
command -v devin
```

If nothing prints, install it with `devin setup` or `curl -fsSL https://devin.ai/install | bash`.

**Step 2: Run the default dispatch.**

```bash
devin -p \
  --model adaptive \
  --permission-mode accept-edits \
  "Add input validation to src/utils.ts" \
  2>&1
```

You get the file edited in place inside your workspace. For a read-only task like review or research, swap the permission mode to `auto`.

**Step 3: Dispatch a subagent for parallel exploration.**

```bash
devin -p \
  --model adaptive \
  --permission-mode auto \
  "Research how the authentication module works using a subagent_explore subagent. Report the key files and data flow." \
  2>&1
```

You get a structured research summary from a read-only subagent running on the cheap default subagent model (SWE-1.6), not your primary model.

**Step 4: Hand off a long-running task to the cloud.**

```bash
devin --permission-mode accept-edits -- "Fix the flaky integration tests in CI, then run the full suite to confirm"
# Inside the REPL session:
/handoff fix the flaky integration tests in CI
```

The cloud session gets its own VM with a shell, browser, and full repo access. Track its progress from your terminal or in the Devin web app.

---

## 4. COMMON PATTERNS

### Code Review (Read-Only)

```bash
devin -p \
  --model opus \
  --permission-mode auto \
  "Review src/auth/handler.ts for security vulnerabilities and code quality. Report findings as a structured list with severity ratings." \
  2>&1
```

Use `auto` (read-only auto-approve) for review tasks. Use `opus` for deep security analysis.

### Code Generation (Workspace Edits)

```bash
devin -p \
  --model adaptive \
  --permission-mode accept-edits \
  "Generate a rate limiter middleware with sliding window algorithm in src/middleware/rate-limiter.ts. Include types, error handling, and JSDoc." \
  2>&1
```

Use `accept-edits` for generation tasks so file writes are auto-approved within the workspace.

### Subagent-Delegated Research

```bash
devin -p \
  --model adaptive \
  --permission-mode auto \
  "Use a subagent_explore subagent to map all authentication-related files and their dependencies. Report the dependency graph and any circular imports." \
  2>&1
```

The explore subagent runs on SWE-1.6 (cheap and fast), keeping your primary model's spend low.

### Session Continuation

```bash
# Continue the most recent session in the current directory
devin -c

# Resume a specific session by ID
devin -r brisk-otter

# Non-interactive continuation
devin -c -p "Continue implementing the rate limiter from where we left off" 2>&1
```

### Multi-Model Selection

```bash
# Use Claude Opus for complex refactoring
devin -p --model opus --permission-mode accept-edits "Refactor the auth module to use a strategy pattern" 2>&1

# Use SWE-1.6 Fast for quick edits
devin -p --model swe-1-6-fast --permission-mode accept-edits "Fix the typo in the error message at line 42" 2>&1

# Use GPT for OpenAI-model strengths
devin -p --model gpt --permission-mode accept-edits "Generate comprehensive tests for the webhook handler" 2>&1
```

---

## 5. ADVANCED PATTERNS

### Cloud Handoff for CI-Like Validation

```bash
# Start a session, then hand off to cloud for long-running validation
devin -- "Run the full integration test suite, fix any failures, and verify the build passes"
# Inside the REPL:
/handoff run the full test suite and fix all failures
```

The cloud session runs in its own VM with shell, browser, and repo access. It keeps working after you close your laptop. Track progress in the terminal or the Devin web app.

### Custom Subagent Profiles

Define a specialized subagent in `.devin/agents/reviewer/AGENT.md`:

```markdown
---
name: reviewer
description: Reviews code changes for correctness and style
model: sonnet
allowed-tools:
  - read
  - grep
  - glob
  - exec
permissions:
  allow:
    - Exec(git diff)
    - Exec(git log)
  deny:
    - write
    - edit
---

You are a code review subagent. Review code changes thoroughly
and report findings back to the parent agent with specific file
paths and line numbers.
```

Then ask Devin to use it: "review this code using the reviewer subagent."

### OS-Level Sandbox for Autonomous Execution

```bash
# Autonomous mode with OS-enforced sandbox limits
devin --sandbox --permission-mode autonomous -p "Run the test suite and fix any failures" 2>&1
```

Autonomous is the only mode available with `--sandbox`. Shell commands and fetches auto-approve because the sandbox enforces filesystem and network boundaries.

### MCP Server Integration

```bash
# Add an MCP server
devin mcp add my-server -- npx @company/mcp-server --port 3000

# List configured MCP servers
devin mcp list

# Use MCP tools in a dispatch
devin -p "Use the database MCP tool to query user records and summarize the schema" 2>&1
```

### Background Subagent Fan-Out

```bash
# Dispatch multiple explore subagents in parallel for independent research
devin -p \
  --model adaptive \
  --permission-mode auto \
  "Spawn three subagent_explore subagents in the background: one to map the API layer, one to map the database layer, and one to map the auth layer. Summarize all three findings when they complete." \
  2>&1
```

Background subagents run in parallel; the parent agent is notified when each completes.

---

## 6. CONFIGURATION

### Permission Modes

| Mode | Flag value | Behavior | Best for |
|------|-----------|----------|----------|
| **Auto** | `auto` | Auto-approves read-only tools | Review, analysis, research |
| **Accept Edits** | `accept-edits` | Auto-approves workspace edits + read-only | Code generation, bug fixing |
| **Smart** | `smart` | Auto-runs actions a fast model judges safe | Trusted workflows with judgment |
| **Dangerous** | `dangerous` | Auto-approves all tools | Full trust, explicit approval required |
| **Autonomous** | `autonomous` | Sandbox-enforced, only with `--sandbox` | Unattended execution with OS limits |

### Config File

Set defaults in `~/.config/devin/config.json` (or `.devin/config.json` for project-level):

```json
{
  "agent": {
    "model": "adaptive"
  },
  "permissions": {
    "allow": [
      "Read(**)",
      "Write(src/**)",
      "Exec(git)",
      "Exec(npm run)"
    ],
    "deny": [
      "Exec(rm -rf)",
      "Exec(sudo)"
    ]
  }
}
```

### Model Short Names

Short names always resolve to the latest version in that family:

| Short name | Resolves to |
|------------|-------------|
| `adaptive` | Intelligent model router (auto-selects per task) |
| `opus` | Latest Claude Opus |
| `sonnet` | Latest Claude Sonnet |
| `swe` | Latest SWE-1.6 |
| `gpt` | Latest GPT model |
| `codex` | Latest OpenAI Codex |
| `gemini` | Latest Gemini |

---

## 7. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: devin` | CLI not installed or PATH not updated | Run `devin setup` or `curl -fsSL https://devin.ai/install \| bash`, then restart your terminal |
| `not authenticated` or auth error | Devin account OAuth not configured or expired | Run `devin auth login` (browser flow; or `--force-manual-token-flow` for SSH) |
| Task ran but no files changed | `devin -p` defaulted to `auto` (read-only) permission mode | Add `--permission-mode accept-edits` or `dangerous` |
| Agent asks for spec folder or approval | Non-interactive `-p` mode cannot answer prompts | Include `(pre-approved, skip Gate 3)` in the prompt and use `--permission-mode accept-edits` |
| `Self-invocation refused` | The caller is already inside Devin (`DEVIN_PROJECT_DIR` set, `devin` ancestry, or active credentials) | Use a different runtime or exit the current Devin session first |
| Cloud handoff fails | Network issue or uncommitted changes blocking transfer | Commit or stash unwanted changes; verify network connectivity to `app.devin.ai` |
| Subagent denied tools | Background subagent cannot prompt for new permissions | Resume the subagent in the foreground to approve the necessary permissions |
| Slow response | Large context or complex task | Break task into smaller steps; use `auto` for analysis; use `swe-1-6-fast` for quick lookups |
| `--sandbox` not available | Platform prerequisites missing | Run `devin sandbox setup` for platform requirements (Linux needs `bwrap` + `socat`; macOS works out of the box) |

---

## 8. PERFORMANCE NOTES

### Subagent Cost Management

Subagents run as their own agent sessions with independent context windows and inference calls. `subagent_explore` runs on the cheap default subagent model (SWE-1.6), while `subagent_general` inherits the parent's model — potentially expensive if the parent runs a premium model. Use `subagent_explore` for research; use custom AGENT.md profiles with a pinned `model:` for write-capable subagents that should not run on the parent's premium model.

### Model Selection for Cost

- `adaptive` — the router picks the cheapest model that handles each subtask well
- `swe-1-6-fast` — fastest and cheapest for straightforward edits
- `swe` — reasonable intelligence at low cost
- `sonnet` — balanced for most coding tasks
- `opus` — reserve for complex refactoring and deep reasoning
- `gpt` / `codex` — when OpenAI-model strengths fit the task

### Background Subagent Parallelism

Background subagents run in parallel with the parent agent. Any tool not pre-approved during the session is automatically denied for background subagents — they cannot prompt for new permissions. Pre-approve the tools they need before dispatching, or resume a failed background subagent in the foreground to grant permissions.

### Cloud Handoff Efficiency

Cloud handoff transfers the conversation context, current git branch, and uncommitted changes to a cloud VM. The cloud session can run long after you disconnect. Use it for tasks that need a VM, browser, or extended execution time — not for quick edits that complete faster locally.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/cli-reference.md`](./references/cli-reference.md) | Complete CLI subcommands, flags, permission modes, models, and config reference |
| [`references/integration-patterns.md`](./references/integration-patterns.md) | Cross-AI orchestration patterns and workflows |
| [`references/devin-tools.md`](./references/devin-tools.md) | Built-in capabilities: run_subagent, /handoff, MCP, Fetch, session management |
| [`references/agent-delegation.md`](./references/agent-delegation.md) | Subagent profile roster, routing table, and custom AGENT.md patterns |
| [`references/cloud-handoff.md`](./references/cloud-handoff.md) | /handoff cloud-handoff mechanics, use cases, and state transfer |
| [`assets/prompt-quality-card.md`](./assets/prompt-quality-card.md) | Fast-path prompt discipline and the CLEAR check |
| [`assets/prompt-templates.md`](./assets/prompt-templates.md) | Copy-paste prompt templates for common tasks |
