---
title: "Hermes Agent — Runtime Sync Manifest"
description: "How .hermes derives from .opencode: curated per-skill symlinks, generated prompt templates, one project plugin bridging the shared guard cores, and the operator steps Hermes keeps user-level."
---

# Hermes Agent Sync Manifest

> Hermes reads exactly two things from a project's `.hermes/` folder: `skills/` (after a trust grant) and `plugins/` (behind an opt-in variable). Everything else Hermes reads lives in the operator's `~/.hermes/`. This folder therefore carries skills, prompts, one plugin and this manifest, and nothing that pretends to configure Hermes.

---

## 1. OVERVIEW

Hermes Agent (Nous Research) is a Python agent CLI installed as a git checkout under `~/.hermes`. Its config (`config.yaml`), shell hooks, MCP servers, provider block and the project trust grant are all user-level. This folder mirrors what `.pi/`, `.devin/` and `.cursor/` do for their runtimes to the extent Hermes allows it, and lists the operator steps for the rest.

Two behaviors shape the layout. Hermes **scans every project skill directory** with its static security scanner at session start (content-hash cached, fail-closed): a symlinked directory is scanned in full, so the whole-tree link cost ten minutes per session and quarantined every hub, and even one linked skill directory was quarantined on its scripts and references. `skills/` therefore holds generated markdown-only copies of every canonical `SKILL.md`, the same coverage `.claude/skills` gets from its symlink, at a scan cost of seconds. And Hermes's own file tools gate any write whose immediate parent directory is `.hermes`, so the files here are authored from outside a Hermes session.

---

## 2. SURFACE INVENTORY

| Surface | Mechanism | Source | Can it drift? |
|---|---|---|---|
| `skills/<name>/SKILL.md` | **generated** markdown-only copy, one folder per canonical `SKILL.md` (all 56, flat by frontmatter name) plus one `agent-<name>/` per shared agent (12) | `.opencode/skills/**/SKILL.md` | Yes — `sync-skills-hermes.cjs --check`. Not a symlink: Hermes scans every project skill directory at session start, so a linked directory drags its `scripts/`, `node_modules/` and references through the scanner (ten minutes for the whole tree, every hub quarantined; even the single `cli-hermes` link was quarantined on 37 findings). The copies scan in seconds; each names its canonical directory for `references/`, `assets/` and `scripts/`. `-s <name>` preloads any of them (verified live for `sk-git`, `cli-hermes`, `system-spec-kit`); seven are hidden from `skills_list` because Hermes's prose scanner rates their own text dangerous, and still preload |
| `prompts/*.md` | **generated** pointer stubs | `.opencode/commands/**/*.md` | Yes — `sync-prompts-hermes.cjs --check` |
| `plugins/repo-guards/` | **hand-authored** project plugin | shared guard cores under `.opencode/**` | Behavioral drift only; `hermes plugins validate` checks the manifest |
| `agents/` | whole-dir symlink | `.claude/agents` (the runtime-neutral copies Cursor and Devin also link) | No. Hermes has no agent flag, so each agent is also mirrored as the preloadable skill `skills/agent-<name>/` by `sync-skills-hermes.cjs`; `-s agent-<name>` carries the full persona and `HERMES_AGENT_PERSONA=<name>` makes the repo plugin bind it as the session persona |
| `manual-testing-playbook/` | whole-dir symlink | `.opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook` | No |
| `SYNC.md` | hand-authored | — | No |

Hermes has no flag that loads an agent file, its profiles are whole-home islands, its sub-agents receive a goal and context only, and a plugin prompt section is capped at 4000 characters. So an agent reaches a session two ways at once: the generator mirrors every `.hermes/agents/<name>.md` as the skill `agent-<name>` (preload with `-s agent-<name>`, the whole persona), and with `HERMES_AGENT_PERSONA=<name>` the repo plugin's persona section binds that name and tells the session to adopt the preloaded skill (or `skill_view` it). Without the plugin, personas are inlined into the dispatch prompt, per the `cli-hermes` packet.

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
- Any `.opencode/skills/**/SKILL.md` changes → re-run `sync-skills-hermes.cjs`. Write mode prunes stale folders and replaces a leftover directory symlink.
- Guard-core behavior changes under `.opencode/**` → review `plugins/repo-guards/__init__.py` by hand; it shells out to the cores, so a renamed core path is the drift to watch.

---

## 5. SYNC WORKFLOW

```bash
# Regenerate the prompt templates (write mode also prunes stale output)
node .opencode/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs

# Check without writing
node .opencode/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check

# Regenerate the skill copies (write mode also prunes stale folders)
node .opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs
node .opencode/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check

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
| system prompt sections (three, each under Hermes's 4000-character cap) | `dist/hooks/devin/session-start.js`; `HERMES_AGENT_PERSONA`; the packet named by `HERMES_SPEC_FOLDER` | `repo-guards-session-context` (session-start context and the read-only notice), `repo-guards-persona` (binds the named agent to its preloaded `agent-<name>` skill), `repo-guards-goal` (bound packet path and goal slice) |
| `on_session_end` | `dist/hooks/devin/session-stop.js` | Records the closing state |

Every hook fails open.
