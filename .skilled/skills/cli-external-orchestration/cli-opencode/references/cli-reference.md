---
title: "OpenCode CLI - Complete Command Reference"
description: "Comprehensive reference for OpenCode CLI subcommands, flags, models, configuration, agent flags, sandbox boundaries, and troubleshooting. Covers OpenCode 1.19.3 and 2.0.32."
trigger_phrases:
  - "opencode cli reference"
  - "opencode run flags"
  - "opencode model selection"
  - "opencode provider auth pre-flight"
  - "opencode variant reasoning effort"
  - "opencode version drift"
importance_tier: important
contextType: implementation
version: 1.4.14.0
---

# OpenCode CLI - Complete Command Reference

Comprehensive reference for the OpenCode CLI binary, every subcommand the cli-opencode skill dispatches against, the flag set it relies on, the agent surface it can target and the failure modes that need explicit handling. Version baselines: OpenCode 1 at 1.19.3 and OpenCode 2 at 2.0.32.

---

## 1. OVERVIEW

### Core Principle

OpenCode is the framework that owns this repository. The same binary that hosts the operator's TUI session also accepts non-interactive invocations through `opencode run`. The cli-opencode skill calls `opencode run` from external runtimes (Claude Code, OpenCode, Copilot, raw shell) so the calling AI can dispatch a task into a fresh OpenCode session that loads the full plugin, skill, and MCP runtime.

### Purpose

Provide a single-source reference for the OpenCode CLI surface: every subcommand cli-opencode invokes, every flag it pins, every agent it can route to, the version baselines it is built against and the error envelopes that need explicit recovery.

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
| **Version baseline** | OpenCode 1: 1.19.3 |
| **Version baseline** | OpenCode 2: 2.0.32 |
| **Runtime** | Node.js 18+ for the npm install path or the standalone binary on macOS |

**Verified versions.** Verified against OpenCode 1.19.3 and 2.0.32 on 2026-10-19. Loads and runs on both, with a documented capability delta. Later versions are unsupported until re-verified. The delta is in [`install-and-versions.md`](./install-and-versions.md).

---

## 2. INSTALLATION

| Method | Command | Notes |
|--------|---------|-------|
| **Standalone** | `curl -fsSL https://opencode.ai/install \| bash` | macOS / Linux installer |
| **Homebrew** | `brew install opencode` | macOS package manager |
| **npm global** | `npm install -g opencode-ai` | Cross-platform when Node.js 18+ is present |
| **Upgrade** | `opencode upgrade [target]` | Pin a specific version with the `target` argument |
| **Uninstall** | `opencode uninstall` | Removes the binary and related state |

After installation, run `opencode --version` to confirm. The cli-opencode skill is pinned to two baselines: OpenCode 1 at 1.19.3 and OpenCode 2 at 2.0.32. Newer binaries may add or rename flags, so consult Section 9 (Version Drift) before relying on a non-pinned flag.

---

## 3. SUBCOMMAND MAP

OpenCode exposes a multi-subcommand surface. The cli-opencode skill primarily invokes `run`, with secondary use of `serve`, `web`, `agent`, and `debug`.

| Subcommand | Purpose | Invoked by cli-opencode |
|------------|---------|-------------------------|
| `opencode` (default) | Start the TUI in the current project | No (interactive only) |
| `opencode run [message..]` | Non-interactive single-shot dispatch | YES (canonical use case) |
| `opencode serve` | Start a headless server | YES (for parallel detached sessions) |
| `opencode web` | Start a server plus open the web interface | YES (when the operator wants a browser surface) |
| `opencode acp` | Start an ACP (Agent Client Protocol) server | No (specialized integration path) |
| `opencode attach <url>` | Attach to a running OpenCode server | YES (to attach to a running server started with opencode serve) |
| `opencode agent` | Manage agent definitions | YES (for agent listing) |
| `opencode debug` | Debugging and troubleshooting tools | YES (for `debug skill` and `debug agent` listings) |
| `opencode mcp` | Manage MCP server registrations | No |
| `opencode providers` (alias `auth`) | Manage AI providers and credentials | No (operator-driven setup) |
| `opencode models [provider]` on OpenCode 1 | List available models (OpenCode 1; on OpenCode 2 `opencode2 models --standalone`, which takes no provider argument) | YES (for capability discovery) |
| `opencode session` | Manage sessions | No (state inspection only) |
| `opencode export [sessionID]` | Export session data as JSON | YES (for memory handback flows) |
| `opencode stats` | Token and cost statistics | No |
| `opencode db` | Database tools | No |
| `opencode plugin <module>` (alias `plug`) | Install a plugin | No (operator-driven setup) |
| `opencode upgrade [target]` | Upgrade the binary | No (operator-driven) |
| `opencode uninstall` | Uninstall the binary | No (operator-driven) |

