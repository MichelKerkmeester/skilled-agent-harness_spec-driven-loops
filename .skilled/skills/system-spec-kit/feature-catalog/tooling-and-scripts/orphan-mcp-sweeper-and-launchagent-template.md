---
title: "Orphan MCP sweeper and LaunchAgent template"
description: "Dry-run-first operator runbook and scripts for stale MCP helper cleanup, temporary dispatch artifact cleanup, temporary-path orphan reaping and session cleanup."
trigger_phrases:
  - "orphan mcp sweeper and launchagent template"
  - "orphan-mcp-sweeper.sh"
  - "sweep stale mcp processes"
  - "claude session cleanup"
  - "launchagent mcp template"
  - "sweep temp path orphans"
  - "orphan temp process cleanup"
version: 1.6.0.10
---

# Orphan MCP Sweeper and LaunchAgent Template

## 1. OVERVIEW

This feature turns manual orphan MCP cleanup into a documented operator workflow. It gives humans and AI agents one place to find the dry-run command, preservation rules, log behavior, and the boundary between repo-reviewed automation and system-level launchd activation.

---

## 2. HOW IT WORKS

### Core Behavior

`.skilled/scripts/orphan-mcp-sweeper.sh` scans the live process table for three classes of leftover work: stale MCP helper classes, stale `/tmp` dispatch artifacts, and temp-path orphans. It supports `--dry-run`, `--verbose`, `--log-path`, `ORPHAN_AGE_MIN_SEC`, `ORPHAN_TMP_AGE_HOURS`, `ORPHAN_TEMP_PROCESS_AGE_HOURS`, and `ORPHAN_SWEEPER_LOG_MAX_BYTES`.

A temp-path orphan is a process whose parent is pid 1, owned by the current user, not a zombie, at least `ORPHAN_TEMP_PROCESS_AGE_HOURS` old (default 6), whose command line points into the user temp directory, `/tmp/claude-<uid>/` or `~/worktrees/*/.scratch-*`. Apps macOS launches from AppTranslocation never match, because a quarantined app running out of the temp directory is a real app. The sweeper re-checks that shape immediately before each signal, and holding a TCP listener does not preserve such a process, so a leftover fixture `http.server` is reaped like any other temp-path orphan.

Dry-run is the expected first operator path:

```bash
bash .skilled/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path /tmp/orphan-sweeper-review.log
```

The sweeper preserves Ollama, the descendants of live sessions across all seven CLI runtimes the repo drives (claude, opencode, codex, pi, hermes, devin and cursor-agent), `/tmp/opencode-browser-use`, and cache-like paths. A temp-path orphan that still has a live session among its descendants is preserved with reason `drives-live-session`, so a detached fan-out driver script running from a scratch folder survives while the sessions it started are still working. `ORPHAN_AGE_MIN_SEC` (default 300) is now a floor for every candidate, reason `younger-than-age-min`, so a younger duplicate helper of a class is no longer swept just because a fresher sibling exists. It also preserves the shared skill-advisor launcher, which retires itself on its own 30-minute idle timeout, together with that launcher's advisor server and `hf-model-server` while the launcher is their parent. A server whose launcher died stays sweepable. Active non-MCP TCP listeners are preserved for MCP helper classes only, because a listener held by a temp-path orphan belongs to the leftover. Real mode sends SIGTERM to selected PIDs, waits 5 seconds, then sends SIGKILL to survivors.

On macOS the sweeper builds the session tree from `pgrep -a`, because macOS `pgrep` otherwise hides its own ancestors and a sweep started inside a session, such as from the Stop hook, would reap that session's MCP helpers. The tree matches sessions of all seven runtimes, so a pi, hermes, devin or cursor-agent session protects its helpers the same way a claude, opencode or codex session does. Linux omits the flag and reads the same process list.

### Edge Cases & Caveats

`.skilled/scripts/session-cleanup.sh` is the session-scoped counterpart. It requires `CLAUDE_SESSION_PID` (no PPID fallback — under a shared terminal that ancestor is common to many sessions, and guessing it turned scoped cleanup into a cross-session kill), re-proves each candidate's ancestry against the session pid immediately before the kill, logs to `~/.local/share/claude-stop-hook.log` with `matched_by=`/`ancestor_ok=` fields, and only sends SIGTERM to matching MCP helpers. Without session identity it deliberately does nothing.

`.skilled/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` is a versioned LaunchAgent template. It is not copied to `~/Library/LaunchAgents` and is not loaded by default. LaunchAgent activation remains a separate operator-approved rollout step.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/scripts/orphan-mcp-sweeper.sh` | Operator script | Dry-run-first stale MCP process and `/tmp` artifact sweeper. |
| `.skilled/scripts/session-cleanup.sh` | Hook script | Session-scoped MCP descendant cleanup. |
| `.skilled/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` | LaunchAgent template | Optional 600-second scheduled sweeper template. |
| `.skilled/scripts/README.md` | Runbook | Human and AI wayfinding for the cleanup scripts. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `runtime/tests/orphan-sweeper-temp-path.vitest.ts` | Automated test | Temp-path classification matrix, the listener exception, the Darwin and Linux `pgrep` flag, and the advisor preserve rules |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/orphan-mcp-runtime-lifecycle-guardrails.md` | Manual playbook | Dry-run, preservation, plist lint, cleanup script syntax, and no-mutation checks. |
| `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/implementation-summary.md` | Manual playbook | Packet-level implementation and verification evidence. |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md`
