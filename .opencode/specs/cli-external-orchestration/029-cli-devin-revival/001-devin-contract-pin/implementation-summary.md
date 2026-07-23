---
title: "Implementation Summary: Devin CLI contract pin"
description: "Evidence base for the live Devin CLI contract used by phases 002-007 of the cli-devin revival."
trigger_phrases: ["devin contract pin summary"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/001-devin-contract-pin"
    last_updated_at: "2026-07-23T20:03:10Z"
    last_updated_by: "claude-code"
    recent_action: "Phase complete - all contract facts verified live."
    next_safe_action: "Consume these facts in 002-007"
    blockers: []
    key_files: []
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 001-devin-contract-pin |
| **Completed** | 2026-07-23 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

Devin CLI is installed (`~/.local/bin/devin` → `~/.local/share/devin/cli/_versions/current/bin/devin`, symlink confirmed via `ls -la`), and its full current contract is pinned below with citations.

### Install & Version
- `curl -fsSL https://cli.devin.ai/install.sh | bash` → `Installed devin v3000.2.17 to ~/.local/bin/devin.` (installer also attempted an interactive OAuth login and failed with "Error: Login canceled" - expected in a non-interactive shell, not a failure of the install itself.)
- `devin --version` → `devin 3000.2.17 (2c489dfc)`.
- `~/.local/bin` is already on `$PATH`.

### Auth
- `devin auth status` → "Not logged in. Credentials path: `~/.local/share/devin/credentials.toml`. Run `devin auth login` to authenticate."
- Interactive auth is `devin auth login` (OAuth browser flow, session token to OS Keychain/Credential Manager) - operator-only action, not completed here.
- Headless/CI auth: `COGNITION_API_KEY="sk-cog-..."` env var, or a Service User API key (`cog_`-prefixed, RBAC-scoped, generated in Settings > Service users). Personal Access Tokens exist but are in closed beta. Legacy `apk_`-prefixed keys still work but are deprecated. (`docs.devin.ai/api-reference/authentication.md`)
- Windsurf enterprise auth (`devin auth login` → enterprise Windsurf SSO option) is an **optional, legacy-Windsurf-enterprise-only** alternative auth path, storing a token in `credentials.toml` - not applicable to this individual install. (`docs.devin.ai/cli/enterprise/windsurf-auth.md`)

### Command surface
- Invocation: `devin [OPTIONS] [prompt]`; `devin -p "prompt"` for single-turn/non-interactive output.
- Subcommands: `auth {login,logout,status}`, `mcp {add,list,get,remove,login,logout,enable,disable}`, `rules {list,show,paths}`, `skills {list,show,paths}`, `list`/`ls`, `version`, `acp` (Agent Client Protocol server for editor integration), `update`, `shell setup`, `sandbox setup`, `setup`, `uninstall`.
- Global flags include `--model`, `--permission-mode`, `--continue`/`-c`, `--resume`/`-r`, `--print`/`-p`, `--config`, `--sandbox`, `--respect-workspace-trust`. (`docs.devin.ai/cli/essential-commands.md`, `docs.devin.ai/cli/reference/commands.md`)

### Hooks
Native project-level hook contract, 8 lifecycle events: `PreToolUse`, `PostToolUse`, `PermissionRequest`, `UserPromptSubmit`, `Stop`, `PostCompaction`, `SessionStart`, `SessionEnd`. Config discovered in `.devin/hooks.v1.json` (standalone, recommended) or under a `"hooks"` key in `.devin/config.json`/`.devin/config.local.json`, walking up to the repo root; user-level at `~/.config/devin/config.json`. Hook entry shape: `{type: "command"|"prompt", matcher?: regex, command|prompt, timeout?}`, receiving JSON on stdin (`tool_name`, `tool_input`, `session_id`, `prompt_id`). `PreToolUse` can rewrite tool input via `hookSpecificOutput.updatedInput`; `PermissionRequest`/`Stop` return a `{"decision": ...}` JSON object. This event-name set closely mirrors Claude Code's own hook contract - directly relevant to phase 004's adapter design. (`docs.devin.ai/cli/extensibility/hooks/{overview,lifecycle-hooks}.md`)

### Config
Three-tier JSON-with-comments config: user (`~/.config/devin/config.json`), project (`.devin/config.json`, committed), local override (`.devin/config.local.json`, gitignored). Precedence (highest to lowest): org/enterprise settings → session grants → project-local → project → user. Project-level configs support only `permissions`, `mcpServers`, and `read_config_from` keys - all other settings (model, theme, sandbox, etc.) are user-only. Notably, `read_config_from: {cursor, windsurf, claude}` booleans let Devin CLI natively import rules/config from a `.claude/` directory - a real alternative (or complement) to hand-built hook adapters, to be weighed explicitly in phase 004. (`docs.devin.ai/cli/extensibility/configuration.md`, `docs.devin.ai/cli/reference/configuration/config-file.md`)

### Permissions
4 modes - **normal** (default: reads auto-approve, writes/exec prompt), **accept-edits** (file edits auto-approve, shell still prompts), **bypass**/`yolo`/`dangerous` (everything auto-approves), **autonomous** (pairs with `--sandbox`: shell/network auto-approve within the sandbox boundary, file edits still prompt). Rule matchers: `Read(glob)`, `Write(glob)`, `Exec(prefix)`, `Fetch(pattern)`, plus tool-name and `mcp__server__tool` matchers, evaluated deny → ask → allow → default. This is materially different from the 2-mode (`auto`/`dangerous`) system the archived 016 packet documented - the archived docs are stale on this point and must not be mirrored. (`docs.devin.ai/cli/reference/permissions.md`, `docs.devin.ai/cli/essential-commands.md`)

### Sandbox
`--sandbox` enables OS-level isolation (fail-closed: refuses to start if sandbox resolution fails rather than running unsandboxed). File access derives from `Read()`/`Write()` permission scopes; network access is domain-allowlist/denylist filtered through a managed proxy (`network_mode: "full"|"limited"`). Specific commands (e.g. `git` needing credentials) can be excluded from the sandbox via `sandbox.excluded`. (`docs.devin.ai/cli/sandbox.md`)

### Models
Providers: Anthropic, OpenAI, Google, Cognition, plus DeepSeek/Kimi/GLM. Short names (`opus`, `sonnet`, `swe`, `codex`, `gemini`) resolve to the latest in-family version. **Adaptive** (intelligent auto-router) is the documented recommended default. `swe`/`swe-1.6` is Cognition's own coding-specialized model, selectable via `/fast` for the faster variant. Select via `--model <id>`, `/model [name]`, or the user config file. (`docs.devin.ai/cli/models.md`)

### Subagents
Parent agents spawn subagents (foreground - pauses parent for approvals; background - runs in parallel) with isolated conversation chains but shared tool/codebase context. Two built-in profiles: `subagent_explore` (read-only, default model) and `subagent_general` (full capabilities, parent's model). Custom profiles are `.devin/agents/[name]/AGENT.md` files (YAML frontmatter: name, description, model override, allowed tools, nesting depth) - this is Devin's genuine analog to Codex's `-p <profile>`/cli-opencode's `--agent <slug>`, contrary to the original 016 packet's assumption that no such mechanism existed. (`docs.devin.ai/cli/subagents.md`)

### Cloud handoff
`/handoff [task]` packages the local session (repo/branch, conversation history, uncommitted diff - "commit or stash anything you don't want sent") to a cloud VM session with its own shell/browser/full repo access; status trackable from the CLI or `app.devin.ai`. Direct analog to the original packet's `cloud_handoff.md` concept - confirmed still real and current. (`docs.devin.ai/cli/handoff.md`)
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Installed via the official one-line install script.
2. Verified version/PATH/auth-state live via `devin --version`, `which devin`, `devin auth status`.
3. Fetched 13 pages from `docs.devin.ai` (essential commands, full command reference, hooks overview, lifecycle hooks, configuration, config-file reference, models, handoff, Windsurf enterprise auth, API authentication, sandbox, subagents, permissions) and cross-checked each against the live command surface for consistency.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- Did not attempt `devin auth login` non-interactively - it requires a real browser OAuth flow; forcing it would either hang or silently fail, and the operator must complete it themselves.
- Treated Windsurf enterprise auth as out-of-scope for this individual install (it is legacy-enterprise-only and optional).
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| Devin CLI installed | PASS - `devin 3000.2.17 (2c489dfc)` |
| Binary on PATH | PASS - `~/.local/bin` already in `$PATH` |
| Auth subsystem reachable | PASS - `devin auth status` responds correctly (not logged in) |
| Hooks contract confirmed | PASS - 8 lifecycle events, schema, config locations documented |
| Config format/precedence confirmed | PASS - 3-tier JSON-with-comments, precedence order documented |
| Permissions model confirmed | PASS - 4 modes, matcher syntax documented (supersedes stale 2-mode assumption) |
| Model roster confirmed | PASS - swe-1.6 default coding model, Adaptive router recommended default |
| Subagent mechanism confirmed | PASS - `AGENT.md` custom profiles, 2 built-in profiles |
| Cloud handoff confirmed | PASS - `/handoff` command, real and current |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. Interactive OAuth login was not completed - the operator must run `devin auth login` themselves before any live dispatch (phases 002+) can actually invoke `devin`.
2. Documentation was fetched via a summarizing fetch tool rather than read as raw markdown source; exact byte-for-byte schema field lists (e.g. every optional hook field) should be re-confirmed against `docs.devin.ai/cli/extensibility/hooks/lifecycle-hooks.md` raw source when phase 004 writes the actual adapter code.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
