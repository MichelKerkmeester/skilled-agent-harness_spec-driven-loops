---
title: "OpenCode CLI - Complete Command Reference"
description: "Comprehensive reference for OpenCode CLI subcommands, flags, models, configuration, agent flags, sandbox boundaries, and troubleshooting. Covers OpenCode 2.3.2, the only supported version."
trigger_phrases:
  - "opencode cli reference"
  - "opencode run flags"
  - "opencode model selection"
  - "opencode provider auth pre-flight"
  - "opencode effort suffix"
  - "opencode version drift"
importance_tier: important
contextType: implementation
version: 1.4.32.0
---

# OpenCode CLI - Complete Command Reference

Comprehensive reference for the OpenCode CLI binary, every subcommand the cli-opencode skill dispatches against, the flag set it relies on, the agent surface it can target and the failure modes that need explicit handling. Version baseline: OpenCode 2 at 2.3.2, the only supported version.

---

## 1. OVERVIEW

### Purpose

Provide a single-source reference for the OpenCode CLI surface: every subcommand cli-opencode invokes, every flag it pins, every agent it can route to, the version baseline it is built against and the error envelopes that need explicit recovery.

### When to Use

- Looking up an OpenCode CLI subcommand or flag during a delegation
- Selecting a model and agent for a dispatch
- Confirming the version baseline before pinning a flag set
- Troubleshooting a failed `opencode run` invocation
- Confirming the self-invocation guard signal against the live binary

### Core Principle

OpenCode is the framework that owns this repository. The same binary that hosts the operator's TUI session also accepts non-interactive invocations through `opencode run`. The cli-opencode skill calls `opencode run` from external runtimes (Claude Code, OpenCode, Copilot, raw shell) so the calling AI can dispatch a task into a fresh OpenCode session that loads the full plugin, skill, and MCP runtime.

### Key Sources

