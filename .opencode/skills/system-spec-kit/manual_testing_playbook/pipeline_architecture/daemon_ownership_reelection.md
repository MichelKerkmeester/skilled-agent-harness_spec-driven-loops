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

Shell transcript for all commands:

Command 1:

```sh
$ node --check .opencode/bin/mk-spec-memory-launcher.cjs
```

Observed output: no stdout/stderr. Exit status: 0.

Command 2:

```sh
$ cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/launcher-daemon-reelection.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  14:23:45
   Duration  113ms (transform 17ms, setup 16ms, import 14ms, tests 2ms, environment 0ms)
```

Exit status: 0.

Command 3:

```sh
$ cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run --config vitest.stress.config.ts mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  14:23:45
   Duration  43.88s (transform 32ms, setup 20ms, import 22ms, tests 43.74s, environment 0ms)
```

Exit status: 0.

Command 4:

```sh
$ rg -n "daemonReelectionEnabled|shouldReleaseDaemonForReelection|contextServerSpawnIo" .opencode/bin/mk-spec-memory-launcher.cjs
206:function daemonReelectionEnabled(env = process.env) {
209:function contextServerSpawnIo(reelectionEnabled) {
214:function shouldReleaseDaemonForReelection({ enabled, hasLiveDaemon } = {}) {
1386:  const reelectionEnabled = daemonReelectionEnabled();
1387:  const spawnIo = contextServerSpawnIo(reelectionEnabled);
1527:  if (shouldReleaseDaemonForReelection({ enabled: daemonReelectionEnabled(), hasLiveDaemon: isChildRunning(childProcess) })) {
1837:  contextServerSpawnIo,
1839:  daemonReelectionEnabled,
1868:  shouldReleaseDaemonForReelection,
```

Exit status: 0.

### Pass / Fail

- **PASS**: the syntax check exited 0 with no output, both vitest suites passed, and grep showed the flag resolver, spawn-io selector, release predicate, and their call/export sites.

### Failure Triage

If the syntax check fails, inspect the helper placement and the CommonJS exports first. If the live single-writer case fails (two daemons on the database), confirm the stale-lease reclaim branch reaps the recorded child before respawn. If the live-secondary case fails, confirm `shouldReleaseDaemonForReelection` releases rather than kills when a live daemon is present. If grep cannot find the helpers, confirm the definitions and the flag, spawn-io, and release call sites all exist.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/pipeline_architecture/daemon_ownership_reelection.md` | Feature-catalog source describing the implementation contract |

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
- Feature file path: `pipeline_architecture/daemon_ownership_reelection.md`
