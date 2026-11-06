---
title: "Cursor CLI Runtime Folder"
description: "What Cursor reads from .cursor/, which entries link to .skilled/ or .claude/ and which are authored here, how its hooks are registered and how to check the mirrors."
trigger_phrases:
  - "cursor runtime folder"
  - "cursor folder readme"
  - "cursor hooks and rules"
---

# Cursor CLI Runtime Folder

> The `.cursor/` folder is where the Cursor CLI finds this repository's agents, commands, hooks and routing rule, most of them as links into shared trees.

---

## 1. OVERVIEW

Skilled keeps its authored content in [`.skilled/`](../.skilled). Cursor discovers agents and commands by file convention, so this folder places a link at each path Cursor scans. Commands link to `.skilled/commands/`. Agents link to the Claude-dialect copies in [`.claude/agents/`](../.claude/agents), because Cursor parses the `tools:` frontmatter that dialect uses.

Two files here are authored for Cursor alone: the routing rule in `rules/` and the native `/goal-cursor` command. Devin reads the same routing rule, so a change to it reaches both runtimes.

---

## 2. WHAT IS HERE

| Entry | Kind | What it holds |
|---|---|---|
| `agents/*.md` | generated links | The 11 shared agents, each linking to `.claude/agents/<name>.md` |
| `commands/*.md` | generated links | One flattened link per command, so `.skilled/commands/deep/research.md` becomes `deep-research.md` |
| `commands/goal-cursor.md` | authored | The native goal command, with no canonical file to link to |
| `hooks.json` | generated | The hook registrations, rendered from the shared hook registry |
| `hooks/` | generated links | A discovery mirror of the scripts `hooks.json` runs |
| `rules/skill-routing.md` | authored, one generated block | Static routing guidance. Its Gate 1 pointer block is generated from the root `AGENTS.md` |
| `mcp.json` | link | `../.mcp.json`, which links on to `.claude/mcp.json` |
| `repo-rules` | link | `../.skilled/repo-rules`, the rule files `REPO RULES.md` routes |
| `manual-testing-playbook` | link | The `cli-cursor` playbook |
| `SYNC.md` | authored | The surface inventory and drift checks |

There is no skills folder here. Cursor manages its own skills under `~/.cursor/skills-cursor/`.

---

## 3. HOOKS

Cursor reads its hooks from `hooks.json`, which is generated: [`hook-registry.json`](../.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json) names each hook once, and `sync-hook-registrations.cjs` renders Cursor's camelCase, flat-list dialect from it. The registry binds 23 hooks to Cursor across `sessionStart`, `beforeSubmitPrompt`, `preToolUse`, `beforeMCPExecution`, `postToolUse`, `afterAgentResponse`, `preCompact` and `sessionEnd`.

`beforeSubmitPrompt` is registered but did not fire under the tested CLI build, so the per-prompt advisor brief cannot reach Cursor through it. Two things cover the gap: a `sessionStart` hook sets up the spec-folder gate state, and `rules/skill-routing.md` carries static routing guidance.

The hook cores that run here include the spec-folder gate, the CLI dispatch lint, the MCP route guard, the overlay guard, the sk-git message gate and preflight advisory and the goal injection. The coverage matrix in [`.skilled/hooks/README.md`](../.skilled/hooks/README.md) records what Cursor cannot run and why.

---

## 4. WHAT CURSOR LOADS

- **Rules.** Cursor reads `rules/skill-routing.md` on its own, so the rule carries a generated pointer to the Gate 1 lookup in the root `AGENTS.md`.
- **Agents.** Every entry in `agents/` must stay a link. A real file there is a silent fork, and the mirror checks reject it.
- **Commands.** Cursor reads `.cursor/commands/*.md` as a flat namespace, so each command keeps its family in its file name.
- **Skills.** Cursor has no skills mirror. A command or rule that names a skill points at its folder under `.skilled/skills/`.

---

## 5. KEEPING IT IN SYNC

```bash
# Re-render the hook registrations from the shared registry
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs

# Refresh the agent, command and hook link trees
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs

# Rewrite the Gate 1 pointer block in rules/skill-routing.md
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs
```

Each generator takes `--check` to report drift without writing.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs
```

Expected output: a `PASS` line from the first and `STATUS=OK` from the second, each with exit 0. `/doctor:runtime-mirrors` runs every runtime's checks at once and writes nothing.

---

## 6. DISPATCHING CURSOR

Another runtime hands work to the Cursor CLI through the [`cli-cursor`](../.skilled/skills/cli-external-orchestration/cli-cursor/SKILL.md) mode of the `cli-external-orchestration` hub. That mode owns the dispatch contract and the record of how Cursor loads custom agents.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the full surface inventory and known gaps
- [`hooks/README.md`](./hooks/README.md): why `hooks/` is a discovery mirror
- [`rules/skill-routing.md`](./rules/skill-routing.md): the routing rule Cursor and Devin share
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`README.md`](../README.md): the repository overview
