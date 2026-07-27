---
title: "Devin Cloud Handoff Reference"
description: "Reference for the /handoff command, cloud Devin session mechanics, use cases, state transfer, and cross-agent handoff patterns."
trigger_phrases:
  - "devin cloud handoff"
  - "devin handoff command"
  - "devin cloud session"
  - "devin vm offload"
  - "devin long-running task"
  - "devin browser workflow"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Devin Cloud Handoff Reference

Complete reference for the `/handoff` command and cloud Devin session mechanics.

---

## 1. OVERVIEW

### Core Principle

When a task outgrows the local terminal — or you want Devin to keep working while you step away — the `/handoff` command transfers the current session to a cloud Devin session. The cloud session gets its own VM with a shell, browser, and full repo access, so it can keep going after you close your laptop.

### Purpose

Documents the `/handoff` command mechanics, use cases, state transfer, and integration patterns for offloading work from the local Devin CLI to a cloud Devin session.

### When to Use

- **VM or server tasks** — running a dev server, hitting endpoints, Docker builds
- **Browser-dependent workflows** — screenshots, OAuth flows, end-to-end tests, scraping
- **CI/CD** — pipeline debugging, deployments, infrastructure changes
- **Long-running work** — migrations, batch jobs, large refactors
- **Parallel execution** — offload work to the cloud while you keep coding locally

### When NOT to Use

- Quick edits that complete faster locally
- Tasks requiring interactive approval prompts (cloud sessions are less interactive)
- Tasks involving sensitive data without confirming cloud session isolation
- Tasks where the local environment has specific dependencies not available in the cloud VM

---

## 2. HANDOFF MECHANICS

### The /handoff Command

The `/handoff` command is available inside an interactive Devin REPL session. It packages the conversation context and current git branch, then creates a cloud session that picks up where you left off.

**Basic usage:**

```
/handoff fix the flaky integration tests in CI
```

**Without a task description:**

```
/handoff
```

Running `/handoff` without a task description makes the cloud session continue from where you left off automatically.

### What Carries Over

The cloud session starts in a fresh VM, so the CLI includes everything it needs to pick up the thread:

| What | Details |
|------|---------|
| **Repo and branch** | The cloud session clones the right repo and checks out the branch you're on |
| **Conversation context** | What you and Devin have been working on in the current session |
| **Uncommitted changes** | Your work-in-progress diff carries over. Commit or stash anything you don't want sent |

### What Does NOT Carry Over

- Local environment variables not in the repo
- Locally installed tools or dependencies not defined in the repo
- Active MCP server connections (must be re-established in the cloud session)
- Local file system state outside the repo

### Tracking Progress

After handoff, track the cloud session's progress from:

1. **Your terminal** — the CLI shows the cloud session status
2. **The Devin web app** — `https://app.devin.ai` provides a full cloud session dashboard

---

## 3. USE CASES

### Long-Running Tasks

Tasks that would tie up a local terminal for an extended period are ideal for cloud handoff. The cloud VM runs independently — you can close your laptop and check back later.

```
/handoff run the full integration test suite, fix any failures, and verify the build passes
```

**Best for:** migrations, batch jobs, large refactors, full test suite runs.

### Complex Refactors

Multi-file refactors that require deep reasoning and many tool calls benefit from the cloud session's dedicated resources.

```
/handoff refactor the entire authentication module to use a strategy pattern with pluggable providers
```

**Best for:** architectural changes, dependency upgrades, framework migrations.

### CI-Like Validation

Run validation pipelines in the cloud that mirror CI behavior — build, test, lint, type-check.

```
/handoff run the full CI pipeline locally: lint, type-check, unit tests, integration tests, and e2e tests. Fix any failures and report the results.
```

**Best for:** pre-PR validation, release readiness checks, pipeline debugging.

### Browser-Dependent Workflows

The cloud session includes a browser, enabling workflows that are impossible in a pure terminal:

```
/handoff test the OAuth flow end-to-end: start the dev server, navigate to the login page, complete the OAuth flow, and verify the callback handles the token correctly
```

**Best for:** OAuth flow testing, E2E test runs, web scraping, screenshot verification.

### Parallel Execution

Offload work to the cloud while you continue coding locally. The cloud session runs independently.

```
# In your local session:
/handoff generate comprehensive integration tests for the API layer

# Meanwhile, you continue working on the frontend locally
```