---

## 4. `opencode run` FLAGS

`opencode run [message..]` is the canonical non-interactive entry point. The cli-opencode skill builds every dispatch around this subcommand.

### Core flags

The table gives the OpenCode 1 (1.19.3) form of each flag. The OpenCode 2 column gives the 2.0.32 counterpart, says when the flag is absent on `run` or is a global flag there. The full per-version flag delta and the side-by-side layouts are in [install-and-versions.md](./install-and-versions.md).

| Flag / Option | Type | Purpose | OpenCode 2 |
|---------------|------|---------|------------|
| `[message..]` | positional | One or more positional message strings. Place the message before variadic `-f` flags | same |
| `--print-logs` | boolean | Stream logs to stderr | global flag on 2.0.32 |
| `--log-level` | enum | `DEBUG`, `INFO`, `WARN`, `ERROR` | global flag on 2.0.32, lowercase all, trace, debug, info, warn, warning, error, fatal, none |
| `--pure` (OpenCode 1 only) | boolean | Run without external plugins (skill loads disabled) | absent on `run` |
| `--command` (OpenCode 1 only) | string | Run a known command, the message becomes its args | No `run` flag. A registered command runs through the server API (`POST /api/session/{id}/command`) |
| `-c`, `--continue` | boolean | Continue the last session in this project | same |
| `-s`, `--session` | string | Continue a specific session id | same |
| `--fork` | boolean | Fork before continuing. It requires `--continue` or `--session` | same |
| `--share` (OpenCode 1 only) | boolean | Hidden and deprecated on 1.19.3: prints "Session sharing has been discontinued" and publishes nothing. Never pass it | absent on `run` |
| `-m`, `--model` | string | Provider/model selector, e.g. `opencode-go/deepseek-v4.1-flash` | `-m provider/model#<level>` (model and effort in one flag) |
| `--agent` | string | Agent slug (loads from `.opencode/agents/<slug>.md`, which links to `.skilled/agents/` in this repository) | listed. Runs the session as that agent, `general` included. An unknown slug exits 1 |
| `--format` | enum | `default` (formatted) or `json` (raw event stream) | same |
| `-f`, `--file` | array | Attach files to the message. The positional message must come first | listed as a single string on 2.0.32 (`--file, -f string`); whether it repeats is unverified, so pass one file per flag |
| `--title` | string | Session title (truncated message used when omitted) | same |
| `--attach` (OpenCode 1 only) | string | Attach to a running OpenCode server URL | `--server <url>` |
| `-p`, `--password` | string | Basic auth password (or `OPENCODE_SERVER_PASSWORD`) | absent on `run` |
| `--dir` (OpenCode 1 only) | string | Working directory or remote-server path | No `--dir`. Start in the directory: `cd <path> && opencode2 run ...` |
| `--port` (OpenCode 1 only) | number | Local server port (random when omitted) | absent on `run` |
| `--variant` (OpenCode 1 only) | string | Provider-specific reasoning effort (`high`, `max`, `minimal`, etc.) | No `--variant`. Effort rides in the model selector: `-m provider/model#<level>` |
| `--thinking` | boolean | Show thinking blocks (default false) | same |
| `-u`, `--username` (OpenCode 1 only) | string | Basic auth username (or `OPENCODE_SERVER_USERNAME`, default `opencode`) | absent on `run` |
| `-i`, `--interactive` (OpenCode 1 only) | boolean | Direct interactive split-footer mode (default false) | absent on `run` |
| `--auto` | boolean | Auto-approve permissions that are not explicitly denied. Dangerous | same |
| — | — | Run with a private server instead of the background service | `--standalone` (boolean) |

