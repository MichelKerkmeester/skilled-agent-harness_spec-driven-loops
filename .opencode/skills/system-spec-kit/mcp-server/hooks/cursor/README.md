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
| `sessionStart` | **Confirmed fires** | `session-start.ts` → delegates to `../claude/session-prime.js` | Fires once per session with full payload |
| `preToolUse` | **Confirmed fires** | `../../runtime/hooks/cursor/spec-gate-enforce.mjs` | Fires before every tool call (`Shell`, `Read`, `Grep`, `Write` all observed); the deny path (`permission:"deny"` + exit 2) was live-verified to actually block the tool call |
| `postToolUse` | **Confirmed fires** | Not yet wired (no repo guard currently needs a post-tool observation point beyond what `afterFileEdit`/`afterShellExecution` already give) | Fires after every tool call |
| `sessionEnd` | **Confirmed fires** | `session-end.ts` → delegates to `../claude/session-stop.js` | Fires once per process with `reason`/`final_status` and a real `transcript_path` |
| `beforeShellExecution` / `afterShellExecution` | **Confirmed fires** | Covered by `preToolUse`/`postToolUse` instead (broader) | Not separately wired — `preToolUse` already gates shell calls |
| `beforeReadFile` | **Confirmed fires** | Not wired (read-only, no mutation to gate) | — |
| `afterFileEdit` | **Confirmed fires** | Not wired (post-hoc; `preToolUse` already gates the write before it happens) | — |
| `afterAgentThought` | **Confirmed fires** | Not wired (no repo guard needs a reasoning-trace hook today) | — |
| `beforeSubmitPrompt` | **Confirmed non-delivery** | `../../runtime/hooks/cursor/spec-gate-classify.mjs` exists but is DORMANT, not registered | Never fired across 3 separate dispatches including `--continue`; Gate-3 classify has no working CLI attachment point today |
| `stop` | **Confirmed non-delivery** | Replaced by `sessionEnd` (`session-end.ts`) | Never fired across all 3 dispatches; `sessionEnd` is the actual completion signal under `-p` |
| `postToolUseFailure`, `beforeMCPExecution`, `afterMCPExecution`, `preCompact`, `subagentStart`, `subagentStop`, `afterAgentResponse` | **Untested** | Not wired | No failure/MCP/subagent/compaction scenario was triggered by the probe dispatches; do not assume delivery either way until re-tested |

**Re-verification trigger**: re-run the probe methodology above (temporary `.cursor/hooks.json` + logging script + `cursor-agent -p` dispatches covering shell/read/write, plus a deny-path test) whenever the installed `cursor-agent` build changes, before trusting this table as still accurate.

## 3. CONTENTS

| File | Purpose |
|------|---------|
| `shared.ts` | Reads and validates a bounded Cursor hook payload, translates it into the shape the `../claude/*.js` adapters already expect, spawns the matching adapter, and emits Cursor's native `{permission, user_message, agent_message}` response envelope. |
| `session-start.ts` | `sessionStart` adapter. Delegates to `session-prime.js` and returns its context as `agent_message`. |
| `session-end.ts` | `sessionEnd` adapter (NOT `stop` — see the delivery table above). Delegates to `session-stop.js`. |

## 4. CONSUMERS

- A project `.cursor/hooks.json` would register the compiled `dist/hooks/cursor/*.js` outputs of `session-start.ts` and `session-end.ts` against `sessionStart`/`sessionEnd`. **This file has not been committed yet** — phase 004 built and live-verified the adapters but deferred the actual `.cursor/hooks.json` registration to a later, explicitly-approved step, because registering it also changes behavior for Cursor-editor users of this repo.
- `../../runtime/hooks/cursor/spec-gate-enforce.mjs` would be registered against `preToolUse` in that same future `.cursor/hooks.json`.

## 5. RELATED

- [`../README.md`](../README.md)
- [`../../runtime/hooks/cursor/README.md`](../../runtime/hooks/cursor/README.md)
- [`.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer/decision-record.md`](../../../../../../.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer/decision-record.md) — ADR-001 (registration scope) and ADR-002 (event mapping + the live-verification methodology and results above)
