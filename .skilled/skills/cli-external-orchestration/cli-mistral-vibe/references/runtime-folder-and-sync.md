---
title: "Mistral Vibe - Runtime Folder and Sync"
description: "What the repository's .vibe/ folder holds, how Vibe finds it under a trust gate, which parts are hand-authored or generated, and why VIBE_HOME stays outside the checkout."
trigger_phrases:
  - "vibe runtime folder"
  - "vibe config discovery"
  - "vibe trust gate"
  - "vibe skill mirror"
  - "vibe sync generators"
  - "vibe home isolation"
importance_tier: normal
contextType: implementation
version: 1.0.1.0
---

# Mistral Vibe - Runtime Folder and Sync

Open this file before adding a file to `.vibe/`, before trusting a project config, or when a dispatch seems to ignore the repository's config and skills.

---

## 1. OVERVIEW

### Purpose

Records the one project folder Vibe reads, the trust gate that decides whether it applies, the hand-authored and generated split inside it, and the home directory a dispatch must keep outside the checkout.

### When to Use

- Deciding whether a new file belongs in `.vibe/` and which process writes it.
- Checking why a run ignored `.vibe/config.toml`.
- Regenerating or drift-checking the agent, skill and prompt mirrors.
- Setting `VIBE_HOME` for a dispatch or a probe.

### Status

The folder ships: `.vibe/config.toml`, `.vibe/hooks.toml`, `.vibe/SYNC.md`, the generated agent, skill and prompt mirrors, and the `plugins/repo-guards/` bundle. The three generators under `.skilled/skills/system-spec-kit/runtime/cli/vibe/` own the mirrors. The discovery and home behavior below are read from the installed package and observed during research.

### Evidence Base

| What it pins | Path |
|---|---|
| Config discovery, the trust gate, the root-only list, the `AGENTS.md` chain, the `~/.vibe` writes | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/research.md` section 5 |
| The `skill_paths` and `allowed_models` semantics | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/evidence/vibe-config-schema.json` |
| The `--trust` flag | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt` |
| The layout and generator contract this folder must satisfy | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/006-vibe-runtime-folder-and-mirrors/spec.md` |

---

## 2. DISCOVERY

Vibe reads project configuration from `.vibe/config.toml` and finds it by walking up from the working directory, nearest first. A discovered file applies only when its own directory is trusted, and trust is checked upward from that directory. An untrusted project config is ignored, and the run uses the home config alone.

### Trust Gate

Trust is a per-dispatch gate, not an install setting. Two things grant it:

- `--trust` on the command line, which trusts the working directory for that invocation only.
- An entry in the home's `trusted_folders.toml`.

`--trust` from a subdirectory does not apply the root `.vibe/config.toml`: it trusts the subdirectory, which never covers its parent, and the run records `allowed_models` as `[]`. A dispatch that must apply the repository config writes `trusted = ["<checkout root>"]` into its fresh home's `trusted_folders.toml` before the run. With that file the config loads under `VIBE_STRICT_CONFIG=1` and `--model mistral-medium-3.5` exits 1 with `usage_error` (`specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/006-vibe-runtime-folder-and-mirrors/scratch/trust-probe.md`).

### Root-Only Discovery

Project discovery is root-only and non-recursive. Vibe reads these names in the project root and nothing deeper:

| Name | What it is |
|---|---|
| `.vibe/config.toml` | Project config |
| `.vibe/hooks.toml` | Project hook declarations |
| `.vibe/tools/`, `.vibe/skills/`, `.vibe/plugins/`, `.vibe/agents/`, `.vibe/prompts/` | Project tool, skill, plugin, agent and prompt folders |
| `.agents/skills/` | A second project skill folder outside `.vibe/` |

There is no `.vibe/commands/`. Vibe has no command-file loader and no `$ARGUMENTS` substitution, so a repository command reaches a run as a prompt stub the dispatcher composes into the task text (section 3). This repository has no `.agents/skills/` folder, so the generated `.vibe/skills/` farm is the only project skill source.

### Instruction Files

`AGENTS.md` loads from `$VIBE_HOME` and from the project tree, outermost first. This repository's root `AGENTS.md` therefore loads with no wiring. A dispatch that runs from a temp directory outside the checkout loads neither: the walk-up never reaches the repository root, and a fresh home holds no copy.

---

## 3. LAYOUT

The folder mirrors the `.dsh/` split: a hand-authored config and sync manifest, generated mirrors of the agent, skill and prompt sources, and hand-authored guard files that another phase owns.

| Path | Kind | Source | Holds |
|---|---|---|---|
| `config.toml` | hand-authored | none | The `mistral` provider, the two model rows with `thinking = "max"`, `allowed_models` closed to the two model names, `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash` (an alias list closes nothing), `skill_paths` unset |
| `agents/<name>.toml` | generated | `.skilled/agents/*.md` | One profile per agent, the agent body as `instructions`, and `agent_type = "subagent"` for a `mode: subagent` source |
| `skills/<name>` | generated | `.skilled/skills/**/SKILL.md` | One relative symlink per canonical skill, named by frontmatter `name` |
| `prompts/*.md` | generated | `.skilled/commands/**/*.md` | Pointer stubs the dispatcher composes into the task |
| `hooks.toml` | hand-authored | none | Hook declarations; the guard phase owns it |
| `plugins/repo-guards/` | hand-authored | none | The guard bundle; the guard phase owns it |
| `SYNC.md` | hand-authored | none | The inventory and the drift commands |

