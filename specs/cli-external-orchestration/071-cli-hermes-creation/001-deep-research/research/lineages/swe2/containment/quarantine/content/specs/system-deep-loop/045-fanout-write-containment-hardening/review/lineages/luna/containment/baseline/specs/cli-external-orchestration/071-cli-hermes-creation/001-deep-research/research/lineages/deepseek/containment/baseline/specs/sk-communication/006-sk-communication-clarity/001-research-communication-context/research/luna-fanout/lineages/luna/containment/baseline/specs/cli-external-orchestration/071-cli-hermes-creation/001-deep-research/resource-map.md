---
title: "Resource Map: known context for the Hermes runtime research"
description: "Pointer-based inventory of what is already confirmed about the local Hermes install and about this repository's runtime integration surface, so the research loop builds on it instead of rediscovering it."
trigger_phrases:
  - "hermes known context"
  - "hermes resource map"
  - "cli runtime integration surface"
importance_tier: "important"
contextType: "research"
---

# Resource Map: known context for the Hermes runtime research

Everything here was observed on 2026-09-14 on this machine. Treat listed files as known
inventory; cite them, do not rediscover them.

## Documents

### The local Hermes install (observed)

- `hermes --version` prints `Hermes Agent v0.21.1 (2026.9.7) · upstream dc90a75a`, install method git, install directory `~/.hermes/hermes-agent`, binary `~/.local/bin/hermes`.
- `~/.hermes/` holds `config.yaml` (only `plugins.enabled: [orca-status]`), `.env` (secrets; read key names only, never values), `SOUL.md` (the default persona text), `skills/` (12 bundled categories), `plugins/orca-status`, empty `hooks/`, `memories/`, `sessions/`, `logs/`, `bin/` (browser tools, `uv`, `uvx`), `node/`, `hermes-setup`, and an older broken checkout `hermes-agent.broken-20260911-065912` (ignore it).
- `hermes --help` lists the top-level commands: `chat model moa fallback worktree browser secrets egress migrate gateway proxy lsp setup whatsapp whatsapp-cloud slack send login logout auth status pause resume cron sync webhook peer portal kanban project hooks doctor verify security approvals dump debug backup checkpoints import import-agent config skin console pairing skills bundles plugins curator pets journey learning memory-graph memory tools computer-use mcp sessions insights monitoring claw vault update uninstall acp profile completion dashboard serve desktop gui logs prompt-size`.
- `hermes chat --help` (observed): `-q/--query`, `--query-file PATH` (`-` reads stdin; nothing shell-interpreted), `--oneshot` (implied on non-TTY and by `-Q`), `--image`, `-m/--model`, `-t/--toolsets`, `--reasoning {none,minimal,low,medium,high,xhigh,max,ultra}`, `-s/--skills`, `--provider`, `-v`, `-Q/--quiet` (final response and session info only), `--resume SESSION_ID|latest`, `--no-restore-cwd`, `--in DIR`, `-c/--continue [NAME]`, `--create-if-missing`, `--worktree`, `--accept-hooks`, `--checkpoints`, `--max-turns N`, `--run-budget SECONDS`, `--yolo`, `--pass-session-id`, `--ignore-user-config`, `--ignore-rules` (skips AGENTS.md, SOUL.md, .cursorrules, memory and preloaded skills), `--safe-mode` (disables user config, rules, plugins and MCP), `--source`, `--tui`, `--cli`, `--dev`.
- `hermes import-agent [claude-code|codex] [--source DIR] [--dry-run] [--overwrite] [--yes]`: maps CLAUDE.md or AGENTS.md, permission allowlists, MCP servers, skills and memories into Hermes equivalents; never imports credentials. Source `hermes_cli/agent_import.py` (CLAUDE.md and AGENTS.md become memory entries in `memories/MEMORY.md`; `skills/<name>/SKILL.md` dirs become `HERMES_HOME/skills/<category>/<name>`).
- `hermes skills` subcommands include `trust` ("Trust a project so its repo-local skills (./.hermes/skills, ./.agents/skills) load"), `untrust`, `browse`, `search`, `install`, `inspect`, `list`, `check`, `update`, `audit`, `uninstall`, `reset`, `list-modified`, `diff`, `opt-out`, `opt-in`, `repair-official`, `publish`, `snapshot`, `tap`, `config`.
- `agent/skill_utils.py:410` defines `PROJECT_SKILLS_SUBDIRS = (".hermes/skills", ".agents/skills")`; `get_project_skills_dirs()` at line 490 returns trusted project-local dirs for the current cwd; `tools/skills_tool.py:177-204` puts trusted project dirs first and warns for skills outside trusted dirs; `tools/skills_tool.py:490-496` quarantines project skills that fail the scan.
- `agent/coding_context.py:35,38` lists `AGENTS.md`, `CLAUDE.md`, `.cursorrules` as the context files; `agent/prompt_builder.py:1465-1578` loads `SOUL.md`, `AGENTS.md`/`agents.md`, `CLAUDE.md`/`claude.md`, `.cursorrules`; line 1223 loads trusted project-local skill dirs as the highest-precedence tier.
- `hermes_cli/_parser.py:117` says "AGENTS.md in the CWD are loaded as normal"; lines 166-170 define `--ignore-user-config`, `--ignore-rules` and `--safe-mode`.
- `skills/AGENTS.md` (installed source) carries the skill authoring standard: frontmatter `name`, `description` (60 characters max, one sentence, ends with a period), `version`, `author`, `license`, `platforms`, `metadata.hermes.{tags,category,related_skills,config}`; sections `When to Use`, `Prerequisites`, `How to Run`, `Quick Reference`, `Procedure`, `Pitfalls`, `Verification`; prose must name native tools (`terminal`, `web_extract`, `read_file`, `patch`, `search_files`, `delegate_task`) rather than shell utilities.
- Toolsets (from `toolsets.py`): `browser clarify code_execution coding computer_use connections context_engine cronjob debugging delegation desktop_ui file image_gen kanban memory project safe search session_search skills terminal todo tts video vision web x_search` plus per-platform `hermes-*` sets.
- Tool modules of interest under `tools/`: `delegate_tool*.py`, `subagent_worktree.py`, `mcp_tool*.py`, `web_tools*.py`, `terminal_tool*.py`, `skills_tool.py`, `skills_guard.py`, `skill_linter.py`.
- `hermes hooks {list,test,revoke,doctor}`: shell-script hooks declared in `~/.hermes/config.yaml`, consent allowlist at `~/.hermes/shell-hooks-allowlist.json`.
- `hermes plugins {install,search,browse,validate,update,remove,list,enable,disable,capabilities,doctor,compat,pack,show}`: native plugins and portable Agent Plugins v1 packages; portable packages install disabled.
- `hermes mcp {serve,add,remove,list,test,configure,login,reauth,picker,catalog,install}`; `hermes tools {list,disable,enable,post-setup}` with `server:tool` notation for MCP tools.
- `hermes profile {list,use,create,delete,describe,show,alias,rename,export,import,install,update,info}`; profiles switch `HERMES_HOME` (`hermes_constants.get_hermes_home()`; root `AGENTS.md:267` says never hardcode `~/.hermes`).
- `hermes acp` (ACP mode for editors, JSON-RPC) and `hermes serve` exist as alternative transports.
- `cli-config.yaml.example` lists providers: `auto openrouter nous nous-api anthropic openai-codex copilot gemini zai kimi-coding minimax minimax-cn huggingface nvidia xiaomi arcee ollama-cloud deepinfra kilocode ai-gateway azure-foundry lmstudio custom` (aliases `ollama vllm llamacpp`), with `base_url`, `api_key`, `streaming`, `context_length`, `default_headers` and `reasoning_effort` settings.
- Installed docs under `~/.hermes/hermes-agent/docs/`: `ADR.md`, `session-lifecycle.md`, `micro-compaction.md`, `profile-routing.md`, `state-db-recovery.md`, `security/network-egress-isolation.md`, `rfcs/plugin-config-state-bridge.md`, `rfcs/2026-07-plugin-architecture-lessons-pi-opencode.md`, `design/multiplexing-gateway.md`, `design/profile-builder.md`. Root `AGENTS.md` has a routing table to per-area `AGENTS.md` files (`agent/`, `hermes_cli/`, `gateway/`, `tools/`, `plugins/`, `skills/`, `cron/`).

