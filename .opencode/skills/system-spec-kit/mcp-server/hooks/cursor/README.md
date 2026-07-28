---
title: "Cursor Hooks: Lifecycle Adapters"
description: "Cursor CLI hook adapters that normalize Cursor lifecycle payloads and delegate to the existing Claude hook implementations."
---

# Cursor Hooks: Lifecycle Adapters

---

## 1. OVERVIEW

`hooks/cursor/` adapts Cursor CLI's lifecycle events onto the existing Claude hook implementations in `../claude/`. Each adapter reads and validates its own Cursor payload, spawns the matching compiled Claude adapter with a normalized input, and translates the result back into Cursor's native `{permission, user_message, agent_message}` hook response envelope — a materially different shape from Codex's `hookSpecificOutput` envelope. No lifecycle logic is duplicated: state and transcript semantics stay owned by the Claude adapters so the command transports cannot drift apart.

**Blast radius (read before registering `.cursor/hooks.json`).** Unlike `.codex/hooks.json` or `.devin/hooks.v1.json`, Cursor's hook config is NOT tool-private — `.cursor/hooks.json` (project) and `~/.cursor/hooks.json` (user) are the exact same files the Cursor **editor** reads. Registering these adapters in a project `.cursor/hooks.json` also fires them for anyone using the Cursor editor on this repo, not only dispatched `cursor-agent` CLI sessions. Every adapter here fails open (never blocks on malformed/missing stdin), which is the load-bearing mitigation for that shared blast radius — see `decision-record.md` ADR-001 for the full reasoning and rejected alternatives.

## 2. CONFIRMED EVENT DELIVERY (LIVE-VERIFIED, NOT ASSUMED)

A temporary, uncommitted `.cursor/hooks.json` wired every documented Cursor agent event to a logging probe script, then 3 separate `cursor-agent -p` dispatches (single-turn and a `--continue` second turn) exercising shell commands, file reads, and file writes were run against the installed `cursor-agent 2026.07.23-e383d2b` binary. Results:

| Cursor event | CLI delivery | Adapter | Notes |
|---|---|---|---|
| `sessionStart` | **Confirmed fires** | `session-start.ts` plus `spec-gate-prebind.mjs` | Primes context and initializes opt-in Gate-3 state. |
| `preToolUse` | **Confirmed fires** | `spec-gate-enforce.mjs` (this folder) | Fires before every tool call (`Shell`, `Read`, `Grep`, `Write` all observed); the deny path (`permission:"deny"` + exit 2) was live-verified to actually block the tool call |
| `postToolUse` | **Confirmed fires** | `post-tool-use.mjs` | Runs post-edit, graph-freshness, and dispatch-audit adapters. |
| `sessionEnd` | **Confirmed fires** | `session-end.ts` → delegates to `../claude/session-stop.js` | Fires once per process with `reason`/`final_status` and a real `transcript_path` |
| `beforeShellExecution` / `afterShellExecution` | **Confirmed fires** | Covered by `preToolUse`/`postToolUse` instead (broader) | Not separately wired — `preToolUse` already gates shell calls |
| `beforeReadFile` | **Confirmed fires** | Not wired (read-only, no mutation to gate) | — |
| `afterFileEdit` | **Confirmed fires** | Not wired (post-hoc; `preToolUse` already gates the write before it happens) | — |
| `afterAgentThought` | **Confirmed fires** | Not wired (no repo guard needs a reasoning-trace hook today) | — |
| `beforeSubmitPrompt` | **Confirmed non-delivery in tested build** | Classifier and prompt-submit adapters are registered for parity | Startup prebinding covers the enforcement-state gap. |
| `stop` | **Confirmed non-delivery** | Replaced by `sessionEnd` (`session-end.ts`) | Never fired across all 3 dispatches; `sessionEnd` is the actual completion signal under `-p` |
| `beforeMCPExecution` | **Confirmed fires** | `mcp-route-guard.mjs` | Normalizes Cursor's split MCP server/tool payload for the shared advisory guard. |
| `preCompact` | **Registered, delivery unconfirmed** | `precompact.ts` | No CLI-reachable compaction trigger is available. |
| `postToolUseFailure`, `afterMCPExecution`, `subagentStart`, `subagentStop`, `afterAgentResponse` | **Not wired** | None | No current repository guard consumes these events. |

