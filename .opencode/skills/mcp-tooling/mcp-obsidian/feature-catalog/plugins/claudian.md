---
title: "Claudian plugin embedded coding-agent CLIs in the vault"
description: "Configure and author the in-vault artifacts of the Claudian community plugin (YishenTu/claudian, id realclaudian): provider CLI registration, reusable skills and slash commands, and provider-native MCP declarations, with the vault as the agent's working directory."
trigger_phrases:
  - "claudian plugin"
  - "claude code in obsidian"
  - "coding agent in vault"
  - "claudian provider"
  - "claudian skill"
  - "claudian mcp"
version: "0.1.0.0"
---

# Claudian plugin embedded coding-agent CLIs in the vault (`claudian`)

## 1. OVERVIEW

The Claudian community plugin (repo `YishenTu/claudian`, manifest id **`realclaudian`**, installed v2.2.4, `minAppVersion 1.13.0`, desktop-only) embeds coding-agent CLIs — Claude Code, Codex, Grok, OpenCode, Pi — as collaborators inside Obsidian, with the current vault set as the agent's working directory: file read/write, search, bash, and multi-step workflows. It is local CLI execution, not a bundled API-key chat client, so it requires the underlying provider CLI to be installed and authenticated already. The on-disk folder is `realclaudian`, not `claudian` — the id `claudian` belongs to a different plugin (ClaudianIA). The `mcp-obsidian` mode's role is to configure Claudian and author the files it reads correctly; it never runs the agent loop or claims anything rendered in the chat UI.

---

## 2. HOW IT WORKS

The mode authors and validates the artifacts the plugin reads, all in each provider CLI's native layout under user-level (`~/.claude/`, global) and vault-level (`<vault>/.claude/`, this vault) scopes: reusable skills (`skills/<name>/SKILL.md`), slash commands (`commands/<name>.md`), provider config, and provider-native MCP declarations — in each provider CLI's own MCP config, **not** a Claudian-authored `.claude/mcp.json` (Claudian removes that legacy file at init). Claudian's own settings live at `<vault>/.claudian/claudian-settings.json` (current; `.claude/claudian-settings.json` is legacy). The provider CLIs' exact MCP config paths and schemas are `VERIFY` against each CLI's docs. Running the agent, approving inline word-level diffs, driving `@`-mentions and plan mode (`Shift+Tab`) all happen in-app — the file layer proves the config was authored, not that the agent ran it.

---

## 3. SOURCE FILES

### Implementation

- Plugin index: `references/plugins/claudian/claudian.md`
- Data contract: `references/plugins/claudian/data-model.md`
- Recipes: `references/plugins/claudian/workflows.md`
- Diagnostics: `references/plugins/claudian/troubleshooting.md`

### Verification

- Live check (operator, in-app): in a desktop vault on Obsidian 1.13.0+, with a provider CLI installed and authenticated, launch that provider in Claudian and confirm the agent runs against the vault. This is the operator's step, not authored by this reference set.

### Related

- General file-layer operating model: `references/plugins/plugin-operation-logic.md`
- Alternate install path when the in-app store search fails (`YishenTu/claudian#912`): `references/plugins/obsidian42-brat/`

---

## 4. GUARDRAILS

- Never claim the mode ran or rendered the agent. It configures Claudian and authors the files it reads; running the loop and approving diffs are in-app operator steps.
- Never present a provider config path or key as byte-verified. The observed paths follow each CLI's native layout; the exact schema is `VERIFY` against a live install.
- Never assume one provider's config shape for another — Claude Code, Codex, OpenCode, Grok and Pi each own their native config.
- Never author `.claude/mcp.json` or invent a Claudian MCP registry — Claudian removes that legacy file at init; MCP is declared in the provider CLI's own native MCP config.
- Keep the three "Claudian" plugins distinct: this is `realclaudian` by YishenTu, not ClaudianIA (id `claudian`) or Claudian Plus. Desktop-only, CLI-prerequisite.