### This repository's runtime integration surface (observed)

- Hub: `.opencode/skills/cli-external-orchestration/` with modes `cli-claude-code cli-codex cli-cursor cli-devin cli-opencode cli-pi`; hub files `SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `leaf-manifest.json`, `description.json`, `graph-metadata.json`, `shared/references/child-dispatch-preamble.md`, `feature-catalog/`, `manual-testing-playbook/`, `benchmark/`, `changelog/`.
- Each mode packet: `SKILL.md`, `README.md`, `assets/{prompt-quality-card.md,prompt-templates.md}`, `references/{agent-delegation.md,cli-reference.md,integration-patterns.md,providers-and-models.md,<mode>-tools.md}`, `manual-testing-playbook/`, `benchmark/`, `changelog/`. Read `cli-pi/SKILL.md` and `cli-devin/SKILL.md` first; they are the closest precedents.
- Runtime enumeration points a seventh kind must extend: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11` (`EXECUTOR_KINDS`), lines 79-99 (`EXECUTOR_KIND_FLAG_SUPPORT`), line 124 (sandbox support map), ~164 (`EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX`), 362-379 (`DEVIN_SUPPORTED_MODELS`) and the `PI_SUPPORTED_MODELS` allowlist; `executor-audit.ts:80-91` (state-dir env by kind), 108 (`SELF_PRESENCE_EXEMPT_KINDS`), 133-152 (session env prefixes by kind); `runtime/scripts/fanout-run.cjs` builders `buildDevinLineageCommand` (~2403), `buildPiLineageCommand` (~2515), allowlist mirrors and the `cli-opencode`/`cli-claude-code` special cases at 1386, 2010, 3042, 3087, 3365; `.opencode/hooks/dispatch/lib/dispatch-audit.mjs:28-36` (binary regex table); `runtime/tests/unit/combo-matrix.vitest.ts:61-74`.
- The skill advisor discovers executors from `mode-registry.json` (`system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:120-166`); registering there needs no scorer code change.
- Repo-root dotfolders: `.claude` (real `agents/*.md`, `commands/`, `hooks/`, `settings.json`, `mcp.json`, symlinks `skills -> ../.opencode/skills`, `manual-testing-playbook`), `.codex` (real `agents/*.toml`, `prompts/`, `config.toml`, `hooks.json`), `.cursor` (`agents/*.md` symlinked to `../../.claude/agents/`, `rules/`, `hooks/`, `mcp.json`), `.pi` (real `agents/*.md`, `prompts/`, `extensions/` with symlinked hook `.ts` files, `settings.json`, `models.json`, `mcp.json`, `skills -> ../.opencode/skills`), `.devin` (`agents/<name>/AGENT.md` symlinked to `../../../.claude/agents/<name>.md`, `hooks/` with per-file symlinks into `.opencode/hooks/dispatch/devin/`, `hooks.v1.json`, `mcp_config.json`). Every dotfolder has `SYNC.md` and a `manual-testing-playbook` symlink to its mode packet. No `.hermes/` exists yet.
- Shared agents: 13 real files in `.claude/agents/` (`ai-council code context debug deep-improvement deep-research deep-review design markdown orchestrate prompt-improver review` plus a statusline helper). Commands: `.opencode/commands/**/*.md` (nested groups such as `create/`, `deep/`, `doctor/`, `speckit/`, `rewrite/`). Skills: `.opencode/skills/*` parent hubs, each with nested mode `SKILL.md` files.
- Native MCP servers and code-mode manuals are registered per runtime in `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.pi/mcp.json`, `.devin/mcp_config.json`, and `.utcp_config.json`.
- Governance: `AGENTS.md` and `CLAUDE.md` (identical) mention `cli-opencode` once at line 116 and enumerate no runtime roster; `REPO RULES.md` names no `cli-*` mode. Agent roster docs that list runtimes: `.opencode/agents/context.md`, `deep-research.md`, `deep-review.md`, `deep-improvement.md` and their `.claude`/`.codex` mirrors.
- Precedent packets: `specs/cli-external-orchestration/031-cli-pi-creation/` (15 phases, the shape this packet mirrors), `045-cli-pi-bridge-cursor-devin/001-research-bridge-possibilities/` (a two-lineage forced-depth research phase and its `research/research.md`), `046-cli-devin-current-cli-repair/` (headless dispatch trap: untrusted-workspace gate and `--sandbox` write rejection), `z_archive/016-cli-devin-creation/`, `z_archive/008-cli-opencode-creation/`.

## Skills

- `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md`, `cli-devin/SKILL.md`, `cli-codex/SKILL.md`, `cli-cursor/SKILL.md`, `cli-claude-code/SKILL.md`, `cli-opencode/SKILL.md` and each one's `references/cli-reference.md`: the comparison baseline.
- `.opencode/skills/sk-doc/sk-create-skill/` (skill packet template and existing-hub checklist), `sk-create-readme/`, `sk-create-feature-catalog/`, `sk-create-manual-testing-playbook/`, `.opencode/skills/sk-code/sk-code-opencode/`: the create modes later phases must use; cite what each requires of a new mode.

## Specs

- `specs/cli-external-orchestration/071-cli-hermes-creation/spec.md` and `goal.md`: the parent packet, its candidate phase list and its decisions.
- `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research-angles.md`: the ten angles this run works through.

## Scripts

- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `fanout-merge.cjs`; `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`.

## Config

- `~/.hermes/config.yaml`, `~/.hermes/.env` (names only), `~/.hermes/hermes-agent/cli-config.yaml.example`.

## Meta

- Hermes online sources to fetch live: the Nous Research Hermes Agent repository and documentation site, its changelog and releases, issues on headless or `-q` usage, plugin and hook documentation, MCP documentation, and agentskills.io.
