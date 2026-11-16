---
title: "Cross-CLI Runtime Map"
description: "How the eight CLI runtime directories derive from .skilled: which surfaces are symlinks that cannot drift, which are generator output that can, which files are authored in one runtime and exist nowhere else, and why each runtime needs a different shape."
trigger_phrases:
  - "cross cli runtime map"
  - "which runtime symlinks what"
  - "runtime directory differences"
  - "what is unique per cli runtime"
  - "agent dialect fork"
---

# Cross-CLI Runtime Map

This map shows how the eight runtime folders derive from the shared `.skilled/` tree. Use it before you edit anything inside a runtime folder, to find out where the edit belongs.

&nbsp;

## 1. OVERVIEW

`.skilled/` holds the authored tree. Eight runtime folders sit beside it, one per CLI. Each holds what its CLI reads, at the path the CLI reads it, in the format the CLI parses. Almost nothing is written twice.

Three mechanisms fill the runtime folders, and telling them apart is the point of this document:

| Mechanism | Can it drift? | How to change it |
|---|---|---|
| **Link** | No. A link has no content of its own | Edit the file in `.skilled/` |
| **Generated** | Yes. A generator wrote a real file | Edit the source and run the generator again. Never edit the output by hand |
| **Authored** | No source to drift from | Edit it in place. It exists in this runtime only |

A real file in a runtime folder is not automatically authored. Many of them are generator output. The generators also write and check the link trees, so a real file where a link belongs is reported as drift.

&nbsp;

## 2. THE MAP

| Folder | Linked to `.skilled` | Generated | Authored only here |
|---|---|---|---|
| `.opencode/` | `skills`, `agents`, `hooks`, `bin`, `scripts`, `repo-rules` and the playbook as whole links. `commands/` is a real folder of links into the shared command tree | None | `plugins/`, `package.json`, the `goal-opencode` command |
| `.claude/` | `skills`, `repo-rules`, the playbook and `.utcp_config.json` as whole links. `commands/` and `hooks/` are real folders with one link per command and per hook script | The `hooks` key of `settings.json` | `agents/` (the forked agents plus `Explore.md`), the rest of `settings.json`, `mcp.json`, `statusline-command.sh` |
| `.codex/` | `hooks/` with one link per hook script, `repo-rules` and the playbook | `agents/` as TOML, `prompts/`, `hooks.json` | `config.toml` |
| `.cursor/` | `agents/` linked into `.claude/agents/`, `commands/` with one link per command, `hooks/`, `repo-rules` and the playbook | `hooks.json` and the pointer blocks inside `rules/skill-routing.md` | The rest of that rule, the `goal-cursor` command, `mcp.json`, `cli.json` |
| `.devin/` | `agents/<name>/AGENT.md` linked into `.claude/agents/`, `skills`, `hooks/`, `repo-rules` and the playbook | `hooks.v1.json` | `config.json`, `mcp_config.json` |
| `.pi/` | `skills`, `repo-rules`, the playbook and the shared adapter in `extensions/lib/` | `agents/`, `prompts/` | The one-line entry files in `extensions/`, the two extension packages, the `goal-pi` prompt, `settings.json`, `models.json`, `mcp.json`, `statusline.sh` and the Pi config, type and package folders |
| `.dsh/` | `skills/` with one link per skill and mode, the adapter links in the guard bundle and the playbook | `prompts/` as stubs, `agents/` as persona patches | `patches/`, the rest of `plugins/repo-guards/` |
| `.vibe/` | `skills/` with one link per skill and mode, and the playbook | `prompts/` as stubs, `agents/` as profiles | `config.toml`, `hooks.toml`, `plugins/repo-guards/` |

<!-- readme-check
allow-ref config.toml | a file inside the runtime folder named in the same table row
allow-ref rules/skill-routing.md | the Cursor rule, inside the runtime folder named in the same table row
allow-ref hooks.v1.json | a file inside the runtime folder named in the same table row
allow-ref config.json | a file inside the runtime folder named in the same table row
allow-ref mcp_config.json | a file inside the runtime folder named in the same table row
allow-ref prompts/ | a folder inside the runtime folder named in the same table row
allow-ref extensions/lib/ | a folder inside the runtime folder named in the same table row
allow-ref plugins/repo-guards/ | a folder inside the runtime folder named in the same table row
allow-ref hooks.toml | a file inside the runtime folder named in the same table row
-->

Every runtime folder authors its own sync notes, and every `hooks/` folder authors its own README. Files git ignores, such as `.claude/settings.local.json` and `.claude/scheduled_tasks.lock`, belong to one machine and are not part of the map.

The DeepSeek Harness and Mistral Vibe folders also serve runs dispatched from outside the checkout. Such a run starts from a scratch folder with a disposable home. A DeepSeek Harness run never starts from the repository root, because the root holds a `.env` that the CLI would read. Their sync notes hold the full dispatch rules.

&nbsp;

## 3. WHY EACH ONE DIFFERS

**OpenCode links almost everything,** because its format is the authored format. Nothing needs translating, so nothing is copied. The exception is `plugins/`. The plugins are OpenCode's own extension surface, so no other runtime loads them, and the folder's `package.json` supplies the plugin SDK they build against. `commands/` is a real folder of links, so OpenCode's own goal command can sit beside the shared ones.

**One set of plugin files serves OpenCode 2 and OpenCode 1.** Each plugin exports one `{ id, setup, server }` object. OpenCode 2 runs `setup`, which wraps the same `server` that OpenCode 1 runs. Both versions register every `*.md` file under a `commands/` folder as a command, at any depth, so Markdown in `.skilled/commands/` that is not a command is named `.markdown`. In CI, the OpenCode Dual-Version Battery loads the plugins on OpenCode 2.3.0 and 1.19.4, and OpenCode Plugin Tests runs their unit tests.

