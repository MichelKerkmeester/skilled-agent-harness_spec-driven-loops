---
title: "Devin CLI — Reference"
description: "Complete command, flag, slash-command, model, and permission-mode reference for the official Devin for Terminal Rust binary. Verified against cli.devin.ai/docs/reference/commands as of 2026-05-15."
---

# Devin CLI — Reference

The durable surface map for the official `devin` binary. Versioned content; recheck against `https://cli.devin.ai/docs/reference/commands` before relying on flags in automation.

---

## 1. OVERVIEW

### Core Principle
The `devin` CLI is Cognition AI's official Rust binary for "Devin for Terminal" — an autonomous coding agent that runs locally with full access to your repo, tools, and environment, with optional handoff to a cloud-hosted Devin VM.

### Purpose
Document the exact surface (commands, flags, slash commands, permission modes, models, install/auth) that cross-AI dispatches rely on.

### When to Use
ALWAYS load this file when cli-devin SKILL.md is active. It is the baseline reference.

### Key Sources
- `https://cli.devin.ai/docs/reference/commands` — authoritative command/flag reference
- `https://docs.devin.ai/get-started/devin-intro` — product overview
- `https://devin.ai/terminal` — landing page
- `https://cognition.ai/blog/devin-for-terminal` — release notes / architecture rationale

---

## 2. INSTALLATION

```bash
# macOS / Linux
curl -fsSL https://cli.devin.ai/install.sh | bash

# Windows (PowerShell, admin or user scope)
irm https://static.devin.ai/cli/setup.ps1 | iex
```

Installs the `devin` binary to a location on `$PATH`. Verify with `command -v devin` and `devin version`.

> The unofficial PyPI package `devin-cli` (community-maintained, by @revanthpobala) is OUT OF SCOPE for this skill. cli-devin targets only the official Cognition Rust binary.

---

## 3. SUBCOMMAND MAP

| Subcommand | Purpose |
|------------|---------|
| `devin [OPTIONS] [prompt]` | Launch — interactive (no prompt) or seeded with an initial prompt |
| `devin auth login` | Authenticate via token from `https://app.devin.ai` (Cognition / Codeium / Windsurf bridge) |
| `devin auth logout` | Remove stored credentials |
| `devin auth status` | Verify current login state |
| `devin --continue` / `-c` | Resume most recent session |
| `devin --resume <ID>` / `-r` | Resume specific session by ID |
| `devin list` / `devin ls` | Browse available sessions. Default mode is interactive picker; pass `--format <interactive\|json\|csv>` for parseable output (`json` is the canonical non-interactive shape) |
| `devin list --format json` | Emit session list as JSON. Each entry has `id` (kebab-case slug like `paint-bean`), `short_id`, `working_directory`, `last_activity_at`, `last_activity_ago`, `title`. Use for programmatic session-id capture before `--resume <id>` |
| `devin setup` | Interactive configuration wizard |
| `devin version` | Display current CLI version |
| `devin update [--force]` | Check for and install CLI updates |
| `devin uninstall` | Uninstall and remove data |
| `devin mcp add <NAME> -- <CMD> [ARGS]` | Add an MCP server. **`--` separator required** before stdio command. For HTTP transport: `devin mcp add --transport http <NAME> <URL>` or `devin mcp add <NAME> --url <URL>` |
| `devin mcp list` | View configured MCP servers |
| `devin mcp get <name>` | Get details for a specific MCP server |
| `devin mcp remove <name>` | Remove an MCP server |
| `devin mcp enable <name>` | Enable a disabled MCP server |
| `devin mcp disable <name>` | Disable an MCP server without removing it |
| `devin mcp login <name>` | Authenticate an MCP server via OAuth |
| `devin mcp logout <name>` | Remove stored OAuth credentials for an MCP server |
| `devin rules list` | Browse context/behavior rules |
| `devin skills list` | View available skill routines |
| `devin skills show <name>` | Display a specific skill's details |
| `devin cloud <COMMAND>` | Manage Devin Cloud resources. Subcommands: `drs` (Declarative Repo Setup — environment blueprints, sandbox sessions, builds) |
| `devin cloud drs` | Manage Declarative Repo Setup — environment blueprints, sandbox sessions, builds. Requires Devin Cloud entitlement |
| `devin sandbox` | [Research Preview] Process sandboxing for the exec tool |
| `devin acp` | Run as Agent Client Protocol server over stdio |
| `devin shell setup` | Install shell integration (completions, helpers) |

