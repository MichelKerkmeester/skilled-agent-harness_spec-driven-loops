---
title: "Claudian Plugin In-Vault Workflows"
description: "Safe file-layer recipes for the Claudian community plugin: register a provider CLI, author a reusable skill or prompt template, add a slash command, connect an MCP server, and use plan mode and @-mentions."
trigger_phrases:
  - "register claudian provider"
  - "author claudian skill"
  - "claudian mcp server setup"
  - "claudian plan mode"
  - "claudian at mention"
  - "add claudian slash command"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Claudian Plugin In-Vault Workflows

These recipes **configure Claudian and author the files it reads** — provider config, slash commands, reusable skills, MCP declarations. Authoring the file is the operation the `mcp-obsidian` mode owns; launching the provider and running the agent is the operator's in-app step. The paths below were observed in the compiled plugin and follow each provider CLI's native layout; the exact file schema is `VERIFY` against a live install (see `data-model.md` §1/§7).

---

## 1. OVERVIEW

### Operating sequence

1. Confirm which provider is active and that its CLI is installed and on `PATH` (a provider with no CLI cannot run — `troubleshooting.md` §3).
2. Choose the scope: user-level (`~/.claude/`, global) or vault-level (`<vault>/.claude/`, this vault only). Prefer vault-level for vault-specific artifacts.
3. Read the target config or artifact file (or confirm it is absent) before changing anything.
4. Author or merge the change key by key — never replace a provider config file wholesale.
5. Verify at the file layer: re-read the file and confirm it parses and references only things that exist.
6. Tell the operator the in-app step that applies the change (restart the agent / reopen the pane), and that this reference set does not run it.

### Backup discipline

- Take a `.bak` copy of any provider config (`settings.json`, `mcp.json`, `config.toml`, `claudian-settings.json`) before an in-place edit.
- For a new command or skill, author a new file — do not overwrite an existing one to add a second.
- Keep the original content in the working transcript for any file you merge into.

---

## 2. REGISTER A PROVIDER CLI

Goal: make a provider usable in Claudian by confirming its CLI and, if auto-detect fails, setting the path.

### Steps

1. Confirm the CLI is installed: `which claude` (macOS/Linux) or `where.exe claude` on Windows — substitute the provider's binary (`codex`, `opencode`, …). On Windows, avoid `.cmd`/`.ps1` wrappers; use the real executable.
2. In Claudian, leave the CLI path empty first so it can auto-detect.
3. If auto-detection fails, set the absolute path under **Settings → Advanced → (provider) CLI path**, and any needed variables under **Settings → Environment**.
4. Claudian persists the choice in `<vault>/.claudian/claudian-settings.json` (current; `<vault>/.claude/claudian-settings.json` is the legacy path it migrates from). Back it up before editing it by hand.

### Checkpoint

`provider_cli_reachable`: the provider's binary resolves on `PATH` (or the absolute path set in settings exists), and the vault's `claudian-settings.json` (if hand-edited) parses.

---

## 3. AUTHOR A REUSABLE SKILL / PROMPT TEMPLATE

Goal: add a `/`- or `$`-invokable skill available in this vault (vault-level) or everywhere (user-level).

### Steps

1. Pick the scope and the provider's `skills/` directory: vault-level `<vault>/.claude/skills/` or user-level `~/.claude/skills/` for the Claude Code provider.
2. Create a folder `skills/<name>/` and author `SKILL.md` inside it, following the provider CLI's real skill schema — **VERIFY** the frontmatter keys against a live install first (`data-model.md` §3).
3. Re-read the file and confirm the frontmatter parses and the `<name>` does not collide with an existing command or skill in either scope.

### Before

```text
<vault>/.claude/skills/    (no vault-triage folder yet)
```

### After

```markdown
<!-- <vault>/.claude/skills/vault-triage/SKILL.md  (shape VERIFY) -->
---
name: vault-triage
description: Triage inbox notes into projects and areas.
---
# Vault triage
Read every note in Inbox/, propose a destination folder for each, and wait for approval before moving anything.
```

### Checkpoint

