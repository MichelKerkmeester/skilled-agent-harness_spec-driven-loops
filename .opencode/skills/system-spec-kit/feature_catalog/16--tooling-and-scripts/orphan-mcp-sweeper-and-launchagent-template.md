---
title: "Orphan MCP Sweeper and LaunchAgent Template"
description: "Dry-run-first operator runbook and scripts for stale MCP helper cleanup, temporary dispatch artifact cleanup, Claude session cleanup, and later launchd rollout."
trigger_phrases:
  - "orphan mcp sweeper and launchagent template"
  - "orphan-mcp-sweeper.sh"
  - "sweep stale mcp processes"
  - "claude session cleanup"
  - "launchagent mcp template"
---

# Orphan MCP Sweeper and LaunchAgent Template

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This feature turns manual orphan MCP cleanup into a documented operator workflow. It gives humans and AI agents one place to find the dry-run command, preservation rules, log behavior, and the boundary between repo-reviewed automation and system-level launchd activation.

## 2. HOW IT WORKS

### Core Behavior

`.opencode/scripts/orphan-mcp-sweeper.sh` scans the live process table for stale MCP helper classes and stale `/tmp` dispatch artifacts. It supports `--dry-run`, `--verbose`, `--log-path`, `ORPHAN_AGE_MIN_SEC`, `ORPHAN_TMP_AGE_HOURS`, and `ORPHAN_SWEEPER_LOG_MAX_BYTES`.

Dry-run is the expected first operator path:

```bash
bash .opencode/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path /tmp/orphan-sweeper-review.log
```

The sweeper preserves `devin --print`, Ollama, live Claude Code descendants, the freshest young instance per MCP class, active non-MCP TCP listeners, `/tmp/devin-*`, `/tmp/cli-devin-*`, `/tmp/codex-browser-use`, and cache-like paths. Real mode sends SIGTERM to selected PIDs, waits 5 seconds, then sends SIGKILL to survivors.

### Edge Cases & Caveats

`.opencode/scripts/claude-session-cleanup.sh` is the session-scoped counterpart. It requires `CLAUDE_SESSION_PID` (no PPID fallback — under a shared terminal that ancestor is common to many sessions, and guessing it turned scoped cleanup into a cross-session kill), re-proves each candidate's ancestry against the session pid immediately before the kill, logs to `~/.local/share/claude-stop-hook.log` with `matched_by=`/`ancestor_ok=` fields, and only sends SIGTERM to matching MCP helpers. Without session identity it deliberately does nothing.

`.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` is a versioned LaunchAgent template. It is not copied to `~/Library/LaunchAgents` and is not loaded by default. LaunchAgent activation remains a separate operator-approved rollout step.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Operator script | Dry-run-first stale MCP process and `/tmp` artifact sweeper. |
| `.opencode/scripts/claude-session-cleanup.sh` | Hook script | Session-scoped Claude Code MCP descendant cleanup. |
| `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` | LaunchAgent template | Optional 600-second scheduled sweeper template. |
| `.opencode/scripts/README.md` | Runbook | Human and AI wayfinding for the cleanup scripts. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/orphan-mcp-runtime-lifecycle-guardrails.md` | Manual playbook | Dry-run, preservation, plist lint, cleanup script syntax, and no-mutation checks. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/implementation-summary.md` | Manual playbook | Packet-level implementation and verification evidence. |

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md`
Related references:
- [embedder-status-and-active-pointer.md](embedder-status-and-active-pointer.md) — Embedder status and active pointer