| Source | URL |
|--------|-----|
| **Binary** | `opencode`, the only supported name. The npm package is `@opencode/cli`, pinned at 2.3.2 |
| **Repository** | [sst/opencode](https://github.com/sst/opencode) |
| **Version baseline** | OpenCode 2: 2.3.2 |
| **Runtime** | Node.js 18+ for the npm install path or the standalone binary on macOS |

**Version baseline.** This reference is pinned to OpenCode 2 at 2.3.2, the only supported version. Flag and provider observations that name 2.0.32 were read on that release and have not been re-read on 2.3.2. Later versions are unsupported until re-verified. The install and upgrade path is in [`install-and-versions.md`](./install-and-versions.md).

**Version detection.** The resolvers (`.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` and `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`) probe `opencode` on `PATH`, or `OPENCODE_BIN` when it is set. A major-2 binary is family `v2`, a major-1 binary is reported as `unsupported`, and anything else is `unknown`. A deep-loop lineage refuses both labels. The dispatch guard applies every rule to a binary that is not supported and blocks only on a violation.

---

## 2. INSTALLATION

| Method | Command | Notes |
|--------|---------|-------|
| **Standalone** | `curl -fsSL https://opencode.ai/v2/install \| bash` | macOS / Linux installer |
| **Homebrew** | `brew install opencode` | macOS package manager |
| **npm global** | `npm install -g @opencode/cli@2.3.2` | Cross-platform when Node.js 18+ is present. The package is `@opencode/cli` and the binary it installs is `opencode` |
| **Upgrade** | `opencode upgrade [target]` | Pin a specific version with the `target` argument |
| **Uninstall** | `opencode uninstall` | Removes the binary and related state |

After installation, run `opencode --version` to confirm. The cli-opencode skill is pinned to OpenCode 2 at 2.3.2. Newer binaries may add or rename flags, so consult Section 9 (Version Drift) before relying on a non-pinned flag.

**Setup helper.** `scripts/opencode-setup.sh` takes exactly three modes: `v2` installs OpenCode 2 into the default prefix, `remove-v1` removes the earlier major version's package and launcher (database files are listed and left in place), and `check` reports what each name resolves to without changing anything. Exit codes are 0 for success, 1 for a refusal or failure, and 2 for a usage error. A machine that still carries the earlier major version needs one run of `opencode-setup.sh remove-v1`.

---

## 3. SUBCOMMAND MAP

OpenCode exposes a multi-subcommand surface. The cli-opencode skill primarily invokes `run`, with secondary use of `serve` and `debug`. OpenCode 2.3.2 has no `export`, `attach`, `web`, `db` or `agent` subcommand: each prints the top-level help instead (checked with `--help` on 2026-11-19). Session export lives under `opencode session export`.

| Subcommand | Purpose | Invoked by cli-opencode |
|------------|---------|-------------------------|
| `opencode` (default) | Start the TUI in the current project | No (interactive only) |
| `opencode run [message..]` | Non-interactive single-shot dispatch | YES (canonical use case) |
| `opencode serve` | Start a headless server | YES (for parallel detached sessions) |
| `opencode acp` | Start an ACP (Agent Client Protocol) server | No (specialized integration path) |
| `opencode debug agents` | List agent definitions | YES (for agent listing) |
| `opencode debug` | Debugging and troubleshooting tools | YES (for `debug agents`) |
| `opencode mcp` | Manage MCP server registrations | No |
| `opencode auth` | Manage AI providers and credentials | No (operator-driven setup) |
| `opencode models --standalone` | List available models. Takes no provider argument | YES (for capability discovery) |
| `opencode session` | Manage sessions (`list`, `delete`, `export`, `import`) | No (state inspection only) |
| `opencode session export [session]` | Export session data as JSON. `--sanitize` redacts transcript and file data | YES (for memory handback flows) |
| `opencode stats` | Token and cost statistics | No |
| `opencode plugin add <package>` | Install a plugin and add it to the global configuration (`list`, `check`, `update`, `remove` also exist) | No (operator-driven setup) |
| `opencode upgrade [target]` | Upgrade the binary | No (operator-driven) |
| `opencode uninstall` | Uninstall the binary | No (operator-driven) |

---

## 4. `opencode run` FLAGS

`opencode run [message..]` is the canonical non-interactive entry point. The cli-opencode skill builds every dispatch around this subcommand.

### Core flags

**`opencode run`:**

| Flag / Option | Type | Purpose |
|---------------|------|---------|
| `[message..]` | positional | One or more positional message strings. Place the message before variadic `-f` flags |
| `--standalone` | global flag | Run with a private server instead of the background service |
| `--server` | string | Attach to a running OpenCode server URL |
| `-c`, `--continue` | boolean | Continue the last session in this project |
| `-s`, `--session` | string | Continue a specific session id |
| `--fork` | boolean | Fork before continuing. It requires `--continue` or `--session` |
| `-w`, `--worktree` | optional string | Start a new session in a new git worktree, optionally with this name |
| `-m` | string | Provider/model selector, which carries effort in the same flag: `-m provider/model#<level>` |
| `--agent` | string | Agent slug (loads from `.opencode/agents/<slug>.md`, which links to `.skilled/agents/` in this repository). Runs the session as that agent. An unknown slug exits 1. `general` is a subagent on OpenCode 2.3.2, so omit `--agent` to run it |
| `--format` | enum | `default` (formatted) or `json` (raw event stream) |
| `-f`, `--file` | string | Attach files to the message. The positional message must come first. Listed as a single string on 2.3.0 (`--file, -f string`); whether it repeats is unverified, so pass one file per flag |
| `--title` | string | Session title (truncated message used when omitted) |
| `--archived` | boolean | Create the session archived so it stays out of session lists (useful for scripted or CI runs) |
| `--thinking` | boolean | Show thinking blocks (default false) |
| `--auto` | boolean | Auto-approve permissions that are not explicitly denied. Dangerous |
| `--print-logs` | global flag | Stream logs to stderr |
| `--log-level` | global enum | lowercase `all`, `trace`, `debug`, `info`, `warn`, `warning`, `error`, `fatal`, `none` |

The spawn directory carries the working directory, so `run` has no directory flag. Effort rides on `-m` as a `#<level>` suffix. `run` takes no port, password, username or interactive flag. A registered command runs through the server API (`POST /api/session/{id}/command`), not through a `run` flag. `--share` is not a `run` flag.

`--worktree` and `--archived` appear on 2.3.0's `run --help` and are absent from 2.1.4's. The skill passes neither; its dispatch shape starts in the target directory.

> **Message/file ordering:** Because `[message..]` is variadic, put the prompt before every `-f`/`--file` flag: `opencode run "prompt" -f /path/to/file`. Putting `-f` first can make the parser consume the prompt as another file argument.

> **Slash-command prompts (`v2-slash-prompt-route`, warn):** the `run` message is plain text. Slash-command syntax inside it (`opencode run "/speckit:search query"`) is NOT expanded, so the command's template never reaches the model. Send a registered command through `session.command` instead (`POST /api/session/{id}/command`). A behavior probe of a slash command that goes through `run` only measures the model freestyling without the contract.

### cli-opencode default invocation shape

The skill builds every dispatch from a base shape and overlays use-case-specific flags.

```bash
cd "$REPO_ROOT" && opencode run --standalone \
  --agent <agent-slug> \
  -m llmgateway/deepseek-v4.1-flash-1017#max \
  --format json \
  "<prompt>" </dev/null
```

The working directory moves into the `cd`, and the effort level rides on `-m` as the `#max` suffix. A child dispatch adds `--standalone`. `llmgateway/deepseek-v4.1-flash-1017` is the single default; a reader confirms that `opencode models --standalone` lists the `llmgateway/` prefix first.

| Flag | Default | Reason |
|------|---------|--------|
| `-m` | `llmgateway/deepseek-v4.1-flash-1017#max` | The DevPass LLM Gateway fronts the latency-optimized flash model, with max-tier effort as the `#max` suffix on the model id. The operator may override it (e.g. any live OpenAI GPT-6 slug: `openai/gpt-6-sol`, `openai/gpt-6-sol-fast`, `openai/gpt-6-luna`, `openai/gpt-6-luna-fast`, `openai/gpt-6.1-terra`, `openai/gpt-6.1-terra-fast`) |
| `--agent` | per use case | Required for use case 1 / 3, optional for use case 2 |
| `--format json` | json | Structured event stream is what external runtimes parse |

`run` has no directory flag, so every dispatch starts in the repo root: `cd "$REPO_ROOT" && opencode run ...`.

### Stdin handling: `</dev/null` is required for non-interactive dispatch

> **`stdin-redirect-required` (error).** Ad-hoc `opencode run` MUST close or redirect stdin (`</dev/null`). Omitting it can hang indefinitely at 0% CPU with zero output. The recorded hang is from OpenCode 1 (v1.14.39), and no OpenCode 2 reproduction is recorded, so the redirect stays required.

ALWAYS append `</dev/null` AFTER the prompt argument and BEFORE the stdout/stderr redirects:

```bash
opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max "<prompt>" </dev/null > stdout.log 2> stderr.log
#                                                                        ^^^^^^^^^^
#                                                                        redirects stdin from /dev/null → immediate EOF
```

Foreground `| tail` accidentally works because the upstream pipe stage provides closed stdin, but `> file 2> file` does not. See `references/integration-patterns.md` §6 for the full failure-mode + fix matrix.

### Sessions, share URLs, and ports

`--share` is not a `run` flag, so no dispatch passes it and there is no share URL to publish. `run` takes no port flag either; a detached session is started with `opencode serve` and reached with `--server <url>`.

`--continue` and `--session <id>` reuse prior session state. `--fork` branches an existing session into a new one. cli-opencode uses session continuation in memory handback flows where the calling AI wants to thread context across multiple delegations.

### Provider Auth Pre-Flight (smart fallback)

Before the first dispatch in a session, run a one-shot auth pre-flight so a missing default doesn't fail mid-dispatch. List with `opencode models --standalone` and filter for the `<provider-id>/` prefix, because `models` takes no provider argument. `--standalone` runs a private server instead of asking the shared background service. Do not grep `opencode auth list` for ids: it prints display names such as `OpenCode Go` and `DevPass (LLM Gateway)`. Cache the result for the session and re-run it only on auth failure.

```bash
# Pre-flight: `models` takes no provider argument, so list once on a private server and filter per provider
V2_MODELS=$(opencode models --standalone 2>/dev/null)
printf '%s\n' "$V2_MODELS" | grep '^llmgateway/'  >/dev/null && LLMGATEWAY_OK=1 || LLMGATEWAY_OK=0    # LLM Gateway (DevPass); the default route
printf '%s\n' "$V2_MODELS" | grep '^opencode-go/' >/dev/null && OPENCODE_GO_OK=1 || OPENCODE_GO_OK=0  # OpenCode Go gateway (2.0.32 lists none here unless logged in separately)
DEFAULT_OK=$LLMGATEWAY_OK                                                                             # the default is on LLM Gateway
MINIMAX_TOKEN_OK=0; MINIMAX_DIRECT_OK=0                                                               # 2.0.32 lists no minimax provider
echo "default=$DEFAULT_OK opencode_go=$OPENCODE_GO_OK minimax_token=$MINIMAX_TOKEN_OK minimax_direct=$MINIMAX_DIRECT_OK llmgateway=$LLMGATEWAY_OK"
```

| State | DEFAULT_OK | Action |
|-------|----------------|--------|
| Default available | 1 | Proceed with `-m llmgateway/deepseek-v4.1-flash-1017#max` (confirm that `opencode models --standalone` lists the `llmgateway/` prefix first) |
| Default missing | 0 | **ASK user** before substituting (offer A: openai/gpt-6-sol, B: set up the default provider `llmgateway` and retry, C: name a different model). Do not dispatch until configured |

**MiniMax routing** (default = Token Plan, Direct API is the pay-per-token alternative):

| State | Condition | Action |
|-------|-----------|--------|
| MiniMax requested (default) | `MINIMAX_TOKEN_OK=1` | Proceed with `-m minimax-coding-plan/MiniMax-M3` and **omit `--agent`** |
| Token Plan not configured | `MINIMAX_TOKEN_OK=0` | **ASK user** to run `opencode auth login` → MiniMax Token Plan. Never substitute silently |
| Direct API explicitly requested | `MINIMAX_DIRECT_OK=1` | Proceed with `-m minimax/MiniMax-M3` (pay-per-token, confirm the live id with `opencode models --standalone` filtered for the `minimax/` prefix) |
| Direct API requested, not configured | `MINIMAX_DIRECT_OK=0` | **ASK user** to configure the `minimax` provider (`MINIMAX_API_KEY`). Do not substitute silently |

**Login / setup command shapes** (the AI surfaces these to the user, who runs them in their own terminal):

```bash
# Default: LLM Gateway (DevPass). Interactive: pick "DevPass (LLM Gateway)".
opencode auth login llmgateway

# MiniMax Token Plan: DEFAULT MiniMax path (subscription). Interactive: pick "MiniMax Token Plan (minimax.io)".
opencode auth login          # → provider minimax-coding-plan; Anthropic-compatible https://api.minimax.io/anthropic/v1 (China: api.minimaxi.com)

# MiniMax Direct API: pay-per-token alternative (needs MINIMAX_API_KEY; platform endpoint https://api.minimax.io/v1)
opencode auth login minimax

# Z.AI GLM Coding Plan: GLM coding subscription. Interactive: pick "Z.AI Coding Plan".
opencode auth login          # → provider zai-coding-plan; model zai-coding-plan/glm-5.2
```

> Do not mix region endpoints (international `minimax.io` vs China `minimaxi.com`). Confirm live LLM Gateway slugs with `opencode models --standalone` filtered for the `llmgateway/` prefix.

**On auth-error mid-dispatch** (`401 Unauthorized`, `provider/model not found`): invalidate the cache, rerun the pre-flight, and apply the same decision tree before retrying. Never substitute a model the user didn't approve.

### User-facing prompt templates

Surface these verbatim to the operator when the pre-flight decision tree lands on "ASK user" (default missing with a fallback configured, or all providers missing). Never dispatch until the operator responds.

**Default missing, fallback configured:**

```text
The skill default is not configured on this machine (`llmgateway/deepseek-v4.1-flash-1017`).
A configured fallback is available. Pick one:
  A) Use `-m openai/gpt-6-sol#high` (OpenAI flagship persona, configured now, paid)
  B) Use `kimi-for-coding/k2p7` (Kimi For Coding plan, configured now: subscription)
  C) Run the default provider's login first (`opencode auth login llmgateway`), then retry the original dispatch
  D) Name a different model: paste the `-m <provider/model>` you want to use