**Re-verification trigger**: re-run the probe methodology above (temporary `.cursor/hooks.json` + logging script + `cursor-agent -p` dispatches covering shell/read/write, plus a deny-path test) whenever the installed `cursor-agent` build changes, before trusting this table as still accurate.

## 3. CONTENTS

| File | Purpose |
|------|---------|
| `shared.ts` | Reads and validates a bounded Cursor hook payload, translates it into the shape the `../claude/*.js` adapters already expect, spawns the matching adapter, and emits Cursor's native `{permission, user_message, agent_message}` response envelope. |
| `session-start.ts` | `sessionStart` adapter. Delegates to `session-prime.js` and returns its context as `agent_message`. |
| `session-end.ts` | `sessionEnd` adapter (NOT `stop` — see the delivery table above). Delegates to `session-stop.js`. |
| `post-tool-use.mjs` | Normalizes Cursor tool payloads for post-edit, graph-freshness, and dispatch-audit hooks. |
| `task-dispatch-guard.mjs` | Proxies matched `Task` calls into the shared dispatch guard. |
| `mcp-route-guard.mjs` | Normalizes split MCP identifiers before calling the shared advisory guard. |

## 4. CONSUMERS

- `.cursor/hooks.json` is the committed registration authority for these adapters and the sibling runtime spec-gate scripts.
- The file is shared by Cursor CLI and the Cursor editor, so every entry remains fail-open and enforcement remains opt-in.

## 5. SPEC-GATE (GATE-3) HOOKS

This folder also holds Cursor's Gate-3 adapters (direct-run `.mjs`, no build step). The startup prebind establishes state that Cursor's undelivered prompt event cannot create, the pre-tool adapter consumes that state through the shared evaluator in `../lib/spec-gate/spec-gate-core.mjs`, and the prompt classifier remains registered for forward compatibility. Every entrypoint fails open.

Cursor's generic `preToolUse` event covers shell and file-write calls, so `spec-gate-enforce.mjs` is wired there rather than `beforeShellExecution` (which only covers shell and would miss `Write` entirely). `beforeSubmitPrompt` remains registered but has not fired under the installed CLI; `spec-gate-prebind.mjs` therefore uses confirmed `sessionStart` delivery to satisfy a validated `MK_SPEC_FOLDER` or open state only when `MK_SPEC_GATE_ENFORCE=1` is explicitly set for an identifiable top-level session. A dispatched/child session (`AI_SESSION_CHILD=1`) is a complete Gate-3 no-op enforced in the shared core. Both spec-gate adapters resolve `workspace_roots[0]` only, so multi-root Cursor workspaces are not enforced against secondary roots.

| File | Purpose | Status |
|------|---------|--------|
| `spec-gate-prebind.mjs` | `sessionStart` hook. Validates an explicit folder or opens opt-in top-level enforcement state. | **Active** — process-tested; disabled, child, malformed, and missing-session cases write no state. |
| `spec-gate-enforce.mjs` | `preToolUse` hook. Maps Cursor's `Shell`/`Write` tool names onto the core's `bash`/`write` vocabulary, then runs `evaluateMutation()`. | **Active** — the deny path (`{"permission":"deny"}` + exit 2) was live-verified to block a real `cursor-agent` tool call. |
| `spec-gate-classify.mjs` | `beforeSubmitPrompt` hook. Would surface the bounded Gate-3 question as `agent_message`. | **Registered, delivery unconfirmed** — `beforeSubmitPrompt` did not fire under the tested CLI build. |
| `spec-gate-prebind.test.mjs` | Co-located tests, run with `node --test`. | — |

## 6. RELATED

- [`../README.md`](../README.md)
- [`../lib/spec-gate/README.md`](../lib/spec-gate/README.md)
- [`.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer/decision-record.md`](../../../../../../.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer/decision-record.md) — ADR-001 (registration scope) and ADR-002 (event mapping + the live-verification methodology and results above)