> **Message/file ordering:** Because `[message..]` is variadic, put the prompt before every `-f`/`--file` flag: `opencode run "prompt" -f /path/to/file`. Putting `-f` first can make the parser consume the prompt as another file argument.

> **`--command` semantics (OpenCode 1 only, verified on v1.17.4):** the `run` message is plain text. Slash-command syntax inside it (`opencode run "/speckit:search query"`) is NOT expanded, so the command's template never reaches the model. Executing a registered command non-interactively requires `--command <family>/<name>` with the args as the message (they become `$ARGUMENTS`). Registry names are slash-namespaced (`speckit/search` for `/speckit:search`). A wrong name fails with the full registry list. Behavior probes of slash commands MUST use `--command`. The raw-text form only measures the model freestyling without the contract. Consequences: (a) any behavior/adherence probe of a slash command MUST use `--command`, and the raw-text form is only valid as a labeled negative control. (b) Inside `` !`…` `` template injections `$ARGUMENTS` expands like `"$@"`, one word per argument, so renderer scripts must join argv themselves. On OpenCode 2 there is no `run` flag for a registered command: the command runs through the server API (`POST /api/session/{id}/command`).

### cli-opencode default invocation shape

The skill builds every dispatch from a base shape and overlays use-case-specific flags. The base shape on each version:

```bash
# OpenCode 1 only
opencode run \
  --model opencode-go/deepseek-v4.1-flash \
  --agent <agent-slug> \
  --variant max \
  --format json \
  --dir "$REPO_ROOT" \
  "<prompt>"
```

```bash
# OpenCode 2
cd "$REPO_ROOT" && opencode2 run --standalone \
  --agent <agent-slug> \
  -m opencode-go/deepseek-v4.1-flash#max \
  --format json \
  "<prompt>"
```

On OpenCode 1 the working directory rides in `--dir`. On OpenCode 2 it moves into the `cd`. The `--variant max` effort becomes the `#max` suffix on `-m`. A child dispatch adds `--standalone`. On this machine OpenCode 2 lists no `opencode-go` provider, so a v2 reader confirms that `opencode2 models --standalone` lists ids under the `opencode-go/` prefix first (a 2.0.32 run used `llmgateway/deepseek-v4.1-flash#max`).

| Flag | Default | Reason |
|------|---------|--------|
| `--model` | `opencode-go/deepseek-v4.1-flash` | The Go gateway fronts the latency-optimized flash model with max-tier-pinned reasoning. The operator may override it (e.g. `opencode-go/glm-5.3-flash` or any live OpenAI GPT-6 slug: `openai/gpt-6-sol`, `openai/gpt-6-sol-fast`, `openai/gpt-6-luna`, `openai/gpt-6-luna-fast`) |
| `--agent` | per use case | Required for use case 1 / 3, optional for use case 2 |
| `--variant max` (OpenCode 1 only) | max | Flash is max-tier-pinned by policy, so a lower requested effort is upgraded automatically. On OpenCode 2 the effort rides on `-m` as `#max` |
| `--format json` | json | Structured event stream is what external runtimes parse |
| `--dir` (OpenCode 1 only) | repo root | Pin the working directory to avoid CWD ambiguity. On OpenCode 2 there is no `--dir`, so start the dispatch in the repo root: `cd "$REPO_ROOT" && opencode2 run ...` |

### Stdin handling: `</dev/null` is required for non-interactive dispatch

> **On OpenCode 1 (v1.14.39), opencode reads stdin at startup before session creation.** If you redirect stdout/stderr to files in automation (`> stdout.log 2> stderr.log`), opencode hangs at 0% CPU after the `+60s snapshot prune cleanup` log line because stdin remains attached to the parent terminal and never receives EOF. The hang is observed on OpenCode 1, and whether OpenCode 2 shares it is unverified on OpenCode 2.0.32, so the redirect stays on both versions.

ALWAYS append `</dev/null` AFTER the prompt argument and BEFORE the stdout/stderr redirects:

```bash
opencode run --model X "<prompt>" </dev/null > stdout.log 2> stderr.log
#                                  ^^^^^^^^^^
#                                  redirects stdin from /dev/null → immediate EOF
```