```

**All providers missing:**

```text
No supported providers are configured on this machine. Run one:
  - `opencode auth login`                   (MiniMax Token Plan: default MiniMax path; pick "MiniMax Token Plan (minimax.io)" → provider minimax-coding-plan; model minimax-coding-plan/MiniMax-M3)
  - `opencode auth login minimax`           (MiniMax Direct API: pay-per-token; needs MINIMAX_API_KEY; model minimax/MiniMax-M3)
  - `opencode auth login`                   (LLM Gateway: pick "DevPass (LLM Gateway)" → provider llmgateway; the default route, model llmgateway/deepseek-v4.1-flash-1017)
  - `opencode auth login`                   (Kimi For Coding plan: Kimi/Moonshot coding subscription; provider kimi-for-coding; model kimi-for-coding/k2p7)
  - `opencode auth login`                   (Z.AI GLM Coding Plan: GLM coding subscription; provider zai-coding-plan; model zai-coding-plan/glm-5.2)
  - `opencode auth login openai`            (OpenAI premium alternative: paid)
Which would you like to set up? Confirm when login finishes; the skill will retry the original dispatch.
```

**Error-recovery contract.** If a dispatch returns an auth error after pre-flight passed (credential expired or rotated), invalidate the cache, rerun the pre-flight, and apply the same decision tree before retrying. Never substitute a model the user didn't approve.

---

## 5. MODEL SELECTION

The default is `-m llmgateway/deepseek-v4.1-flash-1017#max` (DevPass LLM Gateway, with flash max-tier-pinned by policy), once `opencode models --standalone` lists the `llmgateway/` prefix. Reasoning effort is expressed as the `#<level>` suffix on the model id, which maps to a provider-specific effort scale. The model string is always `provider/model-id`. List with `opencode models --standalone` and filter for the `<provider>/` prefix.

