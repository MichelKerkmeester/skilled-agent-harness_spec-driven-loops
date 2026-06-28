# Iteration 18: S3-02 Socket Guard Mapping

## Focus

S3-02 asked whether OUR `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` should add loop-cli-main's socket-bind-before-init pattern as a hard single-flight guard, given the deep-research YAML calls the current macOS/BSD lock advisory.

The answer is yes, but only as a host-local guard held by a long-lived workflow host. It should not replace the current durable file lock, and it cannot by itself solve multi-host packet contention.

## Actions Taken

- Read the deep-research quick/state-output contract and stayed within the provided research packet.
- Checked prior S3-01 and nearby S2-08 outputs to avoid duplicating heartbeat or JSONL merge findings.
- Source-mined loop-cli-main daemon startup, socket path selection, socket cleanup, and architecture notes.
- Mapped the mechanism onto OUR `loop-lock.ts`, `loop-lock.cjs`, and deep-research YAML acquire/release surfaces.

## Findings

1. Reference mechanism: loop-cli-main binds a local IPC server before initializing loop state. `IpcServer.listen()` calls `server.listen(socketPath)` and resolves only after bind success [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:28`]. The daemon entrypoint catches listen failure before `manager.init()`, logs that another daemon holds the socket, and exits cleanly [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/index.ts:24`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.
   Recommendation: add an optional local socket or named-pipe guard beside `acquireLoopLock`, not instead of the existing file lock. It should return a releaser/handle that stays alive for the workflow lifetime.
   Why it helps: it gives same-host deep-loop starts a kernel-enforced single-flight admission check before reducers and state logs initialize.
   Port difficulty: med.
   Tag: quick-win.

2. Reference mechanism: the socket guard is process-resident. loop-cli-main keeps the `net.Server` open until shutdown, then closes clients, closes the server, and removes the socket file [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:39`]. OUR current CLI adapter is a one-shot process: `loop-lock.cjs acquire` creates the lock record, prints JSON, and exits [TARGET: `.opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs:155`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.
   Recommendation: model socket binding as a long-lived lease API, not a property of the existing short-lived `acquire` subcommand. A socket opened inside today's `loop-lock.cjs acquire` would be released as soon as the helper process exits.
   Why it helps: prevents a false hardening where the CLI appears to bind a mutex but drops it before the research/review loop actually runs.
   Port difficulty: hard.
   Tag: deep-rewrite.

3. Reference mechanism: loop-cli-main scopes IPC to one local user/machine. The architecture says the daemon listens on a POSIX Unix-domain socket or Windows named pipe, with no network listener and no in-app auth [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/ARCHITECTURE.md:393`]. Its socket path is derived from the local data dir and username/platform namespace [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/config/paths.ts:63`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.
   Recommendation: treat socket-bind as `hostLocalSingleFlight`, and keep the file lock as the durable packet-level claim. Add host identity and guard kind to lock metadata before presenting the lock as stronger than advisory.
   Why it helps: two machines working on the same shared spec folder can each hold a different local socket namespace. A local socket guard stops same-host double starts, while metadata keeps status output honest that true multi-host fencing is a separate design.
   Port difficulty: med.
   Tag: quick-win.

4. Reference mechanism caveat: loop-cli-main removes the socket file immediately before binding [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:29`], and `removeSocketFile()` unlinks the path on non-Windows platforms [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/state.ts:193`]. The architecture documents the intended bind-before-init guard, but the cleanup step is not enough by itself to prove the prior socket was stale [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/ARCHITECTURE.md:194`].

   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.
   Recommendation: if porting socket-bind, add stale-socket probing before unlinking. Prefer connect/status probe plus PID/host metadata over unconditional remove-then-bind.
   Why it helps: avoids copying a cleanup pattern that can erase the pathname for a still-live local listener and make diagnostics worse.
   Port difficulty: med.
   Tag: quick-win.

## Questions Answered

- Should `loop-lock.ts` add socket-bind-before-init? Yes, as an optional local hard guard with a lifetime-bound handle. It should supplement the existing file lock and stale-reclaim contract.
- Should the current one-shot CLI acquire path own the socket bind? No. A socket guard must live in the workflow host process or a daemonized helper, otherwise it disappears after `loop-lock.cjs acquire` exits.
- What breaks on multi-host? Socket binding is host-local. It cannot serialize two machines writing the same shared spec packet, and the reference repo explicitly avoids network IPC/auth. Multi-host exclusion needs a separate shared lease/fencing design or must remain documented as unsupported/best-effort.

## Questions Remaining

- Which process should own the long-lived guard: the command workflow host, a runtime lock daemon, or a per-packet supervisor?
- Should the lock schema grow `hostId`, `guardKind`, and `socketPath` now, or wait until a host-held guard exists?
- Should deep-research/deep-review YAML keep calling `loop-lock.cjs` directly, or should it call a wrapper that can hold a lease while the rest of the workflow runs?

## Next Focus

S3-03: map the next process-management mechanism onto OUR runtime host layer, preferably the code-signature stale-daemon restart path or a host-owned lock supervisor decision.
