---
title: "432 -- Tri-Daemon Spawn Drill (028 Program Gate)"
description: "Manual invocation of the env-gated tri-daemon spawn drill: all three CLI launchers auto-spawning simultaneously in one sandbox, verifying per-launcher single-owner leases, respawn-lock serialization, divergent SIGTERM reap, and zero orphans."
version: 3.6.0.1
---

# 432 -- Tri-Daemon Spawn Drill (028 Program Gate)

## 1. OVERVIEW

This scenario runs the 028 program gate: a drill that spawns all three CLI-backed launchers (spec-memory, code-index, skill-advisor) simultaneously in a single sandboxed root and verifies their lease/reap behavior under concurrent auto-spawn. Reap diverges by launcher — spec-memory transparent-recycles its daemon child on SIGTERM while code-index and skill-advisor launchers exit — so the drill pins `SPECKIT_DAEMON_REELECTION` and asserts per-launcher single-owner leases, respawn-lock serialization, divergent SIGTERM reap, and zero orphaned processes at teardown.

The drill is env-gated and skipped by default: it only executes under `SPECKIT_RUN_TRI_DAEMON_DRILL=1`. It exercises the three REAL launchers with stub CLI children by design — proving lease ownership and serialization under concurrent auto-spawn, not the full CLI binaries end-to-end. The drill sandbox re-roots to /tmp and stubs spec-memory boot artifacts, so host daemons stay untouched.

## 2. SCENARIO CONTRACT

- Objective: Confirm the env-gated tri-daemon drill passes: three real launchers under concurrent auto-spawn with single-owner leases, serialized respawn locks, divergent SIGTERM reap, and zero orphans.
- Real user request: `If a session boots all three CLI fallbacks at once, do the three launchers fight over leases or leak daemons?`
- Prompt: `Run the env-gated tri-daemon spawn drill and report lease ownership, respawn-lock serialization, SIGTERM reap divergence, and orphan count.`
- Expected execution process: Run the drill vitest with `SPECKIT_RUN_TRI_DAEMON_DRILL=1`; without the env it must report skipped.
- Expected signals: Drill suite passes 1/1; without the gate env the describe block is skipped.
- Desired user-visible outcome: Concurrent tri-CLI auto-spawn is safe — no cross-daemon deadlock, no duplicate owners, no orphans.
- Pass/fail: PASS only when the gated run is green and the ungated run skips.

## 3. TEST EXECUTION

### Prompt

```text
Run the env-gated tri-daemon spawn drill and report lease ownership, respawn-lock serialization, SIGTERM reap divergence, and orphan count.
```

### Commands

```bash
# Gated run (the drill)
(cd .opencode/skills/system-skill-advisor/mcp_server && SPECKIT_RUN_TRI_DAEMON_DRILL=1 npx vitest run tests/tri-daemon-drill.vitest.ts)

# Ungated control: must skip, not run
(cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest run tests/tri-daemon-drill.vitest.ts)
```

### Expected

- The gated run passes (per-launcher single-owner, respawn-lock serialization, divergent SIGTERM reap — spec-memory recycles, code-index and skill-advisor exit — and zero orphans).
- The ungated run reports the drill describe block as skipped.

### Evidence

Gated run command:

```bash
(cd .opencode/skills/system-skill-advisor/mcp_server && SPECKIT_RUN_TRI_DAEMON_DRILL=1 npx vitest run tests/tri-daemon-drill.vitest.ts)
```

Observed output:

```text
 RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server

 ❯ tests/tri-daemon-drill.vitest.ts (1 test | 1 failed) 297ms
     × spawns all three CLI shims with isolated owners and divergent SIGTERM behavior 296ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/tri-daemon-drill.vitest.ts > tri-daemon-drill program gate > spawns all three CLI shims with isolated owners and divergent SIGTERM behavior
AssertionError: expected [ 1, 1, 1 ] to deeply equal [ +0, +0, +0 ]

- Expected
+ Received

  [
-   0,
-   0,
-   0,
+   1,
+   1,
+   1,
  ]

 ❯ tests/tri-daemon-drill.vitest.ts:385:44
    383|       waitForRun(advisorRun, 5000),
    384|     ]);
    385|     expect(exits.map((exit) => exit.code)).toEqual([0, 0, 0]);
       |                                            ^
    386|     await waitFor(() => existsSync(specOwnerLeasePath(sandbox)), 5000,…
    387|     await waitFor(() => existsSync(codeOwnerLeasePath(sandbox)), 5000,…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  15:40:00
   Duration  491ms (transform 56ms, setup 40ms, import 33ms, tests 297ms, environment 0ms)
```

Ungated control command:

```bash
(cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest run tests/tri-daemon-drill.vitest.ts)
```

Observed output:

```text
 RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server


 Test Files  1 skipped (1)
      Tests  1 skipped (1)
   Start at  15:40:14
   Duration  100ms (transform 25ms, setup 13ms, import 21ms, tests 0ms, environment 0ms)
```

### Pass / Fail

- **Fail**: gated run failed at `tests/tri-daemon-drill.vitest.ts:385:44` with `AssertionError: expected [ 1, 1, 1 ] to deeply equal [ +0, +0, +0 ]`; ungated run skipped as expected.

### Failure Triage

A duplicate-owner failure points at respawn-lock serialization in the affected launcher. A reap-divergence failure means a launcher's SIGTERM behavior changed (spec-memory must transparent-recycle; the other two must exit). Orphans at teardown indicate a launcher left its child unreaped — cross-check scenario 423 (lease-probe retry reap hardening) and scenario 426 (daemon ownership re-election).

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md` | Feature-catalog source for the CLI program surface |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/tri-daemon-drill.vitest.ts` | Env-gated drill (program gate), `SPECKIT_RUN_TRI_DAEMON_DRILL=1` |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Launcher with transparent-recycle SIGTERM reap |
| `.opencode/bin/mk-code-index-launcher.cjs` | Launcher that exits on child SIGTERM |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Launcher that exits on child SIGTERM |

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 432
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline_architecture/tri_daemon_spawn_drill.md`