**Full provider/model roster, the GPT-6 slug grid and the per-provider effort map (`-m provider/model#<level>`) → [providers-and-models.md](./providers-and-models.md).**

---

## 6. AGENT FLAG

`--agent <slug>` loads an agent definition from `.opencode/agents/<slug>.md`, which in this repository links to `.skilled/agents/`, where the files are edited. The agent definition's frontmatter pins the model, tool permissions, and system prompt that shape the dispatch.

### Discovering agents

| Command | What it shows |
|---------|---------------|
| `opencode debug agents` | All registered agents across project + user scopes, each with its resolved system prompt and settings |

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

### JSON event shape (OpenCode 2.0.32)

Each line is a JSON object with at minimum:

| Field | Meaning |
|-------|---------|
| `type` | Event type (`step_start`, `tool_use`, `text`, `step_finish`) |
| `timestamp` | Unix time in milliseconds, as a number |
| `sessionID` | The session id assigned by OpenCode |
| `part` | Type-specific payload |

External runtimes parse the stream incrementally to surface tool calls, partial messages and the final summary. cli-opencode prompt templates always pass `--format json` so the calling AI parses structured events instead of guessing format boundaries.

---

## 8. STATE LOCATION AND SHARE URLS

### State directory

OpenCode persists session state in a shared SQLite database and storage tree under `~/.local/share/opencode/`:

