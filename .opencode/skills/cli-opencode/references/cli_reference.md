---
title: "OpenCode CLI - Complete Command Reference"
description: "Comprehensive reference for OpenCode CLI subcommands, flags, models, configuration, agent flags, sandbox boundaries, and troubleshooting. Pinned to v1.3.17."
---

# OpenCode CLI - Complete Command Reference

Comprehensive reference for the OpenCode CLI binary, every subcommand the cli-opencode skill dispatches against, the flag set it relies on, the agent surface it can target, and the failure modes that need explicit handling. Pinned to v1.3.17 baseline.

---

## 1. OVERVIEW

### Core Principle

OpenCode is the framework that owns this repository. The same binary that hosts the operator's TUI session also accepts non-interactive invocations through `opencode run`. The cli-opencode skill calls `opencode run` from external runtimes (Claude Code, Codex, Copilot, Gemini, raw shell) so the calling AI can dispatch a task into a fresh OpenCode session that loads the full plugin, skill, MCP, and Spec Kit Memory runtime.

### Purpose

Provide a single-source reference for the OpenCode CLI surface — every subcommand cli-opencode invokes, every flag it pins, every agent it can route to, the version baseline it is built against, and the error envelopes that need explicit recovery.

### When to Use

- Looking up an OpenCode CLI subcommand or flag during a delegation
- Selecting a model + variant + agent for a dispatch
- Confirming the version baseline before pinning a flag set
- Troubleshooting a failed `opencode run` invocation
- Confirming the self-invocation guard signal against the live binary

### Key Sources

| Source | URL |
|--------|-----|
| **Binary** | `$(command -v opencode)` (typically `~/.superset/bin/opencode` or another local bin path) |
| **Repository** | https://github.com/sst/opencode |
| **Version baseline** | v1.3.17 (pinned in this reference) |
| **Runtime** | Node.js 18+ for the npm install path; standalone binary on macOS |

## 2. INSTALLATION

| Method | Command | Notes |
|--------|---------|-------|
| **Standalone** | `curl -fsSL https://opencode.ai/install \| bash` | macOS / Linux installer |
| **Homebrew** | `brew install opencode` | macOS package manager |
| **npm global** | `npm install -g opencode-ai` | Cross-platform when Node.js 18+ is present |
| **Upgrade** | `opencode upgrade [target]` | Pin a specific version with the `target` argument |
| **Uninstall** | `opencode uninstall` | Removes the binary and related state |

After installation, run `opencode --version` to confirm. The cli-opencode skill is pinned to v1.3.17. Newer binaries may add or rename flags — consult Section 9 (Version Drift) before relying on a non-pinned flag.

## 3. SUBCOMMAND MAP

OpenCode exposes a multi-subcommand surface. The cli-opencode skill primarily invokes `run`, with secondary use of `serve`, `web`, `agent`, and `debug`.

| Subcommand | Purpose | Invoked by cli-opencode |
|------------|---------|-------------------------|
| `opencode` (default) | Start the TUI in the current project | No (interactive only) |
| `opencode run [message..]` | Non-interactive single-shot dispatch | YES (canonical use case) |
| `opencode serve` | Start a headless server | YES (for parallel detached sessions) |
| `opencode web` | Start a server plus open the web interface | YES (when the operator wants a browser surface) |
| `opencode acp` | Start an ACP (Agent Client Protocol) server | No (specialized integration path) |
| `opencode attach <url>` | Attach to a running OpenCode server | YES (for share-URL flows) |
| `opencode agent` | Manage agent definitions | YES (for agent listing) |
| `opencode debug` | Debugging and troubleshooting tools | YES (for `debug skill` and `debug agent` listings) |
| `opencode mcp` | Manage MCP server registrations | No |
| `opencode providers` (alias `auth`) | Manage AI providers and credentials | No (operator-driven setup) |
| `opencode models [provider]` | List available models | YES (for capability discovery) |
| `opencode session` | Manage sessions | No (state inspection only) |
| `opencode export [sessionID]` | Export session data as JSON | YES (for memory handback flows) |
| `opencode stats` | Token and cost statistics | No |
| `opencode db` | Database tools | No |
| `opencode plugin <module>` (alias `plug`) | Install a plugin | No (operator-driven setup) |
| `opencode upgrade [target]` | Upgrade the binary | No (operator-driven) |
| `opencode uninstall` | Uninstall the binary | No (operator-driven) |

## 4. `opencode run` FLAGS

`opencode run [message..]` is the canonical non-interactive entry point. The cli-opencode skill builds every dispatch around this subcommand.

### Core flags

