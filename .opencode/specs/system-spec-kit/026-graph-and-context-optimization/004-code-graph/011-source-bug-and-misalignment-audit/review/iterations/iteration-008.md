### DR-008-01 [P1] [security] `/tmp` IPC directory is trusted without owner/mode hardening

file: `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:170`

evidence:

```ts
170:   if (!socketPath.startsWith('tcp://')) {
171:     fs.mkdirSync(path.dirname(socketPath), { recursive: true, mode: 0o700 });
172:   }
```

```ts
118: function canUnlinkExistingSocket(socketPath: string): boolean {
119:   const parent = fs.realpathSync.native(path.dirname(socketPath));
120:   if (!isWithinAllowedSocketRoot(parent)) {
121:     return false;
122:   }
```

```ts
123:   const stat = fs.lstatSync(socketPath);
124:   if (!stat.isSocket()) {
125:     return false;
126:   }
127:   if (typeof process.getuid === 'function' && stat.uid !== process.getuid()) {
128:     return false;
```

```json
68:       "environment": {
69:         "SPECKIT_IPC_SOCKET_DIR": "/tmp/mk-code-index",
70:         "_NOTE_1_DB": "Database lives SKILL-LOCAL at .opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite by default (shared across runtimes via the .opencode/skills symlink); SPECKIT_CODE_GRAPH_DB_DIR overrides. Former shared location (.opencode/.spec-kit/code-graph/database/) is migrated back on first launcher startup.",
```

why: The committed launcher config binds the IPC bridge under `/tmp/mk-code-index`. `mkdirSync(..., { mode: 0o700 })` only applies when the directory is created; if that directory already exists, the server does not verify that the parent directory is owned by the current uid or not group/world-writable. The later hardening checks only the existing socket file, not the directory that controls unlink/rename of `daemon-ipc.sock`. A local same-host attacker who pre-creates or can write that directory can race or replace the socket entry, extending DR-003-01's spoofed-socket risk from the bridge client path into the daemon bind path.

fix: After resolving the socket directory, `stat` the directory and require current-user ownership plus non-group/world-writable mode before binding or unlinking. If the directory exists but is unsafe, refuse with a clear diagnostic or create a per-user private subdirectory under the system temp root.

confidence: 0.88

### DR-008-02 [P1] [security] Bootstrap lock reclaim can delete a live successor lock

file: `.opencode/bin/mk-code-index-launcher.cjs:659`

evidence:

```js
659: async function acquireBootstrapLock(options = {}) {
660:   const requireLock = options.requireLock === true;
661:   fs.mkdirSync(dbDir, { recursive: true });
662:   const deadline = Date.now() + 120000;
663:   const STALE_LOCK_MS = 5 * 60 * 1000; // 5 minutes — covers SIGKILL'd prior launchers
```

```js
679:         const lockStat = fs.statSync(lockDir);
680:         if (Date.now() - lockStat.mtimeMs > STALE_LOCK_MS) {
681:           process.stderr.write(
682:             `[mk-code-index-launcher] stale bootstrap lock (mtime ${Math.round((Date.now() - lockStat.mtimeMs) / 1000)}s old); reclaiming ${rel(lockDir)}\n`
683:           );
684:           fs.rmSync(lockDir, { recursive: true, force: true });
```

```js
861:   } finally {
862:     if (lockHeld) {
863:       fs.rmSync(lockDir, { recursive: true, force: true });
864:     }
865:   }
```

why: The bootstrap lock is just a directory path plus an mtime heuristic. It has no owner token, no heartbeat, and both stale reclaim and final release remove `lockDir` by pathname. If a slow bootstrap/build legitimately runs longer than `STALE_LOCK_MS`, another launcher can remove the live directory and acquire a successor lock. When the original holder later reaches `finally`, it still has `lockHeld=true` and removes the successor's lock directory. That creates the same unlink-of-successor class as DR-002-03, but in the launcher bootstrap lock rather than the owner-lease mutation lock.

