---
title: "Pi CLI in Skilled"
description: "How the Pi CLI uses this repository: the shared guard cores bridged as TypeScript extensions, generated prompts and agents, the Code Mode server and the checks that confirm the bridges still resolve."
trigger_phrases:
  - "pi cli in skilled"
  - "pi folder readme"
  - "pi extensions"
---

# Pi CLI in Skilled

> Pi runs the same guard cores as the other runtimes through TypeScript extensions that re-export adapters kept beside the shared hook code.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Working on this repository in Pi with the shared guards, skills and prompts |
| **Start with** | Run `pi` in this checkout. Pi loads its extensions when the session starts |
| **Works on** | Pi sessions started from this checkout |
| **Checked by** | `/doctor:runtime-mirrors` and the commands in section 5 |

### What You Get

Pi has no hook configuration file. Its hooks are TypeScript extensions in `extensions/`, and each one is a one-line file that re-exports the adapter its owning hook core keeps. A fix to a guard therefore reaches Pi without a copy to update.

A handler fails open when its hook core faults, so a bug in a guard never blocks the work it watches. Pi also reads the root `AGENTS.md` from its working directory and the folders above it, so the shared instructions arrive without a copy here.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How Pi gets it |
|---|---|
| Instructions | The root [`AGENTS.md`](../AGENTS.md), loaded from the working directory and its parents |
| Skills | The `skills` link exposes the whole skill library |
| Agents | Each shared agent in `agents/`, in Pi's dialect. No installed Pi surface reads them today, so the folder stays current for a consumer that returns |
| Commands | One prompt template per command in `prompts/`. Each template points at its canonical command file. `goal-pi.md` is the native goal command |
| Hooks and guards | 22 extensions. They cover the advisor, the spec-folder gate, dispatch lint and audit, the task-dispatch guard, the MCP route guard, post-edit quality, the injection screen, the overlay guard, the env-secret guard, completion evidence, decision capture, the ask-surface guard, the sk-git gate and preflight advisory, the session context hooks and the session-relaunch nudge |
| Advisor | The `prompt-advisor` extension |
| Goals | The `goal-context` extension, and `goal-pi.md` for the native command |
| MCP | `mcp.json` registers the Code Mode server |
| Dispatch | [`cli-pi`](../.skilled/skills/cli-external-orchestration/cli-pi/README.md) hands work to Pi from another runtime. Pi is the one bridge that may dispatch its own runtime, because it has no in-process delegation left |

---

## 3. GETTING STARTED

1. Start Pi from the repository root. It loads `AGENTS.md`, the extensions and the prompt templates.
2. Pick a prompt template by name. Names flatten the command path, so `create/agent` becomes `create-agent`.
3. Run the checks in section 5 after you change a source file.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `extensions/*.ts` | One-line re-exports | Each re-exports an adapter from its owning hook core under `.skilled/` |
| `extensions/pi-cache-optimizer/`, `extensions/pi-fast-mode-w-subagent-support/` | Packages | Third-party extensions loaded from local folders |
| `prompts/*.md` | Generated, plus `goal-pi.md` | Written by `sync-prompts-pi.cjs`. `goal-pi.md` is authored |
| `agents/*.md` | Generated | Written by `sync-agents-pi.cjs` from `.skilled/agents/` |
| `skills` | Link | `../.skilled/skills` |
| `mcp.json`, `settings.json`, `models.json`, `custom-providers.md`, `PLUGINS.md` | Authored | The Code Mode server, the packages, the models and the providers |
| `statusline.sh`, `pi-*-config.json` | Authored | The status line and the per-package settings |
| `git/`, `npm/` | Package installs | Only their `.gitignore` files are tracked |
| `types/` | Authored | Type declarations for the extensions |

**The one rule:** never edit `prompts/` or `agents/` by hand. Change the source in `.skilled/`, then rerun the matching generator. To change what a guard does, change the hook core, because the extension only re-exports its adapter.

---

## 5. CHECKING IT IS HEALTHY

```bash
node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
```

The first two print a `PASS` line with their counts. The third prints a `PASS` line that names how many Pi extensions resolve. Each exits 0. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. LIMITS AND KNOWN GAPS

- **Generated agents are one way.** The permission-to-tool mapping does not round-trip, so `.skilled/agents/` stays the source.
- **The extensions have no behavioral drift checker.** `sync-hook-registrations.cjs --check` verifies each entry is a one-line re-export whose adapter exists, but a change in a shared core shows up only at runtime or in the manual testing playbook.
- **Editing a canonical agent gives no Pi reminder.** Only `--check` catches a stale `.pi` tree.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the surface inventory, format contract and drift checks
- [`extensions/README.md`](./extensions/README.md): how each extension bridges its hook core
- [`PLUGINS.md`](./PLUGINS.md): the Pi packages this environment enables
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`README.md`](../README.md): the repository overview
