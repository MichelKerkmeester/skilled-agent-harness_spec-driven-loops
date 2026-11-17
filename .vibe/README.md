---
title: "Vibe in Skilled"
description: "How Vibe uses this repository: the trusted project config, the generated agent profiles and skill links, the prompt stubs, the guard bundle in hooks.toml and the checks that confirm the folder is in sync."
trigger_phrases:
  - "vibe in skilled"
  - "vibe folder readme"
version: 1.0.0.0
---

# Vibe in Skilled

> Vibe reads one project folder at the checkout root and loads the shared guards and skills only when that root is trusted.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Working on this repository in Vibe, with the shared guards and the skill links |
| **Start with** | `vibe --trust` from the repository root |
| **Works on** | Sessions that trust this checkout root. A print-mode dispatch from a scratch folder gets a rendered copy through `VIBE_HOME` |
| **Checked by** | The sync checks and the guard bundle tests in section 5 |

### What You Get

Vibe walks up from the working directory to find `.vibe/config.toml`. The config holds the provider row and the model rows, and each model row pins its reasoning effort because Vibe has no reasoning flag. `hooks.toml` registers the hook entries beside it. Both project files apply only in a trusted checkout. The shared instructions arrive through the root `AGENTS.md`.

The guards are thin adapters. Each guard script reads the hook payload and calls a runtime-neutral core under `.skilled/`, so a rule fix reaches Vibe with no copy here. The agent profiles are generated from `.skilled/`, and the skill links point into it. The prompt stubs follow the command sources the same way.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How Vibe gets it |
|---|---|
| Instructions | The root `AGENTS.md`, read from `VIBE_HOME` and the project tree, outermost first. A run from a scratch folder outside the checkout loads no copy |
| Skills | `skills/<name>` is one relative symlink per shared skill, named by its frontmatter `name`. The link points at the directory, so its references and assets travel with it |
| Agents | `agents/<name>.toml`, one generated profile per `.skilled/agents/*.md`. The body becomes `instructions`, and a `mode: subagent` source becomes `agent_type = "subagent"` |
| Commands | `prompts/*.md`, one pointer stub per canonical command |
| Hooks and guards | `hooks.toml` declares the hook entries. Most run a script in `plugins/repo-guards/`, and the rest run an adapter under `.skilled/hooks/` |
| MCP | None. `config.toml` registers no server. The `mcp-route-guard` entry only refuses a native MCP call whose family has a Code Mode manual |

---

## 3. GETTING STARTED

Run these steps from the repository root.

1. Check the binary.

   ```bash
   vibe --version </dev/null
   ```

   Expected output: `vibe 3.1.2`. The dispatch contract for this repository expects that release.

2. Start a session with the project folder trusted.

   Run `vibe --trust` from the repository root. The flag trusts the working directory for that run, so `config.toml` and `hooks.toml` apply. An entry for the checkout root in the home's `trusted_folders.toml` keeps that trust between runs.

3. Reach a command through its prompt stub. The stub in `prompts/` names its canonical file under `.skilled/commands/` and leaves a line for your request, and a dispatcher appends the request there.

4. Run the checks in section 5 after you change a source file.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `agents/<name>.toml` | Generated | `sync-agents-vibe.cjs` writes one profile per `.skilled/agents/*.md` |
| `skills/<name>` | Generated link | `sync-skills-vibe.cjs` writes one relative symlink per skill, named by its frontmatter `name` |
| `prompts/*.md` | Generated | `sync-prompts-vibe.cjs` writes one pointer stub per canonical command |
| `config.toml` | Authored | The provider row and the model rows. No generator reads or writes it |
| `hooks.toml` | Authored | The hook entries. No generator reads or writes it |
| `plugins/repo-guards/` | Authored | The hook scripts, the shared `plugins/repo-guards/lib/hook-io.mjs`, recorded fixtures and the bundle tests |
| `plugins/README.md` | Authored | The hook map and the plugin map |
| `SYNC.md` | Authored | The surface inventory and the drift checks |
| `manual-testing-playbook` | Link | Points at the cli-mistral-vibe playbook |
| `README.md` | Authored | This file |

**The one rule:** Never edit a generated path by hand. Change the source under `.skilled/`, then rerun the matching generator. The [sync manifest](./SYNC.md) lists every surface with its source.

The guard scripts are authored, and their rules live in the cores under `.skilled/`. A rule fix belongs there, not in `hooks.toml` or an adapter.

---

## 5. CHECKING IT IS HEALTHY

Run these from the repository root.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-prompts-vibe.cjs --check
```

Each command ends with a `PASS` line that starts with its own tag, and each exits 0. The agent check prints `[vibe-agent-sync] PASS: 11 agent profiles are in sync.` The skill check prints its `EXCLUDED` lines, then `[vibe-skill-sync] PASS: 55 skill links are in sync.` The prompt check prints `[vibe-prompt-sync] PASS: 46 prompt stubs are in sync.` A tree that no longer matches its source exits 1.

```bash
node --test .vibe/plugins/repo-guards/tests/
```

The summary reports `ℹ pass 26` and `ℹ fail 0`, and the command exits 0. The suites run the hook scripts against hand-built wire-format payloads, so they cover the scripts and not a live session.

CI runs the same sync checks in the `vibe-mirror` job of `.github/workflows/command-tree-parity.yml`, on a pull request into `main` or `skilled/**`, or a push to either, that touches `.vibe/`, an agent, a command or a `SKILL.md`.

---

## 6. LIMITS AND KNOWN GAPS

- **An untrusted checkout ignores the project files.** Without `--trust` or an entry for the checkout root in the home's `trusted_folders.toml`, Vibe uses the home config and the guards do not load in place.
- **A scratch dispatch reads no project folder.** A print-mode run from a temp cwd needs its config and hooks in its `VIBE_HOME`: the caller copies `config.toml` there and renders `hooks.toml` through `render-home-hooks.cjs`. A run that skips the copy has no model rows, and a run that skips the render has no guards.
- **A prompt stub is not a command.** Vibe has no command loader and no `$ARGUMENTS` substitution, so nothing under `prompts/` runs as a slash name.
- **No local hook runs the sync checks.** CI runs them in the `vibe-mirror` job. No pre-commit hook does, so a drifted tree sits in the working copy until CI runs.
- **A generated profile carries no tool restriction.** The OpenCode `permission` map does not travel into Vibe, so a profile's declared tool limits do not apply.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the surface inventory that pairs each source with its sync command
- [`plugins/README.md`](./plugins/README.md): the hook map and the plugin map, with the bundle test commands
- [`manual-testing-playbook`](./manual-testing-playbook/manual-testing-playbook.md): the live probes and their evidence rules
- [the hook cores](../.skilled/hooks/README.md): the shared guard cores and their switches
- [the Vibe dispatch skill](../.skilled/skills/cli-external-orchestration/cli-mistral-vibe/README.md): the command shape and the rules the preflight enforces
- [the repository overview](../README.md): what the shared framework holds
- [`AGENTS.md`](../AGENTS.md): the shared instruction file
