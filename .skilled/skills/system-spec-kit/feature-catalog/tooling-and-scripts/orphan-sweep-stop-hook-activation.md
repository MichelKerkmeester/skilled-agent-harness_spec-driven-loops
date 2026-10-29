---
title: "Orphan sweep stop-hook activation"
description: "The Stop hook's session-cleanup script no-ops without `CLAUDE_SESSION_PID`, because guessing from PPID is refused as a cross-session-kill risk."
trigger_phrases:
  - "orphan sweep stop-hook activation"
  - "session-cleanup no session pid branch"
  - "orphan-only MCP sweeper delegation"
  - "SPECKIT_STOP_HOOK_ORPHAN_SWEEP"
  - "stop hook reap ownerless daemon"
version: 1.6.1.0
---

# Orphan sweep stop-hook activation

## 1. OVERVIEW

The Stop hook runs `session-cleanup.sh`, which cleans up a session's descendants from `CLAUDE_SESSION_PID`. The harness never sets that variable, and guessing the session pid from PPID is deliberately refused because a wrong guess could kill another live session. So in practice the no-session-pid branch did nothing, and orphaned MCP daemons from prior sessions could pile up.

This feature gives that no-session-pid branch a safe job. When enabled, it delegates to `orphan-mcp-sweeper.sh`, which reaps processes that have already reparented away from their original owner rather than guessing at session membership, so it can never touch a live session. The sweep covers stale MCP helper processes, stale dispatch artifacts left in the temp directory, and temp-path orphans. A temp-path orphan is a process owned by the current user, parented by pid 1, not a zombie, at least `ORPHAN_TEMP_PROCESS_AGE_HOURS` old (6 by default), whose command line points into the user temp directory, `/tmp/claude-<uid>/` or a worktree scratch directory. A TCP listener does not preserve such a process, so a leftover fixture http server is a candidate too. The feature is off by default and supports a dry-run mode that logs candidate reaps without mutating, plus a live mode that actually reaps.

---

## 2. HOW IT WORKS

### No-session-pid branch as the trigger

`session-cleanup.sh` reads `CLAUDE_SESSION_PID`. When it is absent, the script refuses to guess the session pid from PPID because that risks a cross-session kill, so it has no descendants to clean. That refusal branch is the safe entry point for the orphan sweep, which works on ownership rather than on a guessed session identity.

### Mode-gated delegation

`SPECKIT_STOP_HOOK_ORPHAN_SWEEP` controls the branch and defaults to off, preserving the original no-op behavior. A dry-run mode logs candidate reaps without mutating anything, and a live mode performs the reap. When a non-off mode is set, the branch invokes the sweeper rather than returning early.

### Orphan-only sweeper

The branch delegates to `orphan-mcp-sweeper.sh`, which reaps ownerless processes that have reparented away from their original owner. That class is wider than MCP daemons, because an opted-in live Stop-hook sweep also collects a leftover browser, http server or node fixture that has run from a temp or scratch root for six hours or more. Because the sweeper never targets a process that still belongs to a live session, the delegation cannot kill an active sibling, which is the exact safety property the PPID-guess refusal was protecting. The shared skill-advisor launcher is always preserved, since it retires itself on its own idle timeout.

### Test-overridable sweeper path

`SPECKIT_ORPHAN_SWEEPER_BIN` overrides the sweeper binary path, defaulting to the sibling `orphan-mcp-sweeper.sh` next to the hook script. Tests point it at a stub so they can assert the delegation and the mode gating without reaping real processes.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/scripts/session-cleanup.sh` | Script | Reads `CLAUDE_SESSION_PID`, refuses PPID guessing and in the no-session-pid branch delegates to the orphan sweeper based on `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` (off / dry-run / live) with the path override `SPECKIT_ORPHAN_SWEEPER_BIN` |
| `.skilled/scripts/orphan-mcp-sweeper.sh` | Script | Reaps ownerless reparented processes (stale MCP helpers and temp-path orphans) and stale temp dispatch artifacts, supporting a dry-run mode that logs candidates without mutating |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `runtime/tests/launcher-stop-hook-orphan-sweep.vitest.ts` | Automated test | Unit-tests the default-off no-op, dry-run and live mode gating, delegation to the orphan-only sweeper and the test-override sweeper path |

---

## 4. SOURCE METADATA
- Group: Tooling and Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/orphan-sweep-stop-hook-activation.md`
Related references:
- [orphan-mcp-sweeper-and-launchagent-template.md](../../feature-catalog/tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md) — Orphan MCP sweeper and LaunchAgent template
