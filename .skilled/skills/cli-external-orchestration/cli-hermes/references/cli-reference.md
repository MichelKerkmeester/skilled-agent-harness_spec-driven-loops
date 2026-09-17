---
title: "Hermes CLI - Complete Command Reference"
description: "Hermes Agent flags, headless forms, exit codes, isolation flags, environment variables, and the safe dispatch shape, source-read on v0.21.1 and verified by the packet's research."
trigger_phrases:
  - "hermes cli flags"
  - "hermes help"
  - "hermes oneshot"
  - "hermes quiet mode"
  - "hermes exit codes"
  - "hermes query-file"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Hermes CLI - Complete Command Reference

This reference records the Hermes contract as read from the installed source (v0.21.1, upstream `dc90a75a`, git install at `~/.hermes/hermes-agent`) and from live help output on 2026-09-14. Claims marked **source-read** await the contract pin; the one live observation is marked **observed**.

Sources: [research synthesis](../../../../specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/research.md), [contract pin](../../../../specs/cli-external-orchestration/071-cli-hermes-creation/002-hermes-contract-pin/implementation-summary.md).

## 1. OVERVIEW

Hermes Agent is a Python agent CLI with a large tool surface (terminal, file, search, web, browser, vision, delegation, memory, skills, MCP) and a provider catalog of some forty providers. The binary is `hermes`; `hermes --version` prints the version, install method and install directory. Record the installed version at execution time.

Hermes has three headless forms, and only one is auditable:

| Form | Invocation | Stdout | Session id | Approvals |
|---|---|---|---|---|
| Quiet oneshot chat (**use this**) | `hermes chat -Q --oneshot -q "<prompt>"` or `--query-file <path>` | Final response only | `session_id: <id>` on stderr | Flagged actions blocked; `--yolo` lifts the gate |
| Non-TTY chat | `hermes chat -q "<prompt>"` with stdio not a TTY | Response plus banner and previews unless `-Q` | On stderr | Same as above |
| Top-level oneshot (**never for dispatch**) | `hermes -z "<prompt>"` | Final response only | None | Auto-approves everything and auto-accepts hooks |

---

## 2. FLAGS THAT MATTER FOR DISPATCH

| Flag | Effect | Standing |
|---|---|---|
| `-q, --query TEXT` | The prompt in argv; on a non-TTY it answers and exits | live help |
| `--query-file PATH` | Read the prompt from a file, `-` for stdin, nothing shell-interpreted; mutually exclusive with `-q` | live help |
| `--oneshot` | Answer and exit; implied on non-TTY stdio and by `-Q` | live help |
| `-Q, --quiet` | Suppress banner, spinner and tool previews; print only the final response and session info | live help |
| `-m, --model ID` | Model id for this run | live help |
| `--provider NAME` | Built-in provider or a user-defined name from `providers:` in `config.yaml`; the packet pins `llmgateway` | live help |
| `--reasoning LEVEL` | `none minimal low medium high xhigh max ultra`, the same set as the runtime's effort enum | live help |
| `-t, --toolsets LIST` | Comma-separated toolsets to enable; replaces the configured set | live help |
| `-s, --skills LIST` | Preload skills for the session | live help |
| `--yolo` | Auto-approve the tool calls Hermes flags as dangerous; ordinary writes need no flag (observed 2026-09-14) | live help |
| `--ignore-rules` | Skip `AGENTS.md`, `SOUL.md`, `.cursorrules` and memory injection. Hermes's help text also claims it skips preloaded skills; a live A/B disproved that, so `-s` and this flag travel together | live help, preload clause **corrected by observation 2026-09-15** |
| `--ignore-user-config` | Ignore `~/.hermes/config.yaml`; `.env` credentials still load | live help |
| `--safe-mode` | Disable user config, rules, plugins and MCP servers | live help |
| `--max-turns N` | Turn cap for the run (Hermes default 500) | live help |
| `--run-budget SECONDS` | Wall-clock budget; the agent wraps up as it expires | live help |
| `--source tool` | Keep the run out of the operator's session lists | live help |
| `--in DIR` | Change into DIR before starting | live help |
| `--accept-hooks` | Auto-approve unseen shell hooks; never pass unless the operator declared hooks | live help |
| `--worktree` | Run in an isolated git worktree; **never pass from a dispatch** (writes `.git/worktrees/` inside the repo) | live help |
| `--pass-session-id` | Put the session id into the system prompt | live help |
| `--resume ID`, `-c NAME` | Resume a session; not used by dispatch | live help |

---

## 3. EXIT CODES AND OUTPUT

| Case | Exit | Where the signal is | Standing |
|---|---|---|---|
| Completed turn with a response | 0 | Response on stdout, `session_id:` on stderr; with `deepseek-v4.1-flash` the model's reasoning precedes the answer on stdout | **observed 2026-09-14** (smoke: `OK` in 19 s) |
| Turn ended without a response | 0 with **empty stdout** | Seen when a deferred-tool loop ended the turn (`'read_file' is not a deferrable tool` on a toolset without `file`); exit 0 is not proof of an answer, so a caller requires non-empty stdout | **observed 2026-09-14** |
| `result.failed` | 1 | The gateway error on stdout (`HTTP 400: Requested model ... not supported`), `session_id:` still on stderr | **observed 2026-09-14** |
| Interrupt | 130 | | source-read |
| No provider configured | 1 | `No inference provider configured. Run 'hermes model' ...` on **stdout**; stderr empty; no `session_id:` | **observed 2026-09-14** |
| Run-budget expiry | 0 with a partial response | No distinct code or marker; `--run-budget 15` ended at 40 s. A silent provider stream is not bounded by the budget: the stale-stream watchdog fires at 600 s and retries | **observed 2026-09-14** |
| Top-level `-z` usage error | 2 | | source-read (`hermes_cli/oneshot.py`) |

