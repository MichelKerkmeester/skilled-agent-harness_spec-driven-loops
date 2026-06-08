---
title: "Repo Scripts Runbook"
description: "Operator-facing runbook for repository-level maintenance scripts, including dry-run orphan MCP cleanup and session cleanup with an opt-in orphan-sweep fallback."
trigger_phrases:
  - "repo scripts"
  - "orphan mcp sweeper"
  - "claude session cleanup"
importance_tier: "important"
---

# Repo Scripts Runbook

> Repository-level scripts that are useful to operators and AI agents. These scripts can touch live processes, so dry-run and scope checks matter.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ORPHAN MCP SWEEPER](#2--orphan-mcp-sweeper)
- [3. SESSION CLEANUP](#3--session-cleanup)
- [4. VALIDATION](#4--validation)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This folder holds small repository-level operational scripts. The orphan MCP leak prevention packet added two lifecycle surfaces:

| File | Purpose | Rollout state |
|---|---|---|
| `orphan-mcp-sweeper.sh` | Scans stale MCP helper processes and stale `/tmp` dispatch artifacts. | Implemented, dry-run reviewed. |
| `session-cleanup.sh` | Kills only MCP helper descendants of the current session, resolved from `CLAUDE_SESSION_PID`. The old `claude-session-cleanup.sh` name still resolves through a back-compat shim. | Wired through repo-local `.claude/settings.local.json`. |

The canonical implementation packet is `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/`.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:orphan-mcp-sweeper -->
## 2. ORPHAN MCP SWEEPER

Run the review command first:

```bash
bash .opencode/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path /tmp/orphan-sweeper-review.log
```

Dry-run mode logs the same kill and remove decisions the real sweep would make, but it does not kill PIDs and does not remove `/tmp` files.

### Configuration

| Variable | Default | Purpose |
|---|---:|---|
| `ORPHAN_AGE_MIN_SEC` | `300` | Freshest-instance age threshold, in seconds. |
| `ORPHAN_TMP_AGE_HOURS` | `24` | Minimum age before matching `/tmp` artifacts can be removed. |
| `ORPHAN_SWEEPER_LOG_PATH` | `~/.local/share/orphan-sweeper.log` | Default log path when stdout is a terminal or `--log-path` is provided. |
| `ORPHAN_SWEEPER_LOG_MAX_BYTES` | `10485760` | Log rotation cap. Keeps `.1`, `.2`, and `.3`. |

### Preserved process classes

The sweeper preserves:

- Ollama runner and server processes
- Descendants of live Claude Code sessions
- The freshest young instance per matched MCP class
- Processes with active non-MCP TCP listeners

It targets stale launcher/server classes such as `mk-*-launcher.cjs`, Spec Kit Memory, Skill Advisor, Code Graph, Code Mode, ClickUp MCP, and sequential-thinking MCP when not explicitly preserved.

### Temporary files

The sweeper considers stale `/tmp/codex-*`, `/tmp/cli-*`, `/tmp/opencode-*`, `/tmp/deep-review-*`, `/tmp/save-context-data-*`, `*-prompt.md`, and `*-cli-{err,out}.log` artifacts. It preserves `/tmp/codex-browser-use` and cache-like directories.

### Real sweep boundary

Real mode sends SIGTERM to selected PIDs, waits 5 seconds, then sends SIGKILL to survivors. Do not run real mode or schedule it through launchd until the dry-run output has been reviewed for the current machine.

<!-- /ANCHOR:orphan-mcp-sweeper -->

---

<!-- ANCHOR:session-cleanup -->
## 3. SESSION CLEANUP

`session-cleanup.sh` is session-scoped. It resolves the session from `CLAUDE_SESSION_PID`, walks descendants, and sends SIGTERM only to matching MCP helpers. There is deliberately no `PPID` fallback: under a shared terminal that ancestor can be common to many live sessions, so a missing session pid means the session-scoped kill does nothing rather than risk reaping a sibling session's helpers. The old `claude-session-cleanup.sh` name still resolves through a back-compat shim.

The script logs to:

```text
~/.local/share/claude-stop-hook.log
```

Override the log path with:

```bash
CLAUDE_SESSION_CLEANUP_LOG_PATH=/tmp/claude-stop-hook.log bash .opencode/scripts/session-cleanup.sh
```

### Orphan-sweep fallback (no session pid)

When no `CLAUDE_SESSION_PID` is present, an opt-in fallback can still reap leftover daemons without guessing the session. `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` controls it: `off` (the default) keeps the historical no-op, `dry-run` logs the candidate reaps without mutating, and `1`/`on`/`live` reaps. It delegates only to the orphan-only `orphan-mcp-sweeper.sh`, which reaps ownerless reparented processes and so can never touch a live session. `SPECKIT_ORPHAN_SWEEPER_BIN` overrides the sweeper path for tests.

The repo-local `.claude/settings.local.json` chains this script after the canonical `session-stop.js` command inside the existing single nested `Stop` hook. It should not be duplicated as a second parallel `Stop` hook entry.

<!-- /ANCHOR:session-cleanup -->

---

<!-- ANCHOR:validation -->
## 4. VALIDATION

Run from the repository root:

```bash
bash -n .opencode/scripts/orphan-mcp-sweeper.sh
bash -n .opencode/scripts/session-cleanup.sh
bash .opencode/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path /tmp/orphan-sweeper-review.log
```

Expected result: syntax checks pass, dry-run logs preserve and candidate decisions, and no PIDs or files are removed during dry-run.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 5. RELATED

- [Orphan MCP leak prevention implementation summary](../specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/implementation-summary.md)
- [Spec Kit MCP ENV reference](../skills/system-spec-kit/mcp_server/ENV_REFERENCE.md)
- [Spec Kit MCP runtime README](../skills/system-spec-kit/mcp_server/README.md)

<!-- /ANCHOR:related -->
