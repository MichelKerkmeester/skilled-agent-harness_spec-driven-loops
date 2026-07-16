# Iteration 1: T2 — Why packet 012's daemon IPC bridge socket is not serving at runtime

## Focus
Validate/refute the strategy's reframed T2 hypothesis ("packet 012 built the daemon bridge, so why is it not serving at runtime?") and produce a ranked root-cause conclusion with `file:line` evidence and confidence. Classify into: (a) regression after 012, (b) conditional gate, (c) silent bind failure, (d) EADDRINUSE-unlink race under N-way concurrency. READ-ONLY; no `hf-embed.sock` contact; no code-graph scan.

## Actions Taken
1. Read packet 012 `implementation-summary.md` (build/smoke evidence, D-001 drift decision, known limitations).
2. Read the **running** code-index daemon source `system-code-graph/mcp_server/index.ts` AND its executed artifact `mcp_server/dist/index.js`; grepped both for `startIpcSocketServer` / gate flags.
3. Read code-index `mcp_server/lib/ipc/socket-server.ts` (the bind: `mkdir`, `listenOnce`, EADDRINUSE unlink+retry).
4. Read the **working reference** `system-spec-kit/mcp_server/context-server.ts:2155-2188` (spec-memory's bind call-site + ordering) and confirmed advisor running dist `dist/mcp_server/advisor-server.js:232` also calls the bind.
5. Safe runtime checks: `ls -la /tmp/mk-{code-index,skill-advisor,spec-memory}/`, `lsof` on the two non-hf sockets + the working spec-memory socket, `ps` for the three daemon pids, and `md5` drift across the three `socket-server.ts` copies.

## Findings (file:line evidence + confidence)

**F1 — The bind IS present, un-gated, and runs after `server.connect` in BOTH running dist artifacts. RULES OUT (a) regression-removed-bind and (b) conditional gate. [confidence: HIGH]**
- code-index running artifact `system-code-graph/mcp_server/dist/index.js:127` `ipcBridge = await startIpcSocketServer({...})`, inside the `try` after `await server.connect(transport)` (`dist/index.js:116`). Imported at `dist/index.js:22`.
- advisor running artifact `system-skill-advisor/mcp_server/dist/mcp_server/advisor-server.js:232` `ipcBridge = await startIpcSocketServer({...})`; import at `:18`.
- No `SPECKIT_LAUNCHER_BRIDGE_DISABLED` (or any) gate around the call in either dist (grep returned 0 hits for `LAUNCHER_BRIDGE_DISABLED`). Source matches dist: `index.ts:149` == `dist/index.js:127`, no source/dist drift on the bind logic itself.
- The launchers execute exactly these paths: `mk-code-index-launcher.cjs:770` runs `mcp_server/dist/index.js`; `mk-skill-advisor-launcher.cjs:426` runs `dist/mcp_server/advisor-server.js`. So the running code DOES contain and reach the bind.

**F2 — The socket INODES were created (file exists, mtime matches daemon start); the daemons are ALIVE; but NO process holds the socket FD. RULES OUT a pure crash-during-bind / silent ENOENT (c-strong). [confidence: HIGH]**
- `ls -la /tmp/mk-code-index/daemon-ipc.sock` and `/tmp/mk-skill-advisor/daemon-ipc.sock`: both `srw-------` mode `0o600`, **mtime Jun 4 18:35** — identical to `/tmp/mk-spec-memory/daemon-ipc.sock` (same 18:35 recycle). The `0o600` chmod only runs AFTER a successful `listenOnce` (`socket-server.ts:260-262`), so the bind reached "listening" at least once at 18:35.
- `lsof /tmp/mk-code-index/daemon-ipc.sock` → empty; `lsof /tmp/mk-skill-advisor/daemon-ipc.sock` → empty; `lsof /tmp/mk-spec-memory/daemon-ipc.sock` → pid **61626** holds 3 FDs (working).
- `ps`: code-index daemon **pid 60718** (`mcp_server/dist/index.js`) and advisor daemon **pid 61317** (`dist/mcp_server/advisor-server.js`) are BOTH alive, elapsed ~01:13 — same age as spec-memory 61626. The daemons did NOT exit. (This refines the strategy's "runtime bind-failure / regression of packet 012": the *process* is healthy; only the *listening socket* is gone.)

**F3 — The `close()` path UNLINKS the socket file, but `lstat` mtime would still read the original create time — so a transient bind→close cycle leaves a stale inode with an old mtime and no listener. This is the mechanism that matches F2. [confidence: MEDIUM-HIGH]**
- `socket-server.ts:282-291` `close()` calls `fs.unlinkSync(socketPath)`. After unlink, a *racing* re-create by another daemon instance, OR an orphaned inode, presents exactly as observed: file present, no `lsof` holder.
- The EADDRINUSE-unlink race the 012 spec flagged: `socket-server.ts:242-253` — on `EADDRINUSE`, if `canUnlinkExistingSocket()` (`:118-131`, owner-only) passes, it `fs.unlinkSync` the existing socket and re-`listenOnce`. Under N-way concurrency (2 Claude + 4 codex launchers, per strategy §12) a racing daemon can unlink the live owner's socket inode and bind its own, then later exit/close-unlink — leaving the original owner's `net.Server` bound to a now-unlinked inode (no `lsof` path match) while the file on disk is a different/absent inode.

**F4 — The structural asymmetry between the FAILING daemons and the WORKING spec-memory daemon is the idle-monitor + owner-lease teardown, NOT the bind call. [confidence: MEDIUM]**
- code-index `index.ts:139-154` calls, in order: `startOwnerLeaseRefreshTimer()` → `createLauncherIdleMonitor(...)` → `startIpcSocketServer(...)`. The owner-lease heartbeat (`:44-59`, ttl 60s, refresh 20s) keeps the lease "alive + heartbeating" (matches strategy §12 evidence: lease lastHeartbeat≈now) **independently of whether the bridge socket is held** — so a dead bridge looks like a healthy daemon to the lease layer.
- code-index has a self-exit on lease loss (`index.ts:49-51` → `shutdownCodeIndex` → `process.exit(0)`) and on idle (`:143-146`). `shutdownCodeIndex` (`:106-113`) closes (and unlinks) the bridge. spec-memory's `onIdle` is `fatalShutdown(...,0)` (`context-server.ts:2168`) but spec-memory survives because it has live stdin clients keeping `markActivity` fresh; the trio recycle at 18:35 + N-way secondary churn gives code-index/advisor more bridge open/close churn.
- Idle timeout default is 30 min (`launcher-idle-timeout.ts:3` `DEFAULT_IDLE_TIMEOUT_MIN = 30`); daemons are ~73 min old and did NOT exit, so stdin activity kept them alive — consistent with the *process* surviving while a *secondary* bridge connection's open/close (or a racing sibling) unlinked the socket.

**F5 — `socket-server.ts` has DRIFTED across the three copies (012 D-001 accepted-risk now realized). [confidence: HIGH]**
- `md5`: spec-memory `508d66be18ec445cb2a0f8c3e33269d3`, code-index `991b15c645309344d8eb4d0bed6fd9c9`, skill-advisor `b62f5bbb480f5454efe40949567ab4a9` — all three differ. mtimes: code-index `socket-server.ts` May 29 16:03, advisor Jun 3 07:15 — both edited AFTER 012's May 20 "verbatim copy". 012 `implementation-summary.md:166` (D-001) and `:238` (limitation 4) explicitly accepted this drift; it has materialized. The working copy and the failing copies are no longer identical, so per-copy bind/teardown behavior can legitimately differ.

**RULED OUT this iteration:**
- (a) "a later edit removed/broke the bind" — bind present in source AND running dist (F1).
- (b) conditional gate (`SPECKIT_LAUNCHER_BRIDGE_DISABLED`) — no gate around the call in either dist (F1).
- "daemon crashed/exited" framing — both daemons alive (F2/F4).
- Source/dist drift on the *bind* (un-rebuilt dist) — `index.ts:149` == `dist/index.js:127` (F1).

## Questions Answered
- **KQ3 (T2: why not serving at runtime?)** — Substantially answered: NOT a missing bind, NOT a gate, NOT an un-rebuilt dist, NOT a crashed process. The bind runs and creates the inode at startup; the listener is subsequently lost while the process stays alive — pointing to a bridge teardown / EADDRINUSE-unlink race under N-way concurrency (ranked below). The 012 "built it, ships green" claim is reconciled: 012 only ever verified single/primary + one-secondary binding (`implementation-summary.md` SC/smoke), never N-way steady-state survival.

## Ranked Root-Cause Conclusion (T2)
1. **(d) EADDRINUSE-unlink race / bridge-teardown under N-way concurrency [MEDIUM-HIGH].** A racing owner-eligible daemon unlinks the live socket and re-binds (`socket-server.ts:242-253`), and/or a secondary bridge `close()` unlinks (`:282-291`), leaving the surviving owner process bound to an orphaned inode with no on-disk `lsof` path. Matches F2 (file exists @18:35, process alive, no FD holder) better than any alternative. spec-memory escapes because its single long-lived stdio client churns the bridge less.
2. **(c-weak) Silent post-bind teardown via idle/lease shutdown of a transient sibling [LOW-MEDIUM].** A short-lived secondary daemon bound, then idle/lease-exit ran `shutdownCodeIndex`→bridge `close()`→unlink (`index.ts:106-113`, `socket-server.ts:282-291`), removing the inode the surviving primary still references.
3. **Contributing factor: socket-server.ts drift (F5)** — not a root cause alone, but it means the failing copies may have a teardown/unlink ordering the working copy lacks; must be diffed in iteration 2.

**Design-conformant fix DIRECTION (do NOT implement):** make socket-server bind/teardown N-way-safe — owner-fenced bind (refuse to unlink a socket whose holder is a live, lease-owning pid), and/or skip `unlink` in `close()` when `activeSocketPath`'s inode is no longer the one this server bound (guard against unlinking a re-created inode). Reconverge the three `socket-server.ts` copies (012 D-001 follow-up). This sits squarely in the 010/012 bridge design, not in the launchers.

## Questions Remaining
- Exact teardown path: diff the three `socket-server.ts` copies line-by-line (esp. `close()` unlink + EADDRINUSE handling) to confirm whether the failing copies unlink more aggressively than spec-memory's working copy.
- Confirm whether a secondary launcher actually races the bind (read `mk-code-index-launcher.cjs` / `mk-skill-advisor-launcher.cjs` bridge-attach vs spawn-primary decision and any owner-eligibility gate).
- Reconcile with 010-multi-client-stdio-socket-bridge and 007-skill-advisor-zombie-launcher-fix design intent (is N-way survival an explicit SC anywhere, or a known untested gap?).
- T1 still entirely unvalidated (probe = demand) — KQ1/KQ2.

## Next Focus
Iteration 2: confirm the T2 mechanism by (1) diffing the three `socket-server.ts` copies (working vs the two failing) for `close()`/EADDRINUSE/unlink divergence, and (2) reading the two launchers' bridge-attach-vs-spawn-primary logic to see whether a secondary races the primary's bound socket — then lock the ranked root cause and finalize the T2 design-conformance fix surface. If T2 converges, pivot to T1 validation (`model-server-supervision.cjs` probe→demand path) in iteration 3.
