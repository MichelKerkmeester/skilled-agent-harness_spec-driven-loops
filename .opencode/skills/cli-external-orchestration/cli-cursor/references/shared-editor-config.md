---
title: "Cursor CLI Shared Editor Config Surface"
description: "Cursor CLI shares its entire config surface with the Cursor editor — project and user scope, precedence, and the dispatch-isolation implications for orchestrated delegation."
trigger_phrases:
  - "cursor shared config"
  - "cursor editor config"
  - "cursor cli-config.json"
  - "cursor workspace isolation"
  - "cursor mcp.json hooks.json rules"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Cursor CLI Shared Editor Config Surface

<!-- sk-doc-template: skill_reference -->

---

## 1. OVERVIEW

### Core Principle

Every sibling CLI in this hub keeps a tool-private config namespace: Codex reads `.codex/`, Claude Code reads `.claude/`, OpenCode reads `.opencode/`. **Cursor CLI is the one exception.** It reads the exact same config files the Cursor **editor** reads — there is no CLI-private config directory. This is the single biggest architectural difference between `cli-cursor` and its siblings, and it shapes both this packet's hook-adapter design (`004-cursor-hook-adapter-layer`, a later phase) and any dispatch-isolation decision.

### Why This Matters for Orchestrated Delegation

A dispatched `cursor-agent -p` session run by this packet silently inherits whatever hooks, MCP servers, and rules the operator's Cursor editor already has configured on this machine — because they are, literally, the same files. An orchestrator expecting a clean, isolated CLI session (the assumption every sibling CLI safely supports) will be surprised here unless this surface is understood up front.

---

## 2. DIRECTORY LAYOUT

### Project Scope: `<repo-root>/.cursor/`

| File | Purpose |
|---|---|
| `mcp.json` | MCP server configuration |
| `hooks.json` | Hook registrations (see `hook-contract.md`) |
| `rules/` | Project-level rule files, read automatically |
| `worktrees.json` | Setup scripts for native worktree isolation (`-w`) |

### User Scope: `~/.cursor/`

| File/dir | Purpose |
|---|---|
| `mcp.json` | User-level MCP server configuration |
| `hooks.json` | User-level hook registrations |
| `plugins/` | Installed plugins (see `cursor-tools.md`) |
| `skills-cursor/` | Cursor's own skill/subagent system |
| `cli-config.json` | CLI-specific settings: `version`, `editor`, `hasChangedDefaultModel`, `permissions`, `approvalMode`, `sandbox`, `network` (key names confirmed live; values were never read, to avoid surfacing stored auth material) |
| `worktrees/<reponame>/<name>/` | Native worktree checkouts (`-w`) |

### Precedence

`"project → global → nested"` — a project-scoped file overrides a global (user-scoped) one, and a more deeply nested config overrides a less-nested one, matching the discovery order documented in `hook-contract.md` §3 for hooks specifically.

---

## 3. RULE SOURCES (READ AUTOMATICALLY)

Beyond `.cursor/rules`, Cursor CLI also reads project-root `AGENTS.md`, project-root `CLAUDE.md`, and legacy `.cursorrules` — all automatically, with no flag required. This repo already has an `AGENTS.md` at its root; a `cursor-agent` dispatch run here would apply it as rules without any extra configuration. This is a genuine convenience (no duplicate context injection needed, unlike a CLI that requires an explicit `@file` or context-file reference) but also means the delegation prompt does not need to (and should not) re-paste `AGENTS.md` content — see `SKILL.md` rule 11.

---

## 4. DISPATCH-ISOLATION IMPLICATIONS

### The Core Tension

Every sibling CLI's dispatch is, by construction, isolated from the operator's own interactive sessions with that same tool — a dispatched `codex exec` does not inherit the operator's interactively-configured Codex TUI state in any surprising way, because Codex's config is itself scoped per-invocation via `-c` overrides and `--profile`. Cursor's shared-with-the-editor surface breaks that assumption: a dispatched `cursor-agent -p` and the operator's own open Cursor editor window read literally the same `hooks.json`/`mcp.json`/rules.

### Confirmed Mitigations Available

