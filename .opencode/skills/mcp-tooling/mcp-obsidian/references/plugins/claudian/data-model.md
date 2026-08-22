---
title: "Claudian Plugin In-Vault Data Model"
description: "Where each Claudian artifact lives on disk and its shape: slash commands, reusable skills / prompt templates, provider CLI config, and MCP server declarations, across user-level and vault-level scopes and each provider's native config layout."
trigger_phrases:
  - "claudian data model"
  - "claudian slash command"
  - "claudian skill file"
  - "claudian prompt template"
  - "claudian provider config"
  - "claudian mcp.json"
  - "claude commands directory"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Claudian Plugin In-Vault Data Model

Claudian does not persist a database. Everything it reads is ordinary config the underlying provider CLI already understands, in that CLI's **native layout**, under two scopes: **user-level** (a home directory such as `~/.claude/`, shared across every vault) and **vault-level** (a `.claude/` folder at the vault root, because the vault is the agent's working directory). The `mcp-obsidian` mode authors and validates these files; the agent that consumes them runs in-app.

The paths in this document were **observed as literal strings in the compiled plugin** (`main.js`) and match each provider CLI's documented config layout. Treat the paths as real, but the **exact file schema — frontmatter keys, JSON shape, TOML tables — as `VERIFY`** against a live install before writing a production artifact (see §7).

---

## 1. OVERVIEW

### Storage model

| Layer | Artifact | AI-operable |
| --- | --- | --- |
| Provider CLI config | The provider's own config (Claude Code: `.claude/settings.json`, `.claude/settings.local.json`; Codex: `.codex/` + `config.toml`; OpenCode: `.opencode/`). Vault-level and user-level | Yes — read, back up, merge |
| Claudian settings | `<vault>/.claudian/claudian-settings.json` (current) — Claudian's own per-vault settings. `<vault>/.claude/claudian-settings.json` is the **legacy** path Claudian migrates from | Yes — read, back up, merge |
| Slash commands | `<scope>/commands/` — one command definition per file (Claude Code scope: `.claude/commands/`) | Yes — author, read, validate |
| Reusable skills | `<scope>/skills/<name>/SKILL.md` — one folder per skill with a `SKILL.md` (Claude Code scope: `.claude/skills/`) | Yes — author, read, validate |
| Subagents | `<scope>/agents/` (Claude Code `.claude/agents/`, Codex `.codex/agents/`, OpenCode `.opencode/agent/`) — reachable via `@` | Yes — author, read, validate |
| MCP servers | The provider CLI's own native MCP config. **Not** a Claudian-authored file — Claudian does not write `.claude/mcp.json` (it removes that legacy file at init) | Read the provider CLI's own MCP config; **VERIFY** the exact path/shape against the CLI's docs (§5) |
| Plan-mode output | `<vault>/.claude/plans/` (observed) — plans the agent writes in plan mode | Read — the agent authors these |
| Rendering + agent loop | The open Obsidian window and the launched CLI | No — file writes prove the config, not the run |

### Scope model

- **User-level** (`~/.claude/`, `~/.codex/`, …): applies to every vault and to the CLI in a terminal. Edit it to change a provider globally.
- **Vault-level** (`<vault>/.claude/`, `<vault>/.codex/`, …): applies only inside this vault, which is the agent's working directory. Vault-level typically overrides or extends user-level for that vault. Prefer vault-level for vault-specific commands, skills and MCP servers so they travel with the vault.

### Core contract

- Claudian owns no proprietary storage. Uninstalling it leaves every command, skill and config file intact — they belong to the provider CLI.
- `/` and `$` both invoke reusable prompt templates or skills, drawn from **both** user-level and vault-level scopes.
- Each provider uses **its own** native config. `.claude/*` is the Claude Code layout Claudian uses because the vault is the working directory; Codex, OpenCode, Grok and Pi each read their own files. Do not assume one provider's paths for another.

---

## 2. SLASH COMMANDS

A slash command is a saved, reusable prompt the operator triggers with `/` (or `$`) in the chat pane. For the Claude Code provider they live one-per-file under a `commands/` directory in either scope — vault-level `<vault>/.claude/commands/` or user-level `~/.claude/commands/` (both observed).

The command file is the provider CLI's native format: a markdown file whose body is the prompt, with optional YAML frontmatter. The filename-to-command mapping and the frontmatter keys are confirmed against the installed plugin:

- **Filename.** The file is `<scope>/commands/<safeName>.md`. `safeName` is the command name with every character outside `[a-zA-Z0-9_/-]` replaced by `-` (the exact `[a-zA-Z0-9_/-]/g` sanitizer is present in the compiled plugin). A nested command path uses `/` inside the name.
- **Command ID.** The plugin also derives a reversible internal ID with a `cmd-` prefix, encoding dashes as `-_` and slashes as `--` so the original name can be recovered. Authors do not write this ID; it is the plugin's own handle.
- **Frontmatter keys.** `name`, `description`, `argument-hint`, `allowed-tools`, `model`, `disable-model-invocation`, `user-invocable`, `context` (e.g. `fork`), `agent`, and `hooks`. Kebab-case keys are canonical; camelCase equivalents are accepted for back-compat.

```markdown
<!-- vault-level command file: <scope>/commands/summarize.md -->
---
argument-hint: "[note path]"
allowed-tools: "Read"
---
Summarize the note at $ARGUMENTS in five bullet points, then list open questions.
```

The command name is derived from the filename (`summarize.md` → `/summarize`). A vault-level command and a user-level command with the same name is a collision to resolve, not a merge — see `troubleshooting.md` §3.

---

## 3. REUSABLE SKILLS / PROMPT TEMPLATES

A skill is a larger reusable capability, also invoked with `/` or `$`. For the Claude Code provider each skill is a **folder with a `SKILL.md`** under a `skills/` directory in either scope — vault-level `<vault>/.claude/skills/<name>/SKILL.md` or user-level `~/.claude/skills/<name>/SKILL.md` (both observed, `SKILL.md` confirmed as a literal in the compiled plugin).

`SKILL.md` carries the skill's instructions plus frontmatter naming and describing the skill. Bundled reference files or scripts sit beside it in the same folder. The frontmatter and folder contract are confirmed against the installed plugin's validation logic:

- **`name` (required).** Must equal the containing folder name. Lowercase letters and digits with single hyphens only, at most **64 characters** (the plugin rejects a longer name with "Skill name must be 64 characters"), and not a YAML-reserved word.
- **`description` (required).** Non-empty, at most **1024 characters** (a longer value is rejected with "description is required" / length errors in the compiled plugin).
- **Body.** Non-empty — the instructions the skill runs.

```markdown
<!-- vault-level skill file: <scope>/skills/vault-triage/SKILL.md -->
---
name: vault-triage
description: Triage inbox notes into projects and areas.
---
# Vault triage
Read every note in Inbox/, propose a destination folder for each, and wait for approval before moving anything.
```

The `$` trigger and the `/` trigger both resolve against user-level and vault-level scopes, so a skill authored at vault level is available in that vault, and one at user level is available everywhere. A skill and a command with the same name across scopes is a collision — flag it.

---

## 4. PROVIDER (CLI) CONFIGURATION

Each provider is configured two ways, and both matter:

1. **Claudian's settings tab** — the plugin's own UI for selecting a provider and pointing at its executable. The README documents an auto-detect-first flow: leave the CLI path empty so Claudian can auto-detect; if that fails, set it under **Settings → Advanced → (provider) CLI path**, and custom environment variables under **Settings → Environment**. Claudian persists these in `<vault>/.claudian/claudian-settings.json` (current path; `<vault>/.claude/claudian-settings.json` is the legacy location it migrates from). The full `ClaudianSettings` shape and its defaults are documented in §4a below.
2. **The provider CLI's own native config** — where the agent's real behavior (permissions, model, MCP, subagents) is defined, in that CLI's layout:

| Provider | Native config (observed / native layout) | Notes |
| --- | --- | --- |
| Claude Code | `.claude/settings.json`, `.claude/settings.local.json`, `.claude/` tree | `.claude/*` strings observed in the compiled plugin |
| Codex | `.codex/` with `config.toml`; `.codex/agents/`; `AGENTS.md` | `.codex/agents` and `AGENTS.md` observed; `config.toml` is Codex's native config, **VERIFY** path |
| OpenCode | `.opencode/agent/`, `.opencode/agents/` | Observed; other OpenCode config is native, **VERIFY** |
| Grok | Provider-native config | Not observed on disk here — **VERIFY** against the provider CLI's docs |
| Pi | Provider-native config | Not observed on disk here — **VERIFY** against the provider CLI's docs |

Do not edit a provider's native config assuming Claude Code's `.claude/` shape applies to it — each CLI owns its own format.

### 4a. `ClaudianSettings` schema and defaults

`<vault>/.claudian/claudian-settings.json` holds Claudian's own per-vault settings (`ClaudianSettings`). The keys and defaults below are confirmed against the installed plugin:

| Key | Default | Purpose |
| --- | --- | --- |
| `userName` | — | Display name used in the chat UI |
| `permissionMode` | `'yolo'` | How agent actions are gated before they run |
| `model` | `'haiku'` | Default model label shown in the composer |
| `settingsProvider` | `'claude'` | Which provider's settings tab is active |
| `providerConfigs` | per-provider bags | One config object per provider (see §4b) |
| `chatViewPlacement` | — | Where the chat view docks in the workspace |
| keyboard-navigation bindings | `{ w, s, i }` | Default up / down / insert key bindings |
| collaboration keys | — | Session / collaboration fields |

Merge into this file key by key after a backup — never replace it wholesale. Preserve any key not listed here; the plugin owns fields this reference does not enumerate.

### 4b. Claudian-side per-provider defaults

Each entry in `providerConfigs` is a Claudian-side settings bag (the plugin's own defaults for that provider), **not** the provider CLI's own on-disk config. These are the confirmed default bags:

| Provider | Default bag |
| --- | --- |
| claude | `enabled: true`, `defaultModel: 'opus'`, `safeMode: 'acceptEdits'` |
| codex | `enabled: false`, `safeMode: 'workspace-write'` |
| grok | `enabled: false` |
| opencode | `enabled: false`, env `OPENCODE_ENABLE_EXA=1` |
| pi | `enabled: false`, `toolMode: 'all'` |

These select and gate a provider inside Claudian. The provider CLI's real behavior still lives in that CLI's own native config (§4 table above), which Claudian does not overwrite.

### 4c. `.claude/settings.json` narrow write scope

When Claudian touches the Claude Code provider's own `.claude/settings.json`, it merges **only** three keys — `$schema`, `permissions`, and `enabledPlugins` — and preserves every other Claude Code field untouched. Plugin enablement is dual-written to `enabledPlugins` and the in-app plugin manager. Do not assume editing this file through Claudian rewrites the whole settings document; a manual edit outside those three keys survives, and a manual edit inside them can be overwritten on the next Claudian write.

---

## 5. MCP SERVER CONFIGURATION

Claudian connects external tools **through each coding agent's own native, CLI-managed MCP configuration** — there is no Claudian-specific MCP registry, and Claudian does **not** author an MCP file of its own. In particular, `<vault>/.claude/mcp.json` is a **legacy** path that Claudian removes at storage init: do not write it, and do not tell an operator to merge a server into it (Claudian will delete it).

MCP for a given provider is declared in **that provider CLI's own** MCP config, in the CLI's native shape, and the CLI picks it up on restart. The exact on-disk path and shape for each provider is the CLI's own — **VERIFY** it against that CLI's documentation before authoring. This reference deliberately does not pin a positive Claude-provider MCP path, because the removed `.claude/mcp.json` was never the right one and the correct positive mechanism is not established here.

Prefer editing the provider CLI's existing MCP configuration (the same one the operator already uses in a terminal session) over inventing a parallel file.

---

## 6. THE OTHER `.claude/` ARTIFACTS

For the Claude Code provider, the compiled plugin also references these paths. They are agent-owned or advanced config — read them, back them up, but do not fabricate their schema:

| Path (observed) | What it holds |
| --- | --- |
| `.claude/agents/` | Subagent definitions, reachable via `@` mention |
| `.claude/plans/` | Plans the agent writes in plan mode |
| `.claude/rules/` | Standing instruction/rule files the CLI applies |
| `.claude/projects/` | Per-project state the Claude Code CLI manages |
| `.claudian/sessions` (current; `.claude/sessions` legacy) | Claudian's session state, with `.inputs.json` / `.deleted.json` ledger suffixes |

These are the Claude Code CLI's own directories, surfaced because the vault is the working directory. Treat their contents as the agent's, not artifacts to invent.

---

## 7. WHAT THE AI MUST NOT DO

- Never present a provider config path, filename or key as byte-verified when it is `VERIFY`. The `.claude/`, `.codex/`, `.opencode/` paths were observed in the compiled plugin, but the exact schema inside each file must be checked against a live install before authoring a production artifact.
- Never assume one provider's config layout applies to another. Each CLI owns its own format.
- Never claim a command, skill or MCP declaration took effect in the running agent. A file write proves the config; the agent picking it up needs a restart in-app, which is the operator's step.
- Never author `.claude/mcp.json` for Claudian, and never invent a Claudian MCP registry. Claudian removes `.claude/mcp.json` at init; MCP is configured in the provider CLI's own native MCP config (§5).
- Never document a mobile path or a workflow for a provider whose CLI is not installed — desktop-only, CLI-prerequisite.