| Flag / Option | Type | Purpose |
|---------------|------|---------|
| `[message..]` | positional | One or more positional message strings |
| `--print-logs` | boolean | Stream logs to stderr |
| `--log-level` | enum | `DEBUG`, `INFO`, `WARN`, `ERROR` |
| `--pure` | boolean | Run without external plugins (skill loads disabled) |
| `--command` | string | Run a known command, the message becomes its args |
| `-c`, `--continue` | boolean | Continue the last session in this project |
| `-s`, `--session` | string | Continue a specific session id |
| `--fork` | boolean | Fork before continuing — requires `--continue` or `--session` |
| `--share` | boolean | Publish a shareable URL for this session |
| `-m`, `--model` | string | Provider/model selector — e.g. `opencode-go/deepseek-v4-pro` |
| `--agent` | string | Agent slug (loads from `.opencode/agents/<slug>.md`) |
| `--format` | enum | `default` (formatted) or `json` (raw event stream) |
| `-f`, `--file` | array | Attach files to the message |
| `--title` | string | Session title (truncated message used when omitted) |
| `--attach` | string | Attach to a running OpenCode server URL |
| `-p`, `--password` | string | Basic auth password (or `OPENCODE_SERVER_PASSWORD`) |
| `--dir` | string | Working directory or remote-server path |
| `--port` | number | Local server port (random when omitted) |
| `--variant` | string | Provider-specific reasoning effort (`high`, `max`, `minimal`, etc.) |
| `--thinking` | boolean | Show thinking blocks (default false) |

### cli-opencode default invocation shape

The skill builds every dispatch from a base shape and overlays use-case-specific flags:

```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --agent <agent-slug> \
  --variant high \
  --format json \
  --dir "$REPO_ROOT" \
  "<prompt>"
```

| Flag | Default | Reason |
|------|---------|--------|
| `--model` | `opencode-go/deepseek-v4-pro` | OpenCode Go is the default provider — routes DeepSeek and other open models through one API gateway with elevated reasoning at low cost; operator may override (e.g. `opencode-go/deepseek-v4-flash`, `opencode-go/glm-5.1`, `deepseek/deepseek-v4-pro`, `openai/gpt-5.5`, `openai/gpt-5.5-pro`, `openai/gpt-5.5-fast`) |
| `--agent` | per use case | Required for use case 1 / 3; optional for use case 2 |
| `--variant high` | high | Routine cli-opencode dispatches benefit from elevated reasoning effort |
| `--format json` | json | Structured event stream is what external runtimes parse |
| `--dir` | repo root | Pin the working directory to avoid CWD ambiguity |

### Stdin handling — `</dev/null` is required for non-interactive dispatch

> **opencode v1.14.39 reads stdin at startup before session creation.** If you redirect stdout/stderr to files in automation (`> stdout.log 2> stderr.log`), opencode hangs at 0% CPU after the `+60s snapshot prune cleanup` log line because stdin remains attached to the parent terminal and never receives EOF.

ALWAYS append `</dev/null` AFTER the prompt argument and BEFORE the stdout/stderr redirects:

```bash
opencode run --model X "<prompt>" </dev/null > stdout.log 2> stderr.log
#                                  ^^^^^^^^^^
#                                  redirects stdin from /dev/null → immediate EOF
```

Foreground `| tail` accidentally works because the upstream pipe stage provides closed stdin, but `> file 2> file` does not. See `references/integration_patterns.md` §6 for the full failure-mode + fix matrix and `../CHANGELOG-2026-05-08-tool-name-regex-fix.md` §Fix 4 for the discovery context.

### Sessions, share URLs, and ports

`--share` publishes the session over the OpenCode share infrastructure. The skill ONLY appends `--share` for use case 2 (in-OpenCode parallel detached sessions). External-runtime dispatches do NOT publish share URLs by default.

`--port` only matters when the dispatch needs to bind a known port (e.g. for a parallel detached session that another tool will attach to). The default random port is correct for one-shot dispatches.

`--continue` and `--session <id>` reuse prior session state. `--fork` branches an existing session into a new one. cli-opencode uses session continuation in memory handback flows where the calling AI wants to thread context across multiple delegations.

### Provider Auth Pre-Flight (smart fallback)

Before the first dispatch in a session, run a one-shot auth pre-flight against `opencode providers list` so a missing default doesn't fail mid-dispatch. Cache the result for the session; only re-run on auth failure.

