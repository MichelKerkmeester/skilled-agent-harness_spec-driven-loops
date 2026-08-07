---
title: "Implementation Summary: Cursor CLI contract pin"
description: "Evidence base for the live Cursor CLI contract used by phases 002-007 of the cli-cursor creation."
trigger_phrases: ["cursor cli contract pin summary"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/001-cursor-contract-pin"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Phase complete - all contract facts verified live"
    next_safe_action: "Consume these facts in 002-007"
    blockers: []
    key_files: []
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
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
| **Spec Folder** | 001-cursor-contract-pin |
| **Completed** | 2026-07-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

Cursor CLI is installed (`~/.local/bin/cursor-agent` and `~/.local/bin/agent`, both symlinks into `~/.local/share/cursor-agent/versions/2026.07.23-e383d2b/cursor-agent`, confirmed via `ls -la`), and its full current contract is pinned below with citations.

### Install & Version
- `curl https://cursor.com/install -fsS | bash` → "Installation Complete!" downloading `agent-cli-package.tar.gz` for `darwin/arm64` from `downloads.cursor.com/lab/2026.07.23-e383d2b/...`. Windows install path (per docs): `irm 'https://cursor.com/install?win32=true' | iex`.
- `cursor-agent --version` → `2026.07.23-e383d2b`.
- **Binary name**: canonical is `cursor-agent`; `agent` is an alias symlink to the same binary (both resolve via `which`). `cursor.com/docs` prose uses `agent`; the installed on-PATH canonical name is `cursor-agent`. Later phases must probe `command -v cursor-agent`. (`cursor.com/docs/cli/overview`, live `which`/`ls -la`)
- `~/.local/bin` is already on `$PATH`.

### Auth
- `cursor-agent about` → "User Email: Not logged in"; `cursor-agent models`/`--list-models`/`-p` all return `Error: Authentication required. Run 'agent login', pass --api-key/--auth-token, or set CURSOR_API_KEY/CURSOR_AUTH_TOKEN.` (`status` alone printed a misleading cached "Login successful", but `about` and every account-scoped call confirm this machine is not authenticated.)
- Interactive auth is `cursor-agent login` (OAuth browser flow; `NO_OPEN_BROWSER` disables browser opening) - operator-only action, not completed here.
- Headless/CI auth: `CURSOR_API_KEY` env var, `CURSOR_AUTH_TOKEN` env var, `--api-key <key>`, or `--auth-token`. Endpoint override via `--endpoint`/`CURSOR_API_ENDPOINT` (default `https://api2.cursor.sh`); custom headers via `-H/--header`. (`cursor-agent --help`)

### Command surface
- Invocation: `agent [options] [command] [prompt...]`; `cursor-agent -p "prompt"` for non-interactive/print output.
- Subcommands: `login`, `logout`, `mcp` (`login`/`list`/`list-tools`/`enable`/`disable`), `plugin` (`marketplace`), `worker`, `status`/`whoami`, `models`, `about`, `install-shell-integration`, `uninstall-shell-integration`.
- Global flags include `-p`/`--print`, `--output-format text|json|stream-json`, `--stream-partial-output`, `--mode plan|ask` (plus `--plan` shorthand), `--model`, `--list-models`, `-f`/`--force`, `--yolo`, `--auto-review`, `--sandbox enabled|disabled`, `--approve-mcps`, `--trust`, `--resume [chatId]`, `--continue`, `--workspace`, `--add-dir`, `--plugin-dir`, `-w`/`--worktree [name]`, `--worktree-base`, `--skip-worktree-setup`, `--api-key`, `--auth-token`, `-H`/`--header`, `-e`/`--endpoint`. (`cursor-agent --help`)

### Non-interactive dispatch
- `cursor-agent -p "<prompt>"` runs headless with access to all tools (write + shell). `--output-format` = `text` (default, final-answer-only), `json` (structured), or `stream-json` (message-level progress; pairs with `--stream-partial-output` for text deltas). Execution modes: default agent, `--mode plan` (read-only planning), `--mode ask` (read-only Q&A). (`cursor-agent --help`, `cursor.com/docs/cli/headless`)
- **Fail-closed evidence**: `cursor-agent -p --output-format text "say hi"` without account auth returns `Error: Authentication required...` and does not reach a model. Note the process exited `0` on this auth error, so an executor guard must key on `command -v cursor-agent` + auth state, not exit code. (live)

### Hooks
Native Cursor 1.7+ hook system, **shared with the Cursor editor**. Config file: `hooks.json`. Schema:
```json
{ "version": 1, "hooks": { "<event>": [ { "command": "./path/to/script.sh", "timeout": 30, "type": "command", "matcher": "pattern", "loop_limit": 5, "failClosed": false } ] } }
```
Command-based hooks return `{ "permission": "allow|deny|ask", "user_message": "...", "agent_message": "..." }`; exit code `0` succeeds, exit code `2` blocks the action. Discovery order (highest → lowest): enterprise (`/Library/Application Support/Cursor/hooks.json` on macOS, `/etc/cursor/hooks.json` on Linux/WSL, `C:\ProgramData\Cursor\hooks.json`), team (Enterprise dashboard), project (`<project-root>/.cursor/hooks.json`), user (`~/.cursor/hooks.json`). Documented agent event names: `sessionStart`, `sessionEnd`, `preToolUse`, `postToolUse`, `postToolUseFailure`, `subagentStart`, `subagentStop`, `beforeShellExecution`, `afterShellExecution`, `beforeMCPExecution`, `afterMCPExecution`, `beforeReadFile`, `afterFileEdit`, `beforeSubmitPrompt`, `preCompact`, `stop`, `afterAgentResponse`, `afterAgentThought` (plus Tab-completion and `workspaceOpen` app-lifecycle events). The live `~/.cursor/hooks.json` on this machine uses `beforeSubmitPrompt`/`stop`/`beforeShellExecution`/`beforeMCPExecution`/`sessionStart`/`sessionEnd`, each mapping to a `{ "command": "..." }` entry - confirming the schema shape live. **Caveat (community-reported)**: the Cursor *CLI* may not deliver every event defined in `hooks.json` (an editor-vs-CLI parity gap); per-event delivery must be live-verified at phase 004, not assumed. (`cursor.com/docs/hooks`, live `~/.cursor/hooks.json`, `forum.cursor.com` CLI-hooks report)

### Config (shared with the editor)
Unlike Devin's tool-private `.devin/` or Codex's `.codex/`, the Cursor CLI **shares its entire config surface with the Cursor editor**. Project scope: `<root>/.cursor/` (`mcp.json`, `hooks.json`, `rules/`, `worktrees.json`); user scope: `~/.cursor/` (`mcp.json`, `hooks.json`, `plugins/`, `skills-cursor/`, and the CLI-specific `~/.cursor/cli-config.json`). `~/.cursor/cli-config.json` keys observed live: `version`, `editor`, `hasChangedDefaultModel`, `permissions`, `approvalMode`, `sandbox`, `network`. Precedence follows "project → global → nested". This shared surface is the single biggest architectural difference from the sibling CLIs and shapes phases 003/004. (`cursor.com/docs/cli/mcp`, `cursor.com/docs/cli/using`, live `ls ~/.cursor`)

### Rules
Rule sources the CLI reads: `.cursor/rules` (directory), `AGENTS.md` (project root), `CLAUDE.md` (project root), and legacy `.cursorrules`. This repo already contains an `AGENTS.md` at its root (46 KB), which the Cursor CLI would apply as rules if run here — relevant to phase 007's governance review. (`cursor.com/docs/cli/using`, live `ls`)

### Permissions & sandbox
Default behavior prompts (`y`/`n`) before terminal commands. `-f`/`--force` (alias `--yolo`, "Run Everything") auto-approves unless explicitly denied; `--auto-review` ("Smart Auto") uses a server-side classifier that auto-runs safe tool calls and prompts for the rest; `--sandbox enabled|disabled` toggles OS-level sandbox (overriding config); `--trust` trusts the workspace without prompting; `--approve-mcps` auto-approves all MCP servers. Permission config lives in `~/.cursor/cli-config.json` (`permissions`, `approvalMode`, `sandbox`, `network` keys). (`cursor-agent --help`, `cursor.com/docs/cli/overview`)

### Models
`Auto` is the default (intelligent router). Selection via `--model <model>` (e.g. `gpt-5`, `sonnet-4-thinking`, or parameterized `claude-opus-4-8[context=1m,effort=high,fast=false]`), `/model`, or user config. The `cursor.com/cli` product page shows Composer 2.5 (Cursor-native), Opus 4.8, GPT-5.6, Gemini 3.1 Pro, Grok 4.5, and Auto. **Composer** is Cursor's own model — the analog to Devin's `swe-1.6`/Cognition-native. **Live roster enumeration is auth-gated**: `cursor-agent models`/`--list-models` both require account auth, which this machine lacks — the exact per-account id list is TBD, verify at implementation time. (`cursor-agent --help`, `cursor.com/cli`)

### MCP
`cursor-agent mcp` subcommands: `login <id>`, `list`, `list-tools <id>`, `enable <id>`, `disable <id>`. Config file: `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (user) — "the CLI uses the same configuration as the editor", precedence "project → global → nested". `--approve-mcps` auto-approves all servers. The CLI is an MCP *client* (discovers/uses configured servers); no documented mode of it acting as an MCP server itself. (`cursor-agent mcp --help`, `cursor.com/docs/cli/mcp`)

### Cursor-unique surfaces (no sibling analog)
- **Native git worktree isolation**: `-w`/`--worktree [name]` starts in an isolated git worktree at `~/.cursor/worktrees/<reponame>/<name>`; `--worktree-base <branch>` sets the base ref; `--skip-worktree-setup` skips setup scripts declared in `.cursor/worktrees.json`. No `cli-codex`/`cli-claude-code`/`cli-opencode`/`cli-devin` analog. Interacts with this repo's own sk-git numbered-worktree discipline — a documented caveat for phase 003/007. (`cursor-agent --help`)
- **Cloud `worker`**: `cursor-agent worker` runs a private cloud worker connecting to Cursor to run agents in your environment, with Kubernetes health probes (`GET /healthz`, `/readyz`), Prometheus `/metrics`, pool vs. shared assignment (`--pool`/`--pool-name`), labels, and `--auth-token-file` for operator-managed secret mounts. This is infra-grade remote execution, a very different shape from Devin's session-level `/handoff`. (`cursor-agent worker --help`)
- **Plugins**: `cursor-agent plugin marketplace` manages plugins and plugin marketplaces (`~/.cursor/plugins/`). No sibling analog. (`cursor-agent plugin --help`, live `ls`)
- **Cursor skills**: `~/.cursor/skills-cursor/` holds Cursor's own skill system (observed live: `automate`, `babysit`, `canvas`, `create-hook`, `create-rule`, `create-skill`, `create-subagent`, `loop`, `migrate-to-skills`, `sdk`, `shell`, `split-to-prs`, `statusline`, `update-cli-config`, `update-cursor-settings`). Confirms Cursor supports subagents (`create-subagent`) and rules/hooks authoring natively. (live `ls`)
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Installed via the official one-line install script (`curl https://cursor.com/install -fsS | bash`).
2. Verified binary name/build/PATH/auth-state live via `which cursor-agent`/`which agent`, `ls -la ~/.local/bin`, `cursor-agent --version`, `about`, `status`, and a fail-closed `-p` dispatch.
3. Captured `--help` for the top-level command plus `mcp`, `plugin`, and `worker` subcommands.
4. Fetched `cursor.com/cli`, `cursor.com/docs/cli/{overview,headless,using,mcp}`, and `cursor.com/docs/hooks`, cross-checking each against the live command surface and the local `~/.cursor/` config files.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- Did not attempt `cursor-agent login` non-interactively - it requires a real browser OAuth flow; the operator must complete it before any live billed dispatch (phases 002+) can actually reach a model.
- Read `~/.cursor/cli-config.json` for its key names only (never its values), to avoid surfacing any stored auth material into the spec.
- Recorded the live model roster shape from `--help`/product page but marked exact per-account enumeration TBD rather than fabricating an id list from IDE-era knowledge.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| Cursor CLI installed | PASS - `cursor-agent 2026.07.23-e383d2b` |
| Canonical binary name | PASS - `cursor-agent` (with `agent` alias symlink) |
| Binary on PATH | PASS - `~/.local/bin` already in `$PATH` |
| Non-interactive dispatch surface | PASS - `-p`/`--output-format`/`--mode`/`--model` confirmed via `--help` |
| Fail-closed without auth | PASS - `-p` returns `Error: Authentication required` (exit 0; guard must not key on exit code) |
| Auth subsystem reachable | PASS - `about`/`status` respond; headless env-var paths documented |
| Hooks contract confirmed | PASS - schema + events + discovery + response envelope, cross-checked against live `~/.cursor/hooks.json` |
| Shared config surface confirmed | PASS - `.cursor/`/`~/.cursor/` shared with editor + `~/.cursor/cli-config.json` keys |
| Permission/sandbox model confirmed | PASS - `--force`/`--yolo`/`--auto-review`/`--sandbox`/`--trust` |
| Model roster shape confirmed | PASS (shape) / TBD (live enumeration auth-gated) - Composer native + hosted frontier + Auto router |
| Unique surfaces confirmed | PASS - worktree (`-w`), `worker`, `plugin marketplace`, Cursor skills |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. This machine is not authenticated for account-scoped calls, so the exact live model roster could not be enumerated (`cursor-agent models` requires auth). Recorded as TBD; verify at implementation time once the operator completes `cursor-agent login`.
2. Whether the Cursor CLI (vs. the editor) fires every `hooks.json` event is a community-reported parity gap - phase 004 must live-verify per-event delivery against the installed binary before relying on any adapter firing.
3. Documentation was fetched via a summarizing fetch tool rather than read as raw markdown source; exact byte-for-byte schema fields (e.g. every optional hook field, the exact `worktrees.json` setup-script schema) should be re-confirmed against raw docs when the phase that depends on them is implemented.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
