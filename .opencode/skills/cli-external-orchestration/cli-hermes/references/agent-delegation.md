---
title: "Hermes Agent Delegation Reference"
description: "How this repo's agents, commands and skills reach a Hermes dispatch: inlined personas, optional persona skills, delegate_task's limits, and prompt templates for the nested commands."
trigger_phrases:
  - "hermes agent delegation"
  - "hermes persona"
  - "hermes delegate_task"
  - "hermes prompt templates commands"
  - "delegate from hermes"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Hermes Agent Delegation Reference

This reference prevents a category error: Hermes profiles and `delegate_task` sub-agents are not persona surfaces for this repo's agents.

## 1. OVERVIEW

### Core Principle

The repo's agents (`.opencode/agents/*.md`, the authored source) reach a Hermes dispatch only inside the prompt. Hermes has no flag that loads an agent file, its profiles are whole-home islands, and `delegate_task` children receive a goal and context, never an agent definition.

---

## 2. PERSONA ROUTES

| Route | Works | Use when |
|---|---|---|
| Inline the persona block at the top of the prompt, after the child-dispatch preamble | Yes | Default; the `cli-codex` and `cli-pi` precedent |
| Persona skill preloaded with `-s <name>` from `./.hermes/skills` | Yes, after the trust grant | Only if prompt size becomes a measured problem; needs the repo-local folder and the operator's trust |
| `hermes profile create` per agent | No | Profiles isolate homes and credentials, not personas |
| `hermes import-agent claude-code` | No | Imports `CLAUDE.md` into memories and copies skills into the user home; never imports agent files; bypasses trust and quarantine |

Resolve the persona from the calling runtime's agent directory (AGENTS.md §9), since Hermes has none of its own and its personas travel inlined in the prompt, and map each subtask to the right agent (code, review, design, deep-research, markdown). The canonical contract is `../../../sk-prompt/assets/cli-prompt-quality-card.md` "Persona Injection".

---

## 3. COMMANDS

The repo's nested commands under `.opencode/commands/**` have no Hermes equivalent: Hermes has no workflow engine and its slash commands are its own. The cli-pi precedent applies: flatten each command into a prompt template under `.hermes/prompts/` and carry it with `--query-file`. The runtime-folder phase generates those templates with a sync script; a dispatch loads the template text into its prompt file.

---

## 3A. PERSONA THROUGH THE REPO PLUGIN

`.hermes/agents/` links the shared runtime-neutral agent files, and `sync-skills-hermes.cjs` mirrors each as the preloadable skill `agent-<name>` because Hermes has no agent flag and caps a plugin prompt section at 4000 characters (a 22k persona in a section was skipped outright). The native-shaped dispatch is `-s agent-<name>` plus `HERMES_AGENT_PERSONA=<name>` with `HERMES_ENABLE_PROJECT_PLUGINS=1`: the skill carries the whole persona and the plugin's persona section binds it for the session. Because `-s` is in play, `--ignore-rules` is omitted (the packet's documented exception). Inline stays the fallback for a run without the plugin or the mirror.

---

## 4. SKILLS

With the repo trusted, Hermes loads the curated per-skill links under `.hermes/skills/<name>` and can preload one with `-s <name>` (observed 2026-09-14: `-s cli-hermes` quoted the packet's first hard rule). A dispatch that needs any other skill names it in the prompt by path, because only linked skills are visible to Hermes and the hub identity does not cross the link.

---

## 5. `delegate_task` AND THE DELEGATION BOUNDARY

Hermes's own sub-agents are spawned by the `delegation` toolset. A leaf lineage never carries that toolset: a sub-agent spawned inside a lineage runs outside the runner's containment and stack guards. For non-leaf use, the semantics of `delegation.subagent_auto_approve`, child timeouts and flag inheritance are open questions for the contract pin. Because Hermes has in-process delegation, `cli-hermes` is not exempt from the self-presence guards the way `cli-pi` is.

---

## 6. MCP AND HOOKS AS DELEGATION SURFACES

MCP servers are user-level ([mcp-policy.md](./mcp-policy.md)); the repo's guard cores reach a Hermes session through the project plugin ([hook-contract.md](./hook-contract.md)). Neither is a persona surface.
