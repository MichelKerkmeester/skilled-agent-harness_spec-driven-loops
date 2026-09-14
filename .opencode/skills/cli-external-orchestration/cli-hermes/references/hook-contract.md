---
title: "Hermes Hook Contract"
description: "Where Hermes hooks live, why user-level shell hooks cannot carry the repo's guard cores, and the project-plugin hook map that can."
trigger_phrases:
  - "hermes hooks"
  - "hermes shell hooks"
  - "hermes plugin hooks"
  - "hermes pre_verify"
  - "hermes repo-guards plugin"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Hermes Hook Contract

Hermes has two hook surfaces. One is the operator's; one the repo can carry.

## 1. OVERVIEW

Hermes keeps shell hooks in the operator's user-level config and reads a repo plugin from `.hermes/plugins/`. This reference records both surfaces and the plugin hook map that carries the repo's guard cores into a Hermes session.

---

## 2. SHELL HOOKS (USER-LEVEL)

Shell-script hooks are declared under `hooks:` in `~/.hermes/config.yaml`, gated by a per-command consent allowlist at `~/.hermes/shell-hooks-allowlist.json`, and inspected with `hermes hooks list|test|doctor`. `--accept-hooks` or `HERMES_ACCEPT_HOOKS=1` bypasses the consent prompt on a headless run, and `hermes -z` sets it automatically.

The repo cannot declare these. None is configured on this machine (observed 2026-09-14: `hooks:` absent, `~/.hermes/hooks/` empty). A dispatch never passes `--accept-hooks` unless the operator declared hooks and asked for it.

---

## 3. PROJECT PLUGIN (REPO-CARRIABLE)

Native plugins load from `./.hermes/plugins/<name>/` when `HERMES_ENABLE_PROJECT_PLUGINS` is set, and their hook list covers every guard core this repo runs (source-read: `hermes_cli/plugins.py`). The hook-and-plugin phase builds `.hermes/plugins/repo-guards/`, which re-implements nothing: each hook shells out to the existing `.mjs` or `.sh` core under `.opencode/hooks/` and maps its result to Hermes's block-or-continue contract, failing open on a core error as the `.pi/extensions/` adapters do.

| Hermes hook | Repo guard core | Effect |
|---|---|---|
| `pre_tool_call` | self-dispatch refusal; read-only refusal; dispatch preflight lint; sk-git advisory core | Refuses a nested `hermes chat`; refuses `write_file`, `patch`, `terminal` and code execution when `SPECKIT_HERMES_READ_ONLY=1`; blocks a `cli-*` dispatch that violates a blocking hard rule; stages the sk-git advisory for a git command |
| `transform_tool_result` | the staged sk-git advisory | Appends the `⚠ sk-git advisory` lines to the git command's tool result |
| `pre_verify` | completion-evidence stop | Returns a continue nudge when a completion claim names no evidence |
| system prompt section | session-start context; the packet named by `HERMES_SPEC_FOLDER` | Freezes the session context, the bound packet path and its goal slice into the prompt |
| `on_session_end` | session-stop context | Records the closing state |

Validation: `hermes plugins validate ./.hermes/plugins/repo-guards` and `hermes plugins doctor`. Agent Plugins v1 portable packages exist in Hermes but are deferred here; their hook surface is unsettled.

---

## 4. WHAT A DISPATCH ASSUMES

The project plugin `repo-guards` (`.hermes/plugins/repo-guards/`) carries the repo guards into a Hermes session when `HERMES_ENABLE_PROJECT_PLUGINS=1` is set and `repo-guards` is listed under `plugins.enabled`; without both, a Hermes dispatch runs with no repo guard hooks. The prompt's preamble and the runtime's dispatch stack are the guards. The packet's hard rule `hooks-user-level` states the boundary so nobody claims otherwise.
