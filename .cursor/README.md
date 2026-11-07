---
title: "Cursor CLI in Skilled"
description: "How the Cursor CLI uses this repository: linked agents and commands, the shared routing rule, generated hooks and the checks that keep the links and the rule in step."
trigger_phrases:
  - "cursor cli in skilled"
  - "cursor folder readme"
  - "cursor hooks and rules"
---

# Cursor CLI in Skilled

> Cursor finds this repository's agents and commands as links into the shared trees, and it reads one routing rule that explains how Skilled expects work to flow.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Working on this repository in the Cursor CLI with the shared agents, commands and routing guidance |
| **Start with** | Run `cursor-agent` in this checkout, then type `/` to see the commands |
| **Works on** | Cursor CLI sessions started from this checkout |
| **Checked by** | `/doctor-runtime-mirrors` and the commands in section 5 |

### What You Get

Cursor finds agents and commands by file convention, so this folder places a link at each path Cursor scans. Commands link into `.skilled/commands/`. Agents link to the Claude copies in `.claude/agents/`, because Cursor reads the `tools:` list that dialect uses.

The routing rule and the native `/goal-cursor` command are authored for Cursor alone. Devin reads the same routing rule, so one edit reaches both runtimes.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How Cursor gets it |
|---|---|
| Instructions | The routing rule, [`rules/skill-routing.md`](./rules/skill-routing.md). Its Gate 1 block is a pointer generated from the root `AGENTS.md` |
| Skills | No skills folder here. Cursor has its own skill system under `~/.cursor/skills-cursor/`. A command or rule that names a Skilled skill points at its folder in `.skilled/skills/` |
| Agents | Each shared agent in `agents/` is a link to `.claude/agents/<name>.md` |
| Commands | Links into `.skilled/commands/`, flattened into one folder, so the `research` command in the `deep` family becomes `deep-research.md`. The native `goal-cursor.md` sits beside them |
| Hooks and guards | `hooks.json`, rendered from the shared registry. The hooks cover the spec-folder gate, the dispatch lint, the MCP route guard, the overlay guard, the sk-git message gate and preflight advisory, and goal injection |
| Advisor | The per-prompt advisor brief would arrive through `beforeSubmitPrompt`, but that hook does not fire under the tested CLI build. The routing rule carries static guidance in its place |
| Goals | `goal-cursor.md`, the native goal command, and the goal injection hook |
| MCP | `mcp.json`, which holds its own copy of the Code Mode setup. See section 6 |
| Dispatch | [`cli-cursor`](../.skilled/skills/cli-external-orchestration/cli-cursor/README.md) hands work to Cursor from another runtime |

---

## 3. GETTING STARTED

1. Open this checkout in the Cursor CLI. Cursor reads `rules/skill-routing.md` and the linked agents and commands from this folder.
2. Type `/` to list the commands. Each keeps its family in its file name, so `deep-research.md` belongs to the `deep` family.
3. Run `/doctor-runtime-mirrors` when you want to know whether the links and the hook file still match `.skilled/`. It reports and writes nothing.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `agents/*.md` | Links | Each points at `.claude/agents/<name>.md`. A real file here would be a silent fork, and the mirror checks reject it |
| `commands/*.md` | Links, plus one authored file | Flattened links into `.skilled/commands/`. `goal-cursor.md` is authored here |
| `hooks.json` | Generated | Rendered from `hook-registry.json` in Cursor's camelCase dialect |
| `hooks/` | Links | A discovery mirror of the hook scripts |
| `rules/skill-routing.md` | Authored, with one generated block | The Gate 1 pointer block is generated from the root `AGENTS.md` |
| `mcp.json` | Authored file, not a link | Holds the same Code Mode setup as `.claude/mcp.json`. `/doctor:mcp` checks that each file registers Code Mode, but nothing compares the two |
| `repo-rules`, `manual-testing-playbook` | Links | The rule files and the `cli-cursor` playbook |
| `README.md`, `SYNC.md` | Authored | The documentation |

**The one rule:** never edit a linked agent or command here, because each link points at its source. Change `hook-registry.json` for hooks, then rerun `sync-hook-registrations.cjs`. For the rule's pointer block, change the Gate 1 line in `AGENTS.md`, then rerun `sync-gate1-pointers.cjs`.

---

## 5. CHECKING IT IS HEALTHY

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check
node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs
```

The first three print a `PASS` line. The roster check ends with `STATUS=OK`. Each exits 0. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. LIMITS AND KNOWN GAPS

- **`mcp.json` is a copy, not a link.** It matches `.claude/mcp.json` today. `/doctor:mcp` confirms that each file registers Code Mode, but nothing compares the two, so edit both until it becomes a link again. The `SYNC.md` manifest still lists it as a symlink, which the repository no longer matches.
- **`beforeSubmitPrompt` does not fire.** The routing rule covers part of the gap, not the per-prompt brief.
- **A hand edit to `hooks.json` does not last.** The next sync overwrites it.
- **The packet list in the routing rule has no generator.** A new skill packet does not appear there on its own. Only the Gate 1 block is generated.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the surface inventory and drift checks
- [`rules/skill-routing.md`](./rules/skill-routing.md): the routing rule Cursor and Devin share
- [`hooks/README.md`](./hooks/README.md): why `hooks/` is a discovery mirror
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`.devin/README.md`](../.devin/README.md): the Devin runtime, which inherits the routing rule
- [`README.md`](../README.md): the repository overview