fix: Store a unique token/PID inside the bootstrap lock directory, refresh it or the directory mtime while long bootstrap work is active, and only reclaim/release when the on-disk token still matches the lock instance being classified. Alternatively switch to an exclusive lockfile descriptor and avoid recursive pathname deletion for release.

confidence: 0.84

### DR-008-03 [P1] [security] Launcher owner-lease cleanup repeats the unlocked read-then-unlink race

file: `.opencode/bin/mk-code-index-launcher.cjs:390`

evidence:

```js
390: function clearOwnerLeaseFile() {
391:   if (!Number.isInteger(ownerLeasePid)) return;
392:   try {
393:     const lease = readOwnerLeaseFile();
394:     if (lease && lease.ownerPid === ownerLeasePid) fs.unlinkSync(ownerLeasePath());
```

```js
402: function clearOwnerLeaseFileIfOwner(ownerPid) {
403:   try {
404:     const lease = readOwnerLeaseFile();
405:     if (lease && lease.ownerPid === ownerPid) fs.unlinkSync(ownerLeasePath());
406:   } catch {
```

```js
512:     clearOwnerLeaseFileIfOwner(ownerPid);
513:     const lease = buildOwnerLease(process.pid);
514:     if (!writeOwnerLeaseFileExclusive(lease)) {
515:       const holder = readOwnerLeaseFile();
```

why: DR-001-03 already identified this race in the TypeScript `releaseOwnerLease()` path, but the launcher has separate cleanup helpers with the same unlocked read-then-unlink pattern. A stale owner can read a lease that matches its PID, another launcher can reclaim and write a successor lease, and the stale cleanup can then unlink the successor by pathname. The respawn path also calls `clearOwnerLeaseFileIfOwner()` immediately before trying to create a replacement lease, so a race here can temporarily remove the active owner guard and allow split-brain launcher ownership.

fix: Delete the duplicate launcher owner-lease implementation or route cleanup through the same mutation-lock and full-identity compare used by the hardened TypeScript acquire/refresh path. At minimum, hold the owner-lease mutation lock, re-read under the lock, and unlink only if the full lease identity still matches the lease observed before cleanup.

confidence: 0.86

### DR-008-04 [P2] [security] Idle shutdown failure permanently disables the watchdog

file: `.opencode/skills/system-code-graph/mcp_server/lib/ipc/launcher-idle-timeout.ts:106`

evidence:

```ts
106:     stopped = true;
107:     removeDataListener(stdin, markActivity);
108:     if (timer !== null) {
109:       clearIntervalFn(timer);
110:     }
```

```ts
112:     try {
113:       await options.onIdle();
114:     } catch (error: unknown) {
115:       const message = error instanceof Error ? error.message : String(error);
116:       log(`[${options.serviceName}] launcher idle shutdown failed: ${message}`);
```

```ts
143:     onIdle: async () => {
144:       await shutdownCodeIndex('launcher idle timeout');
145:       process.exit(0);
146:     },
```

```ts
310: export function closeDbWithAssertion(): void {
311:   const handle = db;
312:   closeDb();
313:   assertDbHandleClosed(handle);
314: }
```

why: On the idle path, the monitor marks itself stopped and clears its timer before awaiting `onIdle()`. If `shutdownCodeIndex()` throws before `process.exit(0)` runs, for example from the close assertion path, the monitor catches and logs the failure but does not retry, restart the timer, or force a non-zero exit. The daemon can remain alive after a failed idle shutdown with the watchdog disabled, leaking the launcher-managed process and its IPC socket until an external signal arrives.

fix: Treat idle shutdown as terminal. Either call `process.exit(1)` from a `finally` in the `onIdle` closure, or have the monitor invoke a fatal fallback when `onIdle()` rejects instead of swallowing the failure after disabling itself.

confidence: 0.81

newFindings: 4, dimension: security
