---
title: "Cross-CLI Runtime Map"
description: "How the seven CLI runtime directories derive from .skilled: which surfaces are symlinks that cannot drift, which are generator output that can, which files are authored in one runtime and exist nowhere else, and why each runtime needs a different shape."
trigger_phrases:
  - "cross cli runtime map"
  - "which runtime symlinks what"
  - "runtime directory differences"
  - "what is unique per cli runtime"
  - "agent dialect fork"
---

# Cross-CLI Runtime Map

---

## 1. OVERVIEW

`.skilled/` holds the authored tree. Seven runtime directories sit beside it, one per CLI, and each holds what that CLI reads, at the path it reads it, in the dialect it parses. Almost none of it is authored twice.

Three mechanisms do the work, and telling them apart is the whole point of this document:

| Mechanism | Can it drift? | How to change it |
|---|---|---|
| **Symlink** | No. A link has no content of its own. | Edit the file in `.skilled/`. |
| **Generated** | Yes. It is a real file a compiler wrote. | Edit the canonical source, re-run the generator. Never hand-edit. |
| **Authored** | Not applicable. It has no upstream. | Edit it here. It exists in one runtime only. |

A real file is therefore not automatically authored content — most of them are compiler output. The per-runtime sections below say which is which.

---

## 2. THE MAP

| Runtime | Reads from here | Symlinked | Generated | Authored only here |
|---|---|---|---|---|
| `.opencode/` | skills, commands, agents, plugins, bin | everything except the plugins | — | **`plugins/` (15)**, `package.json`, `README.md`, `SYNC.md` |
| `.claude/` | skills, commands, agents, hooks | `skills`, 33 commands, 21 hooks, playbook, `.utcp_config.json` | — | **`agents/` (12 forked)**, `agents/README.txt`, `mcp.json`, `settings.json`, `settings.local.json`, `statusline-command.sh` |
| `.codex/` | agents, prompts, hooks | 18 hooks, playbook | `agents/` (12 TOML), `prompts/` (33) | `AGENTS.md`, `config.toml`, `hooks.json` |
| `.cursor/` | agents, commands, rules, hooks | `agents/` (12), 33 commands, 18 hooks, 1 rule, playbook | — | `hooks.json`, `mcp.json`, `rules/skill-routing.md`, 2 commands |
| `.devin/` | agents, hooks | `agents/*/AGENT.md` (12), 21 hooks, playbook | — | `config.local.json`, `hooks.v1.json`, `mcp_config.json` |
| `.hermes/` | skills, plugins | `agents`, playbook | `skills/` (68 copies), `prompts/` (33) | `plugins/` (1) |
| `.pi/` | agents, prompts, skills, extensions | `skills`, 16 extensions, playbook | `agents/` (12), `prompts/` (35) | `models.json`, `settings.json`, `mcp.json`, `PLUGINS.md`, `custom-providers.md`, `statusline.sh`, `npm/`, `git/`, 2 authored extension directories (pi-cache-optimizer, pi-fast-mode-w-subagent-support) |

Every runtime also authors its own `SYNC.md`, and every `hooks/` directory authors its own `README.md`.

---

## 3. WHY EACH ONE DIFFERS

**`.opencode/` links almost everything** because its dialect *is* the authored dialect. Nothing needs translating, so nothing is copied. The exception is `plugins/`, which is authored here: every plugin imports the OpenCode plugin SDK, so no other runtime can load one, and keeping them here binds them to the SDK this directory installs rather than to the different version the source tree pins. The source tree links back to them, so the older path still resolves. It is a real directory of per-entry links rather than one link standing for the whole tree, because a git host stores a link as a file naming its target and will not resolve it — as one link, the directory could not be opened where people read the repository.

**`.claude/agents/` is the one deliberate content fork.** Claude's agent frontmatter uses `tools:` where the authored dialect uses `mode`, `temperature` and `permission:`. The bodies are otherwise the same document, so the pair is held in step by a blocking pre-commit gate rather than by a link. This is the only surface in the repository where the same prose is authored twice on purpose.

