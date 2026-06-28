# Iteration 47: S6-08 Locking Decision

## Focus

S6-08 asked whether OUR loop systems should keep advisory file locking with a hardened heartbeat or adopt loop-cli-main's hard socket-bind single-flight guard, given the macOS/BSD advisory-lock limitation. Prior S3-01 and S3-02 already covered the mechanics; this pass synthesizes the cross-platform/host decision and blast radius for `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.

## Actions Taken

- Read the deep-research output contract and checked prior S3-01/S3-02 artifacts to avoid duplicating the raw heartbeat/socket findings.
- Re-read loop-cli-main's bind-before-init daemon path, lifecycle persistence path, socket cleanup path, and local IPC boundary.
- Re-read OUR current `loop-lock.ts`, `loop-lock.cjs`, deep-research/deep-review/ai-council lock calls, and loop-lock unit coverage.
- Synthesized the backlog order and blast radius for keeping the current lock contract versus adding host-local socket single-flight.

## Findings

1. Keep the durable file lock as the baseline and harden heartbeat ownership first.
   Reference mechanism: loop-cli-main treats liveness as lifecycle state: pause/wait transitions emit `paused` and `waiting` [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:248`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:266`], run execution emits state around `running` and `run:end` [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:333`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:451`], and the manager persists those events through one wiring point [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:263`].
   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.
   Recommendation: add a first-class owner-scoped heartbeat driver around the existing `refreshLoopLock` contract before changing admission semantics.
   Why it helps: the existing file lock is the only guard that follows the shared packet path across hosts; heartbeat hardening fixes false stale reclaim without introducing a daemon or host-local namespace.
   Port difficulty: easy.
   Tag: quick-win.

2. Add socket-bind as an optional same-host admission layer, not as a replacement lock.
   Reference mechanism: loop-cli-main binds `IpcServer.listen()` before state initialization [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:28`], and the daemon exits before `manager.init()` when bind fails [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/index.ts:24`]. This is a strong same-host startup race guard.
   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.
   Recommendation: expose the future guard as `hostLocalSingleFlight` or equivalent metadata on top of `acquireLoopLock`, with `guardKind`/`hostId` recorded so status output never implies multi-host fencing.
   Why it helps: it closes same-host double-start races earlier than reducer/state-log initialization while preserving the durable packet claim.
   Port difficulty: med.
   Tag: quick-win.

3. Do not make socket-bind the default until a resident workflow host or supervisor owns the handle.
   Reference mechanism: loop-cli-main's guard stays live because the daemon keeps the `net.Server` open until shutdown and only removes the socket during `close()` [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:39`]. OUR current adapter is a one-shot CLI: `loop-lock.cjs acquire` calls the library, prints JSON, and returns [TARGET: `.opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs:155`], while deep-research/deep-review/ai-council acquire by spawning that adapter [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:225`] [TARGET: `.opencode/commands/deep/assets/deep_review_confirm.yaml:225`] [TARGET: `.opencode/commands/deep/assets/deep_ai-council_confirm.yaml:87`].
   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.
   Recommendation: rank "socket as default" behind a host/supervisor design that can hold and release a process-resident lease for the full workflow lifetime.
   Why it helps: it avoids a false-hardening regression where the CLI opens a socket and drops it before the long-running loop actually executes.
   Port difficulty: hard.
   Tag: deep-rewrite.

4. Treat cross-host locking as explicitly unsolved by socket-bind.
   Reference mechanism: loop-cli-main scopes the daemon to a local machine/user: the architecture describes a POSIX Unix socket or Windows named pipe with no network listener or auth [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/ARCHITECTURE.md:393`], and the socket path is derived from local data-dir/user/platform state [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/config/paths.ts:63`].
   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.
   Recommendation: document and encode the distinction between `durablePacketLock` and `hostLocalSingleFlight`; if multi-host exclusion is required, design a separate shared lease/fencing mechanism.
   Why it helps: two machines sharing the same repo/spec folder can each bind their own local socket namespace; only the file-path lock currently expresses the shared packet claim.
   Port difficulty: med.
   Tag: quick-win.

5. If socket-bind is ported later, add stale-socket probing instead of copying unconditional unlink-before-bind.
   Reference mechanism: loop-cli-main removes the socket file before binding [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:29`], and `removeSocketFile()` unlinks on non-Windows platforms [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/state.ts:193`].
   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.
   Recommendation: a future socket layer should probe/connect first, then unlink only confirmed-stale socket paths.
   Why it helps: the reference cleanup is acceptable for its daemon lifecycle but too blunt for OUR shared packet tooling, where diagnostics and conservative recovery matter more than silent takeover.
   Port difficulty: med.
   Tag: quick-win.

## Questions Answered

- S6-08 decision: keep advisory file-locking as the baseline, harden heartbeat first, and add socket-bind only as an optional host-local guard.
- Cross-platform/host decision: socket-bind is useful on one host across POSIX sockets and Windows named pipes, but it does not solve multi-host contention on a shared packet.
- Blast radius: heartbeat hardening is mostly `loop-lock.ts` plus callers that own workflow lifetime; socket-as-default touches `loop-lock.ts`, `loop-lock.cjs`, deep-research/deep-review/ai-council/context command YAMLs, and tests because it requires a resident holder.

## Questions Remaining

- Which process should own the long-lived heartbeat/lease driver: command host, runtime wrapper, or per-packet supervisor?
- Should the lock schema grow `hostId`, `guardKind`, and `guardStrength` before the socket layer exists, or only with the first real host-local guard?
- If true multi-host exclusion is required, what shared lease backend is acceptable for local-first spec folders?

## Next Focus

S6-10: synthesize a unified telemetry/event schema that can report file-lock heartbeat, optional host-local guard state, fan-out ledger state, and council round-state in one dashboard-facing stream.
