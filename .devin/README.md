---
title: "Devin CLI in Skilled"
description: "How the Devin CLI uses this repository: linked agents and skills, generated hooks, the routing rule it inherits from Cursor and the checks that keep the links intact."
trigger_phrases:
  - "devin cli in skilled"
  - "devin folder readme"
  - "devin hooks registration"
---

# Devin CLI in Skilled

> Devin reaches this repository's skills through links and runs the shared guards in place, so a fix in `.skilled/` needs no copy here.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What it gives you |
|---|---|
| **Use it for** | Working on this repository in Devin, with the shared skills and guards |
| **Start with** | Run `devin` in this checkout. Each skill appears as a slash command, such as `/sk-doc` |
| **Works on** | Devin sessions started from this checkout |
| **Checked by** | A `/doctor:runtime-mirrors` run and the commands in section 5 |

### What It Gives You

Devin reads the same shared files as its sibling runtimes, but at other paths. An agent must sit at `agents/<name>/AGENT.md`, one folder per agent, so every agent mirror here is a link. The links point at the Claude copies in `.claude/agents/`, whose `tools:` frontmatter Devin accepts as written.

Devin also carries config files of its own. `mcp_config.json` registers the Code Mode server, and `config.json` turns off Devin's Claude import. With the import off, a session loads this checkout's root `AGENTS.md` and not a copy reached through `~/.claude/`.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How Devin gets it |
|---|---|
| Instructions | The root [`AGENTS.md`](../AGENTS.md), loaded from this checkout |
| Rules | No rules folder here. Devin reads `.cursor/rules/*.md`, so the [routing rule](../.cursor/rules/skill-routing.md) applies |
| Skills | The `skills` link exposes `.skilled/skills`, and each skill appears as a slash command |
| Agents | `agents/<name>/AGENT.md`, a link to `.claude/agents/<name>.md` for each shared agent |
| Commands | No command folder. Devin carries no mirrored command surface |
| Hooks and guards | `hooks.v1.json`, rendered from the shared registry. It binds the spec gate, the dispatch guard, MCP routing and the env-secret guard, plus the advisor and goal injection |
| MCP | `mcp_config.json` registers the `code_mode` server, which launches `.skilled/bin/mcp-code-mode-launcher.cjs` |

---

## 3. GETTING STARTED

1. Run `devin` from the repository root. The REPL starts with this checkout's `AGENTS.md` and the Cursor rules.
2. Type a skill's slash command, such as `/sk-doc`, to use it.
3. If a skill is missing from `devin skills list`, check its frontmatter. Devin drops a whole file whose frontmatter fails a strict YAML parse, such as an unquoted `description:` that contains a colon.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `agents/<name>/AGENT.md` | Links | Each points at `.claude/agents/<name>.md`. A real file here would be a silent fork |
| `skills` | Link | `../.skilled/skills` |
| `hooks/` | Links and a README | A discovery mirror of the hook scripts. Its `README.md` is authored |
| `hooks.v1.json` | Generated | Rendered from `hook-registry.json`, with the event names at the top level |
| `config.json` | Authored | Turns off the Claude import and denies dotenv reads and writes |
| `config.local.json` | Authored | This machine's permission allow and deny lists |
| `mcp_config.json` | Authored | Devin's own MCP file |
| `repo-rules`, `manual-testing-playbook` | Links | The rule files and the `cli-devin` playbook |
| `README.md`, `SYNC.md` | Authored | The documentation |

**The one rule:** never edit a link here, because each one points at its source. Change `hook-registry.json` for hooks, rerun `sync-hook-registrations.cjs`, then rerun `sync-runtime-mirrors.cjs` to rebuild the `hooks/` mirror from `hooks.v1.json`. A hand edit to `hooks.v1.json` does not last. The [sync manifest](./SYNC.md) lists every surface with its source.

---

## 5. CHECKING IT IS HEALTHY

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
```

Expected: a `[runtime-mirror-sync] PASS` line and exit 0. A non-zero exit means drift or a check that could not run.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
```

Expected: a `[hook-registration-sync] PASS` line and exit 0. A non-zero exit means drift or a check that could not run.

```bash
node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs
```

Expected: an `OK` line for each runtime and `STATUS=OK`, then exit 0.

A `/doctor:runtime-mirrors` run covers every runtime's checks at once and writes nothing.

---

## 6. LIMITS AND KNOWN GAPS

- **Devin cuts each rule file at 16,384 bytes.** Keep hard rules in the first 16 KB of a file.
- **Bypass mode skips the approval hook.** This repository dispatches Devin with `--permission-mode bypass`. `PermissionRequest` never fires under it, while `PreToolUse` still does, so the spec gate and the dispatch guard stay active.
- **Strict YAML has no gate.** Nothing blocks an unquoted colon in a `description:` line at commit time, and Devin then drops the whole file with no message.
- **`PostCompaction` has not been seen firing.** A dispatch is too short to trigger a compaction.
- **A hand edit to `hooks.v1.json` does not last.** The next sync overwrites it.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the surface inventory, format contract and drift checks
- [`hooks/README.md`](./hooks/README.md): why `hooks/` is a discovery mirror
- [`.cursor/README.md`](../.cursor/README.md): the Cursor runtime, which owns the routing rule
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [the cli-devin skill](../.skilled/skills/cli-external-orchestration/cli-devin/README.md): dispatching Devin from another runtime
- [`README.md`](../README.md): the repository overview
