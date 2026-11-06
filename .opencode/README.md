---
title: "OpenCode Runtime Folder"
description: "What OpenCode reads from .opencode/: per-entry links into .skilled/, the command link tree, the plugins authored here and their package files, how the plugins carry the hook cores and how to check the links."
trigger_phrases:
  - "opencode runtime folder"
  - "opencode compatibility root"
  - "opencode plugins and hooks"
---

# OpenCode Runtime Folder

> The `.opencode/` folder exposes `.skilled/` under the older OpenCode name, one link per entry, and holds the OpenCode plugins that only this runtime can load.

---

## 1. OVERVIEW

The authored tree lives in [`.skilled/`](../.skilled). This folder exposes the same tree under the older `.opencode/` name, so OpenCode and anything else that still addresses `.opencode/<path>` reaches the real file. Editing a file through a linked path here edits the file in `.skilled/`, because it is the same file.

Some content here is real. The plugins in `plugins/` are authored here, because they import the OpenCode plugin SDK and no other runtime can load them. `commands/` is a real folder of links, with the native `/goal-opencode` command authored beside them. `package.json` and `package-lock.json` are tracked, because the plugins are ES modules that take their module type from the first and their SDK version from the second.

---

## 2. WHAT IS HERE

| Entry | Kind | What it holds |
|---|---|---|
| `plugins/` | authored | The OpenCode plugins, with their shared `lib/` and `tests/` folders |
| `commands/` | real folder of generated links | One link per top-level entry of `.skilled/commands/`, written by `sync-runtime-mirrors.cjs` |
| `commands/goal-opencode.md` | authored | The native goal command, which drives the goal plugin |
| `agents`, `skills` | links | `../.skilled/agents` and `../.skilled/skills` |
| `hooks` | link | `../.skilled/hooks`, the shared hook cores |
| `bin`, `scripts` | links | `../.skilled/bin` and `../.skilled/scripts`, still named through this path by older callers |
| `repo-rules` | link | `../.skilled/repo-rules`, the rule files `REPO RULES.md` routes |
| `manual-testing-playbook` | link | The `cli-opencode` playbook |
| `package.json`, `package-lock.json` | authored | The module type and the pinned plugin SDK |
| `SYNC.md` | authored | The surface inventory and drift checks |

`node_modules/` comes from `npm ci` in this folder, and OpenCode writes `.gitignore` when it installs the SDK. Git tracks neither.

---

## 3. HOOKS

OpenCode has no hook configuration file. Its hooks are the plugins in `plugins/`, which OpenCode discovers with a flat glob over that folder. Each plugin exports one object with a `setup` entry for OpenCode 2 and a `server` entry for OpenCode 1, so every plugin runs on both majors.

Most plugins are thin adapters that translate OpenCode events into a shared hook core. They cover the skill advisor, the spec-folder gate, the CLI dispatch audit, the MCP route guard, the post-edit quality checks, the injection screen, decision capture, the sk-git message gate and preflight advisory, the deep-loop guard, completion checks, session cleanup and the session-relaunch nudge. `opencode-goal.js` implements the goal tools itself, and `codex-hooks-watchdog.js` audits the Codex hook install.

A plugin never writes to stdout or stderr, because OpenCode draws that output over its prompt line. Findings reach the session through a system-prompt transform or a tool result. Some plugins also keep a bounded log in the workspace. The coverage matrix in [`.skilled/hooks/README.md`](../.skilled/hooks/README.md) records what OpenCode covers by design instead of by adapter, such as the overlay guard.

---

## 4. WHAT OPENCODE LOADS

- **Skills.** The `skills` link is OpenCode's skill discovery root.
- **Agents.** The `agents` link exposes the authored agents in their source dialect, so OpenCode needs no translated copy.
- **Commands.** Commands load from the `commands/` link tree in their source shape.
- **MCP.** The root `opencode.json` names `.skilled/bin/mcp-code-mode-launcher.cjs` as the Code Mode launcher.

---

## 5. KEEPING IT IN SYNC

The linked entries cannot drift, because a link has no content of its own. Only the command links are generated.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs
```

Add `--check` to report drift without writing, and run the link check from `SYNC.md` to catch a broken entry.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
for e in .opencode/* .opencode/commands/*; do [ -e "$e" ] || echo "BROKEN $e"; done
```

Expected output: a `PASS` line with exit 0 from the first, and no output from the second. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. DISPATCHING OPENCODE

Another runtime hands work to OpenCode through the [`cli-opencode`](../.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md) mode of the `cli-external-orchestration` hub. That mode owns the dispatch contract for both OpenCode majors.

---

## 7. USING THE OLD NAME

Prefer `.skilled/` in anything you write. Both spellings resolve on a normal checkout, but only `.skilled/` resolves on the web. A link is stored as a small file holding its target, so `raw.githubusercontent.com` and the GitHub file browser return that target text for a path under `.opencode/`, never the file.

A clone on a filesystem without link support, which includes Windows unless links are enabled, turns each entry here into such a text file, and paths below it stop resolving. Enable links before cloning:

```bash
git config --global core.symlinks true
```

---

## 8. RELATED

- [`SYNC.md`](./SYNC.md): the surface inventory and drift checks
- [`plugins/README.md`](./plugins/README.md): each plugin and its hook core
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`AGENTS.md`](../AGENTS.md): the shared instruction file
- [`README.md`](../README.md): the repository overview
