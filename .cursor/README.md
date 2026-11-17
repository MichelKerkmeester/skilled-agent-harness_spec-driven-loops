---
title: "Cursor CLI in Skilled"
description: "How the Cursor CLI uses this repository: linked agents and commands, the shared routing rule, generated hooks and the checks that keep the links and the rule in step."
trigger_phrases:
  - "cursor cli in skilled"
  - "cursor folder readme"
  - "cursor hooks and rules"
---

# Cursor CLI in Skilled

> Cursor reaches this repository's agents and guards through links into the shared trees, so a guard fix needs no copy step.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What it gives you |
|---|---|
| **Use it for** | Working on this repository in the Cursor CLI, with the shared agents and the guards that back them |
| **Start with** | Run `cursor-agent` in this checkout, then type `/` to list the commands |
| **Works on** | Cursor CLI sessions started from this checkout |
| **Checked by** | `/doctor-runtime-mirrors` and the commands in section 5 |

### What It Gives You

Cursor finds agents and commands by file convention. This folder places a link at each path Cursor scans, so the agent and command content stays in `.skilled/` and `.claude/` and neither is a second copy.

The hooks work the same way. `hooks.json` names real adapters under `.skilled/`, and most entries carry a fallback message for an adapter that is missing. A rule change in a shared guard therefore reaches a Cursor session at once. The routing rule and the `/goal-cursor` command are authored here rather than linked, and Devin reads the same rule.

---

## 2. HOW IT CONNECTS TO SKILLED

| Piece | How Cursor gets it |
|---|---|
| Instructions | [`rules/skill-routing.md`](./rules/skill-routing.md), marked `alwaysApply: true`. Two pointer blocks in it come from the root `AGENTS.md` |
| Skills | No skills folder here. The rule points at the routing packets under `.skilled/skills/` for code, design, docs and specs, git, prompts, deep loops and Cursor dispatch |
| Agents | One link per shared agent, each to `.claude/agents/<name>.md`, whose `tools:` list Cursor accepts |
| Commands | One link per shared command into `.skilled/commands/`, flattened so `.skilled/commands/deep/research.md` becomes `deep-research.md`. [`goal-cursor.md`](./commands/goal-cursor.md) is written here |
| Hooks and guards | [`hooks.json`](./hooks.json), rendered from the shared hook registry. The entries cover the spec-folder gate, the dispatch guard, the git message gate and preflight advisory, the MCP route guard, the env-secret guard and goal injection |
| MCP | [`mcp.json`](./mcp.json), which registers the `code_mode` server through `.skilled/bin/mcp-code-mode-launcher.cjs` |

---

## 3. GETTING STARTED

1. Open this checkout in the Cursor CLI. The rule file is marked `alwaysApply: true`, so it applies from the first prompt.
2. Type `/` to list the commands. Each one keeps its family in the flat file name, so `deep-research.md` is the `research` command from the `deep` family.
3. Run the checks in section 5 after you change a shared file.

---

## 4. WHAT IS GENERATED AND WHAT IS AUTHORED

| Path | Kind | Notes |
|---|---|---|
| `agents/*.md` | Links | Each points at `.claude/agents/<name>.md`. A real file here would be a silent fork |
| `commands/*.md` | Links, plus one authored file | Flattened links into `.skilled/commands/`. `goal-cursor.md` is written here |
| `hooks/` | Links | A discovery mirror. `hooks.json` names the real adapter under `.skilled/` |
| `hooks.json` | Generated | Rendered from `hook-registry.json` by `sync-hook-registrations.cjs`. Both sit in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/` |
| `rules/skill-routing.md` | Authored, with generated blocks | The Gate 1 and Gate 2 pointer blocks come from the root `AGENTS.md` |
| `mcp.json` | Authored | Registers the `code_mode` server. It is not a link |
| `cli.json` | Authored | A permissions deny list for dotenv reads and writes |
| `repo-rules`, `manual-testing-playbook` | Links | The rule files and the `cli-cursor` playbook |
| `README.md`, `SYNC.md` | Authored | The documentation |

**The one rule:** never edit a link here, because each one points at its source. Change the hook registry and rerun `sync-hook-registrations.cjs` for `hooks.json`. Change the Gate 1 line in the root `AGENTS.md` and rerun `sync-gate1-pointers.cjs` for the pointer blocks. The [sync manifest](./SYNC.md) lists every surface with its source.

---

## 5. CHECKING IT IS HEALTHY

```bash
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check
node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs
```

- The mirror check ends with `[runtime-mirror-sync] PASS: 260 mirrors across 10 trees are in sync.`
- The hook check prints `[hook-registration-sync] PASS: 4 registration files match the 36-hook registry; 22 Pi extensions resolve.`
- The pointer check prints `[gate1-pointer-sync] PASS: 1 instruction files carry the root Gate 1 and Gate 2 pointers.`
- The roster check ends with `STATUS=OK agent-roster-mirror: every runtime covers the canonical roster`

Each command exits 0 and writes nothing. `/doctor-runtime-mirrors` runs the mirror and roster checks from a session. The hook-registration and pointer checks run from the shell.

---

## 6. LIMITS AND KNOWN GAPS

- **`mcp.json` is a copy, not a link.** It matches `.claude/mcp.json` today, and the mirror check does not compare the two, so an edit to one file leaves the other stale.
- **`beforeSubmitPrompt` does not fire.** The routing rule says the adapter is registered but dormant under the tested CLI build, so the per-prompt advisor brief never arrives. The static rule carries routing guidance in its place.
- **A hand edit to `hooks.json` does not last.** The next `sync-hook-registrations.cjs` run rewrites it from the registry.
- **The packet list in the routing rule has no generator.** `sync-gate1-pointers.cjs --check` covers the two pointer blocks only, so a new skill packet does not appear in the list on its own.
- **`/goal-cursor` reads a goal and cannot set one.** Cursor's command surface carries no session identity, so every action except `packet` and `packet-log` fails with `code=UNSUPPORTED_SESSION_BINDING`.

---

## 7. RELATED

- [`SYNC.md`](./SYNC.md): the surface inventory, format contract and drift checks
- [`rules/skill-routing.md`](./rules/skill-routing.md): the routing rule Cursor and Devin share
- [`hooks/README.md`](./hooks/README.md): the link index and what each entry runs
- [`.skilled/hooks/README.md`](../.skilled/hooks/README.md): the hook cores and the coverage matrix
- [`.devin/README.md`](../.devin/README.md): the Devin runtime, which inherits the routing rule
- [the cli-cursor skill](../.skilled/skills/cli-external-orchestration/cli-cursor/README.md): dispatching Cursor from another runtime
- [`README.md`](../README.md): the repository overview