```bash
# Pre-flight — one call per session
PROVIDERS=$(opencode providers list 2>&1)
echo "$PROVIDERS" | grep -q "opencode-go"         && OPENCODE_GO_OK=1    || OPENCODE_GO_OK=0
echo "$PROVIDERS" | grep -q "deepseek"            && DEEPSEEK_OK=1       || DEEPSEEK_OK=0
echo "$PROVIDERS" | grep -q "minimax-coding-plan" && MINIMAX_TOKEN_OK=1  || MINIMAX_TOKEN_OK=0   # MiniMax Token Plan (default MiniMax path)
echo "$PROVIDERS" | grep -qE "minimax([^-]|$)"    && MINIMAX_DIRECT_OK=1 || MINIMAX_DIRECT_OK=0  # MiniMax Direct API (pay-per-token); regex skips the coding-plan provider
echo "$PROVIDERS" | grep -q "xiaomi-token-plan-ams" && XIAOMI_OK=1       || XIAOMI_OK=0          # Xiaomi Token Plan (Europe)
echo "default=$OPENCODE_GO_OK fallback=$DEEPSEEK_OK minimax_token=$MINIMAX_TOKEN_OK minimax_direct=$MINIMAX_DIRECT_OK xiaomi=$XIAOMI_OK"
```

| State | OPENCODE_GO_OK | DEEPSEEK_OK | Action |
|-------|----------------|-------------|--------|
| Default available | 1 | * | Proceed with `--model opencode-go/deepseek-v4-pro --variant high` |
| Default missing, fallback available | 0 | 1 | **ASK user** before substituting (offer A: deepseek/deepseek-v4-pro, B: login opencode-go and retry, C: name a different model) |
| All missing | 0 | 0 | **ASK user** to run `opencode providers login <provider>` — do not dispatch until configured |

**MiniMax routing** (default = Token Plan; Direct API is the pay-per-token alternative):

| State | Condition | Action |
|-------|-----------|--------|
| MiniMax requested (default) | `MINIMAX_TOKEN_OK=1` | Proceed with `--model minimax-coding-plan/MiniMax-M3-highspeed` — **omit `--agent`** (rejected on opencode 1.15.13). If M3-highspeed is unavailable, fall back to `minimax-coding-plan/MiniMax-M2.7-highspeed` |
| Token Plan not configured | `MINIMAX_TOKEN_OK=0` | **ASK user** to run `opencode auth login` → MiniMax Token Plan — never substitute silently |
| Direct API explicitly requested | `MINIMAX_DIRECT_OK=1` | Proceed with `--model minimax/MiniMax-M2.7` (pay-per-token; confirm the live id via `opencode models minimax`) |
| Direct API requested, not configured | `MINIMAX_DIRECT_OK=0` | **ASK user** to configure the `minimax` provider (`MINIMAX_API_KEY`) — do not substitute silently |

**MiMo routing** (Xiaomi Token Plan Europe; explicitly-selectable):

| State | Condition | Action |
|-------|-----------|--------|
| MiMo requested | `XIAOMI_OK=1` | Proceed with `--model xiaomi-token-plan-ams/mimo-v2.5-pro` — **omit `--agent`** (`--agent general` warns and falls back on opencode 1.15.13). Confirm the live id via `opencode models xiaomi-token-plan-ams` |
| Not configured | `XIAOMI_OK=0` | **ASK user** to run `opencode auth login` → Xiaomi Token Plan (Europe) — never substitute silently |

**Login / setup command shapes** (the AI surfaces these to the user; the user runs them in their own terminal):

```bash
# Recommended default
opencode providers login opencode-go

# Direct DeepSeek API (alternative)
opencode providers login deepseek

# MiniMax Token Plan — DEFAULT MiniMax path (subscription). Interactive: pick "MiniMax Token Plan (minimax.io)".
opencode auth login          # → provider minimax-coding-plan; Anthropic-compatible https://api.minimax.io/anthropic/v1 (China: api.minimaxi.com)

# MiniMax Direct API — pay-per-token alternative (needs MINIMAX_API_KEY; platform endpoint https://api.minimax.io/v1)
opencode providers login minimax

# Xiaomi Token Plan (Europe) — provider-managed endpoint. Interactive: pick "Xiaomi Token Plan (Europe)".
opencode auth login          # → provider xiaomi-token-plan-ams (Xiaomi Token Plan, Europe)
```

> Do not mix region endpoints (international `minimax.io` vs China `minimaxi.com`). Confirm live model ids with `opencode models minimax-coding-plan`. The Xiaomi endpoint is provider-managed (no documented base URL — do not invent one); confirm live model ids with `opencode models xiaomi-token-plan-ams`.