Foreground `| tail` accidentally works because the upstream pipe stage provides closed stdin, but `> file 2> file` does not. See `references/integration-patterns.md` §6 for the full failure-mode + fix matrix and `../CHANGELOG-2026-05-08-tool-name-regex-fix.md` §Fix 4 for the discovery context.

### Sessions, share URLs, and ports

On OpenCode 1.19.3, `--share` is a hidden and deprecated option. Passing it prints `!  Session sharing has been discontinued` and the run carries on, but nothing is published and no URL is printed. OpenCode 2 `run` has no `--share` flag at all. No dispatch should pass `--share`.

On OpenCode 1, `--port` only matters when the dispatch needs to bind a known port (e.g. for a parallel detached session that another tool will attach to). The default random port is correct for one-shot dispatches. On OpenCode 2, `--port` is absent on `run` (see [install-and-versions.md](./install-and-versions.md)).

`--continue` and `--session <id>` reuse prior session state. `--fork` branches an existing session into a new one. cli-opencode uses session continuation in memory handback flows where the calling AI wants to thread context across multiple delegations.

### Provider Auth Pre-Flight (smart fallback)

Before the first dispatch in a session, run a one-shot auth pre-flight so a missing default doesn't fail mid-dispatch. On OpenCode 1, `opencode models <provider-id>` exits 0 when the provider is configured and 1 when it is not. OpenCode 2 (2.0.32) rejects that form with `Unexpected positional argument`, so list with `opencode2 models --standalone` and filter for the `<provider-id>/` prefix; `--standalone` runs a private server instead of asking the shared background service. Do not grep `opencode providers list` for ids: it prints display names such as `OpenCode Go` and `DevPass (LLM Gateway)`. Cache the result for the session and re-run it only on auth failure.

Run the block for the version you are about to dispatch. A v2-only layout names its binary `opencode`; use the OpenCode 2 block there and replace `opencode2` with `opencode`.

```bash
# OpenCode 1 pre-flight: one check per provider id, once per session
opencode models opencode-go         >/dev/null 2>&1 && OPENCODE_GO_OK=1    || OPENCODE_GO_OK=0     # OpenCode 1: OpenCode Go gateway (default — fronts DeepSeek V4 Flash, Qwen, GLM)
opencode models minimax-coding-plan >/dev/null 2>&1 && MINIMAX_TOKEN_OK=1  || MINIMAX_TOKEN_OK=0   # OpenCode 1: MiniMax Token Plan (default MiniMax path)
opencode models minimax             >/dev/null 2>&1 && MINIMAX_DIRECT_OK=1 || MINIMAX_DIRECT_OK=0  # OpenCode 1: MiniMax Direct API (pay-per-token)
opencode models llmgateway          >/dev/null 2>&1 && LLMGATEWAY_OK=1    || LLMGATEWAY_OK=0      # OpenCode 1: LLM Gateway (DevPass); the only MiMo route
echo "default=$OPENCODE_GO_OK minimax_token=$MINIMAX_TOKEN_OK minimax_direct=$MINIMAX_DIRECT_OK llmgateway=$LLMGATEWAY_OK"
```

```bash
# OpenCode 2 pre-flight: `models` takes no provider argument, so list once on a private server and filter per provider
V2_MODELS=$(opencode2 models --standalone 2>/dev/null)
printf '%s\n' "$V2_MODELS" | grep '^opencode-go/' >/dev/null && OPENCODE_GO_OK=1 || OPENCODE_GO_OK=0  # OpenCode Go gateway (2.0.32 lists none here)
printf '%s\n' "$V2_MODELS" | grep '^llmgateway/'  >/dev/null && LLMGATEWAY_OK=1  || LLMGATEWAY_OK=0   # LLM Gateway (DevPass); the only MiMo route
MINIMAX_TOKEN_OK=0; MINIMAX_DIRECT_OK=0                                                               # 2.0.32 lists no minimax provider
echo "default=$OPENCODE_GO_OK minimax_token=$MINIMAX_TOKEN_OK minimax_direct=$MINIMAX_DIRECT_OK llmgateway=$LLMGATEWAY_OK"
```