`skill_authored_no_collision`: `skills/<name>/SKILL.md` exists and parses, its frontmatter matches the provider's verified schema, and `<name>` is unique across both scopes.

---

## 4. ADD A SLASH COMMAND

Goal: save a reusable prompt the operator triggers with `/name`.

### Steps

1. Pick the scope's `commands/` directory: vault-level `<vault>/.claude/commands/` or user-level `~/.claude/commands/` for the Claude Code provider.
2. Author `<name>.md` — the body is the prompt, with optional frontmatter (argument hint, allowed tools) per the provider CLI's real command schema (**VERIFY**).
3. Re-read the file; confirm the filename maps to the intended `/name` and does not collide across scopes.

### After

```markdown
<!-- <vault>/.claude/commands/summarize.md  (shape VERIFY) -->
---
argument-hint: "[note path]"
---
Summarize the note at $ARGUMENTS in five bullet points, then list open questions.
```

### Checkpoint

`command_authored_no_collision`: `<name>.md` exists and parses, and no same-named command or skill exists in the other scope unresolved.

---

## 5. CONNECT AN MCP SERVER

Goal: expose an external MCP tool to the agent through the provider CLI's **own** native MCP config — not through a Claudian-authored file.

### Steps

1. Identify the active provider CLI's **own** MCP config mechanism (Claude Code, Codex, OpenCode, … each have their own). Do **not** author `<vault>/.claude/mcp.json` — Claudian removes that legacy file at init, so a server declared there never loads (`data-model.md` §5).
2. For a non-Claude provider, **VERIFY** the CLI's actual MCP config path and shape against that CLI's own documentation before editing. For **Claude Code**, Claudian authors no on-disk MCP file — it passes an in-memory `mcpServers` array to the runtime (empty by default), and the positive surface for adding a server is **UNKNOWN** from the installed build (`data-model.md` §5); do not invent `.claude/mcp.json` or any other path for it.
3. Back up the CLI's real MCP config (`.bak`), then merge the server entry key by key into its existing server map — do not overwrite other servers.
4. Re-read the file, confirm it is valid JSON/TOML and the command it names exists, and tell the operator to restart the agent so the CLI reloads its MCP config.

### Checkpoint

`mcp_declared_provider_native`: the entry was merged into the **provider CLI's own** MCP config (never a Claudian-authored `.claude/mcp.json`), the file parses, and the operator has been told a restart is required for it to load.

---

## 6. USE PLAN MODE AND @-MENTIONS

Goal: help the operator drive a safe, reviewable agent turn — no file authoring by the mode here, just correct guidance.

### Steps

1. **Plan mode:** tell the operator to toggle it with `Shift+Tab` before a change-heavy request. The agent explores and returns a plan for approval before writing; plans are saved under `.claude/plans/` (observed).
2. **@-mentions:** `@` brings a specific vault file, a subagent, or an external directory into the agent's context — recommend mentioning the exact files rather than relying on the agent to search.
3. **Inline edit:** selecting text (or placing the cursor) plus the hotkey edits in place with a word-level diff preview the operator approves before it applies.
4. The mode's role stops at this guidance and at authoring the skills/commands/config the agent uses — it does not approve diffs or run the loop.

### Checkpoint

`operator_guidance_only`: the recipe told the operator which in-app affordance to use and did not claim the mode ran the agent, approved a diff, or rendered a plan.

---

## 7. VERIFYING

Run these named checkpoints after any Claudian operation:

| Checkpoint | What it proves |
| --- | --- |
| `provider_cli_reachable` | The provider's CLI resolves on `PATH` (or the set path exists) and settings parse |
| `skill_authored_no_collision` | The skill's `SKILL.md` parses to the provider's verified schema and its name is unique across scopes |
| `command_authored_no_collision` | The command file parses and its `/name` does not collide across scopes |
| `mcp_declared_provider_native` | The MCP entry lives in the provider's own MCP config, parses, and a restart was advised |
| `operator_guidance_only` | Plan-mode / `@`-mention guidance claimed no in-app run by the mode |

The file layer proves the config was authored correctly. Whether the agent picked it up and rendered anything is proven in-app after the operator restarts the provider — that check belongs to the operator, not this reference set.
