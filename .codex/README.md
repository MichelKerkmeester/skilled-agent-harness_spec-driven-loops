---
title: "Codex CLI in Skilled"
description: "How the Codex CLI uses this repository: the generated agents and prompts, the hook entries that point at .skilled/ and the checks that confirm the folder is in sync."
trigger_phrases:
  - "codex cli in skilled"
  - "codex folder readme"
  - "codex hooks approval"
---

# Codex CLI in Skilled

> Codex reaches this repository's guards through `.codex/hooks.json` and the shared instructions through the root `AGENTS.md`.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Working on this repository in the Codex CLI, with the shared guards and instruction files |
| **Start with** | Run `codex` in this checkout, then approve the project hooks once (section 3) |
| **Works on** | Codex sessions started from this checkout |
| **Checked by** | The `/doctor-runtime-mirrors` prompt and the commands in section 5 |

### What You Get

Codex wants agents as TOML and prompts in a flat folder. Generators write both from the shared source in `.skilled/`. Each generator also deletes output it no longer expects.

The hook entries in `.codex/hooks.json` name real files under `.skilled/`, so a fix to a guard reaches Codex with no copy in this folder. The shared instructions arrive through the root `AGENTS.md`.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How Codex gets it |
|---|---|
| Instructions | The root [`AGENTS.md`](../AGENTS.md), the shared instruction file for every runtime |
| Skills | No skills folder here. The advisor brief that arrives with a prompt names the skill to load. The skill files load from `.skilled/skills/` |
| Agents | One TOML file per shared agent in `agents/`, written by `sync-agents.cjs`. Each file carries the full agent text |
| Commands | One prompt stub per command in `prompts/`, written by `sync-prompts.cjs`. A command such as `create/agent` becomes `create-agent`. The stub tells Codex to read the canonical file in full |
| Hooks and guards | `hooks.json`, rendered from the shared hook registry. The entries run the session hooks and the tool guards. Most fall back to a message when their adapter is missing |
| MCP | The Code Mode server is written inline in `config.toml` |

---

## 3. GETTING STARTED

1. Start Codex from the repository root. `codex` opens the TUI. The session reads the root `AGENTS.md`. Once the checkout is trusted, Codex also reads `.codex/hooks.json`.
2. Approve the hooks. Open `/hooks` in an interactive session and approve each entry it lists for review. Codex stores the approval in `~/.codex/config.toml` as a `trusted_hash`, so a changed entry is likely to need approving again.
3. Keep the user-global hook file free of copies. Codex reads `~/.codex/hooks.json` too. A copy of these entries makes each hook run twice. Section 5 has the check that confirms the file holds none.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `agents/*.toml` | Generated | `sync-agents.cjs` writes each file. Both `sandbox_mode` and the model settings come from a per-agent table in the generator. Only an agent the table does not list gets its mode derived from the `permission:` block |
| `prompts/*.md` | Generated | `sync-prompts.cjs` writes one stub per command. Each stub points at its canonical file |
| `hooks.json` | Generated | `sync-hook-registrations.cjs` renders it from `hook-registry.json` |
| `hooks/` except its `README.md` | Links | `sync-runtime-mirrors.cjs` builds one link per command in `hooks.json`, so you can find the file a hook runs |
| `config.toml` | Authored | It turns hooks on and writes the Code Mode server inline. No generator writes it |
| `repo-rules`, `manual-testing-playbook` | Links | The shared rule files and the `cli-codex` playbook |
| `README.md`, `SYNC.md` | Authored | The folder's own documentation |

**The one rule:** Never edit a generated path here by hand. Change the source in `.skilled/`. For a hook entry, edit `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` instead. Then rerun the matching generator. The [sync manifest](./SYNC.md) lists every surface with its source.

---

## 5. CHECKING IT IS HEALTHY

Run each command from the repository root.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
node .skilled/bin/install-codex-hooks.mjs --check
```

- The agent check prints `[codex-agent-sync] PASS: 11 agents are in sync.`
- The prompt check prints `[codex-prompt-sync] PASS: 46 prompts are in sync.`
- The hook registration check prints `[hook-registration-sync] PASS:` and then `4 registration files match the 36-hook registry` and `22 Pi extensions resolve`.
- The mirror check ends with `[runtime-mirror-sync] PASS: 260 mirrors across 10 trees are in sync.`
- The installer check prints `install-codex-hooks: OK` and the path to `~/.codex/hooks.json`.

Each command exits 0 and writes nothing. The `/doctor-runtime-mirrors` prompt runs every runtime's mirror checks from a session.

---

## 6. LIMITS AND KNOWN GAPS

- **Generated agents are one way.** The sandbox mode and the model settings come from a per-agent table in the generator, not from the source's `permission:` block. A hand edit to a TOML is overwritten by the next sync.
- **A stale prompt stays quiet.** A stub that points at a deleted command file still loads and looks valid. Run `sync-prompts.cjs --check` to catch it.
- **A changed hook entry needs review.** Codex stores the approval as a hash, so an edited entry is likely to need approving again.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the full surface inventory and the drift checks
- [`hooks/README.md`](./hooks/README.md): the link index and the hook switches
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`AGENTS.md`](../AGENTS.md): the shared instruction file
- [`README.md`](../README.md): the repository overview
- [The Codex dispatch skill](../.skilled/skills/cli-external-orchestration/cli-codex/README.md): how another runtime hands work to Codex
