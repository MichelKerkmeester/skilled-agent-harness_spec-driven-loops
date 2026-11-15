---
title: "Mistral Vibe — Runtime Sync Manifest"
description: "How .vibe/ derives from .skilled: a hand-authored config under a trust gate, generated agent profiles, skill links and prompt stubs, the hand-authored guard bundle, and the three drift checks."
---

# Mistral Vibe Sync Manifest

> Vibe reads one project folder, `.vibe/`, from the working directory's root and nowhere deeper. A discovered `config.toml` applies only when that folder is trusted, so an untrusted run uses the home config alone and none of this folder's rows apply.

---

## 1. OVERVIEW

Vibe walks up from the working directory to find `.vibe/config.toml`, nearest first, and reads `config.toml`, `hooks.toml` and the `tools/`, `skills/`, `plugins/`, `agents/` and `prompts/` folders from that root only. The config applies only when its own folder, the checkout root, is trusted. `--trust` from a subdirectory trusts only that subdirectory and does not apply it, so a dispatch writes `trusted = ["<checkout root>"]` into its fresh `VIBE_HOME/trusted_folders.toml`.

`allowed_models` matches each `[[models]]` row's `name`, not its `alias`. An alias list closes nothing: it warns and leaves every configured model selectable, the built-in `mistral-medium-3.5` included. The list therefore names `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash`, and each row pins `thinking = "max"` because Vibe has no reasoning flag.

The folder follows the `.dsh/` split: hand-authored files, three generated trees, and a hand-authored guard bundle.

---

## 2. SURFACE INVENTORY

| Path | Kind | Source | Can it drift? |
|---|---|---|---|
| `config.toml` | hand-authored | none | No. No generator reads or writes it |
| `SYNC.md` | hand-authored | none | No |
| `agents/<name>.toml` | generated profile | `.skilled/agents/*.md` | Yes. `sync-agents-vibe.cjs --check` |
| `skills/<name>` | generated relative symlink | `.skilled/skills/**/SKILL.md` | Yes. `sync-skills-vibe.cjs --check` |
| `prompts/*.md` | generated pointer stub | `.skilled/commands/**/*.md` | Yes. `sync-prompts-vibe.cjs --check` |
| `hooks.toml` | hand-authored | none | No. No generator reads or writes it |
| `plugins/repo-guards/` | hand-authored | the shared guard cores under `.skilled/` | No. Each hook imports its core at run time, so a core change needs no copy |
| `plugins/README.md` | hand-authored | `hooks.toml` and `.opencode/plugins/` | Yes, by hand. It maps each OpenCode plugin to its hook entry, so a new plugin or entry needs a row. Vibe skips plain files in `plugins/`, so it is never loaded as a plugin |

### Agents

One `.toml` per `.skilled/agents/*.md`, `README.md` excepted, named by the source stem. The render keeps `description` from the frontmatter and `instructions` from the markdown body, and adds `agent_type = "subagent"` when the source declares `mode: subagent`, because Vibe refuses to spawn a profile without it. Every other frontmatter key is dropped, so the body is the only place a rule survives.

| Profile | `mode` (dropped) | Other dropped keys |
|---|---|---|
| `ai-council.toml` | subagent | `name`, `temperature`, `permission` |
| `code.toml` | subagent | `name`, `temperature`, `permission` |
| `context.toml` | subagent | `name`, `temperature`, `permission` |
| `debug.toml` | subagent | `name`, `temperature`, `permission` |
| `deep-research.toml` | subagent | `name`, `temperature`, `permission` |
| `deep-review.toml` | subagent | `name`, `temperature`, `permission` |
| `design.toml` | subagent | `name`, `temperature`, `permission` |
| `markdown.toml` | all | `name`, `temperature`, `permission` |
| `orchestrate.toml` | primary | `name`, `temperature`, `permission` |
| `prompt-improver.toml` | subagent | `name`, `temperature`, `permission` |
| `review.toml` | subagent | `name`, `temperature`, `permission` |

A generated profile therefore carries no tool restriction and no primary/subagent distinction: the OpenCode `permission` map and the `mode` value do not travel into Vibe. Vibe reserves the agent stem `main` for its built-in agent, so the generator refuses a source named `main.md`.

### Skills

`skills/<name>` is a relative symlink to the canonical skill directory, named by that skill's frontmatter `name`. The link points at the directory rather than the `SKILL.md`, so `references/`, `assets/` and `scripts/` travel with it.

A top-level `local-*` source entry is excluded as operator-private, as is a skill whose frontmatter name carries that prefix, and an existing `local-*` link in the output is preserved and never pruned. A duplicate frontmatter name fails the generator instead of generating a shadow, because Vibe loads only the first claimant. A source missing a name or description is skipped with a warning, and a description over 1024 characters warns because Vibe rejects it.

