---
title: "Devin CLI in Skilled"
description: "How the Devin CLI uses this repository: linked agents and skills, generated hooks, the routing rule it inherits from Cursor and the checks that keep the links intact."
trigger_phrases:
  - "devin cli in skilled"
  - "devin folder readme"
  - "devin hooks registration"
---

# Devin CLI in Skilled

> Devin gets this repository's agents, skills and guards at the paths and in the nested shape it scans, and it reads this checkout's own instructions instead of a copy from elsewhere.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Working on this repository in Devin with the shared agents, skills and guards |
| **Start with** | Run `devin` in this checkout. Each skill appears as a slash command, such as `/sk-doc` or `/sk-git` |
| **Works on** | Devin sessions started from this checkout |
| **Checked by** | `/doctor:runtime-mirrors` and the commands in section 5 |

### What You Get

Devin reads the same files as its sibling runtimes, but at other paths. An agent must sit at `agents/<name>/AGENT.md`, one folder per agent, so every mirror here is a link. The agent links point at the Claude copies in `.claude/agents/`, whose `tools:` frontmatter Devin accepts as written.

Devin also has authored files of its own. `mcp_config.json` is Devin's MCP file, and `config.json` turns off Devin's Claude import. With the import off, a session loads this checkout's root `AGENTS.md` and not a copy reached through `~/.claude/`.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How Devin gets it |
|---|---|
| Instructions | The root [`AGENTS.md`](../AGENTS.md), plus the routing rule Devin inherits from Cursor |
| Rules | No rules folder here. Devin inherits [`.cursor/rules/skill-routing.md`](../.cursor/rules/skill-routing.md) |
| Skills | The `skills` link exposes `.skilled/skills` as slash commands |
| Agents | Each shared agent as `agents/<name>/AGENT.md`, a link to `.claude/agents/<name>.md` |
| Commands | No command folder. Devin carries no mirrored command surface |
| Hooks and guards | `hooks.v1.json`, rendered from the shared registry. The hooks cover the advisor, the spec-folder gate, the dispatch and MCP route guards, the post-edit checks, decision capture and goal injection |
| Advisor | The advisor runs on each prompt through the prompt hook |
| Goals | The goal injection hook adds the bound packet's goal to the session |
| MCP | `mcp_config.json`, Devin's own file |
| Dispatch | [`cli-devin`](../.skilled/skills/cli-external-orchestration/cli-devin/README.md) hands work to Devin from another runtime |

---

## 3. GETTING STARTED

1. Open this checkout in Devin. Devin loads the root `AGENTS.md` and the routing rule.
2. Type a skill's slash command to use it, such as `/sk-doc`.
3. If a skill is missing from `devin skills list`, check its frontmatter. Devin drops a whole file whose frontmatter fails a strict YAML parse, such as an unquoted `description:` that contains a colon.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `agents/<name>/AGENT.md` | Links | Each points at `.claude/agents/<name>.md`. A real file here would be a silent fork |
| `skills` | Link | `../.skilled/skills` |
| `hooks.v1.json` | Generated | Rendered from `hook-registry.json` with the event names at the top level |
| `hooks/` | Links | A discovery mirror of the hook scripts |
| `config.json` | Authored | Sets `read_config_from.claude` to `false` |
| `mcp_config.json` | Authored, Devin's own | The MCP servers |
| `config.local.json` | Per machine | Git ignores it |
| `repo-rules`, `manual-testing-playbook` | Links | The rule files and the `cli-devin` playbook |
| `README.md`, `SYNC.md` | Authored | The documentation |

**The one rule:** never edit a linked agent or skill here, because each link points at its source. Change `hook-registry.json` for hooks, then rerun `sync-hook-registrations.cjs`. A hand edit to `hooks.v1.json` does not last.

---

## 5. CHECKING IT IS HEALTHY

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs
```

The first two print a `PASS` line. The third ends with `STATUS=OK`. Each exits 0. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. LIMITS AND KNOWN GAPS

- **Devin reads each rule file up to 16,384 bytes.** Keep hard rules in the first 16 KB of a file.
- **Bypass mode skips the approval hook.** This repository dispatches Devin with `--permission-mode bypass`. `PermissionRequest` never fires under it, but `PreToolUse` still does, so the spec-folder gate and the dispatch guards stay active.
- **Strict YAML has no gate.** Nothing stops an unquoted colon in a `description:` line from being committed, and Devin then drops the command with no message.
- **`PostCompaction` has not been seen firing.** A dispatch is too short to trigger a compaction.
- **A hand edit to `hooks.v1.json` does not last.** The next sync overwrites it.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the surface inventory, format contract and drift checks
- [`hooks/README.md`](./hooks/README.md): why `hooks/` is a discovery mirror
- [`.cursor/README.md`](../.cursor/README.md): the Cursor runtime, which owns the routing rule
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`cli-devin`](../.skilled/skills/cli-external-orchestration/cli-devin/README.md): dispatching Devin from another runtime
