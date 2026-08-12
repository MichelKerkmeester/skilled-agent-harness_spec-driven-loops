---
title: "Pi CLI Unique Capabilities"
description: "Pi CLI surfaces with no sibling analog: persistent bidirectional RPC, first-party native extensions and prompt templates, and the minimal built-in tool surface."
trigger_phrases:
  - "pi unique capabilities"
  - "pi rpc mode"
  - "pi built-in tools"
  - "pi extension system"
  - "pi tool surface"
importance_tier: normal
contextType: implementation
version: 1.2.1.0
---

# Pi CLI Unique Capabilities

Reference for the Pi CLI surfaces that have **no analog**, or only a partial analog, in `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor`, or `cli-devin`. Confidence rule: anything marked **Per Pi docs, unconfirmed** is documentation-only for this packet. The local contract pin is the authority for live observations: [Pi contract pin](../../../../specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md).

---

## 1. OVERVIEW

### Core Principle

Pi ships a small built-in core plus three first-party resource surfaces (skills, prompt templates, extensions) that other CLIs either lack entirely or only reach through a third-party package or an external hooks-config file. None of this changes `cli-pi`'s `packetKind: "workflow"` classification (`mode-registry.json`) — the packet's default dispatch still runs locally, and writes land in this repo's checkout (`SKILL.md` §7, "Hub Integration").

### Purpose

Covers Pi capabilities that are exclusive, or meaningfully different in shape, compared to the other 5 CLI executors this hub dispatches, so the calling AI can route a task to Pi specifically for one of these surfaces rather than by habit.

### When to Use

- Choosing whether a task needs Pi's persistent RPC surface instead of a one-shot print dispatch
- Understanding why Pi's extension/prompt-template system is first-party where sibling CLIs need a package or a hooks-config file
- Scoping a dispatch to Pi's minimal built-in tool set via `--tools`
- Picking a reasoning-effort tier via `--thinking` when the task's model supports it

---

## 2. PERSISTENT BIDIRECTIONAL RPC (`--mode rpc`)

### What It Is

**Confirmed** (local pin): `pi --mode rpc` starts a long-lived process that frames requests and responses as one JSON object per stdin/stdout line, rather than exiting after one response. See [integration-patterns.md](./integration-patterns.md) §7 for the full RPC integration contract.

### Capabilities

- A single spawned process serves multiple requests over its lifetime — no per-request process-startup cost
- Stdin/stdout JSONL framing, with request correlation by id when present
- The consumer, not Pi, owns timeout, backpressure, stderr capture, and process termination

### Compared to Other CLI Executors

None of the other 5 CLI executors in this hub expose an equivalent persistent, bidirectional protocol. `cli-devin` and `cli-cursor` both offer session continuation instead — `cli-devin` via `-c`/`--continue` and `-r`/`--resume`, `cli-cursor` via `--continue` and `--resume [chatId]` only (no short forms) — which re-attaches to prior conversation context across separate process invocations, a different shape from one process serving many requests over one connection. `cli-codex`'s and `cli-claude-code`'s JSON output modes are single-response, not a standing session.

### Best For

- A long-lived integration where per-request process-spawn cost matters
- A consumer that already owns a request/response event loop and wants to reuse one Pi process

**Avoid for:** A single bounded task — print mode is simpler and does not require the caller to own a process lifecycle (`integration-patterns.md` §7 requires an explicit lifecycle owner before RPC is used at all).

---

## 3. FIRST-PARTY NATIVE EXTENSIONS (`.pi/extensions/*.ts`)

### What It Is

**Confirmed** (phases 012/015 of this creation packet): Pi auto-discovers `.pi/extensions/*.ts` files with no settings-file registration required. This repo has 11 real extension files: 6 guard-core bridges (`spec-gate-enforce`, `spec-gate-classify`, `dispatch-preflight-lint`, `dispatch-audit`, `post-edit-quality`, `mcp-route-guard`) plus 5 session-lifecycle bridges (`session-start-context`, `session-start-advisories`, `session-stop-context`, `prompt-advisor`, `session-compact-context`), each a plain `ExtensionFactory` registering via `pi.on(event, handler)`. The extension API's lifecycle-event surface (33 named events including block-capable `tool_call`) is confirmed via a direct read of the installed package's `types.d.ts`, and live firing was traced end to end against an authenticated provider — `session_start`, `session_shutdown(quit)`, the `input` transform chain, `tool_call`, and `tool_result` all fired with side-effect evidence (playbook scenario PI-020). Only `session_compact` remains untraced (it fires solely in long interactive sessions); see [native-skills-and-extensions.md](./native-skills-and-extensions.md) §5 for the confidence boundary.

