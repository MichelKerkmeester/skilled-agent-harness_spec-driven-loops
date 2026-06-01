---
title: "Orphan MCP Leak Prevention: Dry-Run Sweeper, Stop Hook Cleanup, Idle Self-Exit"
description: "Three-layer orphan MCP leak prevention shipped as reviewable automation. A dry-run process sweeper, a Claude Stop hook cleanup script, idle self-exit in all three MCP servers landed on main without activating system-level launchd rollout."
trigger_phrases:
  - "orphan mcp leak prevention"
  - "orphan mcp sweeper"
  - "claude session cleanup hook"
  - "mcp server idle self-exit"
  - "launcher idle timeout"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-24

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

Repeated orphan MCP helper stacks under Codex.app and stale Claude Code launcher children were accumulating gigabytes of RAM during normal workstation use. The only mitigation was an unsafe manual process sweep. This packet converted that manual cleanup into three layers of reviewable automation: a dry-run-first process sweeper, a session-scoped Claude Stop cleanup script chained into the existing hook, plus server-side idle self-exit in Spec Kit Memory, Skill Advisor, plus Code Graph MCP servers.

All three layers are versioned in the repo. LaunchAgent activation and home-level config changes remain separate operator decisions, so no `launchctl load` or home plist write occurred in this packet. A first dry-run exposed a Bash 3 plus `set -u` empty-array bug that suppressed preserve checks when no Claude session tree was present. The fix landed before final verification. Typechecks, targeted vitest suites, plus strict spec validation passed across all three MCP server packages.

### Added

- `.opencode/scripts/orphan-mcp-sweeper.sh`: dry-run-first stale MCP process and `/tmp` artifact sweeper with `--dry-run`, `--verbose`, `--log-path`, `ORPHAN_AGE_MIN_SEC` plus `ORPHAN_TMP_AGE_HOURS` flags
- `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist`: versioned LaunchAgent template (not installed or loaded) that runs the sweeper every 600 seconds
- `.opencode/scripts/claude-session-cleanup.sh`: session-scoped Claude Stop cleanup that walks only the current session's MCP descendants via `CLAUDE_SESSION_PID` or `PPID`
- `launcher-idle-timeout.ts` in Spec Kit Memory, Skill Advisor, plus Code Graph MCP servers: idle monitor with `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` defaulting to 30, accepting fractional test values, plus 0 to disable
- `ipc-socket-activity.vitest.ts` (Spec Kit MCP): 6 tests for IPC activity callback behavior
- Idle timeout vitest coverage in all three MCP server packages (13 total idle timeout tests)

### Changed

- `.claude/settings.local.json`: Claude Stop hook chains `claude-session-cleanup.sh` after the canonical `session-stop.js` command while preserving the single nested hook shape and original command exit status
- IPC socket servers in all three MCP packages: added `onActivity` callback support so secondary IPC connect, data, plus write events refresh the idle timer
- Spec Kit MCP `tsconfig` build config: now excludes `tests/fixtures/**/*.ts` so production composite build emits cleanly without fixture-only imports

### Fixed

- Bash 3 `set -u` empty-array bug in the sweeper suppressed preserve checks when no Claude session descendant tree existed. Fixed before final verification.
- Sequential-thinking wrapper and server processes were previously classified as a single MCP class. Separate classification now allows the wrapper-child pair to be preserved together.
- Spec Kit MCP production build failed because fixture sources were included in the TypeScript composite build. The build config exclusion resolved the failure.

### Verification

| Check | Result |
|-------|--------|
| `python3 -m json.tool .claude/settings.local.json` | PASS |
| `bash -n .opencode/scripts/orphan-mcp-sweeper.sh` | PASS |
| `bash -n .opencode/scripts/claude-session-cleanup.sh` | PASS |
| `plutil -lint .opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` | PASS (file deleted post-packet) |
| Sweeper dry-run (`--dry-run --verbose`) | PASS. Logged stale kill candidates and `/tmp` removals without mutation. `/tmp/codex-browser-use` and `/tmp/devin-*` preserved. Prior dry-run verified freshest-young-MCP preserve logging before processes aged past the 300-second threshold. |
| Spec Kit MCP idle and socket vitest (`launcher-idle-timeout.vitest.ts`, `ipc-socket-activity.vitest.ts`) | PASS. 2 files, 6 tests. |
| Skill Advisor idle and settings parity vitest (`launcher-idle-timeout.vitest.ts`, `settings-driven-invocation-parity.vitest.ts`) | PASS. 2 files, 45 tests. |
| Code Graph idle vitest (`launcher-idle-timeout.vitest.ts`) | PASS. 1 file, 5 tests. |
| Typechecks for `system-spec-kit/mcp_server`, `system-skill-advisor/mcp_server`, `system-code-graph` | PASS |
| Builds for `system-spec-kit`, `system-skill-advisor/mcp_server`, `system-code-graph` | PASS |
| `verify_alignment_drift.py` | PASS with 0 errors and 15 pre-existing warnings outside this packet's new files. |
| Strict spec validation for `022-orphan-mcp-leak-prevention` and `009-memory-leak-remediation` | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/scripts/orphan-mcp-sweeper.sh` (NEW) | Dry-run-first orphan MCP process sweeper with age thresholds, preserve rules, SIGTERM/SIGKILL escalation. |
| `.opencode/scripts/claude-session-cleanup.sh` (NEW) | Session-scoped MCP descendant cleanup chained into the Claude Stop hook. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/launcher-idle-timeout.ts` (NEW) | Idle monitor for Spec Kit Memory MCP server. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/launcher-idle-timeout.ts` (NEW) | Idle monitor for Skill Advisor MCP server. |
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/launcher-idle-timeout.ts` (NEW) | Idle monitor for Code Graph MCP server. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts` | Added `onActivity` callback for IPC event tracking. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts` | Added `onActivity` callback for IPC event tracking. |
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Added `onActivity` callback for IPC event tracking. |
| `.claude/settings.local.json` | Chained `claude-session-cleanup.sh` into the existing single nested Stop hook. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-idle-timeout.vitest.ts` (NEW) | Idle timeout tests for Spec Kit MCP. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/ipc-socket-activity.vitest.ts` (NEW) | IPC activity callback tests for Spec Kit MCP. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-idle-timeout.vitest.ts` (NEW) | Idle timeout tests for Skill Advisor MCP. |

### Follow-Ups

- Activate the LaunchAgent by copying the plist to `~/Library/LaunchAgents` and running `launchctl load` after an operator-approved review of the dry-run output.
- Exercise Claude Stop cleanup by ending a live Claude Code session to confirm the hook runs end-to-end beyond the schema parity check.
- Restore or regenerate the plist file (currently deleted from the repo) before attempting LaunchAgent activation.
- Monitor dry-run output timing: process age is time-sensitive, so a fresh dry-run run early in a long session will capture freshest-young-MCP preserve logging that a late-session run misses.
