---
title: "Session Cleanup: Codex Stop Link"
description: "Codex CLI link to the shared teardown script, registered on the Stop event, which kills only proven session-descendant MCP helpers."
trigger_phrases:
  - "codex session cleanup"
  - "codex stop teardown"
  - "mcp helper teardown"
version: 1.0.0.0
---

# Session Cleanup: Codex Stop Link

---

## 1. OVERVIEW

`codex/` holds one relative symlink. `session-cleanup.sh` points to `.skilled/scripts/session-cleanup.sh`, and `.codex/hooks.json` runs it on the `Stop` event. The script takes the session PID from `SESSION_CLEANUP_PID` or `CLAUDE_SESSION_PID`, walks the descendant tree with `pgrep -P`, and sends `kill -15` only after re-proving ancestry through the live ppid chain. Without a session PID it runs the orphan-sweep fallback or skips. Every action goes to `~/.local/share/session-cleanup.log` with a 10 MB cap and three rotations.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`session-cleanup.sh`](./session-cleanup.sh) | Symlink, `Stop` | Points at `.skilled/scripts/session-cleanup.sh`. The target matches the known MCP helper commands, checks `hook_enabled session-cleanup`, kills a proven descendant with `TERM` and writes one log line per action. | A kill failure is logged and sets the final exit code to 1. A missing session PID skips cleanly, and a missing resolver leaves the concern enabled. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the teardown contract and configuration.
- [`../../../scripts/session-cleanup.sh`](../../../scripts/session-cleanup.sh): the real script.
- [`../../../scripts/orphan-mcp-sweeper.sh`](../../../scripts/orphan-mcp-sweeper.sh): the orphan-only fallback the script delegates to.
