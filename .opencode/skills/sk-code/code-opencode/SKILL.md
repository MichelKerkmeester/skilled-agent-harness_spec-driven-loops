---
name: code-opencode
description: "sk-code OPENCODE surface: read-only system-code evidence (TypeScript/Python/shell/config standards, language-agnostic patterns, hooks, alignment verification, and skill/agent/command/MCP authoring checklists) bundled by the hub alongside a workflow mode."
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.0.0.0
metadata:
  author: OpenCode
  family: sk-code
  packetKind: surface
---

<!-- Keywords: opencode, system-code, typescript, python, shell, jsonc, config, mcp, skill-authoring, agent-authoring, command-authoring, hooks, alignment-verifier, surface-evidence, sk-code -->

# opencode Surface — System-Code Evidence

Read-only **domain evidence** for OpenCode system code (the `.opencode/` tree: skills, agents, commands, plugins, MCP servers, config). This packet carries no process: the hub bundles it alongside a workflow mode when it detects a system-code surface, then slices by the detected language so a TypeScript task never pulls the Python/shell/config guides. Detection markers: `.opencode/`, `SKILL.md`, `.cjs`/`.mjs`/`.ts`/`.py`/`.sh`, `graph-metadata`, `spec-folder`, `argparse`.

## 1. WHEN THE HUB BUNDLES THIS

- The task touches `.opencode/` system code — a skill, agent, command, plugin, MCP server, or descriptor/config.
- A workflow mode needs a language standard, a language-agnostic organization pattern, a hook contract, an alignment-verification procedure, or an authoring checklist.
- Evidence-only: nothing here mutates the workspace. The paired workflow mode owns edits, tests, and commits.

## 2. REFERENCE MAP

Language standards — load ONLY the detected language's trio (`style_guide.md`, `quality_standards.md`, `quick_reference.md`):
- TypeScript — `references/typescript/`
- Python — `references/python/`
- Shell — `references/shell/`
- Config (JSON/JSONC descriptors) — `references/config/`
- JavaScript (CommonJS/ESM plugins) — `references/javascript/`

Language-agnostic shared tier (`references/shared/`, always kept within OpenCode regardless of language):
- `universal_patterns.md`, `code_organization.md`
- `hooks.md` — session-prime / user-prompt-submit / pre-tool-use / post-tool-use contracts
- `alignment_verification_automation.md` — the alignment-drift verifier

## 3. SURFACE STANDARDS (the non-negotiables)

- **Plugins never write to the TUI.** OpenCode plugins must not print to the process stdout/stderr (no overlay on the chat input); user/agent-visible output goes through system-context injection, tools, or append-only log files; DEBUG-gated stderr is allowed only behind an env flag. See `references/javascript/quality_standards.md` and the plugin exemption tier.
- **Descriptors are load-bearing.** `graph-metadata.json` / `description.json` shape drives discovery; validate JSON/JSONC against `references/config/quality_standards.md`.
- **Alignment drift is a verification gate.** System-code changes re-run the alignment verifier (`references/shared/alignment_verification_automation.md`) before any completion claim.
- **One language per task.** A `.opencode/` task is a single language; keep the slice tight and lean on the shared tier for cross-language rules.

## 4. ASSETS — authoring checklists (on-demand)

Component authoring (`assets/checklists/`): `skill_authoring.md`, `agent_authoring.md`, `command_authoring.md`, `mcp_server_authoring.md`

Language quality gates (`assets/checklists/`): `universal_checklist.md`, `typescript_checklist.md`, `python_checklist.md`, `shell_checklist.md`, `javascript_checklist.md`, `config_checklist.md`

Spec-folder authoring lives in system-spec-kit (`references/workflows/spec_folder_write_recipe.md` + `spec_folder_authoring_checklist.md`), not in this surface. Checklists are pulled on demand by the paired workflow mode.