The process ends in a hard exit after flushing, so a late handler cannot flip the code. Read the exit code first, then stdout for the response or the pre-flight message, then stderr for `session_id:` and `Error:`.

---

## 4. APPROVALS AND WRITES

Observed 2026-09-14, correcting the source-read claim the research carried: a headless `chat -q` runs ordinary file writes and commands without any flag. Only a tool call Hermes flags as dangerous (its dangerous-command pattern set, for example `rm -rf <path>`, and a write whose immediate parent directory is `.hermes`) reaches the approval gate, and in single-query mode without `--yolo` that call is blocked with `BLOCKED: Command flagged as dangerous (...) but single-query mode (-q) runs without a user present to approve it`. `--yolo` lifts that gate (`approvals.single_query_mode: approve` in `config.yaml` does the same globally). Hardline floors stay blocked even under `--yolo`. There is no OS sandbox flag; a read-only dispatch is read-only because its `-t` list omits `terminal` and `file`. Terminal backends (docker, ssh, modal and others) are config-level hardening, not per-run flags.

---

## 5. ISOLATION

- `--ignore-rules` removes `SOUL.md`, memories, session search and the CWD instruction files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`) from the prompt. Every dispatch passes it.
- `--safe-mode` additionally disables plugins and MCP servers; use it when a configured MCP server would add cold-start latency the dispatch does not need.
- `HERMES_HOME` (or `--profile`) relocates the whole home, including `.env` and `auth.json`. A fresh home is logged out of every provider, so the fan-out never sets it; per-lineage profiles wait for a seeded-credential contract.
- Writes to sessions, memories, logs and checkpoints land under `~/.hermes`, outside the repository and invisible to the fan-out containment guard.

---

## 6. ENVIRONMENT

| Variable | Set by | Meaning |
|---|---|---|
| `HERMES_AGENT=true` | Hermes, on every process | Self-invocation marker inherited by child processes (source-read: `hermes_cli/main.py`) |
| `HERMES_SESSION_ID` | Hermes, at agent init | Session marker inherited by children; the runtime's session env for this kind |
| `HERMES_HOME` | Operator or `--profile` | Home override; detection only for the runtime |
| `HERMES_YOLO_MODE=1`, `HERMES_ACCEPT_HOOKS=1` | `hermes -z` | Auto-set by the top-level oneshot; one reason it is never used |
| `HERMES_ENABLE_PROJECT_PLUGINS` | Operator | Opt-in for `./.hermes/plugins/` |
| `LLMGATEWAY_API_KEY` | Operator, in `~/.hermes/.env` or the shell | The `key_env` the `llmgateway` provider block names |
| `SPECKIT_HERMES_STATE_DIR` | The fan-out runner | Per-lineage detection hint, never a home relocation |
| `SPECKIT_HERMES_READ_ONLY` | The fan-out runner, on a read-only lineage | The repo plugin refuses `write_file`, `patch`, `terminal`, `process_manage` and `execute_code` |
| `HERMES_SPEC_FOLDER` | The fan-out runner, or a caller | Repo-relative packet path; the repo plugin renders that packet's goal slice into the session prompt |
| `HERMES_AGENT_PERSONA` | A caller | Agent name; the repo plugin binds it as the session persona and points at the preloaded skill `agent-<name>` (pass `-s agent-<name>`; a prompt section is capped at 4000 characters, so the full persona travels as the skill) |

Hermes loads `~/.hermes/.env` itself, so a key kept there needs no pass-through from the dispatching shell.

---

## 7. THE SAFE DISPATCH SHAPE

```bash
hermes chat -Q --oneshot --query-file <prompt.md> --provider llmgateway --model <roster-id> \
  --reasoning max --ignore-rules --source tool --max-turns 200 --run-budget <timeout-60> \
  -t terminal,file,skills,todo,web [--yolo] --in <repo-root> </dev/null
```

Read-only: omit `--yolo`, use `-t file,todo` (Hermes's `search` toolset is web search only; `read_file` and `search_files` live in `file` with the write tools) and set `SPECKIT_HERMES_READ_ONLY=1` so the repo plugin refuses `write_file` and `patch`. The fan-out builder emits this shape with `--query-file -` and the prompt on stdin, and without `--in` because the runner spawns in the repo root.

---

## 8. MANAGEMENT COMMANDS A DISPATCH NEVER RUNS

`hermes skills trust|install|update`, `hermes mcp add|remove`, `hermes plugins install|enable`, `hermes config set`, `hermes import-agent`, `hermes setup`, `hermes update`, `hermes profile create|use`. Each changes the operator's `~/.hermes`. A prompt that needs one stops and reports.

Read-only commands a dispatch may run: `hermes --version`, `hermes status` (which does not show custom providers), `hermes doctor`, `hermes config show|get`, `hermes tools list`, `hermes skills list`, `hermes plugins list`, `hermes mcp list`, `hermes hooks list`, `hermes prompt-size`, always with stdin closed.
