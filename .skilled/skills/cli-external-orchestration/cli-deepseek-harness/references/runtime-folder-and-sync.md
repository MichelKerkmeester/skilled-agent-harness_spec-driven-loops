---
title: "DeepSeek Harness - Runtime Folder and Sync"
description: "What the repository's .dsh/ folder holds, how dispatches use its patches and generated mirrors, and why DSH_HOME stays disposable and outside the checkout."
trigger_phrases:
  - "dsh runtime folder"
  - "dsh home isolation"
  - "dsh patches folder"
  - "dsh skills symlink farm"
  - "dsh sync manifest"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# DeepSeek Harness - Runtime Folder and Sync

Open this file to know where a dsh dispatch gets its patches, skills and prompts, and where its state must never land.

---

## 1. OVERVIEW

### Purpose

Separates the three places dsh state can live: the repository's `.dsh/` folder, the per-dispatch `$DSH_HOME` and the operator's own `~/.dsh`. Only the first is in the checkout, and only the second is touched by a dispatch.

### When to Use

- Deciding where `DSH_HOME` points for a dispatch or a probe.
- Finding which `.dsh/` file a dispatch must name.
- Checking a patch for drift after a dsh version change.

### Status

`.dsh/` ships with `SYNC.md`, `README.md`, both route patches, the lineage patch, the guards patch, the opt-in MCP patch, the repo-guards plugin and the three generated mirrors. Read `.dsh/SYNC.md` for the inventory and the drift checks.

---

## 2. THREE HOMES

| Place | Owns | Must never own |
|---|---|---|
| `.dsh/` in the checkout | Route and lineage patches, guard and MCP patches, generated skill links, prompt templates and persona patches, the repo-guards plugin, `SYNC.md` | Credentials, sessions, profiles, `node_modules` |
| `$DSH_HOME`, one per dispatch | Profile files, session logs, storages, the anonymous user id | Anything shared across dispatches, any key checked into git |
| `~/.dsh` | The operator's own interactive use | Anything a dispatch writes |

`.dsh/` is a repository convention passed explicitly. It is never used as `$DSH_HOME`, because a home holds profiles, sessions and package trees that are process state.

### How Home Resolves

Home resolves from explicit config, then `$DSH_HOME`, then `~/.dsh`, and a blank value counts as unset. A profile-scoped informational command initializes missing profile files at first boot, so even `dsh --profile headless --help` writes into whichever home it resolves. The research run left `~/.dsh/profiles/headless` behind this way. Every dispatch and every probe sets `DSH_HOME` to a fresh directory, under the `dsh-home-isolated` hard rule.

The offline contract pin ran all its probes under disposable homes, and a listing of `~/.dsh` taken before and after them was identical.

### Fresh Homes Carry Keys

Unlike Hermes, a fresh dsh home works for a dispatch, because headless reads keys from the launch environment. The env allowlist carries the route's key variable into a fresh home, and nothing else is needed.

---

## 3. `.dsh/` LAYOUT

```text
.dsh/
  SYNC.md                                 derivation inventory and drift checks
  README.md                               operator entry point
  patches/
    route-llmgateway-deepseek.patch.yml   llm-pi-ai provider row and agent-default-model row
    route-opencode-go-deepseek.patch.yml  same shape, second route
    lineage.patch.yml                     telemetry off, session log off, goal and plan off
    guards.patch.yml                      inserts the repo-guards plugin rows
    mcp-code-mode.patch.yml               optional, one MCP client row
  plugins/
    repo-guards/                          hand-authored Cordis plugin bundle
  skills/                                 generated, one symlink per skill directory
  prompts/                                generated, flattened command templates
  agents/                                 generated, one persona patch per agent
```

dsh reads none of this by itself except `.dsh/skills/`. Every patch reaches a run only as a `--patch` argument, so a file under `patches/` that no dispatch names has no effect.

### Skills

dsh discovers skills natively at `<projectRoot>/.dsh/skills/<name>/SKILL.md`, one level deep, following symlinks. It does not discover nested `**/SKILL.md`, so a single link to the whole skill tree would expose only the top-level hubs. The generated per-skill symlink farm has a `--check` mode and enumerates skills at generation time rather than from a fixed count. Repository frontmatter keys such as `trigger_phrases` and `allowed-tools` are ignored, and `allowed-tools` grants nothing. The current farm has 56 skill links. Whether all 56 load in one session remains UNKNOWN because the saved Gateway runs do not audit every linked skill.

Git cannot stage paths beneath a symlink, so the farm has its own ignore rule for local entries, `/.dsh/skills/local-*` in `.gitignore`.

### Commands and Agents

dsh has no slash-command file loader and no headless command adapter, so `.skilled/commands/` become generated prompt templates the dispatcher composes into the task. dsh has no agent-file loader either. A persona reaches a run through the `system-prompt` row's `personaPrefix`, which a generated persona patch per agent replaces. A hand-composed dispatch still inlines the persona block in the prompt (see [../assets/prompt-quality-card.md](../assets/prompt-quality-card.md)). The deep-loop fan-out builder passes a generated persona patch when `agentPersona` is set.

### Instruction Files

The harness reads `$DSH_HOME/AGENTS.md`, then `AGENTS.md`, `CLAUDE.md` and their `.local.md` overlays from the git root down to the cwd, inside a 65,536-byte budget per chain. The saved Gateway run used a cwd under a fresh system temp directory, outside the checkout. Whether that run reads the repository's `AGENTS.md` is UNKNOWN because the saved stream does not report which instruction files loaded. State the rules a child needs in the prompt rather than relying on that chain.

---

## 4. SYNC

`.dsh/SYNC.md` owns the drift checks. Two drift sources matter for this packet:

- **A renamed base row.** A new release that renames a row turns its patch into a no-op with only a loader warning. Re-run `--dump-config` for each route with the lineage patch after any version change and fail on any stderr line.
- **Roster drift.** The roster table in [providers-and-models.md](./providers-and-models.md), the `closed-roster` rule and the route patch files change together, never one at a time.

---

## 5. RELATED

- [cli-reference.md](./cli-reference.md) - the patch grammar and the dispatch shape.
- [guards-and-hooks.md](./guards-and-hooks.md) - how `guards.patch.yml` activates `plugins/repo-guards/` for every dispatch.
- [mcp.md](./mcp.md) - how the opt-in `mcp-code-mode.patch.yml` mounts the Code Mode server.
