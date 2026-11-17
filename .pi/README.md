---
title: "Pi CLI in Skilled"
description: "How the Pi CLI uses this repository: the shared guard cores bridged as TypeScript extensions, generated prompts and agents, the Code Mode server and the checks that confirm the bridges still resolve."
trigger_phrases:
  - "pi cli in skilled"
  - "pi folder readme"
  - "pi extensions"
---

# Pi CLI in Skilled

> Pi runs the same guard cores as the other runtimes. Each one reaches Pi through a one-line TypeScript extension that re-exports an adapter under `.skilled/`.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Working on this repository in Pi with the shared instructions, guards, skills and commands |
| **Start with** | `pi` from the repository root |
| **Works on** | Pi sessions started in this checkout |
| **Checked by** | `/doctor-runtime-mirrors` and the commands in section 5 |

### What You Get

Pi reads the root [`AGENTS.md`](../AGENTS.md) from the working directory and the folders above it, so the shared rules arrive without a copy in this folder. It also discovers the extensions in `extensions/` and the prompt templates in `prompts/`. The `code_mode` server comes from `mcp.json`.

The guard layer is TypeScript, not a hooks file. Pi calls the default export of each top-level entry. That entry re-exports an adapter under `.skilled/`. The adapter registers the handler and calls the core that owns the policy. An entry holds no policy of its own, so a behavior change belongs in the adapter or in the core it calls.

A handler that throws returns `undefined` and the call continues. `git-message-gate` is the one exception. It refuses a command when the sk-git rulebook exists but cannot be read.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | Where Pi finds it |
|---|---|
| Instructions | The root [`AGENTS.md`](../AGENTS.md), read from this checkout. `--no-context-files` turns discovery off |
| Skills | The `skills` link to `.skilled/skills` |
| Agents | `agents/*.md`, generated from `.skilled/agents/` |
| Commands | `prompts/*.md`, one stub per command under `.skilled/commands/`, plus the authored `goal-pi.md` |
| Hooks and guards | `extensions/`, one entry per bridge. The entries cover the guards, the prompt advisor, goal context and the session lifecycle |
| MCP | [`mcp.json`](./mcp.json) registers the `code_mode` server through `.skilled/bin/mcp-code-mode-launcher.cjs` |

Each command stub names its canonical file under `.skilled/commands/` and passes the arguments through. Pi exposes the file name as the slash command, so `create/agent` becomes `/create-agent`.

---

## 3. GETTING STARTED

1. Run `pi` from the repository root. Pi loads the project settings in this folder, then discovers `extensions/` and `prompts/` for the checkout.
2. Call a template by name, such as `/create-agent`. The name is the command path with the slash flattened to a dash.
3. Run the checks in section 5 after you change a source file.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `agents/*.md` | Generated | `sync-agents-pi.cjs` writes them from `.skilled/agents/` |
| `prompts/*.md` | Generated | `sync-prompts-pi.cjs` writes one stub per command |
| `prompts/goal-pi.md` | Authored | The fallback behind the registered `/goal-pi` command |
| `extensions/*.ts` | Re-exports | One line each, pointing at an adapter under `.skilled/` |
| `extensions/lib/claude-hook-adapter.ts` | Link | Points into the spec-kit hook library |
| `extensions/pi-cache-optimizer/`, `extensions/pi-fast-mode-w-subagent-support/` | Local packages | Loaded from the `packages` list in `settings.json` |
| `skills`, `repo-rules` | Links | The skill library and the repo rule set |
| `manual-testing-playbook` | Link | Points at the cli-pi playbook |
| `mcp.json`, `settings.json` | Authored | The server and the project settings |
| `models.json`, `pi-blackhole-config.json`, `pi-cache-optimizer-config.json` | Authored | Provider blocks and per-package settings |
| `pi-fast-mode-w-subagent-support-config.json`, `deep-pi-stats.json` | Local state, git-ignored | Written at run time, never committed |
| `custom-providers.md`, `PLUGINS.md` | Authored | Provider and package notes |
| `statusline.sh` | Authored | The command behind the status line |
| `types/` | Authored | Declarations for `tsconfig.pi.json` |
| `git/`, `npm/` | Installs | Package output. Only the `.gitignore` files are tracked |

**The one rule:** Never edit the generated `agents/*.md` or `prompts/*.md` by hand. `prompts/goal-pi.md` is the one authored prompt, and the generator never writes or prunes it. Change the source under `.skilled/`, then rerun the matching generator. A guard change belongs in the adapter or the core it calls. The [sync manifest](./SYNC.md) lists every surface with its source.

---

## 5. CHECKING IT IS HEALTHY

```bash
node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
```

The agents check prints `[pi-agent-sync] PASS: 11 agents are in sync.` The prompts check prints `[pi-prompt-sync] PASS: 46 prompts are in sync.` The extensions check prints `[hook-registration-sync] PASS: 4 registration files match the 36-hook registry; 22 Pi extensions resolve.` Each exits 0.

The [runtime mirrors check](./prompts/doctor-runtime-mirrors.md) (`/doctor-runtime-mirrors`) runs the mirror, generator and roster checks for every runtime at once and writes nothing. It does not run the hook-registration check, so run that from the shell.

---

## 6. LIMITS AND KNOWN GAPS

- **The agent mirror is one way.** The permission map loses what Pi has no tool for, so `.skilled/agents/` stays the source.
- **No surface loads the agents.** Pi has no agent flag, so `agents/` is a checked mirror with no reader today.
- **The extensions have no behavioral drift check.** `sync-hook-registrations.cjs --check` confirms each entry is a re-export of an adapter that exists. A change in a shared core shows up in the Pi adapter suites under `.skilled/hooks/*/pi/`, which [the extensions README](./extensions/README.md) lists, at run time or in the manual testing playbook.
- **The goal fallback cannot act.** If the goal extension does not load, `prompts/goal-pi.md` refuses to bind a session and says so.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the surface inventory, format contract and drift checks
- [`extensions/README.md`](./extensions/README.md): how each extension reaches its hook core
- [`types/README.md`](./types/README.md): the declarations behind `tsconfig.pi.json`
- [`PLUGINS.md`](./PLUGINS.md): the packages this environment enables
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`README.md`](../README.md): the repository overview
