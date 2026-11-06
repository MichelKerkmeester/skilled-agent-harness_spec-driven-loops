---
title: "Codex CLI Runtime Folder"
description: "What Codex reads from .codex/, the generators that write its agents and prompts from .skilled/, how its hooks are registered and approved and how to check the mirrors."
trigger_phrases:
  - "codex runtime folder"
  - "codex folder readme"
  - "codex hooks approval"
---

# Codex CLI Runtime Folder

> The `.codex/` folder is the Codex CLI's view of this repository, written almost entirely by generators that translate `.skilled/` into Codex's own formats.

---

## 1. OVERVIEW

Skilled keeps its authored content in [`.skilled/`](../.skilled). Codex cannot read that tree directly: it wants agents as TOML files and commands as a flat folder of prompts. Two generators therefore translate `.skilled/agents/` and `.skilled/commands/` into this folder, and each one deletes any output it no longer expects. Never edit a generated file here. Edit its source and rerun the generator.

Codex has no skills folder of its own here. Skill routing reaches a Codex session through the skill-advisor hook and the root [`AGENTS.md`](../AGENTS.md), which Codex loads as project instructions.

---

## 2. WHAT IS HERE

| Entry | Kind | What it holds |
|---|---|---|
| `agents/*.toml` | generated | The 11 shared agents, written by `sync-agents.cjs` from `.skilled/agents/` |
| `prompts/*.md` | generated | One short stub per command, written by `sync-prompts.cjs`. Each stub points at its canonical file in `.skilled/commands/` |
| `hooks.json` | generated | The hook registrations, rendered from the shared hook registry |
| `hooks/` | generated links | A discovery mirror of the scripts `hooks.json` runs |
| `config.toml` | authored | Runtime settings with `hooks = true`, and the MCP servers written inline |
| `repo-rules` | link | `../.skilled/repo-rules`, the rule files `REPO RULES.md` routes |
| `manual-testing-playbook` | link | The `cli-codex` playbook |
| `SYNC.md` | authored | The surface inventory and drift checks |

A prompt's name is its flattened command path, so `.skilled/commands/create/agent.md` becomes `prompts/create-agent.md`.

---

## 3. HOOKS

Codex reads the repository's own `hooks.json` once the checkout is trusted. The file is generated: [`hook-registry.json`](../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json) names each hook once, and `sync-hook-registrations.cjs` renders the Codex block from it. The registry binds 21 hooks to Codex across `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PreCompact` and `Stop`. Each command carries a fallback, so a missing adapter prints a message instead of failing the turn.

Codex runs a project hook only after you approve that exact entry. Open `/hooks` in an interactive Codex session after any `hooks.json` change and approve every entry it lists for review. The approval is stored in `~/.codex/config.toml` as a hash, so a changed entry usually needs approving again.

The user-global `~/.codex/hooks.json` must hold no copy of these entries, or each hook runs twice. `install-codex-hooks.mjs` removes repository entries and orphans from that file and keeps any third-party entries it finds.

The hook cores that run here include the skill advisor, the spec-folder gate, the CLI dispatch lint and audit, the MCP route guard, the post-edit quality checks, the overlay guard, the sk-git message gate and preflight advisory and the session-relaunch nudge. The coverage matrix in [`.skilled/hooks/README.md`](../.skilled/hooks/README.md) records what Codex cannot run and why.

---

## 4. WHAT CODEX LOADS

- **Instructions.** Codex loads the root `AGENTS.md` as project instructions.
- **Skills.** There is no skills mirror. The advisor brief on each prompt names the skill to load, and the skill files load from `.skilled/skills/`.
- **Agents.** Each TOML file carries the full agent body. The generator sets its `sandbox_mode` and its model settings, so neither can be read back into the source.
- **Commands.** A command runs as a Codex prompt such as `speckit-plan`, and the stub tells Codex to read the canonical command file in full.

---

## 5. KEEPING IT IN SYNC

```bash
node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs
node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs
```

Each generator takes `--check` to report drift without writing. The installer's check reads the user-global file.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check
node .skilled/bin/install-codex-hooks.mjs --check
```

Expected output: `PASS: 11 agents are in sync.` from the first and an `OK` line naming `~/.codex/hooks.json` from the second, each with exit 0. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. DISPATCHING CODEX

Another runtime hands work to Codex through the [`cli-codex`](../.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md) mode of the `cli-external-orchestration` hub. Its [hook contract](../.skilled/skills/cli-external-orchestration/cli-codex/references/hook-contract.md) lists every hook a dispatched Codex session runs.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the full surface inventory and known gaps
- [`hooks/README.md`](./hooks/README.md): why `hooks/` is a discovery mirror
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`AGENTS.md`](../AGENTS.md): the shared instruction file
- [`README.md`](../README.md): the repository overview
