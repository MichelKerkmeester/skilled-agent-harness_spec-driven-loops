---
title: "Claude Code in Skilled"
description: "How Claude Code uses this repository: the skills, agents, commands and hooks it reads, which files are linked, copied or generated from .skilled/ and how to check that they are in sync."
trigger_phrases:
  - "claude code in skilled"
  - "claude folder readme"
  - "claude code hooks"
---

# Claude Code in Skilled

> Skills, rules and the testing playbook arrive as links into `.skilled/`, and every hook runs a script from that tree, so a shared edit reaches Claude Code without a copy.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What it gives you |
|---|---|
| **Use it for** | Working on this repository in Claude Code with the shared skills, agents and guards |
| **Start with** | Open the repository root in Claude Code, then type `/` to list the commands |
| **Works on** | Claude Code sessions started from this checkout |
| **Checked by** | `/doctor:runtime-mirrors` and the commands in section 5 |

### What You Get

Skilled authors its skills, rules and testing playbooks once in [`.skilled/`](../.skilled). Claude Code reads `.claude/`, so that folder carries the same files at the paths a session scans. The trees are whole links, each command file is one link, and every hook link sits beside a script that runs from `.skilled/`.

The agents are the exception. Claude declares tools in a `tools:` list, so each agent is a real file in that dialect, held to its `.skilled/agents/` twin by a pre-commit check. Cursor and Devin read the same dialect and link into `agents/`, so those copies serve both runtimes as well.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How Claude Code gets it |
|---|---|
| Instructions | The root [`AGENTS.md`](../AGENTS.md). No `CLAUDE.md` sits in this folder or at the root |
| Rules | The `repo-rules` link exposes `.skilled/repo-rules`, so each rule file loads from its source |
| Skills | The `skills` link exposes `.skilled/skills`, so a `SKILL.md` and its `ROUTER.md` load from the source folder |
| Agents | A real file for each shared agent in `agents/`, plus `Explore.md`, which has no twin in another runtime |
| Commands | One link per shared command file in `commands/`, such as `/speckit:plan` and `/doctor:runtime-mirrors` |
| Hooks and guards | The `hooks` key of `settings.json`, rendered from the shared registry. Each entry runs a script under `.skilled/` |
| Skill advisor | The prompt hook runs the advisor build, which names the skill to load for the submitted prompt |
| MCP | `mcp.json`, which starts the Code Mode server through `.skilled/bin/mcp-code-mode-launcher.cjs`. The root `.mcp.json` links to it |

---

## 3. GETTING STARTED

1. Start Claude Code from the repository root. It reads `.claude/settings.json` for its hooks, permissions and environment.
2. Point the session at the shared rules. Claude Code reads a file named `CLAUDE.md`, and this repository ships none, so add `@AGENTS.md` to your user `CLAUDE.md` or symlink `~/.claude/CLAUDE.md` to this checkout's `AGENTS.md`.
3. Type `/` to list the commands. They group under a family prefix, such as `/speckit`, `/doctor`, `/create`, `/deep` and `/design`.
4. Run the checks in section 5 after you change a file in `.skilled/`.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `skills`, `repo-rules`, `manual-testing-playbook`, `.utcp_config.json` | Links | Point into `.skilled/` and the repository root, so they cannot drift |
| `commands/` | Generated links | One link per shared command file. A file named `skill.md` would hide its folder's siblings, and the check reports one as drift |
| `hooks/` | Generated links | One link per script in the `hooks` key of `settings.json` |
| `agents/` | Copied by hand | Claude's frontmatter dialect, carried across from `.skilled/agents/` |
| `settings.json` | Authored, except the `hooks` key | The key is rendered from the shared hook registry. Every other key is set here |
| `mcp.json` | Authored and canonical | The root `.mcp.json` links to it |
| `statusline-command.sh`, `README.md`, `SYNC.md` | Authored | A status line script and the two documents |
| `settings.local.json` | Per machine | Git ignores it |

**The one rule:** change the source in `.skilled/`, then rerun the generator that owns the output. For a hook, edit the shared hook registry and run `sync-hook-registrations.cjs`. For an agent, edit `.skilled/agents/<name>.md` and carry the same change into `agents/<name>.md`, because the pre-commit gate blocks a commit whose pair has drifted. The [sync manifest](./SYNC.md) lists every surface with its source.

---

## 5. CHECKING IT IS HEALTHY

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
node .skilled/bin/check-agent-mirror-sync.cjs --all
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
```

The first prints `[runtime-mirror-sync] PASS: 260 mirrors across 10 trees are in sync.` and exits 0. The second prints one line per compared mirror, two per agent here, and ends with `OK`, then exits 0. The third prints `[hook-registration-sync] PASS: 4 registration files match the 36-hook registry; 22 Pi extensions resolve.` and exits 0. The counts follow the tree each run read, so treat them as the current figure. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. LIMITS AND KNOWN GAPS

- **The agent fork is compared as token sets.** A reworded sentence that reuses the same words passes, so the pair can differ in wording while the check stays green.
- **`agents/README.txt` has no check.** A new agent file can sit in `agents/` and never appear in the roster beside it.
- **The instructions depend on a file outside this repository.** Claude Code reads `CLAUDE.md`, and this checkout has none, so a machine without the `@AGENTS.md` pointer starts with no shared rules. `/doctor:agents-md` reports the missing pointer.
- **The checks prove discovery, not behavior.** They show that each path resolves from this folder. They cannot show how a given Claude Code release uses it.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): every surface with its source and the drift check that covers it
- [`hooks/README.md`](./hooks/README.md): one row per hook link, with the real path `settings.json` runs
- [`agents/README.txt`](./agents/README.txt): the agent roster and the dialect contract
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores, their switches and the coverage matrix
- [`.skilled/CROSS-CLI.md`](../.skilled/CROSS-CLI.md): how all eight runtime folders derive from `.skilled/`
- [`README.md`](../README.md): the repository overview

<!-- readme-check
allow-ref CLAUDE.md | the instruction file Claude Code reads, which this repository deliberately does not ship
allow-ref skill.md | a file name the mirror check rejects, named here as what must not exist
-->
