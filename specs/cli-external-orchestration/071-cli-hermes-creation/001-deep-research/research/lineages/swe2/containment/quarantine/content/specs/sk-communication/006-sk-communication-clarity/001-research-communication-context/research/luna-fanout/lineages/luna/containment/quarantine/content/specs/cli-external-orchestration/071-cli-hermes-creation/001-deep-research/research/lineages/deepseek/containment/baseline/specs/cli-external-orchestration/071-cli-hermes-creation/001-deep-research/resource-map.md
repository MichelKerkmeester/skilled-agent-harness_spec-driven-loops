---
title: "Resource Map: known context for the Hermes runtime research"
description: "Pointer-based inventory of what is already confirmed about the local Hermes install and about this repository's runtime integration surface, so the research loop builds on it instead of rediscovering it."
trigger_phrases:
  - "resource map"
  - "hermes known context"
  - "cli runtime integration surface"
importance_tier: "important"
contextType: "research"
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 58
- **By category**: READMEs=0, Documents=14, Commands=2, Agents=2, Skills=12, Specs=7, Scripts=4, Tests=1, Config=11, Meta=5
- **Missing on disk**: 0
- **Scope**: everything observed on 2026-09-14 about the local Hermes install (v0.21.1, upstream `dc90a75a`) and this repository's runtime integration surface. Treat every path as known inventory: cite it, do not rediscover it. Paths under `~/.hermes/hermes-agent/` are the installed Hermes source.
- **Generated**: 2026-09-14T18:30:00+02:00

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:documents -->
## 2. Documents

