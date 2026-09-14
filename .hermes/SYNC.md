---
title: "Hermes Agent — Runtime Sync Manifest"
description: "How .hermes derives from .opencode: curated per-skill symlinks, generated prompt templates, one project plugin bridging the shared guard cores, and the operator steps Hermes keeps user-level."
---

# Hermes Agent Sync Manifest

> Hermes reads exactly two things from a project's `.hermes/` folder: `skills/` (after a trust grant) and `plugins/` (behind an opt-in variable). Everything else Hermes reads lives in the operator's `~/.hermes/`. This folder therefore carries skills, prompts, one plugin and this manifest, and nothing that pretends to configure Hermes.

---

## 1. OVERVIEW

Hermes Agent (Nous Research) is a Python agent CLI installed as a git checkout under `~/.hermes`. Its config (`config.yaml`), shell hooks, MCP servers, provider block and the project trust grant are all user-level. This folder mirrors what `.pi/`, `.devin/` and `.cursor/` do for their runtimes to the extent Hermes allows it, and lists the operator steps for the rest.

Two behaviors shape the layout. Hermes follows a symlinked skills tree, flattens it, and **scans all of it** with its static security scanner at every session start: linking the whole `.opencode/skills` tree cost ten minutes per session and quarantined every hub, so `skills/` holds one directory link per curated skill instead. And Hermes's own file tools gate any write whose immediate parent directory is `.hermes`, so the files here are authored from outside a Hermes session.

---

## 2. SURFACE INVENTORY

| Surface | Mechanism | Source | Can it drift? |
|---|---|---|---|
| `skills/<name>/` | one directory symlink per curated skill | `.opencode/skills/**/<name>` | Add a link only for a skill a Hermes session needs. Never link the whole tree: the static scanner walks everything it can reach, pegs a CPU core for ten minutes per session and quarantines every hub as dangerous (observed 2026-09-14). `hermes skills list` does not show project skills; `-s <name>` loads one |
| `prompts/*.md` | **generated** pointer stubs | `.opencode/commands/**/*.md` | Yes — `sync-prompts-hermes.cjs --check` |
| `plugins/repo-guards/` | **hand-authored** project plugin | shared guard cores under `.opencode/**` | Behavioral drift only; `hermes plugins validate` checks the manifest |
| `manual-testing-playbook/` | whole-dir symlink | `.opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook` | No |
| `SYNC.md` | hand-authored | — | No |

There is no `agents/` surface: Hermes has no flag that loads an agent file, its profiles are whole-home islands and its sub-agents receive a goal and context only. Personas are inlined into the dispatch prompt, per the `cli-hermes` packet.

Prompt names are the flattened command path (`create/agent.md` → `create-agent.md`), the same rule as Codex, Cursor and Pi. A template is a prompt file for `hermes chat -Q --oneshot --query-file .hermes/prompts/<name>.md`; the caller appends the user request below the template's last line.

---

## 3. OPERATOR STEPS (USER-LEVEL, NEVER IN THIS FOLDER)

1. **Provider**: a `providers:` block named `llmgateway` in `~/.hermes/config.yaml` with `key_env: LLMGATEWAY_API_KEY`, the key in `~/.hermes/.env`. `hermes config get providers.llmgateway.base_url` must print the URL (`hermes status` does not show custom providers).
2. **Trust**: `hermes skills trust` run once from the repo root, so `skills/` loads.
3. **Plugins**: `HERMES_ENABLE_PROJECT_PLUGINS=1` in the environment of any session that should run the guard plugin, **and** `repo-guards` listed under `plugins.enabled` in `~/.hermes/config.yaml` (`hermes plugins enable` refuses project keys; add the line by hand).
4. **MCP**: `printf 'Y\n' | hermes mcp add code_mode --command node --env UTCP_CONFIG_FILE=.utcp_config.json --args .opencode/bin/mcp-code-mode-launcher.cjs` (the enable prompt needs an answer on stdin), then `hermes tools enable code_mode:<tool>` per the packet's MCP policy. A session reaches the server only when `code_mode` is named in its `-t` list.

None of these is a repo file, and no dispatch performs them.

---

## 4. WHEN TO SYNC

- Any `.opencode/commands/**` file is added, renamed or deleted → re-run `sync-prompts-hermes.cjs`. Write mode prunes stale output.
- Guard-core behavior changes under `.opencode/**` → review `plugins/repo-guards/__init__.py` by hand; it shells out to the cores, so a renamed core path is the drift to watch.

---

## 5. SYNC WORKFLOW

```bash
# Regenerate the prompt templates (write mode also prunes stale output)
node .opencode/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs

# Check without writing
node .opencode/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check

# Validate the project plugin manifest
hermes plugins validate .hermes/plugins/repo-guards
```

---

## 6. WHAT THE PLUGIN BRIDGES

| Hermes hook | Repo guard core | Effect |
|---|---|---|
| `pre_tool_call` (terminal and file tools) | self-dispatch refusal; read-only refusal; `dispatch/devin/dispatch-preflight-lint.mjs`; `git-preflight/shared/git-preflight-advisory.mjs` | Blocks `hermes chat` from inside Hermes; blocks `write_file`, `patch`, `terminal` and code execution when `SPECKIT_HERMES_READ_ONLY=1`; blocks a `cli-*` dispatch that violates its packet's blocking hard rules; stages the sk-git advisory for a git command |
| `transform_tool_result` (terminal) | the staged sk-git advisory | Appends the `⚠ sk-git advisory` lines to the git command's tool result so the session reads them |
| `pre_verify` | `completion-evidence-stop.cjs` | Returns a continue nudge when a completion claim names no evidence |
| system prompt section | `dist/hooks/devin/session-start.js`; the packet named by `HERMES_SPEC_FOLDER` | Freezes the session-start context, the bound packet path and its goal slice (and a read-only notice) into the session prompt |
| `on_session_end` | `dist/hooks/devin/session-stop.js` | Records the closing state |

Every hook fails open.
