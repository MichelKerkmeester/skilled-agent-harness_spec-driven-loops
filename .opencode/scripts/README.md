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
- [4. STAGED ACTIVATION](#4--staged-activation)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This folder holds small repository-level operational scripts. The orphan MCP leak prevention packet added two lifecycle surfaces:

| File | Purpose | Rollout state |
|---|---|---|
| `orphan-mcp-sweeper.sh` | Scans stale MCP helper processes and stale `/tmp` dispatch artifacts. | Implemented, dry-run reviewed. |
| `session-cleanup.sh` | Kills only MCP helper descendants of the current session, resolved from `SESSION_CLEANUP_PID` or `CLAUDE_SESSION_PID`. The old `claude-session-cleanup.sh` name still resolves through a back-compat shim. | Wired through repo-local `.claude/settings.local.json`. |

The canonical implementation packet is `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/`.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:orphan-mcp-sweeper -->
## 2. ORPHAN MCP SWEEPER

Run the review command first:

```bash
bash .opencode/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path /tmp/orphan-sweeper-review.log
```

Dry-run mode logs the kill and remove decisions that live mode would select, but it sends no signals and removes no `/tmp` files. Add `--verbose` to include preserve decisions and use `--log-path PATH` to append the review output to a specific file.

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
- Descendants of live Claude Code, OpenCode, and Codex sessions
- The freshest young instance per matched MCP class
- Processes with active non-MCP TCP listeners
- Daemons with active IPC socket connections
- Spec Kit context servers protected by a fresh maintenance marker or the same-database singleton-listener rules

It targets stale launcher/server classes such as `mk-*-launcher.cjs`, Spec Kit Memory, Skill Advisor, Code Graph, Code Mode, ClickUp MCP, and sequential-thinking MCP when not explicitly preserved.

### Temporary files

The sweeper considers stale `/tmp/codex-*`, `/tmp/cli-*`, `/tmp/opencode-*`, `/tmp/deep-review-*`, `/tmp/save-context-data-*`, `*-prompt.md`, and `*-cli-{err,out}.log` artifacts. It preserves `/tmp/codex-browser-use` and cache-like directories.

### Real sweep boundary

Real mode sends SIGTERM to selected PIDs, waits 5 seconds, then sends SIGKILL to survivors. Before each signal stage it rechecks the PID's command and class and reruns the preservation policy. A changed PID or a process that has become protected is preserved instead. The fresh maintenance-marker check, same-database singleton-listener classification, and pre-SIGKILL reclassification protect live-serving daemons while stale duplicates remain eligible. Do not run real mode or schedule it through launchd until the dry-run output has been reviewed for the current machine.

<!-- /ANCHOR:orphan-mcp-sweeper -->

---

<!-- ANCHOR:session-cleanup -->
## 3. SESSION CLEANUP

`session-cleanup.sh` is session-scoped. It resolves the session from `SESSION_CLEANUP_PID`, falling back to `CLAUDE_SESSION_PID`, walks descendants, and sends SIGTERM only to matching MCP helpers. There is deliberately no `PPID` fallback: under a shared terminal that ancestor can be common to many live sessions, so a missing session pid means the session-scoped kill does nothing rather than risk reaping a sibling session's helpers. The old `claude-session-cleanup.sh` name still resolves through a back-compat shim.

The script logs to:

```text
~/.local/share/session-cleanup.log
```

Override the log path with:

```bash
SESSION_CLEANUP_LOG_PATH=/tmp/session-cleanup.log bash .opencode/scripts/session-cleanup.sh
```

### Orphan-sweep fallback (no session pid)

When neither `SESSION_CLEANUP_PID` nor `CLAUDE_SESSION_PID` is present, an opt-in fallback can run the global orphan sweeper without guessing the session. `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` controls it: `off` is the default and skips the fallback, `dry-run`/`dryrun`/`dry` run the sweeper without mutation, and `1`/`on`/`live` run it live. Any other value follows the off behavior. The fallback delegates to `orphan-mcp-sweeper.sh`, whose live-session, listener, maintenance-marker, and reclassification guards preserve active processes. `SPECKIT_ORPHAN_SWEEPER_BIN` overrides the sweeper path for tests.

The repo-local `.claude/settings.local.json` chains this script after the canonical `session-stop.js` command inside the existing single nested `Stop` hook. It should not be duplicated as a second parallel `Stop` hook entry.

<!-- /ANCHOR:session-cleanup -->

---

<!-- ANCHOR:staged-activation -->
## 4. STAGED ACTIVATION

The Stop-hook fallback and LaunchAgent are independent rollout surfaces. Enable and review each one separately. The repository LaunchAgent plist is a template only: it is not installed or loaded by default, it retains `--dry-run`, runs every 600 seconds, and has `RunAtLoad` set to false.

Before enabling either surface, run the full operator preflight from the repository root:

```bash
bash -n .opencode/scripts/orphan-mcp-sweeper.sh
bash -n .opencode/scripts/session-cleanup.sh
plutil -lint .opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist
bash .opencode/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path /tmp/orphan-sweeper-review.log
```

Review `/tmp/orphan-sweeper-review.log` and the command output. Live mode is eligible only after a clean review window shows that every live-serving daemon is preserved, with no `action=kill` selection for a serving `spec-memory-context-server`. The maintenance-marker, same-database singleton-listener, active-listener, and signal-time reclassification guards are the safety boundary that makes a later live rollout safe.

### Stop-hook rollout

`SPECKIT_STOP_HOOK_ORPHAN_SWEEP` defaults to `off`. It controls only the fallback used when neither supported session PID variable is available. A normal session-scoped cleanup still uses the proven session ancestry path.

1. Set `SPECKIT_STOP_HOOK_ORPHAN_SWEEP=dry-run` in the environment inherited by the Stop hook.
2. Run real session teardowns over multiple sessions. Confirm fallback runs appear as `action=orphan-sweep mode=dry-run reason=no-session-pid` when session identity is unavailable.
3. Review `~/.local/share/session-cleanup.log` and the sweeper output over that window. Dry-run must preserve every live-serving daemon and must not select a serving context server with `action=kill`.
4. Only after a clean review window, set `SPECKIT_STOP_HOOK_ORPHAN_SWEEP=live`. The equivalent accepted live tokens are `1` and `on`.
5. Roll back immediately by setting `SPECKIT_STOP_HOOK_ORPHAN_SWEEP=off`. Use `dry-run` instead when continued observation is useful. The accepted dry-run aliases are `dryrun` and `dry`.

### LaunchAgent rollout

The template's `ProgramArguments` invoke the sweeper with `--dry-run`, `--verbose`, and an explicit `--log-path`. launchd does not expand `~` or `$HOME` in plists, so all repository, working-directory, sweeper-log, stdout-log, and stderr-log paths must be absolute and must be reviewed for the operator's machine.

1. Edit the template's absolute paths for the target machine while leaving its `--dry-run` argument in place.
2. Copy it to `~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist`.
3. Load the installed plist with `launchctl load ~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist`. Because `RunAtLoad` is false, it waits for the 600-second interval instead of firing at load.
4. Review the configured sweeper log plus `StandardOutPath` and `StandardErrorPath` across multiple intervals. Require the same clean review window: no `action=kill` selection for a live-serving context server.
5. Unload it with `launchctl unload ~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist`.
6. In the installed plist only, remove the single `<string>--dry-run</string>` argument. Do not automate this edit and do not remove `--dry-run` from the repository template.
7. Reload the installed plist with `launchctl load ~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist` to begin live interval sweeps.
8. Roll back by unloading the installed plist and restoring `<string>--dry-run</string>` before any reload.

<!-- /ANCHOR:staged-activation -->

---

<!-- ANCHOR:validation -->
## 5. VALIDATION

Run from the repository root:

```bash
bash -n .opencode/scripts/orphan-mcp-sweeper.sh
bash -n .opencode/scripts/session-cleanup.sh
plutil -lint .opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist
bash .opencode/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path /tmp/orphan-sweeper-review.log
```

Expected result: syntax checks pass, dry-run logs preserve and candidate decisions, and no PIDs or files are removed during dry-run.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 6. RELATED

- [Orphan MCP leak prevention implementation summary](../specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/implementation-summary.md)
- [Spec Kit MCP ENV reference](../skills/system-spec-kit/mcp_server/ENV_REFERENCE.md)
- [Spec Kit MCP runtime README](../skills/system-spec-kit/mcp_server/README.md)

<!-- /ANCHOR:related -->
