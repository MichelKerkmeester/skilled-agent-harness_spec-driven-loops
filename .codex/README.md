---
title: "Codex CLI in Skilled"
description: "How the Codex CLI uses this repository: the agents, prompts and hooks that generators write from .skilled/, how to approve the hooks and how to check that they are in sync."
trigger_phrases:
  - "codex cli in skilled"
  - "codex folder readme"
  - "codex hooks approval"
---

# Codex CLI in Skilled

> Codex reads this repository through agents, prompts and hooks that generators write from the shared source, so the same guards run in a Codex session.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Working on this repository in the Codex CLI with the shared agents, prompts and guards |
| **Start with** | Run `codex` in this checkout, then approve the project hooks once (section 3) |
| **Works on** | Codex sessions started from this checkout |
| **Checked by** | `/doctor:runtime-mirrors` and the commands in section 5 |

### What You Get

Codex cannot read `.skilled/` directly. It wants agents as TOML files, prompts as a flat folder and hooks in its own `hooks.json`. Generators translate the shared source into those formats, and this folder holds their output.

Each generator deletes any output it no longer expects, so a removed command or agent leaves no stale copy behind. The `config.toml` file is the one file here that no generator writes. It turns hooks on and sets up the Code Mode server.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How Codex gets it |
|---|---|
| Instructions | The root [`AGENTS.md`](../AGENTS.md), the shared instruction file for every runtime |
| Skills | No skills folder here. The advisor brief on each prompt names the skill to load, and the skill files load from `.skilled/skills/` |
| Agents | Each shared agent as a TOML file in `agents/`, written by `sync-agents.cjs`. Each file carries the full agent text |
| Commands | One prompt stub per command in `prompts/`, written by `sync-prompts.cjs`. A command such as `create/agent` becomes `create-agent`, and the stub tells Codex to read the canonical file in full |
| Hooks and guards | `hooks.json`, rendered from the shared hook registry. The hooks cover the advisor, the spec-folder gate, the dispatch and MCP route guards, the post-edit checks and the session context. Each command falls back to a message when its adapter is missing |
| Advisor | The advisor runs on the prompt hook and names the skill for each request |
| MCP | The Code Mode server is written inline in `config.toml` |
| Goals | No goal hook in the registry. The `create-goal` prompt authors a packet's `goal.md`, but Codex gets no session goal command here |
| Dispatch | [`cli-codex`](../.skilled/skills/cli-external-orchestration/cli-codex/README.md) hands work to Codex from another runtime. Its [hook contract](../.skilled/skills/cli-external-orchestration/cli-codex/references/hook-contract.md) lists every hook a dispatched session runs |

---

## 3. GETTING STARTED

1. Open the repository in Codex from its root. Codex reads `hooks.json` from this checkout once the checkout is trusted.
2. Approve the hooks. Codex runs a project hook only after you approve that exact entry. Open `/hooks` in an interactive session and approve each entry it lists for review. The approval is stored as a `trusted_hash` in `~/.codex/config.toml`, so a changed entry needs approving again.
3. Check the global file. `~/.codex/hooks.json` must hold no copy of these entries, or each hook runs twice. Run `install-codex-hooks.mjs --check` to confirm that it holds no stale copy.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `agents/*.toml` | Generated | Written by `sync-agents.cjs`. The sandbox mode and model settings are set here and cannot be read back into `.skilled/` |
| `prompts/*.md` | Generated | Written by `sync-prompts.cjs`. Each stub points at its canonical command file |
| `hooks.json` | Generated | Rendered from `hook-registry.json` by `sync-hook-registrations.cjs` |
| `hooks/` | Links | A discovery mirror of the scripts that `hooks.json` runs |
| `config.toml` | Authored | Turns hooks on and writes the Code Mode server inline. No generator writes it |
| `repo-rules`, `manual-testing-playbook` | Links | The rule files and the `cli-codex` playbook |
| `README.md`, `SYNC.md` | Authored | The documentation |

**The one rule:** never edit a generated file here. Change the source in `.skilled/`, or change `hook-registry.json` for hooks, then rerun the matching generator. A hand edit to `hooks.json` is overwritten by the next sync.

---

## 5. CHECKING IT IS HEALTHY

```bash
node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
node .skilled/bin/install-codex-hooks.mjs --check
```

The agent and prompt checks print a `PASS` line with their counts. The hook check prints a `PASS` line. The installer prints `OK` and the path to `~/.codex/hooks.json`. Each exits 0. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. LIMITS AND KNOWN GAPS

- **Generated agents are one way.** The sandbox mode and model settings cannot round-trip back to `.skilled/agents/`, so the source stays there.
- **A stale prompt stays quiet.** A stub that points at a deleted command file still loads and looks valid. Only `--check` catches it.
- **Every hook change needs a new approval.** A changed entry shows up in `/hooks` again, because the approval is stored as a hash.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the full surface inventory, format contract and drift checks
- [`hooks/README.md`](./hooks/README.md): why `hooks/` is a discovery mirror
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`AGENTS.md`](../AGENTS.md): the shared instruction file
- [`README.md`](../README.md): the repository overview
