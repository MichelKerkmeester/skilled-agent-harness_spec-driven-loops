---
title: "Cursor CLI Hooks And Spec-Gate Integration"
description: "Current-state reference for cli-cursor's shared Cursor hook surface and Gate-3 spec-gate adapters, including confirmed, dormant, and explicitly unreviewed paths."
trigger_phrases:
  - "Cursor CLI Hooks And Spec-Gate Integration"
  - "cli-cursor hook adapters"
  - "Cursor preToolUse spec gate"
  - "Cursor hooks.json shared configuration"
version: 1.3.0.0
---

# Cursor CLI Hooks And Spec-Gate Integration (cli-cursor)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`cli-cursor` uses one hook/spec-gate surface for session lifecycle events and tool-call mutation policy. The confirmed event paths normalize Cursor payloads, delegate session work to existing adapters or the shared spec-gate core, and return Cursor-native permission responses where the event supports them.

Cursor CLI and the Cursor desktop editor read the same `.cursor/hooks.json` configuration. That makes hook registration a shared-surface change: the live event mapping is documented here, while the adapter statuses below distinguish confirmed behavior from the dormant prompt-classification path and the explicitly unreviewed prebind design.

---

## 2. HOW IT WORKS

### Event Surface

Live `cursor-agent -p` dispatches confirm that `sessionStart` fires and is handled by `session-start.ts`, `sessionEnd` fires and is handled by `session-end.ts`, and `preToolUse` fires before Cursor tool calls. The session adapters delegate to the existing session-prime and session-stop implementations. The enforce adapter observes the generic pre-tool event, including `Shell`, `Read`, `Grep`, and `Write` calls.

### Gate-3 Enforcement And Classification

`spec-gate-enforce.mjs` maps Cursor's `Shell` and `Write` tools to the shared mutation policy. Its deny path returns `permission: "deny"` and exits with code 2; live verification confirmed that this blocked the real tool call. `spec-gate-classify.mjs` is an advisory `beforeSubmitPrompt` adapter, but that event never fired across three live dispatches, including a `--continue` turn, so the adapter is documented and permanently dormant under the currently installed Cursor CLI build.

### Shared Configuration Boundary

Cursor CLI and the Cursor desktop editor consume the same `.cursor/hooks.json` file. Registering these adapters therefore affects both consumers, not only dispatched `cursor-agent` sessions. The confirmed adapters fail open on malformed or missing hook input, which limits the effect of malformed payloads but does not remove the shared-configuration blast radius.

### Claude-Parity Expansion (Phase 011)