**`.cursor/` and `.devin/` link into `.claude/agents/`, not into `.skilled/agents/`,** because both parse the Claude dialect. That gives agent content **two upstreams, deliberately**: `.skilled/agents/` is canonical for the Claude fork, the Codex TOMLs and the Pi copies, while `.claude/agents/` is canonical for Cursor and Devin. Changing an agent means editing `.skilled/agents/`, letting the gate carry it into `.claude/agents/`, and the two downstream runtimes follow their links from there.

**`.devin/` needs the same files at a different shape.** Where the others read `agents/<name>.md`, Devin reads `agents/<name>/AGENT.md`. Each of those twelve directories is real and holds one symlink.

**`.codex/` and `.pi/` generate rather than link** because neither reads the authored dialect. Codex wants TOML personas and flat prompt stubs; Pi wants its own agent and prompt trees. Both are compiler output — editing them by hand is lost on the next generator run and caught by that generator's `--check`.

**`.hermes/` copies rather than links** because Hermes does not follow symlinks into a skill tree, so its 68 skills are real generated copies. Two more things are unusual here: Hermes reads only `skills/` (after a trust grant for the directory) and `plugins/` (behind an opt-in variable), and it has no agent flag at all — so each agent is additionally mirrored as a preloadable skill named `agent-<name>`, and a dispatch binds one by preloading that skill.

---

## 4. GENERATORS AND DRIFT

Each generator rebuilds its tree and takes `--check` to assert freshness without writing. The mirror and registration generators run as pre-commit gates; a commit that stages a source without its regenerated output is refused.

| Generator | Builds |
|---|---|
| `sync-runtime-mirrors.cjs` | the 168 per-file mirrors across all runtime trees |
| `sync-hook-registrations.cjs` | the 4 hook registration files from the 29-hook registry |
| `sync-gate1-pointers.cjs` | the root instruction files' lookup pointer |
| `sync-agents.cjs`, `sync-prompts.cjs` | `.codex/agents/`, `.codex/prompts/` |
| `sync-agents-pi.cjs`, `sync-prompts-pi.cjs` | `.pi/agents/`, `.pi/prompts/` |
| `sync-skills-hermes.cjs`, `sync-prompts-hermes.cjs` | `.hermes/skills/`, `.hermes/prompts/` |
| `generate-command-routers.cjs` | the command router tables |

They live under `.skilled/skills/system-spec-kit/runtime/cli/`, in `runtime-mirrors/`, `codex/`, `pi/` and `hermes/`.

```bash
# every generator, freshness only
for g in runtime-mirrors/sync-runtime-mirrors runtime-mirrors/sync-hook-registrations \
         runtime-mirrors/sync-gate1-pointers codex/sync-agents codex/sync-prompts \
         pi/sync-agents-pi pi/sync-prompts-pi hermes/sync-prompts-hermes hermes/sync-skills-hermes; do
  node ".skilled/skills/system-spec-kit/runtime/cli/$g.cjs" --check
done

# the forked agent pair, which no link protects
node .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs
```

---

## 5. CHANGING SOMETHING

- **A skill, command or hook body** — edit it in `.skilled/`. Runtimes that link it are already current; run the generators for the ones that copy.
- **An agent** — edit `.skilled/agents/<name>.md`, then carry the same change into `.claude/agents/<name>.md`. The pre-commit gate blocks the commit until the pair matches, and Cursor and Devin follow their links from the Claude copy.
- **A runtime's own configuration** — edit it in that runtime's directory. Nothing else reads it.
- **Anything a generator owns** — edit the canonical source and re-run the generator. A hand-edit there is discarded on the next run.

---

## 6. RELATED

- Each runtime's own contract: `.claude/SYNC.md`, `.codex/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md`, `.hermes/SYNC.md`, `.opencode/SYNC.md`, `.pi/SYNC.md`
- [`AGENTS.md`](../AGENTS.md) — the runtime instruction file
- [`README.md`](../README.md) — repository overview
