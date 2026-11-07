---
title: "Claude Code in Skilled"
description: "How Claude Code uses this repository: the skills, agents, commands, hooks and MCP servers it loads, which files are generated from .skilled/ and how to check that they are in sync."
trigger_phrases:
  - "claude code in skilled"
  - "claude folder readme"
  - "claude code hooks"
---

# Claude Code in Skilled

> Open this repository in Claude Code and its agents, commands, skills, guards and MCP servers load with the session.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Working on this repository in Claude Code with the same skills, agents and guards the other runtimes use |
| **Start with** | Open the repository in Claude Code, then type `/` to see its commands |
| **Works on** | Claude Code sessions started from this checkout |
| **Checked by** | `/doctor:runtime-mirrors` and the commands in section 5 |

### What You Get

Skilled keeps its authored content in [`.skilled/`](../.skilled). Claude Code does not read that folder by name, so `.claude/` exposes the same skills, commands and hooks at the paths Claude Code scans. You edit a skill once, and Claude Code, Codex, Cursor and the other runtimes all read that one file.

Two parts belong to Claude Code alone. The agents are a copy in Claude's dialect, because Claude declares tools in a `tools:` list. The hook registrations live in `settings.json`. They switch on the guards that check each prompt, each tool call and each file write.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How Claude Code gets it |
|---|---|
| Instructions | The root [`AGENTS.md`](../AGENTS.md). The repository has no separate Claude instruction file, so there is no second copy to drift |
| Skills | The `skills` link points at `.skilled/skills`, so each `SKILL.md` and its `ROUTER.md` load from their own folder |
| Agents | Each shared agent in `agents/`, plus `Explore.md`, which only Claude has |
| Commands | Links to the command families in `.skilled/commands/`, such as `/speckit:plan` and `/doctor:runtime-mirrors` |
| Hooks and guards | 26 hooks in `settings.json`, rendered from the shared registry. They cover the spec-folder gate, the dispatch and MCP route guards, the post-edit checks and the session context |
| Advisor | The skill advisor runs on each submitted prompt and names the skill to load |
| MCP | `mcp.json` names the servers. The root `.mcp.json` links to it. `.utcp_config.json` gives Code Mode its manual list |
| Goals | Skilled registers no goal hook for this runtime, and this folder authors no session goal command |
| Dispatch | Other runtimes hand work to Claude Code through the [`cli-claude-code`](../.skilled/skills/cli-external-orchestration/cli-claude-code/README.md) mode, which refuses to dispatch Claude Code from inside a Claude Code session |

---

## 3. GETTING STARTED

1. Open the repository in Claude Code from its root folder. Claude Code reads `settings.json` for its hooks and the root `AGENTS.md` for instructions.
2. Type `/` to list the commands. Commands group under a family prefix, such as `/speckit`, `/doctor` and `/create`.
3. Run `/doctor:runtime-mirrors` when you want to know whether every runtime still matches `.skilled/`. It reports and writes nothing.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `agents/` | Copy in Claude's dialect | Follows `.skilled/agents/`. The pre-commit gate compares each pair |
| `commands/`, `hooks/`, `skills`, `repo-rules` | Links | Point into `.skilled/` and cannot drift |
| `settings.json` | Partly generated | The `hooks` key is rendered from `hook-registry.json`. The other keys are authored here |
| `mcp.json` | Authored | The canonical MCP file. The root `.mcp.json` links to it |
| `.utcp_config.json` | Link | Points at the root Code Mode manual list |
| `statusline-command.sh`, `README.md`, `SYNC.md` | Authored | The status line and the documentation |
| `settings.local.json`, `scheduled_tasks.lock`, `worktrees/` | Per machine | Git ignores them |

**The one rule:** edit the source in `.skilled/`, not the copy here, and rerun the generator when a command or hook changes. Hooks come from `hook-registry.json`. Change that file, then rerun `sync-hook-registrations.cjs`. A hand edit to the `hooks` key in `settings.json` does not last. For agents, change `.skilled/agents/` first and carry the same change into `agents/`. The pre-commit gate blocks a commit whose pair has drifted.

---

## 5. CHECKING IT IS HEALTHY

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
node .skilled/bin/check-agent-mirror-sync.cjs --all
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
```

The first and third print a `PASS` line. The second ends with `OK`. Each exits 0. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. LIMITS AND KNOWN GAPS

- **The agents are a fork, not a mirror.** The gate compares sets of tokens, so an edit that changes only the wording can pass while the pair diverges.
- **`agents/README.txt` has no gate.** A new agent once went missing from it while its file existed.
- **The checks prove discovery, not behavior.** They confirm that every file resolves from this folder. They cannot show how a given Claude Code release uses them.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the full surface inventory, format contract and drift checks
- [`hooks/README.md`](./hooks/README.md): why `hooks/` is a discovery mirror
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`AGENTS.md`](../AGENTS.md): the shared instruction file
- [`README.md`](../README.md): the repository overview