**`.claude/agents/` is the one deliberate content fork.** Claude's agent frontmatter uses `tools:`, where the authored format uses `mode`, `temperature` and `permission:`. The bodies are otherwise the same document, so a blocking pre-commit check holds the pair in step instead of a link. This is the only place where the same prose is authored twice on purpose. `Explore.md` is a Claude-only agent with no counterpart in `.skilled/agents/`.

**Cursor and Devin link into `.claude/agents/`,** because both parse the Claude format. Agent content therefore has two sources on purpose. `.skilled/agents/` feeds the Claude fork and the generated Codex, Pi, DeepSeek Harness and Mistral Vibe copies. `.claude/agents/` feeds Cursor and Devin through their links.

**Devin needs the same files in a different shape.** Where the others read `agents/<name>.md`, Devin reads `agents/<name>/AGENT.md`. Each of those folders is real and holds one link.

**Codex, Pi, DeepSeek Harness and Mistral Vibe generate,** because none of them reads the authored format. Codex wants TOML agents and flat prompt stubs. Pi wants its own agent and prompt trees. DeepSeek Harness takes each agent as a patch passed at launch. Mistral Vibe wants TOML profiles. DeepSeek Harness finds skills only one level deep, so its generator links every skill and every mode on its own. The Mistral Vibe generator links each skill the same way, under its own name.

**Four runtimes register hooks through a JSON file,** each with its own nesting and matcher rules. One hook registry renders all four files. Pi has no such file. It registers each hook through a one-line entry file that re-exports a shared bridge, and the same generator checks that every entry resolves.

&nbsp;

## 4. GENERATORS AND DRIFT

Each generator rewrites its output when run plain, and takes `--check` to report drift without writing. A blocking check refuses a commit that stages a source without its regenerated output.

| Generator | Builds | Checked by |
|---|---|---|
| `sync-runtime-mirrors.cjs` | Every link tree in the runtime folders, including the guard bundle's adapter links | pre-commit, CI |
| `sync-hook-registrations.cjs` | The four hook registration files, and a check of the Pi entry files | pre-commit, CI |
| `sync-gate1-pointers.cjs` | The lookup pointer blocks in the rule Cursor and Devin share | CI |
| `sync-agents.cjs`, `sync-prompts.cjs` | `.codex/agents/`, `.codex/prompts/` | pre-commit, CI |
| `sync-agents-pi.cjs`, `sync-prompts-pi.cjs` | `.pi/agents/`, `.pi/prompts/` | CI |
| `sync-skills-dsh.cjs`, `sync-prompts-dsh.cjs`, `sync-agents-dsh.cjs` | `.dsh/skills/`, `.dsh/prompts/`, `.dsh/agents/` | pre-commit, CI |
| `sync-skills-vibe.cjs`, `sync-prompts-vibe.cjs`, `sync-agents-vibe.cjs` | `.vibe/skills/`, `.vibe/prompts/`, `.vibe/agents/` | CI |

The generators live under `.skilled/skills/system-spec-kit/runtime/cli/`, in `runtime-mirrors/`, `codex/`, `pi/`, `dsh/` and `vibe/`. Each `--check` prints the live count of what it checked.

To check every generator and the agent fork at once, run from the repository root:

```bash
for g in runtime-mirrors/sync-runtime-mirrors runtime-mirrors/sync-hook-registrations \
         runtime-mirrors/sync-gate1-pointers codex/sync-agents codex/sync-prompts \
         pi/sync-agents-pi pi/sync-prompts-pi \
         dsh/sync-skills-dsh dsh/sync-prompts-dsh dsh/sync-agents-dsh \
         vibe/sync-skills-vibe vibe/sync-prompts-vibe vibe/sync-agents-vibe; do
  node ".skilled/skills/system-spec-kit/runtime/cli/$g.cjs" --check
done

node .skilled/bin/check-agent-mirror-sync.cjs
```

`/doctor:runtime-mirrors` runs the mirror checks from inside a session and names the repair for each one that drifts.

&nbsp;

## 5. CHANGING SOMETHING

**A skill, command or hook.** Edit it in `.skilled/`. Runtimes that link it are already current. Run the generators for the runtimes that copy it.

**An agent.** Edit `.skilled/agents/<name>.md`, then carry the same change into `.claude/agents/<name>.md`. The pre-commit check blocks the commit until the pair matches. Cursor and Devin follow their links from the Claude copy, and the generators carry the change to the other four.

**A hook's registration.** Edit the hook registry beside `sync-hook-registrations.cjs`, then run that generator. Never edit the four registration files by hand. Pi's entry files are not rendered, so add or change a Pi entry by hand, and the generator's check confirms it resolves.

**A runtime's own configuration.** Edit it in that runtime's folder. Nothing else reads it.

**Anything a generator owns.** Edit the source and run the generator again. A hand edit to generated output is lost on the next run.

&nbsp;

## 6. RELATED

Each runtime keeps its own sync notes: [Claude Code](../.claude/SYNC.md), [Codex](../.codex/SYNC.md), [Cursor](../.cursor/SYNC.md), [Devin](../.devin/SYNC.md), [OpenCode](../.opencode/SYNC.md), [Pi](../.pi/SYNC.md), [DeepSeek Harness](../.dsh/SYNC.md) and [Mistral Vibe](../.vibe/SYNC.md).

- [AGENTS.md](../AGENTS.md): the instructions every runtime reads.
- [Hooks README](hooks/README.md): every hook, the runtimes that run it and its off switch.
- [Root README](../README.md): what Skilled is and how the runtimes fit together.
