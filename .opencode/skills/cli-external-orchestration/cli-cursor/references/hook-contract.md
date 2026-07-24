---
title: "Cursor CLI Hook Contract"
description: "Cursor CLI hook configuration, event coverage, response envelope, discovery order, and exit semantics — shared with the Cursor editor."
trigger_phrases:
  - "cursor hooks"
  - "cursor hook contract"
  - "cursor hooks.json"
  - "cursor hook events"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Cursor CLI Hook Contract

<!-- sk-doc-template: skill_reference -->

---

## 1. OVERVIEW

Cursor 1.7+ ships a native hook system, and — unlike every sibling CLI's hooks — Cursor CLI's hooks are **the exact same hooks the Cursor editor uses**, not a CLI-private surface. There is no separate "enable hooks" feature flag to set; the hooks system is native and always active once a `hooks.json` file exists at a discovered location.

This packet does not yet ship a hook adapter layer of its own — that is a later phase of the same creation packet (`004-cursor-hook-adapter-layer`). This reference documents the confirmed contract those adapters will build against.

---

## 2. REGISTRATION

Cursor reads hook entries from a `hooks.json` file. Schema (confirmed live against an installed `hooks.json`):

```json
{
  "version": 1,
  "hooks": {
    "<event>": [
      {
        "command": "./path/to/script.sh",
        "timeout": 30,
        "type": "command",
        "matcher": "pattern",
        "loop_limit": 5,
        "failClosed": false
      }
    ]
  }
}
```

`command`, `timeout`, `type`, `matcher`, `loop_limit`, and `failClosed` were all observed on live entries or documented; `type` is `"command"` for a shell-executed hook.

---

## 3. DISCOVERY ORDER

Highest precedence to lowest:

| Scope | Path (macOS) | Path (Linux/WSL) | Path (Windows) |
|---|---|---|---|
| Enterprise | `/Library/Application Support/Cursor/hooks.json` | `/etc/cursor/hooks.json` | `C:\ProgramData\Cursor\hooks.json` |
| Team | Enterprise dashboard | — | — |
| Project | `<project-root>/.cursor/hooks.json` | same | same |
| User | `~/.cursor/hooks.json` | same | same |

Because project and user scope are the same files the Cursor **editor** reads, any hook installed here fires for both the editor and CLI sessions in this repo — see `shared-editor-config.md` for the isolation implications.

---

## 4. DOCUMENTED AGENT EVENTS

Confirmed documented event names: `sessionStart`, `sessionEnd`, `preToolUse`, `postToolUse`, `postToolUseFailure`, `subagentStart`, `subagentStop`, `beforeShellExecution`, `afterShellExecution`, `beforeMCPExecution`, `afterMCPExecution`, `beforeReadFile`, `afterFileEdit`, `beforeSubmitPrompt`, `preCompact`, `stop`, `afterAgentResponse`, `afterAgentThought` (plus Tab-completion and `workspaceOpen` app-lifecycle events that are editor-only, not agent-session events).

A live `~/.cursor/hooks.json` on the reference machine used `beforeSubmitPrompt`, `stop`, `beforeShellExecution`, `beforeMCPExecution`, `sessionStart`, and `sessionEnd` — confirming the schema shape live, though that particular install is user-owned tooling, not this packet's own adapter.

---

## 5. RESPONSE ENVELOPE

Command-based hooks return a JSON object on stdout:

```json
{
  "permission": "allow",
  "user_message": "Shown to the human operator",
  "agent_message": "Shown to the agent/model"
}
```

`permission` is `"allow"`, `"deny"`, or `"ask"`.

---

## 6. EXIT AND TIMEOUT SEMANTICS

| Condition | Behavior |
| --- | --- |
| Exit `0` | Hook succeeds; its response envelope (if any) is honored. |
| Exit `2` | Blocks the action the hook gated. |
| Other non-zero exits | Not confirmed live; treat conservatively as a hook failure until verified. |
| Timeout | Governed by the entry's own `timeout` field (seconds); behavior past timeout is not yet live-verified. |

---

## 7. OPEN QUESTION — PARTIAL EVENT DELIVERY (CLI VS EDITOR)

**This is the single most important caveat in this document.** A community report (not yet independently confirmed against this CLI build) states that the Cursor **CLI**, as opposed to the editor, may not deliver every event registered in `hooks.json` — an editor/CLI parity gap. Do not assume any event beyond what a later phase live-verifies actually fires under `cursor-agent -p`. The dedicated hook-adapter phase of this creation packet (`004-cursor-hook-adapter-layer`) is scoped specifically to live-verify per-event delivery against the installed binary before any adapter claims a guard is "active" for a given event. Until that verification lands, treat every event in §4 as documented-but-unconfirmed-under-the-CLI, not confirmed-active.

---

## 8. SOURCES

- Cursor hooks documentation: `cursor.com/docs/hooks`
- Live `~/.cursor/hooks.json` on the reference machine (schema cross-check)
- Community CLI-hooks-parity report: `forum.cursor.com` (unconfirmed against this specific build — verify before relying on it)