| State | OPENCODE_GO_OK | Action |
|-------|----------------|--------|
| Default available | 1 | Proceed with `--model opencode-go/deepseek-v4.1-flash --variant max` on OpenCode 1 or `-m opencode-go/deepseek-v4.1-flash#max` on OpenCode 2 (confirm that `opencode2 models --standalone` lists ids under the `opencode-go/` prefix first) |
| Default missing | 0 | **ASK user** before substituting (offer A: openai/gpt-6-sol, B: set up `opencode-go` and retry, C: name a different model). Do not dispatch until configured |

**MiniMax routing** (default = Token Plan, Direct API is the pay-per-token alternative):

| State | Condition | Action |
|-------|-----------|--------|
| MiniMax requested (default) | `MINIMAX_TOKEN_OK=1` | Proceed with `--model minimax-coding-plan/MiniMax-M3` and **omit `--agent`** (rejected on opencode 1.15.13) |
| Token Plan not configured | `MINIMAX_TOKEN_OK=0` | **ASK user** to run `opencode auth login` → MiniMax Token Plan. Never substitute silently |
| Direct API explicitly requested | `MINIMAX_DIRECT_OK=1` | Proceed with `--model minimax/MiniMax-M3` (pay-per-token, confirm the live id via `opencode models minimax` on OpenCode 1) |
| Direct API requested, not configured | `MINIMAX_DIRECT_OK=0` | **ASK user** to configure the `minimax` provider (`MINIMAX_API_KEY`). Do not substitute silently |

**MiMo routing** (LLM Gateway only, the Xiaomi Direct API and Token Plan routes are not on this roster):

| State | Condition | Action |
|-------|-----------|--------|
| MiMo requested | `LLMGATEWAY_OK=1` | Proceed with `--model llmgateway/mimo-v2.6-pro --variant high` on OpenCode 1 or `-m llmgateway/mimo-v2.6-pro#high` on OpenCode 2. **Omit `--agent`** (`--agent general` warns and falls back on opencode 1.15.13). Confirm the live id via `opencode models llmgateway` on OpenCode 1 or `opencode2 models --standalone` filtered for `llmgateway/` on OpenCode 2 |
| LLM Gateway not configured | `LLMGATEWAY_OK=0` | **ASK user** to run `opencode auth login` → DevPass (LLM Gateway). Never substitute silently |

**Login / setup command shapes** (the AI surfaces these to the user, who runs them in their own terminal):

```bash
# Recommended default — OpenCode Go gateway
opencode providers login opencode-go

# MiniMax Token Plan — DEFAULT MiniMax path (subscription). Interactive: pick "MiniMax Token Plan (minimax.io)".
opencode auth login          # → provider minimax-coding-plan; Anthropic-compatible https://api.minimax.io/anthropic/v1 (China: api.minimaxi.com)

# MiniMax Direct API — pay-per-token alternative (needs MINIMAX_API_KEY; platform endpoint https://api.minimax.io/v1)
opencode providers login minimax

# LLM Gateway (DevPass) — the only MiMo route. Interactive: pick "DevPass (LLM Gateway)".
opencode auth login          # → provider llmgateway; model llmgateway/mimo-v2.6-pro

# Z.AI GLM Coding Plan — GLM coding subscription. Interactive: pick "Z.AI Coding Plan".
opencode auth login          # → provider zai-coding-plan; model zai-coding-plan/glm-5.2
```

> Do not mix region endpoints (international `minimax.io` vs China `minimaxi.com`). Confirm live model ids with `opencode models minimax-coding-plan` on OpenCode 1 (OpenCode 2 lists no minimax provider). Confirm live LLM Gateway slugs with `opencode models llmgateway` on OpenCode 1, or `opencode2 models --standalone` filtered for `llmgateway/` on OpenCode 2.

**On auth-error mid-dispatch** (`401 Unauthorized`, `provider/model not found`): invalidate the cache, rerun the pre-flight, and apply the same decision tree before retrying. Never substitute a model the user didn't approve.

### User-facing prompt templates

Surface these verbatim to the operator when the pre-flight decision tree lands on "ASK user" (default missing with a fallback configured, or all providers missing). Never dispatch until the operator responds.

**Default missing, fallback configured:**