Phase 011 extends the confirmed event surface. Five repo-guard scripts (`worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh --all`, `install-codex-hooks.mjs --check` on `sessionStart`; `session-cleanup.sh` on `sessionEnd`) are wired directly with no new adapter code. `post-tool-use.mjs` is confirmed live on `postToolUse` for both `Write` and `Shell` tool_name payloads, chaining `Write` to `claude-posttooluse.cjs` and `code-graph-freshness.cjs`, and `Shell` (normalized to `Bash` for the target's literal-string matcher) to `dispatch-audit-posttooluse.mjs`; a synthetic `Shell` payload piped directly through the adapter produced a real new line in `.opencode/logs/cli-dispatch-audit.log`. `task-dispatch-guard.mjs` is confirmed live on a second `preToolUse` array entry (`matcher: "Task"`), firing alongside the existing unmatched `spec-gate-enforce.mjs` entry for the same `Task` tool call during a real subagent-delegation dispatch. `user-prompt-submit.ts` (2nd `beforeSubmitPrompt` entry) and `precompact.ts` (`preCompact`) are registered for parity but remain unconfirmed/dormant under the installed `cursor-agent` build — three live dispatches showed no `beforeSubmitPrompt` or `preCompact` marker. `mcp-route-guard.mjs` (`beforeMCPExecution`) is authored and standalone-tested but deliberately NOT added to `.cursor/hooks.json`: no MCP server is configured on this machine, so its assumed `tool_name`/`workspace_roots` payload shape cannot be live-verified. A Tier-1c completion-evidence analog (`completion-evidence-stop.cjs`) was deliberately not built: it requires a `last_assistant_message` field Cursor's `sessionEnd` payload never carries.

### Unreviewed Prebind Design

`.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` was authored by a concurrent session, is uncommitted, and has not yet been reviewed or tested in this catalog work. It is designed to run at `sessionStart`, immediately satisfy the gate for a valid `MK_SPEC_FOLDER`, or open the gate when `MK_SPEC_GATE_ENFORCE=1`, because `beforeSubmitPrompt` never fires; those are design intentions read from the file, not confirmed runtime behavior.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-start.ts` | Handler | Confirmed fires on `sessionStart` and delegates to the existing session-prime adapter; live-verified. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-end.ts` | Handler | Confirmed fires on `sessionEnd` and delegates to the existing session-stop adapter; live-verified. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | Script | Confirmed fires on `preToolUse` and is confirmed working: its deny response and exit code 2 blocked a real Cursor tool call. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs` | Script | Dormant and not wired: `beforeSubmitPrompt` was confirmed never to fire across three live dispatches, including `--continue`. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | Script | Authored by a concurrent session, uncommitted, and not yet reviewed or tested in this catalog work; designed to pre-bind or open Gate-3 state at `sessionStart`, with behavior unconfirmed here. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs` | Script | Confirmed fires on `postToolUse` for `Write` and `Shell` tool_name payloads; chains to `claude-posttooluse.cjs`/`code-graph-freshness.cjs` (Write) and `dispatch-audit-posttooluse.mjs` (Shell, normalized to `Bash`); live-verified. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/task-dispatch-guard.mjs` | Script | Confirmed fires on a 2nd `preToolUse` entry (`matcher: "Task"`) alongside the unmatched `spec-gate-enforce.mjs` entry; proxies to `task-dispatch-guard.cjs`; live-verified against a real subagent-delegation dispatch. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts` | Handler | Registered as a 2nd `beforeSubmitPrompt` entry proxying to `user-prompt-submit.js`; delivery unconfirmed/dormant under the installed build, matching `spec-gate-classify.mjs`'s own status. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/precompact.ts` | Handler | Registered on `preCompact`, proxying to `compact-inject.js`; delivery unconfirmed and untestable in isolation (no compaction-forcing mechanism reachable from a single dispatch). |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/mcp-route-guard.mjs` | Script | Authored and standalone-tested `beforeMCPExecution` advisory proxy to `mcp-route-guard.cjs`; deliberately NOT wired into `.cursor/hooks.json` — no MCP server is configured on this machine to verify its payload shape. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-start.ts` | Reference | Status anchor: confirmed-firing `sessionStart` adapter, live-verified. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/session-end.ts` | Reference | Status anchor: confirmed-firing `sessionEnd` adapter, live-verified. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | Reference | Status anchor: confirmed-firing and confirmed-working `preToolUse` deny path. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs` | Reference | Status anchor: dormant `beforeSubmitPrompt` adapter because the event was confirmed never to fire. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | Reference | Status anchor: authored by a concurrent session, uncommitted, and not yet reviewed or tested in this catalog work; its intended `sessionStart` prebind behavior is unconfirmed. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/README.md` | Reference | Live event-delivery table, shared `.cursor/hooks.json` boundary, and confirmed non-delivery documentation. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/README.md` | Reference | Gate-3 enforce/classify status and the generic `preToolUse` rationale. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-fires-smoke-test.md` | Manual playbook | Reproduction anchor for confirmed `sessionStart`, `preToolUse`, and `sessionEnd` delivery. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md` | Manual playbook | Reproduction anchor for dormant `beforeSubmitPrompt` and `stop` non-delivery. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/task-dispatch-guard-live-fire.md` | Manual playbook | Reproduction anchor for the confirmed `Task`-matcher `preToolUse` dispatch guard (phase 011). |
| `../../../../../specs/cli-external-orchestration/030-cli-cursor-creation/011-cursor-hooks-claude-parity/implementation-summary.md` | Reference | Phase 011's live-fire delivery table for `postToolUse`, the `Task`-matcher guard, and the registered-but-unconfirmed `beforeSubmitPrompt`/`preCompact` proxies. |

---

## 4. SOURCE METADATA

- Group: Cursor Hooks And Spec-Gate Integration
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md`

Related references:
- [`confirmed-fires-smoke-test.md`](../../cli-cursor/manual-testing-playbook/hooks/confirmed-fires-smoke-test.md) — live smoke test for the three confirmed-firing events.
- [`confirmed-non-delivery-documentation.md`](../../cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md) — dormant classify-hook and non-delivery coverage.
- [`task-dispatch-guard-live-fire.md`](../../cli-cursor/manual-testing-playbook/hooks/task-dispatch-guard-live-fire.md) — live-fire smoke test for the confirmed `Task`-matcher `preToolUse` guard (phase 011).
- [`README.md`](../../../system-spec-kit/mcp-server/hooks/cursor/README.md) — Cursor lifecycle adapter event map and shared configuration boundary.
- [`README.md`](../../../system-spec-kit/runtime/hooks/cursor/README.md) — Cursor spec-gate adapter statuses and event rationale.