| Flag | Effect | Confirmed |
|---|---|---|
| `--workspace <path>` | Sets the workspace root explicitly | Yes, documented in `--help` |
| `--add-dir <path>` | Adds an additional accessible directory | Yes, documented in `--help` |
| `--plugin-dir <path>` | Adds a plugin search directory, separate from the default `~/.cursor/plugins/` | Yes, documented in `--help` |

### Open Question — Not Yet Resolved

Whether a dispatched `cursor-agent` should carry an explicit `--workspace`/config-isolation flag combination so it does not silently inherit the operator's shared `~/.cursor/` hooks/MCP/rules is an open question, deferred to the dispatch-command finalization (tracked in `030-cli-cursor-creation/spec.md` §4 and this phase's own `spec.md` §12). This reference documents the mitigation flags that exist; it does not assert a specific isolation policy has been decided or implemented, because none has as of this packet's authoring.

---

## 5. PRACTICAL GUIDANCE FOR THIS PACKET'S DELEGATIONS

1. **Assume shared state by default.** Do not assume a dispatched `cursor-agent -p` session starts from a clean slate the way a dispatched `codex exec` or `claude -p` does.
2. **Do not silently rely on the operator's hooks firing.** Since hook delivery under the CLI is not yet confirmed per-event (`hook-contract.md` §7), never assume a shared hook will guard a dispatch the way it might guard the operator's interactive editor session.
3. **Do not re-inject `AGENTS.md`/`CLAUDE.md` content into delegation prompts.** Cursor CLI already reads them automatically; duplicating that content wastes tokens and risks drift between the injected copy and the live file.
4. **Treat MCP servers as shared, not dispatch-scoped.** A dispatched task using `--approve-mcps` approves whatever is configured in the (shared) `mcp.json` — the operator's editor session and this packet's dispatch draw from the same server list.

---

## 6. COMPARISON WITH SIBLING CLIS

| Aspect | `cli-codex` | `cli-claude-code` | `cli-opencode` | `cli-cursor` |
|---|---|---|---|---|
| Config directory | `.codex/` (tool-private) | `.claude/` (tool-private) | `.opencode/` (tool-private) | `.cursor/`/`~/.cursor/` (shared with editor) |
| Hooks shared with an editor product? | No | No | No | **Yes** — identical files |
| MCP config shared with an editor product? | No | No | No | **Yes** — identical files |
| Per-dispatch config isolation | `-c` overrides + `--profile` scope the invocation | `CLAUDE_CONFIG_DIR` env override | `--dir`/home env override | `--workspace`/`--add-dir`/`--plugin-dir` (narrower than a full config-dir override) |

This table exists to make the asymmetry legible at a glance: every sibling CLI's dispatch isolation story is "point it at a different config directory." Cursor's is "there is one config surface, and you can widen or narrow what the dispatch sees, but you cannot fully redirect it to an alternate config root the way `CLAUDE_CONFIG_DIR` does."

---

## 7. TROUBLESHOOTING SURPRISES TRACED TO THE SHARED SURFACE

| Symptom | Root cause | Where to look |
|---|---|---|
| A dispatch behaves differently than an identical prompt did yesterday | The operator changed `~/.cursor/cli-config.json` (`permissions`/`approvalMode`/`sandbox`) through the editor, and the CLI picked it up | `~/.cursor/cli-config.json` |
| An unexpected hook fires during an orchestrated dispatch | A hook registered for the operator's interactive editor sessions also matches the CLI's event stream | `.cursor/hooks.json` / `~/.cursor/hooks.json` — see `hook-contract.md` |
| A dispatch has access to an MCP server nobody configured for this task | The server was configured for the operator's editor sessions and is shared | `.cursor/mcp.json` / `~/.cursor/mcp.json` |
| A dispatch applies a rule the delegation prompt never mentioned | `.cursor/rules`, `AGENTS.md`, `CLAUDE.md`, or `.cursorrules` applied automatically | §3 above |
| Model roster looks different across two machines | `~/.cursor/cli-config.json`'s `hasChangedDefaultModel` and account-level settings differ per machine/account | `cursor-agent about` / `--list-models` |

Each of these is expected, documented behavior once this reference is read — not a bug in `cli-cursor`'s dispatch adapter. Attribute a surprising dispatch outcome here before assuming the adapter itself misbehaved.