> Hermes source files and docs (installed checkout) plus repo governance docs. Observed facts sit in the Note column.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `~/.hermes/hermes-agent/hermes_cli/_parser.py` | Analyzed | OK | Line 117: "AGENTS.md in the CWD are loaded as normal". Lines 166-170 define `--ignore-user-config`, `--ignore-rules` (skips AGENTS.md, SOUL.md, .cursorrules, memory, preloaded skills) and `--safe-mode` (also disables plugins and MCP). `hermes chat --help` shows `-q/--query`, `--query-file PATH` (`-` reads stdin, nothing shell-interpreted), `--oneshot` (implied on non-TTY and by `-Q`), `--image`, `-m`, `-t/--toolsets`, `--reasoning {none,minimal,low,medium,high,xhigh,max,ultra}`, `-s/--skills`, `--provider`, `-Q/--quiet` (final response and session info only), `--resume ID|latest`, `--in DIR`, `-c/--continue`, `--create-if-missing`, `--worktree`, `--accept-hooks`, `--checkpoints`, `--max-turns N`, `--run-budget SECONDS`, `--yolo`, `--pass-session-id`, `--source`, `--tui`, `--cli`, `--dev` |
| `~/.hermes/hermes-agent/agent/coding_context.py` | Analyzed | OK | Lines 35 and 38 list `AGENTS.md`, `CLAUDE.md`, `.cursorrules` as the context files read from the working directory |
| `~/.hermes/hermes-agent/agent/prompt_builder.py` | Analyzed | OK | Lines 1465-1578 load `SOUL.md`, `AGENTS.md`/`agents.md`, `CLAUDE.md`/`claude.md`, `.cursorrules`; line 1223 loads trusted project-local skill dirs as the highest-precedence tier; line 1388 collects project skill files |
| `~/.hermes/hermes-agent/agent/skill_utils.py` | Analyzed | OK | Line 410: `PROJECT_SKILLS_SUBDIRS = (".hermes/skills", ".agents/skills")`; line 490: `get_project_skills_dirs()` returns trusted project-local dirs for the cwd, walking up at most 64 levels |
| `~/.hermes/hermes-agent/skills/AGENTS.md` | Analyzed | OK | Skill authoring standard: frontmatter `name`, `description` (60 chars max, one sentence, ends with a period), `version`, `author`, `license`, `platforms`, `metadata.hermes.{tags,category,related_skills,config}`; section order `When to Use`, `Prerequisites`, `How to Run`, `Quick Reference`, `Procedure`, `Pitfalls`, `Verification`; prose names native tools (`terminal`, `web_extract`, `read_file`, `patch`, `search_files`, `delegate_task`), never shell utilities; no pagination on skill-loading tools |
| `~/.hermes/hermes-agent/AGENTS.md` | Analyzed | OK | Root routing table to per-area `AGENTS.md` files (`agent/`, `hermes_cli/`, `gateway/`, `tools/`, `plugins/`, `skills/`, `cron/`); line 267: never hardcode `~/.hermes`, use `get_hermes_home()`; plugins live in `~/.hermes/plugins/` or pip |
| `~/.hermes/hermes-agent/cli-config.yaml.example` | Analyzed | OK | Providers: `auto openrouter nous nous-api anthropic openai-codex copilot gemini zai kimi-coding minimax minimax-cn huggingface nvidia xiaomi arcee ollama-cloud deepinfra kilocode ai-gateway azure-foundry lmstudio custom` (aliases `ollama vllm llamacpp`); settings `model.default`, `provider`, `base_url`, `api_key`, `streaming`, `context_length`, `default_headers`; `database.journal_mode`; `runtime.nofile_soft_limit` |
| `~/.hermes/hermes-agent/docs/` | Analyzed | OK | `ADR.md`, `session-lifecycle.md`, `micro-compaction.md`, `profile-routing.md`, `state-db-recovery.md`, `security/network-egress-isolation.md`, `rfcs/plugin-config-state-bridge.md`, `rfcs/2026-07-plugin-architecture-lessons-pi-opencode.md`, `design/multiplexing-gateway.md`, `design/profile-builder.md` |
| `~/.hermes/hermes-agent/README.md` | Analyzed | OK | Lines 206-228: skill and workspace-instruction import notes; git checkout lives at `$HERMES_HOME/hermes-agent` |
| `~/.hermes/SOUL.md` | Analyzed | OK | The default persona text injected unless `--ignore-rules` |
| `.opencode/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md` | Cited | OK | The block every non-interactive dispatch prompt must carry so a child does not stop at the spec-folder gate |
| `AGENTS.md` | Analyzed | OK | Identical to `CLAUDE.md`; mentions `cli-opencode` once at line 116; enumerates no runtime roster |
| `REPO RULES.md` | Analyzed | OK | Names no `cli-*` mode; routes by action to `repo-rules/*.md` |
| `.opencode/agents/context.md` | Cited | OK | With `deep-research.md`, `deep-review.md`, `deep-improvement.md` and their `.claude`/`.codex` mirrors: the roster docs that list runtimes and were extended for cli-pi in packet 031 phase 011 |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:commands -->
## 3. Commands

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/commands/` | Analyzed | OK | Nested command groups (`create/`, `deep/`, `doctor/`, `speckit/`, `rewrite/`, and more); packet 031 flattened 36 of them into `.pi/prompts/*.md` for Pi |
| `~/.local/bin/hermes` | Analyzed | OK | `hermes --version` prints `Hermes Agent v0.21.1 (2026.9.7) · upstream dc90a75a`, install method git. Top-level commands: `chat model moa fallback worktree browser secrets egress migrate gateway proxy lsp setup whatsapp whatsapp-cloud slack send login logout auth status pause resume cron sync webhook peer portal kanban project hooks doctor verify security approvals dump debug backup checkpoints import import-agent config skin console pairing skills bundles plugins curator pets journey learning memory-graph memory tools computer-use mcp sessions insights monitoring claw vault update uninstall acp profile completion dashboard serve desktop gui logs prompt-size`. `hermes skills` has `trust` ("Trust a project so its repo-local skills (./.hermes/skills, ./.agents/skills) load"), `untrust`, `browse`, `search`, `install`, `inspect`, `list`, `check`, `update`, `audit`, `uninstall`, `reset`, `list-modified`, `diff`, `opt-out`, `opt-in`, `repair-official`, `publish`, `snapshot`, `tap`, `config`. `hermes hooks {list,test,revoke,doctor}` manage shell hooks declared in `~/.hermes/config.yaml` with a consent allowlist at `~/.hermes/shell-hooks-allowlist.json`. `hermes plugins {install,search,browse,validate,update,remove,list,enable,disable,capabilities,doctor,compat,pack,show}`. `hermes mcp {serve,add,remove,list,test,configure,login,reauth,picker,catalog,install}`. `hermes tools {list,disable,enable,post-setup}` with `server:tool` notation. `hermes profile {list,use,create,delete,describe,show,alias,rename,export,import,install,update,info}`. `hermes import-agent [claude-code|codex] [--source DIR] [--dry-run] [--overwrite] [--yes]` maps CLAUDE.md or AGENTS.md, permission allowlists, MCP servers, skills and memories; never credentials. `hermes acp` (editor JSON-RPC) and `hermes serve` exist as alternative transports |
<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:agents -->
## 4. Agents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.claude/agents/` | Analyzed | OK | 13 real agent files (`ai-council code context debug deep-improvement deep-research deep-review design markdown orchestrate prompt-improver review` plus a statusline helper); every other dotfolder mirrors or symlinks these |
| `~/.hermes/hermes-agent/tools/delegate_tool.py` | Analyzed | OK | Hermes's own sub-agent system (`delegate_task`); siblings `delegate_tool_*.py`, `subagent_worktree.py`, `agent/delegation_context.py` |
<!-- /ANCHOR:agents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/cli-external-orchestration/SKILL.md` | Analyzed | OK | Hub router; modes `cli-claude-code cli-codex cli-cursor cli-devin cli-opencode cli-pi`; a new mode joins the mode table and the layout block |
| `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md` | Cited | OK | Closest precedent: closed model roster, `pi-availability-required` hard rule, self-dispatch carve-out; read its `references/cli-reference.md` too |
| `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` | Cited | OK | The executor running this research; roster ids `deepseek-v4-flash-max`, `swe-2-max`; hard rules `stdin-redirect-required`, `devin-availability-required` |
| `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md` | Cited | OK | Persona always inlined; `codex-availability-required` |
| `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md` | Cited | OK | 21-id enforced allowlist; self-invocation signal `CURSOR_AGENT=1` |
| `.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md` | Cited | OK | Native `--agent` persona; subscription OAuth only |
| `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Cited | OK | `</dev/null` placement rule; machine-readable stdout; `--agent orchestrate` persona route |
| `.opencode/skills/cli-external-orchestration/hub-router.json` | Analyzed | OK | With `mode-registry.json`, `leaf-manifest.json`, `ROUTER.md`, `description.json`, `graph-metadata.json`: the six surfaces a seventh mode registers on; the skill advisor reads executors from `mode-registry.json` (`system-skill-advisor/runtime/lib/scorer/executor-delegation.ts` lines 120-166), so no scorer change is needed |
| `.opencode/skills/sk-doc/sk-create-skill/` | Cited | OK | Skill packet template and existing-hub checklist for the future `cli-hermes` packet |
| `.opencode/skills/sk-doc/sk-create-readme/`, `sk-create-feature-catalog/`, `sk-create-manual-testing-playbook/` | Cited | OK | Create modes the later phases must use |
| `.opencode/skills/sk-code/sk-code-opencode/` | Cited | OK | Code surface for the runtime changes |
| `~/.hermes/hermes-agent/tools/skills_tool.py` | Analyzed | OK | Lines 177-204: trusted project dirs come first in the scan; lines 490-496: a project skill that fails the scan is quarantined until inspected or the repo is untrusted; lines 505-512: a skill outside trusted dirs warns, never blocks. Siblings: `skills_guard.py` (regex static scan, trust tiers builtin/trusted/community), `skill_linter.py`, `skills_ast_audit.py` |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `specs/cli-external-orchestration/071-cli-hermes-creation/spec.md` | Cited | OK | Parent packet, candidate phase list |
| `specs/cli-external-orchestration/071-cli-hermes-creation/goal.md` | Cited | OK | Parent directive and decisions |
| `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research-angles.md` | Cited | OK | The ten angles this run works through |
| `specs/cli-external-orchestration/031-cli-pi-creation/spec.md` | Cited | OK | 15-phase precedent this packet mirrors |
| `specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/001-research-bridge-possibilities/research/research.md` | Cited | OK | Shape of a two-lineage forced-depth synthesis |
| `specs/cli-external-orchestration/046-cli-devin-current-cli-repair/spec.md` | Cited | OK | Headless dispatch trap: untrusted-workspace gate and `--sandbox` write rejection |
| `specs/cli-external-orchestration/z_archive/016-cli-devin-creation/spec.md` | Cited | OK | With `z_archive/008-cli-opencode-creation/`: older standard-shape creation packets |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Analyzed | OK | Builders `buildDevinLineageCommand` (about line 2403: `devin -p "<prompt>" --model <id> --permission-mode dangerous --respect-workspace-trust false`), `buildPiLineageCommand` (about 2515); kind special cases at 1386, 2010, 3042, 3087, 3365; per-lineage env `SYSTEM_SPEC_GATE_DISABLED=1`, `AI_SESSION_CHILD=1` |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Analyzed | OK | Line 11 `EXECUTOR_KINDS`; 79-99 `EXECUTOR_KIND_FLAG_SUPPORT`; 124 sandbox map; about 164 `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` (`cli-devin` is inherit-only); 362-379 `DEVIN_SUPPORTED_MODELS`; `PI_SUPPORTED_MODELS` and `isPiModelAllowed` |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Analyzed | OK | 80-91 state-dir env by kind; 108 `SELF_PRESENCE_EXEMPT_KINDS`; 133-152 session env prefixes by kind (DEVIN_ deliberately absent at 142-144) |
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | Analyzed | OK | Lines 28-36: binary regex table (`opencode run`, `claude -p`, `codex exec`, `devin -p`, `cursor-agent -p`, `pi -p`) |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts` | Analyzed | OK | Lines 61-74: per-kind model and binary tables a seventh kind extends |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `~/.hermes/config.yaml` | Analyzed | OK | Only `plugins.enabled: [orca-status]` |
| `~/.hermes/.env` | Analyzed | OK | Secrets; read key names only, never values |
| `~/.hermes/` | Analyzed | OK | `skills/` (12 bundled categories), `plugins/orca-status`, empty `hooks/`, `memories/`, `sessions/`, `logs/`, `bin/` (browser tools, `uv`, `uvx`), `node/`, `hermes-setup`; ignore `hermes-agent.broken-20260911-065912` |
| `~/.hermes/hermes-agent/toolsets.py` | Analyzed | OK | Toolsets `browser clarify code_execution coding computer_use connections context_engine cronjob debugging delegation desktop_ui file image_gen kanban memory project safe search session_search skills terminal todo tts video vision web x_search` plus per-platform `hermes-*` sets |
| `.claude/` | Analyzed | OK | Real `agents/*.md`, `commands/`, `hooks/`, `settings.json`, `mcp.json`; symlinks `skills -> ../.opencode/skills`, `manual-testing-playbook` |
| `.codex/` | Analyzed | OK | Real `agents/*.toml`, `prompts/`, `config.toml`, `hooks.json`, `AGENTS.md` |
| `.cursor/` | Analyzed | OK | `agents/*.md` symlinked to `../../.claude/agents/`; `rules/`, `hooks/`, `mcp.json` |
| `.pi/` | Analyzed | OK | Real `agents/*.md`, `prompts/`, `extensions/` with symlinked hook `.ts` files, `settings.json`, `models.json`, `mcp.json`, `skills -> ../.opencode/skills` |
| `.devin/` | Analyzed | OK | `agents/<name>/AGENT.md` symlinked to `../../../.claude/agents/<name>.md`; `hooks/` with per-file symlinks into `.opencode/hooks/dispatch/devin/`; `hooks.v1.json`, `mcp_config.json`. Every dotfolder has `SYNC.md` and a `manual-testing-playbook` symlink to its mode packet |
| `.hermes/` (repo root) | Analyzed | PLANNED | Does not exist yet; a later phase creates it |
| `.utcp_config.json` | Cited | OK | Code-mode manuals; native MCP servers are registered per runtime in `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.pi/mcp.json`, `.devin/mcp_config.json` |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:meta -->
## 10. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| Hermes Agent repository and documentation site (Nous Research) | Cited | PLANNED | Fetch live; record the date |
| Hermes changelog and releases | Cited | PLANNED | Fetch live; compare with installed v0.21.1 |
| Hermes issues on headless, `-q`, `--yolo`, hooks, plugins, MCP | Cited | PLANNED | Fetch live |
| agentskills.io skill format | Cited | PLANNED | Compare with `skills/AGENTS.md` and this repo's `SKILL.md` format |
| `hermes_cli/model_catalog.py`, `models_reasoning_caps.py`, `provider_catalog.py`, `runtime_provider*.py`, `config_providers.py` | Cited | OK | Provider and reasoning sources for angle 2 |
<!-- /ANCHOR:meta -->
