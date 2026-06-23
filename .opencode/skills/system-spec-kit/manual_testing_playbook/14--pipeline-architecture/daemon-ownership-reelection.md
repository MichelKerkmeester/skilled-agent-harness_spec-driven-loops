---
title: "426 -- Daemon Ownership Reelection"
description: "Manual check for the default-on daemon-ownership reelection path: the launcher releases the shared daemon on owner disposal for a live secondary to keep, and a fresh session reaps the released daemon before respawn so the database keeps a single writer."
version: 3.6.0.4
---

# 426 -- Daemon Ownership Reelection

## 1. OVERVIEW

This scenario verifies the default-on daemon-ownership reelection path in the mk-spec-memory launcher. A disposing owner releases the shared daemon so a connected live secondary keeps its MCP transport instead of forcing a relaunch, and a fresh session started after the owner is gone reaps the released daemon before spawning a replacement so the database is never left with two writers.

The check is automated-test-backed. A human runs the launcher syntax check, the reelection unit suite, and the live two-session durability test, plus a grep that proves the flag resolver, the spawn-io selector, and the release predicate are defined and wired.

Reelection is default-on in the launcher code. Set `SPECKIT_DAEMON_REELECTION=0` (or `off`) to revert to the kill-on-disposal behavior.

## 2. SCENARIO CONTRACT

- Objective: Confirm daemon-ownership reelection is default-on, that a live secondary keeps transport across owner disposal, and that a fresh session after disposal reaps the released daemon so a single writer remains.
- Real user request: `If I close the session that owns the shared daemon, do my other live sessions keep working, and does reopening later avoid leaving two daemons on the database?`
- Prompt: `Validate the default-on daemon-ownership reelection path: release on disposal for a live secondary, and reap-before-respawn single writer for a fresh session.`
- Expected execution process: Run the launcher syntax check, run the reelection unit tests, run the live two-session adoption test, and grep for the flag resolver, the spawn-io selector, and the release predicate to confirm they are defined and wired.
- Expected signals: `node --check` exits cleanly for the launcher. `launcher-daemon-reelection.vitest.ts` passes. `daemon-reelection-adoption-live.vitest.ts` passes all three cases (live secondary survives flag-on, daemon dies flag-off, fresh session after disposal is the single writer). `daemonReelectionEnabled`, `shouldReleaseDaemonForReelection` and `contextServerSpawnIo` appear at their definitions and call sites.
- Desired user-visible outcome: Closing the owning session leaves other live sessions connected, and reopening later starts a single clean daemon.
- Pass/fail: PASS only when syntax, both test suites, and the default-on wiring all match expectations.

## 3. TEST EXECUTION

### Prompt

```text
Validate the default-on daemon-ownership reelection path: release on disposal for a live secondary, and reap-before-respawn single writer for a fresh session.
```

### Commands

1. `node --check .opencode/bin/mk-spec-memory-launcher.cjs`
2. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/launcher-daemon-reelection.vitest.ts`
3. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run --config vitest.stress.config.ts mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts`
4. `rg -n "daemonReelectionEnabled|shouldReleaseDaemonForReelection|contextServerSpawnIo" .opencode/bin/mk-spec-memory-launcher.cjs`

### Expected

- Command 1 exits with no syntax errors.
- Command 2 passes the reelection unit suite.
- Command 3 passes the live adoption test, including the fresh-session-after-disposal single-writer case.
- Command 4 shows `daemonReelectionEnabled`, `shouldReleaseDaemonForReelection`, and `contextServerSpawnIo` at their definitions and at the call sites that resolve the flag, select spawn io, and gate the release.

### Evidence

Shell transcript for all commands: the `node --check` exit status, the vitest pass summaries for both suites, and the grep output showing the flag resolver, the spawn-io selector, the release predicate, and the call sites that wire them together.

### Pass / Fail

- **Pass**: the syntax check passes, both test suites pass, the flag resolves on by default, and a fresh session after disposal leaves a single writer.
- **Fail**: the syntax check fails, either suite fails, the live single-writer case shows two daemons on the database, or the release predicate releases the daemon while reelection is off.

### Failure Triage

If the syntax check fails, inspect the helper placement and the CommonJS exports first. If the live single-writer case fails (two daemons on the database), confirm the stale-lease reclaim branch reaps the recorded child before respawn. If the live-secondary case fails, confirm `shouldReleaseDaemonForReelection` releases rather than kills when a live daemon is present. If grep cannot find the helpers, confirm the definitions and the flag, spawn-io, and release call sites all exist.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/14--pipeline-architecture/daemon-ownership-reelection.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Primary implementation anchor |
| `mcp_server/tests/launcher-daemon-reelection.vitest.ts` | Unit regression anchor |
| `mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Live two-session validation anchor |

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 426
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/daemon-ownership-reelection.md`