**Best for:** generating tests while implementing features, running background validation while coding, parallel task decomposition.

---

## 4. STATE TRANSFER

### Git State

The handoff transfers the current git branch and uncommitted changes. The cloud session:

1. Clones the repository
2. Checks out the branch you were on
3. Applies your uncommitted work-in-progress diff

**Important:** Commit or stash anything you do NOT want sent to the cloud. The handoff transfers the working tree as-is.

### Conversation Context

The full conversation context from the current session is packaged and sent to the cloud session. This includes:

- All user messages and Devin's responses
- Tool calls and their results
- Any decisions made during the session
- The current task state and progress

The cloud session picks up the thread as if you had never closed your local terminal.

### Environment Setup

The cloud VM is a fresh environment. Any environment-specific setup must be defined in the repo (via a `environment.yaml` or similar) or re-established in the cloud session.

For reproducible cloud environments, use Declarative Repo Setup (DRS):

```bash
# Manage environment blueprints
devin cloud drs
```

DRS lets you define an `environment.yaml` blueprint that the cloud session uses to set up its VM — installing dependencies, configuring tools, and preparing the environment automatically.

---

## 5. CROSS-AGENT HANDOFF

### From Other Coding Agents

The `/handoff` command is built into the Devin CLI. But you can also hand off from other coding agents — Claude Code, Codex, Cursor, or any coding agent — and from plain shell scripts, using the open-source Devin Handoff plugin.

**Devin Handoff plugin:** `https://github.com/club-cog/devin-handoff`

This enables cross-agent cloud handoff patterns:

```
Claude Code (local) --> Devin Handoff plugin --> Cloud Devin session
Codex (local) --> Devin Handoff plugin --> Cloud Devin session
Cursor (local) --> Devin Handoff plugin --> Cloud Devin session
Shell script --> Devin Handoff plugin --> Cloud Devin session
```

### Integration Pattern: Calling AI Hands Off via Devin CLI

When the calling AI needs to offload a long-running task to the cloud, it dispatches to Devin CLI which performs the handoff:

```bash
# Calling AI dispatches to Devin CLI for a long-running task
devin -- "Fix the flaky integration tests in CI, then run the full suite to confirm" \
  --permission-mode accept-edits

# Inside the Devin REPL session (the calling AI instructs the user to run /handoff,
# or the prompt includes the handoff instruction for the Devin session to self-trigger)
# /handoff fix the flaky integration tests in CI
```

**Note:** The `/handoff` command is an interactive REPL command — it cannot be invoked directly in `-p` (print) mode. For orchestrated cloud handoff, the calling AI should either:

1. Instruct the user to run `devin` interactively and use `/handoff`
2. Use the Devin Handoff plugin from a shell script for non-interactive handoff
3. Dispatch the long-running task via `devin -p` and let the local session complete it (without cloud handoff)

### Integration Pattern: Calling AI Uses Devin Handoff Plugin Directly

For non-interactive cloud handoff from any coding agent:

```bash
# Using the Devin Handoff plugin from a shell script
# (see https://github.com/club-cog/devin-handoff for setup and usage)
devin-handoff "fix the flaky integration tests in CI" --repo /path/to/repo --branch main
```

This bypasses the local Devin CLI REPL and creates a cloud session directly.

---

## 6. CLOUD SESSION MANAGEMENT

### Cloud Session Commands

| Command | Description |
|---------|-------------|
| `/handoff [task]` | Hand off the current session to a cloud Devin session |
| `/cloud-sessions [--all]` | Open interactive picker of recent cloud sessions |
| `/cloud-attach <session-id>` | Attach to a cloud Devin session with full TUI rendering |

### Tracking Cloud Sessions

After handoff, the cloud session runs independently. Track it through:

1. **Terminal status** — the CLI shows cloud session status indicators
2. **Devin web app** — `https://app.devin.ai` provides the full dashboard with logs, screenshots, and progress
3. **`/cloud-sessions`** — list and attach to recent cloud sessions from within a Devin REPL
4. **`/cloud-attach <id>`** — attach to a specific cloud session with full TUI rendering and bidirectional input

### Cloud Session Lifecycle