### Capabilities

- Plain TypeScript/JavaScript modules, auto-discovered from `.pi/extensions/`, no manifest entry needed
- Register handlers against named lifecycle events (`pi.on("tool_call", handler)`, etc.)
- A guard can return `{block: true, reason}` to stop an action, or throw and fail the whole session (an invalid extension export fails-closed at startup — confirmed, phase 001)

### Compared to Other CLI Executors

`cli-cursor` and `cli-devin` both read an external, hand-authored JSON hooks-config file (`hooks.json` / `hooks.v1.json`) that maps event names to shell-command adapters — the logic lives outside the runtime as scripts the config merely points at. `cli-claude-code` similarly drives hooks from `settings.json` shell-command entries. Pi's extensions are executable code loaded directly by the runtime, not a config file pointing at external scripts — a first-party in-process API, closer in shape to a plugin system than a hooks manifest.

### Best For

- Bridging this repo's shared guard-core modules into Pi without inventing a second adapter shape
- A guard that needs to inspect or block a specific tool call, not just log after the fact

**Avoid for:** Anything the shared guard-core modules don't already implement — this packet's extensions delegate to the same cores `cli-cursor`/`cli-devin`/`cli-claude-code` already call; a Pi-specific reimplementation of guard logic is out of scope (see `references/agent-delegation.md`'s "never a second adapter" framing, applied identically here).

---

## 4. FIRST-PARTY NATIVE PROMPT TEMPLATES (`.pi/prompts/*.md`)

### What It Is

**Confirmed** (phases 012/013): Pi discovers flat, non-recursive markdown files under `.pi/prompts/` and exposes each as a slash command named after the file. This repo mirrors all 36 canonical `.opencode/commands/**/*.md` files as thin pointer stubs. Argument substitution — including the `$ARGUMENTS` token as a documented alias for `$@` — was live-confirmed in a real generated prompt file during a live session (phase 013, scenario PI-008).

### Capabilities

- Filename becomes the command name; no subdirectory nesting (unlike this repo's own `create/`, `deep/`, `doctor/` command groups, which are flattened during the mirror)
- `$1`/`$2`/`$@`/`${1:-default}`/`$ARGUMENTS` substitution inside the template body

### Compared to Other CLI Executors

`cli-codex`'s `.codex/prompts/*.md` stubs are the closest sibling analog (also generated pointer stubs, also first-party to Codex). `cli-cursor`'s `.cursor/commands/*.md` and `cli-devin`'s `.devin/skills/<flat>/SKILL.md` are both **symlink mirrors** onto `.opencode/commands/**`, not a native prompt-template surface those CLIs discover on their own — Pi and Codex are the only two siblings with a genuinely native, first-party slash-command mechanism.

### Best For

- Any of the 36 mirrored commands, dispatched exactly as documented in `.opencode/commands/**`

**Avoid for:** Assuming precedence or discovery-path behavior beyond what phase 012/013 tested — this covers argument substitution and command-name flattening only, not every documented Pi prompt-template flag (see `native-skills-and-extensions.md` §6 for the confirmed-vs-unconfirmed boundary on CLI resource flags).

---

## 5. MINIMAL BUILT-IN TOOL SURFACE WITH `--tools`

### What It Is

**Confirmed** (local pin): Pi's built-in tool set is 7 tools — `read`, `bash`, `edit`, `write`, `grep`, `find`, `ls`. `--tools <list>` restricts a dispatch to an explicit subset (e.g. `--tools read,grep,find,ls` for a read-only review — see `integration-patterns.md` §5).

### Compared to Other CLI Executors

Devin's built-in surface is materially larger (file ops, shell, fetch, `run_subagent`, `ask_user_question`, MCP subcommands) and is scoped by a 4-tier `--permission-mode` plus `Read(glob)`/`Write(glob)`/`Exec(prefix)` matchers, not a flat tool-name allowlist. Cursor has no `--tools`-equivalent flag at all — its read-only boundary comes from `--mode plan`/`--mode ask` instead. Pi's `--tools` flag is the most direct "name the exact tools" mechanism among the 6 siblings, at the cost of a much smaller built-in surface to restrict in the first place.

### Best For

- A read-only or narrowly-scoped dispatch where naming the exact allowed tools is more auditable than a broader mode flag

---

## 6. REASONING-EFFORT CONTROL (`--thinking`)

### What It Is

**Confirmed** (local pin, per the installed help capture): `--thinking` accepts a tier from `off` through `max`, independent of the `--model` flag.

### Compared to Other CLI Executors

`cli-cursor` bakes reasoning effort into the model id itself (`cursor-grok-4.6-high`, `glm-5.2-max`) and explicitly rejects a separate effort flag or bracket syntax. `cli-devin` is different again: its model ids carry no effort tier at all (`opus`, `sonnet`, `swe`, `gpt`, `codex`, `gemini`, `adaptive`); reasoning depth is instead toggled mid-session via `Alt+T`/`Opt+T`, not a dispatch-time flag or an id suffix. `cli-codex` uses a config-level `model_reasoning_effort` rather than a bare CLI flag. Pi's `--thinking` is a standalone flag, not folded into model-id selection and not a mid-session toggle — confirm the target model actually honors it before assuming a tier changes behavior; the pin did not exhaustively test every model/tier pairing.

---

## 7. CAPABILITY COMPARISON

| Capability | Calling AI | Pi CLI | Notes |
|---|---|---|---|
| File reading | `Read` tool | `read` tool | Confirmed built-in |
| File writing | `Write`, `Edit` | `edit`, `write` tools | Confirmed built-in |
| Code search | `Grep` (ripgrep) | `grep` tool | Confirmed built-in |
| File discovery | `Glob` | `find` tool | Confirmed built-in |
| Directory listing | — | `ls` tool | Confirmed built-in |
| Shell commands | `Bash` | `bash` tool | Confirmed built-in |
| Persistent bidirectional session | Not native | `--mode rpc` | Pi-exclusive among the 6 siblings |
| Native extension system | Not applicable (host runtime) | `.pi/extensions/*.ts` | First-party; confirmed live-loading (phase 012) |
| Native prompt templates | Not applicable (host runtime) | `.pi/prompts/*.md` | First-party, shared only with `cli-codex` |
| Subagent delegation | Task tool (native) | `pi-subagents` package | Third-party for Pi, unlike Devin's native `run_subagent` |
| MCP integration | Native | `pi-mcp-extension` package | Third-party for Pi; stdio transport confirmed (phase 007) |
| Multi-provider models | Single model per session | Multiple providers via custom providers | Default `google`; GPT-5.6 via `openai-codex` custom provider (operator-confirmed roster) |
| Reasoning-effort control | Session-level | `--thinking off..max` | Standalone flag, not folded into model id |

---

## 8. BEST PRACTICES

### When to Reach for RPC Over Print Mode

- The integration already owns a request/response loop and would otherwise spawn Pi once per request
- Avoid when the task is a single bounded objective — print mode needs no lifecycle owner

### When to Restrict via `--tools`

- A read-only review or any task that must not write files
- Prefer this over a prompt-only instruction not to edit — the flag is enforced by the CLI, a prompt sentence is not

### When to Reach for a Custom-Provider Model

- The task specifically needs a GPT-5.6 tier (`gpt-5.6-luna`/`sol`) — dispatch through the `openai-codex` custom provider per the authenticated roster in `cli-reference.md` §13
- Default to `google` (the confirmed default provider) when the task has no model-specific requirement

**Avoid for:** Any model or provider not named in the authenticated roster — Pi's own documentation-only provider breadth is not a license to guess at an unconfirmed model id.
