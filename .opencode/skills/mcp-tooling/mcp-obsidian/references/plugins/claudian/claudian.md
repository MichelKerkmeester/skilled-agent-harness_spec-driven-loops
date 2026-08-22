---
title: "Claudian Plugin In-Vault Index"
description: "Lean entry point for operating the Claudian community plugin (YishenTu/claudian, manifest id realclaudian) at the file layer: it embeds coding-agent CLIs (Claude Code, Codex, Grok, OpenCode, Pi) as collaborators whose working directory is the vault, configured through provider-native config, slash commands, reusable skills and MCP declarations on disk."
trigger_phrases:
  - "claudian plugin"
  - "realclaudian"
  - "claudian obsidian"
  - "coding agent in vault"
  - "claude code in obsidian"
  - "codex in obsidian"
  - "claudian provider cli"
  - "claudian mcp server"
importance_tier: "normal"
contextType: "implementation"
version: "0.1.0.0"
---

# Claudian Plugin In-Vault Index (`claudian`)

The `mcp-obsidian` mode operates the Claudian community plugin by **configuring its providers and authoring the in-vault artifacts it reads** — slash commands, reusable skills, provider config, and MCP declarations on disk. It does **not** run the agent loop, and it does **not** render anything in the plugin's chat UI. Claudian is local CLI execution: it launches a provider's already-installed coding-agent CLI with the vault as that agent's working directory. It is not a bundled API-key chat client.

## 1. OVERVIEW

| Identity field | Current value | Why it matters |
| --- | --- | --- |
| Plugin repository | [`YishenTu/claudian`](https://github.com/YishenTu/claudian) | Source of behavior facts |
| Display name | **Claudian** | Name shown in the plugin list once installed |
| Manifest `id` (on-disk folder) | **`realclaudian`** | The plugin folder is `.obsidian/plugins/realclaudian/`, **not** `claudian`. It registered as `realclaudian` because an unrelated plugin already held the id `claudian` (see `troubleshooting.md` §6). Folder name ≠ display name |
| Installed version (operator vault) | **v2.2.4** | Confirmed from the on-disk `manifest.json` |
| Minimum Obsidian version | **1.13.0** | `minAppVersion` in the manifest; older Obsidian will not load the plugin |
| Platform | **Desktop only** | `isDesktopOnly: true`; there is no mobile build. macOS, Linux, Windows |
| Prerequisite | **At least one provider CLI already installed** | Claude Code, Codex, Grok, OpenCode or Pi. Claudian shells out to these — it does not bundle them and cannot run without one |
| Providers | Claude Code, Codex, Grok, OpenCode, Pi | Each is reached through its **own native CLI config**; Claudian adapts them per provider |
| Nature | **Local CLI execution, not an API chat client** | The vault becomes the agent's working directory: file read/write, search, bash, multi-step workflows |

Confirmed from the README and the installed `manifest.json`: the provider list, the desktop-only constraint, `minAppVersion 1.13.0`, the CLI-prerequisite, and the feature set (inline word-level diffs, `/` slash commands, `@`-mentions, plan mode). The **exact on-disk config paths and file shapes** are not spelled out in the README; the paths documented in `data-model.md` were observed in the compiled plugin and follow each provider CLI's native config layout, but their precise schema is marked **VERIFY** against a live install (see §4 Guardrails).

---

## 2. HOW IT WORKS

Claudian launches a provider's coding-agent CLI **inside Obsidian**, with the current vault set as the agent's working directory. From there the agent reads and writes vault files, searches, runs bash, and executes multi-step workflows — the same capabilities the CLI has in a terminal, surfaced in a chat pane with inline word-level diffs before edits are applied.

The operator drives the agent with three in-pane affordances: `/` (or `$`) invokes a **reusable prompt template or skill** pulled from user-level and vault-level scopes; `@` **mentions** a vault file, a subagent, or an external directory to bring it into context; and **plan mode** (`Shift+Tab`) makes the agent explore and propose a plan for approval before it writes anything.

Everything Claudian reads to do this lives as ordinary files: the provider CLI's config, the command and skill definitions, and the MCP server declarations. That is the surface the `mcp-obsidian` mode operates — it authors and validates those files at the file layer. It never claims the agent's chat output, its diffs, or its plan panel rendered; those are produced by the running CLI in-app, which is the operator's step, not this reference set's.

---

## 3. SOURCE FILES

| File | Use it for |
| --- | --- |
| [`data-model.md`](data-model.md) | Where each in-vault artifact lives on disk and its shape: slash commands, reusable skills, provider config, MCP declarations, and the `.claude/` (and sibling provider) layout, user-level vs vault-level scope |
| [`workflows.md`](workflows.md) | Numbered recipes: register a provider CLI, author a reusable skill/prompt, add a slash command, connect an MCP server, use plan mode and `@`-mentions |
| [`troubleshooting.md`](troubleshooting.md) | Failure modes: CLI not found, desktop-only, provider auth, the three-name confusion note, and the in-app-search discoverability issue |

The general file-layer operating model (locate the artifact, edit it, verify at the file layer, never claim the render) lives in [`../plugin-operation-logic.md`](../plugin-operation-logic.md). When the plugin is not discoverable in the in-app store, the BRAT install path is documented in [`../obsidian42-brat/`](../obsidian42-brat/) — this reference set only points to it.

---

## 4. GUARDRAILS

- **Never claim you ran or rendered the agent.** The `mcp-obsidian` mode configures Claudian and authors the files it reads. Launching a provider, running the agent loop, and seeing a diff or plan render are the operator's in-app steps.
- **Never invent a provider config file name or an exact key as verified fact.** The paths in `data-model.md` were observed in the compiled plugin and mirror each provider CLI's native layout, but their exact schema is `VERIFY` against a live install. Flag it, do not fabricate it.
- **Respect the CLI prerequisite.** Claudian cannot run a provider whose CLI is not installed and on `PATH`. Confirm the CLI exists before promising a provider works.
- **Respect desktop-only.** There is no mobile Claudian. Never document a mobile workflow.
- **Keep the three Claudians distinct.** This plugin is `YishenTu/claudian`, id `realclaudian`. It is not ClaudianIA (id `claudian`) and not Claudian Plus — see `troubleshooting.md` §6 before acting on any "claudian" folder.
- **MCP is provider-native.** Claudian connects MCP servers through each agent's own CLI-managed MCP config, not a Claudian-specific registry. Author the MCP declaration in the provider's native config, not an invented one.
