---
title: "OpenCode in Skilled"
description: "How OpenCode uses this repository: the plugins it loads from plugins/, the skills, agents and commands it links from .skilled/, the Code Mode launcher and the link checks that keep the .opencode paths working."
trigger_phrases:
  - "opencode in skilled"
  - "opencode folder readme"
  - "opencode plugins"
---

# OpenCode in Skilled

> OpenCode gets the full project runtime: the skills, agents and commands, the registered MCP servers and the plugins that only this runtime can load.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Working on this repository in OpenCode with the full plugin, skill and MCP runtime |
| **Start with** | Run `opencode` from the checkout. The plugins load from `plugins/` |
| **Works on** | OpenCode 2, the recommended version, and OpenCode 1 as a fallback |
| **Checked by** | `/doctor:runtime-mirrors` and the commands in section 5 |

### What You Get

The authored tree lives in `.skilled/`. This folder exposes the same tree under the older `.opencode/` name, one link per entry, so anything that still uses `.opencode/` reaches the real file.

The plugins are the part that is real here. They import the OpenCode plugin SDK, and no other runtime can load them. Each plugin exports one object with a `setup` entry for OpenCode 2 and a `server` entry for OpenCode 1, so every plugin runs on both versions.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How OpenCode gets it |
|---|---|
| Instructions | The root [`AGENTS.md`](../AGENTS.md), which OpenCode reads as project instructions |
| Skills | The `skills` link is OpenCode's skill discovery root |
| Agents | The `agents` link exposes the authored agents in their source dialect, so no translated copy is needed |
| Commands | `commands/` holds one link per top-level entry of `.skilled/commands/`, plus `goal-opencode.md`, the native goal command |
| Hooks and guards | The plugins in `plugins/`. They cover the skill advisor, the spec-folder gate, the CLI dispatch audit, the MCP route guard, post-edit quality, the injection screen, decision capture, the ask-surface guard, the sk-git gate and preflight advisory, the deep-loop guard, completion checks, session cleanup and the session-relaunch nudge |
| Advisor | `system-skill-advisor.js` |
| Goals | `opencode-goal.js` implements the goal tools, and `goal-opencode.md` drives them |
| MCP | The root `opencode.json` names `.skilled/bin/mcp-code-mode-launcher.cjs` as the Code Mode launcher |
| Dispatch | [`cli-opencode`](../.skilled/skills/cli-external-orchestration/cli-opencode/README.md) owns the dispatch contract for both versions |

---

## 3. GETTING STARTED

1. Install the plugin SDK once with `npm ci` in this folder. It creates `node_modules/`, which git ignores.
2. Run `opencode` from the repository root. OpenCode finds each plugin with a flat glob over `plugins/`, so a new plugin file needs no registration.
3. Use the commands as usual. `/goal-opencode` runs the goal workflow through the goal plugin.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `plugins/` | Authored here | The plugins, with their shared `lib/` and `tests/` folders. They live here because they import the SDK |
| `commands/` | Real folder of links | One link per top-level entry of `.skilled/commands/`, written by `sync-runtime-mirrors.cjs`. `goal-opencode.md` is authored here |
| `agents`, `skills`, `bin`, `scripts`, `hooks`, `repo-rules` | Links | Each points into `.skilled/` |
| `manual-testing-playbook` | Link | The `cli-opencode` playbook |
| `package.json`, `package-lock.json` | Authored | The module type and the pinned SDK |
| `node_modules/`, `.gitignore` | Written at install | Git ignores both |
| `README.md`, `SYNC.md` | Authored | The documentation |

**The one rule:** edit the source in `.skilled/`. A link has no content of its own, so the linked files cannot drift. Only the `commands/` links are generated, so rerun `sync-runtime-mirrors.cjs` after you add, rename or remove a command. The plugins are the exception, because they are the source and live here.

---

## 5. CHECKING IT IS HEALTHY

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
for e in .opencode/* .opencode/commands/*; do
  [ -e "$e" ] || echo "BROKEN $e"
done
```

The first command prints a `PASS` line and exits 0. The loop prints nothing when every link resolves, and it prints a `BROKEN` line for each one that does not. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. LIMITS AND KNOWN GAPS

- **Paths under `.opencode/` do not resolve on the web.** Each entry is a symlink. GitHub's file view and raw URLs return the link's target text, not the file. Write `.skilled/` in anything that becomes a link.
- **A checkout without symlink support loses the entries.** On Windows, unless symlinks are enabled, run `git config --global core.symlinks true` before you clone.
- **Plugins keep stdout quiet.** OpenCode draws stdout over the prompt line, so the plugins report through a system prompt transform or a tool result. On a failure path, `opencode-goal.js` and `system-skill-advisor.js` each write one line to stderr.
- **Some plugins can block a call.** `sk-git-message-gate.js` rejects by default, and so does the dispatch guard in `cli-dispatch-audit.js`. The sk-git gate has no off switch.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the surface inventory and drift checks
- [`plugins/README.md`](./plugins/README.md): each plugin and its hook core
- [`plugins/ARCHITECTURE.md`](./plugins/ARCHITECTURE.md): the dual export and the bridge
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`cli-opencode`](../.skilled/skills/cli-external-orchestration/cli-opencode/README.md): dispatching OpenCode from another runtime
- [`AGENTS.md`](../AGENTS.md): the shared instruction file
