---
title: "Devin CLI Runtime Folder"
description: "What Devin reads from .devin/, the nested agent links and the skills link it uses, how its hooks are registered, why it carries no commands or rules and how to check the mirrors."
trigger_phrases:
  - "devin runtime folder"
  - "devin folder readme"
  - "devin hooks registration"
---

# Devin CLI Runtime Folder

> The `.devin/` folder gives the Devin CLI this repository's agents, skills, hooks and MCP setup at the paths and in the nested shape Devin scans.

---

## 1. OVERVIEW

Skilled keeps its authored content in [`.skilled/`](../.skilled). Devin reads the same files as its sibling runtimes, but at different paths: an agent must sit at `agents/<name>/AGENT.md`, one folder per agent. Every mirror here is a link. The agent links point at the Claude-dialect copies in [`.claude/agents/`](../.claude/agents), whose `tools:` frontmatter Devin accepts unchanged.

Two files are authored for Devin alone. `mcp_config.json` is Devin's own MCP file, and `config.json` turns off Devin's Claude import. With that import off, Devin loads this checkout's own root [`AGENTS.md`](../AGENTS.md) instead of a copy reached through `~/.claude/`.

---

## 2. WHAT IS HERE

| Entry | Kind | What it holds |
|---|---|---|
| `agents/<name>/AGENT.md` | generated links | The 11 shared agents, each linking to `.claude/agents/<name>.md` |
| `skills` | link | `../.skilled/skills`, the whole skill library |
| `hooks.v1.json` | generated | The hook registrations, rendered from the shared hook registry |
| `hooks/` | generated links | A discovery mirror of the scripts `hooks.v1.json` runs |
| `config.json` | authored | Sets `read_config_from.claude` to `false` |
| `mcp_config.json` | authored, Devin-owned | The MCP servers |
| `repo-rules` | link | `../.skilled/repo-rules`, the rule files `REPO RULES.md` routes |
| `manual-testing-playbook` | link | The `cli-devin` playbook |
| `SYNC.md` | authored | The surface inventory and drift checks |

`config.local.json` belongs to one machine and is ignored by git. There is no commands folder: Devin carries no mirrored command surface. There is no rules folder either, because Devin inherits the Cursor rule in [`.cursor/rules/`](../.cursor/rules) and the root `AGENTS.md`.

---

## 3. HOOKS

Devin reads its hooks from `hooks.v1.json`, which is generated: [`hook-registry.json`](../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json) names each hook once, and `sync-hook-registrations.cjs` renders Devin's dialect from it, with the event names at the top level and anchored regex matchers. The registry binds 26 hooks to Devin across `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PostCompaction`, `Stop` and `SessionEnd`.

This repository dispatches Devin with `--permission-mode bypass`. Under bypass Devin never raises `PermissionRequest`, so the hook registered for it stays idle. `PreToolUse` still fires, so the spec-folder gate and the dispatch guards stay active.

The hook cores that run here include the skill advisor, the spec-folder gate, the CLI dispatch lint and audit, the MCP route guard, the post-edit quality checks, the overlay guard, the sk-git message gate and preflight advisory, decision capture and the goal injection. The coverage matrix in [`.skilled/hooks/README.md`](../.skilled/hooks/README.md) is the authority per concern.

---

## 4. WHAT DEVIN LOADS

- **Instructions.** Devin loads the root `AGENTS.md` and the shared Cursor rule. It cuts each rule file at 16,384 bytes, so hard rules must sit in the first 16 KB.
- **Skills.** The `skills` link exposes each skill as a slash command, such as `/sk-doc` or `/sk-git`.
- **Agents.** Each `AGENT.md` must stay a link. A real file there is a silent fork.
- **Strict frontmatter.** Devin drops a whole file whose frontmatter fails a strict YAML parse, such as an unquoted `description:` holding a colon. A file missing from `devin skills list` usually has that fault.

---

## 5. KEEPING IT IN SYNC

```bash
# Re-render the hook registrations from the shared registry
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs

# Refresh the agent and hook link trees
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs
```

Each generator takes `--check` to report drift without writing.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs
```

Expected output: a `PASS` line from the first and `STATUS=OK` from the second, each with exit 0. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. DISPATCHING DEVIN

Another runtime hands work to the Devin CLI through the [`cli-devin`](../.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md) mode of the `cli-external-orchestration` hub. That mode owns the dispatch contract and the permission-mode rules.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the full surface inventory and known gaps
- [`hooks/README.md`](./hooks/README.md): why `hooks/` is a discovery mirror
- [`.cursor/rules/skill-routing.md`](../.cursor/rules/skill-routing.md): the routing rule Devin inherits
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`README.md`](../README.md): the repository overview