> **Session ID format**: Real session ids are human-friendly kebab-case slugs (e.g. `paint-bean`, `quick-fox`), NOT UUIDs. Inspect via `devin list --format json` and read the `id` field. Pass to `devin --resume <slug>`.

---

## 4. FLAGS

### Core Flags

| Flag | Purpose |
|------|---------|
| `--model <id>` | Set AI model — one of: `swe-1.6` (default for cli-devin), `deepseek-v4`, `glm-5.1`, `kimi-k2.6` |
| `--permission-mode <mode>` | Choose `auto` (default) or `dangerous` |
| `--prompt-file <path>` | Load initial prompt from file (preferred for prompts >2KB) |
| `--config <path>` | Specify configuration file location (default: `~/.config/devin/config.json`) |
| `--continue` / `-c` | Resume most recent session |
| `--resume <ID>` / `-r` | Resume specific session by ID |

### cli-devin Default Invocation Shape

```bash
devin --prompt-file <path> --model swe-1.6 --permission-mode auto 2>&1 </dev/null
```

### Stdin Handling — `</dev/null` Is Required for Non-Interactive Dispatch

Family convention inherited from `cli-codex` and `cli-opencode`: append `</dev/null` for non-interactive dispatch as a portability convention. **Empirical finding (2026-05-15, devin 2026.5.6-8)**: Devin's binary does NOT exhibit the silent stdin-theft failure mode that cli-codex / cli-opencode docs describe — `while read` loops complete cleanly with or without the redirect on the tested version. The `</dev/null` redirect remains harmless and is the documented convention for cross-binary-version stability, but it is not load-bearing on the currently-tested Devin version. See `evidence/playbook-run-wave2-2026-05-15.md` for the test data.

```bash
# Correct
devin --prompt-file "$PROMPT" --model swe-1.6 > "$LOG" 2>&1 </dev/null &

# Wrong — silent stdin theft in script loops
devin --prompt-file "$PROMPT" --model swe-1.6 > "$LOG" 2>&1 &
```

### Sessions

`devin list` enumerates sessions; `--continue` resumes the last; `--resume <id>` targets a specific one. Inside a live TUI, slash commands `/fork [step]` and `/revert <step>` branch and revert in finer steps.

### Provider Auth Pre-Flight

```bash
devin auth status
```

Outcomes:
- Authenticated → proceed
- Unauthenticated → surface `devin auth login` to operator (token from `https://app.devin.ai` (Cognition / Codeium / Windsurf bridge))
- Profile mismatch → surface `devin --config <path>` to override

The skill MUST NOT auto-login. Never substitute a token, profile, or model the operator didn't approve.

---

## 5. MODEL SELECTION

Four model presets are available. The skill defaults to SWE-1.6 for context gathering, tool use, and simple-to-medium well-defined tasks; DeepSeek v4 is the primary pick for complex work; GLM 5.1 and Kimi k2.6 are the documented complex-task fallbacks.

| Model | ID | Strength |
|-------|----|---------|
| **Cognition SWE-1.6** ★ default | `swe-1.6` | Context gathering, tool use, simple-to-medium well-defined code tasks; fast iteration in the Devin agent loop |
| **DeepSeek v4** (DeepSeek) | `deepseek-v4` | **Primary for complex tasks** — ambiguous problems, multi-step work, reasoning-bound logic, large refactors, deep RCA |
| **GLM 5.1** (Zhipu) | `glm-5.1` | Complex-task **fallback** — agentic / tool-use, MCP chains, structured planning when DeepSeek doesn't fit |
| **Kimi k2.6** (Moonshot) | `kimi-k2.6` | Complex-task **fallback** — large-context shape (long files, sprawling diffs) when DeepSeek doesn't fit |

Switch mid-session with the `/model [name]` slash command. Per-dispatch override via `--model <id>`.

### Reasoning Effort