```text
The skill default `opencode-go/deepseek-v4.1-flash` is not configured on this machine.
A configured fallback is available. Pick one:
  A) Use `openai/gpt-6-sol --variant high` on OpenCode 1 or `-m openai/gpt-6-sol#high` on OpenCode 2 (OpenAI flagship persona, configured now, paid)
  B) Use `llmgateway/mimo-v2.6-pro --variant high` on OpenCode 1 or `-m llmgateway/mimo-v2.6-pro#high` on OpenCode 2 (MiMo through DevPass LLM Gateway, configured now, per token)
  C) Use `kimi-for-coding/k2p7` (Kimi For Coding plan, configured now — subscription)
  D) Run `opencode providers login opencode-go` first, then retry the original dispatch
  E) Name a different model — paste the `--model <provider/model>` you want to use
```

**All providers missing:**

```text
No supported providers are configured on this machine. Run one:
  - `opencode providers login opencode-go`  (recommended — default for cli-opencode; fronts deepseek-v4.1-flash)
  - `opencode auth login`                   (MiniMax Token Plan — default MiniMax path; pick "MiniMax Token Plan (minimax.io)" → provider minimax-coding-plan; model minimax-coding-plan/MiniMax-M3)
  - `opencode providers login minimax`      (MiniMax Direct API — pay-per-token; needs MINIMAX_API_KEY; model minimax/MiniMax-M3)
  - `opencode auth login`                   (LLM Gateway — pick "DevPass (LLM Gateway)" → provider llmgateway; the default MiMo route, model llmgateway/mimo-v2.6-pro or llmgateway/mimo-v2.6-flash)
  - `opencode auth login`                   (Kimi For Coding plan — Kimi/Moonshot coding subscription; provider kimi-for-coding; model kimi-for-coding/k2p7)
  - `opencode auth login`                   (Z.AI GLM Coding Plan — GLM coding subscription; provider zai-coding-plan; model zai-coding-plan/glm-5.2)
  - `opencode providers login openai`       (OpenAI premium alternative — paid)
  - `opencode auth login`                   (Cline — Cline Pass account; provider cline-pass, NOT cline; model form cline-pass/cline-pass/<id>, e.g. cline-pass/cline-pass/deepseek-v4.1-flash)
Which would you like to set up? Confirm when login finishes; the skill will retry the original dispatch.
```

**Error-recovery contract.** If a dispatch returns an auth error after pre-flight passed (credential expired or rotated), invalidate the cache, rerun the pre-flight, and apply the same decision tree before retrying. Never substitute a model the user didn't approve.

---

## 5. MODEL SELECTION

On OpenCode 1 the default model is `opencode-go/deepseek-v4.1-flash --variant max` (Go gateway, with flash max-tier-pinned by policy). On OpenCode 2 the same default is `-m opencode-go/deepseek-v4.1-flash#max`, once the provider is confirmed in `opencode2 models --standalone`. Reasoning effort is expressed through the `--variant` flag on OpenCode 1, which maps to a provider-specific effort scale. The model string is always `provider/model-id`. `opencode models <provider>` lists the live options on OpenCode 1; on OpenCode 2, list with `opencode2 models --standalone` and filter for the `<provider>/` prefix.

**Full provider/model roster, the GPT-6 slug grid and the per-provider effort map (`--variant` levels on OpenCode 1, `-m provider/model#<level>` on OpenCode 2) → [providers-and-models.md](./providers-and-models.md).**

---

## 6. AGENT FLAG

`--agent <slug>` loads an agent definition from `.opencode/agents/<slug>.md`, which in this repository links to `.skilled/agents/`, where the files are edited. The agent definition's frontmatter pins the model, tool permissions, and system prompt that shape the dispatch.

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

The cli-opencode skill defers to the calling AI on agent selection. See `references/agent-delegation.md` for the routing matrix and `assets/prompt-templates.md` for canonical invocation shapes.

---

## 7. OUTPUT FORMAT AND EVENT STREAM

`--format default` produces a human-formatted log. `--format json` emits a newline-delimited JSON event stream.

### JSON event shape (OpenCode 1.19.3 and OpenCode 2.0.32)

Each line is a JSON object with at minimum:

| Field | Meaning |
|-------|---------|
| `type` | Event type (`step_start`, `tool_use`, `text`, `step_finish`) |
| `timestamp` | Unix time in milliseconds, as a number |
| `sessionID` | The session id assigned by OpenCode |
| `part` | Type-specific payload |

