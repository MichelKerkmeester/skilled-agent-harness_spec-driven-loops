---
title: "Orphan MCP Sweeper and LaunchAgent Template"
description: "Dry-run-first operator runbook and scripts for stale MCP helper cleanup, temporary dispatch artifact cleanup, Claude session cleanup, and later launchd rollout."
---

# Orphan MCP Sweeper and LaunchAgent Template

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This feature turns manual orphan MCP cleanup into a documented operator workflow. It gives humans and AI agents one place to find the dry-run command, preservation rules, log behavior, and the boundary between repo-reviewed automation and system-level launchd activation.

## 2. CURRENT REALITY

`.opencode/scripts/orphan-mcp-sweeper.sh` scans the live process table for stale MCP helper classes and stale `/tmp` dispatch artifacts. It supports `--dry-run`, `--verbose`, `--log-path`, `ORPHAN_AGE_MIN_SEC`, `ORPHAN_TMP_AGE_HOURS`, and `ORPHAN_SWEEPER_LOG_MAX_BYTES`.

Dry-run is the expected first operator path:

```bash
bash .opencode/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path /tmp/orphan-sweeper-review.log
```

The sweeper preserves `devin --print`, Ollama, live Claude Code descendants, the freshest young instance per MCP class, active non-MCP TCP listeners, `/tmp/devin-*`, `/tmp/cli-devin-*`, `/tmp/codex-browser-use`, and cache-like paths. Real mode sends SIGTERM to selected PIDs, waits 5 seconds, then sends SIGKILL to survivors.

`.opencode/scripts/claude-session-cleanup.sh` is the session-scoped counterpart. It walks descendants of `CLAUDE_SESSION_PID` or the hook process `PPID`, logs to `~/.local/share/claude-stop-hook.log`, and only sends SIGTERM to matching MCP helpers.

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

| File | Focus |
|---|---|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/419-orphan-mcp-runtime-lifecycle-guardrails.md` | Dry-run, preservation, plist lint, cleanup script syntax, and no-mutation checks. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/implementation-summary.md` | Packet-level implementation and verification evidence. |

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/47-orphan-mcp-sweeper-and-launchagent-template.md`