The runtime-folder phase hand-authors two files here, `config.toml` and `SYNC.md`, and generates the rest. `config.toml` carries the `mistral` provider, the two model rows with `thinking = "max"`, and `allowed_models` closed to the two model names, `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash`. The provider fields, the row values and the probe that shows an alias list closes nothing are in [providers-and-models.md](./providers-and-models.md).

### Skills

`skills/<name>` is a relative symlink to a canonical skill directory, named by that skill's frontmatter `name`. A linked skill keeps its `references/`, `assets/` and `scripts/`, because the link points at the directory rather than at the `SKILL.md` file. A duplicate frontmatter `name` fails the generator: Vibe shadows a same-name skill by its first claimant and never merges the two.

### Commands and Prompts

`prompts/*.md` are pointer stubs, one per `.skilled/commands/**/*.md` source, and a dispatcher composes a stub into the task text. Vibe has no command file, so there is no `.vibe/commands/` mirror to keep in sync.

### Hooks and Plugins

`hooks.toml` and `plugins/repo-guards/` are hand-authored and belong to the guard phase, which settles the hook wire format. The runtime-folder phase leaves both out, and the folder accepts them later without a generator change.

---

## 4. GENERATORS

Three Node scripts under `.skilled/skills/system-spec-kit/runtime/cli/vibe/` own the generated trees.

| Generator | Writes | Source |
|---|---|---|
| `sync-agents-vibe.cjs` | `.vibe/agents/<name>.toml` | `.skilled/agents/*.md` |
| `sync-skills-vibe.cjs` | `.vibe/skills/<name>` symlinks | `.skilled/skills/**/SKILL.md` |
| `sync-prompts-vibe.cjs` | `.vibe/prompts/*.md` | `.skilled/commands/**/*.md` |

Each script takes `--check`, which writes nothing and exits 1 on drift, 0 when the tree matches its source. A write run regenerates the tree. The phase's acceptance check removes one generated skill link, requires `sync-skills-vibe.cjs --check` to exit 1, and requires a write run to restore the link.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-prompts-vibe.cjs --check
```

Drop `--check` to regenerate a tree instead of checking it.

The agent generator renders the agent body into `instructions`. A frontmatter key Vibe does not model may be dropped by that render, and `.vibe/SYNC.md` is where the dropped fields are listed per agent.

Run the checks after a skill, agent or command source is added, renamed or deleted, after a skill's frontmatter `name` changes, or when a generated link is missing. Whether the three checks join the pre-commit mirror gate and CI is UNKNOWN; the phase plan names no owner.

---

## 5. VIBE_HOME ISOLATION

`VIBE_HOME` is read from the environment and holds the whole user-level tree: `config.toml`, `AGENTS.md`, the global `.env`, `logs/`, `worktrees/`, `trusted_folders.toml`, the cache and project files, and the history file. A dispatch points it at a fresh temporary directory, outside the checkout, and discards the directory with the run.

### An Unset Home Writes the Operator's

An unset `VIBE_HOME` falls back to `~/.vibe`. During research, Vibe commands created `~/.vibe/logs/`, `~/.vibe/vibehistory` and `~/.vibe/trusted_folders.toml` in the operator's home. A home inside the checkout is no better: the same logs, history and trust store land in the repository and can be staged by accident. The `isolated-vibe-home` rule in [../hard-rules.json](../hard-rules.json) refuses both shapes.

### What the Isolation Costs

A fresh home has no trusted folder, so a dispatch that needs the repository config seeds its `trusted_folders.toml` with the checkout root (section 2). It also has no `AGENTS.md`, so a run from outside the checkout loads no instruction file unless the caller writes one into the home. An executor that filters the child environment must allow the `VIBE_` prefix, or `VIBE_HOME` never reaches the child and the run writes `~/.vibe` instead.

---

## 6. SKILL PRECEDENCE

Vibe shadows a same-name skill by its first claimant and records the later one as shadowed rather than merging the two. Which claimant comes first between `skill_paths` and `.vibe/skills` is UNKNOWN: the two research lineages disagreed, and no collision fixture has run.

The schema describes `skill_paths` as additional directories to search, absolute or relative to the working directory. This repository leaves it unset. `.vibe/skills/` is then the only project skill source, so the question cannot arise on a dispatch, and the generator's duplicate-name failure keeps a collision from being generated in the first place.

---

## 7. RELATED

- [providers-and-models.md](./providers-and-models.md) - the `mistral` provider row, the two model rows and the `allowed_models` close this config carries.
- [cli-reference.md](./cli-reference.md) - the flag set, including `--trust`, and the dispatch shape.
- [../../cli-deepseek-harness/references/runtime-folder-and-sync.md](../../cli-deepseek-harness/references/runtime-folder-and-sync.md) - the same three-way split for `.dsh/`, which this folder mirrors.
- [../hard-rules.json](../hard-rules.json) - the `isolated-vibe-home` rule.
- `.vibe/SYNC.md` - the inventory and drift commands the runtime-folder phase writes.