- `opencode.db` (`-shm`/`-wal` companions): the session/message database
- `storage/`: per-session structured artifacts
- `snapshot/`: working-tree snapshots

There is no per-session directory under `~/.opencode/state/<sessionID>/` on a standard install, so that path does not exist on this runtime layout. To inspect a specific session, use `opencode session export <sessionID>` (§3) rather than reading files from a state directory. The cli-opencode self-invocation guard's Layer 3 lock-file probe (`~/.opencode/state/<id>/lock`, per ADR-001) targets the older path as a best-effort third layer on top of the env-var and process-ancestry checks. Treat it as a heuristic, not a verified-present artifact, on installs where `~/.opencode/state/` does not exist.

### Share URLs

`--share` is not a `run` flag, so it publishes nothing and prints no URL. No dispatch passes it and there is no share URL to publish.

---

## 9. VERSION DRIFT

This reference is pinned to OpenCode 2 at 2.3.2, the only supported version. If the live binary reports a different version, do the following:

1. Run `opencode run --help -m llmgateway/deepseek-v4.1-flash-1017 </dev/null` and diff the flag list against Section 4.
2. Run `opencode --help` and diff the subcommand list against Section 3.
3. If a flag was renamed, prefer the new name in the dispatch. If a flag was removed, fall back to the closest analogue and surface the drift in the calling AI's response.
4. If the live binary reports a major version other than 2, the resolvers classify it `unsupported` for major 1 and `unknown` for any other major. A deep-loop lineage refuses either, and the dispatch guard checks every rule against it. Re-validate the entire skill against the new flag table and bump the cli-opencode minor version.