**On auth-error mid-dispatch** (`401 Unauthorized`, `provider/model not found`): invalidate the cache, rerun the pre-flight, and apply the same decision tree before retrying. Never substitute a model the user didn't approve.

## 5. MODEL SELECTION

OpenCode resolves models through configured providers. The cli-opencode skill supports `opencode-go` (default), `deepseek`, `minimax-coding-plan` (MiniMax Token Plan — default MiniMax path), `minimax` (MiniMax Direct API — pay-per-token alternative), and `xiaomi-token-plan-ams` (Xiaomi Token Plan Europe — MiMo, explicitly-selectable) — confirmed against `opencode providers list` and `opencode models`. Run `opencode models [provider]` for the full live list on a given install.

| Provider | Example model id | Use case |
|----------|------------------|----------|
| `opencode-go` (DEFAULT) | `opencode-go/deepseek-v4-pro` | Default — deep reasoning at low cost via OpenCode Go gateway |
| `opencode-go` | `opencode-go/deepseek-v4-flash` | Latency-optimized DeepSeek sibling |
| `opencode-go` | `opencode-go/glm-5.1` | Open-weight alternative |
| `opencode-go` | `opencode-go/kimi-k2.6` | Long-context Kimi via opencode-go |
| `opencode-go` | `opencode-go/qwen3.6-plus` | Qwen 3.6 routed through opencode-go |
| `deepseek` | `deepseek/deepseek-v4-pro` | Direct DeepSeek API — bypasses opencode-go |
| `deepseek` | `deepseek/deepseek-v4-flash` | Latency-optimized direct-API sibling |
| `minimax-coding-plan` (DEFAULT MiniMax) | `minimax-coding-plan/MiniMax-M3-highspeed` | MiniMax Token Plan (subscription) — default MiniMax dispatch; omit `--agent`; verify with `opencode models minimax-coding-plan` |
| `minimax-coding-plan` | `minimax-coding-plan/MiniMax-M2.7-highspeed` | Token Plan highspeed fallback (confirmed live); standard `minimax-coding-plan/MiniMax-M2.7` also resolves |
| `minimax` | `minimax/MiniMax-M2.7` | MiniMax Direct API — pay-per-token alternative; needs `MINIMAX_API_KEY` (`minimax-api` quota pool); confirm the live id via `opencode models minimax` |
| `xiaomi-token-plan-ams` | `xiaomi-token-plan-ams/mimo-v2.5-pro` | Xiaomi Token Plan (Europe) — MiMo-V2.5-Pro: 1M-token context, strongly agentic (1000+ tool calls), token-efficient; omit `--agent`; verify with `opencode models xiaomi-token-plan-ams` |
| `opencode-go` (free) | `opencode/mimo-v2.5-free` | Free MiMo gateway path (v2.5, not -pro) via the opencode-go gateway — cheap-iteration / probe path; shares the opencode-go credit pool |

`opencode models <provider>` lists every model id the provider exposes. The model string passed to `--model` is always `provider/model-id`.

### Reasoning effort via `--variant`

The `--variant` flag maps to provider-specific reasoning effort. Underlying-model conventions apply per provider routing.

| Provider | Variant values |
|----------|----------------|
| `opencode-go` | `--variant` accepted; effect depends on opencode-go routing per underlying model |
| `deepseek` (`deepseek-v4-pro`) | reasoning effort accepted |
| `deepseek` (`deepseek-v4-flash`) | non-reasoning — `--variant` ignored |
| `minimax-coding-plan` / `minimax` (MiniMax-M3 / M2.7) | `--variant` behavior unverified — omitted by default; confirm against the MiniMax API before relying on it |
| `xiaomi-token-plan-ams` (mimo-v2.5-pro) | `--variant` maps to MiMo reasoning effort (low/medium/high); **always use `--variant high`** (confirmed accepted on opencode 1.15.13) |

Default skill behavior: pass `--variant high` for cross-AI dispatches. Operators may override via the prompt template's variant field.

## 6. AGENT FLAG

`--agent <slug>` loads an agent definition from `.opencode/agents/<slug>.md` (project-local) or the user-level fallback. The agent definition's frontmatter pins the model, tool permissions, and system prompt that shape the dispatch.

### Discovering agents

| Command | What it shows |
|---------|---------------|
| `opencode agent list` | All registered agent slugs across project + user scopes |
| `opencode debug agent <slug>` | Resolved frontmatter and system prompt for a slug |
| `opencode debug skill <slug>` | Skill resolution for a slug if the agent loads one |

### Agent slugs in this repo

