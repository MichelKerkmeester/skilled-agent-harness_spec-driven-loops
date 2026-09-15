---
title: "Hermes CLI Unique Capabilities"
description: "Hermes surfaces with no sibling analog or a different shape: named toolsets, repo-local skills behind a trust grant, project plugins, the .hermes write guard, profiles, and the subsystems that stay off."
trigger_phrases:
  - "hermes toolsets"
  - "hermes project skills"
  - "hermes skills trust"
  - "hermes plugins"
  - "hermes write guard"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Hermes CLI Unique Capabilities

Reference for the Hermes surfaces that differ from `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor`, `cli-devin` and `cli-pi`. Everything here is source-read on v0.21.1 unless marked observed; the contract pin records the live checks.

---

## 1. OVERVIEW

### Core Principle

Hermes exposes more of its surface through named toolsets and user-level configuration than any sibling, and it reads a repo's `.hermes/` folder for exactly two things: skills and plugins. Knowing which is which decides what a dispatch may rely on and what stays an operator step.

---

## 2. TOOLSETS

`-t LIST` replaces the configured toolset roster for the run. Toolsets relevant to dispatch (from `toolsets.py`):

| Toolset | Carries | Leaf policy |
|---|---|---|
| `terminal` | Shell execution | Included for write leaves |
| `file` | `read_file`, `write_file`, `patch`, `search_files` | Always: it is the only toolset that reads files. A read-only leaf keeps it without `terminal`, and the repo plugin refuses the write tools under `SPECKIT_HERMES_READ_ONLY=1` |
| `search` | `web_search` only (no file search) | Never as a stand-in for file reading; `web` covers it when web search is allowed |
| `skills` | Skill loading and management | Included for write leaves |
| `todo` | Task list | Always |
| `web` | `web_search`, `web_extract` | Per the web-search policy: `live` and `inherit` include it, `disabled` omits it |
| `<mcp server name>` | Every enabled tool of that server | Named explicitly (for example `code_mode`) or the server is invisible to the run (observed 2026-09-14) |
| `delegation` | `delegate_task` sub-agents | **Never** for a leaf: it spawns agents outside the runner's boundary |
| `memory` | Memory read and write | **Never** for a leaf: it bleeds state across sessions |
| `clarify` | Asks the user a question | **Never** headless: nobody answers |
| `browser`, `vision`, `code_execution`, `computer_use` | Heavier surfaces | Off unless the task names them |

Hermes's stock roster enables `delegation` and `memory`, which is why every dispatch passes an explicit list.

---

## 3. REPO-LOCAL SKILLS

Hermes loads project skills from `./.hermes/skills` and `./.agents/skills`, resolved from the nearest project root, but only after `hermes skills trust` has recorded the root in `skills.trusted_project_dirs` of the **user-level** config. The repo cannot carry the grant.

- Every project skill directory is **scanned in full at session start** by Hermes's static scanner, and a symlinked directory is walked like a real one: observed 2026-09-14, the whole-tree link ran the scanner for over ten minutes and quarantined every hub, and a single linked skill directory (`cli-hermes`) was quarantined on 37 findings from its references and scripts. The repo therefore ships `.hermes/skills/<name>/SKILL.md` as generated markdown-only copies of all 56 canonical `SKILL.md` files (`sync-skills-hermes.cjs`), each naming its canonical directory; a session starts in about 17 seconds and `-s <name>` preloads any of them (verified live for `sk-git`, `cli-hermes` and `system-spec-kit`). `hermes skills list` shows no project rows either way.
- All 174 files pass Hermes's hard validator (name, description, body, name matches directory). Every description exceeds the 60-character listing budget and is truncated with an ellipsis; loading is unaffected, routing signal is.
- Never use per-file symlinks either: the scanner flags a symlink resolving outside a skill directory as a critical traversal, and quarantine is per skill directory and fail-closed. Seven of the 56 copies (`cli-cursor`, `cli-devin`, `cli-opencode`, `deep-research`, `mcp-aside-devtools`, `mcp-magicpath`, `sk-create-repo-rule`) are quarantined on prose patterns in their own text and stay reachable through `-s`; Hermes has no configuration knob for project-skill quarantine.
- No read-only command reports the project-skill load result; the proof is a live session with `-s <name>` quoting the skill.

---

## 4. PROJECT PLUGINS

Native plugins load from `~/.hermes/plugins/<name>/` and, opt-in through `HERMES_ENABLE_PROJECT_PLUGINS`, from `./.hermes/plugins/<name>/`, but only when the plugin's key is also listed under `plugins.enabled` in the user-level config; `hermes plugins enable` refuses a project key, so that line is added by hand (observed 2026-09-14). The plugin hook list covers `pre_tool_call`, `pre_verify`, `on_session_start`, `on_session_end`, `subagent_start`, `subagent_stop`, `pre_gateway_dispatch` and more (source-read: `hermes_cli/plugins.py`). This is the repo-carriable vehicle for the guard cores; see [hook-contract.md](./hook-contract.md).

---

## 5. THE `.hermes/` WRITE GUARD

Hermes's file tools treat any write whose immediate parent directory is `.hermes` as a protected-instruction write that requires approval (source-read: `tools/file_tools_write_guards.py`). A dispatched leaf therefore cannot author the repo's `.hermes/` files without `--yolo`, and those files are authored from outside Hermes.

---

## 6. PROFILES AND HOME

`--profile NAME` (or `-p`) sets `HERMES_HOME` before any module import, scoping config, `.env`, `auth.json`, sessions, memories, skills and logs to that home. Profiles are independent islands: a fresh one holds no credentials. The fan-out never sets a profile; shared home plus `--ignore-rules` is the posture until a seeded-credential contract exists.

---

## 7. SUBSYSTEMS THAT STAY OFF

The curator, gateway, cron, kanban, voice and desktop subsystems are off by default and `chat` spawns none of them. `hermes pause` stops cron, kanban and gateway turns only, not a CLI dispatch. Telemetry is opt-in. Startup for `hermes --version` measured 0.86 seconds on this machine, a lower bound for a real dispatch.

---

## 8. WHAT HERMES CANNOT CARRY IN THE REPO

Config (`config.yaml`), shell hooks and their consent allowlist, MCP servers (`mcp_servers:`), the provider block and the trust grant. Each is an operator step documented in this packet; a dispatch never performs one.
