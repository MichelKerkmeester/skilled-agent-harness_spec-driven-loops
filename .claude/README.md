---
title: "Claude Code Runtime Folder"
description: "What Claude Code reads from .claude/, which entries are generated from .skilled/ and which are authored here, how its hooks are registered and how to check the mirrors."
trigger_phrases:
  - "claude code runtime folder"
  - "claude folder readme"
  - "claude code hooks registration"
---

# Claude Code Runtime Folder

> The `.claude/` folder is where Claude Code finds this repository's agents, commands, hooks and MCP servers, nearly all of it drawn from `.skilled/`.

---

## 1. OVERVIEW

Skilled keeps its authored content in [`.skilled/`](../.skilled). Claude Code does not read that folder by name, so this one exposes the same skills, commands, agents and hooks at the paths Claude Code scans. Most entries are links or generated output. Edit the source in `.skilled/` and rerun the generator, never the copy here.

Two parts are real files. The agents are a Claude-dialect copy of `.skilled/agents/`, because Claude declares tools with a `tools:` list where the source uses a `permission:` map. `settings.json` holds the hook registrations and the runtime settings. The shared instruction file for every runtime is the root [`AGENTS.md`](../AGENTS.md).

---

## 2. WHAT IS HERE

| Entry | Kind | What it holds |
|---|---|---|
| `agents/` | real files, guarded copy | The 11 shared agents in Claude's dialect, plus the Claude-only `Explore.md` and `README.txt`. Cursor and Devin link to these files |
| `commands/` | generated links | One relative link per command in `.skilled/commands/`, minus the OpenCode-only ones |
| `hooks/` | generated links | A discovery mirror of every hook script `settings.json` runs. The registrations call `.skilled/` paths directly |
| `skills` | link | `../.skilled/skills`, the whole skill library |
| `settings.json` | partly generated | Its `hooks` key is rendered from the shared hook registry. The rest is authored here |
| `mcp.json` | authored, canonical | The MCP servers. The root `.mcp.json` links to this file |
| `.utcp_config.json` | link | `../.utcp_config.json`, the Code Mode manual list |
| `repo-rules` | link | `../.skilled/repo-rules`, the rule files `REPO RULES.md` routes |
| `manual-testing-playbook` | link | The `cli-claude-code` playbook |
| `statusline-command.sh` | authored | The status line script |
| `SYNC.md` | authored | The surface inventory and drift checks |

`settings.local.json` and `scheduled_tasks.lock` belong to one machine, and so does the `worktrees/` folder. Git ignores all of them.

---

## 3. HOOKS

Claude Code reads its hooks from the `hooks` key of `settings.json`. That key is generated: [`hook-registry.json`](../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json) names each hook once with its script and its per-runtime events, and `sync-hook-registrations.cjs` renders the Claude block from it. The registry binds 26 hooks to Claude Code across `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `PreCompact`, `Stop` and `SessionEnd`.

The hook cores that run here include the skill advisor, the spec-folder gate, the CLI dispatch lint and audit, the MCP route guard, the post-edit quality checks, the overlay guard, the sk-git message gate and preflight advisory, decision capture and the session-relaunch nudge. The coverage matrix in [`.skilled/hooks/README.md`](../.skilled/hooks/README.md) is the authority for which concern runs on which runtime.

A session that was already running when a hook changed may need `/hooks` approval or a restart before the new entry runs.

---

## 4. WHAT CLAUDE CODE LOADS

- **Instructions.** Claude Code reads the root `AGENTS.md` directly, so the gates and rules reach every session without a copy here.
- **Skills.** `skills` links to the whole library, so every `SKILL.md` and its `ROUTER.md` load from their canonical folder.
- **Agents.** Each file in `agents/` matches its `.skilled/agents/` twin apart from the frontmatter dialect and the path line. The pre-commit hook runs `check-agent-mirror-sync.cjs` and blocks a commit whose pair has drifted.
- **Commands.** Slash commands such as `/speckit:plan` resolve through the links in `commands/`, so editing a command in `.skilled/commands/` needs no relink.

---

## 5. KEEPING IT IN SYNC

```bash
# Re-render the hook registrations from the shared registry
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs

# Refresh the command and hook link trees
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs
```

Each generator takes `--check` to report drift without writing. The agent copy has its own check.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
node .skilled/bin/check-agent-mirror-sync.cjs --all
```

Expected output: a `PASS` line from the first and a line ending in `OK` from the second, each with exit 0. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. DISPATCHING CLAUDE CODE

Another runtime hands work to Claude Code through the [`cli-claude-code`](../.skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md) mode of the `cli-external-orchestration` hub. That mode owns the dispatch contract, and it refuses to dispatch Claude Code from inside a Claude Code session.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the full surface inventory and known gaps
- [`hooks/README.md`](./hooks/README.md): why `hooks/` is a discovery mirror
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`AGENTS.md`](../AGENTS.md): the shared instruction file
- [`README.md`](../README.md): the repository overview