| Slug | Role |
|------|------|
| `general` | Implementation, default subagent |
| `context` | Read-only retrieval and search |
| `orchestrate` | Multi-agent coordination |
| `write` | Documentation generation |
| `review` | Code review and PR analysis |
| `debug` | Fresh-perspective debugging |
| `deep-research` | Iterative research loop executor |
| `deep-review` | Iterative code review loop executor |
| `ai-council` | Multi-strategy planning |
| `deep-improvement` | Agent improvement proposal mutator |

The cli-opencode skill defers to the calling AI on agent selection — see `references/agent_delegation.md` for the routing matrix and `assets/prompt_templates.md` for canonical invocation shapes.

## 7. OUTPUT FORMAT AND EVENT STREAM

`--format default` produces a human-formatted log. `--format json` emits a newline-delimited JSON event stream.

### JSON event shape (v1.3.17)

Each line is a JSON object with at minimum:

| Field | Meaning |
|-------|---------|
| `type` | Event type (`session.started`, `message.delta`, `tool.call`, `tool.result`, `session.completed`, ...) |
| `timestamp` | ISO 8601 UTC timestamp |
| `session_id` | The session id assigned by OpenCode |
| `payload` | Type-specific payload |

External runtimes parse the stream incrementally to surface tool calls, partial messages, and the final summary. cli-opencode prompt templates always pass `--format json` so the calling AI parses structured events instead of guessing format boundaries.

## 8. STATE LOCATION AND SHARE URLS

### State directory

OpenCode persists per-session state under `~/.opencode/state/<session_id>/`. This directory contains:

- `lock` — present while the session is live
- `messages.jsonl` — append-only message log
- `metadata.json` — session metadata (start time, model, agent, share URL)

The cli-opencode self-invocation guard probes this directory as the third-layer fallback signal (per ADR-001).

### Share URLs

`--share` publishes a session URL via OpenCode's share infrastructure. The skill ONLY appends `--share` for use case 2 (in-OpenCode parallel detached sessions). The CHK-033 P1 checklist item requires operator confirmation before publishing a share URL because the URL exposes the session contents.

## 9. VERSION DRIFT

This reference is pinned to OpenCode v1.3.17. If the live binary reports a different version, do the following:

1. Run `opencode run --help` and diff the flag list against Section 4.
2. Run `opencode --help` and diff the subcommand list against Section 3.
3. If a flag was renamed, prefer the new name in the dispatch. If a flag was removed, fall back to the closest analogue and surface the drift in the calling AI's response.
4. If the operator's machine has a major version bump (v1.4+, v2.x), re-validate the entire skill against the new flag table and bump the cli-opencode minor version.

### Failure modes specific to drift

| Symptom | Likely cause |
|---------|--------------|
| `unknown option --variant` | v1.2 or earlier — variant flag was named `--reasoning` |
| `unknown option --share` | Older standalone build without share infrastructure |
| `unknown option --format json` | v1.0 — JSON event stream was the default and the flag did not exist |
| `MODULE_NOT_FOUND` | Plugin loader crash; rerun with `--pure` to bypass plugins |

## 10. TROUBLESHOOTING

| Symptom | Cause | Fix |
|---------|-------|-----|
| `command not found: opencode` | Binary not on PATH | Install via standalone installer or `brew install opencode` |
| `OPENCODE_SERVER_PASSWORD required` | Server enforces basic auth | Pass `-p <password>` or set the env var |
| `provider/model not found` | Provider not configured | Run `opencode providers` to enumerate, then `auth login <provider>` |
| Empty output stream | `--format default` with non-TTY parent | Pass `--format json` and parse the event stream |
| Session never finishes | Tool call hung | Inspect `~/.opencode/state/<session_id>/messages.jsonl` |
| Plugin load crash | Misconfigured plugin | Rerun with `--pure` to bypass all plugins |
| Self-invocation refused | cli-opencode detected an in-OpenCode runtime | Use a sibling cli-* skill or a fresh shell session — see ADR-001 |
| `--share` URL leaks | Share infrastructure published a session containing secrets | Operator MUST confirm before publishing per CHK-033 |

## 11. RELATED RESOURCES

- `./integration_patterns.md` - The three documented use cases and their copy-paste invocation shapes
- `./agent_delegation.md` - Agent routing matrix and invocation patterns
- `./opencode_tools.md` - Unique capabilities (full plugin/skill/MCP runtime, parallel detached sessions)
- `../assets/prompt_templates.md` - Copy-paste prompt templates per use case
- `../assets/prompt_quality_card.md` - Framework selection and CLEAR 5-check
- `../SKILL.md` - Skill entry point and smart router
