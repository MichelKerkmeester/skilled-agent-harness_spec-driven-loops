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
| Claudian settings | `<vault>/.claude/claudian-settings.json` (observed) — Claudian's own per-vault settings alongside the Claude Code config | Yes — read, back up, merge; **VERIFY** exact keys |
| Slash commands | `<scope>/commands/` — one command definition per file (Claude Code scope: `.claude/commands/`) | Yes — author, read, validate |
| Reusable skills | `<scope>/skills/<name>/SKILL.md` — one folder per skill with a `SKILL.md` (Claude Code scope: `.claude/skills/`) | Yes — author, read, validate |
| Subagents | `<scope>/agents/` (Claude Code `.claude/agents/`, Codex `.codex/agents/`, OpenCode `.opencode/agent/`) — reachable via `@` | Yes — author, read, validate |
| MCP servers | The provider's native MCP config (Claude Code: `.claude/mcp.json`, observed) | Yes — author, read, validate; **VERIFY** exact shape |
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

The command file is the provider CLI's native format — for Claude Code, a markdown file whose body is the prompt, optionally with frontmatter (an argument hint, allowed tools). **VERIFY** the exact filename-to-command mapping and the frontmatter keys against a live install before authoring a production command; do not assume the byte-level schema from this document.

```markdown
<!-- <vault>/.claude/commands/summarize.md  (shape VERIFY) -->
---
argument-hint: "[note path]"
---
Summarize the note at $ARGUMENTS in five bullet points, then list open questions.
```

The command name is derived from the filename (`summarize.md` → `/summarize`). A vault-level command and a user-level command with the same name is a collision to resolve, not a merge — see `troubleshooting.md` §3.

---

## 3. REUSABLE SKILLS / PROMPT TEMPLATES

A skill is a larger reusable capability, also invoked with `/` or `$`. For the Claude Code provider each skill is a **folder with a `SKILL.md`** under a `skills/` directory in either scope — vault-level `<vault>/.claude/skills/<name>/SKILL.md` or user-level `~/.claude/skills/<name>/SKILL.md` (both observed, `SKILL.md` confirmed as a literal in the compiled plugin).

`SKILL.md` carries the skill's instructions and, per the provider CLI's convention, frontmatter naming and describing the skill. Bundled reference files or scripts sit beside it in the same folder. **VERIFY** the exact frontmatter keys and the folder contract against a live install — author the skill to the provider CLI's real schema, not a shape guessed here.

```markdown
<!-- <vault>/.claude/skills/vault-triage/SKILL.md  (shape VERIFY) -->
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

1. **Claudian's settings tab** — the plugin's own UI for selecting a provider and pointing at its executable. The README documents an auto-detect-first flow: leave the CLI path empty so Claudian can auto-detect; if that fails, set it under **Settings → Advanced → (provider) CLI path**, and custom environment variables under **Settings → Environment**. Claudian persists these in `<vault>/.claude/claudian-settings.json` (observed; **VERIFY** the exact keys).
2. **The provider CLI's own native config** — where the agent's real behavior (permissions, model, MCP, subagents) is defined, in that CLI's layout:

| Provider | Native config (observed / native layout) | Notes |
| --- | --- | --- |
| Claude Code | `.claude/settings.json`, `.claude/settings.local.json`, `.claude/` tree | `.claude/*` strings observed in the compiled plugin |
| Codex | `.codex/` with `config.toml`; `.codex/agents/`; `AGENTS.md` | `.codex/agents` and `AGENTS.md` observed; `config.toml` is Codex's native config, **VERIFY** path |
| OpenCode | `.opencode/agent/`, `.opencode/agents/` | Observed; other OpenCode config is native, **VERIFY** |
| Grok | Provider-native config | Not observed on disk here — **VERIFY** against the provider CLI's docs |
| Pi | Provider-native config | Not observed on disk here — **VERIFY** against the provider CLI's docs |

Do not edit a provider's native config assuming Claude Code's `.claude/` shape applies to it — each CLI owns its own format.

---

## 5. MCP SERVER CONFIGURATION

Claudian connects external tools **through each coding agent's native, CLI-managed MCP configuration** — there is no Claudian-specific MCP registry. For the Claude Code provider the declaration lives in `.claude/mcp.json` (observed) at either scope; other providers declare MCP servers in their own native config.

An MCP server is added by writing its entry into that provider-native MCP config, then restarting the agent so the CLI picks it up. The JSON/TOML shape is the provider CLI's own — **VERIFY** it against the CLI's documentation before authoring:

```json
// <vault>/.claude/mcp.json  (shape VERIFY — provider-native)
{
  "mcpServers": {
    "example": { "command": "node", "args": ["./server.js"] }
  }
}
```

Because the config is provider-native, the same MCP server the operator already uses in the CLI's terminal session works in Claudian without re-declaration when the scope is shared. Prefer editing the provider's existing MCP config over inventing a parallel one.

---

## 6. THE OTHER `.claude/` ARTIFACTS

For the Claude Code provider, the compiled plugin also references these paths. They are agent-owned or advanced config — read them, back them up, but do not fabricate their schema:

| Path (observed) | What it holds |
| --- | --- |
| `.claude/agents/` | Subagent definitions, reachable via `@` mention |
| `.claude/plans/` | Plans the agent writes in plan mode |
| `.claude/rules/` | Standing instruction/rule files the CLI applies |
| `.claude/projects/`, `.claude/sessions` | Per-project / session state the CLI manages |

These are the Claude Code CLI's own directories, surfaced because the vault is the working directory. Treat their contents as the agent's, not artifacts to invent.

---

## 7. WHAT THE AI MUST NOT DO

- Never present a provider config path, filename or key as byte-verified when it is `VERIFY`. The `.claude/`, `.codex/`, `.opencode/` paths were observed in the compiled plugin, but the exact schema inside each file must be checked against a live install before authoring a production artifact.
- Never assume one provider's config layout applies to another. Each CLI owns its own format.
- Never claim a command, skill or MCP declaration took effect in the running agent. A file write proves the config; the agent picking it up needs a restart in-app, which is the operator's step.
- Never invent an MCP registry for Claudian. MCP is configured in the provider CLI's native MCP config.
- Never document a mobile path or a workflow for a provider whose CLI is not installed — desktop-only, CLI-prerequisite.
