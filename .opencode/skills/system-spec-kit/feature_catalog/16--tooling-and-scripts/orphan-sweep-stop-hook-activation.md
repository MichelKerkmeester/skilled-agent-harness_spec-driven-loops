---
title: "Orphan sweep stop-hook activation"
description: "The Stop hook's session-cleanup script no-ops when CLAUDE_SESSION_PID is absent because guessing from PPID is refused as a cross-session-kill risk. When enabled, its no-session-pid branch delegates to the orphan-only MCP sweeper, which reaps only ownerless reparented daemons and so can never touch a live session. Default off, with dry-run and live modes."
trigger_phrases:
  - "orphan sweep stop-hook activation"
  - "session-cleanup no session pid branch"
  - "orphan-only MCP sweeper delegation"
  - "SPECKIT_STOP_HOOK_ORPHAN_SWEEP"
  - "stop hook reap ownerless daemon"
version: 3.6.0.2
---

# Orphan sweep stop-hook activation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The Stop hook runs `session-cleanup.sh`, which cleans up a session's descendants from `CLAUDE_SESSION_PID`. The harness never sets that variable, and guessing the session pid from PPID is deliberately refused because a wrong guess could kill another live session. So in practice the no-session-pid branch did nothing, and orphaned MCP daemons from prior sessions could pile up.

This feature gives that no-session-pid branch a safe job. When enabled, it delegates to the orphan-only `orphan-mcp-sweeper.sh`, which reaps only ownerless MCP daemons that have already reparented away from their original owner. Because it targets only reparented orphans rather than guessing at session membership, it can never touch a live session. The feature is off by default and supports a dry-run mode that logs candidate reaps without mutating, plus a live mode that actually reaps.

## 2. HOW IT WORKS

### No-session-pid branch as the trigger

`session-cleanup.sh` reads `CLAUDE_SESSION_PID`. When it is absent, the script refuses to guess the session pid from PPID because that risks a cross-session kill, so it has no descendants to clean. That refusal branch is the safe entry point for the orphan sweep, which works on ownership rather than on a guessed session identity.

### Mode-gated delegation

`SPECKIT_STOP_HOOK_ORPHAN_SWEEP` controls the branch and defaults to off, preserving the original no-op behavior. A dry-run mode logs candidate reaps without mutating anything, and a live mode performs the reap. When a non-off mode is set, the branch invokes the sweeper rather than returning early.

### Orphan-only sweeper

The branch delegates to `orphan-mcp-sweeper.sh`, which reaps only ownerless MCP processes that have reparented. Because it never targets a process that still belongs to a live session, the delegation cannot kill an active sibling, which is the exact safety property the PPID-guess refusal was protecting.

### Test-overridable sweeper path

`SPECKIT_ORPHAN_SWEEPER_BIN` overrides the sweeper binary path, defaulting to the sibling `orphan-mcp-sweeper.sh` next to the hook script. Tests point it at a stub so they can assert the delegation and the mode gating without reaping real processes.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/scripts/session-cleanup.sh` | Script | Reads `CLAUDE_SESSION_PID`, refuses PPID guessing and in the no-session-pid branch delegates to the orphan sweeper based on `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` (off / dry-run / live) with the path override `SPECKIT_ORPHAN_SWEEPER_BIN` |
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Script | Reaps only ownerless reparented MCP daemons, supporting a dry-run mode that logs candidates without mutating |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts` | Automated test | Unit-tests the default-off no-op, dry-run and live mode gating, delegation to the orphan-only sweeper and the test-override sweeper path |

## 4. SOURCE METADATA
- Group: Tooling and Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/orphan-sweep-stop-hook-activation.md`
Related references:
- [orphan-mcp-sweeper-and-launchagent-template.md](orphan-mcp-sweeper-and-launchagent-template.md) — Orphan MCP sweeper and LaunchAgent template