External runtimes parse the stream incrementally to surface tool calls, partial messages and the final summary. cli-opencode prompt templates always pass `--format json` so the calling AI parses structured events instead of guessing format boundaries. The two versions emit the same event names.

---

## 8. STATE LOCATION AND SHARE URLS

### State directory

OpenCode persists session state in a shared SQLite database and storage tree under `~/.local/share/opencode/`:

- `opencode.db` (`-shm`/`-wal` companions): the session/message database
- `storage/`: per-session structured artifacts
- `snapshot/`: working-tree snapshots

There is no per-session directory under `~/.opencode/state/<sessionID>/` on a standard install, so that path does not exist on this runtime layout. To inspect a specific session, use `opencode export <sessionID>` (§3) rather than reading files from a state directory. The cli-opencode self-invocation guard's Layer 3 lock-file probe (`~/.opencode/state/<id>/lock`, per ADR-001) targets the older path as a best-effort third layer on top of the env-var and process-ancestry checks. Treat it as a heuristic, not a verified-present artifact, on installs where `~/.opencode/state/` does not exist.

### Share URLs

On OpenCode 1.19.3, `--share` is a hidden, deprecated option. It prints `!  Session sharing has been discontinued`, publishes nothing and prints no URL. OpenCode 2 `run` has no `--share` flag at all, so no dispatch passes it and there is no share URL to publish.

---

## 9. VERSION DRIFT

This reference is pinned to OpenCode 1 at 1.19.3 and OpenCode 2 at 2.0.32. If the live binary reports a different version, do the following:

1. Run `opencode run --help` and diff the flag list against Section 4.
2. Run `opencode --help` and diff the subcommand list against Section 3.
3. If a flag was renamed, prefer the new name in the dispatch. If a flag was removed, fall back to the closest analogue and surface the drift in the calling AI's response.
4. If the operator's machine has a major version bump (v1.4+, v2.x), re-validate the entire skill against the new flag table and bump the cli-opencode minor version.

### Failure modes specific to drift

| Symptom | Likely cause |
|---------|--------------|
| `unknown option --variant` (OpenCode 1 only) | v1.2 or earlier, when the variant flag was named `--reasoning`. On OpenCode 2 the effort rides on the model id instead (`-m provider/model#<level>`) |
| `"!  Session sharing has been discontinued" on stderr (OpenCode 1 only)` | `--share` was passed; on 1.19.3 it is a deprecated no-op. Drop the flag. OpenCode 2 `run` has no `--share` |
| `unknown option --format json` | v1.0, when the JSON event stream was the default and the flag did not exist |
| `MODULE_NOT_FOUND` | Plugin loader crash, so rerun with `--pure` (OpenCode 1 only) to bypass plugins |

---

## 10. TROUBLESHOOTING

| Symptom | Cause | Fix |
|---------|-------|-----|
| `command not found: opencode` | Binary not on PATH | Install via standalone installer or `brew install opencode` |
| `OPENCODE_SERVER_PASSWORD required` | Server enforces basic auth | Pass `-p <password>` or set the env var |
| `provider/model not found` | Provider not configured | Run `opencode providers` to enumerate, then `auth login <provider>` |
| Empty output stream | `--format default` with non-TTY parent | Pass `--format json` and parse the event stream |
| Session never finishes | Tool call hung | Run `opencode export <sessionID>` and inspect the message log it returns |
| Plugin load crash | Misconfigured plugin | Rerun with `--pure` (OpenCode 1 only) to bypass all plugins |
| Self-invocation refused | cli-opencode detected an in-OpenCode runtime | Use a sibling cli-* skill or a fresh shell session. See ADR-001 |
| `--share` passed (OpenCode 1 only) | Nothing is published on 1.19.3, the flag only prints a warning | Drop the flag |

---

## 11. RELATED RESOURCES

- `./integration-patterns.md` - The three documented use cases and their copy-paste invocation shapes
- `./agent-delegation.md` - Agent routing matrix and invocation patterns
- `./opencode-tools.md` - Unique capabilities (full plugin/skill/MCP runtime, parallel detached sessions)
- `../assets/prompt-templates.md` - Copy-paste prompt templates per use case
- `../assets/prompt-quality-card.md` - Framework selection and CLEAR 5-check
- `../SKILL.md` - Skill entry point and smart router
