---
title: "Hermes Agent Runtime Folder"
description: "What Hermes Agent reads from .hermes/, the generated skill and prompt copies of .skilled/, the repo-guards plugin that bridges the shared hook cores and the operator steps Hermes keeps user-level."
trigger_phrases:
  - "hermes runtime folder"
  - "hermes folder readme"
  - "hermes repo-guards plugin"
---

# Hermes Agent Runtime Folder

> The `.hermes/` folder carries what Hermes Agent can load from a project, and nothing that tries to configure Hermes itself.

---

## 1. OVERVIEW

Skilled keeps its authored content in [`.skilled/`](../.skilled). Hermes reads exactly two things from a project folder: `skills/`, once the project is trusted, and `plugins/`, behind an opt-in variable. Its configuration, providers, MCP servers and trust grant all live in the operator's `~/.hermes/`, so this folder never holds them.

Hermes scans every project skill folder with a security scanner at session start. A linked skill folder drags its scripts and references through that scan, which once took ten minutes and quarantined every hub. `skills/` therefore holds generated markdown-only copies, and each copy names its canonical folder for the files it does not carry.

---

## 2. WHAT IS HERE

| Entry | Kind | What it holds |
|---|---|---|
| `skills/<name>/` | generated | A copy of each canonical `SKILL.md` with its sibling `ROUTER.md`, 56 in all, written by `sync-skills-hermes.cjs` |
| `skills/agent-<name>/` | generated | Each of the 11 shared agents mirrored as a skill Hermes can preload |
| `prompts/*.md` | generated | One prompt template per command, written by `sync-prompts-hermes.cjs` |
| `plugins/repo-guards/` | authored | The project plugin that bridges the shared hook cores, with its tests |
| `agents` | link | `../.skilled/agents`, the authored agent files |
| `repo-rules` | link | `../.skilled/repo-rules`, the rule files `REPO RULES.md` routes |
| `manual-testing-playbook` | link | The `cli-hermes` playbook |
| `SYNC.md` | authored | The surface inventory, with the operator steps and the plugin's hook map |

Hermes's own file tools refuse a write whose parent folder is `.hermes`, so the files at this level are written from outside a Hermes session.

---

## 3. HOOKS

Hermes has no hook configuration file in the project. The `repo-guards` plugin registers Hermes hooks in Python and shells out to the shared hook cores. It runs only when `HERMES_ENABLE_PROJECT_PLUGINS=1` is set and `repo-guards` is listed under `plugins.enabled` in `~/.hermes/config.yaml`.

On `pre_llm_call` the plugin runs the skill advisor and classifies the prompt for the spec-folder gate. On `pre_tool_call` it runs the dispatch lint, the task-dispatch guard, the sk-git advisory and the MCP route guard. On `transform_tool_result` it adds the post-edit quality warning and the injection screen's warning. Session hooks bind the packet goal and add four system prompt sections. At session end the plugin runs session cleanup and arms the session relaunch, which the usage hooks feed. Every hook fails open. `.hermes/SYNC.md` maps each Hermes hook to its core.

---

## 4. WHAT HERMES LOADS

- **Skills.** The `-s <name>` flag preloads any copy in `skills/` after `hermes skills trust` has run once from the repository root. A copy the scanner quarantines is missing from `hermes skills list` and cannot be preloaded.
- **Agents.** Hermes has no flag that loads an agent file. `-s agent-<name>` preloads the whole persona, and `HERMES_AGENT_PERSONA=<name>` makes the plugin bind it as the session persona.
- **Commands.** A prompt template runs with `hermes chat -Q --oneshot --query-file .hermes/prompts/<name>.md`, and the caller appends the request below its last line.
- **MCP.** Code Mode is added once per machine with `hermes mcp add code_mode`, and a session reaches it only when its `-t` list names `code_mode`.

---

## 5. KEEPING IT IN SYNC

```bash
node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs
node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs
```

Each generator takes `--check` to report drift without writing, and write mode also prunes stale output. Rerun the skill sync after any edit to a `SKILL.md` or `ROUTER.md`.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
hermes plugins validate .hermes/plugins/repo-guards
```

Expected output: `PASS: 67 Hermes skill copies in sync` with exit 0 from the first, and a valid manifest from the second. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. DISPATCHING HERMES

Another runtime hands work to Hermes Agent through the [`cli-hermes`](../.skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md) mode of the `cli-external-orchestration` hub. When the plugin is off, that mode inlines the persona into the dispatch prompt instead.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the full inventory, with the user-level operator steps and the plugin's hook map
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores
- [`AGENTS.md`](../AGENTS.md): the shared instruction file, section 9 for agent routing
- [`README.md`](../README.md): the repository overview