```
Local session (working)
  |
  +-- /handoff [task] --> Cloud session created (VM + browser + repo)
  |                         |
  |                         +-- Cloud session runs independently
  |                         |   (you can close your laptop)
  |                         |
  |                         +-- Track via terminal or web app
  |                         |
  |                         +-- /cloud-attach <id> (optional re-attachment)
  |
  +-- Local session continues (optional parallel work)
```

---

## 7. DECISION MATRIX: LOCAL VS CLOUD

| Factor | Local (`devin -p`) | Cloud (`/handoff`) |
|--------|---------------------|---------------------|
| **Duration** | Short to medium (< 30 min) | Long (30 min to hours) |
| **Browser needed** | No | Yes |
| **VM/server needed** | No | Yes (dev server, Docker, endpoints) |
| **Interactive approval** | Yes (can prompt) | Limited (cloud runs more autonomously) |
| **Laptop must stay open** | Yes (process tied to terminal) | No (runs independently) |
| **Parallel work** | Blocks local terminal | Frees local terminal |
| **CI-like validation** | Limited (local environment) | Full VM with CI-like setup |
| **Cost** | Local compute only | Cloud session usage |
| **Network access** | Local network | Cloud VM network |

### Decision Flow

```
Does the task need a browser?
  +-- Yes --> /handoff (cloud)
  +-- No --> Does the task need a VM or dev server?
              +-- Yes --> /handoff (cloud)
              +-- No --> Will the task take > 30 minutes?
                          +-- Yes --> /handoff (cloud)
                          +-- No --> Do you want to keep working locally in parallel?
                                      +-- Yes --> /handoff (cloud)
                                      +-- No --> Local dispatch (devin -p)
```

---

## 8. SAFETY CONSIDERATIONS

### Data Handling

The cloud session receives your repo, branch, and uncommitted changes. Before handing off:

- **Review uncommitted changes** — ensure no secrets, credentials, or sensitive data in the working diff
- **Commit or stash unwanted changes** — the handoff transfers the working tree as-is
- **Confirm cloud isolation** — for tasks involving production systems, verify the cloud session's isolation and data handling policies

### Permission Scope

The cloud session inherits the conversation context but runs in its own VM. Permission rules from your local config may not apply the same way in the cloud environment. For sensitive tasks:

- Use restrictive permission modes in the local session before handoff
- Define explicit permission rules in `.devin/config.json` that travel with the repo
- Monitor the cloud session's actions via the web app dashboard

### Production Systems

For tasks that touch production systems (deployments, migrations, infrastructure changes):

- **Confirm explicit user approval** before handing off
- **Describe the risks** — the cloud session has a full VM with shell and network access
- **Monitor closely** — use the web app to watch the session's actions in real-time
- **Have a rollback plan** — know how to revert if the cloud session makes unwanted changes

---

## 9. TROUBLESHOOTING

| Problem | Cause | Solution |
|---------|-------|----------|
| Handoff fails to create cloud session | Network issue or auth problem | Verify `devin auth status`; check network connectivity to `app.devin.ai` |
| Cloud session not picking up context | Conversation context not packaged | Ensure you are in an active session before running `/handoff` |
| Uncommitted changes not in cloud | Working tree was clean at handoff time | The handoff transfers the current diff; commit or stash before handoff to control what is sent |
| Cloud session running too long | Task is more complex than expected | Monitor via web app; cancel from the web app if needed |
| Cannot attach to cloud session | Session ID invalid or session completed | Use `/cloud-sessions` to list active sessions; completed sessions are viewable in the web app |
| Sensitive data sent to cloud | Uncommitted changes contained secrets | Review the working diff before handoff; use `git stash` to exclude sensitive changes |
| Cloud session lacks dependencies | Environment not defined in repo | Use Declarative Repo Setup (`devin cloud drs`) to define an `environment.yaml` blueprint |

---

## 10. RELATED RESOURCES

- [Devin Handoff Plugin](https://github.com/club-cog/devin-handoff) — Open-source plugin for cross-agent handoff
- [Devin Web App](https://app.devin.ai) — Cloud session dashboard and tracking
- [Devin CLI Documentation](https://docs.devin.ai/cli) — Official CLI docs
- [cli-reference.md](./cli-reference.md) — Complete CLI command and flag reference
- [devin-tools.md](./devin-tools.md) — Full tool surface including /handoff and session management
- [integration-patterns.md](./integration-patterns.md) — Cross-AI orchestration patterns including cloud handoff integration
