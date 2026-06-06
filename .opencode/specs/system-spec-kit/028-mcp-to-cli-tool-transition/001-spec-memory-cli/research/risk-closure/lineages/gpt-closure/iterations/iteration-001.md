# Iteration 001 - Spawn, Lease, and Build Drift Closure

## Scope

Questions addressed: RQ1 and RQ3.

This pass traced the launcher and daemon lifecycle code rather than relitigating the architecture. The target question was whether simultaneous CLI auto-spawn, dead-socket takeover, orphan cleanup, and stale build activation still contain unknown risk.

## Evidence

### Triple-lock daemon ownership

- Owner lease acquisition is exclusive: `.opencode/bin/mk-spec-memory-launcher.cjs:298-312` writes the lease with `fs.openSync(..., "wx", 0o600)`.
- Stale lease reclaim re-reads the owner file after writing so two launchers racing a stale lease cannot both believe they own it: `.opencode/bin/mk-spec-memory-launcher.cjs:365-403`.
- Lease heartbeat also re-reads ownership and shuts the launcher down if ownership is lost: `.opencode/bin/mk-spec-memory-launcher.cjs:405-443`.
- Bootstrap lock acquisition is serialized by `mkdirSync(lockDir)`, with bounded waiting and stale-claim cleanup: `.opencode/bin/mk-spec-memory-launcher.cjs:1151-1194`.
- Dead-socket respawn holds bootstrap and respawn locks, rechecks owner/child liveness, reaps the recorded owner, then writes a new exclusive owner lease: `.opencode/bin/mk-spec-memory-launcher.cjs:671-752`.
- The main launch path performs owner lease acquisition before build and launch, writes the lease, then re-probes it before starting the server: `.opencode/bin/mk-spec-memory-launcher.cjs:1339-1407`.

Existing tests already cover the core race properties:

- Concurrent launchers produce one owner lease: `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts:287-311`.
- Dead-socket takeover reaps the recorded owner before relaunch: `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts:313-331`.
- Secondary launchers with divergent socket env bridge to the stored owner socket: `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts:461-497`.
- Recycle keeps the owner lease through graceful and SIGKILL recycle branches: `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-recycle-lease.vitest.ts:36-82`.

### Idle and orphan cleanup

- The launcher starts `context-server.js` in backend-only mode with `SPECKIT_BACKEND_ONLY=1`: `.opencode/bin/mk-spec-memory-launcher.cjs:1210-1218`.
- Backend-only mode does not attach stdio transport; it starts an idle monitor with `stdin: null` and the IPC bridge client count as the activity source: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2168-2182`.
- IPC socket startup marks activity: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2183-2192`.
- The default launcher idle timeout is 30 minutes, with `0` disabling it: `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/launcher-idle-timeout.ts:34-46`.
- Idle shutdown fires only after no primary stdio or secondary IPC clients remain active: `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/launcher-idle-timeout.ts:98-127`.
- Graceful launcher shutdown kills children and clears leases: `.opencode/bin/mk-spec-memory-launcher.cjs:1263-1305`.
- `fatalShutdown()` drains watchers, closes IPC bridge state, runs shutdown hooks, and exits: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1558-1635`.

Existing tests cover the monitor behavior:

- No-client timeout shuts down once: `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-idle-timeout.vitest.ts:24-40`.
- Active IPC clients keep the daemon alive: `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-idle-timeout.vitest.ts:42-60`.
- Timeout `0` disables shutdown: `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-idle-timeout.vitest.ts:62-77`.
- Primary stdio activity is still tracked: `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-idle-timeout.vitest.ts:79-100`.
- IPC connect/inbound/outbound activity marks launcher activity: `.opencode/skills/system-spec-kit/mcp_server/tests/ipc-socket-activity.vitest.ts:75-94`.

### Build and activation drift

- Current launcher artifact readiness checks only three built files and only checks existence: `.opencode/bin/mk-spec-memory-launcher.cjs:953-984`.
- Existing dist freshness tests cover `mcp_server/lib/**/*.ts` source/dist pairs: `.opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts:15-36` and `.opencode/skills/system-spec-kit/mcp_server/tests/dist-freshness.vitest.ts:80-110`.
- Those tests do not cover the future root CLI shim or a future `mcp_server/spec-memory-cli.ts` entrypoint unless explicitly added.

## Classification

RQ1 is terminal MITIGATED for the dual-stack scope. The launcher already has the required ownership, bootstrap, respawn, heartbeat, and idle-cleanup mechanisms. The remaining risk is not architectural; it is acceptance coverage for the new public CLI shim path.

RQ3 is terminal MITIGATED only if DD-001 is added. The current launcher build check is insufficient for the CLI path because existence-only readiness can activate stale compiled code.

## Required Delta Detail

D1 must add a dual simultaneous auto-spawn integration test for `.opencode/bin/spec-memory.cjs`. The test should launch two CLI shim invocations against the same temp root/socket with a missing or dead socket and assert one owner lease, one context-server child, one bridged/retryable secondary client, and no stale bootstrap/respawn locks. Include a divergent `SPECKIT_IPC_SOCKET_DIR` case.

D7 must add explicit CLI-spawn idle cleanup coverage. In backend-only mode with `stdin: null`, set a low `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN`, connect and disconnect one IPC client, advance timers, and assert the `fatalShutdown` path closes the IPC bridge and clears lease state. Also assert `0` disables idle shutdown and active clients suppress it.

DD-001 must make `.opencode/bin/spec-memory.cjs` or the compiled CLI entrypoint check source/dist freshness before delegating. Compare source inputs such as `mcp_server/spec-memory-cli.ts`, `tool-schemas.ts`, `schemas/tool-input-schemas.ts`, package metadata, and generated manifest sources against compiled outputs. If any source is newer than dist by more than a small mtime tolerance or a required dist file is missing, exit 69 with a stale-file list unless an explicit development override such as `SPECKIT_SPEC_MEMORY_CLI_ALLOW_STALE_DIST=1` is set.

## Convergence Delta

New information gained: high. RQ1 and RQ3 moved from risk-bearing mitigations to terminal classifications with exact acceptance deltas.

Remaining open: RQ2, RQ4, RQ5, RQ6, RQ7, RQ8.