### Failure modes specific to drift

| Symptom | Likely cause |
|---------|--------------|
| `unknown option --format json` | A release where the JSON event stream was the default and the flag did not exist |
| `MODULE_NOT_FOUND` | Plugin loader crash. Check the plugin's `setup` export and the `definePlugin()` bridge in `.opencode/plugins/lib/v2-bridge.js` |

---

## 10. TROUBLESHOOTING

| Symptom | Cause | Fix |
|---------|-------|-----|
| `command not found: opencode` | Binary not on PATH | Install via standalone installer or `brew install opencode` |
| `OPENCODE_SERVER_PASSWORD required` | Server enforces basic auth | Set `OPENCODE_SERVER_PASSWORD` in the environment before starting the server |
| `provider/model not found` | Provider not configured | Run `opencode auth list` to enumerate, then `opencode auth login <provider>` |
| Empty output stream | `--format default` with non-TTY parent | Pass `--format json` and parse the event stream |
| Session never finishes | Tool call hung | Run `opencode session export <sessionID>` and inspect the message log it returns |
| Plugin load crash | Misconfigured plugin | Check the plugin's `setup` export and the `definePlugin()` bridge in `.opencode/plugins/lib/v2-bridge.js` |
| Self-invocation refused | cli-opencode detected an in-OpenCode runtime | Use a sibling cli-* skill or a fresh shell session. See ADR-001 |
| `--share` passed | Nothing is published, the flag is not a `run` flag | Drop the flag |

---

## 11. RELATED RESOURCES

- `./integration-patterns.md` - The three documented use cases and their copy-paste invocation shapes
- `./agent-delegation.md` - Agent routing matrix and invocation patterns
- `./opencode-tools.md` - Unique capabilities (full plugin/skill/MCP runtime, parallel detached sessions)
- `../assets/prompt-templates.md` - Copy-paste prompt templates per use case
- `../assets/prompt-quality-card.md` - Framework selection and CLEAR 5-check
- `../SKILL.md` - Skill entry point and routing summary
- `../ROUTER.md` §3 - Machine router: intent map, resource map and loading levels