Devin does not expose a `--reasoning-effort` flag. Model choice is the lever — switch from SWE-1.6 to DeepSeek v4 when the task becomes complex; fall back to GLM 5.1 or Kimi k2.6 when DeepSeek doesn't fit.

---

## 6. PERMISSION MODES

| Mode | Behavior | Operator Approval | Family Analog |
|------|----------|-------------------|---------------|
| `auto` (default) | Confirms risky actions; pauses for input on destructive ops | Default | Codex `--ask-for-approval on-request` |
| `dangerous` | Auto-approves all actions; no prompts | REQUIRED — record in dispatch log | `--dangerously-skip-permissions` / `--sandbox danger-full-access` |

The skill MUST NOT silently escalate. Operator must explicitly approve `dangerous`.

---

## 7. INTERACTIVE SLASH COMMANDS

Available inside the live `devin` TUI. Not callable from a single-shot dispatch.

### Mode Switching
- `/mode [mode]` — display or change operation mode (verified)
- `/plan` — read-only planning mode (no edits) (verified)
- Permission mode is set via `--permission-mode auto|dangerous` at dispatch time, OR may be adjustable mid-session via `/mode` — confirm against the live `/help` output in your installed binary version.

### Conversation Control
- `/clear` — reset session and history
- `/fork [step]` — create a branch from the current session at the given step
- `/revert <step>` — undo changes from the specified step
- `/steps` — view conversation history points

### Utilities
- `/ask <question>` — query without code modifications (read-only response)
- `/model [name]` — switch AI model mid-session
- `/context` — monitor token usage
- `/help` — list available slash commands

---

## 8. OUTPUT FORMAT

Devin's default output is human-readable text streamed to stdout. The official commands reference does NOT document a top-level `--json` flag for structured output as of 2026-05-15.

> **UNVERIFIED**: Web-search hits suggested a global `--json` flag exists. The official `cli.devin.ai/docs/reference/commands` page does not list it. Treat Devin output as free-form text unless empirically confirmed against your installed version (`devin --help` will surface the flag if present).

If structured output is required, prompt the dispatched session to emit a deterministic block (e.g. JSON between explicit `BEGIN_JSON` / `END_JSON` markers) and parse from there.

---

## 9. STATE LOCATION

- Config file: `~/.config/devin/config.json` (override via `--config <path>`)
- Sessions: location not publicly documented at v0.x; the skill probes `~/.config/devin/sessions/<id>/lock` speculatively for the self-invocation guard with a `TODO verify` comment

---

## 10. VERSION DRIFT

Recheck the official commands reference periodically. Failure modes specific to drift:
- Flag name changes (e.g. `--permission-mode` rename) → `devin` returns "unknown flag" error
- New permission mode added → not among the 2 permission modes this skill documents
- Model preset changes (Cognition rotates SWE-x versions) → `--model <id>` returns "unknown model"
- Cloud-handoff entry point moves — currently operator-initiated from live TUI

When drift is observed, update this file AND the SKILL.md Default Invocation block. Update the changelog accordingly.

---

## 11. TROUBLESHOOTING

See [README.md §7 TROUBLESHOOTING](../README.md#7--troubleshooting) for the user-facing troubleshooting table. This file documents only surface-map issues:

| Symptom | Likely Cause |
|---------|--------------|
| `unknown flag --permission-mode` | Surface drift; flag renamed in newer CLI |
| `unknown model <id>` | Model preset rotated; check `devin --help` |
| `/json` slash command not recognized | Slash command list drifted; check `/help` |
| Cloud handoff entry point not in `/help` | Cloud handoff is initiated from the TUI menu, not a slash command, as of v0.x |

---

## 12. RELATED RESOURCES

- [SKILL.md](../SKILL.md) — Smart router, self-invocation guard, Default Invocation
- [integration_patterns.md](./integration_patterns.md) — 3 calling-AI dispatch patterns
- [devin_tools.md](./devin_tools.md) — Capability comparison vs sibling CLIs
- [cloud_handoff.md](./cloud_handoff.md) — Local→cloud narrative + operator gate
- [agent_delegation.md](./agent_delegation.md) — (model, permission-mode, prompt-file) routing