### Prompts

One stub per canonical command `.md`, with the source path flattened into the filename: `create/goal.md` becomes `create-goal.md`. Vibe has no command loader and no `$ARGUMENTS` substitution, so a dispatcher composes the stub into the task text and appends the user request below its last line. `README.md`, `*.contract.md` and the `assets/`, `scripts/` and `fixtures/` folders are skipped, and a flattened-name collision fails the generator. The generator also consults the shared command-scope lists, so a runtime-exclusive command is not mirrored and a runtime-native prompt is never pruned.

### Guards

`hooks.toml` and `plugins/repo-guards/` are hand-authored: no generator writes them. `hooks.toml` declares each guard as a `[[hooks]]` entry, and `plugins/repo-guards/` holds the hook scripts, their shared `lib/hook-io.mjs` and one fixture folder per guard. Each script imports its runtime-neutral core from `.skilled/`, so a rule changes in one place. The entries load only in a trusted checkout, like `config.toml`. A scratch-cwd dispatch or a fan-out lineage gets them through its disposable `VIBE_HOME`: `plugins/repo-guards/render-home-hooks.cjs` copies `hooks.toml` there with `$(git rev-parse --show-toplevel)` replaced by the resolved checkout root, at dispatch time, so no rendered copy is committed and none can drift. The wire format and the per-guard classification are in the cli-mistral-vibe `references/guards-and-hooks.md`.

One `session_start` entry points outside the bundle. `session-start` runs `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, which composes the bound packet's goal `chat_slice`, the session-prime context, the startup-guard warnings from `plugins/repo-guards/session-cleanup.mjs` and the `check-dist-staleness.sh --all` warning into one `additional_context` value. Each part is skipped when it is empty or fails, so the hook never blocks and always exits 0. The `session_end` entry `session-cleanup-end` still runs `session-cleanup.mjs`.

One `pre_agent` entry points outside the bundle too. `turn-start` runs `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` on the main session only, and composes the turn-start parts the same way. Its one part today is the skill advisor brief from `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`; later turn-start concerns join that part list instead of adding an entry. It stays separate from `spec-gate-classify`, so a composer failure cannot open the spec gate.

Two `post_tool` entries run `dist-freshness.mjs`: one over `write_file`/`edit`, one over `bash`/`process_start`. They append a `STALE DIST WARNING` to the tool result when an edit leaves a watched package's build behind its sources, or when a shell command is about to trust the local build. Both are non-strict, so a checker failure leaves the tool result intact.

---

## 3. WHAT THIS FOLDER NEVER HOLDS

| Kept out | Where it lives | Why |
|---|---|---|
| API keys and `.env` files | the launch environment or a disposable `$VIBE_HOME/.env` | A key in the repository leaks to every dispatch |
| `VIBE_HOME` contents: user config, logs, history, the trust store | a fresh temporary home outside the checkout | An unset `VIBE_HOME` writes `~/.vibe`, and a home inside the checkout can be staged by accident |
| `node_modules` | the installation that runs `vibe` | The CLI resolves its own dependencies |
| `.vibe/commands/` | nowhere | Vibe has no command loader; a prompt stub carries the pointer |
| `skill_paths` | unset in `config.toml` | `.vibe/skills/` is then the only project skill source, so the precedence question cannot arise |

---

## 4. WHEN TO SYNC

- A `.skilled/skills/**/SKILL.md` is added, renamed or deleted, or its frontmatter `name` changes → re-run `sync-skills-vibe.cjs`. A write run prunes stale links.
- A `.skilled/commands/**` file is added, renamed or deleted → re-run `sync-prompts-vibe.cjs`.
- A `.skilled/agents/*.md` file is added, renamed, deleted or edited → re-run `sync-agents-vibe.cjs`.
- A generated link is missing or points at a moved directory → re-run `sync-skills-vibe.cjs`.
- A roster row, provider field or `allowed_models` entry changes → edit `config.toml` by hand. No generator checks it, and only a trusted folder applies it.

---

## 5. SYNC WORKFLOW

```bash
# Regenerate the three generated trees; a write run also prunes stale output
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-prompts-vibe.cjs
```

```bash
# Check without writing: exit 0 in sync, 1 on drift
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-skills-vibe.cjs --check
node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-prompts-vibe.cjs --check
```

Nothing runs these checks automatically yet: no pre-commit hook and no CI job names a Vibe generator. Run them by hand after any source change in section 4, and treat a non-zero exit as a tree that no longer matches its source.
