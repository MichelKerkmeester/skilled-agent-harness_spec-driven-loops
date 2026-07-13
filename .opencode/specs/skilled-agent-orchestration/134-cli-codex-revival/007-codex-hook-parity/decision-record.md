---
title: "Decision Record: Codex hook/plugin parity"
description: "Architecture decisions from the Codex 0.144.2 capability spike: pinned hook contract, direct-core adapters, blocking semantics, install location, and honest non-portable scope."
trigger_phrases: ["Codex hook decisions", "codex parity ADR", "codex 0.144.2 hook contract"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/007-codex-hook-parity"
    last_updated_at: "2026-07-13T17:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the five capability-spike decisions"
    next_safe_action: "Implement the eight portable Codex guard adapters"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Codex hook/plugin parity
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Pin the Codex 0.144.2 native hook contract
<!-- ANCHOR:adr-001-context -->
### Context
Child 004 left two questions open: which hook events and tool matchers Codex accepts, and whether Codex can block a tool. The prior contract doc was written against Codex 0.130.0. The installed binary is `codex-cli 0.144.2` at `/opt/homebrew/bin/codex`, resolving to `/opt/homebrew/Caskroom/codex/0.144.2/codex-aarch64-apple-darwin`.
<!-- /ANCHOR:adr-001-context -->
<!-- ANCHOR:adr-001-decision -->
### Decision
Pin the contract empirically from the binary's embedded schema plus a live probe:
- **Event enum** (`ManagedHooksRequirements`): `SessionStart, UserPromptSubmit, PreToolUse, PermissionRequest, PostToolUse, PreCompact, PostCompact, SubagentStart, SubagentStop, Stop`. `SessionEnd` is NOT a hook event (only an internal `flushTranscriptTailOnSessionEnd` knob).
- **Output schema is Claude-shaped**: the binary carries `hookSpecificOutput`, `permissionDecision`, `permissionDecisionReason`, `additionalContext`, and the enum tokens `allow`/`deny`/`ask`/`block`, plus `continue`/`stopReason`/`systemMessage`/`suppressOutput`.
- **Tool vocabulary**: `exec` (shell), `apply_patch`/`edit` (file writes). No `Task` tool; no `mcp__claude_ai_*` surface.
- **Input**: snake_case JSON on stdin (`hook_event_name`, `tool_name`, `tool_input`, `cwd`, `session_id`, `prompt`), Claude-shaped.
- **Runtime discovery**: Codex reads `~/.codex/hooks.json` (user-global). A live probe with a project-level `<cwd>/.codex/hooks.json` produced no hook firings, confirming project-level files are inert. `[features] hooks = true` is already set in `~/.codex/config.toml`.
<!-- /ANCHOR:adr-001-decision -->
<!-- ANCHOR:adr-001-alternatives -->
### Alternatives
Trust the stale 0.130.0 contract doc (rejected: wrong version, missing events). Trust vendored `codex-rs` notes that claim no `SubagentStop` (rejected: contradicted by the installed 0.144.2 binary, which contains `SubagentStart`/`SubagentStop`).
<!-- /ANCHOR:adr-001-alternatives -->
<!-- ANCHOR:adr-001-consequences -->
### Consequences
Adapters can reuse the Claude output envelope directly. Deny is available. `SessionEnd` cleanup must fold into `Stop`. Wiring must target `~/.codex/hooks.json`, not the repo file.
<!-- /ANCHOR:adr-001-consequences -->
<!-- ANCHOR:adr-001-five-checks -->
### Five Checks
Clarity: contract is a table, not prose. Systems: touches every Codex session. Bias: verified the installed binary, not docs. Sustainability: pinned to a specific version. Value: unblocks all adapter work.
<!-- /ANCHOR:adr-001-five-checks -->
<!-- ANCHOR:adr-001-impl -->
### Implementation Notes
Behavioral deny confirmation is folded into the Phase 5 live matrix; schema presence already settles capability.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: Codex guard adapters call the neutral core directly
<!-- ANCHOR:adr-002-context -->
### Context
Every guard hook is a thin adapter over a runtime-neutral core already dual-consumed by the Claude hook and an OpenCode plugin. The lifecycle codex adapters in `mcp_server/hooks/codex/` instead delegate to the compiled Claude adapter via `runClaudeHookAdapter`.
<!-- /ANCHOR:adr-002-context -->
<!-- ANCHOR:adr-002-decision -->
### Decision
New per-skill Codex guard adapters call the neutral core directly, as a third consumer, mirroring the OpenCode plugin pattern. They live as siblings of the Claude adapter at `<skill>/runtime/hooks/codex/<hook>.{mjs,cjs}`.
<!-- /ANCHOR:adr-002-decision -->
<!-- ANCHOR:adr-002-alternatives -->
### Alternatives
Delegate to the Claude adapter (rejected: `runClaudeHookAdapter` resolves only `../claude/<name>.js` and cannot reach per-skill hooks; adds a double spawn). Extract a new shared helper (rejected: the Claude siblings inline their own stdin/emit, so matching that keeps each skill self-contained).
<!-- /ANCHOR:adr-002-alternatives -->
<!-- ANCHOR:adr-002-consequences -->
### Consequences
No change to cores or to the lifecycle delegation model. Each adapter is ~15-25 lines. Adapters are plain `.mjs`/`.cjs` (no TS build).
<!-- /ANCHOR:adr-002-consequences -->
<!-- ANCHOR:adr-002-five-checks -->
### Five Checks
Clarity: one file per guard. Systems: cores untouched. Bias: reuses proven code. Sustainability: same pattern as two existing runtimes. Value: minimal new surface.
<!-- /ANCHOR:adr-002-five-checks -->
<!-- ANCHOR:adr-002-impl -->
### Implementation Notes
Normalize Codex tool-name casing (`exec`, `apply_patch`, `edit`) to what each core expects before calling it.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

<!-- ANCHOR:adr-003 -->
## ADR-003: Deny-capable guards block under Codex
<!-- ANCHOR:adr-003-context -->
### Context
spec-gate-enforce and dispatch-preflight-lint block under Claude via `permissionDecision: deny`. Whether Codex honors that was the make-or-break unknown.
<!-- /ANCHOR:adr-003-context -->
<!-- ANCHOR:adr-003-decision -->
### Decision
Emit the same `hookSpecificOutput.permissionDecision: deny` envelope on PreToolUse. Capability is confirmed by the binary schema (deny/allow/ask/block + permissionDecision tokens present); behavioral confirmation runs in Phase 5.
<!-- /ANCHOR:adr-003-decision -->
<!-- ANCHOR:adr-003-alternatives -->
### Alternatives
Degrade all guards to advisory (rejected: loses the safety property the guard exists for, and the binary shows deny is supported). Use exit-code-2 blocking (correct for UserPromptSubmit only; PreToolUse uses the JSON envelope).
<!-- /ANCHOR:adr-003-alternatives -->
<!-- ANCHOR:adr-003-consequences -->
### Consequences
If a future Codex version drops deny, the adapters still fail open (advisory), so the failure mode is safe. No core change is required for the deny path.
<!-- /ANCHOR:adr-003-consequences -->
<!-- ANCHOR:adr-003-five-checks -->
### Five Checks
Clarity: single envelope. Systems: affects tool approval flow. Bias: schema-verified. Sustainability: same envelope as Claude. Value: preserves the guard's purpose.
<!-- /ANCHOR:adr-003-five-checks -->
<!-- ANCHOR:adr-003-impl -->
### Implementation Notes
Advisory guards keep emitting only `additionalContext`; only the two block-capable guards emit deny.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

<!-- ANCHOR:adr-004 -->
## ADR-004: Versioned repo source plus an installer into the user-global hooks file
<!-- ANCHOR:adr-004-context -->
### Context
Codex reads `~/.codex/hooks.json`, which is user-global, carries Superset `notify.sh` entries, and is currently stale (Stop routes only to notify.sh; no PreCompact). The repo `.codex/hooks.json` is versioned but inert at runtime. No installer exists.
<!-- /ANCHOR:adr-004-context -->
<!-- ANCHOR:adr-004-decision -->
### Decision
Keep repo `.codex/hooks.json` as the versioned source-of-truth and add an idempotent installer `.opencode/bin/install-codex-hooks.mjs` that backs up and merges the repo set into `~/.codex/hooks.json`, preserving existing Superset and user entries.
<!-- /ANCHOR:adr-004-decision -->
<!-- ANCHOR:adr-004-alternatives -->
### Alternatives
Edit `~/.codex/hooks.json` by hand only (rejected: not portable or reproducible). Maintain the repo file only (rejected: never runs). Rely on project-level discovery (rejected: the live probe proved it inert).
<!-- /ANCHOR:adr-004-alternatives -->
<!-- ANCHOR:adr-004-consequences -->
### Consequences
The installer is the one write outside the repo. It is backed up (`.bak-<ts>`) and revertible. Portable to any machine.
<!-- /ANCHOR:adr-004-consequences -->
<!-- ANCHOR:adr-004-five-checks -->
### Five Checks
Clarity: source plus installer. Systems: writes user config. Bias: merge, never replace. Sustainability: reproducible. Value: makes parity actually run.
<!-- /ANCHOR:adr-004-five-checks -->
<!-- ANCHOR:adr-004-impl -->
### Implementation Notes
Merge by event key; append the repo command entries alongside preserved entries; dedupe on identical command strings so re-runs are idempotent.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

<!-- ANCHOR:adr-005 -->
## ADR-005: Honest handling of non-portable guards and SessionEnd
<!-- ANCHOR:adr-005-context -->
### Context
Two Claude guards protect surfaces Codex lacks: mcp-route-guard matches `mcp__claude_ai_*` and task-dispatch-guard matches the in-session `Task` tool. Codex has neither; it dispatches agents via `codex exec -p` on the shell surface. `SessionEnd` is not a Codex hook event.
<!-- /ANCHOR:adr-005-context -->
<!-- ANCHOR:adr-005-decision -->
### Decision
Route-guard: ship a Codex PreToolUse adapter reusing the core unchanged with a `mcp__.*` matcher, and document that it is dormant because Codex's three registered MCP servers are internal (`mk_`-prefixed) and thus core-exempt. Task-dispatch: fold detection into the exec command-shape recognizer (recognize `codex exec -p`) rather than a Task hook. SessionEnd cleanup folds into the Stop event.
<!-- /ANCHOR:adr-005-decision -->
<!-- ANCHOR:adr-005-alternatives -->
### Alternatives
Fabricate a Task/SubagentStop hook (rejected: no such live surface to guard). Omit route-guard entirely (rejected: wiring it dormant is correct for when an external MCP family is later registered).
<!-- /ANCHOR:adr-005-alternatives -->
<!-- ANCHOR:adr-005-consequences -->
### Consequences
No dead or fabricated hooks. `.codex/config.toml` still defines no `[profiles.*]`, so `codex exec -p` dispatch is itself non-functional today; noted as an out-of-scope follow-up.
<!-- /ANCHOR:adr-005-consequences -->
<!-- ANCHOR:adr-005-five-checks -->
### Five Checks
Clarity: states what is dormant. Systems: matches real surfaces. Bias: no faking. Sustainability: activates when external MCP arrives. Value: honest coverage map.
<!-- /ANCHOR:adr-005-five-checks -->
<!-- ANCHOR:adr-005-impl -->
### Implementation Notes
The exec command-shape recognizer extension lives in the Codex dispatch adapter, keeping the shared dispatch cores unchanged.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->
