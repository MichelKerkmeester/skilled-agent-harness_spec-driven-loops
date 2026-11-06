---
title: "Pi CLI Runtime Folder"
description: "What Pi reads from .pi/, the generators that write its agents and prompts from .skilled/, the extensions that bridge the shared hook cores and how to check the mirrors."
trigger_phrases:
  - "pi runtime folder"
  - "pi folder readme"
  - "pi extensions and hooks"
---

# Pi CLI Runtime Folder

> The `.pi/` folder holds the Pi configuration this repository ships, together with the generated files and hook extensions Pi reads.

---

## 1. OVERVIEW

Skilled keeps its authored content in [`.skilled/`](../.skilled). Pi reads flat real files, so two generators translate `.skilled/agents/` and `.skilled/commands/` into this folder. Never edit a generated file here. Edit its source and rerun the generator.

Pi has no hook configuration file. Its hooks are TypeScript extensions in `extensions/`, and each one is a link to the adapter its owning hook core keeps. Pi loads every `*.ts` file there at session start, with no registration step. Pi also loads the root [`AGENTS.md`](../AGENTS.md) from its working directory and the folders above it.

---

## 2. WHAT IS HERE

| Entry | Kind | What it holds |
|---|---|---|
| `extensions/*.ts` | links | The hook adapters, each linking into its owner's tree under `.skilled/` |
| `extensions/pi-cache-optimizer/`, `extensions/pi-fast-mode-w-subagent-support/` | packages | Third-party extensions loaded from local folders |
| `prompts/*.md` | generated | One short stub per command, written by `sync-prompts-pi.cjs` |
| `prompts/goal-pi.md` | authored | The native goal command |
| `agents/*.md` | generated | The 11 shared agents in Pi's dialect, written by `sync-agents-pi.cjs` |
| `skills` | link | `../.skilled/skills`, the whole skill library |
| `mcp.json` | authored | Registers the Code Mode MCP server |
| `settings.json` | authored | Pi's package list and settings |
| `models.json`, `custom-providers.md` | authored | The model and provider setup |
| `PLUGINS.md` | authored | The list of Pi packages this environment enables |
| `statusline.sh` and the `pi-*-config.json` files | authored | The status line and per-package settings |
| `git/`, `npm/` | package installs | Only their `.gitignore` files are tracked |
| `types/` | authored | Type declarations for the extensions |
| `repo-rules` | link | `../.skilled/repo-rules`, the rule files `REPO RULES.md` routes |
| `manual-testing-playbook` | link | The `cli-pi` playbook |
| `SYNC.md` | authored | The surface inventory and drift checks |

Several of these files are canonical for the operator's machine too: `~/.pi/agent/` links back to them, so a pull updates the local Pi setup.

---

## 3. HOOKS

Each extension registers handlers with `pi.on(event, handler)` and calls the same shared hook core the other runtimes use. The extensions cover the skill advisor, the spec-folder gate, the CLI dispatch lint and audit, the task-dispatch guard, the MCP route guard, the post-edit quality checks, the injection screen, the overlay guard, decision capture, the sk-git message gate and preflight advisory, the session context hooks, the goal context and the session-relaunch nudge.

A handler fails open when its hook core faults, so a bug in a core never blocks the work it observes. The shared hook registry does not render anything for Pi. `sync-hook-registrations.cjs --check` instead confirms that every expected extension link resolves. The coverage matrix in [`.skilled/hooks/README.md`](../.skilled/hooks/README.md) records where Pi coverage is partial.

---

## 4. WHAT PI LOADS

- **Instructions.** Pi loads `AGENTS.md` from the working directory and its parents, so the root file reaches every session without a copy here.
- **Skills.** The `skills` link exposes the whole library.
- **Commands.** Each command runs as a prompt template whose stub points at the canonical command file.
- **Agents.** No installed Pi surface reads `agents/` today. The generator keeps it current and checked so it is ready if a consumer returns.

---

## 5. KEEPING IT IN SYNC

```bash
node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs
node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs
```

Each generator takes `--check` to report drift without writing, and write mode also prunes stale output. The extension links have their own check.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
```

Expected output: a `PASS` line from each, the second naming how many Pi extensions resolve, each with exit 0. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. DISPATCHING PI

Another runtime hands work to Pi through the [`cli-pi`](../.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md) mode of the `cli-external-orchestration` hub. Pi is the one bridge that may dispatch its own runtime.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the full surface inventory and known gaps
- [`extensions/README.md`](./extensions/README.md): how each extension bridges its hook core
- [`PLUGINS.md`](./PLUGINS.md): the enabled Pi packages
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`README.md`](../README.md): the repository overview
